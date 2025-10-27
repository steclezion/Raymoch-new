// resources/js/components/RequestTrial.jsx
import React, { useEffect, useRef, useState } from "react";

export default function RequestTrial({ apiUrl, csrfToken }) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    business_email: "",
    phone: "",
    company: "",
    agree_privacy: false,
  });

  const [busy, setBusy] = useState(false);
  const [alert, setAlert] = useState({ type: "", msg: "" });
  const [showPolicy, setShowPolicy] = useState(false);

  const alertRef = useRef(null);
  const agreeRowRef = useRef(null);

  const onChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  };

  const scrollTopToAlert = () => {
    if (alertRef.current) {
      alertRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const showAlert = (type, msg) => {
    setAlert({ type, msg });
    setTimeout(scrollTopToAlert, 10);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      alertRef.current?.focus();
    }, 50);
    setTimeout(() => setAlert({ type: "", msg: "" }), 4500);
  };

  const openPolicy = () => setShowPolicy(true);
  const closePolicy = () => setShowPolicy(false);

  useEffect(() => {
    const html = document.documentElement;
    html.style.overflow = showPolicy ? "hidden" : "";
    return () => { html.style.overflow = ""; };
  }, [showPolicy]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setShowPolicy(false);
    if (showPolicy) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showPolicy]);

  const submit = async (e) => {
    e.preventDefault();

    if (!form.agree_privacy) {
      showAlert("err", "Please read and agree to the privacy policy to continue.");
      if (agreeRowRef.current) {
        agreeRowRef.current.classList.add("invalid-ring", "shake");
        const cb = agreeRowRef.current.querySelector('input[type="checkbox"]');
        setTimeout(() => cb?.focus(), 300);
        setTimeout(() => agreeRowRef.current?.classList.remove("shake"), 600);
        setTimeout(() => agreeRowRef.current?.classList.remove("invalid-ring"), 1800);
      }
      return;
    }

    setBusy(true);
    try {
      // 👉 Store will also generate + email a code and respond with a redirect URL
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "X-CSRF-TOKEN": csrfToken ?? "",
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const json = await res.json().catch(() => ({}));

      if (res.ok && json.ok) {
        // ✅ Navigate to verification page (server chooses where)
        const to =
          json.redirect ||
          `/trial/verify?email=${encodeURIComponent(form.business_email)}`;
        window.location.assign(to);
      } else {
        let msg = "Please fix the highlighted fields.";
        if (json?.errors) {
          msg = Object.values(json.errors).flat().join(" ");
        } else if (json?.message) {
          msg = json.message;
        }
        showAlert("err", msg);
      }
    } catch {
      showAlert("err", "Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="request-card" aria-label="Request a free trial">
      <div className="pb-hero">
        <div>
          <h1 className="request-title" style={{ margin: "0 0 6px" }}>
            Request a free trial
          </h1>
          <div className="helper">Make better decisions faster</div>
        </div>
        <div className="badges" aria-hidden>
          <span className="helper">Top Rated · Momentum Leader</span>
        </div>
      </div>

      {/* Alert anchor */}
      <div
        ref={alertRef}
        tabIndex="-1"
        className={`alert ${alert.msg ? "show" : ""} ${alert.type}`}
      >
        {alert.msg}
      </div>

      <form onSubmit={submit} noValidate>
        <div className="form-grid">
          <div>
            <label htmlFor="first_name">First name</label>
            <input id="first_name" name="first_name" type="text" value={form.first_name}
              onChange={onChange} placeholder="SAMSON" required />
          </div>

          <div>
            <label htmlFor="last_name">Last name</label>
            <input id="last_name" name="last_name" type="text" value={form.last_name}
              onChange={onChange} placeholder="TESFAMICHAEL" required />
          </div>

          <div className="full">
            <label htmlFor="business_email">Business email</label>
            <input id="business_email" name="business_email" type="email" value={form.business_email}
              onChange={onChange} placeholder="name@company.com" required />
          </div>

          <div>
            <label htmlFor="phone">Phone</label>
            <input id="phone" name="phone" type="tel" value={form.phone}
              onChange={onChange} placeholder="+1 555 000 0000" />
          </div>

          <div>
            <label htmlFor="company">Company</label>
            <input id="company" name="company" type="text" value={form.company}
              onChange={onChange} placeholder="Nile Training Centre" />
          </div>

          <div className="full row" ref={agreeRowRef}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input type="checkbox" name="agree_privacy"
                checked={form.agree_privacy} onChange={onChange} />
              <span className="helper">
                I agree to the{" "}
                <button type="button" className="link-as-button" onClick={() => setShowPolicy(true)}>
                  privacy policy
                </button>
              </span>
            </label>

            <button className="cta" type="submit" disabled={busy}>
              {busy ? "Submitting…" : "Submit"}
            </button>
          </div>
        </div>
      </form>

      {showPolicy && <div className="modal-backdrop" onClick={() => setShowPolicy(false)} aria-hidden />}
      <div
        className={`modal ${showPolicy ? "show" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="policyTitle"
        onClick={() => setShowPolicy(false)}
      >
        <div className="modal__panel spin-in" onClick={(e) => e.stopPropagation()}>
          <div className="modal__header">
            <h2 id="policyTitle">Privacy Policy</h2>
            <button className="modal__close" onClick={() => setShowPolicy(false)} aria-label="Close" type="button">
              ×
            </button>
          </div>
          <div className="modal__body">
            <p><strong>What we collect</strong>: name, email, company, optional phone.</p>
            <p><strong>Purpose</strong>: contact you about your free trial and provide product info.</p>
          </div>
          <div className="modal__footer">
            <button className="btn-ghost" type="button" onClick={() => setShowPolicy(false)}>Close</button>
            <button className="cta" type="button" onClick={() => { setForm(s => ({...s, agree_privacy: true})); setShowPolicy(false); }}>
              I’ve read & agree
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
