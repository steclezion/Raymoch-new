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

use App\Models\Region;
use App\Models\OrganizationSize;
use App\Models\Stage;
use App\Models\AnnualRevenueRange;
use App\Models\Capability;
use App\Models\VerificationType;
use App\Models\TrustDimension;
use App\Models\OrganizationProfile;
use App\Models\OrganizationLocation;
use App\Models\OrganizationOperatingCountry;
use App\Models\OrganizationCapability;
use App\Models\ProductService;
use App\Models\OrganizationNeed;
use App\Models\OrganizationInterestTag;
use App\Models\MatchPreference;
use App\Models\MatchFeedback;
use App\Models\OrganizationVerification;
use App\Models\VerificationDocument;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\ProcurementRequest;
use App\Models\ProcurementBidSubmission;
use App\Models\DocumentAndMedia;
use App\Models\OrganizationMedia;
use App\Models\OrganizationReview;
use App\Models\OrganizationTestimonial;
use App\Models\TransactionHistory;
use App\Models\Tag;
use App\Models\OrganizationTag;
use App\Models\Notification;
use App\Models\ActivityLog;
use App\Models\AuditLog;
use App\Models\SystemSetting;
use App\Models\ScoringRule;
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

                    // OPTIONAL: skip if already has data (avoid duplicates when seeding twice)
                    if (! $company->financials()->exists()) {
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



                    // If you have gallery table & model:
                    if (class_exists(CompanyGallery::class) && method_exists($company, 'galleries') && ! $company->galleries()->exists()) {
                        CompanyGallery::factory()
                            ->count($faker->numberBetween(2, 6))
                            ->create([
                                'company_id' => $company->id,
                            ]);
                    }
                    // Advance progress bar
                    $bar->advance();
                }
            });
        $bar->finish();
        $this->command->newLine();
        $this->command->info("✅ Seeding complete!");
    }
}
