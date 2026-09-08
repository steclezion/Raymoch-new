import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  BadgeCheck,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  FileCheck2,
  FileUp,
  Eye,
  Landmark,
  Lightbulb,
  LocateFixed,
  MapPin,
  Maximize2,
  MessageCircle,
  Minimize2,
  Pencil,
  Send,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  UploadCloud,
  UserRound,
  UsersRound,
  XCircle,
} from "lucide-react";

import "./verificationModal.css";
import "./verificationModal.chatbot.css";
import "./verificationModal.fieldHelp.css";
import "./verificationModal.signature.css";
import ConfirmationDialog from "./ConfirmationDialog";
import CompanyDetailsModal from "./CompanyDetailsModal";

const MAX_UPLOAD_BYTES = 100 * 1024 * 1024;

// Leave VITE_API_URL empty when React and Laravel use the same origin.
// Example for separate Vite/Laravel development servers:
// VITE_API_URL=http://127.0.0.1:8000
const API_BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const ASSISTANT_ENDPOINT = `${API_BASE_URL}/api/verification/assistant`;
const ASSISTANT_ENDPOINT_BUSINESS_DESCRIPTION =
  `${API_BASE_URL}/api/verification/assistant_business_description`;
const GENERATE_BUSINESS_DESCRIPTION_ENDPOINT =
  `${API_BASE_URL}/api/verification/generate_business_description`;
const GENERATE_PRODUCT_SUGGESTIONS_ENDPOINT =
  `${API_BASE_URL}/api/verification/generate_product_suggestions`;
const REVIEW_VERIFICATION_DOCUMENT_ENDPOINT =
  `${API_BASE_URL}/api/verification/review_document`;
const GRAB_APPLICANTS_INFO_ENDPOINT =
  `${API_BASE_URL}/api/grab_applicants_info`;
const VERIFICATION_ENDPOINT = `${API_BASE_URL}/verificationsubmissionform`;
const SUBMISSION_PREVIEW_MODE = false;
const COMPANY_INFORMATION_ENDPOINT = `${API_BASE_URL}/api/company-information`;

const REVIEWABLE_DOCUMENT_FILES = ".pdf,.jpg,.jpeg,.png,.webp";
const COMPANY_PROFILE_FILES = ".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp";
const COMPANY_PROFILE_TYPES = [
  "Magazine",
  "Company profile",
  "Article",
  "Company image",
  "Press release",
  "Brochure",
  "Annual report",
  "Case study",
  "Media coverage",
  "Award or recognition",
  "Other",
];

const FIELD_HELP_EVENT = "verification:ask-field-help";

const REQUIRED_FIELD_HELP = {
  account_type_id: "The type of account being verified, such as a business, institution, or investor account. Choose the option that best matches how this account will be used.",
  legal_name: "The official name shown on government-issued identity, incorporation, registration, or licensing records.",
  sector_id: "The broad area of the economy in which the organization operates.",
  industry_id: "The more specific line of business within the selected sector.",
  website: "The applicant’s official public website. Enter the complete address, including https://, so it can be used to verify the organization’s identity and activities.",
  gps_location: "Select the applicant’s physical live location using the device GPS. Location access must be allowed in the browser.",
  external_identifier: "D-U-N-S is a unique 9-digit Dun & Bradstreet business identifier used across company, credit, supplier, procurement, and global transaction records. An LEI is a globally unique 20-character alphanumeric identifier issued under GLEIF for legal entities in financial transactions, regulatory reporting, and counterparty identification.",
  trading_name: "The name the applicant uses publicly or commercially when it differs from its registered legal name. This may also be called a trade name, business name, assumed name, or DBA (doing business as).",
  registration_number: "The unique number assigned by the authority that registered or licensed the applicant.",
  tax_id: "The applicant’s official tax identifier issued by a government revenue or tax authority. Depending on the jurisdiction, this may be called a Tax ID, TIN, VAT number, EIN, GST number, or another equivalent registration number.",
  established_date: "The organization’s official formation date, as shown on supporting records.",
  legal_structure_id: "The applicant’s legal form, such as corporation, partnership, nonprofit, trust, or sole proprietorship.",
  region_id: "The geographic region containing the applicant’s registered location.",
  country_id: "The country where the applicant is legally registered or ordinarily resident.",
  state_id: "The state, province, territory, or equivalent administrative area of the registered address.",
  city_id: "The city or locality of the applicant’s registered address.",
  registered_address: "The official address recorded for the applicant by a government, registry, regulator, or other competent authority.",
  postal_code: "The postal or ZIP code belonging to the registered address.",
  business_model: "A concise description of how the organization creates value and earns revenue, such as B2B, B2C, subscription, or marketplace.",
  products_services: "The principal products or services the organization provides to customers.",
  operating_countries: "Every country in which the organization currently conducts business, serves customers, maintains offices, or has material operations. This field is not retained after the form is dismissed.",
  employee_count: "The current total number of people employed by the organization. Use the most recent reliable figure.",
  company_stage: "The organization’s current development stage, such as pre-revenue, early-stage, growth, mature, or publicly listed.",
  listing_ticker: "Enter the applicant’s stock ticker and/or the exchange where it is publicly listed, for example NASDAQ: MSFT, NYSE: IBM, LSE: SHEL, or TSE: 7203. If the organization is not publicly listed, leave this field blank.",
  annual_revenue: "The organization’s revenue for its most recently completed financial year, before expenses are deducted.",
  revenue_currency: "The currency in which annual revenue is reported.",
  fiscal_year_end: "The final date of the organization’s annual accounting period.",
  business_description: "A clear overview of the organization’s activities, customers, markets, delivery model, and sources of revenue.",
  parent_company: "Select the checkbox only when another entity ultimately owns or controls the applicant. Then enter that parent entity’s complete legal name as it appears in official records.",
  has_parent_company: "Select this when the trade name represents a sister company under the parent company shown in Legal or full name. The parent name is read-only and the relationship is displayed below.",
  is_parent_company: "Select this when the legal or full name belongs to the parent company itself. A company cannot be marked as both a parent company and a sister company.",
  relationship_type: "Select the legal or ownership relationship between the current company and the related company.",
  ownership_percentage: "Enter the percentage of ownership or control represented by this relationship, from 0 to 100.",
  is_ultimate_parent: "Select this when the current company is the highest controlling entity in the ownership structure.",
  is_holding_company: "Select this when the current company primarily holds ownership interests in other entities.",
  ultimate_company_name: "Enter the complete legal name of the ultimate company associated with the selected relationship.",
  ownership_type: "The general ownership classification, such as privately held, publicly traded, state-owned, cooperative, or nonprofit.",
  beneficial_owners: "Add the name, title, biography, email address, LinkedIn URL, and ownership percentage of each member of the company’s leadership board.",
  authorized_signatory: "The person legally authorized to sign and submit this verification request for the applicant.",
  signatory_title: "The authorized signatory’s official role or position in relation to the applicant.",
  signatory_id_number: "The identifying number printed on the authorized signatory’s valid passport or national identity document.",
  signatory_id_expiry: "The expiration date printed on the authorized signatory’s identity document.",
  contact_name: "The full name of the person who should be contacted about this verification request.",
  contact_role: "The primary contact’s job title or relationship to the applicant.",
  contact_email: "A monitored email address where verification questions and status updates can be received.",
  contact_phone: "A telephone number, including country code, where the primary contact can be reached.",
  preferred_contact: "The communication channel the primary contact prefers for verification correspondence.",
  accuracy_consent: "Confirmation that the submitted information is accurate, current, complete, authorized, and may be used for the stated verification checks.",
  privacy_consent: "Acknowledgment that submitted personal and business information may be securely processed and retained according to the privacy notice.",
};

const BUSINESS_MODELS = [
  "B2B (Business-to-Business)", "B2C (Business-to-Consumer)", "B2B2C", "C2C (Consumer-to-Consumer)",
  "C2B (Consumer-to-Business)", "D2C (Direct-to-Consumer)", "Subscription", "SaaS", "Marketplace",
  "E-commerce", "Retail", "Wholesale", "Manufacturer", "Distributor", "Franchise", "Licensing",
  "Freemium", "Advertising-supported", "Affiliate", "Commission-based", "Brokerage", "Consulting",
  "Professional services", "Managed services", "On-demand", "Sharing economy", "Platform", "Aggregator",
  "Usage-based", "Transaction fee", "Razor-and-blades", "Nonprofit", "Cooperative", "Government-funded",
];

const COMPANY_STAGES = [
  "Idea / Concept", "Pre-seed", "Seed", "Pre-revenue", "Early revenue", "Startup", "Scale-up",
  "Growth", "Expansion", "Established", "Mature", "Turnaround / Restructuring", "Pre-IPO",
  "Publicly listed", "Acquired", "Merged", "Subsidiary", "Dormant", "Nonprofit / Mission stage",
];

const OWNERSHIP_TYPES = [
  "Privately held", "Publicly traded", "State-owned", "Government agency", "Sole proprietorship",
  "Partnership", "Family-owned", "Employee-owned", "Cooperative", "Nonprofit", "Charitable trust",
  "Foundation", "Mutual organization", "Private equity-backed", "Venture-backed", "Joint venture",
  "Subsidiary", "Foreign-owned", "Member-owned", "Tribal / Indigenous-owned", "Mixed ownership",
];

const SIGNATORY_TITLES = [
  "Owner", "Founder", "Co-Founder", "Chairperson", "Vice Chairperson", "Director", "Managing Director",
  "Executive Director", "Chief Executive Officer (CEO)", "President", "Vice President", "Partner",
  "Managing Partner", "General Partner", "Trustee", "Secretary", "Company Secretary", "Treasurer",
  "Chief Financial Officer (CFO)", "Chief Operating Officer (COO)", "Chief Legal Officer (CLO)",
  "General Counsel", "Authorized Representative", "Authorized Signatory", "Attorney-in-Fact", "Proxy",
  "Administrator", "Manager", "Compliance Officer", "Corporate Officer",
];

const STOCK_EXCHANGES = [
  "NYSE — New York Stock Exchange", "NASDAQ", "NYSE American", "TSX — Toronto Stock Exchange",
  "TSXV — TSX Venture Exchange", "LSE — London Stock Exchange", "AIM — London Stock Exchange",
  "Euronext Amsterdam", "Euronext Brussels", "Euronext Dublin", "Euronext Lisbon", "Euronext Milan",
  "Euronext Oslo", "Euronext Paris", "Deutsche Börse Xetra", "SIX Swiss Exchange", "BME — Spanish Exchanges",
  "Nasdaq Copenhagen", "Nasdaq Helsinki", "Nasdaq Iceland", "Nasdaq Stockholm", "Oslo Børs",
  "Warsaw Stock Exchange", "Vienna Stock Exchange", "Athens Exchange", "Borsa Istanbul",
  "TSE — Tokyo Stock Exchange", "OSE — Osaka Exchange", "HKEX — Hong Kong Stock Exchange",
  "SSE — Shanghai Stock Exchange", "SZSE — Shenzhen Stock Exchange", "BSE — Beijing Stock Exchange",
  "KRX — Korea Exchange", "TWSE — Taiwan Stock Exchange", "SGX — Singapore Exchange",
  "NSE India", "BSE India", "ASX — Australian Securities Exchange", "NZX — New Zealand Exchange",
  "JSE — Johannesburg Stock Exchange", "EGX — Egyptian Exchange", "NGX — Nigerian Exchange",
  "Nairobi Securities Exchange", "Casablanca Stock Exchange", "Tadawul — Saudi Exchange",
  "ADX — Abu Dhabi Securities Exchange", "DFM — Dubai Financial Market", "Qatar Stock Exchange",
  "B3 — Brasil Bolsa Balcão", "BMV — Mexican Stock Exchange", "BYMA — Buenos Aires Stock Exchange",
  "Santiago Stock Exchange", "Colombia Stock Exchange", "Lima Stock Exchange", "OTC Markets",
];

const VERIFICATION_DOCUMENTS = {
  cti: [
    ["registration", "Registration", "Company Registration Certificate, Articles of Incorporation"],
    ["bank", "Bank", "Bank Letter, Recent Bank Statement"],
    ["tax", "Tax", "TIN, PIN, VAT Certificate"],
    ["directors", "Directors", "National ID or Passport of each director"],
  ],
  ats: [
    ["operational_presence", "Operational Presence", "Storefront, equipment or geo-tagged operational photos"],
    ["customer_network", "Customer or Network Proof", "Invoices, receipts, redacted customer list or partnership emails"],
    ["cashflow_trace", "Cashflow Trace", "Wallet CSV, bank deposit slips or POS summary"],
    ["owner_identity", "Owner Identity", "Owner National ID or Passport"],
  ],
};

const BUSINESS_DESCRIPTION_SOURCE_FIELDS = [
  ["account_type_id", "Account type", 2],
  ["legal_name", "Legal or full name", 2],
  ["sector_id", "Sector", 2],
  ["industry_id", "Industry", 2],
  ["registration_number", "Registration or license number", 2],
  ["established_date", "Date established", 2],
  ["legal_structure_id", "Legal structure", 2],
  ["region_id", "Region", 2],
  ["country_id", "Country", 2],
  ["registered_address", "Registered address", 2],
  ["postal_code", "Postal code", 2],
  ["business_model", "Business model", 3],
  ["products_services", "Products or services", 3],
  ["operating_countries", "Countries of operation", 3],
  ["employee_count", "Number of employees", 3],
  ["company_stage", "Company stage", 3],
  ["annual_revenue", "Annual revenue", 3],
  ["revenue_currency", "Revenue currency", 3],
  ["fiscal_year_end", "Fiscal year end", 3],
];

function RequiredFieldHelp({ name, label }) {
  const description =
    REQUIRED_FIELD_HELP[name] ||
    `${label} is required to complete the verification review. Provide accurate, current information that matches your supporting records.`;

  const askClarityAssistant = () => {
    window.dispatchEvent(
      new CustomEvent(FIELD_HELP_EVENT, {
        detail: {
          label,
          question: `What is the meaning of ${label}?`,
        },
      }),
    );
  };

  return (
    <span className="vr-requiredHelp">
      <button
        className="vr-requiredHelpInfo"
        type="button"
        aria-label={`Information about ${label}`}
        aria-describedby={`${name}-required-help`}
      >
        i
      </button>

      <span
        id={`${name}-required-help`}
        className="vr-requiredHelpPopover"
        role="tooltip"
      >
        <strong>{label}</strong>
        <span>{description}</span>

        <button
          className="vr-requiredHelpAsk"
          type="button"
          aria-label={`Ask Clarity Assistant about ${label}`}
          title={`Ask Clarity Assistant: What is the meaning of ${label}?`}
          onClick={askClarityAssistant}
        >
          ?
        </button>
      </span>
    </span>
  );
}

function VerificationTypeInfo({ title, description }) {
  const [open, setOpen] = useState(false);

  const askClarityAssistant = (event) => {
    event.preventDefault();
    event.stopPropagation();
    window.dispatchEvent(
      new CustomEvent(FIELD_HELP_EVENT, {
        detail: {
          label: title,
          question: `Explain ${title}, including what it means, which documents are required, how the review works, and what result the applicant receives.`,
        },
      }),
    );
    setOpen(false);
  };

  return (
    <span
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocusCapture={() => setOpen(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      style={{ position: "absolute", top: "12px", right: "12px", zIndex: open ? 6 : 2 }}
    >
      <button
        type="button"
        aria-label={`Information about ${title}`}
        aria-expanded={open}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpen((current) => !current);
        }}
        style={{ display: "grid", placeItems: "center", width: "25px", height: "25px", border: "1px solid #93c5fd", borderRadius: "50%", background: "#eff6ff", color: "#1d4ed8", fontSize: "13px", fontWeight: 900, cursor: "help" }}
      >
        i
      </button>

      {open && (
        <span
          role="tooltip"
          style={{ position: "absolute", top: "31px", right: 0, display: "grid", width: "min(330px, 78vw)", gap: "9px", padding: "13px", border: "1px solid #bfdbfe", borderRadius: "11px", background: "#ffffff", boxShadow: "0 14px 35px rgba(15, 23, 42, .18)", color: "#334155", fontSize: "12px", lineHeight: 1.55 }}
        >
          <strong style={{ paddingRight: "28px", color: "#0f2747", fontSize: "13px" }}>{title}</strong>
          <span>{description}</span>
          <button
            type="button"
            aria-label={`Ask Clarity Assistant about ${title}`}
            title={`Ask Clarity Assistant about ${title}`}
            onClick={askClarityAssistant}
            style={{ position: "absolute", top: "10px", right: "10px", display: "grid", placeItems: "center", width: "25px", height: "25px", border: 0, borderRadius: "50%", background: "#2563eb", color: "#fff", fontSize: "14px", fontWeight: 900, cursor: "pointer" }}
          >
            ?
          </button>
        </span>
      )}
    </span>
  );
}

function FieldLabel({ label, name, required, help = false }) {
  return (
    <div className="vr-labelWithHelp">
      <label htmlFor={name}>
        {label}
        {required && " *"}
      </label>
      {(required || help) && <RequiredFieldHelp name={name} label={label} />}
    </div>
  );
}

function latestEstablishmentDate(now = new Date()) {
  const cutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  cutoff.setDate(cutoff.getDate() - 10);
  return [cutoff.getFullYear(), String(cutoff.getMonth() + 1).padStart(2, "0"), String(cutoff.getDate()).padStart(2, "0")].join("-");
}

function earliestIdExpiryDate(now = new Date()) {
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  tomorrow.setDate(tomorrow.getDate() + 1);
  return [tomorrow.getFullYear(), String(tomorrow.getMonth() + 1).padStart(2, "0"), String(tomorrow.getDate()).padStart(2, "0")].join("-");
}

function isValidGpsLocation(value) {
  const coordinates = String(value ?? "").split(",").map((coordinate) => Number(coordinate.trim()));
  return coordinates.length === 2
    && coordinates.every(Number.isFinite)
    && coordinates[0] >= -90 && coordinates[0] <= 90
    && coordinates[1] >= -180 && coordinates[1] <= 180;
}

const DATA_SCOPE_RULES = {
  legal_name: {
    valid: (value) => value.trim().length >= 2,
    message: "Legal or full name must contain at least two characters.",
  },
  registration_number: {
    valid: (value) => value.trim().length >= 3,
    message: "Registration or license number is too short to be valid.",
  },
  established_date: {
    valid: (value) => /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(new Date(`${value}T00:00:00`).getTime()) && value <= latestEstablishmentDate(),
    message: "The company must have been established at least 10 days ago.",
  },
  postal_code: {
    valid: (value) => /^[A-Za-z0-9][A-Za-z0-9 -]{1,11}$/.test(value.trim()),
    message: "Postal code must be 2–12 letters, numbers, spaces, or hyphens.",
  },
  gps_location: {
    valid: (value) => {
      const coordinates = value.split(",").map((coordinate) => Number(coordinate.trim()));
      return coordinates.length === 2
        && coordinates.every(Number.isFinite)
        && coordinates[0] >= -90 && coordinates[0] <= 90
        && coordinates[1] >= -180 && coordinates[1] <= 180;
    },
    message: "Select a valid physical live GPS location.",
  },
  business_description: {
    valid: (value) => value.trim().length >= 500,
    message: "Business description must contain at least 500 meaningful characters.",
  },
  contact_phone: {
    valid: (value) => /^\+?[0-9 ()-]{7,20}$/.test(value.trim()),
    message: "Phone number must contain 7–20 valid international phone characters.",
  },
};

const stepMeta = {
  1: {
    title: "Verification",
    description: "Confirm your business or investor identity.",
  },
  2: {
    title: "Account and Legal Identity",
    description: "Provide the applicant's legal and registration details.",
  },
  3: {
    title: "Business and Operating Profile",
    description: "Describe the organization and its business activities.",
  },
  4: {
    title: "Ownership, Leadership and Control",
    description: "Identify beneficial owners and authorized signatories.",
  },
  5: {
    title: "Supporting Documents",
    description: "Upload the evidence required for verification.",
  },
  6: {
    title: "Primary Contact and Confirmation",
    description: "Enter contact details, review the declarations and submit.",
  },
};

const initialFormData = {
  account_type_id: "",
  legal_name: "",
  trading_name: "",
  registration_number: "",
  tax_id: "",
  established_date: "",
  legal_structure_id: "",
  region_id: "",
  country_id: "",
  state_id: "",
  city_id: "",
  registered_address: "",
  postal_code: "",
  website: "",
  gps_location: "",
  external_identifier: "",

  sector_id: "",
  industry_id: "",
  business_model: "",
  products_services: "",
  operating_countries: [],
  employee_count: "",
  company_stage: "",
  annual_revenue: "",
  revenue_currency: "",
  fiscal_year_end: "",
  listing_ticker: "",
  business_description: "",

  relationship_type: "",
  ownership_percentage: "",
  is_ultimate_parent: false,
  is_holding_company: false,
  ultimate_company_name: "",
  ownership_type: "",
  beneficial_owners: "",
  authorized_signatory: "",
  signatory_title: "",
  signatory_id_number: "",
  signatory_id_expiry: "",

  contact_name: "",
  contact_role: "",
  contact_email: "",
  contact_phone: "",
  preferred_contact: "",
  referral_source: "",
  accuracy_consent: false,
  privacy_consent: false,
};

function createEmptyFormData() {
  return {
    ...initialFormData,
    operating_countries: [],
  };
}

function sanitizeVerificationStep(value) {
  const parsedStep = Number(value);

  return Number.isInteger(parsedStep) && parsedStep >= 1 && parsedStep <= 6
    ? parsedStep
    : 1;
}

function sanitizeOperatingCountries(value) {
  if (!Array.isArray(value)) return [];

  return [
    ...new Set(
      value
        .filter((countryName) => typeof countryName === "string")
        .map((countryName) => countryName.trim())
        .filter(Boolean),
    ),
  ];
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeCurrencyOptions(value) {
  const groupedByCode = new Map();

  asArray(value).forEach((option) => {
    const source = option && typeof option === "object" ? option : {};
    const rawName = String(source.name ?? option ?? "").trim();
    const code = String(
      source.code ??
        source.currency_code ??
        source.iso_code ??
        rawName.match(/\b[A-Z]{3}\b/)?.[0] ??
        "",
    )
      .trim()
      .toUpperCase();

    if (!code) return;

    const rawCountries =
      source.country_names ??
      source.countries ??
      source.country_name ??
      source.country?.name ??
      source.country ??
      [];
    const countries = (Array.isArray(rawCountries)
      ? rawCountries
      : [rawCountries]
    )
      .map((country) =>
        typeof country === "object" ? country?.name : country,
      )
      .map((country) => String(country ?? "").trim())
      .filter(Boolean);

    if (!groupedByCode.has(code)) {
      groupedByCode.set(code, {
        id: source.id ?? source.value ?? code,
        code,
        countries: new Set(),
      });
    }

    countries.forEach((country) =>
      groupedByCode.get(code).countries.add(country),
    );
  });

  return [...groupedByCode.values()]
    .map(({ id, code, countries }) => ({
      id,
      name: `${code} — ${
        countries.size > 0
          ? [...countries].sort((left, right) => left.localeCompare(right)).join(", ")
          : "Global / country not specified"
      }`,
    }))
    .sort((left, right) => left.name.localeCompare(right.name));
}

function sanitizeVerificationFiles(value) {
  if (!Array.isArray(value)) return [];

  return value.filter(
    (file) =>
      file &&
      typeof file === "object" &&
      typeof file.name === "string" &&
      typeof file.size === "number",
  );
}

function sanitizeVerificationFormData(value) {
  const empty = createEmptyFormData();
  let hadRecoveryIssue = false;

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {
      formData: empty,
      hadRecoveryIssue: value != null,
    };
  }

  const safe = { ...empty };

  Object.entries(empty).forEach(([key, defaultValue]) => {
    const retainedValue = value[key];

    if (key === "operating_countries") {
      safe[key] = sanitizeOperatingCountries(retainedValue);

      if (retainedValue != null && !Array.isArray(retainedValue)) {
        hadRecoveryIssue = true;
      }

      return;
    }

    if (typeof defaultValue === "boolean") {
      if (typeof retainedValue === "boolean") {
        safe[key] = retainedValue;
      } else if (retainedValue != null) {
        hadRecoveryIssue = true;
      }

      return;
    }

    if (typeof retainedValue === "string") {
      safe[key] = retainedValue;
      return;
    }

    // Select values can sometimes be numeric IDs. Convert them safely for inputs.
    if (typeof retainedValue === "number" && Number.isFinite(retainedValue)) {
      safe[key] = String(retainedValue);
      return;
    }

    if (retainedValue != null) {
      hadRecoveryIssue = true;
    }
  });

  return { formData: safe, hadRecoveryIssue };
}

function currentVerificationPageKey() {
  if (typeof window === "undefined") return "";

  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

/*
 * Temporary in-memory draft:
 * - survives modal/component close and reopen on the same page
 * - disappears on browser refresh because the JavaScript module reloads
 * - is cleared when this component unmounts because the page URL changed
 * - intentionally does NOT use localStorage/sessionStorage
 */
let verificationDraftCache = {
  pageKey: null,
  step: 1,
  formData: null,
  files: [],
};

function readVerificationDraft(pageKey) {
  try {
    if (
      verificationDraftCache.pageKey !== pageKey ||
      !verificationDraftCache.formData
    ) {
      return {
        step: 1,
        formData: createEmptyFormData(),
        files: [],
        hadRecoveryIssue: false,
      };
    }

    const safeStep = sanitizeVerificationStep(verificationDraftCache.step);
    const { formData, hadRecoveryIssue: formHadIssue } =
      sanitizeVerificationFormData(verificationDraftCache.formData);
    const safeFiles = sanitizeVerificationFiles(verificationDraftCache.files);

    const stepHadIssue = safeStep !== Number(verificationDraftCache.step);
    const filesHadIssue =
      !Array.isArray(verificationDraftCache.files) ||
      safeFiles.length !== verificationDraftCache.files.length;

    return {
      step: safeStep,
      // Never restore countries of operation after Escape/X dismissal.
      formData: { ...formData, operating_countries: [] },
      files: [...safeFiles],
      hadRecoveryIssue: formHadIssue || stepHadIssue || filesHadIssue,
    };
  } catch (error) {
    console.error("[Verification] Unable to restore retained form data", error);
    clearVerificationDraftCache();

    return {
      step: 1,
      formData: createEmptyFormData(),
      files: [],
      hadRecoveryIssue: true,
    };
  }
}

function clearVerificationDraftCache() {
  verificationDraftCache = {
    pageKey: null,
    step: 1,
    formData: null,
    files: [],
  };
}

function SignatureDialog({
  open,
  initialName,
  initialSignature,
  onCancel,
  onSave,
}) {
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef(null);
  const [signatoryName, setSignatoryName] = useState(initialName || "");
  const [hasInk, setHasInk] = useState(Boolean(initialSignature));
  const [inputMethod, setInputMethod] = useState("mouse, touch, or pen");
  const [signatureError, setSignatureError] = useState("");

  const prepareCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = Math.max(Math.round(rect.width * ratio), 1);
    canvas.height = Math.max(Math.round(rect.height * ratio), 1);

    const context = canvas.getContext("2d");
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = 2.25;
    context.strokeStyle = "#0f172a";
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, rect.width, rect.height);

    if (initialSignature) {
      const image = new Image();
      image.onload = () => {
        context.drawImage(image, 0, 0, rect.width, rect.height);
        setHasInk(true);
      };
      image.src = initialSignature;
    } else {
      setHasInk(false);
    }
  };

  useEffect(() => {
    if (!open) return undefined;

    setSignatoryName(initialName || "");
    setSignatureError("");
    const frame = window.requestAnimationFrame(prepareCanvas);

    const handleEscape = (event) => {
      if (event.key === "Escape") onCancel();
    };

    window.addEventListener("keydown", handleEscape);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const canvasPoint = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const beginSignature = (event) => {
    event.preventDefault();
    const canvas = canvasRef.current;
    canvas.setPointerCapture?.(event.pointerId);
    drawingRef.current = true;
    lastPointRef.current = canvasPoint(event);
    setInputMethod(
      event.pointerType === "pen"
        ? "pen or signature device"
        : event.pointerType === "touch"
          ? "touch"
          : "mouse",
    );
  };

  const drawSignature = (event) => {
    if (!drawingRef.current) return;
    event.preventDefault();

    const nextPoint = canvasPoint(event);
    const previousPoint = lastPointRef.current;
    const context = canvasRef.current.getContext("2d");

    context.beginPath();
    context.moveTo(previousPoint.x, previousPoint.y);
    context.lineTo(nextPoint.x, nextPoint.y);
    context.stroke();

    lastPointRef.current = nextPoint;
    setHasInk(true);
    setSignatureError("");
  };

  const endSignature = (event) => {
    drawingRef.current = false;
    lastPointRef.current = null;
    const canvas = canvasRef.current;
    if (canvas?.hasPointerCapture?.(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId);
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    context.clearRect(0, 0, rect.width, rect.height);
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, rect.width, rect.height);
    context.strokeStyle = "#0f172a";
    setHasInk(false);
    setSignatureError("");
  };

  const saveSignature = () => {
    const cleanName = signatoryName.trim();

    if (!cleanName) {
      setSignatureError("Enter the authorized signatory’s full name.");
      return;
    }

    if (!hasInk) {
      setSignatureError("Provide a signature using a pen, touch, or mouse.");
      return;
    }

    onSave({
      name: cleanName,
      dataUrl: canvasRef.current.toDataURL("image/png"),
    });
  };

  if (!open) return null;

  return (
    <div className="vr-signatureBackdrop" role="presentation">
      <section
        className="vr-signatureDialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="signature-dialog-title"
      >
        <div className="vr-signatureHeader">
          <div>
            <h2 id="signature-dialog-title">Authorized signatory</h2>
            <p>Sign with a connected pen or signature device. If none is available, use touch or your mouse.</p>
          </div>
          <button type="button" aria-label="Close signature form" onClick={onCancel}>×</button>
        </div>

        <label className="vr-signatureName" htmlFor="signature-name">
          Authorized signatory’s full name *
          <input
            id="signature-name"
            type="text"
            value={signatoryName}
            autoFocus
            onChange={(event) => setSignatoryName(event.target.value)}
          />
        </label>

        <div className="vr-signatureCanvasHeader">
          <span>Signature *</span>
          <small>Input detected: {inputMethod}</small>
        </div>

        <canvas
          ref={canvasRef}
          className="vr-signatureCanvas"
          aria-label="Signature drawing area"
          onPointerDown={beginSignature}
          onPointerMove={drawSignature}
          onPointerUp={endSignature}
          onPointerCancel={endSignature}
          onPointerLeave={(event) => {
            if (drawingRef.current) endSignature(event);
          }}
        />

        {signatureError && <p className="vr-error" role="alert">{signatureError}</p>}

        <div className="vr-signatureActions">
          <button className="vr-btn vr-btnGhost" type="button" onClick={clearSignature}>Clear signature</button>
          <span />
          <button className="vr-btn vr-btnGhost" type="button" onClick={onCancel}>Cancel</button>
          <button className="vr-btn" type="button" onClick={saveSignature}>Use signature</button>
        </div>
      </section>
    </div>
  );
}


function Field({
  label,
  name,
  value,
  required = false,
  help = false,
  fullWidth = false,
  type = "text",
  placeholder,
  onChange,
  children,
  hint,
  ...props
}) {
  return (
    <div className="vr-field" style={fullWidth ? { gridColumn: "1 / -1" } : undefined}>
      <FieldLabel label={label} name={name} required={required} help={help} />

      {children || (
        <input
          id={name}
          name={name}
          type={type}
          value={value ?? ""}
          required={required}
          placeholder={placeholder}
          onChange={onChange}
          {...props}
        />
      )}
      {hint}
    </div>
  );
}

function DateEstablishedField({ value, onChange }) {
  const inputRef = useRef(null);
  const maximumDate = latestEstablishmentDate();
  const tooRecent = Boolean(value && value > maximumDate);
  useEffect(() => {
    inputRef.current?.setCustomValidity(tooRecent ? "The company must have been established at least 10 days ago." : "");
  }, [tooRecent]);

  const openPicker = () => {
    const input = inputRef.current;
    if (!input) return;
    input.focus();
    // Native pickers provide the device's accessible calendar UI.
    // Browsers without showPicker still allow keyboard date entry.
    try { input.showPicker?.(); } catch { /* Keep keyboard entry available. */ }
  };

  return (
    <Field label="Date established" name="established_date" required>
      <VerificationDateStyles />
      <div className="vr-established-date">
        <input
          ref={inputRef}
          id="established_date"
          name="established_date"
          type="date"
          value={value ?? ""}
          max={maximumDate}
          required
          onChange={onChange}
          onClick={openPicker}
          aria-describedby={tooRecent ? "established_date_hint established_date_error" : "established_date_hint"}
          aria-invalid={tooRecent || undefined}
        />
        <button type="button" aria-label="Open date established calendar" title="Choose date established" onClick={openPicker}>
          <CalendarDays size={20} strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>
      <small id="established_date_hint" className="vr-established-date-help">The company must have been established at least 10 days ago.</small>
      {tooRecent && <p id="established_date_error" className="vr-error" role="alert">Choose {maximumDate} or an earlier date.</p>}
    </Field>
  );
}

function IdExpiryDateField({ value, onChange }) {
  const inputRef = useRef(null);
  const minimumDate = earliestIdExpiryDate();
  const expiredOrToday = Boolean(value && value < minimumDate);

  useEffect(() => {
    inputRef.current?.setCustomValidity(
      expiredOrToday ? "The ID expiry date must be later than today." : "",
    );
  }, [expiredOrToday]);

  const openPicker = () => {
    const input = inputRef.current;
    if (!input) return;
    input.focus();
    try { input.showPicker?.(); } catch { /* Keyboard date entry remains available. */ }
  };

  return (
    <Field label="ID expiry date" name="signatory_id_expiry" required>
      <VerificationDateStyles />
      <div className="vr-established-date">
        <input
          ref={inputRef}
          id="signatory_id_expiry"
          name="signatory_id_expiry"
          type="date"
          value={value ?? ""}
          min={minimumDate}
          required
          onChange={onChange}
          onClick={openPicker}
          aria-describedby={expiredOrToday ? "signatory_id_expiry_hint signatory_id_expiry_error" : "signatory_id_expiry_hint"}
          aria-invalid={expiredOrToday || undefined}
        />
        <button type="button" aria-label="Open ID expiry date calendar" title="Choose ID expiry date" onClick={openPicker}>
          <CalendarDays size={20} strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>
      <small id="signatory_id_expiry_hint" className="vr-established-date-help">The identity document must remain valid beyond today.</small>
      {expiredOrToday && <p id="signatory_id_expiry_error" className="vr-error" role="alert">Choose {minimumDate} or a later date.</p>}
    </Field>
  );
}

function VerificationDateStyles() {
  return (
      <style>{`
        .vr-established-date { display:flex; align-items:center; gap:8px; padding:5px 6px 5px 12px; border:1px solid #cbd5e1; border-radius:11px; background:#f8fafc; transition:border-color .15s,box-shadow .15s; }
        .vr-established-date:focus-within { border-color:#3455a0; box-shadow:0 0 0 3px #3455a01a; }
        .vr-established-date input[type="date"] { box-sizing:border-box; flex:1; min-width:0; width:100%; min-height:36px; margin:0; padding:5px 0; border:0; border-radius:0; background:transparent; color:#17233b; font:inherit; box-shadow:none; }
        .vr-established-date button { display:inline-flex; flex-shrink:0; align-items:center; justify-content:center; width:42px; height:42px; border:1px solid #d8e3f6; border-radius:9px; background:#edf2fc; color:#3455a0; cursor:pointer; }
        .vr-established-date button:hover { background:#dfe9fc; }
        .vr-established-date button:focus-visible { outline:2px solid #3455a0; outline-offset:2px; }
        .vr-established-date-help { display:block; margin-top:7px; color:#64748b; font-size:11px; line-height:1.5; }
      `}</style>
  );
}

function FiscalYearEndField({ value, onChange }) {
  const inputRef = useRef(null);
  const openPicker = () => {
    const input = inputRef.current;
    if (!input) return;
    input.focus();
    try { input.showPicker?.(); } catch { /* Keyboard date entry remains available. */ }
  };

  return (
    <Field label="Fiscal year end" name="fiscal_year_end" required>
      <VerificationDateStyles />
      <div className="vr-established-date">
        <input
          ref={inputRef}
          id="fiscal_year_end"
          name="fiscal_year_end"
          type="date"
          value={value ?? ""}
          required
          onChange={onChange}
          onClick={openPicker}
          aria-describedby="fiscal_year_end_hint"
        />
        <button type="button" aria-label="Open fiscal year end calendar" title="Choose fiscal year end" onClick={openPicker}>
          <CalendarDays size={20} strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>
      <small id="fiscal_year_end_hint" className="vr-established-date-help">Choose the closing date of the company’s fiscal year.</small>
    </Field>
  );
}

function GpsLocationField({ value, onChange }) {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const coordinateInvalid = Boolean(value && !isValidGpsLocation(value));

  useEffect(() => {
    inputRef.current?.setCustomValidity(
      coordinateInvalid
        ? "Enter valid GPS coordinates as latitude, longitude. Latitude must be between -90 and 90; longitude must be between -180 and 180."
        : "",
    );
  }, [coordinateInvalid]);

  const handleManualChange = (event) => {
    setError("");
    onChange(event);
  };

  const selectLiveLocation = () => {
    if (loading) return;
    if (!navigator.geolocation) {
      setError("Live location is not supported by this browser.");
      return;
    }

    setLoading(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        onChange({
          target: {
            name: "gps_location",
            value: `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`,
            type: "location",
          },
        });
        setLoading(false);
      },
      (locationError) => {
        setError(
          locationError.code === 1
            ? "Allow location access to select the physical live location."
            : "The live location could not be determined. Move to an open area and try again.",
        );
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  };

  return (
    <Field label="GPS location" name="gps_location" required help>
      <div className="vr-established-date">
        <MapPin size={18} color="#3455a0" aria-hidden="true" />
        <input
          ref={inputRef}
          id="gps_location"
          name="gps_location"
          type="text"
          data-input-type="location"
          value={value ?? ""}
          required
          aria-busy={loading}
          aria-describedby={error || coordinateInvalid ? "gps_location_hint gps_location_error" : "gps_location_hint"}
          aria-invalid={coordinateInvalid || undefined}
          placeholder={loading ? "Selecting physical live location…" : "Latitude, longitude"}
          onChange={handleManualChange}
        />
        <button type="button" onClick={selectLiveLocation} disabled={loading} aria-label="Select physical live GPS location" title="Use current physical location">
          <LocateFixed size={20} strokeWidth={1.8} aria-hidden="true" />
        </button>
      </div>
      <small id="gps_location_hint" className="vr-established-date-help">Enter latitude and longitude manually or use the location button to select the device’s current position.</small>
      {(error || coordinateInvalid) && (
        <p id="gps_location_error" className="vr-error" role="alert">
          {error || "Enter valid coordinates, for example: 37.774900, -122.419400."}
        </p>
      )}
    </Field>
  );
}

function SelectField({
  label,
  name,
  value,
  options = [],
  required = false,
  help = false,
  onChange,
}) {
  const safeOptions = asArray(options);

  return (
    <Field label={label} name={name} required={required} help={help}>
      <select
        id={name}
        name={name}
        value={value ?? ""}
        required={required}
        onChange={onChange}
      >
        <option value="">Select…</option>
        {safeOptions.map((option) => {
          const optionValue = typeof option === "object" ? option?.id : option;
          const optionLabel = typeof option === "object" ? option?.name : option;
          if (optionValue == null || !optionLabel) return null;
          return <option key={optionValue} value={optionValue}>{optionLabel}</option>;
        })}
      </select>
    </Field>
  );
}

function DatalistField({ label, name, value, options, required = false, help = false, fullWidth = false, placeholder, loading = false, loadingText = "Loading suggestions…", onChange }) {
  const listId = `${name}-options`;
  return (
    <Field label={label} name={name} required={required} help={help} fullWidth={fullWidth}>
      <input id={name} name={name} value={value ?? ""} required={required} list={listId} placeholder={placeholder} aria-busy={loading} onChange={onChange} />

      {loading && (
        <span
          role="status"
          aria-live="polite"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            marginTop: "6px",
            color: "#15803d",
            fontSize: "12px",
            fontWeight: 700,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <circle cx="7" cy="7" r="4" fill="#22c55e">
              <animate
                attributeName="r"
                values="3;6;3;3;6;3"
                keyTimes="0;0.12;0.24;0.62;0.74;1"
                dur="1.4s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="1;.35;1;1;.35;1"
                keyTimes="0;0.12;0.24;0.62;0.74;1"
                dur="1.4s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
          {loadingText}
        </span>
      )}

      <datalist id={listId}>
        {options.map((option) => <option key={option} value={option} />)}
      </datalist>
    </Field>
  );
}

function MultiProductsDatalist({
  label,
  name,
  value = [],
  options = [],
  required = false,
  onChange,
  loading = false,
  loadingText = "Loading suggestions…",
  placeholder = "Select a product or service…",
  allowCustom = false,
  compact = false,
}) {
  const [inputValue, setInputValue] = useState("");
  const datalistId = `${name}-datalist`;
  const safeValue = String(value ?? "").split("\n").map(item => item.trim()).filter(Boolean);
  const useCompactSelectionButtons = true;
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current?.setCustomValidity(required && safeValue.length === 0 ? "Select at least one product or service from the suggestions." : "");
  }, [required, safeValue.length]);
  const safeOptions = asArray(options);

  const countryNames = safeOptions
    .map((option) => (typeof option === "object" ? option?.name : option))
    .filter((countryName) => typeof countryName === "string" && countryName.trim())
    .map((countryName) => countryName.trim());

  const emitChange = (nextCountries) => {
    onChange({
      target: {
        name,
        value: nextCountries.join("\n"),
        type: "text",
      },
    });
  };

  const addCountry = (rawValue) => {
    const typedName = typeof rawValue === "string" ? rawValue.trim() : "";
    if (!typedName) return;

    const matchedName = countryNames.find(
      (countryName) => countryName.toLowerCase() === typedName.toLowerCase(),
    ) || (allowCustom ? typedName : "");

    // Only accept entries from the current product suggestions.
    if (!matchedName) return;

    const alreadySelected = safeValue.some(
      (countryName) => countryName.toLowerCase() === matchedName.toLowerCase(),
    );

    if (!alreadySelected) {
      emitChange([...safeValue, matchedName]);
    }

    setInputValue("");
  };

  const removeCountry = (countryToRemove) => {
    emitChange(
      safeValue.filter((countryName) => countryName !== countryToRemove),
    );
  };

  const handleInputChange = (event) => {
    const nextValue = event.target.value;
    setInputValue(nextValue);

    const exactMatch = countryNames.find(
      (countryName) => countryName.toLowerCase() === nextValue.trim().toLowerCase(),
    );

    if (exactMatch) {
      addCountry(exactMatch);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addCountry(inputValue);
    }
  };

  return (
    <div className="vr-field">
      <FieldLabel label={label} name={name} required={required} />

      <input type="hidden" name={name} value={value ?? ""} />
      <input
        ref={inputRef}
        id={name}
        name={`${name}_search`}
        type="text"
        list={datalistId}
        value={inputValue}
        required={required && safeValue.length === 0}
        placeholder={placeholder}
        disabled={loading}
        aria-busy={loading}
        autoComplete="off"
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={() => addCountry(inputValue)}
      />

      {loading && (
        <>
          <style>{`
            .vr-product-thinking { display:flex; align-items:center; gap:9px; margin:9px 0 0; color:#15803d; font-size:12px; font-weight:650; line-height:1.6; }
            .vr-product-thinking-dot { flex-shrink:0; width:8px; height:8px; border-radius:50%; background:#22c55e; animation:vrProductThinking 1.4s ease-in-out infinite; }
            @keyframes vrProductThinking {
              0%,100% { opacity:.6; transform:scale(.85); box-shadow:0 0 0 0 #22c55e33; }
              50% { opacity:1; transform:scale(1.15); box-shadow:0 0 0 5px #22c55e00; }
            }
            @media(prefers-reduced-motion:reduce) { .vr-product-thinking-dot { animation:none; } }
          `}</style>
          <p className="vr-product-thinking" role="status" aria-live="polite">
            <span className="vr-product-thinking-dot" aria-hidden="true" />
            {loadingText}
          </p>
        </>
      )}
      <datalist id={datalistId}>
        {countryNames.map((countryName) => (
          <option key={countryName} value={countryName}>
            {countryName}
          </option>
        ))}
      </datalist>

      {safeValue.length > 0 && useCompactSelectionButtons && (
        <>
          <style>{`
            .vr-selected-models { display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 150px), 1fr)); align-items:stretch; gap:7px; width:100%; margin:7px 0 0; padding:0; }
            .vr-selected-model { position:relative; display:flex; align-items:center; width:100%; min-width:0; min-height:34px; margin:0; padding:7px 28px 7px 11px; border:1px solid #bbf7d0; border-radius:8px; background:#f0fdf4; color:#166534; font:inherit; font-size:12px; font-weight:700; line-height:1.25; text-align:left; cursor:pointer; box-shadow:0 1px 2px rgba(15,23,42,.05); }
            .vr-selected-model span { min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
            .vr-selected-models.is-small { grid-template-columns:repeat(auto-fit, minmax(min(100%, 110px), 1fr)); gap:5px; }
            .vr-selected-models.is-small .vr-selected-model { min-height:28px; padding:5px 24px 5px 9px; border-radius:7px; font-size:11px; }
            .vr-selected-models.is-small .vr-selected-model svg { top:3px; right:3px; width:12px; height:12px; }
            .vr-selected-model:hover { border-color:#86efac; background:#dcfce7; }
            .vr-selected-model:focus-visible { outline:2px solid #22c55e; outline-offset:2px; }
            .vr-selected-model svg { position:absolute; top:4px; right:4px; color:#15803d; }
            .vr-business-profile > .vr-row { display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); align-items:start; gap:16px; }
            .vr-business-profile > .vr-row > .vr-field { box-sizing:border-box; width:100%; min-width:0; }
            .vr-business-profile > .vr-row > .vr-field > input,
            .vr-business-profile > .vr-row > .vr-field > select { box-sizing:border-box; width:100%; }
            @media(max-width:760px) { .vr-business-profile > .vr-row { grid-template-columns:1fr; gap:12px; } }
            @media(max-width:640px) { .vr-selected-models { grid-template-columns:repeat(2, minmax(0, 1fr)); gap:6px; } .vr-selected-model { font-size:11px; } }
            @media(max-width:420px) { .vr-selected-models { grid-template-columns:1fr; } }
          `}</style>
          <div className={`vr-selected-models${compact ? " is-small" : ""}`} aria-label={`Selected ${label}`}>
            {safeValue.map((selectedOption) => (
              <button
                key={selectedOption}
                className="vr-selected-model"
                type="button"
                title={`Remove ${selectedOption}`}
                aria-label={`Remove ${selectedOption}`}
                onClick={() => removeCountry(selectedOption)}
              >
                <span>{selectedOption}</span>
                <XCircle size={14} aria-hidden="true" />
              </button>
            ))}
          </div>
        </>
      )}

      {safeValue.length > 0 && !useCompactSelectionButtons && (
        <ul className="vr-fileList">
          {safeValue.map((countryName) => (
            <li key={countryName}>
              <span className="vr-fileMeta">
                <strong>{countryName}</strong>
              </span>

              <button
                className="vr-fileRemove"
                type="button"
                aria-label={`Remove ${countryName}`}
                onClick={() => removeCountry(countryName)}
              >
                <XCircle size={16} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function MultiCountryDatalist({
  label,
  name,
  value = [],
  options = [],
  required = false,
  onChange,
}) {
  const [inputValue, setInputValue] = useState("");
  const datalistId = `${name}-datalist`;
  const safeValue = sanitizeOperatingCountries(value);
  const safeOptions = asArray(options);

  const countryNames = safeOptions
    .map((option) => (typeof option === "object" ? option?.name : option))
    .filter((countryName) => typeof countryName === "string" && countryName.trim())
    .map((countryName) => countryName.trim());

  const emitChange = (nextCountries) => {
    onChange({
      target: {
        name,
        value: nextCountries,
        type: "multiselect",
      },
    });
  };

  const addCountry = (rawValue) => {
    const typedName = typeof rawValue === "string" ? rawValue.trim() : "";
    if (!typedName) return;

    const matchedName = countryNames.find(
      (countryName) => countryName.toLowerCase() === typedName.toLowerCase(),
    );

    // Only accept country names supplied by countries_all.
    if (!matchedName) return;

    const alreadySelected = safeValue.some(
      (countryName) => countryName.toLowerCase() === matchedName.toLowerCase(),
    );

    if (!alreadySelected) {
      emitChange([...safeValue, matchedName]);
    }

    setInputValue("");
  };

  const removeCountry = (countryToRemove) => {
    emitChange(
      safeValue.filter((countryName) => countryName !== countryToRemove),
    );
  };

  const handleInputChange = (event) => {
    const nextValue = event.target.value;
    setInputValue(nextValue);

    const exactMatch = countryNames.find(
      (countryName) => countryName.toLowerCase() === nextValue.trim().toLowerCase(),
    );

    if (exactMatch) {
      addCountry(exactMatch);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addCountry(inputValue);
    }
  };

  return (
    <div className="vr-field">
      <FieldLabel label={label} name={name} required={required} />

      <input
        id={name}
        name={`${name}_search`}
        type="text"
        list={datalistId}
        value={inputValue}
        required={required && safeValue.length === 0}
        placeholder="Start typing a country name..."
        autoComplete="off"
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={() => addCountry(inputValue)}
      />

      <datalist id={datalistId}>
        {countryNames.map((countryName) => (
          <option key={countryName} value={countryName}>
            {countryName}
          </option>
        ))}
      </datalist>

      {safeValue.length > 0 && (
        <div className="vr-selected-models" aria-label="Selected countries of operation">
          {safeValue.map((countryName) => (
            <button
              key={countryName}
              className="vr-selected-model"
              type="button"
              title={`Remove ${countryName}`}
              aria-label={`Remove ${countryName}`}
              onClick={() => removeCountry(countryName)}
            >
              <span>{countryName}</span>
              <XCircle size={14} aria-hidden="true" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function VerificationDocumentSlot({ slotKey, label, example, documents = [], onSelect, onRemove, onReview }) {
  const inputId = `verification-document-${slotKey}`;
  const allPassed = documents.length > 0 && documents.every((document) => document.reviewStatus === "passed");

  return (
    <div style={{ minWidth: 0, padding: "14px", border: `1px solid ${allPassed ? "#86efac" : "#cbd5e1"}`, borderRadius: "14px", background: allPassed ? "#f0fdf4" : "#fff", transition: "all 180ms ease" }}>
      <style>{`
        @keyframes rrHeartbeat {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(248, 113, 113, 0); }
          14% { transform: scale(1.12); box-shadow: 0 0 0 5px rgba(248, 113, 113, .22); }
          28% { transform: scale(1); box-shadow: 0 0 0 8px rgba(250, 204, 21, .14); }
          42% { transform: scale(1.08); box-shadow: 0 0 0 4px rgba(250, 204, 21, .22); }
          70% { transform: scale(1); box-shadow: 0 0 0 0 rgba(248, 113, 113, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .vr-rrNeedsReview { animation: none !important; }
        }
      `}</style>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px" }}>
        <div style={{ minWidth: 0 }}>
          <strong style={{ display: "block", color: "#0f2747", fontSize: "14px" }}>{label} (required)</strong>
          <span style={{ display: "block", marginTop: "4px", color: "#64748b", fontSize: "11px", lineHeight: 1.45 }}>{example}</span>
        </div>
        {allPassed && <CheckCircle2 size={20} color="#16a34a" aria-label="All files reviewed" />}
      </div>

      {documents.length > 0 && (
        <ul style={{ display: "grid", gap: "7px", margin: "11px 0 0", padding: 0, listStyle: "none" }}>
          {documents.map((document) => {
            const tone = document.reviewStatus === "passed" ? "#166534" : document.reviewStatus === "failed" ? "#b91c1c" : "#475569";
            const reviewPassed = document.reviewStatus === "passed";
            const needsReview = document.reviewStatus === "unreviewed" || document.reviewStatus === "idle";
            return (
              <li key={document.id} style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto auto", alignItems: "center", gap: "7px", padding: "8px 9px", border: "1px solid #e2e8f0", borderRadius: "9px", background: "#f8fafc", fontSize: "11px" }}>
                <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: tone }} title={document.file.name}>
                  {document.file.name}
                </span>
                <button
                  type="button"
                  className={needsReview ? "vr-rrNeedsReview" : undefined}
                  title={reviewPassed ? "Raymoch Clarity Review passed" : "Raymoch Clarity Review"}
                  aria-label={`${reviewPassed ? "Raymoch Clarity Review passed for" : "Raymoch Clarity Review"} ${document.file.name}`}
                  onClick={() => onReview(document)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "5px",
                    minWidth: "62px",
                    minHeight: "30px",
                    padding: "5px 9px",
                    border: "1px solid #1d4ed8",
                    borderRadius: "7px",
                    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                    color: "#ffffff",
                    boxShadow: "0 3px 9px rgba(37, 99, 235, .24)",
                    fontSize: "10px",
                    fontWeight: 900,
                    cursor: "pointer",
                    animation: needsReview ? "rrHeartbeat 1.35s ease-in-out infinite" : undefined,
                    transformOrigin: "center",
                  }}
                >
                  {reviewPassed ? (
                    <><CheckCircle2 size={14} strokeWidth={3} aria-hidden="true" /> Verified</>
                  ) : (
                    <><SearchCheck size={14} strokeWidth={2.5} aria-hidden="true" /> Verify</>
                  )}
                </button>
                <button type="button" onClick={() => onRemove(document.id)} aria-label={`Delete ${document.file.name}`} title="Delete and upload again" style={{ border: 0, background: "transparent", color: "#b91c1c", cursor: "pointer", fontSize: "16px", fontWeight: 800 }}>×</button>
              </li>
            );
          })}
        </ul>
      )}

      <label htmlFor={inputId} style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginTop: "11px", padding: "7px 10px", borderRadius: "8px", background: "#eff6ff", color: "#1d4ed8", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>
        <UploadCloud size={15} /> {documents.length ? "Add more files" : "Upload files"}
        <input id={inputId} name={`document_${slotKey}`} type="file" accept={REVIEWABLE_DOCUMENT_FILES} multiple onChange={onSelect} style={{ display: "none" }} />
      </label>
    </div>
  );
}

function TextareaField({
  label,
  name,
  value,
  required = false,
  placeholder,
  rows = 4,
  minLength,
  busy = false,
  reviewStatus = "idle",
  suggestion = "",
  showCharacterCount = false,
  onAcceptSuggestion,
  onChange,
}) {
  const characterCount = String(value ?? "").trim().length;

  return (
    <Field label={label} name={name} required={required}>
      <div style={{ position: "relative" }}>
        <textarea
          id={name}
          name={name}
          value={value ?? ""}
          required={required}
          minLength={minLength}
          placeholder={placeholder}
          rows={rows}
          aria-busy={busy}
          style={busy || suggestion ? { paddingRight: "112px" } : undefined}
          onChange={onChange}
        />

        {suggestion && (
          <button
            type="button"
            onClick={onAcceptSuggestion}
            title="Accept Clarity Assistant spelling and wording corrections"
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              zIndex: 1,
              border: "1px solid #16a34a",
              borderRadius: "6px",
              background: "#f0fdf4",
              color: "#166534",
              padding: "4px 8px",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Accept
          </button>
        )}

        {(busy || reviewStatus === "passed" || reviewStatus === "failed") && (
          <span
            role="status"
            aria-label={
              busy
                ? "Clarity Assistant is reviewing the business description"
                : reviewStatus === "passed"
                  ? "Business description passed review"
                  : "Business description failed review"
            }
            title={
              busy
                ? "Clarity Assistant is reviewing…"
                : reviewStatus === "passed"
                  ? "Review passed"
                  : "Review failed"
            }
            style={{
              position: "absolute",
              top: suggestion ? "42px" : "10px",
              right: "10px",
              display: "grid",
              placeItems: "center",
              gap: "5px",
              color: "#2563eb",
              pointerEvents: "none",
            }}
          >
            {busy && (
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.2" />
                <path d="M12 3a9 9 0 0 1 9 9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                  <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite" />
                </path>
              </svg>
            )}
            {reviewStatus === "passed" && <CheckCircle2 size={21} color="#16a34a" />}
            {reviewStatus === "failed" && <XCircle size={21} color="#dc2626" />}
          </span>
        )}

        {showCharacterCount && (
          <div
            aria-live="polite"
            style={{
              marginTop: "6px",
              textAlign: "right",
              fontSize: "12px",
              fontWeight: 600,
              color:
                minLength && characterCount < minLength
                  ? "#b45309"
                  : "#15803d",
            }}
          >
            {characterCount.toLocaleString()}
            {minLength ? ` / ${minLength.toLocaleString()}` : ""} characters
          </div>
        )}
      </div>
    </Field>
  );
}

function BusinessDescriptionEditor({ value, required = false, minLength, busy = false, generating = false, reviewStatus = "idle", suggestion = "", onAcceptSuggestion, onChange }) {
  const editorRef = useRef(null);
  const characterCount = String(value ?? "").trim().length;

  useEffect(() => {
    const editor = editorRef.current;
    const nextText = String(value ?? "");
    if (!editor || editor.innerText.replace(/\r/g, "").trim() === nextText.replace(/\r/g, "").trim()) return;

    editor.replaceChildren();
    const paragraphs = nextText.split(/\n{2,}/).filter(Boolean);
    (paragraphs.length ? paragraphs : [""]).forEach((paragraphText) => {
      const paragraph = document.createElement("p");
      paragraph.textContent = paragraphText.trim();
      editor.appendChild(paragraph);
    });
  }, [value]);

  const emitValue = () => onChange({
    target: {
      name: "business_description",
      value: editorRef.current?.innerText.replace(/\u00a0/g, " ").trim() || "",
      type: "text",
    },
  });

  const format = (command, commandValue = null) => {
    editorRef.current?.focus();
    document.execCommand(command, false, commandValue);
    emitValue();
  };

  const toolButton = (label, command, title) => (
    <button
      type="button"
      aria-label={title}
      title={title}
      onMouseDown={(event) => {
        event.preventDefault();
        format(command);
      }}
      style={{ width: "30px", height: "28px", border: "1px solid #dbe3ef", borderRadius: "5px", background: "#fff", color: "#334155", cursor: "pointer", fontWeight: 700 }}
    >
      {label}
    </button>
  );

  return (
    <Field label="Business description" name="business_description" required={required} fullWidth>
      <div style={{ position: "relative" }}>
        <style>{`@keyframes raymochAiSpin{to{transform:rotate(360deg)}}`}</style>
        <textarea
          id="business_description"
          name="business_description"
          value={value ?? ""}
          required={required}
          minLength={minLength}
          onChange={() => {}}
          tabIndex={-1}
          aria-hidden="true"
          style={{ position: "absolute", width: "1px", height: "1px", opacity: 0, pointerEvents: "none" }}
        />

        <div role="toolbar" aria-label="Business description formatting" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "5px", padding: "8px", border: "1px solid #dbe3ef", borderBottom: 0, borderRadius: "8px 8px 0 0", background: "#f8fafc" }}>
          <select aria-label="Font family" defaultValue="Arial" onChange={(event) => format("fontName", event.target.value)} style={{ height: "28px", fontSize: "12px" }}>
            <option value="Arial">Arial</option>
            <option value="Georgia">Georgia</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Calibri">Calibri</option>
          </select>
          <select aria-label="Font size" defaultValue="3" onChange={(event) => format("fontSize", event.target.value)} style={{ height: "28px", fontSize: "12px" }}>
            <option value="2">Small</option>
            <option value="3">Normal</option>
            <option value="4">Large</option>
          </select>
          {toolButton("B", "bold", "Bold")}
          {toolButton("I", "italic", "Italic")}
          {toolButton("U", "underline", "Underline")}
          {toolButton("•", "insertUnorderedList", "Bulleted list")}
          {toolButton("1.", "insertOrderedList", "Numbered list")}
          {toolButton("⇤", "justifyLeft", "Align left")}
          {toolButton("↔", "justifyCenter", "Align center")}
          {toolButton("☰", "justifyFull", "Justify")}
        </div>

        <div
          ref={editorRef}
          id="business_description-editor"
          contentEditable={!generating}
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          aria-required={required}
          aria-busy={busy || generating}
          onInput={emitValue}
          onBlur={emitValue}
          onPaste={(event) => {
            event.preventDefault();
            document.execCommand("insertText", false, event.clipboardData.getData("text/plain"));
            emitValue();
          }}
          style={{ boxSizing: "border-box", width: "100%", minHeight: "420px", padding: "48px 54px", overflowWrap: "anywhere", border: "1px solid #dbe3ef", borderRadius: "0 0 8px 8px", outline: "none", background: "#fff", boxShadow: "0 8px 24px rgba(15, 23, 42, .08)", color: "#172033", fontFamily: "Arial, sans-serif", fontSize: "14px", lineHeight: 1.75, textAlign: "justify", filter: generating ? "blur(5px)" : "none", opacity: generating ? 0.55 : 1, pointerEvents: generating ? "none" : "auto", transition: "filter 180ms ease, opacity 180ms ease" }}
        />

        {generating && (
          <div
            role="status"
            aria-live="polite"
            style={{ position: "absolute", top: "45px", right: 0, bottom: 0, left: 0, zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", borderRadius: "0 0 8px 8px", background: "rgba(248, 250, 252, 0.38)", color: "#1d4ed8", cursor: "progress" }}
          >
            <RefreshCw size={46} strokeWidth={2.2} aria-hidden="true" style={{ animation: "raymochAiSpin 0.9s linear infinite" }} />
            <strong>Raymoch AI is thinking…</strong>
            <span style={{ color: "#475569", fontSize: "12px" }}>Gathering information and creating your professional description.</span>
          </div>
        )}

        {suggestion && !generating && (
          <button type="button" onClick={onAcceptSuggestion} style={{ position: "absolute", top: "52px", right: "12px", border: "1px solid #16a34a", borderRadius: "6px", background: "#f0fdf4", color: "#166534", padding: "5px 9px", fontWeight: 700, cursor: "pointer" }}>
            Accept correction
          </button>
        )}

        {(busy || reviewStatus !== "idle") && (
          <span role="status" aria-live="polite" style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginTop: "7px", color: reviewStatus === "failed" ? "#dc2626" : "#15803d", fontSize: "12px", fontWeight: 700 }}>
            {busy ? "Clarity Assistant is reviewing…" : reviewStatus === "passed" ? "Review passed" : "Review requires changes"}
          </span>
        )}

        <div aria-live="polite" style={{ marginTop: "6px", textAlign: "right", fontSize: "12px", fontWeight: 600, color: minLength && characterCount < minLength ? "#b45309" : "#15803d" }}>
          {characterCount.toLocaleString()}{minLength ? ` / ${minLength.toLocaleString()}` : ""} characters
        </div>
      </div>
    </Field>
  );
}

function selectedOptionName(options, selectedId) {
  return (
    asArray(options).find(
      (option) => String(option?.id) === String(selectedId),
    )?.name ||
    "Not provided"
  );
}

function Section({ icon, title, children, className = "" }) {
  return (
    <section className={`vr-innerCard vr-stepSection ${className}`.trim()}>
      <div className="vr-sectionHeading">
        <span className="vr-smallIcon">{icon}</span>
        <h3>{title}</h3>
      </div>

      {children}
    </section>
  );
}

function ReviewAccordion({ stepNumber, title, rows, defaultOpen = false, onEdit }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <details open={open} onToggle={(event) => setOpen(event.currentTarget.open)} style={{ border: "1px solid #dbe3ef", borderRadius: "14px", background: "#fff", overflow: "hidden", boxShadow: "0 4px 14px rgba(15, 23, 42, .05)" }}>
      <summary style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px 16px", background: "linear-gradient(135deg, #f8fafc, #eff6ff)", color: "#0f2747", cursor: "pointer", listStyle: "none", fontWeight: 800 }}>
        <span style={{ display: "grid", placeItems: "center", width: "28px", height: "28px", borderRadius: "9px", background: "#2563eb", color: "#fff", fontSize: "12px" }}>{stepNumber}</span>
        <span style={{ flex: 1 }}>{title}</span>
        <ChevronDown size={17} aria-hidden="true" />
      </summary>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1px", padding: "1px", background: "#e2e8f0" }}>
        {rows.map(([label, value]) => (
          <div key={label} style={{ minWidth: 0, padding: "12px 14px", background: "#fff" }}>
            <span style={{ display: "block", color: "#64748b", fontSize: "10px", fontWeight: 800, letterSpacing: ".04em", textTransform: "uppercase" }}>{label}</span>
            <strong style={{ display: "block", marginTop: "4px", overflowWrap: "anywhere", whiteSpace: "pre-wrap", color: "#1e293b", fontSize: "12px", lineHeight: 1.5 }}>{value || "Not provided"}</strong>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "10px 12px", borderTop: "1px solid #e2e8f0", background: "#f8fafc" }}>
        <button
          type="button"
          className="vr-btn"
          onClick={onEdit}
          aria-label={`Edit ${title}`}
          style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px", minHeight: "32px", padding: "6px 11px", border: "1px solid #2563eb", borderRadius: "8px", background: "#2563eb", color: "#fff", fontSize: "12px", fontWeight: 750, cursor: "pointer" }}
        >
          <Pencil size={14} aria-hidden="true" />
          Edit
        </button>
      </div>
    </details>
  );
}

function ReviewChecklist({
  step,
  assistantMessages,
  assistantOpen,
  assistantQuestion,
  onAssistantQuestionChange,
  onAssistantSubmit,
  onAssistantToggle,
  assistantLoading,
  assistantMessagesRef,
  assistantPanelRef,
}) {
  const [assistantExpanded, setAssistantExpanded] = useState(false);

  useEffect(() => {
    if (!assistantOpen) setAssistantExpanded(false);
  }, [assistantOpen]);

  useEffect(() => {
    if (!assistantExpanded) return undefined;
    const handleEscape = (event) => {
      if (event.key === "Escape") setAssistantExpanded(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [assistantExpanded]);

  const stepGuidance = {
    1: {
      items: [
        "Select the company profile you intend to verify.",
        "Confirm that the displayed company belongs to the signed-in account.",
        "Review the current verification status before continuing.",
        "Use Add New Company only when the required company is not listed.",
      ],
      privacy: "Only open company records that you are authorized to view or manage.",
    },
    2: {
      items: [
        "Complete every required legal identity field.",
        "Enter the legal name exactly as it appears on official registration records.",
        "Confirm the registration, tax and external identification numbers.",
        "Verify the registered address and date established before continuing.",
      ],
      privacy: "Legal identifiers and registered-address information must be protected with appropriate access controls.",
    },
    3: {
      items: [
        "Select all applicable business models, products and operating countries.",
        "Use the most recent employee, revenue and fiscal-year information available.",
        "Add every applicable public exchange or ticker symbol.",
        "Ensure the business description accurately explains operations and revenue sources.",
      ],
      privacy: "Commercial and financial information should only be shared with authorized verification personnel.",
    },
    4: {
      items: [
        "Select the relationship type and enter the applicable ownership percentage.",
        "Add each required leadership-board member with the correct title.",
        "Verify the authorized signatory’s identity and authority.",
        "Confirm whether the company is the ultimate parent or operates as a holding company.",
      ],
      privacy: "Ownership and identity information must be handled as confidential verification data.",
    },
    5: {
      items: [
        "Upload every document marked as required.",
        "Use clear, complete and readable files.",
        "Confirm that identity documents are current and unexpired.",
        "Resolve any document-review questions before continuing.",
      ],
      privacy: "Uploaded documents must be encrypted during transmission and storage.",
    },
    6: {
      items: [
        "Confirm the primary contact’s name, email address and telephone number.",
        "Review the information entered in every previous step.",
        "Read and accept each required declaration.",
        "Submit only after confirming that the information is complete and accurate.",
      ],
      privacy: "Submit the application only from a trusted device and secure connection.",
    },
  };
  const currentGuidance = stepGuidance[step] || stepGuidance[1];

  return (
    <aside className="vr-card vr-sticky vr-reviewChecklist">
      <div className="vr-sectionHeading">
        <span className="vr-smallIcon">
          <Lightbulb size={20} />
        </span>

        <h3>Verification Guidance</h3>
      </div>

      <ul className="vr-infoList">
        {currentGuidance.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <hr className="vr-hr" />

      <h3>Current step</h3>

      <p className="small">
        Step {step} of 6: {stepMeta[step].title}
      </p>

      <hr className="vr-hr" />

      <h3>Privacy reminder</h3>

      <p className="small">
        {currentGuidance.privacy}
      </p>

      <style>{`
        .vr-reviewChecklist .vr-assistant { position:relative; box-sizing:border-box; width:100%; max-width:100%; }
        .vr-reviewChecklist .vr-assistantHeader { box-sizing:border-box; width:100%; padding-right:48px; }
        .vr-assistantResize { position:absolute; z-index:4; top:8px; right:8px; display:grid; place-items:center; width:30px; height:30px; padding:0; border:1px solid #cbd5e1; border-radius:8px; background:#fff; color:#3455a0; cursor:pointer; box-shadow:0 2px 7px rgba(15,23,42,.1); }
        .vr-assistantResize:hover { background:#eff6ff; border-color:#93c5fd; }
        .vr-assistantResize:focus-visible { outline:2px solid #2563eb; outline-offset:2px; }
        .vr-assistantBackdrop { position:fixed; z-index:9998; inset:0; width:100%; height:100%; margin:0; padding:0; border:0; background:rgba(15,23,42,.48); backdrop-filter:blur(2px); cursor:default; }
        .vr-reviewChecklist .vr-assistant.is-expanded { position:fixed; z-index:9999; top:50%; left:50%; display:flex; flex-direction:column; width:min(720px, calc(100vw - 32px)); max-width:calc(100vw - 32px); height:min(78dvh, 720px); max-height:calc(100dvh - 32px); transform:translate(-50%, -50%); overflow:hidden; border-radius:16px; background:#fff; box-shadow:0 28px 80px rgba(15,23,42,.35); }
        .vr-reviewChecklist .vr-assistant.is-expanded .vr-assistantHeader { flex:0 0 auto; }
        .vr-reviewChecklist .vr-assistant.is-expanded .vr-assistantBody { display:flex; flex:1 1 auto; min-height:0; flex-direction:column; }
        .vr-reviewChecklist .vr-assistant.is-expanded .vr-assistantMessages { flex:1 1 auto; min-height:0; max-height:none; overflow-y:auto; }
        .vr-reviewChecklist .vr-assistant.is-expanded .vr-assistantComposer { flex:0 0 auto; }
        @media(max-width:640px) {
          .vr-reviewChecklist .vr-assistant.is-expanded { width:calc(100vw - 16px); max-width:calc(100vw - 16px); height:calc(100dvh - 16px); max-height:calc(100dvh - 16px); border-radius:12px; }
        }
      `}</style>

      {assistantExpanded && (
        <button type="button" className="vr-assistantBackdrop" aria-label="Minimize Clarity Assistant" onClick={() => setAssistantExpanded(false)} />
      )}

      <div
        ref={assistantPanelRef}
        tabIndex="-1"
        className={`vr-assistant ${assistantOpen ? "is-open" : ""} ${assistantExpanded ? "is-expanded" : ""}`}
        role={assistantExpanded ? "dialog" : undefined}
        aria-modal={assistantExpanded || undefined}
        aria-label={assistantExpanded ? "Clarity Assistant" : undefined}
      >
        {assistantOpen && (
          <button
            type="button"
            className="vr-assistantResize"
            aria-label={assistantExpanded ? "Minimize Clarity Assistant" : "Expand Clarity Assistant"}
            title={assistantExpanded ? "Return assistant to the guidance panel" : "Open assistant in the center of the screen"}
            onClick={() => setAssistantExpanded((current) => !current)}
          >
            {assistantExpanded ? <Minimize2 size={15} aria-hidden="true" /> : <Maximize2 size={15} aria-hidden="true" />}
          </button>
        )}

        <button
          type="button"
          className="vr-assistantHeader"
          onClick={onAssistantToggle}
          aria-expanded={assistantOpen}
          aria-controls="verification-assistant-chat"
        >
          <span className="vr-assistantAvatar">
            <MessageCircle size={18} />
          </span>

          <span>
            <strong>Clarity Assistant</strong>
            <small>Validation and form guidance</small>
          </span>

          <span className="vr-assistantStatus">Online</span>
        </button>

        {assistantOpen && (
          <div id="verification-assistant-chat" className="vr-assistantBody">
            <div
              ref={assistantMessagesRef}
              className="vr-assistantMessages"
              aria-live="polite"
            >
              {assistantMessages.map((message) => (
                <div
                  key={message.id}
                  className={`vr-chatMessage is-${message.sender} ${
                    message.tone ? `is-${message.tone}` : ""
                  }`}
                >
                  {message.text}
                </div>
              ))}
            </div>

            <form className="vr-assistantComposer" onSubmit={onAssistantSubmit}>
              <label className="vr-assistantSrOnly" htmlFor="assistant-question">
                Ask about the verification form
              </label>

              <textarea
                id="assistant-question"
                value={assistantQuestion}
                rows="2"
                placeholder="Ask what a term means…"
                onChange={onAssistantQuestionChange}
                disabled={assistantLoading}
              />

              <button
                type="submit"
                aria-label="Send question"
                disabled={assistantLoading}
              >
                <Send size={17} />
              </button>
            </form>

            {assistantLoading && (
              <p className="vr-assistantThinking" role="status">
                Clarity Assistant is thinking…
              </p>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}

const SUBMISSION_STEPS = [
  { step: 2, label: "Create company identity and location" },
  { step: 3, label: "Save company financials" },
  { step: 4, label: "Save leadership board" },
  { step: 5, label: "Store verification documents" },
  { step: 6, label: "Save contact and company profile; commit transaction" },
];

const initialSubmissionStages = () =>
  SUBMISSION_STEPS.map((item) => ({ ...item, status: "waiting" }));

function SubmissionProgressModal({ open, stages, complete, error, onClose, onConfirm, previewMode = false }) {
  if (!open) return null;

  return (
    <div className="vr-saveOverlay" role="dialog" aria-modal="true" aria-labelledby="vr-save-title">
      <style>{`
        @keyframes vrSaveSpin { to { transform: rotate(360deg); } }
        @keyframes vrSavePulse { 0%,100% { opacity:.52; transform:scale(.96) } 50% { opacity:1; transform:scale(1) } }
        @keyframes vrSnakeFillForward { from { background-size:0% 100% } to { background-size:100% 100% } }
        @keyframes vrSnakeFillBackward { from { background-size:0% 100% } to { background-size:100% 100% } }
        @keyframes vrSnakeForward { from { left:10px; opacity:.45 } to { left:calc(100% - 18px); opacity:1 } }
        @keyframes vrSnakeBackward { from { right:10px; opacity:.45 } to { right:calc(100% - 18px); opacity:1 } }
        .vr-saveOverlay{position:fixed;inset:0;z-index:3000;display:grid;place-items:center;padding:18px;background:rgba(8,22,45,.58);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}
        .vr-saveModal{width:min(620px,100%);max-height:calc(100vh - 36px);overflow:auto;border:1px solid rgba(255,255,255,.76);border-radius:24px;background:#fff;box-shadow:0 30px 90px rgba(8,22,45,.34)}
        .vr-saveHead{padding:25px 27px 18px;background:linear-gradient(135deg,#eef6ff,#f8fafc);border-bottom:1px solid #dbe7f3}
        .vr-saveHeadLine{display:flex;align-items:center;gap:12px}.vr-saveHead h2{margin:0;color:#102a4c;font-size:22px}.vr-saveHead p{margin:8px 0 0;color:#607087;line-height:1.55}
        .vr-saveSpinner{width:28px;height:28px;flex:0 0 auto;border:3px solid #bfdbfe;border-top-color:#2563eb;border-radius:50%;animation:vrSaveSpin .8s linear infinite}
        .vr-saveBody{padding:22px 27px 26px}.vr-saveSteps{display:grid;gap:10px;margin:0;padding:0;list-style:none}
        .vr-saveStep{position:relative;width:88%;display:flex;align-items:center;gap:13px;padding:11px 14px;border:1px solid #e2e8f0;border-radius:15px;background:#f8fafc;transition:.25s ease}
        .vr-saveStep:nth-child(even){margin-left:12%}.vr-saveStep.is-active{border-color:#93c5fd;background:#eff6ff}.vr-saveStep.is-saved{border-color:#86efac;background:#f0fdf4}.vr-saveStep.is-failed{border-color:#fca5a5;background:#fef2f2}
        .vr-saveStep:not(:last-child)::after{content:"";position:absolute;top:100%;width:12%;height:11px;border-bottom:3px solid #cbd5e1;opacity:.9}.vr-saveStep:nth-child(odd):not(:last-child)::after{left:100%;border-right:3px solid #cbd5e1;border-radius:0 0 10px 0}.vr-saveStep:nth-child(even):not(:last-child)::after{right:100%;border-left:3px solid #cbd5e1;border-radius:0 0 0 10px}.vr-saveStep.is-saved:not(:last-child)::after{border-color:#22c55e}
        .vr-saveStep.is-reading,.vr-saveStep.is-validated{border-color:#60a5fa;background-color:#f8fafc;background-repeat:no-repeat;box-shadow:0 7px 20px rgba(37,99,235,.13)}
        .vr-saveStep:nth-child(odd).is-reading,.vr-saveStep:nth-child(odd).is-validated{background-image:linear-gradient(90deg,#dbeafe 0%,#eff6ff 72%,#bfdbfe 100%);background-position:left center;animation:vrSnakeFillForward 1.8s ease-out both}
        .vr-saveStep:nth-child(even).is-reading,.vr-saveStep:nth-child(even).is-validated{background-image:linear-gradient(270deg,#dbeafe 0%,#eff6ff 72%,#bfdbfe 100%);background-position:right center;animation:vrSnakeFillBackward 1.8s ease-out both}
        .vr-saveStep.is-validated{border-color:#818cf8}
        .vr-saveStep.is-reading::before,.vr-saveStep.is-validated::before{content:"";position:absolute;z-index:2;top:-5px;width:10px;height:10px;border:3px solid #fff;border-radius:50%;background:#2563eb;box-shadow:0 0 0 4px rgba(37,99,235,.18)}
        .vr-saveStep:nth-child(odd).is-reading::before,.vr-saveStep:nth-child(odd).is-validated::before{animation:vrSnakeForward 1.8s ease-out both}.vr-saveStep:nth-child(even).is-reading::before,.vr-saveStep:nth-child(even).is-validated::before{animation:vrSnakeBackward 1.8s ease-out both}
        .vr-saveRing{position:relative;width:40px;height:40px;flex:0 0 auto}.vr-saveRing svg{width:40px;height:40px;transform:rotate(-90deg)}.vr-saveRing circle{fill:none;stroke-width:4}.vr-saveRing .track{stroke:#dbe5f0}.vr-saveRing .value{stroke:#2563eb;stroke-linecap:round;stroke-dasharray:100;stroke-dashoffset:28;animation:vrSaveSpin 1.15s linear infinite;transform-origin:center}.vr-saveStep.is-saved .value{stroke:#16a34a;stroke-dashoffset:0;animation:none}.vr-saveStep.is-failed .value{stroke:#dc2626;stroke-dashoffset:0;animation:none}
        .vr-saveIcon{position:absolute;inset:0;display:grid;place-items:center;color:#64748b}.is-active .vr-saveIcon,.is-reading .vr-saveIcon,.is-validated .vr-saveIcon{color:#2563eb;animation:vrSavePulse 1.2s ease-in-out infinite}.is-saved .vr-saveIcon{color:#15803d}.is-failed .vr-saveIcon{color:#b91c1c}
        .vr-saveCopy strong{display:block;color:#172b4d}.vr-saveCopy span{display:block;margin-top:2px;color:#64748b;font-size:12px}.vr-saveNotice{margin-top:18px;padding:14px 15px;border-radius:14px;line-height:1.5}.vr-saveNotice.success{background:#ecfdf5;color:#166534;border:1px solid #86efac}.vr-saveNotice.error{background:#fef2f2;color:#991b1b;border:1px solid #fecaca}.vr-saveActions{display:flex;justify-content:flex-end;margin-top:17px}.vr-saveActions button{border:0;border-radius:11px;padding:11px 20px;background:#163d69;color:#fff;font-weight:700;cursor:pointer}
      `}</style>
      <section className="vr-saveModal">
        <header className="vr-saveHead">
          <div className="vr-saveHeadLine">
            {!complete && !error && <span className="vr-saveSpinner" aria-hidden="true" />}
            {complete && <CheckCircle2 size={30} color="#16a34a" aria-hidden="true" />}
            {error && <XCircle size={30} color="#dc2626" aria-hidden="true" />}
            <h2 id="vr-save-title">{previewMode ? "Submission design preview" : complete ? "All information is saved" : error ? "Submission could not be confirmed" : "Securely saving verification"}</h2>
          </div>
          <p>{previewMode ? "Preview mode is active. No information was posted, saved, or sent to another page." : complete ? "Every verification section was committed and confirmed by the server." : error ? "No step is displayed as saved unless the server confirmed it." : "Please keep this window open while the server validates and stores your submission."}</p>
        </header>
        <div className="vr-saveBody">
          <ol className="vr-saveSteps">
            {stages.map((item) => (
              <li key={item.step} className={`vr-saveStep is-${item.status}`}>
                <span className="vr-saveRing" aria-hidden="true">
                  <svg viewBox="0 0 40 40"><circle className="track" cx="20" cy="20" r="16" pathLength="100"/><circle className="value" cx="20" cy="20" r="16" pathLength="100"/></svg>
                  <span className="vr-saveIcon">{item.status === "saved" ? <CheckCircle2 size={21}/> : item.status === "failed" ? <XCircle size={21}/> : item.step}</span>
                </span>
                <span className="vr-saveCopy"><strong>Step {item.step}</strong><span>{item.label} · {item.phase || (item.status === "saved" ? "Saved" : item.status === "failed" ? "Not confirmed" : item.status === "active" || item.status === "reading" ? "Awaiting server confirmation" : "Queued")}</span></span>
              </li>
            ))}
          </ol>
          {complete && <div className="vr-saveNotice success"><strong>{previewMode ? "Preview completed." : "All information is saved."}</strong> {previewMode ? "Close this window to continue testing the form." : "Your company verification record is ready to review."}</div>}
          {error && <div className="vr-saveNotice error" role="alert">{error}</div>}
          {(complete || error) && <div className="vr-saveActions"><button type="button" onClick={complete ? onConfirm : onClose}>{complete ? "OK" : "Return to form"}</button></div>}
        </div>
      </section>
    </div>
  );
}

export default function VerificationModal({ companyContext = null } = {}) {
  const [confirmedCompanyContext, setConfirmedCompanyContext] = useState(undefined);
  const activeCompanyContext = confirmedCompanyContext === undefined
    ? companyContext
    : confirmedCompanyContext;
  const confirmedParentName = activeCompanyContext?.parentCompany
    ? (activeCompanyContext.who_is_parent_company || activeCompanyContext.parentCompany.company_name || "")
    : "";
  const hasConfirmedParent = Boolean(confirmedParentName);
  const modalTopRef = useRef(null);

  useEffect(() => {
    const dialog = modalTopRef.current?.closest("[role='dialog']");
    if (!dialog) return undefined;

    dialog.classList.add("vr-verification-dialog-wide");
    return () => dialog.classList.remove("vr-verification-dialog-wide");
  }, []);
  const initialPageKeyRef = useRef(currentVerificationPageKey());
  const initialDraftRef = useRef(
    readVerificationDraft(initialPageKeyRef.current),
  );

  // Begin at Step 3 temporarily for testing, then continue through Step 6.
  const [step, setStep] = useState(() => 1);
  const [formData, setFormData] = useState(
    () => hasConfirmedParent
      ? {
          ...initialDraftRef.current.formData,
          legal_name: confirmedParentName,
          relationship_type: "sister_company",
          ultimate_company_name: confirmedParentName,
        }
      : initialDraftRef.current.formData,
  );

  // Keep the confirmed name in form state for review/submission and form resets.
  useEffect(() => {
    if (!hasConfirmedParent || formData.legal_name === confirmedParentName) return;
    setFormData((current) => ({
      ...current,
      legal_name: confirmedParentName,
    }));
  }, [hasConfirmedParent, confirmedParentName, formData.legal_name]);
  const [files, setFiles] = useState(() => initialDraftRef.current.files);
  const [verificationType, setVerificationType] = useState("");
  const [verificationDocuments, setVerificationDocuments] = useState({});
  const [companyProfiles, setCompanyProfiles] = useState([]);
  const [documentReview, setDocumentReview] = useState({
    open: false,
    loading: false,
    slotKey: "",
    documentId: "",
    fileName: "",
    result: null,
    error: "",
    closing: false,
  });
  const [draftRecoveryWarning, setDraftRecoveryWarning] = useState(
    () => initialDraftRef.current.hadRecoveryIssue,
  );
  const [fileError, setFileError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [submissionReference, setSubmissionReference] = useState("");
  const [saveProgressOpen, setSaveProgressOpen] = useState(false);
  const [saveProgressComplete, setSaveProgressComplete] = useState(false);
  const [saveProgressError, setSaveProgressError] = useState("");
  const [saveProgressStages, setSaveProgressStages] = useState(initialSubmissionStages);
  const [savedCompanyId, setSavedCompanyId] = useState(null);
  const savedCompanyIdRef = useRef(null);
  const [showCompanyDetails, setShowCompanyDetails] = useState(false);
  const [existingCompanyId, setExistingCompanyId] = useState(null);
  const [companyAvailabilityLoading, setCompanyAvailabilityLoading] = useState(true);
  const [consentAttention, setConsentAttention] = useState("");
  const [applicantInfoLoading, setApplicantInfoLoading] = useState(false);
  const [applicantInfoError, setApplicantInfoError] = useState("");
  const [isOnline, setIsOnline] = useState(() =>
    typeof navigator === "undefined" ? true : navigator.onLine,
  );

  useEffect(() => {
    if (!saveProgressOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [saveProgressOpen]);

  const checkExistingCompanies = async (signal) => {
    setCompanyAvailabilityLoading(true);

    try {
      const response = await fetch(COMPANY_INFORMATION_ENDPOINT, {
        credentials: "include",
        headers: { Accept: "application/json" },
        signal,
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setExistingCompanyId(null);
        return;
      }

      const companies = Array.isArray(data.companies) ? data.companies : [];
      setExistingCompanyId(companies.length > 0 ? companies[0].id : null);
    } catch (error) {
      if (error.name !== "AbortError") setExistingCompanyId(null);
    } finally {
      if (!signal.aborted) setCompanyAvailabilityLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    checkExistingCompanies(controller.signal);
    return () => controller.abort();
    // This availability check intentionally runs once when the modal opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [reviewPreparationRun, setReviewPreparationRun] = useState(0);
  const [reviewPreparation, setReviewPreparation] = useState({ 2: "pending", 3: "pending", 4: "pending", 5: "pending" });
  const [optionError, setOptionError] = useState("");
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantQuestion, setAssistantQuestion] = useState("");
  const [assistantLoading, setAssistantLoading] = useState(false);
  const [businessDescriptionReviewing, setBusinessDescriptionReviewing] = useState(false);
  const [businessDescriptionReviewStatus, setBusinessDescriptionReviewStatus] = useState("idle");
  const [businessDescriptionSuggestion, setBusinessDescriptionSuggestion] = useState("");
  const [businessDescriptionGenerating, setBusinessDescriptionGenerating] = useState(false);
  const [businessDescriptionGenerated, setBusinessDescriptionGenerated] = useState(false);
  const [productSuggestions, setProductSuggestions] = useState([]);
  const [productSuggestionsLoading, setProductSuggestionsLoading] = useState(false);
  const [signatureOpen, setSignatureOpen] = useState(false);
  const [signatureDataUrl, setSignatureDataUrl] = useState("");
  const [confirmation, setConfirmation] = useState({
    open: false,
    title: "",
    message: "",
    confirmLabel: "Confirm",
    cancelLabel: "Cancel",
    tone: "danger",
    action: null,
  });
  const [assistantMessages, setAssistantMessages] = useState([
    {
      id: 1,
      sender: "assistant",
      text: "Hello! I can explain form terms and show exactly what needs correction before you continue.",
    },
  ]);
  const [lookupOptions, setLookupOptions] = useState({
    accountTypes: [],
    applicantProfiles: [],
    sectors: [],
    industries: [],
    legalStructures: [],
    regions: [],
    countries: [],
    countriesAll: [],
    states: [],
    cities: [],
    currencies: [],
  });

  // useRef keeps the request cache stable across renders without rerendering.
  const requestCacheRef = useRef(new Map());
  const assistantMessageIdRef = useRef(2);
  const assistantAbortRef = useRef(null);
  const businessDescriptionAbortRef = useRef(null);
  const businessDescriptionGenerationAbortRef = useRef(null);
  const productSuggestionsAbortRef = useRef(null);
  const autoOwnershipTypeRef = useRef("");
  const assistantMessagesRef = useRef(null);
  const assistantPanelRef = useRef(null);
  const fetchOptionsRef = useRef(async (url, signal) => {
    if (requestCacheRef.current.has(url)) {
      return requestCacheRef.current.get(url);
    }

    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal,
    });

    if (!response.ok) {
      throw new Error(`Unable to load options (${response.status}).`);
    }

    const data = await response.json();
    requestCacheRef.current.set(url, data);
    return data;
  });

  const safeStep = sanitizeVerificationStep(step);
  const currentStep = stepMeta[safeStep] || stepMeta[1];
  const progress = Math.round((safeStep / 6) * 100);

  useEffect(() => {
    const updateConnection = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", updateConnection);
    window.addEventListener("offline", updateConnection);
    return () => {
      window.removeEventListener("online", updateConnection);
      window.removeEventListener("offline", updateConnection);
    };
  }, []);

  useEffect(() => {
    if (step !== 6) return undefined;

    const filled = (value) => Array.isArray(value)
      ? value.length > 0
      : String(value ?? "").trim() !== "";
    const validScopedValue = (name) => {
      const value = formData[name];
      if (!filled(value)) return true;
      return DATA_SCOPE_RULES[name]?.valid
        ? DATA_SCOPE_RULES[name].valid(String(value))
        : true;
    };
    const allRequired = (names) => names.every((name) => filled(formData[name]));

    const step2Required = [
      "account_type_id", "legal_name", "legal_structure_id", "sector_id",
      "industry_id", "region_id", "country_id", "registration_number",
      "established_date", "registered_address", "postal_code", "gps_location",
    ];
    const step2Scoped = ["legal_name", "registration_number", "established_date", "postal_code", "gps_location"];
    const websiteValid = !filled(formData.website) || /^https?:\/\/[^\s]+$/i.test(formData.website.trim());
    const step2Valid = allRequired(step2Required) && step2Scoped.every(validScopedValue) && websiteValid;

    const step3Required = [
      "business_model", "products_services", "operating_countries", "employee_count",
      "company_stage", "annual_revenue", "revenue_currency", "fiscal_year_end",
      "business_description",
    ];
    const revenue = Number(formData.annual_revenue);
    const step3Valid = allRequired(step3Required)
      && Number.isFinite(revenue) && revenue >= 0
      && validScopedValue("business_description")
      && businessDescriptionReviewStatus === "passed";

    const boardMembers = leadershipRows(formData.beneficial_owners);
    const boardOwnershipTotal = boardMembers.reduce(
      (total, member) => total + Number(member.ownership_percentage || 0),
      0,
    );
    const leadershipValid = boardMembers.length > 0
      && boardMembers.every((member) => {
        const hasBio = filled(member.bio);
        const hasLinkedIn = filled(member.linkedin_url);
        const hasOwnership = filled(member.ownership_percentage);
        const memberOwnership = Number(member.ownership_percentage);
        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email);
        const linkedInValid = /^https?:\/\/(?:[a-z]{2,3}\.)?(?:www\.)?linkedin\.com\/.+/i.test(member.linkedin_url);

        return filled(member.name)
          && member.name.trim().length >= 2
          && filled(member.title)
          && member.title.trim().length >= 2
          && emailValid
          && (!hasBio || member.bio.trim().length >= 20)
          && (!hasLinkedIn || linkedInValid)
          && (!hasOwnership || (
            Number.isFinite(memberOwnership)
            && memberOwnership >= 0
            && memberOwnership <= 100
          ));
      })
      && boardOwnershipTotal <= 100;
    const ownership = Number(formData.ownership_percentage);
    const relationshipValid = formData.is_ultimate_parent
      ? true
      : Number.isFinite(ownership) && ownership >= 0 && ownership <= 100
        && (!formData.relationship_type || filled(formData.ultimate_company_name));
    const step4Valid = allRequired([
      "authorized_signatory", "signatory_title", "signatory_id_number", "signatory_id_expiry",
    ])
      && formData.signatory_id_expiry >= earliestIdExpiryDate()
      && Boolean(signatureDataUrl)
      && leadershipValid
      && relationshipValid;

    const requiredDocumentSlots = VERIFICATION_DOCUMENTS[verificationType] || [];
    const step5Valid = Boolean(verificationType)
      && requiredDocumentSlots.length > 0
      && requiredDocumentSlots.every(([slotKey]) => {
        const documents = verificationDocuments[slotKey] || [];
        return documents.length > 0 && documents.every((document) => document.reviewStatus === "passed");
      });

    setReviewPreparation({
      2: step2Valid ? "success" : "invalid",
      3: step3Valid ? "success" : "invalid",
      4: step4Valid ? "success" : "invalid",
      5: step5Valid ? "success" : "invalid",
    });

    return undefined;
  }, [step, reviewPreparationRun]);

  useEffect(() => {
    if (step !== 6) return undefined;

    const controller = new AbortController();
    setApplicantInfoLoading(true);
    setApplicantInfoError("");

    fetch(GRAB_APPLICANTS_INFO_ENDPOINT, {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
      signal: controller.signal,
    })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load the logged-in applicant information.",
          );
        }

        setFormData((current) => ({
          ...current,
          contact_name: data.full_name ?? "",
          contact_phone: data.phone_number ?? "",
        }));
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          setApplicantInfoError(error.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setApplicantInfoLoading(false);
        }
      });

    return () => controller.abort();
  }, [step]);

  useEffect(() => {
    const openFieldHelpInAssistant = (event) => {
      const label = event.detail?.label;
      if (typeof label !== "string" || !label.trim()) return;

      const question =
        typeof event.detail?.question === "string"
          ? event.detail.question
          : `What is the meaning of ${label}?`;

      setAssistantQuestion(question);
      setAssistantOpen(true);

      window.requestAnimationFrame(() => {
        document.getElementById("assistant-question")?.focus();
      });
    };

    window.addEventListener(FIELD_HELP_EVENT, openFieldHelpInAssistant);
    return () =>
      window.removeEventListener(FIELD_HELP_EVENT, openFieldHelpInAssistant);
  }, []);

  /*
   * Persist the current in-progress form only for this loaded page.
   * This protects data when the modal is closed with Esc or the X button.
   */
  useEffect(() => {
    try {
      const { formData: safeFormData } = sanitizeVerificationFormData(formData);
      const safeFiles = sanitizeVerificationFiles(files);

      verificationDraftCache = {
        pageKey: initialPageKeyRef.current,
        step: sanitizeVerificationStep(step),
        formData: {
          ...safeFormData,
          // Do not retain this field across Escape/X dismissal and reopening.
          operating_countries: [],
        },
        files: [...safeFiles],
      };
    } catch (error) {
      // Retention must never be allowed to crash the verification form.
      console.error("[Verification] Unable to retain in-progress form data", error);
      clearVerificationDraftCache();
      setDraftRecoveryWarning(true);
    }
  }, [step, formData, files]);

  /*
   * If the component disappears because the URL changed, discard the draft.
   * If it disappears only because the modal was closed, the URL is unchanged,
   * so the draft remains available when the modal is reopened.
   */
  useEffect(
    () => () => {
      if (currentVerificationPageKey() !== initialPageKeyRef.current) {
        clearVerificationDraftCache();
      }
    },
    [],
  );

  useEffect(() => {
    const controller = new AbortController();

    fetchOptionsRef.current(
      `${API_BASE_URL}/api/verification/options`,
      controller.signal,
    )
      .then((data) => {
        setLookupOptions((current) => ({
          ...current,
          accountTypes: asArray(data?.account_types),
          applicantProfiles: asArray(data?.applicant_profiles),
          sectors: asArray(data?.sectors),
          legalStructures: asArray(data?.legal_structures),
          regions: asArray(data?.regions),
          countriesAll: asArray(data?.countries_all),
          currencies: normalizeCurrencyOptions(
            data?.ticket_currency ?? data?.ticket_currencies,
          ),
        }));
        setOptionError("");
      })
      .catch((error) => {
        if (error.name !== "AbortError") setOptionError(error.message);
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!formData.sector_id) {
      setLookupOptions((current) => ({ ...current, industries: [] }));
      return undefined;
    }

    const controller = new AbortController();
    fetchOptionsRef.current(
      `${API_BASE_URL}/api/verification/options/industries?sector_id=${encodeURIComponent(formData.sector_id)}`,
      controller.signal,
    )
      .then((data) => {
        setLookupOptions((current) => ({
          ...current,
          industries: asArray(data),
        }));
        setOptionError("");
      })
      .catch((error) => {
        if (error.name !== "AbortError") setOptionError(error.message);
      });
    return () => controller.abort();
  }, [formData.sector_id]);

  useEffect(() => {
    if (!formData.legal_structure_id) {
      setFormData((current) => {
        if (current.ownership_type !== autoOwnershipTypeRef.current) return current;
        return { ...current, ownership_type: "" };
      });
      autoOwnershipTypeRef.current = "";
      return;
    }

    const legalStructure = selectedOptionName(
      lookupOptions.legalStructures,
      formData.legal_structure_id,
    ).trim();

    if (!legalStructure || legalStructure === "Not provided") return;

    setFormData((current) => {
      const currentOwnershipType = String(current.ownership_type ?? "").trim();

      // Preserve a value the user entered manually. Automatically update only
      // an empty value or the value previously supplied from Legal structure.
      if (
        currentOwnershipType &&
        currentOwnershipType !== autoOwnershipTypeRef.current
      ) {
        return current;
      }

      autoOwnershipTypeRef.current = legalStructure;
      return { ...current, ownership_type: legalStructure };
    });
  }, [formData.legal_structure_id, lookupOptions.legalStructures]);

  const productSelectionContext = JSON.stringify([
    formData.account_type_id, formData.legal_name, formData.trading_name,
    formData.legal_structure_id, formData.sector_id, formData.industry_id,
    formData.region_id, formData.country_id, formData.state_id, formData.city_id,
    formData.registration_number, formData.tax_id, formData.established_date,
    formData.external_identifier, formData.registered_address, formData.postal_code,
    formData.website, formData.business_model,
  ]);
  const previousProductContext = useRef(productSelectionContext);
  useEffect(() => {
    if (previousProductContext.current === productSelectionContext) return;
    previousProductContext.current = productSelectionContext;
    setFormData(current => current.products_services ? { ...current, products_services: "" } : current);
  }, [productSelectionContext]);

  useEffect(() => {
    const sector = selectedOptionName(
      lookupOptions.sectors,
      formData.sector_id,
    ).trim();
    const industry = selectedOptionName(
      lookupOptions.industries,
      formData.industry_id,
    ).trim();
    const businessModels = formData.business_model.split("\n").map(item => item.trim()).filter(Boolean);

    productSuggestionsAbortRef.current?.abort();
    setProductSuggestions([]);

    if (!sector || !industry || businessModels.length === 0) {
      setProductSuggestions([]);
      setProductSuggestionsLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    productSuggestionsAbortRef.current = controller;
    setProductSuggestionsLoading(true);

    const timeoutId = window.setTimeout(async () => {
      setProductSuggestions([]);
      setProductSuggestionsLoading(true);

      try {
        const response = await fetch(GENERATE_PRODUCT_SUGGESTIONS_ENDPOINT, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          signal: controller.signal,
          body: JSON.stringify({ sector, industry, business_models: businessModels, business_model: businessModels.join(", ") }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data?.message || "Unable to generate product suggestions.");
        }

        if (controller.signal.aborted) return;
        setProductSuggestions(
          [...new Set(asArray(data?.products).map((item) => String(item).trim()))]
            .filter(Boolean),
        );
        setOptionError("");
      } catch (error) {
        if (error.name !== "AbortError") {
          setProductSuggestions([]);
          setOptionError(error.message);
        }
      } finally {
        if (!controller.signal.aborted) setProductSuggestionsLoading(false);
      }
    }, 600);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [
    productSelectionContext,
    formData.sector_id,
    formData.industry_id,
    formData.business_model,
    lookupOptions.sectors,
    lookupOptions.industries,
  ]);

  useEffect(() => {
    if (!formData.region_id) {
      setLookupOptions((current) => ({ ...current, countries: [] }));
      return undefined;
    }

    const controller = new AbortController();
    fetchOptionsRef.current(
      `${API_BASE_URL}/api/verification/options/countries?region_id=${encodeURIComponent(formData.region_id)}`,
      controller.signal,
    )
      .then((data) => {
        setLookupOptions((current) => ({
          ...current,
          countries: asArray(data),
        }));
        setOptionError("");
      })
      .catch((error) => {
        if (error.name !== "AbortError") setOptionError(error.message);
      });
    return () => controller.abort();
  }, [formData.region_id]);

  useEffect(() => {
    if (!formData.country_id) {
      setLookupOptions((current) => ({ ...current, states: [] }));
      return undefined;
    }

    const controller = new AbortController();
    fetchOptionsRef.current(
      `${API_BASE_URL}/api/verification/options/states?country_id=${encodeURIComponent(formData.country_id)}`,
      controller.signal,
    )
      .then((data) => {
        setLookupOptions((current) => ({
          ...current,
          states: asArray(data),
        }));
        setOptionError("");
      })
      .catch((error) => {
        if (error.name !== "AbortError") setOptionError(error.message);
      });
    return () => controller.abort();
  }, [formData.country_id]);

  useEffect(() => {
    if (!formData.state_id) {
      setLookupOptions((current) => ({ ...current, cities: [] }));
      return undefined;
    }

    const controller = new AbortController();
    fetchOptionsRef.current(
      `${API_BASE_URL}/api/verification/options/cities?state_id=${encodeURIComponent(formData.state_id)}`,
      controller.signal,
    )
      .then((data) => {
        setLookupOptions((current) => ({
          ...current,
          cities: asArray(data),
        }));
        setOptionError("");
      })
      .catch((error) => {
        if (error.name !== "AbortError") setOptionError(error.message);
      });
    return () => controller.abort();
  }, [formData.state_id]);

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;

    if (!Object.prototype.hasOwnProperty.call(initialFormData, name)) {
      return;
    }

    if (name === "business_description") {
      setBusinessDescriptionReviewStatus("idle");
      setBusinessDescriptionSuggestion("");
      businessDescriptionAbortRef.current?.abort();
    }

    if (BUSINESS_DESCRIPTION_SOURCE_FIELDS.some(([fieldName]) => fieldName === name)) {
      setBusinessDescriptionGenerated(false);
      businessDescriptionGenerationAbortRef.current?.abort();
    }

    setFormData((current) => {
      const safeCurrent = sanitizeVerificationFormData(current).formData;
      let nextValue;

      if (name === "operating_countries") {
        nextValue = sanitizeOperatingCountries(value);
      } else if (type === "checkbox") {
        nextValue = Boolean(checked);
      } else {
        nextValue = value == null ? "" : String(value);
      }

      const next = {
        ...safeCurrent,
        [name]: nextValue,
      };

      if (name === "is_ultimate_parent" && nextValue) {
        next.relationship_type = "";
        next.ownership_percentage = "";
        next.ultimate_company_name = "";
      }

      if (name === "relationship_type" && !nextValue) {
        next.ultimate_company_name = "";
      }

      if (
        name === "legal_name" &&
        (!safeCurrent.trading_name.trim() ||
          safeCurrent.trading_name === safeCurrent.legal_name)
      ) {
        next.trading_name = nextValue;
      }

      if (name === "region_id") {
        next.country_id = "";
        next.state_id = "";
        next.city_id = "";
      } else if (name === "country_id") {
        next.state_id = "";
        next.city_id = "";
      } else if (name === "state_id") {
        next.city_id = "";
      } else if (name === "sector_id") {
        next.industry_id = "";
      }

      return next;
    });
  };

  const goToStep = (stepNumber) => {
    setStep(sanitizeVerificationStep(stepNumber));

    window.requestAnimationFrame(() => {
      modalTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      const scrollContainer = modalTopRef.current?.closest("[role='dialog']");
      if (scrollContainer) scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  const pushAssistantMessage = (text, sender = "assistant", tone = "") => {
    setAssistantMessages((current) => [
      ...current,
      {
        id: assistantMessageIdRef.current++,
        sender,
        tone,
        text,
      },
    ]);
    setAssistantOpen(true);
  };

  const focusAssistantValidation = (delay = 180) => {
    // Wait for native validation and the assistant-open render to finish first.
    window.setTimeout(() => {
      const panel = assistantPanelRef.current;
      if (!panel) return;

      const isSmallScreen = window.matchMedia("(max-width: 768px)").matches;
      panel.style.scrollMarginTop = isSmallScreen ? "12px" : "24px";
      panel.scrollIntoView({
        behavior: isSmallScreen ? "auto" : "smooth",
        block: "start",
        inline: "nearest",
      });
      panel.focus({ preventScroll: true });

      if (typeof panel.animate === "function") {
        panel.animate(
          [
            { outline: "4px solid rgba(37, 99, 235, 0.75)", outlineOffset: "4px" },
            { outline: "4px solid rgba(37, 99, 235, 0)", outlineOffset: "8px" },
          ],
          { duration: 1800, easing: "ease-out" },
        );
      }
    }, delay);
  };

  const focusInvalidFieldThenAssistant = (field) => {
    if (!field || typeof field.focus !== "function") {
      focusAssistantValidation(5000);
      return;
    }

    const visibleField = field?.name === "business_description"
      ? document.getElementById("business_description-editor") || field
      : field;

    const pulseField = (shouldScroll) => {
      if (shouldScroll) {
        visibleField.style.scrollMarginTop = "20px";
        visibleField.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      visibleField.focus({ preventScroll: true });

      if (typeof visibleField.animate === "function") {
        visibleField.animate(
          [
            { outline: "3px solid rgba(220, 38, 38, 0.9)", outlineOffset: "2px" },
            { outline: "3px solid rgba(220, 38, 38, 0)", outlineOffset: "6px" },
          ],
          { duration: 620, easing: "ease-in-out" },
        );
      }
    };

    window.setTimeout(() => pulseField(true), 100);
    window.setTimeout(() => pulseField(false), 820);
    //focusAssistantValidation(5000);
  };

  useEffect(() => {
    const container = assistantMessagesRef.current;
    if (container) container.scrollTop = container.scrollHeight;
  }, [assistantMessages, assistantLoading]);

  useEffect(
    () => () => {
      assistantAbortRef.current?.abort();
      businessDescriptionAbortRef.current?.abort();
      businessDescriptionGenerationAbortRef.current?.abort();
    },
    [],
  );

  useEffect(() => {
    console.info("[Clarity] VerificationModal loaded", {
      assistantEndpoint: ASSISTANT_ENDPOINT,
    });
  }, []);

  const handleAssistantSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const question = assistantQuestion.trim();

    console.info("[Clarity] submit event received", {
      questionLength: question.length,
      assistantLoading,
      currentStep: step,
      endpoint: ASSISTANT_ENDPOINT,
    });

    if (!question) {
      console.warn("[Clarity] request stopped: question is empty");
      pushAssistantMessage(
        "Please enter a question before pressing Send.",
        "assistant",
        "warning",
      );
      return;
    }

    if (assistantLoading) {
      console.warn("[Clarity] request stopped: a request is already running");
      return;
    }

    const recentHistory = assistantMessages.slice(-8).map(({ sender, text }) => ({
      role: sender === "user" ? "user" : "assistant",
      content: text,
    }));
    pushAssistantMessage(question, "user");
    setAssistantQuestion("");
    setAssistantLoading(true);
    assistantAbortRef.current?.abort();
    const controller = new AbortController();
    assistantAbortRef.current = controller;

    // Never send uploaded files or raw identity numbers to the language model.
    const safeFormContext = Object.fromEntries(
      Object.entries(formData)
        .filter(([key]) => !["signatory_id_number", "tax_id"].includes(key))
        .map(([key, value]) => [
          key,
          typeof value === "string" && value.length > 500
            ? `${value.slice(0, 500)}…`
            : value,
        ]),
    );

    try {
      console.info("[Clarity] invoking Laravel API", {
        endpoint: ASSISTANT_ENDPOINT,
        currentStep: step,
      });

      const response = await fetch(ASSISTANT_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
          current_step: step,
          form_context: safeFormContext,
          conversation: recentHistory,
        }),
        signal: controller.signal,
      });

      const responseText = await response.text();
      let data = {};

      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch {
          throw new Error(
            `Laravel returned non-JSON content (HTTP ${response.status}). Check the Laravel URL and server log.`,
          );
        }
      }

      console.info("[Clarity] Laravel API responded", {
        status: response.status,
        ok: response.ok,
        traceId: data.trace_id || null,
      });

      if (!response.ok) {
        const validationMessage = Object.values(data.errors || {})[0]?.[0];
        throw new Error(
          validationMessage ||
            data.message ||
            `The assistant request failed (HTTP ${response.status}).`,
        );
      }

      if (!data.answer || typeof data.answer !== "string") {
        throw new Error("Laravel returned a successful response without an answer.");
      }

      pushAssistantMessage(data.answer);
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("[Clarity] assistant request failed", error);
        pushAssistantMessage(
          error.message || "The assistant could not answer. Please try again.",
          "assistant",
          "error",
        );
      }
    } finally {
      if (assistantAbortRef.current === controller) {
        assistantAbortRef.current = null;
        setAssistantLoading(false);
      }
    }
  };

  const reviewBusinessDescription = async () => {
    const description = formData.business_description.trim();
    const field = document.getElementById("business_description-editor");

    if (description.length < 500) {
      setBusinessDescriptionReviewStatus("failed");
      pushAssistantMessage(
        `Business description contains ${description.length} meaningful character${description.length === 1 ? "" : "s"}. Enter at least 500 characters before continuing.`,
        "assistant",
        "error",
      );
      focusInvalidFieldThenAssistant(field);
      focusAssistantValidation(5000);
      return false;
    }

    if (businessDescriptionReviewing) return false;

    setBusinessDescriptionReviewing(true);
    setBusinessDescriptionReviewStatus("reviewing");
    setBusinessDescriptionSuggestion("");
    businessDescriptionAbortRef.current?.abort();
    const controller = new AbortController();
    businessDescriptionAbortRef.current = controller;

    try {
      const response = await fetch(ASSISTANT_ENDPOINT_BUSINESS_DESCRIPTION, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: `Review the Business description below as a dedicated verification gate.

A suitable Business description should clearly explain:
- what the company does and the problem it solves;
- its principal products or services;
- its target customers and markets;
- how it delivers value and earns revenue;
- its operating model, important sales channels, and geographic reach when relevant;
- its current stage, scale, and material activities when known;
- enough specific information to distinguish it from generic marketing language.

Reject meaningless or unrelated pasted text, repeated filler, random characters, source code, keyword lists, unsupported claims, contradictions, and text that does not explain the stated company. Check spelling, grammar, wording, clarity, internal consistency, and likely informational errors. Do not invent facts. When spelling, grammar, or wording can be corrected without changing the applicant's meaning, provide the complete improved description in corrected_text.

Return ONLY valid JSON in this exact shape: {"valid":true|false,"is_meaningful":true|false,"is_company_relevant":true|false,"has_spelling_errors":true|false,"has_serious_language_errors":true|false,"message":"clear guidance for the applicant","corrected_text":"complete corrected description or empty string"}. Set valid true only when the description is meaningful, company-relevant, sufficiently informative, has no spelling errors, and has no serious language or informational errors.

Business description:
${description}`,
          current_step: 3,
          form_context: {
            business_model: formData.business_model,
            products_services: formData.products_services,
            company_stage: formData.company_stage,
            business_description: description,
          },
          conversation: [],
        }),
        signal: controller.signal,
      });

      const responseText = await response.text();
      let data = {};

      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        throw new Error(
          `Laravel returned non-JSON content while reviewing the Business description (HTTP ${response.status}).`,
        );
      }

      if (!response.ok) {
        const validationMessage = Object.values(data.errors || {})[0]?.[0];
        throw new Error(
          validationMessage ||
            data.message ||
            `Business description review failed (HTTP ${response.status}).`,
        );
      }

      if (!data.answer || typeof data.answer !== "string") {
        throw new Error("Clarity Assistant returned no Business description review.");
      }

      const jsonText = data.answer
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
      let review;

      try {
        review = JSON.parse(jsonMatch?.[0] || jsonText);
      } catch {
        setBusinessDescriptionReviewStatus("failed");
        pushAssistantMessage(data.answer, "assistant", "error");
        focusInvalidFieldThenAssistant(field);
        focusAssistantValidation(5000);
        return false;
      }

      const guidance = [review.message, review.corrected_text]
        .filter((value) => typeof value === "string" && value.trim())
        .join(" Corrected suggestion: ");

      const correctedText =
        typeof review.corrected_text === "string"
          ? review.corrected_text.trim()
          : "";
      setBusinessDescriptionSuggestion(
        correctedText && correctedText !== description ? correctedText : "",
      );

      const passedReview =
        review.valid === true &&
        review.is_meaningful === true &&
        review.is_company_relevant === true &&
        review.has_spelling_errors === false &&
        review.has_serious_language_errors === false;

      if (!passedReview) {
        setBusinessDescriptionReviewStatus("failed");
        pushAssistantMessage(
          guidance || "The Business description needs revision before you can continue.",
          "assistant",
          "error",
        );
        focusInvalidFieldThenAssistant(field);
        focusAssistantValidation(5000);
        return false;
      }

      setBusinessDescriptionReviewStatus("passed");
      pushAssistantMessage(
        guidance || "Business description passed the Clarity Assistant review.",
        "assistant",
        "success",
      );
      await new Promise((resolve) => window.setTimeout(resolve, 900));
      return true;
    } catch (error) {
      if (error.name !== "AbortError") {
        setBusinessDescriptionReviewStatus("failed");
        pushAssistantMessage(
          error.message || "Clarity Assistant could not review the Business description. Please try again.",
          "assistant",
          "error",
        );
        focusInvalidFieldThenAssistant(field);
        focusAssistantValidation(5000);
      }
      return false;
    } finally {
      if (businessDescriptionAbortRef.current === controller) {
        businessDescriptionAbortRef.current = null;
        setBusinessDescriptionReviewing(false);
      }
    }
  };

  const acceptBusinessDescriptionSuggestion = () => {
    const correctedText = businessDescriptionSuggestion.trim();
    if (!correctedText) return;

    setFormData((current) => ({
      ...sanitizeVerificationFormData(current).formData,
      business_description: correctedText,
    }));
    setBusinessDescriptionSuggestion("");
    setBusinessDescriptionReviewStatus("idle");
    pushAssistantMessage(
      "The corrected Business description was accepted. Click Next to review the updated text.",
      "assistant",
      "success",
    );
    window.requestAnimationFrame(() => {
      document.getElementById("business_description-editor")?.focus();
    });
  };

  const generateBusinessDescription = async () => {
    const missingFields = BUSINESS_DESCRIPTION_SOURCE_FIELDS.filter(
      ([fieldName]) => {
        const value = formData[fieldName];
        return Array.isArray(value)
          ? value.length === 0
          : String(value ?? "").trim() === "";
      },
    );

    if (missingFields.length > 0) {
      pushAssistantMessage(
        `Complete these required fields before generating the Business description: ${missingFields
          .map(([, label]) => label)
          .join(", ")}.`,
        "assistant",
        "error",
      );

      if (missingFields[0][2] === 2) {
        goToStep(2);
      } else {
        focusInvalidFieldThenAssistant(
          document.getElementById(missingFields[0][0]),
        );
      }
      return;
    }

    if (businessDescriptionGenerating) return;

    setBusinessDescriptionGenerating(true);
    setBusinessDescriptionGenerated(false);
    businessDescriptionGenerationAbortRef.current?.abort();
    const controller = new AbortController();
    businessDescriptionGenerationAbortRef.current = controller;

    const formContext = {
      account_type: selectedOptionName(lookupOptions.accountTypes, formData.account_type_id),
      legal_name: formData.legal_name,
      trading_name: formData.trading_name,
      sector: selectedOptionName(lookupOptions.sectors, formData.sector_id),
      industry: selectedOptionName(lookupOptions.industries, formData.industry_id),
      registration_number: formData.registration_number,
      established_date: formData.established_date,
      legal_structure: selectedOptionName(lookupOptions.legalStructures, formData.legal_structure_id),
      region: selectedOptionName(lookupOptions.regions, formData.region_id),
      country: selectedOptionName(lookupOptions.countries, formData.country_id),
      state_or_province: selectedOptionName(lookupOptions.states, formData.state_id),
      city: selectedOptionName(lookupOptions.cities, formData.city_id),
      registered_address: formData.registered_address,
      postal_code: formData.postal_code,
      website: formData.website,
      external_identifier: formData.external_identifier,
      business_model: formData.business_model,
      products_services: formData.products_services,
      operating_countries: formData.operating_countries,
      employee_count: formData.employee_count,
      company_stage: formData.company_stage,
      annual_revenue: formData.annual_revenue,
      revenue_currency: selectedOptionName(lookupOptions.currencies, formData.revenue_currency),
      fiscal_year_end: formData.fiscal_year_end,
      public_listing_or_ticker: formData.listing_ticker,
    };

    try {
      const response = await fetch(GENERATE_BUSINESS_DESCRIPTION_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ form_context: formContext }),
        signal: controller.signal,
      });
      const responseText = await response.text();
      let data = {};

      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        throw new Error(
          `Laravel returned non-JSON content while generating the Business description (HTTP ${response.status}).`,
        );
      }

      if (!response.ok) {
        const validationMessage = Object.values(data.errors || {})[0]?.[0];
        throw new Error(
          validationMessage ||
            data.message ||
            `Business description generation failed (HTTP ${response.status}).`,
        );
      }

      const description = String(data.description || "").trim();
      if (!description) {
        throw new Error("The generator returned an empty Business description.");
      }

      setFormData((current) => ({
        ...sanitizeVerificationFormData(current).formData,
        business_description: description,
      }));
      setBusinessDescriptionReviewStatus("idle");
      setBusinessDescriptionSuggestion("");
      setBusinessDescriptionGenerated(true);
      pushAssistantMessage(
        "A Business description was generated from the completed Step 2 and Step 3 details. Review it before clicking Next.",
        "assistant",
        "success",
      );
      window.requestAnimationFrame(() => {
        document.getElementById("business_description-editor")?.focus();
      });
    } catch (error) {
      if (error.name !== "AbortError") {
        pushAssistantMessage(
          error.message || "The Business description could not be generated. Please try again.",
          "assistant",
          "error",
        );
      }
    } finally {
      if (businessDescriptionGenerationAbortRef.current === controller) {
        businessDescriptionGenerationAbortRef.current = null;
        setBusinessDescriptionGenerating(false);
      }
    }
  };

  const validateCurrentStep = (event) => {
    const form = event.currentTarget.closest("form");

    if (!form.checkValidity()) {
      const invalidFields = [...form.querySelectorAll(":invalid")];
      const invalidLabels = [
        ...new Set(
          invalidFields.map((field) => {
            const label = form.querySelector(`label[for="${field.id}"]`);
            return label?.textContent?.replace("*", "").trim() || field.name;
          }),
        ),
      ];

      pushAssistantMessage(
        `Please correct ${invalidLabels.length} field${
          invalidLabels.length === 1 ? "" : "s"
        } before continuing: ${invalidLabels.join(", ")}. Each highlighted field is empty or does not match the expected format.`,
        "assistant",
        "error",
      );
      focusInvalidFieldThenAssistant(invalidFields[0]);
      if (invalidFields[0]?.name === "business_description") {
        setBusinessDescriptionReviewStatus("failed");
        focusAssistantValidation(5000);
      }
      form.reportValidity();
      return false;
    }

    const scopeIssues = Object.entries(DATA_SCOPE_RULES).flatMap(
      ([fieldName, rule]) => {
        const field = form.elements.namedItem(fieldName);

        if (!field || !field.value || rule.valid(field.value)) return [];
        return [{ field, message: rule.message }];
      },
    );

    if (scopeIssues.length > 0) {
      pushAssistantMessage(
        `These values are outside the accepted scope: ${scopeIssues
          .map((issue) => issue.message)
          .join(" ")}`,
        "assistant",
        "error",
      );
      focusInvalidFieldThenAssistant(scopeIssues[0].field);
      if (scopeIssues[0].field?.name === "business_description") {
        setBusinessDescriptionReviewStatus("failed");
        focusAssistantValidation(5000);
      }
      return false;
    }

    if (step === 4) {
      const boardMembers = leadershipRows(formData.beneficial_owners);
      const boardOwnershipTotal = boardMembers.reduce(
        (total, member) => total + Number(member.ownership_percentage || 0),
        0,
      );

      if (boardOwnershipTotal > 100) {
        const firstOwnershipField = form.querySelector('[id^="leadership-ownership-"]');
        pushAssistantMessage(
          `Leadership-board ownership totals ${boardOwnershipTotal}%. The combined percentage cannot exceed 100%.`,
          "assistant",
          "error",
        );
        focusInvalidFieldThenAssistant(firstOwnershipField);
        return false;
      }
    }

    if (step === 4 && !signatureDataUrl) {
      setSignatureOpen(true);
      pushAssistantMessage(
        "The authorized signatory must provide a handwritten signature before continuing.",
        "assistant",
        "error",
      );
      focusInvalidFieldThenAssistant(
        form.elements.namedItem("authorized_signatory"),
      );
      return false;
    }

    if (step === 5 && !verificationType) {
      setFileError("Choose Standard Verification (CTI) or Auxiliary Verification (ATS).");
      pushAssistantMessage(
        "Choose a verification type before continuing.",
        "assistant",
        "error",
      );
      return false;
    }

    if (step === 5) {
      const requiredSlots = VERIFICATION_DOCUMENTS[verificationType] || [];
      const missingSlots = requiredSlots.filter(([slotKey]) => !(verificationDocuments[slotKey] || []).length);
      if (missingSlots.length > 0) {
        setFileError(`Upload all four required documents. Missing: ${missingSlots.map(([, label]) => label).join(", ")}.`);
        pushAssistantMessage(
          `Complete every ${verificationType.toUpperCase()} document slot before continuing.`,
          "assistant",
          "error",
        );
        return false;
      }

      const allDocuments = requiredSlots.flatMap(([slotKey]) => verificationDocuments[slotKey] || []);
      const pendingReviews = allDocuments.filter((document) => document.reviewStatus !== "passed");
      if (pendingReviews.length > 0) {
        setFileError(`Every uploaded file must pass Raymoch Clarity Review. ${pendingReviews.length} file${pendingReviews.length === 1 ? " remains" : "s remain"} unapproved.`);
        pushAssistantMessage(
          "Click the Verify button beside every file and resolve any failed or blurry-document review before continuing.",
          "assistant",
          "error",
        );
        return false;
      }
    }

    return true;
  };

  const handleNext = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.nativeEvent?.stopImmediatePropagation?.();

    const stepBeingValidated = step;

    if (!validateCurrentStep(event)) {
      return;
    }

    if (stepBeingValidated === 3 && !(await reviewBusinessDescription())) {
      return;
    }

    if (stepBeingValidated === 5) {
      // Step 5 Next is validation/navigation only. Never let it enter the
      // Step 6 form-submission operation during the same event.
      goToStep(6);
      return;
    }

    if (stepBeingValidated < 6) {
      goToStep(stepBeingValidated + 1);
    }
  };

  const handleBack = () => {
    goToStep(step - 1);
  };

  const closeConfirmation = () => {
    setConfirmation((current) => ({
      ...current,
      open: false,
      action: null,
    }));
  };

  const requestConfirmation = ({
    title,
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    tone = "danger",
    onConfirm,
  }) => {
    setConfirmation({
      open: true,
      title,
      message,
      confirmLabel,
      cancelLabel,
      tone,
      action: onConfirm,
    });
  };

  const handleConfirmedAction = () => {
    const action = confirmation.action;
    closeConfirmation();
    action?.();
  };

  const clearEntireForm = () => {
    clearVerificationDraftCache();

    setFormData(createEmptyFormData());
    setFiles([]);
    setVerificationType("");
    setVerificationDocuments({});
    setCompanyProfiles([]);
    setDocumentReview((current) => ({ ...current, open: false, loading: false, result: null, error: "", closing: false }));
    setDraftRecoveryWarning(false);
    setFileError("");
    setSubmissionError("");
    setSubmissionReference("");
    setSubmitted(false);
    setAssistantQuestion("");
    setSignatureOpen(false);
    setSignatureDataUrl("");

    // Return to the first form-filling step after clearing everything.
    setStep(2);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleClearForm = () => {
    requestConfirmation({
      title: "Clear verification form?",
      message:
        "This will permanently remove all information entered in this verification form, including selected countries and uploaded documents. This action cannot be undone.",
      confirmLabel: "Clear form",
      cancelLabel: "Keep information",
      tone: "danger",
      onConfirm: clearEntireForm,
    });
  };

  const selectVerificationType = (type) => {
    if (type === verificationType) return;
    setVerificationType(type);
    setVerificationDocuments({});
    setFiles([]);
    setFileError("");
  };

  const handleVerificationDocument = (slotKey, event) => {
    const selectedFiles = Array.from(event.target.files || []);
    event.target.value = "";
    if (!selectedFiles.length) return;

    const allowedTypes = new Set(["application/pdf", "image/jpeg", "image/png", "image/webp"]);
    const unsupported = selectedFiles.find((file) => !allowedTypes.has(file.type));
    if (unsupported) {
      setFileError(`“${unsupported.name}” is not supported. Upload PDF, JPG, PNG or WEBP only.`);
      return;
    }

    const oversized = selectedFiles.find((file) => file.size > MAX_UPLOAD_BYTES);
    if (oversized) {
      setFileError(`“${oversized.name}” exceeds the 100 MB per-file limit.`);
      return;
    }

    const existing = verificationDocuments[slotKey] || [];
    const additions = selectedFiles
      .filter((file) => !existing.some((item) => item.file.name === file.name && item.file.size === file.size && item.file.lastModified === file.lastModified))
      .map((file) => ({
        id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${file.name}-${Math.random()}`,
        file,
        reviewStatus: "unreviewed",
        reviewResult: null,
      }));

    const nextDocuments = { ...verificationDocuments, [slotKey]: [...existing, ...additions] };
    const combinedSize = Object.values(nextDocuments).flat().reduce(
      (total, document) => total + document.file.size,
      0,
    );

    if (combinedSize > MAX_UPLOAD_BYTES) {
      setFileError("The combined size of all uploaded documents must not exceed 100 MB.");
      return;
    }

    setVerificationDocuments(nextDocuments);
    setFiles(Object.values(nextDocuments).flat().map((document) => document.file));
    setFileError("");
  };

  const addCompanyProfile = () => {
    setCompanyProfiles((current) => [
      ...current,
      {
        id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`,
        type: "",
        file: null,
      },
    ]);
  };

  const updateCompanyProfileType = (profileId, type) => {
    setCompanyProfiles((current) =>
      current.map((profile) =>
        profile.id === profileId ? { ...profile, type } : profile,
      ),
    );
  };

  const updateCompanyProfileFile = (profileId, event) => {
    const file = event.target.files?.[0] || null;
    setCompanyProfiles((current) =>
      current.map((profile) =>
        profile.id === profileId ? { ...profile, file } : profile,
      ),
    );
  };

  const removeCompanyProfile = (profileId) => {
    setCompanyProfiles((current) =>
      current.filter((profile) => profile.id !== profileId),
    );
  };

  const removeVerificationDocument = (slotKey, documentId) => {
    setVerificationDocuments((current) => {
      const remaining = (current[slotKey] || []).filter((document) => document.id !== documentId);
      const next = { ...current, [slotKey]: remaining };
      setFiles(Object.values(next).flat().map((document) => document.file));
      return next;
    });
    setFileError("");
  };

  const reviewVerificationDocument = async (slotKey, document) => {
    setDocumentReview({ open: true, loading: true, slotKey, documentId: document.id, fileName: document.file.name, result: null, error: "", closing: false });

    const payload = new FormData();
    payload.append("document", document.file);
    payload.append("verification_type", verificationType);
    payload.append("document_category", slotKey);

    try {
      const response = await fetch(REVIEW_VERIFICATION_DOCUMENT_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: payload,
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || `Document review failed (HTTP ${response.status}).`);

      const reviewStatus = data.valid === true ? "passed" : "failed";
      setVerificationDocuments((current) => ({
        ...current,
        [slotKey]: (current[slotKey] || []).map((item) => item.id === document.id ? { ...item, reviewStatus, reviewResult: data } : item),
      }));
      setDocumentReview((current) => ({ ...current, loading: false, result: data, error: "" }));
    } catch (error) {
      setVerificationDocuments((current) => ({
        ...current,
        [slotKey]: (current[slotKey] || []).map((item) => item.id === document.id ? { ...item, reviewStatus: "failed" } : item),
      }));
      setDocumentReview((current) => ({ ...current, loading: false, error: error.message || "The document could not be reviewed." }));
    }
  };

  const closeDocumentReview = () => {
    if (documentReview.loading) return;
    setDocumentReview((current) => ({ ...current, closing: true }));
    window.setTimeout(() => {
      setDocumentReview((current) => ({ ...current, open: false, closing: false }));
    }, 180);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Submission is a Step 6-only operation. Pressing Enter or clicking Next
    // anywhere in Steps 2–5 must never start the transaction.
    if (step !== 6) {
      return;
    }

    if (SUBMISSION_PREVIEW_MODE) {
      setSaveProgressStages(initialSubmissionStages());
      setSaveProgressComplete(false);
      setSaveProgressError("");
      setSubmissionError("");
      setSubmissionLoading(true);
      setSaveProgressOpen(true);

      const waitForPreviewMotion = (milliseconds) => new Promise(
        (resolve) => window.setTimeout(resolve, milliseconds),
      );

      for (let index = 0; index < SUBMISSION_STEPS.length; index += 1) {
        setSaveProgressStages((current) => current.map((item, itemIndex) => ({
          ...item,
          status: itemIndex < index ? "saved" : itemIndex === index ? "reading" : "waiting",
          phase: itemIndex < index ? "Saved successfully" : itemIndex === index ? "Reading…" : "Queued",
        })));
        await waitForPreviewMotion(1800);

        setSaveProgressStages((current) => current.map((item, itemIndex) => itemIndex === index
          ? { ...item, status: "validated", phase: "Validated…" }
          : item));
        await waitForPreviewMotion(1200);

        setSaveProgressStages((current) => current.map((item, itemIndex) => itemIndex === index
          ? { ...item, status: "saved", phase: "Saved successfully" }
          : item));
        await waitForPreviewMotion(700);
      }

      setSubmissionLoading(false);
      setSaveProgressComplete(true);
      return;
    }

    const form = event.currentTarget;
    const stepSixRequiredFields = [
      "contact_name",
      "contact_role",
      "contact_email",
      "contact_phone",
      "preferred_contact",
    ];
    const firstInvalidStepSixField = stepSixRequiredFields
      .map((fieldName) => form.elements.namedItem(fieldName))
      .find((field) => field && !field.checkValidity());

    if (firstInvalidStepSixField) {
      setSubmissionError("Complete every required field in Step 6 before submitting.");
      firstInvalidStepSixField.focus({ preventScroll: true });
      firstInvalidStepSixField.scrollIntoView({ behavior: "smooth", block: "center" });
      firstInvalidStepSixField.reportValidity();
      return;
    }

    const missingConsentIds = [
      !formData.accuracy_consent ? "accuracy_consent" : null,
      !formData.privacy_consent ? "privacy_consent" : null,
    ].filter(Boolean);

    if (missingConsentIds.length > 0) {
      const firstMissingConsentId = missingConsentIds[0];
      const missingLabel = missingConsentIds.length === 2
        ? "the Accuracy and Authorization checkbox and the Privacy Consent checkbox"
        : firstMissingConsentId === "accuracy_consent"
          ? "the Accuracy and Authorization checkbox"
          : "the Privacy Consent checkbox";
      const consentMessage = `Please select ${missingLabel} before submitting for verification.`;

      setConsentAttention(firstMissingConsentId);
      setSubmissionError(consentMessage);
      requestConfirmation({
        title: "Confirmation required",
        message: consentMessage,
        confirmLabel: "Select checkbox",
        cancelLabel: "Close",
        tone: "danger",
        onConfirm: () => {
          const missingConsent = document.getElementById(firstMissingConsentId);
          window.requestAnimationFrame(() => {
            missingConsent?.focus({ preventScroll: true });
            missingConsent?.scrollIntoView({ behavior: "smooth", block: "center" });
          });
        },
      });
      window.setTimeout(() => {
        setConsentAttention((current) => current === firstMissingConsentId ? "" : current);
      }, 3200);
      return;
    }

    if (!event.currentTarget.checkValidity()) {
      event.currentTarget.reportValidity();
      return;
    }

    if (files.length === 0) {
      setFileError("Upload at least one supporting document.");
      goToStep(5);
      return;
    }

    if (!navigator.onLine) {
      setSubmissionError("You are not connected to the internet. Your information remains in the form; reconnect before submitting.");
      return;
    }

    setSaveProgressStages((current) => current.map((item, index) => ({
      ...item,
      status: index === 0 ? "reading" : "waiting",
      phase: index === 0 ? "Checking server connection…" : "Queued",
    })));
    setSaveProgressComplete(false);
    setSaveProgressError("");
    setSaveProgressOpen(true);
    setSubmissionLoading(true);
    setSubmissionError("");

    const connectionCheckController = new AbortController();
    const connectionCheckTimeout = window.setTimeout(
      () => connectionCheckController.abort(),
      10000,
    );
    try {
      // This authenticated endpoint is already used by the form, making it a
      // reliable reachability check without requiring a separate health route.
      await fetch(COMPANY_INFORMATION_ENDPOINT, {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
        cache: "no-store",
        signal: connectionCheckController.signal,
      });
    } catch {
      setIsOnline(false);
      const connectionMessage = "You are not connected to the internet or the verification server cannot be reached. Your information remains in the form.";
      setSaveProgressStages((current) => current.map((item) => ({
        ...item,
        status: "failed",
        phase: "Server connection not confirmed",
      })));
      setSaveProgressError(connectionMessage);
      setSubmissionError(connectionMessage);
      setSubmissionLoading(false);
      return;
    } finally {
      window.clearTimeout(connectionCheckTimeout);
    }

    const payload = new FormData();
    payload.append("verification_type", verificationType);

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "operating_countries" && Array.isArray(value)) {
        value.forEach((countryName) => {
          payload.append("operating_countries[]", countryName);
        });
        return;
      }

      if (typeof value === "boolean") {
        payload.append(key, value ? "1" : "0");
        return;
      }

      payload.append(key, value);
    });

    payload.append("country_name", selectedOptionName(lookupOptions.countries, formData.country_id));
    if (formData.state_id) {
      payload.append("state_name", selectedOptionName(lookupOptions.states, formData.state_id));
    }
    if (formData.city_id) {
      payload.append("city_name", selectedOptionName(lookupOptions.cities, formData.city_id));
    }

    Object.entries(verificationDocuments).forEach(([slotKey, documents]) => {
      documents.forEach((document) => {
        payload.append(`documents[${slotKey}][]`, document.file);
      });
    });

    companyProfiles
      .filter((profile) => profile.type && profile.file)
      .forEach((profile, index) => {
        payload.append(`company_profiles[${index}][type]`, profile.type);
        payload.append(`company_profiles[${index}][file]`, profile.file);
      });

    if (!signatureDataUrl) {
      setSubmissionError("The authorized signatory’s handwritten signature is required.");
      goToStep(4);
      setSignatureOpen(true);
      return;
    }

    payload.append("singatory_image_holder", signatureDataUrl);

    setSaveProgressStages(initialSubmissionStages());
    setSaveProgressComplete(false);
    setSaveProgressError("");
    savedCompanyIdRef.current = null;
    setSavedCompanyId(null);
    setSaveProgressOpen(true);
    setSubmissionLoading(true);
    setSubmissionError("");

    setSaveProgressStages((current) => current.map((item, index) => ({
      ...item,
      status: index === 0 ? "reading" : "waiting",
      phase: index === 0 ? "Server transaction in progress…" : "Queued",
    })));

    const submissionController = new AbortController();
    const abortSubmissionWhenOffline = () => {
      setIsOnline(false);
      submissionController.abort();
    };
    window.addEventListener("offline", abortSubmissionWhenOffline);

    try {
      const response = await fetch(VERIFICATION_ENDPOINT, {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.content || "",
        },
        body: payload,
        signal: submissionController.signal,
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const firstValidationError = Object.values(data.errors || {})[0]?.[0];
        const technicalError = data.debug?.database_error || data.debug?.error;
        const technicalContext = data.debug
          ? [
              data.debug.exception,
              data.debug.sql_state ? `SQLSTATE ${data.debug.sql_state}` : "",
              data.debug.database_error_code
                ? `DB code ${data.debug.database_error_code}`
                : "",
              data.debug.file && data.debug.line
                ? `${data.debug.file}:${data.debug.line}`
                : "",
            ].filter(Boolean).join(" · ")
          : "";
        const visibleError = [
          firstValidationError || data.message || "Submission failed.",
          technicalError,
          technicalContext,
        ].filter(Boolean).join("\n\n");
        throw new Error(
          visibleError,
        );
      }

      const confirmedSteps = new Set(
        Array.isArray(data.saved_steps)
          ? data.saved_steps.map((value) => Number(value))
          : [],
      );
      const confirmedResults = new Set(
        Array.isArray(data.step_results)
          ? data.step_results
              .filter((result) => result?.status === "saved")
              .map((result) => Number(result.step))
          : [],
      );
      const allStepsConfirmed = SUBMISSION_STEPS.every(({ step: stepNumber }) =>
        confirmedSteps.has(stepNumber) && confirmedResults.has(stepNumber),
      );
      const transactionConfirmed = data.transaction_committed === true;
      const committedCompanyId = Number(data.company_id);
      const companyIdConfirmed = Number.isInteger(committedCompanyId)
        && committedCompanyId > 0;

      if (!transactionConfirmed || !allStepsConfirmed || !companyIdConfirmed) {
        throw new Error(
          "The server did not confirm the committed company record and every saved section. Company Details cannot be opened safely.",
        );
      }

      const confirmedOperations = new Map(
        (data.step_results || []).map((result) => [
          Number(result.step),
          result.operation || "Saved and confirmed",
        ]),
      );

      for (let index = 0; index < SUBMISSION_STEPS.length; index += 1) {
        const stepNumber = SUBMISSION_STEPS[index].step;
        setSaveProgressStages((current) => current.map((item, itemIndex) => ({
          ...item,
          status: itemIndex < index ? "saved" : itemIndex === index ? "validated" : "waiting",
          phase: itemIndex < index
            ? current[itemIndex].phase
            : itemIndex === index
              ? confirmedOperations.get(stepNumber)
              : "Queued",
        })));
        await new Promise((resolve) => window.setTimeout(resolve, 520));
        setSaveProgressStages((current) => current.map((item, itemIndex) => ({
          ...item,
          status: itemIndex <= index ? "saved" : "waiting",
          phase: itemIndex <= index
            ? confirmedOperations.get(item.step)
            : "Queued",
        })));
      }

      setSubmissionReference(data.reference || "");
      // Keep an immediate reference for the progress modal callback. Unlike
      // React state, this value is available synchronously to the OK handler.
      savedCompanyIdRef.current = committedCompanyId;
      setSavedCompanyId(committedCompanyId);
      setExistingCompanyId(committedCompanyId);
      setSaveProgressComplete(true);
      setSubmitted(true);
    } catch (error) {
      const professionalMessage = !navigator.onLine || error?.name === "AbortError" || error instanceof TypeError
          ? "You are not connected to the internet. The server did not confirm the transaction; reconnect and try again."
          : error.message || "Submission failed. The server transaction was not confirmed; please try again.";
      setSaveProgressStages((current) => current.map((item) => ({
        ...item,
        status: "failed",
        phase: "Transaction rolled back or not confirmed",
      })));
      setSaveProgressError(professionalMessage);
      setSubmissionError(professionalMessage);
    } finally {
      window.removeEventListener("offline", abortSubmissionWhenOffline);
      setSubmissionLoading(false);
    }
  };

  const reviewSections = [
    {
      stepNumber: 2,
      title: "Account and Legal Identity",
      rows: [
        ["Account type", selectedOptionName(lookupOptions.accountTypes, formData.account_type_id)],
        ["Legal or full name", formData.legal_name],
        ["Trading name", formData.trading_name],
        ["Legal structure", selectedOptionName(lookupOptions.legalStructures, formData.legal_structure_id)],
        ["Sector", selectedOptionName(lookupOptions.sectors, formData.sector_id)],
        ["Industry", selectedOptionName(lookupOptions.industries, formData.industry_id)],
        ["Region", selectedOptionName(lookupOptions.regions, formData.region_id)],
        ["Country", selectedOptionName(lookupOptions.countries, formData.country_id)],
        ["State or province", selectedOptionName(lookupOptions.states, formData.state_id)],
        ["City", selectedOptionName(lookupOptions.cities, formData.city_id)],
        ["Registration or license number", formData.registration_number],
        ["Tax ID / TIN / VAT number", formData.tax_id],
        ["Date established", formData.established_date],
        ["LEI or D-U-N-S number", formData.external_identifier],
        ["Registered address", formData.registered_address],
        ["Postal code", formData.postal_code],
        ["Website", formData.website],
        ["GPS location", formData.gps_location],
      ],
    },
    {
      stepNumber: 3,
      title: "Business and Operating Profile",
      rows: [
        ["Business models", formData.business_model.split("\n").filter(Boolean).join(", ")],
        ["Products or services", formData.products_services],
        ["Countries of operation", formData.operating_countries.join(", ")],
        ["Number of employees", formData.employee_count],
        ["Company stage", formData.company_stage],
        ["Annual revenue", formData.annual_revenue],
        ["Revenue currency", selectedOptionName(lookupOptions.currencies, formData.revenue_currency)],
        ["Fiscal year end", formData.fiscal_year_end],
        ["Public listing or ticker", formData.listing_ticker],
        ["Business description", formData.business_description],
      ],
    },
    {
      stepNumber: 4,
      title: "Ownership, Leadership and Control",
      rows: [
        ["Relationship type", formData.is_ultimate_parent ? "Not applicable — ultimate parent" : (formData.relationship_type ? formData.relationship_type.replaceAll("_", " ") : "Not selected")],
        ...(!formData.is_ultimate_parent && formData.relationship_type ? [["Ultimate company name", formData.ultimate_company_name]] : []),
        ...(!formData.is_ultimate_parent ? [["Ownership percentage", formData.ownership_percentage === "" ? "Not provided" : `${formData.ownership_percentage}%`]] : []),
        ["Is ultimate parent", formData.is_ultimate_parent ? "Yes" : "No"],
        ["Is holding company", formData.is_holding_company ? "Yes" : "No"],
        ["Leadership on board", leadershipRows(formData.beneficial_owners).map(person => `${person.name} — ${person.title} — ${person.email} — ${person.linkedin_url} — ${person.ownership_percentage}%\n${person.bio}`).join("\n\n")],
        ["Authorized signatory", formData.authorized_signatory],
        ["Signatory title", formData.signatory_title],
        ["National ID or passport number", formData.signatory_id_number],
        ["ID expiry date", formData.signatory_id_expiry],
      ],
    },
    {
      stepNumber: 5,
      title: "Verification Documents",
      rows: [
        ["Verification path", verificationType ? verificationType.toUpperCase() : "Not selected"],
        ...Object.entries(verificationDocuments).map(([slotKey, documents]) => [
          (VERIFICATION_DOCUMENTS[verificationType] || []).find(([key]) => key === slotKey)?.[1] || slotKey,
          documents.map((document) => `${document.file.name} — ${document.reviewStatus === "passed" ? "Clarity Review passed" : "Review pending"}`).join("\n"),
        ]),
      ],
    },
  ];

  const preparedStepCount = Object.values(reviewPreparation).filter((status) => status === "success").length;
  const reviewReady = preparedStepCount === 4;
  const reviewChecking = Object.values(reviewPreparation).some((status) => status === "loading");
  const consentsComplete = formData.accuracy_consent && formData.privacy_consent;

  if (showCompanyDetails) {
    return (
      <CompanyDetailsModal
        initialCompanyId={savedCompanyId}
        onAddCompany={(context = null) => {
          setConfirmedCompanyContext(context);
          setShowCompanyDetails(false);
          setSubmitted(false);
          setStep(1);
        }}
      />
    );
  }

  return (
    <main ref={modalTopRef} className="vr-container vr-verification-fullscreen">
      <style>{`
        .vr-verification-dialog-wide { box-sizing:border-box !important; width:min(96vw, 1480px) !important; max-width:min(96vw, 1480px) !important; height:min(92dvh, 960px); max-height:92dvh !important; border-radius:10px !important; }
        .vr-verification-fullscreen { box-sizing:border-box; width:100%; max-width:none; min-height:100%; margin:0; padding-inline:clamp(14px, 2.5vw, 36px); overflow:auto; }
        .vr-verification-fullscreen .vr-stepwrap { width:100%; max-width:none; }
        @media(max-width:900px) { .vr-verification-dialog-wide { width:calc(100vw - 20px) !important; max-width:calc(100vw - 20px) !important; height:calc(100dvh - 20px); max-height:calc(100dvh - 20px) !important; border-radius:8px !important; } }
        @media(max-width:640px) { .vr-verification-fullscreen { min-height:100%; padding-inline:12px; } }
      `}</style>
      <header className="vr-hero vr-gradient">
        <div className="vr-heroContent">
          <span className="vr-heroIcon">
            <ShieldCheck size={28} />
          </span>

          <div>
            <h2>{currentStep.title}</h2>
            <p>{currentStep.description}</p>
          </div>
        </div>

        <div className="vr-crumbs">
          <span className="vr-step">Step {step} of 6</span>
        </div>

        <div
          className="vr-progress"
          role="progressbar"
          aria-label="Verification progress"
          aria-valuemin="1"
          aria-valuemax="8"
          aria-valuenow={step}
        >
          <span style={{ width: `${progress}%` }} />
        </div>
      </header>

      {draftRecoveryWarning && (
        <p className="vr-uploadRule" role="status">
          Some previously entered information could not be restored safely.
          The affected values were reset so the form can continue without an
          error. Please review the fields before continuing.
        </p>
      )}

      {safeStep === 1 && (
        <section className="vr-stepwrap vr-grid">
          <div className="vr-leftColumn">
            <article className="vr-card">
              <div className="vr-sectionHeading">
                <span className="vr-smallIcon">
                  <Building2 size={20} />
                </span>

                <h3>Business and investor verification</h3>
              </div>

              <p className="muted">
                Complete this eight-step process to provide legal, operational,
                ownership, investment, financial and compliance information.
              </p>
            </article>

            <article className="vr-card vr-spacingTop">
              <div className="vr-flow">
                <div className="vr-flowItem">
                  <span className="vr-icon">
                    <FileUp />
                  </span>

                  <strong>Submit</strong>
                  <span className="small">Profile and evidence</span>
                </div>

                <ArrowRight className="vr-arrow" />

                <div className="vr-flowItem">
                  <span className="vr-icon">
                    <SearchCheck />
                  </span>

                  <strong>Review</strong>
                  <span className="small">Identity, KYB and AML</span>
                </div>

                <ArrowRight className="vr-arrow" />

                <div className="vr-flowItem">
                  <span className="vr-icon">
                    <BadgeCheck />
                  </span>

                  <strong>Verify</strong>
                  <span className="small">Receive a decision</span>
                </div>
              </div>

              <div className="vr-btnrow vr-requestButton vr-navigationRight">
                {!companyAvailabilityLoading && existingCompanyId && (
                  <button
                    type="button"
                    className="vr-btn"
                    onClick={() => {
                      setSavedCompanyId(existingCompanyId);
                      setShowCompanyDetails(true);
                    }}
                    aria-label="View previously submitted company"
                    style={{
                      border: "1px solid #bfdbfe",
                      background: "#eff6ff",
                      color: "#1d4ed8",
                    }}
                  >
                    <Eye size={17} aria-hidden="true" />
                    View company
                  </button>
                )}
                <button
                  className="vr-btn"
                  type="button"
                  onClick={() => goToStep(2)}
                >
                  Start verification
                  <ArrowRight size={17} />
                </button>
              </div>
            </article>
          </div>

          <ReviewChecklist
            step={1}
            assistantMessages={assistantMessages}
            assistantOpen={assistantOpen}
            assistantQuestion={assistantQuestion}
            assistantLoading={assistantLoading}
            assistantMessagesRef={assistantMessagesRef}
            assistantPanelRef={assistantPanelRef}
            onAssistantQuestionChange={(event) =>
              setAssistantQuestion(event.target.value)
            }
            onAssistantSubmit={handleAssistantSubmit}
            onAssistantToggle={() => setAssistantOpen((current) => !current)}
          />
        </section>
      )}

      {safeStep >= 2 && safeStep <= 6 && (
        <section className="vr-stepwrap vr-formGrid">
          <article className="vr-card">
            {submitted ? (
              <div className="vr-submittedState">
                <span className="vr-checkwrap">
                  <CheckCircle2 size={58} />
                </span>

                <h2 className="vr-successTitle">
                  Verification request submitted
                </h2>

                <p className="vr-successText">
                  Your request is under review. Status updates will be sent to{" "}
                  <strong>{formData.contact_email}</strong>.
                </p>

                {submissionReference && (
                  <p className="vr-reference">
                    Reference: <strong>{submissionReference}</strong>
                  </p>
                )}

                <button
                  type="button"
                  className="vr-btn"
                  onClick={() => {
                    setSubmitted(false);
                    setStep(1);
                  }}
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {step === 2 && (
                  <Section
                    icon={<Building2 size={20} />}
                    title="Account and legal identity"
                  >
                    {optionError && (
                      <p className="vr-error" role="alert">
                        {optionError}
                      </p>
                    )}

                    <div className="vr-row">
                      <SelectField
                        label="Account type"
                        name="account_type_id"
                        value={formData.account_type_id}
                        required
                        onChange={updateField}
                        options={lookupOptions.accountTypes}
                      />

                      <Field
                        label="Legal Name:"
                        name="legal_name"
                        value={hasConfirmedParent ? confirmedParentName : formData.legal_name}
                        readOnly={hasConfirmedParent}
                        required
                        onChange={updateField}
                      />
                    </div>

                    <div className="vr-row">
                      <Field
                        label="Trading name"
                        name="trading_name"
                        value={formData.trading_name}
                        help
                        onChange={updateField}
                      />

                      <SelectField
                        label="Legal structure"
                        name="legal_structure_id"
                        value={formData.legal_structure_id}
                        required
                        onChange={updateField}
                        options={lookupOptions.legalStructures}
                      />
                    </div>

                    <div className="vr-row">
                      <SelectField
                        label="Sector"
                        name="sector_id"
                        value={formData.sector_id}
                        required
                        onChange={updateField}
                        options={lookupOptions.sectors}
                      />

                      <SelectField
                        label="Industry"
                        name="industry_id"
                        value={formData.industry_id}
                        required
                        onChange={updateField}
                        options={lookupOptions.industries}
                      />
                    </div>

                    <div className="vr-row">
                      <SelectField
                        label="Region"
                        name="region_id"
                        value={formData.region_id}
                        required
                        onChange={updateField}
                        options={lookupOptions.regions}
                      />

                      <SelectField
                        label="Country"
                        name="country_id"
                        value={formData.country_id}
                        required
                        onChange={updateField}
                        options={lookupOptions.countries}
                      />
                    </div>

                    <div className="vr-row">
                      <SelectField
                        label="State or province"
                        name="state_id"
                        value={formData.state_id}
                        onChange={updateField}
                        options={lookupOptions.states}
                      />

                      <SelectField
                        label="City"
                        name="city_id"
                        value={formData.city_id}
                        onChange={updateField}
                        options={lookupOptions.cities}
                      />
                    </div>

                    <div className="vr-row">
                      <Field
                        label="Registration or license number"
                        name="registration_number"
                        value={formData.registration_number}
                        required
                        onChange={updateField}
                      />

                      <Field
                        label="Tax ID / TIN / VAT number"
                        name="tax_id"
                        value={formData.tax_id}
                        help
                        onChange={updateField}
                      />
                    </div>

                    <div className="vr-row">
                      <DateEstablishedField
                        value={formData.established_date}
                        onChange={updateField}
                      />

                      <Field
                        label="LEI or D-U-N-S number"
                        name="external_identifier"
                        value={formData.external_identifier}
                        help
                        onChange={updateField}
                      />
                    </div>

                    <div className="vr-row">
                      <Field
                        label="Registered address"
                        name="registered_address"
                        value={formData.registered_address}
                        required
                        onChange={updateField}
                      />

                      <Field
                        label="Postal code"
                        name="postal_code"
                        value={formData.postal_code}
                        required
                        onChange={updateField}
                      />
                    </div>

                    <div className="vr-row">
                      <Field
                        label="Website"
                        name="website"
                        value={formData.website}
                        type="url"
                        help
                        placeholder="https://example.com"
                        onChange={updateField}
                      />

                      <GpsLocationField
                        value={formData.gps_location}
                        onChange={updateField}
                      />
                    </div>
                  </Section>
                )}

                {step === 3 && (
                  <Section
                    icon={<Landmark size={20} />}
                    title="Business and operating profile"
                    className="vr-business-profile"
                  >
                    <div className="vr-row">
                      <MultiProductsDatalist
                        label="Business models"
                        name="business_model"
                        value={formData.business_model}
                        required
                        options={BUSINESS_MODELS}
                        placeholder="Select multiple business models…"
                        onChange={updateField}
                      />
                      <MultiProductsDatalist
                        key={productSelectionContext}
                        label="Products or services"
                        name="products_services"
                        value={formData.products_services}
                        required
                        options={productSuggestions}
                        loading={productSuggestionsLoading}
                        loadingText="Raymoch Clarity Assistant is suggesting…"
                        placeholder="Select products or services…"
                        onChange={updateField}
                      />
                    </div>

                    <div className="vr-row">
                      <MultiCountryDatalist
                        label="Countries of operation"
                        name="operating_countries"
                        value={formData.operating_countries}
                        options={lookupOptions.countriesAll}
                        required
                        onChange={updateField}
                      />
                      <SelectField
                        label="Number of employees"
                        name="employee_count"
                        value={formData.employee_count}
                        required
                        options={["1–9", "10–49", "50–99", "100–499", "500–999", "1,000+"]}
                        onChange={updateField}
                      />
                    </div>

                    <div className="vr-row">
                      <DatalistField
                        label="Company stage"
                        name="company_stage"
                        value={formData.company_stage}
                        required
                        options={COMPANY_STAGES}
                        placeholder="Pre-revenue, growth, mature..."
                        onChange={updateField}
                      />
                      <Field
                        label="Annual revenue"
                        name="annual_revenue"
                        value={formData.annual_revenue}
                        aria-describedby="annual_revenue_preview"
                        hint={
                          <small
                            id="annual_revenue_preview"
                            aria-live="polite"
                            aria-atomic="true"
                            style={{ display: "block", marginTop: "7px", color: "#3455a0", fontSize: "13px", fontWeight: 600, fontVariantNumeric: "tabular-nums", overflowWrap: "anywhere" }}
                          >
                            <span style={{ display: "block" }}>{formatRevenuePreview(formData.annual_revenue)}</span>
                            <span style={{ display: "block", marginTop: "4px", color: "#64748b", fontSize: "12px", fontWeight: 500, lineHeight: 1.6 }}>
                              {revenueInWords(formData.annual_revenue)}
                            </span>
                          </small>
                        }
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        onChange={updateField}
                      />
                    </div>

                    <div className="vr-row">
                      <SelectField
                        label="Revenue currency"
                        name="revenue_currency"
                        value={formData.revenue_currency}
                        options={lookupOptions.currencies}
                        required
                        onChange={updateField}
                      />
                      <FiscalYearEndField
                        value={formData.fiscal_year_end}
                        onChange={updateField}
                      />
                    </div>

                    <div className="vr-row vr-row-listing">
                      <MultiProductsDatalist
                        label="Public listing or ticker"
                        name="listing_ticker"
                        value={formData.listing_ticker}
                        options={STOCK_EXCHANGES}
                        placeholder="Add an exchange or ticker…"
                        allowCustom
                        compact
                        onChange={updateField}
                      />
                    </div>

                    <BusinessDescriptionEditor
                      value={formData.business_description}
                      required
                      minLength={500}
                      busy={businessDescriptionReviewing}
                      generating={businessDescriptionGenerating}
                      reviewStatus={businessDescriptionReviewStatus}
                      suggestion={businessDescriptionSuggestion}
                      showCharacterCount
                      onAcceptSuggestion={acceptBusinessDescriptionSuggestion}
                      onChange={updateField}
                    />

                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
                      <button
                        type="button"
                        className={`vr-btn ${businessDescriptionGenerated ? "btn-success" : ""}`}
                        disabled={businessDescriptionGenerating}
                        onClick={generateBusinessDescription}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          minWidth: "auto",
                          minHeight: "32px",
                          padding: "6px 11px",
                          borderRadius: "999px",
                          fontSize: "12px",
                          background: businessDescriptionGenerated ? "#16a34a" : "#2563eb",
                          borderColor: businessDescriptionGenerated ? "#16a34a" : "#2563eb",
                          color: "#ffffff",
                        }}
                      >
                        {businessDescriptionGenerated ? (
                          <RefreshCw size={14} strokeWidth={2.5} aria-hidden="true" />
                        ) : (
                          <Sparkles size={14} aria-hidden="true" />
                        )}
                        {businessDescriptionGenerating
                          ? "Generating…"
                          : businessDescriptionGenerated
                            ? "Regenerate"
                            : "Use Raymoch AI"}
                      </button>
                    </div>
                  </Section>
                )}

                {step === 4 && (
                  <Section
                    icon={<UsersRound size={20} />}
                    title="Ownership, leadership and control"
                  >
                    <div style={{ display: "grid", gap: "18px" }}>
                    <div className="vr-row" style={{ alignItems: "start" }}>
                      {[
                        ["is_ultimate_parent", "Is ultimate parent", formData.is_ultimate_parent],
                        ["is_holding_company", "Is holding company", formData.is_holding_company],
                      ].map(([name, label, checked]) => (
                        <div className="vr-field" key={name}>
                          <div className="vr-labelWithHelp">
                            <label htmlFor={name} style={{ display: "inline-flex", alignItems: "center", gap: "10px", minHeight: "38px", cursor: "pointer" }}>
                              <input
                                id={name}
                                name={name}
                                type="checkbox"
                                checked={checked}
                                onChange={updateField}
                                style={{ width: "20px", height: "20px", margin: 0, accentColor: "#2563eb" }}
                              />
                              <span>{label}</span>
                            </label>
                            <RequiredFieldHelp name={name} label={label} />
                          </div>
                        </div>
                      ))}
                    </div>

                    {!formData.is_ultimate_parent && (
                      <div className="vr-row" style={{ alignItems: "start" }}>
                        <SelectField
                          label="Relationship type"
                          name="relationship_type"
                          value={formData.relationship_type}
                          help
                          options={[
                            { id: "parent", name: "Parent" },
                            { id: "subsidiary", name: "Subsidiary" },
                            { id: "associate", name: "Associate" },
                            { id: "affiliate", name: "Affiliate" },
                            { id: "joint_venture", name: "Joint venture" },
                            { id: "sister_company", name: "Sister company" },
                            { id: "controlled_entity", name: "Controlled entity" },
                          ]}
                          onChange={updateField}
                        />

                        <Field
                          label="Ownership percentage"
                          name="ownership_percentage"
                          value={formData.ownership_percentage}
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          placeholder="e.g. 100, 75, or 30"
                          required
                          help
                          onChange={updateField}
                        />
                      </div>
                    )}

                    {!formData.is_ultimate_parent && formData.relationship_type && (
                      <div className="vr-row">
                        <Field
                          label="Ultimate company name"
                          name="ultimate_company_name"
                          value={formData.ultimate_company_name}
                          placeholder="Enter the ultimate company’s legal name"
                          required
                          help
                          fullWidth
                          onChange={updateField}
                        />
                      </div>
                    )}

                    <LeadershipBoardField
                      value={formData.beneficial_owners}
                      onChange={updateField}
                    />

                    <div className="vr-row" style={{ alignItems: "start" }}>
                      <Field
                        label="Authorized signatory"
                        name="authorized_signatory"
                        value={formData.authorized_signatory}
                        required
                        readOnly
                        placeholder="Click to enter a name and sign"
                        title="Open the handwritten signature form"
                        aria-haspopup="dialog"
                        onClick={() => setSignatureOpen(true)}
                        onFocus={() => setSignatureOpen(true)}
                      />

                      <DatalistField
                        label="Signatory title"
                        name="signatory_title"
                        value={formData.signatory_title}
                        required
                        options={SIGNATORY_TITLES}
                        onChange={updateField}
                      />
                    </div>

                    <div className="vr-row" style={{ alignItems: "start" }}>
                      <Field
                        label="National ID or passport number"
                        name="signatory_id_number"
                        value={formData.signatory_id_number}
                        required
                        onChange={updateField}
                      />

                      <IdExpiryDateField
                        value={formData.signatory_id_expiry}
                        onChange={updateField}
                      />
                    </div>
                    </div>
                  </Section>
                )}

                {step === 5 && (
                  <Section
                    icon={<FileCheck2 size={20} />}
                    title="Choose a verification path"
                  >
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "12px" }}>
                      {[
                        ["cti", "Standard Verification (CTI)", "Formal documents → Verified Tier and public badge after human review.", "CTI is the standard verification path for applicants that have formal organization records. It requires registration, tax, bank and director identity documents. Human reviewers check legal existence, ownership, financial-account continuity and accountable leadership. A successful review can produce a verified tier and public verification badge."],
                        ["ats", "Auxiliary Verification (ATS)", "Alternative proofs → eligibility and private signals. Upgrade later.", "ATS is the auxiliary verification path for applicants that cannot yet provide the complete CTI document set. It uses operational-presence evidence, customer or network proof, cash-flow traces and owner identity to establish genuine activity. Its verification signals remain private, and the applicant can upgrade to CTI when formal documents become available."],
                      ].map(([type, title, description, fullDescription]) => {
                        const selected = verificationType === type;
                        return (
                          <div key={type} style={{ position: "relative", padding: "16px 50px 16px 16px", border: `2px solid ${selected ? "#1d4ed8" : "#d5dce7"}`, borderRadius: "14px", background: selected ? "linear-gradient(135deg, #eff6ff, #eef2ff)" : "#fff", boxShadow: selected ? "0 8px 20px rgba(37, 99, 235, .12)" : "0 3px 10px rgba(15, 23, 42, .04)", transition: "all 180ms ease" }}>
                            <label htmlFor={`verification-type-${type}`} style={{ display: "flex", alignItems: "flex-start", gap: "11px", cursor: "pointer" }}>
                              <input id={`verification-type-${type}`} type="checkbox" checked={selected} onChange={() => selectVerificationType(type)} style={{ width: "19px", height: "19px", marginTop: "1px", accentColor: "#2563eb", cursor: "pointer" }} />
                              <span>
                                <strong style={{ display: "block", color: "#0f2747", fontSize: "15px" }}>{title}</strong>
                                <span style={{ display: "block", marginTop: "6px", color: "#475569", fontSize: "12px", lineHeight: 1.5 }}>{description}</span>
                              </span>
                            </label>
                            <VerificationTypeInfo title={title} description={fullDescription} />
                          </div>
                        );
                      })}
                    </div>

                    {verificationType && (
                      <>
                        <div style={{ marginTop: "16px", padding: "18px", border: "1px solid #d5dce7", borderRadius: "16px", background: "#f8fafc" }}>
                          {verificationType === "cti" ? (
                            <>
                              <h3 style={{ margin: "0 0 8px", color: "#0f2747" }}>CTI, Standard Verification</h3>
                              <p style={{ margin: "0 0 7px", color: "#475569", fontSize: "12px" }}>Upload the four required formal documents. Human reviewers validate and compute Tier.</p>
                              <ul style={{ margin: 0, paddingLeft: "20px", color: "#334155", fontSize: "13px", lineHeight: 1.75 }}>
                                <li><strong>Registration:</strong> Confirms legal existence and name continuity. <small>(Examples: Company Registration Certificate · Articles of Incorporation)</small></li>
                                <li><strong>Tax:</strong> Ties the entity to a tax authority; deters shell misuse. <small>(Examples: TIN or PIN · VAT Certificate)</small></li>
                                <li><strong>Bank:</strong> Shows an operational account in the entity name; supports continuity. <small>(Examples: Bank Letter · Recent Bank Statement)</small></li>
                                <li><strong>Directors:</strong> Links accountable people to the entity; KYC or AML baseline. <small>(Examples: National ID · Passport)</small></li>
                              </ul>
                            </>
                          ) : (
                            <>
                              <h3 style={{ margin: "0 0 8px", color: "#0f2747" }}>ATS, Auxiliary Verification</h3>
                              <p style={{ margin: "0 0 7px", color: "#475569", fontSize: "12px" }}>Provide practical proofs to establish activity. You can upgrade to CTI later.</p>
                              <ul style={{ margin: 0, paddingLeft: "20px", color: "#334155", fontSize: "13px", lineHeight: 1.75 }}>
                                <li><strong>Operational Presence:</strong> Evidence of real operations, such as a location, store or equipment. <small>(Examples: Storefront photos · Geo-tagged photos)</small></li>
                                <li><strong>Customer or Network Proof:</strong> Signals demand and counterparties without formal invoices. <small>(Examples: Receipts · Redacted customer list · Partnership emails)</small></li>
                                <li><strong>Cashflow Trace:</strong> Volume and recurrence indicators through wallet, POS or bank traces. <small>(Examples: Wallet CSV · Bank deposit slips · POS summary)</small></li>
                                <li><strong>Owner Identity:</strong> Owner identity for responsibility and recourse. <small>(Examples: Owner National ID · Passport)</small></li>
                              </ul>
                            </>
                          )}
                        </div>

                        <div style={{ marginTop: "16px", padding: "18px", border: "1px solid #d5dce7", borderRadius: "16px", background: "#f8fafc" }}>
                          <h3 style={{ margin: "0 0 5px", color: "#0f2747" }}>Documents</h3>
                          <p style={{ margin: "0 0 13px", color: "#64748b", fontSize: "12px" }}>Upload one or more PDF, JPG, PNG or WEBP files in each required document slot.</p>
                          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "12px" }}>
                            {VERIFICATION_DOCUMENTS[verificationType].map(([slotKey, label, example]) => (
                              <VerificationDocumentSlot
                                key={slotKey}
                                slotKey={slotKey}
                                label={label}
                                example={example}
                                documents={verificationDocuments[slotKey] || []}
                                onSelect={(event) => handleVerificationDocument(slotKey, event)}
                                onRemove={(documentId) => removeVerificationDocument(slotKey, documentId)}
                                onReview={(document) => reviewVerificationDocument(slotKey, document)}
                              />
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {fileError && (
                      <p className="vr-error" role="alert" style={{ marginTop: "12px" }}>
                        {fileError}
                      </p>
                    )}
                  </Section>
                )}

                {step === 6 && (
                  <>
                    <style>{`@keyframes rrSpin{to{transform:rotate(360deg)}}@keyframes finalSubmitPulse{0%,100%{box-shadow:0 0 0 0 rgba(22,163,74,.38)}50%{box-shadow:0 0 0 11px rgba(22,163,74,0)}}@keyframes consentFocusPulse{0%,100%{background:#fff;border-color:#fecaca;box-shadow:0 0 0 0 rgba(239,68,68,0)}50%{background:#fff7ed;border-color:#f59e0b;box-shadow:0 0 0 8px rgba(245,158,11,.2)}}`}</style>
                    <Section
                      icon={<UserRound size={20} />}
                      title="Primary contact"
                    >
                      <div className="vr-row">
                        <Field
                          label="Full name"
                          name="contact_name"
                          value={formData.contact_name}
                          required
                          aria-busy={applicantInfoLoading}
                          title="Loaded from the logged-in user profile and available to edit"
                          onChange={updateField}
                        />

                        <Field
                          label="Job title or relationship"
                          name="contact_role"
                          value={formData.contact_role}
                          required
                          onChange={updateField}
                        />
                      </div>

                      <div className="vr-row">
                        <Field
                          label="Work email"
                          name="contact_email"
                          value={formData.contact_email}
                          type="email"
                          required
                          onChange={updateField}
                        />

                        <Field
                          label="Phone number"
                          name="contact_phone"
                          value={formData.contact_phone}
                          type="tel"
                          required
                          aria-busy={applicantInfoLoading}
                          title="Loaded from the logged-in user profile and available to edit"
                          onChange={updateField}
                        />
                      </div>

                      <div className="vr-row">
                        <SelectField
                          label="Preferred contact method"
                          name="preferred_contact"
                          value={formData.preferred_contact}
                          required
                          onChange={updateField}
                          options={["Email", "Phone", "SMS", "WhatsApp"]}
                        />

                        <Field
                          label="LinkedIn URL"
                          name="referral_source"
                          value={formData.referral_source}
                          onChange={updateField}
                        />
                      </div>

                      <div style={{ marginTop: "18px", padding: "16px", border: "1px solid #dbe3ef", borderRadius: "14px", background: "#f8fafc" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                          <div>
                            <h3 style={{ margin: 0, color: "#0f2747", fontSize: "15px" }}>Company Profile</h3>
                            <p style={{ margin: "5px 0 0", color: "#64748b", fontSize: "12px", lineHeight: 1.5 }}>
                              Add magazines, profiles, articles, company images, and other public company materials.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={addCompanyProfile}
                            style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 12px", border: 0, borderRadius: "9px", background: "#2563eb", color: "#fff", fontSize: "12px", fontWeight: 800, cursor: "pointer" }}
                          >
                            <Plus size={15} /> Add
                          </button>
                        </div>

                        {companyProfiles.length === 0 ? (
                          <p style={{ margin: "13px 0 0", padding: "12px", border: "1px dashed #cbd5e1", borderRadius: "10px", color: "#64748b", fontSize: "12px", textAlign: "center" }}>
                            No company profile files added yet.
                          </p>
                        ) : (
                          <div style={{ display: "grid", gap: "10px", marginTop: "13px" }}>
                            {companyProfiles.map((profile, index) => {
                              const fileInputId = `company-profile-file-${profile.id}`;
                              return (
                                <div key={profile.id} style={{ display: "grid", gridTemplateColumns: "minmax(190px, 1.2fr) minmax(170px, 1fr) auto", alignItems: "end", gap: "10px", padding: "12px", border: "1px solid #dbe3ef", borderRadius: "11px", background: "#fff" }}>
                                  <div className="vr-field">
                                    <label htmlFor={fileInputId} style={{ display: "block", marginBottom: "6px", color: "#334155", fontSize: "12px", fontWeight: 700 }}>
                                      File {index + 1}
                                    </label>
                                    <input
                                      id={fileInputId}
                                      type="file"
                                      accept={COMPANY_PROFILE_FILES}
                                      onChange={(event) => updateCompanyProfileFile(profile.id, event)}
                                      required
                                    />
                                  </div>

                                  <div className="vr-field">
                                    <label htmlFor={`company-profile-type-${profile.id}`} style={{ display: "block", marginBottom: "6px", color: "#334155", fontSize: "12px", fontWeight: 700 }}>
                                      Material type
                                    </label>
                                    <select
                                      id={`company-profile-type-${profile.id}`}
                                      value={profile.type}
                                      required
                                      onChange={(event) => updateCompanyProfileType(profile.id, event.target.value)}
                                    >
                                      <option value="">Select type</option>
                                      {COMPANY_PROFILE_TYPES.map((type) => (
                                        <option key={type} value={type}>{type}</option>
                                      ))}
                                    </select>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => removeCompanyProfile(profile.id)}
                                    aria-label={`Remove company profile item ${index + 1}`}
                                    title="Remove"
                                    style={{ width: "38px", height: "38px", border: "1px solid #fecaca", borderRadius: "9px", background: "#fff1f2", color: "#b91c1c", fontSize: "20px", fontWeight: 800, cursor: "pointer" }}
                                  >
                                    ×
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {applicantInfoError && (
                        <p className="vr-error" role="alert" style={{ marginTop: "12px" }}>
                          {applicantInfoError}
                        </p>
                      )}
                    </Section>

                    <Section
                      icon={<RefreshCw size={20} />}
                      title="Review submitted information"
                    >
                      <div style={{ padding: "14px", border: "1px solid #dbe3ef", borderRadius: "14px", background: "#f8fafc" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                          <div>
                            <strong style={{ color: "#0f2747" }}>Validating Steps 2–5</strong>
                            <span style={{ display: "block", marginTop: "3px", color: "#64748b", fontSize: "11px" }}>{preparedStepCount} of 4 sections passed validation</span>
                          </div>
                          <button type="button" title="Refresh the review summary" aria-label="Refresh review summary" onClick={() => setReviewPreparationRun((current) => current + 1)} style={{ display: "grid", placeItems: "center", width: "34px", height: "34px", border: "1px solid #bfdbfe", borderRadius: "10px", background: "#eff6ff", color: "#2563eb", cursor: "pointer" }}>
                            <RefreshCw size={17} style={reviewChecking ? { animation: "rrSpin .9s linear infinite" } : undefined} />
                          </button>
                        </div>
                        <div role="progressbar" aria-label="Review preparation progress" aria-valuemin="0" aria-valuemax="4" aria-valuenow={preparedStepCount} style={{ height: "8px", marginTop: "12px", overflow: "hidden", borderRadius: "999px", background: "#dbeafe" }}>
                          <span style={{ display: "block", width: `${preparedStepCount * 25}%`, height: "100%", borderRadius: "inherit", background: reviewReady ? "#16a34a" : "linear-gradient(90deg, #2563eb, #6366f1)", transition: "width 420ms ease" }} />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "7px", marginTop: "12px" }}>
                          {[2, 3, 4, 5].map((stepNumber) => (
                            <div key={stepNumber} style={{ display: "flex", alignItems: "center", gap: "7px", color: reviewPreparation[stepNumber] === "success" ? "#15803d" : reviewPreparation[stepNumber] === "invalid" ? "#b91c1c" : "#64748b", fontSize: "11px", fontWeight: 700 }}>
                              {reviewPreparation[stepNumber] === "success" ? <CheckCircle2 size={15} /> : reviewPreparation[stepNumber] === "invalid" ? <XCircle size={15} /> : <RefreshCw size={14} style={reviewPreparation[stepNumber] === "loading" ? { animation: "rrSpin .9s linear infinite" } : undefined} />}
                              Step {stepNumber} {reviewPreparation[stepNumber] === "success" ? "validation successful" : reviewPreparation[stepNumber] === "invalid" ? "needs attention" : reviewPreparation[stepNumber] === "loading" ? "is checking…" : "is waiting"}
                            </div>
                          ))}
                        </div>
                      </div>

                      {!isOnline && (
                        <p role="alert" style={{ margin: "12px 0 0", padding: "11px 13px", border: "1px solid #fecaca", borderRadius: "10px", background: "#fef2f2", color: "#b91c1c", fontSize: "12px", fontWeight: 700 }}>
                          Internet connection unavailable. Review remains available, but final submission is disabled until connectivity returns.
                        </p>
                      )}

                      <div style={{ display: "grid", gap: "10px", marginTop: "14px" }}>
                        {reviewSections.map((section, index) => (
                          <ReviewAccordion
                            key={section.stepNumber}
                            {...section}
                            defaultOpen={index === 0}
                            onEdit={() => goToStep(section.stepNumber)}
                          />
                        ))}
                      </div>
                    </Section>

                    <Section
                      icon={<CheckCircle2 size={20} />}
                      title="Confirmation and acknowledgment"
                    >
                      <div className="vr-consent" style={consentAttention === "accuracy_consent" ? { border: "1px solid #f59e0b", borderRadius: "10px", animation: "consentFocusPulse .85s ease-in-out 3" } : undefined}>
                        <input
                          id="accuracy_consent"
                          name="accuracy_consent"
                          type="checkbox"
                          required
                          checked={formData.accuracy_consent}
                          onChange={(event) => {
                            updateField(event);
                            setConsentAttention("");
                            setSubmissionError("");
                          }}
                        />

                        <div className="vr-consentLabelWithHelp">
                          <label htmlFor="accuracy_consent">
                            I confirm that the information and documents are
                            accurate, complete and current. I am authorized to
                            submit them and consent to identity, KYB/KYC, AML,
                            sanctions and document checks. *
                          </label>
                          <RequiredFieldHelp
                            name="accuracy_consent"
                            label="Accuracy and authorization confirmation"
                          />
                        </div>
                      </div>

                      <div className="vr-consent" style={consentAttention === "privacy_consent" ? { border: "1px solid #f59e0b", borderRadius: "10px", animation: "consentFocusPulse .85s ease-in-out 3" } : undefined}>
                        <input
                          id="privacy_consent"
                          name="privacy_consent"
                          type="checkbox"
                          required
                          checked={formData.privacy_consent}
                          onChange={(event) => {
                            updateField(event);
                            setConsentAttention("");
                            setSubmissionError("");
                          }}
                        />

                        <div className="vr-consentLabelWithHelp">
                          <label htmlFor="privacy_consent">
                            I acknowledge the privacy notice and consent to the
                            secure processing and retention of the submitted
                            information. *
                          </label>
                          <RequiredFieldHelp
                            name="privacy_consent"
                            label="Privacy acknowledgment and consent"
                          />
                        </div>
                      </div>
                    </Section>
                  </>
                )}

                <div className="vr-stepNavigation">
                  {step > 1 && (
                    <button
                      className="vr-btn vr-btnGhost"
                      type="button"
                      onClick={handleBack}
                    >
                      <ArrowLeft size={17} />
                      Back
                    </button>
                  )}

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginLeft: "auto",
                    }}
                  >
                    <button
                      className="vr-btn vr-btnGhost"
                      type="button"
                      onClick={handleClearForm}
                      style={{
                        padding: "7px 10px",
                        fontSize: "12px",
                        minHeight: "auto",
                      }}
                    >
                      Clear form
                    </button>

                    {step < 6 ? (
                      <button
                        className="vr-btn"
                        type="button"
                        disabled={businessDescriptionReviewing}
                        onClick={handleNext}
                      >
                        {businessDescriptionReviewing ? "Reviewing…" : "Next"}
                        <ArrowRight size={17} />
                      </button>
                    ) : (
                      <button
                        className="vr-btn"
                        type="submit"
                        formNoValidate
                        disabled={submissionLoading}
                        title={SUBMISSION_PREVIEW_MODE ? "Open the submission design preview; no data will be sent" : !isOnline ? "Reconnect to the internet before submitting" : !consentsComplete ? "Complete both confirmations before submitting" : "Submit for Verification"}
                        style={SUBMISSION_PREVIEW_MODE ? { background: "#2563eb", borderColor: "#2563eb" } : consentsComplete && reviewReady && isOnline ? { background: "#16a34a", borderColor: "#16a34a", animation: "finalSubmitPulse 1.45s ease-in-out infinite" } : undefined}
                      >
                        {submissionLoading
                          ? "Submitting…"
                          : "Submit for Verification"}
                        <CheckCircle2 size={17} />
                      </button>
                    )}
                  </div>
                </div>

                {submissionError && (
                  <p className="vr-error" role="alert">
                    {submissionError}
                  </p>
                )}
              </form>
            )}
          </article>

          {!submitted && (
            <ReviewChecklist
              step={step}
              assistantMessages={assistantMessages}
              assistantOpen={assistantOpen}
              assistantQuestion={assistantQuestion}
              assistantLoading={assistantLoading}
              assistantMessagesRef={assistantMessagesRef}
              assistantPanelRef={assistantPanelRef}
              onAssistantQuestionChange={(event) =>
                setAssistantQuestion(event.target.value)
              }
              onAssistantSubmit={handleAssistantSubmit}
              onAssistantToggle={() =>
                setAssistantOpen((current) => !current)
              }
            />
          )}
        </section>
      )}

      {documentReview.open && (
        <div role="dialog" aria-modal="true" aria-labelledby="rr-review-title" style={{ position: "fixed", inset: 0, zIndex: 1200, display: "grid", placeItems: "center", padding: "18px", background: "rgba(15, 23, 42, .56)", backdropFilter: "blur(4px)", animation: `${documentReview.closing ? "rrFadeOut" : "rrFadeIn"} 180ms ease-out forwards` }}>
          <style>{`@keyframes rrFadeIn{from{opacity:0}to{opacity:1}}@keyframes rrFadeOut{from{opacity:1}to{opacity:0}}@keyframes rrSpin{to{transform:rotate(360deg)}}@keyframes rrBreathe{0%,100%{opacity:.45}50%{opacity:1}}`}</style>
          <div style={{ width: "min(520px, 100%)", border: "1px solid #dbe3ef", borderRadius: "18px", background: "#fff", boxShadow: "0 24px 70px rgba(15, 23, 42, .28)", overflow: "hidden", animation: "rrFadeIn 240ms ease-out" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", padding: "15px 17px", borderBottom: "1px solid #e2e8f0", background: "linear-gradient(135deg, #eff6ff, #f5f3ff)" }}>
              <div>
                <strong id="rr-review-title" style={{ display: "block", color: "#0f2747" }}>Raymoch Clarity Review</strong>
                <span style={{ display: "block", maxWidth: "390px", marginTop: "3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#64748b", fontSize: "11px" }}>{documentReview.fileName}</span>
              </div>
              <button type="button" disabled={documentReview.loading} onClick={closeDocumentReview} aria-label="Close document review" style={{ width: "30px", height: "30px", border: 0, borderRadius: "8px", background: "rgba(255,255,255,.8)", color: "#475569", cursor: documentReview.loading ? "not-allowed" : "pointer", fontSize: "19px" }}>×</button>
            </div>

            <div style={{ minHeight: "230px", padding: "22px" }}>
              {documentReview.loading ? (
                <div role="status" aria-live="polite" style={{ display: "grid", placeItems: "center", alignContent: "center", minHeight: "190px", gap: "14px", color: "#2563eb" }}>
                  <span style={{ width: "46px", height: "46px", border: "4px solid #dbeafe", borderTopColor: "#2563eb", borderRadius: "50%", animation: "rrSpin .85s linear infinite" }} />
                  <strong style={{ animation: "rrBreathe 1.5s ease-in-out infinite" }}>Reading and validating the document…</strong>
                  <span style={{ color: "#64748b", fontSize: "12px" }}>Checking readability, document type, coherence and extracted text.</span>
                </div>
              ) : documentReview.error ? (
                <div style={{ padding: "14px", borderRadius: "12px", background: "#fef2f2", color: "#b91c1c" }}>{documentReview.error}</div>
              ) : documentReview.result && (
                <div style={{ display: "grid", gap: "12px", animation: "rrFadeIn 260ms ease-out" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", color: documentReview.result.valid ? "#15803d" : "#b91c1c" }}>
                    {documentReview.result.valid ? <CheckCircle2 size={23} /> : <XCircle size={23} />}
                    <strong>{documentReview.result.valid ? "Review passed" : "Review requires attention"}</strong>
                  </div>
                  <p style={{ margin: 0, color: "#334155", lineHeight: 1.65 }}>{documentReview.result.message}</p>
                  {documentReview.result.extracted_text && (
                    <div style={{ maxHeight: "145px", overflow: "auto", padding: "12px", border: "1px solid #e2e8f0", borderRadius: "10px", background: "#f8fafc", color: "#475569", fontSize: "12px", lineHeight: 1.55 }}>
                      <strong style={{ display: "block", marginBottom: "5px", color: "#0f2747" }}>Recognized information</strong>
                      {documentReview.result.extracted_text}
                    </div>
                  )}
                  {Array.isArray(documentReview.result.issues) && documentReview.result.issues.length > 0 && (
                    <ul style={{ margin: 0, paddingLeft: "19px", color: "#b91c1c", fontSize: "12px", lineHeight: 1.6 }}>
                      {documentReview.result.issues.map((issue) => <li key={issue}>{issue}</li>)}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {!documentReview.loading && (documentReview.result || documentReview.error) && (
              <div style={{ display: "flex", justifyContent: "flex-end", padding: "12px 17px 15px", borderTop: "1px solid #e2e8f0", background: "#f8fafc" }}>
                <button
                  type="button"
                  onClick={closeDocumentReview}
                  autoFocus
                  style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "7px", minWidth: "92px", minHeight: "38px", padding: "8px 16px", border: "1px solid #1d4ed8", borderRadius: "9px", background: "linear-gradient(135deg, #2563eb, #1d4ed8)", color: "#fff", fontSize: "13px", fontWeight: 800, cursor: "pointer", boxShadow: "0 5px 14px rgba(37, 99, 235, .22)" }}
                >
                  <CheckCircle2 size={16} aria-hidden="true" />
                  OK
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <ConfirmationDialog
        open={confirmation.open}
        title={confirmation.title}
        message={confirmation.message}
        confirmLabel={confirmation.confirmLabel}
        cancelLabel={confirmation.cancelLabel}
        tone={confirmation.tone}
        onConfirm={handleConfirmedAction}
        onCancel={closeConfirmation}
      />

      <SubmissionProgressModal
        open={saveProgressOpen}
        stages={saveProgressStages}
        complete={saveProgressComplete}
        error={saveProgressError}
        previewMode={SUBMISSION_PREVIEW_MODE}
        onClose={() => {
          if (submissionLoading) return;
          setSaveProgressOpen(false);
        }}
        onConfirm={() => {
          setSaveProgressOpen(false);
          const companyIdToOpen = savedCompanyIdRef.current || savedCompanyId;
          if (companyIdToOpen) {
            setSavedCompanyId(companyIdToOpen);
            setShowCompanyDetails(true);
          }
        }}
      />

      <SignatureDialog
        open={signatureOpen}
        initialName={formData.authorized_signatory}
        initialSignature={signatureDataUrl}
        onCancel={() => setSignatureOpen(false)}
        onSave={({ name, dataUrl }) => {
          setFormData((current) => ({
            ...sanitizeVerificationFormData(current).formData,
            authorized_signatory: name,
          }));
          setSignatureDataUrl(dataUrl);
          setSignatureOpen(false);
        }}
      />
    </main>
  );
}

function formatRevenuePreview(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  // Group the typed digits without rounding the amount or removing decimals.
  if (/^\d+(?:\.\d*)?$/.test(raw)) {
    const [whole, fraction] = raw.split(".");
    const grouped = whole.replace(/^0+(?=\d)/, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `Amount entered: ${grouped}${fraction === undefined ? "" : `.${fraction}`}`;
  }
  const amount = Number(raw);
  return Number.isFinite(amount) && amount >= 0
    ? `Amount entered: ${amount.toLocaleString("en-US", { maximumFractionDigits: 20 })}`
    : "";
}

function revenueInWords(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  const match = raw.match(/^(\d+)(?:\.(\d*))?(?:e\+?(\d+))?$/i);
  if (!match) return "";
  let whole = match[1];
  let fraction = match[2] || "";
  // Expand positive scientific notation without rounding monetary digits.
  const exponent = Number(match[3] || 0);
  if (exponent > 100) return "Amount is too large to display in words.";
  if (exponent) {
    const digits = whole + fraction;
    const split = whole.length + exponent;
    whole = digits.slice(0, split).padEnd(split, "0");
    fraction = digits.slice(split);
  }
  whole = whole.replace(/^0+(?=\d)/, "");
  const units = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
  const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
  const scales = ["", "thousand", "million", "billion", "trillion", "quadrillion", "quintillion", "sextillion", "septillion", "octillion", "nonillion", "decillion"];
  const chunkWords = (number) => {
    const words = [];
    if (number >= 100) {
      words.push(`${units[Math.floor(number / 100)]} hundred`);
      number %= 100;
      if (number) words.push("and");
    }
    if (number >= 20) words.push(tens[Math.floor(number / 10)] + (number % 10 ? `-${units[number % 10]}` : ""));
    else if (number) words.push(units[number]);
    return words.join(" ");
  };
  if (whole.length > scales.length * 3) return "Amount is too large to display in words.";
  const groups = [];
  let scale = 0;
  for (let end = whole.length; end > 0; end -= 3, scale += 1) {
    const amount = Number(whole.slice(Math.max(0, end - 3), end));
    if (amount) groups.unshift({ scale, words: `${chunkWords(amount)}${scales[scale] ? ` ${scales[scale]}` : ""}` });
  }
  let text = groups.length ? groups.map((group, index) => (
    index > 0 && group.scale === 0 ? `and ${group.words}` : group.words
  )).join(" ") : "zero";
  if (fraction) text += ` point ${fraction.split("").map(digit => units[Number(digit)]).join(" ")}`;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function leadershipRows(value) {
  if (!value) return [];
  try {
    const rows = JSON.parse(value);
    if (Array.isArray(rows)) {
      return rows
        .filter((row) => row && typeof row === "object")
        .map((row) => ({
          name: String(row.name ?? ""),
          title: String(row.title ?? ""),
          bio: String(row.bio ?? ""),
          email: String(row.email ?? ""),
          linkedin_url: String(row.linkedin_url ?? ""),
          ownership_percentage: String(row.ownership_percentage ?? ""),
        }));
    }
  } catch { /* Keep existing text available for editing. */ }
  return [{
    name: String(value),
    title: "",
    bio: "",
    email: "",
    linkedin_url: "",
    ownership_percentage: "",
  }];
}

function LeadershipBoardField({ value, onChange }) {
  const storedRows = leadershipRows(value);
  const emptyMember = () => ({
    name: "",
    title: "",
    bio: "",
    email: "",
    linkedin_url: "",
    ownership_percentage: "",
  });
  const rows = storedRows.length ? storedRows : [emptyMember()];
  const emit = (next) => onChange({ target: {
    name: "beneficial_owners", type: "text",
    value: next.length ? JSON.stringify(next) : "",
  } });
  const update = (index, field, text) => emit(rows.map((row, position) => position === index ? { ...row, [field]: text } : row));

  return (
    <fieldset className="vr-leadership-board">
      <style>{`
        .vr-leadership-board { min-width:0; margin:0; padding:18px; border:1px solid #dbe3ef; border-radius:13px; background:#f8fafc; }
        .vr-leadership-board legend { display:flex; align-items:center; gap:8px; padding:0 7px; color:#17233b; font-size:15px; font-weight:700; }
        .vr-leadership-row { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)) auto; align-items:end; gap:12px; margin-bottom:14px; padding:14px; border:1px solid #dbe3ef; border-radius:11px; background:#fff; }
        .vr-leadership-row label { display:flex; flex-direction:column; gap:7px; color:#475569; font-size:12px; }
        .vr-leadership-row :is(input,textarea) { box-sizing:border-box; min-width:0; width:100%; min-height:42px; padding:10px 12px; border:1px solid #cbd5e1; border-radius:9px; background:white; color:#17233b; font:inherit; }
        .vr-leadership-row textarea { min-height:88px; resize:vertical; }
        .vr-leadership-row .vr-leadership-bio { grid-column:1 / -2; }
        .vr-leadership-row button { grid-column:3; grid-row:1 / span 3; align-self:center; display:inline-flex; align-items:center; justify-content:center; min-height:42px; min-width:42px; border:1px solid #e2e8f0; border-radius:9px; background:#fff; color:#64748b; cursor:pointer; }
        .vr-leadership-add { display:inline-flex; align-items:center; gap:7px; min-height:42px; padding:9px 14px; border:1px solid #bfd0ef; border-radius:9px; background:#eef4ff; color:#3455a0; font-weight:650; cursor:pointer; }
        .vr-leadership-board :is(input,textarea,button):focus-visible { outline:2px solid #3455a0; outline-offset:2px; }
        @media(max-width:650px) { .vr-leadership-row { grid-template-columns:minmax(0,1fr) auto; } .vr-leadership-row label,.vr-leadership-row .vr-leadership-bio { grid-column:1; } .vr-leadership-row button { grid-column:2; grid-row:1 / span 6; } }
      `}</style>
      <legend><UsersRound size={18} aria-hidden="true" /> Leadership on board</legend>
      <input type="hidden" name="beneficial_owners" value={value ?? ""} />
      <datalist id="leadership-signatory-titles">
        {SIGNATORY_TITLES.map((title) => (
          <option key={title} value={title} />
        ))}
      </datalist>
      {rows.map((person, index) => (
        <div className="vr-leadership-row" key={index}>
          <label htmlFor={`leadership-name-${index}`}>Name
            <input id={`leadership-name-${index}`} value={person.name} required minLength={2} aria-label={`Board member ${index + 1} name`} placeholder="Full name" onChange={event => update(index, "name", event.target.value)} />
          </label>
          <label htmlFor={`leadership-title-${index}`}>Title
            <input
              id={`leadership-title-${index}`}
              list="leadership-signatory-titles"
              value={person.title}
              required
              minLength={2}
              autoComplete="off"
              aria-label={`Board member ${index + 1} title`}
              placeholder="Select or type a title"
              onChange={event => update(index, "title", event.target.value)}
            />
          </label>
          <label htmlFor={`leadership-email-${index}`}>Email
            <input id={`leadership-email-${index}`} type="email" value={person.email} required aria-label={`Board member ${index + 1} email`} placeholder="name@company.com" onChange={event => update(index, "email", event.target.value)} />
          </label>
          <label htmlFor={`leadership-linkedin-${index}`}>LinkedIn URL
            <input id={`leadership-linkedin-${index}`} type="url" pattern="https?://([a-z]{2,3}\.)?(www\.)?linkedin\.com/.+" value={person.linkedin_url} aria-label={`Board member ${index + 1} LinkedIn URL`} placeholder="https://www.linkedin.com/in/name" title="Enter a complete LinkedIn URL" onChange={event => update(index, "linkedin_url", event.target.value)} />
          </label>
          <label htmlFor={`leadership-ownership-${index}`}>Ownership percentage
            <input id={`leadership-ownership-${index}`} type="number" min="0" max="100" step="0.01" value={person.ownership_percentage} aria-label={`Board member ${index + 1} ownership percentage`} placeholder="0–100" onChange={event => update(index, "ownership_percentage", event.target.value)} />
          </label>
          <label className="vr-leadership-bio" htmlFor={`leadership-bio-${index}`}>Bio
            <textarea id={`leadership-bio-${index}`} value={person.bio} minLength={20} aria-label={`Board member ${index + 1} bio`} placeholder="Optional biography (at least 20 characters if provided)" onChange={event => update(index, "bio", event.target.value)} />
          </label>
          <button type="button" aria-label={`Remove board member ${index + 1}`} onClick={() => emit(rows.filter((_, position) => position !== index))}><XCircle size={18} aria-hidden="true" /></button>
        </div>
      ))}
      <button type="button" className="vr-leadership-add" onClick={() => emit([...rows, emptyMember()])}><Plus size={17} aria-hidden="true" /> Add person</button>
    </fieldset>
  );
}
