<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Throwable;

class Readcompanyinformationcontroller extends Controller
{
    /**
     * Return the authenticated user's submitted companies for the buttons
     * displayed at the top of CompanyDetailsModal.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $user = $request->user();

            if (! $user) {
                return $this->sessionRequiredResponse();
            }

            $companyColumns = [
                'companies.id',
                'companies.CompanyName',
                'companies.trading_name',
                'companies.ultimate_parent_company',
                'companies.is_parent_company',
                'companies.created_at',
                'account_type.name as account_type_name',
                'sectors.title as sector_title',
                'legal_structure.name as legal_structure_name',
                'industries.name as industry_name',
                'countries_africans.country_name as country_name',
                'states_all.name as state_name',
                'cities_all.name as city_name',
                'ticket_currency.code as currency_code',
                'ticket_currency.country_name as currency_country_name',
            ];
            if (Schema::hasColumn('companies', 'verification_score')) {
                $companyColumns[] = 'companies.verification_score';
            }

            $companies = DB::table('companies')
                ->leftjoin('users', 'companies.who', '=', 'users.id')
                ->leftjoin('account_type', 'companies.account_type_id', '=', 'account_type.id')
                ->leftjoin('sectors', 'companies.Sector', '=', 'sectors.id')
                ->leftjoin('legal_structure', 'companies.legal_structure_id', '=', 'legal_structure.id')
                ->leftjoin('industries', 'companies.industry_id', '=', 'industries.id')
                ->leftjoin('countries_africans', 'companies.Country', '=', 'countries_africans.countries_all_id')
                ->leftjoin('states_all', 'companies.state_id', '=', 'states_all.id')
                ->leftjoin('cities_all', 'companies.City', '=', 'cities_all.id')
                ->leftjoin('ticket_currency', 'companies.revenue_currency', '=', 'ticket_currency.id')
                ->where('users.id', $user->getAuthIdentifier())
                ->orderByDesc('companies.created_at')
                ->orderByDesc('companies.id')
                ->get($companyColumns)
                ->map(static fn(object $company): array => [
                    'id' => $company->id,
                    'company_name' => $company->CompanyName,
                    'trading_name' => $company->trading_name,
                    'parent_company' => $company->ultimate_parent_company,
                    'is_parent_company' => (bool) $company->is_parent_company,
                    'verification_score' => $company->verification_score ?? null,
                    'created_at' => $company->created_at,
                    'account_type_name' => $company->account_type_name,
                    'sector_title' => $company->sector_title,
                    'legal_structure_name' => $company->legal_structure_name,
                    'industry_name' => $company->industry_name,
                    'country_name' => $company->country_name,
                    'state_name' => $company->state_name,
                    'city_name' => $company->city_name,
                    'currency_code' => $company->currency_code,
                    'currency_country_name' => $company->currency_country_name,
                    'currency_display' => trim(
                        $company->currency_code . ' — ' . $company->currency_country_name,
                        ' —'
                    ),
                ])
                ->values();

            // dd($companies->toArray());
            $parents = $companies
                ->filter(static fn(array $company): bool => $company['is_parent_company'])
                ->values();

            // Never choose an arbitrary parent when multiple records are marked.
            $parent = $parents->count() === 1 ? $parents->first() : null;

            return response()->json([
                'message' => $companies->isEmpty()
                    ? 'No submitted companies are available yet.'
                    : 'Submitted companies retrieved successfully.',
                'companies' => $companies,
                'who_is_parent_company' => $parent['company_name'] ?? null,
                'parent_company_id' => $parent['id'] ?? null,
                'parent_company_count' => $parents->count(),
            ])->header('Cache-Control', 'private, no-store');
        } catch (QueryException $exception) {
            Log::error('Database error while reading the company list.', [
                'user_id' => $request->user()?->getAuthIdentifier(),
                'sql_state' => $exception->errorInfo[0] ?? null,
                'database_error_code' => $exception->errorInfo[1] ?? null,
                'exception' => $exception::class,
                'message' => $exception->getMessage(),
            ]);

            return $this->serviceUnavailableResponse($exception);
        } catch (Throwable $exception) {
            Log::error('Unexpected error while reading the company list.', [
                'user_id' => $request->user()?->getAuthIdentifier(),
                'exception' => $exception::class,
                'message' => $exception->getMessage(),
            ]);

            return $this->unexpectedErrorResponse($exception);
        }
    }

    /**
     * Find the parent company among companies owned by the authenticated user.
     */
    public function is_parent_company(Request $request): JsonResponse
    {
        try {
            $user = $request->user();

            if (! $user) {
                return $this->sessionRequiredResponse();
            }

            $companies = DB::table('companies')
                ->where('who', $user->getAuthIdentifier())
                ->orderByDesc('created_at')
                ->orderByDesc('id')
                ->get([
                    'id',
                    'CompanyName',
                    'is_parent_company',
                    'created_at',
                ])
                ->map(static fn(object $company): array => [
                    'id' => $company->id,
                    'company_name' => $company->CompanyName,
                    'is_parent_company' => (bool) $company->is_parent_company,
                    'created_at' => $company->created_at,
                ])
                ->values();

            $parents = $companies
                ->filter(static fn(array $company): bool => $company['is_parent_company'])
                ->values();

            if ($parents->count() > 1) {
                return response()->json([
                    'message' => 'Multiple parent companies are marked on this account. Contact support before adding another company.',
                    'companies' => $companies,
                    'who_is_parent_company' => null,
                    'parent_company_id' => null,
                    'parent_company_count' => $parents->count(),
                ], 409)->header('Cache-Control', 'private, no-store');
            }

            $parent = $parents->first();

            return response()->json([
                'message' => $parent
                    ? 'Parent company retrieved successfully.'
                    : ($companies->isEmpty()
                        ? 'No company is currently registered.'
                        : 'No parent company is marked on this account.'),
                'companies' => $companies,
                'who_is_parent_company' => $parent['company_name'] ?? null,
                'parent_company_id' => $parent['id'] ?? null,
                'parent_company_count' => $parents->count(),
            ])->header('Cache-Control', 'private, no-store');
        } catch (QueryException $exception) {
            Log::error('Database error while identifying the parent company.', [
                'user_id' => $request->user()?->getAuthIdentifier(),
                'sql_state' => $exception->errorInfo[0] ?? null,
                'database_error_code' => $exception->errorInfo[1] ?? null,
                'exception' => $exception::class,
                'message' => $exception->getMessage(),
            ]);

            return $this->serviceUnavailableResponse($exception);
        } catch (Throwable $exception) {
            Log::error('Unexpected error while identifying the parent company.', [
                'user_id' => $request->user()?->getAuthIdentifier(),
                'exception' => $exception::class,
                'message' => $exception->getMessage(),
            ]);

            return $this->unexpectedErrorResponse($exception);
        }
    }

    /**
     * Return one company only when it belongs to the authenticated user.
     */
    public function show(Request $request, int $id): JsonResponse
    {
        try {
            $user = $request->user();

            if (! $user) {
                return $this->sessionRequiredResponse();
            }

            if ($id < 1) {
                return response()->json([
                    'message' => 'Please select a valid company and try again.',
                ], 422);
            }

            $company = DB::table('companies')
                ->leftjoin('users', 'companies.who', '=', 'users.id')
                ->leftjoin('account_type', 'companies.account_type_id', '=', 'account_type.id')
                ->leftjoin('sectors', 'companies.Sector', '=', 'sectors.id')
                ->leftjoin('legal_structure', 'companies.legal_structure_id', '=', 'legal_structure.id')
                ->leftjoin('industries', 'companies.industry_id', '=', 'industries.id')
                ->leftjoin('countries_africans', 'companies.Country', '=', 'countries_africans.countries_all_id')
                ->leftjoin('states_all', 'companies.state_id', '=', 'states_all.id')
                ->leftjoin('cities_all', 'companies.City', '=', 'cities_all.id')
                ->leftjoin('ticket_currency', 'companies.revenue_currency', '=', 'ticket_currency.id')
                ->where('companies.id', $id)
                ->where('users.id', $user->getAuthIdentifier())
                ->select([
                    'companies.*',
                    'users.name as user_name',
                    'users.display_name as user_display_name',
                    'account_type.name as account_type_name',
                    'sectors.title as sector_title',
                    'legal_structure.name as legal_structure_name',
                    'industries.name as industry_name',
                    'countries_africans.country_name as country_name',
                    'states_all.name as state_name',
                    'cities_all.name as city_name',
                    'ticket_currency.code as currency_code',
                    'ticket_currency.country_name as currency_country_name',
                ])
                ->first();

            if (! $company) {
                return response()->json([
                    'message' => 'We could not find that company in your account. It may have been removed or you may no longer have access to it.',
                ], 404);
            }

            $isCti = (bool) ($company->standard_verification_cit ?? false);
            $isAts = (bool) ($company->auxiliary_verification_ats ?? false);
            $userId = $user->getAuthIdentifier();
            $contacts = $this->relatedRows('company_contacts', $company->id, $userId);
            $financials = $this->relatedRows('company_financials', $company->id, $userId);
            $locations = $this->relatedRows('company_locations', $company->id, $userId);
            $teamMembers = $this->relatedRows('company_team_members', $company->id, $userId);
            $documents = $this->relatedRows('company_documents', $company->id, $userId);
            $galleries = $this->relatedRows('company_galleries', $company->id, $userId);
            $companyLogs = $this->relatedRows('company_logs', $company->id, $userId);
            $companyReactions = $this->relatedRows('company_reactions', $company->id, $userId);
            $companySearchLogs = $this->relatedRows('company_search_logs', $company->id, $userId);
            $primaryContact = $contacts->first();

            $verificationProcess = collect([
                [
                    'step' => 2,
                    'title' => 'Account and Legal Identity',
                    'status' => $locations->isNotEmpty() ? 'completed' : 'attention',
                    'tasks' => ['Company identity saved', 'Registered location recorded'],
                ],
                [
                    'step' => 3,
                    'title' => 'Business and Operating Profile',
                    'status' => $financials->isNotEmpty() ? 'completed' : 'attention',
                    'tasks' => ['Operating profile saved', 'Financial record linked'],
                ],
                [
                    'step' => 4,
                    'title' => 'Ownership, Leadership and Control',
                    'status' => $teamMembers->isNotEmpty() ? 'completed' : 'attention',
                    'tasks' => ['Ownership recorded', 'Leadership board linked'],
                ],
                [
                    'step' => 5,
                    'title' => 'Supporting Documents',
                    'status' => $documents->isNotEmpty() ? 'completed' : 'attention',
                    'tasks' => ['Verification path recorded', count($documents) . ' document(s) available'],
                ],
                [
                    'step' => 6,
                    'title' => 'Company Contact and Confirmation',
                    'status' => $contacts->isNotEmpty() ? 'completed' : 'attention',
                    'tasks' => ['Company contact linked', count($galleries) . ' profile material(s) available'],
                ],
            ])->values();

            return response()->json([
                'message' => 'Company information retrieved successfully.',
                'company' => [
                    // Step 1: verification overview
                    'id' => $company->id,
                    'company_name' => $company->CompanyName,
                    'verification_type' => $isCti ? 'CTI' : ($isAts ? 'ATS' : 'Not selected'),
                    'created_at' => $company->created_at,
                    'updated_at' => $company->updated_at,
                    'verification_score' => $company->verification_score ?? null,

                    // Step 2: account and legal identity
                    'account_type_id' => $company->account_type_id,
                    'account_type_name' => $company->account_type_name,
                    'trading_name' => $company->trading_name,
                    'legal_structure_id' => $company->legal_structure_id,
                    'legal_structure_name' => $company->legal_structure_name,
                    'sector_id' => $company->Sector,
                    'sector_title' => $company->sector_title,
                    'industry_id' => $company->industry_id,
                    'industry_name' => $company->industry_name,
                    'country_id' => $company->Country,
                    'country_name' => $company->country_name,
                    'state_id' => $company->state_id,
                    'state_name' => $company->state_name,
                    'city_id' => $company->City,
                    'city_name' => $company->city_name,
                    'registration_number' => $company->licence_number,
                    'tax_id' => $company->tax_id,
                    'established_date' => $company->date_established,
                    'external_identifier' => $company->lei_number,
                    'registered_address' => $company->address,
                    'postal_code' => $company->postal_code,
                    'website' => $company->website,
                    'locations' => $locations,

                    // Step 3: business and operating profile
                    'business_model' => $company->business_model,
                    'products_services' => $company->products_or_services,
                    'operating_countries' => $company->countries_of_operation,
                    'employee_count' => $company->number_of_employees,
                    'company_stage' => $company->Stage,
                    'annual_revenue' => $company->AnnualRevenueUSD,
                    'revenue_currency' => $company->revenue_currency,
                    'currency_code' => $company->currency_code,
                    'currency_country_name' => $company->currency_country_name,
                    'currency_display' => trim(
                        $company->currency_code . ' — ' . $company->currency_country_name,
                        ' —'
                    ),
                    'fiscal_year_end' => $company->fiscal_year_end,
                    'listing_ticker' => $company->public_listing_ticker,
                    'business_description' => $company->business_description,
                    'financial_records' => $financials,

                    // Step 4: ownership, leadership and control
                    'is_parent_company' => (bool) $company->is_parent_company,
                    'parent_company' => $company->ultimate_parent_company,
                    'has_parent_company' => (bool) $company->is_ultimate_parent_company,
                    'ownership_type' => $company->ownership_type,
                    'beneficial_owners' => $company->beneficial_owners,
                    'authorized_signatory' => $company->authorized_signatory,
                    'singatory_image_holder' => $company->singatory_image_holder,
                    'signatory_title' => $company->signatory_title,
                    'signatory_id_number' => $company->national_id_or_passport_number,
                    'signatory_id_expiry' => $company->id_expiry_date,
                    'leadership_board' => $teamMembers,

                    // Step 5: selected verification path
                    'standard_verification_cti' => $isCti,
                    'auxiliary_verification_ats' => $isAts,
                    'document_status' => 'Submission recorded; supporting files are stored separately.',
                    'documents' => $documents,

                    // Step 6: applicant contact
                    'contact_name' => $primaryContact->contact_name ?? $company->user_name,
                    'contact_role' => $primaryContact->role ?? $company->job_title_relationship,
                    'contact_email' => $primaryContact->email ?? $company->applicant_work_email,
                    'contact_phone' => $primaryContact->phone ?? $company->applicant_phone_number,
                    'preferred_contact' => $company->Preferred_contact_method ?? $company->user_display_name,
                    'referral_source' => $primaryContact->linkedin_url ?? $company->referral_source,
                    'contacts' => $contacts,
                    'company_profiles' => $galleries,

                    // Verification score workspace
                    'verification_process' => $verificationProcess,
                    'communication_timeline' => $companyLogs,
                    'reactions' => $companyReactions,
                    'search_activity' => $companySearchLogs,
                ],
            ]);
        } catch (QueryException $exception) {
            Log::error('Database error while reading company information.', [
                'user_id' => $request->user()?->getAuthIdentifier(),
                'company_id' => $id,
                'sql_state' => $exception->errorInfo[0] ?? null,
                'database_error_code' => $exception->errorInfo[1] ?? null,
                'exception' => $exception::class,
                'message' => $exception->getMessage(),
            ]);

            return $this->serviceUnavailableResponse($exception);
        } catch (Throwable $exception) {
            Log::error('Unexpected error while reading company information.', [
                'user_id' => $request->user()?->getAuthIdentifier(),
                'company_id' => $id,
                'exception' => $exception::class,
                'message' => $exception->getMessage(),
            ]);

            return $this->unexpectedErrorResponse($exception);
        }
    }

    private function sessionRequiredResponse(): JsonResponse
    {
        return response()->json([
            'message' => 'Your secure session could not be confirmed. Please sign in again to continue.',
        ], 401);
    }

    /**
     * Read related company records defensively. The authenticated company
     * ownership check occurs before this method is called.
     */
    private function relatedRows(string $table, int $companyId, int|string $userId)
    {
        if (! Schema::hasTable($table) || ! Schema::hasColumn($table, 'company_id')) {
            return collect();
        }

        $query = DB::table($table)->where('company_id', $companyId);
        if (Schema::hasColumn($table, 'who')) {
            $query->where('who', $userId);
        }
        if (Schema::hasColumn($table, 'created_at')) {
            $query->orderBy('created_at');
        } elseif (Schema::hasColumn($table, 'id')) {
            $query->orderBy('id');
        }

        return $query->get();
    }

    private function serviceUnavailableResponse(QueryException $exception): JsonResponse
    {
        $databaseReason = $exception->errorInfo[2] ?? $exception->getMessage();

        return response()->json([
            'message' => sprintf(
                'Company information query failed. Reason: %s',
                $databaseReason
            ),
            'error_type' => 'database',
            'details' => [
                'sql_state' => $exception->errorInfo[0] ?? null,
                'database_error_code' => $exception->errorInfo[1] ?? null,
                'database_error' => $databaseReason,
            ],
        ], 503);
    }

    private function unexpectedErrorResponse(Throwable $exception): JsonResponse
    {
        return response()->json([
            'message' => sprintf(
                'Company information execution failed. Reason: %s',
                $exception->getMessage()
            ),
            'error_type' => 'unexpected',
            'details' => [
                'exception' => $exception::class,
                'file' => $exception->getFile(),
                'line' => $exception->getLine(),
            ],
        ], 500);
    }
}
