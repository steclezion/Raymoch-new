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
        Schema::create('home_page_welcomes', function (Blueprint $table) {
            $table->id();
            $table->string('title')->default('Untitled Project');
            $table->longText('description')->default('As part of the Eritrean Enterprise Hub, you are now connected to');
            $table->longText('first_picture')->nullable();
            $table->string('second_picture')->nullable();
            $table->string('status')->default('active');
            $table->timestamps(); // shorthand for created_at & updated_at

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('home_page_welcomes');
    }
};
