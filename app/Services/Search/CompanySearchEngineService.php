<?php

namespace App\Services\Search;

use Illuminate\Support\Facades\DB;
use App\Models\Company;

class CompanySearchEngineService
{
    public function processStep(string $stepName, array $payload): array
    {
        return match ($stepName) {
            'keyword'      => $this->searchKeyword($payload),
            'region'       => $this->searchRegion($payload),
            'country'      => $this->searchCountry($payload),
            'state'        => $this->searchState($payload),
            'city'         => $this->searchCity($payload),
            'sector'       => $this->searchSector($payload),
            'industry'     => $this->searchIndustry($payload),
            'verification' => $this->searchVerification($payload),
            default        => [
                'count' => 0,
                'ids' => [],
                'label' => 'all',
                'grouped_results' => [],
            ],
        };
    }

    public function baseCompanyQuery(array $payload, ?string $exclude = null)
    {
        $query = DB::table('companies as c');

        if ($exclude !== 'keyword') {
            $keyword = trim((string) ($payload['keyword'] ?? ''));
            if ($keyword !== '') {
                $query->where(function ($q) use ($keyword) {
                    $q->where('c.CompanyName', 'like', "%{$keyword}%")
                        ->orWhere('c.Description', 'like', "%{$keyword}%")
                        ->orWhere('c.website', 'like', "%{$keyword}%")
                        ->orWhere('c.Email', 'like', "%{$keyword}%");
                });
            }
        }

        if ($exclude !== 'sector' && $this->hasConcreteValue($payload['sector'] ?? null)) {
            $query->where('c.Sector', $payload['sector']);
        }

        if ($exclude !== 'industry' && $this->hasConcreteValue($payload['industry'] ?? null)) {
            $query->where('c.industry_id', $payload['industry']);
        }

        if ($exclude !== 'region' && $this->hasConcreteValue($payload['region'] ?? null)) {
            $query->where('c.Region', $payload['region']);
        }

        if ($exclude !== 'country' && $this->hasConcreteValue($payload['country'] ?? null)) {
            $query->where('c.Country', $payload['country']);
        }

        if ($exclude !== 'state' && $this->hasConcreteValue($payload['state'] ?? null)) {
            $query->where('c.state_id', $payload['state']);
        }

        if ($exclude !== 'city' && $this->hasConcreteValue($payload['city'] ?? null)) {
            $query->where('c.City', $payload['city']);
        }

        if ($exclude !== 'verification' && (bool) ($payload['verification'] ?? false) === true) {
            $query->where('c.VerificationStatus', 'Verified');
        }

        return $query;
    }

    public function searchKeyword(array $payload): array
    {
        $keyword = trim((string) ($payload['keyword'] ?? ''));

        if ($keyword === '') {
            return [
                'count' => 0,
                'ids' => [],
                'label' => '(empty)',
                'grouped_results' => [],
            ];
        }

        $rows = $this->baseCompanyQuery($payload, 'keyword')
            ->select('c.id')
            ->where(function ($q) use ($keyword) {
                $q->where('c.CompanyName', 'like', "%{$keyword}%")
                    ->orWhere('c.Description', 'like', "%{$keyword}%")
                    ->orWhere('c.website', 'like', "%{$keyword}%")
                    ->orWhere('c.Email', 'like', "%{$keyword}%");
            })
            ->limit(5000)
            ->get();

        return [
            'count' => $rows->count(),
            'ids' => $rows->pluck('id')->values()->all(),
            'label' => $keyword,
            'grouped_results' => [],
        ];
    }

    public function searchRegion(array $payload): array
    {
        $value = $payload['region'] ?? 'all';


        $rows = DB::table('companies as c')
            ->leftJoin('regions as r', 'c.Region', '=', 'r.id')
            ->selectRaw('COALESCE(r.name, "Unknown") as name, COUNT(c.id) as total')
            ->where(function ($rows) use ($value) {
                if ($this->hasConcreteValue($value)) {
                    $rows->where('c.Region', $value);
                }
            })
            ->groupBy('r.id', 'r.name')
            ->orderByDesc('total')
            ->get();


        if ($this->hasConcreteValue($value) == false) {
            $rows = $this->baseCompanyQuery($payload, 'region')
                ->leftJoin('regions as r', 'c.Region', '=', 'r.id')
                ->selectRaw('COALESCE(r.name, "Unknown") as name, COUNT(c.id) as total')
                ->groupBy('r.id', 'r.name')
                ->orderByDesc('total')
                ->get();
        }


        return [
            'count' => (int) $rows->sum('total'),
            'ids' => [],
            'label' => 'all',
            'grouped_results' => $rows->map(fn($row) => [
                'name' => (string) $row->name,
                'count' => (int) $row->total,
            ])->values()->all(),
        ];
    }

    public function searchCountry(array $payload): array
    {
        $value = $payload['country'] ?? 'all';
        $value_region = $payload['region'] ?? 'all';
        $value_sector = $payload['sector'] ?? 'all';



        if ($this->hasConcreteValue($value) === false && $this->hasConcreteValue($value_region) === true) {
            $sampleMessage = "region has value but country doesn't, so grouping by country within the region filter\n";

            $select_distinct_regions = Company::query()
                ->where('Region', $value_region)
                ->selectRaw('DISTINCT Country')
                ->get();

            $rows = DB::table('companies as c')
                ->leftJoin('countries_africans as ca', 'c.Country', '=', 'ca.id')
                ->selectRaw('COALESCE(ca.country_name, "Unknown") as name, COUNT(c.id) as total')
                ->wherein('c.Country', $select_distinct_regions->pluck('Country')->values()->all())
                ->groupBy('ca.id', 'ca.country_name')
                ->orderByDesc('total')
                ->get();
        } elseif (!$this->hasConcreteValue($value) && !$this->hasConcreteValue($value_region)) {
            $rows = $this->baseCompanyQuery($payload, 'country')
                ->leftJoin('countries_africans as ca', 'c.Country', '=', 'ca.id')
                ->selectRaw('COALESCE(ca.country_name, "Unknown") as name, COUNT(c.id) as total')
                ->groupBy('ca.id', 'ca.country_name')
                ->orderByDesc('total')
                ->get();
        } elseif ($this->hasConcreteValue($value) == true && $this->hasConcreteValue($value_region) == true) {


            $select_unique_country_id = DB::table('countries_africans as ca')
                ->selectRaw('ca.id as id')
                ->where('ca.countries_all_id', $value)
                ->first();


            $rows = DB::table('companies as c')
                ->leftJoin('countries_africans as ca', 'c.Country', '=', 'ca.id')
                ->selectRaw('COALESCE(ca.country_name, "Unknown") as name, COUNT(c.id) as total')
                ->where('c.Country', $select_unique_country_id->id)
                ->where('c.Sector', $value_sector)
                ->groupBy('ca.id', 'ca.country_name')
                ->orderByDesc('total')
                // dd($rows->toSql(), $rows->getBindings());
                ->get();
        }
        return [
            'count' => (int) $rows->sum('total'),
            'ids' => [],
            'label' => 'all',
            'grouped_results' => $rows->map(fn($row) => [
                'name' => $row->name,
                'count' => (int) $row->total,
            ])->values()->all(),
        ];
    }

    public function searchState(array $payload): array
    {
        $value = $payload['state'] ?? 'all';
        $value_country = $payload['country'] ?? 'all';
        $value_sector = $payload['sector'] ?? 'all';

        $select_country_id_from_africa = DB::table('countries_africans as ca')
            ->where('ca.countries_all_id', $value_country)
            ->selectRaw('ca.id')
            ->first();


        if (!$this->hasConcreteValue($value) &&  !$this->hasConcreteValue($value_country)) {
            $rows = $this->baseCompanyQuery($payload, 'state')
                ->leftJoin('states_all as s', 'c.state_id', '=', 's.id')
                ->selectRaw('COALESCE(s.name, "Unknown") as name, COUNT(c.id) as total')
                ->groupBy('s.id', 's.name')
                ->orderByDesc('total')
                ->get();
        }
        if ($this->hasConcreteValue($value) == false &&  $this->hasConcreteValue($value_country) == true) {

            $select_distinct_states_id = DB::table('companies as c')
                ->where('c.Sector', $value_sector)
                ->where('c.Country', $select_country_id_from_africa->id)
                ->selectRaw('DISTINCT c.state_id')
                ->get();

            // dd($select_distinct_states_id->toSql(), $select_distinct_states_id->getBindings());

            $rows = DB::table('companies as c')
                ->leftJoin('countries_africans as ca', 'c.Country', '=', 'ca.id')
                ->leftJoin('states_all as sa', 'ca.countries_all_id', '=', 'sa.country_id')
                ->selectRaw('COALESCE(sa.name, "Unknown") as name, COUNT(c.id) as total')
                ->wherein('c.state_id', $select_distinct_states_id->pluck('state_id')->values()->all())
                ->groupBy('sa.id', 'sa.name')
                ->orderByDesc('total')
                ->get();
            // dd($select_distinct_states_id->pluck('state_id')->values()->all(), $rows->toSql(), $rows->getBindings());
        }
        if ($this->hasConcreteValue($value) == false &&  $this->hasConcreteValue($value_country) == true) {

            $select_distinct_states_id = DB::table('companies as c')
                ->where('c.Sector', $value_sector)
                ->where('c.Country', $select_country_id_from_africa->id)
                ->selectRaw('DISTINCT c.state_id')
                ->get();

            // dd($select_distinct_states_id->toSql(), $select_distinct_states_id->getBindings());

            $rows = DB::table('companies as c')
                ->Join('countries_africans as ca', 'c.Country', '=', 'ca.id')
                ->Join('states_all as sa', 'ca.countries_all_id', '=', 'sa.country_id')
                ->selectRaw('COALESCE(sa.name, "Unknown") as name, COUNT(c.id) as total')
                ->wherein('c.state_id', $select_distinct_states_id->pluck('state_id')->values()->all())
                ->where('c.Sector', $value_sector)
                ->groupBy('sa.id', 'sa.name')
                ->orderByDesc('total')
                ->get();
            // dd($select_distinct_states_id->pluck('state_id')->values()->all(), $rows->toSql(), $rows->getBindings());
        }
        if ($this->hasConcreteValue($value) == true &&  $this->hasConcreteValue($value_country) == true) {

            $rows = DB::table('companies as c')
                ->leftJoin('countries_africans as ca', 'c.Country', '=', 'ca.id')
                ->leftJoin('states_all as sa', 'ca.countries_all_id', '=', 'sa.country_id')
                ->selectRaw('COALESCE(sa.name, "Unknown") as name, COUNT(c.id) as total')
                ->where('c.state_id', $value)
                ->where('c.Sector', $value_sector)
                ->groupBy('sa.id', 'sa.name')
                ->orderByDesc('total')
                ->get();
        }

        return [
            'count' => (int) $rows->sum('total'),
            'ids' => [],
            'label' => 'all',
            'grouped_results' => $rows->map(fn($row) => [
                'name' => $row->name,
                'count' => (int) $row->total,
            ])->values()->all(),
        ];
    }

    public function searchCity(array $payload): array
    {
        $value = $payload['city'] ?? 'all';

        if (!$this->hasConcreteValue($value)) {
            $rows = $this->baseCompanyQuery($payload, 'city')
                ->leftJoin('cities_all as ci', 'c.City', '=', 'ci.id')
                ->selectRaw('COALESCE(ci.name, "Unknown") as name, COUNT(c.id) as total')
                ->groupBy('ci.id', 'ci.name')
                ->orderByDesc('total')
                ->get();

            return [
                'count' => (int) $rows->sum('total'),
                'ids' => [],
                'label' => 'all',
                'grouped_results' => $rows->map(fn($row) => [
                    'name' => $row->name,
                    'count' => (int) $row->total,
                ])->values()->all(),
            ];
        }

        $rows = $this->baseCompanyQuery($payload, 'city')
            ->leftJoin('cities_all as ci', 'c.City', '=', 'ci.id')
            ->where('c.City', $value)
            ->selectRaw('COALESCE(ci.name, "Unknown") as name, COUNT(c.id) as total')
            ->groupBy('ci.id', 'ci.name')
            ->get();

        $resolvedName = $rows->first()->name ?? (string) $value;
        $count = (int) ($rows->first()->total ?? 0);

        return [
            'count' => $count,
            'ids' => [],
            'label' => $resolvedName,
            'grouped_results' => [[
                'name' => $resolvedName,
                'count' => $count,
            ]],
        ];
    }

    public function searchSector(array $payload): array
    {
        $value = $payload['sector'] ?? 'all';

        if (!$this->hasConcreteValue($value)) {
            $rows = $this->baseCompanyQuery($payload, 'sector')
                ->leftJoin('sectors as s', 'c.Sector', '=', 's.id')
                ->selectRaw('COALESCE(s.title, "Unknown") as name, COUNT(c.id) as total')
                ->groupBy('s.id', 's.title')
                ->orderByDesc('total')
                ->get();

            return [
                'count' => (int) $rows->sum('total'),
                'ids' => [],
                'label' => 'all',
                'grouped_results' => $rows->map(fn($row) => [
                    'name' => $row->name,
                    'count' => (int) $row->total,
                ])->values()->all(),
            ];
        }

        $rows = $this->baseCompanyQuery($payload, 'sector')
            ->leftJoin('sectors as s', 'c.Sector', '=', 's.id')
            ->where('c.Sector', $value)
            ->selectRaw('COALESCE(s.title, "Unknown") as name, COUNT(c.id) as total')
            ->groupBy('s.id', 's.title')
            ->get();

        $resolvedName = $rows->first()->name ?? (string) $value;
        $count = (int) ($rows->first()->total ?? 0);

        return [
            'count' => $count,
            'ids' => [],
            'label' => $resolvedName,
            'grouped_results' => [[
                'name' => $resolvedName,
                'count' => $count,
            ]],
        ];
    }

    public function searchIndustry(array $payload): array
    {
        $value = $payload['industry'] ?? 'all';
        $value_sector = $payload['sector'] ?? 'all';

        if ($this->hasConcreteValue($value) == false) {
            $rows = DB::table('companies as c')
                ->leftJoin('industries as i', 'c.industry_id', '=', 'i.id')
                ->leftJoin('sectors as s', 's.id', '=', 'i.sector_id')
                ->selectRaw('COALESCE(i.name, "Unknown") as name, COUNT(c.id) as total')
                ->groupBy('c.industry_id', 'i.name')
                ->get();
            if (@$rows->first()->name == null || @$rows->first()->total == 0) {
                $resolvedName = 'Unknown-Not found';
                $count = 0;
            } else {
                $resolvedName = (string) ($rows->first()->name ?? $value);
                $count = (int) ($rows->first()->total ?? 0);
            }
            return [
                'count' => (int) $rows->sum('total'),
                'ids' => [],
                'label' => 'all',
                'grouped_results' => $rows->map(fn($row) => [
                    'name' => (string)   $resolvedName,
                    'count' => (int) $count,
                ])->values()->all(),
            ];
        }


        if ($this->hasConcreteValue($value) == true) {
            $rows = DB::table('companies as c')
                ->leftJoin('industries as i', 'c.industry_id', '=', 'i.id')
                ->leftJoin('sectors as s', 's.id', '=', 'i.sector_id')
                ->where('c.industry_id', $value)
                ->selectRaw('COALESCE(i.name, "Unknown") as name, COUNT(c.id) as total')
                ->groupBy('c.industry_id', 'i.name')
                ->get();
            $resolvedName = (string) ($rows->first()->name ?? $value);
            $count = (int) ($rows->first()->total ?? 0);
            // dd($rows->toSql(), $rows->getBindings());
            if (@$rows->first()->name == null || @$rows->first()->total == 0) {
                $resolvedName = 'Unknown-Not found';
                $count = 0;
            }
        }
        return [
            'count' => $count,
            'ids' => [],
            'label' => $resolvedName,
            'grouped_results' => [[
                'name' => $resolvedName,
                'count' => $count,
            ]],
        ];
    }

    public function searchVerification(array $payload): array
    {
        $isVerifiedOnly = (bool) ($payload['verification'] ?? false);

        if (!$isVerifiedOnly) {
            $rows = $this->baseCompanyQuery($payload, 'verification')
                ->selectRaw('COALESCE(c.VerificationStatus, "Unknown") as name, COUNT(c.id) as total')
                ->groupBy('c.VerificationStatus')
                ->orderByDesc('total')
                ->get();

            return [
                'count' => (int) $rows->sum('total'),
                'ids' => [],
                'label' => 'OFF',
                'grouped_results' => $rows->map(fn($row) => [
                    'name' => $row->name,
                    'count' => (int) $row->total,
                ])->values()->all(),
            ];
        }

        $rows = $this->baseCompanyQuery($payload, 'verification')
            ->where('c.VerificationStatus', 'Verified')
            ->selectRaw('"Verified" as name, COUNT(c.id) as total')
            ->groupBy('name')
            ->get();

        $count = (int) ($rows->first()->total ?? 0);

        return [
            'count' => $count,
            'ids' => [],
            'label' => 'ON',
            'grouped_results' => [[
                'name' => 'Verified',
                'count' => $count,
            ]],
        ];
    }

    public function hasConcreteValue(mixed $value): bool
    {
        return !in_array($value, [null, '', 'all'], true);
    }
}
