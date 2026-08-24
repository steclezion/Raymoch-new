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
  MessageCircle,
  Send,
  SearchCheck,
  ShieldCheck,
  UploadCloud,
  UserRound,
  UsersRound,
} from "lucide-react";

import "./verificationModal.css";
import "./verificationModal.chatbot.css";
import "./verificationModal.fieldHelp.css";
import "./verificationModal.signature.css";
import ConfirmationDialog from "./ConfirmationDialog";

const MAX_UPLOAD_BYTES = 100 * 1024 * 1024;

// Leave VITE_API_URL empty when React and Laravel use the same origin.
// Example for separate Vite/Laravel development servers:
// VITE_API_URL=http://127.0.0.1:8000
const API_BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const ASSISTANT_ENDPOINT = `${API_BASE_URL}/api/verification/assistant`;
const VERIFICATION_ENDPOINT = `${API_BASE_URL}/api/verification`;

const ACCEPTED_FILES =
  ".pdf,.doc,.docx,.xls,.xlsx,.csv,.jpg,.jpeg,.png";

const FIELD_HELP_EVENT = "verification:ask-field-help";

const REQUIRED_FIELD_HELP = {
  account_type_id: "The type of account being verified, such as a business, institution, or investor account. Choose the option that best matches how this account will be used.",
  applicant_profile_id: "The category that describes the person or organization applying. This helps determine the identity and compliance checks that apply.",
  sector_id: "The broad area of the economy in which the organization operates.",
  industry_id: "The more specific line of business within the selected sector.",
  legal_name: "The official name shown on government-issued identity, incorporation, registration, or licensing records.",
  registration_number: "The unique number assigned by the authority that registered or licensed the applicant.",
  established_date: "The organization’s official formation date, or the individual applicant’s date of birth, as shown on supporting records.",
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
  annual_revenue: "The organization’s revenue for its most recently completed financial year, before expenses are deducted.",
  revenue_currency: "The currency in which annual revenue is reported.",
  fiscal_year_end: "The final date of the organization’s annual accounting period.",
  business_description: "A clear overview of the organization’s activities, customers, markets, delivery model, and sources of revenue.",
  ownership_type: "The general ownership classification, such as privately held, publicly traded, state-owned, cooperative, or nonprofit.",
  beneficial_owners: "The individuals who ultimately own or control the applicant. Include the identifying and ownership details requested by your jurisdiction.",
  directors: "The directors, trustees, general partners, or equivalent people responsible for governing the organization.",
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

function FieldLabel({ label, name, required }) {
  return (
    <div className="vr-labelWithHelp">
      <label htmlFor={name}>
        {label}
        {required && " *"}
      </label>
      {required && <RequiredFieldHelp name={name} label={label} />}
    </div>
  );
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
    valid: (value) => new Date(`${value}T00:00:00`) <= new Date(),
    message: "Date established or date of birth cannot be in the future.",
  },
  postal_code: {
    valid: (value) => /^[A-Za-z0-9][A-Za-z0-9 -]{1,11}$/.test(value.trim()),
    message: "Postal code must be 2–12 letters, numbers, spaces, or hyphens.",
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
  operating_countries: [],
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
  type = "text",
  placeholder,
  onChange,
  children,
  ...props
}) {
  return (
    <div className="vr-field">
      <FieldLabel label={label} name={name} required={required} />

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

function SelectField({
  label,
  name,
  value,
  options = [],
  required = false,
  onChange,
}) {
  const safeOptions = asArray(options);

  return (
    <Field label={label} name={name} required={required}>
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
        value={value ?? ""}
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

      <div className={`vr-assistant ${assistantOpen ? "is-open" : ""}`}>
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

export default function VerificationModal() {
  const initialPageKeyRef = useRef(currentVerificationPageKey());
  const initialDraftRef = useRef(
    readVerificationDraft(initialPageKeyRef.current),
  );

  const [step, setStep] = useState(() => initialDraftRef.current.step);
  const [formData, setFormData] = useState(
    () => initialDraftRef.current.formData,
  );
  const [files, setFiles] = useState(() => initialDraftRef.current.files);
  const [draftRecoveryWarning, setDraftRecoveryWarning] = useState(
    () => initialDraftRef.current.hadRecoveryIssue,
  );
  const [fileError, setFileError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [submissionReference, setSubmissionReference] = useState("");
  const [optionError, setOptionError] = useState("");
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantQuestion, setAssistantQuestion] = useState("");
  const [assistantLoading, setAssistantLoading] = useState(false);
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
  const assistantMessagesRef = useRef(null);
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
          currencies: asArray(
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

  useEffect(() => {
    const container = assistantMessagesRef.current;
    if (container) container.scrollTop = container.scrollHeight;
  }, [assistantMessages, assistantLoading]);

  useEffect(() => () => assistantAbortRef.current?.abort(), []);

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
      scopeIssues[0].field.focus();
      return false;
    }

    if (step === 4 && !signatureDataUrl) {
      setSignatureOpen(true);
      pushAssistantMessage(
        "The authorized signatory must provide a handwritten signature before continuing.",
        "assistant",
        "error",
      );
      return false;
    }

    if (step === 5 && files.length === 0) {
      setFileError("Upload at least one supporting document.");
      pushAssistantMessage(
        "Supporting documents are required. Upload at least one readable PDF, Word, Excel, CSV, JPG, or PNG file before continuing.",
        "assistant",
        "error",
      );
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
      if (key === "operating_countries" && Array.isArray(value)) {
        value.forEach((countryName) => {
          payload.append("operating_countries[]", countryName);
        });
        return;
      }

      payload.append(key, value);
    });

    files.forEach((file) => {
      payload.append("documents[]", file);
    });

    if (!signatureDataUrl) {
      setSubmissionError("The authorized signatory’s handwritten signature is required.");
      goToStep(4);
      setSignatureOpen(true);
      return;
    }

    const signatureBlob = await fetch(signatureDataUrl).then((response) =>
      response.blob(),
    );
    payload.append(
      "authorized_signatory_signature",
      signatureBlob,
      "authorized-signatory-signature.png",
    );

    setSubmissionLoading(true);
    setSubmissionError("");

    try {
      const response = await fetch(VERIFICATION_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: payload,
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const firstValidationError = Object.values(data.errors || {})[0]?.[0];
        throw new Error(
          firstValidationError || data.message || "Submission failed.",
        );
      }

      setSubmissionReference(data.reference || "");
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setSubmissionError(error.message || "Submission failed. Please try again.");
    } finally {
      setSubmissionLoading(false);
    }
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

                      <Field
                        label="Public listing or ticker"
                        name="listing_ticker"
                        value={formData.listing_ticker}
                        placeholder="Pre-revenue, growth, mature..."
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
                        readOnly
                        placeholder="Click to enter a name and sign"
                        title="Open the handwritten signature form"
                        aria-haspopup="dialog"
                        onClick={() => setSignatureOpen(true)}
                        onFocus={() => setSignatureOpen(true)}
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

                      <div className="vr-consent">
                        <input
                          id="privacy_consent"
                          name="privacy_consent"
                          type="checkbox"
                          required
                          checked={formData.privacy_consent}
                          onChange={updateField}
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
                        onClick={handleNext}
                      >
                        Next
                        <ArrowRight size={17} />
                      </button>
                    ) : (
                      <button
                        className="vr-btn"
                        type="submit"
                        disabled={submissionLoading}
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
