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
            $table->string('website')->nullable(); // <www class="samino com"></www>
            $table->string('founder_name')->nullable(); // example
            $table->string('description')->nullable(); // example
            $table->string('location')->nullable(); // example
            $table->string('email')->nullable(); // example
          
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('companyinfos', function (Blueprint $table) {
            $table->dropColumn('website'); // must match column name above
            $table->dropColumn('founder_name')->nullable(); // example
            $table->dropColumn('description')->nullable(); // example
            $table->dropColumn('location')->nullable(); // example
        });;
    }
};
