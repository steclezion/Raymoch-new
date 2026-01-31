<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class SectorsTableSeeder extends Seeder
{
    public function run(): void
    {
        $raw = "
Wholesale Trade
Water & Sanitation
Trucking & Freight
Tourism & Hospitality
Textile & Apparel
Telecommunications
Science & Research
Satellite & Space Tech
Retail & Ecommerce
Real Estate
Rail Transport
Pharmaceuticals
Packaging
Other
Oil & Gas
Nonprofit & NGOs
Music & Entertainment
Mining & Extractives
Media & Creative
Market Research
Maritime & Ports
Manufacturing
Logistics & Mobility
Life Sciences
Legal Services
Investment & Capital Markets
Insurance
ICT / Software
ICT & Software
Humanitarian & Social Services
Healthcare
Government
Gaming & Esports
Forestry
Food Products & Processing
Food & Beverage
Fishing & Aquaculture
FinTech
Environmental Services
Engineering Services
Energy & Renewables
Emergency Services
Education
EdTech
Dental Care
Cybersecurity
Consulting & Advisory
Construction & Real Estate
Construction
Climate & Sustainability
Chemicals
Biotechnology
Beauty & Personal Care
Battery & Storage
Banking
Aviation
Automotive Manufacturing
Animal & Veterinary
AI & Machine Learning
Agriculture
Accounting & Audit
";

        // Normalize to unique list
        $items = collect(preg_split("/\r\n|\n|\r/", trim($raw)))
            ->map(fn($x) => trim($x))
            ->filter(fn($x) => $x !== "")
            ->unique()
            ->values()
            ->all();

        // Sort A->Z (case-insensitive, natural)
        usort($items, function ($a, $b) {
            return strcasecmp($a, $b);
        });

        $now = now();

        $rows = array_map(fn($name) => [
            'name' => $name,
            'created_at' => $now,
            'updated_at' => $now,
        ], $items);

        // Insert (ignore duplicates in case seeder run again)
        // If you want safe re-run:
        DB::table('sectors')->upsert($rows, ['name'], ['updated_at']);
    }
}
