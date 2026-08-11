<?php


namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Region;

class RegionSeeder extends Seeder
{
    public function run()
    {
        $regions = [
            [
                'name' => 'North Africa',
                'code' => 'NA',
                'description' => 'Countries in the northern part of Africa (e.g., Egypt, Libya, Morocco).'
            ],
            [
                'name' => 'West Africa',
                'code' => 'WA',
                'description' => 'Includes Nigeria, Ghana, Senegal and surrounding countries.'
            ],
            [
                'name' => 'East Africa',
                'code' => 'EA',
                'description' => 'Includes Kenya, Ethiopia, Tanzania, Uganda and neighbors.'
            ],
            [
                'name' => 'Central Africa',
                'code' => 'CA',
                'description' => 'Includes DR Congo, Cameroon, Chad and nearby countries.'
            ],
            [
                'name' => 'Southern Africa',
                'code' => 'SA',
                'description' => 'Includes South Africa, Namibia, Botswana, Zimbabwe, etc.'
            ],
            [
                'name' => 'Horn of Africa',
                'code' => 'HOA',
                'description' => 'Includes Somalia, Ethiopia, Eritrea, Djibouti.'
            ],
            [
                'name' => 'Sahel Region',
                'code' => 'SAHEL',
                'description' => 'Semi-arid region south of Sahara (Mali, Niger, Chad).'
            ],
            [
                'name' => 'Great Lakes Region',
                'code' => 'GLR',
                'description' => 'Includes Rwanda, Burundi, Uganda, DR Congo.'
            ],
        ];

        foreach ($regions as $region) {
            Region::updateOrCreate(
                ['code' => $region['code']],
                [
                    'name' => $region['name'],
                    'description' => $region['description'],
                ]
            );
        }
    }
}
