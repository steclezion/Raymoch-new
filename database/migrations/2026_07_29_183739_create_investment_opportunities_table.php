<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Store investment requirements published by companies.
     */
    public function up(): void
    {
        Schema::create('investment_opportunities', function (Blueprint $table) {
            // UUID exposed safely through the API.
            $table->uuid('id')->primary();

            // Company publishing the investment request.
            // Assumes companies.id is BIGINT UNSIGNED.
            $table->foreignId('company_id')
                ->constrained('companies')
                ->cascadeOnDelete();

            // Opportunity title shown to investors.
            $table->string('title', 200);

            // Detailed explanation of the investment request.
            $table->text('description')->nullable();

            // Minimum funding amount the company can accept.
            $table->decimal('amount_min', 15, 2);

            // Maximum funding amount the company is seeking.
            $table->decimal('amount_max', 15, 2);

            // Currency used for the investment amount.
            $table->char('currency_code', 3)->default('USD');

            // Earliest month in which the project can begin.
            $table->unsignedSmallInteger('start_from_month')
                ->default(0);

            // Latest month in which the project can begin.
            $table->unsignedSmallInteger('start_to_month')
                ->default(6);

            // Recommended values:
            // draft, open, paused, closed, funded, cancelled.
            $table->string('status', 30)->default('draft');

            // Date when the opportunity became publicly available.
            $table->timestamp('published_at')->nullable();

            // Optional application or investment closing date.
            $table->timestamp('closes_at')->nullable();

            $table->timestamps();

            // Used when retrieving a company's opportunities.
            $table->index(
                ['company_id', 'status'],
                'investment_opportunities_company_status_idx'
            );

            // Used by the eligibility query.
            $table->index(
                ['status', 'currency_code'],
                'investment_opportunities_status_currency_idx'
            );

            // Helps the investment-range query.
            $table->index(
                ['amount_min', 'amount_max'],
                'investment_opportunities_amount_idx'
            );

            // Helps the timing-window query.
            $table->index(
                ['start_from_month', 'start_to_month'],
                'investment_opportunities_timing_idx'
            );
        });
    }

    /**
     * Remove investment opportunities.
     */
    public function down(): void
    {
        Schema::dropIfExists('investment_opportunities');
    }
};
