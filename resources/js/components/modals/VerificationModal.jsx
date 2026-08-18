import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  FileCheck2,
  FileUp,
  Landmark,
  Lightbulb,
  SearchCheck,
  ShieldCheck,
  UploadCloud,
  UserRound,
  UsersRound,
  WalletCards,
} from "lucide-react";

import "./verificationModal.css";

const MAX_UPLOAD_BYTES = 100 * 1024 * 1024;

const ACCEPTED_FILES =
  ".pdf,.doc,.docx,.xls,.xlsx,.csv,.jpg,.jpeg,.png";

const countries = [
  "Ethiopia",
  "Ghana",
  "Kenya",
  "Nigeria",
  "Rwanda",
  "South Africa",
  "Tanzania",
  "Uganda",
  "Other",
];

const sectors = [
  "Agriculture",
  "Construction",
  "Education",
  "Energy",
  "Financial Services",
  "FinTech",
  "Food & Beverage",
  "Healthcare",
  "Logistics",
  "Manufacturing",
  "Media",
  "Real Estate",
  "Retail",
  "Technology",
  "Telecommunications",
  "Other",
];

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
    description: "Identify beneficial owners, directors and controllers.",
  },
  5: {
    title: "Investor Profile and Funding Preferences",
    description: "Provide the applicant's investment profile and mandate.",
  },
  6: {
    title: "Financial, Banking and Compliance",
    description: "Provide financial, banking and regulatory information.",
  },
  7: {
    title: "Supporting Documents",
    description: "Upload the evidence required for verification.",
  },
  8: {
    title: "Primary Contact and Confirmation",
    description: "Enter contact details, review the declarations and submit.",
  },
};

const initialFormData = {
  account_type: "",
  applicant_profile: "",
  legal_name: "",
  trading_name: "",
  registration_number: "",
  tax_id: "",
  established_date: "",
  legal_structure: "",
  country: "",
  region: "",
  registered_address: "",
  city_postal: "",
  website: "",
  external_identifier: "",

  sector: "",
  business_model: "",
  products_services: "",
  operating_countries: "",
  employee_count: "",
  company_stage: "",
  annual_revenue: "",
  revenue_currency: "",
  fiscal_year_end: "",
  listing_ticker: "",
  business_description: "",

  parent_company: "",
  ownership_type: "",
  beneficial_owners: "",
  directors: "",
  authorized_signatory: "",
  signatory_title: "",
  signatory_id_number: "",
  signatory_id_expiry: "",

  investor_status: "",
  investment_role: "",
  aum: "",
  aum_currency: "",
  minimum_ticket: "",
  maximum_ticket: "",
  ticket_currency: "",
  preferred_stages: "",
  preferred_sectors: "",
  preferred_geographies: "",
  investment_horizon: "",
  target_return: "",
  risk_tolerance: "",
  investment_mandate: "",

  bank_name: "",
  bank_country: "",
  bank_account_name: "",
  bank_account_number: "",
  swift_bic: "",
  source_of_funds: "",
  audited_financials: "",
  regulated_entity: "",
  regulator_license: "",
  compliance_officer: "",
  pep_exposure: false,
  sanctions_exposure: false,
  adverse_media: false,
  legal_proceedings: false,
  compliance_notes: "",

  contact_name: "",
  contact_role: "",
  contact_email: "",
  contact_phone: "",
  preferred_contact: "",
  referral_source: "",
  accuracy_consent: false,
  privacy_consent: false,
};

function Field({
  label,
  name,
  value,
  required = false,
  type = "text",
  placeholder,
  onChange,
  children,
  ...props
}) {
  return (
    <div className="vr-field">
      <label htmlFor={name}>
        {label}
        {required && " *"}
      </label>

      {children || (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          required={required}
          placeholder={placeholder}
          onChange={onChange}
          {...props}
        />
      )}
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  options,
  required = false,
  onChange,
}) {
  return (
    <Field label={label} name={name} required={required}>
      <select
        id={name}
        name={name}
        value={value}
        required={required}
        onChange={onChange}
      >
        <option value="">Select…</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </Field>
  );
}

function TextareaField({
  label,
  name,
  value,
  required = false,
  placeholder,
  rows = 4,
  onChange,
}) {
  return (
    <Field label={label} name={name} required={required}>
      <textarea
        id={name}
        name={name}
        value={value}
        required={required}
        placeholder={placeholder}
        rows={rows}
        onChange={onChange}
      />
    </Field>
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

function ReviewChecklist({ step }) {
  const stepSpecificTips = {
    2: "Make sure the legal name and registration number match official records.",
    3: "Use the most recent operating and revenue information available.",
    4: "List every beneficial owner and controller required by your jurisdiction.",
    5: "Ensure investment limits and preferences reflect the current mandate.",
    6: "Explain any PEP, sanctions, litigation or adverse-media exposure.",
    7: "Upload clear, readable and unexpired documents.",
    8: "Confirm that the applicant has authorized the named representative.",
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
        Step {step} of 8: {stepMeta[step].title}
      </p>

      <hr className="vr-hr" />

      <h3>Privacy reminder</h3>

      <p className="small">
        Banking and identity information must be transmitted and stored using
        appropriate encryption and access controls.
      </p>
    </aside>
  );
}

export default function VerificationModal() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [files, setFiles] = useState([]);
  const [fileError, setFileError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const currentStep = stepMeta[step];
  const progress = Math.round((step / 8) * 100);

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const goToStep = (stepNumber) => {
    setStep(stepNumber);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const validateCurrentStep = (event) => {
    const form = event.currentTarget.closest("form");

    if (!form.checkValidity()) {
      form.reportValidity();
      return false;
    }

    if (step === 7 && files.length === 0) {
      setFileError("Upload at least one supporting document.");
      return false;
    }

    return true;
  };

  const handleNext = (event) => {
    if (!validateCurrentStep(event)) {
      return;
    }

    goToStep(step + 1);
  };

  const handleBack = () => {
    goToStep(step - 1);
  };

  const handleFiles = (event) => {
    const selectedFiles = Array.from(event.target.files || []);

    const oversizedFile = selectedFiles.find(
      (file) => file.size > MAX_UPLOAD_BYTES,
    );

    if (oversizedFile) {
      setFileError(
        `“${oversizedFile.name}” exceeds the 100 MB per-file limit.`,
      );

      event.target.value = "";
      return;
    }

    /*
     * This combines newly selected files with existing files,
     * allowing users to select documents in multiple batches.
     */
    const combinedFiles = [...files];

    selectedFiles.forEach((selectedFile) => {
      const alreadyExists = combinedFiles.some(
        (existingFile) =>
          existingFile.name === selectedFile.name &&
          existingFile.size === selectedFile.size &&
          existingFile.lastModified === selectedFile.lastModified,
      );

      if (!alreadyExists) {
        combinedFiles.push(selectedFile);
      }
    });

    const combinedSize = combinedFiles.reduce(
      (total, file) => total + file.size,
      0,
    );

    if (combinedSize > MAX_UPLOAD_BYTES) {
      setFileError(
        "The combined size of all uploaded files must not exceed 100 MB.",
      );

      event.target.value = "";
      return;
    }

    setFiles(combinedFiles);
    setFileError("");
    event.target.value = "";
  };

  const removeFile = (fileIndex) => {
    setFiles((currentFiles) =>
      currentFiles.filter((_, index) => index !== fileIndex),
    );

    setFileError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!event.currentTarget.checkValidity()) {
      event.currentTarget.reportValidity();
      return;
    }

    if (files.length === 0) {
      setFileError("Upload at least one supporting document.");
      goToStep(7);
      return;
    }

    const payload = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      payload.append(key, value);
    });

    files.forEach((file) => {
      payload.append("documents[]", file);
    });

    /*
     * Connect this to your API:
     *
     * await axios.post("/api/verification", payload, {
     *   headers: {
     *     "Content-Type": "multipart/form-data",
     *   },
     * });
     */

    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
          <span className="vr-step">Step {step} of 8</span>
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

      {step === 1 && (
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

          <ReviewChecklist step={1} />
        </section>
      )}

      {step >= 2 && step <= 8 && (
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
                    <div className="vr-row">
                      <SelectField
                        label="Account type"
                        name="account_type"
                        value={formData.account_type}
                        required
                        onChange={updateField}
                        options={[
                          "Business",
                          "Institutional investor",
                          "Fund",
                          "Family office",
                          "Angel investor",
                          "Syndicate",
                          "Government or development institution",
                          "Other",
                        ]}
                      />

                      <SelectField
                        label="Applicant profile"
                        name="applicant_profile"
                        value={formData.applicant_profile}
                        required
                        onChange={updateField}
                        options={[
                          "Company",
                          "Partnership",
                          "Sole proprietor",
                          "Nonprofit",
                          "Trust",
                          "Cooperative",
                          "Public body",
                          "Individual investor",
                        ]}
                      />
                    </div>

                    <div className="vr-row">
                      <Field
                        label="Legal or full name"
                        name="legal_name"
                        value={formData.legal_name}
                        required
                        onChange={updateField}
                      />

                      <Field
                        label="Trading name"
                        name="trading_name"
                        value={formData.trading_name}
                        onChange={updateField}
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
                        onChange={updateField}
                      />
                    </div>

                    <div className="vr-row">
                      <Field
                        label="Date established or date of birth"
                        name="established_date"
                        value={formData.established_date}
                        type="date"
                        required
                        onChange={updateField}
                      />

                      <SelectField
                        label="Legal structure"
                        name="legal_structure"
                        value={formData.legal_structure}
                        required
                        onChange={updateField}
                        options={[
                          "Private limited",
                          "Public limited",
                          "Partnership",
                          "Sole proprietorship",
                          "Nonprofit",
                          "Trust",
                          "Fund",
                          "Other",
                        ]}
                      />
                    </div>

                    <div className="vr-row">
                      <SelectField
                        label="Country of incorporation or residence"
                        name="country"
                        value={formData.country}
                        required
                        onChange={updateField}
                        options={countries}
                      />

                      <Field
                        label="State, province or region"
                        name="region"
                        value={formData.region}
                        required
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
                        label="City and postal code"
                        name="city_postal"
                        value={formData.city_postal}
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
                        placeholder="https://example.com"
                        onChange={updateField}
                      />

                      <Field
                        label="LEI or D-U-N-S number"
                        name="external_identifier"
                        value={formData.external_identifier}
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
                      <SelectField
                        label="Primary sector"
                        name="sector"
                        value={formData.sector}
                        required
                        onChange={updateField}
                        options={sectors}
                      />

                      <Field
                        label="Business model"
                        name="business_model"
                        value={formData.business_model}
                        required
                        placeholder="B2B, B2C, marketplace..."
                        onChange={updateField}
                      />
                    </div>

                    <div className="vr-row">
                      <Field
                        label="Products or services"
                        name="products_services"
                        value={formData.products_services}
                        required
                        onChange={updateField}
                      />

                      <Field
                        label="Countries of operation"
                        name="operating_countries"
                        value={formData.operating_countries}
                        required
                        onChange={updateField}
                      />
                    </div>

                    <div className="vr-row">
                      <Field
                        label="Number of employees"
                        name="employee_count"
                        value={formData.employee_count}
                        type="number"
                        min="0"
                        required
                        onChange={updateField}
                      />

                      <Field
                        label="Company stage"
                        name="company_stage"
                        value={formData.company_stage}
                        required
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

                      <Field
                        label="Revenue currency"
                        name="revenue_currency"
                        value={formData.revenue_currency}
                        placeholder="USD"
                        maxLength="3"
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

                      <Field
                        label="Public listing or ticker"
                        name="listing_ticker"
                        value={formData.listing_ticker}
                        onChange={updateField}
                      />
                    </div>

                    <TextareaField
                      label="Business description"
                      name="business_description"
                      value={formData.business_description}
                      required
                      onChange={updateField}
                    />
                  </Section>
                )}

                {step === 4 && (
                  <Section
                    icon={<UsersRound size={20} />}
                    title="Ownership, leadership and control"
                  >
                    <div className="vr-row">
                      <Field
                        label="Ultimate parent company"
                        name="parent_company"
                        value={formData.parent_company}
                        onChange={updateField}
                      />

                      <Field
                        label="Ownership type"
                        name="ownership_type"
                        value={formData.ownership_type}
                        required
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

                    <TextareaField
                      label="Directors, trustees or general partners"
                      name="directors"
                      value={formData.directors}
                      required
                      placeholder="Enter each person's name, title and nationality."
                      onChange={updateField}
                    />

                    <div className="vr-row">
                      <Field
                        label="Authorized signatory"
                        name="authorized_signatory"
                        value={formData.authorized_signatory}
                        required
                        onChange={updateField}
                      />

                      <Field
                        label="Signatory title"
                        name="signatory_title"
                        value={formData.signatory_title}
                        required
                        onChange={updateField}
                      />
                    </div>

                    <div className="vr-row">
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
                  </Section>
                )}

                {step === 5 && (
                  <Section
                    icon={<WalletCards size={20} />}
                    title="Investor profile and funding preferences"
                  >
                    <div className="vr-row">
                      <SelectField
                        label="Investor status"
                        name="investor_status"
                        value={formData.investor_status}
                        required
                        onChange={updateField}
                        options={[
                          "Not an investor",
                          "Retail",
                          "Accredited or qualified",
                          "Professional",
                          "Institutional",
                        ]}
                      />

                      <SelectField
                        label="Investment role"
                        name="investment_role"
                        value={formData.investment_role}
                        required
                        onChange={updateField}
                        options={[
                          "Investor",
                          "Fund manager",
                          "Advisor",
                          "Limited partner",
                          "Lead investor",
                          "Co-investor",
                          "Other",
                        ]}
                      />
                    </div>

                    <div className="vr-row">
                      <Field
                        label="Assets under management"
                        name="aum"
                        value={formData.aum}
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        onChange={updateField}
                      />

                      <Field
                        label="AUM currency"
                        name="aum_currency"
                        value={formData.aum_currency}
                        placeholder="USD"
                        maxLength="3"
                        required
                        onChange={updateField}
                      />
                    </div>

                    <div className="vr-row">
                      <Field
                        label="Minimum investment or ticket"
                        name="minimum_ticket"
                        value={formData.minimum_ticket}
                        type="number"
                        min="0"
                        required
                        onChange={updateField}
                      />

                      <Field
                        label="Maximum investment or ticket"
                        name="maximum_ticket"
                        value={formData.maximum_ticket}
                        type="number"
                        min="0"
                        required
                        onChange={updateField}
                      />
                    </div>

                    <div className="vr-row">
                      <Field
                        label="Ticket currency"
                        name="ticket_currency"
                        value={formData.ticket_currency}
                        placeholder="USD"
                        maxLength="3"
                        required
                        onChange={updateField}
                      />

                      <Field
                        label="Preferred investment stages"
                        name="preferred_stages"
                        value={formData.preferred_stages}
                        required
                        placeholder="Seed, Series A, growth..."
                        onChange={updateField}
                      />
                    </div>

                    <div className="vr-row">
                      <Field
                        label="Preferred sectors"
                        name="preferred_sectors"
                        value={formData.preferred_sectors}
                        required
                        onChange={updateField}
                      />

                      <Field
                        label="Preferred geographies"
                        name="preferred_geographies"
                        value={formData.preferred_geographies}
                        required
                        onChange={updateField}
                      />
                    </div>

                    <div className="vr-row">
                      <Field
                        label="Investment horizon in years"
                        name="investment_horizon"
                        value={formData.investment_horizon}
                        type="number"
                        min="0"
                        required
                        onChange={updateField}
                      />

                      <Field
                        label="Target return or IRR percentage"
                        name="target_return"
                        value={formData.target_return}
                        type="number"
                        step="0.01"
                        required
                        onChange={updateField}
                      />
                    </div>

                    <Field
                      label="Risk tolerance"
                      name="risk_tolerance"
                      value={formData.risk_tolerance}
                      required
                      placeholder="Low, moderate or high"
                      onChange={updateField}
                    />

                    <TextareaField
                      label="Investment mandate, restrictions and ESG criteria"
                      name="investment_mandate"
                      value={formData.investment_mandate}
                      required
                      onChange={updateField}
                    />
                  </Section>
                )}

                {step === 6 && (
                  <Section
                    icon={<ShieldCheck size={20} />}
                    title="Financial, banking and compliance"
                  >
                    <div className="vr-row">
                      <Field
                        label="Bank name"
                        name="bank_name"
                        value={formData.bank_name}
                        required
                        onChange={updateField}
                      />

                      <Field
                        label="Bank country"
                        name="bank_country"
                        value={formData.bank_country}
                        required
                        onChange={updateField}
                      />
                    </div>

                    <div className="vr-row">
                      <Field
                        label="Account holder name"
                        name="bank_account_name"
                        value={formData.bank_account_name}
                        required
                        onChange={updateField}
                      />

                      <Field
                        label="IBAN or account number"
                        name="bank_account_number"
                        value={formData.bank_account_number}
                        required
                        onChange={updateField}
                      />
                    </div>

                    <div className="vr-row">
                      <Field
                        label="SWIFT or BIC"
                        name="swift_bic"
                        value={formData.swift_bic}
                        required
                        onChange={updateField}
                      />

                      <Field
                        label="Source of funds or wealth"
                        name="source_of_funds"
                        value={formData.source_of_funds}
                        required
                        onChange={updateField}
                      />
                    </div>

                    <div className="vr-row">
                      <SelectField
                        label="Audited financial statements available?"
                        name="audited_financials"
                        value={formData.audited_financials}
                        required
                        onChange={updateField}
                        options={["Yes", "No", "Not applicable"]}
                      />

                      <SelectField
                        label="Regulated entity?"
                        name="regulated_entity"
                        value={formData.regulated_entity}
                        required
                        onChange={updateField}
                        options={["Yes", "No"]}
                      />
                    </div>

                    <div className="vr-row">
                      <Field
                        label="Regulator and license number"
                        name="regulator_license"
                        value={formData.regulator_license}
                        onChange={updateField}
                      />

                      <Field
                        label="AML or compliance officer"
                        name="compliance_officer"
                        value={formData.compliance_officer}
                        onChange={updateField}
                      />
                    </div>

                    <div className="vr-checkGrid">
                      <label>
                        <input
                          type="checkbox"
                          name="pep_exposure"
                          checked={formData.pep_exposure}
                          onChange={updateField}
                        />
                        Owner or controller is a politically exposed person
                      </label>

                      <label>
                        <input
                          type="checkbox"
                          name="sanctions_exposure"
                          checked={formData.sanctions_exposure}
                          onChange={updateField}
                        />
                        Sanctions exposure exists
                      </label>

                      <label>
                        <input
                          type="checkbox"
                          name="adverse_media"
                          checked={formData.adverse_media}
                          onChange={updateField}
                        />
                        Material adverse media exists
                      </label>

                      <label>
                        <input
                          type="checkbox"
                          name="legal_proceedings"
                          checked={formData.legal_proceedings}
                          onChange={updateField}
                        />
                        Material litigation or insolvency exists
                      </label>
                    </div>

                    <TextareaField
                      label="Compliance disclosures and explanations"
                      name="compliance_notes"
                      value={formData.compliance_notes}
                      placeholder="Explain every selected disclosure or enter 'None'."
                      required
                      onChange={updateField}
                    />
                  </Section>
                )}

                {step === 7 && (
                  <Section
                    icon={<FileCheck2 size={20} />}
                    title="Supporting documents"
                  >
                    <p className="small">
                      Upload registration, tax, ownership, identity, address,
                      financial, banking, source-of-funds, investment-mandate
                      and regulatory documents.
                    </p>

                    <p className="vr-uploadRule">
                      Accepted: PDF, Word, Excel, CSV, JPG and PNG. Maximum 100
                      MB per file and 100 MB combined.
                    </p>

                    <label
                      className="vr-upload"
                      htmlFor="verification_documents"
                    >
                      <UploadCloud size={28} />

                      <span className="vr-uploadText">
                        <strong>Choose one or more documents</strong>
                        <span>
                          You may select multiple documents in one or more
                          batches.
                        </span>
                      </span>

                      <input
                        id="verification_documents"
                        name="documents[]"
                        type="file"
                        accept={ACCEPTED_FILES}
                        multiple
                        onChange={handleFiles}
                      />
                    </label>

                    {fileError && (
                      <p className="vr-error" role="alert">
                        {fileError}
                      </p>
                    )}

                    {files.length > 0 && (
                      <ul className="vr-fileList">
                        {files.map((file, index) => (
                          <li
                            key={`${file.name}-${file.size}-${file.lastModified}`}
                          >
                            <span className="vr-fileMeta">
                              <strong>{file.name}</strong>
                              <span>
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </span>
                            </span>

                            <button
                              className="vr-fileRemove"
                              type="button"
                              aria-label={`Remove ${file.name}`}
                              onClick={() => removeFile(index)}
                            >
                              ×
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </Section>
                )}

                {step === 8 && (
                  <>
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
                          label="Referral or source"
                          name="referral_source"
                          value={formData.referral_source}
                          onChange={updateField}
                        />
                      </div>
                    </Section>

                    <Section
                      icon={<CheckCircle2 size={20} />}
                      title="Confirmation and acknowledgment"
                    >
                      <div className="vr-finalSummary">
                        <div>
                          <span>Applicant</span>
                          <strong>
                            {formData.legal_name || "Not provided"}
                          </strong>
                        </div>

                        <div>
                          <span>Account type</span>
                          <strong>
                            {formData.account_type || "Not provided"}
                          </strong>
                        </div>

                        <div>
                          <span>Country</span>
                          <strong>{formData.country || "Not provided"}</strong>
                        </div>

                        <div>
                          <span>Documents</span>
                          <strong>{files.length} selected</strong>
                        </div>
                      </div>

                      <div className="vr-consent">
                        <input
                          id="accuracy_consent"
                          name="accuracy_consent"
                          type="checkbox"
                          required
                          checked={formData.accuracy_consent}
                          onChange={updateField}
                        />

                        <label htmlFor="accuracy_consent">
                          I confirm that the information and documents are
                          accurate, complete and current. I am authorized to
                          submit them and consent to identity, KYB/KYC, AML,
                          sanctions and document checks. *
                        </label>
                      </div>

                      <div className="vr-consent">
                        <input
                          id="privacy_consent"
                          name="privacy_consent"
                          type="checkbox"
                          required
                          checked={formData.privacy_consent}
                          onChange={updateField}
                        />

                        <label htmlFor="privacy_consent">
                          I acknowledge the privacy notice and consent to the
                          secure processing and retention of the submitted
                          information. *
                        </label>
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

                  {step < 8 ? (
                    <button
                      className="vr-btn"
                      type="button"
                      onClick={handleNext}
                    >
                      Next
                      <ArrowRight size={17} />
                    </button>
                  ) : (
                    <button className="vr-btn" type="submit">
                      Submit for Verification
                      <CheckCircle2 size={17} />
                    </button>
                  )}
                </div>
              </form>
            )}
          </article>

          {!submitted && <ReviewChecklist step={step} />}
        </section>
      )}
    </main>
  );
}