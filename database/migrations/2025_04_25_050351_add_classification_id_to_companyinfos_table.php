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
        Schema::table('companyinfos', function (Blueprint $table) {
            //
            $table->foreignId('classification_id')->nullable()->constrained('company_classifications')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('companyinfos', function (Blueprint $table) {
            //
        });
    }
};
