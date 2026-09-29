<?php

namespace App\Jobs\Search;

use App\Services\Search\CompanySearchEngineService;
use App\Services\Search\RunSearchService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Throwable;

class RunSearchStep implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $timeout = 120;
    public array $backoff = [5, 15, 30];

    public function __construct(
        public string $token,
        public string $step,
    ) {}

    public function handle(CompanySearchEngineService $engine, RunSearchService $runner): void
    {
        if ($runner->isStopped($this->token)) {
            return;
        }

        $runner->updateStep($this->token, $this->step, [
            'status' => 'running',
            'attempts' => $this->attempts(),
            'started_at' => now()->toISOString(),
            'error' => null,
        ]);

        $startedAt = hrtime(true);
        try {
            $result = $engine->processStep($this->step, $this->token);
        } catch (Throwable $exception) {
            $runner->updateStep($this->token, $this->step, [
                'status' => 'retrying',
                'attempts' => $this->attempts(),
                'elapsed_ms' => max(1, (int) round((hrtime(true) - $startedAt) / 1_000_000)),
                'error' => $exception->getMessage(),
            ]);
            throw $exception;
        }
        $elapsedMs = max(1, (int) round((hrtime(true) - $startedAt) / 1_000_000));

        // Stop is cooperative. A query already in progress completes, but its
        // result is discarded when the user has requested cancellation.
        if ($runner->isStopped($this->token)) {
            return;
        }

        $runner->updateStep($this->token, $this->step, [
            'status' => !empty($result['skipped']) ? 'skipped' : 'completed',
            'elapsed_ms' => $elapsedMs,
            'effectiveness' => round($result['count'] * 1000 / $elapsedMs, 2),
            'found_count' => $result['count'],
            'grouped_results' => $result['grouped_results'],
            'label' => $result['label'],
            'finished_at' => now()->toISOString(),
        ]);
    }

    public function failed(Throwable $exception): void
    {
        app(RunSearchService::class)->updateStep($this->token, $this->step, [
            'status' => 'failed',
            'error' => $exception->getMessage(),
            'finished_at' => now()->toISOString(),
        ]);
    }
}
