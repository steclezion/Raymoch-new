<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cookie_consent_preferences', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('cookie_consent_id')->constrained()->cascadeOnDelete();
            $table->string('category', 40);
            $table->boolean('enabled')->default(false);
            $table->timestamps();

            $table->unique(['cookie_consent_id', 'category']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cookie_consent_preferences');
    }
};
