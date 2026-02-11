<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {

    public function up(): void
    {
        Schema::create('countries_all', function (Blueprint $table) {

            $table->id();

            $table->string('name');
            $table->string('tele_code', 10);
            $table->string('country_code', 5);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('countries_all');
    }
};
