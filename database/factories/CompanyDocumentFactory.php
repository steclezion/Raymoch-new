<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Company;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CompanyDocument>
 */
class CompanyDocumentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    // public function definition(): array
    // {

    //     $types = ['Pitch deck', 'Financial report', 'Company profile', 'Term sheet', 'Legal document'];

    //     return [
    //         'company_id'    => Company::factory(),
    //         'title'         => $this->faker->sentence(3) . ' (' . $this->faker->randomElement($types) . ')',
    //         'document_type' => $this->faker->randomElement($types),
    //         'as_of_date'    => $this->faker->dateTimeBetween('-3 years', 'now')->format('Y-m-d'),
    //         'file_path'     => 'documents/company-' . $this->faker->numberBetween(1, 100) . '/' . $this->faker->uuid . '.pdf',
    //     ];
    // }

    public function definition(): array
    {
        //  $types = ['Pitch deck', 'Financial report', 'Company profile', 'Term sheet', 'Legal document'];

        // Curated set of realistic document templates
        $templates = [
            [
                'title'     => 'Company Profile',
                'file_name' => 'company_profile.pdf',
                'type'      => 'pdf',
            ],
            [
                'title'     => 'Financial Statement 2023',
                'file_name' => 'financial_statement_2023.pdf',
                'type'      => 'pdf',
            ],
            [
                'title'     => 'Shareholder Agreement',
                'file_name' => 'shareholder_agreement.pdf',
                'type'      => 'pdf',
            ],
            [
                'title'     => 'Partnership Contract',
                'file_name' => 'partnership_contract.pdf',
                'type'      => 'pdf',
            ],
            [
                'title'     => 'Board Resolution',
                'file_name' => 'board_resolution.docx',
                'type'      => 'docx',
            ],
        ];

        $tpl = $this->faker->randomElement($templates);
        $types = ['Pitch deck', 'Financial report', 'Company profile', 'Term sheet', 'Legal document'];

        // Optional: fake a path as if stored under /storage/documents
        $folder = 'documents/' . Str::uuid();
        $filePath = $folder . '/' . $tpl['file_name'];

        return [
            // Foreign key is set in seeder: 'company_id' => $company->id


            'company_id'    => Company::factory(),
            'title'         => $this->faker->sentence(3) . ' (' . $this->faker->randomElement($types) . ')',
            'document_type' => $this->faker->randomElement($types),
            'as_of_date'    => $this->faker->dateTimeBetween('-3 years', 'now')->format('Y-m-d'),
            'file_path'     => 'documents/company-' . $this->faker->numberBetween(1, 100) . '/' . $this->faker->uuid . '.pdf',

        ];
    }
}
