import { useMemo, useState } from "react";
import HorizontalNavigation from "../components/HorizontalNavigation.jsx";
import Footer from "../components/layout_master/Footer.jsx";
import { ResponsiveController } from "../components/ResponsiveController.jsx";

/*
  Insight.jsx

  Raymoch Insight is the continent-wide intelligence layer.

  Mission:
  - Track what is changing across Africa and connected global markets.
  - Organize policy, country, regional, sector, capital, risk, procurement,
    technology, infrastructure, and international spillover signals.
  - Combine direct online tracking with Raymoch database intelligence.
  - Route company-level verification, CTI scores, and proprietary company data
    to Businesses.jsx instead of overloading this page.

  Core distinction:
  - Insight.jsx tracks the environment.
  - Businesses.jsx verifies the actors.
  - OverviewPage.jsx samples everything.
  - LandingV2.jsx sells the mission.

  Recommended route:
    /insight

  Recommended nav label:
    Insight
*/

/*
  PAGE_SEQUENCE controls the vertical order of the Insight page.

  To reorder the page:
  - Move objects up or down.
  - To hide a section temporarily, set enabled: false.
  - Do not move large JSX blocks manually unless changing the actual structure.
*/
const PAGE_SEQUENCE = [
  {
    id: "hero",
    enabled: true,
    label: "Hero",
    purpose: "Introduces Raymoch Insight as a live intelligence desk, not a blog feed.",
  },
  {
    id: "desk",
    enabled: true,
    label: "Insight Desk",
    purpose: "Featured intelligence, classification tabs, country/region/sector filters, and live signals.",
  },
  {
    id: "tracker",
    enabled: true,
    label: "Policy Tracker",
    purpose: "Tracks policy and regulatory movement by country, sector, status, and impact.",
  },
  {
    id: "regions",
    enabled: true,
    label: "Regional Watch",
    purpose: "Shows regional movement across East, West, North, Central, Southern, and continental Africa.",
  },
  {
    id: "countries",
    enabled: true,
    label: "Country Signal Map",
    purpose: "Uses dropdowns, sector lenses, and visual summaries instead of forcing 55 countries into static cards.",
  },
  {
    id: "sectors",
    enabled: true,
    label: "Sector Signals",
    purpose: "Tracks sector-level movement and routes users to related research.",
  },
  {
    id: "spillovers",
    enabled: true,
    label: "International Spillovers",
    purpose: "Connects African investment environments to global rates, capital, trade, climate, and commodity movement.",
  },
  {
    id: "method",
    enabled: true,
    label: "Data Method",
    purpose: "Explains the future online + database tracking architecture.",
  },
  {
    id: "businessBridge",
    enabled: true,
    label: "Business Bridge",
    purpose: "Routes users to Businesses.jsx for company verification, CTI scores, and proprietary actor-level data.",
  },
  {
    id: "research",
    enabled: true,
    label: "Research Products",
    purpose: "Connects Insight to briefs, reports, country snapshots, and methodology notes.",
  },
];

/*
  PAGE_CONTROLLERS controls layout sizing, spacing, and density.
  Adjust this object first before editing individual styles.
*/
const PAGE_CONTROLLERS = {
  hero: {
    minHeight: 420,
    gridColumns: "1.05fr 0.95fr",
    gap: 28,
  },
  desk: {
    gridColumns: "0.72fr 1.42fr 0.86fr",
    gap: 20,
    featuredMinHeight: 520,
    railMinHeight: 520,
  },
  tracker: {
    gridColumns: "1fr 1fr",
    gap: 18,
  },
  regions: {
    gridColumns: "repeat(3, minmax(0, 1fr))",
    gap: 18,
  },
  countries: {
    gridColumns: "0.76fr 1.38fr 0.86fr",
    gap: 20,
    visualMinHeight: 520,
  },
  sectors: {
    gridColumns: "repeat(4, minmax(0, 1fr))",
    gap: 16,
  },
  spillovers: {
    gridColumns: "1fr 1fr 1fr",
    gap: 18,
  },
  research: {
    gridColumns: "repeat(4, minmax(0, 1fr))",
    gap: 18,
  },
};

/*
  BRAND is the page-level visual identity.
  Keep color changes centralized here.
*/
const BRAND = {
  colors: {
    dark: "#382116",
    darkSoft: "#5b3825",
    surface: "#f7f2ea",
    surfaceAlt: "#eee3d6",
    surfaceSoft: "#fbf8f3",
    white: "#ffffff",
    text: "#1c1d1f",
    body: "#5d5a57",
    muted: "#7a746d",
    textOnDark: "#fbf8f3",
    brand: "#5b3825",
    brandDeep: "#382116",
    rust: "#8b6248",
    gold: "#b57b3f",
    bronze: "#8f6847",
    oat: "#f3e7cf",
    oatDeep: "#ded2c3",
    green: "#2f6f4f",
    greenSoft: "#e7f4ec",
    blueInk: "#6f452e",
    blueSoft: "#f2eadf",
    red: "#a85846",
    redSoft: "#f5e6e1",
    border: "#ded2c3",
    borderStrong: "#c8b7a5",
  },
  gradients: {
    hero:
      "radial-gradient(circle at 78% 16%, rgba(235,191,96,0.33), transparent 25%), radial-gradient(circle at 86% 82%, rgba(47,111,72,0.14), transparent 30%), linear-gradient(135deg, rgba(255,252,246,1), rgba(246,241,232,0.98) 52%, rgba(239,229,211,0.95))",
    dark:
      "radial-gradient(circle at 20% 16%, rgba(235,191,96,0.17), transparent 28%), radial-gradient(circle at 86% 82%, rgba(168,112,50,0.18), transparent 28%), linear-gradient(135deg, rgba(61,38,25,1), rgba(27,34,39,1))",
    card:
      "linear-gradient(135deg, rgba(255,252,246,1), rgba(251,248,242,1))",
    warm:
      "linear-gradient(135deg, rgba(246,241,232,1), rgba(242,225,198,0.68))",
  },
  shadows: {
    sm: "0 8px 20px rgba(42,28,18,0.06)",
    md: "0 12px 30px rgba(42,28,18,0.08)",
    lg: "0 18px 50px rgba(42,28,18,0.12)",
    xl: "0 30px 80px rgba(42,28,18,0.16)",
  },
};

/*
  TYPE controls fonts for the page.
  Keep these consistent with LandingV2 and OverviewPage.
*/
const TYPE = {
  family: {
    body: '"Inter", "Segoe UI", sans-serif',
    heading: '"Merriweather", Georgia, serif',
  },
};

/*
  LAYOUT controls the global page rhythm.
*/
const LAYOUT = {
  wrapMax: 1440,
  wrapPadX: 28,
  sectionPadY: 66,
};

/*
  Static demo data now. Later these arrays can be replaced by:
  - API response from Raymoch database.
  - Online tracking feeds.
  - Admin-curated intelligence.
  - Hybrid scoring pipeline.
*/
const deskTabs = [
  "All",
  "Continental",
  "Regional",
  "Country Watch",
  "Policy",
  "Markets",
  "Sectors",
  "International",
  "Reports",
];

const filterOptions = {
  regions: ["All regions", "East Africa", "West Africa", "North Africa", "Central Africa", "Southern Africa", "Pan-African"],
  countries: ["All countries", "Kenya", "Ghana", "Nigeria", "Egypt", "Rwanda", "Ethiopia", "South Africa", "Morocco", "Senegal"],
  sectors: ["All sectors", "Energy", "Fintech", "Agriculture", "Logistics", "Healthtech", "Manufacturing", "Mining", "Climate", "Telecom"],
  topics: ["All topics", "Policy", "Capital", "FX", "Procurement", "Infrastructure", "Trade", "Technology", "Risk"],
};

const featuredInsights = [
  {
    title: "Renewable energy incentives are becoming a regional competitiveness signal.",
    kicker: "Policy + Energy",
    region: "East Africa",
    country: "Kenya",
    impact: "High impact",
    confidence: "Medium confidence",
    sourceLayer: "Online + database ready",
    summary:
      "Tax relief, mini-grid rules, and climate finance windows are starting to shape where energy-linked SMEs and infrastructure investors may prioritize deployment.",
    why:
      "Energy policy is no longer just a public-sector update. It affects project bankability, procurement timing, supplier demand, and company verification needs.",
  },
  {
    title: "FX repatriation rules remain a hidden constraint for cross-border capital.",
    kicker: "Markets + Capital",
    region: "West Africa",
    country: "Ghana",
    impact: "Medium impact",
    confidence: "Medium confidence",
    sourceLayer: "Database watchlist",
    summary:
      "Capital movement, currency pressure, and repatriation rules continue to influence investor confidence and deal timing.",
    why:
      "A company may look promising, but the environment around currency convertibility can decide whether capital actually moves.",
  },
  {
    title: "Healthtech sandboxes are becoming early signals for regulated innovation.",
    kicker: "Technology + Regulation",
    region: "North Africa",
    country: "Egypt",
    impact: "Medium impact",
    confidence: "Early signal",
    sourceLayer: "Online feed candidate",
    summary:
      "Sandbox rules and device approval pathways are emerging as important indicators for digital health and diagnostics investment.",
    why:
      "Regulated sectors need policy visibility. Without it, technology adoption becomes noise with a fancy logo.",
  },
];

const liveSignals = [
  {
    tag: "Policy",
    text: "Energy incentives under review across multiple mini-grid markets.",
    meta: "East Africa · 2 sources",
  },
  {
    tag: "FX",
    text: "Currency and repatriation constraints remain relevant for cross-border investors.",
    meta: "West Africa · watchlist",
  },
  {
    tag: "Procurement",
    text: "Public procurement digitization is becoming a platform-readiness signal.",
    meta: "Nigeria · medium confidence",
  },
  {
    tag: "Climate",
    text: "Climate-adaptive SME financing windows may shift pipeline visibility.",
    meta: "Pan-African · capital signal",
  },
];

const policyTracker = [
  {
    country: "Kenya",
    area: "Renewable energy / mini-grids",
    status: "Monitoring",
    impact: "High",
    signal: "Tax relief and licensing changes may alter project economics.",
  },
  {
    country: "Ghana",
    area: "FX repatriation",
    status: "Watchlist",
    impact: "Medium",
    signal: "Capital movement rules affect investor confidence and deal structure.",
  },
  {
    country: "Egypt",
    area: "Healthtech regulation",
    status: "Early signal",
    impact: "Medium",
    signal: "Sandbox and device approval changes may accelerate regulated healthtech.",
  },
  {
    country: "Nigeria",
    area: "Customs / procurement digitization",
    status: "Developing",
    impact: "High",
    signal: "Trade and procurement digitization affects logistics, compliance, and supplier visibility.",
  },
  {
    country: "Ethiopia",
    area: "Telecom / finance liberalization",
    status: "Strategic watch",
    impact: "High",
    signal: "Market opening affects telecom, fintech, enterprise services, and foreign participation.",
  },
  {
    country: "Rwanda",
    area: "Digital services / logistics",
    status: "Stable signal",
    impact: "Medium",
    signal: "Digital infrastructure and logistics coordination remain relevant to regional service expansion.",
  },
];

const regionalWatch = [
  {
    region: "East Africa",
    title: "Energy, logistics, and digital infrastructure remain the strongest signal cluster.",
    text: "Watch mini-grid policy, port corridors, digital finance rules, and enterprise adoption patterns.",
  },
  {
    region: "West Africa",
    title: "FX, fintech, debt conditions, and trade corridors dominate the investment environment.",
    text: "Currency pressure and regulatory clarity will shape capital deployment and company growth signals.",
  },
  {
    region: "North Africa",
    title: "Manufacturing, healthtech, energy transition, and Gulf/EU capital corridors matter most.",
    text: "International spillovers are especially important because of proximity to Europe, Gulf capital, and energy markets.",
  },
  {
    region: "Central Africa",
    title: "Infrastructure, mining, logistics, and institutional capacity are core monitoring areas.",
    text: "Signals require careful confidence scoring because data quality and source diversity can vary sharply.",
  },
  {
    region: "Southern Africa",
    title: "Power markets, mining, logistics, and industrial policy shape operating conditions.",
    text: "Electricity reliability and regional trade capacity remain decisive for manufacturing and mining-linked suppliers.",
  },
  {
    region: "Continental",
    title: "Trade integration, climate finance, and digital public infrastructure are pan-African signals.",
    text: "These are not isolated updates. They shape platform-level opportunity across countries and sectors.",
  },
];

const countrySectorSignals = [
  {
    country: "Kenya",
    region: "East Africa",
    sectors: ["Energy", "Fintech", "Logistics", "Climate"],
    signalVolume: 84,
    policyActivity: "High",
    investmentRelevance: "High",
    confidence: "Medium",
    majorSignals: ["Mini-grid rules", "Digital finance", "Port corridor logistics"],
  },
  {
    country: "Nigeria",
    region: "West Africa",
    sectors: ["Fintech", "Logistics", "Energy", "Procurement", "Manufacturing"],
    signalVolume: 91,
    policyActivity: "High",
    investmentRelevance: "High",
    confidence: "Medium",
    majorSignals: ["Customs digitization", "Payment rails", "Supplier visibility"],
  },
  {
    country: "Egypt",
    region: "North Africa",
    sectors: ["Healthtech", "Manufacturing", "Energy", "Technology"],
    signalVolume: 78,
    policyActivity: "Medium",
    investmentRelevance: "High",
    confidence: "Medium",
    majorSignals: ["Healthtech sandbox", "Manufacturing corridors", "Gulf/EU capital links"],
  },
  {
    country: "Ghana",
    region: "West Africa",
    sectors: ["Fintech", "Capital", "Agriculture", "Energy"],
    signalVolume: 69,
    policyActivity: "Medium",
    investmentRelevance: "Medium",
    confidence: "Medium",
    majorSignals: ["FX repatriation", "Debt conditions", "Fintech regulation"],
  },
  {
    country: "South Africa",
    region: "Southern Africa",
    sectors: ["Energy", "Mining", "Manufacturing", "Logistics", "Climate"],
    signalVolume: 88,
    policyActivity: "High",
    investmentRelevance: "High",
    confidence: "High",
    majorSignals: ["Power markets", "Mining supply chains", "Industrial logistics"],
  },
  {
    country: "Morocco",
    region: "North Africa",
    sectors: ["Manufacturing", "Climate", "Energy", "Logistics"],
    signalVolume: 74,
    policyActivity: "Medium",
    investmentRelevance: "High",
    confidence: "Medium",
    majorSignals: ["EU corridor readiness", "Green manufacturing", "Renewable energy"],
  },
  {
    country: "Rwanda",
    region: "East Africa",
    sectors: ["Technology", "Logistics", "Fintech", "Services"],
    signalVolume: 58,
    policyActivity: "Medium",
    investmentRelevance: "Medium",
    confidence: "Medium",
    majorSignals: ["Digital services", "Logistics coordination", "Policy stability"],
  },
  {
    country: "Ethiopia",
    region: "East Africa",
    sectors: ["Telecom", "Finance", "Manufacturing", "Agriculture"],
    signalVolume: 63,
    policyActivity: "High",
    investmentRelevance: "High",
    confidence: "Early signal",
    majorSignals: ["Telecom liberalization", "Finance opening", "Industrial capacity"],
  },
  {
    country: "Senegal",
    region: "West Africa",
    sectors: ["Energy", "Infrastructure", "Services", "Agriculture"],
    signalVolume: 52,
    policyActivity: "Medium",
    investmentRelevance: "Medium",
    confidence: "Medium",
    majorSignals: ["Energy projects", "Infrastructure pipeline", "Service economy"],
  },
  {
    country: "Tanzania",
    region: "East Africa",
    sectors: ["Logistics", "Agriculture", "Energy", "Infrastructure"],
    signalVolume: 55,
    policyActivity: "Medium",
    investmentRelevance: "Medium",
    confidence: "Medium",
    majorSignals: ["Port corridors", "Agriculture logistics", "Energy demand"],
  },
];

const countryLensOptions = ["Signal volume", "Policy activity", "Investment relevance", "Sector strength"];

const sectorSignals = [
  {
    sector: "Energy",
    text: "Mini-grids, tax relief, generation capacity, and climate finance windows.",
    href: "/research-insights/sectors/energy",
  },
  {
    sector: "Fintech",
    text: "Licensing, payment rails, FX rules, digital ID, and compliance pressure.",
    href: "/research-insights/sectors/fintech",
  },
  {
    sector: "Agriculture",
    text: "Input costs, logistics, climate exposure, export rules, and procurement demand.",
    href: "/research-insights/sectors/agriculture",
  },
  {
    sector: "Logistics",
    text: "Ports, customs digitization, corridor reliability, and supplier movement.",
    href: "/research-insights/sectors/logistics",
  },
  {
    sector: "Healthtech",
    text: "Device approval, sandboxes, diagnostics, insurance, and public procurement.",
    href: "/research-insights/sectors/healthtech",
  },
  {
    sector: "Manufacturing",
    text: "Industrial parks, energy reliability, imports, machinery, and trade rules.",
    href: "/research-insights/sectors/manufacturing",
  },
  {
    sector: "Mining",
    text: "Licensing, commodity prices, export restrictions, and local-content rules.",
    href: "/research-insights/sectors/mining",
  },
  {
    sector: "Climate",
    text: "Adaptation finance, carbon rules, resilience infrastructure, and disclosure pressure.",
    href: "/research-insights/sectors/climate",
  },
];

const internationalSpillovers = [
  {
    title: "Global interest rates",
    text: "Affects capital cost, debt service, investor timing, and risk appetite across emerging markets.",
  },
  {
    title: "China-Africa financing",
    text: "Infrastructure finance, contractor networks, debt renegotiation, and industrial corridor development remain connected.",
  },
  {
    title: "EU carbon and trade rules",
    text: "Carbon border rules and product standards can reshape export competitiveness and supplier readiness.",
  },
  {
    title: "Gulf investment corridors",
    text: "Capital from Gulf states increasingly connects logistics, food security, ports, energy, and real estate.",
  },
  {
    title: "Commodity prices",
    text: "Mining, agriculture, energy, currencies, fiscal balances, and local procurement all move with price cycles.",
  },
  {
    title: "Shipping disruptions",
    text: "Freight costs and route instability affect import-dependent sectors and regional logistics planning.",
  },
];

const methodLayers = [
  {
    title: "Online tracking layer",
    text: "Public policy notices, institutional updates, development finance windows, official releases, market reports, and curated external feeds.",
  },
  {
    title: "Raymoch database layer",
    text: "Verified profiles, company freshness, sector classification, country exposure, CTI evidence, platform behavior, and proprietary research notes.",
  },
  {
    title: "Signal scoring layer",
    text: "Recency, confidence, source diversity, impact level, country relevance, sector relevance, and connection to verified actors.",
  },
  {
    title: "Routing layer",
    text: "Signals become briefs, reports, dashboards, country pages, sector pages, company context, and future matching logic.",
  },
];

const researchProducts = [
  {
    tag: "Briefs",
    title: "Fast market context",
    text: "Short intelligence notes for policy, region, country, sector, and international movement.",
    href: "/research-insights/briefs",
  },
  {
    tag: "Reports",
    title: "Long-form intelligence",
    text: "Deep reports connecting capital, policy, sectors, countries, risks, and verified discovery.",
    href: "/research-insights/reports",
  },
  {
    tag: "Country snapshots",
    title: "Country-level operating view",
    text: "Structured country pages that organize policy, sectors, capital, risk, and company discovery routes.",
    href: "/research-insights/countries",
  },
  {
    tag: "Methods",
    title: "Confidence and taxonomy notes",
    text: "Explain how Raymoch classifies sources, scores signals, and separates evidence from noise.",
    href: "/research-insights/methodology",
  },
];
//export default Market_Insight;

export default function Market_Insight() {
  const S = useMemo(() => makeStyles(BRAND, TYPE, LAYOUT, PAGE_CONTROLLERS), []);
  const [activeTab, setActiveTab] = useState("All");
  const [region, setRegion] = useState(filterOptions.regions[0]);
  const [country, setCountry] = useState(filterOptions.countries[0]);
  const [sector, setSector] = useState(filterOptions.sectors[0]);
  const [topic, setTopic] = useState(filterOptions.topics[0]);
  const [activeInsight, setActiveInsight] = useState(featuredInsights[0]);
  const [countryLens, setCountryLens] = useState(countryLensOptions[0]);
  const [countryMapSector, setCountryMapSector] = useState("Energy");

  const renderSection = (section) => {
    switch (section.id) {
      case "hero":
        return <HeroSection key={section.id} S={S} />;
      case "desk":
        return (
          <InsightDeskSection
            key={section.id}
            S={S}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            region={region}
            setRegion={setRegion}
            country={country}
            setCountry={setCountry}
            sector={sector}
            setSector={setSector}
            topic={topic}
            setTopic={setTopic}
            activeInsight={activeInsight}
            setActiveInsight={setActiveInsight}
          />
        );
      case "tracker":
        return <PolicyTrackerSection key={section.id} S={S} />;
      case "regions":
        return <RegionalWatchSection key={section.id} S={S} />;
      case "countries":
        return (
          <CountrySignalMapSection
            key={section.id}
            S={S}
            country={country}
            setCountry={setCountry}
            countryMapSector={countryMapSector}
            setCountryMapSector={setCountryMapSector}
            countryLens={countryLens}
            setCountryLens={setCountryLens}
          />
        );
      case "sectors":
        return <SectorSignalsSection key={section.id} S={S} />;
      case "spillovers":
        return <InternationalSpilloversSection key={section.id} S={S} />;
      case "method":
        return <MethodSection key={section.id} S={S} />;
      case "businessBridge":
        return <BusinessBridgeSection key={section.id} S={S} />;
      case "research":
        return <ResearchProductsSection key={section.id} S={S} />;
      case "businessIntelligence":
        return <BusinessIntelligenceFeed key={section.id} S={S} />;
      default:
        return null;
    }
  };

  return (
    <ResponsiveController>
      <div className="ray-insight-page" style={S.page}>
        <HorizontalNavigation activePath="/insight" />
        <main>{PAGE_SEQUENCE.filter((section) => section.enabled).map(renderSection)}</main>
        <Footer />
      </div>
    </ResponsiveController>
  );
}

function HeroSection({ S }) {
  return (
    <section style={S.heroShell}>
      <div style={S.wrap}>
        <div style={S.heroGrid}>
          <div style={S.heroCopy}>
            <div style={S.eyebrow}>
              <span style={S.dot} />
              Raymoch Insight
            </div>

            <h1 style={S.heroTitle}>Africa's Market Intelligence.</h1>

            <p style={S.heroText}>
              Track policy, markets, sectors, regions, countries, capital movement, procurement,
              technology adoption, risk, and global spillovers shaping African investment environments.
            </p>

            <div style={S.heroQuestionGrid}>
              {["What changed?", "Where is it changing?", "Why does it matter?", "What is connected to it?"].map((item) => (
                <div key={item} style={S.heroQuestion}>{item}</div>
              ))}
            </div>

            <div style={S.heroButtonRow}>
              <a href="/research-insights/reports" style={S.primaryButton}>Explore reports</a>
              <a href="/businesses" style={S.secondaryButton}>Verify companies</a>
            </div>
          </div>

          <div style={S.heroVisualCard} aria-label="Raymoch Insight tracking visual">
            <div style={S.visualTopRow}>
              <div>
                <div style={S.visualKicker}>Live architecture</div>
                <div style={S.visualTitle}>Online + Database</div>
              </div>
              <div style={S.visualBadge}>Scored signals</div>
            </div>

            <div style={S.signalMap}>
              {[
                "Policy",
                "Markets",
                "Countries",
                "Regions",
                "Sectors",
                "Capital",
                "Risk",
                "Global",
                "Reports",
              ].map((item, index) => (
                <div key={item} style={{ ...S.signalTile, ...getSignalTileStyle(index) }}>
                  {item}
                </div>
              ))}
              <div style={S.signalCore}>
                <div style={S.signalCoreTitle}>Insight</div>
                <div style={S.signalCoreText}>decision context</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InsightDeskSection({
  S,
  activeTab,
  setActiveTab,
  region,
  setRegion,
  country,
  setCountry,
  sector,
  setSector,
  topic,
  setTopic,
  activeInsight,
  setActiveInsight,
}) {
  return (
    <section style={S.section}>
      <div style={S.wrap}>
        <SectionHeader
          S={S}
          kicker="Intelligence Desk"
          title="A structured desk for continent-wide tracking."
          text="The page is built to support both curated intelligence today and live online/database-driven tracking later. Filters and tabs are real product architecture, not decoration."
        />

        <div style={S.tabRow}>
          {deskTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              style={{ ...S.tabButton, ...(activeTab === tab ? S.tabButtonActive : null) }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div style={S.deskGrid}>
          <aside style={S.filterRail}>
            <div style={S.railTitle}>Refine intelligence</div>
            <FilterSelect S={S} label="Region" value={region} onChange={setRegion} options={filterOptions.regions} />
            <FilterSelect S={S} label="Country" value={country} onChange={setCountry} options={filterOptions.countries} />
            <FilterSelect S={S} label="Sector" value={sector} onChange={setSector} options={filterOptions.sectors} />
            <FilterSelect S={S} label="Topic" value={topic} onChange={setTopic} options={filterOptions.topics} />

            <div style={S.filterNote}>
              Later these controls can query your backend and online tracking feeds. For now they establish the correct product structure.
            </div>
          </aside>

          <article style={S.featuredCard}>
            <div style={S.featuredMetaRow}>
              <span style={S.featuredKicker}>{activeInsight.kicker}</span>
              <span style={S.impactPill}>{activeInsight.impact}</span>
            </div>
            <h2 style={S.featuredTitle}>{activeInsight.title}</h2>
            <p style={S.featuredSummary}>{activeInsight.summary}</p>

            <div style={S.answerGrid}>
              <div style={S.answerBox}>
                <div style={S.answerLabel}>Where</div>
                <div style={S.answerValue}>{activeInsight.country} · {activeInsight.region}</div>
              </div>
              <div style={S.answerBox}>
                <div style={S.answerLabel}>Confidence</div>
                <div style={S.answerValue}>{activeInsight.confidence}</div>
              </div>
              <div style={S.answerBox}>
                <div style={S.answerLabel}>Source layer</div>
                <div style={S.answerValue}>{activeInsight.sourceLayer}</div>
              </div>
            </div>

            <div style={S.whyBox}>
              <div style={S.whyLabel}>Why it matters</div>
              <p style={S.whyText}>{activeInsight.why}</p>
            </div>

            <div style={S.insightChooserGrid}>
              {featuredInsights.map((item) => {
                const isActive = activeInsight.title === item.title;
                return (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => setActiveInsight(item)}
                    style={{ ...S.insightMiniCard, ...(isActive ? S.insightMiniCardActive : null) }}
                  >
                    <span style={S.insightMiniKicker}>{item.country}</span>
                    <span style={S.insightMiniTitle}>{item.title}</span>
                  </button>
                );
              })}
            </div>
          </article>

          <aside style={S.signalRail}>
            <div style={S.railTitle}>Signal stack</div>
            {liveSignals.map((signal) => (
              <div key={signal.text} style={S.signalItem}>
                <div style={S.signalItemTag}>{signal.tag}</div>
                <div style={S.signalItemText}>{signal.text}</div>
                <div style={S.signalItemMeta}>{signal.meta}</div>
              </div>
            ))}
          </aside>
        </div>
      </div>
    </section>
  );
}

function PolicyTrackerSection({ S }) {
  return (
    <section style={S.sectionAlt}>
      <div style={S.wrap}>
        <SectionHeader
          S={S}
          kicker="Policy Tracker"
          title="Policy is market infrastructure."
          text="Licensing, tax rules, FX controls, sandbox approvals, procurement policy, trade rules, and reform signals can change the opportunity map faster than company headlines."
        />

        <div style={S.trackerGrid}>
          {policyTracker.map((item) => (
            <div key={`${item.country}-${item.area}`} style={S.trackerCard}>
              <div style={S.trackerTopRow}>
                <div>
                  <div style={S.countryName}>{item.country}</div>
                  <div style={S.policyArea}>{item.area}</div>
                </div>
                <span style={S.statusPill}>{item.status}</span>
              </div>
              <p style={S.trackerSignal}>{item.signal}</p>
              <div style={S.impactLine}>Impact level: <strong>{item.impact}</strong></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RegionalWatchSection({ S }) {
  return (
    <section style={S.section}>
      <div style={S.wrap}>
        <SectionHeader
          S={S}
          kicker="Regional Watch"
          title="Africa's Regional Structure."
          text="Regional grouping keeps country-level intelligence readable and helps users see patterns across corridors, trade zones, capital movement, and policy clusters."
        />

        <div style={S.regionalGrid}>
          {regionalWatch.map((item) => (
            <div key={item.region} style={S.regionCard}>
              <div style={S.regionName}>{item.region}</div>
              <h3 style={S.regionTitle}>{item.title}</h3>
              <p style={S.regionText}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CountrySignalMapSection({
  S,
  country,
  setCountry,
  countryMapSector,
  setCountryMapSector,
  countryLens,
  setCountryLens,
}) {
  const selectedCountries = countrySectorSignals
    .filter((item) => countryMapSector === "All sectors" || item.sectors.includes(countryMapSector))
    .sort((a, b) => b.signalVolume - a.signalVolume);

  const selectedCountry = countrySectorSignals.find((item) => item.country === country) || selectedCountries[0] || countrySectorSignals[0];
  const topCountries = selectedCountries.slice(0, 6);
  const otherCount = Math.max(countrySectorSignals.length - topCountries.length, 0);

  return (
    <section style={S.sectionSurface}>
      <div style={S.wrap}>
        <SectionHeader
          S={S}
          kicker="Country Signal Map"
          title="Countries are coordinates, not a wall of cards."
          text="The country layer should scale to 55 countries and beyond by using selectors, visual summaries, and sector lenses. Users can scan major country players without drowning in tiles."
        />

        <div style={S.countrySignalLayout}>
          <aside style={S.countryControlPanel}>
            <div style={S.railTitle}>Country lens</div>
            <FilterSelect S={S} label="Country" value={country} onChange={setCountry} options={filterOptions.countries} />
            <FilterSelect S={S} label="Sector lens" value={countryMapSector} onChange={setCountryMapSector} options={filterOptions.sectors} />
            <FilterSelect S={S} label="Metric" value={countryLens} onChange={setCountryLens} options={countryLensOptions} />

            <div style={S.countryLensNote}>
              This module is designed for future API data. The visual can be driven by signal volume, policy movement, paid-user scoring, or Raymoch AI classifications.
            </div>
          </aside>

          <div style={S.countryVisualPanel}>
            <div style={S.countryVisualHeader}>
              <div>
                <div style={S.visualKickerLight}>Selected lens</div>
                <h3 style={S.countryVisualTitle}>{countryMapSector} · {countryLens}</h3>
              </div>
              <div style={S.countryCountPill}>{selectedCountries.length} tracked countries</div>
            </div>

            <div style={S.countryMosaicWrap}>
              {topCountries.map((item, index) => (
                <a
                  key={item.country}
                  href={`/research-insights/countries/${slugify(item.country)}`}
                  style={{ ...S.countryMosaicTile, ...getCountryTileStyle(index, item.signalVolume) }}
                >
                  <span style={S.countryTileName}>{item.country}</span>
                  <span style={S.countryTileMeta}>{item.region}</span>
                  <span style={S.countryTileScore}>{item.signalVolume}</span>
                </a>
              ))}
              {otherCount > 0 ? (
                <div style={{ ...S.countryMosaicTile, ...S.countryOtherTile }}>
                  <span style={S.countryTileName}>Other tracked</span>
                  <span style={S.countryTileMeta}>Expandable list</span>
                  <span style={S.countryTileScore}>+{otherCount}</span>
                </div>
              ) : null}
            </div>

            <div style={S.countryDonutRow}>
              <div style={S.countryDonut}>
                <div style={S.countryDonutCenter}>
                  <strong>{topCountries[0]?.country || "Africa"}</strong>
                  <span>top signal</span>
                </div>
              </div>
              <div style={S.countryDonutLegend}>
                {topCountries.slice(0, 4).map((item) => (
                  <div key={item.country} style={S.countryLegendItem}>
                    <span style={S.legendDot} />
                    <span>{item.country}</span>
                    <strong>{item.signalVolume}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside style={S.countryDetailPanel}>
            <div style={S.railTitle}>Selected country</div>
            <div style={S.countryDetailName}>{selectedCountry.country}</div>
            <div style={S.countryDetailRegion}>{selectedCountry.region}</div>

            <div style={S.countryMetricGrid}>
              <div style={S.countryMetricBox}>
                <span>Signal volume</span>
                <strong>{selectedCountry.signalVolume}</strong>
              </div>
              <div style={S.countryMetricBox}>
                <span>Policy activity</span>
                <strong>{selectedCountry.policyActivity}</strong>
              </div>
              <div style={S.countryMetricBox}>
                <span>Investment relevance</span>
                <strong>{selectedCountry.investmentRelevance}</strong>
              </div>
              <div style={S.countryMetricBox}>
                <span>Confidence</span>
                <strong>{selectedCountry.confidence}</strong>
              </div>
            </div>

            <div style={S.countrySignalListTitle}>Major signals</div>
            {selectedCountry.majorSignals.map((signal) => (
              <div key={signal} style={S.countrySignalBullet}>{signal}</div>
            ))}
          </aside>
        </div>
      </div>
    </section>
  );
}

function SectorSignalsSection({ S }) {
  return (
    <section style={S.section}>
      <div style={S.wrap}>
        <SectionHeader
          S={S}
          kicker="Sector Signals"
          title="Sectors are where policy, capital, companies, and risk collide."
          text="This section connects the Insight page to Raymoch's larger sector taxonomy and future sector dashboards."
        />

        <div style={S.sectorGrid}>
          {sectorSignals.map((item) => (
            <a key={item.sector} href={item.href} style={S.sectorCard}>
              <div style={S.sectorName}>{item.sector}</div>
              <p style={S.sectorText}>{item.text}</p>
              <div style={S.cardArrow}>Open sector →</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function InternationalSpilloversSection({ S }) {
  return (
    <section style={S.sectionAlt}>
      <div style={S.wrap}>
        <SectionHeader
          S={S}
          kicker="International Spillovers"
          title="Africa's investment environment is connected to global movement."
          text="Rates, commodity prices, climate rules, trade corridors, Gulf capital, China-Africa finance, shipping disruptions, and global standards all affect local opportunity."
        />

        <div style={S.spilloverGrid}>
          {internationalSpillovers.map((item) => (
            <div key={item.title} style={S.spilloverCard}>
              <div style={S.spilloverTitle}>{item.title}</div>
              <p style={S.spilloverText}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MethodSection({ S }) {
  return (
    <section style={S.section}>
      <div style={S.wrap}>
        <div style={S.methodCard}>
          <div>
            <div style={S.methodKicker}>Tracking Architecture</div>
            <h2 style={S.methodTitle}>Online signals plus Raymoch database intelligence.</h2>
            <p style={S.methodText}>
              The page should be ready for live public tracking and internal platform intelligence. The goal is not to dump data. The goal is to classify, score, route, and explain it.
            </p>
          </div>

          <div style={S.methodGrid}>
            {methodLayers.map((layer, index) => (
              <div key={layer.title} style={S.methodLayerCard}>
                <div style={S.methodNumber}>{String(index + 1).padStart(2, "0")}</div>
                <div style={S.methodLayerTitle}>{layer.title}</div>
                <div style={S.methodLayerText}>{layer.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BusinessBridgeSection({ S }) {
  return (
    <section style={S.bridgeSection}>
      <div style={S.wrap}>
        <div style={S.bridgeCard}>
          <div>
            <div style={S.bridgeKicker}>Actor-level verification</div>
            <h2 style={S.bridgeTitle}>Insight tracks the environment. Businesses verifies the actors.</h2>
            <p style={S.bridgeText}>
              When users need company profiles, CTI scores, verification evidence, business freshness, leadership signals, and proprietary actor-level context, route them to the Businesses page.
            </p>
          </div>

          <a href="/businesses" style={S.bridgeButton}>Explore verified businesses</a>
        </div>
      </div>
    </section>
  );
}

function ResearchProductsSection({ S }) {
  return (
    <section style={S.sectionSurface}>
      <div style={S.wrap}>
        <SectionHeader
          S={S}
          kicker="Research Products"
          title="Turn tracking into usable analysis."
          text="The Insight page should feed briefs, reports, country snapshots, sector notes, dashboards, methodology notes, and future subscription intelligence."
        />

        <div style={S.researchGrid}>
          {researchProducts.map((item) => (
            <a key={item.title} href={item.href} style={S.researchCard}>
              <div style={S.tag}>{item.tag}</div>
              <div style={S.researchTitle}>{item.title}</div>
              <p style={S.researchText}>{item.text}</p>
              <div style={S.cardArrow}>Open →</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function FilterSelect({ S, label, value, onChange, options }) {
  return (
    <label style={S.filterGroup}>
      <span style={S.filterLabel}>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} style={S.filterSelect}>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function SectionHeader({ S, kicker, title, text }) {
  return (
    <div style={S.sectionHeader}>
      <div style={S.sectionKicker}>{kicker}</div>
      <h2 style={S.sectionTitle}>{title}</h2>
      <p style={S.sectionText}>{text}</p>
    </div>
  );
}

function getSignalTileStyle(index) {
  const positions = [
    { top: "9%", left: "52%" },
    { top: "21%", left: "76%" },
    { top: "45%", left: "86%" },
    { top: "70%", left: "75%" },
    { top: "84%", left: "52%" },
    { top: "70%", left: "28%" },
    { top: "45%", left: "16%" },
    { top: "21%", left: "28%" },
    { top: "45%", left: "52%" },
  ];

  return positions[index] || positions[0];
}

function getCountryTileStyle(index, score) {
  const sizes = [170, 144, 134, 124, 116, 108];
  const positions = [
    { top: "50%", left: "48%" },
    { top: "26%", left: "28%" },
    { top: "27%", left: "70%" },
    { top: "72%", left: "26%" },
    { top: "73%", left: "70%" },
    { top: "50%", left: "83%" },
  ];

  const size = sizes[index] || 104;
  const opacity = Math.min(0.96, 0.58 + score / 220);

  return {
    ...positions[index],
    width: size,
    height: size,
    opacity,
  };
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function makeStyles(brand, type, layout, controllers) {
  const c = brand.colors;

  return {
    page: {
      minHeight: "100vh",
      background: c.surface,
      color: c.text,
      fontFamily: type.family.body,
    },

    wrap: {
      maxWidth: layout.wrapMax,
      margin: "0 auto",
      padding: `0 ${layout.wrapPadX}px`,
    },

    heroShell: {
      padding: "30px 0 54px",
      background: c.surface,
      borderBottom: `1px solid ${c.border}`,
    },

    heroGrid: {
      minHeight: controllers.hero.minHeight,
      display: "grid",
      gridTemplateColumns: controllers.hero.gridColumns,
      gap: controllers.hero.gap,
      alignItems: "stretch",
      borderRadius: 34,
      overflow: "hidden",
      border: `1px solid ${c.border}`,
      background: brand.gradients.hero,
      boxShadow: brand.shadows.md,
    },

    heroCopy: {
      padding: "56px 54px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      minWidth: 0,
    },

    eyebrow: {
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      color: c.brand,
      fontSize: 11,
      fontWeight: 950,
      letterSpacing: 2.1,
      textTransform: "uppercase",
    },

    dot: {
      width: 7,
      height: 7,
      borderRadius: 999,
      background: c.gold,
      display: "inline-block",
      boxShadow: "0 0 0 5px rgba(235,191,96,0.13)",
      flex: "0 0 auto",
    },

    heroTitle: {
      margin: "16px 0 0",
      maxWidth: 790,
      fontFamily: type.family.heading,
      fontSize: "clamp(38px, 4.1vw, 70px)",
      lineHeight: 1.02,
      fontWeight: 900,
      letterSpacing: "-0.045em",
      color: c.text,
    },

    heroText: {
      margin: "18px 0 0",
      maxWidth: 760,
      color: c.body,
      fontSize: 17,
      lineHeight: 1.75,
    },

    heroQuestionGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      gap: 10,
      marginTop: 24,
      maxWidth: 680,
    },

    heroQuestion: {
      borderRadius: 16,
      border: `1px solid ${c.border}`,
      background: "rgba(255,255,255,0.56)",
      color: c.brandDeep,
      padding: "12px 14px",
      fontSize: 13,
      fontWeight: 950,
    },

    heroButtonRow: {
      display: "flex",
      flexWrap: "wrap",
      gap: 12,
      marginTop: 28,
    },

    primaryButton: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: 46,
      padding: "0 20px",
      borderRadius: 999,
      background: c.brandDeep,
      color: c.white,
      textDecoration: "none",
      fontWeight: 950,
      fontSize: 14,
      boxShadow: brand.shadows.sm,
    },

    secondaryButton: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: 46,
      padding: "0 20px",
      borderRadius: 999,
      background: "rgba(255,255,255,0.68)",
      color: c.brandDeep,
      textDecoration: "none",
      fontWeight: 950,
      fontSize: 14,
      border: `1px solid ${c.borderStrong}`,
    },

    heroVisualCard: {
      position: "relative",
      margin: 24,
      borderRadius: 28,
      overflow: "hidden",
      background: brand.gradients.dark,
      color: c.white,
      minHeight: 390,
      boxShadow: brand.shadows.lg,
      border: "1px solid rgba(255,255,255,0.12)",
    },

    visualTopRow: {
      position: "relative",
      zIndex: 3,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 18,
      padding: "24px 26px",
    },

    visualKicker: {
      color: "rgba(255,255,255,0.58)",
      fontSize: 11,
      fontWeight: 950,
      letterSpacing: 1.6,
      textTransform: "uppercase",
    },

    visualTitle: {
      marginTop: 5,
      fontSize: 24,
      fontWeight: 950,
      letterSpacing: "-0.02em",
    },

    visualBadge: {
      height: 34,
      display: "inline-flex",
      alignItems: "center",
      padding: "0 13px",
      borderRadius: 999,
      background: "rgba(235,191,96,0.16)",
      color: "rgba(255,241,207,1)",
      border: "1px solid rgba(235,191,96,0.26)",
      fontSize: 12,
      fontWeight: 950,
    },

    signalMap: {
      position: "absolute",
      left: "50%",
      top: "56%",
      width: 400,
      height: 330,
      transform: "translate(-50%, -50%)",
    },

    signalTile: {
      position: "absolute",
      transform: "translate(-50%, -50%) skew(-14deg)",
      minWidth: 86,
      height: 46,
      borderRadius: 12,
      display: "grid",
      placeItems: "center",
      background: "linear-gradient(135deg, rgba(235,191,96,0.96), rgba(168,112,50,0.90))",
      color: c.brandDeep,
      fontWeight: 950,
      fontSize: 12,
      boxShadow: "0 16px 30px rgba(0,0,0,0.24)",
      border: "1px solid rgba(255,255,255,0.26)",
    },

    signalCore: {
      position: "absolute",
      left: "50%",
      top: "45%",
      width: 150,
      height: 150,
      transform: "translate(-50%, -50%)",
      borderRadius: "50%",
      background: "rgba(255,252,246,0.93)",
      color: c.brandDeep,
      display: "grid",
      placeItems: "center",
      textAlign: "center",
      padding: 20,
      boxShadow: "0 22px 52px rgba(0,0,0,0.25)",
    },

    signalCoreTitle: {
      fontFamily: type.family.heading,
      fontSize: 27,
      fontWeight: 900,
      lineHeight: 1,
    },

    signalCoreText: {
      marginTop: 7,
      color: c.body,
      fontSize: 12,
      fontWeight: 950,
      lineHeight: 1.3,
    },

    section: {
      padding: `${layout.sectionPadY}px 0`,
      background: c.surface,
    },

    sectionAlt: {
      padding: `${layout.sectionPadY}px 0`,
      background: c.surfaceAlt,
      borderTop: `1px solid ${c.border}`,
      borderBottom: `1px solid ${c.border}`,
    },

    sectionSurface: {
      padding: `${layout.sectionPadY}px 0`,
      background: c.surfaceSoft,
      borderTop: `1px solid ${c.border}`,
      borderBottom: `1px solid ${c.border}`,
    },

    sectionHeader: {
      maxWidth: 930,
      marginBottom: 28,
    },

    sectionKicker: {
      color: c.brand,
      fontSize: 11,
      fontWeight: 950,
      textTransform: "uppercase",
      letterSpacing: 1.8,
    },

    sectionTitle: {
      margin: "10px 0 0",
      fontFamily: type.family.heading,
      fontSize: "clamp(30px, 3vw, 46px)",
      lineHeight: 1.1,
      fontWeight: 900,
      letterSpacing: "-0.035em",
      color: c.text,
    },

    sectionText: {
      margin: "12px 0 0",
      color: c.body,
      fontSize: 16,
      lineHeight: 1.75,
      maxWidth: 850,
    },

    tabRow: {
      display: "flex",
      flexWrap: "wrap",
      gap: 10,
      marginBottom: 20,
    },

    tabButton: {
      height: 38,
      padding: "0 15px",
      borderRadius: 999,
      border: `1px solid ${c.border}`,
      background: "rgba(255,255,255,0.68)",
      color: c.body,
      cursor: "pointer",
      fontFamily: type.family.body,
      fontSize: 13,
      fontWeight: 900,
    },

    tabButtonActive: {
      background: c.brandDeep,
      color: c.white,
      borderColor: c.brandDeep,
    },

    deskGrid: {
      display: "grid",
      gridTemplateColumns: controllers.desk.gridColumns,
      gap: controllers.desk.gap,
      alignItems: "stretch",
    },

    filterRail: {
      minHeight: controllers.desk.railMinHeight,
      borderRadius: 26,
      background: c.white,
      border: `1px solid ${c.border}`,
      boxShadow: brand.shadows.sm,
      padding: 22,
    },

    signalRail: {
      minHeight: controllers.desk.railMinHeight,
      borderRadius: 26,
      background: brand.gradients.dark,
      color: c.white,
      boxShadow: brand.shadows.lg,
      padding: 22,
      border: "1px solid rgba(255,255,255,0.12)",
    },

    railTitle: {
      color: c.brandDeep,
      fontSize: 16,
      fontWeight: 950,
      letterSpacing: "-0.01em",
      marginBottom: 16,
    },

    filterGroup: {
      display: "block",
      marginBottom: 14,
    },

    filterLabel: {
      display: "block",
      color: c.muted,
      fontSize: 11,
      fontWeight: 950,
      textTransform: "uppercase",
      letterSpacing: 1.2,
      marginBottom: 7,
    },

    filterSelect: {
      width: "100%",
      minHeight: 42,
      borderRadius: 14,
      border: `1px solid ${c.border}`,
      background: c.surfaceSoft,
      color: c.text,
      padding: "0 12px",
      fontFamily: type.family.body,
      fontWeight: 850,
      outline: "none",
    },

    filterNote: {
      marginTop: 18,
      borderRadius: 18,
      background: "rgba(235,191,96,0.14)",
      color: c.brandDeep,
      padding: 16,
      fontSize: 13,
      lineHeight: 1.6,
      fontWeight: 750,
    },

    featuredCard: {
      minHeight: controllers.desk.featuredMinHeight,
      borderRadius: 30,
      background: c.white,
      border: `1px solid ${c.border}`,
      boxShadow: brand.shadows.md,
      padding: 32,
    },

    featuredMetaRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 14,
      flexWrap: "wrap",
    },

    featuredKicker: {
      color: c.brand,
      fontSize: 11,
      fontWeight: 950,
      letterSpacing: 1.5,
      textTransform: "uppercase",
    },

    impactPill: {
      height: 30,
      display: "inline-flex",
      alignItems: "center",
      padding: "0 11px",
      borderRadius: 999,
      background: c.greenSoft,
      color: c.green,
      fontSize: 11,
      fontWeight: 950,
    },

    featuredTitle: {
      margin: "16px 0 0",
      fontFamily: type.family.heading,
      fontSize: "clamp(31px, 3.2vw, 48px)",
      lineHeight: 1.08,
      letterSpacing: "-0.035em",
      fontWeight: 900,
      color: c.text,
    },

    featuredSummary: {
      margin: "16px 0 0",
      color: c.body,
      fontSize: 16,
      lineHeight: 1.75,
      maxWidth: 860,
    },

    answerGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
      gap: 12,
      marginTop: 24,
    },

    answerBox: {
      borderRadius: 18,
      background: c.surfaceSoft,
      border: `1px solid ${c.border}`,
      padding: 15,
    },

    answerLabel: {
      color: c.muted,
      fontSize: 10,
      fontWeight: 950,
      textTransform: "uppercase",
      letterSpacing: 1.2,
    },

    answerValue: {
      marginTop: 7,
      color: c.text,
      fontSize: 13,
      fontWeight: 950,
      lineHeight: 1.35,
    },

    whyBox: {
      marginTop: 18,
      borderRadius: 22,
      background: brand.gradients.warm,
      border: `1px solid ${c.border}`,
      padding: 20,
    },

    whyLabel: {
      color: c.brand,
      fontSize: 11,
      fontWeight: 950,
      textTransform: "uppercase",
      letterSpacing: 1.4,
    },

    whyText: {
      margin: "8px 0 0",
      color: c.body,
      fontSize: 15,
      lineHeight: 1.7,
    },

    insightChooserGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
      gap: 12,
      marginTop: 18,
    },

    insightMiniCard: {
      borderRadius: 18,
      border: `1px solid ${c.border}`,
      background: c.surfaceSoft,
      textAlign: "left",
      padding: 14,
      cursor: "pointer",
      fontFamily: type.family.body,
    },

    insightMiniCardActive: {
      borderColor: "rgba(91,56,37,0.45)",
      background: "rgba(242,225,198,0.54)",
    },

    insightMiniKicker: {
      display: "block",
      color: c.rust,
      fontSize: 10,
      fontWeight: 950,
      textTransform: "uppercase",
      letterSpacing: 1.1,
    },

    insightMiniTitle: {
      display: "block",
      marginTop: 7,
      color: c.text,
      fontSize: 12.5,
      fontWeight: 850,
      lineHeight: 1.35,
    },

    signalItem: {
      borderRadius: 18,
      background: "rgba(255,255,255,0.07)",
      border: "1px solid rgba(255,255,255,0.12)",
      padding: 15,
      marginBottom: 12,
    },

    signalItemTag: {
      color: "rgba(235,191,96,0.92)",
      fontSize: 10,
      fontWeight: 950,
      textTransform: "uppercase",
      letterSpacing: 1.2,
    },

    signalItemText: {
      marginTop: 7,
      color: c.textOnDark,
      fontSize: 13.5,
      fontWeight: 850,
      lineHeight: 1.5,
    },

    signalItemMeta: {
      marginTop: 8,
      color: "rgba(255,255,255,0.54)",
      fontSize: 12,
      lineHeight: 1.4,
    },

    trackerGrid: {
      display: "grid",
      gridTemplateColumns: controllers.tracker.gridColumns,
      gap: controllers.tracker.gap,
    },

    trackerCard: {
      borderRadius: 24,
      background: c.white,
      border: `1px solid ${c.border}`,
      boxShadow: brand.shadows.sm,
      padding: 22,
    },

    trackerTopRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: 14,
    },

    countryName: {
      color: c.text,
      fontSize: 22,
      fontWeight: 950,
      letterSpacing: "-0.02em",
    },

    policyArea: {
      marginTop: 5,
      color: c.rust,
      fontSize: 13,
      fontWeight: 900,
    },

    statusPill: {
      display: "inline-flex",
      alignItems: "center",
      minHeight: 28,
      padding: "0 10px",
      borderRadius: 999,
      background: "rgba(235,191,96,0.16)",
      color: c.brand,
      fontSize: 10,
      fontWeight: 950,
      textTransform: "uppercase",
      letterSpacing: 0.8,
      whiteSpace: "nowrap",
    },

    trackerSignal: {
      margin: "16px 0 0",
      color: c.body,
      fontSize: 14.5,
      lineHeight: 1.65,
    },

    impactLine: {
      marginTop: 14,
      color: c.muted,
      fontSize: 13,
    },

    regionalGrid: {
      display: "grid",
      gridTemplateColumns: controllers.regions.gridColumns,
      gap: controllers.regions.gap,
    },

    regionCard: {
      borderRadius: 25,
      background: c.white,
      border: `1px solid ${c.border}`,
      boxShadow: brand.shadows.sm,
      padding: 24,
      minHeight: 220,
    },

    regionName: {
      color: c.brand,
      fontSize: 11,
      fontWeight: 950,
      textTransform: "uppercase",
      letterSpacing: 1.4,
    },

    regionTitle: {
      margin: "12px 0 0",
      color: c.text,
      fontSize: 21,
      lineHeight: 1.22,
      fontWeight: 950,
      letterSpacing: "-0.02em",
    },

    regionText: {
      margin: "10px 0 0",
      color: c.body,
      fontSize: 14.5,
      lineHeight: 1.65,
    },

    countrySignalLayout: {
      display: "grid",
      gridTemplateColumns: controllers.countries.gridColumns,
      gap: controllers.countries.gap,
      alignItems: "stretch",
    },

    countryControlPanel: {
      minHeight: controllers.countries.visualMinHeight,
      borderRadius: 26,
      background: c.white,
      border: `1px solid ${c.border}`,
      boxShadow: brand.shadows.sm,
      padding: 22,
    },

    countryLensNote: {
      marginTop: 18,
      borderRadius: 18,
      background: "rgba(235,191,96,0.14)",
      color: c.brandDeep,
      padding: 16,
      fontSize: 13,
      lineHeight: 1.6,
      fontWeight: 750,
    },

    countryVisualPanel: {
      minHeight: controllers.countries.visualMinHeight,
      position: "relative",
      borderRadius: 30,
      background: brand.gradients.dark,
      color: c.white,
      border: "1px solid rgba(255,255,255,0.12)",
      boxShadow: brand.shadows.lg,
      padding: 24,
      overflow: "hidden",
    },

    countryVisualHeader: {
      position: "relative",
      zIndex: 2,
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 16,
    },

    visualKickerLight: {
      color: "rgba(235,191,96,0.88)",
      fontSize: 11,
      fontWeight: 950,
      textTransform: "uppercase",
      letterSpacing: 1.5,
    },

    countryVisualTitle: {
      margin: "8px 0 0",
      fontFamily: type.family.heading,
      fontSize: 30,
      lineHeight: 1.1,
      letterSpacing: "-0.035em",
      color: c.textOnDark,
    },

    countryCountPill: {
      display: "inline-flex",
      alignItems: "center",
      minHeight: 32,
      padding: "0 12px",
      borderRadius: 999,
      background: "rgba(255,255,255,0.09)",
      border: "1px solid rgba(255,255,255,0.14)",
      color: "rgba(255,255,255,0.76)",
      fontSize: 12,
      fontWeight: 900,
      whiteSpace: "nowrap",
    },

    countryMosaicWrap: {
      position: "relative",
      height: 315,
      marginTop: 24,
      borderRadius: 26,
      background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08), transparent 58%)",
    },

    countryMosaicTile: {
      position: "absolute",
      transform: "translate(-50%, -50%) rotate(45deg)",
      borderRadius: 18,
      background: "linear-gradient(135deg, rgba(235,191,96,0.96), rgba(168,112,50,0.86))",
      border: "1px solid rgba(255,255,255,0.24)",
      boxShadow: "0 18px 42px rgba(0,0,0,0.26)",
      textDecoration: "none",
      color: c.brandDeep,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: 14,
    },

    countryOtherTile: {
      top: "50%",
      left: "15%",
      width: 96,
      height: 96,
      background: "linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.07))",
      color: c.textOnDark,
    },

    countryTileName: {
      transform: "rotate(-45deg)",
      display: "block",
      fontSize: 16,
      fontWeight: 950,
      lineHeight: 1.05,
    },

    countryTileMeta: {
      transform: "rotate(-45deg)",
      display: "block",
      marginTop: 7,
      fontSize: 10,
      fontWeight: 850,
      opacity: 0.78,
    },

    countryTileScore: {
      transform: "rotate(-45deg)",
      display: "block",
      marginTop: 7,
      fontSize: 18,
      fontWeight: 950,
    },

    countryDonutRow: {
      display: "grid",
      gridTemplateColumns: "170px 1fr",
      gap: 18,
      alignItems: "center",
      marginTop: 8,
      position: "relative",
      zIndex: 2,
    },

    countryDonut: {
      width: 150,
      height: 150,
      borderRadius: "50%",
      background: `conic-gradient(${c.gold} 0 34%, ${c.rust} 34% 57%, ${c.green} 57% 76%, ${c.oatDeep} 76% 90%, rgba(255,255,255,0.20) 90% 100%)`,
      display: "grid",
      placeItems: "center",
      boxShadow: "0 18px 38px rgba(0,0,0,0.25)",
    },

    countryDonutCenter: {
      width: 88,
      height: 88,
      borderRadius: "50%",
      background: "rgba(255,252,246,0.94)",
      color: c.brandDeep,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      gap: 4,
      fontSize: 11,
      fontWeight: 850,
    },

    countryDonutLegend: {
      display: "grid",
      gap: 9,
    },

    countryLegendItem: {
      display: "grid",
      gridTemplateColumns: "12px 1fr auto",
      gap: 9,
      alignItems: "center",
      color: "rgba(255,255,255,0.78)",
      fontSize: 13,
      fontWeight: 850,
    },

    legendDot: {
      width: 9,
      height: 9,
      borderRadius: 999,
      background: c.gold,
    },

    countryDetailPanel: {
      minHeight: controllers.countries.visualMinHeight,
      borderRadius: 26,
      background: c.white,
      border: `1px solid ${c.border}`,
      boxShadow: brand.shadows.sm,
      padding: 22,
    },

    countryDetailName: {
      color: c.text,
      fontSize: 30,
      fontWeight: 950,
      letterSpacing: "-0.035em",
    },

    countryDetailRegion: {
      marginTop: 4,
      color: c.rust,
      fontSize: 13,
      fontWeight: 950,
    },

    countryMetricGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 10,
      marginTop: 20,
    },

    countryMetricBox: {
      borderRadius: 16,
      background: c.surfaceSoft,
      border: `1px solid ${c.border}`,
      padding: 13,
      display: "grid",
      gap: 7,
    },

    countrySignalListTitle: {
      marginTop: 20,
      color: c.brand,
      fontSize: 11,
      fontWeight: 950,
      textTransform: "uppercase",
      letterSpacing: 1.4,
    },

    countrySignalBullet: {
      marginTop: 10,
      borderRadius: 15,
      background: "rgba(235,191,96,0.13)",
      color: c.brandDeep,
      padding: "11px 12px",
      fontSize: 13.5,
      fontWeight: 850,
      lineHeight: 1.35,
    },

    sectorGrid: {
      display: "grid",
      gridTemplateColumns: controllers.sectors.gridColumns,
      gap: controllers.sectors.gap,
    },

    sectorCard: {
      minHeight: 205,
      borderRadius: 24,
      background: c.white,
      border: `1px solid ${c.border}`,
      boxShadow: brand.shadows.sm,
      padding: 22,
      textDecoration: "none",
      color: c.text,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    },

    sectorName: {
      color: c.text,
      fontSize: 22,
      fontWeight: 950,
      letterSpacing: "-0.02em",
    },

    sectorText: {
      margin: "10px 0 0",
      color: c.body,
      fontSize: 14.5,
      lineHeight: 1.6,
    },

    cardArrow: {
      marginTop: 18,
      color: c.brand,
      fontSize: 13,
      fontWeight: 950,
    },

    spilloverGrid: {
      display: "grid",
      gridTemplateColumns: controllers.spillovers.gridColumns,
      gap: controllers.spillovers.gap,
    },

    spilloverCard: {
      borderRadius: 24,
      background: c.white,
      border: `1px solid ${c.border}`,
      boxShadow: brand.shadows.sm,
      padding: 22,
      minHeight: 175,
    },

    spilloverTitle: {
      color: c.text,
      fontSize: 20,
      fontWeight: 950,
      letterSpacing: "-0.02em",
    },

    spilloverText: {
      margin: "10px 0 0",
      color: c.body,
      fontSize: 14.5,
      lineHeight: 1.65,
    },

    methodCard: {
      borderRadius: 32,
      background: brand.gradients.dark,
      color: c.white,
      padding: 34,
      boxShadow: brand.shadows.lg,
      display: "grid",
      gridTemplateColumns: "0.78fr 1.22fr",
      gap: 28,
      alignItems: "center",
    },

    methodKicker: {
      color: "rgba(235,191,96,0.92)",
      fontSize: 11,
      fontWeight: 950,
      textTransform: "uppercase",
      letterSpacing: 1.7,
    },

    methodTitle: {
      margin: "12px 0 0",
      fontFamily: type.family.heading,
      fontSize: "clamp(30px, 3vw, 46px)",
      lineHeight: 1.08,
      letterSpacing: "-0.035em",
      fontWeight: 900,
    },

    methodText: {
      margin: "14px 0 0",
      color: "rgba(255,255,255,0.76)",
      fontSize: 15.5,
      lineHeight: 1.75,
    },

    methodGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      gap: 14,
    },

    methodLayerCard: {
      borderRadius: 20,
      background: "rgba(255,255,255,0.08)",
      border: "1px solid rgba(255,255,255,0.13)",
      padding: 18,
      minHeight: 160,
    },

    methodNumber: {
      color: "rgba(235,191,96,0.88)",
      fontSize: 11,
      fontWeight: 950,
      letterSpacing: 1.2,
    },

    methodLayerTitle: {
      marginTop: 9,
      color: c.textOnDark,
      fontSize: 17,
      fontWeight: 950,
      letterSpacing: "-0.01em",
    },

    methodLayerText: {
      marginTop: 8,
      color: "rgba(255,255,255,0.70)",
      fontSize: 13.5,
      lineHeight: 1.55,
    },

    bridgeSection: {
      padding: "70px 0",
      background: c.surface,
    },

    bridgeCard: {
      borderRadius: 32,
      background: c.white,
      border: `1px solid ${c.border}`,
      boxShadow: brand.shadows.md,
      padding: "34px 38px",
      display: "grid",
      gridTemplateColumns: "1fr auto",
      gap: 28,
      alignItems: "center",
    },

    bridgeKicker: {
      color: c.brand,
      fontSize: 11,
      fontWeight: 950,
      textTransform: "uppercase",
      letterSpacing: 1.6,
    },

    bridgeTitle: {
      margin: "10px 0 0",
      fontFamily: type.family.heading,
      color: c.text,
      fontSize: "clamp(28px, 2.8vw, 42px)",
      lineHeight: 1.1,
      letterSpacing: "-0.035em",
      fontWeight: 900,
      maxWidth: 830,
    },

    bridgeText: {
      margin: "12px 0 0",
      color: c.body,
      maxWidth: 820,
      fontSize: 15.5,
      lineHeight: 1.7,
    },

    bridgeButton: {
      minHeight: 48,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 21px",
      borderRadius: 999,
      background: c.brandDeep,
      color: c.white,
      textDecoration: "none",
      fontWeight: 950,
      fontSize: 14,
      whiteSpace: "nowrap",
    },

    researchGrid: {
      display: "grid",
      gridTemplateColumns: controllers.research.gridColumns,
      gap: controllers.research.gap,
    },

    researchCard: {
      minHeight: 250,
      borderRadius: 25,
      padding: 24,
      background: c.white,
      border: `1px solid ${c.border}`,
      boxShadow: brand.shadows.sm,
      color: c.text,
      textDecoration: "none",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    },

    tag: {
      display: "inline-flex",
      alignSelf: "flex-start",
      alignItems: "center",
      height: 28,
      padding: "0 11px",
      borderRadius: 999,
      background: "rgba(235,191,96,0.16)",
      color: c.brand,
      fontSize: 11,
      fontWeight: 950,
      textTransform: "uppercase",
      letterSpacing: 1,
    },

    researchTitle: {
      marginTop: 18,
      color: c.text,
      fontSize: 23,
      lineHeight: 1.14,
      fontWeight: 950,
      letterSpacing: "-0.025em",
    },

    researchText: {
      marginTop: 10,
      color: c.body,
      fontSize: 14.5,
      lineHeight: 1.65,
    },

    businessIntelSection: {
      background: c.surface,
      padding: `${layout.sectionPadY}px 0`,
      borderTop: `1px solid ${c.border}`,
      borderBottom: `1px solid ${c.border}`,
    },

    businessIntelHeader: {
      display: "flex",
      justifyContent: "space-between",
      gap: 24,
      alignItems: "flex-start",
      marginBottom: 22,
    },

    businessIntelStatusCard: {
      minWidth: 170,
      borderRadius: 18,
      border: `1px solid ${c.border}`,
      background: c.white,
      boxShadow: brand.shadows.sm,
      padding: 16,
      display: "grid",
      gridTemplateColumns: "1fr auto",
      gap: "8px 12px",
      color: c.body,
      fontSize: 13,
    },

    businessIntelTabs: {
      display: "flex",
      flexWrap: "wrap",
      gap: 10,
      marginBottom: 16,
    },

    businessIntelTab: {
      minHeight: 40,
      padding: "8px 14px",
      borderRadius: 999,
      border: `1px solid ${c.border}`,
      background: c.surfaceSoft,
      color: c.body,
      cursor: "pointer",
      fontWeight: 900,
    },

    businessIntelTabActive: {
      background: c.brandDeep,
      borderColor: c.brandDeep,
      color: c.white,
    },

    businessIntelDebug: {
      borderRadius: 14,
      border: `1px solid ${c.border}`,
      background: c.surfaceAlt,
      color: c.body,
      padding: 12,
      fontSize: 12,
      marginBottom: 18,
      overflowX: "auto",
    },

    businessIntelNotice: {
      borderRadius: 18,
      border: `1px solid ${c.border}`,
      background: c.white,
      color: c.body,
      padding: 18,
      boxShadow: brand.shadows.sm,
    },

    businessIntelError: {
      borderRadius: 18,
      border: `1px solid rgba(142,58,48,0.24)`,
      background: c.redSoft,
      color: c.red,
      padding: 18,
      boxShadow: brand.shadows.sm,
    },

    businessIntelGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
      gap: 16,
    },

    businessIntelCard: {
      borderRadius: 20,
      border: `1px solid ${c.border}`,
      background: c.white,
      boxShadow: brand.shadows.sm,
      padding: 18,
    },

    businessIntelCardTop: {
      display: "flex",
      justifyContent: "space-between",
      gap: 10,
      alignItems: "center",
      marginBottom: 12,
    },

    businessIntelPill: {
      display: "inline-flex",
      alignItems: "center",
      minHeight: 28,
      padding: "5px 10px",
      borderRadius: 999,
      background: c.oat,
      color: c.brandDeep,
      fontSize: 12,
      fontWeight: 950,
    },

    businessIntelScore: {
      color: c.brand,
      fontSize: 12,
      fontWeight: 950,
    },

    businessIntelCardTitle: {
      margin: 0,
      color: c.text,
      fontSize: 18,
      lineHeight: 1.3,
      fontWeight: 950,
    },

    businessIntelCardText: {
      marginTop: 10,
      color: c.body,
      fontSize: 14,
      lineHeight: 1.65,
    },

    businessIntelMetaGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 8,
      marginTop: 14,
    },

    businessIntelDetail: {
      borderRadius: 12,
      background: c.surface,
      border: `1px solid ${c.border}`,
      padding: 10,
      display: "grid",
      gap: 4,
      fontSize: 12,
      color: c.muted,
    },
  };
}

