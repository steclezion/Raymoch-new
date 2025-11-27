<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Company;
use App\Models\CompanyContact;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ContactFactory>
 */
class CompanyContactFactory extends Factory
{
    protected $model = CompanyContact::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'company_id'    => Company::factory(),
            'contact_name'  => $this->faker->name(),
            'role'          => $this->faker->randomElement(['General contact', 'Business development', 'Investor relations', 'Support']),
            'email'         => $this->faker->unique()->safeEmail(),
            'phone'         => $this->faker->e164PhoneNumber(),
            'address_line1' => $this->faker->streetAddress(),
            'address_line2' => $this->faker->optional()->secondaryAddress(),
            'city'          => $this->faker->city(),
            'state'         => $this->faker->state(),
            'postal_code'   => $this->faker->postcode(),
            'country'       => $this->faker->country(),
        ];
    }
}
