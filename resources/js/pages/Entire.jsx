import { useMemo, useState } from "react";
import "../styles/landingv2.css";
import Header from "../components/layout_master/Header.jsx";
import Footer from "../components/layout_master/Footer.jsx";
import "../styles/headerFooter.css";

/**
 * =============================================================================
 * LandingV2.jsx (MASTER REBUILD)
 * =============================================================================
 *
 * PURPOSE
 * - Keep the hero intact in spirit and visual role
 * - Rebuild the rest of the landing page with better section sequencing
 * - Make editing easier with explicit controllers and comments
 * - Preserve: carousel, trust engine, how it works, final CTA
 * - Upgrade: reports section, mosaic spotlight, button warmth, section control
 *
 * SAFE EDITING SYSTEM
 * 1) BRAND = core palette only
 * 2) TYPE = typography only
 * 3) LAYOUT = page-wide spacing only
 * 4) COMPONENTS = shared UI only
 * 5) SECTION_CONTROLLERS = each section gets its own editable controls
 * 6) makeStyles() reads from all of the above and builds final styles
 * 7) JSX should stay readable and content-focused
 *
 * PAGE ORDER
 * 01) Hero
 * 02) Who We Are
 * 03) What We Do
 * 04) Signals + Overview Cards
 * 05) Special Reports
 * 06) Market Intelligence Carousel
 * 07) Mosaic Spotlight
 * 08) Trust Engine
 * 09) How It Works
 * 10) Final CTA
 * =============================================================================
 */

// TODO: Set this to your VERIFIED account-registration route before deployment.
// Until then, the sign-up buttons take users to the account-type overview below.
const ACCOUNT_REGISTRATION_PATH = null;
const ACCOUNT_CTA_HREF = ACCOUNT_REGISTRATION_PATH || "#account-types";

/* =============================================================================
   01) BRAND CONTROLLER
   -----------------------------------------------------------------------------
   EDIT HERE FOR:
   - site palette
   - accent warmth
   - borders and shadows
   DO NOT EDIT HERE FOR:
   - spacing
   - card sizes
   - section widths
   ============================================================================= */
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
  },

  gradients: {
    hero: `
      radial-gradient(ellipse 44% 53% at 83% 67%, rgba(231, 122, 52, 0.25) 0%, transparent 74%),
      radial-gradient(ellipse 48% 52% at 18% 6%, rgba(115, 65, 35, 0.20) 0%, transparent 72%),
      linear-gradient(115deg, #090706 0%, #150D09 48%, #22120C 100%)
    `,
    cta: `
      radial-gradient(900px 420px at 50% 25%, rgba(235,191,96,0.16), transparent 60%),
      linear-gradient(135deg, rgba(61,38,25,1), rgba(91,56,37,1))
    `,
    warmWash: `linear-gradient(180deg, rgba(235,191,96,0.11), rgba(246,241,232,0.00))`,
    feature: `linear-gradient(135deg, rgba(255,250,240,1), rgba(246,241,232,1))`,
  },

  shadows: {
    sm: "0 8px 20px rgba(31,41,51,0.06)",
    md: "0 12px 30px rgba(31,41,51,0.08)",
    lg: "0 18px 50px rgba(31,41,51,0.10)",
    xl: "0 30px 80px rgba(31,41,51,0.18)",
  },
};

/* =============================================================================
   02) TYPOGRAPHY CONTROLLER
   -----------------------------------------------------------------------------
   EDIT HERE FOR:
   - font families
   - heading sizes
   - body sizes
   ============================================================================= */
const TYPE = {
  family: {
    body: '"Inter", "Segoe UI", sans-serif',
    heading: '"Merriweather", Georgia, serif',
  },

  heroTitle: { size: "clamp(43px, 5.6vw, 78px)", line: 1.11, weight: 700, spacing: "-0.045em" },
  sectionTitle: { size: "clamp(27px, 2.8vw, 32px)", line: 1.22, weight: 650 },
  lead: { size: 22, line: 1.75, weight: 500 },
  body: { size: 18, line: 1.8, weight: 400 },
  cardTitle: { size: 18, line: 1.3, weight: 900 },
  cardBody: { size: 16, line: 1.72, weight: 400 },
  label: { size: 12, line: 1.2, weight: 900, spacing: 0.5 },
  button: { size: 16, line: 1, weight: 800 },
  small: { size: 13, line: 1.3, weight: 700 },
};

/* =============================================================================
   03) GLOBAL LAYOUT CONTROLLER
   -----------------------------------------------------------------------------
   EDIT HERE FOR:
   - section spacing
   - grid gaps
   - max widths
   ============================================================================= */
const LAYOUT = {
  wrapMax: 1440,
  wrapPadX: 28,
  sectionPadY: 88,
  sectionHeadGap: 22,
  gridGap: 32,
  gridGapTight: 20,
  gridGapWide: 40,
  buttonGroupGap: 12,
  heroPadTop: "clamp(142px, 16vh, 210px)",
  heroPadBottom: "clamp(176px, 19vh, 235px)",
};

/* =============================================================================
   04) SHARED COMPONENT CONTROLLER
   -----------------------------------------------------------------------------
   EDIT HERE FOR:
   - all common buttons
   - shared card radii
   - pills
   ============================================================================= */
const COMPONENTS = {
  button: { height: 52, minWidth: 168, padX: 24, radius: 999, borderWidth: 1 },
  buttonSmall: { height: 48, minWidth: 152, padX: 20, radius: 999, borderWidth: 1 },
  card: { radius: 20, pad: 22, borderWidth: 1 },
  pill: { radius: 999, padY: 7, padX: 12 },
};

/* =============================================================================
   05) SECTION CONTROLLERS
   -----------------------------------------------------------------------------
   EACH MAJOR SECTION HAS ITS OWN CONTROLLER.
   EDIT HERE FIRST BEFORE TOUCHING makeStyles().
   ============================================================================= */
const SECTION_CONTROLLERS = {
  hero: {
    maxTextWidth: 1020,
    subMaxWidth: 650,
    kickerMarginBottom: 24,
    subMarginTop: 25,
    ctaMarginTop: 36,
    waveHeight: 165,
    gridOpacity: 0.028,
    gridSize: 82,
  },

  about: {
    columns: "1fr 1.2fr",
    statsColumns: 3,
    trustCardMinHeight: 250,
  },

  whatWeDo: {
    columns: 4,
    blockMinHeight: 224,
    blockPadY: 34,
    blockPadX: 28,
    titleSize: 28,
    textMaxWidth: 360,
  },

  signals: {
    cards: 4,
    padY: 16,
    chipGap: 12,
  },

  reports: {
    columns: "0.8fr 2.1fr 0.9fr",
    introMinHeight: 220,
    featuredMinHeight: 500,
    mediaHeight: 340,
    gridGap: 24,
    railGap: 12,
  },

  carousel: {
    visibleCount: 3,
    viewportGap: 12,
    cardWidth: 300,
    cardMinHeight: 380,    //change the height of the carousel.
    imageHeight: 100,
    padTop: 8,
    padBottom: 74,
  },

  mosaic: {
    columns: "1.35fr 1fr 1fr",
    rows: "240px 240px",
    gap: 18,
  },


  // trustEngine: {
  //   columns: 3,
  // },

  howItWorks: {
    columns: 3,
    cardMinHeight: 160,
  },

  cta: {
    padY: 72,
    innerPadY: 18,
  },



};

/* =============================================================================
   06) PAGE COMPOSITION + DATA
   ============================================================================= */
export default function Entire() {
  const signals = useMemo(
    () => [
      { tag: "Incentive", text: "Kenya: VAT relief on solar mini-grid components announced.", href: "/signals/kenya-vat-solar" },
      { tag: "Policy", text: "Ghana: FX repatriation rules eased for exporters (pilot Q4).", href: "/signals/ghana-fx-repatriation" },
      { tag: "Grant", text: "AfDB SME window expands to climate-adaptive agritech, $50m tranche.", href: "/signals/afdb-sme-climate" },
      { tag: "Regulatory", text: "Egypt: sandbox fast-track for healthtech devices (duty cut 5%).", href: "/signals/egypt-healthtech-sandbox" },
    ],
    []
  );

  const reports = useMemo(
    () => [
      { title: "Africa’s energy transition", href: "/insights/energy-transition" },
      { title: "Generative AI and the workforce", href: "/insights/genai-workforce" },
      { title: "Climate adaptation and capital", href: "/insights/climate-adaptation" },
      { title: "Future of African capital markets", href: "/insights/capital-markets" },
    ],
    []
  );

  const intel = useMemo(
    () => [
      { image: "/images/intel/worldbank.jpg", source: "World Bank", title: "Africa economic updates", blurb: "Growth, inflation, and trade movements.", href: "https://www.worldbank.org" },
      { image: "/images/intel/imf.jpg", source: "IMF", title: "Regional outlook briefs", blurb: "Macro risks, fiscal pressure, capital flows.", href: "https://www.imf.org" },
      { image: "/images/intel/afdb.jpg", source: "AfDB", title: "African economic outlook", blurb: "Financing constraints and transformation priorities.", href: "https://www.afdb.org" },
      { image: "/images/intel/unctad.jpg", source: "UNCTAD", title: "Investment trends", blurb: "FDI shifts and global allocation patterns.", href: "https://unctad.org" },
      { image: "/images/intel/oecd.jpg", source: "OECD", title: "SME productivity signals", blurb: "Competitiveness and demand changes.", href: "https://www.oecd.org" },
      { image: "/images/intel/afdb2.jpg", source: "African Development Bank", title: "Financing notes", blurb: "Gap sizing and access barriers.", href: "https://www.afdb.org" },
    ],
    []
  );

  const S = makeStyles(BRAND, TYPE, LAYOUT, COMPONENTS, SECTION_CONTROLLERS);

  return (
    <div className="landing-v2-content" style={S.page}>
      <Header />
      <main>
        
        <Hero S={S} />
        <WhoWeAre S={S} />
        <MosaicSpotlight S={S} />
        <WhatWeDo S={S} />
        
        <PlatformValue S={S} />
        
        {/* Reports and institutional research share one editorial showcase.
            Original SpecialReports remains defined below for safe rollback. */}
        <MarketIntelCarousel S={S} intel={intel} />
        <RaymochClosingStatement S={S} />
        {/* Closing CTA consolidated into account discovery above. */}
        
        
        {/* <TrustEngine S={S} /> */}
        
        
      </main>
      <Footer />
    </div>
  );
}

/* =============================================================================
   07) HERO
   -----------------------------------------------------------------------------
   KEEP THIS CLOSE TO CURRENT HERO ROLE.
   ============================================================================= */
function Hero({ S }) {
  return (
    <section style={S.hero} aria-labelledby="raymoch-hero-title">
      <div style={S.heroGridFade} aria-hidden="true" />
      <div style={S.heroAura} aria-hidden="true" />
      <div style={{ ...S.wrap, width: "100%", position: "relative", zIndex: 2 }}>
        <div style={S.heroInner}>
          <div style={S.kicker}>BUSINESSES · FOUNDERS · INVESTORS</div>
          <h1 id="raymoch-hero-title" style={S.h1}>
            <span style={S.heroTitleLead}>Explore Endless Opportunity.</span>{" "}
            {/* <span style={S.heroTitleRest}>See the opportunity.</span> */}
          </h1>
          <p style={S.sub}>
            Discover businesses, showcase ventures, and connect with investors across African markets.
          </p>
          <div style={S.ctaRow}>
            <a href={ACCOUNT_CTA_HREF} style={{ ...S.btnBase, ...S.btnPrimary }}>
              Create an account <span style={S.heroButtonArrow} aria-hidden="true">↗</span>
            </a>
            {/* <a href="#explore-raymoch" style={{ ...S.btnBase, ...S.btnGhostLight }}>
              Explore Raymoch
            </a> */}
          </div>
        </div>

        {/* Four product-capability modules; no invented metrics or live data. */}
        <div style={S.heroShowcase} aria-label="Raymoch platform capabilities">
          <div style={{ ...S.heroModule, ...S.heroModulePrimary }}>
            <div style={S.heroModuleHead}><span style={S.heroModuleDot} /> TRUST SCORING</div>
            <div style={S.heroModuleBig}>Business credibility, made visible.</div>
            <div style={S.heroModuleRule} />
            <div style={S.heroModuleMini}>Reviewed evidence · Trust score · Verified tier & badge</div>
          </div>
          <div style={{ ...S.heroModule, ...S.heroModuleSecondary }}>
            <div style={S.heroModuleHead}>INVESTOR MATCHING</div>
            <div style={S.heroModuleTitle}>Connections built on compatibility.</div>
            <div style={S.heroModuleMini}>Businesses · Founders · Investors</div>
          </div>
          <div style={{ ...S.heroModule, ...S.heroModuleSecondary }}>
            <div style={S.heroModuleHead}>MARKET INTELLIGENCE</div>
            <div style={S.heroModuleTitle}>Find the context behind the opportunity.</div>
            <div style={S.heroModuleMini}>Markets · Policy · Sectors</div>
          </div>
          <div style={{ ...S.heroModule, ...S.heroModuleSecondary }}>
            <div style={S.heroModuleHead}>RAYMOCH AI</div>
            <div style={S.heroModuleTitle}>A simpler way to navigate Raymoch.</div>
            <div style={S.heroModuleMini}>Platform assistance</div>
          </div>
        </div>
      </div>
      <HeroBottomWave S={S} />
    </section>
  );
}

function HeroBottomWave({ S }) {
  return (
    <div style={S.heroWave} aria-hidden="true">
      <svg viewBox="0 0 1440 165" preserveAspectRatio="none" style={S.heroWaveSvg}>
        <path
          d="M0,70 C300,108 522,154 725,154 C946,154 1165,103 1440,70 L1440,165 L0,165 Z"
          fill={S.tokens.colors.surface}
        />
      </svg>
    </div>
  );
}

/* =============================================================================
   08) WHO WE ARE
   -----------------------------------------------------------------------------
   PURPOSE:
   - introduce the platform clearly
   - summarize trust logic fast
   - show top stats without clutter
   ============================================================================= */
function WhoWeAre({ S }) {
  return (
    <section style={S.sectionSurface}>
      <div style={S.wrap}>
        <div style={S.aboutGrid}>
          <div>
            <span style={S.sectionEyebrow}>About Raymoch</span>
            {/* <h2 style={S.h2}>A clearer view of African enterprise.</h2> */}
            <p style={S.leadBody}>
              Raymoch brings African enterprises, founders, and investors into a shared environment
              for credible discovery and greater visibility. Structured information makes it easier
              to understand businesses, explore ventures, and pursue relevant connections.
            </p>
            <div style={S.aboutStats}>
              {/* <Stat S={S} label="Companies tracked" value="2,400+" /> */}
              <Stat S={S} label="Sectors represented" value="24+" />
              <Stat S={S} label="Countries represented" value="54+" />
            </div>
          </div>

          <div style={S.trustIntroCard}>
            <div style={S.cardTag}>Why Raymoch</div>
            <div style={S.cardTitle}>More visibility. Better context.</div>
            <ul style={S.bulletList}>
              <li>A structured presence for businesses and emerging ventures</li>
              <li>Clearer information for evaluating opportunities</li>
              <li>Connections that go beyond a conventional directory</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =============================================================================
   09) WHAT WE DO
   -----------------------------------------------------------------------------
   PURPOSE:
   - provide cross-sectional summary of platform purpose
   - use selective color to show priority
   ============================================================================= */
function WhatWeDo({ S }) {
  return (
    <section style={S.sectionSurfaceTight} id="explore-raymoch">
      <div style={S.wrap}>
        <div style={S.sectionHead}>
          <span style={S.sectionEyebrow}>What we do</span>
          {/* <h2 style={S.h2}>Technology for trusted connections.</h2> */}
          {/* <p style={S.p}>Four complementary tools, one connected platform.</p> */}
        </div>
        <div style={S.featureBand}>
          <a href="/verification" style={{ ...S.featureBlock, ...S.featureBlockDeep }}>
            <div><div style={S.featureTitle}>Trust scoring</div>
              <div style={S.featureText}>Evidence-based business scoring with trust tiers and verification badges.</div>
            </div>
          </a>
          <a href="/matching" style={{ ...S.featureBlock, ...S.featureBlockClay }}>
            <div><div style={S.featureTitle}>Investor matching</div>
              <div style={S.featureText}>Compatibility-based discovery between investors, businesses, and founders.</div>
            </div>
          </a>
          <a href="/insights" style={{ ...S.featureBlock, ...S.featureBlockGold }}>
            <div><div style={S.featureTitleDark}>Market intelligence</div>
              <div style={S.featureTextDark}>Research and signals across markets, sectors, policy, and capital.</div>
            </div>
          </a>
          <div style={{ ...S.featureBlock, ...S.featureBlockSoft }}>
            <div><div style={S.featureTitleDark}>Raymoch AI</div>
              <div style={S.featureTextDark}>Platform assistance for finding your way around Raymoch.</div>
            </div>
          </div>
        </div>
        <div style={S.overviewButtonRow}>
          <a href="/overview" style={S.overviewButton}>Explore the platform overview ↗</a>
        </div>
      </div>
    </section>
  );
}
/* =============================================================================
   10) SIGNALS OVERVIEW
   -----------------------------------------------------------------------------
   PURPOSE:
   - show live movement
   - follow with fast-scan support cards
   ============================================================================= */
/* =============================================================================
   10) SIGNALS OVERVIEW
   -----------------------------------------------------------------------------
   EDIT THIS BLOCK FOR:
   - signal ticker content order
   - the 4 support cards below the ticker
   - whether one support card should be highlighted or all should remain equal
   NOTE:
   - all 4 cards are currently equal-weight by design
   ============================================================================= */
function SignalsOverview({ S, signals }) {
  const chips = [...signals, ...signals];

  return (
    <section style={S.signalsBand}>
      <div style={S.wrap}>
        <div className="l2-marquee" style={S.marquee}>
          <div className="l2-marqueeTrack" style={S.track}>
            {chips.map((s, idx) => (
              <a key={`${s.tag}-${idx}`} href={s.href} style={S.chip}>
                <strong style={{ color: S.tokens.colors.text }}>{s.tag}</strong>
                <span style={{ marginInline: 8, opacity: 0.45 }}>-</span>
                <span style={{ color: S.tokens.colors.body }}>{s.text}</span>
              </a>
            ))}
          </div>
        </div>

        <div style={S.signalsHead}>Latest Policy Updates Across the Continent.</div>

        {/* Redundant support cards suppressed; the existing signal ticker remains. */}
      </div>
    </section>
  );
}

/* =============================================================================
   11) SPECIAL REPORTS
   -----------------------------------------------------------------------------
   PURPOSE:
   - center card must dominate
   - designed to later support image or video showcase
   - side columns are support, not equal competitors
   ============================================================================= */
/* =============================================================================
   11) SPECIAL REPORTS
   -----------------------------------------------------------------------------
   EDIT THIS BLOCK FOR:
   - featured media slot content
   - featured article headline and copy
   - right rail story list
   - left intro support copy
   NOTE:
   - center card is intentionally dominant and media-ready
   ============================================================================= */
function SpecialReports({ S, reports }) {
  return (
    <section style={S.sectionSurface}>
      <div style={S.wrap}>
        <div style={S.sectionHeadRow}>
          <div>
            <span style={S.sectionEyebrow}>Special reports</span>
            <h2 style={S.h2}>Perspectives on African markets.</h2>
            <p style={S.p}>Editorial depth, featured media, and a fast-scan topic rail.</p>
          </div>
        </div>

        <div style={S.reportsGrid}>
          <div style={S.reportIntroCard}>
            <div style={S.reportIntroText}>
              A changing market requires analysis that connects capital, context, and growth across sectors and regions.
            </div>

            <a href="/insights" style={S.reportIntroButton}>
              All reports
            </a>
          </div>

          <a href="/insights/featured" style={S.reportFeaturedCard}>
            <img
              src="/images/reports/featured-report.jpg"
              alt="Featured report"
              style={S.reportMediaImage}
            />
            <div style={S.reportCoverLabel}>Featured story</div>
            <div style={S.reportCoverTitle}>Where African growth meets credible capital</div>
            <div style={S.reportCoverText}>
              A showcase slot for the newest article, report, interview, or media-led story with stronger editorial presence.
            </div>
          </a>

          <div style={S.reportRail}>
            <div style={S.reportRailTop}>
              <div style={S.reportRailTitle}>Topics</div>
            </div>

            {reports.map((r) => (
              <a key={r.title} href={r.href} style={S.reportRailItem}>
                <span>{r.title}</span>
                <span style={S.chev}>›</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
/* =============================================================================
   12) MARKET INTELLIGENCE CAROUSEL
   -----------------------------------------------------------------------------
   PURPOSE:
   - preserve rotating research cards
   - featured center card stays emphasized
   ============================================================================= */
/* =============================================================================
   12) MARKET INTELLIGENCE CAROUSEL
   -----------------------------------------------------------------------------
   EDIT THIS BLOCK FOR:
   - carousel data
   - source labels
   - card images
   - center-card emphasis
   NOTE:
   - center card is larger than side cards on purpose
   ============================================================================= */
function MarketIntelCarousel({ S, intel }) {
  const [index, setIndex] = useState(0);
  const count = intel.length;
  const active = intel[index];
  const advance = (offset) => setIndex((current) => (current + offset + count) % count);
  // Width proportions echo Stripe's large editorial feature + narrow story previews.
  const visible = Array.from({ length: Math.min(5, count) }, (_, i) => ({
    item: intel[(index + i) % count],
    index: (index + i) % count,
  }));

  return (
    <section className="raymoch-editorial" aria-labelledby="raymoch-editorial-heading">
      <style>{`
        .raymoch-editorial { background: #F6F1E8; padding: 80px 0 90px; }
        .raymoch-editorial * { box-sizing: border-box; }
        .raymoch-editorial-header { display:flex; align-items:end; justify-content:space-between; gap:24px; margin-bottom:28px; }
        .raymoch-editorial-label { color:#866D59; font-size:12px; font-weight:750; letter-spacing:.11em; text-transform:uppercase; }
        .raymoch-editorial-title { color:#34271F; font-size:clamp(26px, 3vw, 39px); line-height:1.18; letter-spacing:-.035em; margin:9px 0 0; font-weight:650; }
        .raymoch-editorial-subtitle { color:#786C62; font-size:17px; line-height:1.55; margin:8px 0 0; }
        .raymoch-editorial-controls { display:flex; gap:9px; flex-shrink:0; }
        .raymoch-editorial-arrow { width:46px; height:46px; border-radius:11px; border:1px solid #D7C8B8; background:#FFFDF9; color:#45342B; cursor:pointer; display:grid; place-items:center; font-size:24px; transition:background .15s ease; }
        .raymoch-editorial-arrow:hover { background:#EADBC9; }
        .raymoch-editorial-stage { display:flex; height:clamp(310px, 33vw, 465px); gap:12px; overflow:hidden; border-radius:15px; }
        .raymoch-editorial-tile { position:relative; min-width:0; border:0; border-radius:12px; overflow:hidden; background:#A9BEB5; padding:0; cursor:pointer; text-align:left; transition:flex-grow .4s ease; }
        .raymoch-editorial-tile[data-slot="0"] { flex: 64 1 0%; background:#A6C4B6; cursor:default; }
        .raymoch-editorial-tile[data-slot="1"] { flex: 18 1 0%; background:#D9B495; }
        .raymoch-editorial-tile[data-slot="2"] { flex: 10 1 0%; background:#9AA9AC; }
        .raymoch-editorial-tile[data-slot="3"] { flex: 5 1 0%; background:#D3A88B; }
        .raymoch-editorial-tile[data-slot="4"] { flex: 3 1 0%; background:#B7ADA5; }
        .raymoch-editorial-image { display:block; width:100%; height:100%; object-fit:cover; }
        .raymoch-editorial-tile[data-slot="0"] .raymoch-editorial-image { object-position:center; }
        .raymoch-editorial-image-fallback { position:absolute; inset:0; display:grid; place-items:center; color:rgba(28,56,49,.23); font-size:clamp(80px,12vw,165px); font-weight:900; letter-spacing:-.09em; pointer-events:none; }
        .raymoch-editorial-tile::after { content:""; position:absolute; inset:0; background:linear-gradient(180deg,transparent 44%,rgba(24,22,18,.44) 100%); pointer-events:none; }
        .raymoch-editorial-source { position:absolute; z-index:1; left:20px; bottom:20px; color:#fff; text-shadow:0 1px 7px rgba(0,0,0,.35); font-weight:750; font-size:15px; white-space:nowrap; }
        .raymoch-editorial-tile:not([data-slot="0"]) .raymoch-editorial-source { display:none; }
        .raymoch-editorial-detail { display:flex; justify-content:space-between; align-items:center; gap:24px; padding-top:22px; }
        .raymoch-editorial-description { max-width:900px; color:#756A60; font-size:clamp(16px,1.6vw,19px); line-height:1.48; margin:0; }
        .raymoch-editorial-description strong { color:#31251E; font-weight:750; }
        .raymoch-editorial-link { flex-shrink:0; padding:13px 19px; border:1px solid #BDA995; border-radius:9px; color:#493325; background:transparent; text-decoration:none; font-size:14px; font-weight:750; white-space:nowrap; }
        .raymoch-editorial-link:hover { background:#EEE1D2; }
        .raymoch-editorial-count { color:#8A7869; margin-top:14px; font-size:12px; letter-spacing:.06em; }
        .raymoch-editorial-tile:focus-visible, .raymoch-editorial-arrow:focus-visible, .raymoch-editorial-link:focus-visible { outline:3px solid #B47B44; outline-offset:3px; }
        @media (max-width:760px) {
          .raymoch-editorial { padding:55px 0 65px; }
          .raymoch-editorial-header { align-items:start; }
          .raymoch-editorial-stage { height:310px; gap:8px; }
          .raymoch-editorial-tile[data-slot="0"] { flex: 76 1 0%; }
          .raymoch-editorial-tile[data-slot="1"] { flex: 24 1 0%; }
          .raymoch-editorial-tile[data-slot="2"], .raymoch-editorial-tile[data-slot="3"], .raymoch-editorial-tile[data-slot="4"] { display:none; }
          .raymoch-editorial-detail { align-items:stretch; flex-direction:column; gap:14px; }
          .raymoch-editorial-link { align-self:flex-start; }
          .raymoch-editorial-arrow { width:39px; height:39px; }
        }
        @media (prefers-reduced-motion:reduce) { .raymoch-editorial-tile, .raymoch-editorial-arrow { transition:none; } }
      `}</style>
      <div style={S.wrap}>
        <div className="raymoch-editorial-header">
          <div>
            <div className="raymoch-editorial-label">Research & intelligence</div>
            <h2 className="raymoch-editorial-title" id="raymoch-editorial-heading">Perspectives across African markets.</h2>
            <p className="raymoch-editorial-subtitle">Explore research and market context from established institutions.</p>
          </div>
          <div className="raymoch-editorial-controls">
            <button type="button" className="raymoch-editorial-arrow" onClick={() => advance(-1)} aria-label="Previous research story">←</button>
            <button type="button" className="raymoch-editorial-arrow" onClick={() => advance(1)} aria-label="Next research story">→</button>
          </div>
        </div>
        <div className="raymoch-editorial-stage" aria-label="Featured research and upcoming stories">
          {visible.map(({ item, index: itemIndex }, slot) => (
            <button
              key={`${item.source}-${item.title}`}
              type="button"
              className="raymoch-editorial-tile"
              data-slot={slot}
              onClick={() => slot && setIndex(itemIndex)}
              aria-label={slot === 0 ? `Featured research: ${item.title}` : `Feature ${item.title}`}
              aria-current={slot === 0 ? "true" : undefined}
              title={item.title}
            >
              <div className="raymoch-editorial-image-fallback" aria-hidden="true">R</div>
              {item.image && <img className="raymoch-editorial-image" src={item.image} alt="" loading="lazy" onError={(event) => { event.currentTarget.style.display = "none"; }} />}
              <span className="raymoch-editorial-source">{item.source}</span>
            </button>
          ))}
        </div>
        <div className="raymoch-editorial-detail" aria-live="polite">
          <p className="raymoch-editorial-description"><strong>{active.title}.</strong> {active.blurb} <span>Source: {active.source}.</span></p>
          <a className="raymoch-editorial-link" href={active.href} target="_blank" rel="noopener noreferrer">Visit research source ↗</a>
        </div>
        <div className="raymoch-editorial-count" aria-label={`Story ${index + 1} of ${count}`}>{String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}</div>
      </div>
    </section>
  );
}


/* =============================================================================
   13) MOSAIC SPOTLIGHT
   -----------------------------------------------------------------------------
   PURPOSE:
   - replace the old Africa investment panel
   - create a richer editorial / product mosaic
   - keep the landing page visually structured and premium
   ============================================================================= */
function MosaicSpotlight({ S }) {
  const accountCards = [
    { number: "", type: "BUSINESS", icon: "business", title: "Build your presence.", text: "Establish credibility, visibility, and new commercial possibilities.", span: 2,
      background: "#B97C65", foreground: "#FFFFFF", secondary: "#FFF0E6" },
    { number: "", type: "FOUNDER", icon: "founder", title: "Present your venture.", text: "Bring your idea or early-stage venture into view for potential investors.", span: 1,
      background: "#E6B69C", foreground: "#39271E", secondary: "#674331" },
    { number: "", type: "INVESTOR", icon: "investor", title: "Discover opportunities.", text: "Explore businesses and founders aligned with your investment interests.", span: 1,
      background: "#54796C", foreground: "#FFFFFF", secondary: "#E1EBE4" },
    { number: "", type: "INDIVIDUAL", icon: "individual", title: "Explore and learn.", text: "Discover businesses, follow markets, and navigate the wider platform.", span: 2,
      background: "#E8CA99", foreground: "#39291E", secondary: "#65513B" },
  ];

  return (
    <section style={S.sectionAlt} id="account-types">
      <style>{`
        @media (max-width: 720px) {
          #account-types .raymoch-account-card svg { width: 28px; height: 28px; display: block; }
        #account-types .raymoch-account-grid { grid-template-columns: minmax(0, 1fr) !important; }
          #account-types .raymoch-account-card { grid-column: span 1 !important; min-height: 195px !important; }
          #account-types .raymoch-account-intro { padding: 0 0 22px !important; }
        }
      `}</style>
      <div style={S.wrap}>
        <div className="raymoch-account-intro" style={S.accountIntroCard}>
          <span style={S.accountIntroLabel}>EXPLORE RAYMOCH</span>
          <h2 style={S.accountIntroTitle}>Different ambitions. One ecosystem.</h2>
          <p style={S.accountIntroText}>
            Explore the platform through the experience that fits your goals.
          </p>
        </div>
        <div className="raymoch-account-grid" style={S.accountGrid}>
          {accountCards.map((account) => (
            <div className="raymoch-account-card" key={account.type}
              style={{ ...S.accountCard, gridColumn: `span ${account.span}`, background: account.background, color: account.foreground }}>
              <div style={S.accountCardTop}>
                <span style={{ ...S.accountCardIcon, color: account.secondary }} aria-hidden="true">
                  {account.icon === "business" ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M9 21v-4h6v4M8 7h2m4 0h2M8 11h2m4 0h2"/></svg>
                  ) : account.icon === "founder" ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6m-5 3h4M9 14c-1.7-1.1-3-2.8-3-5a6 6 0 0 1 12 0c0 2.2-1.3 3.9-3 5l-.6 2H9.6L9 14Z"/></svg>
                  ) : account.icon === "investor" ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 20h18M5 16l5-5 4 3 6-8M16 6h4v4"/></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/></svg>
                  )}
                </span>
                <span style={{ ...S.accountCardNumber, color: account.secondary }} aria-hidden="true">{account.number}</span>
              </div>
              <div>
                <span style={{ ...S.accountCardLabel, color: account.secondary }}>{account.type} ACCOUNT</span>
                <h3 style={{ ...S.accountCardTitle, color: account.foreground }}>{account.title}</h3>
                <p style={{ ...S.accountCardText, color: account.secondary }}>{account.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={S.accountActionRow}>
          <span style={S.accountActionText}>Find your place in the Raymoch ecosystem.</span>
          <a href={ACCOUNT_CTA_HREF} style={S.accountSignupButton}>Create an account <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </section>
  );
}

// Original mission statement. No quotation or endorsement is attributed to an outside person.
function RaymochClosingStatement({ S }) {
  return (
    <section style={S.closingStatementSection} aria-labelledby="raymoch-closing-statement">
      <div style={S.wrap}>
        <div style={S.closingStatementInner}>
          <span style={S.closingStatementEyebrow}>A NOTE FROM RAYMOCH</span>
          <blockquote style={S.closingStatementQuote} id="raymoch-closing-statement">
            “Opportunity should not depend on who you already know. We believe better information, greater visibility, and meaningful connections can open more doors.”
          </blockquote>
          <span style={S.closingStatementSignature}>— The Raymoch team</span>
        </div>
      </div>
    </section>
  );
}

/* =============================================================================
   15) HOW IT WORKS
   -----------------------------------------------------------------------------
   PURPOSE:
   - process explanation
   - complementary warm-dark palette
   ============================================================================= */
/* =============================================================================
   15) HOW IT WORKS
   -----------------------------------------------------------------------------
   EDIT THIS BLOCK FOR:
   - step titles
   - step descriptions
   - process order
   - warm-dark styling support
   ============================================================================= */
// Three capabilities describe value, not a mandatory sequence for all accounts.
function PlatformValue({ S }) {
  const steps = [
    { icon: "shield", title: "Establish trust", text: "Evidence-based business scoring makes credibility easier to assess." },
    { icon: "search", title: "Discover", text: "Explore businesses, ventures, and markets with useful context." },
    { icon: "connect", title: "Connect", text: "Compatibility-based matching supports eligible investment connections." },
  ];
  return (
    <section style={S.valueSection} aria-labelledby="platform-value-heading">
      <style>{`
        @media (max-width: 760px) {
          .raymoch-value-grid { grid-template-columns: minmax(0,1fr) !important; }
          .raymoch-value-panel { padding: 28px !important; }
        }
      `}</style>
      <div style={S.wrap}>
        <div className="raymoch-value-panel" style={S.valuePanel}>
          <h2 id="platform-value-heading" style={S.valueEyebrow}>How the platform creates value</h2>
          <div className="raymoch-value-grid" style={S.valueGrid}>
            {steps.map((step) => (
              <div key={step.title} style={S.valueItem}>
                <span style={S.valueIcon} aria-hidden="true">
                  {step.icon === "shield" ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg> : step.icon === "search" ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="10.8" cy="10.8" r="7.2"/><path d="m16 16 5 5"/></svg> : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="4" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M12 6v6M5 17v-3h14v3M12 12v2"/></svg>}
                </span>
                <h3 style={S.valueTitle}>{step.title}</h3>
                <p style={S.valueText}>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks({ S }) {
  return (
    <section style={S.sectionSurface}>
      <div style={S.wrap}>
        <div style={S.aboutGrid}>
          <div>
            <span style={S.sectionEyebrow}>How it works</span>
            {/* <h2 style={S.h2}>From discovery to connection.</h2> */}
            <p style={S.leadBody}>
              Start with the account that matches your goals. Build your presence,
              explore relevant information, and connect where eligible.
            </p>
          </div>

          <div style={S.trustIntroCard}>
            <div style={S.cardTag}>Process</div>
            <div style={S.cardTitle}>From profile to opportunity</div>
            <ul style={S.bulletList}>
              <li>Choose an account and build the relevant profile</li>
              <li>Businesses can complete evidence-based trust scoring</li>
              <li>Explore markets and seek compatible connections where eligible</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =============================================================================
   16) FINAL CTA
   ============================================================================= */
/* =============================================================================
   16) FINAL CTA
   -----------------------------------------------------------------------------
   EDIT THIS BLOCK FOR:
   - final CTA title
   - final CTA support copy
   - bottom action buttons
   ============================================================================= */
function CTADeep({ S }) {
  return (
    <section style={S.ctaBand}>
      <div style={S.wrap}>
        <div style={S.ctaInner}>
          <div>
            <div style={S.ctaTitle}>Your next opportunity starts here.</div>
            <div style={S.ctaText}>Join as a business, founder, investor, or individual. Choose the path that fits your goals.</div>
          </div>
          <div style={S.buttonGroup}>
            <a href={ACCOUNT_CTA_HREF} style={{ ...S.btnBase, ...S.btnPrimary }}>Create an account</a>
            <a href="#account-types" style={{ ...S.btnBase, ...S.btnGhostDark }}>Explore account types</a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =============================================================================
   17) SHARED SMALL COMPONENTS
   ============================================================================= */
function Stat({ S, label, value }) {
  return (
    <div style={S.statCard}>
      <small style={S.statLabel}>{label}</small>
      <div style={S.statValue}>{value}</div>
    </div>
  );
}

function InfoCard({ S, title, text, href, featured = false }) {
  return (
    <a href={href} style={{ ...S.infoCard, ...(featured ? S.infoCardFeatured : null) }}>
      <h4 style={S.infoCardTitle}>{title}</h4>
      <p style={S.infoCardText}>{text}</p>
      <span style={S.infoCardLink}>Open</span>
    </a>
  );
}

function Card({ S, title, text, tag, featured = false }) {
  return (
    <div style={{ ...S.card, ...(featured ? S.cardFeatured : null) }}>
      <div style={S.cardTag}>{tag}</div>
      <div style={S.cardTitle}>{title}</div>
      <div style={S.cardText}>{text}</div>
    </div>
  );
}

function Step({ S, n, title, text }) {
  return (
    <div style={S.step}>
      <div style={S.stepNum}>{n}</div>
      <div style={S.stepTitle}>{title}</div>
      <div style={S.stepText}>{text}</div>
    </div>
  );
}

/* =============================================================================
   18) STYLES FACTORY
   -----------------------------------------------------------------------------
   READS FROM GLOBAL CONTROLLERS + SECTION CONTROLLERS.
   IF YOU WANT TO CHANGE A SECTION, CHANGE ITS CONTROLLER FIRST.
   ============================================================================= */
function makeStyles(brand, type, layout, components, sectionControllers) {
  const c = brand.colors;
  const about = sectionControllers.about;
  const whatWeDo = sectionControllers.whatWeDo;
  const signals = sectionControllers.signals;
  const reports = sectionControllers.reports;
  const carousel = sectionControllers.carousel;
  const mosaic = sectionControllers.mosaic;
  const howItWorks = sectionControllers.howItWorks;
  const cta = sectionControllers.cta;
  const hero = sectionControllers.hero;

  return {
    tokens: { colors: c, gradients: brand.gradients, shadows: brand.shadows, type, layout, components, sectionControllers },

    page: { background: c.surface, fontFamily: type.family.body, fontSize: type.body.size, color: c.text },
    wrap: { maxWidth: layout.wrapMax, margin: "0 auto", padding: `0 ${layout.wrapPadX}px` },
    wrapWideIntel: { maxWidth: layout.wrapMax, margin: "0 auto", padding: `0 ${layout.wrapPadX + 16}px` },

    btnBase: {
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      minWidth: components.button.minWidth, height: components.button.height,
      padding: `0 ${components.button.padX}px`, borderRadius: components.button.radius,
      border: `${components.button.borderWidth}px solid transparent`, whiteSpace: "nowrap",
      textDecoration: "none", fontSize: type.button.size, lineHeight: type.button.line,
      fontWeight: type.button.weight, cursor: "pointer", transition: "all 180ms ease",
    },
    btnSmallBase: {
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      minWidth: components.buttonSmall.minWidth, height: components.buttonSmall.height,
      padding: `0 ${components.buttonSmall.padX}px`, borderRadius: components.buttonSmall.radius,
      border: `${components.buttonSmall.borderWidth}px solid transparent`, whiteSpace: "nowrap",
      textDecoration: "none", fontSize: type.button.size, lineHeight: type.button.line,
      fontWeight: type.button.weight, cursor: "pointer", transition: "all 180ms ease",
    },

    btnPrimary: { background: "#E6AF64", color: "#24150E", borderColor: "#F0C17D", boxShadow: "0 10px 32px rgba(6,3,2,0.20)" },
    btnGhostLight: { background: "rgba(255,250,243,0.04)", color: "#F9F2E9", borderColor: "rgba(246,231,209,0.38)" },
    btnGhost: { background: c.oat, color: c.brandDeep, borderColor: c.oatDeep },
    btnGhostDark: { background: "transparent", color: c.surface, borderColor: "rgba(246,241,232,0.58)" },
    buttonGroup: { display: "flex", gap: layout.buttonGroupGap, flexWrap: "wrap" },

    h2: { margin: 0, fontFamily: type.family.heading, fontSize: type.sectionTitle.size, lineHeight: type.sectionTitle.line, fontWeight: type.sectionTitle.weight, letterSpacing: "-0.025em", color: "#382A20" },
    sectionEyebrow: { display: "block", marginBottom: 12, fontFamily: type.family.body, fontSize: 11, lineHeight: 1.4, fontWeight: 650, letterSpacing: "0.12em", textTransform: "uppercase", color: "#947D69" },
    h2OnDark: { margin: 0, fontFamily: type.family.heading, fontSize: type.sectionTitle.size, lineHeight: type.sectionTitle.line, fontWeight: type.sectionTitle.weight, color: c.surface },
    p: { marginTop: 10, color: c.body, fontSize: type.body.size, lineHeight: type.body.line },
    pOnDark: { marginTop: 10, color: c.textOnDark, fontSize: type.body.size, lineHeight: type.body.line },
    leadBody: { marginTop: 10, color: c.body, fontSize: type.lead.size, lineHeight: type.lead.line, maxWidth: 720 },

    sectionSurface: { background: c.surface, padding: `${layout.sectionPadY}px 0` },
    sectionSurfaceTight: { background: c.surface, padding: `24px 0 ${layout.sectionPadY}px` },
    sectionAlt: { background: c.surfaceAlt, padding: `${layout.sectionPadY}px 0` },
    sectionDarkWarm: { background: `linear-gradient(135deg, rgba(40,22,15,1), rgba(61,38,25,1))`, padding: `${layout.sectionPadY}px 0` },
    sectionIntel: { background: c.surface, paddingTop: carousel.padTop, paddingBottom: carousel.padBottom },

    sectionHead: { maxWidth: 820, marginBottom: layout.sectionHeadGap },
    sectionHeadRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, flexWrap: "wrap", marginBottom: layout.sectionHeadGap },

    hero: {
      position: "relative", overflow: "hidden",
      minHeight: "780px",
      padding: "clamp(120px, 13vw, 175px) 0 160px",
      background: brand.gradients.hero,
      isolation: "isolate", display: "flex", alignItems: "center",
    },
    heroGridFade: {
      position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
      backgroundImage: `repeating-linear-gradient(90deg, rgba(245,226,198,${hero.gridOpacity}) 0px, rgba(245,226,198,${hero.gridOpacity}) 1px, transparent 1px, transparent ${hero.gridSize}px)`,
      maskImage: "linear-gradient(90deg, transparent 2%, rgba(0,0,0,.18) 54%, rgba(0,0,0,.5) 100%)",
      WebkitMaskImage: "linear-gradient(90deg, transparent 2%, rgba(0,0,0,.18) 54%, rgba(0,0,0,.5) 100%)",
    },
    heroAura: {
      position: "absolute", right: "-10%", top: "12%", width: "min(64vw, 790px)",
      aspectRatio: "1 / 1", borderRadius: "50%", pointerEvents: "none", zIndex: 0,
      background: "radial-gradient(circle, rgba(213,139,71,0.085), transparent 65%)",
    },
    heroInner: {
      position: "relative", zIndex: 2, maxWidth: hero.maxTextWidth,
      textAlign: "center", margin: "0 auto", display: "flex",
      flexDirection: "column", alignItems: "center",
    },
    kicker: {
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      padding: "8px 16px", borderRadius: 999,
      background: "rgba(227,175,101,0.065)", border: "1px solid rgba(230,175,100,0.24)",
      color: "#F0C58A", fontSize: 11, lineHeight: 1.5, fontWeight: 700,
      letterSpacing: "0.12em", textTransform: "uppercase",
      marginBottom: hero.kickerMarginBottom,
    },
    h1: {
      margin: 0, maxWidth: 980, fontFamily: type.family.body,
      fontSize: "clamp(43px, 5.1vw, 76px)", lineHeight: 1.10,
      fontWeight: type.heroTitle.weight, letterSpacing: type.heroTitle.spacing,
      color: "#FAF5ED", textWrap: "balance",
    },
    heroTitleLead: { fontWeight: 800, color: "#FBF6EF" },
    heroTitleRest: { fontWeight: 350, color: "#F1BF8C" },
    sub: {
      maxWidth: hero.subMaxWidth, marginTop: hero.subMarginTop, marginBottom: 0,
      color: "rgba(248,236,221,0.82)", fontSize: "clamp(17px, 1.65vw, 21px)",
      lineHeight: 1.7, fontWeight: 400, textWrap: "pretty",
    },
    ctaRow: {
      display: "flex", justifyContent: "center", gap: layout.buttonGroupGap,
      flexWrap: "wrap", marginTop: hero.ctaMarginTop,
    },
    heroButtonArrow: { marginLeft: 12, fontSize: 18, lineHeight: 1 },
    heroShowcase: {
      position: "relative", width: "min(100%, 1050px)", margin: "66px auto 0",
      display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 390px), 1fr))",
      gap: 16, filter: "drop-shadow(0 26px 45px rgba(0,0,0,.22))",
    },
    heroModule: {
      borderRadius: 20, border: "1px solid rgba(243,169,107,.22)",
      background: "linear-gradient(140deg, rgba(54,33,24,.96), rgba(19,13,11,.94))",
      padding: "clamp(22px, 3vw, 34px)", color: "#FFF3E7", overflow: "hidden",
    },
    heroModulePrimary: {
      minHeight: 210, position: "relative",
      background: "radial-gradient(ellipse at 88% 100%, rgba(215,115,52,.34), transparent 65%), linear-gradient(130deg, #2B1912, #100C0A)",
    },
    heroModuleStack: { display: "grid", gridTemplateRows: "1fr 1fr", gap: 16 },
    heroModuleSecondary: { minHeight: 210, display: "flex", flexDirection: "column", justifyContent: "center" },
    heroModuleHead: { color: "#E8AC75", fontSize: 11, letterSpacing: ".15em", fontWeight: 750, display: "flex", alignItems: "center", gap: 9 },
    heroModuleDot: { display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: "#EBAB6B", boxShadow: "0 0 12px rgba(235,171,107,.8)" },
    heroModuleBig: { maxWidth: 450, marginTop: 23, fontSize: "clamp(23px, 3vw, 36px)", lineHeight: 1.23, fontWeight: 600, letterSpacing: "-.025em" },
    heroModuleRule: { width: "100%", maxWidth: 380, height: 1, background: "linear-gradient(90deg, rgba(235,171,107,.75), transparent)", margin: "24px 0 17px" },
    heroModuleTags: { display: "flex", flexWrap: "wrap", gap: 8 },
    heroModuleTag: { fontSize: 12, color: "#EED5BD", border: "1px solid rgba(230,166,109,.25)", background: "rgba(242,193,141,.05)", borderRadius: 999, padding: "6px 10px" },
    heroModuleTitle: { fontSize: "clamp(18px, 2vw, 23px)", lineHeight: 1.35, fontWeight: 580, marginTop: 12, letterSpacing: "-.015em" },
    heroModuleMini: { fontSize: 12, letterSpacing: ".025em", color: "#C7AB97", marginTop: 12 },
    heroModuleDash: { color: "#E5A267", paddingInline: 7 },

    heroWave: { position: "absolute", left: 0, right: 0, bottom: -1, height: hero.waveHeight, pointerEvents: "none" },
    heroWaveSvg: { width: "100%", height: "100%", display: "block" },

    aboutGrid: { display: "grid", gridTemplateColumns: about.columns, gap: layout.gridGapWide, alignItems: "start" },
    aboutStats: { display: "grid", gridTemplateColumns: `repeat(${about.statsColumns}, minmax(0, 1fr))`, gap: 14, marginTop: 20 },
    statCard: { background: c.white, border: `1px solid ${c.border}`, borderRadius: 14, padding: "14px 16px", boxShadow: brand.shadows.md },
    statLabel: { display: "block", color: c.muted, fontWeight: 800, marginBottom: 6 },
    statValue: { color: c.text, fontSize: 22, fontWeight: 900 },
    trustIntroCard: { minHeight: about.trustCardMinHeight, borderRadius: 18, border: `1px solid ${c.borderSoft}`, background: c.white, padding: components.card.pad, boxShadow: brand.shadows.lg },
    bulletList: { margin: "12px 0 0 18px", color: c.body, lineHeight: 1.9 },




    featureBand: {
      display: "grid",
      gridTemplateColumns: `repeat(${whatWeDo.columns}, minmax(0, 1fr))`,
      gap: 0,
      borderRadius: 22,
      overflow: "hidden",
      boxShadow: brand.shadows.lg,
    },

    featureBlock: {
      minHeight: whatWeDo.blockMinHeight,
      padding: `${whatWeDo.blockPadY}px ${whatWeDo.blockPadX}px`,
      textDecoration: "none",
      borderTop: `1px solid rgba(0,0,0,0.06)`,
      borderRight: `1px solid rgba(0,0,0,0.05)`,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    },

    featureBlockDeep: {      
      background: "rgba(74, 48, 33, 1)",         // the Match block/card
      color: c.white,
    },

    featureBlockGold: {
      background: "rgba(215, 152, 16, 1)",     // trust score card/block
      color: c.text,
    },

    featureBlockSoft: {
      background: "rgba(253, 239, 209, 1)",     // 
      color: c.text,
    },

    featureBlockClay: {
      background: "rgba(198, 137, 86, 1)",
      color: c.white,
    },

    featureBlockLight: {
      background: "rgba(248, 231, 206, 1)",
      color: c.text,
    },

    featureEyebrow: {
      color: "rgba(255,244,220,0.88)",
      fontSize: 12,
      fontWeight: 900,
      letterSpacing: 0.8,
      textTransform: "uppercase",
    },

    featureEyebrowDark: {
      color: "rgba(24,29,34,0.78)",
      fontSize: 12,
      fontWeight: 900,
      letterSpacing: 0.8,
      textTransform: "uppercase",
    },

    featureTitle: {
      marginTop: 10,
      fontSize: whatWeDo.titleSize,
      lineHeight: 1.15,
      fontWeight: 900,
      color: c.white,
    },

    featureTitleDark: {
      marginTop: 10,
      fontSize: whatWeDo.titleSize,
      lineHeight: 1.15,
      fontWeight: 900,
      color: c.text,
    },

    featureText: {
      marginTop: 12,
      maxWidth: whatWeDo.textMaxWidth,
      color: "rgba(246,241,232,0.90)",
      lineHeight: 1.75,
    },

    featureTextDark: {
      marginTop: 12,
      maxWidth: whatWeDo.textMaxWidth,
      color: "rgba(24,29,34,0.84)",
      lineHeight: 1.75,
    },




  overviewButtonRow: {
    display: "flex",
    justifyContent: "center",
    marginTop: 22,
  },

  overviewButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 210,
    height: 52,
    padding: "0 26px",
    borderRadius: 999,
    textDecoration: "none",
    fontSize: 16,
    fontWeight: 800,
    background: c.oat,
    color: c.brandDeep,
    border: `1px solid ${c.oatDeep}`,
    boxShadow: brand.shadows.sm,
    transition: "all 180ms ease",
  },





    signalsBand: { background: c.surfaceSoft, borderTop: `1px solid rgba(219,210,198,1)`, borderBottom: `1px solid rgba(219,210,198,1)`, padding: `10px 0 ${layout.sectionPadY}px` },
    marquee: { overflow: "hidden", padding: `${signals.padY}px 0` },
    track: { display: "flex", gap: signals.chipGap, alignItems: "center", width: "fit-content" },
    chip: { display: "inline-flex", alignItems: "center", whiteSpace: "nowrap", textDecoration: "none", padding: "12px 14px", borderRadius: 999, border: `1px solid rgba(219,210,198,1)`, background: c.white, fontSize: 15, fontWeight: 800, boxShadow: "0 1px 0 rgba(0,0,0,0.03)" },
    signalsHead: { marginTop: 12, marginBottom: 14, color: c.muted, fontSize: 13, fontWeight: 900, letterSpacing: 1.1, textTransform: "uppercase" },
    grid4: { display: "grid", gridTemplateColumns: `repeat(${signals.cards}, minmax(0, 1fr))`, gap: layout.gridGapTight },
    infoCard: { minHeight: 160, borderRadius: 18, border: `1px solid ${c.borderSoft}`, background: c.white, padding: 20, boxShadow: brand.shadows.md, textDecoration: "none", display: "flex", flexDirection: "column" },
    infoCardFeatured: { background: brand.gradients.feature, borderColor: c.borderStrong },
    infoCardTitle: { margin: 0, color: c.text, fontSize: 16, fontWeight: 900 },
    infoCardText: { margin: "8px 0 10px", color: c.body, fontSize: 14, lineHeight: 1.7 },
    infoCardLink: { marginTop: "auto", color: c.brand, fontWeight: 900 },

    
    reportsGrid: {
      display: "grid",
      gridTemplateColumns: reports.columns,
      gap: reports.gridGap,
      alignItems: "start",
    },
    // reportsGrid: { display: "grid", gridTemplateColumns: reports.columns, gap: layout.gridGapWide, alignItems: "start" },

    
    reportIntroCard: {
      minHeight: reports.introMinHeight,
      borderRadius: 18,
      border: `1px solid ${c.borderSoft}`,
      background: c.surfaceSoft,
      padding: 24,
      boxShadow: brand.shadows.md,
      alignSelf: "start",
      marginTop: 42,
      display: "flex",
      flexDirection: "column",
    },


    reportIntroButton: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: 40,
      padding: "0 16px",
      borderRadius: 999,
      textDecoration: "none",
      background: c.oat,
      color: c.brandDeep,
      border: `1px solid ${c.oatDeep}`,
      fontSize: 14,
      fontWeight: 800,
      marginTop: "auto",
      alignSelf: "flex-start",
    },
        
    // reportIntroCard: { minHeight: reports.featuredMinHeight, borderRadius: 18, border: `1px solid ${c.borderSoft}`, background: c.surfaceSoft, padding: 24, boxShadow: brand.shadows.md },
    reportIntroText: { color: c.body, lineHeight: 1.9 },

    reportRail: {
      border: `1px solid ${c.borderSoft}`,
      borderRadius: 18,
      background: c.white,
      overflow: "hidden",
      boxShadow: brand.shadows.md,
      alignSelf: "start",
      marginTop: 42,          // pushes right card lower
    },

    reportFeaturedCard: {
      minHeight: reports.featuredMinHeight,
      borderRadius: 20,
      border: `1px solid ${c.borderStrong}`,
      background: `${brand.gradients.warmWash}, ${c.white}`,
      boxShadow: brand.shadows.xl,
      textDecoration: "none",
      padding: 24,
      display: "flex",
      flexDirection: "column",
      alignSelf: "start",
      transform: "translateY(-18px)",   // lifts center card upward
      position: "relative",
      zIndex: 3,
    },



    reportRailTop: {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      gap: 12,
      padding: "16px 18px",
      borderBottom: `1px solid ${c.border}`,
    },

    reportRailTitle: {
      color: c.text,
      fontSize: 14,
      fontWeight: 900,
      letterSpacing: 0.5,
      textTransform: "uppercase",
    },

    

    // reportMediaImage: {
    //   width: "100%",
    //   height: reports.mediaHeight,
    //   objectFit: "cover",
    //   borderRadius: 16,
    //   border: `1px solid ${c.border}`,
    //   marginBottom: 18,
    //   display: "block",
    // },

    reportMediaImage: {
      width: "100%",
      height: reports.mediaHeight,
      objectFit: "cover",
      borderRadius: 16,
      border: `1px solid ${c.border}`,
      marginBottom: 18,
      display: "block",
      filter: "contrast(1.02) saturate(0.96)",
    },




    // reportFeaturedCard: { minHeight: reports.featuredMinHeight, borderRadius: 20, border: `1px solid ${c.borderStrong}`, background: `${brand.gradients.warmWash}, ${c.white}`, boxShadow: brand.shadows.xl, textDecoration: "none", padding: 24, display: "flex", flexDirection: "column" },
    // reportMediaPlaceholder: { height: reports.mediaHeight, borderRadius: 16, background: `linear-gradient(135deg, ${c.surfaceAlt}, ${c.oat})`, border: `1px solid ${c.border}`, display: "grid", placeItems: "center", color: c.brandDeep, fontWeight: 800, marginBottom: 18 },
    
    
    reportCoverLabel: { color: c.brand, fontSize: 12, fontWeight: 900, letterSpacing: 0.9, textTransform: "uppercase" },
    reportCoverTitle: { marginTop: 12, color: c.text, fontSize: 32, lineHeight: 1.16, fontWeight: 900, maxWidth: 580 },
    reportCoverText: { marginTop: 12, color: c.body, maxWidth: 580, lineHeight: 1.8 },
    reportRailItem: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "18px 18px", textDecoration: "none", color: c.text, borderBottom: `1px solid ${c.border}` },
    chev: { opacity: 0.55, fontSize: 24, lineHeight: 1 },



    carouselBtnRow: { display: "flex", gap: 10 },
    carouselBtn: { width: 46, height: 46, borderRadius: 999, border: `1px solid ${c.border}`, background: c.surface, color: c.text, fontSize: 22, fontWeight: 900, lineHeight: 1, padding: 0, appearance: "none", boxShadow: brand.shadows.md, cursor: "pointer", display: "grid", placeItems: "center" },
    carouselGrid: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, auto))", justifyContent: "center", justifyItems: "stretch", gap: carousel.viewportGap, marginTop: 28, transition: "all 520ms cubic-bezier(.4,0,.2,1)" },
    intelItemCard: { width: carousel.cardWidth, minHeight: carousel.cardMinHeight, display: "flex", flexDirection: "column", justifyContent: "space-between", rowGap: 14, padding: "22px 22px 24px", borderRadius: 24, border: `1px solid ${c.borderSoft}`, borderLeft: `2px solid ${c.brand}`, background: c.surfaceAlt, boxShadow: brand.shadows.lg, color: c.body, textDecoration: "none", transition: "all 520ms cubic-bezier(.4,0,.2,1)" },
    intelImage: { width: "100%", height: carousel.imageHeight, objectFit: "cover", borderRadius: 14, marginBottom: 16 },
    intelSource: { display: "inline-flex", alignSelf: "flex-start", padding: "7px 10px", borderRadius: 999, background: "rgba(91,56,37,0.08)", border: "1px solid rgba(168,112,50,0.20)", color: c.brand, fontSize: 12, fontWeight: 900, letterSpacing: 0.5, textTransform: "uppercase" },
    intelItemTitle: { marginTop: 14, color: c.text, fontSize: 22, lineHeight: 1.25, fontWeight: 900 },
    intelItemText: { marginTop: 12, color: c.body, fontSize: type.cardBody.size, lineHeight: type.cardBody.line },
    intelItemLink: { marginTop: 18, color: c.brand, fontSize: 14, fontWeight: 900 },
    intelCenter: { transform: "scaleY(1.08) scaleX(1.02)", zIndex: 3, boxShadow: brand.shadows.xl, background: `${brand.gradients.warmWash}, rgba(246,241,232,1)` },
    intelSide: { opacity: 0.74, transform: "scale(0.94) translateY(8px)", zIndex: 1, boxShadow: brand.shadows.md },

    valueSection: { background: "#17100D", padding: "56px 0", color: "#F7F0E9" },
    valuePanel: { border: "1px solid rgba(235,195,155,.26)", borderRadius: 28, padding: "36px 38px", background: "linear-gradient(125deg,#170F0C,#261710)" },
    valueEyebrow: { margin: 0, fontSize: 12, letterSpacing: ".12em", textTransform: "uppercase", fontWeight: 650, color: "#E3B68C" },
    valueGrid: { display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 32, marginTop: 36 },
    valueItem: { minWidth: 0 },
    valueIcon: { display: "block", width: 28, height: 28, color: "#E3B17A", marginBottom: 22 },
    valueTitle: { margin: 0, color: "#FFF6ED", fontSize: 25, fontWeight: 650, lineHeight: 1.2 },
    valueText: { margin: "14px 0 0", color: "#D4C1B2", fontSize: 16, lineHeight: 1.65 },
    accountActionRow: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, flexWrap: "wrap", marginTop: 26 },
    accountActionText: { color: "#715E50", fontSize: 14 },
    accountSignupButton: { display: "inline-flex", alignItems: "center", gap: 12, padding: "13px 24px", background: "#3B261C", color: "#FFF4E9", borderRadius: 999, fontSize: 14, fontWeight: 700, textDecoration: "none" },

    // Version A: asymmetric 2:1 / 1:2 account composition; calm shared spacing.
    accountGrid: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 14 },
    accountIntroCard: { maxWidth: 750, padding: "0 0 30px", background: "transparent" },
    accountIntroLabel: { fontSize: 11, letterSpacing: "0.14em", fontWeight: 750, color: "#91765F" },
    accountIntroTitle: { margin: "13px 0 0", fontFamily: type.family.heading, fontSize: "clamp(25px, 2.8vw, 38px)", fontWeight: 600, lineHeight: 1.2, color: "#36241B" },
    accountIntroText: { maxWidth: 640, margin: "12px 0 0", color: "#705F51", fontSize: 16, lineHeight: 1.7 },
    accountCard: {
      minHeight: 220, padding: "25px 28px", borderRadius: 18,
      border: "1px solid rgba(54,34,25,.08)",
      boxShadow: "0 7px 20px rgba(54,34,25,.06)",
      display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 25, minWidth: 0,
    },
    accountCardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 },
    accountCardIcon: { display: "inline-flex", width: 28, height: 28 },
    accountCardLabel: { display: "block", marginBottom: 9, fontSize: 10, fontWeight: 750, letterSpacing: "0.13em" },
    accountCardNumber: { fontSize: 12, fontWeight: 500 },
    accountCardTitle: { fontSize: "clamp(19px, 1.85vw, 25px)", lineHeight: 1.26, fontWeight: 630, margin: 0 },
    accountCardText: { margin: "9px 0 0", fontSize: 14, lineHeight: 1.6, maxWidth: 440 },

    // The closing note is an editorial pause, deliberately separated from the footer.
    // Keep the gap inside this section so Header/Footer and their CSS remain untouched.
    closingStatementSection: {
      padding: "clamp(125px, 13vw, 190px) 0 clamp(160px, 17vw, 240px)",
      background: "linear-gradient(180deg, #F7E8D6 0%, #F2E3D1 65%, #F8F2E9 100%)",
      color: "#362219",
    },
    closingStatementInner: { maxWidth: 1000, margin: "0 auto", textAlign: "center" },
    closingStatementEyebrow: { color: "#A15F49", fontSize: 12, fontWeight: 750, letterSpacing: "0.18em" },
    closingStatementQuote: {
      margin: "clamp(32px, 4.5vw, 64px) 0 34px", fontFamily: type.family.heading,
      color: "#362219", fontSize: "clamp(27px, 3.3vw, 46px)",
      lineHeight: 1.55, fontWeight: 500, letterSpacing: "-.022em",
    },
    closingStatementSignature: { color: "#82614E", fontSize: 15, fontWeight: 650, letterSpacing: ".025em" },

    grid3: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: layout.gridGap },
    card: { minHeight: 170, borderRadius: 18, border: `1px solid rgba(219,210,198,1)`, background: c.white, padding: components.card.pad, boxShadow: brand.shadows.md },
    cardFeatured: { background: `${brand.gradients.warmWash}, ${c.surfaceSoft}`, borderColor: c.borderStrong },
    cardTag: { display: "inline-flex", padding: "7px 12px", borderRadius: 999, background: "rgba(235,191,96,0.12)", border: "1px solid rgba(168,112,50,0.18)", color: c.brand, fontSize: 12, fontWeight: 900, marginBottom: 12 },
    cardTitle: { marginBottom: 10, color: c.text, fontSize: type.cardTitle.size, lineHeight: type.cardTitle.line, fontWeight: type.cardTitle.weight },
    cardText: { color: c.body, fontSize: type.cardBody.size, lineHeight: type.cardBody.line },

    // step: { minHeight: howItWorks.cardMinHeight, borderRadius: 20, border: `1px solid rgba(242,225,198,0.26)`, background: "rgba(251,248,242,0.08)", padding: components.card.pad, boxShadow: brand.shadows.sm },
    howStepsGrid: {
      display: "grid",
      gridTemplateColumns: `repeat(${howItWorks.columns}, minmax(0, 1fr))`,
      gap: layout.gridGap,
      marginTop: 28,
    },
    step: {
      minHeight: howItWorks.cardMinHeight,
      borderRadius: 18,
      border: `1px solid ${c.borderSoft}`,
      background: c.white,
      padding: components.card.pad,
      boxShadow: brand.shadows.md,
    },

    stepNum: {
      marginBottom: 10,
      color: c.muted,
      fontSize: 12,
      fontWeight: 900,
      letterSpacing: 0.8,
      textTransform: "uppercase",
    },

    stepTitle: {
      marginBottom: 8,
      color: c.text,
      fontSize: type.cardTitle.size,
      lineHeight: type.cardTitle.line,
      fontWeight: type.cardTitle.weight,
    },

    stepText: {
      color: c.body,
      fontSize: type.cardBody.size,
      lineHeight: type.cardBody.line,
    },
    // stepNum: { marginBottom: 12, color: c.gold, fontSize: 13, fontWeight: 900, letterSpacing: 1.2 },

    
    // stepTitle: { marginBottom: 8, color: c.surface, fontSize: type.cardTitle.size, lineHeight: type.cardTitle.line, fontWeight: type.cardTitle.weight },

    

    // stepText: { color: c.textOnDark, fontSize: type.cardBody.size, lineHeight: type.cardBody.line },

  
    ctaBand: { padding: `${cta.padY}px 0`, background: brand.gradients.cta, borderTop: `1px solid rgba(110,98,88,0.14)` },
    ctaInner: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, flexWrap: "wrap", padding: `${cta.innerPadY}px 0` },
    ctaTitle: { color: c.surface, fontFamily: type.family.heading, fontSize: 26, fontWeight: 900 },
    ctaText: { marginTop: 10, maxWidth: 680, color: c.textOnDark, fontSize: 16, lineHeight: 1.75 },
  };
}

