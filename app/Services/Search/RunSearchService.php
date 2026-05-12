<?php

namespace App\Services\Search;

use Illuminate\Support\Facades\Cache;
use Throwable;

class RunSearchService
{
    public function __construct(
        protected StartSearchService $startSearchService,
        protected CompanySearchEngineService $companySearchEngineService
    ) {}

    public function run(string $token): array
    {
        $payload = Cache::get($this->payloadKey($token));

        if (!$payload) {
            return [
                'ok' => false,
                'status_code' => 404,
                'message' => 'Search token not found or expired.',
            ];
        }

        $status = Cache::get($this->statusKey($token));

        if (!$status) {
            $status = $this->startSearchService->makeInitialStatus($payload);
            $this->saveStatus($token, $status);
        }

        if (($status['meta']['is_completed'] ?? false) === true) {
            return [
                'ok' => true,
                'status_code' => 200,
                'message' => 'Search already completed.',
            ];
        }

        if (($status['meta']['is_running'] ?? false) === true) {
            return [
                'ok' => true,
                'status_code' => 200,
                'message' => 'Search already running.',
            ];
        }

        $status['meta']['is_running'] = true;
        $status['meta']['started_at'] = now()->toDateTimeString();
        $this->saveStatus($token, $status);

        ignore_user_abort(true);
        @set_time_limit(0);

        try {
            $this->processSearch($token, $payload);

            $status = Cache::get($this->statusKey($token), []);
            $status['meta']['is_running'] = false;
            $status['meta']['is_completed'] = true;
            $status['meta']['finished_at'] = now()->toDateTimeString();
            $status['meta']['progress_percent'] = 100;
            $status['meta']['message'] = 'Search complete.';
            $this->saveStatus($token, $status);

            return [
                'ok' => true,
                'status_code' => 200,
                'message' => 'Search finished successfully.',
            ];
        } catch (Throwable $e) {
            $status = Cache::get($this->statusKey($token), $this->startSearchService->makeInitialStatus($payload));
            $status['meta']['is_running'] = false;
            $status['meta']['is_completed'] = true;
            $status['meta']['has_error'] = true;
            $status['meta']['message'] = $e->getMessage();
            $status['meta']['finished_at'] = now()->toDateTimeString();
            $this->saveStatus($token, $status);

            return [
                'ok' => false,
                'status_code' => 500,
                'message' => $e->getMessage(),
            ];
        }
    }

    public function status(string $token): array
    {
        $status = Cache::get($this->statusKey($token));

        if (!$status) {
            return [
                'ok' => false,
                'status_code' => 404,
                'message' => 'Search status not found or expired.',
            ];
        }

        return [
            'ok' => true,
            'status_code' => 200,
            'data' => $status,
        ];
    }

    private function processSearch(string $token, array $payload): void
    {
        $steps = [
            'keyword',
            'region',
            'country',
            'state',
            'city',
            'sector',
            'industry',
            'verification',
        ];

        $totalSteps = count($steps);

        foreach ($steps as $index => $stepName) {
            $startedAt = microtime(true);

            $this->updateSingleStep($token, $stepName, [
                'status' => 'running',
                'started_at' => now()->toDateTimeString(),
            ]);

            $result = $this->companySearchEngineService->processStep($stepName, $payload);

            $elapsedMs = (int) round((microtime(true) - $startedAt) * 1000);
            $progressPercent = (int) round((($index + 1) / $totalSteps) * 100);

            $this->updateSingleStep($token, $stepName, [
                'status' => 'done',
                'elapsed_ms' => $elapsedMs,
                'found_count' => $result['count'] ?? 0,
                'found_ids' => $result['ids'] ?? [],
                'grouped_results' => $result['grouped_results'] ?? [],
                'label' => $result['label'] ?? ($payload[$stepName] ?? 'all'),
                'finished_at' => now()->toDateTimeString(),
            ]);

            $status = Cache::get($this->statusKey($token), []);
            $status['meta']['active_step'] = $stepName;
            $status['meta']['progress_percent'] = $progressPercent;
            $status['meta']['message'] = ucfirst($stepName) . ' processed.';
            $this->saveStatus($token, $status);
        }
    }

    private function updateSingleStep(string $token, string $stepName, array $updates): void
    {
        $status = Cache::get($this->statusKey($token), []);

        if (!isset($status['steps'][$stepName])) {
            $status['steps'][$stepName] = [];
        }

        $status['steps'][$stepName] = array_merge($status['steps'][$stepName], $updates);

        $this->saveStatus($token, $status);
    }

    private function saveStatus(string $token, array $status): void
    {
        Cache::put($this->statusKey($token), $status, now()->addMinutes(30));
    }

    private function payloadKey(string $token): string
    {
        return "main_search_engine_payload_{$token}";
    }

    private function statusKey(string $token): string
    {
        return "main_search_engine_status_{$token}";
    }
}
