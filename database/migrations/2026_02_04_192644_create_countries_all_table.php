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
            $table->string('iso3', 3)->nullable();
            $table->string('iso2', 2)->nullable();
            $table->string('tele_code')->nullable();
            $table->string('country_code')->nullable();
            $table->string('capital')->nullable();
            $table->string('currency')->nullable();
            $table->string('currency_symbol')->nullable();
            $table->string('tld')->nullable();
            $table->string('native')->nullable();
            $table->string('region')->nullable();
            $table->string('subregion')->nullable();
            $table->text('timezones')->nullable();
            $table->text('translations')->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->string('emoji')->nullable();
            $table->string('emojiU')->nullable();
            $table->boolean('flag')->default(true);
            $table->string('wikiDataId')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('countries_all');
    }
};
