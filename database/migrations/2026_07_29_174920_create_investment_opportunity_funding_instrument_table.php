<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Connect an opportunity to accepted funding instruments.
     */
    public function up(): void
    {
        Schema::create(
            'investment_opportunity_funding_instrument',
            function (Blueprint $table) {
                $table->uuid('investment_opportunity_id');
                $table->unsignedBigInteger('funding_instrument_id');

                $table->foreign(
                    'investment_opportunity_id',
                    'iofi_opportunity_fk'
                )
                    ->references('id')
                    ->on('investment_opportunities')
                    ->cascadeOnDelete();

                $table->foreign(
                    'funding_instrument_id',
                    'iofi_instrument_fk'
                )
                    ->references('id')
                    ->on('funding_instruments')
                    ->cascadeOnDelete();

                $table->primary(
                    [
                        'investment_opportunity_id',
                        'funding_instrument_id',
                    ],
                    'iofi_primary'
                );

                $table->index(
                    'funding_instrument_id',
                    'iofi_instrument_idx'
                );
            }
        );
    }

    public function down(): void
    {
        Schema::dropIfExists(
            'investment_opportunity_funding_instrument'
        );
    }
};
