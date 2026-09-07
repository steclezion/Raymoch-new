<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('companies', function (Blueprint $table): void {
            $table->string('ownership_percentage', 256)
                ->nullable()
                ->after('who_is_parent_company');

            $table->string('relationship_type', 256)
                ->nullable()
                ->after('ownership_percentage');
        });
    }

    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table): void {
            $table->dropColumn([
                'ownership_percentage',
                'relationship_type',
            ]);
        });
    }
};
