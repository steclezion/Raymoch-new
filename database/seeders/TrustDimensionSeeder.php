<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\TrustDimension;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class TrustDimensionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();

        $items = [
            'identity_ats',
            'account_age_ats',
            'activity_level_ats',
            'authenticity_ats',
            'awards_ats',
            'capacity_ats',
            'certifications_ats',
            'communication_ats',
            'community_involvement_ats',
            'compliance_ats',
            'corporate_social_responsibility_ats',
            'customer_acquisition_ats',
            'customer_advocacy_ats',
            'customer_advocacy_program_ats',
            'customer_brand_ats',
            'customer_brand_program_ats',
            'customer_case_studies_ats',
            'customer_collaboration_ats',
            'customer_collaboration_program_ats',
            'customer_community_ats',
            'customer_community_building_ats',
            'customer_community_building_program_ats',
            'customer_complaints_ats',
            'customer_conferences_ats',
            'customer_conferences_program_ats',
            'customer_discounts_ats',
            'customer_discounts_program_ats',
            'customer_emotion_ats',
            'customer_emotion_program_ats',
            'customer_engagement_ats',
            'customer_events_ats',
            'customer_events_program_ats',
            'customer_expectations_ats',
            'customer_expectations_program_ats',
            'customer_experience_ats',
            'customer_experience_program_ats',
            'customer_feedback_ats',
            'customer_incentives_ats',
            'customer_incentives_program_ats',
            'customer_influence_ats',
            'customer_influence_program_ats',
            'customer_loyalty_ats',
            'customer_loyalty_program_ats',
            'customer_meetups_ats',
            'customer_meetups_program_ats',
            'customer_networking_ats',
            'customer_networking_program_ats',
            'customer_partnerships_ats',
            'customer_partnerships_program_ats',
            'customer_perception_ats',
            'customer_perception_program_ats',
            'customer_praise_ats',
            'customer_promotions_ats',
            'customer_promotions_program_ats',
            'customer_referrals_ats',
            'customer_reputation_ats',
            'customer_reputation_program_ats',
            'customer_retention_ats',
            'customer_reviews_ats',
            'customer_rewards_ats',
            'customer_rewards_program_ats',
            'customer_satisfaction_ats',
            'customer_service_ats',
            'customer_success_stories_ats',
            'customer_testimonials_ats',
            'customer_trust_ats',
            'customer_trust_program_ats',
            'customer_value_ats',
            'customer_value_program_ats',
            'customer_webinars_ats',
            'customer_webinars_program_ats',
            'customer_workshops_ats',
            'customer_workshops_program_ats',
            'delivery_time_ats',
            'dispute_history_ats',
            'diversity_ats',
            'document_quality_ats',
            'employee_satisfaction_ats',
            'engagement_ats',
            'ethical_practices_ats',
            'feedback_score_ats',
            'financial_stability_ats',
            'growth_rate_ats',
            'inclusivity_ats',
            'industry_reputation_ats',
            'innovation_ats',
            'loyalty_ats',
            'market_share_ats',
            'partnerships_ats',
            'payment_history_ats',
            'privacy_ats',
            'product_quality_ats',
            'referral_score_ats',
            'reputation_ats',
            'responsiveness_ats',
            'return_rate_ats',
            'security_ats',
            'social_media_presence_ats',
            'supplier_relationships_ats',
            'sustainability_ats',
            'transaction_ats',
            'transparency_ats',


        ];

        $data = collect($items)
            ->map(function ($item) use ($now) {
                return [
                    'name' => Str::title(str_replace('_', ' ', $item)), // snake → normal
                    'code' => $item, // unique
                    'description' => null,
                    'default_weight' => 1.00,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            })
            ->sortBy('name') // sort alphabetically
            ->values()
            ->toArray();

        DB::table('trust_dimensions')->truncate(); // reset IDs
        DB::table('trust_dimensions')->insert($data);
    }
}
