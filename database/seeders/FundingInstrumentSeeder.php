<?php

namespace Database\Seeders;

use App\Models\FundingInstrument;
use Illuminate\Database\Seeder;

class FundingInstrumentSeeder extends Seeder
{
    /**
     * Insert or update the standard funding instruments.
     */
    public function run(): void
    {
        $instruments = [
            [
                'code' => 'equity',
                'name' => 'Equity',
                'description' =>
                'The investor receives an ownership interest in the company.',
            ],
            [
                'code' => 'revenue_share',
                'name' => 'Revenue Share',
                'description' =>
                'The investor receives an agreed percentage of company revenue.',
            ],
            [
                'code' => 'po_finance',
                'name' => 'PO Finance',
                'description' =>
                'Financing provided to help fulfill confirmed purchase orders.',
            ],
            [
                'code' => 'debt',
                'name' => 'Debt',
                'description' =>
                'Borrowed funding repaid under agreed repayment terms.',
            ],
        ];

        foreach ($instruments as $instrument) {
            FundingInstrument::updateOrCreate(
                // Find the instrument using its stable internal code.
                ['code' => $instrument['code']],

                // Insert or update the remaining values.
                [
                    'name' => $instrument['name'],
                    'description' => $instrument['description'],
                    'is_active' => true,
                ]
            );
        }
    }
}
