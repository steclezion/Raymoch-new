import { useMemo, useRef, useState } from "react";
import { ArrowLeft, CheckCircle2, Clock3, KeyRound, LogIn, Mail, MailCheck, ShieldCheck } from "lucide-react";
import Header from "./layout_master/Header.jsx";
import Footer from "./layout_master/Footer.jsx";
import "../styles/trial-coupon.css";

export default function VerifyCode({ apiVerifyUrl = "/trial/verify-coupon", csrfToken = "", emailProp = "" }) {
  const [digits, setDigits] = useState(Array(6).fill(""));
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const fields = useRef([]);
  const email = useMemo(() => emailProp || new URLSearchParams(window.location.search).get("email") || "", [emailProp]);
  const verificationCode = digits.join("");

  const continueToCouponLogin = () => {
    const destination = new URL(confirmation.redirect, window.location.origin);
    destination.searchParams.set("email", email);
    destination.hash = "coupon-login";
    window.location.assign(destination.toString());
  };

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
    if (verificationCode.length !== 6) return setNotice({ type: "error", text: "Enter the complete six-digit verification number." });
    setBusy(true); setNotice(null);
    try {
      const response = await fetch(apiVerifyUrl, {
        method: "POST", credentials: "same-origin",
        headers: { Accept: "application/json", "Content-Type": "application/json", "X-CSRF-TOKEN": csrfToken },
        body: JSON.stringify({ email, verification_code: verificationCode }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.ok) {
        if (data.existing_account && data.redirect) window.setTimeout(() => window.location.assign(data.redirect), 1600);
        throw new Error(data.message || "The coupon could not be verified.");
      }
      setNotice({ type: "success", text: data.message || "Email verified. Your access coupon has been sent…" });
      setConfirmation({ redirect: data.redirect || "/request-trial#coupon-login" });
    } catch (error) { setNotice({ type: "error", text: error.message }); }
    finally { setBusy(false); }
  };

  return <div className="coupon-page">
    <Header />
    <main className="coupon-main">
      <section className="coupon-context" aria-labelledby="coupon-title">
        <span className="coupon-context__icon"><KeyRound /></span>
        <p className="coupon-eyebrow">Secure trial activation</p>
        <h1 id="coupon-title">Verify your email</h1>
        <p>We sent a one-time six-digit verification number to <strong>{email || "your business email"}</strong>. Enter it below to create your trial account.</p>
        <ol><li><span>1</span><div><strong>Check your inbox</strong><small>Look for “Verify your Raymoch trial request.”</small></div></li><li><span>2</span><div><strong>Enter the number</strong><small>It expires 15 minutes after it is issued.</small></div></li><li><span>3</span><div><strong>Receive your coupon</strong><small>We will email your secure 16-character login coupon.</small></div></li></ol>
      </section>
      <section className="coupon-card">
        <div className="coupon-card__heading"><span><ShieldCheck /></span><div><p>Identity check</p><h2>Verify your email</h2></div></div>
        {notice ? <div className={`coupon-notice is-${notice.type}`} role={notice.type === "error" ? "alert" : "status"}>{notice.type === "success" ? <CheckCircle2 /> : null}{notice.text}</div> : null}
        <form onSubmit={submit}>
          <label>Six-digit verification number</label>
          <div className="coupon-digits" onPaste={paste}>{digits.map((digit, index) => <input key={index} ref={(node) => { fields.current[index] = node; }} value={digit} onChange={(event) => setDigit(index, event.target.value)} onKeyDown={(event) => { if (event.key === "Backspace" && !digit && index > 0) fields.current[index - 1]?.focus(); }} inputMode="numeric" autoComplete={index === 0 ? "one-time-code" : "off"} maxLength={1} aria-label={`Coupon digit ${index + 1}`} autoFocus={index === 0} />)}</div>
          <button className="coupon-submit" disabled={busy || verificationCode.length !== 6}>{busy ? <><i /> Verifying email…</> : "Verify email and create trial"}</button>
        </form>
        <div className="coupon-help"><Mail /><p><strong>Didn’t receive the email?</strong><span>Check spam or return to the request page to generate a new coupon.</span></p></div>
        <a className="coupon-back" href="/request-trial"><ArrowLeft /> Return to trial request</a>
      </section>
    </main>
    {confirmation ? <div className="coupon-confirmation-backdrop" role="presentation">
      <section className="coupon-confirmation" role="dialog" aria-modal="true" aria-labelledby="coupon-confirmation-title" aria-describedby="coupon-confirmation-description">
        <span className="coupon-confirmation__icon"><MailCheck /></span>
        <p className="coupon-confirmation__eyebrow">Verification successful</p>
        <h2 id="coupon-confirmation-title">Your trial coupon is on its way</h2>
        <p id="coupon-confirmation-description">Check your email. We generated a secure coupon that gives you access to Raymoch for one day.</p>
        <div className="coupon-confirmation__steps">
          <div><Mail /><span><strong>Look in your inbox</strong><small>Open the coupon email sent to {email}.</small></span></div>
          <div><Clock3 /><span><strong>One day of access</strong><small>Your trial begins now and expires at the time shown in the email.</small></span></div>
          <div><LogIn /><span><strong>Sign in with the coupon</strong><small>Use your email address and the 16-character coupon to log in.</small></span></div>
        </div>
        <button type="button" autoFocus onClick={continueToCouponLogin}><CheckCircle2 /> I understand — continue to login</button>
      </section>
    </div> : null}
    <Footer />
  </div>;
}
