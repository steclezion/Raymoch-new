<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CountryAfrican as Country;
use App\Models\Sector;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DirectoryController extends Controller
{
    private const BUSINESS_SEARCH_VIEW = 'raymoch_business_search_view';

    public function sectors(Request $request): JsonResponse
    {
        $items = Sector::query()
            ->orderBy('title')
            ->get(['id', 'icon', 'title', 'description']);

        return response()->json(['data' => $items]);
    }

    public function countries(Request $request): JsonResponse
    {
        $items = Country::query()
            ->orderBy('country_name')
            ->get(['id', 'country_code', 'country_name', 'flag_icon']);

        return response()->json(['data' => $items]);
    }

    public function companies(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'page' => ['sometimes', 'integer', 'min:1'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
            'q' => ['nullable', 'string', 'max:200'],
            'region_id' => ['nullable', 'string', 'max:100'],
            'regio_id' => ['nullable', 'string', 'max:100'],
            'country_id' => ['nullable', 'string', 'max:100'],
            'state_id' => ['nullable', 'string', 'max:100'],
            'city_id' => ['nullable', 'string', 'max:100'],
            'sector_id' => ['nullable', 'string', 'max:100'],
            'industry_id' => ['nullable', 'string', 'max:100'],
            'verification_status' => ['nullable', 'string', 'max:100'],
            'country' => ['nullable', 'string', 'max:160'],
            'sector' => ['nullable', 'string', 'max:160'],
            'verified' => ['nullable', 'boolean'],
        ]);

        $schema = DB::connection()->getSchemaBuilder();
        $columns = $schema->getColumnListing(self::BUSINESS_SEARCH_VIEW);
        $columnLookup = collect($columns)->mapWithKeys(
            fn(string $column) => [strtolower($column) => $column]
        );
        $firstColumn = static function (array $candidates) use ($columnLookup): ?string {
            foreach ($candidates as $candidate) {
                $match = $columnLookup->get(strtolower($candidate));
                if ($match) return $match;
            }

            return null;
        };

        $columnMap = [
            'region_id' => $firstColumn(['region_id', 'RegionId', 'RegionID']),
            'country_id' => $firstColumn([
                'country_id',
                'CountryId',
                'CountryID',
                'country_african_id',
                'CountryAfricanId',
                'countries_all_id',
                'CountriesAllId',
            ]),
            'state_id' => $firstColumn(['state_id', 'StateId', 'StateID']),
            'city_id' => $firstColumn(['city_id', 'CityId', 'CityID']),
            'sector_id' => $firstColumn([
                'sector_id',
                'SectorId',
                'SectorID',
                'business_sector_id',
                'BusinessSectorId',
                'sectors_id',
                'SectorsId',
            ]),
            'industry_id' => $firstColumn(['industry_id', 'IndustryId', 'IndustryID']),
            'verification_status' => $firstColumn([
                'verification_status',
                'VerificationStatus',
                'verificationstatus',
                'status',
            ]),
            'country' => $firstColumn(['country', 'Country', 'country_name', 'CountryName']),
            'sector' => $firstColumn(['sector', 'Sector', 'sector_name', 'SectorName']),
        ];

        foreach (['country', 'sector'] as $legacyFilter) {
            $value = trim((string) ($filters[$legacyFilter] ?? ''));

            if (in_array(strtolower($value), ['', 'all', 'any'], true)) {
                unset($filters[$legacyFilter]);
                continue;
            }

            $idFilter = $legacyFilter . '_id';
            if (!isset($filters[$idFilter]) && ctype_digit($value)) {
                $filters[$idFilter] = $value;
                unset($filters[$legacyFilter]);
            }
        }

        if (empty($filters['region_id']) && !empty($filters['regio_id'])) {
            $filters['region_id'] = $filters['regio_id'];
        }

        $query = DB::table(self::BUSINESS_SEARCH_VIEW);

        if (!empty($filters['country_id'])) {
            $countryName = Country::query()
                ->whereKey($filters['country_id'])
                ->value('country_name');

            if ($columnMap['country_id'] || ($countryName && $columnMap['country'])) {
                $query->where(function ($nested) use ($columnMap, $filters, $countryName) {
                    if ($columnMap['country_id']) {
                        $nested->where($columnMap['country_id'], $filters['country_id']);
                    }
                    if ($countryName && $columnMap['country']) {
                        $method = $columnMap['country_id'] ? 'orWhere' : 'where';
                        $nested->{$method}($columnMap['country'], $countryName);
                    }
                });
            }
        }

        if (!empty($filters['sector_id'])) {
            $sectorName = Sector::query()
                ->whereKey($filters['sector_id'])
                ->value('title');

            if ($columnMap['sector_id'] || ($sectorName && $columnMap['sector'])) {
                $query->where(function ($nested) use ($columnMap, $filters, $sectorName) {
                    if ($columnMap['sector_id']) {
                        $nested->where($columnMap['sector_id'], $filters['sector_id']);
                    }
                    if ($sectorName && $columnMap['sector']) {
                        $method = $columnMap['sector_id'] ? 'orWhere' : 'where';
                        $nested->{$method}($columnMap['sector'], $sectorName);
                    }
                });
            }
        }

        foreach (['region_id', 'state_id', 'city_id', 'industry_id', 'country', 'sector'] as $filter) {
            if (!empty($filters[$filter]) && $columnMap[$filter]) {
                $query->where($columnMap[$filter], $filters[$filter]);
            }
        }

        if (!empty($filters['verification_status']) && $columnMap['verification_status']) {
            $status = strtolower(trim($filters['verification_status']));
            $status = in_array($status, ['1', 'true', 'on'], true) ? 'verified' : $status;
            $wrappedStatusColumn = $query->getConnection()
                ->getQueryGrammar()
                ->wrap($columnMap['verification_status']);

            $query->whereRaw("LOWER({$wrappedStatusColumn}) = ?", [$status]);
        }

        if (!empty($filters['q'])) {
            $searchColumns = array_filter([
                $firstColumn(['company_name', 'CompanyName', 'name', 'Name']),
                $firstColumn(['region', 'Region', 'region_name', 'RegionName']),
                $columnMap['country'],
                $firstColumn(['state', 'State', 'state_name', 'StateName']),
                $firstColumn(['city', 'City', 'city_name', 'CityName']),
                $columnMap['sector'],
                $firstColumn(['industry', 'Industry', 'industry_name', 'IndustryName']),
            ]);
            $term = '%' . str_replace(['%', '_'], ['\\%', '\\_'], $filters['q']) . '%';

            if ($searchColumns) {
                $query->where(function ($nested) use ($searchColumns, $term) {
                    foreach ($searchColumns as $index => $column) {
                        $index === 0
                            ? $nested->where($column, 'like', $term)
                            : $nested->orWhere($column, 'like', $term);
                    }
                });
            }
        }

        if (!empty($filters['verified']) && empty($filters['verification_status'])) {
            $verifiedColumn = $firstColumn(['verified', 'Verified', 'is_verified', 'IsVerified']);
            $statusColumn = $firstColumn(['verification_status', 'VerificationStatus']);

            if ($verifiedColumn) {
                $query->where($verifiedColumn, true);
            } elseif ($statusColumn) {
                $query->whereRaw('LOWER(' . DB::getQueryGrammar()->wrap($statusColumn) . ') = ?', ['verified']);
            }
        }

        $nameColumn = $firstColumn(['company_name', 'CompanyName', 'name', 'Name']);
        if ($nameColumn) $query->orderBy($nameColumn);

        return response()->json([
            'data' => $query->paginate($filters['per_page'] ?? 20),
        ]);
    }
}
