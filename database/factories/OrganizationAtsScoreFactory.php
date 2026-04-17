<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Company;
use App\Models\TrustDimension;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrganizationAtsScore>
 */
class OrganizationAtsScoreFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'company_id' => Company::factory(),
            'trust_dimension_id' => TrustDimension::inRandomOrder()->value('id'),

            'score' => $this->faker->randomFloat(2, 0, 100),
            'max_score' => 100.00,

            'calculated_at' => $this->faker->date('Y-m-d'),
            'calculation_version' => $this->faker->optional()->randomElement([
                'v1',
                'v2',
                'v3'
            ]),

            'notes' => $this->faker->optional()->sentence(),

            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
