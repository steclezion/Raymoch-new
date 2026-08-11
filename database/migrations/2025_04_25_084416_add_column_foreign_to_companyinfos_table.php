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
            $table->foreignId('country_id')->nullable()->constrained('countries_all')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('companyinfos', function (Blueprint $table) {
            //
            $table->dropForeign('companyinfos_country_id_foreign');
            $table->dropColumn('country_id');
        });
    }
};
