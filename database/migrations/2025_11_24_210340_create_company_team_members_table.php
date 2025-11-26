<?php

// database/migrations/2025_11_24_000002_create_company_team_members_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('company_team_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();

            $table->string('full_name');
            $table->string('title')->nullable();        // e.g. CEO
            $table->string('role_type', 50)->nullable(); // founder, exec, advisor
            $table->text('bio')->nullable();

            $table->string('email')->nullable();
            $table->string('linkedin_url')->nullable();
            $table->decimal('ownership_percent', 5, 2)->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company_team_members');
    }
};
