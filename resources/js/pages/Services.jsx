// resources/js/components/Services.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import Header from "../components/layout_master/Header.jsx";
import Footer from "../components/layout_master/Footer.jsx";

const Services = () => {
  /* ================= Header menu JS (your existing logic) ================= */
  useEffect(() => {
    const cleanup = (() => {
      const btn = document.getElementById("exploreToggle");
      const menu = document.getElementById("t1Menu");
      if (!btn || !menu) return null;

      const openMenu = (on) => {
        btn.setAttribute("aria-expanded", on ? "true" : "false");
        menu.hidden = !on;
      };

      const onBtnClick = (e) => {
        e.preventDefault();
        openMenu(btn.getAttribute("aria-expanded") !== "true");
      };

      const onDocClick = (e) => {
        if (!menu.hidden && !menu.contains(e.target) && !btn.contains(e.target)) {
          openMenu(false);
        }
      };

      const onKeyDown = (e) => {
        if (e.key === "Escape") openMenu(false);
      };

      btn.addEventListener("click", onBtnClick);
      document.addEventListener("click", onDocClick);
      document.addEventListener("keydown", onKeyDown);

      return () => {
        btn.removeEventListener("click", onBtnClick);
        document.removeEventListener("click", onDocClick);
        document.removeEventListener("keydown", onKeyDown);
      };
    })();

    (() => {
      const menu = document.getElementById("t1Menu");
      menu?.querySelectorAll("a.menu-item").forEach((a) => a.setAttribute("role", "menuitem"));
    })();

    return () => {
      if (typeof cleanup === "function") cleanup();
    };
  }, []);

  

  /* ================= Modal State ================= */
  const [rmModalOpen, setRmModalOpen] = useState(false);
  const [activeKey, setActiveKey] = useState(null);

  const lastFocusedRef = useRef(null);
  const rmModalRef = useRef(null);

  /* ================= Options from backend ================= */
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [countries, setCountries] = useState([]); // [{id,name}]
  const [sectors, setSectors] = useState([]); // [{id,name}]
  const [optionsError, setOptionsError] = useState("");

  /* ================= Form state (Step 2) ================= */
  const [ticketMin, setTicketMin] = useState(24000);
  const [ticketMax, setTicketMax] = useState(56000);
  const [startFromMonth, setStartFromMonth] = useState(0);
  const [startToMonth, setStartToMonth] = useState(6);

  const [funding, setFunding] = useState({
    equity: true,
    revenueShare: true,
    poFinance: true,
    debt: true,
  });

  const [selectedSectorIds, setSelectedSectorIds] = useState([]);
  const [selectedCountryIds, setSelectedCountryIds] = useState([]);

  // Clear-all handlers for multi-selects
  const clearSectors = () => setSelectedSectorIds([]);
  const clearCountries = () => setSelectedCountryIds([]);

  const services = useMemo(
    () => [
      { key: "matching", title: "Matching", subtitle: "Investor inputs → ranked SME matches." },
      { key: "partner-programs", title: "Partner Programs", subtitle: "Accelerators & syndicates, plugged in." },
      { key: "verification", title: "Verification", subtitle: "CTI checks: identity, ownership, basics." },
      { key: "visibility-listing", title: "Visibility & Listing", subtitle: "Get listed. Get discovered." },
    ],
    []
  );

  const fetchOptions = async () => {
    setLoadingOptions(true);
    setOptionsError("");
    try {
      const res = await fetch("/services/options", {
        headers: { Accept: "application/json" },
        credentials: "same-origin",
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Failed to load options (${res.status}). ${txt}`);
      }

      const data = await res.json();
      setCountries(Array.isArray(data?.countries) ? data.countries : []);
      setSectors(Array.isArray(data?.sectors) ? data.sectors : []);
    } catch (e) {
      setOptionsError(e?.message || "Failed to load options.");
      setCountries([]);
      setSectors([]);
    } finally {
      setLoadingOptions(false);
    }
  };

  const openServiceModal = async (serviceKey) => {
    lastFocusedRef.current = document.activeElement;
    setActiveKey(serviceKey);
    setRmModalOpen(true);

    if (serviceKey === "matching") {
      await fetchOptions();
    }
  };

  const closeModal = () => {
    setRmModalOpen(false);
    setActiveKey(null);

    setTimeout(() => {
      const el = lastFocusedRef.current;
      if (el && typeof el.focus === "function") el.focus();
    }, 0);
  };

  /* ================= Modal keyboard + scroll lock ================= */
  useEffect(() => {
    if (!rmModalOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeModal();
        return;
      }

      if (e.key === "Tab" && rmModalRef.current) {
        const focusables = rmModalRef.current.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables.length) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);

    setTimeout(() => {
      const btn = rmModalRef.current?.querySelector("[data-autofocus='true']");
      if (btn) btn.focus();
    }, 0);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [rmModalOpen]);

  const toggleFunding = (key) => {
    setFunding((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleMultiSelect = (e, setter) => {
    const values = Array.from(e.target.selectedOptions).map((o) => Number(o.value));
    setter(values);
  };

  const css = `
:root{
  --brand-blue:#0328aeed;
  --brand-blue-700:#213bb1;
  --brand-blue-500:#041b64;
  --ink:#101114;
  --bg:#fafafa;
  --border:#e8e8ee;
  --card:#ffffff;
  --shadow:0 6px 22px rgba(10,42,107,.08);
  --maxw:1328px; --gutter:18px;
  --footer-bg:#0b1020;


 
}




}



*{box-sizing:border-box;margin:0;padding:0;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif}
html{ background:var(--footer-bg); height:100%; }
body{
  color:var(--ink);
  line-height:1.5;
  min-height:100dvh;
  display:flex;
  flex-direction:column;
  background:
    linear-gradient(to bottom,
      var(--bg) 0%,
      var(--bg) calc(100% - 240px),
      var(--footer-bg) calc(100% - 240px),
      var(--footer-bg) 100%);
}
.wrap{max-width:var(--maxw);margin:0 auto;padding:0 var(--gutter)}
main{flex:1}

/* HERO */
.hero{
  background:linear-gradient(135deg, var(--brand-blue-700), var(--brand-blue-500));
  color:#fff;
  padding:clamp(40px,4vw,80px) 0;
  border-bottom:1px solid var(--border);
}
.hero h2{
  font-weight:900;
  font-size:clamp(32px,5vw,52px);
  background:linear-gradient(90deg,#fff,#e7efff);
  -webkit-background-clip:text;
  background-clip:text;
  color:transparent
}
.hero p{margin-top:8px;color:#DDEBFF;font-size:clamp(16px,2vw,20px)}

.container{max-width:1100px;margin:0 auto;padding:24px}
.svc-menu{margin-top:clamp(28px,6vw,72px); margin-bottom:clamp(48px,10vw,128px)}
.svc-grid{display:grid;grid-template-columns:repeat(12,1fr);gap:20px}
.svc-col-3{grid-column:span 3}
/* =========================================================
   SERVICES MENU – RESPONSIVE STACK (NO SHRINKING)
   ========================================================= */

/* Ensure section always flows downward */
.svc-menu {
  display: block;
  width: 100%;
}

/* Desktop: grid layout */
.svc-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 20px;
}

/* Prevent cards from shrinking */
.svc-box {
  min-width: 280px;      /* HARD STOP: no shrinking */
  width: 100%;
}

/* ================= MOBILE / TABLET ================= */
@media (max-width: 1024px) {
  .svc-grid {
    display: flex;
    flex-direction: column; /* STACK TOP → BOTTOM */
    gap: 20px;
  }

  .svc-col-3 {
    grid-column: auto;      /* disable grid math */
    width: 100%;
  }

  .svc-box {
    min-height: 190px;      /* preserve visual size */
  }
}


/* ===================== SERVICE CARDS ===================== */
.svc-box{
  width:100%;
  text-align:left;
  display:block;
  border:1px solid var(--border);
  border-radius:20px;
  background:var(--card) !important;
  padding:28px 24px 24px;
  box-shadow:var(--shadow);
  transition:none !important;  /* ✅ NO hover animation */
  min-height:190px;
  cursor:pointer;
  outline:none;
  appearance:none;
  -webkit-appearance:none;
  position:relative;
  overflow:hidden;
  color:inherit !important;
  border-color:var(--border) !important;
}

/* blue edge stripe */
.svc-box::before{
  content:"";
  position:absolute;
  left:0;
  top:0;
  bottom:0;
  width:6px;
  background:linear-gradient(180deg, var(--brand-blue-700), var(--brand-blue-500));
  border-top-left-radius:20px;
  border-bottom-left-radius:20px;
}


}



@media (max-width: 900px){
  .svc-grid{grid-template-columns:1fr}
  .svc-col-3{grid-column:span 12}
}

/* ===================== MODAL (Bootstrap-safe) ===================== */
.rm-overlay{
  position:fixed; inset:0;
  background:rgba(10,16,32,.55);
  display:flex; align-items:center; justify-content:center;
  padding:18px;
  z-index:999999;
}
.rm-modal{
  width:min(1040px, 100%);
  max-height:calc(100dvh - 36px);
  background:var(--card);
  border:1px solid var(--border);
  border-radius:24px;
  box-shadow:0 30px 80px rgba(0,0,0,.22);
  overflow:hidden;
  display:flex; flex-direction:column;
}
.rm-topbar{
  height:6px;
 // background:linear-gradient(90deg, var(--brand-blue-700), var(--brand-blue-500));
}
.rm-header{
  padding:18px 18px 14px;
  border-bottom:1px solid var(--border);
  background:#fff;
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap:14px;
}
.rm-title h3{margin:0;font-size:28px;font-weight:900;color:#0f172a}
.rm-sub{margin-top:6px;color:#6b7280}
.rm-close{
  border:1px solid var(--border);
  background:#fff;
  border-radius:14px;
  padding:10px 12px;
  cursor:pointer;
  font-weight:900;
}
.rm-body{
  padding:18px;
  overflow:auto;
  background:#fff;
}

/* Step 2 */
.step2-grid{
  display:grid;
  grid-template-columns: 1.1fr 1fr;
  gap:18px;
}
@media (max-width: 920px){
  .step2-grid{grid-template-columns:1fr}
}
.card{
  border:1px solid var(--border);
  border-radius:18px;
  box-shadow:var(--shadow);
  padding:14px;
  background:#fff;
}
.form-row{
  display:grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap:14px;
}
@media (max-width: 920px){
  .form-row{grid-template-columns:1fr}
}
.label{font-size:13px;color:#334155;margin-bottom:6px}
.input{
  width:100%;
  border:1px solid var(--border);
  border-radius:12px;
  padding:11px 12px;
  outline:none;
  background:#fff;
}
.input:focus{
  box-shadow:0 0 0 4px rgba(3,40,174,.14);
}
.inline-range{
  display:grid;
  grid-template-columns: 1fr 1fr;
  gap:10px;
}
.pills{
  display:flex;
  gap:10px;
  flex-wrap:wrap;
  margin-top:10px;
}
.pill{
  display:flex;
  align-items:center;
  gap:10px;
  border:1px solid var(--border);
  border-radius:999px;
  padding:10px 12px;
  background:#fbfbfe;
}
.pill input{width:18px;height:18px}
.ms2-col{
  display:grid;
  grid-template-columns: 1fr 1fr;
  gap:14px;
}
@media (max-width: 920px){
  .ms2-col{grid-template-columns:1fr}
}
.multi-select{
  width:100%;
  border:1px solid var(--border);
  border-radius:14px;
  padding:10px;
  height:190px;
  overflow:auto;
}
.help{font-size:12px;color:#64748b;margin-top:6px}

/* =========================================================
   Disable hover effects on all .card elements
   Forces identical appearance on hover/focus/active
   ========================================================= */
.card,
.card:hover,
.card:focus,
.card:active,
.card:focus-within {
  background: #fff !important;
  box-shadow: var(--shadow) !important;
  transform: none !important;
  filter: none !important;
  transition: none !important;
}

/* Prevent inner text or elements changing color */
.card:hover * {
  color: inherit !important;
}


/* multi-select wrapper + clear X */
.ms-wrap{ position:relative; }
.ms-clear{
  position:absolute;
  top:10px;
  right:10px;
  width:28px;
  height:28px;
  border-radius:999px;
  border:1px solid var(--border);
  background:#fff;
  display:grid;
  place-items:center;
  font-size:18px;
  font-weight:900;
  line-height:1;
  cursor:pointer;
  box-shadow:0 8px 18px rgba(0,0,0,.06);
}
.ms-clear:disabled{
  opacity:.45;
  cursor:not-allowed;
  box-shadow:none;
}
.ms-clear:focus-visible{
  box-shadow:0 0 0 4px rgba(3,40,174,.14);
}

.rm-footer{
  padding:14px 18px;
  border-top:1px solid var(--border);
  display:flex;
  align-items:center;
  justify-content:space-between;
  background:#fff;
}
.btn{
  border-radius:14px;
  padding:10px 14px;
  font-weight:900;
  cursor:pointer;
  border:1px solid var(--border);
  background:#fff;
}
.btn-primary{
  background:linear-gradient(135deg, var(--brand-blue-700), var(--brand-blue-500));
  color:#fff;
  border:0;
}
footer{margin-top:auto;background:var(--footer-bg);color:#cbd5e1;}
`;

  const isMatching = activeKey === "matching";

  return (
    <>
      <style>{css}</style>
      <Header />

      <section className="hero" aria-label="Raymoch Services">
        <div className="wrap">
          <h2>Services</h2>
          <p>Build trust. Get seen. Partner smart.</p>
        </div>
      </section>

      <main>
        <div className="container">
          <section className="svc-menu" aria-labelledby="svcMenuTitle">
            <h3 id="svcMenuTitle" style={{ margin: "0 0 8px", color: "var(--brand-blue)" }}>
              Choose a service
            </h3>

            <div className="svc-grid">
              <button type="button" className="svc-box svc-col-3" onClick={() => openServiceModal("matching")}>
                <h3>Matching</h3>
                <p>Investor inputs → ranked SME matches.</p>
              </button>

              <button type="button" className="svc-box svc-col-3" onClick={() => openServiceModal("partner-programs")}>
                <h3>Partner Programs</h3>
                <p>Accelerators &amp; syndicates, plugged in.</p>
              </button>

              <button type="button" className="svc-box svc-col-3" onClick={() => openServiceModal("verification")}>
                <h3>Verification</h3>
                <p>CTI checks: identity, ownership, basics.</p>
              </button>

              <button type="button" className="svc-box svc-col-3" onClick={() => openServiceModal("visibility-listing")}>
                <h3>Visibility &amp; Listing</h3>
                <p>Get listed. Get discovered.</p>
              </button>
            </div>
          </section>
        </div>
      </main>

      {rmModalOpen && (
        <div
          className="rm-overlay"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="rm-modal" role="dialog" aria-modal="true" aria-labelledby="rmTitle" ref={rmModalRef}>
            <div className="rm-topbar" />
            <div className="rm-header">
              <div className="rm-title">
                <h3 id="rmTitle">
                  {isMatching
                    ? " Preferences & Matches"
                    : services.find((s) => s.key === activeKey)?.title || "Service"}
                </h3>
                <div className="rm-sub">
                  {isMatching
                    ? "Adjust if needed. We show bands only — no private scores."
                    : services.find((s) => s.key === activeKey)?.subtitle || ""}
                </div>
              </div>

              <button type="button" className="rm-close" onClick={closeModal} data-autofocus="true">
                ✕
              </button>
            </div>

            <div className="rm-body">
              {!isMatching ? (
                <div className="card">
                  <div style={{ color: "#475569" }}>
                    Add your real content for <b>{services.find((s) => s.key === activeKey)?.title}</b> here.
                  </div>
                </div>
              ) : (
                <>
                  <div className="card" style={{ marginBottom: 14 }}>
                    <div className="form-row">
                      <div>
                        <div className="label">Ticket — min</div>
                        <input className="input" type="number" value={ticketMin} onChange={(e) => setTicketMin(Number(e.target.value))} min={0} />
                      </div>

                      <div>
                        <div className="label">Ticket — max</div>
                        <input className="input" type="number" value={ticketMax} onChange={(e) => setTicketMax(Number(e.target.value))} min={0} />
                      </div>

                      <div>
                        <div className="label">Start timing (months window)</div>
                        <div className="inline-range">
                          <input className="input" type="number" value={startFromMonth} onChange={(e) => setStartFromMonth(Number(e.target.value))} min={0} />
                          <input className="input" type="number" value={startToMonth} onChange={(e) => setStartToMonth(Number(e.target.value))} min={0} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="step2-grid">
                    <div className="card">
                      <div className="label" style={{ fontSize: 14, marginBottom: 10 }}>
                        Funding instruments
                      </div>

                      <div className="pills">
                        <label className="pill">
                          <input type="checkbox" checked={funding.equity} onChange={() => toggleFunding("equity")} />
                          <span>Equity</span>
                        </label>

                        <label className="pill">
                          <input type="checkbox" checked={funding.revenueShare} onChange={() => toggleFunding("revenueShare")} />
                          <span>Revenue Share</span>
                        </label>

                        <label className="pill">
                          <input type="checkbox" checked={funding.poFinance} onChange={() => toggleFunding("poFinance")} />
                          <span>PO Finance</span>
                        </label>

                        <label className="pill">
                          <input type="checkbox" checked={funding.debt} onChange={() => toggleFunding("debt")} />
                          <span>Debt</span>
                        </label>
                      </div>

                      {optionsError ? (
                        <div className="help" style={{ color: "#b91c1c", marginTop: 12 }}>
                          {optionsError}
                        </div>
                      ) : (
                        <div className="help" style={{ marginTop: 12 }}>
                          {loadingOptions ? "Loading countries & sectors..." : "Tip: Hold Ctrl (Windows) / Cmd (Mac) to select multiple items."}
                        </div>
                      )}
                    </div>

                    <div className="card">
                      <div className="ms2-col">
                        <div>
                          <div className="label">Sectors (multi-select)</div>
                          <div className="ms-wrap">
                            <select
                              className="multi-select"
                              multiple
                              value={selectedSectorIds.map(String)}
                              onChange={(e) => handleMultiSelect(e, setSelectedSectorIds)}
                              disabled={loadingOptions}
                            >
                              {sectors.map((s) => (
                                <option key={s.id} value={s.id}>
                                  {s.name}
                                </option>
                              ))}
                            </select>
                            <button type="button" className="ms-clear" onClick={clearSectors} title="Clear" disabled={selectedSectorIds.length === 0}>
                              ×
                            </button>
                          </div>
                        </div>

                        <div>
                          <div className="label">Countries (multi-select)</div>
                          <div className="ms-wrap">
                            <select
                              className="multi-select"
                              multiple
                              value={selectedCountryIds.map(String)}
                              onChange={(e) => handleMultiSelect(e, setSelectedCountryIds)}
                              disabled={loadingOptions}
                            >
                              {countries.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.name}
                                </option>
                              ))}
                            </select>
                            <button type="button" className="ms-clear" onClick={clearCountries} title="Clear" disabled={selectedCountryIds.length === 0}>
                              ×
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="rm-footer">
              <button type="button" className="btn" onClick={closeModal}>
                Back
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  const payload = {
                    ticketMin,
                    ticketMax,
                    startFromMonth,
                    startToMonth,
                    funding,
                    sectorIds: selectedSectorIds,
                    countryIds: selectedCountryIds,
                  };
                  console.log("Continue payload:", payload);
                  alert("Continue clicked. Check console for payload.");
                }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Services;
