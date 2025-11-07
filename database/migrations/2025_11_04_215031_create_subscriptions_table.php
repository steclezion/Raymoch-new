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
        Schema::create('subscriptions', function (Blueprint $t) {
            $t->id();
            $t->string('email');
            $t->string('stripe_customer_id');
            $t->string('stripe_subscription_id')->unique();
            $t->string('plan');
            $t->string('status'); // active, past_due, canceled, incomplete, etc.
            $t->timestamps();
            $t->index('stripe_customer_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
