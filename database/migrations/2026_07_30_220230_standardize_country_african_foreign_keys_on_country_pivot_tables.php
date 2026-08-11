<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Standard foreign-key name used by all country pivots.
     */
    private string $newColumn = 'country_african_id';

    /**
     * Possible old foreign-key names found in the project.
     *
     * @var array<int, string>
     */
    private array $oldColumns = [
        'country_id',
        'countries_id',
        'countries_africans_id',
    ];

    /**
     * Rename the country foreign keys to country_african_id.
     */
    public function up(): void
    {
        $this->renameCountryColumn(
            'investor_preference_country'
        );

        $this->renameCountryColumn(
            'investment_opportunity_country'
        );

        $this->renameCountryColumn(
            'investment_opportunity_country'
        );
        $this->renameCountryColumn(
            'investment_opportunity_country'
        );
    }

    /**
     * Roll back to country_id.
     */
    public function down(): void
    {
        $tables = [
            'investor_preference_country',
            'investment_opportunity_country',
        ];

        foreach ($tables as $tableName) {
            if (
                Schema::hasTable($tableName) &&
                Schema::hasColumn(
                    $tableName,
                    $this->newColumn
                )
            ) {
                Schema::table(
                    $tableName,
                    function (Blueprint $table): void {
                        $table->renameColumn(
                            'country_african_id',
                            'country_id'
                        );
                    }
                );
            }
        }
    }

    /**
     * Find an existing old country column and rename it.
     */
    private function renameCountryColumn(
        string $tableName
    ): void {
        if (!Schema::hasTable($tableName)) {
            return;
        }

        /*
         * No change is required when the standardized
         * column already exists.
         */
        if (
            Schema::hasColumn(
                $tableName,
                $this->newColumn
            )
        ) {
            return;
        }

        foreach ($this->oldColumns as $oldColumn) {
            if (
                Schema::hasColumn(
                    $tableName,
                    $oldColumn
                )
            ) {
                Schema::table(
                    $tableName,
                    function (
                        Blueprint $table
                    ) use (
                        $oldColumn
                    ): void {
                        $table->renameColumn(
                            $oldColumn,
                            'country_african_id'
                        );
                    }
                );

                return;
            }
        }
    }
};
