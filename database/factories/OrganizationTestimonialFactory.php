<?php

namespace Database\Factories;

use App\Models\Company;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrganizationTestimonial>
 */
class OrganizationTestimonialFactory extends Factory
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
            'author' => $this->faker->name(),
            'content' => $this->faker->paragraph(),
        ];
    }
}
