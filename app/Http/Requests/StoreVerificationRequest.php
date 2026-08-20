<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreVerificationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Replace with a policy when verification requires login.
    }

    public function rules(): array
    {
        return [
            'account_type_id' => ['required', 'integer', 'min:1'],
            'applicant_profile_id' => ['required', 'integer', 'min:1'],
            'sector_id' => ['required', 'integer', 'min:1'],
            'industry_id' => ['required', 'integer', 'min:1'],
            'legal_name' => ['required', 'string', 'min:2', 'max:255'],
            'trading_name' => ['nullable', 'string', 'max:255'],
            'registration_number' => ['required', 'string', 'min:3', 'max:100'],
            'tax_id' => ['nullable', 'string', 'max:100'],
            'established_date' => ['required', 'date_format:Y-m-d', 'before_or_equal:today'],
            'legal_structure_id' => ['required', 'integer', 'min:1'],
            'region_id' => ['required', 'integer', 'min:1'],
            'country_id' => ['required', 'integer', 'min:1'],
            'state_id' => ['required', 'integer', 'min:1'],
            'city_id' => ['required', 'integer', 'min:1'],
            'registered_address' => ['required', 'string', 'min:5', 'max:500'],
            'postal_code' => ['required', 'string', 'regex:/^[A-Za-z0-9][A-Za-z0-9 -]{1,11}$/'],
            'website' => ['nullable', 'url:http,https', 'max:2048'],
            'external_identifier' => ['nullable', 'string', 'max:100'],

            'business_model' => ['required', 'string', 'min:2', 'max:255'],
            'products_services' => ['required', 'string', 'min:2', 'max:1000'],
            'operating_countries' => ['required', 'string', 'min:2', 'max:1000'],
            'employee_count' => ['required', 'integer', 'between:0,10000000'],
            'company_stage' => ['required', 'string', 'min:2', 'max:100'],
            'annual_revenue' => ['required', 'decimal:0,2', 'min:0'],
            'revenue_currency' => ['required', 'string', 'size:3', 'regex:/^[A-Z]{3}$/'],
            'fiscal_year_end' => ['required', 'date_format:Y-m-d'],
            'listing_ticker' => ['nullable', 'string', 'max:50'],
            'business_description' => ['required', 'string', 'min:20', 'max:5000'],

            'parent_company' => ['nullable', 'string', 'max:255'],
            'ownership_type' => ['required', 'string', 'min:2', 'max:100'],
            'beneficial_owners' => ['required', 'string', 'min:10', 'max:5000'],
            'directors' => ['required', 'string', 'min:10', 'max:5000'],
            'authorized_signatory' => ['required', 'string', 'min:2', 'max:255'],
            'signatory_title' => ['required', 'string', 'min:2', 'max:100'],
            'signatory_id_number' => ['required', 'string', 'min:3', 'max:100'],
            'signatory_id_expiry' => ['required', 'date_format:Y-m-d', 'after_or_equal:today'],

            'contact_name' => ['required', 'string', 'min:2', 'max:255'],
            'contact_role' => ['required', 'string', 'min:2', 'max:255'],
            'contact_email' => ['required', 'email:rfc', 'max:254'],
            'contact_phone' => ['required', 'string', 'regex:/^\+?[0-9 ()-]{7,20}$/'],
            'preferred_contact' => ['required', Rule::in(['Email', 'Phone', 'SMS', 'WhatsApp'])],
            'referral_source' => ['nullable', 'string', 'max:500'],
            'accuracy_consent' => ['required', 'accepted'],
            'privacy_consent' => ['required', 'accepted'],

            'documents' => ['required', 'array', 'min:1', 'max:20'],
            'documents.*' => [
                'required',
                'file',
                'max:102400',
                'mimes:pdf,doc,docx,xls,xlsx,csv,jpg,jpeg,png',
            ],
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator): void {
                $totalBytes = collect($this->file('documents', []))
                    ->sum(fn ($file) => $file?->getSize() ?? 0);

                if ($totalBytes > 100 * 1024 * 1024) {
                    $validator->errors()->add(
                        'documents',
                        'The combined size of all documents may not exceed 100 MB.'
                    );
                }
            },
        ];
    }

    protected function prepareForValidation(): void
    {
        if (is_string($this->revenue_currency)) {
            $this->merge(['revenue_currency' => strtoupper(trim($this->revenue_currency))]);
        }
    }
}
