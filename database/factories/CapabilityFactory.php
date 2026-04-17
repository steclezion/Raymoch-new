<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Capability;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Capability>
 */
class CapabilityFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->words(2, true),
            'code' => strtoupper($this->faker->unique()->bothify('CAP-###??')),
            'description' => $this->faker->optional()->sentence(),
            'capability_type' => $this->faker->randomElement([
                'product',
                'service',
                'technology',
                'capacity',
                'expertise'
            ]),
        ];
    }
}
