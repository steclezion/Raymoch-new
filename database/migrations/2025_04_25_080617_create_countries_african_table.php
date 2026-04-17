<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Region;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('countries_africans', function (Blueprint $table) {
            // $table->id();
            // $table->string('name')->nullable();
            // $table->timestamps();
            $table->id();
            $table->string('country_code', 2);       // ISO2 (US, GB, ET, …)
            $table->string('country_name');
            $table->foreignId('region_id')->constrained()->cascadeOnDelete(); // "United States"
            $table->string('flag_icon', 8)->nullable(); // emoji flag or alias
            $table->timestamps();
            $table->foreignId('countries_all_id')->constrained('countries_all')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('countries_africans');
    }
};
