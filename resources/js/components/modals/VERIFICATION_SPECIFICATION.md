# Verification form validation specification

All browser validation is for immediate feedback only. `StoreVerificationRequest` repeats and strengthens every rule on the Laravel server. Fields marked **required** must be present; empty strings are treated as `null` by Laravel's default middleware.

## Step 2 — Account and legal identity

| Attribute | Required | Accepted value and validation |
|---|---:|---|
| `account_type_id` | Yes | Positive integer referencing an allowed account type. |
| `applicant_profile_id` | Yes | Positive integer referencing an allowed applicant profile. |
| `sector_id` | Yes | Positive integer referencing an allowed sector. |
| `industry_id` | Yes | Positive integer; must belong to the selected sector (add your database relationship rule). |
| `legal_name` | Yes | Text, 2–255 characters; must match official records. |
| `trading_name` | No | Text, up to 255 characters. |
| `registration_number` | Yes | Text, 3–100 characters; must match the registering authority's record. |
| `tax_id` | No | Text, up to 100 characters; sensitive and excluded from AI context. |
| `established_date` | Yes | `YYYY-MM-DD`; cannot be in the future. |
| `legal_structure_id` | Yes | Positive integer referencing an allowed legal structure. |
| `region_id` | Yes | Positive integer referencing an allowed region. |
| `country_id` | Yes | Positive integer; must belong to the selected region. |
| `state_id` | Yes | Positive integer; must belong to the selected country. |
| `city_id` | Yes | Positive integer; must belong to the selected state/province. |
| `registered_address` | Yes | Text, 5–500 characters. |
| `postal_code` | Yes | 2–12 letters, numbers, spaces, or hyphens; first character must be alphanumeric. |
| `website` | No | Valid `http` or `https` URL, up to 2,048 characters. |
| `external_identifier` | No | LEI, D-U-N-S, or similar identifier, up to 100 characters. |

## Step 3 — Business and operating profile

| Attribute | Required | Accepted value and validation |
|---|---:|---|
| `business_model` | Yes | Text, 2–255 characters. |
| `products_services` | Yes | Text, 2–1,000 characters. |
| `operating_countries` | Yes | Text, 2–1,000 characters. |
| `employee_count` | Yes | Whole number from 0 through 10,000,000. |
| `company_stage` | Yes | Text, 2–100 characters. |
| `annual_revenue` | Yes | Non-negative decimal with no more than two decimal places. |
| `revenue_currency` | Yes | Three uppercase letters, normally an ISO 4217 currency code. Input is normalized to uppercase. |
| `fiscal_year_end` | Yes | Valid `YYYY-MM-DD` calendar date. |
| `listing_ticker` | No | Text, up to 50 characters. |
| `business_description` | Yes | Text, 20–5,000 characters. |

## Step 4 — Ownership, leadership, and control

| Attribute | Required | Accepted value and validation |
|---|---:|---|
| `parent_company` | No | Text, up to 255 characters. |
| `ownership_type` | Yes | Text, 2–100 characters. |
| `beneficial_owners` | Yes | Text, 10–5,000 characters; include each required owner's name, nationality, and ownership percentage. |
| `directors` | Yes | Text, 10–5,000 characters; include the relevant directors, trustees, or partners. |
| `authorized_signatory` | Yes | Text, 2–255 characters. |
| `signatory_title` | Yes | Text, 2–100 characters. |
| `signatory_id_number` | Yes | Text, 3–100 characters; sensitive and excluded from AI context. |
| `signatory_id_expiry` | Yes | `YYYY-MM-DD`; today or later. |

## Step 5 — Supporting documents

| Attribute | Required | Accepted value and validation |
|---|---:|---|
| `documents` | Yes | Array containing 1–20 files. |
| `documents.*` | Yes | PDF, DOC, DOCX, XLS, XLSX, CSV, JPG, JPEG, or PNG. Maximum 100 MB per file and 100 MB total. Server MIME inspection is applied. |

The chatbot receives neither uploaded documents nor their contents.

## Step 6 — Primary contact and consent

| Attribute | Required | Accepted value and validation |
|---|---:|---|
| `contact_name` | Yes | Text, 2–255 characters. |
| `contact_role` | Yes | Text, 2–255 characters. |
| `contact_email` | Yes | RFC-valid email, up to 254 characters. |
| `contact_phone` | Yes | 7–20 phone characters: digits, spaces, parentheses, hyphens, and an optional leading `+`. |
| `preferred_contact` | Yes | Exactly `Email`, `Phone`, `SMS`, or `WhatsApp`. |
| `referral_source` | No | Text, up to 500 characters. |
| `accuracy_consent` | Yes | Must be accepted. |
| `privacy_consent` | Yes | Must be accepted. |

## Assistant request

| Attribute | Required | Accepted value and validation |
|---|---:|---|
| `question` | Yes | Text, 1–2,000 characters. |
| `current_step` | Yes | Integer from 1 through 6. |
| `form_context` | No | Object containing the current form snapshot. The client and controller both remove tax and signatory ID values. |
| `conversation` | No | Up to eight recent messages; role must be `user` or `assistant`, and content is limited to 2,000 characters. |

For production, replace generic positive-integer lookup rules with `exists` and relationship-aware rules using your actual table names. This prevents a user from submitting a valid numeric ID that does not exist or belongs to a different parent selection.