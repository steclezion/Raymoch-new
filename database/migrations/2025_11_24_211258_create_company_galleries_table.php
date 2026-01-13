<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('company_galleries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();

            $table->string('image_url')->nullable();          // CDN / storage URL
            $table->string('caption')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_primary')->default(false);
            $table->string('alt_text')->nullable(); // Alternative text for the image
            $table->text('image_base64')->nullable(); // Base64-encoded image data  
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company_galleries');
    }
};
