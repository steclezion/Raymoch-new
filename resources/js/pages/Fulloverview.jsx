import { useMemo, useState } from "react";
import Header from "../components/layout_master/Header.jsx";
import Footer from "../components/layout_master/Footer.jsx";
import { ResponsiveController } from "../components/ResponsiveController.jsx";
import "../styles/headerFooter.css";

/**
 * =============================================================================
 * Fulloverview.jsx
 * =============================================================================
 * PURPOSE
 * - Dedicated page for live overview / scanning
 * - Houses the former Africa Investment Panel in the right context
 * - Keeps landing page lighter and more persuasive
 * - Connects Overview -> Insights -> Signals -> Company exploration
 *
 * PAGE ORDER
 * 01) Overview Hero
 * 02) Snapshot Metrics
 * 03) Live Instrument Panel
 * 04) Top Signals
 * 05) Research & Reports Preview
 * 06) Country / Sector Quick Links
 * =============================================================================
 */

const BRAND = {
  colors: {
    dark: "rgba(27, 34, 39, 1)",
    darkSoft: "rgba(38, 48, 54, 1)",
    surface: "rgba(246,241,232,1)",
    surfaceAlt: "rgba(239,233,223,1)",
    surfaceSoft: "rgba(251,248,242,1)",
    white: "#ffffff",
    text: "rgba(24,29,34,1)",
    body: "rgba(71,81,89,1)",
    muted: "rgba(99,107,114,1)",
    textOnDark: "rgba(233,236,232,1)",
    brand: "rgba(91,56,37,1)",
    brandDeep: "rgba(61,38,25,1)",
    rust: "rgba(168,112,50,1)",
    gold: "rgba(235,191,96,1)",
    oat: "rgba(242,225,198,1)",
    oatDeep: "rgba(226,201,164,1)",
    border: "rgba(110,98,88,0.16)",
    borderSoft: "rgba(110,98,88,0.24)",
    borderStrong: "rgba(110,98,88,0.34)",
    success: "rgba(47,111,72,1)",
    successSoft: "rgba(231,242,235,1)",
    adDark: "rgba(34,46,39,1)",
  },
  gradients: {
    hero: `linear-gradient(110deg, rgba(40,22,15,1) 0%, rgba(61,36,24,1) 30%, rgba(92,58,39,1) 56%, rgba(150,103,58,1) 84%, rgba(216,170,92,1) 100%)`,
    panel: `linear-gradient(135deg, rgba(255,250,240,1), rgba(246,241,232,1))`,
    warmWash: `linear-gradient(180deg, rgba(235,191,96,0.11), rgba(246,241,232,0.00))`,
    editorial: `linear-gradient(135deg, rgba(255,250,240,1), rgba(251,248,242,1))`,
  },
  shadows: {
    sm: "0 8px 20px rgba(31,41,51,0.06)",
    md: "0 12px 30px rgba(31,41,51,0.08)",
    lg: "0 18px 50px rgba(31,41,51,0.10)",
    xl: "0 30px 80px rgba(31,41,51,0.18)",
  },
};

const TYPE = {
  family: {
    body: '"Inter", "Segoe UI", sans-serif',
    heading: '"Merriweather", Georgia, serif',
  },
  heroTitle: { size: "clamp(44px, 5vw, 68px)", line: 1.04, weight: 800, spacing: "-0.02em" },
  sectionTitle: { size: 34, line: 1.15, weight: 800 },
  lead: { size: 21, line: 1.7, weight: 500 },
  body: { size: 17, line: 1.75, weight: 400 },
  cardTitle: { size: 18, line: 1.3, weight: 800 },
  small: { size: 13, line: 1.3, weight: 700 },
  button: { size: 15, line: 1, weight: 800 },
};

const LAYOUT = {
  wrapMax: 1440,
  wrapPadX: 28,
  sectionPadY: 80,
  gridGap: 28,
  heroPadTop: 124,
  heroPadBottom: 120,
};

const COMPONENTS = {
  button: { height: 48, minWidth: 152, padX: 20, radius: 999, borderWidth: 1 },
  card: { radius: 20, pad: 22, borderWidth: 1 },
  pill: { radius: 999, padY: 8, padX: 14 },
};

export default function Fulloverview() {
  const S = makeStyles(BRAND, TYPE, LAYOUT, COMPONENTS);

  const metrics = useMemo(
    () => [
      { label: "Countries tracked", value: "54+" },
      { label: "Active sectors", value: "24+" },
      { label: "Verified companies", value: "12,400+" },
      { label: "Live signals", value: "320+" },
    ],
    []
  );

  const signals = useMemo(
    () => [
      { tag: "Policy", title: "Ghana FX repatriation rules eased for exporters", meta: "West Africa · Policy" , href: "/signals/ghana-fx-repatriation"},
      { tag: "Incentive", title: "Kenya VAT relief on solar mini-grid components", meta: "East Africa · Incentive", href: "/signals/kenya-vat-solar" },
      { tag: "Grant", title: "AfDB climate-adaptive agritech SME window expands", meta: "Continental · Capital", href: "/signals/afdb-sme-climate" },
      { tag: "Regulatory", title: "Egypt fast-track sandbox for healthtech devices", meta: "North Africa · Regulatory", href: "/signals/egypt-healthtech-sandbox" },
    ],
    []
  );

  const reports = useMemo(
    () => [
      { title: "Africa’s energy transition", blurb: "Capital, infrastructure, and demand shifts.", href: "/insights/energy-transition" },
      { title: "Generative AI and the workforce", blurb: "Productivity, training, and labor implications.", href: "/insights/genai-workforce" },
      { title: "Climate adaptation and capital", blurb: "How resilience themes are changing investment logic.", href: "/insights/climate-adaptation" },
    ],
    []
  );

  const quickLinks = useMemo(
    () => ({
      countries: ["Kenya", "Nigeria", "South Africa", "Egypt", "Ghana", "Morocco"],
      sectors: ["Energy", "Finance", "Telecom", "Logistics", "Agritech", "Healthtech"],
    }),
    []
  );

  return (
    <ResponsiveController>
      <div style={S.page}>
        <Header />
        <main>
          <OverviewHero S={S} />
          <SnapshotMetrics S={S} metrics={metrics} />
          <OverviewInstrumentPanel S={S} />
          <TopSignals S={S} signals={signals} />
          <ResearchPreview S={S} reports={reports} />
          <QuickLinks S={S} quickLinks={quickLinks} />
        </main>
        <Footer />
      </div>
    </ResponsiveController>
  );
}

function OverviewHero({ S }) {
  return (
    <section style={S.hero}>
      <div style={S.wrap}>
        <div style={S.heroInner}>
          <div style={S.kicker}>Overview • Signals • Market Scan</div>
          <h1 style={S.h1}>Africa at a glance</h1>
          <p style={S.sub}>
            A live scanning layer for sector movement, regional momentum, policy changes,
            and directional signals across African markets.
          </p>
          <div style={S.buttonRow}>
            <a href="/insights" style={{ ...S.btnBase, ...S.btnPrimary }}>Open insights</a>
            <a href="/signals" style={{ ...S.btnBase, ...S.btnGhostLight }}>Browse signals</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function SnapshotMetrics({ S, metrics }) {
  return (
    <section style={S.sectionSurface}>
      <div style={S.wrap}>
        <div style={S.metricGrid}>
          {metrics.map((item) => (
            <div key={item.label} style={S.metricCard}>
              <div style={S.metricValue}>{item.value}</div>
              <div style={S.metricLabel}>{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function OverviewInstrumentPanel({ S }) {
  const [mode, setMode] = useState("Sectors");
  const [cadence, setCadence] = useState("Monthly");
  const [selectedRegion, setSelectedRegion] = useState("East Africa");

  const regionOptions = ["East Africa", "West Africa", "North Africa", "Southern Africa", "Central Africa"];

  const baseSectorLegend = [
    { label: "Energy", value: 16 },
    { label: "Finance", value: 13 },
    { label: "Telecom", value: 11 },
    { label: "Logistics", value: 9 },
    { label: "Agritech", value: 7 },
    { label: "Healthtech", value: 6 },
    { label: "Manufacturing", value: 8 },
    { label: "Climate", value: 5 },
  ];

  const chartLegend = buildScopedSectorLegend({
    mode,
    activeCountry: "Kenya",
    selectedRegion,
    cadence,
    baseSectorLegend,
  });

  const movers = chartLegend.slice(0, 4).map((item, idx) => ({
    title:
      mode === "Region"
        ? `${selectedRegion} momentum building in ${item.label.toLowerCase()}`
        : `${item.label} visibility increasing across tracked markets}`,
    meta: idx % 2 === 0 ? `${cadence} · Sector move` : `${cadence} · Intelligence signal`,
  }));

  return (
    <section style={S.sectionPanel}>
      <div style={S.wrap}>
        <div style={S.sectionHeadRow}>
          <div>
            <h2 style={S.h2}>Live instrument panel</h2>
            <p style={S.p}>A broad scanning surface for regions, sectors, and fast-moving market signals.</p>
          </div>
          <a href="/signals" style={{ ...S.btnBase, ...S.btnGhost }}>Open all signals</a>
        </div>

        <div style={S.panelOuter}>
          <div style={S.controlBar}>
            <div style={S.pillsRow}>
              {["Sectors", "Region"].map((x) => (
                <button key={x} type="button" onClick={() => setMode(x)} style={{ ...S.pillBtn, ...(mode === x ? S.pillBtnActive : null) }}>
                  {x}
                </button>
              ))}
            </div>

            <div style={S.pillsRow}>
              {["Today", "Weekly", "Monthly", "Quarterly"].map((x) => (
                <button key={x} type="button" onClick={() => setCadence(x)} style={{ ...S.pillBtn, ...(cadence === x ? S.pillBtnActive : null) }}>
                  {x}
                </button>
              ))}
            </div>
          </div>

          {mode === "Region" ? (
            <div style={S.selectRow}>
              <label htmlFor="overview-region-select" style={S.selectLabel}>Choose region</label>
              <select id="overview-region-select" value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)} style={S.select}>
                {regionOptions.map((region) => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
          ) : null}

          <div style={S.panelGrid}>
            <div style={S.panelCardMain}>
              <div style={S.panelMetaLine}>{mode} · {cadence} · {mode === "Region" ? selectedRegion : "Africa-wide"}</div>
              <div style={S.panelTitle}>Tracked sector movement</div>
              <div style={S.panelText}>
                Use this layer to scan where attention is clustering before opening a full insight or country page.
              </div>

              <div style={S.donutWrap}>
                <InteractiveDonutChart
                  S={S}
                  items={chartLegend}
                  centerValue={mode === "Region" ? selectedRegion : "Africa"}
                  centerLabel={mode}
                />
              </div>

              <div style={S.legendGrid}>
                {chartLegend.map((item) => (
                  <a key={item.label} href={item.href} style={S.legendItem}>
                    <i style={{ ...S.legendSwatch, background: item.color }} />
                    {item.label} · {item.value}%
                  </a>
                ))}
              </div>
            </div>

            <div style={S.panelCardSide}>
              <div style={S.sideTitle}>Top movers</div>
              <div style={S.feedList}>
                {movers.map((row) => (
                  <a key={row.title} href="/signals" style={S.feedRow}>
                    <div style={S.feedRowTitle}>{row.title}</div>
                    <div style={S.feedRowMeta}>{row.meta}</div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TopSignals({ S, signals }) {
  return (
    <section style={S.sectionSurface}>
      <div style={S.wrap}>
        <div style={S.sectionHeadRow}>
          <div>
            <h2 style={S.h2}>Top signals</h2>
            <p style={S.p}>Fast items worth scanning before you drill into reports or company pages.</p>
          </div>
          <a href="/signals" style={{ ...S.btnBase, ...S.btnGhost }}>View all</a>
        </div>

        <div style={S.signalGrid}>
          {signals.map((item) => (
            <a key={item.title} href={item.href} style={S.signalCard}>
              <div style={S.signalTag}>{item.tag}</div>
              <div style={S.signalTitle}>{item.title}</div>
              <div style={S.signalMeta}>{item.meta}</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function ResearchPreview({ S, reports }) {
  return (
    <section style={S.sectionSoft}>
      <div style={S.wrap}>
        <div style={S.sectionHeadRow}>
          <div>
            <h2 style={S.h2}>Related market insights</h2>
            <p style={S.p}>Interpretation lives there. This page stays focused on scan and direction.</p>
          </div>
          <a href="/insights" style={{ ...S.btnBase, ...S.btnGhost }}>Open insights</a>
        </div>

        <div style={S.reportGrid}>
          {reports.map((item) => (
            <a key={item.title} href={item.href} style={S.reportCard}>
              <div style={S.reportLabel}>Insight</div>
              <div style={S.reportTitle}>{item.title}</div>
              <div style={S.reportText}>{item.blurb}</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuickLinks({ S, quickLinks }) {
  return (
    <section style={S.sectionSurface}>
      <div style={S.wrap}>
        <div style={S.quickLinksGrid}>
          <div style={S.quickCard}>
            <h3 style={S.h3}>Countries</h3>
            <div style={S.quickPills}>
              {quickLinks.countries.map((item) => (
                <a key={item} href={`/insights/countries/${slugify(item)}`} style={S.quickPill}>{item}</a>
              ))}
            </div>
          </div>

          <div style={S.quickCard}>
            <h3 style={S.h3}>Sectors</h3>
            <div style={S.quickPills}>
              {quickLinks.sectors.map((item) => (
                <a key={item} href={`/insights/sectors/${slugify(item)}`} style={S.quickPill}>{item}</a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InteractiveDonutChart({ S, items, centerValue, centerLabel }) {
  const size = 420;
  const strokeWidth = 92;
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const total = items.reduce((sum, item) => sum + item.value, 0);
  let running = -90;

  return (
    <div style={S.donutChartFrame}>
      <svg viewBox={`0 0 ${size} ${size}`} style={S.donutSvg} role="img" aria-label={`${centerLabel} distribution`}>
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke={S.tokens.colors.surfaceAlt} strokeWidth={strokeWidth} />
        {items.map((item) => {
          const sweep = (item.value / total) * 360;
          const path = describeArc(cx, cy, radius, running, running + sweep);
          running += sweep;

          return (
            <a key={item.label} href={item.href} aria-label={`${item.label} ${item.value}%`}>
              <path d={path} fill="none" stroke={item.color} strokeWidth={strokeWidth} strokeLinecap="butt" style={S.donutSlice}>
                <title>{`${item.label} · ${item.value}%`}</title>
              </path>
            </a>
          );
        })}
      </svg>

      <div style={S.donutCenter}>
        <div style={S.donutCenterValue}>{centerValue}</div>
        <div style={S.donutCenterLabel}>{centerLabel}</div>
      </div>
    </div>
  );
}

function buildScopedSectorLegend({ mode, activeCountry, selectedRegion, cadence, baseSectorLegend }) {
  const scopeKey = mode === "Region" ? selectedRegion : activeCountry;

  const cadenceWeight =
    cadence === "Today" ? 1.06 :
    cadence === "Weekly" ? 1.03 :
    cadence === "Monthly" ? 1 :
    0.98;

  const palette = [
    "#5b3825",
    "#ebbf60",
    "#a87032",
    "#e2c9a4",
    "#3d2619",
    "#d8c39f",
    "#c89458",
    "#8d6c50",
  ];

  const seeded = baseSectorLegend.map((item, idx) => {
    const scopeSeed = stableHash(`${scopeKey}-${item.label}-${cadence}-${idx}`);
    const drift = 0.78 + (scopeSeed % 33) / 100;
    return {
      ...item,
      raw: item.value * drift * cadenceWeight,
      color: palette[idx % palette.length],
      href: mode === "Region"
        ? `/insights/regions/${slugify(selectedRegion)}/sectors/${slugify(item.label)}`
        : `/insights/sectors/${slugify(item.label)}`,
    };
  });

  const total = seeded.reduce((sum, item) => sum + item.raw, 0);

  return seeded.map((item) => ({
    label: item.label,
    value: Math.max(3, Math.round((item.raw / total) * 100)),
    color: item.color,
    href: item.href,
  }));
}

function stableHash(input) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) % 100000;
  }
  return hash;
}

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function polarToCartesian(cx, cy, radius, angleInDegrees) {
  const radians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians),
  };
}

function describeArc(cx, cy, radius, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

function makeStyles(brand, type, layout, components) {
  const c = brand.colors;

  return {
    tokens: { colors: c, gradients: brand.gradients, shadows: brand.shadows, type, layout, components },

    page: { background: c.surface, fontFamily: type.family.body, color: c.text },
    wrap: { maxWidth: layout.wrapMax, margin: "0 auto", padding: `0 ${layout.wrapPadX}px` },

    hero: {
      background: brand.gradients.hero,
      padding: `${layout.heroPadTop}px 0 ${layout.heroPadBottom}px`,
      color: c.white,
    },
    heroInner: { maxWidth: 860 },
    kicker: {
      display: "inline-flex",
      padding: `${components.pill.padY}px ${components.pill.padX}px`,
      borderRadius: components.pill.radius,
      color: c.surface,
      border: `1px solid rgba(246,241,232,0.24)`,
      background: "rgba(255,255,255,0.06)",
      fontSize: type.small.size,
      fontWeight: type.small.weight,
      letterSpacing: "0.05em",
      textTransform: "uppercase",
    },
    h1: {
      margin: "18px 0 0",
      fontFamily: type.family.heading,
      fontSize: type.heroTitle.size,
      lineHeight: type.heroTitle.line,
      fontWeight: type.heroTitle.weight,
      letterSpacing: type.heroTitle.spacing,
      color: c.white,
    },
    h2: {
      margin: 0,
      fontFamily: type.family.heading,
      fontSize: type.sectionTitle.size,
      lineHeight: type.sectionTitle.line,
      fontWeight: type.sectionTitle.weight,
      color: c.text,
    },
    h3: {
      margin: 0,
      fontFamily: type.family.heading,
      fontSize: 24,
      lineHeight: 1.2,
      fontWeight: 800,
      color: c.text,
    },
    sub: {
      marginTop: 18,
      maxWidth: 760,
      fontSize: type.lead.size,
      lineHeight: type.lead.line,
      color: c.textOnDark,
    },
    p: { marginTop: 10, color: c.body, fontSize: type.body.size, lineHeight: type.body.line },

    btnBase: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: components.button.minWidth,
      height: components.button.height,
      padding: `0 ${components.button.padX}px`,
      borderRadius: components.button.radius,
      border: `${components.button.borderWidth}px solid transparent`,
      textDecoration: "none",
      whiteSpace: "nowrap",
      fontSize: type.button.size,
      fontWeight: type.button.weight,
      transition: "all 180ms ease",
    },
    btnPrimary: { background: c.oat, color: c.brandDeep, borderColor: c.oatDeep },
    btnGhostLight: { background: "transparent", color: c.surface, borderColor: "rgba(246,241,232,0.58)" },
    btnGhost: { background: c.oat, color: c.brandDeep, borderColor: c.oatDeep },
    buttonRow: { display: "flex", gap: 12, flexWrap: "wrap", marginTop: 34 },

    sectionSurface: { padding: `${layout.sectionPadY}px 0` },
    sectionSoft: { padding: `${layout.sectionPadY}px 0`, background: c.surfaceSoft },
    sectionPanel: { padding: `${layout.sectionPadY}px 0`, background: brand.gradients.panel },

    sectionHeadRow: { display: "flex", justifyContent: "space-between", alignItems: "end", gap: 20, marginBottom: 26, flexWrap: "wrap" },

    metricGrid: { display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: layout.gridGap },
    metricCard: {
      background: c.white,
      border: `1px solid ${c.border}`,
      borderRadius: components.card.radius,
      padding: 24,
      boxShadow: brand.shadows.sm,
    },
    metricValue: { fontSize: 30, fontWeight: 900, color: c.brandDeep },
    metricLabel: { marginTop: 8, color: c.body, fontSize: type.body.size },

    panelOuter: {
      background: c.white,
      border: `1px solid ${c.border}`,
      borderRadius: 28,
      padding: 24,
      boxShadow: brand.shadows.md,
    },
    controlBar: { display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 18 },
    pillsRow: { display: "flex", gap: 10, flexWrap: "wrap" },
    pillBtn: {
      border: `1px solid ${c.borderSoft}`,
      background: c.surfaceSoft,
      color: c.text,
      borderRadius: components.pill.radius,
      padding: `${components.pill.padY}px ${components.pill.padX}px`,
      cursor: "pointer",
      fontWeight: 700,
    },
    pillBtnActive: { background: c.brandDeep, color: c.surface, borderColor: c.brandDeep },
    selectRow: { display: "flex", gap: 12, alignItems: "center", marginBottom: 20, flexWrap: "wrap" },
    selectLabel: { color: c.body, fontWeight: 700 },
    select: {
      minWidth: 220,
      height: 44,
      borderRadius: 12,
      border: `1px solid ${c.borderSoft}`,
      background: c.surfaceSoft,
      padding: "0 14px",
      color: c.text,
    },

    panelGrid: { display: "grid", gridTemplateColumns: "1.25fr 0.75fr", gap: layout.gridGap, alignItems: "start" },
    panelCardMain: {
      border: `1px solid ${c.border}`,
      borderRadius: 24,
      padding: 24,
      background: c.surfaceSoft,
    },
    panelCardSide: {
      border: `1px solid ${c.border}`,
      borderRadius: 24,
      padding: 24,
      background: c.white,
      minHeight: 100,
    },
    panelMetaLine: { color: c.muted, fontWeight: 800, fontSize: 13, letterSpacing: "0.03em", textTransform: "uppercase" },
    panelTitle: { marginTop: 8, fontSize: 28, lineHeight: 1.15, fontWeight: 900, color: c.text },
    panelText: { marginTop: 10, color: c.body, fontSize: type.body.size, lineHeight: type.body.line, maxWidth: 700 },

    donutWrap: { marginTop: 24, display: "flex", justifyContent: "center" },
    donutChartFrame: { position: "relative", width: 420, height: 420 },
    donutSvg: { width: "100%", height: "100%", overflow: "visible" },
    donutSlice: { cursor: "pointer", transition: "opacity 160ms ease" },
    donutCenter: {
      position: "absolute",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      textAlign: "center",
      pointerEvents: "none",
    },
    donutCenterValue: { fontSize: 30, fontWeight: 900, color: c.brandDeep, maxWidth: 170 },
    donutCenterLabel: { marginTop: 6, fontSize: 14, color: c.body, fontWeight: 700 },

    legendGrid: { marginTop: 22, display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 },
    legendItem: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      textDecoration: "none",
      color: c.text,
      border: `1px solid ${c.border}`,
      background: c.white,
      borderRadius: 14,
      padding: "12px 14px",
    },
    legendSwatch: { width: 12, height: 12, borderRadius: 999 },

    sideTitle: { fontSize: 20, fontWeight: 900, color: c.text },
    feedList: { marginTop: 16, display: "grid", gap: 12 },
    feedRow: {
      display: "block",
      textDecoration: "none",
      border: `1px solid ${c.border}`,
      borderRadius: 16,
      padding: 16,
      color: c.text,
      background: c.surfaceSoft,
    },
    feedRowTitle: { fontWeight: 800, lineHeight: 1.4 },
    feedRowMeta: { marginTop: 6, fontSize: 13, color: c.muted },

    signalGrid: { display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: layout.gridGap },
    signalCard: {
      display: "block",
      textDecoration: "none",
      color: c.text,
      border: `1px solid ${c.border}`,
      background: c.white,
      borderRadius: 20,
      padding: 22,
      boxShadow: brand.shadows.sm,
    },
    signalTag: {
      display: "inline-flex",
      padding: "6px 10px",
      borderRadius: 999,
      background: c.oat,
      color: c.brandDeep,
      fontWeight: 800,
      fontSize: 12,
      textTransform: "uppercase",
      letterSpacing: "0.04em",
    },
    signalTitle: { marginTop: 14, fontWeight: 900, lineHeight: 1.35, fontSize: 18 },
    signalMeta: { marginTop: 10, color: c.body, fontSize: 14 },

    reportGrid: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: layout.gridGap },
    reportCard: {
      display: "block",
      textDecoration: "none",
      color: c.text,
      border: `1px solid ${c.border}`,
      borderRadius: 22,
      padding: 24,
      background: c.white,
    },
    reportLabel: { color: c.muted, fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.04em" },
    reportTitle: { marginTop: 10, fontSize: 22, lineHeight: 1.25, fontWeight: 900 },
    reportText: { marginTop: 10, color: c.body, lineHeight: type.body.line },

    quickLinksGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: layout.gridGap },
    quickCard: { border: `1px solid ${c.border}`, borderRadius: 22, padding: 24, background: c.white },
    quickPills: { display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 },
    quickPill: {
      textDecoration: "none",
      color: c.brandDeep,
      background: c.oat,
      border: `1px solid ${c.oatDeep}`,
      borderRadius: 999,
      padding: "10px 14px",
      fontWeight: 800,
    },
  };
}
