<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use League\ISO3166\ISO3166;
use libphonenumber\PhoneNumberUtil;

class CountriesAllSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('countries_all')->truncate();

        $iso = new ISO3166();
        $phoneUtil = PhoneNumberUtil::getInstance();

        $countries = $iso->all();

        foreach ($countries as $country) {

            $iso2 = $country['alpha2'];

            // Get country calling code
            $code = $phoneUtil->getCountryCodeForRegion($iso2);

            if ($code == 0) continue;

            DB::table('countries_all')->insert([
                'name'         => $country['name'],
                'tele_code'    => '+' . $code,
                'country_code' => $iso2,
                'created_at'   => now(),
                'updated_at'   => now(),
            ]);
        }
    }
}
