<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('countries_all', function (Blueprint $table) {
            $table->boolean('status')
                ->default(1)
                ->after('name'); // change 'name' if needed
        });
        DB::table('countries_all')
            ->where('tele_code', '+1')
            ->update(['status' => 0]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('countries_all', function (Blueprint $table) {
            //
        });
    }
};
