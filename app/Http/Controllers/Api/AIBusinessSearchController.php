<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\{JsonResponse, Request};
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;
use App\Jobs\BuildCompanySearchResults;
use App\Jobs\CountCompanySearchFacet;
use Illuminate\Database\Query\Builder;
use Illuminate\Validation\Rule;


class AIBusinessSearchController extends Controller
{


    public function getRegions(): JsonResponse
    {
        return response()->json(['data' => DB::table('regions')->select('id', 'name')->orderBy('name')->get()]);
    }
    public function getCountries(Request $r): JsonResponse
    {
        $v = $r->validate(['region_id' => ['required', 'integer', Rule::exists('regions', 'id')], 'page' => ['sometimes', 'integer', 'min:1']]);
        return response()->json(DB::table('countries_africans')->where('region_id', $v['region_id'])->select('countries_all_id as id', 'country_name as name')->orderBy('country_name')->paginate(12));
    }
    public function getStates(Request $r): JsonResponse
    {
        $v = $r->validate(['countries_id' => ['required', 'integer', Rule::exists('countries_africans', 'countries_all_id')], 'page' => ['sometimes', 'integer', 'min:1']]);
        return response()->json(DB::table('states_all')->where('country_id', $v['countries_id'])->select('id', 'name')->orderBy('name')->paginate(12));
    }
    public function getCities(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'state_id' => [
                'nullable',
                'integer',
                'required_without:state_ids',
                Rule::exists('states_all', 'id'),
            ],
            'state_ids' => [
                'nullable',
                'array',
                'min:1',
                'max:100',
                'required_without:state_id',
            ],
            'state_ids.*' => [
                'required',
                'integer',
                'distinct',
                Rule::exists('states_all', 'id'),
            ],
        ]);

        $stateIds = isset($validated['state_ids'])
            ? $validated['state_ids']
            : [$validated['state_id']];

        $cities = DB::table('cities_all')
            ->whereIn('state_id', $stateIds)
            ->select('id', 'name', 'state_id')
            ->orderBy('name')
            ->get();

        return response()->json(['data' => $cities]);
    }
    public function getSectors(): JsonResponse
    {
        return response()->json(['data' => DB::table('sectors')->select('id', 'title')->orderBy('title')->get()]);
    }
    public function getIndustries(Request $r): JsonResponse
    {
        $v = $r->validate(['sector_id' => ['required', 'integer', Rule::exists('sectors', 'id')]]);
        return response()->json(['data' => DB::table('industries')->where('sector_id', $v['sector_id'])->select('id', 'title')->orderBy('title')->get()]);
    }
    public function validateSearch(Request $r): JsonResponse
    {
        $v = $r->validate([
            'region_id' => ['required', 'integer'],
            'country_id' => ['required', 'integer'],
            'state_id' => ['nullable', 'integer'],
            'city_id' => ['nullable', 'integer'],
            'sector_id' => ['nullable', 'integer'],
            'industry_id' => ['nullable', 'integer'],
            'company_name' => ['nullable', 'string', 'max:255']
        ]);
        $q = DB::table('businesses')
            ->where('country_id', $v['country_id'])
            ->where('sector_id', $v['sector_id'])
            ->where('industry_id', $v['industry_id']);

        foreach (['state_id', 'city_id'] as $f)
            if (!empty($v[$f])) $q->where($f, $v[$f]);
        if (!empty($v['company_name']))
            $q->where('name', 'like', '%' . addcslashes($v['company_name'], '%_') . '%');
        $n = $q->count();

        return response()->json(['available' => $n > 0, 'count' => $n, 'url' => url('/explore') . '?' . http_build_query($v)]);
    }




    public function __invoke(Request $request): JsonResponse
    {
        $payload = $request->validate([
            'all_regions' => ['required', 'boolean'],
            'region_name' => ['nullable', 'string', 'max:150'],
            'regions' => ['sometimes', 'array'],
            'regions.*.id' => ['nullable'],
            'regions.*.name' => ['required_with:regions', 'string', 'max:150'],
            'country' => ['nullable', 'array'],
            'country.name' => ['nullable', 'string', 'max:150'],
            'states' => ['sometimes', 'array'],
            'states.*.id' => ['nullable'],
            'states.*.name' => ['required_with:states', 'string', 'max:150'],
            'cities' => ['sometimes', 'array'],
            'cities.*.id' => ['nullable'],
            'cities.*.name' => ['required_with:cities', 'string', 'max:150'],
            'sectors' => ['required', 'array', 'min:1'],
            'sectors.*.id' => ['nullable'],
            'sectors.*.name' => ['required', 'string', 'max:150'],
            'company_search' => ['required', 'array'],
            'company_search.mode' => ['required', Rule::in(['all'])],
            'company_search.list_all' => ['required', 'accepted'],
            'company_search.keyword' => ['nullable', 'string', 'max:200'],
        ]);

        if (!(bool) $payload['all_regions'] && blank($payload['region_name'] ?? null)) {
            return response()->json([
                'message' => 'A region is required unless all regions are selected.',
            ], 422);
        }

        $searchId = (string) Str::uuid();
        $facets = $this->facetDefinitions($payload);
        $jobs = collect($facets)
            ->map(fn(array $facet) => new CountCompanySearchFacet(
                $searchId,
                $payload,
                $facet['type'],
                $facet['name'],
            ))
            ->push(new BuildCompanySearchResults($searchId, $payload))
            ->all();

        // dump([
        //     'search_id' => $searchId,
        //     'job_count' => count($jobs),
        //     'facets' => $facets,
        // ]);


        $batch = Bus::batch($jobs)
            ->name("Raymoch company search {$searchId}")
            // ->onQueue('search')
            ->onQueue(config('search.queue_ai_search'))
            ->allowFailures()
            ->dispatch();

        Cache::put("raymoch-search:{$searchId}:meta", [
            'batch_id' => $batch->id,
            'facets' => $facets,
            'created_at' => now()->toISOString(),
        ], now()->addMinutes(30));

        return response()->json([
            'message' => 'The Raymoch search has been queued.',
            'search_id' => $searchId,
            'batch_id' => $batch->id,
            'status' => 'queued',
            'status_url' => route('business-search.companies.status', ['searchId' => $searchId]),
            'counts' => $this->emptyCounts($facets),
        ], 202);
    }

    public function searchStatus(string $searchId): JsonResponse
    {
        $meta = Cache::get("raymoch-search:{$searchId}:meta");
        if (!$meta) {
            return response()->json(['message' => 'Search not found or expired.'], 404);
        }

        $batch = Bus::findBatch($meta['batch_id']);
        if (!$batch) {
            return response()->json(['message' => 'The search batch is unavailable.'], 404);
        }

        $counts = ['countries' => [], 'states' => [], 'cities' => [], 'sectors' => []];
        foreach ($meta['facets'] as $facet) {
            $item = Cache::get($this->facetCacheKey($searchId, $facet));
            $counts[$this->facetBucket($facet['type'])][] = $item ?? [
                'type' => $facet['type'],
                'name' => $facet['name'],
                'count' => null,
            ];
        }

        $results = Cache::get("raymoch-search:{$searchId}:results");
        $complete = $batch->finished() && $results !== null;

        return response()->json([
            'search_id' => $searchId,
            'status' => $batch->cancelled()
                ? 'cancelled'
                : ($complete ? 'completed' : ($batch->hasFailures() ? 'processing_with_failures' : 'processing')),
            'progress' => $batch->progress(),
            'pending_jobs' => $batch->pendingJobs,
            'failed_jobs' => $batch->failedJobs,
            'counts' => $counts,
            'companies' => $complete ? $results : null,
        ], $complete ? 200 : 202);
    }

    private function facetDefinitions(array $payload): array
    {
        $country = data_get($payload, 'country.name') ?: 'All countries';
        $states = collect($payload['states'] ?? [])->pluck('name')->filter()->unique()->values();
        $cities = collect($payload['cities'] ?? [])->pluck('name')->filter()->unique()->values();
        $sectors = collect($payload['sectors'])->pluck('name')->filter()->unique()->values();

        return collect([['type' => 'country', 'name' => $country]])
            ->concat(($states->isEmpty() ? collect(['All states']) : $states)
                ->map(fn(string $name) => ['type' => 'state', 'name' => $name]))
            ->concat(($cities->isEmpty() ? collect(['All cities']) : $cities)
                ->map(fn(string $name) => ['type' => 'city', 'name' => $name]))
            ->concat($sectors->map(fn(string $name) => ['type' => 'sector', 'name' => $name]))
            ->values()
            ->all();
    }

    private function emptyCounts(array $facets): array
    {
        $counts = ['countries' => [], 'states' => [], 'cities' => [], 'sectors' => []];
        foreach ($facets as $facet) {
            $counts[$this->facetBucket($facet['type'])][] = [
                'type' => $facet['type'],
                'name' => $facet['name'],
                'count' => null,
            ];
        }
        return $counts;
    }

    private function facetBucket(string $type): string
    {
        return match ($type) {
            'country' => 'countries',
            'state' => 'states',
            'city' => 'cities',
            default => 'sectors',
        };
    }

    private function facetCacheKey(string $searchId, array $facet): string
    {
        return sprintf(
            'raymoch-search:%s:facet:%s',
            $searchId,
            sha1($facet['type'] . '|' . $facet['name']),
        );
    }
}
