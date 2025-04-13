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
        Schema::create('home_welcome_second_pages', function (Blueprint $table) {
            $table->id();
            $table->string('title')->default('Untitled Project');
            $table->longText('picture')->nullable();
            $table->longText('description_one')->nullable();
            $table->longText('description_two')->nullable();
            $table->longText('description_three')->nullable();
            $table->string('status')->default('active');
            $table->timestamps(); // shorthand for created_at & updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('home_welcome_second_pages');
    }
};
