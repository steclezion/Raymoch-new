<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use App\Models\Company;
use Illuminate\Support\Facades\DB;

class CompaniesTableSeeder extends Seeder
{
    public function run(): void
    {
        $json = File::get(database_path('seeders/data/companies.json'));
        $companies = json_decode($json, true);

        foreach ($companies as $c) {
            // $sectorId = DB::table('sectors')->inRandomOrder()->value('id');
            $sectorId = rand(1, 18);

            $industryId = DB::table('industries')->where('sector_id', $sectorId)->inRandomOrder()->value('id');

            $countryId = DB::table('countries_africans')
                ->where('country_name', $c['Country'])
                ->value('id');

            $countries_all_id = DB::table('countries_africans')
                ->where('country_name', $c['Country'])
                ->value('countries_all_id');

            $country_all_id = DB::table('countries_all')
                ->where('id',  $countries_all_id)
                ->value('id');

            $stageId = DB::table('stages')->inRandomOrder()->value('id');

            $stateId = DB::table('states_all')->inRandomOrder()
                ->where('country_id', $country_all_id)
                ->value('id');


            $cityId = DB::table('cities_all')->inRandomOrder()
                ->where('state_id', $stateId)
                ->value('id');

            $RegionId = DB::table('countries_africans')
                ->where('country_name', $c['Country'])
                ->value('region_id');

            Company::create([
                'CompanyName'              => $c['CompanyName'] ?? null,
                'Sector'                 => $sectorId,
                'industry_id'               => $industryId,
                'Country'                => $countryId,
                'City'                   => $cityId,
                'state_id'                  => $stateId,
                'FoundedYear'              => $c['FoundedYear'] ?? null,
                'Stage'                  => $stageId,
                'Region'                 =>   $RegionId ?? null,
                'VerificationStatus'       => $c['VerificationStatus'] ?? 'Unverified',
                'VerificationStep'         => $c['VerificationStep'] ?? null,
                'CTI_Score'                 => $c['CTI_Score'] ?? null,
                'CTI_Tier'                  => $c['CTI_Tier'] ?? null,
                'ProfileCompletenessPct'  => $c['ProfileCompletenessPct'] ?? null,
                'Employees'                 => $c['Employees'] ?? null,
                'AnnualRevenueUSD'        => $c['AnnualRevenueUSD'] ?? null,
                'TotalFundingUSD'         => $c['TotalFundingUSD'] ?? null,
                'HasFinancials'            => filter_var($c['HasFinancials'] ?? false, FILTER_VALIDATE_BOOLEAN),
                'DiasporaOwned'            => filter_var($c['DiasporaOwned'] ?? false, FILTER_VALIDATE_BOOLEAN),
                'WomenLed'                 => filter_var($c['WomenLed'] ?? false, FILTER_VALIDATE_BOOLEAN),
                'YouthLed'                 => filter_var($c['YouthLed'] ?? false, FILTER_VALIDATE_BOOLEAN),
                'ListingBucket'            => $c['ListingBucket'] ?? null,
                'Email'                     => $c['Email'] ?? null,
                'website'                   => $c['Website'] ?? null,
                'Phone'                     => $c['Phone'] ?? null,
                'Description'               => $c['Description'] ?? null,
            ]);
        }
    }
}
