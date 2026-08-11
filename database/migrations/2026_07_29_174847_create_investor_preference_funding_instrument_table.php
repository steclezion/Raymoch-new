<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Connect investor preferences to selected funding instruments.
     */
    public function up(): void
    {
        Schema::create(
            'investor_preference_funding_instrument',
            function (Blueprint $table) {
                // UUID belonging to investor_preferences.id.
                $table->uuid('investor_preference_id');

                // BIGINT belonging to funding_instruments.id.
                $table->unsignedBigInteger('funding_instrument_id');

                // Short custom constraint names prevent MySQL's
                // maximum-identifier-length problem.
                $table->foreign(
                    'investor_preference_id',
                    'ipfi_preference_fk'
                )
                    ->references('id')
                    ->on('investor_preferences')
                    ->cascadeOnDelete();

                $table->foreign(
                    'funding_instrument_id',
                    'ipfi_instrument_fk'
                )
                    ->references('id')
                    ->on('funding_instruments')
                    ->cascadeOnDelete();

                // Prevent duplicate preference/instrument combinations.
                $table->primary(
                    [
                        'investor_preference_id',
                        'funding_instrument_id',
                    ],
                    'ipfi_primary'
                );
                $table->timestamps();

                // Supports reverse searches by funding instrument.
                $table->index(
                    'funding_instrument_id',
                    'ipfi_instrument_idx'
                );
            }
        );
    }

    public function down(): void
    {
        Schema::dropIfExists(
            'investor_preference_funding_instrument'
        );
    }
};
