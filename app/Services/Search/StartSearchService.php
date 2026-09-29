<?php

namespace App\Services\Search;

use App\Support\SearchDimensions;
use App\Support\SearchFilterLabelResolver;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class StartSearchService
{
    public function __construct(
        protected SearchFilterLabelResolver $labelResolver,
    ) {}

    public function handle(Request $request): array
    {
        $validated = $request->validate([
            'request_id' => ['nullable', 'uuid'],
            'keyword' => ['nullable', 'string', 'max:255'],
            'region' => ['nullable', 'string', 'max:64'],
            'country' => ['nullable', 'string', 'max:64'],
            'state' => ['nullable', 'string', 'max:64'],
            'city' => ['nullable', 'string', 'max:64'],
            'sector' => ['nullable', 'string', 'max:64'],
            'industry' => ['nullable', 'string', 'max:64'],
            'verification' => ['required', 'boolean'],
        ]);

        $payload = $this->normalize($validated);
        $cache = Cache::store(config('search.cache_store'));
        $ttl = (int) config('search.ttl_seconds');
        $requestId = $validated['request_id'] ?? (string) Str::uuid();

        // Repeating one start request after a network error returns the same token.
        return $cache->lock('main_search_start_' . $requestId, 20)->block(5, function () use (
            $cache,
            $ttl,
            $requestId,
            $payload
        ): array {
            $requestKey = 'main_search_request_' . $requestId;
            $existing = $cache->get($requestKey);

            if ($existing && $cache->has($this->statusKey($existing))) {
                if ($cache->get($this->payloadKey($existing)) !== $payload) {
                    throw ValidationException::withMessages([
                        'request_id' => 'A start request ID cannot be reused with different filters.',
                    ]);
                }

                return ['ok' => true, 'token' => $existing];
            }

            $token = (string) Str::uuid();
            $cache->put($this->payloadKey($token), $payload, $ttl);
            $cache->put($this->statusKey($token), $this->makeInitialStatus($payload), $ttl);
            $cache->put($requestKey, $token, $ttl);

            return ['ok' => true, 'token' => $token];
        });
    }

    public function makeInitialStatus(array $payload): array
    {
        $steps = [];

        foreach (config('search.steps') as $key) {
            $selectedValue = $payload[$key] ?? null;
            $displayName = $this->initialLabel($key, $selectedValue);

            $steps[$key] = [
                'key' => $key,
                // React displays this immediately, including while queued.
                'label' => $displayName,
                'display_name' => $displayName,
                // The database query continues using the submitted ID.
                'selected_id' => in_array($key, ['keyword', 'verification'], true)
                    ? null
                    : $selectedValue,
                'status' => 'queued',
                'attempts' => 0,
                'elapsed_ms' => 0,
                'effectiveness' => 0,
                'found_count' => 0,
                'grouped_results' => [],
                'error' => null,
                'started_at' => null,
                'finished_at' => null,
            ];
        }

        return [
            'payload' => $payload,
            'meta' => [
                'is_running' => false,
                'is_completed' => false,
                'is_stopped' => false,
                'has_error' => false,
                'completed_steps' => 0,
                'failed_steps' => 0,
                'skipped_steps' => 0,
                'total_steps' => count($steps),
                'expires_at' => time() + (int) config('search.ttl_seconds'),
                'progress_percent' => 0,
                'started_at' => null,
                'finished_at' => null,
            ],
            'steps' => $steps,
        ];
    }

    public function payloadKey(string $token): string
    {
        return "main_search_engine_payload_{$token}";
    }

    public function statusKey(string $token): string
    {
        return "main_search_engine_status_{$token}";
    }

    public function lockKey(string $token): string
    {
        return "main_search_engine_lock_{$token}";
    }

    private function initialLabel(string $key, mixed $selectedValue): string
    {
        if ($key === 'keyword') {
            return $selectedValue === null || $selectedValue === ''
                ? '(empty)'
                : (string) $selectedValue;
        }

        if ($key === 'verification') {
            return $selectedValue ? 'ON' : 'OFF';
        }

        if ($selectedValue === null || $selectedValue === '' || $selectedValue === 'all') {
            return 'all';
        }

        $columns = SearchDimensions::columnsFor($key);

        if (! $columns) {
            return (string) $selectedValue;
        }

        return $this->labelResolver->resolveOne(
            $columns,
            $selectedValue,
        ) ?? (string) $selectedValue;
    }

    private function normalize(array $values): array
    {
        $dimension = static function (string $key) use ($values): string {
            $value = trim((string) ($values[$key] ?? ''));

            return $value === '' || strtolower($value) === 'all' ? 'all' : $value;
        };

        return [
            'keyword' => trim((string) ($values['keyword'] ?? '')),
            'region' => $dimension('region'),
            'country' => $dimension('country'),
            'state' => $dimension('state'),
            'city' => $dimension('city'),
            'sector' => $dimension('sector'),
            'industry' => $dimension('industry'),
            'verification' => (bool) $values['verification'],
        ];
    }
}
