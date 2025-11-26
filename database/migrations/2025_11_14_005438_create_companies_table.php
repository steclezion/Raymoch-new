<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('CompanyName')->isNotEmpty();
            $table->string('Sector')->nullable();
            $table->string('Country')->nullable();
            $table->string('Region')->nullable();
            $table->string('City')->nullable();
            $table->string('FoundedYear')->nullable();
            $table->string('Stage')->nullable();
            $table->string('VerificationStatus')->default('unverified');
            $table->string('VerificationStep')->nullable();
            $table->integer('CTI_Score')->nullable();
            $table->string('CTI_Tier')->nullable();
            $table->string('ProfileCompletenessPct')->nullable();
            $table->string('Employees')->nullable();
            $table->string('AnnualRevenueUSD')->nullable();
            $table->string('TotalFundingUSD')->nullable();
            $table->string('HasFinancials')->nullable();
            $table->string('DiasporaOwned')->nullable();
            $table->string('WomenLed')->nullable();
            $table->string('YouthLed')->nullable();
            $table->string('ListingBucket')->nullable();
            $table->string('website')->nullable();
            $table->string('Email')->nullable();
            $table->string('Phone')->nullable();
            $table->text('Description')->nullable();
            $table->string('Employees_count')->nullable();
            $table->string('Logo')->nullable();
            $table->string('DataSourcesCount')->nullable();
            $table->string('icon')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
