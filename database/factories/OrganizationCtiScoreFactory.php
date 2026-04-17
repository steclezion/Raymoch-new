<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Company;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrganizationCtiScore>
 */
class OrganizationCtiScoreFactory extends Factory
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

            'score' => $this->faker->randomFloat(2, 0, 100),

            'risk_level' => $this->faker->randomElement(['low', 'medium', 'high']),
            'confidence_level' => $this->faker->randomElement(['low', 'medium', 'high']),

            'calculated_at' => $this->faker->date('Y-m-d'),

            'calculation_version' => $this->faker->optional()->randomElement([
                'v1.0',
                'v2.0',
                'v3.0'
            ]),

            'notes' => $this->faker->optional()->sentence(),

            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
