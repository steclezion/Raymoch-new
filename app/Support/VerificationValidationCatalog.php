<?php

namespace App\Support;

final class VerificationValidationCatalog
{
    public static function assistantContext(): array
    {
        return [
            'step_2_account_legal_identity' => [
                'account_type_id' => 'Required selected account category.',
                'applicant_profile_id' => 'Required selected legal/applicant profile.',
                'sector_id' => 'Required selected business sector.',
                'industry_id' => 'Required industry belonging to the selected sector.',
                'legal_name' => 'Required official legal/full name; 2-255 characters.',
                'trading_name' => 'Optional operating/trading name; maximum 255 characters.',
                'registration_number' => 'Required registration/license number; 3-100 characters.',
                'tax_id' => 'Optional TIN/VAT/tax identifier; maximum 100 characters. Sensitive; never sent to the model.',
                'established_date' => 'Required valid date that is today or earlier.',
                'legal_structure_id' => 'Required selected legal structure.',
                'region_id/country_id/state_id/city_id' => 'Required hierarchical location selections.',
                'registered_address' => 'Required registered address; 5-500 characters.',
                'postal_code' => 'Required 2-12 letters, digits, spaces, or hyphens.',
                'website' => 'Optional valid HTTP/HTTPS URL; maximum 2048 characters.',
                'external_identifier' => 'Optional LEI or D-U-N-S identifier; maximum 100 characters.',
            ],
            'step_3_business_profile' => [
                'business_model' => 'Required; 2-255 characters.',
                'products_services' => 'Required; 2-1000 characters.',
                'operating_countries' => 'Required; 2-1000 characters.',
                'employee_count' => 'Required whole number from 0 to 10,000,000.',
                'company_stage' => 'Required; 2-100 characters.',
                'annual_revenue' => 'Required non-negative number with at most two decimal places.',
                'revenue_currency' => 'Required ISO-style three-letter uppercase currency code.',
                'fiscal_year_end' => 'Required valid calendar date.',
                'listing_ticker' => 'Optional exchange/ticker text; maximum 50 characters.',
                'business_description' => 'Required; 20-5000 characters.',
            ],
            'step_4_ownership_control' => [
                'parent_company' => 'Optional; maximum 255 characters.',
                'ownership_type' => 'Required; 2-100 characters.',
                'beneficial_owners' => 'Required owner names, nationalities and ownership percentages; 10-5000 characters.',
                'directors' => 'Required directors/trustees/partners; 10-5000 characters.',
                'authorized_signatory' => 'Required full name; 2-255 characters.',
                'signatory_title' => 'Required title; 2-100 characters.',
                'signatory_id_number' => 'Required ID/passport number; 3-100 characters. Sensitive; never sent to the model.',
                'signatory_id_expiry' => 'Required valid date today or later.',
            ],
            'step_5_documents' => [
                'documents' => 'At least one file; PDF, DOC, DOCX, XLS, XLSX, CSV, JPG, JPEG or PNG; 100 MB per file and 100 MB combined.',
            ],
            'step_6_contact_consent' => [
                'contact_name' => 'Required full name; 2-255 characters.',
                'contact_role' => 'Required title or relationship; 2-255 characters.',
                'contact_email' => 'Required valid email; maximum 254 characters.',
                'contact_phone' => 'Required international-style phone using 7-20 digits/spaces/parentheses/hyphens with optional leading plus.',
                'preferred_contact' => 'Required; Email, Phone, SMS or WhatsApp.',
                'referral_source' => 'Optional; maximum 500 characters.',
                'accuracy_consent' => 'Required and must be accepted.',
                'privacy_consent' => 'Required and must be accepted.',
            ],
        ];
    }
}
