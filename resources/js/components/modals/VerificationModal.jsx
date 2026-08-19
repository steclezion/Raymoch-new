import React, { useEffect, useRef, useState } from "react";
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
} from "lucide-react";

import "./verificationModal.css";

const MAX_UPLOAD_BYTES = 100 * 1024 * 1024;

const ACCEPTED_FILES =
  ".pdf,.doc,.docx,.xls,.xlsx,.csv,.jpg,.jpeg,.png";

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
  applicant_profile_id: "",
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

        {options.map((option) => {
          const optionValue = typeof option === "object" ? option.id : option;
          const optionLabel = typeof option === "object" ? option.name : option;

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

function selectedOptionName(options, selectedId) {
  return (
    options.find((option) => String(option.id) === String(selectedId))?.name ||
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

function ReviewChecklist({ step }) {
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
    </aside>
  );
}

export default function VerificationModal() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [files, setFiles] = useState([]);
  const [fileError, setFileError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [optionError, setOptionError] = useState("");
  const [lookupOptions, setLookupOptions] = useState({
    accountTypes: [],
    applicantProfiles: [],
    sectors: [],
    industries: [],
    legalStructures: [],
    regions: [],
    countries: [],
    states: [],
    cities: [],
  });

  // useRef keeps the request cache stable across renders without rerendering.
  const requestCacheRef = useRef(new Map());
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

  const currentStep = stepMeta[step];
  const progress = Math.round((step / 6) * 100);

  useEffect(() => {
    const controller = new AbortController();

    fetchOptionsRef.current("/api/verification/options", controller.signal)
      .then((data) => {
        setLookupOptions((current) => ({
          ...current,
          accountTypes: data.account_types || [],
          applicantProfiles: data.applicant_profiles || [],
          sectors: data.sectors || [],
          legalStructures: data.legal_structures || [],
          regions: data.regions || [],
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
      `/api/verification/options/industries?sector_id=${formData.sector_id}`,
      controller.signal,
    )
      .then((data) => {
        setLookupOptions((current) => ({ ...current, industries: data }));
        setOptionError("");
      })
      .catch((error) => {
        if (error.name !== "AbortError") setOptionError(error.message);
      });
    return () => controller.abort();
  }, [formData.sector_id]);

  useEffect(() => {
    if (!formData.region_id) {
      setLookupOptions((current) => ({ ...current, countries: [] }));
      return undefined;
    }

    const controller = new AbortController();
    fetchOptionsRef.current(
      `/api/verification/options/countries?region_id=${formData.region_id}`,
      controller.signal,
    )
      .then((data) => {
        setLookupOptions((current) => ({ ...current, countries: data }));
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
      `/api/verification/options/states?country_id=${formData.country_id}`,
      controller.signal,
    )
      .then((data) => {
        setLookupOptions((current) => ({ ...current, states: data }));
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
      `/api/verification/options/cities?state_id=${formData.state_id}`,
      controller.signal,
    )
      .then((data) => {
        setLookupOptions((current) => ({ ...current, cities: data }));
        setOptionError("");
      })
      .catch((error) => {
        if (error.name !== "AbortError") setOptionError(error.message);
      });
    return () => controller.abort();
  }, [formData.state_id]);

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((current) => {
      const next = {
        ...current,
        [name]: type === "checkbox" ? checked : value,
      };

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

    if (step === 5 && files.length === 0) {
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
      goToStep(5);
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

      {step >= 2 && step <= 6 && (
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

                      <SelectField
                        label="Applicant profile"
                        name="applicant_profile_id"
                        value={formData.applicant_profile_id}
                        required
                        onChange={updateField}
                        options={lookupOptions.applicantProfiles}
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
                        name="legal_structure_id"
                        value={formData.legal_structure_id}
                        required
                        onChange={updateField}
                        options={lookupOptions.legalStructures}
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
                        required
                        onChange={updateField}
                        options={lookupOptions.states}
                      />

                      <SelectField
                        label="City"
                        name="city_id"
                        value={formData.city_id}
                        required
                        onChange={updateField}
                        options={lookupOptions.cities}
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

                {step === 6 && (
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
                            {selectedOptionName(
                              lookupOptions.accountTypes,
                              formData.account_type_id,
                            )}
                          </strong>
                        </div>

                        <div>
                          <span>Country</span>
                          <strong>
                            {selectedOptionName(
                              lookupOptions.countries,
                              formData.country_id,
                            )}
                          </strong>
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

                  {step < 6 ? (
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


