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
        Schema::create('payment_methods', function (Blueprint $t) {
            $t->engine = 'InnoDB';
            $t->id();
            $t->string('email', '191');
            $t->string('stripe_customer_id');
            $t->string('stripe_payment_method_id', '191');
            $t->string('brand')->nullable();
            $t->string('last4', 4)->nullable();
            $t->timestamps();
            $t->unique(['email', 'stripe_payment_method_id']);
            $t->index('stripe_customer_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_methods');
    }
};
