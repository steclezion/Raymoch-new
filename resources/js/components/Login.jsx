// resources/js/components/Login.jsx
import React, { useState } from "react";
import { Toaster, toast } from "sonner";
import { useEffect } from "react";
import africaMap from "../../../public/images/abstract-polygonal-africa-map-with.jpg";

/**
 * Expected props:
 * - apiUrl: login endpoint (e.g., /login/json)
 * - csrfToken: from Blade (meta or window.LOGIN_BOOT)
 * - redirectTo: where to send the user on success
 * - brandName, etc. optional
 */
export default function Login({
  apiUrl,
  csrfToken,
  redirectTo,
  brandName = "Raymoch",
  signupHref = "/signup",
  resetHref = "/reset",
  privacyHref = "/privacy",
  termsHref = "/terms",
  cookiesHref = "/cookies",
}) {
  const [showPass, setShowPass] = useState(false);
  const [values, setValues] = useState({ user: "", pass: "" });
  const [errors, setErrors] = useState({ user: "", pass: "" });
  const [busy, setBusy] = useState(false);

  // simple client-side validation
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

  // set value + clear that field's error when typing
  const set = (k) => (e) => {
    const val = e.target.value;
    setValues((s) => ({ ...s, [k]: val }));
    setErrors((s) => ({ ...s, [k]: "" }));
  };

  /**
   * ✅ Validation now does TWO things:
   * 1) Inline errors (red border + message under input)
   * 2) Sonner toast (one clean message)
   */
  const validate = () => {
    const u = values.user.trim();
    const p = values.pass;
    const next = { user: "", pass: "" };

    if (!u) next.user = "Email or phone is required.";
    else if (!(isEmail(u) || isPhone(u)))
      next.user = "Enter a valid email or phone number.";

    if (!p) next.pass = "Password is required.";
    else if (p.length < 6) next.pass = "Password must be at least 6 characters.";

    setErrors(next);

    // 🔔 Sonner toast for validation (keeps previous logic intact)
    if (next.user || next.pass) {
      const firstMsg = next.user || next.pass; // show the first error only (professional)
      toast.error(firstMsg);
      return false;
    }

    return true;
  };

  const setWrongCreds = () => {
    setErrors({
      user: "Wrong email or phone.",
      pass: "Wrong email or password.",
    });

    // 🔔 additional Sonner toast for wrong credentials
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
      } else {
        // 401/422: invalid creds (common patterns)
        if (res.status === 401 || res.status === 422) {
          setWrongCreds();
        } else if (res.status === 419) {
          toast.error("Session expired. Refresh the page and try again.");
        } else {
          toast.error(json?.message || "Invalid credentials or server error.");
        }
      }
    } catch (err) {
      toast.error("Network error. Please try again later.");
    } finally {
      setBusy(false);
    }
  };



  useEffect(() => {
  const page = document.querySelector(".page");
  const card = document.querySelector(".card");

  if (!page || !card) return;

  const lockBg = (el, name) => {
    const initialBg = getComputedStyle(el).backgroundColor;

    const handler = () => {
      const currentBg = getComputedStyle(el).backgroundColor;

      if (currentBg !== initialBg) {
        console.warn(
          `[UI GUARD] ${name} background changed on hover. Resetting.`,
          { initialBg, currentBg }
        );

        el.style.backgroundColor = initialBg;
      }
    };

    el.addEventListener("mouseenter", handler);
    el.addEventListener("mousemove", handler);
    el.addEventListener("focusin", handler);

    return () => {
      el.removeEventListener("mouseenter", handler);
      el.removeEventListener("mousemove", handler);
      el.removeEventListener("focusin", handler);
    };
  };

  const cleanPage = lockBg(page, "PAGE");
  const cleanCard = lockBg(card, "CARD");

  return () => {
    cleanPage?.();
    cleanCard?.();
  };
}, []);




  return (
    <>
      {/* Sonner Toaster */}
      <Toaster position="top-right" duration={3000} richColors closeButton />
      <style>{css}</style>

      <div className="page" >
        <main className="main"  style={{ backgroundImage: `url(${africaMap})`}}>

          <section className="card" aria-label="Login card">
            <header className="head">
              <h1 className="title">Log In</h1>
              <p className="sub">Welcome back. Please enter your credentials.</p>
            </header>

            <form id="login-form" noValidate onSubmit={handleSubmit}>
              {/* Email / Phone */}
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

              {/* Password */}
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

              <button
                type="submit"
                className="cta"
                disabled={busy}
                aria-disabled={busy}
              >
                {busy ? <span className="spinner" aria-hidden="true" /> : "Log In"}
              </button>

              <div className="hint">
                Don’t have an account? <a href={signupHref}>Sign Up</a>
              </div>
            </form>
          </section>
        </main>

<footer className="footer">
  <div>
    © {new Date().getFullYear()} {routes.brandName || "Raymoch"}. All rights reserved.
  </div>
  <div>
    <a href={routes.privacy}>Privacy</a>
    <a href={routes.terms}>Terms</a>
    <a href={routes.cookies}>Cookies</a>
  </div>
        </footer>
      </div>
    </>
  );
}

const css = `
:root{
  --brand-blue:#0328aeed;
  --brand-blue-700:#213bb1;
  --brand-blue-500:#041b64;

  --ink:#101114;
  --muted:#6b7280;
  --bg:#fafafa;

  --border:#e8e8ee;
  --card:#ffffff;

  --shadow:0 4px 16px rgba(10,42,107,.06);
  --shadowHover:0 10px 28px rgba(10,42,107,.10);

  --footer-bg:#0b1020;
  --radius:16px;

  --danger:#dc2626;
  --dangerSoft:rgba(220,38,38,.15);
}

/* 🚫 Absolutely prevent hover color changes anywhere */
.page:hover,
.main:hover,
.card:hover,
.page:focus,
.page:focus-within,
.main:focus-within,
.card:focus-within {
  background-color: var(--bg) !important;
  color: var(--ink) !important;
}


*{box-sizing:border-box;margin:0;padding:0;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif}

.page{
  min-height:100vh;
  display:flex;
  flex-direction:column;
  background:var(--bg);
  color:var(--ink);
}

.main{
  flex:1;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:20px;
}

.card{
  background:var(--card);
  border:1px solid var(--border);
  box-shadow:var(--shadow);
  border-radius:var(--radius);
  padding:44px 52px;
  width:100%;
  max-width:600px;
  text-align:left;
  transition: box-shadow .2s ease, transform .2s ease;
}

/* subtle hover (NOT blue) */
.card:hover{
  box-shadow:var(--shadowHover);
  transform: translateY(-1px);
}

/* lock card styling so it never turns blue */
.card:focus,
.card:focus-within{
  background:var(--card);
  box-shadow:var(--shadowHover);
}

.head{margin-bottom:18px;}
.title{
  font-size:2.2rem;
  color:#063122;
  font-weight:800;
  letter-spacing:.2px;
  margin-bottom:6px;
}
  
.sub{
  color: var(--muted) !important;
  transition: none !important;
}

.sub{
   color:var(--primary);
  font-size:.98rem;
  line-height:1.35;
}
  .card:hover .sub,
.card:focus .sub,
.card:focus-within .sub,
.page:hover .sub,
.main:hover .sub{
  color: var(--muted) !important;
}

.page{
  position: relative;
  overflow: hidden;
  background: #fafafa;
}

/* Africa background layer */
.page::before{
  content: "";
  position: fixed;
  inset: 0;
backgroundImage: 'url(${africaMap}),
   background-repeat: no-repeat;
  background-position: center;
  background-size: 70%;
  opacity: 0.06;           /* VERY important */
  filter: blur(6px);
  z-index: 0;
  pointer-events: none;   /* no hover, no interaction */
}

/* keep content above the background */
.page > *{
  position: relative;
  z-index: 1;
}

.page::after{
  content:"";
  position: fixed;
  inset: 0;
  background: radial-gradient(
    circle at center,
    rgba(255,255,255,0.85),
    rgba(255,255,255,1)
  );
  z-index: 0;
  pointer-events:none;
}


.field{margin-top:14px;}
.label{
  display:block;
  font-size:.9rem;
  color:#0f172a;
  margin-bottom:8px;
  font-weight:600;
}

.input{
  width:100%;
  padding:14px 14px;
  border:1px solid #063122;
  border-radius:10px;
  font-size:15px;
  background:#fff;
  transition: box-shadow .15s ease, border-color .15s ease;
}

.input:focus{
  outline:none;
  border-color: var(--brand-blue-700);
  box-shadow:0 0 0 3px rgba(3,40,174,.25);
}

/* 🔴 error state */
.inputError{
  border-color:var(--danger) !important;
  box-shadow:0 0 0 2px var(--dangerSoft) !important;
}

.errorText{
  margin-top:6px;
  font-size:.85rem;
  color:var(--danger);
  font-weight:600;
}

.passWrap{position:relative;}
.inputPass{padding-right:44px;}

.toggle{
  position:absolute;
  right:10px;
  top:50%;
  transform:translateY(-50%);
  background:transparent;
  border:0;
  cursor:pointer;
  font-size:18px;
  line-height:1;
  opacity:.85;
}
.toggle:hover{opacity:1;}

.forgot{
  text-align:right;
  font-size:.92rem;
  margin:12px 0 18px;
}
.forgot a{
  color: var(--brand-blue-700);
  text-decoration:none;
}
.forgot a:hover{text-decoration:underline;}

button.cta{
  width:100%;
  padding:14px;
  border:0;
  border-radius:12px;
  background:linear-gradient(135deg,var(--brand-blue-700),var(--brand-blue-500));
  color:#fff;
  font-weight:700;
  font-size:15px;
  cursor:pointer;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:10px;
}
button.cta[disabled]{opacity:.7; cursor:not-allowed;}

.spinner{
  width:20px;height:20px;
  border:3px solid rgba(255,255,255,.45);
  border-top-color:#fff;
  border-radius:50%;
  display:inline-block;
  animation:spin .9s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.footer{
  background:var(--footer-bg);
  color:#cbd5e1;
  font-size:.9rem;
  padding:10px 24px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  border-top:1px solid #1f2937;
  gap:14px;
}
.footerLinks{display:flex;flex-wrap:wrap;gap:14px;}
.footer a{
  color:#cbd5e1;
  text-decoration:none;
}
.footer a:hover{text-decoration:underline;}

@media (max-width: 640px){
  .card{padding:28px 22px;}
  .title{font-size:1.8rem;}
}
`;
