<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;


class DefaultUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */

    public function run()
    {
        User::firstOrCreate([
            'email' => 'admin@raymoch.com'
        ], [
            'name' => 'Admin',
            'password' => bcrypt('password'),
            'is_verified' => true
        ]);


        
    }
}
