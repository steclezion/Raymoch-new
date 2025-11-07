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
        Schema::create('email_verifications', function (Blueprint $t) {
            $t->id();
            $t->string('email', 191);
            $t->string('purpose', 191); // 'premium_signup'
            $t->string('code', 6);
            $t->timestamp('expires_at');
            $t->timestamps();
            //  $t->index(['email', 'purpose']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('email_verifications');
    }
};
