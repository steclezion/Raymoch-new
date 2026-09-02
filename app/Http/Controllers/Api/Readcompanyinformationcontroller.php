<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
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

            $companies = DB::table('companies')
                ->join('users', 'companies.who', '=', 'users.id')
                ->where('users.id', $user->getAuthIdentifier())
                ->orderByDesc('companies.created_at')
                ->get([
                    'companies.id',
                    'companies.CompanyName',
                    'companies.created_at',
                ])
                ->map(static fn(object $company): array => [
                    'id' => $company->id,
                    'company_name' => $company->CompanyName,
                    'created_at' => $company->created_at,
                ])
                ->values();

            return response()->json([
                'message' => $companies->isEmpty()
                    ? 'No submitted companies are available yet.'
                    : 'Submitted companies retrieved successfully.',
                'companies' => $companies,
            ]);
        } catch (QueryException $exception) {
            Log::error('Database error while reading the company list.', [
                'user_id' => $request->user()?->getAuthIdentifier(),
                'sql_state' => $exception->errorInfo[0] ?? null,
                'database_error_code' => $exception->errorInfo[1] ?? null,
                'exception' => $exception::class,
                'message' => $exception->getMessage(),
            ]);

            return $this->serviceUnavailableResponse();
        } catch (Throwable $exception) {
            Log::error('Unexpected error while reading the company list.', [
                'user_id' => $request->user()?->getAuthIdentifier(),
                'exception' => $exception::class,
                'message' => $exception->getMessage(),
            ]);

            return $this->unexpectedErrorResponse();
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
                ->join('users', 'companies.who', '=', 'users.id')
                ->where('companies.id', $id)
                ->where('users.id', $user->getAuthIdentifier())
                ->select([
                    'companies.*',
                    'users.name as user_name',
                    'users.display_name as user_display_name',
                ])
                ->first();

            if (! $company) {
                return response()->json([
                    'message' => 'We could not find that company in your account. It may have been removed or you may no longer have access to it.',
                ], 404);
            }

            $isCti = (bool) ($company->standard_verification_cit ?? false);
            $isAts = (bool) ($company->auxiliary_verification_ats ?? false);

            return response()->json([
                'message' => 'Company information retrieved successfully.',
                'company' => [
                    // Step 1: verification overview
                    'id' => $company->id,
                    'company_name' => $company->CompanyName,
                    'verification_type' => $isCti ? 'CTI' : ($isAts ? 'ATS' : 'Not selected'),
                    'created_at' => $company->created_at,
                    'updated_at' => $company->updated_at,

                    // Step 2: account and legal identity
                    'account_type_id' => $company->account_type_id,
                    'trading_name' => $company->trading_name,
                    'legal_structure_id' => $company->legal_structure_id,
                    'sector_id' => $company->Sector,
                    'industry_id' => $company->industry_id,
                    'country_id' => $company->Country,
                    'state_id' => $company->state_id,
                    'city_id' => $company->City,
                    'registration_number' => $company->licence_number,
                    'tax_id' => $company->tax_id,
                    'established_date' => $company->date_established,
                    'external_identifier' => $company->lei_number,
                    'registered_address' => $company->address,
                    'postal_code' => $company->postal_code,
                    'website' => $company->website,

                    // Step 3: business and operating profile
                    'business_model' => $company->business_model,
                    'products_services' => $company->products_or_services,
                    'operating_countries' => $company->countries_of_operation,
                    'employee_count' => $company->number_of_employees,
                    'company_stage' => $company->Stage,
                    'annual_revenue' => $company->AnnualRevenueUSD,
                    'revenue_currency' => $company->revenue_currency,
                    'fiscal_year_end' => $company->fiscal_year_end,
                    'listing_ticker' => $company->public_listing_ticker,
                    'business_description' => $company->business_description,

                    // Step 4: ownership, leadership and control
                    'parent_company' => $company->ultimate_parent_company,
                    'has_parent_company' => (bool) $company->is_ultimate_parent_company,
                    'ownership_type' => $company->ownership_type,
                    'beneficial_owners' => $company->beneficial_owners,
                    'authorized_signatory' => $company->authorized_signatory,
                    'singatory_image_holder' => $company->singatory_image_holder,
                    'signatory_title' => $company->signatory_title,
                    'signatory_id_number' => $company->national_id_or_passport_number,
                    'signatory_id_expiry' => $company->id_expiry_date,

                    // Step 5: selected verification path
                    'standard_verification_cti' => $isCti,
                    'auxiliary_verification_ats' => $isAts,
                    'document_status' => 'Submission recorded; supporting files are stored separately.',

                    // Step 6: applicant contact
                    'contact_name' => $company->user_name,
                    'contact_role' => $company->job_title_relationship,
                    'contact_email' => $company->applicant_work_email,
                    'contact_phone' => $company->applicant_phone_number,
                    'preferred_contact' => $company->user_display_name,
                    'referral_source' => $company->referral_source,
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

            return $this->serviceUnavailableResponse();
        } catch (Throwable $exception) {
            Log::error('Unexpected error while reading company information.', [
                'user_id' => $request->user()?->getAuthIdentifier(),
                'company_id' => $id,
                'exception' => $exception::class,
                'message' => $exception->getMessage(),
            ]);

            return $this->unexpectedErrorResponse();
        }
    }

    private function sessionRequiredResponse(): JsonResponse
    {
        return response()->json([
            'message' => 'Your secure session could not be confirmed. Please sign in again to continue.',
        ], 401);
    }

    private function serviceUnavailableResponse(): JsonResponse
    {
        return response()->json([
            'message' => 'Company information is temporarily unavailable. Please try again shortly.',
        ], 503);
    }

    private function unexpectedErrorResponse(): JsonResponse
    {
        return response()->json([
            'message' => 'We could not complete your request at this time. Please try again. If the issue continues, contact support.',
        ], 500);
    }
}
