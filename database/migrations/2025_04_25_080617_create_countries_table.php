<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('countries', function (Blueprint $table) {
           // $table->id();
           // $table->string('name')->nullable();
           // $table->timestamps();
$table->id();
            $table->string('country_code', 2);       // ISO2 (US, GB, ET, …)
            $table->string('country_name');          // "United States"
            $table->string('flag_icon', 8)->nullable(); // emoji flag or alias
            $table->timestamps();
            $table->string('name')->default(0)->nullable();

        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('countries');
    }
};
