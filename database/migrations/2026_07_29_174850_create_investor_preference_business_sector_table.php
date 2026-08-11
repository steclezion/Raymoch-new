<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Connect an investor preference to selected business sectors.
     */
    public function up(): void
    {
        Schema::create(
            'investor_preference_business_sector',
            function (Blueprint $table) {
                $table->uuid('investor_preference_id');

                // Assumes sectors.id is BIGINT UNSIGNED.
                $table->unsignedBigInteger('business_sector_id');

                $table->foreign(
                    'investor_preference_id',
                    'ipbs_preference_fk'
                )
                    ->references('id')
                    ->on('investor_preferences')
                    ->cascadeOnDelete();

                $table->foreign(
                    'business_sector_id',
                    'ipbs_sector_fk'
                )
                    ->references('id')
                    ->on('sectors')
                    ->cascadeOnDelete();

                // One sector may appear only once per preference.
                $table->primary(
                    [
                        'investor_preference_id',
                        'business_sector_id',
                    ],
                    'ipbs_primary'
                );

                $table->index(
                    'business_sector_id',
                    'ipbs_sector_idx'
                );
            }
        );
    }

    public function down(): void
    {
        Schema::dropIfExists(
            'investor_preference_business_sector'
        );
    }
};
