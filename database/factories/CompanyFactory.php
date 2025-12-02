<?php

namespace Database\Factories;

use App\Models\Company;
use Illuminate\Database\Eloquent\Factories\Factory;

class CompanyFactory extends Factory
{
    protected $model = Company::class;

    public function definition(): array
    {
        $sectors = [
            'Wholesale Trade',
            'Water & Sanitation',
            'Trucking & Freight',
            'Tourism & Hospitality',
            'Textile & Apparel',
            'Telecommunications',
            'Science & Research',
            'Satellite & Space Tech',
            'Retail & Ecommerce',
            'Real Estate',
            'Rail Transport',
            'Pharmaceuticals',
            'Packaging',
            'Other',
            'Oil & Gas',
            'Nonprofit & NGOs',
            'Music & Entertainment',
            'Mining & Extractives',
            'Media & Creative',
            'Market Research',
            'Maritime & Ports',
            'Manufacturing',
            'Logistics & Mobility',
            'Life Sciences',
            'Legal Services',
            'Investment & Capital Markets',
            'Insurance',
            'ICT & Software',
            'Humanitarian & Social Services',
            'Healthcare',
            'Government',
            'Gaming & Esports',
            'Forestry',
            'Food Products & Processing',
            'Food & Beverage',
            'Fishing & Aquaculture',
            'FinTech',
            'Environmental Services',
            'Engineering Services',
            'Energy & Renewables',
            'Emergency Services',
            'Education',
            'EdTech',
            'Dental Care',
            'Cybersecurity',
            'Consulting & Advisory',
            'Construction',
            'Climate & Sustainability',
            'Chemicals',
            'Biotechnology',
            'Beauty & Personal Care',
            'Battery & Storage',
            'Banking',
            'Aviation',
            'Automotive Manufacturing',
            'Animal & Veterinary',
            'AI & Machine Learning',
            'Agriculture',
            'Accounting & Audit',

        ];

        $stages = ['Idea', 'Pre-seed', 'Seed', 'Growth', 'Mature'];
        $countries = [
            'Algeria',
            'Angola',
            'Benin',
            'Botswana',
            'Burkina Faso',
            'Burundi',
            'Cameroon',
            'Cabo Verde',
            'Chad',
            'Comoros',
            'Congo',
            'DR Congo',
            'Côte d’Ivoire',
            'Djibouti',
            'Egypt',
            'Eritrea',
            'Ethiopia',
            'Gabon',
            'Ghana',
            'Kenya',
            'Liberia',
            'Libya',
            'Madagascar',
            'Malawi',
            'Mali',
            'Morocco',
            'Mozambique',
            'Namibia',
            'Niger',
            'Nigeria',
            'Rwanda',
            'Senegal',
            'Somalia',
            'South Africa',
            'South Sudan',
            'Sudan',
            'Tanzania',
            'Togo',
            'Tunisia',
            'Uganda',
            'Zambia',
        ];

        $verificationStatuses = [
            'unverified',
            'pending verification',
            'verified',
        ];

        $ctiTiers = ['CTI Gold', 'CTI Silver', 'CTI Bronze', null];

        return [
            // ⚠️ Use your REAL column names here
            'CompanyName'         => $this->faker->company(),
            'Sector'              => $this->faker->randomElement($sectors),
            'Country'             => $this->faker->randomElement($countries),
            'City'                => $this->faker->city(),
            'Stage'               => $this->faker->randomElement($stages),

            // for verified / pending / unverified
            'VerificationStatus'  => $this->faker->randomElement($verificationStatuses),

            // CTI
            'CTI_Tier'            => $this->faker->randomElement($ctiTiers),
            'CTI_Score'           => $this->faker->numberBetween(50, 95),

            'location_name' => $this->faker->city(),
            'latitude'      => $this->faker->latitude(24, 49),   // USA-like range
            'longitude'     => $this->faker->longitude(-125, -67),

            // timestamps if you use them
            'created_at'          => now()->subDays(rand(0, 365)),
            'updated_at'          => now(),
        ];
    }
}
