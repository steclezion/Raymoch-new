import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import "../styles/password-recovery.css";

const BRAND_ICON = "/images/logo_preview_exact.svg";

async function submitRecovery(url, csrf, payload) {
  const response = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": csrf,
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const firstError = Object.values(data.errors || {}).flat()[0];
    const error = new Error(firstError || data.message || "We could not complete your request.");
    error.fields = data.errors || {};
    throw error;
  }
  return data;
}

function Brand() {
  return (
    <a className="recovery-brand" href="/" aria-label="Raymoch home">
      <img src={BRAND_ICON} alt="" />
      <span>Raymoch</span>
    </a>
  );
}

function RequestReset({ csrf, submitUrl, loginUrl }) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await submitRecovery(submitUrl, csrf, { email });
      setSent(true);
    } catch (reason) {
      setError(reason.message);
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <div className="recovery-complete" role="status">
        <span className="recovery-success-icon"><CheckCircle2 /></span>
        <p className="recovery-kicker">Check your inbox</p>
        <h1 id="recovery-title">Recovery instructions are on the way</h1>
        <p>If an account exists for <strong>{email}</strong>, we sent a secure password-reset link. It may take a minute to arrive.</p>
        <div className="recovery-note"><ShieldCheck size={19} /><span>For your security, the link expires automatically and can only be used once.</span></div>
        <button className="recovery-secondary" type="button" onClick={() => setSent(false)}>Try another email</button>
        <a className="recovery-back" href={loginUrl}><ArrowLeft size={17} /> Return to sign in</a>
      </div>
    );
  }

  return (
    <>
      <span className="recovery-icon"><KeyRound /></span>
      <p className="recovery-kicker">Account recovery</p>
      <h1 id="recovery-title">Forgot your password?</h1>
      <p className="recovery-intro">Enter the email connected to your Raymoch account. We’ll send you a secure link to choose a new password.</p>
      {error ? <div className="recovery-alert" role="alert">{error}</div> : null}
      <form className="recovery-form" onSubmit={submit} noValidate>
        <label htmlFor="recovery-email">Email address</label>
        <div className="recovery-input-wrap">
          <Mail size={19} aria-hidden="true" />
          <input id="recovery-email" type="email" autoComplete="email" placeholder="you@company.com" value={email} onChange={(event) => setEmail(event.target.value)} required autoFocus />
        </div>
        <button className="recovery-primary" disabled={busy || !email.trim()}>{busy ? <><span className="recovery-spinner" /> Sending secure link…</> : "Send reset link"}</button>
      </form>
      <a className="recovery-back" href={loginUrl}><ArrowLeft size={17} /> Back to sign in</a>
    </>
  );
}

function ResetPassword({ csrf, submitUrl, loginUrl, token, initialEmail }) {
  const [email, setEmail] = useState(initialEmail || "");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [complete, setComplete] = useState(false);

  const requirements = useMemo(() => [
    ["At least 10 characters", password.length >= 10],
    ["An uppercase and lowercase letter", /[A-Z]/.test(password) && /[a-z]/.test(password)],
    ["At least one number", /\d/.test(password)],
    ["Passwords match", password.length > 0 && password === confirmation],
  ], [password, confirmation]);
  const valid = requirements.every(([, met]) => met);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await submitRecovery(submitUrl, csrf, { token, email, password, password_confirmation: confirmation });
      setComplete(true);
    } catch (reason) {
      setError(reason.message);
    } finally {
      setBusy(false);
    }
  };

  if (complete) {
    return (
      <div className="recovery-complete" role="status">
        <span className="recovery-success-icon"><CheckCircle2 /></span>
        <p className="recovery-kicker">Password updated</p>
        <h1 id="recovery-title">Your account is secure</h1>
        <p>Your password has been changed successfully. You can now sign in with your new credentials.</p>
        <a className="recovery-primary recovery-link-button" href={loginUrl}>Continue to sign in</a>
      </div>
    );
  }

  return (
    <>
      <span className="recovery-icon"><LockKeyhole /></span>
      <p className="recovery-kicker">Secure password reset</p>
      <h1 id="recovery-title">Create a new password</h1>
      <p className="recovery-intro">Choose a strong password you haven’t used before.</p>
      {error ? <div className="recovery-alert" role="alert">{error}</div> : null}
      <form className="recovery-form" onSubmit={submit} noValidate>
        <label htmlFor="reset-email">Email address</label>
        <div className="recovery-input-wrap"><Mail size={19} /><input id="reset-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></div>
        <label htmlFor="reset-password">New password</label>
        <div className="recovery-input-wrap"><LockKeyhole size={19} /><input id="reset-password" type={showPassword ? "text" : "password"} autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} required autoFocus /><button type="button" className="recovery-eye" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={19} /> : <Eye size={19} />}</button></div>
        <label htmlFor="reset-confirmation">Confirm new password</label>
        <div className="recovery-input-wrap"><LockKeyhole size={19} /><input id="reset-confirmation" type={showPassword ? "text" : "password"} autoComplete="new-password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} required /></div>
        <ul className="recovery-requirements" aria-label="Password requirements">{requirements.map(([label, met]) => <li className={met ? "is-met" : ""} key={label}><Check size={15} /> {label}</li>)}</ul>
        <button className="recovery-primary" disabled={busy || !email || !valid}>{busy ? <><span className="recovery-spinner" /> Updating password…</> : "Reset password"}</button>
      </form>
      <a className="recovery-back" href={loginUrl}><ArrowLeft size={17} /> Back to sign in</a>
    </>
  );
}

export default function PasswordRecovery({ mode = "request", csrf = "", submitUrl = "/forgot-password", loginUrl = "/login", token = "", email = "" }) {
  return (
    <div className="recovery-page">
      <header><Brand /><span className="recovery-secure"><ShieldCheck size={16} /> Secure account recovery</span></header>
      <main>
        <section className="recovery-shell">
          <aside className="recovery-aside">
            <div><p className="recovery-aside-kicker">Raymoch Security</p><h2>Return to what matters.</h2><p>Recover access through a protected, time-limited process designed to keep your account and business data safe.</p></div>
            <ul><li><ShieldCheck size={18} /> Encrypted connection</li><li><CheckCircle2 size={18} /> Single-use recovery link</li><li><KeyRound size={18} /> Strong password protection</li></ul>
          </aside>
          <section className="recovery-card" aria-labelledby="recovery-title">
            {mode === "reset" ? <ResetPassword csrf={csrf} submitUrl={submitUrl} loginUrl={loginUrl} token={token} initialEmail={email} /> : <RequestReset csrf={csrf} submitUrl={submitUrl} loginUrl={loginUrl} />}
          </section>
        </section>
      </main>
      <footer><span>© {new Date().getFullYear()} Raymoch</span><nav><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/help">Help</a></nav></footer>
    </div>
  );
}
