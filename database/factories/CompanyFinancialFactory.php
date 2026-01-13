<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Company;
use App\Models\CompanyFinancial;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CompanyFinancial>
 */
class CompanyFinancialFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = CompanyFinancial::class;

    public function definition(): array
    {
        $year = $this->faker->numberBetween(2018, 2025);
        $revenue = $this->faker->numberBetween(500_000, 50_000_000);
        $ebitda = (int)($revenue * $this->faker->randomFloat(2, 0.05, 0.35));
        $netIncome = (int)($ebitda * $this->faker->randomFloat(2, 0.5, 0.9));
        $valuation = $revenue * $this->faker->numberBetween(2, 8);

        return [
            'company_id' => Company::factory(), // will be overridden when used via relationship
            'fiscal_year' => $year,
            'revenue' => $revenue,
            'ebitda' => $ebitda,
            'net_income' => $netIncome,
            'total_assets' => $valuation,
        ];
    }
}
