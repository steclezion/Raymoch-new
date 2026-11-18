<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CompanySearchFilterResolveController extends Controller
{
    public function resolve(Request $request)
    {
        $regionId = $request->query('region_id') ?? $request->query('region');
        $countryId = $request->query('country_id') ?? $request->query('country');
        $stateId = $request->query('state_id') ?? $request->query('state');
        $cityId = $request->query('city_id') ?? $request->query('city');
        $sectorId = $request->query('sector_id') ?? $request->query('sector');
        $industryId = $request->query('industry_id') ?? $request->query('industry');

        return response()->json([
            'ok' => true,
            'data' => [
                'keyword' => $request->query('keyword') ?? $request->query('q') ?? '',
                'region' => $this->resolveRegion($regionId),
                'country' => $this->resolveCountry($countryId),
                'state' => $this->resolveState($stateId),
                'city' => $this->resolveCity($cityId),
                'sector' => $this->resolveSector($sectorId),
                'industry' => $this->resolveIndustry($industryId),
                'verification' => $request->query('verification') ?? $request->query('verified') ?? 'OFF',
            ],
        ]);
    }

    private function isAll($value): bool
    {
        return !$value || strtolower(trim((string) $value)) === 'all';
    }

    private function values($value): array
    {
        if ($this->isAll($value)) {
            return [];
        }

        return collect(explode(',', (string) $value))
            ->map(fn ($item) => trim($item))
            ->filter()
            ->unique()
            ->values()
            ->all();
    }

    private function resolveRegion($value): array
    {
        if ($this->isAll($value)) {
            return ['id' => 'all', 'name' => 'All'];
        }

        $values = $this->values($value);
        $rows = DB::table('regions')
            ->whereIn('id', $values)
            ->orWhereIn('name', $values)
            ->get();

        return [
            'id' => implode(',', $values),
            'name' => $rows->pluck('name')->implode(', ') ?: implode(', ', $values),
        ];
    }

    private function resolveCountry($value): array
    {
        if ($this->isAll($value)) {
            return ['id' => 'all', 'name' => 'All'];
        }

        $values = $this->values($value);
        $rows = DB::table('countries_africans')
            ->whereIn('countries_all_id', $values)
            ->orWhereIn('country_name', $values)
            ->get();

        return [
            'id' => implode(',', $values),
            'name' => $rows->pluck('country_name')->implode(', ') ?: implode(', ', $values),
        ];
    }

    private function resolveState($value): array
    {
        if ($this->isAll($value)) {
            return ['id' => 'all', 'name' => 'All'];
        }

        $values = $this->values($value);
        $rows = DB::table('states_all')
            ->whereIn('id', $values)
            ->orWhereIn('name', $values)
            ->get();

        return [
            'id' => implode(',', $values),
            'name' => $rows->pluck('name')->implode(', ') ?: implode(', ', $values),
        ];
    }

    private function resolveCity($value): array
    {
        if ($this->isAll($value)) {
            return ['id' => 'all', 'name' => 'All'];
        }

        $values = $this->values($value);
        $rows = DB::table('cities_all')
            ->whereIn('id', $values)
            ->orWhereIn('name', $values)
            ->get();

        return [
            'id' => implode(',', $values),
            'name' => $rows->pluck('name')->implode(', ') ?: implode(', ', $values),
        ];
    }

    private function resolveSector($value): array
    {
        if ($this->isAll($value)) {
            return ['id' => 'all', 'name' => 'All'];
        }

        $values = $this->values($value);
        $rows = DB::table('sectors')
            ->whereIn('id', $values)
            ->orWhereIn('title', $values)
            ->get();

        return [
            'id' => implode(',', $values),
            'name' => $rows->map(fn ($row) => $row->title ?? $row->name)->implode(', ') ?: implode(', ', $values),
        ];
    }

    private function resolveIndustry($value): array
    {
        if ($this->isAll($value)) {
            return ['id' => 'all', 'name' => 'All'];
        }

        $values = $this->values($value);
        $rows = DB::table('industries')
            ->whereIn('id', $values)
            ->orWhereIn('name', $values)
            ->get();

        return [
            'id' => implode(',', $values),
            'name' => $rows->map(fn ($row) => $row->name ?? $row->title)->implode(', ') ?: implode(', ', $values),
        ];
    }
}
