<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

use App\Models\Company_Financial;
use App\Models\Company;
use App\Models\CompanyDocument;
use App\Models\Document;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DocumentFactory>
 */
class DocumentFactory extends Factory
{

    protected $model = CompanyDocument::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */



    public function definition(): array
    {

        $types = ['Pitch deck', 'Financial report', 'Company profile', 'Term sheet', 'Legal document'];

        return [
            'company_id'    => Company::factory(),
            'title'         => $this->faker->sentence(3) . ' (' . $this->faker->randomElement($types) . ')',
            'document_type' => $this->faker->randomElement($types),
            'as_of_date'    => $this->faker->dateTimeBetween('-3 years', 'now')->format('Y-m-d'),
            'file_path'     => 'documents/company-' . $this->faker->numberBetween(1, 100) . '/' . $this->faker->uuid . '.pdf',
        ];
    }
}
