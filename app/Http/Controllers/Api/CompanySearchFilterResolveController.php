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

    private function resolveRegion($value): array
    {
        if ($this->isAll($value)) {
            return ['id' => 'all', 'name' => 'All'];
        }

        $row = DB::table('regions')
            ->where('id', $value)
            ->orWhere('name', $value)
            ->first();

        return [
            'id' => $row->id ?? $value,
            'name' => $row->name ?? $value,
        ];
    }

    private function resolveCountry($value): array
    {
        if ($this->isAll($value)) {
            return ['id' => 'all', 'name' => 'All'];
        }

        $row = DB::table('countries_africans')
            ->where('countries_all_id', $value)
            ->orWhere('country_name', $value)
            ->first();

        return [
            'id' => $row->id ?? $value,
            'name' => $row->country_name ??  $value,
        ];
    }

    private function resolveState($value): array
    {
        if ($this->isAll($value)) {
            return ['id' => 'all', 'name' => 'All'];
        }

        $row = DB::table('states_all')
            ->where('id', $value)
            ->orWhere('name', $value)
            ->first();

        return [
            'id' => $row->id ?? $value,
            'name' => $row->name ?? $value,
        ];
    }

    private function resolveCity($value): array
    {
        if ($this->isAll($value)) {
            return ['id' => 'all', 'name' => 'All'];
        }

        $row = DB::table('cities_all')
            ->where('id', $value)
            ->orWhere('name', $value)
            ->first();

        return [
            'id' => $row->id ?? $value,
            'name' => $row->name ?? $value,
        ];
    }

    private function resolveSector($value): array
    {
        if ($this->isAll($value)) {
            return ['id' => 'all', 'name' => 'All'];
        }

        $row = DB::table('sectors')
            ->where('id', $value)
            ->orWhere('title', $value)
            ->first();

        return [
            'id' => $row->id ?? $value,
            'name' => $row->title ?? $row->name ?? $value,
        ];
    }

    private function resolveIndustry($value): array
    {
        if ($this->isAll($value)) {
            return ['id' => 'all', 'name' => 'All'];
        }

        $row = DB::table('industries')
            ->where('id', $value)
            ->orWhere('name', $value)
            ->first();

        return [
            'id' => $row->id ?? $value,
            'name' => $row->name ?? $row->title ?? $value,
        ];
    }
}
