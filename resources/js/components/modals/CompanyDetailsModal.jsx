import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
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
  Eye,
  Gauge,
  Scale,
  Map,
  Layers,
  Workflow,
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

import AddCompanyConfirmation from "./AddCompanyConfirmation.jsx";
import "./verificationModal.css";
import "../services/company-details.css";

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
    title: "Company overview",
    description: "Company identity and submission details.",
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
  if (value === true) return "Yes";
  if (value === false) return "No";
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

export default function CompanyDetailsModal({ onAddCompany, onCompaniesLoaded, initialCompanyId = null }) {
  const [companies, setCompanies] = useState([]);
  const [addCompanyPromptOpen, setAddCompanyPromptOpen] = useState(false);
  const [lookupAttempt, setLookupAttempt] = useState(0);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [company, setCompany] = useState(EMPTY_COMPANY);
  const [step, setStep] = useState(1);
  const [listLoading, setListLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState("");

  const currentStep = useMemo(() => STEPS.find((item) => item.number === step) || STEPS[0], [step]);
  const detailsRequest = useRef(null);
  const addCompanyRef = useRef(onAddCompany);
  const companiesLoadedRef = useRef(onCompaniesLoaded);
  useEffect(() => { companiesLoadedRef.current = onCompaniesLoaded; }, [onCompaniesLoaded]);
  useEffect(() => { addCompanyRef.current = onAddCompany; }, [onAddCompany]);
  useEffect(() => () => detailsRequest.current?.abort(), []);

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
      if (!Array.isArray(data.companies)) throw new Error("The company list response is invalid. Please try again.");
      if (signal.aborted) return;
      setCompanies(data.companies);
      companiesLoadedRef.current?.(data.companies);
      if (data.companies.length === 0) addCompanyRef.current?.();
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
  }, [loadCompanies, lookupAttempt]);

  const selectCompany = useCallback(async (companyId) => {
    detailsRequest.current?.abort();
    const controller = new AbortController();
    detailsRequest.current = controller;
    setSelectedCompanyId(companyId);
    setCompany(EMPTY_COMPANY);
    setStep(1);
    setDetailsLoading(true);
    setError("");
    try {
      const response = await fetch(`${COMPANIES_ENDPOINT}/${encodeURIComponent(companyId)}`, {
        credentials: "include",
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to load this company.");
      if (!data.company || data.company.id == null) throw new Error("Company details are unavailable.");
      if (!controller.signal.aborted) setCompany(data.company);
    } catch (requestError) {
      if (!controller.signal.aborted) {
        setError(requestError.message);
        setSelectedCompanyId(null);
      }
    } finally {
      if (!controller.signal.aborted) setDetailsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!listLoading && initialCompanyId != null && companies.some(item => String(item.id) === String(initialCompanyId))) {
      selectCompany(initialCompanyId);
    }
  }, [initialCompanyId, listLoading, companies, selectCompany]);

  const changeStep = (nextStep) => {
    setStep(Math.min(STEPS.length, Math.max(1, nextStep)));
    window.requestAnimationFrame(() => {
      document.querySelector(".company-details-modal .vr-hero")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <main className="vr-container company-details-modal">
      {addCompanyPromptOpen && (
        <AddCompanyConfirmation
          open
          endpoint={`${COMPANIES_ENDPOINT}/parent-company`}
          onCancel={() => setAddCompanyPromptOpen(false)}
          onConfirm={(context) => {
            setAddCompanyPromptOpen(false);
            onAddCompany?.(context);
          }}
        />
      )}

      <header className="vr-hero vr-gradient">
        <div className="vr-heroContent">
          <span className="vr-heroIcon"><Building2 size={28} aria-hidden="true" /></span>
          <div><h2>View Company</h2><p>Company profiles and verification scores.</p></div>
        </div>
      </header>

      <section className="vr-card company-companyCard">
        <div className="company-companyHeader">
          <div className="company-companyHeaderCopy">
            <span className="vr-smallIcon"><Building2 size={20} /></span>
            <div>
              <h3 style={{ margin: 0, color: "#0f2747" }}>Submitted companies</h3>
              <p className="company-section-copy">Select a company to review its profile.</p>
            </div>
          </div>
          <button type="button" className="vr-btn company-add-btn" onClick={() => setAddCompanyPromptOpen(true)}>
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
                className={`company-name-btn${String(selectedCompanyId) === String(item.id) ? " is-active" : ""}`}
                onClick={() => selectCompany(item.id)}
                aria-pressed={String(selectedCompanyId) === String(item.id)}
              >
                <Building2 size={15} /> {item.company_name}
              </button>
            ))
          ) : (
            <span style={{ color: "#64748b", fontSize: "12px" }}>{error ? "Company lookup unavailable." : "No submitted companies were found."}</span>
          )}
        </div>
      </section>

      {error && <div className="company-error" role="alert"><p>{error}</p><button type="button" className="vr-btn vr-btnGhost" onClick={() => setLookupAttempt(attempt => attempt + 1)}><RefreshCw size={16} aria-hidden="true" /> Retry company lookup</button></div>}

      <section className="vr-stepwrap">
        <article className="vr-card">
          {detailsLoading ? (
            <div className="company-loading" role="status"><LoaderCircle size={34} /> Loading company information…</div>
          ) : listLoading ? (
            <div className="company-loading" role="status"><LoaderCircle size={28} aria-hidden="true" /> Loading verification report…</div>
          ) : error && companies.length === 0 ? (
            <p className="company-lane-empty">Retry the lookup to load your companies and verification report.</p>
          ) : selectedCompanyId == null ? (
            <VerificationBoard companies={companies} />
          ) : (
            <DetailsSection definition={currentStep} company={company} />
          )}

          {selectedCompanyId != null && !detailsLoading && company.id != null && (
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

function scoreOf(company) {
  const value = company.verification_score;
  if ((typeof value !== "number" && typeof value !== "string") || String(value).trim() === "") return null;
  const score = Number(value);
  return Number.isFinite(score) && score >= 0 && score <= 100 ? score : null;
}

const SCORE_PANELS = [
  { title: "Score Available", icon: BadgeCheck, description: "The company’s available verification score." },
  { title: "Score Measurement taken", icon: Gauge, description: "Measurements used to assess the company." },
  { title: "Score Decision consideration", icon: Scale, description: "Factors considered in the scoring decision." },
  { title: "Score Map", icon: Map, description: "How the score is distributed across assessment areas." },
  { title: "Score Tier", icon: Layers, description: "The company’s assigned score tier." },
  { title: "Score Function", icon: Workflow, description: "How the score is calculated and applied." },
];

function VerificationBoard({ companies }) {
  const [scoreCompanyId, setScoreCompanyId] = useState(null);
  const [refreshCount, setRefreshCount] = useState(0);
  const panelId = useId();
  const scoreCompany = companies.find(item => String(item.id) === String(scoreCompanyId));
  const lanes = [
    { title: "Awaiting score", icon: FileText, matches: score => score === null },
    { title: "Score available", icon: ShieldCheck, matches: score => score !== null && score < 100 },
    { title: "Full score", icon: BadgeCheck, matches: score => score === 100 },
  ];

  const viewScore = (companyId) => {
    setScoreCompanyId(companyId);
    setRefreshCount(current => current + 1);
  };

  return (
    <section className="company-board" aria-label="Verification score report">
      <div className="company-board-heading">
        <ShieldCheck size={22} aria-hidden="true" />
        <div>
          <h3>Verification score report</h3>
          <p>Choose View Score to open the score layout. Select a company name above to view its company details.</p>
        </div>
      </div>
      <div className={`company-score-workspace${scoreCompany ? " is-open" : ""}`}>
        <div className="company-board-lanes">
          {lanes.map(({ title, icon: Icon, matches }) => {
            const items = companies.filter(company => matches(scoreOf(company)));
            return (
              <section className="company-board-lane" key={title} aria-label={title}>
                <h4><Icon size={17} aria-hidden="true" />{title}<span>{items.length}</span></h4>
                {items.length === 0 && <p className="company-lane-empty">No companies in this stage.</p>}
                {items.map(company => {
                  const score = scoreOf(company);
                  const active = String(scoreCompanyId) === String(company.id);
                  return (
                    <article className={`company-score-card${active ? " is-active" : ""}`} key={company.id}>
                      <span className="company-score-name"><Building2 size={18} aria-hidden="true" />{company.company_name}</span>
                      <span className="company-score-value">{score === null ? "Awaiting score" : `${score} / 100`}</span>
                      {score !== null && (
                        <span className="company-score-meter" role="meter" aria-label={`${company.company_name} verification score`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={score}>
                          <span style={{ width: `${score}%` }} />
                        </span>
                      )}
                      <button type="button" className="company-view-score" onClick={() => viewScore(company.id)} aria-expanded={active} aria-controls={panelId} aria-label={`View Score for ${company.company_name}`}>
                        <Eye size={17} aria-hidden="true" /> View Score
                        <ArrowRight size={16} aria-hidden="true" />
                      </button>
                    </article>
                  );
                })}
              </section>
            );
          })}
        </div>
        <section id={panelId} className="company-score-details" hidden={!scoreCompany} aria-label="Company score information">
          {scoreCompany && (
            <>
              <div className="company-score-details-heading">
                <div><h3>{scoreCompany.company_name}</h3><p>Score overview · Layout preview</p></div>
                <RefreshCw key={refreshCount} className="company-score-refresh" size={18} aria-hidden="true" />
              </div>
              <p className="company-score-announcement" role="status">Score layout opened for {scoreCompany.company_name}. Preview refresh {refreshCount}.</p>
              <div className="company-score-panels" key={`${scoreCompany.id}-${refreshCount}`}>
                {SCORE_PANELS.map(({ title, icon: Icon, description }) => (
                  <article className="company-score-panel" key={title}>
                    <span className="company-score-panel-icon"><Icon size={21} aria-hidden="true" /></span>
                    <h4>{title}</h4>
                    <p>{description}</p>
                    <span className="company-score-placeholder">Awaiting score information</span>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </section>
  );
}
