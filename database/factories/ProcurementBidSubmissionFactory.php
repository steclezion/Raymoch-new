<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Company;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProcurementBidSubmission>
 */
class ProcurementBidSubmissionFactory extends Factory
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
            'amount' => $this->faker->numberBetween(500, 50000),
            'status' => $this->faker->randomElement(['submitted', 'won', 'lost']),
        ];
    }
}
