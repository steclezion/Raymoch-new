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
        $constrainSelectedDimension = ! $this->hasKeyword($payload);

        // The selected dimension remains active; each worker reports the
        // distribution of the final matching set, using one query per worker.
        $query = $this->baseQuery($payload);

        // Keep the grouped worker independently constrained to its submitted
        // values. This prevents a region/sector/etc. tile from ever reporting
        // unselected groups if the shared query is changed in the future.
        if ($constrainSelectedDimension && $selectedValues !== []) {
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

        if ($constrainSelectedDimension && $selectedValues !== []) {
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

        // Without a keyword, Region is independent. A keyword activates the
        // full submitted filter set for this high-priority company search.
        $regionalPayload = $this->independentLocationPayload('region', $payload);

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
        return $this->dimensionResult(
            'country',
            $this->independentLocationPayload('country', $payload),
        );
    }

    public function searchState(array $payload): array
    {
        $dimension = SearchDimensions::COLUMNS['state'];
        $selectedValues = $this->selectedValues('state', $payload);

        // Without a keyword, State is independent. Keyword searches retain
        // every submitted location and business filter.
        $statePayload = $this->independentLocationPayload('state', $payload);

        $rows = $this->baseQuery($statePayload)
            ->selectRaw("{$dimension['filter_id']} as value")
            ->selectRaw("COALESCE({$dimension['result_name']}, 'Unknown') as name")
            ->selectRaw('COUNT(DISTINCT id) as total')
            ->groupBy($dimension['filter_id'], $dimension['result_name'])
            ->orderByDesc('total')
            ->get();

        $label = $selectedValues === []
            ? 'all'
            : collect($selectedValues)
                ->map(fn ($value) => $this->labelResolver->resolveOne(
                    $dimension,
                    $value,
                ) ?? (string) $value)
                ->join(', ');

        return [
            'count' => (int) $rows->sum('total'),
            'label' => $label,
            'selected_id' => $selectedValues,
            'display_name' => $label,
            'grouped_results' => $rows->map(static fn (object $row): array => [
                'value' => (string) ($row->value ?? ''),
                'name' => (string) $row->name,
                'count' => (int) $row->total,
            ])->values()->all(),
        ];
    }

    public function searchCity(array $payload): array
    {
        $dimension = SearchDimensions::COLUMNS['city'];
        $selectedValues = $this->selectedValues('city', $payload);

        // Without a keyword, City is independent. Keyword searches retain
        // every submitted location and business filter.
        $cityPayload = $this->independentLocationPayload('city', $payload);

        $rows = $this->baseQuery($cityPayload)
            ->selectRaw("{$dimension['filter_id']} as value")
            ->selectRaw("COALESCE({$dimension['result_name']}, 'Unknown') as name")
            ->selectRaw('COUNT(DISTINCT id) as total')
            ->groupBy($dimension['filter_id'], $dimension['result_name'])
            ->orderByDesc('total')
            ->get();

        $label = $selectedValues === []
            ? 'all'
            : collect($selectedValues)
                ->map(fn ($value) => $this->labelResolver->resolveOne(
                    $dimension,
                    $value,
                ) ?? (string) $value)
                ->join(', ');

        return [
            'count' => (int) $rows->sum('total'),
            'label' => $label,
            'selected_id' => $selectedValues,
            'display_name' => $label,
            'grouped_results' => $rows->map(static fn (object $row): array => [
                'value' => (string) ($row->value ?? ''),
                'name' => (string) $row->name,
                'count' => (int) $row->total,
            ])->values()->all(),
        ];
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
        $countryDimension = SearchDimensions::COLUMNS['country'];
        $verificationEnabled = (bool) ($payload['verification'] ?? false);

        // Verification is an independent queue task. It retains business
        // filters while grouping the applicable verification population by
        // country, irrespective of other geographic selections.
        $verificationPayload = $this->hasKeyword($payload)
            ? $payload
            : array_merge($payload, [
                'regions' => [],
                'countries' => [],
                'states' => [],
                'cities' => [],
            ]);

        $rows = $this->baseQuery($verificationPayload)
            ->selectRaw("{$countryDimension['filter_id']} as value")
            ->selectRaw("COALESCE({$countryDimension['result_name']}, 'Unknown') as name")
            ->selectRaw('COUNT(DISTINCT id) as total')
            ->groupBy(
                $countryDimension['filter_id'],
                $countryDimension['result_name'],
            )
            ->orderByDesc('total')
            ->get();

        return [
            'count' => (int) $rows->sum('total'),
            'label' => $verificationEnabled
                ? 'Verified and Pending'
                : 'Unverified and Pending',
            'selected_id' => null,
            'display_name' => $verificationEnabled ? 'ON' : 'OFF',
            'grouped_results' => $rows->map(static fn (object $row): array => [
                'value' => (string) ($row->value ?? ''),
                'name' => (string) $row->name,
                'count' => (int) $row->total,
            ])->values()->all(),
        ];
    }


    private function baseQuery(array $payload): Builder
    {
        $query = DB::table(config('search.source_view'));


        $keyword = trim((string) ($payload['keyword'] ?? ''));

        if ($keyword !== '') {
            $tokens = collect(preg_split('/[\s\p{P}]+/u', $keyword, -1, PREG_SPLIT_NO_EMPTY))
                ->map(static fn (string $token): string => mb_strtolower(trim($token)))
                ->filter()
                ->unique()
                ->values();

            $searchColumns = [
                'CompanyName',
                'trading_name',
                'business_description',
                'products_or_services',
                'website',
                'Email',
            ];

            // Require every normalized token, but allow each token to occur in
            // any searchable company field. This survives duplicate spaces,
            // punctuation and capitalization differences in imported data.
            foreach ($tokens as $token) {
                $escaped = str_replace(['\\', '%', '_'], ['\\\\', '\\%', '\\_'], $token);
                $like = "%{$escaped}%";

                $query->where(function (Builder $builder) use ($searchColumns, $like): void {
                    foreach ($searchColumns as $index => $column) {
                        $method = $index === 0 ? 'whereRaw' : 'orWhereRaw';
                        $builder->{$method}(
                            "LOWER(COALESCE({$column}, '')) LIKE ?",
                            [$like],
                        );
                    }
                });
            }

            // Keyword mode is intentionally high priority. Region is the only
            // optional narrowing filter; without a Region selection the query
            // searches the entire company view.
            $regionValues = $this->normalizedCollection($payload['regions'] ?? []);
            if ($regionValues !== []) {
                $query->whereIn('region_id', $regionValues);
            }

            return $query;
        }

        $collectionFilters = [
            'regions' => 'region_id',
            'countries' => 'co_main_ref_id',
            'states' => 'state_id',
            'cities' => 'city_id',
            'sectors' => 'sector_id',
            'industries' => 'industry_id',
        ];

        foreach ($collectionFilters as $payloadKey => $column) {
            $values = collect($payload[$payloadKey] ?? [])->filter()->unique()->values()->all();
            if ($values !== []) {
                $query->whereIn($column, $values);
            }
        }

        $verificationStatuses = ($payload['verification'] ?? false) === true
            ? ['verified', 'pending']
            : ['unverified', 'pending'];

        $query->whereIn(DB::raw('LOWER(VerificationStatus)'), $verificationStatuses);
        //dd($query);
        return $query;
    }

    private function selectedValues(string $step, array $payload): array
    {
        $collectionKeys = [
            'region' => 'regions',
            'country' => 'countries',
            'state' => 'states',
            'city' => 'cities',
            'sector' => 'sectors',
            'industry' => 'industries',
        ];

        if (! isset($collectionKeys[$step])) {
            return [];
        }

        return $this->normalizedCollection($payload[$collectionKeys[$step]] ?? []);
    }

    private function normalizedCollection(array $values): array
    {
        return collect($values)
            ->map(static fn (mixed $value): string => trim((string) $value))
            ->reject(static fn (string $value): bool => $value === '' || strtolower($value) === 'all')
            ->unique()
            ->values()
            ->all();
    }

    private function independentLocationPayload(string $step, array $payload): array
    {
        if ($this->hasKeyword($payload)) {
            return $payload;
        }

        $locationKeys = [
            'region' => 'regions',
            'country' => 'countries',
            'state' => 'states',
            'city' => 'cities',
        ];
        $selectedKey = $locationKeys[$step];
        $selectedValues = $payload[$selectedKey] ?? [];

        $scoped = array_merge($payload, [
            'regions' => [],
            'countries' => [],
            'states' => [],
            'cities' => [],
        ]);
        $scoped[$selectedKey] = $selectedValues;

        return $scoped;
    }

    private function hasKeyword(array $payload): bool
    {
        return trim((string) ($payload['keyword'] ?? '')) !== '';
    }

    private function resultsUrl(array $payload): string
    {
        $filters = array_filter(
            collect($payload)->except(['regions', 'countries', 'states', 'cities', 'sectors', 'industries'])->all(),
            static fn(mixed $value): bool => !in_array($value, [null, '', 'all', false], true),
        );
        foreach (['region', 'country', 'state', 'city', 'sector', 'industry'] as $dimension) {
            $plural = match ($dimension) {
                'country' => 'countries',
                'city' => 'cities',
                default => $dimension . 's',
            };
            if (! empty($payload[$plural])) {
                $filters[$dimension . '_ids'] = implode(',', $payload[$plural]);
            }
        }
        $filters['from'] = 'explore';

        return '/companies?' . http_build_query($filters);
    }
}
