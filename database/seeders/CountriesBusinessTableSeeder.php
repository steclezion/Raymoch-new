<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Country;

class CountriesBusinessTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rows = [
            ['country_code' => 'DZ', 'country_name' => 'Algeria',  'flag_icon' => '🇩🇿'],
            ['country_code' => 'AO', 'country_name' => 'Angola',   'flag_icon' => '🇦🇴'],
            ['country_code' => 'BJ', 'country_name' => 'Benin',    'flag_icon' => '🇧🇯'],
            ['country_code' => 'BW', 'country_name' => 'Botswana', 'flag_icon' => '🇧🇼'],
            ['country_code' => 'BF', 'country_name' => 'Burkina Faso', 'flag_icon' => '🇧🇫'],
            ['country_code' => 'BI', 'country_name' => 'Burundi',  'flag_icon' => '🇧🇮'],
            ['country_code' => 'CM', 'country_name' => 'Cameroon', 'flag_icon' => '🇨🇲'],
            ['country_code' => 'CV', 'country_name' => 'Cabo Verde', 'flag_icon' => '🇨🇻'],
            ['country_code' => 'TD', 'country_name' => 'Chad',     'flag_icon' => '🇹🇩'],
            ['country_code' => 'KM', 'country_name' => 'Comoros',  'flag_icon' => '🇰🇲'],
            ['country_code' => 'CG', 'country_name' => 'Congo',    'flag_icon' => '🇨🇬'],
            ['country_code' => 'CD', 'country_name' => 'DR Congo', 'flag_icon' => '🇨🇩'],
            ['country_code' => 'CI', 'country_name' => 'Côte d’Ivoire', 'flag_icon' => '🇨🇮'],
            ['country_code' => 'DJ', 'country_name' => 'Djibouti', 'flag_icon' => '🇩🇯'],
            ['country_code' => 'EG', 'country_name' => 'Egypt',    'flag_icon' => '🇪🇬'],
            ['country_code' => 'ER', 'country_name' => 'Eritrea',  'flag_icon' => '🇪🇷'],
            ['country_code' => 'ET', 'country_name' => 'Ethiopia', 'flag_icon' => '🇪🇹'],
            ['country_code' => 'GA', 'country_name' => 'Gabon',    'flag_icon' => '🇬🇦'],
            ['country_code' => 'GH', 'country_name' => 'Ghana',    'flag_icon' => '🇬🇭'],
            ['country_code' => 'KE', 'country_name' => 'Kenya',    'flag_icon' => '🇰🇪'],
            ['country_code' => 'LR', 'country_name' => 'Liberia',  'flag_icon' => '🇱🇷'],
            ['country_code' => 'LY', 'country_name' => 'Libya',    'flag_icon' => '🇱🇾'],
            ['country_code' => 'MG', 'country_name' => 'Madagascar', 'flag_icon' => '🇲🇬'],
            ['country_code' => 'MW', 'country_name' => 'Malawi',   'flag_icon' => '🇲🇼'],
            ['country_code' => 'ML', 'country_name' => 'Mali',     'flag_icon' => '🇲🇱'],
            ['country_code' => 'MA', 'country_name' => 'Morocco',  'flag_icon' => '🇲🇦'],
            ['country_code' => 'MZ', 'country_name' => 'Mozambique', 'flag_icon' => '🇲🇿'],
            ['country_code' => 'NA', 'country_name' => 'Namibia',  'flag_icon' => '🇳🇦'],
            ['country_code' => 'NE', 'country_name' => 'Niger',    'flag_icon' => '🇳🇪'],
            ['country_code' => 'NG', 'country_name' => 'Nigeria',  'flag_icon' => '🇳🇬'],
            ['country_code' => 'RW', 'country_name' => 'Rwanda',   'flag_icon' => '🇷🇼'],
            ['country_code' => 'SN', 'country_name' => 'Senegal',  'flag_icon' => '🇸🇳'],
            ['country_code' => 'SO', 'country_name' => 'Somalia',  'flag_icon' => '🇸🇴'],
            ['country_code' => 'ZA', 'country_name' => 'South Africa', 'flag_icon' => '🇿🇦'],
            ['country_code' => 'SS', 'country_name' => 'South Sudan', 'flag_icon' => '🇸🇸'],
            ['country_code' => 'SD', 'country_name' => 'Sudan',    'flag_icon' => '🇸🇩'],
            ['country_code' => 'TZ', 'country_name' => 'Tanzania', 'flag_icon' => '🇹🇿'],
            ['country_code' => 'TG', 'country_name' => 'Togo',     'flag_icon' => '🇹🇬'],
            ['country_code' => 'TN', 'country_name' => 'Tunisia',  'flag_icon' => '🇹🇳'],
            ['country_code' => 'UG', 'country_name' => 'Uganda',   'flag_icon' => '🇺🇬'],
            ['country_code' => 'ZM', 'country_name' => 'Zambia',   'flag_icon' => '🇿🇲'],
            ['country_code' => 'ZW', 'country_name' => 'Zimbabwe', 'flag_icon' => '🇿🇼'],
            ['country_code' => 'US', 'country_name' => 'United States', 'flag_icon' => '🇺🇸'],
            ['country_code' => 'GB', 'country_name' => 'United Kingdom', 'flag_icon' => '🇬🇧'],
        ];

        foreach ($rows as $r) {
            Country::updateOrCreate(['country_code' => $r['country_code']], $r);
        }
    }
}
