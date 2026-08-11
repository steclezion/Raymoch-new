<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Connect an opportunity to the countries in which
     * the investment project will operate.
     */
    public function up(): void
    {
        Schema::create(
            'investment_opportunity_country',
            function (Blueprint $table) {
                $table->uuid('investment_opportunity_id');
                $table->unsignedBigInteger('country_id');

                $table->foreign(
                    'investment_opportunity_id',
                    'ioc_opportunity_fk'
                )
                    ->references('id')
                    ->on('investment_opportunities')
                    ->cascadeOnDelete();

                $table->foreign(
                    'country_id',
                    'ioc_country_fk'
                )
                    ->references('id')
                    ->on('countries_all')
                    ->cascadeOnDelete();

                $table->primary(
                    [
                        'investment_opportunity_id',
                        'country_id',
                    ],
                    'ioc_primary'
                );

                $table->index(
                    'country_id',
                    'ioc_country_idx'
                );
            }
        );
    }

    public function down(): void
    {
        Schema::dropIfExists(
            'investment_opportunity_country'
        );
    }
};
