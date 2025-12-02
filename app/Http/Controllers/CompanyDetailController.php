<?php


namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\CompanyFinancial;
use App\Models\CompanyTeamMember;
use App\Models\CompanyDocument;
use App\Models\CompanyGallery;
use App\Models\CompanyContact;
use App\Models\CompanyLog;
use App\Models\CompanyLocation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;   // <-- add this

class CompanyDetailController extends Controller
{
    protected function log(Request $request, $companyId, string $event, ?string $tab = null, array $meta = []): void
    {
        try {
            CompanyLog::create([
                'company_id' => $companyId,
                'event_type' => $event,
                'tab'        => $tab,
                'session_id' => $request->input('session_id'),
                'ip_address' => $request->ip(),
                'user_agent' => substr((string) $request->userAgent(), 0, 500),
                'meta'       => $meta,
            ]);
        } catch (\Throwable $e) {
            // do not break the API if logging fails
        }
    }

    public function overview(Request $request, Company $company)
    {
        $this->log($request, $company->id, 'company_view', 'overview', [
            'source' => $request->input('source', 'grid'),
        ]);

        return response()->json([
            'data' => [
                'id'                 => $company->id,
                'CompanyName'        => $company->CompanyName ?? $company->company_name,
                'Sector'             => $company->Sector ?? $company->sector,
                'Country'            => $company->Country ?? $company->country,
                'City'               => $company->City ?? $company->city,
                'Stage'              => $company->Stage ?? $company->stage,
                'VerificationStatus' => $company->VerificationStatus ?? $company->verification_status,
                'CTI_Tier'           => $company->CTI_Tier ?? $company->cti_tier,
                'CTI_Score'          => $company->CTI_Score ?? $company->cti_score,
                'Summary'            => $company->Summary ?? $company->summary ?? null,
                'Snapshot'           => $company->Snapshot ?? $company->snapshot ?? null,
                'LastUpdated'        => optional($company->updated_at)->toDateString(),
                'SourcesCount'       => method_exists($company, 'documents') ? $company->documents()->count() : null,
            ],
        ]);
    }

    public function financials(Request $request, Company $company)
    {
        $this->log($request, $company->id, 'tab_click', 'financials');

        $rows = CompanyFinancial::where('company_id', $company->id)
            ->orderByDesc('fiscal_year')
            ->get();

        return response()->json(['data' => $rows]);
    }

    public function team(Request $request, Company $company)
    {
        $this->log($request, $company->id, 'tab_click', 'team');

        $rows = CompanyTeamMember::where('company_id', $company->id)
            ->orderBy('role_type')
            ->orderBy('full_name')
            ->get();

        return response()->json(['data' => $rows]);
    }

    public function gallery(Request $request, Company $company)
    {
        $this->log($request, $company->id, 'tab_click', 'gallery');

        $rows = CompanyGallery::where('company_id', $company->id)
            ->orderByDesc('is_primary')
            ->orderBy('sort_order')
            ->get();

        return response()->json(['data' => $rows]);
    }

    public function documents(Request $request, Company $company)
    {
        $this->log($request, $company->id, 'tab_click', 'documents');

        $rows = CompanyDocument::where('company_id', $company->id)
            ->orderBy('document_type')
            ->orderBy('title')
            ->get();

        return response()->json(['data' => $rows]);
    }

    public function contact(Request $request, Company $company)
    {
        $this->log($request, $company->id, 'tab_click', 'contact');

        $rows = CompanyContact::where('company_id', $company->id)->get();

        return response()->json(['data' => $rows]);
    }

    /**
     * NEW: Location / Map tab
     * Uses latitude/longitude stored directly on companies table.
     */


    public function location(Request $request, Company $company)
    {
        $this->log($request, $company->id, 'tab_click', 'location');

        // 1) Get this company's location from company_locations table
        $loc = CompanyLocation::where('company_id', $company->id)->first();

        if (!$loc || !$loc->latitude || !$loc->longitude) {
            // If this company has no stored location, return empty nearby list
            return response()->json([
                'data' => [
                    'company_id' => $company->id,
                    'location'   => null,
                    'nearby'     => [],
                ],
            ]);
        }

        $lat = (float) $loc->latitude;
        $lng = (float) $loc->longitude;
        $earthRadius = 3959; // miles

        // 2) Build label & address (from location row, with company fallback)
        $label = $loc->location_name
            ?? $loc->address_line1
            ?? $company->CompanyName;
        // ?? $company->company_name;

        $address = trim(implode(', ', array_filter([
            $loc->address_line1 ?? null,
            $loc->city ?? null,
            $loc->state ?? null,
            $loc->postal_code ?? null,
            $loc->country ?? null,
        ])));

        // 3) Nearby companies using company_locations table
        $nearby = CompanyLocation::query()
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->where('company_id', '!=', $company->id)
            ->select([
                'company_locations.*',
                DB::raw("(
                {$earthRadius} * acos(
                    cos(radians(?)) *
                    cos(radians(latitude)) *
                    cos(radians(longitude) - radians(?)) +
                    sin(radians(?)) *
                    sin(radians(latitude))
                )
            ) as distance_miles"),
            ])
            ->setBindings([$lat, $lng, $lat], 'select')
            ->with([
                'company:id,CompanyName,city,country',
            ])
            ->orderBy('distance_miles')
            ->limit(15)
            ->get()
            ->map(function (CompanyLocation $row) {
                $co = $row->company;

                $name    = $co->CompanyName ?? $co->company_name ?? 'Unknown';
                $city    = $co->City ?? $co->city;
                $country = $co->Country ?? $co->country;

                return [
                    'company_id'     => $co->id,
                    'company_name'   => $name,
                    'city'           => $city,
                    'country'        => $country,
                    'latitude'       => (float) $row->latitude,
                    'longitude'      => (float) $row->longitude,
                    'distance_miles' => round((float) $row->distance_miles, 1),
                ];
            })
            ->values();

        return response()->json([
            'data' => [
                'company_id' => $company->id,
                'location'   => [
                    'latitude'  => $lat,
                    'longitude' => $lng,
                    'label'     => $label,
                    'address'   => $address,
                ],
                'nearby'     => $nearby,
            ],
        ]);
    }
}
