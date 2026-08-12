<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\OrganizationSize;

class OrganizationSizeSeeder extends Seeder
{
    public function run(): void
    {
        $sizes = [
            [
                'name' => 'Micro',
                'code' => 'MICRO',
                'min_employees' => 1,
                'max_employees' => 9,
                'description' => 'Micro organization with 1 to 9 employees.',
            ],
            [
                'name' => 'Small',
                'code' => 'SMALL',
                'min_employees' => 10,
                'max_employees' => 49,
                'description' => 'Small organization with 10 to 49 employees.',
            ],
            [
                'name' => 'Medium',
                'code' => 'MEDIUM',
                'min_employees' => 50,
                'max_employees' => 249,
                'description' => 'Medium organization with 50 to 249 employees.',
            ],
            [
                'name' => 'Large',
                'code' => 'LARGE',
                'min_employees' => 250,
                'max_employees' => 999,
                'description' => 'Large organization with 250 to 999 employees.',
            ],
            [
                'name' => 'Enterprise',
                'code' => 'ENTERPRISE',
                'min_employees' => 1000,
                'max_employees' => null,
                'description' => 'Enterprise organization with 1,000 or more employees.',
            ],
        ];

        foreach ($sizes as $size) {
            OrganizationSize::updateOrCreate(
                ['code' => $size['code']],
                $size
            );
        }
    }
}
