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
                'gps_location' => ['required', 'string', 'max:100'],
                'country_name' => ['required', 'string', 'max:255'],
                'state_name' => ['nullable', 'string', 'max:255'],
                'city_name' => ['nullable', 'string', 'max:255'],

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

                'is_ultimate_parent' => ['required', 'boolean'],
                'relationship_type' => [
                    'required_if:is_ultimate_parent,0',
                    'nullable',
                    'string',
                    'max:256',
                    'in:parent,subsidiary,associate,affiliate,joint_venture,sister_company,controlled_entity',
                ],
                'ownership_percentage' => [
                    'required_if:is_ultimate_parent,0',
                    'nullable',
                    'numeric',
                    'between:0,100',
                ],
                'ultimate_company_name' => [
                    'required_if:is_ultimate_parent,0',
                    'nullable',
                    'string',
                    'max:255',
                ],
                'is_holding_company' => ['required', 'boolean'],
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
                'company_profiles' => ['nullable', 'array'],
                'company_profiles.*.type' => ['required_with:company_profiles.*.file', 'string', 'max:100'],
                'company_profiles.*.file' => ['required_with:company_profiles.*.type', 'file', 'mimes:pdf,doc,docx,jpg,jpeg,png,webp', 'max:102400'],
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

            $isUltimateParent = $request->boolean('is_ultimate_parent');
            $parentCompanyName = $isUltimateParent
                ? $validated['legal_name']
                : $validated['ultimate_company_name'];

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

            $coordinatePattern = '/^\s*(-?\d+(?:\.\d+)?)\s*(?:,|\s+-\s+)\s*(-?\d+(?:\.\d+)?)\s*$/';
            if (! preg_match($coordinatePattern, $validated['gps_location'], $coordinateMatches)) {
                throw ValidationException::withMessages([
                    'gps_location' => ['Enter GPS coordinates as "latitude, longitude" or "latitude - longitude".'],
                ]);
            }

            $latitude = (float) $coordinateMatches[1];
            $longitude = (float) $coordinateMatches[2];
            if ($latitude < -90 || $latitude > 90 || $longitude < -180 || $longitude > 180) {
                throw ValidationException::withMessages([
                    'gps_location' => ['Latitude must be between -90 and 90 and longitude between -180 and 180.'],
                ]);
            }

            $leadershipBoard = json_decode($validated['beneficial_owners'], true);
            if (! is_array($leadershipBoard) || $leadershipBoard === []) {
                throw ValidationException::withMessages([
                    'beneficial_owners' => ['Add at least one leadership board member.'],
                ]);
            }

            $leadershipOwnershipTotal = 0.0;
            foreach ($leadershipBoard as $index => $member) {
                $validator = validator($member, [
                    'name' => ['required', 'string', 'min:2', 'max:255'],
                    'title' => ['required', 'string', 'min:2', 'max:255'],
                    'email' => ['required', 'email:rfc', 'max:255'],
                    'bio' => ['nullable', 'string', 'min:20', 'max:5000'],
                    'linkedin_url' => ['nullable', 'url:http,https', 'regex:/^https?:\\/\\/(?:[a-z]{2,3}\\.)?(?:www\\.)?linkedin\\.com\\/.+/i', 'max:2048'],
                    'ownership_percentage' => ['nullable', 'numeric', 'between:0,100'],
                ]);

                if ($validator->fails()) {
                    throw ValidationException::withMessages([
                        'beneficial_owners' => [
                            'Leadership board member ' . ($index + 1) . ': '
                                . $validator->errors()->first(),
                        ],
                    ]);
                }

                $leadershipOwnershipTotal += (float) ($member['ownership_percentage'] ?? 0);
            }

            if ($leadershipOwnershipTotal > 100) {
                throw ValidationException::withMessages([
                    'beneficial_owners' => ['Combined leadership ownership cannot exceed 100%.'],
                ]);
            }

            DB::beginTransaction();

            $companyId = DB::table('companies')->insertGetId([
                // Step 2: account and legal identity
                // 'who' => $user->getAuthIdentifier(),
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
                'is_parent_company' => $isUltimateParent ? 1 : 0,
                'who_is_parent_company' => $parentCompanyName,
                'relationship_type' => $isUltimateParent
                    ? null
                    : $validated['relationship_type'],
                'ownership_percentage' => $isUltimateParent
                    ? null
                    : (string) $validated['ownership_percentage'],
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

            $folderName = sprintf(
                '%s_%s',
                $user->getAuthIdentifier(),
                $companyId
            );
            $baseRelativePath = 'verification-submissions/' . $folderName;
            $baseAbsolutePath = Storage::disk('public')->path($baseRelativePath);
            $baseExistedBefore = File::isDirectory($baseAbsolutePath);

            File::ensureDirectoryExists($baseAbsolutePath, 0770, true);
            @chmod($baseAbsolutePath, 0770);

            DB::table('companies')
                ->where('id', $companyId)
                ->update([
                    'company_full_directory_path' => $baseAbsolutePath,
                    'updated_at' => now(),
                ]);

            // Step 2: physical company location.
            DB::table('company_locations')->insert([
                'company_id' => $companyId,
                'latitude' => $latitude,
                'longitude' => $longitude,
                'who' => $user->getAuthIdentifier(),
            ]);

            // Step 3: current financial profile.
            DB::table('company_financials')->insert([
                'company_id' => $companyId,
                'fiscal_year' => date('Y', strtotime($validated['fiscal_year_end'])),
                'currency' => $validated['revenue_currency'],
                'revenue' => preg_replace('/[^0-9.]/', '', $validated['annual_revenue']),
                'ebitda' => null,
                'net_income' => null,
                'total_assets' => null,
                'total_liabilities' => null,
                'valuation' => null,
                'source' => null,
                'who' => $user->getAuthIdentifier(),
            ]);

            // Step 4: one row per leadership board member.
            foreach ($leadershipBoard as $member) {
                DB::table('company_team_members')->insert([
                    'company_id' => $companyId,
                    'full_name' => trim($member['name']),
                    'title' => trim($member['title']),
                    'role_type' => null,
                    'bio' => filled($member['bio'] ?? null) ? trim($member['bio']) : null,
                    'email' => trim($member['email']),
                    'linkedin_url' => filled($member['linkedin_url'] ?? null)
                        ? trim($member['linkedin_url'])
                        : null,
                    'ownership_percent' => filled($member['ownership_percentage'] ?? null)
                        ? (float) $member['ownership_percentage']
                        : null,
                    'who' => $user->getAuthIdentifier(),
                ]);
            }

            $documentCount = 0;
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

                    DB::table('company_documents')->insert([
                        'company_id' => $companyId,
                        'title' => $uploadedFile->getClientOriginalName(),
                        'document_type' => $folderLabel,
                        'file_path' => $storedPath,
                        'mime_type' => $uploadedFile->getMimeType(),
                        'is_public' => 1,
                        'source' => null,
                        'as_of_date' => now(),
                        'who' => $user->getAuthIdentifier(),
                    ]);
                    $documentCount++;
                }
            }

            // Step 6: primary contact plus Step 2 address details.
            DB::table('company_contacts')->insert([
                'company_id' => $companyId,
                'contact_name' => $validated['contact_name'],
                'role' => $validated['contact_role'],
                'email' => $validated['contact_email'],
                'phone' => $validated['contact_phone'],
                'website' => $validated['website'] ?? null,
                'linkedin_url' => $validated['referral_source'] ?? null,
                'address_line1' => $validated['registered_address'],
                'city' => $validated['city_name'] ?? null,
                'state' => $validated['state_name'] ?? null,
                'postal_code' => $validated['postal_code'],
                'country' => $validated['country_name'],
                'who' => $user->getAuthIdentifier(),
            ]);

            $galleryRelativeFolder = $baseRelativePath . '/gallery';
            $galleryAbsoluteFolder = Storage::disk('public')->path($galleryRelativeFolder);
            File::ensureDirectoryExists($galleryAbsoluteFolder, 0770, true);
            @chmod($galleryAbsoluteFolder, 0770);

            $galleryCount = 0;
            foreach ($request->file('company_profiles', []) as $index => $profileUpload) {
                $uploadedFile = $profileUpload['file'] ?? null;
                $materialType = trim((string) ($validated['company_profiles'][$index]['type'] ?? 'Other'));
                if (! $uploadedFile) {
                    continue;
                }

                $safeCompanyName = Str::slug($validated['legal_name'], '_') ?: 'company';
                $safeMaterialType = Str::slug($materialType, '_') ?: 'material';
                $safeOriginalName = Str::slug(
                    pathinfo($uploadedFile->getClientOriginalName(), PATHINFO_FILENAME),
                    '_'
                ) ?: 'file';
                $galleryFileName = sprintf(
                    '%s_%s_%s_%d.%s',
                    $safeCompanyName,
                    $safeMaterialType,
                    $safeOriginalName,
                    $index + 1,
                    strtolower($uploadedFile->extension())
                );
                $storedPath = $uploadedFile->storeAs(
                    $galleryRelativeFolder,
                    $galleryFileName,
                    'public'
                );
                $storedPaths[] = $storedPath;
                @chmod(Storage::disk('public')->path($storedPath), 0660);

                DB::table('company_galleries')->insert([
                    'company_id' => $companyId,
                    'image_url' => $storedPath,
                    'caption' => $materialType,
                    'sort_order' => null,
                    'is_primary' => null,
                    'alt_text' => null,
                    'image_base64' => null,
                    'who' => $user->getAuthIdentifier(),
                ]);
                $galleryCount++;
            }

            if (connection_aborted()) {
                throw new \RuntimeException('The client connection ended before the transaction could be committed.');
            }

            DB::commit();

            return response()->json([
                'message' => 'Verification submitted successfully.',
                'transaction_committed' => true,
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
                    ['step' => 2, 'status' => 'saved', 'operation' => 'Company identity and location saved'],
                    ['step' => 3, 'status' => 'saved', 'operation' => 'Financial profile saved'],
                    ['step' => 4, 'status' => 'saved', 'operation' => count($leadershipBoard) . ' leadership member(s) saved'],
                    ['step' => 5, 'status' => 'saved', 'operation' => $documentCount . ' verification document(s) stored'],
                    ['step' => 6, 'status' => 'saved', 'operation' => 'Primary contact and ' . $galleryCount . ' company profile file(s) saved; transaction committed'],
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

            $databaseReason = $exception->errorInfo[2] ?? $exception->getMessage();
            $sqlState = $exception->errorInfo[0] ?? 'unknown';
            $databaseErrorCode = $exception->errorInfo[1] ?? 'unknown';

            return response()->json([
                'message' => sprintf(
                    'Database operation failed and the transaction was rolled back. Reason: %s',
                    $databaseReason
                ),
                'error_type' => 'database',
                'transaction_rolled_back' => true,
                'details' => [
                    'exception' => $exception::class,
                    'sql_state' => $sqlState,
                    'database_error_code' => $databaseErrorCode,
                    'database_error' => $databaseReason,
                ],
            ], 503);
        } catch (Throwable $exception) {
            $cleanupFailedSubmission();

            Log::error('Unexpected verification submission failure.', [
                'user_id' => $user?->getAuthIdentifier(),
                'exception' => $exception::class,
                'message' => $exception->getMessage(),
            ]);

            return response()->json([
                'message' => sprintf(
                    'Submission execution failed and the transaction was rolled back. Reason: %s',
                    $exception->getMessage()
                ),
                'error_type' => 'unexpected',
                'transaction_rolled_back' => true,
                'details' => [
                    'exception' => $exception::class,
                    'error' => $exception->getMessage(),
                    'file' => $exception->getFile(),
                    'line' => $exception->getLine(),
                ],
            ], 500);
        }
    }
}
