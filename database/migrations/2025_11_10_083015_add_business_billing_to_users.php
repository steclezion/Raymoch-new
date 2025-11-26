<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'type_account')) $table->string('type_account')->nullable()->index();
            if (!Schema::hasColumn('users', 'company_name')) $table->string('company_name')->nullable();
            if (!Schema::hasColumn('users', 'display_name')) $table->string('display_name')->nullable();

            if (!Schema::hasColumn('users', 'stripe_customer_id')) $table->string('stripe_customer_id')->nullable()->index();
            if (!Schema::hasColumn('users', 'stripe_subscription_id')) $table->string('stripe_subscription_id')->nullable()->index();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // keep columns; or drop if you want
        });
    }
};
