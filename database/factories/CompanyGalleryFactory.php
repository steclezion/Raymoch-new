<?php

namespace Database\Factories;

use App\Models\Company;
use App\Models\CompanyGallery;
use Illuminate\Database\Eloquent\Factories\Factory;

class CompanyGalleryFactory extends Factory
{
    protected $model = CompanyGallery::class;

    public function definition(): array
    {
        return [
            'company_id' => Company::factory(),
            'image_url'  => $this->faker->imageUrl(800, 600, 'business', true, 'Raymoch'),
            'caption'    => $this->faker->sentence(6),
        ];
    }
}
