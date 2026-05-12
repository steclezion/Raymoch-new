<?php

namespace App\Services\Search;

use Illuminate\Support\Facades\DB;

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

        if (!$this->hasConcreteValue($value)) {
            $rows = $this->baseCompanyQuery($payload, 'region')
                ->leftJoin('regions as r', 'c.Region', '=', 'r.id')
                ->selectRaw('COALESCE(r.name, "Unknown") as name, COUNT(c.id) as total')
                ->groupBy('r.id', 'r.name')
                ->orderByDesc('total')
                ->get();

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

        $rows = $this->baseCompanyQuery($payload, 'region')
            ->leftJoin('regions as r', 'c.Region', '=', 'r.id')
            ->where('c.Region', $value)
            ->selectRaw('COALESCE(r.name, "Unknown") as name, COUNT(c.id) as total')
            ->groupBy('r.id', 'r.name')
            ->first();

        $resolvedName = $rows->name ?? (string) $value;
        $count = (int) ($rows->total ?? 0);

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

    public function searchCountry(array $payload): array
    {
        $value = $payload['country'] ?? 'all';
        $value_region = $payload['region'] ?? 'all';


        if ($this->hasConcreteValue($value) === false && $this->hasConcreteValue($value_region) === true) {

            $rows = $this->baseCompanyQuery($payload, 'country')
                ->leftJoin('countries_africans as ca', 'c.Country', '=', 'ca.id')
                ->leftJoin('regions as r', 'r.id', '=', 'ca.region_id')
                ->selectRaw('COALESCE(ca.country_name, "Unknown") as name, COUNT(c.id) as total')
                ->groupBy('ca.id', 'ca.country_name')
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
        } elseif (!$this->hasConcreteValue($value) && !$this->hasConcreteValue($value_region)) {
            $rows = $this->baseCompanyQuery($payload, 'country')
                ->leftJoin('countries_africans as ca', 'c.Country', '=', 'ca.id')
                ->selectRaw('COALESCE(ca.country_name, "Unknown") as name, COUNT(c.id) as total')
                ->groupBy('ca.id', 'ca.country_name')
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
        } else {
            $rows = $this->baseCompanyQuery($payload, 'country')
                ->leftJoin('countries_africans as ca', 'c.Country', '=', 'ca.id')
                ->where('c.Country', $value)
                ->selectRaw('COALESCE(ca.country_name, "Unknown") as name, COUNT(c.id) as total')
                ->groupBy('ca.id', 'ca.country_name')
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
    }

    public function searchState(array $payload): array
    {
        $value = $payload['state'] ?? 'all';

        if (!$this->hasConcreteValue($value)) {
            $rows = $this->baseCompanyQuery($payload, 'state')
                ->leftJoin('states_all as s', 'c.state_id', '=', 's.id')
                ->selectRaw('COALESCE(s.name, "Unknown") as name, COUNT(c.id) as total')
                ->groupBy('s.id', 's.name')
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

        $rows = $this->baseCompanyQuery($payload, 'state')
            ->leftJoin('states_all as s', 'c.state_id', '=', 's.id')
            ->where('c.state_id', $value)
            ->selectRaw('COALESCE(s.name, "Unknown") as name, COUNT(c.id) as total')
            ->groupBy('s.id', 's.name')
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

        if (!$this->hasConcreteValue($value)) {
            $rows = $this->baseCompanyQuery($payload, 'industry')
                ->selectRaw('COALESCE(c.industry_id, "Unknown") as name, COUNT(c.id) as total')
                ->groupBy('c.industry_id')
                ->orderByDesc('total')
                ->get();

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

        $rows = $this->baseCompanyQuery($payload, 'industry')
            ->leftJoin('industries as i', 'c.industry_id', '=', 'i.id')
            ->leftJoin('sectors as s', 'c.sector_id', '=', 'i.sector_id')
            ->where('c.industry_id', $value)
            ->selectRaw('COALESCE(i.name, "Unknown") as name, COUNT(c.id) as total')
            ->groupBy('c.industry_id')
            ->get();

        $resolvedName = (string) ($rows->first()->name ?? $value);
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
