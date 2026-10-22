import { useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Compass,
  FileCheck2,
  Filter,
  Globe2,
  Landmark,
  LineChart,
  LockKeyhole,
  SearchCheck,
  ShieldCheck,
  SlidersHorizontal,
  Target,
} from "lucide-react";
import AuthAwareNavigation from "../components/AuthAwareNavigation.jsx";
import Footer from "../components/layout_master/Footer.jsx";
import RaymochInformationSupporter from "../components/RaymochInformationSupporter.jsx";
import "../styles/for-investors.css";

const JOURNEYS = {
  discover: {
    label: "Discover",
    title: "Start with a mandate, not an endless directory.",
    text: "Define the markets, sectors, stages, capabilities, and opportunity types relevant to your strategy. Raymoch helps organize discovery around those declared priorities.",
    points: ["Geography and sector filters", "Business-stage and capability context", "Saved preferences for repeatable discovery"],
    Icon: Compass,
  },
  evaluate: {
    label: "Evaluate",
    title: "Build an early view from structured evidence.",
    text: "Compare profile information, verification context, supporting materials, and information freshness before deciding where deeper diligence is justified.",
    points: ["Consistent company profiles", "Visible evidence and verification status", "Clear gaps for follow-up questions"],
    Icon: SearchCheck,
  },
  monitor: {
    label: "Monitor",
    title: "Keep opportunity context connected over time.",
    text: "Track changing company information, market signals, and matching activity from one workspace while retaining responsibility for every investment decision.",
    points: ["Centralized opportunity context", "Relevant research and market signals", "A clearer record of review activity"],
    Icon: LineChart,
  },
};

const MANDATES = {
  growth: { label: "Growth equity", values: [["Commercial traction", 88], ["Governance readiness", 72], ["Market expansion", 84], ["Evidence depth", 76]] },
  impact: { label: "Impact capital", values: [["Impact alignment", 91], ["Evidence depth", 74], ["Operating resilience", 79], ["Market inclusion", 86]] },
  strategic: { label: "Strategic investment", values: [["Capability fit", 90], ["Market access", 87], ["Operational maturity", 75], ["Partnership readiness", 83]] },
};

const DILIGENCE = [
  ["Identity and ownership context", "Review supplied registration, ownership, leadership, and operating-entity information alongside its verification status."],
  ["Commercial and operating profile", "Understand products, capabilities, customers, markets, traction, and stated expansion priorities in a consistent structure."],
  ["Evidence quality and freshness", "See whether relevant information is supported, when it was last updated, and which questions still require direct follow-up."],
  ["Market and policy context", "Connect company-level review with sector conditions, policy signals, regional dynamics, and other external considerations."],
  ["Independent diligence", "Use Raymoch as decision support while maintaining your own legal, financial, tax, technical, and commercial diligence processes."],
];

export default function ForInvestors() {
  const [journey, setJourney] = useState("discover");
  const [mandate, setMandate] = useState("growth");
  const current = JOURNEYS[journey];
  const CurrentIcon = current.Icon;

  return <div className="investors-page">
    <AuthAwareNavigation activePath="/for-investors" />
    <main>
      <section className="investors-intro">
        <div className="investors-wrap investors-intro__grid">
          <div>
            <p className="investors-eyebrow"><Landmark /> Raymoch for investors</p>
            <h1>Move from broad discovery to focused, evidence-led review.</h1>
            <p className="investors-lead">Find relevant African businesses, understand available trust signals, and organize early assessment around your investment mandate.</p>
            <div className="investors-actions"><a href="/explore">Explore businesses <ArrowRight /></a><a href="/request-trial">Request a trial</a></div>
          </div>
          <aside className="investors-principles" aria-label="Investment review principles">
            <div><ShieldCheck /><span><strong>Trust context</strong><small>See what information has been supplied, reviewed, and supported.</small></span></div>
            <div><SlidersHorizontal /><span><strong>Mandate alignment</strong><small>Focus discovery using the criteria relevant to your strategy.</small></span></div>
            <div><LockKeyhole /><span><strong>Controlled access</strong><small>Information access reflects permissions, purpose, and relationship stage.</small></span></div>
          </aside>
        </div>
      </section>

      <section className="investors-workflow investors-wrap" aria-labelledby="investor-workflow-title">
        <header><p>Investment workflow</p><h2 id="investor-workflow-title">A clearer path from search to decision support.</h2><span>Explore how each stage helps reduce noise without replacing investor judgment.</span></header>
        <div className="investors-workflow__tabs" role="tablist" aria-label="Investor workflow stages">{Object.entries(JOURNEYS).map(([id, item]) => <button key={id} type="button" role="tab" aria-selected={journey === id} className={journey === id ? "is-active" : ""} onClick={() => setJourney(id)}><item.Icon />{item.label}</button>)}</div>
        <article className="investors-workflow__panel" role="tabpanel">
          <span className="investors-workflow__icon"><CurrentIcon /></span>
          <div><h3>{current.title}</h3><p>{current.text}</p></div>
          <ul>{current.points.map((point) => <li key={point}><CheckCircle2 />{point}</li>)}</ul>
        </article>
      </section>

      <section className="investors-lens">
        <div className="investors-wrap investors-lens__grid">
          <div className="investors-lens__copy"><p>Interactive mandate lens</p><h2>Different strategies emphasize different signals.</h2><span>Select an example mandate to see how an early review framework can change. Values are illustrative, not company scores or investment recommendations.</span><div>{Object.entries(MANDATES).map(([id, item]) => <button type="button" key={id} className={mandate === id ? "is-active" : ""} onClick={() => setMandate(id)}>{item.label}</button>)}</div></div>
          <div className="investors-lens__chart" aria-label={`${MANDATES[mandate].label} illustrative signal priorities`}><header><span><BarChart3 /></span><div><small>Illustrative review emphasis</small><strong>{MANDATES[mandate].label}</strong></div></header>{MANDATES[mandate].values.map(([label, value]) => <div className="investors-bar" key={label}><span><strong>{label}</strong><small>{value}% emphasis</small></span><i><b style={{ width: `${value}%` }} /></i></div>)}<p><ShieldCheck /> Decision support only. Investors remain responsible for independent review.</p></div>
        </div>
      </section>

      <section className="investors-capabilities investors-wrap" aria-labelledby="investor-capabilities-title">
        <header><p>Built for practical review</p><h2 id="investor-capabilities-title">Connect company information with wider context.</h2></header>
        <div><article><span><Filter /></span><h3>Focused pipelines</h3><p>Use structured preferences to narrow businesses by relevant investment and operating characteristics.</p></article><article><span><FileCheck2 /></span><h3>Evidence visibility</h3><p>Identify available supporting information, verification state, and areas that need further examination.</p></article><article><span><Globe2 /></span><h3>Market context</h3><p>Consider regional, sector, policy, and macroeconomic signals alongside company-level information.</p></article><article><span><Target /></span><h3>Explainable fit</h3><p>Understand which stated preferences and company attributes contribute to a potential match.</p></article></div>
      </section>

      <section className="investors-diligence investors-wrap" aria-labelledby="investor-diligence-title">
        <div className="investors-diligence__heading"><div><p>Diligence framework</p><h2 id="investor-diligence-title">Know what Raymoch helps you review—and where your work continues.</h2></div><Building2 /></div>
        <div>{DILIGENCE.map(([title, text], index) => <details key={title} open={index === 0}><summary><span>{String(index + 1).padStart(2, "0")}</span><strong>{title}</strong><ChevronDown /></summary><p>{text}</p></details>)}</div>
      </section>

      <aside className="investors-cta investors-wrap"><div><span><CircleDollarSign /> Investor access</span><h2>Build a more focused opportunity workflow.</h2><p>Explore the platform or compare access options for your investment team.</p></div><div><a href="/request-trial">Request a guided trial <ArrowRight /></a><a href="/pricing">Compare plans</a></div></aside>
    </main>
    <RaymochInformationSupporter />
    <Footer />
  </div>;
}
