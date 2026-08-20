<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AskVerificationAssistantRequest;
use App\Support\VerificationValidationCatalog;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Client\Response;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use RuntimeException;
use Throwable;

class VerificationAssistantController extends Controller
{
    /**
     * Sensitive form attributes that must never be sent to OpenAI.
     */
    private const SENSITIVE_CONTEXT_KEYS = [
        'tax_id',
        'signatory_id_number',
    ];

    /**
     * Handle a question submitted to Clarity Assistant.
     */
    public function __invoke(
        AskVerificationAssistantRequest $request
    ): JsonResponse {
        $validated = $request->validated();
        $traceId = (string) Str::uuid();
        $startedAt = microtime(true);

        $apiKey = config('openai.api_key');
        $model = config('openai.model');

        if (! is_string($apiKey) || trim($apiKey) === '') {
            Log::error('Clarity Assistant OpenAI key is not configured', [
                'trace_id' => $traceId,
            ]);

            return response()->json([
                'message' => 'The assistant is not configured.',
                'trace_id' => $traceId,
            ], 503);
        }

        if (! is_string($model) || trim($model) === '') {
            Log::error('Clarity Assistant OpenAI model is not configured', [
                'trace_id' => $traceId,
            ]);

            return response()->json([
                'message' => 'The assistant model is not configured.',
                'trace_id' => $traceId,
            ], 503);
        }

        try {
            $instructions = $this->loadInstructions();
            $input = $this->buildInput($validated);
        } catch (Throwable $exception) {
            Log::error('Unable to prepare Clarity Assistant request', [
                'trace_id' => $traceId,
                'exception' => $exception::class,
                'message' => $exception->getMessage(),
            ]);

            return response()->json([
                'message' => app()->isLocal()
                    ? $exception->getMessage()
                    : 'The assistant is not configured correctly.',
                'trace_id' => $traceId,
            ], 503);
        }

        Log::info('Clarity Assistant request received', [
            'trace_id' => $traceId,
            'user_id' => $request->user()?->getAuthIdentifier(),
            'current_step' => $validated['current_step'],
            'question_length' => mb_strlen($validated['question']),
            'conversation_messages' => count(
                $validated['conversation'] ?? []
            ),
            'model' => $model,
        ]);

        try {
            $response = Http::withToken($apiKey)
                ->withHeaders([
                    'X-Client-Request-Id' => $traceId,
                ])
                ->acceptJson()
                ->asJson()
                ->timeout(60)
                ->connectTimeout(10)
                ->retry(2, 300, throw: false)
                ->post('https://api.openai.com/v1/responses', [
                    'model' => $model,
                    'instructions' => $instructions,
                    'input' => $input,
                    'max_output_tokens' => 500,
                    'store' => false,
                ]);
        } catch (ConnectionException $exception) {
            Log::error('Unable to connect to OpenAI', [
                'trace_id' => $traceId,
                'exception' => $exception::class,
                'message' => $exception->getMessage(),
                'duration_ms' => $this->durationInMilliseconds($startedAt),
            ]);

            return response()->json([
                'message' => app()->isLocal()
                    ? 'OpenAI connection failed: ' . $exception->getMessage()
                    : 'The assistant could not be reached. Please try again.',
                'trace_id' => $traceId,
            ], 503);
        }

        if ($response->failed()) {
            return $this->failedOpenAiResponse(
                $response,
                $traceId,
                $startedAt
            );
        }

        $answer = $this->extractAnswer($response);

        if ($answer === null) {
            Log::error('OpenAI returned no assistant answer', [
                'trace_id' => $traceId,
                'openai_request_id' => $response->header('x-request-id'),
                'response_id' => $response->json('id'),
                'response_status' => $response->json('status'),
                'incomplete_details' => $response->json('incomplete_details'),
                'duration_ms' => $this->durationInMilliseconds($startedAt),
            ]);

            return response()->json([
                'message' => 'The assistant returned no answer.',
                'trace_id' => $traceId,
            ], 502);
        }

        Log::info('Clarity Assistant response completed', [
            'trace_id' => $traceId,
            'openai_request_id' => $response->header('x-request-id'),
            'response_id' => $response->json('id'),
            'model' => $response->json('model'),
            'input_tokens' => $response->json('usage.input_tokens'),
            'output_tokens' => $response->json('usage.output_tokens'),
            'total_tokens' => $response->json('usage.total_tokens'),
            'processing_ms' => $response->header('openai-processing-ms'),
            'duration_ms' => $this->durationInMilliseconds($startedAt),
        ]);

        return response()->json([
            'answer' => $answer,
            'trace_id' => $traceId,
        ]);
    }

    /**
     * Load the editable prompt stored outside the public directory.
     */
    private function loadInstructions(): string
    {
        $promptPath = storage_path(
            'app/public/prompts/clarity-assistant.txt'
        );

        if (! File::exists($promptPath)) {
            throw new RuntimeException(
                "Clarity Assistant prompt file was not found: {$promptPath}"
            );
        }

        if (! File::isReadable($promptPath)) {
            throw new RuntimeException(
                "Clarity Assistant prompt file is not readable: {$promptPath}"
            );
        }

        $template = trim(File::get($promptPath));

        if ($template === '') {
            throw new RuntimeException(
                'Clarity Assistant prompt file is empty.'
            );
        }

        $validationCatalog = json_encode(
            VerificationValidationCatalog::assistantContext(),
            JSON_PRETTY_PRINT
                | JSON_UNESCAPED_SLASHES
                | JSON_UNESCAPED_UNICODE
                | JSON_THROW_ON_ERROR
        );

        if (str_contains($template, '{{VALIDATION_CATALOG}}')) {
            return str_replace(
                '{{VALIDATION_CATALOG}}',
                $validationCatalog,
                $template
            );
        }

        return $template
            . "\n\nValidation catalog:\n"
            . $validationCatalog;
    }

    /**
     * Build the conversation and current user input for the Responses API.
     */
    private function buildInput(array $validated): array
    {
        $conversation = collect($validated['conversation'] ?? [])
            ->take(-8)
            ->map(static fn(array $message): array => [
                'role' => $message['role'],
                'content' => mb_substr($message['content'], 0, 2000),
            ])
            ->values()
            ->all();

        $safeContext = Arr::except(
            $validated['form_context'] ?? [],
            self::SENSITIVE_CONTEXT_KEYS
        );

        $contextJson = json_encode(
            $safeContext,
            JSON_UNESCAPED_SLASHES
                | JSON_UNESCAPED_UNICODE
                | JSON_THROW_ON_ERROR
        );

        $conversation[] = [
            'role' => 'user',
            'content' => implode("\n\n", [
                'Current verification step: ' . (int) $validated['current_step'],
                'Current form snapshot (may be incomplete): ' . $contextJson,
                'User question: ' . $validated['question'],
            ]),
        ];

        return $conversation;
    }

    /**
     * Extract all output_text blocks from the OpenAI response.
     */
    private function extractAnswer(Response $response): ?string
    {
        $answer = collect($response->json('output', []))
            ->filter(
                static fn($item): bool => is_array($item)
                    && ($item['type'] ?? null) === 'message'
            )
            ->flatMap(
                static fn(array $item): array => is_array(
                    $item['content'] ?? null
                ) ? $item['content'] : []
            )
            ->filter(
                static fn($content): bool => is_array($content)
                    && ($content['type'] ?? null) === 'output_text'
                    && is_string($content['text'] ?? null)
            )
            ->pluck('text')
            ->implode("\n");

        $answer = trim($answer);

        return $answer !== '' ? $answer : null;
    }

    /**
     * Log an upstream OpenAI failure without logging user form contents.
     */
    private function failedOpenAiResponse(
        Response $response,
        string $traceId,
        float $startedAt
    ): JsonResponse {
        $errorMessage = $response->json('error.message');

        Log::error('OpenAI request failed', [
            'trace_id' => $traceId,
            'openai_status' => $response->status(),
            'openai_request_id' => $response->header('x-request-id'),
            'error_type' => $response->json('error.type'),
            'error_code' => $response->json('error.code'),
            'error_message' => $errorMessage,
            'duration_ms' => $this->durationInMilliseconds($startedAt),
        ]);

        return response()->json([
            'message' => app()->isLocal()
                ? ($errorMessage ?: 'OpenAI returned HTTP ' . $response->status() . '.')
                : 'The assistant is temporarily unavailable.',
            'trace_id' => $traceId,
            'debug' => app()->isLocal() ? [
                'openai_status' => $response->status(),
                'error_type' => $response->json('error.type'),
                'error_code' => $response->json('error.code'),
                'openai_request_id' => $response->header('x-request-id'),
            ] : null,
        ], 502);
    }

    private function durationInMilliseconds(float $startedAt): int
    {
        return (int) round((microtime(true) - $startedAt) * 1000);
    }
}
