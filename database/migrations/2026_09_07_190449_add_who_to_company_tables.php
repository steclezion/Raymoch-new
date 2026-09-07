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
        $tables = [
            'company_documents',
            'company_financials',
            'company_galleries',
            'company_locations',
            'company_logs',
            'company_reactions',
            'company_search_logs',
            'company_team_members',
            'company_contacts',
        ];

        foreach ($tables as $tableName) {
            Schema::table($tableName, function (Blueprint $table) {
                $table->foreignId('who')
                    ->nullable()
                    ->constrained('users')
                    ->cascadeOnUpdate()
                    ->nullOnDelete();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $tables = [
            'company_documents',
            'company_financials',
            'company_galleries',
            'company_locations',
            'company_logs',
            'company_reactions',
            'company_search_logs',
            'company_team_members',
            'company_contacts',
        ];

        foreach ($tables as $tableName) {
            Schema::table($tableName, function (Blueprint $table) {
                $table->dropForeign(['who']);
                $table->dropColumn('who');
            });
        }
    }
};
