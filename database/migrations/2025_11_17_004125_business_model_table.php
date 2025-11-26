<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('businesses_model', function (Blueprint $table) {
            $table->id();
            $table->string('icon', 16)->nullable();          // emoji or short icon code
            $table->string('title');                          // e.g., "Agriculture"
            $table->string('description')->nullable();        // short subtitle
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('businesses_model');
    }
};
