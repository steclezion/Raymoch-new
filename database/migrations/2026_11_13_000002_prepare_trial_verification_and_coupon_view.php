<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('trial_requests', function (Blueprint $table): void {
            $table->string('verification_code', 255)->nullable()->change();
        });

        DB::statement('DROP VIEW IF EXISTS trial_user_coupon_view');
        DB::statement('CREATE VIEW trial_user_coupon_view AS SELECT u.id AS user_id, u.email, u.is_active, u.trial_ends_at, tr.id AS trial_request_id, tr.coupon AS coupon_hash, tr.status FROM users u INNER JOIN trial_requests tr ON tr.users_trail_request_id = u.id');
    }

    public function down(): void
    {
        DB::statement('DROP VIEW IF EXISTS trial_user_coupon_view');
        Schema::table('trial_requests', function (Blueprint $table): void {
            $table->string('verification_code', 20)->nullable()->change();
        });
    }
};
