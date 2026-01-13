// resources/js/components/VerifyCode.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * VerifyCode.jsx — color-matched to your screenshot
 * - Reuses the same class names as RequestTrial.jsx
 * - Includes a <Styles/> component with CSS variables + rules to match colors
 */

export default function VerifyCode({
  apiVerifyUrl = "/api/trial-requests/verify-code",
  csrfToken,
  emailProp,
  onVerified,
}) {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [alert, setAlert] = useState({ type: "", msg: "" });

  const alertRef = useRef(null);

  const email = useMemo(() => {
    if (emailProp) return emailProp;
    const u = new URL(window.location.href);
    return u.searchParams.get("email") || "";
  }, [emailProp]);

  const scrollTopToAlert = () => {
    if (alertRef.current) {
      alertRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => alertRef.current?.focus(), 30);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const showAlert = (type, msg) => {
    setAlert({ type, msg });
    setTimeout(scrollTopToAlert, 10);
  };

  useEffect(() => {
    setTimeout(scrollTopToAlert, 50);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!email) {
      showAlert("err", "Missing email address. Please restart the request.");
      return;
    }
    if (!code.trim()) {
      showAlert("err", "Please enter the 6-digit verification code.");
      return;
    }

    setBusy(true);
    setAlert({ type: "", msg: "" });

    try {
      const res = await fetch(apiVerifyUrl, {
        method: "POST",
        headers: {
          "X-CSRF-TOKEN": csrfToken ?? "",
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code: code.trim() }),
      });

      const json = await res.json().catch(() => ({}));

      if (res.ok && json.ok) {
        showAlert("ok", json.message || "Verified. Redirecting…");
        if (typeof onVerified === "function") onVerified(json);
        setTimeout(() => {
          window.location.assign(json.redirect || "/trial/success");
        }, 500);
      } else {
        showAlert("err", json?.message || "Invalid or expired code. Please try again.");
      }
    } catch {
      showAlert("err", "Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="request-card" aria-label="Verify your request">
      <Styles />

      {/* Hero matches RequestTrial header pill */}
      <div className="pb-hero">
        <div>
          <h1 className="request-title" style={{ margin: "0 0 6px" }}>
            Verify your email
          </h1>
          <div className="helper">
            We sent a verification code to{" "}
            <strong>{email || "your email"}</strong>. Enter it below to proceed.
          </div>
        </div>
        <div className="badges" aria-hidden>
          <span className="helper">Secure · One-time code</span>
        </div>
      </div>

      {/* Inline alert */}
      <div
        ref={alertRef}
        tabIndex="-1"
        className={`alert ${alert.msg ? "show" : ""} ${alert.type}`}
        aria-live="polite"
      >
        {alert.msg}
      </div>

      {/* Form */}
      <form onSubmit={submit} noValidate>
        <div className="form-grid">
          <div className="full">
            <label htmlFor="code">Verification code</label>
            <input
              id="code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
            <div className="helper" style={{ marginTop: 6 }}>
              Didn’t get it? Check spam, or request a new code from the previous page.
            </div>
          </div>

          <div className="full row" style={{ justifyContent: "flex-end" }}>
            <button className="cta" disabled={busy} type="submit">
              {busy ? "Verifying…" : "Verify"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}

/* ---------- THEME + STYLES (matches your screenshot) ---------- */
function Styles() {
  return (
    <style>{`
:root{
  --bg: #f6f7fb;                   /* page background */
  --card-bg: #ffffff;              /* card */
  --hero-bg: #0f1a2d;              /* deep navy header */
  --ink: #0f172a;                  /* primary text */
  --muted: #6b7280;                /* helper text */
  --field-bg: #ffffff;             /* inputs */
  --field-border: #e5e7eb;         /* inputs border */
  --shadow: 0 12px 40px rgba(9, 12, 38, .08);
  --radius-xl: 26px;
  --radius-md: 14px;

  /* primary indigo from screenshot */
  --primary-500: #3f47d6;
  --primary-600: #3541c7;
  --primary-700: #2d39b8;

  /* alerts */
  --ok-bg: #ecfdf5;   --ok-ink:#065f46;   --ok-brd:#a7f3d0;
  --err-bg:#fef2f2;   --err-ink:#991b1b;  --err-brd:#fecaca;
}

body{ background: var(--bg); }

.request-card{
  max-width: 1120px;
  margin: 22px auto;
  background: var(--card-bg);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow);
  padding: 28px 28px 32px;
  color: var(--ink);
}

.pb-hero{
  background: var(--hero-bg);
  color: #c0c8d8;
  border-radius: 26px;
  padding: 28px 32px;
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap:20px;
  margin-bottom: 24px;
}
.request-title{
  color:#f2f6ff;
  font-size: clamp(28px, 4.2vw, 44px);
  line-height: 1.05;
  font-weight: 800;
}
.helper{ color: var(--muted); }

.form-grid{
  display:grid;
  grid-template-columns: repeat(2, minmax(0,1fr));
  gap: 22px;
}
.form-grid .full{ grid-column: 1 / -1; }

label{ font-size: 14px; color: #111827; margin-bottom: 8px; display:block; }
input{
  width:100%;
  background: var(--field-bg);
  border: 1px solid var(--field-border);
  border-radius: 14px;
  padding: 14px 16px;
  font-size: 16px;
  color: var(--ink);
  outline: none;
  box-shadow: 0 2px 0 rgba(0,0,0,0.02) inset;
}
input::placeholder{ color:#9aa3b2; }
input:focus{
  border-color: var(--primary-500);
  box-shadow: 0 0 0 4px rgba(63,71,214,.12);
}

/* CTA button with gentle indigo gradient and big pill radius like screenshot */
.cta{
  border: 0;
  color: #fff;
  font-weight: 700;
  letter-spacing: .2px;
  border-radius: 999px;
  padding: 16px 26px;
  cursor: pointer;
  background: linear-gradient(180deg, var(--primary-500), var(--primary-600));
  box-shadow: 0 10px 25px rgba(53,65,199,.25), inset 0 -2px 0 rgba(0,0,0,.08);
  transition: transform .08s ease, filter .15s ease;
}
.cta:hover{ filter: brightness(1.03); }
.cta:active{ transform: translateY(1px); }
.row{ display:flex; align-items:center; gap:12px; }

/* Alerts (same hooks as RequestTrial) */
.alert{ display:none; margin:14px 0; border-radius:14px; padding:12px 14px; font-size:14px; border:1px solid; }
.alert.show{ display:block; animation:slideDown .3s ease-out; }
.alert.ok{ background:var(--ok-bg); color:var(--ok-ink); border-color:var(--ok-brd);}
.alert.err{ background:var(--err-bg); color:var(--err-ink); border-color:var(--err-brd);}
@keyframes slideDown{ from{opacity:0; transform:translateY(-6px)} to{opacity:1; transform:translateY(0)} }

/* Responsive */
@media (max-width: 760px){
  .form-grid{ grid-template-columns: 1fr; }
  .pb-hero{ padding:22px; }
}
    `}</style>
  );
}
