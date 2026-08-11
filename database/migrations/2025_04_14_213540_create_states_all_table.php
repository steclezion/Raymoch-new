<?php


use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('states_all', function (Blueprint $table) {
            $table->unsignedMediumInteger('id')->primary();

            $table->string('name');
            $table->unsignedMediumInteger('country_id');
            $table->char('country_code', 2);

            $table->string('fips_code')->nullable();
            $table->string('iso2')->nullable();

            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();

            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();

            $table->boolean('flag')->default(true);
            $table->string('wikiDataId')->nullable();

            // optional foreign key
            $table->foreign('country_id')
                ->references('id')
                ->on('countries_all')
                ->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('states_all');
    }
};
