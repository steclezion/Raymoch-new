<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('company_reactions', function (Blueprint $table) {
            $table->id();

            // Which company this reaction/comment belongs to
            $table->foreignId('company_id')
                ->constrained()
                ->cascadeOnDelete();

            // Optionally, which user (if you have auth)
            $table->foreignId('user_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            // One of: marked, future, satisfied, unsatisfied
            $table->string('reaction_type', 32);

            // Comment entered in the small box
            $table->text('comment')->nullable();

            // Session + request metadata (to match your existing logging style)
            $table->string('session_id', 100)->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent', 500)->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company_reactions');
    }
};
