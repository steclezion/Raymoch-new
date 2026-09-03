import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
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
  MessageCircle,
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
const COMPANY_INFORMATION_ENDPOINT = `${API_BASE_URL}/api/company-information`;

const REVIEWABLE_DOCUMENT_FILES = ".pdf,.jpg,.jpeg,.png,.webp";

const FIELD_HELP_EVENT = "verification:ask-field-help";

const REQUIRED_FIELD_HELP = {
  account_type_id: "The type of account being verified, such as a business, institution, or investor account. Choose the option that best matches how this account will be used.",
  legal_name: "The official name shown on government-issued identity, incorporation, registration, or licensing records.",
  sector_id: "The broad area of the economy in which the organization operates.",
  industry_id: "The more specific line of business within the selected sector.",
  website: "The applicant’s official public website. Enter the complete address, including https://, so it can be used to verify the organization’s identity and activities.",
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
  has_parent_company: "Select the checkbox only when another entity ultimately owns or controls the applicant. Then enter that parent entity’s complete legal name as it appears in official records.",
  ownership_type: "The general ownership classification, such as privately held, publicly traded, state-owned, cooperative, or nonprofit.",
  beneficial_owners: "The individuals who ultimately own or control the applicant. Include the identifying and ownership details requested by your jurisdiction.",
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

  parent_company: "",
  has_parent_company: false,
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
      <style>{`
        .vr-established-date { display:flex; align-items:center; gap:8px; padding:5px 6px 5px 12px; border:1px solid #cbd5e1; border-radius:11px; background:#f8fafc; transition:border-color .15s,box-shadow .15s; }
        .vr-established-date:focus-within { border-color:#3455a0; box-shadow:0 0 0 3px #3455a01a; }
        .vr-established-date input[type="date"] { box-sizing:border-box; flex:1; min-width:0; width:100%; min-height:36px; margin:0; padding:5px 0; border:0; border-radius:0; background:transparent; color:#17233b; font:inherit; box-shadow:none; }
        .vr-established-date button { display:inline-flex; flex-shrink:0; align-items:center; justify-content:center; width:42px; height:42px; border:1px solid #d8e3f6; border-radius:9px; background:#edf2fc; color:#3455a0; cursor:pointer; }
        .vr-established-date button:hover { background:#dfe9fc; }
        .vr-established-date button:focus-visible { outline:2px solid #3455a0; outline-offset:2px; }
        .vr-established-date-help { display:block; margin-top:7px; color:#64748b; font-size:11px; line-height:1.5; }
      `}</style>
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

          return (
            <option key={optionValue} value={optionValue}>
              {optionLabel}
            </option>
          );
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
                ×
              </button>
            </li>
          ))}
        </ul>
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
                    display: "inline-grid",
                    placeItems: "center",
                    width: "28px",
                    height: "25px",
                    border: `1px solid ${reviewPassed ? "#22c55e" : needsReview ? "#fca5a5" : "#f87171"}`,
                    borderRadius: "7px",
                    background: reviewPassed
                      ? "#dcfce7"
                      : needsReview
                        ? "linear-gradient(135deg, #fee2e2, #fef9c3)"
                        : "#fef2f2",
                    color: reviewPassed ? "#15803d" : "#b91c1c",
                    fontSize: "10px",
                    fontWeight: 900,
                    cursor: "pointer",
                    animation: needsReview ? "rrHeartbeat 1.35s ease-in-out infinite" : undefined,
                    transformOrigin: "center",
                  }}
                >
                  {reviewPassed ? <CheckCircle2 size={16} strokeWidth={3} aria-hidden="true" /> : "RR"}
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

function Section({ icon, title, children }) {
  return (
    <section className="vr-innerCard vr-stepSection">
      <div className="vr-sectionHeading">
        <span className="vr-smallIcon">{icon}</span>
        <h3>{title}</h3>
      </div>

      {children}
    </section>
  );
}

function ReviewAccordion({ stepNumber, title, rows, defaultOpen = false }) {
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
  const stepSpecificTips = {
    2: "Make sure the legal name and registration number match official records.",
    3: "Use the most recent operating and revenue information available.",
    4: "List every beneficial owner and controller required by your jurisdiction.",
    5: "Upload clear, readable and unexpired documents.",
    6: "Confirm that the applicant has authorized the named representative.",
  };

  return (
    <aside className="vr-card vr-sticky vr-reviewChecklist">
      <div className="vr-sectionHeading">
        <span className="vr-smallIcon">
          <Lightbulb size={20} />
        </span>

        <h3>Review checklist</h3>
      </div>

      <ul className="vr-infoList">
        <li>Complete every field marked with an asterisk.</li>
        <li>{stepSpecificTips[step]}</li>
        <li>Names and identification numbers must match the documents.</li>
        <li>Provide accurate and current information.</li>
        <li>You can use Back without losing information already entered.</li>
      </ul>

      <hr className="vr-hr" />

      <h3>Current step</h3>

      <p className="small">
        Step {step} of 6: {stepMeta[step].title}
      </p>

      <hr className="vr-hr" />

      <h3>Privacy reminder</h3>

      <p className="small">
        Banking and identity information must be transmitted and stored using
        appropriate encryption and access controls.
      </p>

      <div ref={assistantPanelRef} tabIndex="-1" className={`vr-assistant ${assistantOpen ? "is-open" : ""}`}>
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
  { step: 2, label: "Account and legal identity" },
  { step: 3, label: "Business and operating profile" },
  { step: 4, label: "Ownership and authorized signatory" },
  { step: 5, label: "Verification documents" },
  { step: 6, label: "Applicant contact and consent" },
];

const initialSubmissionStages = () =>
  SUBMISSION_STEPS.map((item) => ({ ...item, status: "waiting" }));

function SubmissionProgressModal({ open, stages, complete, error, onClose, onConfirm }) {
  if (!open) return null;

  return (
    <div className="vr-saveOverlay" role="dialog" aria-modal="true" aria-labelledby="vr-save-title">
      <style>{`
        @keyframes vrSaveSpin { to { transform: rotate(360deg); } }
        @keyframes vrSavePulse { 0%,100% { opacity:.52; transform:scale(.96) } 50% { opacity:1; transform:scale(1) } }
        .vr-saveOverlay{position:fixed;inset:0;z-index:3000;display:grid;place-items:center;padding:18px;background:rgba(8,22,45,.58);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}
        .vr-saveModal{width:min(620px,100%);max-height:calc(100vh - 36px);overflow:auto;border:1px solid rgba(255,255,255,.76);border-radius:24px;background:#fff;box-shadow:0 30px 90px rgba(8,22,45,.34)}
        .vr-saveHead{padding:25px 27px 18px;background:linear-gradient(135deg,#eef6ff,#f8fafc);border-bottom:1px solid #dbe7f3}
        .vr-saveHeadLine{display:flex;align-items:center;gap:12px}.vr-saveHead h2{margin:0;color:#102a4c;font-size:22px}.vr-saveHead p{margin:8px 0 0;color:#607087;line-height:1.55}
        .vr-saveSpinner{width:28px;height:28px;flex:0 0 auto;border:3px solid #bfdbfe;border-top-color:#2563eb;border-radius:50%;animation:vrSaveSpin .8s linear infinite}
        .vr-saveBody{padding:22px 27px 26px}.vr-saveSteps{display:grid;gap:10px;margin:0;padding:0;list-style:none}
        .vr-saveStep{width:88%;display:flex;align-items:center;gap:13px;padding:11px 14px;border:1px solid #e2e8f0;border-radius:15px;background:#f8fafc;transition:.25s ease}
        .vr-saveStep:nth-child(even){margin-left:12%}.vr-saveStep.is-active{border-color:#93c5fd;background:#eff6ff}.vr-saveStep.is-saved{border-color:#86efac;background:#f0fdf4}.vr-saveStep.is-failed{border-color:#fca5a5;background:#fef2f2}
        .vr-saveRing{position:relative;width:40px;height:40px;flex:0 0 auto}.vr-saveRing svg{width:40px;height:40px;transform:rotate(-90deg)}.vr-saveRing circle{fill:none;stroke-width:4}.vr-saveRing .track{stroke:#dbe5f0}.vr-saveRing .value{stroke:#2563eb;stroke-linecap:round;stroke-dasharray:100;stroke-dashoffset:28;animation:vrSaveSpin 1.15s linear infinite;transform-origin:center}.vr-saveStep.is-saved .value{stroke:#16a34a;stroke-dashoffset:0;animation:none}.vr-saveStep.is-failed .value{stroke:#dc2626;stroke-dashoffset:0;animation:none}
        .vr-saveIcon{position:absolute;inset:0;display:grid;place-items:center;color:#64748b}.is-active .vr-saveIcon{color:#2563eb;animation:vrSavePulse 1.2s ease-in-out infinite}.is-saved .vr-saveIcon{color:#15803d}.is-failed .vr-saveIcon{color:#b91c1c}
        .vr-saveCopy strong{display:block;color:#172b4d}.vr-saveCopy span{display:block;margin-top:2px;color:#64748b;font-size:12px}.vr-saveNotice{margin-top:18px;padding:14px 15px;border-radius:14px;line-height:1.5}.vr-saveNotice.success{background:#ecfdf5;color:#166534;border:1px solid #86efac}.vr-saveNotice.error{background:#fef2f2;color:#991b1b;border:1px solid #fecaca}.vr-saveActions{display:flex;justify-content:flex-end;margin-top:17px}.vr-saveActions button{border:0;border-radius:11px;padding:11px 20px;background:#163d69;color:#fff;font-weight:700;cursor:pointer}
      `}</style>
      <section className="vr-saveModal">
        <header className="vr-saveHead">
          <div className="vr-saveHeadLine">
            {!complete && !error && <span className="vr-saveSpinner" aria-hidden="true" />}
            {complete && <CheckCircle2 size={30} color="#16a34a" aria-hidden="true" />}
            {error && <XCircle size={30} color="#dc2626" aria-hidden="true" />}
            <h2 id="vr-save-title">{complete ? "All information is saved" : error ? "Submission could not be confirmed" : "Securely saving verification"}</h2>
          </div>
          <p>{complete ? "Every verification section was committed and confirmed by the server." : error ? "No step is displayed as saved unless the server confirmed it." : "Please keep this window open while the server validates and stores your submission."}</p>
        </header>
        <div className="vr-saveBody">
          <ol className="vr-saveSteps">
            {stages.map((item) => (
              <li key={item.step} className={`vr-saveStep is-${item.status}`}>
                <span className="vr-saveRing" aria-hidden="true">
                  <svg viewBox="0 0 40 40"><circle className="track" cx="20" cy="20" r="16" pathLength="100"/><circle className="value" cx="20" cy="20" r="16" pathLength="100"/></svg>
                  <span className="vr-saveIcon">{item.status === "saved" ? <CheckCircle2 size={21}/> : item.status === "failed" ? <XCircle size={21}/> : item.step}</span>
                </span>
                <span className="vr-saveCopy"><strong>Step {item.step}</strong><span>{item.label} · {item.status === "saved" ? "Saved" : item.status === "failed" ? "Not confirmed" : item.status === "active" ? "Awaiting server confirmation" : "Queued"}</span></span>
              </li>
            ))}
          </ol>
          {complete && <div className="vr-saveNotice success"><strong>All information is saved.</strong> Your company verification record is ready to review.</div>}
          {error && <div className="vr-saveNotice error" role="alert">{error}</div>}
          {(complete || error) && <div className="vr-saveActions"><button type="button" onClick={complete ? onConfirm : onClose}>{complete ? "OK — view company details" : "Return to form"}</button></div>}
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
  const initialPageKeyRef = useRef(currentVerificationPageKey());
  const initialDraftRef = useRef(
    readVerificationDraft(initialPageKeyRef.current),
  );

  // Begin at Step 1 and continue sequentially through Step 6.
  const [step, setStep] = useState(() => 1);
  const [formData, setFormData] = useState(
    () => hasConfirmedParent
      ? { ...initialDraftRef.current.formData, legal_name: confirmedParentName }
      : initialDraftRef.current.formData,
  );

  // Keep the confirmed name in form state for review/submission and form resets.
  useEffect(() => {
    if (!hasConfirmedParent || formData.legal_name === confirmedParentName) return;
    setFormData((current) => ({ ...current, legal_name: confirmedParentName }));
  }, [hasConfirmedParent, confirmedParentName, formData.legal_name]);
  const [files, setFiles] = useState(() => initialDraftRef.current.files);
  const [verificationType, setVerificationType] = useState("");
  const [verificationDocuments, setVerificationDocuments] = useState({});
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

    setReviewPreparation({ 2: "loading", 3: "pending", 4: "pending", 5: "pending" });
    const timers = [];
    [2, 3, 4, 5].forEach((stepNumber, index) => {
      timers.push(window.setTimeout(() => {
        setReviewPreparation((current) => ({
          ...current,
          [stepNumber]: "success",
          ...(stepNumber < 5 ? { [stepNumber + 1]: "loading" } : {}),
        }));
      }, 600 * (index + 1)));
    });

    return () => timers.forEach((timer) => window.clearTimeout(timer));
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

  useEffect(() => {
    const sector = selectedOptionName(
      lookupOptions.sectors,
      formData.sector_id,
    ).trim();
    const industry = selectedOptionName(
      lookupOptions.industries,
      formData.industry_id,
    ).trim();
    const businessModel = formData.business_model.trim();

    productSuggestionsAbortRef.current?.abort();

    if (!sector || !industry || !businessModel) {
      setProductSuggestions([]);
      setProductSuggestionsLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    productSuggestionsAbortRef.current = controller;

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
          body: JSON.stringify({ sector, industry, business_model: businessModel }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data?.message || "Unable to generate product suggestions.");
        }

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

      if (name === "has_parent_company" && !nextValue) {
        next.parent_company = "";
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

    window.scrollTo({
      top: 0,
      behavior: "smooth",
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
          "Click the RR button beside every file and resolve any failed or blurry-document review before continuing.",
          "assistant",
          "error",
        );
        return false;
      }
    }

    return true;
  };

  const handleNext = async (event) => {
    if (!validateCurrentStep(event)) {
      return;
    }

    if (step === 3 && !(await reviewBusinessDescription())) {
      return;
    }

    goToStep(step + 1);
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

    const missingConsentId = !formData.accuracy_consent
      ? "accuracy_consent"
      : !formData.privacy_consent
        ? "privacy_consent"
        : "";

    if (missingConsentId) {
      setConsentAttention(missingConsentId);
      setSubmissionError("Select both required confirmation checkboxes before submitting.");
      const missingConsent = document.getElementById(missingConsentId);
      window.requestAnimationFrame(() => {
        missingConsent?.focus({ preventScroll: true });
        missingConsent?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
      window.setTimeout(() => {
        setConsentAttention((current) => current === missingConsentId ? "" : current);
      }, 3200);
      return;
    }

    if (!navigator.onLine) {
      setSubmissionError("No internet connection was detected. Your information remains in the form; reconnect before submitting.");
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

    Object.entries(verificationDocuments).forEach(([slotKey, documents]) => {
      documents.forEach((document) => {
        payload.append(`documents[${slotKey}][]`, document.file);
      });
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
    setSavedCompanyId(null);
    setSaveProgressOpen(true);
    setSubmissionLoading(true);
    setSubmissionError("");

    let activeStageIndex = 0;
    setSaveProgressStages((current) => current.map((item, index) => ({
      ...item,
      status: index === activeStageIndex ? "active" : "waiting",
    })));
    const preparationTimer = window.setInterval(() => {
      activeStageIndex = (activeStageIndex + 1) % SUBMISSION_STEPS.length;
      setSaveProgressStages((current) => current.map((item, index) => ({
        ...item,
        status: index === activeStageIndex ? "active" : "waiting",
      })));
    }, 850);

    try {
      const response = await fetch(VERIFICATION_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.content || "",
        },
        body: payload,
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const firstValidationError = Object.values(data.errors || {})[0]?.[0];
        throw new Error(
          firstValidationError || data.message || "Submission failed.",
        );
      }

      window.clearInterval(preparationTimer);
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

      if (!allStepsConfirmed) {
        throw new Error(
          "The server response did not confirm every saved section. Check your company list before attempting another submission.",
        );
      }

      for (let index = 0; index < SUBMISSION_STEPS.length; index += 1) {
        await new Promise((resolve) => window.setTimeout(resolve, 260));
        setSaveProgressStages((current) => current.map((item, itemIndex) => ({
          ...item,
          status: itemIndex <= index ? "saved" : itemIndex === index + 1 ? "active" : "waiting",
        })));
      }

      setSubmissionReference(data.reference || "");
      setSavedCompanyId(data.company_id || null);
      setExistingCompanyId(data.company_id || existingCompanyId);
      setSaveProgressComplete(true);
      setSubmitted(true);
    } catch (error) {
      window.clearInterval(preparationTimer);
      const professionalMessage = !navigator.onLine || error instanceof TypeError
          ? "The connection was interrupted before the server confirmed submission. Nothing is marked as submitted; reconnect and try again."
          : error.message || "Submission failed. The server transaction was not confirmed; please try again.";
      setSaveProgressStages((current) => current.map((item) => ({
        ...item,
        status: item.status === "active" ? "failed" : "waiting",
      })));
      setSaveProgressError(professionalMessage);
      setSubmissionError(professionalMessage);
    } finally {
      window.clearInterval(preparationTimer);
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
      ],
    },
    {
      stepNumber: 3,
      title: "Business and Operating Profile",
      rows: [
        ["Business model", formData.business_model],
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
        ...(!hasConfirmedParent ? [
          ["Has ultimate parent company", formData.has_parent_company ? "Yes" : "No"],
          ["Ultimate parent company", formData.parent_company],
        ] : []),
        ["Ownership type", formData.ownership_type],
        ["Beneficial owners", formData.beneficial_owners],
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
    <main className="vr-container">
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
                        label="Legal or full name"
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
                        fullWidth
                        placeholder="https://example.com"
                        onChange={updateField}
                      />
                    </div>
                  </Section>
                )}

                {step === 3 && (
                  <Section
                    icon={<Landmark size={20} />}
                    title="Business and operating profile"
                  >
                    <div className="vr-row">
                      <DatalistField
                        label="Business model"
                        name="business_model"
                        value={formData.business_model}
                        required
                        fullWidth
                        options={BUSINESS_MODELS}
                        placeholder="B2B, B2C, marketplace..."
                        onChange={updateField}
                      />
                    </div>

                    <div className="vr-row">
                      <DatalistField
                        label="Products or services"
                        name="products_services"
                        value={formData.products_services}
                        required
                        options={productSuggestions}
                        loading={productSuggestionsLoading}
                        loadingText="Raymoch Clarity Assistant is suggesting…"
                        placeholder={
                          productSuggestionsLoading
                            ? "Clarity Assistant is generating suggestions…"
                            : "Select a suggestion or enter your own"
                        }
                        onChange={updateField}
                      />

                      <MultiCountryDatalist
                        label="Countries of operation"
                        name="operating_countries"
                        value={formData.operating_countries}
                        options={lookupOptions.countriesAll}
                        required
                        onChange={updateField}
                      />
                    </div>

                    <div className="vr-row">
                      <SelectField
                        label="Number of employees"
                        name="employee_count"
                        value={formData.employee_count}
                        required
                        options={["1–9", "10–49", "50–99", "100–499", "500–999", "1,000+"]}
                        onChange={updateField}
                      />

                      <DatalistField
                        label="Company stage"
                        name="company_stage"
                        value={formData.company_stage}
                        required
                        options={COMPANY_STAGES}
                        placeholder="Pre-revenue, growth, mature..."
                        onChange={updateField}
                      />
                    </div>

                    <div className="vr-row">
                      <Field
                        label="Annual revenue"
                        name="annual_revenue"
                        value={formData.annual_revenue}
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        onChange={updateField}
                      />

                     <SelectField
                        label="Revenue currency"
                        name="revenue_currency"
                        value={formData.revenue_currency}
                        options={lookupOptions.currencies}
                        required
                        onChange={updateField}
                      />
                    </div>

                    <div className="vr-row">
                      <Field
                        label="Fiscal year end"
                        name="fiscal_year_end"
                        value={formData.fiscal_year_end}
                        type="date"
                        required
                        onChange={updateField}
                      />

                      <DatalistField
                        label="Public listing or ticker"
                        name="listing_ticker"
                        value={formData.listing_ticker}
                        help
                        options={STOCK_EXCHANGES}
                        placeholder="Exchange and ticker, e.g. NASDAQ: MSFT"
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
                      {!hasConfirmedParent && (
                      <div className="vr-field">
                        <div className="vr-labelWithHelp">
                          <label
                            htmlFor="has_parent_company"
                            style={{ display: "inline-flex", alignItems: "center", gap: "10px", cursor: "pointer", minHeight: "38px" }}
                          >
                            <span style={{ position: "relative", display: "inline-grid", placeItems: "center", flex: "0 0 auto" }}>
                              <input
                                id="has_parent_company"
                                name="has_parent_company"
                                type="checkbox"
                                checked={formData.has_parent_company}
                                onChange={updateField}
                                style={{ position: "absolute", inset: 0, width: "22px", height: "22px", margin: 0, opacity: 0, cursor: "pointer" }}
                              />
                              <span
                                aria-hidden="true"
                                style={{ display: "grid", placeItems: "center", width: "22px", height: "22px", border: `2px solid ${formData.has_parent_company ? "#2563eb" : "#94a3b8"}`, borderRadius: "7px", background: formData.has_parent_company ? "linear-gradient(135deg, #2563eb, #4f46e5)" : "#fff", color: "#fff", boxShadow: formData.has_parent_company ? "0 4px 12px rgba(37, 99, 235, .28)" : "inset 0 1px 2px rgba(15, 23, 42, .06)", transition: "all 180ms ease", fontSize: "14px", fontWeight: 900 }}
                              >
                                {formData.has_parent_company ? "✓" : ""}
                              </span>
                            </span>
                            <span>Ultimate parent company</span>
                          </label>
                          <RequiredFieldHelp name="has_parent_company" label="Ultimate parent company" />
                        </div>

                        {formData.has_parent_company && (
                          <input
                            id="parent_company"
                            name="parent_company"
                            value={formData.parent_company}
                            required
                            placeholder="Enter the parent company’s full legal name"
                            onChange={updateField}
                            style={{ marginTop: "8px", width: "100%" }}
                          />
                        )}
                      </div>
                      )}

                      <DatalistField
                        label="Ownership type"
                        name="ownership_type"
                        value={formData.ownership_type}
                        required
                        options={[
                          ...new Set([
                            selectedOptionName(
                              lookupOptions.legalStructures,
                              formData.legal_structure_id,
                            ),
                            ...OWNERSHIP_TYPES,
                          ].filter((option) => option && option !== "Not provided")),
                        ]}
                        placeholder="Private, public, state-owned..."
                        onChange={updateField}
                      />
                    </div>

                    <TextareaField
                      label="Beneficial owners"
                      name="beneficial_owners"
                      value={formData.beneficial_owners}
                      required
                      placeholder="Enter each owner's name, nationality and ownership percentage."
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

                      <Field
                        label="ID expiry date"
                        name="signatory_id_expiry"
                        value={formData.signatory_id_expiry}
                        type="date"
                        required
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
                          title="Loaded from the logged-in user profile"
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
                          title="Loaded from the logged-in user profile"
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
                          label="Referral or source"
                          name="referral_source"
                          value={formData.referral_source}
                          onChange={updateField}
                        />
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
                            <strong style={{ color: "#0f2747" }}>Preparing Steps 2–5</strong>
                            <span style={{ display: "block", marginTop: "3px", color: "#64748b", fontSize: "11px" }}>{preparedStepCount} of 4 sections prepared</span>
                          </div>
                          <button type="button" title="Refresh the review summary" aria-label="Refresh review summary" onClick={() => setReviewPreparationRun((current) => current + 1)} style={{ display: "grid", placeItems: "center", width: "34px", height: "34px", border: "1px solid #bfdbfe", borderRadius: "10px", background: "#eff6ff", color: "#2563eb", cursor: "pointer" }}>
                            <RefreshCw size={17} style={!reviewReady ? { animation: "rrSpin .9s linear infinite" } : undefined} />
                          </button>
                        </div>
                        <div role="progressbar" aria-label="Review preparation progress" aria-valuemin="0" aria-valuemax="4" aria-valuenow={preparedStepCount} style={{ height: "8px", marginTop: "12px", overflow: "hidden", borderRadius: "999px", background: "#dbeafe" }}>
                          <span style={{ display: "block", width: `${preparedStepCount * 25}%`, height: "100%", borderRadius: "inherit", background: reviewReady ? "#16a34a" : "linear-gradient(90deg, #2563eb, #6366f1)", transition: "width 420ms ease" }} />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "7px", marginTop: "12px" }}>
                          {[2, 3, 4, 5].map((stepNumber) => (
                            <div key={stepNumber} style={{ display: "flex", alignItems: "center", gap: "7px", color: reviewPreparation[stepNumber] === "success" ? "#15803d" : "#64748b", fontSize: "11px", fontWeight: 700 }}>
                              {reviewPreparation[stepNumber] === "success" ? <CheckCircle2 size={15} /> : <RefreshCw size={14} style={reviewPreparation[stepNumber] === "loading" ? { animation: "rrSpin .9s linear infinite" } : undefined} />}
                              Step {stepNumber} {reviewPreparation[stepNumber] === "success" ? "submission successful" : reviewPreparation[stepNumber] === "loading" ? "is loading…" : "is waiting"}
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
                          <ReviewAccordion key={section.stepNumber} {...section} defaultOpen={index === 0} />
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
                  {step > 2 && (
                    <button
                      className="vr-btn vr-btnGhost"
                      type="button"
                      onClick={handleBack}
                    >
                      <ArrowLeft size={17} />
                      Back
                    </button>
                  )}

                  {step === 2 && <span />}

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
                        disabled={submissionLoading || !reviewReady || !isOnline}
                        title={!isOnline ? "Reconnect to the internet before submitting" : !consentsComplete ? "Complete both confirmations before submitting" : "Submit for Verification"}
                        style={consentsComplete && reviewReady && isOnline ? { background: "#16a34a", borderColor: "#16a34a", animation: "finalSubmitPulse 1.45s ease-in-out infinite" } : undefined}
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
        onClose={() => {
          if (submissionLoading) return;
          setSaveProgressOpen(false);
        }}
        onConfirm={() => {
          setSaveProgressOpen(false);
          setShowCompanyDetails(true);
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
