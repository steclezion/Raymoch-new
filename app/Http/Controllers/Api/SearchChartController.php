<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Search\StartSearchService;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

final class SearchChartController extends Controller
{
    private const TYPES = ['pie', 'area', 'stacked_bar', 'histogram', 'gantt'];

    public function show(
        Request $request,
        string $token,
        StartSearchService $starter,
    ): JsonResponse {
        $validated = $request->validate([
            'chart_type' => ['required', 'string', 'in:' . implode(',', self::TYPES)],
        ]);

        $status = Cache::store(config('search.cache_store'))
            ->get($starter->statusKey($token));

        if (! is_array($status)) {
            return response()->json([
                'ok' => false,
                'message' => 'Search session was not found or has expired.',
            ], 404);
        }

        $chartType = $validated['chart_type'];
        $points = $this->points($status['steps'] ?? []);
        $fallback = $this->fallbackDesign($chartType, $points);
        $cacheKey = 'search-chart-design:' . hash('sha256', json_encode([
            $chartType,
            $points,
        ]));

        $design = Cache::remember($cacheKey, now()->addMinutes(30), function () use (
            $chartType,
            $points,
            $fallback,
        ): array {
            return $this->openAiDesign($chartType, $points) ?? $fallback;
        });

        return response()->json([
            'ok' => true,
            'chart_type' => $chartType,
            'design' => $design,
            'data' => $points,
            'generated_by' => $design === $fallback ? 'fallback' : 'openai',
        ]);
    }

    private function points(array $steps): array
    {
        $cursor = 0;

        return collect($steps)
            ->map(function (array $step, string $key) use (&$cursor): array {
                $duration = max(0, (int) ($step['elapsed_ms'] ?? 0));
                $start = $cursor;
                $cursor += $duration;

                return [
                    'key' => $key,
                    'title' => ucfirst($key),
                    'label' => (string) ($step['display_name'] ?? $step['label'] ?? $key),
                    'value' => max(0, (int) ($step['found_count'] ?? 0)),
                    'duration_ms' => $duration,
                    'attempts' => max(0, (int) ($step['attempts'] ?? 0)),
                    'effectiveness' => max(0, min(100, (float) ($step['effectiveness'] ?? 0))),
                    'status' => (string) ($step['status'] ?? 'queued'),
                    'start_offset_ms' => $start,
                    'end_offset_ms' => $cursor,
                ];
            })
            ->values()
            ->all();
    }

    private function openAiDesign(string $chartType, array $points): ?array
    {
        $apiKey = (string) config('services.open_ai.key');

        if ($apiKey === '') {
            return null;
        }

        try {
            $response = Http::withToken($apiKey)
                ->acceptJson()
                ->connectTimeout(1)
                ->timeout(2)
                ->post('https://api.openai.com/v1/responses', [
                    'model' => config('services.open_ai.chart_model'),
                    'instructions' => 'You are a business intelligence chart art director. '
                        . 'Do not alter, calculate, reorder, omit, or invent data. '
                        . 'Return only the requested visual design metadata.',
                    'input' => json_encode([
                        'requested_chart' => $chartType,
                        'metrics' => $points,
                    ], JSON_UNESCAPED_SLASHES),
                    'max_output_tokens' => 220,
                    'text' => [
                        'format' => [
                            'type' => 'json_schema',
                            'name' => 'search_chart_design',
                            'strict' => true,
                            'schema' => [
                                'type' => 'object',
                                'properties' => [
                                    'title' => ['type' => 'string'],
                                    'subtitle' => ['type' => 'string'],
                                    'insight' => ['type' => 'string'],
                                    'palette' => [
                                        'type' => 'array',
                                        'items' => [
                                            'type' => 'string',
                                            'pattern' => '^#[0-9A-Fa-f]{6}$',
                                        ],
                                        'minItems' => 5,
                                        'maxItems' => 5,
                                    ],
                                ],
                                'required' => ['title', 'subtitle', 'insight', 'palette'],
                                'additionalProperties' => false,
                            ],
                        ],
                    ],
                ]);

            if ($response->failed()) {
                return null;
            }

            $text = $response->json('output.0.content.0.text');
            $design = is_string($text) ? json_decode($text, true) : null;

            return $this->validDesign($design) ? $design : null;
        } catch (ConnectionException) {
            return null;
        } catch (\Throwable $exception) {
            report($exception);
            return null;
        }
    }

    private function validDesign(mixed $design): bool
    {
        return is_array($design)
            && is_string($design['title'] ?? null)
            && is_string($design['subtitle'] ?? null)
            && is_string($design['insight'] ?? null)
            && is_array($design['palette'] ?? null)
            && count($design['palette']) === 5;
    }

    private function fallbackDesign(string $chartType, array $points): array
    {
        $total = array_sum(array_column($points, 'value'));

        return [
            'title' => 'Live Search Intelligence',
            'subtitle' => str_replace('_', ' ', ucfirst($chartType)) . ' across every search index',
            'insight' => number_format($total) . ' combined matches across ' . count($points) . ' indexed stages.',
            'palette' => ['#2563eb', '#06b6d4', '#8b5cf6', '#f59e0b', '#10b981'],
        ];
    }
}
