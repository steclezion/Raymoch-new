<?php

// database/migrations/XXXX_XX_XX_XXXXXX_add_profile_and_trial_fields_to_users_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->nullable()->after('email');
            $table->string('company_name')->nullable()->after('phone');

            // account metadata
            $table->string('type_of_account')->default('basic')->after('company_name'); // basic | pro | enterprise etc.
            $table->boolean('is_active')->default(true)->after('type_of_account');
            $table->timestamp('trial_ends_at')->nullable()->after('is_active');
            $table->timestamp('deactivated_at')->nullable()->after('trial_ends_at');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'phone',
                'company_name',
                'type_of_account',
                'is_active',
                'trial_ends_at',
                'deactivated_at'
            ]);
        });
    }
};
