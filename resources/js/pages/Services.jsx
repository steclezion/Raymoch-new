// resources/js/components/Services.jsx
// ✅ Complete single-file version
// ✅ Matching modal (options fetch) + Partner Programs full design inside modal
// ✅ Responsive services section stacks downward (no shrinking)
// ✅ Disables hover effects on .card (no color/transform changes)
// ✅ Keeps your header explore menu logic + modal focus trap/ESC + body scroll lock

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

  /* ================= Partner Programs Flow ================= */
  // programs | catalog | details | eligibility
  const [partnerRoute, setPartnerRoute] = useState("programs");

  /* ================= Options from backend (Matching) ================= */
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [countries, setCountries] = useState([]); // [{id,name}]
  const [sectors, setSectors] = useState([]); // [{id,name}]
  const [optionsError, setOptionsError] = useState("");

  /* ================= Form state (Matching) ================= */
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

    // Reset Partner Programs flow each time you open it
    if (serviceKey === "partner-programs") {
      setPartnerRoute("programs");
    }

    // Only fetch options for Matching
    if (serviceKey === "matching") {
      await fetchOptions();
    }
  };

  const closeModal = () => {
    setRmModalOpen(false);
    setActiveKey(null);

    // restore focus to the last focused element
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

      // Focus trap
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

    // autofocus close button
    setTimeout(() => {
      const btn = rmModalRef.current?.querySelector("[data-autofocus='true']");
      if (btn) btn.focus();
    }, 0);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [rmModalOpen]);

  const toggleFunding = (key) => setFunding((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleMultiSelect = (e, setter) => {
    const values = Array.from(e.target.selectedOptions).map((o) => Number(o.value));
    setter(values);
  };

  const isMatching = activeKey === "matching";
  const isPartnerPrograms = activeKey === "partner-programs";

  const css = `
:root{
  --brand-blue:#0328aeed;
  --brand-blue-700:#213bb1;
  --brand-blue-500:#041b64;
  --muted:#3c4b69;
  --ink:#101114;
  --bg:#fafafa;
  --border:#e8e8ee;
  --border-soft:#eceff3;
  --card:#ffffff;
  --shadow:0 6px 22px rgba(10,42,107,.08);
  --maxw:1328px; --gutter:18px;
  --footer-bg:#0b1020;
}
*{box-sizing:border-box;margin:0;padding:0;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif}
a{text-decoration:none;color:inherit}
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

/* Page HERO */
.page-hero{
  background:linear-gradient(135deg, var(--brand-blue-700), var(--brand-blue-500));
  color:#fff;
  padding:clamp(40px,4vw,80px) 0;
  border-bottom:1px solid var(--border);
}
.page-hero h2{
  font-weight:900;
  font-size:clamp(32px,5vw,52px);
  background:linear-gradient(90deg,#fff,#e7efff);
  -webkit-background-clip:text;
  background-clip:text;
  color:transparent
}
.page-hero p{margin-top:8px;color:#DDEBFF;font-size:clamp(16px,2vw,20px)}

.container{max-width:1100px;margin:0 auto;padding:24px}

/* =========================================================
   SERVICES MENU – RESPONSIVE STACK (NO SHRINKING)
   ========================================================= */
.svc-menu{
  display:block;
  width:100%;
  margin-top:clamp(28px,6vw,72px);
  margin-bottom:clamp(48px,10vw,128px);
}
.svc-grid{
  display:grid;
  grid-template-columns:repeat(12,1fr);
  gap:20px;
}
.svc-col-3{grid-column:span 3}

.svc-box{
  width:100%;
  text-align:left;
  display:block;
  border:1px solid var(--border);
  border-radius:20px;
  background:var(--card) !important;
  padding:28px 24px 24px;
  box-shadow:var(--shadow);
  transition:none !important; /* no hover animation */
  min-height:190px;
  cursor:pointer;
  outline:none;
  appearance:none;
  -webkit-appearance:none;
  position:relative;
  overflow:hidden;
  color:inherit !important;
  border-color:var(--border) !important;
  min-width:280px; /* HARD STOP: no shrinking */
}
  /* ===================== HARD FIX: Partner Programs cards never change ===================== */
.grid .card.col-4.click{
  background: var(--card) !important;        /* keep same */
  color: inherit !important;
}

/* on hover, DO NOT change background or color */
.grid .card.col-4.click:hover,
.grid .card.col-4.click:focus,
.grid .card.col-4.click:active,
.grid .card.col-4.click:focus-within{
  background: var(--card) !important;        /* lock */
  color: inherit !important;
  transform: none !important;
  filter: none !important;
  box-shadow: var(--shadow) !important;
  transition: none !important;
}

/* make sure text stays readable */
.grid .card.col-4.click h3,
.grid .card.col-4.click:hover h3{
  color: var(--brand-blue) !important;
}

.grid .card.col-4.click .meta,
.grid .card.col-4.click:hover .meta{
  color: #6b7280 !important;
}


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
.svc-box h3{margin:0 0 6px;font-size:18px}
.svc-box p{margin:6px 0 0;color:#475569}

@media (max-width: 1024px){
  .svc-grid{ display:flex; flex-direction:column; gap:20px; }
  .svc-col-3{ grid-column:auto; width:100%; }
  .svc-box{ min-height:190px; }
}

/* ===================== MODAL ===================== */
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
  padding:0;              /* Partner Programs includes its own hero + containers */
  overflow:auto;
  background:#fff;
}

/* Shared card base (used in Matching + Partner Programs) */
/* BASE CARD (whatever color you want) */
.card{
  background: var(--card);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  border-radius: 20px;
  transition: none !important;
}


/* ✅ NO HOVER EFFECT: keep EXACT same styles */
.card:hover,
.card:focus,
.card:active,

.card:focus-within{
  background: var(--card) !important;  /* NOT white */
  border-color: var(--border) !important;
  box-shadow: var(--shadow) !important;
  transform: none !important;
  filter: none !important;
}

.grid *:hover{
  background: unset !important;
  box-shadow: unset !important;
  transform: none !important;
}









/* Matching UI */
.form-row{
  display:grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap:14px;
}
@media (max-width: 920px){ .form-row{grid-template-columns:1fr} }
.label{font-size:13px;color:#334155;margin-bottom:6px}
.input{
  width:100%;
  border:1px solid var(--border);
  border-radius:12px;
  padding:11px 12px;
  outline:none;
  background:#fff;
}
.input:focus{ box-shadow:0 0 0 4px rgba(3,40,174,.14); }
.inline-range{ display:grid; grid-template-columns: 1fr 1fr; gap:10px; }

.step2-grid{
  display:grid;
  grid-template-columns: 1.1fr 1fr;
  gap:18px;
  padding:0 18px 18px;
}
@media (max-width: 920px){ .step2-grid{grid-template-columns:1fr} }

.pills{ display:flex; gap:10px; flex-wrap:wrap; margin-top:10px; }
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

.ms2-col{ display:grid; grid-template-columns: 1fr 1fr; gap:14px; }
@media (max-width: 920px){ .ms2-col{grid-template-columns:1fr} }

.multi-select{
  width:100%;
  border:1px solid var(--border);
  border-radius:14px;
  padding:10px;
  height:190px;
  overflow:auto;
}
.help{font-size:12px;color:#64748b;margin-top:6px}

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
.ms-clear:focus-visible{ box-shadow:0 0 0 4px rgba(3,40,174,.14); }

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
.btn.secondary{
  border:1px solid var(--border);
  background:#fff;
}

footer{margin-top:auto;background:var(--footer-bg);color:#cbd5e1;}
`;

  /* ============== Partner Programs helper handlers (demo flow) ============== */
  const onPartnerCardPick = () => setPartnerRoute("catalog");
  const onPartnerProgramOpen = () => setPartnerRoute("details");
  const onPartnerEligibility = () => setPartnerRoute("eligibility");

  return (
    <>
      <style>{css}</style>

      <Header />

      {/* Page HERO */}
      <section className="page-hero" aria-label="Raymoch Services">
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

      {/* ===================== MODAL ===================== */}
      {rmModalOpen && (
        <div
          className="rm-overlay"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="rm-modal" role="dialog" aria-modal="true" aria-labelledby="rmTitle" ref={rmModalRef}>
            {/* Modal Header (kept consistent) */}
            <div className="rm-header">
              <div className="rm-title">
                <h3 id="rmTitle">
                  {isMatching
                    ? "Preferences & Matches"
                    : services.find((s) => s.key === activeKey)?.title || "Service"}
                </h3>
                <div className="rm-sub">
                  {isMatching
                    ? "Adjust if needed. We show bands only — no private scores."
                    : services.find((s) => s.key === activeKey)?.subtitle || ""}
                </div>
              </div>

              <button type="button" className="rm-close" onClick={closeModal} data-autofocus="true" aria-label="Close">
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="rm-body">
              {/* ===================== PARTNER PROGRAMS (YOUR DESIGN) ===================== */}
              {isPartnerPrograms && (
                <>
                  {/* ================== HERO (unchanged) ================== */}
                  {/* <div className="hero" style={{ background: "var(--brand-blue)", color: "#fff", padding: "36px 0 18px" }}>
                    <div className="container">
                      <h2 style={{ margin: "0 0 8px", fontSize: 40, fontWeight: 900 }}>Partner Programs</h2>
                      <p style={{ margin: 0, color: "#e5ecff", maxWidth: 820 }}>
                        Discover official programs, subsidies, and opportunities for African businesses.
                      </p>
                    </div>
                  </div> */}

                  <main>
                    <div className="container" style={{ paddingTop: 18, paddingBottom: 18 }}>
                      {/* STEP 1: CHOOSE PATH */}
                      <section
                        className={`route ${partnerRoute === "programs" ? "active" : ""}`}
                        data-route="programs"
                        aria-labelledby="chooseTitle"
                      >
                        <h3 id="chooseTitle" style={{ color: "var(--brand-blue)" }}>
                          Choose a partner path
                        </h3>

                        <div className="filterbar" id="lpFilterbar" role="search" style={{ marginTop: 8 }}>
                          <input
                            id="lpQuery"
                            type="search"
                            placeholder="Search by name, sponsor, sector"
                            aria-label="Search programs on landing"
                            style={{ flex: 1, minWidth: 200 }}
                          />
                          <select id="lpCategory" aria-label="Program type (landing)">
                            <option value="">Program type</option>
                          </select>
                          <select id="lpCountry" aria-label="Country (landing)">
                            <option value="">Country</option>
                          </select>
                          <button className="reset" id="lpSearchBtn" type="button" onClick={() => setPartnerRoute("catalog")}>
                            Search
                          </button>
                        </div>

                        <div className="grid" style={{ marginTop: 16 }}>
                          <article
                            className="card col-4 click"
                            data-type="accelerator"
                            tabIndex={0}
                            role="button"
                            aria-label="Accelerator Partner"
                            onClick={onPartnerCardPick}
                            onKeyDown={(e) => e.key === "Enter" && onPartnerCardPick()}
                          >
                            <h3 style={{ margin: "0 0 6px", fontSize: 18, color: "var(--brand-blue)" }}>
                              Accelerator Partner
                            </h3>
                            <p className="meta" style={{ color: "#6b7280", fontSize: 14, margin: 0 }}>
                              Cohort pipelines • Verified profiles
                            </p>
                          </article>

                          <article
                            className="card col-4 click"
                            data-type="syndicate"
                            tabIndex={0}
                            role="button"
                            aria-label="Syndicate Partner"
                            onClick={onPartnerCardPick}
                            onKeyDown={(e) => e.key === "Enter" && onPartnerCardPick()}
                          >
                            <h3 style={{ margin: "0 0 6px", fontSize: 18, color: "var(--brand-blue)" }}>
                              Syndicate Partner
                            </h3>
                            <p className="meta" style={{ color: "#6b7280", fontSize: 14, margin: 0 }}>
                              Dealrooms • Referral tracking
                            </p>
                          </article>

                          <article
                            className="card col-4 click"
                            data-type="ecosystem"
                            tabIndex={0}
                            role="button"
                            aria-label="Ecosystem Partner"
                            onClick={onPartnerCardPick}
                            onKeyDown={(e) => e.key === "Enter" && onPartnerCardPick()}
                          >
                            <h3 style={{ margin: "0 0 6px", fontSize: 18, color: "var(--brand-blue)" }}>
                              Ecosystem Partner
                            </h3>
                            <p className="meta" style={{ color: "#6b7280", fontSize: 14, margin: 0 }}>
                              Directory sync • Member verification
                            </p>
                          </article>
                        </div>
                      </section>

                      {/* STEP 2: CATALOG */}
                      <section
                        className={`route ${partnerRoute === "catalog" ? "active" : ""}`}
                        data-route="catalog"
                        aria-labelledby="catalogTitle"
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                          <h3 id="catalogTitle" style={{ color: "var(--brand-blue)", margin: 0 }}>
                            Programs
                          </h3>
                          <button className="btn secondary" id="backToChoices" type="button" aria-label="Back to choices" onClick={() => setPartnerRoute("programs")}>
                            ← Back
                          </button>
                        </div>

                        <div className="filterbar" role="search">
                          <input
                            id="catQuery"
                            type="search"
                            placeholder="Search by name, sponsor, sector"
                            aria-label="Search catalog"
                            style={{ flex: 1, minWidth: 200 }}
                          />
                          <select id="catCategory" aria-label="Program type">
                            <option value="">Program type</option>
                          </select>
                          <select id="catCountry" aria-label="Country">
                            <option value="">Country</option>
                          </select>
                          <button className="reset" id="catReset" type="button">
                            Clear
                          </button>
                        </div>

                        <div className="grid" id="cards" aria-live="polite">
                          {/* Demo card to prove navigation */}
                          <article className="card col-4 click" role="button" tabIndex={0} onClick={onPartnerProgramOpen} onKeyDown={(e) => e.key === "Enter" && onPartnerProgramOpen()}>
                            <h3 style={{ margin: "0 0 6px", fontSize: 18, color: "var(--brand-blue)" }}>
                              Sample Program
                            </h3>
                            <p className="meta" style={{ color: "#6b7280", fontSize: 14, margin: 0 }}>
                              Sponsor • Country • Sector
                            </p>
                          </article>
                        </div>

                        <div id="emptyState" style={{ display: "none", margin: "24px 0", color: "#6b7280" }}>
                          No programs match your filters.
                        </div>
                      </section>

                      {/* STEP 3: DETAILS */}
                      <section
                        className={`route ${partnerRoute === "details" ? "active" : ""}`}
                        data-route="details"
                        aria-labelledby="detailTitle"
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                          <h3 id="detailTitle" style={{ color: "var(--brand-blue)", margin: 0 }}>
                            Program Information
                          </h3>
                          <div>
                            <button className="btn secondary" id="backToCatalog" type="button" onClick={() => setPartnerRoute("catalog")}>
                              ← Back to list
                            </button>{" "}
                            <button className="btn" id="toEligibility" type="button" onClick={onPartnerEligibility}>
                              Check eligibility
                            </button>
                          </div>
                        </div>

                        <div id="progDetail" className="card">
                          <p style={{ margin: 0, color: "#6b7280" }}>
                            Program details will render here (connect to backend later).
                          </p>
                        </div>
                      </section>

                      {/* STEP 4: ELIGIBILITY */}
                      <section
                        className={`route ${partnerRoute === "eligibility" ? "active" : ""}`}
                        data-route="eligibility"
                        aria-labelledby="eligTitle"
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                          <h3 id="eligTitle" style={{ color: "var(--brand-blue)", margin: 0 }}>
                            Eligibility
                          </h3>
                          <button className="btn secondary" id="backToDetails" type="button" onClick={() => setPartnerRoute("details")}>
                            ← Back to program
                          </button>
                        </div>

                        <form
                          id="eligForm"
                          className="card"
                          noValidate
                          onSubmit={(e) => {
                            e.preventDefault();
                            alert("Eligibility submitted (demo).");
                          }}
                        >
                          <div className="grid">
                            <div className="col-4" style={{ gridColumn: "span 6" }}>
                              <label style={{ display: "block", marginBottom: 10 }}>
                                Organization Name
                                <input
                                  name="org"
                                  type="text"
                                  required
                                  style={{
                                    padding: 10,
                                    border: "1px solid var(--border)",
                                    borderRadius: 12,
                                    width: "100%",
                                    marginTop: 6,
                                  }}
                                />
                              </label>

                              <label style={{ display: "block", marginBottom: 10 }}>
                                Contact Email
                                <input
                                  name="email"
                                  type="email"
                                  required
                                  style={{
                                    padding: 10,
                                    border: "1px solid var(--border)",
                                    borderRadius: 12,
                                    width: "100%",
                                    marginTop: 6,
                                  }}
                                />
                              </label>

                              <label style={{ display: "block", marginBottom: 10 }}>
                                Country (AU 55)
                                <select
                                  name="country"
                                  required
                                  id="eligCountry"
                                  style={{
                                    padding: 10,
                                    border: "1px solid var(--border)",
                                    borderRadius: 12,
                                    width: "100%",
                                    marginTop: 6,
                                  }}
                                >
                                  <option value="">Select country</option>
                                </select>
                              </label>
                            </div>

                            <div className="col-4" style={{ gridColumn: "span 6" }}>
                              <label id="typeSpecific1" style={{ display: "block", marginBottom: 10 }}>
                                <span style={{ color: "#6b7280" }}>Type specific field 1</span>
                              </label>
                              <label id="typeSpecific2" style={{ display: "block", marginBottom: 10 }}>
                                <span style={{ color: "#6b7280" }}>Type specific field 2</span>
                              </label>
                              <label id="typeSpecific3" style={{ display: "block", marginBottom: 10 }}>
                                <span style={{ color: "#6b7280" }}>Type specific field 3</span>
                              </label>
                            </div>
                          </div>

                          <div style={{ marginTop: 12 }}>
                            <button className="btn btn-primary" type="submit">
                              Submit Application
                            </button>
                          </div>
                        </form>
                      </section>
                    </div>
                  </main>

                  {/* The original design's CSS (converted for React, hover on .card.click is neutralized by our global .card hover disable) */}
                  <style>{`
                    .grid{display:grid;grid-template-columns:repeat(12,1fr);gap:16px}
                    .col-4{grid-column:span 4}
                    @media (max-width: 920px){
                      .col-4{grid-column:span 12}
                    }
                    .route{display:none}
                    .route.active{display:block}
                    .filterbar{display:flex;gap:12px;align-items:center;margin:12px 0 14px;flex-wrap:wrap}
                    .filterbar select,.filterbar input{
                      border:1px solid var(--border);
                      border-radius:12px;
                      padding:8px 12px;
                      font-size:15px
                    }
                    .filterbar input{flex:1;min-width:200px}
                    .filterbar .reset{
                      border:0;background:#fff;border:1px solid var(--border);
                      border-radius:12px;padding:8px 14px;font-weight:700;cursor:pointer
                    }
                    .meta{color:#6b7280;font-size:14px}
                    .card.click{cursor:pointer}
                  `}</style>
                </>
              )}

              {/* ===================== MATCHING (YOUR EXISTING) ===================== */}
              {isMatching && (
                <>
                  <div className="card" style={{ margin: "18px 18px 14px" }}>
                    <div className="form-row">
                      <div>
                        <div className="label">Ticket — min</div>
                        <input
                          className="input"
                          type="number"
                          value={ticketMin}
                          onChange={(e) => setTicketMin(Number(e.target.value))}
                          min={0}
                        />
                      </div>

                      <div>
                        <div className="label">Ticket — max</div>
                        <input
                          className="input"
                          type="number"
                          value={ticketMax}
                          onChange={(e) => setTicketMax(Number(e.target.value))}
                          min={0}
                        />
                      </div>

                      <div>
                        <div className="label">Start timing (months window)</div>
                        <div className="inline-range">
                          <input
                            className="input"
                            type="number"
                            value={startFromMonth}
                            onChange={(e) => setStartFromMonth(Number(e.target.value))}
                            min={0}
                          />
                          <input
                            className="input"
                            type="number"
                            value={startToMonth}
                            onChange={(e) => setStartToMonth(Number(e.target.value))}
                            min={0}
                          />
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
                          <input
                            type="checkbox"
                            checked={funding.revenueShare}
                            onChange={() => toggleFunding("revenueShare")}
                          />
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
                          {loadingOptions
                            ? "Loading countries & sectors..."
                            : "Tip: Hold Ctrl (Windows) / Cmd (Mac) to select multiple items."}
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

                            <button
                              type="button"
                              className="ms-clear"
                              onClick={clearSectors}
                              title="Clear"
                              disabled={selectedSectorIds.length === 0}
                            >
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

                            <button
                              type="button"
                              className="ms-clear"
                              onClick={clearCountries}
                              title="Clear"
                              disabled={selectedCountryIds.length === 0}
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* ===================== OTHER SERVICES PLACEHOLDER ===================== */}
              {!isMatching && !isPartnerPrograms && (
                <div className="card" style={{ margin: 18 }}>
                  <div style={{ color: "#475569" }}>
                    Add your real content for <b>{services.find((s) => s.key === activeKey)?.title}</b> here.
                  </div>
                </div>
              )}
            </div>

            {/* Footer buttons: hide Continue for Partner Programs because it has internal flow */}
            <div className="rm-footer">
              <button type="button" className="btn" onClick={closeModal}>
                Back
              </button>

              {!isPartnerPrograms && (
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
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Services;
