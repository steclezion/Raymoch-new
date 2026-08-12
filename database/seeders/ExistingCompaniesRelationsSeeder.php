<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Company;
use App\Models\CompanyFinancial;
use App\Models\CompanyDocument;
use App\Models\CompanyTeamMember;
use App\Models\CompanyContact;
use App\Models\CompanyGallery;
use App\Models\CompanyLocation;


use App\Models\OrganizationProfile;
use App\Models\OrganizationLocation;
use App\Models\OrganizationOperating;
use App\Models\OrganizationCapability;
use App\Models\ProductService;
use App\Models\OrganizationNeed;
use App\Models\OrganizationInterestTag;
use App\Models\MatchPreference;
use App\Models\ProcurementRequest;
use App\Models\ProcurementBidSubmission;
use App\Models\DocumentAndMedia;
use App\Models\OrganizationVerification;
use App\Models\OrganizationMedia;
use App\Models\VerificationDocument;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\OrganizationReview;
use App\Models\OrganizationTestimonial;
use App\Models\TransactionHistory;
use App\Models\OrganizationTag;
use App\Models\Notification;
use App\Models\ActivityLog;
use App\Models\AuditLog;
use App\Models\OrganizationAtsScore;
use App\Models\OrganizationCtiScore;
// use App\Models\SystemSetting;
// use App\Models\ScoringRule;
use App\Models\User;


class ExistingCompaniesRelationsSeeder extends Seeder
{
    public function run(): void
    {
        $faker = fake();

        $total = Company::count();

        $this->command->info("Seeding relations for {$total} companies...");

        // Create progress bar
        $bar = $this->command->getOutput()->createProgressBar($total);
        $bar->start();

        // Process companies in chunks so it works with 10,000+ rows
        Company::query()
            ->orderBy('id')
            ->chunkById(500, function ($companies) use ($faker, $bar) {

                foreach ($companies as $company) {

                    // OPTIONAL: skip if already has data (avoid duplicates when seeding twice) - adjust as needed based on your relationships and whether you want to allow duplicates or not - this is just a simple example, you may want to check specific relationships or have more complex logic to determine whether to seed or not
                    // if (! $company->financials()->exists()) 
                    if (class_exists(CompanyFinancial::class) && method_exists($company, 'financials') && ! $company->financials()->exists()) {
                        CompanyFinancial::factory()
                            ->count($faker->numberBetween(2, 5))
                            ->create([
                                'company_id' => $company->id,
                            ]);
                    }

                    if (! $company->documents()->exists()) {
                        CompanyDocument::factory()
                            ->count($faker->numberBetween(1, 4))
                            ->create([
                                'company_id' => $company->id,
                            ]);
                    }

                    if (! $company->teamMembers()->exists() && method_exists($company, 'teamMembers')) {
                        CompanyTeamMember::factory()
                            ->count($faker->numberBetween(2, 6))
                            ->create([
                                'company_id' => $company->id,
                            ]);
                    }

                    if (! $company->contacts()->exists()) {
                        CompanyContact::factory()
                            ->count($faker->numberBetween(1, 3))
                            ->create([
                                'company_id' => $company->id,
                            ]);
                    }

                    if (! $company->location()->exists()) {
                        CompanyLocation::factory()
                            ->count($faker->numberBetween(1, 3))
                            ->create([
                                'company_id' => $company->id,
                            ]);
                    }



                    // If you have gallery table & model: and galleries function on Company model
                    if (class_exists(CompanyGallery::class) && method_exists($company, 'galleries') && ! $company->galleries()->exists()) {
                        CompanyGallery::factory()
                            ->count($faker->numberBetween(2, 6))
                            ->create([
                                'company_id' => $company->id,
                            ]);
                    }


                    // If you have Organization Profile (1:1) and model set up : and organizationProfile function on Company model
                    if (! $company->organizationProfile()->exists()) {
                        OrganizationProfile::factory()
                            ->count($faker->numberBetween(2, 6))
                            ->create([
                                'company_id' => $company->id,
                            ]);
                    }

                    // if you have  Locations table and model set up (1:N) and locations function on Company model
                    // if (class_exists(OrganizationLocation::class) && method_exists($company, 'OrganizationLocation') && ! $company->OrganizationLocation()->exists()) {
                    if (! $company->organizationLocations()->exists()) {
                        OrganizationLocation::factory()
                            ->count($faker->numberBetween(1, 3))
                            ->create(['company_id' => $company->id]);
                    }

                    // Capabilities
                    // if (class_exists(OrganizationCapability::class) && method_exists($company, 'OrganizationCapability') && ! $company->OrganizationCapability()->exists()) {

                    if (! $company->organizationCapabilities()->exists()) {
                        OrganizationCapability::factory()
                            ->count($faker->numberBetween(2, 5))
                            ->create(['company_id' => $company->id]);
                    }

                    // Products / Services
                    // if (class_exists(ProductService::class) && method_exists($company, 'ProductService') && ! $company->ProductService()->exists()) {

                    if (! $company->ProductServices()->exists()) {
                        ProductService::factory()
                            ->count($faker->numberBetween(2, 6))
                            ->create(['company_id' => $company->id]);
                    }
                    // Needs
                    // if (class_exists(OrganizationNeed::class) && method_exists($company, 'OrganizationNeed') && ! $company->OrganizationNeed()->exists()) {

                    if (! $company->organizationNeeds()->exists()) {
                        OrganizationNeed::factory()
                            ->count($faker->numberBetween(1, 4))
                            ->create(['company_id' => $company->id]);
                    }

                    // Match Preferences (1:1)
                    // if (class_exists(MatchPreference::class) && method_exists($company, 'MatchPreference') && ! $company->MatchPreference()->exists()) {

                    // if (! $company->MatchPreference()->exists()) {
                    //     MatchPreference::factory()->count($faker->numberBetween(1, 4))
                    //         ->create(['company_id' => $company->id]);
                    // }
                    if (! $company->MatchPreference()->exists()) {
    MatchPreference::factory()
        ->count($faker->numberBetween(1, 4))
        ->create([
            'company_id' => $company->id,
            'preferred_company_size_id' =>
                OrganizationSize::inRandomOrder()->value('id'),
        ]);

                    // Verification
                    // if (class_exists(OrganizationVerification::class) && method_exists($company, 'OrganizationVerification') && ! $company->OrganizationVerification()->exists()) {
                    if (! $company->OrganizationVerification()->exists()) {
                        OrganizationVerification::factory()->create([
                            'company_id' => $company->id,
                        ]);
                    }

                    // Procurement
                    // if (class_exists(ProcurementRequest::class) && method_exists($company, 'ProcurementRequest') && ! $company->ProcurementRequest()->exists()) {

                    // if (! $company->ProcurementRequest()->exists()) {
                    //     ProcurementRequest::factory()
                    //         ->count($faker->numberBetween(1, 3))
                    //         ->create(['company_id' => $company->id]);
                    // }

                    // if (class_exists(ProcurementBidSubmission::class) && method_exists($company, 'ProcurementBidSubmission') && ! $company->ProcurementBidSubmission()->exists()) {
                    // if (! $company->ProcurementBidSubmission()->exists()) {
                    //     ProcurementBidSubmission::factory()
                    //         ->count($faker->numberBetween(1, 5))
                    //         ->create(['company_id' => $company->id]);
                    // }
                    // Media
                    // if (class_exists(OrganizationMedia::class) && method_exists($company, 'OrganizationMedia') && ! $company->OrganizationMedia()->exists()) {

                    if (! $company->OrganizationAtsScores()->exists()) {

                        OrganizationAtsScore::factory()
                            ->count($faker->numberBetween(2, 6))
                            ->create(['company_id' => $company->id]);
                    }
                    if (! $company->OrganizationCtiScores()->exists()) {

                        OrganizationCtiScore::factory()
                            ->count($faker->numberBetween(2, 6))
                            ->create(['company_id' => $company->id]);
                    }

                    // if (! $company->OrganizationMedias()->exists()) {

                    //     OrganizationMedia::factory()
                    //         ->count($faker->numberBetween(2, 6))
                    //         ->create(['company_id' => $company->id]);
                    // }

                    // // Testimonials
                    // // if (class_exists(OrganizationTestimonial::class) && method_exists($company, 'OrganizationTestimonial') && ! $company->OrganizationTestimonial()->exists()) {
                    // if (! $company->OrganizationTestimonial()->exists()) {

                    //     OrganizationTestimonial::factory()
                    //         ->count($faker->numberBetween(1, 3))
                    //         ->create(['company_id' => $company->id]);
                    // }
                    // // Transactions
                    // // if (class_exists(TransactionHistory::class) && method_exists($company, 'TransactionHistory') && ! $company->TransactionHistory()->exists()) {
                    // if (! $company->TransactionHistory()->exists()) {

                    //     TransactionHistory::factory()
                    //         ->count($faker->numberBetween(1, 5))
                    //         ->create(['company_id' => $company->id]);
                    // }
                    // // Tags
                    // // if (class_exists(OrganizationTag::class) && method_exists($company, 'OrganizationTag') && ! $company->OrganizationTag()->exists()) {
                    // if (! $company->OrganizationTag()->exists()) {

                    //     OrganizationTag::factory()
                    //         ->count($faker->numberBetween(2, 6))
                    //         ->create(['company_id' => $company->id]);
                    // }



                    // Advance progress bar
                    $bar->advance();
                }
            });
        $bar->finish();
        $this->command->newLine();
        $this->command->info("✅ Seeding complete!");
    }
}
