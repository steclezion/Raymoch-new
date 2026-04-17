<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Company;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrganizationProfile>
 */
class OrganizationProfileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'company_id'    => Company::factory(),

            'mission' => $this->faker->sentence(12),
            'vision' => $this->faker->sentence(10),
            'business_summary' => $this->faker->paragraphs(3, true),

            'primary_industry_id' => $this->faker->numberBetween(1, 10),
            'secondary_industry_id' => $this->faker->optional()->numberBetween(1, 10),

            'business_model' => $this->faker->randomElement([
                'B2B',
                'B2C',
                'Marketplace',
                'SaaS',
                'Hybrid'
            ]),

            'stage_id' => $this->faker->numberBetween(1, 5),

            'founded_date' => $this->faker->date(),

            'women_led' => $this->faker->boolean(),
            'youth_led' => $this->faker->boolean(),
            'export_ready' => $this->faker->boolean(),
            'has_cross_border_operations' => $this->faker->boolean(),

            'logo' => $this->faker->imageUrl(200, 200, 'business'),
            'cover_image' => $this->faker->imageUrl(800, 400, 'business'),
        ];
    }
}
