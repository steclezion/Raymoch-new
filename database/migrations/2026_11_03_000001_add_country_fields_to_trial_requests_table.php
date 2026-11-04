<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('trial_requests', function (Blueprint $table): void {
            $table->string('country', 100)->nullable()->after('business_email');
            $table->string('country_code', 10)->nullable()->after('country');
        });
    }

    public function down(): void
    {
        Schema::table('trial_requests', function (Blueprint $table): void {
            $table->dropColumn(['country', 'country_code']);
        });
    }
};
