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
        Schema::table('company_contacts', function (Blueprint $table) {
            //

            $tables = [

                'company_contacts'
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
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $tables = [

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
