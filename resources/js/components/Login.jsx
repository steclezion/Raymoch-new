// resources/js/components/Login.jsx

import React, { useEffect, useRef, useState } from "react";
import { Toaster, toast } from "sonner";
import "../styles/Login.css";

export default function Login({
  apiUrl,
  mfaApiUrl,
  csrfToken,
  redirectTo,
  sessionLifetimeMinutes = 10080,
  brandName = "Raymoch",
  signupHref = "/signup",
  resetHref = "/forgot-password",
  privacyHref = "/privacy",
  termsHref = "/terms",
  cookiesHref = "/cookies",
}) {
  const [showPass, setShowPass] = useState(false);
  const [values, setValues] = useState({ user: "", pass: "" });
  const [remember, setRemember] = useState(false);
  const [secureSignIn, setSecureSignIn] = useState(false);
  const [mfaStep, setMfaStep] = useState(false);
  const [mfaKey, setMfaKey] = useState("");
  const [challenge, setChallenge] = useState("");
  const [errors, setErrors] = useState({ user: "", pass: "" });
  const [busy, setBusy] = useState(false);

  const redirectingRef = useRef(false);
  const submittingRef = useRef(false);
  const pageOpenedAtRef = useRef(Date.now());

  /*
   * When the user returns to a login tab that has been open longer
   * than the Laravel session lifetime, reload it to obtain a fresh
   * session and CSRF token.
   */
  useEffect(() => {
    const maxAgeMs = sessionLifetimeMinutes * 60 * 1000;

    const refreshIfStale = () => {
      const pageIsStale =
        Date.now() - pageOpenedAtRef.current >= maxAgeMs;

      if (
        document.visibilityState === "visible" &&
        pageIsStale &&
        !submittingRef.current &&
        !redirectingRef.current
      ) {
        window.location.reload();
      }
    };

    document.addEventListener("visibilitychange", refreshIfStale);
    window.addEventListener("pageshow", refreshIfStale);

    return () => {
      document.removeEventListener(
        "visibilitychange",
        refreshIfStale
      );
      window.removeEventListener("pageshow", refreshIfStale);
    };
  }, [sessionLifetimeMinutes]);

  const isEmail = (value) => /\S+@\S+\.\S+/.test(value);

  const isPhone = (value) =>
    /^\+?[0-9\s\-().]{7,}$/.test(value);

  const getCsrf = () =>
    csrfToken ??
    window.LOGIN_BOOT?.csrf ??
    document
      .querySelector('meta[name="csrf-token"]')
      ?.getAttribute("content") ??
    "";

  const getApiUrl = () =>
    apiUrl ??
    window.LOGIN_BOOT?.apiLogin ??
    "/login/json";

  const getMfaApiUrl = () =>
    mfaApiUrl ??
    window.LOGIN_BOOT?.apiMfa ??
    "/login/mfa";

  const getRedirect = (json) =>
    json?.redirect ||
    redirectTo ||
    window.LOGIN_BOOT?.redirectTo ||
    "/dashboard";

  const set = (key) => (event) => {
    const value = event.target.value;

    setValues((current) => ({
      ...current,
      [key]: value,
    }));

    setErrors((current) => ({
      ...current,
      [key]: "",
    }));
  };

  const validate = () => {
    const user = values.user.trim();
    const password = values.pass;

    const nextErrors = {
      user: "",
      pass: "",
    };

    if (!user) {
      nextErrors.user = "Email or phone is required.";
    } else if (!(isEmail(user) || isPhone(user))) {
      nextErrors.user =
        "Enter a valid email or phone number.";
    }

    if (!password) {
      nextErrors.pass = "Password is required.";
    } else if (password.length < 6) {
      nextErrors.pass =
        "Password must be at least 6 characters.";
    }

    setErrors(nextErrors);

    if (nextErrors.user || nextErrors.pass) {
      toast.error(nextErrors.user || nextErrors.pass);
      return false;
    }

    return true;
  };

  const setWrongCredentials = () => {
    setErrors({
      user: "Wrong email or phone.",
      pass: "Wrong email or password.",
    });

    toast.error("Wrong email or password.");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (busy || submittingRef.current) {
      return;
    }

    if (!mfaStep && !validate()) {
      return;
    }

    if (mfaStep && !/^\d{6}$/.test(mfaKey)) {
      toast.error("Enter the six-digit authentication key.");
      return;
    }

    setBusy(true);
    submittingRef.current = true;

    const url = mfaStep ? getMfaApiUrl() : getApiUrl();
    const token = getCsrf();

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": token,
        },
        body: JSON.stringify(mfaStep ? {
          challenge,
          mfa_key: mfaKey,
        } : {
          user: values.user.trim(),
          password: values.pass,
          remember,
          secure_sign_in: secureSignIn,
        }),
        credentials: "same-origin",
      });

      const json = await response.json().catch(() => ({}));

      if (response.status === 202 && json.requires_mfa && json.challenge) {
        setChallenge(json.challenge);
        setMfaStep(true);
        toast.success(json.message || "Authentication key sent.");
        return;
      }

      if (response.ok && json.ok) {
        sessionStorage.removeItem("login-csrf-refresh");

        redirectingRef.current = true;

        toast.success("Login successful! Redirecting…");

        /*
         * Replace the login page in browser history and redirect
         * immediately. This avoids delayed refresh/redirect races.
         */
        window.location.replace(getRedirect(json));
        return;
      }

      if (response.status === 419) {
        const retryKey = "login-csrf-refresh";

        /*
         * Automatically reload once to obtain a fresh CSRF token.
         * The sessionStorage flag prevents an endless refresh loop.
         */
        if (!sessionStorage.getItem(retryKey)) {
          sessionStorage.setItem(retryKey, "1");
          window.location.reload();
          return;
        }

        sessionStorage.removeItem(retryKey);
        toast.error("Please submit the form again.");
        return;
      }

      // A non-419 response confirms that the current CSRF token works.
      sessionStorage.removeItem("login-csrf-refresh");

      if (mfaStep && response.status === 422) {
        toast.error(json?.message || "The authentication key is invalid or expired.");
        return;
      }

      if (
        response.status === 401 ||
        response.status === 422
      ) {
        setWrongCredentials();
        return;
      }

      if (response.status === 429) {
        toast.error(
          json?.message ||
            "Too many attempts. Please try again later."
        );
        return;
      }

      toast.error(
        json?.message ||
          "Invalid credentials or server error."
      );
    } catch {
      toast.error(
        "Network error. Please try again later."
      );
    } finally {
      submittingRef.current = false;

      if (!redirectingRef.current) {
        setBusy(false);
      }
    }
  };

  return (
    <>
      <Toaster
        position="top-right"
        duration={3000}
        richColors
        closeButton
      />

      <div className="page">
        <main className="main">
          <section
            className="card"
            aria-label="Login card"
          >
            <header className="head">
              <h1 className="title">Log In</h1>

              <p className="sub">
                {mfaStep ? "Enter the current code from your authenticator app." : "Welcome back. Please enter your credentials."}
              </p>
            </header>

            <form
              id="login-form"
              noValidate
              onSubmit={handleSubmit}
            >
              {!mfaStep ? <div className="field">
                <label
                  className="label"
                  htmlFor="login-user"
                >
                  Email or phone
                </label>

                <input
                  id="login-user"
                  className={`input ${
                    errors.user ? "inputError" : ""
                  }`}
                  type="text"
                  placeholder="name@email.com or +1 555 555 5555"
                  value={values.user}
                  onChange={set("user")}
                  autoComplete="username"
                  required
                  aria-invalid={Boolean(errors.user)}
                  aria-describedby={
                    errors.user
                      ? "login-user-error"
                      : undefined
                  }
                />

                {errors.user ? (
                  <div
                    id="login-user-error"
                    className="errorText"
                    role="alert"
                  >
                    {errors.user}
                  </div>
                ) : null}
              </div> : null}

              {!mfaStep ? <div className="field">
                <label
                  className="label"
                  htmlFor="login-pass"
                >
                  Password
                </label>

                <div className="passWrap">
                  <input
                    id="login-pass"
                    className={`input inputPass ${
                      errors.pass ? "inputError" : ""
                    }`}
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={values.pass}
                    onChange={set("pass")}
                    autoComplete="current-password"
                    required
                    aria-invalid={Boolean(errors.pass)}
                    aria-describedby={
                      errors.pass
                        ? "login-pass-error"
                        : undefined
                    }
                  />

                  <button
                    type="button"
                    className="toggle"
                    onClick={() =>
                      setShowPass((current) => !current)
                    }
                    aria-label={
                      showPass
                        ? "Hide password"
                        : "Show password"
                    }
                    title={
                      showPass
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPass ? "🙈" : "👁️"}
                  </button>
                </div>

                {errors.pass ? (
                  <div
                    id="login-pass-error"
                    className="errorText"
                    role="alert"
                  >
                    {errors.pass}
                  </div>
                ) : null}
              </div> : null}

              {!mfaStep ? <div className="secureSignInOption">
                <label>
                  <input type="checkbox" checked={secureSignIn} onChange={(event) => setSecureSignIn(event.target.checked)} />
                  <span><strong>Secure sign in</strong><small>Use a six-digit code from Microsoft or Google Authenticator.</small></span>
                </label>
                <span className="authenticatorSetupLink">First time? Sign in normally, then open User Profile → Authenticator Security.</span>
              </div> : null}

              {mfaStep ? <div className="field mfaField">
                <label className="label" htmlFor="login-mfa-key">Multifactor authentication key</label>
                <input
                  id="login-mfa-key"
                  className="input mfaInput"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  value={mfaKey}
                  onChange={(event) => setMfaKey(event.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000"
                  autoFocus
                  required
                />
                <p className="mfaHelp">Codes rotate every 30 seconds. Use the current code shown in your authenticator app.</p>
              </div> : null}

              {!mfaStep ? <div className="loginOptions">
                <label className="rememberOption">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(event) => setRemember(event.target.checked)}
                  />
                  <span>Keep me signed in</span>
                </label>
                <a href={resetHref}>
                  Forgot password?
                </a>
              </div> : null}

              <button
                type="submit"
                className="cta"
                disabled={busy}
                aria-disabled={busy}
              >
                {busy ? (
                  <span
                    className="spinner"
                    aria-hidden="true"
                  />
                ) : (
                  mfaStep ? "Verify and sign in" : "Log In"
                )}
              </button>

              {mfaStep ? <button type="button" className="backToLogin" onClick={() => { setMfaStep(false); setMfaKey(""); setChallenge(""); }}>Back to login</button> : null}

              <div className="hint">
                Don’t have an account?{" "}
                <a href={signupHref}>Sign Up</a>
              </div>
            </form>
          </section>
        </main>

        <footer className="footer">
          <div>
            © 2026 {brandName}. All rights reserved.
          </div>

          <div className="footerLinks">
            <a href={privacyHref}>Privacy</a>
            <a href={termsHref}>Terms</a>
            <a href={cookiesHref}>Cookies</a>
          </div>
        </footer>
      </div>
    </>
  );
}
