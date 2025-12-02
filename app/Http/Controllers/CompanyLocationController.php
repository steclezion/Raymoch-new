<?php

// app/Http/Controllers/CompanyLocationController.php
namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\CompanyLocation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CompanyLocationController extends Controller
{
    public function show($companyId)
    {
        $company = Company::with('location')->findOrFail($companyId);

        if (! $company->location) {
            return response()->json([
                'data' => [
                    'company_id' => $company->id,
                    'location'   => null,
                    'nearby'     => [],
                ],
            ]);
        }

        $loc = $company->location;

        // Haversine formula in SQL (distance in miles)
        $lat = (float) $loc->latitude;
        $lng = (float) $loc->longitude;

        $nearby = CompanyLocation::query()
            ->where('company_id', '!=', $company->id)
            ->select([
                'company_locations.*',
                DB::raw("
                    (3959 * acos(
                        cos(radians($lat)) * cos(radians(latitude)) *
                        cos(radians(longitude) - radians($lng)) +
                        sin(radians($lat)) * sin(radians(latitude))
                    )) as distance_miles
                "),
            ])
            ->with([
                'company:id,CompanyName,Country,City',
            ])
            ->orderBy('distance_miles')
            ->limit(15)
            ->get()
            ->map(function (CompanyLocation $loc) {
                return [
                    'company_id'      => $loc->company_id,
                    'company_name'    => $loc->company?->CompanyName ?? $loc->company?->company_name ?? 'Unknown',
                    'city'            => $loc->company?->City ?? $loc->company?->city,
                    'country'         => $loc->company?->Country ?? $loc->company?->country,
                    'latitude'        => $loc->latitude,
                    'longitude'       => $loc->longitude,
                    'distance_miles'  => round((float) $loc->distance_miles, 1),
                ];
            })
            ->values();

        return response()->json([
            'data' => [
                'company_id' => $company->id,
                'location'   => [
                    'latitude' => $loc->latitude,
                    'longitude' => $loc->longitude,
                    'address'  => trim(implode(', ', array_filter([
                        $loc->address_line1,
                        $loc->city,
                        $loc->state,
                        $loc->postal_code,
                        $loc->country,
                    ]))),
                ],
                'nearby' => $nearby,
            ],
        ]);
    }
}
