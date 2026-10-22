import React, { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Check,
  Clock3,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import AuthAwareNavigation from "./AuthAwareNavigation.jsx";
import Footer from "./layout_master/Footer.jsx";
import "./trial.css";

const INITIAL_FORM = {
  first_name: "",
  last_name: "",
  business_email: "",
  phone: "",
  company: "",
  agree_privacy: false,
};

export default function RequestTrial({ apiUrl, apiCheckUrl, csrfToken }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(false);
  const [existingEmail, setExistingEmail] = useState("");
  const [notice, setNotice] = useState(null);
  const [showPolicy, setShowPolicy] = useState(false);
  const noticeRef = useRef(null);

  useEffect(() => {
    if (!showPolicy) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event) => event.key === "Escape" && setShowPolicy(false);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [showPolicy]);

  const update = (event) => {
    const { name, type, checked, value } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
    if (name === "business_email") setExistingEmail("");
    setErrors((current) => ({ ...current, [name]: undefined }));
    setNotice(null);
  };

  const validate = () => {
    const next = {};
    if (!form.first_name.trim()) next.first_name = "Enter your first name.";
    if (!form.last_name.trim()) next.last_name = "Enter your last name.";
    if (!/^\S+@\S+\.\S+$/.test(form.business_email)) next.business_email = "Enter a valid business email.";
    if (!form.agree_privacy) next.agree_privacy = "Please accept the privacy policy to continue.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const checkExisting = async () => {
    if (!form.business_email || errors.business_email) return false;
    setChecking(true);
    try {
      const response = await fetch(apiCheckUrl, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.business_email, phone: form.phone || null }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok && data.exists) {
        setExistingEmail(form.business_email);
        setErrors((current) => ({ ...current, business_email: data.message || "A trial request already exists for this email." }));
        return true;
      }
    } catch {
      // Availability checks must never prevent a legitimate form submission.
    } finally {
      setChecking(false);
    }
    return false;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    if (existingEmail === form.business_email) {
      setNotice({ type: "error", message: "A trial request already exists for this email. Contact support if you need help continuing it." });
      return;
    }
    setBusy(true);
    setNotice(null);
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          ...(csrfToken ? { "X-CSRF-TOKEN": csrfToken } : {}),
        },
        body: JSON.stringify(form),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.ok) {
        const serverErrors = data.errors || {};
        setErrors(serverErrors);
        throw new Error(Object.values(serverErrors).flat()[0] || data.message || "We could not submit your request.");
      }
      setNotice({ type: "success", message: "Coupon sent. Opening secure coupon verification…" });
      window.setTimeout(() => {
        window.location.assign(data.redirect || `/trial/verify?email=${encodeURIComponent(form.business_email)}`);
      }, 450);
    } catch (error) {
      setNotice({ type: "error", message: error.message || "A network error occurred. Please try again." });
      window.setTimeout(() => noticeRef.current?.focus(), 20);
    } finally {
      setBusy(false);
    }
  };

  const field = (name, label, Icon, props = {}) => (
    <label className={`trial-field ${errors[name] ? "has-error" : ""}`}>
      <span>{label}{props.required ? <em aria-hidden="true">*</em> : null}</span>
      <span className="trial-input-shell">
        <Icon size={18} aria-hidden="true" />
        <input
          {...props}
          name={name}
          value={form[name]}
          onChange={update}
          aria-invalid={Boolean(errors[name])}
          aria-describedby={errors[name] ? `${name}-error` : undefined}
        />
      </span>
      {errors[name] ? <small id={`${name}-error`} role="alert">{Array.isArray(errors[name]) ? errors[name][0] : errors[name]}</small> : null}
    </label>
  );

  return (
    <div className="trial-page">
      <AuthAwareNavigation activePath="/request-trial" />
      <main className="trial-main">
        <section className="trial-intro" aria-labelledby="trial-page-title">
          <div className="trial-intro__copy">
            <span className="trial-kicker"><Sparkles size={15} /> Guided product access</span>
            <h1 id="trial-page-title">See trusted opportunities with greater clarity.</h1>
            <p>Request a guided Raymoch trial and explore verified business intelligence, market signals, and matching tools built for confident decisions.</p>
            <div className="trial-benefits">
              <div><span><BadgeCheck /></span><strong>Verified intelligence</strong><p>Review structured company and opportunity information.</p></div>
              <div><span><Clock3 /></span><strong>Fast onboarding</strong><p>Our team responds to qualified requests within 24 hours.</p></div>
              <div><span><ShieldCheck /></span><strong>Privacy first</strong><p>Your details are protected and used only for your trial.</p></div>
            </div>
          </div>
        </section>

        <section className="trial-form-card" aria-labelledby="trial-form-title">
          <div className="trial-form-card__heading">
            <p>Request access</p>
            <h2 id="trial-form-title">Start your free trial</h2>
            <span>Tell us a little about you. We’ll email your secure six-digit trial coupon next.</span>
          </div>

          {notice ? <div ref={noticeRef} tabIndex={-1} className={`trial-notice is-${notice.type}`} role={notice.type === "error" ? "alert" : "status"}>{notice.type === "success" ? <Check size={18} /> : null}{notice.message}</div> : null}

          <form onSubmit={submit} noValidate>
            <div className="trial-fields">
              {field("first_name", "First name", UserRound, { type: "text", autoComplete: "given-name", placeholder: "Amara", maxLength: 100, required: true, autoFocus: true })}
              {field("last_name", "Last name", UserRound, { type: "text", autoComplete: "family-name", placeholder: "Okafor", maxLength: 100, required: true })}
              <div className="trial-field--wide" onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) checkExisting(); }}>
                {field("business_email", "Business email", Mail, { type: "email", autoComplete: "email", placeholder: "you@company.com", maxLength: 255, required: true })}
                {checking ? <span className="trial-checking">Checking availability…</span> : null}
              </div>
              {field("phone", "Phone number", Phone, { type: "tel", autoComplete: "tel", placeholder: "+1 555 000 0000", maxLength: 40 })}
              {field("company", "Company or organization", Building2, { type: "text", autoComplete: "organization", placeholder: "Your organization", maxLength: 255 })}
            </div>

            <label className={`trial-consent ${errors.agree_privacy ? "has-error" : ""}`}>
              <input type="checkbox" name="agree_privacy" checked={form.agree_privacy} onChange={update} />
              <span>I agree to Raymoch’s <button type="button" onClick={() => setShowPolicy(true)}>trial privacy notice</button> and consent to being contacted about this request.</span>
            </label>
            {errors.agree_privacy ? <small className="trial-consent-error" role="alert">{errors.agree_privacy}</small> : null}

            <button className="trial-submit" type="submit" disabled={busy || checking}>
              {busy ? <><span className="trial-spinner" /> Submitting securely…</> : <>Request free trial <ArrowRight size={18} /></>}
            </button>
            <p className="trial-security"><ShieldCheck size={15} /> Secure submission. No payment card required.</p>
          </form>
        </section>
      </main>

      <section className="trial-assurance" aria-label="Trial assurance">
        <p><strong>What happens next?</strong> Enter the six-digit coupon from your email to activate the trial and sign in securely.</p>
      </section>
      <Footer />

      {showPolicy ? (
        <div className="trial-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setShowPolicy(false)}>
          <section className="trial-modal" role="dialog" aria-modal="true" aria-labelledby="trial-policy-title">
            <header><div><p>Privacy notice</p><h2 id="trial-policy-title">How we use your information</h2></div><button type="button" onClick={() => setShowPolicy(false)} aria-label="Close privacy notice"><X /></button></header>
            <div className="trial-modal__body">
              <p>We collect your name, business email, organization, and optional phone number to evaluate your trial request, verify your contact details, and provide onboarding support.</p>
              <h3>Purpose and retention</h3>
              <p>Your information is used only for trial administration, security, and relevant Raymoch communication. It is handled according to our privacy practices and is not sold.</p>
              <h3>Your choice</h3>
              <p>You may contact Raymoch to ask about, correct, or remove your trial-request information.</p>
              <a href="/privacy">Read the complete Privacy Policy</a>
            </div>
            <footer><button type="button" className="is-secondary" onClick={() => setShowPolicy(false)}>Close</button><button type="button" onClick={() => { setForm((current) => ({ ...current, agree_privacy: true })); setErrors((current) => ({ ...current, agree_privacy: undefined })); setShowPolicy(false); }}>Accept and continue</button></footer>
          </section>
        </div>
      ) : null}
    </div>
  );
}
