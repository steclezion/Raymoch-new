<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class StageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
 public function run(): void
    {
        $now = now();

        $items = [
            ['id'=>1,'name'=>'Startup','description'=>'Early-stage company validating idea and building MVP'],
            ['id'=>2,'name'=>'Early Growth','description'=>'Initial traction with growing customers and revenue'],
            ['id'=>3,'name'=>'Growth','description'=>'Scaling operations, expanding market presence'],
            ['id'=>4,'name'=>'Expansion','description'=>'Entering new markets or diversifying products/services'],
            ['id'=>5,'name'=>'Mature','description'=>'Established business with stable revenue and operations'],
        ];

        $rows = array_map(function ($item) use ($now) {
            return [
                'id' => $item['id'],
                'name' => $item['name'],
                'code' => Str::slug($item['name'], '_'),
                'description' => $item['description'],
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }, $items);

        DB::table('stages')->upsert(
            $rows,
            ['id'], // keep IDs fixed
            ['name','code','description','updated_at']
        );
    }
}
