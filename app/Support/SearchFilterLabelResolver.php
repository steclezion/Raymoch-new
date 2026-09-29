<?php

namespace App\Support;

use Illuminate\Support\Facades\DB;

final class SearchFilterLabelResolver
{
    /**
     * The dimension definition must come from SearchDimensions, never from
     * request data, because it contains SQL identifiers.
     */
    public function resolveOne(array $dimension, mixed $selectedValue): ?string
    {
        if (
            $selectedValue === null ||
            $selectedValue === '' ||
            strtolower((string) $selectedValue) === 'all'
        ) {
            return 'all';
        }

        $table = $dimension['lookup_table'] ?? config('search.source_view');
        $idColumn = $dimension['lookup_id'] ?? $dimension['filter_id'];
        $nameColumn = $dimension['lookup_name'] ?? $dimension['result_name'];

        $name = DB::table($table)
            ->where($idColumn, $selectedValue)
            ->whereNotNull($nameColumn)
            ->where($nameColumn, '<>', '')
            ->value($nameColumn);

        return $name === null ? null : (string) $name;
    }
}
