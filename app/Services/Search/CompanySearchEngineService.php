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

        $count = $this->baseQuery($payload)->count();

        return [
            'count' => $count,
            'label' => $keyword,
            'grouped_results' => [],
        ];
    }

    private function dimensionResult(string $step, array $payload): array
    {
        $dimension = SearchDimensions::COLUMNS[$step];
        $idColumn = $dimension['filter_id'];
        $nameColumn = $dimension['result_name'];

        // The selected dimension remains active; each worker reports the
        // distribution of the final matching set, using one query per worker.
        $rows = $this->baseQuery($payload)
            ->selectRaw("{$idColumn} as value")
            ->selectRaw("COALESCE({$nameColumn}, 'Unknown') as name")
            ->selectRaw('COUNT(*) as total')
            // Verification uses the same column as both its ID and label.
            // De-duplicate group columns to avoid GROUP BY column, column.
            ->groupBy(...array_values(array_unique([$idColumn, $nameColumn])))
            ->orderByDesc('total')
            ->get();


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
        return $this->dimensionResult('region', $payload);
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
            'countries' => 'country_id',
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
