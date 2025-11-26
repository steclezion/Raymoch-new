<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('company_search_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('session_id', 100)->nullable();

            $table->string('event', 100); // "search_change", "sector_change", "country_change", "verified_toggle", "page_change"

            $table->string('q', 255)->nullable();
            $table->string('sector', 100)->index();
            $table->string('country', 100)->index();
            $table->boolean('verified')->default(false);
            $table->unsignedInteger('page')->default(1);

            $table->string('ip', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->string('referer')->nullable();

            $table->timestamps();

            $table->index(['event', 'created_at']);
            // $table->index(['sector', 'country']);


        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company_search_logs');
    }
};
