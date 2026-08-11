<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreInvestorPreferenceRequest extends FormRequest
{
    /**
     * Only authenticated users may submit investment preferences.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Normalize values before validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            // Store currency consistently as USD rather than usd or Usd.
            'currency_code' => strtoupper(
                (string) $this->input('currency_code', 'USD')
            ),

            // Use false when the React form does not provide this field.
            'verified_companies_only' => $this->has(
                'verified_companies_only'
            )
                ? $this->boolean('verified_companies_only')
                : false,

            // The current page edits the user's default preference.
            'is_default' => $this->has('is_default')
                ? $this->boolean('is_default')
                : true,
        ]);
    }

    /**
     * Validate the preference form.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'preference_name' => [
                'sometimes',
                'nullable',
                'string',
                'max:150',
            ],

            // Minimum ticket cannot exceed the maximum ticket.
            'ticket_min' => [
                'required',
                'numeric',
                'min:0',
                'lte:ticket_max',
            ],

            // Maximum ticket must equal or exceed the minimum.
            'ticket_max' => [
                'required',
                'numeric',
                'min:0',
                'gte:ticket_min',
            ],

            'currency_code' => [
                'required',
                'string',
                'size:3',
                'regex:/^[A-Z]{3}$/',
            ],

            // Zero means the investor can begin immediately.
            'start_from_month' => [
                'required',
                'integer',
                'min:0',
                'max:120',
                'lte:start_to_month',
            ],

            'start_to_month' => [
                'required',
                'integer',
                'min:0',
                'max:120',
                'gte:start_from_month',
            ],

            // At least one instrument must be selected.
            'funding_instrument_ids' => [
                'required',
                'array',
                'min:1',
            ],

            // Every selected ID must exist and appear only once.
            'funding_instrument_ids.*' => [
                'required',
                'integer',
                'distinct',
                'exists:funding_instruments,id',
            ],

            // At least one business sector must be selected.
            'business_sector_ids' => [
                'required',
                'array',
                'min:1',
            ],

            'sector_ids.*' => [
                'required',
                'integer',
                'distinct',
                'exists:sectors,id',
            ],

            // At least one country must be selected.
            'country_ids' => [
                'required',
                'array',
                'min:1',
            ],

            'country_ids.*' => [
                'required',
                'integer',
                'distinct',
                'exists:countries_africans,id',
            ],

            'verified_companies_only' => [
                'required',
                'boolean',
            ],

            'minimum_cti_tier' => [
                'sometimes',
                'nullable',
                'string',
                'max:30',
            ],

            'is_default' => [
                'required',
                'boolean',
            ],
        ];
    }

    /**
     * User-friendly validation errors returned to React.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'ticket_min.lte' =>
            'The minimum ticket cannot exceed the maximum ticket.',

            'ticket_max.gte' =>
            'The maximum ticket must be equal to or greater than the minimum ticket.',

            'start_from_month.lte' =>
            'The starting month cannot exceed the ending month.',

            'start_to_month.gte' =>
            'The ending month must be equal to or greater than the starting month.',

            'funding_instrument_ids.required' =>
            'Select at least one funding instrument.',

            'funding_instrument_ids.min' =>
            'Select at least one funding instrument.',

            'business_sector_ids.required' =>
            'Select at least one investment sector.',

            'business_sector_ids.min' =>
            'Select at least one investment sector.',

            'country_ids.required' =>
            'Select at least one investment country.',

            'country_ids.min' =>
            'Select at least one investment country.',
        ];
    }
}
