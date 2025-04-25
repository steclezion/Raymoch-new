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
        Schema::create('companyinfos', function (Blueprint $table) {
            $table->id();
            $table->string('company_title')->default('Project');
            $table->foreignId('company_classifications_id')->constrained('company_classifications')->onDelete('cascade');
            $table->string('tagline')->default('Toafy');
            $table->longText('first_picture')->nullable();
            $table->string('second_picture')->nullable();
            $table->string('third_picture')->nullable();
            $table->string('status')->default('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('companyinfos');
    }
};
