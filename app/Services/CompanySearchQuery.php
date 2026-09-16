<?php

namespace App\Services;

use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\DB;

final class CompanySearchQuery
{
    public static function base(array $payload): Builder
    {
        $query = DB::table('raymoch_all_in_all_search');
        self::applyRegion($query, $payload);

        return $query;
    }



    public static function results(array $payload): Builder
    {
        $query = self::base($payload);
        self::applyCountry($query, $payload);
        self::applyStates($query, $payload);
        self::applyCities($query, $payload);
        self::applySectors($query, $payload);
        self::applyKeyword($query, data_get($payload, 'company_search.keyword'));

        return $query;
    }

    public static function facet(array $payload, string $type, string $name): Builder
    {
        $query = self::base($payload);

        if ($type === 'country') {
            self::applySectors($query, $payload);
            return $name === 'All countries' ? $query : $query->where('country_name', $name);
        }

        self::applyCountry($query, $payload);

        if ($type === 'state') {
            self::applySectors($query, $payload);
            return $name === 'All states' ? $query : $query->where('state_name', $name);
        }

        self::applyStates($query, $payload);

        if ($type === 'city') {
            self::applySectors($query, $payload);
            return $name === 'All cities' ? $query : $query->where('city_name', $name);
        }

        // A sector count is calculated inside the complete selected location.
        self::applyCities($query, $payload);
        return $query->where('sector_title', $name);
    }

    public static function safeColumns(): array
    {
        return [
            'id',
            'CompanyName',
            'trading_name',
            'sector_title',
            'sector_description',
            'industry_name',
            'region_name',
            'country_name',
            'state_name',
            'city_name',
            'location_name',
            'business_description',
            'business_model',
            'products_or_services',
            'website',
            'Email',
            'Logo',
            'icon',
            'Stage',
            'VerificationStatus',
            'CTI_Score',
            'CTI_Tier',
            'ProfileCompletenessPct',
            'AnnualRevenueUSD',
            'Employees_count',
            'number_of_employees',
            'latitude',
            'longitude',
            'created_at',
            'updated_at',
        ];
    }

    private static function applyRegion(Builder $query, array $payload): void
    {
        if (!(bool) ($payload['all_regions'] ?? false) && filled($payload['region_name'] ?? null)) {
            $query->where('region_name', $payload['region_name']);
        }
    }

    private static function applyCountry(Builder $query, array $payload): void
    {
        if ($name = data_get($payload, 'country.name')) {
            $query->where('country_name', $name);
        }
    }

    private static function applyStates(Builder $query, array $payload): void
    {
        $names = collect($payload['states'] ?? [])->pluck('name')->filter()->unique()->values()->all();
        if ($names !== []) $query->whereIn('state_name', $names);
    }

    private static function applyCities(Builder $query, array $payload): void
    {
        $names = collect($payload['cities'] ?? [])->pluck('name')->filter()->unique()->values()->all();
        if ($names !== []) $query->whereIn('city_name', $names);
    }

    private static function applySectors(Builder $query, array $payload): void
    {
        $names = collect($payload['sectors'] ?? [])->pluck('name')->filter()->unique()->values()->all();
        $query->whereIn('sector_title', $names);
    }

    private static function applyKeyword(Builder $query, ?string $keyword): void
    {
        $keyword = trim((string) $keyword);
        if ($keyword === '') return;
        $like = '%' . addcslashes($keyword, '%_\\') . '%';
        $query->where(function (Builder $text) use ($like): void {
            $text->where('CompanyName', 'LIKE', $like)
                ->orWhere('trading_name', 'LIKE', $like)
                ->orWhere('business_description', 'LIKE', $like)
                ->orWhere('business_model', 'LIKE', $like)
                ->orWhere('products_or_services', 'LIKE', $like)
                ->orWhere('industry_name', 'LIKE', $like);
        });
    }
}
