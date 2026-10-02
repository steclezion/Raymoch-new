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

    private const FILTER_COLUMNS = [
        'sector_id' => 'sector_id',
        'region_id' => 'region_id',
        'country_id' => 'country_id',
        'state_id' => 'state_id',
        'city_id' => 'city_id',
        'industry_id' => 'industry_id',
    ];

    private const SEARCH_COLUMNS = [
        'CompanyName',
        'trading_name',
        'sector_title',
        'sector_description',
        'industry_name',
        'state_name',
        'country_name',
        'region_name',
        'city_name',
        'account_type_name',
        'legal_structure_name',
        'business_model',
        'products_or_services',
        'business_description',
        'location_name',
    ];

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
            ->get(['id', 'country_code', 'country_name', 'flag_icon', 'countries_all_id']);

        return response()->json(['data' => $items]);
    }

    public function companies(Request $request): JsonResponse
    {
        $filters = $request->validate([
            'page' => ['sometimes', 'integer', 'min:1'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:100'],
            'q' => ['nullable', 'string', 'max:200'],
            'sector_id' => ['nullable', 'integer', 'min:1'],
            'region_id' => ['nullable', 'integer', 'min:1'],
            'country_id' => ['nullable', 'integer', 'min:1'],
            'state_id' => ['nullable', 'integer', 'min:1'],
            'city_id' => ['nullable', 'integer', 'min:1'],
            'industry_id' => ['nullable', 'integer', 'min:1'],
            'verification_status' => ['nullable', 'string', 'max:100'],
        ]);

        $query = DB::table(self::BUSINESS_SEARCH_VIEW);

        foreach (self::FILTER_COLUMNS as $parameter => $column) {
            if ($request->filled($parameter)) {
                $query->where($column, $filters[$parameter]);
            }
        }

        if ($request->filled('verification_status')) {
            $status = strtolower(trim($filters['verification_status']));
            $status = in_array($status, ['1', 'true', 'on'], true)
                ? 'verified'
                : $status;

            $query->whereRaw('LOWER(VerificationStatus) = ?', [$status]);
        }

        if ($request->filled('q')) {
            $term = '%' . str_replace(['%', '_'], ['\\%', '\\_'], trim($filters['q'])) . '%';

            $query->where(function ($nested) use ($term) {
                foreach (self::SEARCH_COLUMNS as $index => $column) {
                    $index === 0
                        ? $nested->where($column, 'like', $term)
                        : $nested->orWhere($column, 'like', $term);
                }
            });
        }

        $companies = $query
            ->orderBy('CompanyName')
            ->paginate($filters['per_page'] ?? 20)
            ->withQueryString();

        return response()->json(['data' => $companies]);
    }
}
