// resources/js/pages/Dashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  Bot,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Download,
  Handshake,
  Landmark,
  Lightbulb,
  MessageSquareText,
  MoreHorizontal,
  Plus,
  Search,
  ShieldCheck,
  Target,
  TrendingUp,
  UserRound,
  Users,
  X,
} from "lucide-react";

import HorizontalNavigation from "../components/HorizontalNavigation.jsx";
import Footer from "../components/layout_master/Footer.jsx";
import { ResponsiveController } from "../components/ResponsiveController.jsx";

const KPI_DATA = [
  {
    label: "Verified companies",
    value: "12,431",
    change: "+15.5%",
    comparison: "vs. 10,763 last period",
    icon: CheckCircle2,
    tone: "positive",
  },
  {
    label: "Active investors",
    value: "6,225",
    change: "+8.4%",
    comparison: "vs. 5,742 last period",
    icon: Users,
    tone: "positive",
  },
  {
    label: "New matches",
    value: "2,832",
    change: "-10.5%",
    comparison: "vs. 3,294 last period",
    icon: Target,
    tone: "negative",
  },
  {
    label: "Capital opportunities",
    value: "1,224",
    change: "+4.4%",
    comparison: "vs. 1,186 last period",
    icon: CircleDollarSign,
    tone: "positive",
  },
];

const COMPANY_ROWS = [
  {
    id: "RM-3009",
    name: "NileGrid Energy",
    sector: "Clean energy",
    country: "Kenya",
    score: 92,
    capital: "$12.4M",
    trend: "up",
  },
  {
    id: "RM-3001",
    name: "Kora Health Systems",
    sector: "Healthtech",
    country: "Nigeria",
    score: 88,
    capital: "$9.2M",
    trend: "down",
  },
  {
    id: "RM-3004",
    name: "Atlas AgroTrade",
    sector: "Agribusiness",
    country: "Morocco",
    score: 84,
    capital: "$7.4M",
    trend: "up",
  },
];

const ACTIVITY = [
  { day: "Sun", value: 52 },
  { day: "Mon", value: 40 },
  { day: "Tue", value: 84, active: true, count: "8,162" },
  { day: "Wed", value: 34 },
  { day: "Thu", value: 22 },
  { day: "Fri", value: 46 },
  { day: "Sat", value: 56 },
];

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <span />
    </span>
  );
}

function PanelHeader({ title, action = true }) {
  return (
    <div className="panel-header">
      <h2>{title}</h2>
      {action ? (
        <button className="icon-button" type="button" aria-label={`More ${title} options`} title={`More options for ${title}`}>
          <MoreHorizontal size={18} />
        </button>
      ) : null}
    </div>
  );
}

function TrendChart() {
  return (
    <div className="trend-chart" aria-label="Capital opportunity trend chart">
      <svg viewBox="0 0 620 170" role="img" aria-labelledby="trend-title trend-desc">
        <title id="trend-title">Capital opportunity trend</title>
        <desc id="trend-desc">An upward trend from January 1 through January 29.</desc>
        <defs>
          <linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#2463d4" stopOpacity="0.24" />
            <stop offset="100%" stopColor="#2463d4" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[30, 70, 110, 150].map((y) => (
          <line key={y} x1="45" x2="610" y1={y} y2={y} className="chart-grid-line" />
        ))}
        <path
          className="chart-ghost"
          d="M45 139 L80 132 L112 140 L145 114 L180 120 L216 98 L252 106 L290 78 L326 88 L362 76 L400 64 L438 72 L474 54 L510 66 L548 44 L610 52"
        />
        <path
          fill="url(#areaFill)"
          d="M45 132 L78 135 L110 126 L142 130 L174 75 L206 91 L238 118 L272 117 L305 114 L338 65 L372 67 L404 50 L430 45 L445 80 L478 74 L510 102 L540 57 L574 38 L610 55 L610 150 L45 150 Z"
        />
        <path
          className="chart-line"
          d="M45 132 L78 135 L110 126 L142 130 L174 75 L206 91 L238 118 L272 117 L305 114 L338 65 L372 67 L404 50 L430 45 L445 80 L478 74 L510 102 L540 57 L574 38 L610 55"
        />
        <text x="8" y="34">$15M</text>
        <text x="14" y="74">$10M</text>
        <text x="20" y="114">$5M</text>
        <text x="34" y="153">0</text>
        <text x="45" y="168">1 Jan</text>
        <text x="170" y="168">8 Jan</text>
        <text x="300" y="168">15 Jan</text>
        <text x="435" y="168">22 Jan</text>
        <text x="560" y="168">29 Jan</text>
      </svg>
    </div>
  );
}

function OpportunityGauge() {
  const ticks = Array.from({ length: 23 }, (_, index) => index);
  return (
    <div className="gauge-wrap" aria-label="Opportunity readiness score: 68 percent">
      <div className="gauge">
        {ticks.map((tick) => {
          const angle = -90 + tick * (180 / (ticks.length - 1));
          return (
            <span
              key={tick}
              className={tick < 16 ? "gauge-tick gauge-tick-active" : "gauge-tick"}
              style={{ transform: `rotate(${angle}deg) translateY(-58px)` }}
            />
          );
        })}
        <div className="gauge-score">
          <strong>68%</strong>
          <span>on track for the 80% target</span>
        </div>
      </div>
      <a className="soft-button" href="/matching" title="View your complete opportunity readiness details">View details</a>
    </div>
  );
}

const ACCOUNT_DASHBOARDS = {
  individual: {
    label: "Individual workspace",
    title: "Professional opportunity dashboard",
    guidance: "Complete your professional identity and review opportunities aligned with your interests.",
    metrics: [
      { label: "Profile strength", value: "78%", change: "+12%", comparison: "Professional profile completion", icon: UserRound, tone: "positive" },
      { label: "Saved businesses", value: "24", change: "+5", comparison: "Companies saved for review", icon: Building2, tone: "positive" },
      { label: "Relevant opportunities", value: "18", change: "+7", comparison: "Based on your selected interests", icon: Target, tone: "positive" },
      { label: "Trusted connections", value: "31", change: "+4", comparison: "Verified ecosystem relationships", icon: Users, tone: "positive" },
    ],
  },
  business: {
    label: "Business workspace",
    title: "Company growth dashboard",
    guidance: "Review company verification, CTI trust signals, investor matches, and capital readiness.",
    metrics: [
      { label: "CTI trust score", value: "86", change: "+8", comparison: "Current company trust indicator", icon: ShieldCheck, tone: "positive" },
      { label: "Verification", value: "82%", change: "+14%", comparison: "Company verification completion", icon: CheckCircle2, tone: "positive" },
      { label: "Investor matches", value: "17", change: "+6", comparison: "Matches aligned with your company", icon: Handshake, tone: "positive" },
      { label: "Capital readiness", value: "74%", change: "+9%", comparison: "Readiness for investor review", icon: CircleDollarSign, tone: "positive" },
    ],
  },
  investment: {
    label: "Investment workspace",
    title: "Capital intelligence dashboard",
    guidance: "Review explainable matches, diligence progress, saved searches, and portfolio signals.",
    metrics: [
      { label: "Qualified matches", value: "42", change: "+11", comparison: "Businesses aligned with mandates", icon: Target, tone: "positive" },
      { label: "Diligence pipeline", value: "13", change: "+3", comparison: "Opportunities under evaluation", icon: BriefcaseBusiness, tone: "positive" },
      { label: "Capital represented", value: "$28.5M", change: "+12%", comparison: "Across active mandates", icon: CircleDollarSign, tone: "positive" },
      { label: "Saved searches", value: "9", change: "+2", comparison: "Reusable discovery searches", icon: Search, tone: "positive" },
    ],
  },
};

function resolveAccountDashboard(user) {
  const role = String(user?.account_type || user?.role || "individual").toLowerCase();
  if (role.includes("invest")) return "investment";
  if (role.includes("business") || role.includes("company")) return "business";

//   return "individual";
//    return "business";
    return "investment";
}

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [range, setRange] = useState("30");
  const [assistantVisible, setAssistantVisible] = useState(true);

  useEffect(() => {
    let alive = true;

    async function loadUser() {
      try {
        const response = await fetch("/api/me", {
          credentials: "same-origin",
          headers: {
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
        });
        const data = await response.json().catch(() => ({}));
        if (alive && response.ok && data?.ok && data?.user) setUser(data.user);
      } catch {
        // The dashboard remains usable when the profile request is unavailable.
      }
    }

    loadUser();
    return () => {
      alive = false;
    };
  }, []);

  const greetingName = useMemo(
    () => user?.display_name || user?.name || "there",
    [user],
  );
  const accountType = useMemo(() => resolveAccountDashboard(user), [user]);
  const accountDashboard = ACCOUNT_DASHBOARDS[accountType];

  const exportDashboard = () => {
    const rows = [
      ["Metric", "Value", "Change"],
      ...accountDashboard.metrics.map((item) => [item.label, item.value, item.change]),
    ];
    const csv = rows.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "raymoch-dashboard.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ResponsiveController>
      <div className="dashboard-shell">
      <HorizontalNavigation activePath="/dashboard" />

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div>
            <p className="eyebrow">{accountDashboard.label} · Welcome back, {greetingName}</p>
            <h1>{accountDashboard.title}</h1>
          </div>
          <div className="topbar-actions">
            <button className="date-button" type="button" title="Current dashboard reporting date range">
              <CalendarDays size={16} />
              <span>Jan 1, 2025 – Feb 1, 2025</span>
            </button>
            <label className="range-select">
              <span className="sr-only">Reporting period</span>
              <select value={range} onChange={(event) => setRange(event.target.value)} title="Choose the dashboard reporting period">
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
              </select>
              <ChevronDown size={15} aria-hidden="true" />
            </label>
            <button className="secondary-button" type="button" onClick={() => setAssistantVisible(true)} title="Add or restore a dashboard widget">
              <Plus size={16} /> Add widget
            </button>
            <button className="primary-button" type="button" onClick={exportDashboard} title="Download dashboard metrics as a CSV file">
              <Download size={16} /> Export
            </button>
            <button className="notification-button" type="button" aria-label="Notifications" title="View your latest notifications">
              <Bell size={18} />
              <span />
            </button>
          </div>
        </header>

        <section className="kpi-grid" aria-label="Key dashboard metrics">
          {accountDashboard.metrics.map(({ label, value, change, comparison, icon: Icon, tone }) => (
            <article className="kpi-card" key={label} title={`${label}: ${value}, ${change} ${comparison}`}>
              <div className="kpi-label-row">
                <span>{label}</span>
                <Icon size={18} aria-hidden="true" />
              </div>
              <div className="kpi-value-row">
                <strong>{value}</strong>
                <span className={`change-chip ${tone}`}>
                  {tone === "positive" ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {change}
                </span>
              </div>
              <small>{comparison}</small>
            </article>
          ))}
        </section>

        <div className="dashboard-grid">
          <div className="dashboard-column dashboard-column-wide">
            <section className="dashboard-panel capital-panel" title="Capital opportunity performance and company network summary">
              <PanelHeader title="Capital opportunities" />
              <div className="capital-content">
                <div className="capital-summary">
                  <strong>$446.7M</strong>
                  <div><span className="change-chip positive"><ArrowUpRight size={12} />24.4%</span><small>vs. last period</small></div>
                </div>
                <TrendChart />
              </div>

              <div className="segment-card" title="Distribution of SMEs, investors, and partners in the Raymoch network">
                <div className="segment-title"><strong>Company network</strong><MoreHorizontal size={17} /></div>
                <div className="segments">
                  <div className="segment blue" title="2,884 small and medium-sized enterprises"><Building2 size={15} /><strong>2,884</strong><span>SMEs</span></div>
                  <div className="segment green" title="1,432 active investors"><Landmark size={15} /><strong>1,432</strong><span>Investors</span></div>
                  <div className="segment orange" title="562 ecosystem partners"><Handshake size={15} /><strong>562</strong><span>Partners</span></div>
                </div>
              </div>
            </section>

            <section className="dashboard-panel company-panel" title="Leading verified companies ranked by current platform signals">
              <PanelHeader title="Top verified companies" />
              <div className="table-scroll">
                <table>
                  <thead>
                    <tr><th>ID</th><th>Company</th><th>Country</th><th>CTI score</th><th>Capital sought</th></tr>
                  </thead>
                  <tbody>
                    {COMPANY_ROWS.map((company) => (
                      <tr key={company.id}>
                        <td>{company.id}</td>
                        <td>
                          <a className="company-name" href={`/companies/${company.id}`} title={`Open ${company.name} company profile`}>
                            <span className="company-avatar">{company.name.charAt(0)}</span>
                            <span><strong>{company.name}</strong><small>{company.sector}</small></span>
                          </a>
                        </td>
                        <td>{company.country}</td>
                        <td><span className="score"><ShieldCheck size={14} />{company.score}</span></td>
                        <td>
                          <span className={company.trend === "up" ? "capital-up" : "capital-down"}>
                            {company.trend === "up" ? <TrendingUp size={14} /> : <ArrowDownRight size={14} />}
                            {company.capital}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <div className="dashboard-column dashboard-column-side">
            <section className="dashboard-panel activity-panel" title="Activity levels recorded for each day of the week">
              <PanelHeader title="Most active day" />
              <div className="activity-chart">
                {ACTIVITY.map((item) => (
                  <div className={`activity-column ${item.active ? "active" : ""}`} key={item.day} title={`${item.day}: ${item.count || "No recorded"} activities`}>
                    <span className="activity-count">{item.count || ""}</span>
                    <div className="activity-bar-wrap"><span style={{ height: `${item.value}%` }} /></div>
                    <small>{item.day}</small>
                  </div>
                ))}
              </div>
            </section>

            <section className="dashboard-panel readiness-panel" title="Your current opportunity readiness score and target progress">
              <PanelHeader title="Opportunity readiness" />
              <OpportunityGauge />
            </section>

            {assistantVisible ? (
              <section className="dashboard-panel assistant-panel" title="AI-generated market opportunity summary">
                <div className="assistant-heading">
                  <div><Bot size={18} /><strong>AI market assistant</strong></div>
                  <button type="button" onClick={() => setAssistantVisible(false)} aria-label="Hide assistant" title="Hide the AI market assistant"><X size={17} /></button>
                </div>
                <div className="assistant-body">
                  <div className="assistant-orb"><Lightbulb size={25} /></div>
                  <div>
                    <strong>{accountDashboard.label}</strong>
                    <p>{accountDashboard.guidance}</p>
                  </div>
                </div>
                <a href="/assistant" title="Open the AI market assistant"><MessageSquareText size={15} /> Ask the assistant</a>
              </section>
            ) : null}
          </div>
        </div>
      </main>

      <Footer />

      <style>{`
        :root {
          color-scheme: light;
          --dash-blue: #5b3825;
          --dash-blue-dark: #382116;
          --dash-text: #1c1d1f;
          --dash-muted: #7a746d;
          --dash-line: #ded2c3;
          --dash-bg: #f7f2ea;
          --dash-card: #fbf8f3;
          --dash-green: #2f6f4f;
          --dash-red: #a85846;
          --dash-orange: #b57b3f;
        }
        * { box-sizing: border-box; }
        body { margin: 0; background: var(--dash-bg); color: var(--dash-text); font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        button, select { font: inherit; }
        button, a { -webkit-tap-highlight-color: transparent; }
        .dashboard-shell { min-height: 100vh; background: var(--dash-bg); }
        .dashboard-main { min-height: 100vh; margin-left: 0; padding: 26px 30px 34px; }
        .dashboard-topbar { display: flex; align-items: flex-end; justify-content: space-between; gap: 18px; margin-bottom: 20px; }
        .eyebrow { margin: 0 0 4px; color: var(--dash-muted); font-size: .78rem; font-weight: 650; }
        .dashboard-topbar h1 { margin: 0; font-size: clamp(1.55rem, 2vw, 2rem); letter-spacing: -.04em; }
        .topbar-actions { display: flex; align-items: center; justify-content: flex-end; gap: 8px; flex-wrap: wrap; }
        .date-button, .secondary-button, .primary-button, .notification-button, .range-select { min-height: 38px; border-radius: 10px; border: 1px solid var(--dash-line); background: #fbf8f3; color: #5d5a57; }
        .date-button, .secondary-button, .primary-button { display: inline-flex; align-items: center; gap: 8px; padding: 0 12px; cursor: pointer; font-size: .78rem; font-weight: 700; }
        .range-select { position: relative; display: flex; align-items: center; }
        .range-select select { height: 36px; padding: 0 28px 0 11px; border: 0; outline: 0; appearance: none; background: transparent; color: #5d5a57; font-size: .78rem; font-weight: 700; cursor: pointer; }
        .range-select svg { position: absolute; right: 8px; pointer-events: none; }
        .primary-button { border-color: var(--dash-blue); background: var(--dash-blue); color: #fff; }
        .primary-button:hover { background: #382116; }
        .secondary-button:hover, .date-button:hover { border-color: #a98b76; background: #eee3d6; }
        .notification-button { position: relative; display: grid; place-items: center; width: 38px; cursor: pointer; }
        .notification-button span { position: absolute; top: 7px; right: 8px; width: 6px; height: 6px; border: 2px solid #fbf8f3; border-radius: 50%; background: #a85846; }
        .kpi-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; margin-bottom: 20px; }
        .kpi-card, .dashboard-panel { border: 1px solid var(--dash-line); background: var(--dash-card); box-shadow: 0 2px 4px rgba(42,28,18,.035); }
        .kpi-card { min-height: 132px; padding: 17px; border-radius: 16px; }
        .kpi-label-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; color: #382f2a; font-size: .85rem; font-weight: 750; }
        .kpi-label-row svg { color: var(--dash-blue); }
        .kpi-value-row { display: flex; align-items: center; gap: 8px; margin-top: 15px; }
        .kpi-value-row > strong { font-size: 1.8rem; letter-spacing: -.045em; }
        .change-chip { display: inline-flex; align-items: center; gap: 2px; padding: 3px 6px; border-radius: 999px; font-size: .7rem; font-weight: 800; }
        .change-chip.positive { color: #2f6f4f; background: #e7f4ec; }
        .change-chip.negative { color: #9b4b3e; background: #f5e6e1; }
        .kpi-card > small { display: block; margin-top: 6px; color: #8b8178; font-size: .68rem; }
        .dashboard-grid { display: grid; grid-template-columns: minmax(0, 1.7fr) minmax(270px, 1fr); gap: 20px; align-items: start; }
        .dashboard-column { display: grid; gap: 20px; }
        .dashboard-panel { border-radius: 17px; overflow: hidden; }
        .panel-header { min-height: 52px; display: flex; align-items: center; justify-content: space-between; padding: 14px 17px 8px; }
        .panel-header h2 { margin: 0; font-size: .92rem; }
        .icon-button, .assistant-heading button { display: grid; place-items: center; border: 0; background: transparent; color: #8b8178; cursor: pointer; }
        .capital-panel { padding-bottom: 16px; }
        .capital-content { display: grid; grid-template-columns: 180px minmax(0, 1fr); gap: 12px; align-items: center; padding: 4px 18px 8px; }
        .capital-summary > strong { display: block; font-size: clamp(2rem, 3vw, 2.75rem); letter-spacing: -.055em; }
        .capital-summary > div { display: flex; align-items: center; gap: 8px; margin-top: 8px; }
        .capital-summary small { color: #7a746d; font-size: .68rem; }
        .trend-chart svg { display: block; width: 100%; height: auto; overflow: visible; }
        .trend-chart text { fill: #7a746d; font-size: 10px; }
        .chart-grid-line { stroke: #ded2c3; stroke-dasharray: 5 5; }
        .chart-line { fill: none; stroke: var(--dash-blue); stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; }
        .chart-ghost { fill: none; stroke: #c8b7a5; stroke-width: 1.5; stroke-dasharray: 5 5; }
        .segment-card { margin: 2px 17px 0; padding: 13px 14px; border: 1px solid var(--dash-line); border-radius: 13px; }
        .segment-title { display: flex; justify-content: space-between; align-items: center; margin-bottom: 11px; font-size: .75rem; }
        .segment-title svg { color: #8b8178; }
        .segments { display: grid; grid-template-columns: repeat(3, 1fr); }
        .segment { position: relative; display: grid; grid-template-columns: 18px auto; align-items: center; gap: 1px 5px; min-height: 61px; padding: 10px; border-left: 1px solid var(--dash-line); border-bottom: 5px solid currentColor; }
        .segment:first-child { border-left: 0; }
        .segment strong { color: var(--dash-text); font-size: 1.05rem; }
        .segment span { grid-column: 1 / -1; color: #7a746d; font-size: .68rem; }
        .segment.blue { color: #6f452e; }.segment.green { color: #2f6f4f; }.segment.orange { color: #b57b3f; }
        .activity-panel { min-height: 255px; }
        .activity-chart { min-height: 184px; display: grid; grid-template-columns: repeat(7, 1fr); align-items: end; gap: 9px; padding: 10px 18px 16px; }
        .activity-column { height: 145px; display: grid; grid-template-rows: 22px 1fr 20px; align-items: end; text-align: center; }
        .activity-count { color: #382f2a; font-size: .67rem; font-weight: 800; }
        .activity-bar-wrap { height: 100%; display: flex; align-items: flex-end; justify-content: center; }
        .activity-bar-wrap span { width: 100%; max-width: 28px; min-height: 21px; border-radius: 9px 9px 3px 3px; background: #e5ddd3; }
        .activity-column.active .activity-bar-wrap span { background: linear-gradient(180deg, #8f6847, #5b3825); box-shadow: 0 8px 18px rgba(91,56,37,.18); }
        .activity-column small { color: #7a746d; font-size: .68rem; }
        .activity-column.active small { color: var(--dash-blue); font-weight: 800; }
        .readiness-panel { min-height: 238px; }
        .gauge-wrap { display: grid; justify-items: center; padding: 4px 16px 16px; }
        .gauge { position: relative; width: 200px; height: 116px; margin-top: 10px; overflow: hidden; }
        .gauge-tick { position: absolute; left: calc(50% - 3px); bottom: -8px; width: 6px; height: 25px; border-radius: 4px; background: #ded2c3; transform-origin: 3px 66px; }
        .gauge-tick-active { background: #2f6f4f; }
        .gauge-score { position: absolute; inset: 50px 0 auto; display: grid; justify-items: center; }
        .gauge-score strong { font-size: 2rem; letter-spacing: -.05em; }
        .gauge-score span { color: #7a746d; font-size: .65rem; }
        .soft-button { padding: 7px 13px; border: 1px solid var(--dash-line); border-radius: 8px; color: #5b3825; background: #fffaf3; text-decoration: none; font-size: .72rem; font-weight: 750; }
        .company-panel { min-height: 273px; }
        .table-scroll { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 12px 17px; border-top: 1px solid #e8ded2; text-align: left; white-space: nowrap; }
        th { color: #7a746d; font-size: .65rem; letter-spacing: .06em; text-transform: uppercase; }
        td { color: #5d5a57; font-size: .75rem; }
        .company-name { display: flex; align-items: center; gap: 9px; color: #382f2a; text-decoration: none; }
        .company-name > span:last-child { display: grid; gap: 2px; }
        .company-name small { color: #8b8178; font-size: .64rem; }
        .company-avatar { display: grid; place-items: center; width: 28px; height: 28px; border-radius: 8px; color: #5b3825; background: #f2eadf; font-weight: 850; }
        .score, .capital-up, .capital-down { display: inline-flex; align-items: center; gap: 5px; }
        .score, .capital-up { color: #2f6f4f; }.capital-down { color: #a85846; }
        .assistant-panel { padding: 15px 17px; }
        .assistant-heading { display: flex; align-items: center; justify-content: space-between; }
        .assistant-heading > div { display: flex; align-items: center; gap: 8px; font-size: .86rem; }
        .assistant-heading > div svg { color: var(--dash-blue); }
        .assistant-body { display: flex; align-items: center; gap: 12px; margin: 16px 0; }
        .assistant-orb { flex: 0 0 auto; display: grid; place-items: center; width: 56px; height: 56px; border-radius: 50%; color: #fffaf3; background: radial-gradient(circle at 35% 25%, #d6a75c 0, #8b6248 48%, #382116 100%); box-shadow: 0 9px 22px rgba(91,56,37,.24); }
        .assistant-body strong { font-size: .77rem; }.assistant-body p { margin: 4px 0 0; color: #7a746d; font-size: .68rem; line-height: 1.45; }
        .assistant-panel > a { display: inline-flex; align-items: center; gap: 6px; color: var(--dash-blue); text-decoration: none; font-size: .74rem; font-weight: 800; }
        .dashboard-panel p, .assistant-body p { text-align: justify; text-justify: inter-word; }\n        .dashboard-topbar h1, .panel-header h2, .kpi-value-row > strong, .capital-summary > strong { color: #382116; }\n        .date-button, .secondary-button, .primary-button, .notification-button, .range-select, .soft-button { border-radius: 10px; }\n        .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
        @media (max-width: 1120px) {
          .kpi-grid { grid-template-columns: repeat(2, 1fr); }
          .dashboard-grid { grid-template-columns: 1fr; }
          .dashboard-column-side { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .assistant-panel { grid-column: 1 / -1; }
        }
        @media (max-width: 820px) {
          .dashboard-main { margin-left: 0; padding: 20px 18px 30px; }
          .dashboard-topbar { align-items: flex-start; }
          .eyebrow { display: none; }
          .date-button { display: none; }
        }
        @media (max-width: 640px) {
          .dashboard-topbar { display: grid; }
          .topbar-actions { justify-content: flex-start; }
          .secondary-button { display: none; }
          .kpi-grid { grid-template-columns: 1fr; }
          .kpi-card { min-height: 116px; }
          .capital-content { grid-template-columns: 1fr; }
          .trend-chart { margin-top: 10px; }
          .segments { grid-template-columns: 1fr; }
          .segment { border-left: 0; border-top: 1px solid var(--dash-line); }
          .segment:first-child { border-top: 0; }
          .dashboard-column-side { grid-template-columns: 1fr; }
          .assistant-panel { grid-column: auto; }
          .date-button span { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { scroll-behavior: auto !important; transition: none !important; }
        }
      `}</style>
      </div>
    </ResponsiveController>
  );
}
