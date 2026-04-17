<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\CitiesAll;
use App\Models\CountryAfrican as Country;
use Illuminate\Support\Facades\DB;

class CitiesAllSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        (DB::unprepared(file_get_contents(database_path('seeders/sql/cities_all.sql'))));
    }
}
