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
            'regions' => ['nullable', 'array'],
            'regions.*' => ['integer', 'distinct', 'min:1'],
            'region' => ['nullable', 'string', 'max:64'],
            'countries' => ['nullable', 'array'],
            'countries.*' => ['integer', 'distinct', 'min:1'],
            'country' => ['nullable', 'string', 'max:64'],
            'states' => ['nullable', 'array'],
            'states.*' => ['integer', 'distinct', 'min:1'],
            'state' => ['nullable', 'string', 'max:64'],
            'city' => ['nullable', 'string', 'max:64'],
            'sectors' => ['nullable', 'array'],
            'sectors.*' => ['integer', 'distinct', 'min:1'],
            'sector' => ['nullable', 'string', 'max:64'],
            'industries' => ['nullable', 'array'],
            'industries.*' => ['integer', 'distinct', 'min:1'],
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
        $collectionKeys = [
            'region' => 'regions',
            'country' => 'countries',
            'state' => 'states',
            'sector' => 'sectors',
            'industry' => 'industries',
        ];

        foreach (config('search.steps') as $key) {
            $selectedValue = isset($collectionKeys[$key])
                ? ($payload[$collectionKeys[$key]] ?? [])
                : ($payload[$key] ?? null);
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
                'result_count' => null,
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

        if (is_array($selectedValue)) {
            if ($selectedValue === []) {
                return 'all';
            }

            return collect($selectedValue)
                ->map(fn ($value) => $this->labelResolver->resolveOne(
                    SearchDimensions::columnsFor($key),
                    $value,
                ) ?? (string) $value)
                ->join(', ');
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

        $collection = static function (string $plural, string $singular) use ($values): array {
            return collect($values[$plural] ?? (! empty($values[$singular]) && $values[$singular] !== 'all' ? [$values[$singular]] : []))
                ->map(fn ($value) => (string) $value)
                ->unique()
                ->values()
                ->all();
        };

        return [
            'keyword' => trim((string) ($values['keyword'] ?? '')),
            'regions' => $collection('regions', 'region'),
            'countries' => $collection('countries', 'country'),
            'states' => $collection('states', 'state'),
            'city' => $dimension('city'),
            'sectors' => $collection('sectors', 'sector'),
            'industries' => $collection('industries', 'industry'),
            'verification' => (bool) $values['verification'],
        ];
    }
}
