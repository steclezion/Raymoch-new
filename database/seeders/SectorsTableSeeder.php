<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SectorsTableSeeder extends Seeder
{
    public function run(): void
    {



        $now = now();

        $items = [
            ['id' => 1,  'name' => 'Agriculture & Primary Sector',      'icon' => '🌾', 'description' => 'Activities related to farming, livestock, forestry, fishing, and raw natural resource production.'],
            ['id' => 2,  'name' => 'Communication Services',            'icon' => '📡', 'description' => 'Telecom, media, broadcasting, publishing, digital communication, and related services.'],
            ['id' => 3,  'name' => 'Consumer Discretionary',            'icon' => '🛍️', 'description' => 'Non-essential consumer goods and services such as retail, tourism, entertainment, and luxury products.'],
            ['id' => 4,  'name' => 'Consumer Staples',                  'icon' => '🧴', 'description' => 'Essential everyday goods including food, beverages, household items, and personal care products.'],
            ['id' => 5,  'name' => 'Education & Research',              'icon' => '🎓', 'description' => 'Schools, universities, training services, academic institutions, and research organizations.'],
            ['id' => 6,  'name' => 'Energy',                            'icon' => '⚡', 'description' => 'Oil, gas, power generation, renewable energy, storage, and energy infrastructure.'],
            ['id' => 7,  'name' => 'Environmental & Sustainability',    'icon' => '🌱', 'description' => 'Environmental protection, climate solutions, recycling, sustainability, and green innovation.'],
            ['id' => 8,  'name' => 'Financials',                        'icon' => '💰', 'description' => 'Banking, insurance, investment, lending, capital markets, and financial services.'],
            ['id' => 9,  'name' => 'Government & Public Sector',        'icon' => '🏛️', 'description' => 'Public administration, government institutions, policy implementation, and civic services.'],
            ['id' => 10, 'name' => 'Health Care',                       'icon' => '🏥', 'description' => 'Hospitals, clinics, pharmaceuticals, medical devices, diagnostics, and healthcare services.'],
            ['id' => 11, 'name' => 'Humanitarian & Social Services',    'icon' => '🤝', 'description' => 'Relief work, welfare programs, community development, and social support services.'],
            ['id' => 12, 'name' => 'Industrials',                       'icon' => '🏭', 'description' => 'Manufacturing, engineering, construction, transportation, logistics, and industrial operations.'],
            ['id' => 13, 'name' => 'Information Technology',            'icon' => '💻', 'description' => 'Software, hardware, IT services, cybersecurity, cloud systems, AI, and digital infrastructure.'],
            ['id' => 14, 'name' => 'Materials',                         'icon' => '🧱', 'description' => 'Chemicals, mining, metals, packaging, construction materials, and raw material processing.'],
            ['id' => 15, 'name' => 'Nonprofit / NGOs',                  'icon' => '❤️', 'description' => 'Nonprofit organizations, charities, advocacy groups, and mission-driven institutions.'],
            ['id' => 16, 'name' => 'Real Estate',                       'icon' => '🏢', 'description' => 'Property development, real estate services, housing, commercial property, and land management.'],
            ['id' => 17, 'name' => 'Utilities',                         'icon' => '💡', 'description' => 'Water, electricity, gas, sanitation, and other essential utility services.'],
            ['id' => 18, 'name' => 'Z-other',                           'icon' => '📦', 'description' => 'Miscellaneous sectors that do not clearly fit into the standard sector classifications.'],
        ];

        $rows = array_map(function ($item) use ($now) {
            return [
                'id' => $item['id'],
                'title' => $item['name'],
                // 'code' => Str::slug($item['name'], '_'),
                'icon' => $item['icon'],
                'description' => $item['description'],
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }, $items);

        DB::table('sectors')->upsert(
            $rows,
            ['id'],
            ['title', 'icon', 'description', 'updated_at']
        );
    }
}
