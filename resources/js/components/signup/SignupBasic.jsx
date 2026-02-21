// resources/js/pages/SignupBasic.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Toaster, toast } from "sonner";
import Select from "react-select";

import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import "./css/SignupBasic.css";

/* ================== Reusable Modal component ================== */
function Modal({ title, open, onClose, children }) {
    useEffect(() => {
        const onEsc = (e) => e.key === "Escape" && onClose?.();
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
                    <button className="btn btnSubtle" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ================== helpers ================== */
const digitsOnly = (s) => (s || "").replace(/\D/g, "");
const normalizeDial = (dial) => {
    const d = String(dial ?? "").trim();
    if (!d) return "";
    const only = digitsOnly(d);
    return only ? `+${only}` : "";
};

// ✅ phone validation helpers
const normalizePhoneDigits = (raw) => digitsOnly(raw || "");
const isValidPhone = (digits) => digits.length >= 7 && digits.length <= 15; // E.164 typical range

export default function SignupBasic({ routes }) {
    const R =
        routes || (typeof window !== "undefined" ? window.ROUTES : {}) || {};

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

    const [showPass, setShowPass] = useState(false);
    const [showPass2, setShowPass2] = useState(false);

    // OTP state
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const otpRefs = useRef(Array.from({ length: 6 }, () => React.createRef()));
    const [expiresAt, setExpiresAt] = useState(null);
    const [countdown, setCountdown] = useState(300);

    // Country codes
    const [ccLoading, setCcLoading] = useState(true);
    const [ccOptions, setCcOptions] = useState([]); // { name, dial }
    const [countryCode, setCountryCode] = useState("+1");

    useEffect(() => {
        let alive = true;

        async function loadCodes() {
            setCcLoading(true);
            try {
                const url = R.country_codes_api || "/api/country-codes";
                const res = await fetch(url, {
                    headers: { Accept: "application/json" },
                    credentials: "same-origin",
                });

                const json = await res.json().catch(() => ({}));
                if (!alive) return;

                if (!res.ok || !json.ok || !Array.isArray(json.data)) {
                    toast.error(
                        json?.message || "Unable to load country codes.",
                    );
                    setCcOptions([]);
                    return;
                }

                const mapped = json.data
                    .map((r) => {
                        const name = String(r?.name ?? "").trim();
                        const dial = normalizeDial(r?.dial);
                        if (!name || !dial) return null;
                        return { name, dial };
                    })
                    .filter(Boolean);

                mapped.sort((a, b) => {
                    const na = parseInt(a.dial.slice(1), 10) || 0;
                    const nb = parseInt(b.dial.slice(1), 10) || 0;
                    if (na !== nb) return na - nb;
                    return a.name.localeCompare(b.name);
                });

                setCcOptions(mapped);
                const pick = mapped.find((o) => o.dial === "+1") || mapped[0];
                if (pick?.dial) setCountryCode(pick.dial);
            } catch {
                if (!alive) return;
                setCcOptions([]);
                toast.error("Network error while loading country codes.");
            } finally {
                if (alive) setCcLoading(false);
            }
        }

        loadCodes();
        return () => {
            alive = false;
        };
    }, [R.country_codes_api]);

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
                    setTimeout(() => window.location.reload(), 900);
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
        /^(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]).{9,}$/.test(
            s,
        );

    const validate = () => {
        if (!values.name.trim())
            return (toast.error("Please enter your full name."), false);

        if (!values.email.trim() || !/\S+@\S+\.\S+/.test(values.email.trim()))
            return (toast.error("Please enter a valid email."), false);

        if (!values.display_name.trim())
            return (toast.error("Please enter a display name."), false);

        if (!values.password || !strongPass(values.password))
            return (
                toast.error(
                    "Password must be ≥9 chars and include 1 uppercase, 1 number, and 1 special character.",
                ),
                false
            );

        if (values.password !== values.confirm_password)
            return (toast.error("Passwords do not match."), false);

        // ✅ better phone validation
        const phoneDigits = normalizePhoneDigits(values.phone);
        if (!phoneDigits)
            return (toast.error("Please enter your phone number."), false);
        if (!isValidPhone(phoneDigits))
            return (
                toast.error(
                    "Please enter a valid phone number (7 to 15 digits).",
                ),
                false
            );

        if (!values.company_name.trim())
            return (
                toast.error(
                    "Please enter your company name (type N/A if none).",
                ),
                false
            );

        if (!values.consent) {
            toast.error("Please accept the Terms & Privacy to continue.");
            consentRef.current?.focus();
            consentRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
            return false;
        }

        return true;
    };

    const sendOtp = async (e) => {
        e.preventDefault();
        if (busy) return;
        if (!validate()) return;

        setBusy(true);
        try {
            const csrf =
                document
                    .querySelector('meta[name="csrf-token"]')
                    ?.getAttribute("content") ||
                R.csrf ||
                "";

            const formattedPhone = `${countryCode}${digitsOnly(values.phone)}`;

            const res = await fetch(
                R.signup?.basic?.send_otp ?? "/signup/basic/send-otp",
                {
                    method: "POST",
                    headers: {
                        "X-CSRF-TOKEN": csrf,
                        "X-Requested-With": "XMLHttpRequest",
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
                },
            );

            const json = await res.json().catch(() => ({}));

            if (res.ok && json.ok) {
                toast.success("Verification code sent to your email.");
                const ts = json.expires
                    ? Math.floor(new Date(json.expires).getTime() / 1000)
                    : Math.floor(Date.now() / 1000) + 300;

                setExpiresAt(ts);
                setCountdown(ts - Math.floor(Date.now() / 1000));
                setStep("otp");
                setTimeout(() => otpRefs.current[0]?.current?.focus(), 60);
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

    const verifyOtp = async (code) => {
        if (!code || code.length !== 6)
            return (toast.error("Enter the 6-digit code."), null);

        setBusy(true);
        try {
            const csrf =
                document
                    .querySelector('meta[name="csrf-token"]')
                    ?.getAttribute("content") ||
                R.csrf ||
                "";

            const res = await fetch(
                R.signup?.basic?.verify_otp ?? "/signup/basic/verify-otp",
                {
                    method: "POST",
                           headers: {
                        "X-CSRF-TOKEN": csrf,
                        "X-Requested-With": "XMLHttpRequest",
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ code, email: values.email.trim() }),
                    credentials: "same-origin",
                },
            );

            const json = await res.json().catch(() => ({}));
            if (res.ok && json.ok) {
                toast.success("Verified! Redirecting…");
                setTimeout(
                    () => window.location.assign(json.redirect || "/dashboard"),
                    700,
                );
            } else {
                toast.error(json?.message || "Invalid code.");
            }
        } catch {
            toast.error("Network error.");
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

        if (val && i < 5) otpRefs.current[i + 1]?.current?.focus();
        if (i === 5 && val && next.join("").length === 6)
            verifyOtp(next.join(""));
    };

    const onOtpKeyDown = (i) => (e) => {
        if (e.key === "Backspace" && !otp[i] && i > 0)
            otpRefs.current[i - 1]?.current?.focus();
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
        setTimeout(() => otpRefs.current[idx]?.current?.focus(), 10);

        if (arr.join("").length === 6) verifyOtp(arr.join(""));
    };

    const mm = String(Math.floor(countdown / 60)).padStart(2, "0");
    const ss = String(countdown % 60).padStart(2, "0");

    const selectedCC = useMemo(() => {
        return (
            ccOptions.find((o) => o.dial === countryCode) ||
            ccOptions.find((o) => o.dial === "+1") ||
            ccOptions[0] ||
            null
        );
    }, [ccOptions, countryCode]);

    const getOptionLabel = (o) => `${o.name} (${o.dial})`;
    const getOptionValue = (o) => o.dial;

    const selectStyles = useMemo(
        () => ({
            control: (base, state) => ({
                ...base,
                minHeight: 48,
                height: 48,
                borderRadius: 10,
                borderColor: state.isFocused
                    ? "rgba(3,40,174,.55)"
                    : "rgba(6,49,34,.35)",
                boxShadow: state.isFocused
                    ? "0 0 0 4px rgba(3,40,174,.15)"
                    : "none",
                backgroundColor: "#fff",
                cursor: "pointer",
            }),
            valueContainer: (base) => ({ ...base, padding: "0 12px" }),
            input: (base) => ({ ...base, margin: 0, padding: 0 }),
            singleValue: (base) => ({
                ...base,
                fontWeight: 700,
                color: "#0f172a",
            }),
            placeholder: (base) => ({
                ...base,
                color: "#64748b",
                fontWeight: 700,
            }),
            indicatorsContainer: (base) => ({ ...base, height: 48 }),
            menu: (base) => ({
                ...base,
                zIndex: 50,
                borderRadius: 12,
                overflow: "hidden",
            }),
            option: (base, state) => ({
                ...base,
                padding: "10px 12px",
                fontWeight: 700,
                backgroundColor: state.isSelected
                    ? "#eef2ff"
                    : state.isFocused
                      ? "#f1f5ff"
                      : "#fff",
                color: "#0f172a",
            }),
        }),
        [],
    );

    return (
        <>
            <Header routes={R} />
            <Toaster
                position="top-right"
                richColors
                closeButton
                expand={false}
                toastOptions={{ duration: 3500 }}
            />

            <div className="page sb-page">
                <main>
                    <section className="card">
                        <div className="cardHeader">
                            <div>
                                <h1>Individual Account</h1>
                                <p className="cardSub">
                                    Create a basic account and verify your email
                                    in seconds.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="btn btnGhost"
                                onClick={() => window.history.back()}
                            >
                                Back
                            </button>
                        </div>

                        {step === "form" && (
                            <form
                                noValidate
                                onSubmit={sendOtp}
                                className="sbForm"
                                autoComplete="on"
                            >
                                {/* ✅ ONE consistent grid */}
                                <div className="grid2">
                                    <div className="field">
                                        <label htmlFor="b-name">
                                            Full name
                                        </label>
                                        <input
                                            id="b-name"
                                            className="input"
                                            type="text"
                                            name="name"
                                            autoComplete="name"
                                            placeholder="Your full name"
                                            value={values.name}
                                            onChange={set("name")}
                                            required
                                        />
                                    </div>

                                    <div className="field">
                                        <label htmlFor="b-email">Email</label>
                                        <input
                                            id="b-email"
                                            className="input"
                                            type="email"
                                            name="email"
                                            autoComplete="email"
                                            placeholder="name@example.com"
                                            value={values.email}
                                            onChange={set("email")}
                                            required
                                        />
                                    </div>

                                    <div className="field">
                                        <label htmlFor="b-pass">Password</label>
                                        <div className="inputWrap">
                                            <input
                                                id="b-pass"
                                                className="input"
                                                type={
                                                    showPass
                                                        ? "text"
                                                        : "password"
                                                }
                                                name="password"
                                                autoComplete="new-password"
                                                placeholder="Choose a strong password"
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
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                    />
                                                    <circle
                                                        cx="12"
                                                        cy="12"
                                                        r="3"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="field">
                                        <label htmlFor="b-pass2">
                                            Confirm password
                                        </label>
                                        <div className="inputWrap">
                                            <input
                                                id="b-pass2"
                                                className="input"
                                                type={
                                                    showPass2
                                                        ? "text"
                                                        : "password"
                                                }
                                                name="password_confirmation"
                                                autoComplete="new-password"
                                                placeholder="Re-enter your password"
                                                value={values.confirm_password}
                                                onChange={set(
                                                    "confirm_password",
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
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                    />
                                                    <circle
                                                        cx="12"
                                                        cy="12"
                                                        r="3"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="field">
                                        <label htmlFor="b-username">
                                            Display name
                                        </label>
                                        <input
                                            id="b-username"
                                            className="input"
                                            type="text"
                                            name="nickname"
                                            autoComplete="nickname"
                                            placeholder="@handle"
                                            value={values.display_name}
                                            onChange={set("display_name")}
                                            required
                                        />
                                    </div>

                                    <div className="field">
                                        <label htmlFor="b-phone">
                                            Phone number
                                        </label>

                                        {/* ✅ phone layout matches CSS class names */}
                                        <div className="phoneRow">
                                            <div className="phoneDial">
                                                <Select
                                                    classNamePrefix="rs"
                                                    options={ccOptions}
                                                    value={selectedCC}
                                                    isLoading={ccLoading}
                                                    isDisabled={
                                                        ccLoading ||
                                                        ccOptions.length === 0
                                                    }
                                                    onChange={(opt) =>
                                                        setCountryCode(
                                                            opt?.dial ||
                                                                countryCode,
                                                        )
                                                    }
                                                    getOptionValue={
                                                        getOptionValue
                                                    }
                                                    getOptionLabel={
                                                        getOptionLabel
                                                    }
                                                    isSearchable
                                                    menuPlacement="auto"
                                                    placeholder={
                                                        ccLoading
                                                            ? "Loading…"
                                                            : "Code"
                                                    }
                                                    noOptionsMessage={() =>
                                                        "No codes found"
                                                    }
                                                    styles={selectStyles}
                                                    aria-label="Country telephone code"
                                                />
                                            </div>

                                            <div className="phoneNum">
                                                <input
                                                    id="b-phone"
                                                    className="input"
                                                    inputMode="numeric"
                                                    autoComplete="tel"
                                                    name="phone"
                                                    type="text"
                                                    placeholder="555 555 5555"
                                                    value={values.phone}
                                                    onChange={set("phone")}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* ✅ make company full-width */}
                                    <div className="field span2">
                                        <label htmlFor="b-company">
                                            Company name
                                        </label>
                                        <input
                                            id="b-company"
                                            className="input"
                                            type="text"
                                            name="organization"
                                            autoComplete="organization"
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
                                            basic account. You can upgrade
                                            anytime.
                                        </small>
                                    </label>
                                </div>

                                <div className="actions">
                                    <button
                                        type="submit"
                                        className="btn btnPrimary cta"
                                        disabled={busy}
                                        aria-disabled={busy}
                                    >
                                        {busy
                                            ? "Sending Code…"
                                            : "Create Basic Account"}
                                    </button>

                                    <div className="subtle">
                                        Wrong Turn?{" "}
                                        <a href={R.signup?.index ?? "/signup"}>
                                            Choose another role
                                        </a>
                                    </div>
                                </div>
                            </form>
                        )}

                        {step === "otp" && (
                            <div className="otpWrap">
                                <h2 className="otpTitle">Email Verification</h2>
                                <p className="muted">
                                    We’ve sent a 6-digit code to{" "}
                                    <strong>{values.email}</strong>. Enter it
                                    below.
                                </p>

                                <div className="otpInputs" onPaste={onOtpPaste}>
                                    {otp.map((d, i) => (
                                        <input
                                            key={i}
                                            ref={otpRefs.current[i]}
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
                                        className="btn btnSoft"
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

                <Footer routes={routes} />
            </div>

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
                    use the platform.
                </p>
            </Modal>

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
                </ul>
            </Modal>
        </>
    );
}
