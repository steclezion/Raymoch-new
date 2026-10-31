import { useMemo, useRef, useState } from "react";
import { ArrowLeft, CheckCircle2, KeyRound, Mail, ShieldCheck } from "lucide-react";
import Header from "./layout_master/Header.jsx";
import Footer from "./layout_master/Footer.jsx";
import "../styles/trial-coupon.css";

export default function VerifyCode({ apiVerifyUrl = "/trial/verify-coupon", csrfToken = "", emailProp = "" }) {
  const [digits, setDigits] = useState(Array(6).fill(""));
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);
  const fields = useRef([]);
  const email = useMemo(() => emailProp || new URLSearchParams(window.location.search).get("email") || "", [emailProp]);
  const coupon = digits.join("");

  const setDigit = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setDigits((current) => current.map((item, position) => position === index ? digit : item));
    if (digit && index < 5) fields.current[index + 1]?.focus();
  };

  const paste = (event) => {
    const value = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!value) return;
    event.preventDefault();
    setDigits(Array.from({ length: 6 }, (_, index) => value[index] || ""));
    fields.current[Math.min(value.length, 5)]?.focus();
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!email) return setNotice({ type: "error", text: "Your email is missing. Start a new trial request." });
    if (coupon.length !== 6) return setNotice({ type: "error", text: "Enter the complete six-digit coupon." });
    setBusy(true); setNotice(null);
    try {
      const response = await fetch(apiVerifyUrl, {
        method: "POST", credentials: "same-origin",
        headers: { Accept: "application/json", "Content-Type": "application/json", "X-CSRF-TOKEN": csrfToken },
        body: JSON.stringify({ email, coupon }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.ok) {
        if (data.existing_account && data.redirect) window.setTimeout(() => window.location.assign(data.redirect), 1600);
        throw new Error(data.message || "The coupon could not be verified.");
      }
      setNotice({ type: "success", text: data.message || "Coupon verified. Signing you in…" });
      window.setTimeout(() => window.location.assign(data.redirect || "/home"), 700);
    } catch (error) { setNotice({ type: "error", text: error.message }); }
    finally { setBusy(false); }
  };

  return <div className="coupon-page">
    <Header />
    <main className="coupon-main">
      <section className="coupon-context" aria-labelledby="coupon-title">
        <span className="coupon-context__icon"><KeyRound /></span>
        <p className="coupon-eyebrow">Secure trial activation</p>
        <h1 id="coupon-title">Enter your trial coupon</h1>
        <p>We sent a one-time six-digit coupon to <strong>{email || "your business email"}</strong>. Enter it below to verify your request and open your trial workspace.</p>
        <ol><li><span>1</span><div><strong>Check your inbox</strong><small>Look for “Your Raymoch trial coupon.”</small></div></li><li><span>2</span><div><strong>Enter the coupon</strong><small>It expires 15 minutes after it is issued.</small></div></li><li><span>3</span><div><strong>Access Raymoch</strong><small>Your temporary three-day trial session will begin.</small></div></li></ol>
      </section>
      <section className="coupon-card">
        <div className="coupon-card__heading"><span><ShieldCheck /></span><div><p>Identity check</p><h2>Verify your email</h2></div></div>
        {notice ? <div className={`coupon-notice is-${notice.type}`} role={notice.type === "error" ? "alert" : "status"}>{notice.type === "success" ? <CheckCircle2 /> : null}{notice.text}</div> : null}
        <form onSubmit={submit}>
          <label>Six-digit coupon</label>
          <div className="coupon-digits" onPaste={paste}>{digits.map((digit, index) => <input key={index} ref={(node) => { fields.current[index] = node; }} value={digit} onChange={(event) => setDigit(index, event.target.value)} onKeyDown={(event) => { if (event.key === "Backspace" && !digit && index > 0) fields.current[index - 1]?.focus(); }} inputMode="numeric" autoComplete={index === 0 ? "one-time-code" : "off"} maxLength={1} aria-label={`Coupon digit ${index + 1}`} autoFocus={index === 0} />)}</div>
          <button className="coupon-submit" disabled={busy || coupon.length !== 6}>{busy ? <><i /> Matching coupon…</> : "Verify coupon and sign in"}</button>
        </form>
        <div className="coupon-help"><Mail /><p><strong>Didn’t receive the email?</strong><span>Check spam or return to the request page to generate a new coupon.</span></p></div>
        <a className="coupon-back" href="/request-trial"><ArrowLeft /> Return to trial request</a>
      </section>
    </main>
    <Footer />
  </div>;
}
