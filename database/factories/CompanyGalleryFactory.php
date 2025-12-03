<?php

namespace Database\Factories;

use App\Models\Company;
use App\Models\CompanyGallery;
use Illuminate\Database\Eloquent\Factories\Factory;

class CompanyGalleryFactory extends Factory
{
    protected $model = CompanyGallery::class;

    // public function definition(): array
    // {
    //     return [
    //         'company_id' => Company::factory(),
    //         'image_url'  => $this->faker->imageUrl(800, 600, 'business', true, 'Raymoch'),
    //         'caption'    => $this->faker->sentence(6),
    //     ];
    // }



    public function definition(): array
    {
        // A few tiny valid PNGs as base64 (1x1, 2x2 etc.)
        // you can add more variants if you like – these are real PNGs
        $base64Images = [
            // Gray pixel
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Yw35cQAAAAASUVORK5CYII=',
            // Another small PNG (just an example, can reuse the same)
            'iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAADElEQVR42mP8/5+hHgAHGQK9J7YsmgAAAABJRU5ErkJggg==',
        ];

        $rawBase64 = $this->faker->randomElement($base64Images);

        return [
            // 'company_id' set in seeder
            'caption'       => $this->faker->sentence(6),
            'alt_text'      => $this->faker->words(3, true),

            // If your column is called `image_base64`
            'image_base64'  => 'data:image/png;base64,' . $rawBase64,

            // If instead you store just the base64 body, drop "data:image/png;base64,"
            // 'image_base64' => $rawBase64,

            'sort_order'    => $this->faker->numberBetween(1, 10),
            'is_primary'    => $this->faker->boolean(20),
        ];
    }
}
