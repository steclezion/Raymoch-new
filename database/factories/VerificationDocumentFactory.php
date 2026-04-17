<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\OrganizationVerification;


/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\VerificationDocument>
 */
class VerificationDocumentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $fileName = $this->faker->uuid . '.pdf';

        return [
            'organization_verification_id' => random_int(1, OrganizationVerification::count()),

            'document_type' => $this->faker->randomElement([
                'business_license',
                'tax_certificate',
                'identity_document',
                'address_proof',
                'compliance_document',
            ]),

            'file_path' => 'uploads/verification/' . $fileName,
            'original_name' => $fileName,

            'mime_type' => 'application/pdf',
            'file_size' => $this->faker->optional()->numberBetween(10000, 5000000),

            'status' => $this->faker->randomElement([
                'uploaded',
                'under_review',
                'approved',
                'rejected',
            ]),

            'uploaded_by' => User::factory(),

            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
