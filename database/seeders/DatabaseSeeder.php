<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
        //CountriesBusinessTableSeeder  BusinessModelsTableSeeder

        $this->call(DefaultUserSeeder::class);
        $this->call(CountriesTableSeeder::class);
        $this->call(CountriesBusinessTableSeeder::class);
        $this->call(BusinessModelsTableSeeder::class);
        $this->call(CompaniesTableSeeder::class);
    }
}
