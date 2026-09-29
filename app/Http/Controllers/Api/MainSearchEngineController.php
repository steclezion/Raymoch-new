<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Search\RunSearchService;
use App\Services\Search\StartSearchService;
use Illuminate\Http\Request;
use App\Services\Search\CompanySearchEngineService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class MainSearchEngineController extends Controller
{
    public function __construct(
        protected StartSearchService $startSearchService,
        protected RunSearchService $runSearchService
    ) {}

    public function start(Request $request)
    {
        $result = $this->startSearchService->handle($request);
        //   dd(response()->json($result)->getContent());
        return response()->json($result);
    }

    public function run(Request $request, string $token)
    {
        $result = $this->runSearchService->run($token);
        // dd(response()->json($result)->getContent());
        return response()->json(
            [
                'ok' => $result['ok'],
                'message' => $result['message'],
            ],
            $result['status_code']
        );
    }

    public function status(string $token)
    {
        $result = $this->runSearchService->status($token);

        if (!$result['ok']) {
            return response()->json([
                'ok' => false,
                'message' => $result['message'],
            ], $result['status_code']);
        }

        return response()->json([
            'ok' => true,
            'data' => $result['data'],
        ], $result['status_code']);
    }


    public function stop(
        string $token,
        StartSearchService $starter
    ): JsonResponse {
        $cache = Cache::store(config('search.cache_store'));
        $statusKey = $starter->statusKey($token);

        if (! $cache->has($statusKey)) {
            return response()->json([
                'ok' => false,
                'message' => 'Search session was not found or has expired.',
            ], 404);
        }

        return $cache->lock($starter->lockKey($token), 20)
            ->block(5, function () use ($cache, $statusKey, $token): JsonResponse {
                $status = $cache->get($statusKey);

                if (! is_array($status)) {
                    return response()->json([
                        'ok' => false,
                        'message' => 'Search status is unavailable.',
                    ], 404);
                }

                if ($status['meta']['is_completed'] ?? false) {
                    return response()->json([
                        'ok' => true,
                        'token' => $token,
                        'message' => 'Search was already completed.',
                        'status' => $status,
                    ]);
                }

                $finishedAt = now()->toIso8601String();

                $status['meta']['is_running'] = false;
                $status['meta']['is_stopped'] = true;
                $status['meta']['finished_at'] = $finishedAt;

                foreach ($status['steps'] as &$step) {
                    if (in_array(
                        $step['status'] ?? 'queued',
                        ['queued', 'running', 'retrying'],
                        true
                    )) {
                        $step['status'] = 'cancelled';
                        $step['finished_at'] = $finishedAt;
                    }
                }

                unset($step);

                $status['meta']['completed_steps'] = collect($status['steps'])
                    ->whereIn('status', ['done', 'completed'])
                    ->count();

                $status['meta']['failed_steps'] = collect($status['steps'])
                    ->where('status', 'failed')
                    ->count();

                $status['meta']['skipped_steps'] = collect($status['steps'])
                    ->whereIn('status', ['skipped', 'cancelled'])
                    ->count();

                $totalSteps = max(1, (int) ($status['meta']['total_steps'] ?? 1));
                $finishedSteps =
                    $status['meta']['completed_steps'] +
                    $status['meta']['failed_steps'] +
                    $status['meta']['skipped_steps'];

                $status['meta']['progress_percent'] = min(
                    100,
                    (int) round(($finishedSteps / $totalSteps) * 100)
                );

                $cache->put(
                    $statusKey,
                    $status,
                    (int) config('search.ttl_seconds')
                );

                return response()->json([
                    'ok' => true,
                    'token' => $token,
                    'message' => 'Search stopped successfully.',
                    'status' => $status,
                ]);
            });
    }
}
