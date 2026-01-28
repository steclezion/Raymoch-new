// resources/js/components/AfricaInvestmentPanel.jsx
import React, { useEffect, useMemo, useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

/** -------------------- fallback seed (keeps UI working) -------------------- */
const fallbackCompanies = [
  {
    id: "NPN",
    name: "Naspers",
    country: "ZA",
    sector: "Technology",
    capexUsd: 520000000,
    status: "Active",
    trendPct: 1.42,
    sectorsBreakdown: [
      { name: "Tech", value: 55 },
      { name: "Media", value: 30 },
      { name: "Fintech", value: 15 },
    ],
  },
  {
    id: "MTN",
    name: "MTN Group",
    country: "ZA",
    sector: "Telecom",
    capexUsd: 310000000,
    status: "Active",
    trendPct: 0.78,
    sectorsBreakdown: [
      { name: "Mobile", value: 70 },
      { name: "Data", value: 20 },
      { name: "Fintech", value: 10 },
    ],
  },
  {
    id: "KCB",
    name: "KCB Group",
    country: "KE",
    sector: "Banking",
    capexUsd: 95000000,
    status: "Active",
    trendPct: 0.25,
    sectorsBreakdown: [
      { name: "Retail", value: 45 },
      { name: "SME", value: 35 },
      { name: "Corporate", value: 20 },
    ],
  },
  {
    id: "SCB",
    name: "Stanbic IBTC",
    country: "NG",
    sector: "Banking",
    capexUsd: 120000000,
    status: "Active",
    trendPct: -0.12,
    sectorsBreakdown: [
      { name: "Retail", value: 40 },
      { name: "Corporate", value: 45 },
      { name: "Investment", value: 15 },
    ],
  },
  {
    id: "ETHB",
    name: "EthioBank",
    country: "ET",
    sector: "Banking",
    capexUsd: 60000000,
    status: "Active",
    trendPct: 0.05,
    sectorsBreakdown: [
      { name: "Retail", value: 60 },
      { name: "Corporate", value: 25 },
      { name: "SME", value: 15 },
    ],
  },
  {
    id: "EGX-INF",
    name: "Egypt Infra Holdings",
    country: "EG",
    sector: "Infrastructure",
    capexUsd: 210000000,
    status: "Expansion",
    trendPct: 0.61,
    sectorsBreakdown: [
      { name: "Transport", value: 40 },
      { name: "Energy", value: 35 },
      { name: "Water", value: 25 },
    ],
  },
];

/** -------------------- Utilities -------------------- */
const formatMoney = (n) => {
  const v = Number(n);
  if (!Number.isFinite(v)) return "—";
  if (v >= 1e12) return `$${(v / 1e12).toFixed(2)}T`;
  if (v >= 1e9) return `$${(v / 1e9).toFixed(2)}B`;
  if (v >= 1e6) return `$${(v / 1e6).toFixed(2)}M`;
  return `$${v.toLocaleString()}`;
};

const formatPct = (n) => {
  const v = Number(n);
  if (!Number.isFinite(v)) return "—";
  const sign = v > 0 ? "+" : "";
  return `${sign}${v.toFixed(2)}%`;
};

const PIE_COLORS = [
  "#2563eb",
  "#16a34a",
  "#dc2626",
  "#7c3aed",
  "#ea580c",
  "#0891b2",
  "#ca8a04",
  "#0f766e",
  "#be185d",
  "#4b5563",
];

export default function AfricaInvestmentPanel({
  apiEndpoint = "/api/africa/companies",
  pollMs = 0,
  className = "",
}) {
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(48);
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("ALL");
  const [sortMode, setSortMode] = useState("trend"); // trend | capex | name
  const [companies, setCompanies] = useState(fallbackCompanies);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [selectedId, setSelectedId] = useState(fallbackCompanies?.[0]?.id || null);

  // Fetch companies
  useEffect(() => {
    let alive = true;
    let timer = null;

    const load = async () => {
      try {
        const res = await fetch(apiEndpoint, {
          method: "GET",
          headers: { Accept: "application/json" },
          credentials: "same-origin",
        });
        const json = await res.json().catch(() => null);
        if (!alive) return;

        if (!res.ok || !json?.ok || !Array.isArray(json?.companies)) return;

        setCompanies(json.companies);
        setUpdatedAt(json.updatedAt || new Date().toISOString());
        setSelectedId((prev) => {
          if (prev && json.companies.some((c) => c.id === prev)) return prev;
          return json.companies?.[0]?.id || null;
        });
      } catch {
        // keep fallback
      }
    };

    load();

    if (pollMs > 0 && !paused) timer = setInterval(load, pollMs);

    return () => {
      alive = false;
      if (timer) clearInterval(timer);
    };
  }, [apiEndpoint, pollMs, paused]);

  const countries = useMemo(() => {
    const s = new Set(companies.map((c) => (c.country || "—").toUpperCase()));
    return ["ALL", ...Array.from(s).sort()];
  }, [companies]);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = companies;

    if (country !== "ALL") list = list.filter((c) => (c.country || "").toUpperCase() === country);

    if (q) {
      list = list.filter((c) => {
        const name = (c.name || "").toLowerCase();
        const id = (c.id || "").toLowerCase();
        const sec = (c.sector || "").toLowerCase();
        return name.includes(q) || id.includes(q) || sec.includes(q);
      });
    }

    return [...list].sort((a, b) => {
      if (sortMode === "capex") return (b.capexUsd || 0) - (a.capexUsd || 0);
      if (sortMode === "name") return String(a.name || "").localeCompare(String(b.name || ""));
      return (b.trendPct || 0) - (a.trendPct || 0);
    });
  }, [companies, country, search, sortMode]);

  const selected = useMemo(
    () => rows.find((c) => c.id === selectedId) || rows[0] || null,
    [rows, selectedId]
  );

  const pieData = useMemo(() => {
    const d = selected?.sectorsBreakdown;
    if (Array.isArray(d) && d.length) {
      return d
        .map((x) => ({
          name: String(x.name || "Unknown"),
          value: Math.max(0.01, Number(x.value || 0)),
        }))
        .filter((x) => x.value > 0);
    }
    return [
      { name: "Core", value: 60 },
      { name: "Growth", value: 25 },
      { name: "Other", value: 15 },
    ];
  }, [selected]);

  const statCompanies = rows.length;
  const statCapex = useMemo(() => rows.reduce((s, c) => s + (Number(c.capexUsd) || 0), 0), [rows]);

  const trendClass = selected?.trendPct > 0 ? "pos" : selected?.trendPct < 0 ? "neg" : "";

  return (
    <section className={`rm-panel ${className}`} aria-label="Africa Investment Panel">
      <style>{panelCss}</style>

      <div className="rm-shell">
        <div className="rm-surface">
          {/* Header */}
          <header className="rm-head">
            <div className="rm-headLeft">
              <div className="rm-titleRow">
                <h2 className="rm-title">Africa Investment Panel</h2>
                <span className="rm-live">Live</span>
              </div>
              <p className="rm-sub">
                Market pulse + sector mix • Tap any company to update chart
              </p>
            </div>

            <div className="rm-headRight">
              <div className="rm-updated">
                Updated: <strong>{updatedAt ? new Date(updatedAt).toLocaleString() : "—"}</strong>
              </div>

              <div className="rm-actions">
                <button type="button" className="rm-btn" onClick={() => setPaused((v) => !v)}>
                  {paused ? "Resume" : "Pause"}
                </button>

                <div className="rm-speed">
                  <span className="rm-speedLabel">Speed</span>
                  <input
                    aria-label="Ticker speed"
                    type="range"
                    min="20"
                    max="80"
                    value={speed}
                    step="2"
                    onChange={(e) => setSpeed(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </header>

          {/* Country chips (horizontal scroll on mobile) */}
          <div className="rm-chips" role="tablist" aria-label="Country filter">
            <button
              type="button"
              className={`rm-chip ${country === "ALL" ? "active" : ""}`}
              onClick={() => setCountry("ALL")}
            >
              ALL
            </button>

            {countries
              .filter((c) => c !== "ALL")
              .map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`rm-chip ${country === c ? "active" : ""}`}
                  onClick={() => setCountry(c)}
                  title={`Filter: ${c}`}
                >
                  {c}
                </button>
              ))}
          </div>

          {/* Main responsive layout */}
          <div className="rm-grid">
            {/* Left column */}
            <aside className="rm-card">
              <div className="rm-cardTop">
                <div className="rm-badge mono">{country === "ALL" ? "AFRICA" : country}</div>
                <div className="rm-selected">
                  Selected:{" "}
                  <strong>{selected ? `${selected.name} (${selected.id})` : "—"}</strong>
                </div>
              </div>

              <div className="rm-stats">
                <div className="rm-stat">
                  <div className="rm-statLabel">Companies</div>
                  <div className="rm-statValue">{statCompanies.toLocaleString()}</div>
                </div>

                <div className="rm-stat">
                  <div className="rm-statLabel">Total CAPEX</div>
                  <div className="rm-statValue">{formatMoney(statCapex)}</div>
                </div>

                <div className="rm-stat">
                  <div className="rm-statLabel">Primary sector</div>
                  <div className="rm-statValue">{selected?.sector || "—"}</div>
                </div>

                <div className="rm-stat">
                  <div className="rm-statLabel">Trend</div>
                  <div className={`rm-statValue ${trendClass}`}>
                    {selected ? formatPct(selected.trendPct) : "—"}
                  </div>
                </div>
              </div>

              <div className="rm-chartHead">
                <div>
                  <div className="rm-chartTitle">Sector Breakdown</div>
                  <div className="rm-chartSub">{selected?.name || "—"}</div>
                </div>
              </div>

              <div className="rm-chartBox">
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius="55%"
                      outerRadius="85%"
                      paddingAngle={2}
                    >
                      {pieData.map((_, idx) => (
                        <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="rm-hint">Tip: tap a row to update the chart instantly.</div>
            </aside>

            {/* Right column */}
            <section className="rm-card">
              <div className="rm-tableHead">
                <div>
                  <div className="rm-cardTitle">Private Investment Plans</div>
                  <div className="rm-cardSub">
                    Sorted by {sortMode === "trend" ? "trend" : sortMode}.
                  </div>
                </div>

                {/* Stable controls (won’t jump on empty results) */}
                <div className="rm-controlsRow">
                  <select className="rm-select" value={sortMode} onChange={(e) => setSortMode(e.target.value)}>
                    <option value="trend">Sort: Trend</option>
                    <option value="capex">Sort: CAPEX</option>
                    <option value="name">Sort: Name</option>
                  </select>

                  <input
                    className="rm-input"
                    placeholder="Search company/sector…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* Table wrapper: internal scroll + mobile horizontal scroll */}
              <div className="rm-tableWrap" role="region" aria-label="Companies table">
                <table className="rm-table">
                  <thead>
                    <tr>
                      <th style={{ minWidth: 220 }}>Company</th>
                      <th style={{ minWidth: 140 }}>Sector</th>
                      <th className="tr" style={{ minWidth: 120 }}>
                        CAPEX
                      </th>
                      <th className="tr" style={{ minWidth: 90 }}>
                        Trend
                      </th>
                      <th style={{ minWidth: 120 }}>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {rows.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="rm-empty">
                          No results…
                        </td>
                      </tr>
                    ) : (
                      rows.map((c) => {
                        const active = c.id === selected?.id;
                        return (
                          <tr
                            key={c.id}
                            className={`rm-row ${active ? "active" : ""}`}
                            onClick={() => setSelectedId(c.id)}
                            role="button"
                            title="Click to update chart"
                          >
                            <td>
                              <div className="rm-company">{c.name}</div>
                              <div className="rm-muted mono">
                                {c.id} • {c.country}
                              </div>
                            </td>
                            <td className="nowrap">{c.sector || "—"}</td>
                            <td className="tr mono">{formatMoney(c.capexUsd)}</td>
                            <td className="tr mono">
                              <span className={c.trendPct > 0 ? "pos" : c.trendPct < 0 ? "neg" : ""}>
                                {formatPct(c.trendPct)}
                              </span>
                            </td>
                            <td className="nowrap">{c.status || "—"}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <div className="rm-foot">
                Showing <strong>{rows.length.toLocaleString()}</strong>{" "}
                {country === "ALL" ? "companies across Africa" : `companies in ${country}`}.
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * ✅ RESPONSIVE RULES:
 * - No global html/body changes (prevents scroll bugs)
 * - Chips row scrolls horizontally
 * - Two-column on desktop, one-column on mobile
 * - Table scrolls inside wrapper (Y + X)
 * - No “squeezed text” on mobile
 */
const panelCss = `
.rm-panel{
  --rm-ink: var(--ink, #0f172a);
  --rm-muted: #64748b;
  --rm-border: var(--border, rgba(226,232,240,.9));
  --rm-card: var(--card, #fff);
  --rm-shadow: var(--shadow, 0 12px 34px rgba(2,6,23,.08));
  --rm-radius: var(--radius, 16px);
  --rm-blue: var(--brand-blue, #0328aeed);
  --rm-blue-700: var(--brand-blue-700, #213bb1);
  --rm-blue-500: var(--brand-blue-500, #041b64);
  color: var(--rm-ink);
}

.rm-panel, .rm-panel *{ box-sizing: border-box; }
.rm-panel{ width: 100%; max-width: 100%; overflow-x: hidden; } /* only within component */

.mono{
  font-variant-numeric: tabular-nums;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
.pos{ color:#166534; font-weight:800; }
.neg{ color:#b91c1c; font-weight:800; }
.tr{ text-align:right; }
.nowrap{ white-space: nowrap; }

.rm-shell{
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
}

.rm-surface{
  background: linear-gradient(180deg, rgba(255,255,255,.92), rgba(255,255,255,1));
  border: 1px solid var(--rm-border);
  border-radius: calc(var(--rm-radius) + 6px);
  box-shadow: var(--rm-shadow);
  padding: 14px;
}

/* Header becomes stacked on small screens */
.rm-head{
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding-bottom: 10px;
}

.rm-titleRow{
  display:flex;
  align-items:center;
  gap: 10px;
  flex-wrap: wrap;
}
.rm-title{
  margin:0;
  font-size: 18px;
  font-weight: 950;
  letter-spacing: .2px;
}
.rm-sub{
  margin: 6px 0 0;
  color: var(--rm-muted);
  font-size: 13px;
  line-height: 1.35;
}

.rm-live{
  display:inline-flex;
  align-items:center;
  padding: 6px 10px;
  border-radius: 999px;
  font-weight: 950;
  font-size: 12px;
  color:#fff;
  background: linear-gradient(135deg, var(--rm-blue-700), var(--rm-blue-500));
  box-shadow: 0 6px 16px rgba(4,27,100,.18);
}

.rm-updated{ color: var(--rm-muted); font-size: 13px; }

.rm-actions{
  display:flex;
  align-items:center;
  gap: 10px;
  flex-wrap: wrap;
}

.rm-btn{
  border-radius: 12px;
  padding: 10px 12px;
  font-weight: 900;
  border: 1px solid #dbe4ff;
  background: #f5f8ff;
  color: #0a1f44;
  cursor: pointer;
}
.rm-btn:hover{ background:#eef3ff; border-color:#c9d4ff; }

.rm-speed{
  display:flex;
  align-items:center;
  gap: 10px;
  padding: 8px 10px;
  border: 1px solid var(--rm-border);
  border-radius: 12px;
  background: #fff;
}
.rm-speedLabel{ font-size: 12px; color: var(--rm-muted); font-weight: 900; }
.rm-speed input{ accent-color: var(--rm-blue-700); }

/* Chips row: always scrollable on mobile */
.rm-chips{
  display:flex;
  gap: 8px;
  overflow-x: auto;
  padding: 8px 0 6px;
  -webkit-overflow-scrolling: touch;
}
.rm-chip{
  flex: 0 0 auto;
  border: 1px solid rgba(226,232,240,.9);
  background: #f8fafc;
  color: #0f172a;
  padding: 8px 10px;
  border-radius: 999px;
  font-weight: 900;
  font-size: 12px;
  cursor: pointer;
}
.rm-chip.active{
  background: #eef3ff;
  border-color: rgba(33,59,177,.55);
}

/* Main grid: one column on mobile */
.rm-grid{
  margin-top: 12px;
  display:grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

.rm-card{
  border: 1px solid rgba(226,232,240,.9);
  background:#fff;
  border-radius: 18px;
  padding: 14px;
  box-shadow: 0 10px 26px rgba(2,6,23,.05);
  min-width: 0;
}

.rm-cardTop{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap: 10px;
  flex-wrap: wrap;
}

.rm-badge{
  padding: 7px 10px;
  border-radius: 999px;
  background: #0b1020;
  color:#e2e8f0;
  font-weight: 950;
  border: 1px solid #1f2937;
}
.rm-selected{ color: var(--rm-muted); font-size: 12px; }

.rm-stats{
  margin-top: 10px;
  display:grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.rm-stat{
  border: 1px solid rgba(226,232,240,.9);
  border-radius: 14px;
  padding: 12px;
  background: linear-gradient(180deg, #ffffff, #fbfcff);
}
.rm-statLabel{ font-size: 12px; color: var(--rm-muted); font-weight: 900; }
.rm-statValue{ font-size: 14px; font-weight: 950; margin-top: 6px; }

.rm-chartHead{
  margin-top: 12px;
  display:flex;
  justify-content:space-between;
  gap: 10px;
  align-items:flex-end;
}
.rm-chartTitle{ font-weight: 950; }
.rm-chartSub{ color: var(--rm-muted); font-size: 12px; margin-top: 3px; }

.rm-chartBox{
  margin-top: 10px;
  border: 1px solid rgba(226,232,240,.9);
  border-radius: 16px;
  padding: 10px;
  background:#fff;
  overflow:hidden;
}

.rm-hint{ margin-top: 10px; color: var(--rm-muted); font-size: 12px; }

/* Table header + controls */
.rm-tableHead{
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.rm-cardTitle{ font-weight: 950; }
.rm-cardSub{ color: var(--rm-muted); font-size: 12px; margin-top: 3px; }

.rm-controlsRow{
  display:flex;
  gap: 10px;
  align-items:center;
  flex-wrap: wrap;
  min-height: 44px; /* keeps stable height */
}

.rm-select, .rm-input{
  height: 40px;
  border-radius: 12px;
  border: 1px solid var(--rm-border);
  padding: 0 10px;
  font-weight: 800;
  font-size: 13px;
  outline: none;
  background:#fff;
}
.rm-input{ width: min(320px, 78vw); }
.rm-input:focus, .rm-select:focus{
  border-color: rgba(3,40,174,.35);
  box-shadow: 0 0 0 4px rgba(3,40,174,.10);
}

/* Table wrapper: scroll inside (Y + X on mobile) */
.rm-tableWrap{
  margin-top: 12px;
  border: 1px solid rgba(226,232,240,.9);
  border-radius: 16px;
  overflow: auto;
  max-height: 420px;
  background:#fff;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
}

.rm-table{
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  min-width: 760px; /* ensures horizontal scroll on narrow screens */
}
.rm-table th, .rm-table td{
  padding: 10px 10px;
  border-bottom: 1px solid rgba(226,232,240,.85);
  vertical-align: middle;
}
.rm-table th{
  position: sticky;
  top: 0;
  z-index: 2;
  background: #f8fafc;
  font-weight: 950;
  color:#0f172a;
}

.rm-row:hover td{ background:#fbfdff; cursor:pointer; }
.rm-row.active td{
  background: #f5f8ff !important;
  border-top: 1px solid #dbe4ff;
  border-bottom: 1px solid #dbe4ff;
}

.rm-company{ font-weight: 950; line-height: 1.15; }
.rm-muted{ color: var(--rm-muted); font-size: 12px; margin-top: 2px; }

.rm-empty{
  text-align:center;
  padding: 22px 10px;
  color: var(--rm-muted);
}

.rm-foot{ margin-top: 10px; color: var(--rm-muted); font-size: 12px; }

/* Desktop: two columns */
@media (min-width: 992px){
  .rm-grid{ grid-template-columns: 420px 1fr; align-items:start; }
  .rm-title{ font-size: 20px; }
  .rm-table{ min-width: 0; } /* no forced min-width on large screens */
}

/* Small phones: stats become 1 column and inputs full width */
@media (max-width: 420px){
  .rm-stats{ grid-template-columns: 1fr; }
  .rm-input{ width: 100%; }
}
`;
