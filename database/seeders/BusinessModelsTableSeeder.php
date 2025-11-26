<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BusinessModel;

class BusinessModelsTableSeeder extends Seeder
{
    public function run(): void
    {
        $rows = [

            // ---- PRIMARY SECTORS ----
            ['icon' => '🌱', 'title' => 'Agriculture', 'description' => 'Farming, agri-tech, livestock, irrigation.'],
            ['icon' => '🌾', 'title' => 'Forestry', 'description' => 'Timber, forest products, forest management.'],
            ['icon' => '🎣', 'title' => 'Fishing & Aquaculture', 'description' => 'Fish farming, seafood production.'],
            ['icon' => '⛏️', 'title' => 'Mining & Extractives', 'description' => 'Minerals, metals, quarrying.'],

            // ---- ENERGY ----
            ['icon' => '⚡', 'title' => 'Energy & Renewables', 'description' => 'Solar, wind, hydro, geothermal.'],
            ['icon' => '🛢️', 'title' => 'Oil & Gas', 'description' => 'Exploration, refining, distribution.'],
            ['icon' => '🔋', 'title' => 'Battery & Storage', 'description' => 'Energy storage, lithium, EV batteries.'],

            // ---- MANUFACTURING ----
            ['icon' => '🏭', 'title' => 'Manufacturing', 'description' => 'Industrial production, assembly, machinery.'],
            ['icon' => '🔧', 'title' => 'Automotive Manufacturing', 'description' => 'Vehicles, parts, components.'],
            ['icon' => '👗', 'title' => 'Textile & Apparel', 'description' => 'Clothing, fabrics, fashion.'],
            ['icon' => '🥽', 'title' => 'Chemicals', 'description' => 'Industrial chemicals, fertilizers.'],
            ['icon' => '📦', 'title' => 'Packaging', 'description' => 'Materials, plastics, cartons.'],

            // ---- CONSTRUCTION & REAL ESTATE ----
            ['icon' => '🏗️', 'title' => 'Construction', 'description' => 'Buildings, civil works, materials.'],
            ['icon' => '🏠', 'title' => 'Real Estate', 'description' => 'Housing, commercial, property management.'],
            ['icon' => '🚧', 'title' => 'Engineering Services', 'description' => 'Civil, mechanical, electrical engineering.'],

            // ---- RETAIL & COMMERCE ----
            ['icon' => '🛍️', 'title' => 'Retail & Ecommerce', 'description' => 'Consumer goods, online sales.'],
            ['icon' => '🏬', 'title' => 'Wholesale Trade', 'description' => 'B2B distribution, supply systems.'],
            ['icon' => '🍱', 'title' => 'Food Products & Processing', 'description' => 'Food production, packaging.'],

            // ---- TRANSPORT & LOGISTICS ----
            ['icon' => '🚚', 'title' => 'Logistics & Mobility', 'description' => 'Transport, fleets, supply chain.'],
            ['icon' => '🚛', 'title' => 'Trucking & Freight', 'description' => 'Cargo, dispatching, warehousing.'],
            ['icon' => '🚉', 'title' => 'Rail Transport', 'description' => 'Train operations, rail systems.'],
            ['icon' => '✈️', 'title' => 'Aviation', 'description' => 'Airlines, charters, ground handling.'],
            ['icon' => '🚢', 'title' => 'Maritime & Ports', 'description' => 'Shipping, terminals, marine logistics.'],

            // ---- FINANCIAL SERVICES ----
            ['icon' => '💳', 'title' => 'FinTech', 'description' => 'Payments, lending, remittances.'],
            ['icon' => '🏦', 'title' => 'Banking', 'description' => 'Commercial banking, deposits, finance.'],
            ['icon' => '📈', 'title' => 'Investment & Capital Markets', 'description' => 'Funds, VC/PE, securities.'],
            ['icon' => '🛡️', 'title' => 'Insurance', 'description' => 'Health, life, auto, property insurance.'],

            // ---- ICT & SOFTWARE ----
            ['icon' => '💻', 'title' => 'ICT & Software', 'description' => 'Software, IT services, cloud.'],
            ['icon' => '📡', 'title' => 'Telecommunications', 'description' => 'ISPs, mobile networks.'],
            ['icon' => '🤖', 'title' => 'AI & Machine Learning', 'description' => 'AI platforms, automation.'],
            ['icon' => '🔐', 'title' => 'Cybersecurity', 'description' => 'Digital security, compliance.'],
            ['icon' => '🛰️', 'title' => 'Satellite & Space Tech', 'description' => 'Aerospace, space data, GPS.'],

            // ---- EDUCATION ----
            ['icon' => '🎓', 'title' => 'Education', 'description' => 'Schools, vocational, universities.'],
            ['icon' => '📘', 'title' => 'EdTech', 'description' => 'Digital learning platforms.'],

            // ---- HEALTHCARE ----
            ['icon' => '🏥', 'title' => 'Healthcare', 'description' => 'Hospitals, clinics, services.'],
            ['icon' => '💊', 'title' => 'Pharmaceuticals', 'description' => 'Medicines, biotech, R&D.'],
            ['icon' => '🧪', 'title' => 'Biotechnology', 'description' => 'Genomics, lab research.'],
            ['icon' => '🦷', 'title' => 'Dental Care', 'description' => 'Dental clinics, orthodontics.'],

            // ---- FOOD, HOSPITALITY & ENTERTAINMENT ----
            ['icon' => '🍲', 'title' => 'Food & Beverage', 'description' => 'Restaurants, cafés, catering.'],
            ['icon' => '🏝️', 'title' => 'Tourism & Hospitality', 'description' => 'Hotels, travel services.'],
            ['icon' => '🎬', 'title' => 'Media & Creative', 'description' => 'Film, photography, animation.'],
            ['icon' => '🎮', 'title' => 'Gaming & Esports', 'description' => 'Game studios, tournaments.'],
            ['icon' => '🎤', 'title' => 'Music & Entertainment', 'description' => 'Studios, artists, streaming.'],

            // ---- PROFESSIONAL SERVICES ----
            ['icon' => '🤝', 'title' => 'Consulting & Advisory', 'description' => 'Business, strategy, management.'],
            ['icon' => '⚖️', 'title' => 'Legal Services', 'description' => 'Law firms, compliance.'],
            ['icon' => '🧾', 'title' => 'Accounting & Audit', 'description' => 'Tax, bookkeeping, audit.'],
            ['icon' => '🔍', 'title' => 'Market Research', 'description' => 'Analytics, insights.'],

            // ---- GOVERNMENT & NONPROFIT ----
            ['icon' => '🏛️', 'title' => 'Government', 'description' => 'Public institutions, agencies.'],
            ['icon' => '🤲', 'title' => 'Nonprofit & NGOs', 'description' => 'Charities, humanitarian work.'],
            ['icon' => '⚕️', 'title' => 'Humanitarian & Social Services', 'description' => 'Aid, community support.'],

            // ---- SCIENCE & TECH ----
            ['icon' => '🔭', 'title' => 'Science & Research', 'description' => 'R&D, labs, advanced research.'],
            ['icon' => '🧬', 'title' => 'Life Sciences', 'description' => 'Biology, genetics, health R&D.'],

            // ---- ENVIRONMENTAL ----
            ['icon' => '🌿', 'title' => 'Environmental Services', 'description' => 'Recycling, waste management.'],
            ['icon' => '💧', 'title' => 'Water & Sanitation', 'description' => 'Water supply, purification.'],
            ['icon' => '🌍', 'title' => 'Climate & Sustainability', 'description' => 'Green initiatives, ESG.'],

            // ---- PERSONAL SERVICES ----
            ['icon' => '💇', 'title' => 'Beauty & Personal Care', 'description' => 'Salons, spas, cosmetics.'],
            ['icon' => '🚑', 'title' => 'Emergency Services', 'description' => 'Fire, EMS, rescue.'],
            ['icon' => '🐾', 'title' => 'Animal & Veterinary', 'description' => 'Vet clinics, pet care.'],

            // ---- OTHER ----
            ['icon' => '🧩', 'title' => 'Other', 'description' => 'Uncategorized or mixed sectors.'],
        ];

        foreach ($rows as $r) {
            BusinessModel::updateOrCreate(['title' => $r['title']], $r);
        }
    }
}
