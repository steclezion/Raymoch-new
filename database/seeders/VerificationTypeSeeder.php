<?php


namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class VerificationTypeSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();
        $items = [
            'business_registration',
            'tax_verification',
            'identity_verification',
            'address_verification',
            'certification_verification',
            'legal_compliance',
            'financial_verification',
            'social_media_verification',
            'reputation_verification',
            'industry_certification',
            'background_check',
            'credit_check',
            'reference_check',
            'site_visit',
            'document_verification',
            'third_party_verification',
            'bank_account_verification',
            'ownership_verification',
            'management_verification',
            'operational_verification',
            'banking_relationship_verification',
            'customer_reference_verification',
            'supplier_reference_verification',
            'employee_reference_verification',
            'government_registration_verification',
            'compliance_audit_verification',
            'environmental_compliance_verification',
            'social_responsibility_verification',
            'technology_compliance_verification',
            'data_privacy_compliance_verification',
            'cybersecurity_compliance_verification',
            'intellectual_property_verification',
            'export_compliance_verification',
            'import_compliance_verification',
            'anti_money_laundering_verification',
            'counter_terrorism_financing_verification',
            'other_compliance_verification',
            'other_verification',
        ];


        $data = collect($items)
            ->map(function ($name) use ($now) {
                return [
                    'name' => Str::title(str_replace('_', ' ', $name)),
                    'code' => Str::uuid()->toString(),
                    'description' => null,
                    'weight' => 1.00,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            })
            ->sortBy('name') // 🔥 sort alphabetically by name
            ->values()       // reset indexes
            ->toArray();

        DB::table('verification_types')->insert($data);
    }
}
