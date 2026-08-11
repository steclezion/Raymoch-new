<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * All pivot tables that require created_at
     * and updated_at columns.
     *
     * @var array<int, string>
     */
    private array $pivotTables = [
        'investor_preference_business_sector',
        'investor_preference_funding_instrument',
        'investor_preference_country',
        'investment_opportunity_funding_instrument',
        'investment_opportunity_country',
        'investment_opportunity_business_sector',
    ];

    /**
     * Add timestamp columns to every pivot table.
     */
    public function up(): void
    {
        foreach ($this->pivotTables as $tableName) {
            /*
             * Skip a table that does not exist.
             *
             * This prevents the entire migration from failing
             * because of a misspelled or missing pivot table.
             */
            if (!Schema::hasTable($tableName)) {
                continue;
            }

            $hasCreatedAt = Schema::hasColumn(
                $tableName,
                'created_at'
            );

            $hasUpdatedAt = Schema::hasColumn(
                $tableName,
                'updated_at'
            );

            /*
             * Do not alter the table when both columns
             * already exist.
             */
            if ($hasCreatedAt && $hasUpdatedAt) {
                continue;
            }

            Schema::table(
                $tableName,
                function (Blueprint $table) use (
                    $hasCreatedAt,
                    $hasUpdatedAt
                ): void {
                    /*
                     * Add created_at only when it is missing.
                     */
                    if (!$hasCreatedAt) {
                        $table
                            ->timestamp('created_at')
                            ->nullable();
                    }

                    /*
                     * Add updated_at only when it is missing.
                     */
                    if (!$hasUpdatedAt) {
                        $table
                            ->timestamp('updated_at')
                            ->nullable();
                    }
                }
            );
        }
    }

    /**
     * Remove timestamp columns during rollback.
     */
    public function down(): void
    {
        foreach ($this->pivotTables as $tableName) {
            if (!Schema::hasTable($tableName)) {
                continue;
            }

            $columnsToDrop = [];

            if (
                Schema::hasColumn(
                    $tableName,
                    'created_at'
                )
            ) {
                $columnsToDrop[] = 'created_at';
            }

            if (
                Schema::hasColumn(
                    $tableName,
                    'updated_at'
                )
            ) {
                $columnsToDrop[] = 'updated_at';
            }

            if ($columnsToDrop === []) {
                continue;
            }

            Schema::table(
                $tableName,
                function (Blueprint $table) use (
                    $columnsToDrop
                ): void {
                    $table->dropColumn(
                        $columnsToDrop
                    );
                }
            );
        }
    }
};
