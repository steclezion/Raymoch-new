<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Region;
use App\Models\CountryAfrican as Country;
use App\Models\State as State;
use App\Models\CitiesAll as City;
use App\Models\Sector;
use App\Models\Industry;
use Illuminate\Support\Facades\DB;

class SearchFilterController extends Controller
{
    // 1. Regions
    public function regions()
    {
        return response()->json([
            'data' => Region::select('id', 'name')->orderBy('name')->get()
        ]);
    }

    // 2. Countries (filter by region)
    public function countries(Request $request)
    {
        $query = Country::query();

        $regionIds = $this->csvIds($request->query('region_ids'));

        if ($regionIds !== []) {
            $query->whereIn('region_id', $regionIds);
        } elseif ($request->region_id) {
            $query->where('region_id', $request->region_id);
        }

        return response()->json([
            'data' => $query->select('id', 'country_name', 'region_id', 'countries_all_id')->orderBy('country_name')->get()
        ]);
    }

    // 3. States (dependent on country)
    public function states(Request $request)
    {
        $countryIds = $this->csvIds($request->query('country_ids'));
        $query = State::query();

        if ($countryIds !== []) {
            $query->whereIn('country_id', $countryIds);
        } elseif ($request->countries_all_id) {
            $query->where('country_id', $request->countries_all_id);
        } else {
            return response()->json(['data' => []]);
        }

        $states = $query
            ->select('id', 'name', 'country_id')
            ->orderBy('name')
            ->get();

        return response()->json(['data' => $states]);
    }

    // 4. Cities (dependent on state)
    public function cities(Request $request)
    {
        $stateIds = $this->csvIds($request->query('state_ids'));
        $query = City::query();

        if ($stateIds !== []) {
            $query->whereIn('state_id', $stateIds);
        } elseif ($request->state_id) {
            $query->where('state_id', $request->state_id);
        } else {
            return response()->json(['data' => []]);
        }

        $cities = $query
            ->select('id', 'name', 'state_id')
            ->orderBy('name')
            ->get();

        return response()->json(['data' => $cities]);
    }

    // 5. Sectors
    public function sectors()
    {
        return response()->json([
            'data' => Sector::select('id', 'title', 'icon', 'description')->orderBy('title')->get()
        ]);
    }

    // 6. Industries (filter by sector)
    public function industries(Request $request)
    {
        $query = Industry::query();

        $sectorIds = collect(explode(',', (string) $request->query('sector_ids', '')))
            ->filter(fn ($id) => ctype_digit($id) && (int) $id > 0)
            ->map(fn ($id) => (int) $id)
            ->unique()
            ->values();

        if ($sectorIds->isNotEmpty()) {
            $query->whereIn('sector_id', $sectorIds);
        } elseif ($request->sector_id) {
            $query->where('sector_id', $request->sector_id);
        }

        return response()->json([
            'data' => $query->select('id', 'name', 'sector_id')->orderBy('name')->get()
        ]);
    }

    public function countryRegion(Request $request)
    {
        $countryId = $request->query('country_id'); //  gets the value of country_id from the URL query string Example: /api/companies?country_id=5

        if (!$countryId) {
            return response()->json([
                'ok' => false,
                'message' => 'Country is required.',
                'data' => null,
            ], 422);
        }

        $region_id = Country::where('countries_all_id', $countryId)->value('region_id');

        $region = Region::where('id', $region_id)->first();

        if (!$region) {
            return response()->json([
                'ok' => false,
                'message' => 'Region not found.',
                'data' => null,
            ], 404);
        }

        return response()->json([
            'ok' => true,
            'data' => [
                'region_id' => $region->id,
                'region_name' => $region,
            ],
        ]);
    }

    private function csvIds(mixed $value): array
    {
        return collect(explode(',', (string) $value))
            ->filter(fn ($id) => ctype_digit($id) && (int) $id > 0)
            ->map(fn ($id) => (int) $id)
            ->unique()
            ->values()
            ->all();
    }
}
