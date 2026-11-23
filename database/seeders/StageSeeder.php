<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class StageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = now();

        $items = [
            ['id' => 1, 'name' => 'Idea / Concept', 'description' => 'Business idea under research, definition, and initial validation.'],
            ['id' => 2, 'name' => 'Pre-seed', 'description' => 'Founders are validating the opportunity and preparing the first product or service.'],
            ['id' => 3, 'name' => 'Seed', 'description' => 'Early funding supports product development, testing, and initial market entry.'],
            ['id' => 4, 'name' => 'Pre-revenue', 'description' => 'The offering is being developed or tested before commercial revenue begins.'],
            ['id' => 5, 'name' => 'Early revenue', 'description' => 'The business has started generating revenue and validating repeatable demand.'],
            ['id' => 6, 'name' => 'Startup', 'description' => 'Early-stage company validating its business model and building market traction.'],
            ['id' => 7, 'name' => 'Scale-up', 'description' => 'A validated business is rapidly increasing customers, revenue, and operational capacity.'],
            ['id' => 8, 'name' => 'Growth', 'description' => 'The company is scaling operations and strengthening its market presence.'],
            ['id' => 9, 'name' => 'Expansion', 'description' => 'The company is entering new markets or diversifying products and services.'],
            ['id' => 10, 'name' => 'Established', 'description' => 'The business has proven operations, customers, and a stable market position.'],
            ['id' => 11, 'name' => 'Mature', 'description' => 'An established business with stable revenue, systems, and operations.'],
            ['id' => 12, 'name' => 'Turnaround / Restructuring', 'description' => 'The company is reorganizing operations, finances, or strategy to restore performance.'],
            ['id' => 13, 'name' => 'Pre-IPO', 'description' => 'The company is preparing its governance, reporting, and operations for a public offering.'],
            ['id' => 14, 'name' => 'Publicly listed', 'description' => 'The company has shares listed and traded on a public securities exchange.'],
            ['id' => 15, 'name' => 'Acquired', 'description' => 'The company has been purchased and is controlled by another organization.'],
            ['id' => 16, 'name' => 'Merged', 'description' => 'The company has combined with another organization into a unified business.'],
            ['id' => 17, 'name' => 'Subsidiary', 'description' => 'The company operates as an entity controlled by a parent organization.'],
            ['id' => 18, 'name' => 'Dormant', 'description' => 'The company is legally maintained but is not currently conducting active operations.'],
            ['id' => 19, 'name' => 'Nonprofit / Mission stage', 'description' => 'A mission-led organization operating primarily for social, public, or community benefit.'],
        ];

        $rows = array_map(function ($item) use ($now) {
            return [
                'id' => $item['id'],
                'name' => $item['name'],
                'code' => Str::slug($item['name'], '_'),
                'description' => $item['description'],
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }, $items);

        DB::table('stages')->upsert(
            $rows,
            ['id'], // Keep stage IDs stable across environments.
            ['name', 'code', 'description', 'updated_at']
        );
    }
}
