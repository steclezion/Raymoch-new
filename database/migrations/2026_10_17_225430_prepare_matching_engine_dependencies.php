<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Prepare legacy lookup tables for the InnoDB foreign keys used by the
     * matching-engine schema.
     */
    public function up(): void
    {
        $referencedTables = [
            'account_type',
            'ticket_currency',
            'prefered_investment_stages',
            'funding_instruments',
            'countries_all',
            'industries',
            'sectors',
            'stages',
        ];

        foreach ($referencedTables as $table) {
            if (Schema::hasTable($table)) {
                DB::statement("ALTER TABLE `{$table}` ENGINE=InnoDB");
            }
        }

        if (! Schema::hasTable('funding_objectives')) {
            Schema::create('funding_objectives', function (Blueprint $table) {
                $table->engine = 'InnoDB';
                $table->id();
                $table->string('code', 64)->unique();
                $table->string('name');
                $table->text('description')->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('funding_objectives');

        // Engine conversions are intentionally not reversed: changing these
        // tables back to MyISAM would discard foreign-key support.
    }
};
