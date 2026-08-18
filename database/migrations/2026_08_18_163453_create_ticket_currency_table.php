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
        Schema::create('ticket_currency', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('country_name');
            $table->string('code', 3)->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
            $table->string('who')->nullable();

            $table->unique(['country_name', 'code']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ticket_currency');
    }
};
