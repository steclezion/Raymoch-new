<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\CompanyFinancial;
use App\Models\CompanyTeamMember;
use App\Models\CompanyDocument;
use App\Models\CompanyGallery;
use App\Models\CompanyContact;
use App\Models\CompanyLog;
use Illuminate\Http\Request;

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
}
