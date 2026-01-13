// resources/js/pages/SignupBusinessAccount.jsx
import React, { useEffect, useRef, useState } from "react";
import Header from "./Header.jsx";
import "../../../css/header.css";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

/* ================== INLINE CSS (reuse your same styles) ================== */
const css = `
:root{
  --brand-blue:#0328aeed; --brand-blue-700:#213bb1; --brand-blue-500:#041b64;
  --ink:#101114; --bg:#fafafa; --border:#e8e8ee; --card:#fff;
  --shadow:0 4px 16px rgba(10,42,107,.06); --footer-bg:#0b1020; --radius:16px
}
html, body { height:100%; }
*{ box-sizing:border-box; margin:0; padding:0; font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif; }
.page{ min-height:100vh; display:flex; flex-direction:column; background:var(--bg); color:var(--ink); }
.header{ height:80px; background:#fff; border-bottom:1px solid var(--border);
  display:flex; align-items:center; justify-content:space-between; padding:0 24px; position:relative; flex-shrink:0; }
.brand{ display:flex; align-items:center; gap:10px; color:var(--brand-blue); text-decoration:none; }
.brand svg{ width:26px; height:26px; display:block; }
.brand span{ font-weight:900; font-size:1.3rem; letter-spacing:.2px; color:var(--brand-blue); }
.iconbtn{ background:transparent; border:0; cursor:pointer; padding:6px; border-radius:8px; display:flex; align-items:center; justify-content:center; position:relative; }
.iconbtn:hover{ background:#f2f4ff; }
main{ flex:1; display:flex; align-items:center; justify-content:center; padding:24px; }
.card{ background:var(--card); border:1px solid var(--border); box-shadow:var(--shadow);
  border-radius:var(--radius); padding:32px 36px; width:100%; max-width:820px; }
.cardHeader{ display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
.cardHeader h1{ font-size:1.9rem; font-weight:900; color:#063122; }
.backBtn{ background:transparent; border:1px solid #d9e1ff; color:#041b64;
  font-weight:700; border-radius:10px; padding:8px 14px; cursor:pointer; transition:background .25s ease, border-color .25s ease; }
.backBtn:hover{ background:#eef3ff; border-color:#c9d4ff; }
.row{ display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:6px; }
@media (max-width:720px){ .row{ grid-template-columns:1fr; } }
label{ font-weight:700; font-size:.95rem; display:block; margin-top:4px; }
.input{ width:100%; padding:14px 16px; border:1px solid #063122; border-radius:10px; margin:8px 0 16px; font-size:15px; background:#fff; }
.input:focus{ outline:none; box-shadow:0 0 0 3px rgba(3,40,174,.25); }
.consent{ display:flex; gap:10px; margin:10px 0 16px; }
.consent input{ width:18px; height:18px; margin-top:3px; }
.actions{ display:flex; gap:12px; align-items:center; margin-top:6px; }
button.cta{ padding:14px 18px; border:0; border-radius:12px;
  background:linear-gradient(135deg,var(--brand-blue-700),var(--brand-blue-500));
  color:#fff; font-weight:800; font-size:15px; cursor:pointer; }
button.cta[disabled]{ opacity:.7; cursor:not-allowed; }
button.cta.ghost{ background:#f5f8ff; color:#041b64; border:1px solid #d9e1ff; }
.muted{ color:#475569; margin-bottom:12px; }
.otpWrap{ margin-top:6px; }
.otpTitle{ font-size:1.25rem; font-weight:900; color:#063122; margin-bottom:6px; }
.otpInputs{ display:flex; gap:10px; justify-content:center; margin:14px 0 10px; }
.otpBox{ width:46px; height:52px; text-align:center; font-weight:900; font-size:20px; border:1px solid #cbd5e1; border-radius:10px; background:#fff; }
.otpBox:focus{ outline:none; box-shadow:0 0 0 3px rgba(3,40,174,.25); }
.otpMeta{ display:flex; align-items:center; justify-content:space-between; gap:12px; }
.timer{ font-weight:800; }
.ft{ background:var(--footer-bg); color:#cbd5e1; font-size:.9rem; padding:12px 24px;
  display:flex; justify-content:space-between; align-items:center; border-top:1px solid #1f2937; flex-shrink:0; }
.ft a{ color:#cbd5e1; margin-left:14px; text-decoration:none; }
.ft a:hover{ text-decoration:underline; }
@media (max-width:600px){ .ft{ flex-direction:column; text-align:center; gap:6px; } .otpMeta{ flex-direction:column; } }
.inputWrap{ position:relative; }
.revealBtn{ position:absolute; right:10px; top:50%; transform:translateY(-50%); border:0; background:transparent; cursor:pointer; padding:4px; border-radius:8px; }
.revealBtn:hover{ background:#eef2ff; }
`;
const modalCss = `
.modalOverlay{ position:fixed; inset:0; background:rgba(15,23,42,.55); display:flex; align-items:center; justify-content:center; z-index:9999; }
.modalCard{ width:min(860px, calc(100% - 28px)); background:#fff; border-radius:16px; border:1px solid #e8e8ee; box-shadow:0 18px 40px rgba(2,6,23,.22); overflow:hidden; display:flex; flex-direction:column; max-height:86vh; }
.modalHead{ display:flex; align-items:center; justify-content:space-between; padding:14px 16px; border-bottom:1px solid #eef0f6; background:#f9fafb; }
.modalHead h3{ margin:0; font-size:1.05rem; font-weight:800; color:#041b64; }
.modalClose{ background:transparent; border:0; font-size:22px; line-height:1; cursor:pointer; color:#0f172a; border-radius:10px; padding:4px 8px; }
.modalClose:hover{ background:#eef2ff; }
.modalBody{ padding:18px; overflow:auto; color:#0f172a; line-height:1.55; }
.modalBody h4{ margin:16px 0 8px; font-size:1.02rem; color:#041b64; }
.modalBody p{ margin:6px 0 10px; color:#334155; }
.modalBody ul{ padding-left:18px; margin:6px 0 12px; }
.modalBody li{ margin:6px 0; color:#334155; }
.modalFoot{ padding:12px 16px; border-top:1px solid #eef0f6; display:flex; justify-content:flex-end; gap:10px; background:#fff; }
.modalFoot .cta.subtle{ background:#f5f8ff; color:#041b64; border:1px solid #d9e1ff; border-radius:10px; padding:10px 14px; font-weight:700; cursor:pointer; }
`;

/* SweetAlert2 compact styling */
const swalCss = `
.rm-swal { width:360px!important; max-width:92vw; padding:14px 16px!important; border-radius:16px!important;
  box-shadow:0 18px 44px rgba(2,6,23,.22); border:1px solid #e7ebff; position:relative; overflow:visible; backdrop-filter:saturate(140%) blur(.5px);}
.rm-swal::before{ content:""; position:absolute; inset:-6px; border-radius:22px; background:conic-gradient(from 0deg,#5b7cff,#7c5cff,#7e9bff,#5b7cff);
  filter:blur(8px); opacity:.35; z-index:-1; animation:rm-swal-spin 4.5s linear infinite; }
.rm-swal-title{ font-size:1.05rem!important; font-weight:800!important; letter-spacing:.2px; color:#041b64!important; margin-bottom:6px!important; }
.swal2-html-container{ font-size:.92rem!important; color:#334155!important; margin-top:6px!important; }
.rm-swal-btn.swal2-confirm{ background:linear-gradient(135deg,var(--brand-blue-700),var(--brand-blue-500))!important; border:none!important; color:#fff!important; font-weight:800!important;
  border-radius:10px!important; padding:10px 14px!important; box-shadow:0 4px 14px rgba(4,27,100,.22);}
.rm-swal-btn.swal2-cancel{ background:#f5f8ff!important; color:#041b64!important; border:1px solid #d9e1ff!important; font-weight:700!important; border-radius:10px!important; padding:10px 14px!important;}
.rm-swal-in{ animation:rm-swal-pop-in .18s ease-out both; } .rm-swal-out{ animation:rm-swal-pop-out .14s ease-in both; }
@keyframes rm-swal-pop-in{0%{transform:translateY(4px) scale(.96); opacity:0;}100%{transform:translateY(0) scale(1); opacity:1;}}
@keyframes rm-swal-pop-out{0%{transform:translateY(0) scale(1); opacity:1;}100%{transform:translateY(4px) scale(.96); opacity:0;}}
@keyframes rm-swal-spin{to{transform:rotate(360deg)}}
`;

/* Modal component */
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

/* SweetAlert mixin */
const swal = Swal.mixin({
  customClass: {
    popup: "rm-swal",
    title: "rm-swal-title",
    confirmButton: "rm-swal-btn",
    cancelButton: "rm-swal-btn rm-swal-cancel",
  },
  buttonsStyling: false,
  width: 360,
  showClass: { popup: "swal2-show rm-swal-in" },
  hideClass: { popup: "swal2-hide rm-swal-out" },
});
const toastOk = (msg, timer=1500) => swal.fire({ icon: "success", title: msg, timer, showConfirmButton:false });
const toastErr = (msg) => swal.fire({ icon: "error", title: "Oops", html: msg });

/* Stripe key */
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function BusinessForm({ routes }) {
  const R = routes || (typeof window !== "undefined" ? window.ROUTES : {});
  const csrf =
    document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") ||
    R.csrf || "";

  const [values, setValues] = useState({
    name: "", email: "", display_name: "", password: "", confirm_password: "",
    company_name: "", consent: false, plan: "business", type_account: "business",
  });
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState("form"); // form | otp | pay

  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const [showPass, setShowPass] = useState(false);
  const [showPass2, setShowPass2] = useState(false);

  const [emailCheck, setEmailCheck] = useState({ checking:false, taken:false });

  // OTP
  const [otp, setOtp] = useState(["","","","","",""]);
  const otpRefs = Array.from({ length: 6 }).map(() => useRef(null));
  const [expiresAt, setExpiresAt] = useState(null);
  const [countdown, setCountdown] = useState(300);

  // Billing
  const [billing, setBilling] = useState({
    name:"", email:"", phone:"", address_line1:"", address_line2:"",
    city:"", state:"", postal_code:"", country:"US",
  });
  const setBillingField = (k) => (e) => setBilling((s)=>({...s,[k]:e.target.value}));

  useEffect(() => {
    if (step === "pay") {
      setBilling((s)=>({ ...s, name: s.name || values.name, email: s.email || values.email }));
    }
  }, [step]);

  const set = (k) => (e) => setValues((s)=>({ ...s, [k]: k==="consent" ? e.target.checked : e.target.value }));

  const strongPass = (s) => /^(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]).{9,}$/.test(s);

  const validate = () => {
    if (!values.name.trim()) return toastErr("Enter your full name."), false;
    if (!/\S+@\S+\.\S+/.test(values.email.trim())) return toastErr("Enter a valid email."), false;
    if (!values.display_name.trim()) return toastErr("Enter a display name."), false;
    if (!values.password || !strongPass(values.password))
      return toastErr("Password must be ≥9 chars, include 1 uppercase, 1 number, 1 special."), false;
    if (values.password !== values.confirm_password) return toastErr("Passwords do not match."), false;
    if (!values.company_name.trim()) return toastErr("Enter your company (or N/A)."), false;
    if (!values.consent) return toastErr("You must agree to the Terms & Privacy."), false;
    return true;
  };

  const checkEmail = async (email) => {
    const em = (email || "").trim();
    if (!em || !/\S+@\S+\.\S+/.test(em)) return false;
    setEmailCheck({checking:true,taken:false});
    try{
      const res = await fetch(R.auth?.check_email ?? "/auth/check-email", {
        method:"POST",
        headers:{ "X-CSRF-TOKEN": csrf, "Accept":"application/json", "Content-Type":"application/json" },
        credentials:"same-origin",
        body: JSON.stringify({ email: em }),
      });
      const json = await res.json().catch(()=>({}));
      const taken = !!json?.taken;
      setEmailCheck({checking:false, taken});
      if (taken) await toastErr("This email is already registered. Try signing in or use another email.");
      return taken;
    } catch {
      setEmailCheck({checking:false,taken:false});
      return false;
    }
  };

  // Countdown for OTP
  useEffect(() => {
    let t;
    if (step === "otp" && expiresAt) {
      const tick = () => {
        const now = Math.floor(Date.now()/1000);
        const rem = Math.max(0, expiresAt - now);
        setCountdown(rem);
        if (rem === 0) {
          swal.fire({ icon:"error", title:"Code expired", text:"Your verification code expired. The page will reload.", timer:1500, showConfirmButton:false })
            .then(()=> window.location.reload());
        } else {
          t = setTimeout(tick, 1000);
        }
      };
      tick();
    }
    return () => clearTimeout(t);
  }, [step, expiresAt]);

  // STEP 1 — send OTP (BusinessOtpController)
  const sendOtp = async (e) => {
    e.preventDefault();
    if (busy) return;
    if (!validate()) return;
    const isTaken = await checkEmail(values.email);
    if (isTaken) return;

    setBusy(true);
    try{
      const res = await fetch(R.signup?.business?.send_otp ?? "/signup/business/send-otp", {
        method:"POST",
        headers:{ "X-CSRF-TOKEN": csrf, "Accept":"application/json", "Content-Type":"application/json" },
        credentials:"same-origin",
        body: JSON.stringify({ ...values }),
      });
      const json = await res.json().catch(()=>({}));
      if (res.ok && json.ok) {
        toastOk("Verification code sent to email.");
        const ts = json.expires
          ? Math.floor(new Date(json.expires).getTime()/1000)
          : Math.floor(Date.now()/1000) + 300;
        setExpiresAt(ts);
        setCountdown(ts - Math.floor(Date.now()/1000));
        setStep("otp");
        setTimeout(()=> otpRefs[0].current?.focus(), 50);
      } else {
        toastErr(json?.message || "Unable to send code.");
      }
    } catch {
      toastErr("Network error.");
    } finally {
      setBusy(false);
    }
  };

  const triggerVerifyIfComplete = () => {
    const code = otp.join("");
    if (code.length === 6 && code.split("").every((d)=>d !== "")) verifyOtp();
  };
  const onOtpChange = (i) => (e) => {
    const val = e.target.value.replace(/\D/g,"").slice(0,1);
    const next = [...otp]; next[i] = val; setOtp(next);
    if (val && i < 5) otpRefs[i+1].current?.focus();
    if (i === 5 && val) Promise.resolve().then(()=>triggerVerifyIfComplete());
  };
  const onOtpKeyDown = (i) => (e) => {
    if (e.key === "Backspace") {
      if (!otp[i] && i > 0) otpRefs[i-1].current?.focus();
      else { const next=[...otp]; next[i]=""; setOtp(next); }
    }
    if (i === 5) setTimeout(()=>triggerVerifyIfComplete(), 0);
  };
  const onOtpKeyUp = (i) => () => { if (i===5) triggerVerifyIfComplete(); };
  const onOtpPaste = (e) => {
    const pasted = (e.clipboardData.getData("text")||"").replace(/\D/g,"").slice(0,6);
    if (!pasted) return;
    e.preventDefault();
    const arr = pasted.split("").concat(Array(6).fill("")).slice(0,6);
    setOtp(arr);
    const idx = Math.min(5, pasted.length-1);
    setTimeout(()=> otpRefs[idx].current?.focus(), 10);
    setTimeout(()=> triggerVerifyIfComplete(), 0);
  };

  // STEP 2 — verify OTP (BusinessOtpController)
  const verifyOtp = async () => {
    const code = otp.join("");
    if (code.length !== 6) return toastErr("Enter the 6-digit code.");
    setBusy(true);
    try{
      const res = await fetch(R.signup?.business?.verify_otp ?? "/signup/business/verify-otp", {
        method:"POST",
        headers:{ "X-CSRF-TOKEN": csrf, "Accept":"application/json", "Content-Type":"application/json" },
        credentials:"same-origin",
        body: JSON.stringify({ code, email: values.email.trim() }),
      });
      const json = await res.json().catch(()=>({}));
      if (res.ok && json.ok) {
        toastOk("Email verified. Enter card to start business plan.");
        setStep("pay");
      } else {
        toastErr(json?.message || "Invalid code.");
      }
    } catch {
      toastErr("Network error.");
    } finally {
      setBusy(false);
    }
  };

  // STEP 3 — create PaymentMethod + Subscription ($69/mo)
  const stripe = useStripe();
  const elements = useElements();

  const handleSubscribe = async () => {
    if (!stripe || !elements) return;
    if (!billing.name || !billing.email || !billing.postal_code || !billing.country) {
      return toastErr("Please complete required billing fields (Name, Email, Postal, Country).");
    }
    setBusy(true);
    try{
      // 1) Create PaymentMethod from card
      const card = elements.getElement(CardElement);
      const pmRes = await stripe.createPaymentMethod({
        type: "card",
        card,
        billing_details: {
          name: billing.name,
          email: billing.email,
          phone: billing.phone || undefined,
          address: {
            line1: billing.address_line1 || undefined,
            line2: billing.address_line2 || undefined,
            city: billing.city || undefined,
            state: billing.state || undefined,
            postal_code: billing.postal_code,
            country: billing.country,
          },
        },
      });
      if (pmRes.error) throw new Error(pmRes.error.message || "Card setup failed");

      // 2) Ask server to create user + customer + subscription
      const subRes = await fetch(R.signup?.business?.complete ?? "/signup/business/complete", {
        method:"POST",
        headers:{ "X-CSRF-TOKEN": csrf, "Accept":"application/json", "Content-Type":"application/json" },
        credentials:"same-origin",
        body: JSON.stringify({
          // account info
          name: values.name,
          email: values.email,
          display_name: values.display_name,
          company_name: values.company_name,
          password: values.password,
          type_account: "business",
          // billing + PM
          billing,
          payment_method: pmRes.paymentMethod.id,
        }),
      });
      const subJson = await subRes.json();
      if (!subRes.ok) throw new Error(subJson?.message || "Unable to start subscription.");

      // 3) If requires_action, confirm the PaymentIntent (3DS)
      if (subJson.requires_action && subJson.payment_intent_client_secret) {
        const conf = await stripe.confirmCardPayment(subJson.payment_intent_client_secret);
        if (conf.error) throw new Error(conf.error.message || "Authentication failed");
        // Tell server to finalize after successful SCA
        const finalizeRes = await fetch(R.signup?.business?.finalize ?? "/signup/business/finalize", {
          method:"POST",
          headers:{ "X-CSRF-TOKEN": csrf, "Accept":"application/json", "Content-Type":"application/json" },
          credentials:"same-origin",
          body: JSON.stringify({ subscription_id: subJson.subscription_id }),
        });
        const finalizeJson = await finalizeRes.json();
        if (!finalizeRes.ok || !finalizeJson.ok) throw new Error(finalizeJson?.message || "Could not finalize subscription.");
      }

      await toastOk("Business account activated! $69/mo subscription created.", 1700);
      window.location.assign(subJson.redirect || "/dashboard");
    } catch (err) {
      toastErr(err.message || "Subscription error.");
    } finally {
      setBusy(false);
    }
  };

  const mm = String(Math.floor(countdown/60)).padStart(2,"0");
  const ss = String(countdown%60).padStart(2,"0");

  return (
    <>
      <style>{css}</style>
      <style>{modalCss}</style>
      <style>{swalCss}</style>

      <Header routes={R} />

      <div className="page">
        <main>
          <section className="card">
            <div className="cardHeader">
              <h1>Business Account</h1>
              <button type="button" className="backBtn" onClick={() => window.history.back()}>← Back</button>
            </div>

            {step === "form" && (
              <form noValidate onSubmit={sendOtp}>
                <div className="row">
                  <div>
                    <label htmlFor="p-name">Full name</label>
                    <div className="inputWrap">
                      <input id="p-name" className="input" value={values.name} onChange={set("name")} required />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="p-email">Email</label>
                    <div className="inputWrap">
                      <input id="p-email" className="input" type="email" value={values.email}
                             onChange={set("email")} onBlur={() => checkEmail(values.email)} required />
                    </div>
                    {emailCheck.checking && <small className="muted">Checking email…</small>}
                    {emailCheck.taken && <small style={{ color:"#b91c1c", fontWeight:700 }}>Email already registered.</small>}
                  </div>
                </div>

                <div className="row">
                  <div>
                    <label htmlFor="p-display">Display name</label>
                    <div className="inputWrap">
                      <input id="p-display" className="input" value={values.display_name} onChange={set("display_name")} required />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="p-company">Company</label>
                    <div className="inputWrap">
                      <input id="p-company" className="input" value={values.company_name} onChange={set("company_name")} required />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div>
                    <label htmlFor="p-pass">Password</label>
                    <div className="inputWrap">
                      <input id="p-pass" className="input" type={showPass ? "text" : "password"}
                             value={values.password} onChange={set("password")} required />
                      <button type="button" className="revealBtn" aria-label={showPass ? "Hide" : "Show"}
                              onClick={()=>setShowPass(v=>!v)}>
                        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" fill="none" stroke="#334155" strokeWidth="1.5" />
                          <circle cx="12" cy="12" r="3" fill="none" stroke="#334155" strokeWidth="1.5" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="p-pass2">Confirm password</label>
                    <div className="inputWrap">
                      <input id="p-pass2" className="input" type={showPass2 ? "text" : "password"}
                             value={values.confirm_password} onChange={set("confirm_password")} required />
                      <button type="button" className="revealBtn" aria-label={showPass2 ? "Hide" : "Show"}
                              onClick={()=>setShowPass2(v=>!v)}>
                        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" fill="none" stroke="#334155" strokeWidth="1.5" />
                          <circle cx="12" cy="12" r="3" fill="none" stroke="#334155" strokeWidth="1.5" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="consent">
                  <input id="p-consent" type="checkbox" checked={values.consent} onChange={set("consent")} />
                  <label htmlFor="p-consent">
                    <strong>I agree</strong> to the{" "}
                    <a href="#" onClick={(e)=>{e.preventDefault(); setShowTerms(true);}}>Terms</a> and{" "}
                    <a href="#" onClick={(e)=>{e.preventDefault(); setShowPrivacy(true);}}>Privacy</a>.
                    <br/><small>We’ll use your info to create a business account and send essential updates.</small>
                  </label>
                </div>

                <div className="actions">
                  <button className="cta" disabled={busy}>{busy ? "Sending Code…" : "Continue (Send OTP)"}</button>
                </div>
              </form>
            )}

            {step === "otp" && (
              <div className="otpWrap">
                <h2 className="otpTitle">Email Verification</h2>
                <p className="muted">Enter the 6-digit code sent to <strong>{values.email}</strong>.</p>
                <div className="otpInputs" onPaste={onOtpPaste}>
                  {otp.map((d, i) => (
                    <input key={i} ref={otpRefs[i]} className="otpBox" inputMode="numeric" type="text" maxLength={1}
                           value={d} onChange={onOtpChange(i)} onKeyDown={onOtpKeyDown(i)} onKeyUp={onOtpKeyUp(i)} />
                  ))}
                </div>
                <div className="otpMeta">
                  <div className="timer">Expires in: <strong>{mm}:{ss}</strong></div>
                  <button type="button" className="cta ghost" disabled={busy || countdown===0} onClick={verifyOtp}>
                    {busy ? "Verifying…" : "Verify Code"}
                  </button>
                </div>
              </div>
            )}

            {step === "pay" && (
              <div style={{ marginTop:8 }}>
                <h2 className="otpTitle">Business Plan — $69.00/month</h2>
                <p className="muted">We’ll charge $69.00 now and monthly thereafter.</p>

                <div className="row">
                  <div>
                    <label>Cardholder name</label>
                    <input className="input" value={billing.name} onChange={setBillingField("name")} required />
                  </div>
                  <div>
                    <label>Billing email</label>
                    <input className="input" type="email" value={billing.email} onChange={setBillingField("email")} required />
                  </div>
                </div>

                <div className="row">
                  <div>
                    <label>Billing phone (optional)</label>
                    <input className="input" value={billing.phone} onChange={setBillingField("phone")} />
                  </div>
                  <div>
                    <label>Country</label>
                    <input className="input" value={billing.country} onChange={setBillingField("country")} placeholder="US" required />
                  </div>
                </div>

                <div>
                  <label>Address line 1</label>
                  <input className="input" value={billing.address_line1} onChange={setBillingField("address_line1")} />
                </div>
                <div>
                  <label>Address line 2</label>
                  <input className="input" value={billing.address_line2} onChange={setBillingField("address_line2")} />
                </div>

                <div className="row">
                  <div>
                    <label>City</label>
                    <input className="input" value={billing.city} onChange={setBillingField("city")} />
                  </div>
                  <div>
                    <label>State/Region</label>
                    <input className="input" value={billing.state} onChange={setBillingField("state")} />
                  </div>
                </div>

                <div className="row">
                  <div>
                    <label>Postal code</label>
                    <input className="input" value={billing.postal_code} onChange={setBillingField("postal_code")} required />
                  </div>
                  <div>
                    <label>Card</label>
                    <div className="input" style={{ padding:12 }}>
                      <CardElement options={{ hidePostalCode: true }} />
                    </div>
                  </div>
                </div>

                <div className="actions" style={{ marginTop:12 }}>
                  <button type="button" className="cta" onClick={handleSubscribe} disabled={busy || !stripe}>
                    {busy ? "Processing…" : "Start $69/mo & Activate"}
                  </button>
                </div>
              </div>
            )}
          </section>
        </main>
<footer className="ft">
  <div>
    © {new Date().getFullYear()} {routes.brandName || "Raymoch"}. All rights reserved.
  </div>
  <div>
    <a href={routes.privacy}>Privacy</a>
    <a href={routes.terms}>Terms</a>
    <a href={routes.cookies}>Cookies</a>
  </div>
          <div>© 2025 Raymoch. All rights reserved.</div>
          <div><a href={R.signup?.index ?? "/signup"}>Signup Options</a></div>
        </footer>
      </div>

      {/* Terms */}
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
          <li>Premium plans renew automatically until canceled (if you enable subscriptions later).</li>
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
      </Modal>    </>
  );
}

export default function SignupBusinessAccount(props) {
  return (
    <Elements stripe={stripePromise}>
      <BusinessForm {...props} />
    </Elements>
  );
}
