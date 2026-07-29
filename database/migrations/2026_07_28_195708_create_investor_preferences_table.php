<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Store an investor's matching preferences.
     */
    public function up(): void
    {
        Schema::create('investor_preferences', function (Blueprint $table) {
            // Publicly safe UUID primary key.
            $table->uuid('id')->primary();

            // The authenticated user who owns this preference.
            // Assumes users.id is BIGINT UNSIGNED.
            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            // Optional name when investors save multiple profiles.
            // Example: "East African Agriculture".
            $table->string('preference_name', 150)
                ->default('Default Investment Preference');

            // Minimum amount the investor is willing to inject.
            $table->decimal('ticket_min', 15, 2);

            // Maximum amount the investor is willing to inject.
            $table->decimal('ticket_max', 15, 2);

            // ISO-style currency code.
            $table->char('currency_code', 3)->default('USD');

            // Earliest month in which the investor can begin.
            // Zero means immediately.
            $table->unsignedSmallInteger('start_from_month')
                ->default(0);

            // Latest acceptable starting month.
            $table->unsignedSmallInteger('start_to_month')
                ->default(6);

            // When true, only verified companies are eligible.
            $table->boolean('verified_companies_only')
                ->default(false);

            // Optional integration with the existing Raymoch CTI system.
            // Examples might be bronze, silver, gold, or platinum.
            $table->string('minimum_cti_tier', 30)->nullable();

            // Identifies the investor's primary preference profile.
            $table->boolean('is_default')->default(true);

            // Allows preference profiles to be disabled.
            $table->boolean('is_active')->default(true);

            $table->timestamps();

            // Speeds up retrieval of the user's active/default profile.
            $table->index(
                ['user_id', 'is_active', 'is_default'],
                'investor_preferences_user_status_idx'
            );

            // Helps amount-range matching.
            $table->index(
                ['ticket_min', 'ticket_max'],
                'investor_preferences_ticket_idx'
            );
        });
    }

    /**
     * Remove investor preferences.
     */
    public function down(): void
    {
        Schema::dropIfExists('investor_preferences');
    }
};
