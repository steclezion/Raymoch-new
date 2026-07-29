<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Store calculated matches between an investor preference
     * and a company investment opportunity.
     */
    public function up(): void
    {
        Schema::create(
            'investor_company_matches',
            function (Blueprint $table) {
                // UUID for the match record.
                $table->uuid('id')->primary();

                // Preference used during matching.
                $table->uuid('investor_preference_id');

                // Opportunity matched against the preference.
                $table->uuid('investment_opportunity_id');

                // Internal score from 0.00 to 100.00.
                // This value must not be exposed to the investor.
                $table->decimal('private_score', 5, 2);

                // Public description shown in the UI.
                // Examples: excellent, strong, moderate, limited.
                $table->string('match_band', 30);

                // Human-readable reasons explaining the match.
                $table->json('match_reasons')->nullable();

                // Last time this match was recalculated.
                $table->timestamp('calculated_at');

                $table->timestamps();

                $table->foreign(
                    'investor_preference_id',
                    'icm_preference_fk'
                )
                    ->references('id')
                    ->on('investor_preferences')
                    ->cascadeOnDelete();

                $table->foreign(
                    'investment_opportunity_id',
                    'icm_opportunity_fk'
                )
                    ->references('id')
                    ->on('investment_opportunities')
                    ->cascadeOnDelete();

                // One result per preference/opportunity pair.
                $table->unique(
                    [
                        'investor_preference_id',
                        'investment_opportunity_id',
                    ],
                    'icm_preference_opportunity_uq'
                );

                // Supports ordering matches by private score.
                $table->index(
                    'private_score',
                    'icm_private_score_idx'
                );

                // Supports filtering results by public band.
                $table->index(
                    ['match_band', 'calculated_at'],
                    'icm_band_calculated_idx'
                );
            }
        );
    }

    public function down(): void
    {
        Schema::dropIfExists('investor_company_matches');
    }
};
