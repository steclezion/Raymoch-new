<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AskVerificationAssistantRequest;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Throwable;

class RaymochInformationProviderController extends Controller
{
    public function __invoke(AskVerificationAssistantRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $traceId = (string) Str::uuid();
        $startedAt = microtime(true);
        $apiKey = trim((string) config('openai.api_key'));
        $model = trim((string) config('openai.model', 'gpt-5.4-mini'));

        if ($apiKey === '' || $model === '') {
            Log::error('Raymoch Information Supporter is not configured.', [
                'trace_id' => $traceId,
            ]);

            return response()->json([
                'message' => 'The assistant is not configured.',
                'trace_id' => $traceId,
            ], 503);
        }

        try {
            $promptPath = storage_path('app/public/prompts/Raymoch-support-desk.txt');

            if (! File::isFile($promptPath) || ! File::isReadable($promptPath)) {
                return response()->json([
                    'message' => 'The assistant instructions are not configured.',
                    'trace_id' => $traceId,
                ], 503);
            }

            $instructions = trim(File::get($promptPath));

            if ($instructions === '') {
                return response()->json([
                    'message' => 'The assistant instructions are empty.',
                    'trace_id' => $traceId,
                ], 503);
            }

            $conversation = collect($validated['conversation'] ?? [])
                ->take(-8)
                ->map(static fn(array $message): array => [
                    'role' => $message['role'] === 'assistant' ? 'assistant' : 'user',
                    'content' => mb_substr((string) $message['content'], 0, 2000),
                ])
                ->values()
                ->all();

            $safeContext = Arr::except($validated['form_context'] ?? [], [
                'tax_id',
                'signatory_id_number',
                'password',
                'password_confirmation',
            ]);

            $conversation[] = [
                'role' => 'user',
                'content' => implode("\n\n", [
                    'Page context: ' . json_encode(
                        $safeContext,
                        JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR
                    ),
                    'User question: ' . $validated['question'],
                ]),
            ];

            $response = Http::withToken($apiKey)
                ->acceptJson()
                ->connectTimeout(10)
                ->timeout(30)
                ->post('https://api.openai.com/v1/responses', [
                    'model' => $model,
                    'instructions' => $instructions,
                    'input' => $conversation,
                    'reasoning' => ['effort' => 'low'],
                    'text' => ['verbosity' => 'low'],
                    'max_output_tokens' => 400,
                    'store' => false,
                ]);

            if ($response->failed()) {
                $upstreamMessage = $response->json('error.message');

                Log::error('Raymoch Information Supporter OpenAI request failed.', [
                    'trace_id' => $traceId,
                    'openai_status' => $response->status(),
                    'openai_request_id' => $response->header('x-request-id'),
                    'error_type' => $response->json('error.type'),
                    'error_code' => $response->json('error.code'),
                    'duration_ms' => (int) round((microtime(true) - $startedAt) * 1000),
                ]);

                return response()->json([
                    'message' => app()->isLocal() && is_string($upstreamMessage)
                        ? $upstreamMessage
                        : 'The assistant is temporarily unavailable.',
                    'trace_id' => $traceId,
                ], 502);
            }

            $answer = collect($response->json('output', []))
                ->filter(
                    static fn($item): bool =>
                    is_array($item) && ($item['type'] ?? null) === 'message'
                )
                ->flatMap(
                    static fn(array $item): array =>
                    is_array($item['content'] ?? null) ? $item['content'] : []
                )
                ->filter(
                    static fn($content): bool =>
                    is_array($content)
                        && ($content['type'] ?? null) === 'output_text'
                        && is_string($content['text'] ?? null)
                )
                ->pluck('text')
                ->implode("\n");

            $answer = trim($answer);

            if ($answer === '') {
                return response()->json([
                    'message' => 'I do not currently have enough verified information to answer that accurately.',
                    'trace_id' => $traceId,
                ], 502);
            }

            Log::info('Raymoch Information Supporter response completed.', [
                'trace_id' => $traceId,
                'user_id' => $request->user()?->getAuthIdentifier(),
                'openai_request_id' => $response->header('x-request-id'),
                'duration_ms' => (int) round((microtime(true) - $startedAt) * 1000),
            ]);

            return response()->json([
                'answer' => $answer,
                'trace_id' => $traceId,
            ]);
        } catch (ConnectionException $exception) {
            Log::error('Raymoch Information Supporter connection failed.', [
                'trace_id' => $traceId,
                'message' => $exception->getMessage(),
            ]);

            return response()->json([
                'message' => 'The assistant could not be reached. Please try again.',
                'trace_id' => $traceId,
            ], 503);
        } catch (Throwable $exception) {
            Log::error('Raymoch Information Supporter failed.', [
                'trace_id' => $traceId,
                'exception' => $exception::class,
                'message' => $exception->getMessage(),
            ]);

            return response()->json([
                'message' => app()->isLocal()
                    ? $exception->getMessage()
                    : 'The assistant is temporarily unavailable.',
                'trace_id' => $traceId,
            ], 500);
        }
    }
}
