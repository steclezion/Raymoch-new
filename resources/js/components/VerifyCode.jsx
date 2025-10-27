// resources/js/components/VerifyCode.jsx
import React, { useMemo, useState } from "react";

export default function VerifyCode({ apiVerifyUrl = "/api/trial-requests/verify-code", csrfToken, emailProp }) {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  // pull email from prop or URL (?email=..)
  const email = useMemo(() => {
    if (emailProp) return emailProp;
    const u = new URL(window.location.href);
    return u.searchParams.get("email") || "";
  }, [emailProp]);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch(apiVerifyUrl, {
        method: "POST",
        headers: {
          "X-CSRF-TOKEN": csrfToken ?? "",
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
      });
      const json = await res.json().catch(() => ({}));

      if (res.ok && json.ok) {
        window.location.assign(json.redirect || "/trial/success");
      } else {
        setMsg(json?.message || "Invalid or expired code. Please try again.");
      }
    } catch {
      setMsg("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="request-card" aria-label="Verify your request">
      <h1 className="request-title" style={{ marginBottom: 8 }}>
        Check your email
      </h1>
      <p className="helper" style={{ marginBottom: 16 }}>
        We sent a verification code to <strong>{email || "your email"}</strong>.
      </p>

      {msg && <div className="alert show err" role="alert">{msg}</div>}

      <form onSubmit={submit}>
        <label htmlFor="code">Enter the 6-digit code</label>
        <input
          id="code"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="123456"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />

        <div style={{ marginTop: 12 }}>
          <button className="cta" disabled={busy} type="submit">
            {busy ? "Verifying…" : "Verify"}
          </button>
        </div>
      </form>
    </section>
  );
}
