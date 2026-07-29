<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Create the master list of available financing instruments.
     *
     * Examples:
     * - Equity
     * - Revenue Share
     * - Purchase Order Finance
     * - Debt
     */
    public function up(): void
    {
        Schema::create('funding_instruments', function (Blueprint $table) {
            // Numeric primary key because this is a small lookup table.
            $table->id();

            // Stable code used internally by Laravel and React.
            // This should normally not change after insertion.
            $table->string('code', 50)->unique();

            // Human-readable name displayed to investors.
            $table->string('name', 100);

            // Optional explanation of how the instrument works.
            $table->text('description')->nullable();

            // Allows administrators to disable an instrument
            // without deleting historical relationships.
            $table->boolean('is_active')->default(true);

            $table->timestamps();

            // Helps retrieve active funding instruments quickly.
            $table->index(
                ['is_active', 'name'],
                'funding_instruments_active_name_idx'
            );
        });
    }

    /**
     * Remove the funding instruments table.
     */
    public function down(): void
    {
        Schema::dropIfExists('funding_instruments');
    }
};
