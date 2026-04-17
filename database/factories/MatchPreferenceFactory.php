<?php

namespace Database\Factories;

use App\Models\Company;
use App\Models\User;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MatchPreference>
 */
class MatchPreferenceFactory extends Factory
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

            'created_by' => User::factory(),

            'seeking_investment' => $this->faker->boolean(),
            'seeking_suppliers' => $this->faker->boolean(),
            'seeking_buyers' => $this->faker->boolean(),
            'seeking_distributors' => $this->faker->boolean(),
            'seeking_service_providers' => $this->faker->boolean(),
            'seeking_market_access' => $this->faker->boolean(),

            'preferred_company_size_id' => $this->faker->numberBetween(1, 5),
            'preferred_stage_id' => $this->faker->numberBetween(1, 5),

            'preferred_min_cti_score' => $this->faker->numberBetween(0, 100),

            'preferred_regions' => json_encode($this->faker->randomElements([
                'Africa',
                'Europe',
                'Asia',
                'North America',
                'South America'
            ], $this->faker->numberBetween(1, 3))),

            'preferred_languages' => json_encode($this->faker->randomElements([
                'English',
                'French',
                'Spanish',
                'Arabic',
                'Chinese'
            ], $this->faker->numberBetween(1, 3))),

            'budget_min' => $this->faker->numberBetween(1000, 50000),
            'budget_max' => $this->faker->numberBetween(50001, 500000),

            'currency_code' => $this->faker->randomElement(['USD', 'EUR', 'GBP']),

            'is_active' => $this->faker->boolean(90),

            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
