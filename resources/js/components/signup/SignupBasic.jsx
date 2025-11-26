// resources/js/pages/SignupBasic.jsx
import React, { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header.jsx";

import Select from "react-select";
import ReactCountryFlag from "react-country-flag";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

// Register English country names
countries.registerLocale(enLocale);

/** Build a full, sorted list of { value: "+1", iso2: "US", name: "United States" } */
function buildAllCountryOptions() {
  const seen = new Set();
  const opts =
    getCountries()
      .map((iso2Lower) => {
        try {
          const iso2 = iso2Lower.toUpperCase();
          const name =
            countries.getName(iso2, "en", { select: "official" }) ||
            countries.getName(iso2, "en") ||
            iso2;
          const value = "+" + getCountryCallingCode(iso2Lower);
          const key = `${iso2}|${value}`;
          if (seen.has(key)) return null;
          seen.add(key);
          return { value, iso2, name };
        } catch {
          return null;
        }
      })
      .filter(Boolean) || [];

  // Sort primarily by numeric calling code, then by name
  opts.sort((a, b) => {
    const na = parseInt(a.value.slice(1), 10);
    const nb = parseInt(b.value.slice(1), 10);
    if (na !== nb) return na - nb;
    return a.name.localeCompare(b.name);
  });

  return opts;
}

const CC_OPTIONS = buildAllCountryOptions();

// Helpers for the react-select option display with flag + text
const formatCCOption = (o) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <ReactCountryFlag
      svg
      countryCode={o.iso2}
      style={{ width: 20, height: 14 }}
      title={o.name}
    />
    <strong>{o.value}</strong>
    <span style={{ opacity: 0.7 }}>{o.name}</span>
  </div>
);

const getOptionValue = (o) => `${o.iso2}-${o.value}`;
const getOptionLabel = (o) => `${o.value} ${o.name}`;


/* ================== Reusable Modal component ================== */
function Modal({ title, open, onClose, children }) {
  useEffect(() => {
    const onEsc = (e) => { if (e.key === "Escape") onClose?.(); };
    if (open) document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="modalOverlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modalCard">
        <div className="modalHead">
          <h3 id="modal-title">{title}</h3>
          <button className="modalClose" aria-label="Close" onClick={onClose}>×</button>
        </div>
        <div className="modalBody">{children}</div>
        <div className="modalFoot">
          <button className="cta subtle" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}


export default function SignupBasic({ routes }) {
  const R = routes || (typeof window !== "undefined" ? window.ROUTES : {});

  const [values, setValues] = useState({
    name: "",
    email: "",
    display_name: "",
    password: "",
    confirm_password: "",
    phone: "",
    company_name: "",
    consent: false,
  });

  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState("form"); // "form" | "otp"
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const consentRef = useRef(null);

  // show/hide toggles
  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);

  // OTP state
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = Array.from({ length: 6 }).map(() => useRef(null));
  const [expiresAt, setExpiresAt] = useState(null); // unix seconds
  const [countdown, setCountdown] = useState(300);

  // Phone: selected country code (string) + raw number
  const [countryCode, setCountryCode] = useState(() => {
    // default to +1 if present in options
    const us = CC_OPTIONS.find((o) => o.iso2 === "US") || CC_OPTIONS[0];
    return us?.value || "+1";
  });

  const digitsOnly = (s) => (s || "").replace(/\D/g, "");

  useEffect(() => {
    const u = new URL(location.href);
    u.searchParams.get("plan") || "basic";
  }, []);

  // countdown
  useEffect(() => {
    let t;
    if (step === "otp" && expiresAt) {
      const tick = () => {
        const now = Math.floor(Date.now() / 1000);
        const remaining = Math.max(0, expiresAt - now);
        setCountdown(remaining);
        if (remaining === 0) {
          toast.error("Code expired. Reloading…");
          setTimeout(() => window.location.reload(), 1000);
        } else {
          t = setTimeout(tick, 1000);
        }
      };
      tick();
    }
    return () => clearTimeout(t);
  }, [step, expiresAt]);

  const set = (k) => (e) => {
    const v = k === "consent" ? e.target.checked : e.target.value;
    setValues((s) => ({ ...s, [k]: v }));
  };

  const strongPass = (s) =>
    /^(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]).{9,}$/.test(s);

  const validate = () => {
    if (!values.name.trim()) {
      toast.error("Please enter your full name.");
      return false;
    }
    if (!values.email.trim() || !/\S+@\S+\.\S+/.test(values.email.trim())) {
      toast.error("Please enter a valid email.");
      return false;
    }
    if (!values.display_name.trim()) {
      toast.error("Please enter a display name.");
      return false;
    }
    if (!values.password || !strongPass(values.password)) {
      toast.error("Password must be ≥9 chars and include 1 uppercase, 1 number, and 1 special character.");
      return false;
    }
    if (values.password !== values.confirm_password) {
      toast.error("Passwords do not match.");
      return false;
    }
    if (!values.phone.trim()) {
      toast.error("Please enter your phone number.");
      return false;
    }
    if (!values.company_name.trim()) {
      toast.error("Please enter your company name (type N/A if none).");
      return false;
    }
    if (!values.consent) {
      toast.error("“I agree” is not selected.");
      consentRef.current?.focus();
      consentRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return false;
    }
    return true;
  };

  // STEP 1 — send OTP
  const sendOtp = async (e) => {
    e.preventDefault();
    if (busy) return;
    if (!validate()) return;

    setBusy(true);
    try {
      const csrf =
        document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") ||
        R.csrf ||
        "";

      const formattedPhone = `${countryCode}${digitsOnly(values.phone)}`;

      const res = await fetch(R.signup?.basic?.send_otp ?? "/signup/basic/send-otp", {
        method: "POST",
        headers: {
          "X-CSRF-TOKEN": csrf,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          display_name: values.display_name.trim(),
          password: values.password,
          confirm_password: values.confirm_password,
          phone: formattedPhone,
          company_name: values.company_name.trim(),
          consent: values.consent ? 1 : 0,
          plan: "basic",
        }),
        credentials: "same-origin",
      });

      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        toast.success("Verification code sent to your email.");
        const ts = json.expires
          ? Math.floor(new Date(json.expires).getTime() / 1000)
          : Math.floor(Date.now() / 1000) + 300;
        setExpiresAt(ts);
        setCountdown(ts - Math.floor(Date.now() / 1000));
        setStep("otp");
        setTimeout(() => otpRefs[0].current?.focus(), 50);
      } else {
        if (json?.errors) {
          const first = Object.values(json.errors)[0]?.[0];
          toast.error(first || "Unable to send code.");
        } else {
          toast.error(json?.message || "Unable to send code.");
        }
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  // OTP behaviors
  const onOtpChange = (i) => (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 1);
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) otpRefs[i + 1].current?.focus();
    if (i === 5 && val && next.join("").length === 6) verifyOtp(next.join(""));
  };

  const onOtpKeyDown = (i) => (e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs[i - 1].current?.focus();
  };

  const onOtpPaste = (e) => {
    const pasted = (e.clipboardData.getData("text") || "").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    const arr = pasted.split("").concat(Array(6).fill("")).slice(0, 6);
    setOtp(arr);
    const idx = Math.min(5, pasted.length - 1);
    setTimeout(() => otpRefs[idx].current?.focus(), 10);
    if (arr.join("").length === 6) verifyOtp(arr.join(""));
  };

  // STEP 2 — verify OTP
  const verifyOtp = async (code) => {
    if (!code || code.length !== 6) {
      toast.error("Enter the 6-digit code.");
      return;
    }
    setBusy(true);
    try {
      const csrf =
        document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") ||
        R.csrf ||
        "";
      const res = await fetch(R.signup?.basic?.verify_otp ?? "/signup/basic/verify-otp", {
        method: "POST",
        headers: {
          "X-CSRF-TOKEN": csrf,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, email: values.email.trim() }),
        credentials: "same-origin",
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        toast.success("Verified! Redirecting…");
        setTimeout(() => window.location.assign(json.redirect || "/dashboard"), 700);
      } else {
        toast.error(json?.message || "Invalid code.");
      }
    } catch {
      toast.error("Network error.");
    } finally {
      setBusy(false);
    }
  };

  const mm = String(Math.floor(countdown / 60)).padStart(2, "0");
  const ss = String(countdown % 60).padStart(2, "0");

  // Current selected option for react-select (derive from countryCode string)
  const selectedCC =
    CC_OPTIONS.find((o) => o.value === countryCode) ||
    CC_OPTIONS.find((o) => o.iso2 === "US") ||
    CC_OPTIONS[0];

  return (
    <>
      <style>{css}</style>
      <style>{modalCss}</style>
      <Header routes={R} />
      <ToastContainer position="top-right" />

      <div className="page">
        <main>
          <section className="card">
            <div className="cardHeader">
              <h1>Individual Account</h1>
              <button type="button" className="backBtn" onClick={() => window.history.back()}>
                ← Back
              </button>
            </div>

            {step === "form" && (
              <form noValidate onSubmit={sendOtp}>
                <div className="row">
                  <div>
                    <label htmlFor="b-name">Full name</label>
                    <input
                      id="b-name"
                      className="input"
                      type="text"
                      placeholder="Your name"
                      value={values.name}
                      onChange={set("name")}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="b-email">Email</label>
                    <input
                      id="b-email"
                      className="input"
                      type="email"
                      placeholder="name@example.com"
                      value={values.email}
                      onChange={set("email")}
                      required
                    />
                  </div>
                </div>

                <div className="row">
  

                  {/* Password with eye */}
                  <div>
                    <label htmlFor="b-pass">Password</label>
                    <div className="inputWrap">
                      <input
                        id="b-pass"
                        className="input"
                        type={showPass ? "text" : "password"}
                        placeholder="Choose a strong password"
                        value={values.password}
                        onChange={set("password")}
                        required
                      />
                      <button
                        type="button"
                        className="revealBtn"
                        aria-label={showPass ? "Hide password" : "Show password"}
                        onClick={() => setShowPass((v) => !v)}
                      >
                        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" fill="none" stroke="#334155" strokeWidth="1.5" />
                          <circle cx="12" cy="12" r="3" fill="none" stroke="#334155" strokeWidth="1.5" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Confirm password with eye */}
                  <div>
                    <label htmlFor="b-pass2">Confirm password</label>
                    <div className="inputWrap">
                      <input
                        id="b-pass2"
                        className="input"
                        type={showPass2 ? "text" : "password"}
                        placeholder="Re-enter your password"
                        value={values.confirm_password}
                        onChange={set("confirm_password")}
                        required
                      />
                      <button
                        type="button"
                        className="revealBtn"
                        aria-label={showPass2 ? "Hide password" : "Show password"}
                        onClick={() => setShowPass2((v) => !v)}
                      >
                        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" fill="none" stroke="#334155" strokeWidth="1.5" />
                          <circle cx="12" cy="12" r="3" fill="none" stroke="#334155" strokeWidth="1.5" />
                        </svg>
                      </button>
                    </div>
                  </div>

                </div>

                {/* Confirm password + phone with country code */}
                <div className="row">
                
   <div>
                    <label htmlFor="b-username">Display name</label>
                    <input
                      id="b-username"
                      className="input"
                      type="text"
                      placeholder="@handle"
                      value={values.display_name}
                      onChange={set("display_name")}
                      required
                    />
                  </div>

                  {/* Country code + phone side-by-side */}
                  <div>
                    <label htmlFor="b-phone">Phone number</label>
                    <div className="phoneGroup">
                      <Select
                        classNamePrefix="rs"
                        options={CC_OPTIONS}
                        value={selectedCC}
                        onChange={(opt) => setCountryCode(opt?.value || countryCode)}
                        formatOptionLabel={formatCCOption}
                        getOptionValue={getOptionValue}
                        getOptionLabel={getOptionLabel}
                        isSearchable
                        menuPlacement="auto"
                        styles={{
                          control: (base) => ({
                            ...base,
                            height: 48,
                            minHeight: 48,
                            borderColor: "#063122",
                            borderRadius: 10,
                            boxShadow: "none",
                          }),
                          valueContainer: (base) => ({
                            ...base,
                            gap: 8,
                          }),
                          option: (base, state) => ({
                            ...base,
                            paddingTop: 8,
                            paddingBottom: 8,
                            backgroundColor: state.isFocused ? "#eef2ff" : "white",
                            color: "#0f172a",
                          }),
                          menu: (base) => ({
                            ...base,
                            zIndex: 30,
                          }),
                        }}
                        aria-label="Country code"
                      />

                      <input
                        id="b-phone"
                        className="input phoneInput"
                        type="tel"
                        placeholder="555 555 5555"
                        value={values.phone}
                        onChange={set("phone")}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Company */}
                <div className="row">
                  <div>
                    <label htmlFor="b-company">Company name</label>
                    <input
                      id="b-company"
                      className="input"
                      type="text"
                      placeholder="Your company or N/A"
                      value={values.company_name}
                      onChange={set("company_name")}
                      required
                    />
                  </div>
                </div>

                <div className="consent">
                  <input
                    id="b-consent"
                    type="checkbox"
                    checked={values.consent}
                    onChange={set("consent")}
                    ref={consentRef}
                  />
                  <label htmlFor="b-consent">
                    <strong>I agree</strong> to the{" "}
                    <a href="#" onClick={(e) => { e.preventDefault(); setShowTerms(true); }}>Terms</a>{" "}
                    and{" "}
                    <a href="#" onClick={(e) => { e.preventDefault(); setShowPrivacy(true); }}>Privacy</a>.
                    <br />
                    <small>We’ll use your info to create a basic account. You can upgrade anytime.</small>
                  </label>
                </div>

                <div className="actions">
                  <button type="submit" className="cta" disabled={busy} aria-disabled={busy}>
                    {busy ? "Sending Code…" : "Create Basic Account"}
                  </button>
                  <div className="subtle">
                    Wrong Turn?{" "}
                    <a href={R.signup?.index ?? "/signup"}>Choose another role</a>
                  </div>
                </div>
              </form>
            )}

            {step === "otp" && (
              <div className="otpWrap">
                <h2 className="otpTitle">Email Verification</h2>
                <p className="muted">
                  We’ve sent a 6-digit code to <strong>{values.email}</strong>. Enter it below.
                </p>

                <div className="otpInputs" onPaste={onOtpPaste}>
                  {otp.map((d, i) => (
                    <input
                      key={i}
                      ref={otpRefs[i]}
                      className="otpBox"
                      inputMode="numeric"
                      type="text"
                      maxLength={1}
                      value={d}
                      onChange={onOtpChange(i)}
                      onKeyDown={onOtpKeyDown(i)}
                    />
                  ))}
                </div>

                <div className="otpMeta">
                  <div className="timer">Expires in: <strong>{mm}:{ss}</strong></div>
                  <button
                    type="button"
                    className="cta ghost"
                    disabled={busy || countdown === 0}
                    onClick={() => verifyOtp(otp.join(""))}
                  >
                    {busy ? "Verifying…" : "Verify Code"}
                  </button>
                </div>
              </div>
            )}
          </section>
        </main>

        <footer className="ft">
          <div>© 2025 Raymoch. All rights reserved.</div>
          <div>
            <a href="#" onClick={(e) => { e.preventDefault(); setShowPrivacy(true); }}>Privacy</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setShowTerms(true); }}>Terms</a>
          </div>
        </footer>
      </div>

       {/* ======= Terms Modal (scrollable) ======= */}
      <Modal title="Terms of Service" open={showTerms} onClose={() => setShowTerms(false)}>
        <p><strong>Effective:</strong> January 1, 2025</p>
        <h4>1) Acceptance of Terms</h4>
        <p>
          By creating an account or using Raymoch, you agree to these Terms of Service. If you do not agree,
          you may not access or use the platform. We may update these Terms periodically; continued use after
          updates constitutes acceptance.
        </p>

        <h4>2) Accounts & Responsibilities</h4>
        <ul>
          <li>Provide accurate registration information and keep credentials secure.</li>
          <li>You are responsible for all activity under your account.</li>
          <li>Misuse (e.g., unauthorized access, scraping, abuse) may result in suspension or termination.</li>
        </ul>

        <h4>3) Service Availability & Changes</h4>
        <p>
          We aim for high availability but do not guarantee uninterrupted service. We may modify, suspend, or
          discontinue features at any time with or without notice.
        </p>

        <h4>4) Paid Plans, Billing & Taxes</h4>
        <ul>
          <li>Premium plans renew automatically until canceled.</li>
          <li>Billing is handled by our payment provider; taxes may apply based on your region.</li>
          <li>Failed or disputed charges may pause or terminate access.</li>
        </ul>

        <h4>5) Prohibited Conduct</h4>
        <ul>
          <li>Reverse engineering, automated scraping, or attempting to bypass security controls.</li>
          <li>Uploading malicious code or content that violates law or third-party rights.</li>
        </ul>

        <h4>6) Intellectual Property</h4>
        <p>
          The Raymoch name, logos, and platform content are protected by copyright, trademark, and other laws.
          You receive a limited, non-exclusive, non-transferable license to use the platform as intended.
        </p>

        <h4>7) Limitation of Liability</h4>
        <p>
          To the fullest extent permitted by law, Raymoch is not liable for indirect, incidental, special,
          consequential, or exemplary damages. Your exclusive remedy is to stop using the service.
        </p>

        <h4>8) Governing Law</h4>
        <p>These Terms are governed by the laws of California, USA, without regard to conflict-of-law rules.</p>
      </Modal>

      {/* ======= Privacy Modal (scrollable) ======= */}
      <Modal title="Privacy Policy" open={showPrivacy} onClose={() => setShowPrivacy(false)}>
        <p><strong>Effective:</strong> January 1, 2025</p>
        <h4>1) Data We Collect</h4>
        <ul>
          <li>Account data: name, email, display name, company; password stored using strong hashing.</li>
          <li>Usage & device data (e.g., browser type, IP, timestamps) to improve reliability and security.</li>
          <li>Payment data is processed by our PCI-compliant provider; we do not store full card numbers.</li>
        </ul>

        <h4>2) How We Use Data</h4>
        <ul>
          <li>Create and maintain your account, authenticate access, and deliver features.</li>
          <li>Send transactional notices (verifications, receipts, security alerts).</li>
          <li>Monitor platform health, prevent abuse, and comply with legal obligations.</li>
        </ul>

        <h4>3) Sharing</h4>
        <p>
          We don’t sell or rent personal data. We share with service providers (cloud hosting, email delivery,
          payments) under contractual safeguards and only as needed to provide the service.
        </p>

        <h4>4) Security & Retention</h4>
        <p>
          We apply technical and organizational controls, store passwords using strong hashing, and retain data
          only as long as necessary for the stated purposes or legal requirements.
        </p>

        <h4>5) Your Rights</h4>
        <ul>
          <li>Access, correct, export, or delete your personal data (subject to applicable law).</li>
          <li>Contact: <a href="mailto:support@raymoch.com">support@raymoch.com</a></li>
        </ul>
      </Modal>

    </>
  );
}

const css = `
:root{
  --brand-blue:#0328aeed; --brand-blue-700:#213bb1; --brand-blue-500:#041b64;
  --ink:#101114; --bg:#fafafa; --border:#e8e8ee; --card:#fff;
  --shadow:0 4px 16px rgba(10,42,107,.06); --footer-bg:#0b1020; --radius:16px
}

/* Base layout */
html, body { height:100%; }
*{ box-sizing:border-box; margin:0; padding:0; font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif; }
.page{
  min-height:100vh; display:flex; flex-direction:column; background:var(--bg); color:var(--ink);
}

/* Header (scoped to Header.jsx markup) */
.header{
  height:80px;
  background:#fff;
  border-bottom:1px solid var(--border);
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:0 24px;
  position:relative;
  flex-shrink:0;
}
.brand{ display:flex; align-items:center; gap:10px; color:var(--brand-blue); text-decoration:none; }
.brand svg{ width:26px; height:26px; display:block; }
.brand span{ font-weight:900; font-size:1.3rem; letter-spacing:.2px; color:var(--brand-blue); }

.iconbtn{ background:transparent; border:0; cursor:pointer; padding:6px; border-radius:8px; display:flex; align-items:center; justify-content:center; position:relative; }
.iconbtn:hover{ background:#f2f4ff; }

/* Main & Card */
main{ flex:1; display:flex; align-items:center; justify-content:center; padding:24px; }
.card{
  background:var(--card); border:1px solid var(--border);
  box-shadow:var(--shadow); border-radius:var(--radius);
  padding:32px 36px; width:100%; max-width:760px;
}
.cardHeader{ display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
.cardHeader h1{ font-size:1.9rem; font-weight:900; color:#063122; }
.backBtn{
  background:transparent; border:1px solid #d9e1ff; color:#041b64;
  font-weight:700; border-radius:10px; padding:8px 14px; cursor:pointer;
  transition:background .25s ease, border-color .25s ease;
}
.backBtn:hover{ background:#eef3ff; border-color:#c9d4ff; }

.row{ display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:6px; }
@media (max-width:720px){ .row{ grid-template-columns:1fr; } }

label{ font-weight:700; font-size:.95rem; display:block; margin-top:4px; }
.input{
  width:100%; padding:14px 16px; border:1px solid #063122; border-radius:10px;
  margin:8px 0 16px; font-size:15px;
}
.input:focus{ outline:none; box-shadow:0 0 0 3px rgba(3,40,174,.25); }

/* Password reveal button */
.inputWrap{ position:relative; }
.revealBtn{
  position:absolute; right:10px; top:50%; transform:translateY(-50%);
  border:0; background:transparent; cursor:pointer; padding:4px; border-radius:8px;
}
.revealBtn:hover{ background:#eef2ff; }

/* Consent */
.consent{ display:flex; gap:10px; margin:10px 0 16px; }
.consent input{ width:18px; height:18px; margin-top:3px; }
.consent small{ color:#475569; }

/* Actions */
.actions{ display:flex; gap:12px; align-items:center; margin-top:6px; }
button.cta{
  padding:14px 18px; border:0; border-radius:12px;
  background:linear-gradient(135deg,var(--brand-blue-700),var(--brand-blue-500));
  color:#fff; font-weight:800; font-size:15px; cursor:pointer;
}
button.cta[disabled]{ opacity:.7; cursor:not-allowed; }
button.cta.ghost{ background:#f5f8ff; color:#041b64; border:1px solid #d9e1ff; }

.subtle{ font-size:.95rem; }
.subtle a{ font-weight:800; color:var(--ink); text-decoration:none; }
.subtle a:hover{ text-decoration:underline; }

/* OTP */
.otpWrap{ margin-top:6px; }
.otpTitle{ font-size:1.25rem; font-weight:900; color:#063122; margin-bottom:6px; }
.muted{ color:#475569; margin-bottom:12px; }
.otpInputs{ display:flex; gap:10px; justify-content:center; margin:14px 0 10px; }
.otpBox{
  width:46px; height:52px; text-align:center; font-weight:900; font-size:20px;
  border:1px solid #cbd5e1; border-radius:10px; background:#fff;
}
.otpBox:focus{ outline:none; box-shadow:0 0 0 3px rgba(3,40,174,.25); }
.otpMeta{ display:flex; align-items:center; justify-content:space-between; gap:12px; }
.timer{ font-weight:800; }

/* Footer */
.ft{
  background:var(--footer-bg); color:#cbd5e1; font-size:.9rem; padding:12px 24px;
  display:flex; justify-content:space-between; align-items:center; border-top:1px solid #1f2937;
  flex-shrink:0;
}
.ft a{ color:#cbd5e1; margin-left:14px; text-decoration:none; }
.ft a:hover{ text-decoration:underline; }

/* Phone group: react-select + input */
.phoneGroup{
  display:grid; grid-template-columns: minmax(200px, 260px) 1fr; gap:10px; align-items:center;
}
.phoneInput{ height:48px; }

/* React-Select classNamePrefix="rs" tweaks */
.rs__control{ border-color:#063122 !important; box-shadow:none !important; }
.rs__option--is-focused{ background:#eef2ff !important; }
.rs__value-container{ gap:8px; }

/* Responsive */
@media (max-width:600px){
  .ft{ flex-direction:column; text-align:center; gap:6px; }
  .otpMeta{ flex-direction:column; }
  .phoneGroup{ grid-template-columns: 1fr; }
}
`;

/* ================== INLINE CSS (modal styles) ================== */
const modalCss = `
.modalOverlay{
  position:fixed; inset:0; background:rgba(15,23,42,.55);
  display:flex; align-items:center; justify-content:center; z-index:9999;
}
.modalCard{
  width:min(860px, calc(100% - 28px));
  background:#fff; border-radius:16px; border:1px solid #e8e8ee;
  box-shadow:0 18px 40px rgba(2,6,23,.22);
  overflow:hidden; display:flex; flex-direction:column; max-height:86vh;
}
.modalHead{
  display:flex; align-items:center; justify-content:space-between;
  padding:14px 16px; border-bottom:1px solid #eef0f6; background:#f9fafb;
}
.modalHead h3{ margin:0; font-size:1.05rem; font-weight:800; color:#041b64; }
.modalClose{
  background:transparent; border:0; font-size:22px; line-height:1; cursor:pointer;
  color:#0f172a; border-radius:10px; padding:4px 8px;
}
.modalClose:hover{ background:#eef2ff; }
.modalBody{
  padding:18px; overflow:auto; color:#0f172a; line-height:1.55;
}
.modalBody h4{ margin:16px 0 8px; font-size:1.02rem; color:#041b64; }
.modalBody p{ margin:6px 0 10px; color:#334155; }
.modalBody ul{ padding-left:18px; margin:6px 0 12px; }
.modalBody li{ margin:6px 0; color:#334155; }
.modalFoot{
  padding:12px 16px; border-top:1px solid #eef0f6; display:flex; justify-content:flex-end; gap:10px; background:#fff;
}
.modalFoot .cta.subtle{
  background:#f5f8ff; color:#041b64; border:1px solid #d9e1ff; border-radius:10px; padding:10px 14px; font-weight:700; cursor:pointer;
}
`;
// Country code options
