<?php

namespace Database\Factories;

use App\Models\Company;
use App\Models\Gallery;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\GalleryFactory>
 */
class GalleryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            //

            'company_id' => Company::factory(),
            'image_url'  => $this->faker->imageUrl(800, 600, 'business', true, 'Raymoch'),
            'caption'    => $this->faker->sentence(6),
        ];
    }
}
