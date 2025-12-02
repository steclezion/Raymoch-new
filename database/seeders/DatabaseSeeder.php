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

        $this->call(DefaultUserSeeder::class);
        $this->call(CountriesTableSeeder::class);
        $this->call(CountriesBusinessTableSeeder::class);
        $this->call(BusinessModelsTableSeeder::class);
        $this->call(CompaniesTableSeeder::class);
        $this->call(ExistingCompaniesRelationsSeeder::class);

        Company::factory()
            ->count(30)
            ->create()
            ->each(function (Company $company) {
                // 3–5 financial years per company
                Financial::factory()
                    ->count(fake()->numberBetween(2, 5))
                    ->create([
                        'company_id' => $company->id,
                    ]);

                // 2–6 gallery images
                Gallery::factory()
                    ->count(fake()->numberBetween(2, 6))
                    ->create([
                        'company_id' => $company->id,
                    ]);

                // 1–4 documents
                Document::factory()
                    ->count(fake()->numberBetween(1, 4))
                    ->create([
                        'company_id' => $company->id,
                    ]);

                // 2–6 team members
                TeamMember::factory()
                    ->count(fake()->numberBetween(2, 6))
                    ->create([
                        'company_id' => $company->id,
                    ]);

                // 1–3 contact entries
                Contact::factory()
                    ->count(fake()->numberBetween(1, 3))
                    ->create([
                        'company_id' => $company->id,
                    ]);
            });
    }



    // public function run(): void
    // {
    //     Company::factory()
    //         ->count(30)
    //         ->hasFinancials(3)   // if you create dedicated relationship factories or use has() with factory()
    //         ->hasGalleries(4)
    //         ->hasDocuments(2)
    //         ->hasTeamMembers(4)
    //         ->hasContacts(2)
    //         ->create();
    // }


}
