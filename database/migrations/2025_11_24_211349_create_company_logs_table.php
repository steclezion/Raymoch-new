<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('company_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->nullable()->constrained('companies')->nullOnDelete();

            $table->string('event_type', 80); // company_view, tab_click, dialog_open, etc.
            $table->string('tab', 40)->nullable(); // overview, financials, team, gallery, documents, contact
            $table->string('session_id', 120)->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->json('meta')->nullable(); // anything extra: {from:"grid", page:2}

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('company_logs');
    }
};
