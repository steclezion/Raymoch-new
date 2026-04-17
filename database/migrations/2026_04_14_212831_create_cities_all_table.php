<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('cities_all', function (Blueprint $table) {
            $table->id();
            $table->string('name');

            $table->unsignedBigInteger('state_id')->nullable();
            $table->string('state_code')->nullable();

            $table->unsignedBigInteger('country_id');
            $table->string('country_code', 2);

            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();

            $table->boolean('flag')->default(true);
            $table->string('wikiDataId')->nullable();

            $table->timestamps();

            // Optional foreign keys
            // $table->foreign('country_id')->references('id')->on('countries')->cascadeOnDelete();
            // $table->foreign('state_id')->references('id')->on('states')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cities_all');
    }
};
