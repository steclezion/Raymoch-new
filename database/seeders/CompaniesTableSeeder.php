<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use App\Models\Company;

class CompaniesTableSeeder extends Seeder
{
    public function run(): void
    {
        $json = File::get(database_path('seeders/data/companies.json'));
        $companies = json_decode($json, true);

        foreach ($companies as $c) {
            Company::create([
                'CompanyName'       => $c['CompanyName'] ?? $c['name'] ?? null,
                'Sector'             => $c['Sector'] ?? null,
                'Country'            => $c['Country'] ?? null,
                'Region'             => $c['Region'] ?? null,
                'City'               => $c['City'] ?? null,
                'FoundedYear'       => $c['FoundedYear'] ?? null,
                'Stage'              => $c['Stage'] ?? null,
                'VerificationStatus' => $c['VerificationStatus'] ?? 'Unverified',
                'VerificationStep'   => $c['VerificationStep'] ?? null,
                'CTI_Score'          => $c['CTI_Score'] ?? null,
                'CTI_Tier'           => $c['CTI_Tier'] ?? null,
                'ProfileCompletenessPct' => $c['ProfileCompletenessPct'] ?? null,
                'Employees'          => $c['Employees'] ?? null,
                'AnnualRevenueUSD'   => $c['AnnualRevenueUSD'] ?? null,
                'TotalFundingUSD'    => $c['TotalFundingUSD'] ?? null,
                'HasFinancials'     => $c['HasFinancials'] ?? null,
                'DiasporaOwned'     => $c['DiasporaOwned'] ?? null,
                'WomenLed'          => $c['WomenLed'] ?? null,
                'YouthLed'          => $c['YouthLed'] ?? null,
                'ListingBucket'     => $c['ListingBucket'] ?? null,
                'Email'              => $c['Email'] ?? null,
                'Website'            => $c['Website'] ?? null,
                'Phone'              => $c['Phone'] ?? null,
                'Description'        => $c['Description'] ?? null,
            ]);
        }
    }
}
