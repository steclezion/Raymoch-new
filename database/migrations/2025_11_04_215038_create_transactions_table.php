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
        Schema::create('transactions', function (Blueprint $t) {
            $t->id();
            $t->string('email');
            $t->string('stripe_payment_intent_id')->nullable();
            $t->bigInteger('amount')->nullable(); // in cents
            $t->string('currency', 10)->nullable();
            $t->string('status')->nullable(); // succeeded, failed, requires_action, etc.
            $t->timestamps();
            $t->index('stripe_payment_intent_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
