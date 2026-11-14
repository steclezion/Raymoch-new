<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('trial_requests', function (Blueprint $table): void {
            $table->foreignId('users_trail_request_id')->nullable()->after('id')->constrained('users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('trial_requests', function (Blueprint $table): void {
            $table->dropConstrainedForeignId('users_trail_request_id');
        });
    }
};
