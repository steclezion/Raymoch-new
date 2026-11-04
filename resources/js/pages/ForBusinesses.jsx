import { useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Building2,
  CheckCircle2,
  ChevronDown,
  FileCheck2,
  Globe2,
  Handshake,
  LineChart,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  UsersRound,
} from "lucide-react";
import AuthAwareNavigation from "../components/AuthAwareNavigation.jsx";
import Footer from "../components/layout_master/Footer.jsx";
import RaymochInformationSupporter from "../components/RaymochInformationSupporter.jsx";
import "../styles/for-businesses.css";

const JOURNEY = {
  profile: {
    label: "Build your profile",
    title: "Present your business in a consistent, useful structure.",
    text: "Bring together your company identity, capabilities, markets, leadership, and growth priorities so potential partners can understand your business more quickly.",
    points: ["Structured company information", "Clear products and capabilities", "Visible growth priorities"],
    Icon: Building2,
  },
  verify: {
    label: "Add trust context",
    title: "Support important claims with relevant evidence.",
    text: "Provide available registration, ownership, operating, and performance materials. Verification status helps visitors distinguish supplied information from reviewed evidence.",
    points: ["Evidence-linked company details", "Information freshness context", "Clear follow-up gaps"],
    Icon: BadgeCheck,
  },
  connect: {
    label: "Find opportunities",
    title: "Make your priorities easier to match.",
    text: "Declare the markets, partnerships, capital needs, and commercial opportunities that matter to your next stage, then explore relevant connections.",
    points: ["Business-to-business discovery", "Investor alignment context", "Opportunity-focused matching"],
    Icon: Handshake,
  },
};

const READINESS = {
  visibility: {
    label: "Market visibility",
    values: [["Profile clarity", 86], ["Capability detail", 78], ["Market context", 72], ["Evidence coverage", 64]],
  },
  partnership: {
    label: "Partnership readiness",
    values: [["Capability detail", 89], ["Delivery context", 76], ["Evidence coverage", 81], ["Priority clarity", 84]],
  },
  capital: {
    label: "Capital readiness",
    values: [["Growth narrative", 88], ["Governance context", 74], ["Evidence coverage", 82], ["Use-of-funds clarity", 79]],
  },
};

const EVIDENCE = [
  ["Company identity", "Registration, ownership, leadership, and operating-location information can establish who the business is and where it operates."],
  ["Products and capabilities", "Clear descriptions, relevant certifications, delivery examples, and supporting materials can make commercial capabilities easier to assess."],
  ["Operating context", "Markets served, business stage, team capacity, and current priorities help potential partners understand fit and timing."],
  ["Growth and funding needs", "Specific expansion goals, partnership needs, and intended use of capital create a clearer basis for relevant conversations."],
  ["Ongoing accuracy", "Keep important information current and distinguish submitted claims from independently reviewed or verified material."],
];

export default function ForBusinesses() {
  const [stage, setStage] = useState("profile");
  const [goal, setGoal] = useState("visibility");
  const currentStage = JOURNEY[stage];
  const StageIcon = currentStage.Icon;

  return (
    <div className="businesses-page">
      <AuthAwareNavigation activePath="/for-businesses" />
      <main>
        <section className="businesses-hero">
          <div className="businesses-wrap businesses-hero__grid">
            <div>
              <p className="businesses-eyebrow"><Sparkles /> Raymoch for businesses</p>
              <h1>Turn business information into clearer opportunities.</h1>
              <p className="businesses-lead">Build a credible company presence, make your capabilities easier to understand, and connect your growth priorities with relevant partners, investors, and markets.</p>
              <div className="businesses-actions">
                <a href="/request-trial">Request a guided trial <ArrowRight /></a>
                <a href="/pricing">Compare plans</a>
              </div>
            </div>
            <aside className="businesses-signal-card" aria-label="Business opportunity flow">
              <header><span><Building2 /></span><div><small>From profile to opportunity</small><strong>A clearer business signal</strong></div></header>
              <div className="businesses-signal-step"><i>01</i><span><strong>Describe</strong><small>Organize identity, capabilities, and goals.</small></span><CheckCircle2 /></div>
              <div className="businesses-signal-line" />
              <div className="businesses-signal-step"><i>02</i><span><strong>Support</strong><small>Add evidence and verification context.</small></span><CheckCircle2 /></div>
              <div className="businesses-signal-line" />
              <div className="businesses-signal-step"><i>03</i><span><strong>Connect</strong><small>Explore aligned commercial and capital opportunities.</small></span><Target /></div>
            </aside>
          </div>
        </section>

        <section className="businesses-outcomes businesses-wrap" aria-labelledby="business-outcomes-title">
          <header><p>Built around practical outcomes</p><h2 id="business-outcomes-title">Help the right people understand your business.</h2></header>
          <div>
            <article><span><Globe2 /></span><h3>Increase discoverability</h3><p>Present your business through structured details that make location, sector, capabilities, and priorities easier to find.</p></article>
            <article><span><ShieldCheck /></span><h3>Strengthen trust context</h3><p>Show what information is available, what evidence supports it, and where additional review may still be needed.</p></article>
            <article><span><Handshake /></span><h3>Clarify partnership fit</h3><p>Express the commercial relationships, market access, expertise, and resources relevant to your growth plans.</p></article>
            <article><span><LineChart /></span><h3>Prepare for growth</h3><p>Keep your operating story, evidence, and opportunity priorities connected as your business develops.</p></article>
          </div>
        </section>

        <section className="businesses-journey">
          <div className="businesses-wrap">
            <header><p>Business journey</p><h2>A useful profile is built in stages.</h2><span>Explore how structured information can support discovery without overstating what has been verified.</span></header>
            <div className="businesses-journey__tabs" role="tablist" aria-label="Business profile journey">
              {Object.entries(JOURNEY).map(([id, item]) => <button key={id} type="button" role="tab" aria-selected={stage === id} className={stage === id ? "is-active" : ""} onClick={() => setStage(id)}><item.Icon />{item.label}</button>)}
            </div>
            <article className="businesses-journey__panel" role="tabpanel">
              <span><StageIcon /></span>
              <div><h3>{currentStage.title}</h3><p>{currentStage.text}</p></div>
              <ul>{currentStage.points.map((point) => <li key={point}><CheckCircle2 />{point}</li>)}</ul>
            </article>
          </div>
        </section>

        <section className="businesses-readiness">
          <div className="businesses-wrap businesses-readiness__grid">
            <div className="businesses-readiness__copy">
              <p>Interactive readiness lens</p><h2>Different goals require different information.</h2>
              <span>Select a growth goal to see an illustrative information emphasis. These values are examples, not an assessment of your company.</span>
              <div>{Object.entries(READINESS).map(([id, item]) => <button type="button" key={id} className={goal === id ? "is-active" : ""} onClick={() => setGoal(id)}>{item.label}</button>)}</div>
            </div>
            <div className="businesses-readiness__chart" aria-label={`${READINESS[goal].label} illustrative information priorities`}>
              <header><span><BarChart3 /></span><div><small>Illustrative information emphasis</small><strong>{READINESS[goal].label}</strong></div></header>
              {READINESS[goal].values.map(([label, value]) => <div className="businesses-meter" key={label}><span><strong>{label}</strong><small>{value}% emphasis</small></span><i><b style={{ width: `${value}%` }} /></i></div>)}
              <p><ShieldCheck /> Example guidance only. Verification and independent review remain separate processes.</p>
            </div>
          </div>
        </section>

        <section className="businesses-evidence businesses-wrap" aria-labelledby="business-evidence-title">
          <div className="businesses-evidence__heading"><div><p>Information checklist</p><h2 id="business-evidence-title">Build a profile people can evaluate responsibly.</h2></div><FileCheck2 /></div>
          <div>{EVIDENCE.map(([title, text], index) => <details key={title} open={index === 0}><summary><span>{String(index + 1).padStart(2, "0")}</span><strong>{title}</strong><ChevronDown /></summary><p>{text}</p></details>)}</div>
        </section>

        <section className="businesses-discovery businesses-wrap">
          <div><span><Search /></span><h2>See the market from both sides.</h2><p>Explore businesses to understand how structured profiles appear in discovery, then prepare your own information for more relevant conversations.</p></div>
          <a href="/explore">Explore businesses <ArrowRight /></a>
        </section>

        <aside className="businesses-cta businesses-wrap">
          <div><span><UsersRound /> Business access</span><h2>Make your next opportunity easier to understand.</h2><p>Start with a guided trial or review the plan designed for growing businesses.</p></div>
          <div><a href="/request-trial">Request a guided trial <ArrowRight /></a><a href="/pricing">View pricing</a></div>
        </aside>
      </main>
      <RaymochInformationSupporter />
      <Footer />
    </div>
  );
}
