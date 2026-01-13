<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('company_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();

            $table->string('title');
            $table->string('document_type', 80)->nullable(); // pitch deck, fin. statement, etc.
            $table->string('file_path'); // storage path or URL
            $table->string('mime_type', 120)->nullable();
            $table->boolean('is_public')->default(true);

            $table->string('source', 255)->nullable();
            $table->date('as_of_date')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company_documents');
    }
};
