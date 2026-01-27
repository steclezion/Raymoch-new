// resources/js/pages/SignupPremium.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

import { loadStripe } from "@stripe/stripe-js";
import {
    Elements,
    CardElement,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js";

import { Toaster, toast } from "sonner";

/* ================== Reusable Modal component ================== */
function Modal({ title, open, onClose, children }) {
    useEffect(() => {
        const onEsc = (e) => {
            if (e.key === "Escape") onClose?.();
        };
        if (open) document.addEventListener("keydown", onEsc);
        return () => document.removeEventListener("keydown", onEsc);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            className="modalOverlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div className="modalCard">
                <div className="modalHead">
                    <h3 id="modal-title">{title}</h3>
                    <button
                        className="modalClose"
                        aria-label="Close"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>
                <div className="modalBody">{children}</div>
                <div className="modalFoot">
                    <button className="cta subtle" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

// Stripe publishable key must be set in your .env as VITE_STRIPE_PUBLISHABLE_KEY
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function PremiumForm({ routes }) {
    const R = routes || (typeof window !== "undefined" ? window.ROUTES : {});
    const csrf =
        document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content") ||
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

    // Terms/Privacy modals
    const [showTerms, setShowTerms] = useState(false);
    const [showPrivacy, setShowPrivacy] = useState(false);

    // Password reveal
    const [showPass, setShowPass] = useState(false);
    const [showPass2, setShowPass2] = useState(false);

    // Email uniqueness
    const [emailCheck, setEmailCheck] = useState({
        checking: false,
        taken: false,
    });

    // OTP
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const otpRefs = useMemo(
        () => Array.from({ length: 6 }).map(() => React.createRef()),
        []
    );

    const [expiresAt, setExpiresAt] = useState(null);
    const [countdown, setCountdown] = useState(300);

    // Billing for $9 charge
    const [billing, setBilling] = useState({
        name: "",
        email: "",
        phone: "",
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        postal_code: "",
        country: "US",
    });

    const setBillingField = (k) => (e) =>
        setBilling((s) => ({ ...s, [k]: e.target.value }));

    useEffect(() => {
        if (step === "pay") {
            setBilling((s) => ({
                ...s,
                name: s.name || values.name,
                email: s.email || values.email,
            }));
        }
    }, [step, values.name, values.email]);

    const set = (k) => (e) => {
        const v = k === "consent" ? e.target.checked : e.target.value;
        setValues((s) => ({ ...s, [k]: v }));
    };

    const strongPass = (s) =>
        /^(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]).{9,}$/.test(
            s
        );

    const validate = () => {
        if (!values.name.trim()) {
            toast.error("Enter your full name.");
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(values.email.trim())) {
            toast.error("Enter a valid email.");
            return false;
        }
        if (!values.display_name.trim()) {
            toast.error("Enter a display name.");
            return false;
        }
        if (!values.password || !strongPass(values.password)) {
            toast.error(
                "Password must be ≥9 chars, include 1 uppercase, 1 number, and 1 special character."
            );
            return false;
        }
        if (values.password !== values.confirm_password) {
            toast.error("Passwords do not match.");
            return false;
        }
        if (!values.company_name.trim()) {
            toast.error("Enter your company (or N/A).");
            return false;
        }
        if (!values.consent) {
            toast.error("You must agree to the Terms & Privacy.");
            return false;
        }
        return true;
    };

    // Email uniqueness check (onBlur + pre-submit)
    const checkEmail = async (email) => {
        const em = (email || "").trim();
        if (!em || !/\S+@\S+\.\S+/.test(em)) return false;

        setEmailCheck({ checking: true, taken: false });

        try {
            const res = await fetch(
                R.auth?.check_email ?? "/auth/check-email",
                {
                    method: "POST",
                    headers: {
                        "X-CSRF-TOKEN": csrf,
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    credentials: "same-origin",
                    body: JSON.stringify({ email: em }),
                }
            );

            const json = await res.json().catch(() => ({}));
            const taken = !!json?.taken; // { taken: true|false }
            setEmailCheck({ checking: false, taken });

            if (taken) {
                toast.error(
                    "This email is already registered. Please sign in or use another email."
                );
            }

            return taken;
        } catch {
            setEmailCheck({ checking: false, taken: false });
            toast.error("Could not verify email right now. Try again.");
            return false;
        }
    };

    // Countdown for OTP
    useEffect(() => {
        let t;
        if (step === "otp" && expiresAt) {
            const tick = () => {
                const now = Math.floor(Date.now() / 1000);
                const remaining = Math.max(0, expiresAt - now);
                setCountdown(remaining);

                if (remaining === 0) {
                    toast.error("Code expired. Reloading…");
                    setTimeout(() => window.location.reload(), 900);
                } else {
                    t = setTimeout(tick, 1000);
                }
            };
            tick();
        }
        return () => clearTimeout(t);
    }, [step, expiresAt]);

    // ===== STEP 1 — send OTP =====
    const sendOtp = async (e) => {
        e.preventDefault();
        if (busy) return;
        if (!validate()) return;

        const isTaken = await checkEmail(values.email);
        if (isTaken) return;

        setBusy(true);
        try {
            const res = await fetch(
                R.signup?.premium?.send_otp ?? "/signup/premium/send-otp",
                {
                    method: "POST",
                    headers: {
                        "X-CSRF-TOKEN": csrf,
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    credentials: "same-origin",
                    body: JSON.stringify({ ...values }),
                }
            );

            const json = await res.json().catch(() => ({}));

            if (res.ok && json.ok) {
                toast.success("Verification code sent to email.");
                const ts = json.expires
                    ? Math.floor(new Date(json.expires).getTime() / 1000)
                    : Math.floor(Date.now() / 1000) + 300;

                setExpiresAt(ts);
                setCountdown(ts - Math.floor(Date.now() / 1000));
                setStep("otp");

                setTimeout(() => otpRefs[0]?.current?.focus(), 50);
            } else {
                toast.error(json?.message || "Unable to send code.");
            }
        } catch {
            toast.error("Network error. Please try again.");
        } finally {
            setBusy(false);
        }
    };

    const triggerVerifyIfComplete = () => {
        const code = otp.join("");
        if (code.length === 6 && code.split("").every((d) => d !== "")) {
            verifyOtp();
        }
    };

    // OTP behaviors
    const onOtpChange = (i) => (e) => {
        const val = e.target.value.replace(/\D/g, "").slice(0, 1);
        const next = [...otp];
        next[i] = val;
        setOtp(next);

        if (val && i < 5) otpRefs[i + 1]?.current?.focus();
        if (i === 5 && val) setTimeout(triggerVerifyIfComplete, 0);
    };

    const onOtpKeyDown = (i) => (e) => {
        const key = e.key;

        if (key === "Backspace") {
            if (!otp[i] && i > 0) {
                otpRefs[i - 1]?.current?.focus();
            } else {
                const next = [...otp];
                next[i] = "";
                setOtp(next);
            }
        } else if (key === "ArrowLeft" && i > 0) {
            otpRefs[i - 1]?.current?.focus();
            e.preventDefault();
        } else if (key === "ArrowRight" && i < 5) {
            otpRefs[i + 1]?.current?.focus();
            e.preventDefault();
        }

        if (i === 5) setTimeout(triggerVerifyIfComplete, 0);
    };

    const onOtpPaste = (e) => {
        const pasted = (e.clipboardData.getData("text") || "")
            .replace(/\D/g, "")
            .slice(0, 6);

        if (!pasted) return;

        e.preventDefault();
        const arr = pasted.split("").concat(Array(6).fill("")).slice(0, 6);
        setOtp(arr);

        const idx = Math.min(5, pasted.length - 1);
        setTimeout(() => otpRefs[idx]?.current?.focus(), 10);
        setTimeout(triggerVerifyIfComplete, 0);
    };

    // ===== STEP 2 — verify OTP =====
    const verifyOtp = async () => {
        const code = otp.join("");
        if (code.length !== 6) {
            toast.error("Enter the 6-digit code.");
            return;
        }

        setBusy(true);
        try {
            const res = await fetch(
                R.signup?.premium?.verify_otp ?? "/signup/premium/verify-otp",
                {
                    method: "POST",
                    headers: {
                        "X-CSRF-TOKEN": csrf,
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    credentials: "same-origin",
                    body: JSON.stringify({ code, email: values.email.trim() }),
                }
            );

            const json = await res.json().catch(() => ({}));

            if (res.ok && json.ok) {
                toast.success(
                    "Email verified. Enter card to activate premium."
                );
                setStep("pay");
            } else {
                toast.error(json?.message || "Invalid code.");
            }
        } catch {
            toast.error("Network error. Please try again.");
        } finally {
            setBusy(false);
        }
    };

    // ===== STEP 3 — payment (one-time $9 charge) =====
    const stripe = useStripe();
    const elements = useElements();

    const handlePay = async () => {
        if (!stripe || !elements) return;

        if (
            !billing.name ||
            !billing.email ||
            !billing.postal_code ||
            !billing.country
        ) {
            toast.error(
                "Please complete required billing fields (Name, Email, Postal, Country)."
            );
            return;
        }

        setBusy(true);
        try {
            // 1) Create a $9 PaymentIntent on server
            const piRes = await fetch(
                R.payment?.create_payment_intent ??
                    "/payment/create-payment-intent",
                {
                    method: "POST",
                    headers: {
                        "X-CSRF-TOKEN": csrf,
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    credentials: "same-origin",
                    body: JSON.stringify({
                        amount: 900,
                        currency: "usd",
                        receipt_email: billing.email,
                        metadata: {
                            plan: "premium",
                            signup_email: values.email,
                        },
                    }),
                }
            );

            const piJson = await piRes.json().catch(() => ({}));
            if (!piRes.ok || !piJson.client_secret) {
                throw new Error(piJson?.message || "Unable to start payment.");
            }

            // 2) Confirm the card with full billing details
            const card = elements.getElement(CardElement);
            const { error, paymentIntent } = await stripe.confirmCardPayment(
                piJson.client_secret,
                {
                    payment_method: {
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
                    },
                }
            );

            if (error)
                throw new Error(error.message || "Card confirmation failed");
            if (!paymentIntent || paymentIntent.status !== "succeeded") {
                throw new Error("Payment not captured.");
            }

            // 3) Finalize premium signup/upgrade
            const finalRes = await fetch(
                R.signup?.premium?.complete ?? "/signup/premium/complete",
                {
                    method: "POST",
                    headers: {
                        "X-CSRF-TOKEN": csrf,
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    credentials: "same-origin",
                    body: JSON.stringify({
                        name: values.name,
                        email: values.email,
                        display_name: values.display_name,
                        company_name: values.company_name,
                        password: values.password,
                        plan: "premium",
                        stripe_payment_intent: paymentIntent.id,
                    }),
                }
            );

            const finalJson = await finalRes.json().catch(() => ({}));
            if (!finalRes.ok || !finalJson.ok) {
                throw new Error(
                    finalJson?.message || "Could not finalize premium account."
                );
            }

            toast.success("Payment received. Premium activated!");
            setTimeout(() => {
                window.location.assign(finalJson.redirect || "/dashboard");
            }, 700);
        } catch (err) {
            toast.error(err?.message || "Payment error.");
        } finally {
            setBusy(false);
        }
    };

    const mm = String(Math.floor(countdown / 60)).padStart(2, "0");
    const ss = String(countdown % 60).padStart(2, "0");

    return (
        <>
            <style>{css}</style>
            <style>{modalCss}</style>

            <Header routes={R} />

            {/* ✅ Sonner Toaster */}
            <Toaster
                position="top-right"
                richColors
                closeButton
                expand={false}
                toastOptions={{ duration: 3500 }}
            />

            <div className="page">
                <main>
                    <section className="card">
                        <div className="cardHeader">
                            <h1>Premium Account</h1>
                            <button
                                type="button"
                                className="backBtn"
                                onClick={() => window.history.back()}
                            >
                                ← Back
                            </button>
                        </div>

                        {step === "form" && (
                            <form noValidate onSubmit={sendOtp}>
                                <div className="row">
                                    <div>
                                        <label htmlFor="p-name">
                                            Full name
                                        </label>
                                        <div className="inputWrap">
                                            <input
                                                id="p-name"
                                                className="input"
                                                value={values.name}
                                                onChange={set("name")}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="p-email">Email</label>
                                        <div className="inputWrap">
                                            <input
                                                id="p-email"
                                                className="input"
                                                type="email"
                                                value={values.email}
                                                onChange={set("email")}
                                                onBlur={() =>
                                                    checkEmail(values.email)
                                                }
                                                required
                                            />
                                        </div>

                                        {emailCheck.checking && (
                                            <small className="muted">
                                                Checking email…
                                            </small>
                                        )}
                                        {emailCheck.taken && (
                                            <small
                                                style={{
                                                    color: "#b91c1c",
                                                    fontWeight: 700,
                                                }}
                                            >
                                                Email already registered.
                                            </small>
                                        )}
                                    </div>
                                </div>

                                <div className="row">
                                    <div>
                                        <label htmlFor="p-display">
                                            Display name
                                        </label>
                                        <div className="inputWrap">
                                            <input
                                                id="p-display"
                                                className="input"
                                                value={values.display_name}
                                                onChange={set("display_name")}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="p-company">
                                            Company
                                        </label>
                                        <div className="inputWrap">
                                            <input
                                                id="p-company"
                                                className="input"
                                                value={values.company_name}
                                                onChange={set("company_name")}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div>
                                        <label htmlFor="p-pass">Password</label>
                                        <div className="inputWrap">
                                            <input
                                                id="p-pass"
                                                className="input"
                                                type={
                                                    showPass
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={values.password}
                                                onChange={set("password")}
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="revealBtn"
                                                aria-label={
                                                    showPass
                                                        ? "Hide password"
                                                        : "Show password"
                                                }
                                                onClick={() =>
                                                    setShowPass((v) => !v)
                                                }
                                                title={
                                                    showPass
                                                        ? "Hide password"
                                                        : "Show password"
                                                }
                                            >
                                                <svg
                                                    width="22"
                                                    height="22"
                                                    viewBox="0 0 24 24"
                                                    aria-hidden="true"
                                                >
                                                    <path
                                                        d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z"
                                                        fill="none"
                                                        stroke="#334155"
                                                        strokeWidth="1.5"
                                                    />
                                                    <circle
                                                        cx="12"
                                                        cy="12"
                                                        r="3"
                                                        fill="none"
                                                        stroke="#334155"
                                                        strokeWidth="1.5"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="p-pass2">
                                            Confirm password
                                        </label>
                                        <div className="inputWrap">
                                            <input
                                                id="p-pass2"
                                                className="input"
                                                type={
                                                    showPass2
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={values.confirm_password}
                                                onChange={set(
                                                    "confirm_password"
                                                )}
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="revealBtn"
                                                aria-label={
                                                    showPass2
                                                        ? "Hide password"
                                                        : "Show password"
                                                }
                                                onClick={() =>
                                                    setShowPass2((v) => !v)
                                                }
                                                title={
                                                    showPass2
                                                        ? "Hide password"
                                                        : "Show password"
                                                }
                                            >
                                                <svg
                                                    width="22"
                                                    height="22"
                                                    viewBox="0 0 24 24"
                                                    aria-hidden="true"
                                                >
                                                    <path
                                                        d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z"
                                                        fill="none"
                                                        stroke="#334155"
                                                        strokeWidth="1.5"
                                                    />
                                                    <circle
                                                        cx="12"
                                                        cy="12"
                                                        r="3"
                                                        fill="none"
                                                        stroke="#334155"
                                                        strokeWidth="1.5"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="consent">
                                    <input
                                        id="p-consent"
                                        type="checkbox"
                                        checked={values.consent}
                                        onChange={set("consent")}
                                    />
                                    <label htmlFor="p-consent">
                                        <strong>I agree</strong> to the{" "}
                                        <a
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setShowTerms(true);
                                            }}
                                        >
                                            Terms
                                        </a>{" "}
                                        and{" "}
                                        <a
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setShowPrivacy(true);
                                            }}
                                        >
                                            Privacy
                                        </a>
                                        .<br />
                                        <small>
                                            We’ll use your info to create a
                                            premium account and send essential
                                            updates.
                                        </small>
                                    </label>
                                </div>

                                <div className="actions">
                                    <button className="cta" disabled={busy}>
                                        {busy
                                            ? "Sending Code…"
                                            : "Continue (Send OTP)"}
                                    </button>
                                </div>
                            </form>
                        )}

                        {step === "otp" && (
                            <div className="otpWrap">
                                <h2 className="otpTitle">Email Verification</h2>
                                <p className="muted">
                                    Enter the 6-digit code sent to{" "}
                                    <strong>{values.email}</strong>.
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
                                    <div className="timer">
                                        Expires in:{" "}
                                        <strong>
                                            {mm}:{ss}
                                        </strong>
                                    </div>
                                    <button
                                        type="button"
                                        className="cta ghost"
                                        disabled={busy || countdown === 0}
                                        onClick={verifyOtp}
                                    >
                                        {busy ? "Verifying…" : "Verify Code"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === "pay" && (
                            <div style={{ marginTop: 8 }}>
                                <h2 className="otpTitle">
                                    Card for Premium (one-time $9.00)
                                </h2>
                                <p className="muted">
                                    We’ll charge $9.00 now to activate your
                                    premium account.
                                </p>

                                <div className="row">
                                    <div>
                                        <label>Cardholder name</label>
                                        <input
                                            className="input"
                                            value={billing.name}
                                            onChange={setBillingField("name")}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label>Billing email</label>
                                        <input
                                            className="input"
                                            type="email"
                                            value={billing.email}
                                            onChange={setBillingField("email")}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div>
                                        <label>Billing phone (optional)</label>
                                        <input
                                            className="input"
                                            value={billing.phone}
                                            onChange={setBillingField("phone")}
                                        />
                                    </div>
                                    <div>
                                        <label>Country</label>
                                        <input
                                            className="input"
                                            value={billing.country}
                                            onChange={setBillingField(
                                                "country"
                                            )}
                                            placeholder="US"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label>Address line 1</label>
                                    <input
                                        className="input"
                                        value={billing.address_line1}
                                        onChange={setBillingField(
                                            "address_line1"
                                        )}
                                    />
                                </div>

                                <div>
                                    <label>Address line 2</label>
                                    <input
                                        className="input"
                                        value={billing.address_line2}
                                        onChange={setBillingField(
                                            "address_line2"
                                        )}
                                    />
                                </div>

                                <div className="row">
                                    <div>
                                        <label>City</label>
                                        <input
                                            className="input"
                                            value={billing.city}
                                            onChange={setBillingField("city")}
                                        />
                                    </div>
                                    <div>
                                        <label>State/Region</label>
                                        <input
                                            className="input"
                                            value={billing.state}
                                            onChange={setBillingField("state")}
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div>
                                        <label>Postal code</label>
                                        <input
                                            className="input"
                                            value={billing.postal_code}
                                            onChange={setBillingField(
                                                "postal_code"
                                            )}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label>Card</label>
                                        <div
                                            className="input"
                                            style={{ padding: 12 }}
                                        >
                                            <CardElement
                                                options={{
                                                    hidePostalCode: true,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className="actions"
                                    style={{ marginTop: 12 }}
                                >
                                    <button
                                        type="button"
                                        className="cta"
                                        onClick={handlePay}
                                        disabled={busy || !stripe}
                                    >
                                        {busy
                                            ? "Processing…"
                                            : "Pay $9.00 & Activate"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </section>
                </main>

                <Footer routes={R} />
            </div>

            {/* ======= Terms Modal ======= */}
            <Modal
                title="Terms of Service"
                open={showTerms}
                onClose={() => setShowTerms(false)}
            >
                <p>
                    <strong>Effective:</strong> January 1, 2025
                </p>
                <h4>1) Acceptance of Terms</h4>
                <p>
                    By creating an account or using Raymoch, you agree to these
                    Terms of Service. If you do not agree, you may not access or
                    use the platform. We may update these Terms periodically;
                    continued use after updates constitutes acceptance.
                </p>
                <h4>2) Accounts & Responsibilities</h4>
                <ul>
                    <li>
                        Provide accurate registration information and keep
                        credentials secure.
                    </li>
                    <li>
                        You are responsible for all activity under your account.
                    </li>
                    <li>Misuse may result in suspension or termination.</li>
                </ul>
                <h4>3) Service Availability & Changes</h4>
                <p>
                    We aim for high availability but do not guarantee
                    uninterrupted service. We may modify, suspend, or
                    discontinue features at any time with or without notice.
                </p>
                <h4>4) Paid Plans, Billing & Taxes</h4>
                <ul>
                    <li>
                        Billing is handled by our payment provider; taxes may
                        apply based on your region.
                    </li>
                    <li>
                        Failed or disputed charges may pause or terminate
                        access.
                    </li>
                </ul>
                <h4>5) Prohibited Conduct</h4>
                <ul>
                    <li>
                        Reverse engineering, automated scraping, or attempting
                        to bypass security controls.
                    </li>
                    <li>
                        Uploading malicious code or content that violates law or
                        third-party rights.
                    </li>
                </ul>
                <h4>6) Intellectual Property</h4>
                <p>
                    The Raymoch name, logos, and platform content are protected
                    by copyright, trademark, and other laws. You receive a
                    limited, non-exclusive, non-transferable license to use the
                    platform as intended.
                </p>
                <h4>7) Limitation of Liability</h4>
                <p>
                    To the fullest extent permitted by law, Raymoch is not
                    liable for indirect, incidental, special, consequential, or
                    exemplary damages. Your exclusive remedy is to stop using
                    the service.
                </p>
                <h4>8) Governing Law</h4>
                <p>
                    These Terms are governed by the laws of California, USA,
                    without regard to conflict-of-law rules.
                </p>
            </Modal>

            {/* ======= Privacy Modal ======= */}
            <Modal
                title="Privacy Policy"
                open={showPrivacy}
                onClose={() => setShowPrivacy(false)}
            >
                <p>
                    <strong>Effective:</strong> January 1, 2025
                </p>
                <h4>1) Data We Collect</h4>
                <ul>
                    <li>
                        Account data: name, email, display name, company;
                        password stored using strong hashing.
                    </li>
                    <li>
                        Usage & device data (e.g., browser type, IP, timestamps)
                        to improve reliability and security.
                    </li>
                    <li>
                        Payment data is processed by our provider; we do not
                        store full card numbers.
                    </li>
                </ul>
                <h4>2) How We Use Data</h4>
                <ul>
                    <li>
                        Create and maintain your account, authenticate access,
                        and deliver features.
                    </li>
                    <li>
                        Send transactional notices (verifications, receipts,
                        security alerts).
                    </li>
                    <li>
                        Monitor platform health, prevent abuse, and comply with
                        legal obligations.
                    </li>
                </ul>
                <h4>3) Sharing</h4>
                <p>
                    We don’t sell or rent personal data. We share with service
                    providers (cloud hosting, email delivery, payments) under
                    contractual safeguards and only as needed to provide the
                    service.
                </p>
                <h4>4) Security & Retention</h4>
                <p>
                    We apply technical and organizational controls, store
                    passwords using strong hashing, and retain data only as long
                    as necessary for the stated purposes or legal requirements.
                </p>
                <h4>5) Your Rights</h4>
                <ul>
                    <li>
                        Access, correct, export, or delete your personal data
                        (subject to applicable law).
                    </li>
                    <li>
                        Contact:{" "}
                        <a href="mailto:support@raymoch.com">
                            support@raymoch.com
                        </a>
                    </li>
                </ul>
            </Modal>
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

/* ================== INLINE CSS (page styles) ================== */
const css = `

:root{
  --brand-blue:#0328aeed;
  --brand-blue-700:#213bb1;
  --brand-blue-500:#041b64;
  --ink:#101114;
  --bg:#fafafa;
  --border:#e8e8ee;
  --card:#fff;
  --shadow:0 4px 16px rgba(10,42,107,.06);
  --footer-bg:#0b1020;
  --radius:16px;
}

html, body { height:100%; }
*{
  box-sizing:border-box;
  margin:0;
  padding:0;
  font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
}

.page{
  min-height:100dvh;
  background:var(--bg);
  color:var(--ink);
}

/* Header (same classes as Header.jsx) */
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

/* Main: center card & keep space for fixed footer */
.page > main{
  min-height: calc(100dvh - 80px); /* header is 80px */
  display:flex;
  align-items:center;
  justify-content:center;
  padding:24px;
  padding-bottom: 92px; /* reserve space so footer doesn't cover content */
}

/* Card */
.card{
  background:var(--card);
  border:1px solid var(--border);
  box-shadow:var(--shadow);
  border-radius:var(--radius);
  padding:32px 36px;
  width:100%;
  max-width:820px;
  transition: box-shadow .2s ease, border-color .2s ease;
}
.card:hover{
  border-color:#d9e1ff !important;
  box-shadow:0 10px 28px rgba(10,42,107,.10) !important;
}
.card:focus-within{
  background: var(--card) !important;
  outline:none !important;
}

.cardHeader{
  display:flex;
  align-items:center;
  justify-content:space-between;
  margin-bottom:16px;
}
.cardHeader h1{
  font-size:1.9rem;
  font-weight:900;
  color:#063122;
}
.backBtn{
  background:transparent;
  border:1px solid #d9e1ff;
  color:#041b64;
  font-weight:700;
  border-radius:10px;
  padding:8px 14px;
  cursor:pointer;
  transition:background .25s ease, border-color .25s ease;
}
.backBtn:hover{ background:#eef3ff; border-color:#c9d4ff; }

/* Form */
.row{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:16px;
  margin-top:6px;
}
@media (max-width:720px){ .row{ grid-template-columns:1fr; } }

label{
  font-weight:700;
  font-size:.95rem;
  display:block;
  margin-top:4px;
}
.input{
  width:100%;
  padding:14px 16px;
  border:1px solid #063122;
  border-radius:10px;
  margin:8px 0 16px;
  font-size:15px;
  background:#fff;
}
.input:focus{
  outline:none;
  box-shadow:0 0 0 3px rgba(3,40,174,.25);
}

/* Consent */
.consent{ display:flex; gap:10px; margin:10px 0 16px; }
.consent input{ width:18px; height:18px; margin-top:3px; }

/* Actions */
.actions{ display:flex; gap:12px; align-items:center; margin-top:6px; }
button.cta{
  padding:14px 18px;
  border:0;
  border-radius:12px;
  background:linear-gradient(135deg,var(--brand-blue-700),var(--brand-blue-500));
  color:#fff;
  font-weight:800;
  font-size:15px;
  cursor:pointer;
}
button.cta[disabled]{ opacity:.7; cursor:not-allowed; }
button.cta.ghost{ background:#f5f8ff; color:#041b64; border:1px solid #d9e1ff; }

.muted{ color:#475569; margin-bottom:12px; }

/* OTP */
.otpWrap{ margin-top:6px; }
.otpTitle{ font-size:1.25rem; font-weight:900; color:#063122; margin-bottom:6px; }
.otpInputs{ display:flex; gap:10px; justify-content:center; margin:14px 0 10px; }
.otpBox{
  width:46px;
  height:52px;
  text-align:center;
  font-weight:900;
  font-size:20px;
  border:1px solid #cbd5e1;
  border-radius:10px;
  background:#fff;
}
.otpBox:focus{ outline:none; box-shadow:0 0 0 3px rgba(3,40,174,.25); }
.otpMeta{ display:flex; align-items:center; justify-content:space-between; gap:12px; }
.timer{ font-weight:800; }

@media (max-width:600px){
  .otpMeta{ flex-direction:column; }
}

/* Password reveal buttons */
.inputWrap{ position:relative; }
.revealBtn{
  position:absolute;
  right:10px;
  top:50%;
  transform:translateY(-50%);
  border:0;
  background:transparent;
  cursor:pointer;
  padding:4px;
  border-radius:8px;
}
.revealBtn:hover{ background:#eef2ff; }

  /* Footer */
.ft{
  margin-top: auto;
  background: var(--footer-bg);
  color:#cbd5e1;
  font-size:.9rem;
  padding:12px 24px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  border-top:1px solid #1f2937;
  flex-shrink:0;
}

.ft a{ color:#cbd5e1; margin-left:14px; text-decoration:none; }
.ft a:hover{ text-decoration:underline; }

@media (max-width:600px){
  .ft{ flex-direction:column; text-align:center; gap:6px; }
}
`;

/* ================== INLINE CSS (modal styles) ================== */
const modalCss = `
.modalOverlay{
  position:fixed;
  inset:0;
  background:rgba(15,23,42,.55);
  display:flex;
  align-items:center;
  justify-content:center;
  z-index:9999;
}
.modalCard{
  width:min(860px, calc(100% - 28px));
  background:#fff;
  border-radius:16px;
  border:1px solid #e8e8ee;
  box-shadow:0 18px 40px rgba(2,6,23,.22);
  overflow:hidden;
  display:flex;
  flex-direction:column;
  max-height:86vh;
}
.modalHead{
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:14px 16px;
  border-bottom:1px solid #eef0f6;
  background:#f9fafb;
}
.modalHead h3{
  margin:0;
  font-size:1.05rem;
  font-weight:800;
  color:#041b64;
}
.modalClose{
  background:transparent;
  border:0;
  font-size:22px;
  line-height:1;
  cursor:pointer;
  color:#0f172a;
  border-radius:10px;
  padding:4px 8px;
}
.modalClose:hover{ background:#eef2ff; }
.modalBody{
  padding:18px;
  overflow:auto;
  color:#0f172a;
  line-height:1.55;
}
.modalBody h4{ margin:16px 0 8px; font-size:1.02rem; color:#041b64; }
.modalBody p{ margin:6px 0 10px; color:#334155; }
.modalBody ul{ padding-left:18px; margin:6px 0 12px; }
.modalBody li{ margin:6px 0; color:#334155; }
.modalFoot{
  padding:12px 16px;
  border-top:1px solid #eef0f6;
  display:flex;
  justify-content:flex-end;
  gap:10px;
  background:#fff;
}
.modalFoot .cta.subtle{
  background:#f5f8ff;
  color:#041b64;
  border:1px solid #d9e1ff;
  border-radius:10px;
  padding:10px 14px;
  font-weight:700;
  cursor:pointer;
}
  /* ===== Card hover control (override any global hover styles) ===== */

/* 1) Disable any "blue overlay / transform" hover coming from other CSS */
.card:hover{
  background: var(--card) !important;
  color: inherit !important;
  transform: none !important;
  filter: none !important;
  outline: none !important;
}

/* If some CSS is using focus-within to highlight the whole card */
.card:focus-within{
  background: var(--card) !important;
  outline: none !important;
}

/* 2) Optional: make hover subtle (ONLY border + shadow, not blue fill) */
.card{
  transition: box-shadow .2s ease, border-color .2s ease;
}

.card:hover{
  border-color: #d9e1ff !important;
  box-shadow: 0 10px 28px rgba(10,42,107,.10) !important;
}

  /* Footer */
.ft{
  margin-top: auto;
  background: var(--footer-bg);
  color:#cbd5e1;
  font-size:.9rem;
  padding:12px 24px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  border-top:1px solid #1f2937;
  flex-shrink:0;
}

.ft a{ color:#cbd5e1; margin-left:14px; text-decoration:none; }
.ft a:hover{ text-decoration:underline; }

@media (max-width:600px){
  .ft{ flex-direction:column; text-align:center; gap:6px; }
}

`;
