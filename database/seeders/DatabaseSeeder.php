<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Company;
use App\Models\CompanyFinancial as Financial;
use App\Models\CompanyGallery as Gallery;
use App\Models\CompanyDocument as Document;
use App\Models\CompanyContact as Contact;
use App\Models\CompanyTeamMember as TeamMember;
use App\Models\OrganizationMedia;
use App\Models\OrganizationVerification;
use App\Models\VerificationDocument;
use App\Models\Region;
use App\Models\CitiesAll;
use App\Models\StatesAll;
use App\Models\CountryAfrican as Country;
use App\Models\CompanyInfos;
use App\Models\CompanyClassification;
use App\Models\Sector;
use App\Models\BusinessModel;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        //CountriesBusinessTableSeeder  BusinessModelsTableSeeder
        $this->call(CountriesAllSeeder::class);
        $this->call(CountriesTableSeeder::class);
        // $this->call(CountriesBusinessTableSeeder::class);
        $this->call(StatesAllTableSeeder::class);
        $this->call(CitiesAllSeeder::class);
        $this->call(SectorsTableSeeder::class);
        $this->call(IndustrySeeder::class);
        $this->call(StageSeeder::class);
        $this->call(DefaultUserSeeder::class);
        $this->call(RegionSeeder::class);
        $this->call(CompaniesTableSeeder::class);
        $this->call(VerificationTypeSeeder::class);
        $this->call(TrustDimensionSeeder::class);
        $this->call(CapabilitySeeder::class);
        $this->call(BusinessModelsTableSeeder::class);
        $this->call(ExistingCompaniesRelationsSeeder::class);
        $this->call(VerificationDocumentSeeder::class);
    }
}
