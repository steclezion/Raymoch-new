<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CompanyLocation>
 */
class CompanyLocationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Example: somewhere roughly in Africa
        $lat = $this->faker->latitude(-35, 35);
        $lng = $this->faker->longitude(-20, 55);

        return [
            // company_id will be set in seeder
            'latitude'      => $lat,
            'longitude'     => $lng,
            'address_line1' => $this->faker->streetAddress(),
            'city'          => $this->faker->city(),
            'state'         => $this->faker->state(),
            'postal_code'   => $this->faker->postcode(),
            'country'       => $this->faker->country(),
        ];
    }
}
