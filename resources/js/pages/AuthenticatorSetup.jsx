import { useEffect, useState } from "react";
import { CheckCircle2, Copy, KeyRound, ShieldCheck } from "lucide-react";
import HorizontalNavigation from "../components/HorizontalNavigation.jsx";
import Footer from "../components/layout_master/Footer.jsx";
import "../styles/authenticator-setup.css";

function csrfToken() {
  return document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "";
}

async function request(url, method = "GET", body) {
  const response = await fetch(url, {
    method,
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      ...(method !== "GET" ? { "Content-Type": "application/json", "X-CSRF-TOKEN": csrfToken() } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || "The request could not be completed.");
  return payload;
}

export default function AuthenticatorSetup() {
  const [enabled, setEnabled] = useState(false);
  const [setup, setSetup] = useState(null);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    request("/security/authenticator/status")
      .then((data) => setEnabled(Boolean(data.enabled)))
      .catch((reason) => setError(reason.message))
      .finally(() => setBusy(false));
  }, []);

  const begin = async () => {
    setBusy(true); setError(""); setMessage("");
    try { setSetup(await request("/security/authenticator/begin", "POST")); }
    catch (reason) { setError(reason.message); }
    finally { setBusy(false); }
  };

  const confirm = async (event) => {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const data = await request("/security/authenticator/confirm", "POST", { code });
      setEnabled(true); setSetup(null); setCode(""); setMessage(data.message);
    } catch (reason) { setError(reason.message); }
    finally { setBusy(false); }
  };

  const disable = async (event) => {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const data = await request("/security/authenticator", "DELETE", { password, code });
      setEnabled(false); setPassword(""); setCode(""); setMessage(data.message);
    } catch (reason) { setError(reason.message); }
    finally { setBusy(false); }
  };

  return (
    <div className="authenticator-page">
      <HorizontalNavigation activePath="/security/authenticator" />
      <main>
        <section className="authenticator-card" aria-labelledby="authenticator-title">
          <div className="authenticator-icon"><ShieldCheck size={30} /></div>
          <p className="authenticator-eyebrow">Account security</p>
          <h1 id="authenticator-title">Authenticator secure sign in</h1>
          <p className="authenticator-lead">Connect Google Authenticator, Microsoft Authenticator, or another TOTP-compatible app. After enrollment, every login requires its rotating six-digit code.</p>

          {error ? <div className="authenticator-alert is-error" role="alert">{error}</div> : null}
          {message ? <div className="authenticator-alert is-success" role="status">{message}</div> : null}

          {enabled ? (
            <div className="authenticator-enabled">
              <div className="authenticator-status"><CheckCircle2 size={21} /> Authenticator is enabled</div>
              <form onSubmit={disable}>
                <h2>Disable authenticator</h2>
                <p>Confirm your password and current authenticator code.</p>
                <label>Password<input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
                <label>Current six-digit code<input className="authenticator-code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} required /></label>
                <button className="authenticator-danger" disabled={busy || !password || code.length !== 6}>Disable secure sign in</button>
              </form>
            </div>
          ) : setup ? (
            <form className="authenticator-enroll" onSubmit={confirm}>
              <ol>
                <li>Open Microsoft Authenticator or Google Authenticator.</li>
                <li>Choose <strong>Add account</strong>, then <strong>Enter setup key</strong>.</li>
                <li>Use account <strong>{setup.account}</strong> and the key below.</li>
              </ol>
              <div className="authenticator-secret"><code>{setup.formatted_secret}</code><button type="button" onClick={() => navigator.clipboard?.writeText(setup.secret)} aria-label="Copy setup key"><Copy size={18} /></button></div>
              <a className="authenticator-app-link" href={setup.provisioning_uri}><KeyRound size={18} /> Open in authenticator app</a>
              <label>Enter the current six-digit code<input className="authenticator-code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} autoFocus required /></label>
              <button className="authenticator-primary" disabled={busy || code.length !== 6}>Verify and enable</button>
            </form>
          ) : (
            <button className="authenticator-primary" type="button" onClick={begin} disabled={busy}>{busy ? "Checking…" : "Set up authenticator"}</button>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
