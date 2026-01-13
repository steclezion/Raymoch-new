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
use Illuminate\Support\Facades\DB;   // already added

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

        // INNER JOIN companies
        $rows = CompanyFinancial::query()
            ->join('companies', 'company_financials.company_id', '=', 'companies.id')
            ->where('company_financials.company_id', $company->id)
            ->orderByDesc('company_financials.fiscal_year')
            ->select('company_financials.*') // keep only financial columns in payload
            ->get();

        return response()->json(['data' => $rows]);
    }

    public function team(Request $request, Company $company)
    {
        $this->log($request, $company->id, 'tab_click', 'team');

        // INNER JOIN companies
        $rows = CompanyTeamMember::query()
            ->join('companies', 'company_team_members.company_id', '=', 'companies.id')
            ->where('company_team_members.company_id', $company->id)
            ->orderBy('company_team_members.role_type')
            ->orderBy('company_team_members.full_name')
            ->select('company_team_members.*')
            ->get();

        return response()->json(['data' => $rows]);
    }

    public function gallery(Request $request, Company $company)
    {
        $this->log($request, $company->id, 'tab_click', 'gallery');

        // INNER JOIN companies
        $rows = CompanyGallery::query()
            ->join('companies', 'company_galleries.company_id', '=', 'companies.id')
            ->where('company_galleries.company_id', $company->id)
            ->orderByDesc('company_galleries.is_primary')
            ->orderBy('company_galleries.sort_order')
            ->select('company_galleries.*')
            ->get();

        return response()->json(['data' => $rows]);
    }

    public function documents(Request $request, Company $company)
    {
        $this->log($request, $company->id, 'tab_click', 'documents');

        // SINGLE query using INNER JOIN companies
        $rows = CompanyDocument::query()
            ->join('companies', 'company_documents.company_id', '=', 'companies.id')
            ->where('company_documents.company_id', $company->id)
            ->select(
                'company_documents.id',
                'company_documents.title',
                'company_documents.document_type',
                'company_documents.file_path',
                'company_documents.created_at'
            )
            ->orderBy('company_documents.document_type')
            ->orderByDesc('company_documents.created_at')
            ->get();

        return response()->json(['data' => $rows]);
    }

    public function contact(Request $request, Company $company)
    {
        $this->log($request, $company->id, 'tab_click', 'contact');

        // INNER JOIN companies
        $rows = CompanyContact::query()
            ->join('companies', 'company_contacts.company_id', '=', 'companies.id')
            ->where('company_contacts.company_id', $company->id)
            ->select('company_contacts.*')
            ->get();

        return response()->json(['data' => $rows]);
    }

    /**
     * NEW: Location / Map tab
     * Uses latitude/longitude stored on company_locations table,
     * with INNER JOIN to companies for nearby list.
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
