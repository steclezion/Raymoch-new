import Header from "../components/layout_master/Header.jsx";
import Footer from "../components/layout_master/Footer.jsx";
import { ResponsiveController } from "../components/ResponsiveController.jsx";
import "../styles/insight-detail.css";

const CONTENT = {
  "featured": ["Featured intelligence", "Where African growth meets credible capital", "A closer look at how verification, market context, and transparent information can help capital reach credible opportunities."],
  "market-white-space": ["Market intelligence", "Where market white space is emerging", "Explore unmet demand signals across sectors and regions, with context for evaluating timing, readiness, and commercial potential."],
  "trust-infrastructure": ["Trust and verification", "The infrastructure behind credible growth", "Why consistent records, current information, and transparent verification are essential to stronger business and investment decisions."],
  "west-africa-agritech": ["Regional brief", "West Africa agritech opportunity brief", "A practical view of agritech demand, operating conditions, and the signals shaping business discovery across West Africa."],
  "energy-licensing-watch": ["Policy watch", "Energy licensing watch", "Track the regulatory movement and licensing considerations influencing distributed energy projects across African markets."],
  "freshness-and-trust": ["Trust methodology", "Why information freshness matters", "Recent, verifiable information improves comparison, reduces diligence friction, and makes trust signals more useful."],
  "top-markets": ["Market brief", "Africa’s leading enterprise discovery markets", "An overview of the markets attracting the strongest early discovery activity and the factors supporting that interest."],
  "regional-briefs": ["Regional intelligence", "Regional market briefs", "Focused intelligence that connects country-level signals with the broader regional environment in which businesses operate."],
  "high-trust-profiles": ["Verification", "What high-trust profiles do differently", "A guide to the completeness, consistency, and recency signals that make company profiles easier to evaluate."],
  "cross-page-themes": ["Market themes", "Climate, logistics, and fintech signals", "A cross-market review of the themes appearing most consistently in current research and business activity."],
  "energy-transition": ["Special report", "Africa’s energy transition", "Explore investment requirements, enabling policy, and enterprise opportunities emerging from Africa’s changing energy systems."],
  "genai-workforce": ["Special report", "Generative AI and the workforce", "A grounded look at how generative AI may reshape work, capability development, and enterprise productivity across African markets."],
  "climate-adaptation": ["Special report", "Climate adaptation and capital", "How adaptation needs are translating into investable infrastructure, technology, and service opportunities."],
  "capital-markets": ["Special report", "The future of African capital markets", "A review of the trust, information, and market infrastructure needed to deepen access to growth capital."],
  "africa-economic-outlook": ["Premium report", "Africa economic outlook", "Key growth, inflation, trade, and investment signals presented as a practical starting point for market evaluation."],
  "cross-border-capital-flows": ["Premium report", "Cross-border capital flows", "Understand the policy, currency, and trust factors shaping how capital moves between African markets."],
  "ghana-fx-repatriation": ["Policy signal", "Ghana export FX rules", "A concise overview of changes affecting selected exporters and the questions businesses and investors should examine next."],
  "kenya-vat-solar": ["Energy signal", "Kenya solar mini-grid VAT relief", "What targeted component relief may mean for project economics, procurement, and distributed energy operators."],
  "afdb-sme-climate": ["Capital signal", "Climate-adaptive SME financing", "A review of the expanded financing window and the readiness signals relevant to climate-focused small and medium enterprises."],
  "egypt-healthtech-sandbox": ["Regulatory signal", "Egypt healthtech sandbox pathway", "What a faster device approval pathway could mean for healthtech operators, partners, and market entry planning."],
  "nigeria-logistics-corridor": ["Logistics signal", "Nigeria logistics corridor upgrades", "How infrastructure improvements may change freight timing, reliability assumptions, and corridor-based opportunity."],
  "maghreb-manufacturing-watch": ["Market signal", "Maghreb manufacturing watch", "A comparative signal check on changing manufacturing inputs and operating momentum in Morocco and Tunisia."],
};

function titleFromPath(pathname) {
  const parts = pathname.split("/").filter(Boolean);
  const slug = parts.at(-1) || "intelligence";
  return slug.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function InsightDetail() {
  const pathname = typeof window !== "undefined" ? window.location.pathname : "/insights";
  const parts = pathname.split("/").filter(Boolean);
  const slug = parts.at(-1) || "featured";
  const type = parts[0] === "signals" ? "Signal" : "Insight";
  const fallbackTitle = titleFromPath(pathname);
  const [eyebrow, title, summary] = CONTENT[slug] || [
    `${type} explorer`,
    fallbackTitle,
    `Explore the latest Raymoch context for ${fallbackTitle.toLowerCase()}, including relevant market signals, trust considerations, and paths for further research.`,
  ];

  return (
    <ResponsiveController>
      <div className="insight-detail-page">
        <Header />
        <main>
          <section className="insight-detail-hero" aria-labelledby="insight-detail-title">
            <div className="insight-detail-wrap">
              <nav className="insight-detail-breadcrumb" aria-label="Breadcrumb">
                <a href="/">Home</a><span aria-hidden="true">/</span>
                <a href="/overview">Overview</a><span aria-hidden="true">/</span>
                <span aria-current="page">{type}</span>
              </nav>
              <p className="insight-detail-eyebrow">{eyebrow}</p>
              <h1 id="insight-detail-title">{title}</h1>
              <p className="insight-detail-summary">{summary}</p>
              <div className="insight-detail-actions">
                <a className="insight-detail-primary" href="/insights">Explore all intelligence</a>
                <a className="insight-detail-secondary" href="/overview">Return to overview</a>
              </div>
            </div>
          </section>

          <section className="insight-detail-body" aria-labelledby="context-heading">
            <div className="insight-detail-wrap insight-detail-grid">
              <article>
                <p className="insight-detail-kicker">Raymoch perspective</p>
                <h2 id="context-heading">What this means</h2>
                <p>{summary}</p>
                <p>Use this page as a starting point for discovery. Validate current policy, commercial, and company information before making an investment or operating decision.</p>
              </article>
              <aside aria-label="Research checklist">
                <h2>Evaluation checklist</h2>
                <ul>
                  <li>Confirm the source and publication date.</li>
                  <li>Compare country and sector conditions.</li>
                  <li>Review verification and information freshness.</li>
                  <li>Seek professional advice for material decisions.</li>
                </ul>
              </aside>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </ResponsiveController>
  );
}
