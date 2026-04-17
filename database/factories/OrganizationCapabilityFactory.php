<?php

namespace Database\Factories;

use App\Models\Company;
use App\Models\Capability;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrganizationCapability>
 */
class OrganizationCapabilityFactory extends Factory
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
            'capability_id' => Capability::factory(),
            'description' => $this->faker->sentence(),
            'capacity_value' => $this->faker->numberBetween(1, 100),
            'capacity_unit' => $this->faker->randomElement(['hours', 'days', 'weeks']),
            'quality_certified' => $this->faker->boolean(30), // 30% chance of being certified 
            'export_ready' => $this->faker->boolean(50), // 50% chance of being export ready    
        ];
    }
}
