// resources/js/pages/SignupPremium.jsx
import React, { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./Header.jsx";

import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function PremiumForm({ routes }) {
  const R = routes || (typeof window !== "undefined" ? window.ROUTES : {});
  const csrf =
    document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") ||
    R.csrf ||
    "";

  const [values, setValues] = useState({
    name: "",
    email: "",
    display_name: "",
    password: "",
    confirm_password: "",
    company_name: "",
    consent: false,
    plan: "premium",
  });
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState("form"); // form | otp | pay
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = Array.from({ length: 6 }).map(() => useRef(null));
  const [expiresAt, setExpiresAt] = useState(null);
  const [countdown, setCountdown] = useState(300);
  const consentRef = useRef(null);

  const stripe = useStripe();
  const elements = useElements();

  const set = (k) => (e) => {
    const v = k === "consent" ? e.target.checked : e.target.value;
    setValues((s) => ({ ...s, [k]: v }));
  };

  const strongPass = (s) =>
    /^(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]).{9,}$/.test(s);

  const validate = () => {
    if (!values.name.trim()) return toast.error("Enter your full name."), false;
    if (!/\S+@\S+\.\S+/.test(values.email.trim())) return toast.error("Enter a valid email."), false;
    if (!values.display_name.trim()) return toast.error("Enter a display name."), false;
    if (!values.password || !strongPass(values.password))
      return toast.error("Password must be ≥9 chars, include 1 uppercase, 1 number, 1 special."), false;
    if (values.password !== values.confirm_password)
      return toast.error("Passwords do not match."), false;
    if (!values.company_name.trim())
      return toast.error("Enter your company (or N/A)."), false;
    if (!values.consent) {
      toast.error("You must agree to the Terms & Privacy.");
      consentRef.current?.focus();
      return false;
    }
    return true;
  };

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

  const sendOtp = async (e) => {
    e.preventDefault();
    if (busy) return;
    if (!validate()) return;

    setBusy(true);
    try {
      const res = await fetch(R.signup?.premium?.send_otp ?? "/signup/premium/send-otp", {
        method: "POST",
        headers: {
          "X-CSRF-TOKEN": csrf,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({
          ...values,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        toast.success("Verification code sent to email.");
        const ts = json.expires
          ? Math.floor(new Date(json.expires).getTime() / 1000)
          : Math.floor(Date.now() / 1000) + 300;
        setExpiresAt(ts);
        setCountdown(ts - Math.floor(Date.now() / 1000));
        setStep("otp");
        setTimeout(() => otpRefs[0].current?.focus(), 50);
      } else {
        toast.error(json?.message || "Unable to send code.");
      }
    } catch {
      toast.error("Network error.");
    } finally {
      setBusy(false);
    }
  };

  const onOtpChange = (i) => (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 1);
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) otpRefs[i + 1].current?.focus();
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
  };

  const verifyOtp = async () => {
    const code = otp.join("");
    if (code.length !== 6) return toast.error("Enter the 6-digit code.");
    setBusy(true);
    try {
      const res = await fetch(R.signup?.premium?.verify_otp ?? "/signup/premium/verify-otp", {
        method: "POST",
        headers: {
          "X-CSRF-TOKEN": csrf,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({ code, email: values.email.trim() }),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        toast.success("Email verified. Enter card to subscribe.");
        setStep("pay");
      } else {
        toast.error(json?.message || "Invalid code.");
      }
    } catch {
      toast.error("Network error.");
    } finally {
      setBusy(false);
    }
  };

  // Confirm card (SetupIntent), then create subscription (server will charge first invoice)
  const handlePay = async () => {
    if (!stripe || !elements) return;
    setBusy(true);
    try {
      // 1) Create a SetupIntent for this email (server ties to a Customer)
      const siRes = await fetch(R.payment?.create_setup_intent ?? "/payment/create-setup-intent", {
        method: "POST",
        headers: {
          "X-CSRF-TOKEN": csrf,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({ email: values.email.trim(), name: values.name.trim() }),
      });
      const siJson = await siRes.json();
      if (!siRes.ok) throw new Error(siJson?.message || "Unable to init card capture.");

      // 2) Confirm card with Stripe.js (collect card details securely)
      const card = elements.getElement(CardElement);
      const { setupIntent, error } = await stripe.confirmCardSetup(siJson.client_secret, {
        payment_method: {
          card,
          billing_details: { name: values.name, email: values.email },
        },
      });
      if (error) throw new Error(error.message || "Card confirmation failed");

      // 3) Tell backend to create subscription (recurring). Backend will:
      //    - attach PM to customer
      //    - create subscription (no trial), invoice attempts payment immediately
      const subRes = await fetch(R.payment?.create_subscription ?? "/payment/create-subscription", {
        method: "POST",
        headers: {
          "X-CSRF-TOKEN": csrf,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify({
          email: values.email.trim(),
          display_name: values.display_name.trim(),
          name: values.name.trim(),
          company_name: values.company_name.trim(),
          password: values.password, // server will hash
          payment_method: setupIntent.payment_method,
          plan: "premium",
        }),
      });
      const subJson = await subRes.json();
      if (!subRes.ok || !subJson.ok) {
        throw new Error(subJson?.message || "Subscription failed.");
      }

      // 4) Some cards require SCA for the invoice payment (handle next_action):
      if (subJson.payment_intent_client_secret && subJson.status === "requires_action") {
        const { error: actErr, paymentIntent } = await stripe.confirmCardPayment(
          subJson.payment_intent_client_secret
        );
        if (actErr) {
          throw new Error(actErr.message || "Authentication failed");
        }
        if (paymentIntent.status !== "succeeded") {
          throw new Error("Payment not captured.");
        }
      }

      toast.success("Subscribed! Redirecting…");
      setTimeout(() => window.location.assign(subJson.redirect || "/dashboard"), 700);
    } catch (err) {
      toast.error(err.message || "Payment error.");
    } finally {
      setBusy(false);
    }
  };

  const mm = String(Math.floor(countdown / 60)).padStart(2, "0");
  const ss = String(countdown % 60).padStart(2, "0");

  return (
    <>
      <Header routes={R} />
      <ToastContainer position="top-right" />
      <div className="page">
        <main>
          <section className="card" style={{ maxWidth: 820 }}>
            <div className="cardHeader">
              <h1>Premium Account</h1>
              <button type="button" className="backBtn" onClick={() => window.history.back()}>
                ← Back
              </button>
            </div>

            {step === "form" && (
              <form noValidate onSubmit={sendOtp}>
                <div className="row">
                  <div>
                    <label>Full name</label>
                    <input className="input" value={values.name} onChange={set("name")} required />
                  </div>
                  <div>
                    <label>Email</label>
                    <input className="input" type="email" value={values.email} onChange={set("email")} required />
                  </div>
                </div>

                <div className="row">
                  <div>
                    <label>Display name</label>
                    <input className="input" value={values.display_name} onChange={set("display_name")} required />
                  </div>
                  <div>
                    <label>Company</label>
                    <input className="input" value={values.company_name} onChange={set("company_name")} required />
                  </div>
                </div>

                <div className="row">
                  <div>
                    <label>Password</label>
                    <input className="input" type="password" value={values.password} onChange={set("password")} required />
                  </div>
                  <div>
                    <label>Confirm password</label>
                    <input className="input" type="password" value={values.confirm_password} onChange={set("confirm_password")} required />
                  </div>
                </div>

                <div className="consent">
                  <input id="p-consent" type="checkbox" checked={values.consent} onChange={set("consent")} ref={consentRef} />
                  <label htmlFor="p-consent">
                    <strong>I agree</strong> to the Terms and Privacy.
                  </label>
                </div>

                <div className="actions">
                  <button className="cta" disabled={busy}>{busy ? "Sending Code…" : "Continue (Send OTP)"}</button>
                </div>
              </form>
            )}

            {step === "otp" && (
              <div className="otpWrap">
                <h2>Email Verification</h2>
                <p className="muted">Enter the 6-digit code sent to <strong>{values.email}</strong>.</p>
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
                  <button type="button" className="cta ghost" disabled={busy || countdown === 0} onClick={verifyOtp}>
                    {busy ? "Verifying…" : "Verify Code"}
                  </button>
                </div>
              </div>
            )}

            {step === "pay" && (
              <div style={{ marginTop: 8 }}>
                <h2 className="otpTitle">Card for Premium (recurring)</h2>
                <p className="muted">We’ll create a subscription; the first payment happens now.</p>
                <div className="input" style={{ padding: 12 }}>
                  <CardElement options={{ hidePostalCode: false }} />
                </div>
                <div className="actions" style={{ marginTop: 12 }}>
                  <button type="button" className="cta" onClick={handlePay} disabled={busy || !stripe}>
                    {busy ? "Processing…" : "Start Subscription"}
                  </button>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </>
  );
}

export default function SignupPremium(props) {
  return (
    <Elements stripe={stripePromise}>
      <PremiumForm {...props} />
    </Elements>
  );
}
