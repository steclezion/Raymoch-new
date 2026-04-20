<?php

namespace App\Http\Controllers\Api;

// Base controller class
use App\Http\Controllers\Controller;

// Request object for handling input validation and request data
use Illuminate\Http\Request;

// Cache is used to temporarily store payload and live search status
use Illuminate\Support\Facades\Cache;

// DB is used to run direct database queries
use Illuminate\Support\Facades\DB;

// Str is used to generate a UUID token for each search session
use Illuminate\Support\Str;

// Throwable lets us catch any runtime error or exception
use Throwable;

class MainSearchEngineController extends Controller
{
    /**
     * Start a new search session.
     *
     * This method:
     * 1. validates incoming search fields
     * 2. creates a unique search token
     * 3. stores the search payload in cache
     * 4. stores the initial search status in cache
     * 5. returns the token to the frontend
     */
    public function start(Request $request)
    {
        // Validate all incoming search inputs
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

        // Create a unique token for this search session
        $token = (string) Str::uuid();

        // Normalize and prepare the payload that will be stored
        $payload = [
            'keyword'      => trim((string) ($validated['keyword'] ?? '')),
            'region'       => $validated['region'] ?? null,
            'country'      => $validated['country'] ?? null,
            'state'        => $validated['state'] ?? null,
            'city'         => $validated['city'] ?? null,
            'sector'       => $validated['sector'] ?? null,
            'industry'     => $validated['industry'] ?? null,
            'verification' => (bool) ($validated['verification'] ?? false),
        ];

        // Save the original payload in cache for later processing
        Cache::put($this->payloadKey($token), $payload, now()->addMinutes(30));

        // Save the initial live-status structure in cache
        Cache::put($this->statusKey($token), $this->makeInitialStatus($payload), now()->addMinutes(30));

        // Return the token and payload back to the client
        return response()->json([
            'ok' => true,
            'token' => $token,
            'payload' => $payload,
        ]);
    }

    /**
     * Run the real search process using the cached token payload.
     *
     * This method:
     * 1. fetches payload by token
     * 2. marks the search as running
     * 3. processes all steps one by one
     * 4. updates progress status in cache
     * 5. returns success or error
     */
    public function run(Request $request, string $token)
    {
        // Get the cached payload using the token
        $payload = Cache::get($this->payloadKey($token));

        // If payload is missing, token is invalid or expired
        if (!$payload) {
            return response()->json([
                'ok' => false,
                'message' => 'Search token not found or expired.',
            ], 404);
        }

        // Read the existing status from cache
        $status = Cache::get($this->statusKey($token));

        // If status is missing for some reason, recreate it
        if (!$status) {
            Cache::put($this->statusKey($token), $this->makeInitialStatus($payload), now()->addMinutes(30));
            $status = Cache::get($this->statusKey($token));
        }

        // If already completed, do not run again
        if (($status['meta']['is_completed'] ?? false) === true) {
            return response()->json([
                'ok' => true,
                'message' => 'Search already completed.',
            ]);
        }

        // If already running, prevent duplicate execution
        if (($status['meta']['is_running'] ?? false) === true) {
            return response()->json([
                'ok' => true,
                'message' => 'Search already running.',
            ]);
        }

        // Mark the search as actively running
        $status['meta']['is_running'] = true;
        $status['meta']['started_at'] = now()->toDateTimeString();
        $this->saveStatus($token, $status);

        // Prevent PHP from stopping if client disconnects
        ignore_user_abort(true);

        // Remove execution time limit for long searches
        @set_time_limit(0);

        try {
            // Process the actual search steps
            $this->processSearch($token, $payload);

            // Reload latest status after processing
            $status = Cache::get($this->statusKey($token), []);

            // Mark search as finished
            $status['meta']['is_running'] = false;
            $status['meta']['is_completed'] = true;
            $status['meta']['finished_at'] = now()->toDateTimeString();
            $status['meta']['progress_percent'] = 100;
            $status['meta']['message'] = 'Search complete.';

            // Save final status
            $this->saveStatus($token, $status);

            return response()->json([
                'ok' => true,
                'message' => 'Search finished successfully.',
            ]);
        } catch (Throwable $e) {
            // If an error happens, update the status as failed
            $status = Cache::get($this->statusKey($token), $this->makeInitialStatus($payload));
            $status['meta']['is_running'] = false;
            $status['meta']['is_completed'] = true;
            $status['meta']['has_error'] = true;
            $status['meta']['message'] = $e->getMessage();
            $status['meta']['finished_at'] = now()->toDateTimeString();

            // Save failed status
            $this->saveStatus($token, $status);

            return response()->json([
                'ok' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Return the current live status for a token.
     *
     * Frontend will poll this endpoint to update the progress UI.
     */
    public function status(string $token)
    {
        // Fetch search status from cache
        $status = Cache::get($this->statusKey($token));

        // If status not found, token may be expired or invalid
        if (!$status) {
            return response()->json([
                'ok' => false,
                'message' => 'Search status not found or expired.',
            ], 404);
        }

        // Return the full current status object
        return response()->json([
            'ok' => true,
            'data' => $status,
        ]);
    }

    /**
     * Process each search step one by one.
     *
     * Each step updates:
     * - running state
     * - elapsed time
     * - found count
     * - found ids
     * - overall progress
     */
    private function processSearch(string $token, array $payload): void
    {
        // Ordered search steps
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

        // Total number of steps, used to calculate percentage
        $totalSteps = count($steps);

        // Loop through every step in order
        foreach ($steps as $index => $stepName) {
            // Start timer for this individual step
            $startedAt = microtime(true);

            // Mark the step as running
            $this->updateSingleStep($token, $stepName, [
                'status' => 'running',
                'started_at' => now()->toDateTimeString(),
            ]);

            // Decide which query logic to run for the current step
            $result = match ($stepName) {
                'keyword'      => $this->searchKeyword($payload),
                'region'       => $this->matchExact('Region', $payload['region'] ?? null),
                'country'      => $this->matchExact('Country', $payload['country'] ?? null),
                'state'        => $this->matchExact('State', $payload['state'] ?? null),
                'city'         => $this->matchExact('City', $payload['city'] ?? null),
                'sector'       => $this->matchExact('Sector', $payload['sector'] ?? null),
                'industry'     => $this->matchExact('indistry_id', $payload['industry'] ?? null),
                'verification' => $this->matchVerification($payload['verification'] ?? false, $payload['sector'] ?? null),
                default        => ['count' => 0, 'ids' => []],
            };

            // Measure how long this step took in milliseconds
            $elapsedMs = (int) round((microtime(true) - $startedAt) * 1000);

            // Calculate the total progress percentage after this step completes
            $progressPercent = (int) round((($index + 1) / $totalSteps) * 100);

            // Save step result details
            $this->updateSingleStep($token, $stepName, [
                'status' => 'done',
                'elapsed_ms' => $elapsedMs,
                'found_count' => $result['count'],
                'found_ids' => $result['ids'],
                'finished_at' => now()->toDateTimeString(),
            ]);

            // Update main meta progress
            $status = Cache::get($this->statusKey($token), []);
            $status['meta']['active_step'] = $stepName;
            $status['meta']['progress_percent'] = $progressPercent;
            $status['meta']['message'] = ucfirst($stepName) . ' processed.';

            // Save latest meta state
            $this->saveStatus($token, $status);
        }
    }

    /**
     * Search keyword using partial matching.
     *
     * This is the only step using "like" logic for similar or exact text.
     */
    private function searchKeyword(array $payload): array
    {
        // Read and normalize keyword text
        $keyword = trim((string) ($payload['keyword'] ?? ''));

        // If keyword is empty, return no results
        if ($keyword === '') {
            return [
                'count' => 0,
                'ids' => [],
            ];
        }

        // Query the companies table using broad keyword matching
        $rows = DB::table('companies')
            ->select('id')
            ->where(function ($q) use ($keyword) {
                $q->where('CompanyName', 'like', "%{$keyword}%")
                    // ->orWhere('keyword', 'like', "%{$keyword}%")
                    ->orWhere('industry_id', 'like', "%{$keyword}%")
                    ->orWhere('City', 'like', "%{$keyword}%");
            })
            ->limit(2000000)
            ->get();

        // Return count and matching ids
        return [
            'count' => $rows->count(),
            'ids' => $rows->pluck('id')->values()->all(),
        ];
    }

    /**
     * Match a specific field exactly.
     *
     * Used for region, country, state, city, sector, and industry.
     */
    // private function matchExact(string $column, mixed $value): array
    // {
    //     // Ignore empty or "all" values
    //     if ($value === null || $value === '' || $value === 'all') {
    //         return [
    //             'count' => 0,
    //             'ids' => [],
    //         ];
    //     }

    //     // Run exact match query
    //     $rows = DB::table('companies')
    //         ->select('id')
    //         ->where($column, $value)
    //         ->limit(2000000)
    //         ->get();

    //     // Return count and ids
    //     return [
    //         'count' => $rows->count(),
    //         'ids' => $rows->pluck('id')->values()->all(),
    //     ];
    // }


    private function matchExact(string $column, mixed $value): array
    {
        // 🔥 CASE 1: ALL → GROUP BY
        if ($value === null || $value === '' || $value === 'all') {

            $rows = DB::table('companies')
                ->select($column . ' as name', DB::raw('COUNT(*) as total'))
                ->groupBy($column)
                ->orderByDesc('total')
                ->limit(50)
                ->get();

            return [
                'count' => $rows->sum('total'),
                'ids' => [],
                'grouped_results' => $rows->map(function ($r) {
                    return [
                        'name' => $r->name ?? 'Unknown',
                        'count' => (int) $r->total,
                    ];
                })->values()->all(),
            ];
        }

        // 🔥 CASE 2: SPECIFIC VALUE
        $rows = DB::table('companies')
            ->select('id')
            ->where($column, $value)
            ->limit(2000000)
            ->get();

        // 🔥 Resolve name (IMPORTANT)
        $name = DB::table('companies')
            ->where($column, $value)
            ->value($column);

        return [
            'count' => $rows->count(),
            'ids' => $rows->pluck('id')->values()->all(),
            'resolved_name' => $name ?? $value,
        ];
    }
    /**
     * Match verification flag.
     *
     * If verification is OFF, return zero.
     * If ON, return all verified companies.
     */
    private function matchVerification(bool $verification, ?string $sector = null): array
    {
        // If verification toggle is off, do not filter
        if (!$verification) {
            $rows = DB::table('companies')
                ->select('id')
                ->where('VerificationStatus', 'Pending')
                ->where('Sector', $sector)
                ->limit(2000000)
                ->get();

            return [
                'count' => 0,
                'ids' => [],
            ];
        }

        // Query verified companies
        $rows = DB::table('companies')
            ->select('id')
            ->where('VerificationStatus', 'Pending')
            ->where('Sector', $sector)
            ->limit(2000000)
            ->get();

        // Return count and ids
        return [
            'count' => $rows->count(),
            'ids' => $rows->pluck('id')->values()->all(),
        ];
    }

    /**
     * Update one step inside the status structure.
     *
     * This merges new values into the existing step object.
     */
    private function updateSingleStep(string $token, string $stepName, array $updates): void
    {
        // Read full status
        $status = Cache::get($this->statusKey($token), []);

        // Ensure the step exists
        if (!isset($status['steps'][$stepName])) {
            $status['steps'][$stepName] = [];
        }

        // Merge new updates into the step
        $status['steps'][$stepName] = array_merge($status['steps'][$stepName], $updates);

        // Save updated status
        $this->saveStatus($token, $status);
    }

    /**
     * Save the whole status object to cache.
     */
    private function saveStatus(string $token, array $status): void
    {
        Cache::put($this->statusKey($token), $status, now()->addMinutes(30));
    }

    /**
     * Build the initial status object stored before the search begins.
     */
    private function makeInitialStatus(array $payload): array
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

            // Original input payload
            'payload' => $payload,

            // Each search step starts with idle status
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

    /**
     * Build one default step object.
     */
    private function makeStep(string $key, mixed $label): array
    {
        return [
            'key' => $key,
            'label' => (string) $label,
            'status' => 'idle',
            'elapsed_ms' => 0,
            'found_count' => 0,
            'found_ids' => [],
            'started_at' => null,
            'finished_at' => null,
        ];
    }

    /**
     * Generate cache key for stored payload.
     */
    private function payloadKey(string $token): string
    {
        return "main_search_engine_payload_{$token}";
    }

    /**
     * Generate cache key for stored live status.
     */
    private function statusKey(string $token): string
    {
        return "main_search_engine_status_{$token}";
    }
}
