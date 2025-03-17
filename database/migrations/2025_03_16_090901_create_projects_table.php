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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('name')->default('Untitled Project');
            $table->longText('description')->nullable();
            $table->timestamp('due_date')->nullable();
            $table->string('status')->default('active');
            $table->string('image_path')->nullable();
            $table->foreignId('created_by')->constrained('users')->default(1);
            $table->foreignId('updated_by')->constrained('users')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
