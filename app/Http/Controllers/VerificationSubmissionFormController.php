<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Throwable;

class VerificationSubmissionFormController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $user = null;
        $storedPaths = [];
        $baseAbsolutePath = null;
        $baseExistedBefore = false;
        $cleanupFailedSubmission = static function () use (
            &$storedPaths,
            &$baseAbsolutePath,
            &$baseExistedBefore
        ): void {
            try {
                if (DB::transactionLevel() > 0) {
                    DB::rollBack();
                }

                foreach ($storedPaths as $storedPath) {
                    Storage::disk('public')->delete($storedPath);
                }

                if (
                    ! $baseExistedBefore
                    && is_string($baseAbsolutePath)
                    && File::isDirectory($baseAbsolutePath)
                ) {
                    File::deleteDirectory($baseAbsolutePath);
                }
            } catch (Throwable $cleanupException) {
                Log::critical('Verification submission cleanup failed.', [
                    'exception' => $cleanupException::class,
                    'message' => $cleanupException->getMessage(),
                    'stored_paths' => $storedPaths,
                ]);
            }
        };

        try {
            $user = $request->user();

            if (! $user) {
                return response()->json([
                    'message' => 'Your secure session could not be confirmed. Please sign in again before submitting the verification request.',
                ], 401);
            }

            $validated = $request->validate([
                'account_type_id' => ['required', 'integer'],
                'legal_name' => ['required', 'string', 'max:255'],
                'trading_name' => ['nullable', 'string', 'max:255'],
                'legal_structure_id' => ['required', 'integer'],
                'sector_id' => ['required', 'integer'],
                'industry_id' => ['required', 'integer'],
                'country_id' => ['required', 'integer'],
                'region_id' => ['nullable', 'integer'],
                'state_id' => ['nullable', 'integer'],
                'city_id' => ['nullable', 'integer'],
                'registration_number' => ['required', 'string', 'max:255'],
                'tax_id' => ['nullable', 'string', 'max:255'],
                'established_date' => ['required', 'date', 'before_or_equal:today'],
                'external_identifier' => ['nullable', 'string', 'max:255'],
                'registered_address' => ['required', 'string', 'max:1000'],
                'postal_code' => ['required', 'string', 'max:30'],
                'website' => ['nullable', 'url:http,https', 'max:2048'],

                'business_model' => ['required', 'string', 'max:255'],
                'products_services' => ['required', 'string', 'max:2000'],
                'operating_countries' => ['required', 'array', 'min:1'],
                'operating_countries.*' => ['required', 'string', 'max:255'],
                'employee_count' => ['required', 'string', 'max:100'],
                'company_stage' => ['required', 'string', 'max:255'],
                'annual_revenue' => ['required', 'string', 'max:100'],
                'revenue_currency' => ['required', 'string', 'max:100'],
                'fiscal_year_end' => ['required', 'date'],
                'listing_ticker' => ['nullable', 'string', 'max:255'],
                'business_description' => ['required', 'string', 'min:500'],

                'parent_company' => ['nullable', 'required_if:has_parent_company,1,true', 'string', 'max:255'],
                'has_parent_company' => ['required', 'boolean'],
                'ownership_type' => ['required', 'string', 'max:255'],
                'beneficial_owners' => ['required', 'string', 'max:5000'],
                'authorized_signatory' => ['required', 'string', 'max:255'],
                'signatory_title' => ['required', 'string', 'max:255'],
                'signatory_id_number' => ['required', 'string', 'max:255'],
                'signatory_id_expiry' => ['required', 'date', 'after:today'],

                // "cit" is accepted as a compatibility alias for CTI.
                'verification_type' => ['required', 'in:cti,cit,ats'],
                'documents' => ['required', 'array'],
                'documents.*' => ['required', 'array', 'min:1'],
                'documents.*.*' => ['required', 'file', 'mimes:pdf,jpg,jpeg,png,webp', 'max:102400'],
                'singatory_image_holder' => ['required', 'string', 'max:7000000'],

                'contact_name' => ['required', 'string', 'max:255'],
                'contact_role' => ['required', 'string', 'max:255'],
                'contact_email' => ['required', 'email:rfc', 'max:255'],
                'contact_phone' => ['required', 'string', 'max:50'],
                'preferred_contact' => ['required', 'in:Email,Phone,SMS,WhatsApp'],
                'referral_source' => ['nullable', 'string', 'max:255'],
                'accuracy_consent' => ['accepted'],
                'privacy_consent' => ['accepted'],
            ]);

            $signatureDataUrl = $validated['singatory_image_holder'];
            $signatureParts = explode(',', $signatureDataUrl, 2);
            $signatureBinary = count($signatureParts) === 2
                && $signatureParts[0] === 'data:image/png;base64'
                ? base64_decode($signatureParts[1], true)
                : false;
            $signatureImageInfo = $signatureBinary !== false
                ? @getimagesizefromstring($signatureBinary)
                : false;

            if (
                $signatureBinary === false
                || strlen($signatureBinary) > 5 * 1024 * 1024
                || ($signatureImageInfo['mime'] ?? null) !== 'image/png'
            ) {
                throw ValidationException::withMessages([
                    'singatory_image_holder' => [
                        'The authorized signatory signature must be a valid Base64 PNG image no larger than 5 MB.',
                    ],
                ]);
            }

            $verificationType = $validated['verification_type'] === 'cit'
                ? 'cti'
                : $validated['verification_type'];

            if ($verificationType === 'cti') {
                $requiredFolders = [
                    'registration' => 'Registration',
                    'tax' => 'Tax',
                    'bank' => 'Bank',
                    'directors' => 'Directors',
                ];
            } elseif ($verificationType === 'ats') {
                $requiredFolders = [
                    'operational_presence' => 'Operational Presence',
                    'customer_network' => 'Customer or network Proof',
                    'cashflow_trace' => 'Cash Flow trace',
                    'owner_identity' => 'owners Identity',
                ];
            } else {
                throw ValidationException::withMessages([
                    'verification_type' => ['Select CTI or ATS verification.'],
                ]);
            }
            $submittedCategories = array_keys($request->file('documents', []));
            $missingCategories = array_diff(
                array_keys($requiredFolders),
                $submittedCategories
            );
            $unexpectedCategories = array_diff(
                $submittedCategories,
                array_keys($requiredFolders)
            );

            if ($missingCategories !== [] || $unexpectedCategories !== []) {
                throw ValidationException::withMessages([
                    'documents' => [
                        'The uploaded document categories do not match the selected verification type.',
                    ],
                ]);
            }

            $folderName = implode('_', array_filter([
                (string) $user->getAuthIdentifier(),
                Str::slug((string) ($user->name ?? 'user'), '_'),
                Str::slug($validated['legal_name'], '_'),
            ]));
            $baseRelativePath = 'verification-submissions/' . $folderName;
            $baseAbsolutePath = Storage::disk('public')->path($baseRelativePath);
            $baseExistedBefore = File::isDirectory($baseAbsolutePath);
            DB::beginTransaction();
            File::ensureDirectoryExists($baseAbsolutePath, 0770, true);

            foreach ($requiredFolders as $categoryKey => $folderLabel) {
                $relativeFolder = $baseRelativePath . '/' . $folderLabel;
                $absoluteFolder = Storage::disk('public')->path(
                    $relativeFolder
                );
                File::ensureDirectoryExists($absoluteFolder, 0770, true);
                @chmod($absoluteFolder, 0770);

                foreach ($request->file("documents.{$categoryKey}", []) as $index => $uploadedFile) {
                    $safeBaseName = Str::slug(
                        pathinfo(
                            $uploadedFile->getClientOriginalName(),
                            PATHINFO_FILENAME
                        ),
                        '_'
                    ) ?: 'document';
                    $fileName = sprintf(
                        '%s_%s_%d.%s',
                        now()->format('Ymd_His_u'),
                        $safeBaseName,
                        $index + 1,
                        strtolower($uploadedFile->extension())
                    );
                    $storedPath = $uploadedFile->storeAs(
                        $relativeFolder,
                        $fileName,
                        'public'
                    );
                    $storedPaths[] = $storedPath;
                    @chmod(Storage::disk('public')->path($storedPath), 0660);
                }
            }

            $companyId = DB::table('companies')->insertGetId([
                // Step 2: account and legal identity
                'who' => $user->getAuthIdentifier(),
                'account_type_id' => $validated['account_type_id'],
                'CompanyName' => $validated['legal_name'],
                'trading_name' => $validated['trading_name'] ?? null,
                'legal_structure_id' => $validated['legal_structure_id'],
                'Sector' => $validated['sector_id'],
                'industry_id' => $validated['industry_id'],
                'Region' => $validated['region_id'] ?? null,
                'Country' => $validated['country_id'],
                'state_id' => $validated['state_id'] ?? null,
                'City' => $validated['city_id'] ?? null,
                'licence_number' => $validated['registration_number'],
                'tax_id' => $validated['tax_id'] ?? null,
                'date_established' => $validated['established_date'],
                'FoundedYear' => date('Y', strtotime($validated['established_date'])),
                'lei_number' => $validated['external_identifier'] ?? null,
                'address' => $validated['registered_address'],
                'postal_code' => $validated['postal_code'],
                'website' => $validated['website'] ?? null,

                // Step 3: business and operating profile
                'business_model' => $validated['business_model'],
                'products_or_services' => $validated['products_services'],
                'countries_of_operation' => implode(
                    ',',
                    $validated['operating_countries']
                ),
                'number_of_employees' => $validated['employee_count'] ?? null,
                'Stage' => $validated['company_stage'],
                'AnnualRevenueUSD' => preg_replace('/[^0-9.]/', '', $validated['annual_revenue']),
                'revenue_currency' => $validated['revenue_currency'],
                'fiscal_year_end' => $validated['fiscal_year_end'],
                'public_listing_ticker' => $validated['listing_ticker'] ?? null,
                'business_description' => $validated['business_description'],

                // Step 4: ownership, leadership and control
                'ultimate_parent_company' => $validated['parent_company'] ?? null,
                'is_ultimate_parent_company' => $request->boolean('has_parent_company'),
                'ownership_type' => $validated['ownership_type'],
                'beneficial_owners' => $validated['beneficial_owners'],
                'authorized_signatory' => $validated['authorized_signatory'],
                'singatory_image_holder' => $signatureDataUrl,
                'signatory_title' => $validated['signatory_title'],
                'national_id_or_passport_number' => $validated['signatory_id_number'],
                'id_expiry_date' => $validated['signatory_id_expiry'],

                // Step 5: selected verification path and supporting evidence
                'standard_verification_cit' => $verificationType === 'cti',
                'auxiliary_verification_ats' => $verificationType === 'ats',

                // Step 6: primary contact and confirmation
                'Applicant_full_name' => $validated['contact_name'],
                'job_title_relationship' => $validated['contact_role'],
                'applicant_work_email' => $validated['contact_email'],
                'applicant_phone_number' => $validated['contact_phone'],
                'Preferred_contact_method' => $validated['preferred_contact'],
                'referral_source' => $validated['referral_source'] ?? null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Verification submitted successfully.',
                'reference' => 'VSF-' . str_pad(
                    (string) $companyId,
                    8,
                    '0',
                    STR_PAD_LEFT
                ),
                'company_id' => $companyId,
                // These steps are confirmed only after the database transaction commits.
                'saved_steps' => [2, 3, 4, 5, 6],
                'step_results' => [
                    ['step' => 2, 'status' => 'saved'],
                    ['step' => 3, 'status' => 'saved'],
                    ['step' => 4, 'status' => 'saved'],
                    ['step' => 5, 'status' => 'saved'],
                    ['step' => 6, 'status' => 'saved'],
                ],
            ], 201);
        } catch (ValidationException $exception) {
            $cleanupFailedSubmission();

            Log::notice('Verification submission validation failed.', [
                'user_id' => $user?->getAuthIdentifier(),
                'validation_fields' => array_keys($exception->errors()),
            ]);

            return response()->json([
                'message' => 'Some information needs your attention. Please review the highlighted fields and submit again.',
                'errors' => $exception->errors(),
            ], 422);
        } catch (QueryException $exception) {
            $cleanupFailedSubmission();

            Log::error('Database error during verification submission.', [
                'user_id' => $user?->getAuthIdentifier(),
                'sql_state' => $exception->errorInfo[0] ?? null,
                'database_error_code' => $exception->errorInfo[1] ?? null,
                'exception' => $exception::class,
                'message' => $exception->getMessage(),
            ]);

            return response()->json([
                'message' => 'We could not save the verification information at this time. Your submission was not completed; please try again shortly.',
            ], 503);
        } catch (Throwable $exception) {
            $cleanupFailedSubmission();

            Log::error('Unexpected verification submission failure.', [
                'user_id' => $user?->getAuthIdentifier(),
                'exception' => $exception::class,
                'message' => $exception->getMessage(),
            ]);

            return response()->json([
                'message' => 'We could not complete your verification request. No information was committed. Please try again, and contact support if the issue continues.',
            ], 500);
        }
    }
}
