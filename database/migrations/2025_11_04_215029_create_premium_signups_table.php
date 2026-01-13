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
        Schema::create('premium_signups', function (Blueprint $t) {
            $t->id();
            $t->string('email')->unique();
            $t->string('name');
            $t->string('display_name');
            $t->string('company_name')->nullable();
            $t->boolean('consent')->default(false);
            $t->string('plan')->default('premium');
            $t->boolean('is_verified')->default(false);
            $t->boolean('completed')->default(false);
            $t->string('stripe_customer_id')->nullable();
            $t->string('password_plain')->nullable(); // optional temp; or use encrypt()
            $t->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('premium_signups');
    }
};
