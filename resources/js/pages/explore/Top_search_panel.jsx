import React, { useMemo } from "react";

const css = `
/* ===== Wrapper required by task ===== */
.panel-wrap{
  width:100%;
  display:flex;
  justify-content:center;
}

/* ===== Card shell ===== */
.sf-card{
  width:100%;
  background:#fff;
  border:1px solid #e6e9f2;
  border-radius:26px;
  overflow:hidden;
  box-shadow: 0 10px 26px rgba(10,42,107,.10);
}

/* ===== Top gradient header ===== */
.sf-topbar{
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap:14px;
  padding:18px 22px;
  background: linear-gradient(135deg, #0A2A6B 0%, #1e3a8a 55%, #2d4fbf 100%);
  color:#fff;
}

.sf-title{
  font-weight:900;
  letter-spacing:.3px;
  font-size:18px;
  line-height:1.15;
  text-transform:uppercase;
}

.sf-sub{
  margin-top:4px;
  color:rgba(255,255,255,.88);
  font-size:13px;
}

/* ===== Verified pill (top-right) ===== */
.sf-badge{
  display:inline-flex;
  align-items:center;
  gap:8px;
  padding:8px 12px;
  border-radius:999px;
  font-weight:800;
  font-size:13px;
  white-space:nowrap;
  background: rgba(255,255,255,.18);
  border:1px solid rgba(255,255,255,.25);
  box-shadow: inset 0 0 0 1px rgba(0,0,0,.05);
}
.sf-badge .check{
  width:18px;height:18px;
  display:inline-grid;
  place-items:center;
  border-radius:6px;
  background: rgba(255,255,255,.18);
  border:1px solid rgba(255,255,255,.25);
  font-size:12px;
}
.sf-badge.on{
  background: rgba(34,197,94,.18);
  border-color: rgba(34,197,94,.28);
}
.sf-badge.off{
  background: rgba(255,255,255,.18);
}

/* ===== Body ===== */
.sf-body{
  padding:18px 22px 16px;
}

/* Row with fields */
.sf-row{
  display:grid;
  grid-template-columns: 1.55fr 1fr 1fr auto;
  gap:18px;
  align-items:end;
}

/* Labels above fields */
.sf-label{
  display:block;
  font-size:13px;
  color:#6b7280;
  margin:0 0 6px 14px;
}

/* Input group: icon + field */
.sf-field{
  position:relative;
  width:100%;
}
.sf-icon{
  position:absolute;
  left:16px;
  top:50%;
  transform:translateY(-50%);
  width:18px;
  height:18px;
  opacity:.70;
}

/* Base pill field */
.sf-input, .sf-select{
  width:100%;
  height:50px;
  border-radius:999px;
  border:1px solid #e5e7eb;
  background:#fff;
  padding:0 44px 0 46px; /* space for left icon + right arrow */
  font-size:15px;
  outline:none;
  box-shadow: 0 2px 10px rgba(15,23,42,.04);
}
.sf-input::placeholder{ color:#9ca3af; }

.sf-input:focus, .sf-select:focus{
  border-color:#9db7ff;
  box-shadow: 0 0 0 4px rgba(59,130,246,.14);
}

/* Select arrow (custom) */
.sf-select{
  appearance:none;
  -webkit-appearance:none;
  -moz-appearance:none;
  padding-right:46px;
}
.sf-arrow{
  position:absolute;
  right:18px;
  top:50%;
  transform:translateY(-50%);
  width:14px;height:14px;
  opacity:.60;
  pointer-events:none;
}

/* Verified only toggle */
.sf-verify{
  display:flex;
  align-items:center;
  gap:12px;
  padding-bottom:8px;
  justify-content:flex-end;
}
.sf-verify .txt{
  font-weight:800;
  color:#0f172a;
  white-space:nowrap;
}

/* Switch */
.sf-switch{
  position:relative;
  width:52px;height:28px;
  display:inline-block;
}
.sf-switch input{ display:none; }
.sf-slider{
  position:absolute; inset:0;
  background:#e5e7eb;
  border-radius:999px;
  transition:.18s ease;
  border:1px solid #e5e7eb;
}
.sf-slider::after{
  content:"";
  position:absolute;
  left:3px; top:3px;
  width:22px; height:22px;
  background:#fff;
  border-radius:50%;
  box-shadow: 0 6px 14px rgba(0,0,0,.15);
  transition:.18s ease;
}
.sf-switch input:checked + .sf-slider{
  background:#3b82f6;
  border-color:#3b82f6;
}
.sf-switch input:checked + .sf-slider::after{
  transform:translateX(24px);
}

/* Divider */
.sf-divider{
  height:1px;
  background:#eef2f7;
  margin:16px 0 14px;
}

/* Bottom actions */
.sf-actions{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:14px;
}
.sf-left-actions{
  display:flex;
  align-items:center;
  gap:12px;
  flex-wrap:wrap;
}

/* Buttons */
.sf-btn{
  height:46px;
  border-radius:999px;
  padding:0 18px;
  font-weight:900;
  cursor:pointer;
  border:1px solid transparent;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:10px;
  text-decoration:none;
  user-select:none;
  -webkit-tap-highlight-color: transparent;
}

.sf-btn.ghost{
  background:#fff;
  border-color:#d7e2f5;
  color:#2d4fbf;
}
.sf-btn.outline{
  background:#fff;
  border-color:#d7e2f5;
  color:#2d4fbf;
}
.sf-btn.primary{
  min-width:170px;
  background: linear-gradient(135deg,#3b82f6,#2d4fbf);
  border-color: transparent;
  color:#fff;
  box-shadow: 0 10px 18px rgba(59,130,246,.25);
}
.sf-btn.primary:active{ transform:translateY(1px); }

/* Hover: keep clean, no layout change */
.sf-btn:hover{ filter:brightness(.98); }

/* Responsive */
@media (max-width: 980px){
  .sf-row{
    grid-template-columns: 1fr 1fr;
    align-items:end;
  }
  .sf-verify{
    grid-column: 1 / -1;
    justify-content:flex-start;
    padding-left:6px;
  }
  .sf-actions{
    flex-direction:column;
    align-items:stretch;
  }
  .sf-left-actions{
    justify-content:flex-start;
  }
  .sf-btn.primary{
    width:100%;
  }
}
@media (max-width: 560px){
  .sf-row{ grid-template-columns: 1fr; }
  .sf-label{ margin-left:8px; }
  .sf-body{ padding:16px 14px 14px; }
  .sf-topbar{ padding:16px 14px; }
}
`;

/* Simple inline icons (match screenshot feel) */
function IconSearch(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M16.6 16.6 21 21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconGlobe(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M2 12h20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 2c3 3 3 17 0 20M12 2c-3 3-3 17 0 20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconBriefcase(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M9 7V6a3 3 0 0 1 6 0v1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M4 8h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M4 12h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconChevronDown(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function TopSearchPanel({
  q,
  setQ,
  country,
  setCountry,
  sector,
  setSector,
  verified,
  setVerified,
  countries,
  sectors,
  onSearch,
}) {
  const sectorOptions = useMemo(() => sectors.map((s) => s.title), [sectors]);

  const clearAll = () => {
    setQ("");
    setCountry("");
    setSector("");
    setVerified(false);
  };

  return (
    <>
      <style>{css}</style>

      <div className="panel-wrap">
        <form className="sf-card" onSubmit={onSearch}>
          {/* Header strip */}
          <div className="sf-topbar">
            <div>
              <div className="sf-title">SEARCH &amp; FILTERS</div>
              <div className="sf-sub">
                Use filters below to open the company list with matching results.
              </div>
            </div>

            <div className={`sf-badge ${verified ? "on" : "off"}`}>
              <span className="check">✓</span>
              Verified: {verified ? "ON" : "OFF"}
            </div>
          </div>

          {/* Body */}
          <div className="sf-body">
            <div className="sf-row">
              {/* Keyword */}
              <div>
                <label className="sf-label">Keyword</label>
                <div className="sf-field">
                  <IconSearch className="sf-icon" style={{ color: "#111827" }} />
                  <input
                    className="sf-input"
                    type="search"
                    placeholder="Search businesses..."
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                  />
                </div>
              </div>

              {/* Country */}
              <div>
                <label className="sf-label">Country</label>
                <div className="sf-field">
                  <IconGlobe className="sf-icon" style={{ color: "#111827" }} />
                  <select
                    className="sf-select"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    aria-label="Country"
                  >
                    <option value="">Select country</option>
                    {countries.map((c) => (
                      <option key={c.id} value={c.country_name}>
                        {c.country_name}
                      </option>
                    ))}
                  </select>
                  <IconChevronDown className="sf-arrow" style={{ color: "#111827" }} />
                </div>
              </div>

              {/* Sector */}
              <div>
                <label className="sf-label">Sector</label>
                <div className="sf-field">
                  <IconBriefcase className="sf-icon" style={{ color: "#111827" }} />
                  <select
                    className="sf-select"
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    aria-label="Sector"
                  >
                    <option value="">Select sector</option>
                    {sectorOptions.map((t, i) => (
                      <option key={i} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <IconChevronDown className="sf-arrow" style={{ color: "#111827" }} />
                </div>
              </div>

              {/* Verified toggle */}
              <div className="sf-verify" aria-label="Verified only">
                <label className="sf-switch" title="Verified only">
                  <input
                    type="checkbox"
                    checked={verified}
                    onChange={(e) => setVerified(e.target.checked)}
                  />
                  <span className="sf-slider" />
                </label>
                <div className="txt">Verified only</div>
              </div>
            </div>

            <div className="sf-divider" />

            {/* Actions */}
            <div className="sf-actions">
              <div className="sf-left-actions">
                <button type="button" className="sf-btn ghost" onClick={clearAll}>
                  Clear
                </button>

                <a className="sf-btn outline" href="/companies">
                  All Companies <span aria-hidden="true">↗</span>
                </a>
              </div>

              <button type="submit" className="sf-btn primary">
                Search
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
