<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Region>
 */
class RegionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $regions = [
            ['North Africa', 'NA'],
            ['West Africa', 'WA'],
            ['East Africa', 'EA'],
            ['Central Africa', 'CA'],
            ['Southern Africa', 'SA'],
        ];

        $region = $this->faker->randomElement($regions);

        return [
            'name' => $region[0],
            'code' => $region[1],
            'description' => $this->faker->sentence(),
        ];
    }
}
