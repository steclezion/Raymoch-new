<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Company;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProcurementRequest>
 */
class ProcurementRequestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        //
        return [
            'company_id' => Company::factory(),
            'title' => $this->faker->sentence(),
            'budget' => $this->faker->numberBetween(1000, 100000),
        ];
    }
}
