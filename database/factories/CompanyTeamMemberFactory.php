<?php

namespace Database\Factories;

use App\Models\Company;



use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CompanyTeamMember>
 */
class CompanyTeamMemberFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $roleTypes = ['Founder', 'Co-founder', 'Executive', 'Board', 'Advisor'];
        $titles = [
            'Chief Executive Officer',
            'Chief Technology Officer',
            'Chief Operating Officer',
            'Chief Financial Officer',
            'Head of Product',
            'Head of Operations',
            'Head of Growth',
        ];

        return [
            'company_id' => Company::factory(),
            'full_name'  => $this->faker->name(),
            'title'      => $this->faker->randomElement($titles),
            'role_type'  => $this->faker->randomElement($roleTypes),
            'bio'        => $this->faker->paragraph(3),
        ];
    }
}
