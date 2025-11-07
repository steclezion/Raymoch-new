// resources/js/components/Login.jsx
import React, { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [busy, setBusy] = useState(false);

  // simple client-side validation
  const isEmail = (v) => /\S+@\S+\.\S+/.test(v);
  const isPhone = (v) => /^\+?[0-9\s\-().]{7,}$/.test(v);

  const getCsrf = () =>
    csrfToken ??
    window.LOGIN_BOOT?.csrf ??
    document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") ??"";

  const getApiUrl = () => apiUrl ?? window.LOGIN_BOOT?.apiLogin ?? "/login/json";
  const getRedirect = (j) => j?.redirect || redirectTo || window.LOGIN_BOOT?.redirectTo || "/dashboard";

  const set = (k) => (e) => setValues((s) => ({ ...s, [k]: e.target.value }));

  const validate = () => {
    const u = values.user.trim();
    const p = values.pass;
    if (!u) { toast.error("Please enter your email or phone."); return false; }
    if (!(isEmail(u) || isPhone(u))) { toast.error("Enter a valid email or phone number."); return false; }
    if (!p) { toast.error("Please enter your password."); return false; }
    if (p.length < 6) { toast.error("Password must be at least 6 characters."); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (busy) return;
    if (!validate()) return;

    setBusy(true);
    const url = getApiUrl();
    const token = getCsrf();

    try {
      // debug
      // console.log("POSTing to", url);

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Accept": "application/json",
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
        // 419 is a common CSRF/session issue
        if (res.status === 419) {
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

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <style>{css}</style>

      <div className="page">
        <main>
          <section className="card">
            <h1>Log In</h1>

            <form id="login-form" noValidate onSubmit={handleSubmit}>
              <div className="field">
                <input
                  className="input"
                  type="text"
                  placeholder="email or phone"
                  value={values.user}
                  onChange={set("user")}
                  required
                />
              </div>

              <div className="field">
                <input
                  className="input"
                  type={showPass ? "text" : "password"}
                  placeholder="password"
                  value={values.pass}
                  onChange={set("pass")}
                  required
                />
                <button
                  type="button"
                  className="toggle"
                  onClick={() => setShowPass((s) => !s)}
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
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

        <footer>
          <div>© 2025 {brandName}. All rights reserved.</div>
          <div>
            <a href={privacyHref}>Privacy</a>
            <a href={termsHref}>Terms</a>
            <a href={cookiesHref}>Cookies</a>
          </div>
        </footer>
      </div>
    </>
  );
}

/* --- same CSS, plus spinner for the button --- */
const css = `
:root{
  --brand-blue:#0328aeed;
  --brand-blue-700:#213bb1;
  --brand-blue-500:#041b64;
  --ink:#101114; --bg:#fafafa;
  --border:#e8e8ee; --card:#fff;
  --shadow:0 4px 16px rgba(10,42,107,.06);
  --footer-bg:#0b1020;
  --radius:16px;
}
*{box-sizing:border-box;margin:0;padding:0;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif}
.page{min-height:100vh;display:flex;flex-direction:column;background:var(--bg);color:var(--ink);}
main{flex:1;display:flex;align-items:center;justify-content:center;padding:20px;}
.card{
  background:var(--card); border:1px solid var(--border); box-shadow:var(--shadow);
  border-radius:var(--radius); padding:48px 56px; width:100%; max-width:600px; text-align:left;
}
.card h1{margin-bottom:20px; font-size:2.3rem; color:#063122; font-weight:800;}
.input{
  width:100%; padding:14px 16px; border:1px solid #063122; border-radius:10px;
  margin:8px 0 18px; font-size:15px;
}
.input:focus{outline:none; box-shadow:0 0 0 3px rgba(3,40,174,.25);}
.field{position:relative;}
.toggle{position:absolute;right:10px;top:50%;transform:translateY(-50%);background:transparent;border:0;cursor:pointer;}
.forgot{text-align:right;font-size:.9rem;margin:-6px 0 16px;}
button.cta{
  width:100%; padding:14px; border:0; border-radius:12px;
  background:linear-gradient(135deg,var(--brand-blue-700),var(--brand-blue-500));
  color:#fff; font-weight:700; font-size:15px; cursor:pointer;
  display:flex; align-items:center; justify-content:center; gap:10px;
}
button.cta[disabled]{opacity:.7; cursor:not-allowed;}
.spinner{
  width:20px;height:20px;border:3px solid rgba(255,255,255,.45);border-top-color:#fff;border-radius:50%;
  display:inline-block; animation:spin .9s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
footer{
  background:var(--footer-bg); color:#cbd5e1; font-size:.9rem; padding:10px 24px;
  display:flex;justify-content:space-between;align-items:center; border-top:1px solid #1f2937;
}
footer a{color:#cbd5e1;margin-left:14px;text-decoration:none;}
footer a:hover{text-decoration:underline;}
`;
