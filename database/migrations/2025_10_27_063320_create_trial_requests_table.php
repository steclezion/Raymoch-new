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
        Schema::create('trial_requests', function (Blueprint $t) {
            $t->id();
            $t->string('first_name', 80);
            $t->string('last_name', 80);
            $t->string('business_email')->index();
            $t->string('phone', 40)->nullable();
            $t->string('company', 160)->nullable();
            $t->boolean('agree_privacy')->default(false);
            // meta
            $t->string('status', 24)->default('new'); // new|contacted|qualified|rejected
            $t->string('ip', 45)->nullable();
            $t->string('user_agent', 255)->nullable();
            $t->timestamps();
        });
    }


    public function down(): void
    {
        Schema::dropIfExists('trial_requests');
    }
};
