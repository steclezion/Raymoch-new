<?php

namespace App\Support;

final class SearchDimensions
{
    /**
     * filter_id/result_name belong to raymoch_business_search_view.
     * lookup_* identifies the authoritative table used to resolve a selected ID.
     */
    public const COLUMNS = [
        'region' => [
            'filter_id' => 'region_id',
            'result_name' => 'region_name',
            'lookup_table' => 'regions',
            'lookup_id' => 'id',
            'lookup_name' => 'name',
            'lookup_parent_column' => 'id',
            'lookup_parent_payload_key' => 'region',

        ],
        'country' => [
            'filter_id' => 'country_id',
            'result_name' => 'country_name',
            'lookup_table' => 'countries_africans',
            'lookup_id' => 'countries_all_id',
            'lookup_name' => 'country_name',
        ],
        'state' => [
            'filter_id' => 'state_id',
            'result_name' => 'state_name',
            'lookup_table' => 'states_all',
            'lookup_id' => 'id',
            'lookup_name' => 'name',
            'lookup_parent_column' => 'country_id',
            'lookup_parent_payload_key' => 'country',
        ],

        'city' => [
            'filter_id' => 'city_id',
            'result_name' => 'city_name',
            'lookup_table' => 'cities_all',
            'lookup_id' => 'id',
            'lookup_name' => 'name',
            'lookup_parent_column' => 'state_id',
            'lookup_parent_payload_key' => 'state',
        ],
        'sector' => [
            'filter_id' => 'sector_id',
            'result_name' => 'sector_title',
        ],
        'industry' => [
            'filter_id' => 'industry_id',
            'result_name' => 'industry_name',
        ],
        'verification' => [
            'filter_id' => 'VerificationStatus',
            'result_name' => 'VerificationStatus',
        ],
    ];

    public static function columnsFor(string $step): ?array
    {
        return self::COLUMNS[$step] ?? null;
    }
}
