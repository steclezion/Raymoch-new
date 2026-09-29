<?php

namespace App\Services\Search;

use App\Jobs\Search\RunSearchStep;
use Illuminate\Support\Facades\Cache;
use Throwable;

class RunSearchService
{
    public function __construct(
        protected StartSearchService $starter,
        protected CompanySearchEngineService $engine,
    ) {}

    public function run(string $token): array
    {
        if (!$this->payload($token)) {
            return $this->reply(false, 404, 'Search token not found or expired.');
        }

        try {
            return $this->locked($token, function () use ($token): array {
                $status = $this->loadStatus($token);
                if (!$status) {
                    return $this->reply(false, 404, 'Search status not found.');
                }
                if ($status['meta']['is_stopped']) {
                    return $this->reply(false, 409, 'Search has been stopped.');
                }
                if (!empty($status['meta']['dispatch_failed'])) {
                    return $this->reply(false, 503, 'Dispatch failed. Start a new search.');
                }
                if ($status['meta']['is_running'] || $status['meta']['is_completed']) {
                    return $this->reply(true, 200, 'Search was already dispatched.');
                }

                $status['meta']['is_running'] = true;
                $status['meta']['started_at'] = now()->toISOString();
                $this->saveStatus($token, $status);

                $sent = [];
                try {
                    foreach (config('search.steps') as $step) {
                        RunSearchStep::dispatch($token, $step)
                            ->onConnection(config('search.connection'))
                            ->onQueue(config('search.queue'));
                        $sent[] = $step;
                    }
                } catch (Throwable $exception) {
                    // A dispatch error must be visible to the polling client.
                    $status['meta']['dispatch_failed'] = true;
                    $status['meta']['is_running'] = count($sent) > 0;
                    $status['meta']['has_error'] = true;
                    report($exception);
                    $status['meta']['message'] = 'Some jobs could not be queued. Check the application log.';
                    foreach (array_diff(config('search.steps'), $sent) as $missing) {
                        $status['steps'][$missing]['status'] = 'failed';
                        $status['steps'][$missing]['error'] = 'Could not dispatch this job.';
                        $status['steps'][$missing]['finished_at'] = now()->toISOString();
                    }
                    $status['meta']['failed_steps'] = count(config('search.steps')) - count($sent);
                    $status['meta']['progress_percent'] = (int) round(
                        100 * $status['meta']['failed_steps'] / max(1, count(config('search.steps'))),
                    );
                    $status['meta']['is_completed'] = count($sent) === 0;
                    $this->saveStatus($token, $status);

                    return $this->reply(false, 503, $status['meta']['message']);
                }

                return $this->reply(true, 202, 'Search jobs dispatched.');
            });
        } catch (Throwable $exception) {
            return $this->reply(false, 503, 'Search queue unavailable: ' . $exception->getMessage());
        }
    }

    public function stop(string $token): array
    {
        return $this->locked($token, function () use ($token): array {
            $status = $this->loadStatus($token);
            if (!$status) {
                return $this->reply(false, 404, 'Search status not found.');
            }

            if (!$status['meta']['is_completed']) {
                $status['meta']['is_stopped'] = true;
                $status['meta']['is_running'] = false;
                $status['meta']['finished_at'] = now()->toISOString();
                foreach ($status['steps'] as &$step) {
                    if (in_array($step['status'], ['queued', 'running', 'retrying'], true)) {
                        $step['status'] = 'cancelled';
                        $step['finished_at'] = now()->toISOString();
                    }
                }
                unset($step);
                $this->saveStatus($token, $status);
            }

            return $this->reply(true, 200, 'Search stopped.');
        });
    }

    public function status(string $token): array
    {
        $status = $this->loadStatus($token);

        return $status
            ? [...$this->reply(true, 200, 'Search status loaded.'), 'data' => $status]
            : $this->reply(false, 404, 'Search status not found or expired.');
    }

    public function results(string $token, int $page): array
    {
        $status = $this->loadStatus($token);
        $payload = $this->payload($token);
        if (!$status || !$payload) {
            return $this->reply(false, 404, 'Search token not found or expired.');
        }
        if (!$status['meta']['is_completed'] || $status['meta']['has_error']) {
            return $this->reply(false, 409, 'Search has not completed successfully.');
        }

        return [
            ...$this->reply(true, 200, 'Search results loaded.'),
            'data' => $this->engine->results($payload, $page),
        ];
    }

    public function updateStep(string $token, string $step, array $changes): void
    {
        $this->locked($token, function () use ($token, $step, $changes): void {
            $status = $this->loadStatus($token);
            if (!$status || $status['meta']['is_stopped'] || !isset($status['steps'][$step])) {
                return;
            }

            $previous = $status['steps'][$step]['status'];
            if (in_array($previous, ['completed', 'failed', 'skipped', 'cancelled'], true)) {
                return;
            }

            $status['steps'][$step] = array_merge($status['steps'][$step], $changes);
            $current = $status['steps'][$step]['status'];
            if ($current === 'completed') {
                $status['meta']['completed_steps']++;
            } elseif ($current === 'skipped') {
                $status['meta']['skipped_steps'] = ($status['meta']['skipped_steps'] ?? 0) + 1;
            } elseif ($current === 'failed') {
                $status['meta']['failed_steps']++;
                $status['meta']['has_error'] = true;
            }

            $finished = $status['meta']['completed_steps'] + $status['meta']['failed_steps']
                + ($status['meta']['skipped_steps'] ?? 0);
            $status['meta']['progress_percent'] = (int) round(
                100 * $finished / max(1, $status['meta']['total_steps']),
            );

            if ($finished >= $status['meta']['total_steps']) {
                $status['meta']['is_running'] = false;
                $status['meta']['is_completed'] = true;
                $status['meta']['finished_at'] = now()->toISOString();
            }

            $this->saveStatus($token, $status);
        });
    }

    public function isStopped(string $token): bool
    {
        $status = $this->loadStatus($token);

        return !$status || (bool) $status['meta']['is_stopped'];
    }

    private function payload(string $token): ?array
    {
        return $this->cache()->get($this->starter->payloadKey($token));
    }

    private function loadStatus(string $token): ?array
    {
        return $this->cache()->get($this->starter->statusKey($token));
    }

    private function saveStatus(string $token, array $status): void
    {
        $this->cache()->put(
            $this->starter->statusKey($token),
            $status,
            max(1, ($status['meta']['expires_at'] ?? (time() + (int) config('search.ttl_seconds'))) - time()),
        );
    }

    private function locked(string $token, callable $callback): mixed
    {
        return $this->cache()
            ->lock($this->starter->lockKey($token), 30)
            ->block(10, $callback);
    }

    private function cache()
    {
        return Cache::store(config('search.cache_store'));
    }

    private function reply(bool $ok, int $code, string $message): array
    {
        return ['ok' => $ok, 'status_code' => $code, 'message' => $message];
    }
}
