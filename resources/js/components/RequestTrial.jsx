import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  Check,
  Clock3,
  Globe2,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import "./trial.css";

const INITIAL_FORM = {
  first_name: "",
  last_name: "",
  business_email: "",
  country: "",
  country_code: "",
  phone: "",
  company: "",
  agree_privacy: false,
};

export default function RequestTrial({ apiUrl, apiCheckUrl, apiCouponLoginUrl, csrfToken, countries = [] }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(false);
  const [notice, setNotice] = useState(null);
  const [showPolicy, setShowPolicy] = useState(false);
  const [hasCoupon, setHasCoupon] = useState(() => window.location.hash === "#coupon-login");
  const [couponLogin, setCouponLogin] = useState(() => ({
    email: new URLSearchParams(window.location.search).get("email") || "",
    coupon: "",
  }));
  const [couponBusy, setCouponBusy] = useState(false);
  const [couponNotice, setCouponNotice] = useState(null);
  const noticeRef = useRef(null);
  const couponSectionRef = useRef(null);
  const couponEmailRef = useRef(null);

  useEffect(() => {
    if (window.location.hash !== "#coupon-login") return;
    setHasCoupon(true);
    const frame = window.requestAnimationFrame(() => {
      couponSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      window.setTimeout(() => couponEmailRef.current?.focus({ preventScroll: true }), 650);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

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
    setErrors((current) => ({ ...current, [name]: undefined }));
    setNotice(null);
  };

  const validate = () => {
    const next = {};
    if (!form.first_name.trim()) next.first_name = "Enter your first name.";
    if (!form.last_name.trim()) next.last_name = "Enter your last name.";
    if (!/^\S+@\S+\.\S+$/.test(form.business_email)) next.business_email = "Enter a valid business email.";
    if (!form.country) next.country = "Choose your country.";
    if (!form.country_code) next.country_code = "Choose a country code.";
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
        body: JSON.stringify({
          email: form.business_email,
          country_code: form.country_code || null,
          phone: form.phone || null,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok && data.exists) {
        const duplicateErrors = data.errors || {
          business_email: [data.message || "This email is already registered."],
        };
        setErrors((current) => ({ ...current, ...duplicateErrors }));
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

  const selectField = (name, label, options, props = {}) => (
    <label className={`trial-field ${errors[name] ? "has-error" : ""}`}>
      <span>{label}{props.required ? <em aria-hidden="true">*</em> : null}</span>
      <span className="trial-input-shell">
        <Globe2 size={18} aria-hidden="true" />
        <select
          name={name}
          value={form[name]}
          onChange={props.onChange || update}
          autoComplete={props.autoComplete}
          required={props.required}
          aria-invalid={Boolean(errors[name])}
          aria-describedby={errors[name] ? `${name}-error` : undefined}
        >
          <option value="">{props.placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </span>
      {errors[name] ? <small id={`${name}-error`} role="alert">{Array.isArray(errors[name]) ? errors[name][0] : errors[name]}</small> : null}
    </label>
  );

  const submitCouponLogin = async (event) => {
    event.preventDefault();
    setCouponBusy(true);
    setCouponNotice(null);
    try {
      const response = await fetch(apiCouponLoginUrl, {
        method: "POST",
        credentials: "same-origin",
        headers: { Accept: "application/json", "Content-Type": "application/json", ...(csrfToken ? { "X-CSRF-TOKEN": csrfToken } : {}) },
        body: JSON.stringify(couponLogin),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.ok) throw new Error(Object.values(data.errors || {}).flat()[0] || data.message || "Coupon login failed.");
      setCouponNotice({ type: "success", message: data.message });
      window.setTimeout(() => window.location.assign(data.redirect || "/dashboard"), 500);
    } catch (error) {
      setCouponNotice({ type: "error", message: error.message });
    } finally {
      setCouponBusy(false);
    }
  };

  return (
    <div className="trial-page">
      <nav className="trial-return-nav" aria-label="Trial page navigation">
        <a className="trial-return-brand" href="/" aria-label="Raymoch home">
          <img src="/images/raymoch_logo_11_10-26.svg" alt="" />
          <span><strong>Raymoch</strong><small>Trial access</small></span>
        </a>
        <a className="trial-return-link" href="/">
          <span className="trial-return-link__icon"><ArrowLeft aria-hidden="true" /></span>
          <span><small>Exit trial request</small><strong>Back to home</strong></span>
        </a>
      </nav>
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
              {selectField(
                "country",
                "Country",
                countries.map((country) => ({ value: country.name, label: country.name })),
                {
                  required: true,
                  autoComplete: "country-name",
                  placeholder: "Choose a country",
                  onChange: (event) => {
                    const selected = countries.find((country) => country.name === event.target.value);
                    setForm((current) => ({
                      ...current,
                      country: event.target.value,
                      country_code: selected?.tele_code || "",
                    }));
                    setErrors((current) => ({ ...current, country: undefined, country_code: undefined }));
                    setNotice(null);
                  },
                }
              )}
              <label className={`trial-field ${errors.country_code ? "has-error" : ""}`}>
                <span>Country code<em aria-hidden="true">*</em></span>
                <span className="trial-input-shell"><Globe2 size={18} aria-hidden="true" /><input name="country_code" value={form.country_code} readOnly aria-readonly="true" tabIndex={-1} placeholder="Select country first" /></span>
                {errors.country_code ? <small role="alert">{Array.isArray(errors.country_code) ? errors.country_code[0] : errors.country_code}</small> : null}
              </label>
              {field("phone", "Phone number", Phone, { type: "tel", autoComplete: "tel-national", placeholder: "555 000 0000", maxLength: 40, onBlur: checkExisting })}
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
        <p><strong>What happens next?</strong> Verify the six-digit number from your first email. We will then send your secure 16-character login coupon.</p>
      </section>
      <section ref={couponSectionRef} className="trial-coupon-access" id="coupon-login" aria-labelledby="coupon-login-title">
        <label className="trial-coupon-toggle"><input type="checkbox" checked={hasCoupon} onChange={(event) => setHasCoupon(event.target.checked)} /><span><strong>I have a coupon</strong><small>Use the 16-character coupon sent after email verification.</small></span></label>
        {hasCoupon ? <form className="trial-coupon-login" onSubmit={submitCouponLogin}>
          <div><p>Trial access</p><h2 id="coupon-login-title">Sign in with your coupon</h2></div>
          {couponNotice ? <div className={`trial-notice is-${couponNotice.type}`} role="status">{couponNotice.message}</div> : null}
          <label><span>Email</span><input ref={couponEmailRef} type="email" required value={couponLogin.email} onChange={(event) => setCouponLogin((current) => ({ ...current, email: event.target.value }))} autoComplete="email" /></label>
          <label><span>16-character coupon</span><input type="text" required minLength={16} maxLength={16} value={couponLogin.coupon} onChange={(event) => setCouponLogin((current) => ({ ...current, coupon: event.target.value }))} autoComplete="off" /></label>
          <button type="submit" disabled={couponBusy}>{couponBusy ? "Checking coupon…" : "Login"}</button>
        </form> : null}
      </section>
      <footer className="trial-login-footer">
        <div>© 2026 Raymoch. All rights reserved.</div>
        <nav aria-label="Legal links">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/cookies">Cookies</a>
        </nav>
      </footer>

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
