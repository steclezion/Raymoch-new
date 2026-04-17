<?php

namespace Database\Factories;

use App\Models\Company;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProductServiceFactory>
 */
class ProductServiceFactory extends Factory
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
            'name' => $this->faker->word(),
            'description' => $this->faker->paragraph(),
            'type' => $this->faker->randomElement(['product', 'service']),
            'category' => $this->faker->randomElement(['technology', 'consulting', 'manufacturing', 'agriculture']),
            'unit_of_measure' => $this->faker->randomElement(['units', 'hours', 'days']),
            'min_order_quantity' => $this->faker->numberBetween(1, 100),
            'production_capacity' => $this->faker->numberBetween(100, 10000),
            'production_capacity_unit' => $this->faker->randomElement(['units', 'hours', 'days']),
            'price_range_min' => $this->faker->numberBetween(100, 1000),
            'price_range_max' => $this->faker->numberBetween(1000, 100000),
            'currency_code' => $this->faker->currencyCode(),
            'is_active' => $this->faker->boolean(80), // 80% chance of being active
        ];
    }
}
