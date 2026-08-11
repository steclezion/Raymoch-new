<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Connect an investment opportunity to its sectors.
     */
    public function up(): void
    {
        Schema::create(
            'investment_opportunity_business_sector',
            function (Blueprint $table) {
                $table->uuid('investment_opportunity_id');
                $table->unsignedBigInteger('business_sector_id');

                $table->foreign(
                    'investment_opportunity_id',
                    'iobs_opportunity_fk'
                )
                    ->references('id')
                    ->on('investment_opportunities')
                    ->cascadeOnDelete();

                $table->foreign(
                    'business_sector_id',
                    'iobs_sector_fk'
                )
                    ->references('id')
                    ->on('sectors')
                    ->cascadeOnDelete();

                $table->primary(
                    [
                        'investment_opportunity_id',
                        'business_sector_id',
                    ],
                    'iobs_primary'
                );

                $table->index(
                    'business_sector_id',
                    'iobs_sector_idx'
                );
            }
        );
    }

    public function down(): void
    {
        Schema::dropIfExists(
            'investment_opportunity_business_sector'
        );
    }
};
