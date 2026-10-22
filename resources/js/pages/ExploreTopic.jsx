import { useMemo, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, ExternalLink, Layers3, RotateCw } from "lucide-react";
import AuthAwareNavigation from "../components/AuthAwareNavigation.jsx";
import Footer from "../components/layout_master/Footer.jsx";
import "../styles/explore-topic.css";

const TOPICS = {
  "trusted-matching": {
    title: "Trusted Matching", eyebrow: "Connection intelligence",
    summary: "Understand how Raymoch compares verified needs, capabilities, readiness, and fit to surface credible business relationships.",
    action: ["Open matching workspace", "/matching"], metric: "Match confidence", unit: "%",
    series: [42, 51, 49, 63, 68, 76, 84], bars: [["Strategic fit", 88], ["Verification", 81], ["Market overlap", 73], ["Readiness", 67]],
    cards: [["Fit, not proximity", "Matches prioritize complementary goals and execution capacity—not simply sector labels."], ["Explainable signals", "Each recommendation can be traced to evidence, verification, and declared preferences."], ["Human decision", "Scores guide discovery; organizations retain control over outreach and due diligence."]],
    sections: [["What is trusted matching?", "A structured comparison of two organizations using business objectives, sector relevance, geography, readiness, and verified evidence."], ["How confidence is formed", "Raymoch combines compatibility signals with verification quality. Strong evidence raises confidence; incomplete or conflicting information reduces it."], ["What users should do next", "Review the explanation behind a match, inspect company evidence, and complete independent commercial and legal due diligence before engagement."]],
  },
  verification: {
    title: "Verification", eyebrow: "Evidence and trust",
    summary: "Explore how identity, company documentation, operating claims, and source provenance become transparent trust signals.",
    action: ["Start verification", "/verification"], metric: "Evidence coverage", unit: "%",
    series: [31, 45, 56, 61, 72, 79, 91], bars: [["Identity", 96], ["Registration", 89], ["Operations", 74], ["Financial evidence", 62]],
    cards: [["Layered checks", "Verification is built from several independent evidence categories."], ["Visible provenance", "Users can distinguish submitted claims from reviewed and corroborated information."], ["Time-aware status", "Evidence can expire, change, or require a new review as organizations evolve."]],
    sections: [["What verification means", "Verification indicates that specified evidence was reviewed against defined checks. It is not an investment guarantee or endorsement."], ["The verification layers", "Identity, registration, operating location, leadership, financial materials, and public-source consistency contribute distinct signals."], ["Reading a result", "Inspect which categories passed, which remain incomplete, when evidence was reviewed, and where the underlying information originated."]],
  },
  "research-insights": {
    title: "Research & Insights", eyebrow: "Decision-ready research",
    summary: "Move from fragmented market information to structured regional, sector, policy, and company-level observations.",
    action: ["Browse market insights", "/insights"], metric: "Signal strength", unit: "",
    series: [48, 55, 52, 66, 61, 78, 86], bars: [["Market activity", 85], ["Capital movement", 72], ["Policy momentum", 68], ["Source coverage", 91]],
    cards: [["Multiple lenses", "Compare sector, geography, policy, and organization signals in one research path."], ["Source context", "Insight is more useful when its date, scope, and evidence limitations remain visible."], ["From signal to question", "Charts help users identify what deserves deeper research rather than declaring certainty."]],
    sections: [["What research includes", "Raymoch organizes market briefs, observed trends, sector conditions, regional context, and source-linked business intelligence."], ["How to interpret signals", "Direction and consistency matter more than a single point. Compare periods, supporting sources, and differences between regions."], ["Responsible use", "Research supports screening and planning. Material decisions should include current primary research and professional advice where appropriate."]],
  },
  "programs-services": {
    title: "Programs & Services", eyebrow: "Practical support pathways",
    summary: "Discover structured support for verification, readiness, visibility, research, partnerships, and market engagement.",
    action: ["View all services", "/services"], metric: "Program readiness", unit: "%",
    series: [37, 44, 58, 64, 70, 82, 88], bars: [["Discovery", 92], ["Readiness", 76], ["Verification", 83], ["Partner support", 69]],
    cards: [["Needs-led discovery", "Start with the outcome you need, then identify the appropriate service path."], ["Clear milestones", "Programs can be understood through scope, requirements, evidence, and expected next steps."], ["Connected support", "Services can work together without forcing every organization through the same journey."]],
    sections: [["What programs cover", "Support areas include business discovery, verification, visibility, matching, research, and selected partner-led programs."], ["Choosing a pathway", "Consider your immediate objective, current readiness, evidence available, target audience, and desired timing."], ["Before you apply", "Review eligibility, expected documentation, delivery scope, timelines, and any commercial terms shown for the selected service."]],
  },
  "policy-incentives": {
    title: "Policy & Incentives", eyebrow: "Regulatory opportunity signals",
    summary: "Explore grants, tax measures, financing programs, and regulatory changes with the context needed for further assessment.",
    action: ["Explore related insights", "/insights"], metric: "Policy momentum", unit: "",
    series: [29, 41, 38, 55, 65, 71, 80], bars: [["Tax measures", 74], ["Grant activity", 66], ["Trade policy", 81], ["Green finance", 88]],
    cards: [["Eligibility matters", "An announced incentive is not automatically available to every business."], ["Dates change outcomes", "Application windows, effective dates, and budget cycles must be checked."], ["Primary sources first", "Confirm material details with the issuing authority and qualified local advisers."]],
    sections: [["What appears here", "Policy and incentive intelligence may include grants, tax credits, concessions, financing facilities, trade rules, and regulatory developments."], ["How to screen an opportunity", "Check jurisdiction, eligible sectors, organization type, project stage, application dates, award conditions, and reporting obligations."], ["Important limitation", "Listings are discovery aids, not legal, tax, or financial advice. Always verify current terms with authoritative sources."]],
  },
  "whitespace-map": {
    title: "Whitespace Map", eyebrow: "Unmet-demand exploration",
    summary: "Examine where demand indicators may be growing faster than visible supply, infrastructure, or company coverage.",
    action: ["Explore businesses", "/explore"], metric: "Opportunity gap", unit: "%",
    series: [35, 47, 59, 54, 69, 77, 89], bars: [["Demand signal", 91], ["Supply gap", 78], ["Market access", 61], ["Data confidence", 72]],
    cards: [["A starting hypothesis", "Whitespace suggests where to investigate; it does not prove commercial viability."], ["Compare dimensions", "Demand, visible supply, infrastructure, regulation, and data coverage shape the gap."], ["Look for false gaps", "Limited data can resemble unmet demand, so confidence and source coverage matter."]],
    sections: [["What whitespace means", "Whitespace is the estimated difference between observed demand and visible capacity or supply within a defined market and sector."], ["How the map is formed", "Raymoch compares directional demand signals, organization coverage, accessibility, infrastructure, policy, and data confidence."], ["How to investigate", "Validate customer need locally, test pricing and distribution assumptions, examine competitors, and assess regulatory and operating constraints."]],
  },
};

function MiniLineChart({ values }) {
  const points = values.map((value, index) => `${index * (100 / (values.length - 1))},${100 - value}`).join(" ");
  return <svg className="explore-line" viewBox="0 0 100 100" preserveAspectRatio="none" role="img" aria-label="Directional seven-period trend"><defs><linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#875d42" stopOpacity=".28"/><stop offset="1" stopColor="#875d42" stopOpacity="0"/></linearGradient></defs><polygon points={`0,100 ${points} 100,100`} fill="url(#lineFill)"/><polyline points={points} fill="none" stroke="#65422e" strokeWidth="3" vectorEffect="non-scaling-stroke"/>{values.map((value, index) => <circle key={index} cx={index * (100 / (values.length - 1))} cy={100 - value} r="2.2" fill="#fff" stroke="#65422e" strokeWidth="1.2" vectorEffect="non-scaling-stroke"/>)}</svg>;
}

export default function ExploreTopic({ topicKey }) {
  const topic = TOPICS[topicKey] || TOPICS["research-insights"];
  const [open, setOpen] = useState(0);
  const [card, setCard] = useState(0);
  const [period, setPeriod] = useState("7 periods");
  const adjusted = useMemo(() => topic.series.map((value, index) => Math.max(10, Math.min(96, value + (period === "12 periods" ? (index % 2 ? 5 : -3) : period === "5 periods" ? 3 : 0)))), [topic, period]);
  const rotate = (direction) => setCard((current) => (current + direction + topic.cards.length) % topic.cards.length);

  return <div className="explore-topic-page">
    <AuthAwareNavigation activePath={`/explore/${topicKey}`} />
    <main className="explore-workspace">
      <header className="explore-workspace__heading"><div><nav aria-label="Breadcrumb"><a href="/explore">Explore</a><span>/</span><span>{topic.title}</span></nav><p>{topic.eyebrow}</p><h1>{topic.title}</h1><div className="explore-summary">{topic.summary}</div></div><a className="explore-action" href={topic.action[1]}>{topic.action[0]} <ExternalLink size={16}/></a></header>

      <section className="explore-grid">
        <article className="explore-panel explore-chart-panel"><div className="explore-panel__title"><div><span>Interactive indicator</span><h2>{topic.metric}</h2></div><select value={period} onChange={(event) => setPeriod(event.target.value)} aria-label="Chart period"><option>5 periods</option><option>7 periods</option><option>12 periods</option></select></div><div className="explore-chart-value">{adjusted.at(-1)}{topic.unit}<small>illustrative directional score</small></div><MiniLineChart values={adjusted}/><div className="explore-axis"><span>Earlier</span><span>Current</span></div><p className="explore-disclaimer">Illustrative values explain how the workspace is read; they are not live market measurements.</p></article>

        <article className="explore-panel explore-bars"><div className="explore-panel__title"><div><span>Signal composition</span><h2>What shapes the view</h2></div><Layers3 size={20}/></div><div>{topic.bars.map(([label, value]) => <button key={label} type="button" title={`${label}: ${value}%`}><span><strong>{label}</strong><em>{value}%</em></span><i><b style={{width:`${value}%`}}/></i></button>)}</div></article>

        <article className="explore-panel explore-rotate"><div className="explore-panel__title"><div><span>Rotate perspectives</span><h2>Three principles</h2></div><RotateCw size={20}/></div><div className="explore-card-stage">{topic.cards.map(([title, text], index) => {const offset=(index-card+topic.cards.length)%topic.cards.length; return <div className={`explore-perspective is-${offset}`} key={title} aria-hidden={offset!==0}><small>0{index+1}</small><h3>{title}</h3><p>{text}</p></div>})}</div><div className="explore-rotate-controls"><button type="button" onClick={()=>rotate(-1)} aria-label="Previous perspective"><ChevronLeft/></button><span>{card+1} / {topic.cards.length}</span><button type="button" onClick={()=>rotate(1)} aria-label="Next perspective"><ChevronRight/></button></div></article>

        <article className="explore-panel explore-accordion"><div className="explore-panel__title"><div><span>Explore the meaning</span><h2>Questions answered</h2></div></div>{topic.sections.map(([title,text],index)=><section className={open===index?"is-open":""} key={title}><button type="button" onClick={()=>setOpen(open===index?-1:index)} aria-expanded={open===index}><span>{title}</span><ChevronDown/></button><div><p>{text}</p></div></section>)}</article>
      </section>
    </main>
    <Footer />
  </div>;
}
