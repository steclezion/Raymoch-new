<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cookie_consents', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->uuid('anonymous_id')->index();
            $table->string('consent_version', 20);
            $table->string('ip_address_hash', 64)->nullable();
            $table->string('user_agent', 500)->nullable();
            $table->timestamp('accepted_at');
            $table->timestamps();

            $table->unique(['anonymous_id', 'consent_version']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cookie_consents');
    }
};
