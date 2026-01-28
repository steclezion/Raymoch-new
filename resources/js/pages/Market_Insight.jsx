// resources/js/components/Market_Insight.jsx
import React, { useEffect, useMemo, useState } from "react";
// Adjust this import according to your actual file/location/exports:
import Header from "../components/layout_master/Header.jsx";
import Footer from "../components/layout_master/Footer.jsx";
import AfricaInvestmentPanel from "../components/AfricaInvestmentPanel.jsx";

const Market_Insight = () => {
  // =========================
  // Tier-1 Explore menu toggle (from your script)
  // =========================
  useEffect(() => {
    const btn = document.getElementById("exploreToggle");
    const menu = document.getElementById("t1Menu");
    if (!btn || !menu) return;

    const openMenu = (on) => {
      btn.setAttribute("aria-expanded", on ? "true" : "false");
      menu.hidden = !on;
    };

    const onBtnClick = (e) => {
      e.preventDefault();
      openMenu(btn.getAttribute("aria-expanded") !== "true");
    };
    const onDocClick = (e) => {
      if (!menu.hidden && !menu.contains(e.target) && !btn.contains(e.target)) openMenu(false);
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") openMenu(false);
    };

    btn.addEventListener("click", onBtnClick);
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKeyDown);

    // A11y roles for menu items
    menu.querySelectorAll("a.menu-item").forEach((a) => a.setAttribute("role", "menuitem"));

    return () => {
      btn.removeEventListener("click", onBtnClick);
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  // =========================
  // DATA (same as your original mock DATA)
  // =========================
  const DATA = useMemo(
    () => ({
      pulse: [
        {
          headline: "SME credit up 8.4% YoY in Kenya",
          sub: "As of Sep 15, 2025 — Raymoch blend v0.1",
          ts: "2025-09-15",
        },
        {
          headline: "Nigeria FDI inflows $2.3B in Q2",
          sub: "As of Jun 30, 2025 — est.",
          ts: "2025-06-30",
        },
        {
          headline: "Ethiopia adds +15% RE capacity YoY",
          sub: "As of Sep 10, 2025 — energy desk",
          ts: "2025-09-10",
        },
      ],
      countries: [
        {
          slug: "kenya",
          name: "Kenya",
          last_updated: "2025-09-20",
          macro: { gdp_growth_yoy: 5.1, inflation_yoy: 6.3, fdi_ytd_usd_b: 1.8 },
          sme_climate: { credit_pulse_yoy: 8.4, policy_note: "New MSME collateral law (Sept 2025)" },
        },
        {
          slug: "ghana",
          name: "Ghana",
          last_updated: "2025-09-12",
          macro: { gdp_growth_yoy: 3.9, inflation_yoy: 8.7, fdi_ytd_usd_b: 1.1 },
          sme_climate: { credit_pulse_yoy: 4.2, policy_note: "FX stabilisation window for SMEs" },
        },
        {
          slug: "ethiopia",
          name: "Ethiopia",
          last_updated: "2025-09-18",
          macro: { gdp_growth_yoy: 6.5, inflation_yoy: 7.4, fdi_ytd_usd_b: 2.0 },
          sme_climate: { credit_pulse_yoy: 5.0, policy_note: "Export processing zones expansion" },
        },
      ],
      sectors: [
        {
          slug: "fintech",
          name: "FinTech",
          last_updated: "2025-09-18",
          unit_economics: { cac: 14.5, ltv: 96.0, payback_months: 7 },
          trends: ["cross-border wallets", "agent banking 2.0"],
          risk_flags: ["licensing", "mobile-money concentration"],
        },
        {
          slug: "agri",
          name: "Agriculture & Food",
          last_updated: "2025-09-14",
          unit_economics: { cac: 22.0, ltv: 72.0, payback_months: 10 },
          trends: ["cold-chain buildout", "farm-to-fintech credit"],
          risk_flags: ["weather", "price volatility"],
        },
        {
          slug: "energy",
          name: "Energy & Renewables",
          last_updated: "2025-09-16",
          unit_economics: { cac: 40.0, ltv: 240.0, payback_months: 18 },
          trends: ["micro-grids", "battery leasing"],
          risk_flags: ["capex", "policy cycles"],
        },
      ],
      themes: [
        {
          slug: "diaspora-capital",
          name: "Diaspora Capital",
          summary: "Remittance→equity bridges via SPVs & matching.",
          signals: ["bank–fintech corridors", "FX micro-hedges"],
          last_updated: "2025-09-22",
        },
        {
          slug: "logistics-bottlenecks",
          name: "Logistics Bottlenecks",
          summary: "Ports, first-mile, cold-chain gaps.",
          signals: ["bonded warehouses", "port automation"],
          last_updated: "2025-09-10",
        },
        {
          slug: "energy-transition",
          name: "Energy Transition",
          summary: "Distributed RE, PAYGO, storage.",
          signals: ["micro-grids", "EV two-wheelers"],
          last_updated: "2025-09-11",
        },
      ],
      reports: [
        {
          id: "kenya-sme-credit-pulse-q3",
          title: "Kenya SME Credit Pulse — Q3",
          type: "Investor Note",
          pages: 9,
          download_url: "#",
          tags: ["Kenya", "Credit", "SME"],
          last_updated: "2025-09-19",
        },
        {
          id: "nigeria-fintech-brief-q2",
          title: "Nigeria FinTech Brief — Q2",
          type: "Sector Note",
          pages: 7,
          download_url: "#",
          tags: ["Nigeria", "FinTech"],
          last_updated: "2025-07-05",
        },
        {
          id: "ethiopia-energy-outlook-2025",
          title: "Ethiopia Energy Outlook — 2025",
          type: "Outlook",
          pages: 11,
          download_url: "#",
          tags: ["Ethiopia", "Energy"],
          last_updated: "2025-09-10",
        },
      ],
      news: [
        {
          headline: "Nairobi fintech raises $18M Series A",
          source: "TechAfrica",
          date: "2025-09-23",
          countries: ["Kenya"],
          sectors: ["FinTech"],
          link: "#",
        },
        {
          headline: "Ethiopian agritech secures $5M logistics round",
          source: "AgriNews",
          date: "2025-09-21",
          countries: ["Ethiopia"],
          sectors: ["Agriculture"],
          link: "#",
        },
        {
          headline: "Ugandan startup pilots micro-grids in refugee settlements",
          source: "Energy Today",
          date: "2025-09-18",
          countries: ["Uganda"],
          sectors: ["Energy"],
          link: "#",
        },
      ],
      indicators: [
        { metric: "sme_credit_growth_yoy", label: "SME Credit YoY", geo: "Kenya", value: 8.4, unit: "%", as_of: "2025-09-15" },
        { metric: "fdi_inflows_q", label: "FDI inflows (quarter)", geo: "Nigeria", value: 2.3, unit: "$B", as_of: "2025-06-30" },
        { metric: "re_capacity_yoy", label: "Renewable capacity YoY", geo: "Ethiopia", value: 15, unit: "%", as_of: "2025-09-10" },
      ],
    }),
    []
  );

  // =========================
  // ROUTER STATE (replaces hash router)
  // =========================
  const [route, setRoute] = useState("home"); // home | countries | sectors | themes | reports | news | data
  const [q, setQ] = useState("");
  const [verOnly, setVerOnly] = useState(false); // kept for UI parity
  const pulse = DATA.pulse?.[0];

  // Initialize from hash + listen to hash changes (keeps your old behavior)
  useEffect(() => {
    const parseHash = () => {
      const h = (window.location.hash || "#/home").toLowerCase();
      if (h.startsWith("#/countries")) return setRoute("countries");
      if (h.startsWith("#/sectors")) return setRoute("sectors");
      if (h.startsWith("#/themes")) return setRoute("themes");
      if (h.startsWith("#/reports")) return setRoute("reports");
      if (h.startsWith("#/news")) return setRoute("news");
      if (h.startsWith("#/data")) return setRoute("data");
      return setRoute("home");
    };
    if (!window.location.hash) window.location.hash = "#/home";
    parseHash();
    window.addEventListener("hashchange", parseHash);
    return () => window.removeEventListener("hashchange", parseHash);
  }, []);

  const go = (next) => {
    const map = {
      home: "#/home",
      countries: "#/countries",
      sectors: "#/sectors",
      themes: "#/themes",
      reports: "#/reports",
      news: "#/news",
      data: "#/data",
    };
    window.location.hash = map[next] || "#/home";
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  // Search (matches your old behavior: jump to first view containing query)
  const onSearch = (e) => {
    e.preventDefault();
    const qq = (q || "").toLowerCase().trim();
    if (!qq) return;

    const contains = (obj) => JSON.stringify(obj).toLowerCase().includes(qq);

    if (contains(DATA.countries)) return go("countries");
    if (contains(DATA.sectors)) return go("sectors");
    if (contains(DATA.themes)) return go("themes");
    if (contains(DATA.reports)) return go("reports");
    if (contains(DATA.news)) return go("news");
    if (contains(DATA.indicators)) return go("data");
  };

  const kv = (k, v) => (
    <div className="kvp" key={k}>
      <span className="k">{k}</span>
      <span className="v">{v}</span>
    </div>
  );

  const css = `
/* =========================================================
   RAYMOCH COLOR SYSTEM — MASTER TOKENS (from Entire.html)
   ========================================================= */
:root{
  --brand-blue:#0328aeed;
  --brand-blue-700:#213bb1;
  --brand-blue-500:#041b64;
  --accent-gold:#7a7797a8;

  --ink:#101114;
  --muted:#3c4b69;
  --bg:#fafafa;        /* light page background */
  --border:#e8e8ee;
  --card:#ffffff;

  --radius:14px; --pill:999px;
  --shadow:0 6px 22px rgba(10,42,107,.08);
  --maxw:1328px; --gutter:18px;

  --footer-bg:#0b1020; /* single source of truth */
}

*{box-sizing:border-box;margin:0;padding:0;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif}

/* ========= Canvas + Overscroll fixes (no white under footer) ========= */
html{ background:var(--footer-bg); height:100%; }
body{
  color:var(--ink);
  line-height:1.5;
  min-height:100dvh;
  display:flex;
  flex-direction:column;
  overscroll-behavior-y:none;
  background:
    linear-gradient(to bottom,
      var(--bg) 0%,
      var(--bg) calc(100% - 240px),
      var(--footer-bg) calc(100% - 240px),
      var(--footer-bg) 100%);
}
/* iOS safe-area guard */
body::after{
  content:"";
  position:fixed;
  inset:auto 0 0 0;
  height:env(safe-area-inset-bottom, 0);
  background:var(--footer-bg);
  pointer-events:none;
  z-index:1;
}

a{color:inherit;text-decoration:none}
img{max-width:100%;display:block}
.wrap{max-width:var(--maxw);margin:0 auto;padding:0 var(--gutter)}

/* ===================== HERO (page-specific) ===================== */
.hero{padding:36px 0 8px}
.hero h1{font-size:40px;color:var(--brand-blue-700);margin:0 0 6px}
.hero p{color:var(--muted);margin:0}
.pulse{display:flex;align-items:center;gap:12px;margin:18px 0 26px;padding:12px 16px;background:#fff;border:1px solid var(--border);border-radius:var(--pill);box-shadow:var(--shadow)}
.pulse .dot{width:10px;height:10px;border-radius:50%;background:var(--accent-gold);animation:pulse 2s infinite}
@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(122,119,151,.35)}70%{box-shadow:0 0 0 12px rgba(122,119,151,0)}100%{box-shadow:0 0 0 0 rgba(122,119,151,0)}}
.badge{background:var(--accent-gold);color:#111;font-size:12px;padding:2px 8px;border-radius:var(--pill);font-weight:700}
.searchbar{display:flex;align-items:center;gap:12px;padding:12px 14px;background:#fff;border:1px solid var(--border);border-radius:var(--pill);box-shadow:var(--shadow)}
.searchbar input{flex:1;border:0;outline:0;font-size:15px;background:transparent}
.toggle{display:flex;align-items:center;gap:8px;margin-left:auto}

.container{max-width:1100px;margin:0 auto;padding:32px 20px}
.grid{display:grid;grid-template-columns:repeat(6,1fr);gap:18px;margin:24px 0 8px}
.card{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);padding:18px;cursor:pointer;transition:transform .12s ease}
.card:hover{transform:translateY(-2px)}
.card h3{font-size:18px;margin:0 0 6px;color:var(--brand-blue-700)}
.card p{color:var(--muted);margin:0}

.section{margin:26px 0}
.section h2{font-size:22px;color:var(--brand-blue-700);margin:0 0 10px}
.kv{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:10px 0}
.kv .kvp{background:#fff;border:1px solid var(--border);border-radius:12px;padding:12px}
.kv .k{display:block;color:var(--muted);font-size:12px}
.kv .v{display:block;font-weight:700}
.item{display:flex;justify-content:space-between;align-items:center;background:#fff;border:1px solid var(--border);border-radius:12px;padding:14px 16px;margin-top:10px}
.item .meta{color:var(--muted);font-size:13px}
.btn{padding:8px 14px;border-radius:var(--pill);background:var(--brand-blue-700);color:#fff}
.tags{display:flex;gap:8px;flex-wrap:wrap}
.tag{font-size:12px;padding:3px 8px;border:1px solid var(--border);border-radius:var(--pill);color:#374151;background:#fff}
.note{color:var(--muted);font-size:13px}
.table{width:100%;border-collapse:separate;border-spacing:0 8px}
.table th{font-size:12px;color:#6b7280;text-align:left;padding:0 10px}
.table td{background:#fff;border:1px solid var(--border);padding:12px 10px}
.table td:first-child{border-top-left-radius:12px;border-bottom-left-radius:12px}
.table td:last-child{border-top-right-radius:12px;border-bottom-right-radius:12px}

/* responsive */
@media (max-width: 1100px){ .grid{grid-template-columns:repeat(3,1fr);} }
@media (max-width: 720px){
  .grid{grid-template-columns:1fr;}
  .pulse{flex-wrap:wrap;border-radius:16px;}
  .searchbar{flex-wrap:wrap;border-radius:16px;}
  .toggle{margin-left:0}
  .kv{grid-template-columns:1fr;}
}

/* a11y */
.header a:focus-visible, .header button:focus-visible, .btn:focus-visible { outline: 2px solid #cfe0ff; outline-offset: 2px; }
@media (prefers-reduced-motion: reduce){ .pulse .dot{ animation: none !important; } }
`;

  return (
    <>
      <style>{css}</style>

      <Header />

      <main className="container">
        <section className="hero">
          <h1>Market Insights</h1>
          <p>Country snapshots, sector briefs, and real-world signals — minus the noise.</p>

          <div className="pulse" aria-live="polite">
            <span className="dot" aria-hidden="true" />
            <span className="badge" id="pulse-badge">
              Latest
            </span>
            <strong id="pulse-headline">{pulse?.headline || "Loading…"}</strong>
            <span id="pulse-sub" className="note">
              {pulse?.sub || "As of —"}
            </span>
          </div>

          <form className="searchbar" onSubmit={onSearch}>
            <input
              id="q"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search insights, reports, countries, or sectors…"
            />
            <div className="toggle">
              <input
                type="checkbox"
                id="verOnly"
                checked={verOnly}
                onChange={(e) => setVerOnly(e.target.checked)}
              />
              <label htmlFor="verOnly">Raymoch-verified only</label>
            </div>
            <button className="btn" type="submit" id="searchBtn">
              Search
            </button>
          </form>
        </section>

        <div className="subnav" style={{ margin: "14px 0 8px", display: "flex", flexWrap: "wrap", gap: 8 }}>
          <a className="tag" href="#/countries" onClick={(e) => (e.preventDefault(), go("countries"))}>
            Countries
          </a>
          <a className="tag" href="#/sectors" onClick={(e) => (e.preventDefault(), go("sectors"))}>
            Sectors
          </a>
          <a className="tag" href="#/themes" onClick={(e) => (e.preventDefault(), go("themes"))}>
            Themes
          </a>
          <a className="tag" href="#/reports" onClick={(e) => (e.preventDefault(), go("reports"))}>
            Reports
          </a>
          <a className="tag" href="#/news" onClick={(e) => (e.preventDefault(), go("news"))}>
            News &amp; Deals
          </a>
          <a className="tag" href="#/data" onClick={(e) => (e.preventDefault(), go("data"))}>
            Data Explorer
          </a>
        </div>

        {/* HOME GRID */}
        {route === "home" && (
          <section id="view-home">
            <div className="grid" id="grid">
              <a className="card" href="#/countries" onClick={(e) => (e.preventDefault(), go("countries"))}>
                <h3>Countries</h3>
                <p>Macro, FDI, SME climate, policy notes.</p>
              </a>
              <a className="card" href="#/sectors" onClick={(e) => (e.preventDefault(), go("sectors"))}>
                <h3>Sectors</h3>
                <p>Trends, unit economics, risk flags.</p>
              </a>
              <a className="card" href="#/themes" onClick={(e) => (e.preventDefault(), go("themes"))}>
                <h3>Themes</h3>
                <p>Cross-cutting plays: diaspora capital, logistics…</p>
              </a>
              <a className="card" href="#/reports" onClick={(e) => (e.preventDefault(), go("reports"))}>
                <h3>Reports</h3>
                <p>Investor notes &amp; downloadable snapshots.</p>
              </a>
              <a className="card" href="#/news" onClick={(e) => (e.preventDefault(), go("news"))}>
                <h3>News &amp; Deals</h3>
                <p>Raises, exits, and policy moves that matter.</p>
              </a>
              <a className="card" href="#/data" onClick={(e) => (e.preventDefault(), go("data"))}>
                <h3>Data Explorer</h3>
                <p>Time series &amp; comparables.</p>
              </a>
            </div>

       
          </section>
        )}

        {/* COUNTRIES */}
        {route === "countries" && (
          <section id="view-countries" className="section">
            <h2>
              Countries <span className="note">(Regional Briefs)</span>
            </h2>

            {DATA.countries.map((c) => (
              <div className="item" key={c.slug}>
                <div>
                  <strong>{c.name}</strong>
                  <div className="meta">Last updated: {c.last_updated}</div>

                  <div className="kv">
                    {kv("GDP growth (YoY)", `${c.macro.gdp_growth_yoy}%`)}
                    {kv("Inflation (YoY)", `${c.macro.inflation_yoy}%`)}
                    {kv("FDI inflows (YTD)", `$${c.macro.fdi_ytd_usd_b}B`)}
                    {kv("SME credit (YoY)", `+${c.sme_climate.credit_pulse_yoy}%`)}
                    {kv("Policy note", c.sme_climate.policy_note)}
                  </div>
                </div>
                <a className="btn" href="#">
                  Open brief
                </a>
              </div>
            ))}
          </section>
        )}

        {/* SECTORS */}
        {route === "sectors" && (
          <section id="view-sectors" className="section">
            <h2>
              Sectors <span className="note">(Sector Reports)</span>
            </h2>

            <table className="table">
              <thead>
                <tr>
                  <th>Sector</th>
                  <th>Trends</th>
                  <th>Unit economics</th>
                  <th>Risks</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                {DATA.sectors.map((s) => {
                  const ue = `CAC $${s.unit_economics.cac} • LTV $${s.unit_economics.ltv} • Payback ${s.unit_economics.payback_months}m`;
                  return (
                    <tr key={s.slug}>
                      <td>{s.name}</td>
                      <td>{s.trends.join(", ")}</td>
                      <td>{ue}</td>
                      <td>{s.risk_flags.join(", ")}</td>
                      <td>{s.last_updated}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        )}

        {/* THEMES */}
        {route === "themes" && (
          <section id="view-themes" className="section">
            <h2>Themes</h2>

            {DATA.themes.map((t) => (
              <div className="item" key={t.slug}>
                <div>
                  <strong>{t.name}</strong>
                  <div className="meta">Last updated: {t.last_updated}</div>
                  <div className="note">{t.summary}</div>

                  <div className="tags" style={{ marginTop: 8 }}>
                    {t.signals.map((s) => (
                      <span className="tag" key={s}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <a className="btn" href="#">
                  Open theme
                </a>
              </div>
            ))}
          </section>
        )}

        {/* REPORTS */}
        {route === "reports" && (
          <section id="view-reports" className="section">
            <h2>Reports</h2>

            {DATA.reports.map((r) => (
              <div className="item" key={r.id}>
                <div>
                  <strong>{r.title}</strong>
                  <div className="meta">
                    {r.type} • {r.pages} pages • Updated: {r.last_updated}
                  </div>

                  <div className="tags" style={{ marginTop: 8 }}>
                    {r.tags.map((t) => (
                      <span className="tag" key={t}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <a className="btn" href={r.download_url}>
                  Download
                </a>
              </div>
            ))}
          </section>
        )}

        {/* NEWS */}
        {route === "news" && (
          <section id="view-news" className="section">
            <h2>
              News &amp; Deals <span className="note">(curated)</span>
            </h2>

            {DATA.news.map((n, idx) => (
              <div className="item" key={`${n.date}-${idx}`}>
                <div>
                  <strong>{n.headline}</strong>
                  <div className="meta">
                    {n.source} • {n.date}
                  </div>

                  <div className="tags" style={{ marginTop: 8 }}>
                    {n.countries.map((c) => (
                      <span className="tag" key={`c-${c}`}>
                        {c}
                      </span>
                    ))}
                    {n.sectors.map((s) => (
                      <span className="tag" key={`s-${s}`}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <a className="btn" href={n.link}>
                  Read
                </a>
              </div>
            ))}
          </section>
        )}

        {/* DATA EXPLORER */}
        {route === "data" && (
          <section id="view-data" className="section">
            <h2>
              Data Explorer <span className="note">(Benchmarks &amp; Indicators)</span>
            </h2>

            <table className="table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Geo</th>
                  <th>Value</th>
                  <th>As of</th>
                </tr>
              </thead>
              <tbody>
                {DATA.indicators.map((m) => (
                  <tr key={m.metric + m.geo}>
                    <td>{m.label}</td>
                    <td>{m.geo}</td>
                    <td>
                      <strong>{m.value}</strong> {m.unit}
                    </td>
                    <td>{m.as_of}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
};

export default Market_Insight;
