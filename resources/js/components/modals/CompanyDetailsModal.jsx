import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  FileCheck2,
  FileText,
  Globe2,
  Hash,
  Landmark,
  LoaderCircle,
  Mail,
  MapPin,
  Phone,
  Plus,
  RefreshCw,
  ShieldCheck,
  Signature,
  UserRound,
  UsersRound,
} from "lucide-react";

import "./verificationModal.css";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const COMPANIES_ENDPOINT = `${API_BASE_URL}/api/company-information`;
const EMPTY_COMPANY = Object.freeze({});

const FIELD_ICONS = {
  id: Hash,
  company_name: Building2,
  verification_type: ShieldCheck,
  created_at: CalendarDays,
  updated_at: RefreshCw,
  account_type_id: BadgeCheck,
  trading_name: Building2,
  legal_structure_id: Landmark,
  sector_id: BriefcaseBusiness,
  industry_id: BriefcaseBusiness,
  country_id: Globe2,
  state_id: MapPin,
  city_id: MapPin,
  registration_number: FileText,
  tax_id: Hash,
  established_date: CalendarDays,
  external_identifier: Hash,
  registered_address: MapPin,
  postal_code: MapPin,
  website: Globe2,
  business_model: BriefcaseBusiness,
  products_services: FileText,
  operating_countries: Globe2,
  employee_count: UsersRound,
  company_stage: BadgeCheck,
  annual_revenue: CircleDollarSign,
  revenue_currency: CircleDollarSign,
  fiscal_year_end: CalendarDays,
  listing_ticker: Landmark,
  business_description: FileText,
  parent_company: Building2,
  has_parent_company: CheckCircle2,
  ownership_type: UsersRound,
  beneficial_owners: UsersRound,
  authorized_signatory: UserRound,
  singatory_image_holder: Signature,
  signatory_title: BadgeCheck,
  signatory_id_number: Hash,
  signatory_id_expiry: CalendarDays,
  standard_verification_cti: ShieldCheck,
  auxiliary_verification_ats: ShieldCheck,
  document_status: FileCheck2,
  contact_name: UserRound,
  contact_role: BriefcaseBusiness,
  contact_email: Mail,
  contact_phone: Phone,
  preferred_contact: Mail,
  referral_source: Globe2,
};

const STEPS = [
  {
    number: 1,
    title: "Verification",
    description: "Review the selected company and its verification status.",
    icon: ShieldCheck,
    fields: [
      ["Company ID", "id"],
      ["Company name", "company_name"],
      ["Verification path", "verification_type"],
      ["Submitted", "created_at"],
      ["Last updated", "updated_at"],
    ],
  },
  {
    number: 2,
    title: "Account and Legal Identity",
    description: "Read the company’s legal, registration and location details.",
    icon: Building2,
    fields: [
      ["Account type", "account_type_id"],
      ["Legal name", "company_name"],
      ["Trading name", "trading_name"],
      ["Legal structure", "legal_structure_id"],
      ["Sector", "sector_id"],
      ["Industry", "industry_id"],
      ["Country", "country_id"],
      ["State or province", "state_id"],
      ["City", "city_id"],
      ["Registration or licence number", "registration_number"],
      ["Tax ID", "tax_id"],
      ["Date established", "established_date"],
      ["External identifier / LEI", "external_identifier"],
      ["Registered address", "registered_address", true],
      ["Postal code", "postal_code"],
      ["Website", "website"],
    ],
  },
  {
    number: 3,
    title: "Business and Operating Profile",
    description: "Review the organization’s activities, scale and financial profile.",
    icon: BriefcaseBusiness,
    fields: [
      ["Business model", "business_model"],
      ["Products or services", "products_services"],
      ["Countries of operation", "operating_countries"],
      ["Number of employees", "employee_count"],
      ["Company stage", "company_stage"],
      ["Annual revenue", "annual_revenue"],
      ["Revenue currency", "revenue_currency"],
      ["Fiscal year end", "fiscal_year_end"],
      ["Public listing or ticker", "listing_ticker"],
      ["Business description", "business_description", true],
    ],
  },
  {
    number: 4,
    title: "Ownership, Leadership and Control",
    description: "Review ownership, beneficial owners and authorized signatory details.",
    icon: UsersRound,
    fields: [
      ["Has parent company", "has_parent_company"],
      ["Ultimate parent company", "parent_company"],
      ["Ownership type", "ownership_type"],
      ["Beneficial owners", "beneficial_owners", true],
      ["Authorized signatory", "authorized_signatory"],
      ["Signatory title", "signatory_title"],
      ["Signatory ID number", "signatory_id_number"],
      ["Signatory ID expiry", "signatory_id_expiry"],
    ],
  },
  {
    number: 5,
    title: "Supporting Documents",
    description: "Review the selected verification path and document status.",
    icon: FileCheck2,
    fields: [
      ["Verification type", "verification_type"],
      ["Standard CTI verification", "standard_verification_cti"],
      ["Auxiliary ATS verification", "auxiliary_verification_ats"],
      ["Document status", "document_status", true],
    ],
  },
  {
    number: 6,
    title: "Primary Contact and Confirmation",
    description: "Review the applicant contact information saved with this submission.",
    icon: UserRound,
    fields: [
      ["Full name", "contact_name"],
      ["Job title or relationship", "contact_role"],
      ["Work email", "contact_email"],
      ["Phone number", "contact_phone"],
      ["Preferred contact method", "preferred_contact"],
      ["Referral source", "referral_source"],
    ],
  },
];

function displayValue(value) {
  if (value === true || value === 1 || value === "1") return "Yes";
  if (value === false || value === 0 || value === "0") return "No";
  if (Array.isArray(value)) return value.join(", ") || "Not provided";
  return value == null || String(value).trim() === "" ? "Not provided" : String(value);
}

function ReadOnlyField({ label, fieldKey, value, fullWidth = false }) {
  const Icon = FIELD_ICONS[fieldKey] || FileText;
  const empty = value == null || String(value).trim() === "";

  return (
    <div className="vr-field" style={fullWidth ? { gridColumn: "1 / -1" } : undefined}>
      <label>
        <span className="company-read-icon"><Icon size={14} /></span>
        {label}
      </label>
      <div
        className={`company-read-value${empty ? " is-empty" : ""}`}
        role="textbox"
        aria-readonly="true"
        aria-label={label}
      >
        {displayValue(value)}
      </div>
    </div>
  );
}

function DetailsSection({ definition, company }) {
  const SectionIcon = definition.icon;

  return (
    <section className="vr-innerCard vr-stepSection company-step-section">
      <div className="vr-sectionHeading">
        <span className="vr-smallIcon"><SectionIcon size={20} /></span>
        <div>
          <h3>{definition.title}</h3>
          <p className="company-section-copy">{definition.description}</p>
        </div>
      </div>

      <div className="vr-row company-read-grid">
        {definition.fields.map(([label, fieldKey, fullWidth]) => (
          <ReadOnlyField
            key={fieldKey}
            label={label}
            fieldKey={fieldKey}
            value={company[fieldKey]}
            fullWidth={fullWidth}
          />
        ))}
      </div>

      {definition.number === 4 && company.singatory_image_holder && (
        <div className="vr-field company-signature-field">
          <label><span className="company-read-icon"><Signature size={14} /></span>Authorized signature</label>
          <div className="company-signature-frame">
            <img src={company.singatory_image_holder} alt="Authorized signatory signature" />
          </div>
        </div>
      )}
    </section>
  );
}

export default function CompanyDetailsModal({ onAddCompany, initialCompanyId = null }) {
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [company, setCompany] = useState(EMPTY_COMPANY);
  const [step, setStep] = useState(1);
  const [listLoading, setListLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState("");

  const currentStep = useMemo(() => STEPS.find((item) => item.number === step) || STEPS[0], [step]);
  const progress = Math.round((step / STEPS.length) * 100);

  const loadCompanies = useCallback(async (signal) => {
    setListLoading(true);
    setError("");
    try {
      const response = await fetch(COMPANIES_ENDPOINT, {
        credentials: "include",
        headers: { Accept: "application/json" },
        signal,
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Unable to load submitted companies.");
      setCompanies(Array.isArray(data.companies) ? data.companies : []);
    } catch (requestError) {
      if (requestError.name !== "AbortError") setError(requestError.message);
    } finally {
      if (!signal.aborted) setListLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadCompanies(controller.signal);
    return () => controller.abort();
  }, [loadCompanies]);

  const selectCompany = async (companyId) => {
    setSelectedCompanyId(companyId);
    setCompany(EMPTY_COMPANY);
    setStep(1);
    setDetailsLoading(true);
    setError("");
    try {
      const response = await fetch(`${COMPANIES_ENDPOINT}/${companyId}`, {
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || "Unable to load this company.");
      setCompany(data.company || EMPTY_COMPANY);
    } catch (requestError) {
      setError(requestError.message);
      setSelectedCompanyId(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  useEffect(() => {
    if (initialCompanyId) selectCompany(initialCompanyId);
    // The newly saved company should open immediately when this modal is shown.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCompanyId]);

  const changeStep = (nextStep) => {
    setStep(Math.min(STEPS.length, Math.max(1, nextStep)));
    window.requestAnimationFrame(() => {
      document.querySelector(".company-details-modal .vr-hero")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <main className="vr-container company-details-modal">
      <style>{`
        @keyframes companySpin{to{transform:rotate(360deg)}}
        .company-details-modal{padding:0}.company-details-modal .vr-hero{margin-bottom:16px}.company-companyCard{margin-bottom:16px}.company-companyHeader{display:flex;align-items:center;justify-content:space-between;gap:12px}.company-companyHeaderCopy{display:flex;align-items:center;gap:10px}.company-list{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}.company-name-btn{display:inline-flex;align-items:center;gap:7px;padding:8px 11px;border:1px solid #cbd5e1;border-radius:10px;background:#fff;color:#334155;font-size:12px;font-weight:800;cursor:pointer;transition:all .18s ease}.company-name-btn:hover{border-color:#93c5fd;background:#eff6ff;color:#1d4ed8}.company-name-btn.is-active{border-color:#2563eb;background:linear-gradient(135deg,#eff6ff,#eef2ff);color:#1d4ed8;box-shadow:0 0 0 3px rgba(37,99,235,.12)}.company-add-btn{white-space:nowrap}.company-loading{display:flex;align-items:center;justify-content:center;gap:9px;min-height:270px;color:#2563eb;font-weight:800}.company-loading svg,.company-inline-loading svg{animation:companySpin .9s linear infinite}.company-inline-loading{display:inline-flex;align-items:center;gap:7px;color:#64748b;font-size:12px}.company-emptyPrompt{display:grid;place-items:center;min-height:270px;padding:28px;text-align:center;color:#64748b}.company-emptyPrompt span{display:grid;place-items:center;width:54px;height:54px;margin-bottom:12px;border-radius:18px;background:#eff6ff;color:#2563eb}.company-step-section{animation:companyReveal .22s ease-out}@keyframes companyReveal{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}.company-section-copy{margin:3px 0 0;color:#64748b;font-size:12px;font-weight:500}.company-read-grid{align-items:stretch}.company-read-icon{display:inline-grid;place-items:center;margin-right:5px;color:#2563eb;vertical-align:-2px}.company-read-value{box-sizing:border-box;min-height:42px;padding:11px 12px;border:1px solid #dbe3ef;border-radius:8px;background:#f8fafc;color:#172033;font-size:13px;font-weight:650;line-height:1.55;white-space:pre-wrap;overflow-wrap:anywhere}.company-read-value.is-empty{color:#94a3b8;font-style:italic;font-weight:500}.company-signature-field{margin-top:15px}.company-signature-frame{display:grid;place-items:center;min-height:130px;padding:14px;border:1px dashed #93c5fd;border-radius:12px;background:#f8fafc}.company-signature-frame img{display:block;max-width:100%;max-height:150px}.company-step-dots{display:flex;align-items:center;justify-content:center;gap:6px;flex:1}.company-step-dot{width:8px;height:8px;border:0;border-radius:999px;background:#cbd5e1;cursor:pointer;transition:all .18s ease}.company-step-dot.is-active{width:24px;background:#2563eb}.company-details-modal .vr-stepNavigation{align-items:center}.company-error{margin:0 0 14px}@media(max-width:640px){.company-companyHeader{align-items:flex-start;flex-direction:column}.company-add-btn{width:100%;justify-content:center}.company-step-dots{order:-1;flex-basis:100%}.company-read-grid{grid-template-columns:1fr}}
      `}</style>
      <style>{`
        .company-verificationIntro{display:grid;gap:16px;padding:8px;text-align:left}
        .company-introLead{display:flex;align-items:flex-start;gap:13px}
        .company-introLead>span{display:grid;place-items:center;flex:0 0 52px;height:52px;border-radius:16px;background:linear-gradient(135deg,#dbeafe,#eef2ff);color:#2563eb}
        .company-introLead h3{margin:0;color:#0f2747}
        .company-introLead p{margin:5px 0 0;color:#64748b;font-size:13px;line-height:1.65}
        .company-introGrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
        .company-introItem{padding:14px;border:1px solid #dbe3ef;border-radius:12px;background:#f8fafc}
        .company-introItem span{display:grid;place-items:center;width:34px;height:34px;margin-bottom:9px;border-radius:10px;background:#eff6ff;color:#2563eb}
        .company-introItem strong{display:block;color:#0f2747;font-size:13px}
        .company-introItem p{margin:5px 0 0;color:#64748b;font-size:11px;line-height:1.55}
        .company-scoreNote{display:flex;align-items:flex-start;gap:9px;padding:12px 14px;border:1px solid #bbf7d0;border-radius:11px;background:#f0fdf4;color:#166534;font-size:12px;line-height:1.6}
        @media(max-width:760px){.company-introGrid{grid-template-columns:1fr}}
      `}</style>

      <header className="vr-hero vr-gradient">
        <div className="vr-heroContent">
          <span className="vr-heroIcon"><currentStep.icon size={28} /></span>
          <div>
            <h2>{currentStep.title}</h2>
            <p>{currentStep.description}</p>
          </div>
        </div>
        <div className="vr-crumbs">
          <span className="vr-step">Step {step} of {STEPS.length}</span>
        </div>
        <div className="vr-progress" role="progressbar" aria-label="Company information progress" aria-valuemin="1" aria-valuemax={STEPS.length} aria-valuenow={step}>
          <span style={{ width: `${progress}%` }} />
        </div>
      </header>

      <section className="vr-card company-companyCard">
        <div className="company-companyHeader">
          <div className="company-companyHeaderCopy">
            <span className="vr-smallIcon"><Building2 size={20} /></span>
            <div>
              <h3 style={{ margin: 0, color: "#0f2747" }}>Submitted companies</h3>
              <p className="company-section-copy">Select a company to populate all six verification steps.</p>
            </div>
          </div>
          <button type="button" className="vr-btn company-add-btn" onClick={onAddCompany}>
            <Plus size={17} /> Add new company
          </button>
        </div>

        <div className="company-list" aria-label="Select a submitted company">
          {listLoading ? (
            <span className="company-inline-loading"><LoaderCircle size={17} /> Loading companies…</span>
          ) : companies.length > 0 ? (
            companies.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`company-name-btn${selectedCompanyId === item.id ? " is-active" : ""}`}
                onClick={() => selectCompany(item.id)}
                aria-pressed={selectedCompanyId === item.id}
              >
                <Building2 size={15} /> {item.company_name}
              </button>
            ))
          ) : (
            <span style={{ color: "#64748b", fontSize: "12px" }}>No submitted companies were found.</span>
          )}
        </div>
      </section>

      {error && <p className="vr-error company-error" role="alert">{error}</p>}

      <section className="vr-stepwrap">
        <article className="vr-card">
          {detailsLoading ? (
            <div className="company-loading" role="status"><LoaderCircle size={34} /> Loading company information…</div>
          ) : companies.length === 0 ? (
            <div className="company-verificationIntro">
              <div className="company-introLead">
                <span><ShieldCheck size={27} /></span>
                <div>
                  <h3>Build a trusted company profile</h3>
                  <p>Verification confirms that a company is genuine, identifies who owns and controls it, and connects its business claims to supporting evidence. Start a submission to establish a reliable profile that investors and partners can assess with confidence.</p>
                </div>
              </div>

              <div className="company-introGrid">
                <div className="company-introItem">
                  <span><Building2 size={18} /></span>
                  <strong>Confirm identity</strong>
                  <p>Match the legal name, registration, address and responsible people to official records.</p>
                </div>
                <div className="company-introItem">
                  <span><FileCheck2 size={18} /></span>
                  <strong>Validate evidence</strong>
                  <p>Use CTI formal documents or ATS operating evidence to support the company’s claims.</p>
                </div>
                <div className="company-introItem">
                  <span><BadgeCheck size={18} /></span>
                  <strong>Support a valid score</strong>
                  <p>Complete, current and consistent information gives the review process stronger scoring signals.</p>
                </div>
              </div>

              <div className="company-scoreNote">
                <CheckCircle2 size={18} />
                <span>The score is based on validated identity, ownership, operating information and supporting documents—not simply on completing the form.</span>
              </div>

              <div>
                <button type="button" className="vr-btn" onClick={onAddCompany}>
                  <Plus size={17} /> Start company verification
                </button>
              </div>
            </div>
          ) : !selectedCompanyId ? (
            <div className="company-emptyPrompt">
              <span><Building2 size={27} /></span>
              <strong style={{ color: "#0f2747" }}>Choose a company above</strong>
              <p style={{ maxWidth: "430px", margin: "7px 0 0" }}>The form keeps its empty read-only fields until you select a company name.</p>
            </div>
          ) : (
            <DetailsSection definition={currentStep} company={company} />
          )}

          {companies.length > 0 && (
            <div className="vr-stepNavigation">
              <button type="button" className="vr-btn vr-btnGhost" disabled={step === 1} onClick={() => changeStep(step - 1)}>
                <ArrowLeft size={17} /> Back
              </button>

              <div className="company-step-dots" aria-label="Company detail steps">
                {STEPS.map((item) => (
                  <button key={item.number} type="button" className={`company-step-dot${step === item.number ? " is-active" : ""}`} onClick={() => changeStep(item.number)} aria-label={`Open Step ${item.number}: ${item.title}`} aria-current={step === item.number ? "step" : undefined} />
                ))}
              </div>

              <button type="button" className="vr-btn" disabled={step === STEPS.length} onClick={() => changeStep(step + 1)}>
                Next <ArrowRight size={17} />
              </button>
            </div>
          )}
        </article>
      </section>
    </main>
  );
}
