<?php

namespace App\Http\Controllers;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Throwable;

final class SearchVisualController extends Controller
{
    public function generate(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'search_token' => ['nullable', 'string', 'max:160'],
            'sector' => ['required', 'string', 'max:120'],
            'region' => ['nullable', 'string', 'max:120'],
            'country' => ['nullable', 'string', 'max:120'],
            'state' => ['nullable', 'string', 'max:120'],
            'city' => ['nullable', 'string', 'max:120'],
            'industry' => ['nullable', 'string', 'max:120'],
        ]);

        $filters = collect($filters)
            ->map(fn($value) => is_string($value) ? trim($value) : $value)
            ->reject(fn($value) => $value === null || $value === '' || strtolower((string) $value) === 'all')
            ->all();

        if (! isset($filters['sector'])) {
            throw ValidationException::withMessages([
                'sector' => 'Choose a sector before generating search visuals.',
            ]);
        }

        // Only the personalized image is generated. The intro is a prebuilt public asset,
        // so the browser can show it immediately without waiting for OpenAI.
        $selectionCacheKey = 'search-visuals:selection:' . hash('sha256', json_encode($filters));

        try {
            $personalizedImage = Cache::remember(
                $selectionCacheKey,
                now()->addDays(30),
                fn() => $this->createSlide(
                    'selected-search-' . Str::slug($filters['sector']),
                    $this->selectionPrompt($filters)
                )
            );
        } catch (ConnectionException $exception) {
            report($exception);

            return response()->json([
                'ok' => false,
                'message' => 'The image service could not be reached. Please try again.',
            ], 503);
        } catch (ValidationException $exception) {
            throw $exception;
        } catch (Throwable $exception) {
            report($exception);

            return response()->json([
                'ok' => false,
                'message' => app()->isProduction()
                    ? 'The search visuals could not be generated.'
                    : $exception->getMessage(),
            ], 502);
        }

        return response()->json([
            'ok' => true,
            'interval_ms' => 4000,
            'slides' => [
                [
                    'title' => 'Advanced Raymoch Search',
                    'subtitle' => 'Mapping business opportunities with intelligent precision.',
                    'image_url' => asset(config('search.intro_image', 'images/advanced-raymoch-search-2k.webp')),
                ],
                [
                    'title' => 'Selected sector: ' . $filters['sector'],
                    'subtitle' => $this->selectionSummary($filters),
                    'image_url' => $personalizedImage,
                ],
            ],
        ]);
    }

    private function createSlide(string $name, string $prompt): string
    {
        $apiKey = (string) config('services.open_ai.key-image');

        if ($apiKey === '') {
            throw new \RuntimeException('OPENAI_API_KEY is not configured on the server.');
        }

        $response = Http::withToken($apiKey)
            ->acceptJson()
            ->timeout(180)
            ->retry(2, 750, throw: false)
            ->post('https://api.openai.com/v1/images/generations', [
                'model' => config('services.open_ai.model_image', 'gpt-image-2.5-flare'),
                'prompt' => $prompt,
                'size' => '2048x1152',
                // Medium-quality 2K output reduces generation latency substantially.
                'quality' => 'medium',
                'output_format' => 'webp',
                'output_compression' => 88,
                'n' => 1,
            ]);

        if ($response->failed()) {
            $message = $response->json('error.message') ?: 'OpenAI image generation failed.';
            throw new \RuntimeException($message);
        }

        $encoded = $response->json('data.0.b64_json');
        $binary = is_string($encoded) ? base64_decode($encoded, true) : false;

        if ($binary === false) {
            throw new \RuntimeException('OpenAI did not return a valid image.');
        }

        $path = 'search-visuals/' . Str::slug($name) . '-' . Str::uuid() . '.webp';
        Storage::disk('public')->put($path, $binary);

        return Storage::url($path);
    }

    private function selectionPrompt(array $filters): string
    {
        $context = $this->selectionSummary($filters);

        return "Create a premium 2K cinematic business-sector hero image for Raymoch Search. "
            . "Visualize the {$filters['sector']} sector in a credible, modern, globally connected way. "
            . "Search context: {$context}. Use sophisticated navy, electric blue, cyan and restrained gold; "
            . "realistic enterprise imagery, layered depth, subtle data-network motifs, polished advertising art direction. "
            . "Reserve clean negative space for a web overlay. No words, logos, labels, watermark or UI screenshot.";
    }

    private function selectionSummary(array $filters): string
    {
        $labels = [
            'region' => 'Region',
            'country' => 'Country',
            'state' => 'State',
            'city' => 'City',
            'industry' => 'Industry',
        ];

        $parts = collect($labels)
            ->filter(fn($_label, $key) => isset($filters[$key]))
            ->map(fn($label, $key) => "{$label}: {$filters[$key]}")
            ->values()
            ->all();

        return $parts === []
            ? 'Showing matches across all locations and industries.'
            : implode(' · ', $parts);
    }
}
