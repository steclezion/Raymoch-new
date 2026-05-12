<?php

namespace App\Services\Search;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use Throwable;
use validationException;

class StartSearchService
{
    public function handle(Request $request): array
    {
        $validated = $request->validate([
            'keyword'      => ['nullable', 'string', 'max:255'],
            'region'       => ['nullable'],
            'country'      => ['nullable'],
            'state'        => ['nullable'],
            'city'         => ['nullable'],
            'sector'       => ['nullable'],
            'industry'     => ['nullable'],
            'verification' => ['required', 'boolean'],
        ]);

        $token = (string) Str::uuid();

        $payload = [
            'keyword'      => trim((string) ($validated['keyword'] ?? '')),
            'region'       => $validated['region'] ?? 'all',
            'country'      => $validated['country'] ?? 'all',
            'state'        => $validated['state'] ?? 'all',
            'city'         => $validated['city'] ?? 'all',
            'sector'       => $validated['sector'] ?? 'all',
            'industry'     => $validated['industry'] ?? 'all',
            'verification' => (bool) ($validated['verification'] ?? false),
        ];

        Cache::put($this->payloadKey($token), $payload, now()->addMinutes(30));
        Cache::put($this->statusKey($token), $this->makeInitialStatus($payload), now()->addMinutes(30));

        return [
            'ok' => true,
            'token' => $token,
            'payload' => $payload,
        ];
    }

    public function makeInitialStatus(array $payload): array
    {
        return [
            'meta' => [
                'is_running' => false,
                'is_completed' => false,
                'has_error' => false,
                'active_step' => 'keyword',
                'progress_percent' => 0,
                'message' => 'Search initialized.',
                'started_at' => null,
                'finished_at' => null,
            ],
            'payload' => $payload,
            'steps' => [
                'keyword' => $this->makeStep('keyword', $payload['keyword'] !== '' ? $payload['keyword'] : '(empty)'),
                'region' => $this->makeStep('region', $payload['region'] ?? 'all'),
                'country' => $this->makeStep('country', $payload['country'] ?? 'all'),
                'state' => $this->makeStep('state', $payload['state'] ?? 'all'),
                'city' => $this->makeStep('city', $payload['city'] ?? 'all'),
                'sector' => $this->makeStep('sector', $payload['sector'] ?? 'all'),
                'industry' => $this->makeStep('industry', $payload['industry'] ?? 'all'),
                'verification' => $this->makeStep('verification', ($payload['verification'] ?? false) ? 'ON' : 'OFF'),
            ],
        ];
    }

    private function makeStep(string $key, mixed $label): array
    {
        return [
            'key' => $key,
            'label' => (string) $label,
            'status' => 'idle',
            'elapsed_ms' => 0,
            'found_count' => 0,
            'found_ids' => [],
            'grouped_results' => [],
            'started_at' => null,
            'finished_at' => null,
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
}
