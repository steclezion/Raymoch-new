<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VerificationOptionsController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'account_types' => $this->options('account_type'),
            'applicant_profiles' => $this->options('applicant_profile'),
            'sectors' => $this->options('sectors'),
            'legal_structures' => $this->options('legal_structure'),
            'regions' => $this->options('regions'),
            'ticket_currency' => $this->options('ticket_currency'),
            'countries_all' => $this->options('countries_all'),
        ]);
    }

    public function industries(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'sector_id' => ['required', 'integer', 'exists:sectors,id'],
        ]);

        return response()->json(
            $this->options('industries', 'sector_id', $validated['sector_id'])
        );
    }

    public function countries(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'region_id' => ['required', 'integer', 'exists:regions,id'],
        ]);

        return response()->json(
            $this->options(
                'countries_africans',
                'region_id',
                $validated['region_id']
            )
        );
    }

    public function states(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'country_id' => [
                'required',
                'integer',
                'exists:countries_africans,countries_all_id',
            ],
        ]);

        return response()->json(
            $this->options('states_all', 'country_id', $validated['country_id'])
        );
    }

    public function cities(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'state_id' => ['required', 'integer', 'exists:states_all,id'],
        ]);

        return response()->json(
            $this->options('cities_all', 'state_id', $validated['state_id'])
        );
    }

    private function options(
        string $table,
        ?string $foreignKey = null,
        int|string|null $foreignValue = null
    ): array {
        if ($table === 'ticket_currency') {
            return DB::table('ticket_currency')
                ->selectRaw('MIN(id) as id')
                ->selectRaw('UPPER(TRIM(code)) as code')
                ->selectRaw(
                    "GROUP_CONCAT(DISTINCT TRIM(name) "
                        . "ORDER BY name SEPARATOR ', ') as country_names"
                )
                ->whereNotNull('code')
                ->whereRaw("TRIM(code) <> ''")
                ->whereNotNull('country_name')
                ->whereRaw("TRIM(country_name) <> ''")
                ->when(
                    $foreignKey !== null,
                    fn($query) => $query->where($foreignKey, $foreignValue)
                )
                ->groupByRaw('UPPER(TRIM(code))')
                ->orderBy('code')
                ->get()
                ->map(static function ($row): array {
                    $code = trim((string) $row->code);
                    $countryNames = trim((string) $row->country_names);
                    $displayName = "{$code} — {$countryNames}";

                    return [
                        'id' => $row->id,
                        'code' => $code,
                        'country_names' => $countryNames,
                        'name' => $displayName,
                        'display_name' => $displayName,
                    ];
                })
                ->all();
        }

        $nameColumn = match ($table) {
            'sectors' => 'title',
            'countries_africans' => 'country_name',
            default => 'name',
        };

        $idColumn = match ($table) {
            'countries_africans' => 'countries_all_id',
            default => 'id',
        };

        return DB::table($table)
            ->selectRaw("{$idColumn} as id, {$nameColumn} as name")
            ->when(
                $foreignKey !== null,
                fn($query) => $query->where($foreignKey, $foreignValue)
            )
            ->orderBy($nameColumn)
            ->get()
            ->map(static fn($row): array => [
                'id' => $row->id,
                'name' => $row->name,
                'display_name' => $row->name,
            ])
            ->all();
    }
}
