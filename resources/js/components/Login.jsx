// resources/js/components/Login.jsx
import React, { useState } from "react";
import { Toaster, toast } from "sonner";
import "../styles/Login.css";


export default function Login({
  apiUrl,
  csrfToken,
  redirectTo,
  brandName = "Raymoch",
  signupHref = "/signup",
  resetHref = "/forgot-password",
  privacyHref = "/privacy",
  termsHref = "/terms",
  cookiesHref = "/cookies",
}) {
  const [showPass, setShowPass] = useState(false);
  const [values, setValues] = useState({ user: "", pass: "" });
  const [errors, setErrors] = useState({ user: "", pass: "" });
  const [busy, setBusy] = useState(false);

  const isEmail = (v) => /\S+@\S+\.\S+/.test(v);
  const isPhone = (v) => /^\+?[0-9\s\-().]{7,}$/.test(v);

  const getCsrf = () =>
    csrfToken ??
    window.LOGIN_BOOT?.csrf ??
    document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") ??
    "";

  const getApiUrl = () => apiUrl ?? window.LOGIN_BOOT?.apiLogin ?? "/login/json";

  const getRedirect = (j) =>
    j?.redirect || redirectTo || window.LOGIN_BOOT?.redirectTo || "/dashboard";

  const set = (k) => (e) => {
    const val = e.target.value;
    setValues((s) => ({ ...s, [k]: val }));
    setErrors((s) => ({ ...s, [k]: "" }));
  };

  const validate = () => {
    const u = values.user.trim();
    const p = values.pass;

    const next = { user: "", pass: "" };

    if (!u) next.user = "Email or phone is required.";
    else if (!(isEmail(u) || isPhone(u))) next.user = "Enter a valid email or phone number.";

    if (!p) next.pass = "Password is required.";
    else if (p.length < 6) next.pass = "Password must be at least 6 characters.";

    setErrors(next);

    if (next.user || next.pass) {
      toast.error(next.user || next.pass);
      return false;
    }

    return true;
  };

  const setWrongCreds = () => {
    setErrors({
      user: "Wrong email or phone.",
      pass: "Wrong email or password.",
    });
    toast.error("Wrong email or password.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (busy) return;
    if (!validate()) return;

    setBusy(true);

    const url = getApiUrl();
    const token = getCsrf();

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": token,
        },
        body: JSON.stringify({
          user: values.user.trim(),
          password: values.pass,
        }),
        credentials: "same-origin",
      });

      const json = await res.json().catch(() => ({}));

      if (res.ok && json.ok) {
        toast.success("Login successful! Redirecting…");
        setTimeout(() => window.location.assign(getRedirect(json)), 600);
        return;
      }

      if (res.status === 401 || res.status === 422) {
        setWrongCreds();
      } else if (res.status === 419) {
        toast.error("Session expired. Refresh the page and try again.");
      } else {
        toast.error(json?.message || "Invalid credentials or server error.");
      }
    } catch {
      toast.error("Network error. Please try again later.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" duration={3000} richColors closeButton />
      <div className="page">
        <main className="main">
          <section className="card" aria-label="Login card">
            <header className="head">
              <h1 className="title">Log In</h1>
              <p className="sub">Welcome back. Please enter your credentials.</p>
            </header>

            <form id="login-form" noValidate onSubmit={handleSubmit}>
              <div className="field">
                <label className="label" htmlFor="login-user">
                  Email or phone
                </label>
                <input
                  id="login-user"
                  className={`input ${errors.user ? "inputError" : ""}`}
                  type="text"
                  placeholder="name@email.com or +1 555 555 5555"
                  value={values.user}
                  onChange={set("user")}
                  autoComplete="username"
                  required
                  aria-invalid={!!errors.user}
                />
                {errors.user ? (
                  <div className="errorText" role="alert">
                    {errors.user}
                  </div>
                ) : null}
              </div>

              <div className="field">
                <label className="label" htmlFor="login-pass">
                  Password
                </label>
                <div className="passWrap">
                  <input
                    id="login-pass"
                    className={`input inputPass ${errors.pass ? "inputError" : ""}`}
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={values.pass}
                    onChange={set("pass")}
                    autoComplete="current-password"
                    required
                    aria-invalid={!!errors.pass}
                  />
                  <button
                    type="button"
                    className="toggle"
                    onClick={() => setShowPass((s) => !s)}
                    aria-label={showPass ? "Hide password" : "Show password"}
                    title={showPass ? "Hide password" : "Show password"}
                  >
                    {showPass ? "🙈" : "👁️"}
                  </button>
                </div>

                {errors.pass ? (
                  <div className="errorText" role="alert">
                    {errors.pass}
                  </div>
                ) : null}
              </div>

              <div className="forgot">
                <a href={resetHref}>Forgot password?</a>
              </div>

              <button type="submit" className="cta" disabled={busy} aria-disabled={busy}>
                {busy ? <span className="spinner" aria-hidden="true" /> : "Log In"}
              </button>

              <div className="hint">
                Don’t have an account? <a href={signupHref}>Sign Up</a>
              </div>
            </form>
          </section>
        </main>

        <footer className="footer">
          <div>© 2026 {brandName}. All rights reserved.</div>
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



