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
        Schema::table('companies', function (Blueprint $table) {

            $table->dateTime('date_established')->nullable();

            $table->integer('number_of_employees')->nullable();

            $table->string('revenue_currency', 50)->nullable();



            $table->boolean('is_ultimate_parent_company')
                ->default(false);

            $table->boolean('standard_verification_cit')
                ->default(false);

            $table->boolean('auxiliary_verification_ats')
                ->default(false);

            $table->string('company_full_directory_path', 256)
                ->nullable();

            $table->string('applicant_full_name', 256)
                ->nullable();

            /*
             * Foreign key to users.id
             */
            $table->unsignedBigInteger('who')->nullable();

            $table->foreign('who')
                ->references('id')
                ->on('users')
                ->nullOnDelete();

            $table->string('job_title_relationship', 256)
                ->nullable();

            $table->string('applicant_work_email', 256)
                ->nullable();

            $table->string('preferred_contact_method', 256)
                ->nullable();

            $table->string('applicant_phone_number', 256)
                ->nullable();

            $table->string('referral_source', 256)
                ->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {

            /*
             * Drop the foreign key first.
             */
            $table->dropForeign(['who']);

            $table->dropColumn([
                'date_established',
                'number_of_employees',
                'revenue_currency',
                'fiscal_year_end',
                'is_ultimate_parent_company',
                'standard_verification_cit',
                'auxiliary_verification_ats',
                'company_full_directory_path',
                'applicant_full_name',
                'who',
                'job_title_relationship',
                'applicant_work_email',
                'preferred_contact_method',
                'applicant_phone_number',
                'refferal_source',
            ]);
        });
    }
};
