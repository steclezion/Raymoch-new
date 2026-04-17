<?php

namespace Database\Factories;

use App\Models\Company;
use App\Models\CountryAfrican as Country;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\\Models\\OrganizationLocation>
 */
class OrganizationLocationFactory extends Factory
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
            'country_id' => $this->faker->randomElement(
                country::pluck('id')->toArray()
            ),
            'city' => $this->faker->city(),
            'address_line_1' => $this->faker->address(),
            'address_line_2' => $this->faker->secondaryAddress(),
            'postal_code' => $this->faker->postcode(),
            'latitude' => $this->faker->latitude(),
            'longitude' => $this->faker->longitude(),
            'location_type' => $this->faker->randomElement(['head_office', 'branch', 'factory', 'warehouse', 'service_area']),
            'is_primary' => $this->faker->boolean(20), // 20% chance of being primary
        ];
    }
}
