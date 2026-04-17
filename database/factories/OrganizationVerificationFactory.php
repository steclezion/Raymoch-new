<?php

namespace Database\Factories;

use App\Models\Company;
use App\Models\User;
use App\Models\VerificationType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrganizationVerification>
 */
class OrganizationVerificationFactory extends Factory
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
            'verified_by' => User::factory(),
            'status' => $this->faker->randomElement(['pending', 'verified', 'rejected', 'expired']),
            'submitted_at' => $this->faker->date('Y-m-d'),
            'verification_type_id' => VerificationType::inRandomOrder()->value('id'),
            'score' => $this->faker->numberBetween(0, 100),
            'notes' => $this->faker->optional()->sentence(),
            'verified_at' => $this->faker->date('Y-m-d'),
            'created_at' => now(),
            'updated_at' => now(),
            'expiry_date' => $this->faker->optional()->dateTimeBetween('now', '+1 year'),
        ];
    }
}
