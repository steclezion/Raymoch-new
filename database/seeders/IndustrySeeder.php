<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Company;
use App\Models\MatchPreference;
use App\Models\Industryuse;
use Illuminate\Support\Facades\DB;

class IndustrySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = now();
        DB::table('industries')->insert([
            ['id' => 1, 'sector_id' => 1, 'name' => 'Agriculture', 'code' => 'agriculture', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 2, 'sector_id' => 1, 'name' => 'Forestry', 'code' => 'forestry', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 3, 'sector_id' => 1, 'name' => 'Fishing & Aquaculture', 'code' => 'fishing_aquaculture', 'created_at' => $now, 'updated_at' => $now],

            ['id' => 4, 'sector_id' => 2, 'name' => 'Telecommunications', 'code' => 'telecommunications', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 5, 'sector_id' => 2, 'name' => 'Satellite & Space Tech', 'code' => 'satellite_space_tech', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 6, 'sector_id' => 2, 'name' => 'Market Research', 'code' => 'market_research', 'created_at' => $now, 'updated_at' => $now],

            ['id' => 7, 'sector_id' => 3, 'name' => 'Tourism & Hospitality', 'code' => 'tourism_hospitality', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 8, 'sector_id' => 3, 'name' => 'Retail & Ecommerce', 'code' => 'retail_ecommerce', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 9, 'sector_id' => 3, 'name' => 'Beauty & Personal Care', 'code' => 'beauty_personal_care', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 10, 'sector_id' => 3, 'name' => 'Music & Entertainment', 'code' => 'music_entertainment', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 11, 'sector_id' => 3, 'name' => 'Media & Creative', 'code' => 'media_creative', 'created_at' => $now, 'updated_at' => $now],

            ['id' => 12, 'sector_id' => 4, 'name' => 'Food & Beverage', 'code' => 'food_beverage', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 13, 'sector_id' => 4, 'name' => 'Food Products & Processing', 'code' => 'food_processing', 'created_at' => $now, 'updated_at' => $now],

            ['id' => 14, 'sector_id' => 5, 'name' => 'Education', 'code' => 'education', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 15, 'sector_id' => 5, 'name' => 'Science & Research', 'code' => 'science_research', 'created_at' => $now, 'updated_at' => $now],

            ['id' => 16, 'sector_id' => 6, 'name' => 'Oil & Gas', 'code' => 'oil_gas', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 17, 'sector_id' => 6, 'name' => 'Energy & Renewables', 'code' => 'energy_renewables', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 18, 'sector_id' => 6, 'name' => 'Battery & Storage', 'code' => 'battery_storage', 'created_at' => $now, 'updated_at' => $now],

            ['id' => 19, 'sector_id' => 7, 'name' => 'Climate & Sustainability', 'code' => 'climate_sustainability', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 20, 'sector_id' => 7, 'name' => 'Environmental Services', 'code' => 'environmental_services', 'created_at' => $now, 'updated_at' => $now],

            ['id' => 21, 'sector_id' => 8, 'name' => 'Banking', 'code' => 'banking', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 22, 'sector_id' => 8, 'name' => 'Insurance', 'code' => 'insurance', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 23, 'sector_id' => 8, 'name' => 'Investment & Capital Markets', 'code' => 'investment_capital_markets', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 24, 'sector_id' => 8, 'name' => 'FinTech', 'code' => 'fintech', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 25, 'sector_id' => 8, 'name' => 'Accounting & Audit', 'code' => 'accounting_audit', 'created_at' => $now, 'updated_at' => $now],

            ['id' => 26, 'sector_id' => 9, 'name' => 'Government', 'code' => 'government', 'created_at' => $now, 'updated_at' => $now],

            ['id' => 27, 'sector_id' => 10, 'name' => 'Healthcare', 'code' => 'healthcare', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 28, 'sector_id' => 10, 'name' => 'Dental Care', 'code' => 'dental_care', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 29, 'sector_id' => 10, 'name' => 'Pharmaceuticals', 'code' => 'pharmaceuticals', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 30, 'sector_id' => 10, 'name' => 'Life Sciences', 'code' => 'life_sciences', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 31, 'sector_id' => 10, 'name' => 'Biotechnology', 'code' => 'biotechnology', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 32, 'sector_id' => 10, 'name' => 'Animal & Veterinary', 'code' => 'animal_veterinary', 'created_at' => $now, 'updated_at' => $now],

            ['id' => 33, 'sector_id' => 11, 'name' => 'Humanitarian & Social Services', 'code' => 'humanitarian_social_services', 'created_at' => $now, 'updated_at' => $now],

            ['id' => 34, 'sector_id' => 12, 'name' => 'Manufacturing', 'code' => 'manufacturing', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 35, 'sector_id' => 12, 'name' => 'Engineering Services', 'code' => 'engineering_services', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 36, 'sector_id' => 12, 'name' => 'Construction', 'code' => 'construction', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 37, 'sector_id' => 12, 'name' => 'Construction & Real Estate', 'code' => 'construction_real_estate', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 38, 'sector_id' => 12, 'name' => 'Logistics & Mobility', 'code' => 'logistics_mobility', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 39, 'sector_id' => 12, 'name' => 'Trucking & Freight', 'code' => 'trucking_freight', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 40, 'sector_id' => 12, 'name' => 'Rail Transport', 'code' => 'rail_transport', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 41, 'sector_id' => 12, 'name' => 'Maritime & Ports', 'code' => 'maritime_ports', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 42, 'sector_id' => 12, 'name' => 'Aviation', 'code' => 'aviation', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 43, 'sector_id' => 12, 'name' => 'Automotive Manufacturing', 'code' => 'automotive_manufacturing', 'created_at' => $now, 'updated_at' => $now],

            ['id' => 44, 'sector_id' => 13, 'name' => 'ICT / Hardware', 'code' => 'ict_hardware', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 45, 'sector_id' => 13, 'name' => 'ICT & Software', 'code' => 'ict_software', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 46, 'sector_id' => 13, 'name' => 'Cybersecurity', 'code' => 'cybersecurity', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 47, 'sector_id' => 13, 'name' => 'AI & Machine Learning', 'code' => 'ai_machine_learning', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 48, 'sector_id' => 13, 'name' => 'EdTech', 'code' => 'edtech', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 49, 'sector_id' => 13, 'name' => 'Gaming & Esports', 'code' => 'gaming_esports', 'created_at' => $now, 'updated_at' => $now],

            ['id' => 50, 'sector_id' => 14, 'name' => 'Chemicals', 'code' => 'chemicals', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 51, 'sector_id' => 14, 'name' => 'Packaging', 'code' => 'packaging', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 52, 'sector_id' => 14, 'name' => 'Mining & Extractives', 'code' => 'mining_extractives', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 53, 'sector_id' => 14, 'name' => 'Textile & Apparel', 'code' => 'textile_apparel', 'created_at' => $now, 'updated_at' => $now],

            ['id' => 54, 'sector_id' => 15, 'name' => 'Nonprofit & NGOs', 'code' => 'nonprofit_ngos', 'created_at' => $now, 'updated_at' => $now],

            ['id' => 55, 'sector_id' => 16, 'name' => 'Real Estate', 'code' => 'real_estate', 'created_at' => $now, 'updated_at' => $now],

            ['id' => 56, 'sector_id' => 17, 'name' => 'Water & Sanitation', 'code' => 'water_sanitation', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 57, 'sector_id' => 17, 'name' => 'Emergency Services', 'code' => 'emergency_services', 'created_at' => $now, 'updated_at' => $now],

            ['id' => 58, 'sector_id' => 18, 'name' => 'Consulting & Advisory', 'code' => 'consulting_advisory', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 59, 'sector_id' => 18, 'name' => 'Legal Services', 'code' => 'legal_services', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 60, 'sector_id' => 18, 'name' => 'Other', 'code' => 'other', 'created_at' => $now, 'updated_at' => $now],
        ]);
    }
}
