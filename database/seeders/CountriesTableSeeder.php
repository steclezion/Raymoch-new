<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CountryAfrican as Country;

class CountriesTableSeeder extends Seeder
{
    public function run(): void
    {
        $rows = [
            // 1 = North Africa
            ['country_code' => 'DZ', 'country_name' => 'Algeria',      'flag_icon' => '🇩🇿', 'region_id' => 1, 'countries_all_id' => 4],
            ['country_code' => 'EG', 'country_name' => 'Egypt',        'flag_icon' => '🇪🇬', 'region_id' => 1, 'countries_all_id' => 65],
            ['country_code' => 'LY', 'country_name' => 'Libya',        'flag_icon' => '🇱🇾', 'region_id' => 1, 'countries_all_id' => 124],
            ['country_code' => 'MA', 'country_name' => 'Morocco',      'flag_icon' => '🇲🇦', 'region_id' => 1, 'countries_all_id' => 149],
            ['country_code' => 'TN', 'country_name' => 'Tunisia',      'flag_icon' => '🇹🇳', 'region_id' => 1, 'countries_all_id' => 224],
            ['country_code' => 'WS', 'country_name' => 'Western Sahara', 'flag_icon' => 'ws', 'region_id' => 1, 'countries_all_id' => 244],

            // 2 = West Africa
            ['country_code' => 'BJ', 'country_name' => 'Benin',        'flag_icon' => '🇧🇯', 'region_id' => 2, 'countries_all_id' => 24],
            ['country_code' => 'BF', 'country_name' => 'Burkina Faso', 'flag_icon' => '🇧🇫', 'region_id' => 2, 'countries_all_id' => 35],
            ['country_code' => 'CV', 'country_name' => 'Cabo Verde',   'flag_icon' => '🇨🇻', 'region_id' => 2, 'countries_all_id' => 40],
            ['country_code' => 'CI', 'country_name' => 'Côte d’Ivoire', 'flag_icon' => '🇨🇮', 'region_id' => 2, 'countries_all_id' => 54],
            ['country_code' => 'GH', 'country_name' => 'Ghana',        'flag_icon' => '🇬🇭', 'region_id' => 2, 'countries_all_id' => 83],
            ['country_code' => 'LR', 'country_name' => 'Liberia',      'flag_icon' => '🇱🇷', 'region_id' => 2, 'countries_all_id' => 123],
            ['country_code' => 'ML', 'country_name' => 'Mali',         'flag_icon' => '🇲🇱', 'region_id' => 2, 'countries_all_id' => 134],
            ['country_code' => 'NE', 'country_name' => 'Niger',        'flag_icon' => '🇳🇪', 'region_id' => 2, 'countries_all_id' => 160],
            ['country_code' => 'NG', 'country_name' => 'Nigeria',      'flag_icon' => '🇳🇬', 'region_id' => 2, 'countries_all_id' => 161],
            ['country_code' => 'SN', 'country_name' => 'Senegal',      'flag_icon' => '🇸🇳', 'region_id' => 2, 'countries_all_id' => 195],
            ['country_code' => 'TG', 'country_name' => 'Togo',         'flag_icon' => '🇹🇬', 'region_id' => 2, 'countries_all_id' => 220],
            ['country_code' => 'MT', 'country_name' => 'Mauritania',         'flag_icon' => '🇲🇹', 'region_id' => 2, 'countries_all_id' => 139],

            ['country_code' => 'GA', 'country_name' => 'Gambia',        'flag_icon' => '🇬🇦', 'region_id' => 2, 'countries_all_id' => 80],
            ['country_code' => 'GU', 'country_name' => 'Guinea',      'flag_icon' => '🇬🇺', 'region_id' => 2, 'countries_all_id' => 92],
            ['country_code' => 'GB', 'country_name' => 'Guinea-Bissau',      'flag_icon' => '🇬🇧', 'region_id' => 2, 'countries_all_id' => 93],
            ['country_code' => 'SL', 'country_name' => 'Sierra Leone',         'flag_icon' => '🇸🇱', 'region_id' => 2, 'countries_all_id' => 198],




            // 3 = East Africa
            ['country_code' => 'BI', 'country_name' => 'Burundi',      'flag_icon' => '🇧🇮', 'region_id' => 3, 'countries_all_id' => 36],
            ['country_code' => 'KM', 'country_name' => 'Comoros',      'flag_icon' => '🇰🇲', 'region_id' => 3, 'countries_all_id' => 49],
            ['country_code' => 'KE', 'country_name' => 'Kenya',        'flag_icon' => '🇰🇪', 'region_id' => 3, 'countries_all_id' => 113],
            ['country_code' => 'MG', 'country_name' => 'Madagascar',   'flag_icon' => '🇲🇬', 'region_id' => 3, 'countries_all_id' => 130],
            ['country_code' => 'MW', 'country_name' => 'Malawi',       'flag_icon' => '🇲🇼', 'region_id' => 3, 'countries_all_id' => 131],
            ['country_code' => 'MZ', 'country_name' => 'Mozambique',   'flag_icon' => '🇲🇿', 'region_id' => 3, 'countries_all_id' => 150],
            ['country_code' => 'RW', 'country_name' => 'Rwanda',       'flag_icon' => '🇷🇼', 'region_id' => 3, 'countries_all_id' => 183],
            ['country_code' => 'SS', 'country_name' => 'South Sudan',  'flag_icon' => '🇸🇸', 'region_id' => 3, 'countries_all_id' => 206],
            ['country_code' => 'TZ', 'country_name' => 'Tanzania',     'flag_icon' => '🇹🇿', 'region_id' => 3, 'countries_all_id' => 218],
            ['country_code' => 'UG', 'country_name' => 'Uganda',       'flag_icon' => '🇺🇬', 'region_id' => 3, 'countries_all_id' => 229],
            ['country_code' => 'ZM', 'country_name' => 'Zambia',       'flag_icon' => '🇿🇲', 'region_id' => 3, 'countries_all_id' => 246],
            ['country_code' => 'SD', 'country_name' => 'Sudan',        'flag_icon' => '🇸🇩', 'region_id' => 7, 'countries_all_id' => 209],

            ['country_code' => 'MU', 'country_name' => 'Mauritius',        'flag_icon' => '🇲🇺', 'region_id' => 7, 'countries_all_id' => 140],

            ['country_code' => 'SY', 'country_name' => 'Seychelles',        'flag_icon' => '🇸🇾', 'region_id' => 7, 'countries_all_id' => 197],

            ['country_code' => 'MY', 'country_name' => 'Mayotte',        'flag_icon' => '🇲🇾', 'region_id' => 7, 'countries_all_id' => 141],

            // 4 = Central Africa
            ['country_code' => 'AO', 'country_name' => 'Angola',       'flag_icon' => '🇦🇴', 'region_id' => 4, 'countries_all_id' => 7],
            ['country_code' => 'CM', 'country_name' => 'Cameroon',     'flag_icon' => '🇨🇲', 'region_id' => 4, 'countries_all_id' => 38],
            ['country_code' => 'TD', 'country_name' => 'Chad',         'flag_icon' => '🇹🇩', 'region_id' => 4, 'countries_all_id' => 43],
            ['country_code' => 'CG', 'country_name' => 'Congo',        'flag_icon' => '🇨🇬', 'region_id' => 4, 'countries_all_id' => 50],
            ['country_code' => 'CD', 'country_name' => 'DR Congo',     'flag_icon' => '🇨🇩', 'region_id' => 4, 'countries_all_id' => 51],
            ['country_code' => 'GA', 'country_name' => 'Gabon',        'flag_icon' => '🇬🇦', 'region_id' => 4, 'countries_all_id' => 79],

            ['country_code' => 'CA', 'country_name' => 'Central African Republic',        'flag_icon' => '🇨🇦', 'region_id' => 4, 'countries_all_id' => 42],
            ['country_code' => 'EG', 'country_name' => 'Equatorial Guinea',     'flag_icon' => 'EG', 'region_id' => 4, 'countries_all_id' => 67],
            ['country_code' => 'ST', 'country_name' => 'São Tomé and Príncipe',        'flag_icon' => 'ST', 'region_id' => 4, 'countries_all_id' => 193],






            // 5 = Southern Africa
            ['country_code' => 'BW', 'country_name' => 'Botswana',     'flag_icon' => '🇧🇼', 'region_id' => 5, 'countries_all_id' => 29],
            ['country_code' => 'NA', 'country_name' => 'Namibia',      'flag_icon' => '🇳🇦', 'region_id' => 5, 'countries_all_id' => 152],
            ['country_code' => 'ZA', 'country_name' => 'South Africa', 'flag_icon' => '🇿🇦', 'region_id' => 5, 'countries_all_id' => 204],
            ['country_code' => 'ZW', 'country_name' => 'Zimbabwe',     'flag_icon' => '🇿🇼', 'region_id' => 5, 'countries_all_id' => 247],
            ['country_code' => 'LE', 'country_name' => 'Lesotho', 'flag_icon' => '🇱🇸', 'region_id' => 5, 'countries_all_id' => 122],
            ['country_code' => 'ES', 'country_name' => 'Eswatini (Swaziland)',     'flag_icon' => '🇪🇸', 'region_id' => 5, 'countries_all_id' => 212],
            ['country_code' => 'SH', 'country_name' => 'Saint Helena',     'flag_icon' => '🇸🇭', 'region_id' => 5, 'countries_all_id' => 184],



            // 6 = Horn of Africa
            ['country_code' => 'DJ', 'country_name' => 'Djibouti',     'flag_icon' => '🇩🇯', 'region_id' => 6, 'countries_all_id' => 60],
            ['country_code' => 'ER', 'country_name' => 'Eritrea',      'flag_icon' => '🇪🇷', 'region_id' => 6, 'countries_all_id' => 68],
            ['country_code' => 'ET', 'country_name' => 'Ethiopia',     'flag_icon' => '🇪🇹', 'region_id' => 6, 'countries_all_id' => 70],
            ['country_code' => 'SO', 'country_name' => 'Somalia',      'flag_icon' => '🇸🇴', 'region_id' => 6, 'countries_all_id' => 203],

            // 7 = Sahel Region
            // ['country_code' => 'BF', 'country_name' => 'Burkina Faso', 'flag_icon' => '🇧🇫', 'region_id' => 7, 'countries_all_id' => 1],
            // ['country_code' => 'ML', 'country_name' => 'Mali',         'flag_icon' => '🇲🇱', 'region_id' => 7, 'countries_all_id' => 1],
            // ['country_code' => 'NE', 'country_name' => 'Niger',        'flag_icon' => '🇳🇪', 'region_id' => 7, 'countries_all_id' => 1],
            // ['country_code' => 'TD', 'country_name' => 'Chad',         'flag_icon' => '🇹🇩', 'region_id' => 7, 'countries_all_id' => 1],
            // ['country_code' => 'SD', 'country_name' => 'Sudan',        'flag_icon' => '🇸🇩', 'region_id' => 7, 'countries_all_id' => 1],

            // 8 = Great Lakes Region
            // ['country_code' => 'BI', 'country_name' => 'Burundi',      'flag_icon' => '🇧🇮', 'region_id' => 8],
            // ['country_code' => 'CD', 'country_name' => 'DR Congo',     'flag_icon' => '🇨🇩', 'region_id' => 8],
            // ['country_code' => 'RW', 'country_name' => 'Rwanda',       'flag_icon' => '🇷🇼', 'region_id' => 8],
            // ['country_code' => 'UG', 'country_name' => 'Uganda',       'flag_icon' => '🇺🇬', 'region_id' => 8],
        ];

        collect($rows)->sortBy('country_name')->values()->toArray();

        $rows = collect($rows)
            ->sortBy('country_name', SORT_NATURAL | SORT_FLAG_CASE)
            ->values()
            ->all();

        usort($rows, function ($a, $b) {
            return strcasecmp($a['country_name'], $b['country_name']);
        });

        foreach ($rows as $r) {
            Country::updateOrCreate(
                ['country_code' => $r['country_code'], 'region_id' => $r['region_id']],
                $r
            );
        }
    }
}
