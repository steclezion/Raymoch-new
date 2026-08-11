<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Connect an investor preference to selected countries.
     */
    public function up(): void
    {
        Schema::create(
            'investor_preference_country',
            function (Blueprint $table) {
                $table->uuid('investor_preference_id');

                // Assumes countries.id is BIGINT UNSIGNED.
                $table->unsignedBigInteger('country_id');

                $table->foreign(
                    'investor_preference_id',
                    'ipc_preference_fk'
                )
                    ->references('id')
                    ->on('investor_preferences')
                    ->cascadeOnDelete();

                $table->foreign(
                    'country_id',
                    'ipc_country_fk'
                )
                    ->references('id')
                    ->on('countries_all')
                    ->cascadeOnDelete();

                // Prevent duplicate country selections.
                $table->primary(
                    [
                        'investor_preference_id',
                        'country_id',
                    ],
                    'ipc_primary'
                );

                $table->index(
                    'country_id',
                    'ipc_country_idx'
                );
            }
        );
    }

    public function down(): void
    {
        Schema::dropIfExists('investor_preference_country');
    }
};
