// resources/js/components/AfricaInvestmentPanel.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

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
  pollMs = 0, // set 6000 for live polling
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

    if (pollMs > 0 && !paused) {
      timer = setInterval(load, pollMs);
    }
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

    if (country !== "ALL") {
      list = list.filter((c) => (c.country || "").toUpperCase() === country);
    }
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
      if (sortMode === "name")
        return String(a.name || "").localeCompare(String(b.name || ""));
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
  const statCapex = useMemo(
    () => rows.reduce((s, c) => s + (Number(c.capexUsd) || 0), 0),
    [rows]
  );

  const trendClass =
    selected?.trendPct > 0 ? "pos" : selected?.trendPct < 0 ? "neg" : "";

  return (
    <section className={`section rm-panel ${className}`} aria-label="Africa Investment Panel">
      <style>{panelCss}</style>

      <div className="container-xxl my-4">
        <div className="rm-card p-3 p-md-4">
          {/* Top row */}
          <div className="rm-top d-flex flex-wrap align-items-center justify-content-between gap-2">
            <div className="d-flex align-items-center gap-2">
              <div className="rm-titleWrap">
                <h5 className="m-0 rm-title">Africa Investment Panel</h5>
                <div className="rm-sub text-secondary">
                  Market pulse + sector mix • Click any company to update chart
                </div>
              </div>
              <span className="rm-pillLive">Live</span>

              <span className="rm-updated text-secondary">
                Updated:{" "}
                <strong>
                  {updatedAt ? new Date(updatedAt).toLocaleString() : "—"}
                </strong>
              </span>
            </div>

            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className={`rm-btn ${paused ? "rm-btnGhost" : "rm-btnGhost"}`}
                onClick={() => setPaused((v) => !v)}
              >
                {paused ? "Resume" : "Pause"}
              </button>

              <div className="rm-speed">
                <label htmlFor="speed" className="rm-speedLabel">
                  Speed
                </label>
                <input
                  id="speed"
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

          {/* Chips / ticker */}
          <div className={`rm-ticker ${paused ? "isPaused" : ""}`}>
            <div className="rm-track" style={{ "--ticker-speed": `${speed}s` }}>
              {countries
                .filter((c) => c !== "ALL")
                .slice(0, 24)
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

              <button
                type="button"
                className={`rm-chip ${country === "ALL" ? "active" : ""}`}
                onClick={() => setCountry("ALL")}
              >
                ALL
              </button>
            </div>
          </div>

          {/* Main grid */}
          <div className="row g-3 mt-2">
            {/* Left */}
            <div className="col-12 col-lg-5">
              <div className="rm-cardInner h-100">
                <div className="rm-innerHead d-flex align-items-center justify-content-between">
                  <div className="rm-badge">
                    <span className="mono">{country === "ALL" ? "AFRICA" : country}</span>
                  </div>
                  <div className="text-secondary small">
                    Selected:{" "}
                    <strong>
                      {selected ? `${selected.name} (${selected.id})` : "—"}
                    </strong>
                  </div>
                </div>

                <div className="row g-3 mt-1">
                  <div className="col-6">
                    <div className="rm-stat">
                      <div className="rm-statLabel">Companies</div>
                      <div className="rm-statValue">
                        {statCompanies.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="rm-stat">
                      <div className="rm-statLabel">Total CAPEX</div>
                      <div className="rm-statValue">{formatMoney(statCapex)}</div>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="rm-stat">
                      <div className="rm-statLabel">Primary sector</div>
                      <div className="rm-statValue">
                        {selected?.sector || "—"}
                      </div>
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="rm-stat">
                      <div className="rm-statLabel">Trend</div>
                      <div className={`rm-statValue ${trendClass}`}>
                        {selected ? formatPct(selected.trendPct) : "—"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chart */}
                <div className="rm-chartHead">
                  <div className="fw-bold">Sector Breakdown</div>
                  <div className="text-secondary small">
                    {selected?.name ? selected.name : "—"}
                  </div>
                </div>

                <div className="rm-chartBox">
                  <ResponsiveContainer width="100%" height={270}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={62}
                        outerRadius={104}
                        paddingAngle={2}
                      >
                        {pieData.map((_, idx) => (
                          <Cell
                            key={idx}
                            fill={PIE_COLORS[idx % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="rm-hint text-secondary small">
                  Tip: click a row on the right to update the pie instantly.
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="col-12 col-lg-7">
              <div className="rm-cardInner h-100">
                <div className="rm-tableTop d-flex align-items-center justify-content-between gap-2 flex-wrap">
                  <div>
                    <div className="fw-bold">Private Investment Plans</div>
                    <div className="text-secondary small">
                      Sorted by {sortMode === "trend" ? "trend" : sortMode}.
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <select
                      className="form-select form-select-sm rm-select"
                      value={sortMode}
                      onChange={(e) => setSortMode(e.target.value)}
                    >
                      <option value="trend">Sort: Trend</option>
                      <option value="capex">Sort: CAPEX</option>
                      <option value="name">Sort: Name</option>
                    </select>

                    <input
                      className="form-control form-control-sm rm-search"
                      placeholder="Search company/sector…"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>

                <div className="rm-tableWrap">
                  <table className="table table-sm align-middle rm-table">
                    <thead>
                      <tr>
                        <th style={{ minWidth: 220 }}>Company</th>
                        <th style={{ minWidth: 120 }}>Sector</th>
                        <th className="text-end" style={{ minWidth: 120 }}>
                          CAPEX
                        </th>
                        <th className="text-end" style={{ minWidth: 90 }}>
                          Trend
                        </th>
                        <th style={{ minWidth: 110 }}>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {rows.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center py-4 text-secondary">
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
                                <div className="fw-bold rm-company">{c.name}</div>
                                <div className="text-secondary small mono">
                                  {c.id} • {c.country}
                                </div>
                              </td>
                              <td>{c.sector || "—"}</td>
                              <td className="text-end mono">{formatMoney(c.capexUsd)}</td>
                              <td className="text-end mono">
                                <span
                                  className={
                                    c.trendPct > 0 ? "pos" : c.trendPct < 0 ? "neg" : ""
                                  }
                                >
                                  {formatPct(c.trendPct)}
                                </span>
                              </td>
                              <td>{c.status || "—"}</td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="rm-foot text-secondary small">
                  Showing <strong>{rows.length.toLocaleString()}</strong>{" "}
                  {country === "ALL" ? "companies across Africa" : `companies in ${country}`}.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * ✅ Seamless integration notes:
 * - NO :root overrides (uses .rm-panel scope)
 * - Uses your existing variables if available:
 *   --brand-blue, --border, --shadow, --radius, --bg, --card
 * - Provides fallbacks only inside .rm-panel tokens
 */
const panelCss = `
.rm-panel{
  /* fallbacks (won’t override your global :root) */
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
.rm-panel .mono{
  font-variant-numeric: tabular-nums;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
.rm-panel .pos{ color:#166534; font-weight:800; }
.rm-panel .neg{ color:#b91c1c; font-weight:800; }

.rm-card{
  background: linear-gradient(180deg, rgba(255,255,255,.92), rgba(255,255,255,1));
  border:1px solid var(--rm-border);
  border-radius: calc(var(--rm-radius) + 4px);
  box-shadow: var(--rm-shadow);
}

.rm-top{ padding-bottom: 6px; }
.rm-title{ font-weight: 900; letter-spacing: .2px; }
.rm-sub{ font-size: .92rem; line-height: 1.35; }
.rm-titleWrap{ display:flex; flex-direction:column; }
.rm-pillLive{
  display:inline-flex; align-items:center;
  padding:6px 10px;
  border-radius:999px;
  font-weight:900;
  font-size:.82rem;
  color:#fff;
  background: linear-gradient(135deg, var(--rm-blue-700), var(--rm-blue-500));
  box-shadow: 0 6px 16px rgba(4,27,100,.18);
}
.rm-updated{ font-size: .86rem; }

.rm-btn{
  border-radius: 12px;
  padding: 10px 12px;
  font-weight: 900;
  border: 1px solid #dbe4ff;
  background: #f5f8ff;
  color: #0a1f44;
  transition: transform .08s ease, background .2s ease, border-color .2s ease;
}
.rm-btn:hover{ background:#eef3ff; border-color:#c9d4ff; }
.rm-btn:active{ transform: translateY(1px); }

.rm-speed{ display:flex; align-items:center; gap:10px; }
.rm-speedLabel{ font-size:.9rem; color: var(--rm-muted); font-weight:800; }
.rm-speed input{ accent-color: var(--rm-blue-700); }

.rm-ticker{
  margin-top: 10px;
  border: 1px solid var(--rm-border);
  border-radius: 14px;
  background: #fff;
  overflow:hidden;
  padding: 10px;
}
.rm-track{
  display:flex; align-items:center; gap:10px; width:max-content;
  animation: rm-ticker var(--ticker-speed, 48s) linear infinite;
}
.rm-ticker.isPaused .rm-track{ animation-play-state: paused; }
@keyframes rm-ticker{ from{ transform:translateX(0) } to{ transform:translateX(-35%) } }

.rm-chip{
  border: 1px solid rgba(226,232,240,.9);
  background: #f8fafc;
  color: #0f172a;
  padding: 8px 10px;
  border-radius: 999px;
  font-weight: 900;
  font-size: .82rem;
  transition: box-shadow .2s ease, border-color .2s ease, transform .08s ease, background .2s ease;
}
.rm-chip:hover{
  background:#fff;
  border-color: rgba(33,59,177,.35);
  box-shadow: 0 0 0 3px rgba(33,59,177,.12);
}
.rm-chip:active{ transform: translateY(1px); }
.rm-chip.active{
  background: #eef3ff;
  border-color: rgba(33,59,177,.55);
}

.rm-cardInner{
  border:1px solid rgba(226,232,240,.9);
  background:#fff;
  border-radius: 18px;
  padding: 14px;
  box-shadow: 0 10px 26px rgba(2,6,23,.05);
}

.rm-innerHead{ padding: 4px 2px 8px; }
.rm-badge{
  padding: 7px 10px;
  border-radius: 999px;
  background: #0b1020;
  color:#e2e8f0;
  font-weight: 900;
  border:1px solid #1f2937;
}

.rm-stat{
  border: 1px solid rgba(226,232,240,.9);
  border-radius: 14px;
  padding: 12px 12px;
  background: linear-gradient(180deg, #ffffff, #fbfcff);
}
.rm-statLabel{
  font-size: .82rem;
  color: var(--rm-muted);
  font-weight: 800;
}
.rm-statValue{
  font-size: 1.05rem;
  font-weight: 950;
  letter-spacing: .2px;
  margin-top: 4px;
  color: #0f172a;
}

.rm-chartHead{
  margin-top: 14px;
  display:flex;
  align-items:flex-end;
  justify-content:space-between;
}
.rm-chartBox{
  margin-top: 10px;
  border: 1px solid rgba(226,232,240,.9);
  border-radius: 16px;
  padding: 10px;
  background: #fff;
}

.rm-hint{ margin-top: 10px; }

.rm-tableTop{ padding: 4px 2px 10px; }
.rm-select{ border-radius: 12px; font-weight: 800; }
.rm-search{ border-radius: 12px; }

.rm-tableWrap{
  border: 1px solid rgba(226,232,240,.9);
  border-radius: 16px;
  overflow:auto;
  max-height: 360px;
  background:#fff;
}
.rm-table{ margin:0; }
.rm-table thead th{
  position: sticky;
  top: 0;
  z-index: 2;
  background: #f8fafc;
  border-bottom: 1px solid rgba(226,232,240,.95);
  font-weight: 950;
  color: #0f172a;
}
.rm-row td{
  transition: background .15s ease;
}
.rm-row:hover td{
  background:#fbfdff;
}
.rm-row.active td{
  background: #f5f8ff !important;
  border-top: 1px solid #dbe4ff;
  border-bottom: 1px solid #dbe4ff;
}
.rm-company{ line-height: 1.1; }
.rm-foot{ padding-top: 10px; }

@media (max-width: 576px){
  .rm-updated{ width:100%; display:block; margin-top:6px; }
}
`;
