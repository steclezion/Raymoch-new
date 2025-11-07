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
        Schema::table('trial_requests', function (Blueprint $table) {
            $table->string('verification_code', 20)->nullable();
            $table->timestamp('code_expires_at')->nullable();
            $table->timestamp('verified_at')->nullable();
        });
    }
    public function down(): void
    {
        Schema::table('trial_requests', function (Blueprint $table) {
            $table->dropColumn(['verification_code', 'code_expires_at', 'verified_at']);
        });
    }
};
