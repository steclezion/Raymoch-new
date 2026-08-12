<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrganizationSize>
 */
class OrganizationSizeFactory extends Factory
{
    public function definition(): array
    {
        $min = fake()->numberBetween(1, 500);

        return [
            'name' => fake()->randomElement([
                'Micro',
                'Small',
                'Medium',
                'Large',
                'Enterprise',
            ]),
            'code' => fake()->unique()->bothify('SIZE-###'),
            'min_employees' => $min,
            'max_employees' => $min + fake()->numberBetween(20, 500),
            'description' => fake()->sentence(),
        ];
    }
}
