<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->foreignId('account_type_id')
                ->nullable()
                ->constrained('account_type')
                ->nullOnDelete();

            $table->foreignId('applicant_profile_id')
                ->nullable()
                ->constrained('applicant_profile')
                ->nullOnDelete();

            $table->string('trading_name')->nullable();
            $table->string('licence_number')->nullable()->unique();
            $table->string('tax_id')->nullable();

            $table->foreignId('legal_structure_id')
                ->nullable()
                ->constrained('legal_structure')
                ->nullOnDelete();

            $table->string('address')->nullable();
            $table->string('postal_code', 30)->nullable();
            $table->string('lei_number', 20)->nullable()->unique();
            $table->string('business_model')->nullable();
            $table->text('products_or_services')->nullable();
            $table->text('countries_of_operation')->nullable();

            $table->foreignId('ticket_currency_id')
                ->nullable()
                ->constrained('ticket_currency')
                ->nullOnDelete();

            $table->date('fiscal_year_end')->nullable();
            $table->string('public_listing_ticker')->nullable();
            $table->longText('business_description')->nullable();
            $table->string('ultimate_parent_company')->nullable();
            $table->string('ownership_type')->nullable();
            $table->longText('beneficial_owners')->nullable();
            $table->text('directors_trustees_general_partners')->nullable();
            $table->string('authorized_signatory')->nullable();
            $table->string('signatory_title')->nullable();

            // Identification values can contain letters and leading zeros.
            $table->string('national_id_or_passport_number', 100)->nullable();
            $table->date('id_expiry_date')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->dropForeign(['account_type_id']);
            $table->dropForeign(['applicant_profile_id']);
            $table->dropForeign(['legal_structure_id']);
            $table->dropForeign(['ticket_currency_id']);

            $table->dropUnique(['licence_number']);
            $table->dropUnique(['lei_number']);

            $table->dropColumn([
                'account_type_id',
                'applicant_profile_id',
                'trading_name',
                'licence_number',
                'tax_id',
                'legal_structure_id',
                'address',
                'postal_code',
                'lei_number',
                'business_model',
                'products_or_services',
                'countries_of_operation',
                'ticket_currency_id',
                'fiscal_year_end',
                'public_listing_ticker',
                'business_description',
                'ultimate_parent_company',
                'ownership_type',
                'beneficial_owners',
                'directors_trustees_general_partners',
                'authorized_signatory',
                'signatory_title',
                'national_id_or_passport_number',
                'id_expiry_date',
            ]);
        });
    }
};
