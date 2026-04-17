<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\StatesAll;
use App\Models\CountryAfrican as Country;
use Illuminate\Support\Facades\DB;

class StatesAllTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //

        (DB::unprepared(file_get_contents(database_path('seeders/sql/states_all.sql'))));
    }
}
