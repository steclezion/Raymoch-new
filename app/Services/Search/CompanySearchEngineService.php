<?php

namespace App\Services\Search;

use App\Support\SearchFilterLabelResolver;
use App\Support\SearchDimensions;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class CompanySearchEngineService
{
    public function __construct(
        protected StartSearchService $starter,
        protected SearchFilterLabelResolver $labelResolver,
    ) {}

    public function processStep(string $step, string $token): array
    {
        $payload = Cache::store(config('search.cache_store'))
            ->get($this->starter->payloadKey($token));
        if (!$payload) {
            throw new RuntimeException('The search payload expired.');
        }

        return match ($step) {
            'results' => $this->searchResults($payload),
            'keyword' => $this->searchKeyword($payload),
            'region' => $this->searchRegion($payload),
            'country' => $this->searchCountry($payload),
            'state' => $this->searchState($payload),
            'city' => $this->searchCity($payload),
            'sector' => $this->searchSector($payload),
            'industry' => $this->searchIndustry($payload),
            'verification' => $this->searchVerification($payload),
            default => throw new RuntimeException("Unknown search step: {$step}"),
        };
    }

    public function results(array $payload, int $page): array
    {
        $rows = $this->baseQuery($payload)
            ->distinct()
            ->select([
                'id as company_id',
                'CompanyName as company_name',
                'website',
                'region_name',
                'country_name',
                'state_name',
                'city_name',
                'sector_title as sector_name',
                'industry_name',
                'VerificationStatus as verification_status',
            ])
            ->orderBy('id')
            ->paginate(20, ['*'], 'page', $page);

        return [
            'data' => $rows->items(),
            'current_page' => $rows->currentPage(),
            'per_page' => $rows->perPage(),
            'total' => $rows->total(),
            'last_page' => $rows->lastPage(),
            'url' => $this->resultsUrl($payload),
        ];
    }

    public function searchKeyword(array $payload): array
    {
        $keyword = $payload['keyword'];
        if ($keyword === '') {
            return [
                'count' => 0,
                'label' => 'No keyword supplied',
                'grouped_results' => [],
                'skipped' => true,
            ];
        }

        $count = $this->baseQuery($payload)->distinct()->count('id');

        return [
            'count' => $count,
            'label' => $keyword,
            'grouped_results' => [],
        ];
    }

    public function searchResults(array $payload): array
    {
        return [
            'count' => $this->baseQuery($payload)->distinct()->count('id'),
            'label' => 'Matching companies',
            'grouped_results' => [],
        ];
    }

    private function dimensionResult(string $step, array $payload): array
    {
        $dimension = SearchDimensions::COLUMNS[$step];
        $idColumn = $dimension['filter_id'];
        $nameColumn = $dimension['result_name'];
        $selectedValues = $this->selectedValues($step, $payload);

        // The selected dimension remains active; each worker reports the
        // distribution of the final matching set, using one query per worker.
        $query = $this->baseQuery($payload);

        // Keep the grouped worker independently constrained to its submitted
        // values. This prevents a region/sector/etc. tile from ever reporting
        // unselected groups if the shared query is changed in the future.
        if ($selectedValues !== []) {
            $query->whereIn($idColumn, $selectedValues);
        }

        $rows = $query
            ->selectRaw("{$idColumn} as value")
            ->selectRaw("COALESCE({$nameColumn}, 'Unknown') as name")
            ->selectRaw('COUNT(DISTINCT id) as total')
            // Verification uses the same column as both its ID and label.
            // De-duplicate group columns to avoid GROUP BY column, column.
            ->groupBy(...array_values(array_unique([$idColumn, $nameColumn])))
            ->orderByDesc('total')
            ->get();

        if ($selectedValues !== []) {
            $selected = array_fill_keys(array_map('strval', $selectedValues), true);
            $rows = $rows
                ->filter(static fn (object $row): bool => isset($selected[(string) $row->value]))
                ->values();
        }


        $collectionKeys = [
            'region' => 'regions',
            'country' => 'countries',
            'state' => 'states',
            'sector' => 'sectors',
            'industry' => 'industries',
        ];
        $selectedValue = isset($collectionKeys[$step])
            ? ($payload[$collectionKeys[$step]] ?? [])
            : ($payload[$step] ?? 'all');

        if (is_array($selectedValue)) {
            $label = $selectedValue === []
                ? 'all'
                : collect($selectedValue)
                    ->map(fn ($value) => $this->labelResolver->resolveOne($dimension, $value) ?? (string) $value)
                    ->join(', ');
        } else {
            $label = $step === 'verification'
                ? (($payload['verification'] ?? false) ? 'ON' : 'OFF')
                : ($selectedValue === 'all'
                    ? 'all'
                    : ($this->labelResolver->resolveOne($dimension, $selectedValue)
                        ?? (string) ($rows->first()->name ?? $selectedValue)));
        }

        return [
            'count' => (int) $rows->sum('total'),
            'label' => $label,
            'selected_id' => $step === 'verification' ? null : $selectedValue,
            'display_name' => $label,
            'grouped_results' => $rows->map(static fn(object $row): array => [
                'value' => (string) ($row->value ?? ''),
                'name' => (string) $row->name,
                'count' => (int) $row->total,
            ])->values()->all(),
        ];
    }

    public function searchRegion(array $payload): array
    {
        $regionValues = $this->selectedValues('region', $payload);
        $regionDimension = SearchDimensions::COLUMNS['region'];
        $countryDimension = SearchDimensions::COLUMNS['country'];

        // The region worker answers a regional question. Country, state and
        // city are intentionally removed so the regional total is not reduced
        // to the user's narrower location selection. All non-location filters
        // (keyword, sectors, industries and verification) remain active.
        $regionalPayload = array_merge($payload, [
            'countries' => [],
            'states' => [],
            'city' => 'all',
        ]);

        $query = $this->baseQuery($regionalPayload);

        if ($regionValues !== []) {
            $query->whereIn($regionDimension['filter_id'], $regionValues);
        }

        $rows = $query
            ->selectRaw("{$countryDimension['filter_id']} as value")
            ->selectRaw("COALESCE({$countryDimension['result_name']}, 'Unknown') as name")
            ->selectRaw('COUNT(DISTINCT id) as total')
            ->groupBy(
                $countryDimension['filter_id'],
                $countryDimension['result_name'],
            )
            ->orderByDesc('total')
            ->get();

        $label = $regionValues === []
            ? 'all'
            : collect($regionValues)
                ->map(fn ($value) => $this->labelResolver->resolveOne(
                    $regionDimension,
                    $value,
                ) ?? (string) $value)
                ->join(', ');

        return [
            'count' => (int) $rows->sum('total'),
            'label' => $label,
            'selected_id' => $regionValues,
            'display_name' => $label,
            'grouped_results' => $rows->map(static fn (object $row): array => [
                'value' => (string) ($row->value ?? ''),
                'name' => (string) $row->name,
                'count' => (int) $row->total,
            ])->values()->all(),
        ];
    }

    public function searchCountry(array $payload): array
    {
        return $this->dimensionResult('country', $payload);
    }

    public function searchState(array $payload): array
    {
        return $this->dimensionResult('state', $payload);
    }

    public function searchCity(array $payload): array
    {
        return $this->dimensionResult('city', $payload);
    }

    public function searchSector(array $payload): array
    {
        return $this->dimensionResult('sector', $payload);
    }

    public function searchIndustry(array $payload): array
    {
        return $this->dimensionResult('industry', $payload);
    }

    public function searchVerification(array $payload): array
    {
        return $this->dimensionResult('verification', $payload);
    }


    private function baseQuery(array $payload): Builder
    {
        $query = DB::table(config('search.source_view'));


        $keyword = trim((string) ($payload['keyword'] ?? ''));

        if ($keyword !== '') {
            $like = "%{$keyword}%";

            $query->where(function (Builder $builder) use ($like): void {
                $builder->where('CompanyName', 'like', $like)
                    ->orWhere('business_description', 'like', $like)
                    ->orWhere('website', 'like', $like)
                    ->orWhere('Email', 'like', $like);
            });
        }

        $filters = [
            'city'     => 'city_id',
        ];

        foreach ($filters as $payloadKey => $column) {
            $value = $payload[$payloadKey] ?? 'all';

            if ($value !== 'all' && $value !== '' && $value !== null) {
                $query->where($column, $value);
            }
        }

        $collectionFilters = [
            'regions' => 'region_id',
            'countries' => 'co_main_ref_id',
            'states' => 'state_id',
            'sectors' => 'sector_id',
            'industries' => 'industry_id',
        ];

        foreach ($collectionFilters as $payloadKey => $column) {
            $values = collect($payload[$payloadKey] ?? [])->filter()->unique()->values()->all();
            if ($values !== []) {
                $query->whereIn($column, $values);
            }
        }

        if (($payload['verification'] ?? false) === true) {
            $query->where('VerificationStatus', 'Verified');
        }
        //dd($query);
        return $query;
    }

    private function selectedValues(string $step, array $payload): array
    {
        $collectionKeys = [
            'region' => 'regions',
            'country' => 'countries',
            'state' => 'states',
            'sector' => 'sectors',
            'industry' => 'industries',
        ];

        if (! isset($collectionKeys[$step])) {
            return [];
        }

        return collect($payload[$collectionKeys[$step]] ?? [])
            ->map(static fn (mixed $value): string => trim((string) $value))
            ->reject(static fn (string $value): bool => $value === '' || strtolower($value) === 'all')
            ->unique()
            ->values()
            ->all();
    }

    private function resultsUrl(array $payload): string
    {
        $filters = array_filter(
            collect($payload)->except(['regions', 'countries', 'states', 'sectors', 'industries'])->all(),
            static fn(mixed $value): bool => !in_array($value, [null, '', 'all', false], true),
        );
        foreach (['region', 'country', 'state', 'sector', 'industry'] as $dimension) {
            $plural = $dimension === 'country' ? 'countries' : $dimension . 's';
            if (! empty($payload[$plural])) {
                $filters[$dimension . '_ids'] = implode(',', $payload[$plural]);
            }
        }
        $filters['from'] = 'explore';

        return '/companies?' . http_build_query($filters);
    }
}
