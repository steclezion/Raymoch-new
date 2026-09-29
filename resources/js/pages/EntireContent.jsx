import React, { useMemo, useState } from "react";
import "../styles/landingv2.css";
import AfricaInvestmentPanel from "../components/AfricaInvestmentPanel.jsx";

/**
 * =============================================================================
 * Entire.jsx (LANDING V2 CONTENT REBUILD)
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
      linear-gradient(
        100deg,
        rgba(40, 22, 15, 1) 0%,
        rgba(61, 36, 24, 1) 24%,
        rgba(92, 58, 39, 1) 50%,
        rgba(150, 103, 58, 1) 76%,
        rgba(216, 170, 92, 1) 92%,
        rgba(176, 123, 7, 1) 100%
      )
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

  heroTitle: { size: "clamp(58px, 6vw, 84px)", line: 1.04, weight: 800, spacing: "-0.02em" },
  sectionTitle: { size: 34, line: 1.15, weight: 800 },
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
  heroPadTop: 150,
  heroPadBottom: 200,
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
    maxTextWidth: 800,
    subMaxWidth: 720,
    kickerMarginBottom: 16,
    subMarginTop: 18,
    ctaMarginTop: 34,
    waveHeight: 240,
    gridOpacity: 0.28,
    gridSize: 58,
  },

  about: {
    columns: "1fr 1.2fr",
    statsColumns: 3,
    trustCardMinHeight: 250,
  },

  whatWeDo: {
    columns: 5,
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
export default function EntireContent() {
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
      { image: "/images/intel/afdb2.jpg", source: "African Development Bank", title: "SME financing notes", blurb: "Gap sizing and access barriers.", href: "https://www.afdb.org" },
    ],
    []
  );

  const S = makeStyles(BRAND, TYPE, LAYOUT, COMPONENTS, SECTION_CONTROLLERS);

  return (
    <div style={S.page}>
      <WhoWeAre S={S} />
      <WhatWeDo S={S} />
      <AfricaInvestmentPanel apiEndpoint="/api/africa/companies" pollMs={6000} />
      <HowItWorks S={S} />
      <MosaicSpotlight S={S} />
      <SpecialReports S={S} reports={reports} />
      <MarketIntelCarousel S={S} intel={intel} />
      <CTADeep S={S} />
      <SignalsOverview S={S} signals={signals} />
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
    <section style={S.hero}>
      <div style={S.heroGridFade} aria-hidden="true" />
      <div style={S.wrap}>
        <div style={S.heroInner}>
          <div style={S.kicker}>Verify • CTI™ • Market Signals</div>
          <h1 style={S.h1}>Redefining African Potential</h1>
          <p style={S.sub}>
            Raymoch connects investors and entrepreneurs through verified data,
            a transparent trust score, and actionable market intelligence.
          </p>
          <div style={S.ctaRow}>
            <a href="/businesses" style={{ ...S.btnBase, ...S.btnPrimary }}>Explore</a>
            <a href="/verification" style={{ ...S.btnBase, ...S.btnGhostLight }}>Get verified</a>
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
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none" style={S.heroWaveSvg}>
        <path d="M0,64 C240,120 480,120 720,88 C960,56 1200,-8 1440,32 L1440,120 L0,120 Z" fill={S.tokens.colors.surface} />
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
            <h2 style={S.h2}>Who we are</h2>
            <p style={S.leadBody}>
              We build trust rails so capital can move with context. Verified company
              profiles, the Comprehensive Trust Index, and market intelligence make it easier
              to discover credible African businesses and back them with confidence.
            </p>
            <div style={S.aboutStats}>
              <Stat S={S} label="Companies tracked" value="12,400+" />
              <Stat S={S} label="Active sectors" value="24+" />
              <Stat S={S} label="Countries covered" value="54+" />
            </div>
          </div>

          <div style={S.trustIntroCard}>
            <div style={S.cardTag}>Trust</div>
            <div style={S.cardTitle}>How trust is earned</div>
            <ul style={S.bulletList}>
              <li>Multi-source verification across documents, references, and public records</li>
              <li>CTI™ reflects completeness, integrity, and recency</li>
              <li>Signals layer tracks policy movement, incentives, and risk shifts</li>
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
    <section style={S.sectionSurfaceTight}>
      <div style={S.wrap}>
        <div style={S.sectionHead}>
          <h2 style={S.h2}>What we do:</h2>
          <p style={S.p}>
            Five core lanes that explain the platform clearly without turning the page into a brick of text.
          </p>
        </div>

        <div style={S.featureBand}>
          <a href="/matching" style={{ ...S.featureBlock, ...S.featureBlockDeep }}>
            <div>
              <div style={S.featureEyebrow}>Match</div>
              <div style={S.featureTitle}>Trusted matching</div>
              <div style={S.featureText}>
                Find credible businesses using verified profiles, CTI™, sector filters, and market context.
              </div>
            </div>
          </a>

          <a href="/verification" style={{ ...S.featureBlock, ...S.featureBlockClay }}>
            <div>
              <div style={S.featureEyebrow}>Verify</div>
              <div style={S.featureTitle}>Verification</div>
              <div style={S.featureText}>
                We review identity, documents, business references, and consistency signals before trust markers appear.
              </div>
            </div>
          </a>

          <a href="/cti" style={{ ...S.featureBlock, ...S.featureBlockGold }}>
            <div>
              <div style={S.featureEyebrowDark}>Trust Score</div>
              <div style={S.featureTitleDark}>CTI™ scoring</div>
              <div style={S.featureTextDark}>
                Our internal trust model reflects completeness, integrity, and recency so profiles are easier to compare.
              </div>
            </div>
          </a>

          <a href="/updates" style={{ ...S.featureBlock, ...S.featureBlockSoft }}>
            <div>
              <div style={S.featureEyebrowDark}>Updates</div>
              <div style={S.featureTitleDark}>Latest updates</div>
              <div style={S.featureTextDark}>
                Track policy shifts, incentives, regulatory movement, and fresh market signals across countries and sectors.
              </div>
            </div>
          </a>

          <a href="/programs" style={{ ...S.featureBlock, ...S.featureBlockLight }}>
            <div>
              <div style={S.featureEyebrowDark}>Growth</div>
              <div style={S.featureTitleDark}>Community & growth</div>
              <div style={S.featureTextDark}>
                Programs, visibility, and network pathways that help businesses become more discoverable and investable.
              </div>
            </div>
          </a>
        </div>

        <div style={S.overviewButtonRow}>
          <a href="/overview_auth" style={S.overviewButton}>
            Open Overview
          </a>
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

        <div style={S.grid4}>
          <InfoCard S={S} title="Latest incentives" text="Tax credits, grants, and concessional financing recently announced." href="/incentives" />
          <InfoCard S={S} title="Policy changes" text="Regulatory updates that unlock or constrain sectors and regions." href="/policy" />
          <InfoCard S={S} title="Market news" text="Signals from M&A, funding rounds, and trade flows." href="/insights" />
          <InfoCard S={S} title="Whitespace map" text="A data-led view of unmet demand by sector and country." href="/whitespace" />
        </div>
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
            <h2 style={S.h2}>Special reports</h2>
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
  const visibleCount = SECTION_CONTROLLERS.carousel.visibleCount;
  const [index, setIndex] = useState(0);
  const visible = Array.from({ length: visibleCount }, (_, i) => intel[(index + i) % intel.length]);

  return (
    <section style={S.sectionIntel}>
      <div style={S.wrapWideIntel}>
        <div style={S.sectionHeadRow}>
          <div>
            <h2 style={S.h2}>Market & research intelligence</h2>
            <p style={S.p}>Curated institutional research and directional signals.</p>
          </div>
          <div style={S.carouselBtnRow}>
            <button onClick={() => setIndex((i) => (i - 1 + intel.length) % intel.length)} style={S.carouselBtn} aria-label="Previous">‹</button>
            <button onClick={() => setIndex((i) => (i + 1) % intel.length)} style={S.carouselBtn} aria-label="Next">›</button>
          </div>
        </div>

        <div style={S.carouselGrid}>
          {visible.map((x, i) => {
            const isCenter = i === 1;
            return (
              <a key={`${x.source}-${x.title}`} href={x.href} target="_blank" rel="noreferrer" style={{ ...S.intelItemCard, ...(isCenter ? S.intelCenter : S.intelSide) }}>
                <div>
                  {x.image ? <img src={x.image} alt={x.source} style={S.intelImage} /> : null}
                  <div style={S.intelSource}>{x.source}</div>
                  <div style={S.intelItemTitle}>{x.title}</div>
                  <div style={S.intelItemText}>{x.blurb}</div>
                </div>
                <div style={S.intelItemLink}>Open source</div>
              </a>
            );
          })}
        </div>
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
  return (
    <section style={S.sectionAlt}>
      <div style={S.wrap}>
        <div style={S.sectionHeadRow}>
          <div>
            <h2 style={S.h2}>Explore the platform</h2>
            <p style={S.p}>
              A mosaic view of the platform’s strongest lanes: verified businesses, market signals, research, and reports.
            </p>
          </div>
          {/* <a href="/overview" >
            Open overview
          </a> */}
                <a href="/overview_auth" style={{ ...S.btnSmallBase, ...S.btnGhost }}>
            Open Overview
          </a>
        </div>

        <div style={S.mosaicGrid}>
          <a href="/businesses" style={{ ...S.mosaicCard, ...S.mosaicHeroCard }}>
            <div>
              <div style={S.mosaicEyebrowLight}>Featured lane</div>
              <div style={S.mosaicHeroTitle}>Verified businesses with context, not noise.</div>
              <div style={S.mosaicHeroText}>
                Browse structured company profiles shaped by verification, CTI™, and fresh market context.
              </div>
            </div>
            <div style={S.mosaicLinkLight}>Explore businesses</div>
          </a>

          <a href="/updates" style={{ ...S.mosaicCard, ...S.mosaicWarmCard }}>
            <div>
              <div style={S.mosaicEyebrowDark}>Signals</div>
              <div style={S.mosaicCardTitleDark}>Policy updates</div>
              <div style={S.mosaicCardTextDark}>
                Incentives, regulatory shifts, and directional movements across sectors and countries.
              </div>
            </div>
            <div style={S.mosaicLinkDark}>Open updates</div>
          </a>

          <a href="/insights" style={{ ...S.mosaicCard, ...S.mosaicLightCard }}>
            <div>
              <div style={S.mosaicEyebrowDark}>Research</div>
              <div style={S.mosaicCardTitleDark}>Market intelligence</div>
              <div style={S.mosaicCardTextDark}>
                Curated institutional research and strategic reading across Africa’s markets.
              </div>
            </div>
            <div style={S.mosaicLinkDark}>Open research</div>
          </a>

          <a href="/verification" style={{ ...S.mosaicCard, ...S.mosaicClayCard }}>
            <div>
              <div style={S.mosaicEyebrowLight}>Trust</div>
              <div style={S.mosaicCardTitleLight}>Verification system</div>
              <div style={S.mosaicCardTextLight}>
                Identity, documents, references, and consistency checks before trust markers appear.
              </div>
            </div>
            <div style={S.mosaicLinkLight}>Get verified</div>
          </a>

          <a href="/cti" style={{ ...S.mosaicCard, ...S.mosaicGoldCard }}>
            <div>
              <div style={S.mosaicEyebrowDark}>CTI™</div>
              <div style={S.mosaicCardTitleDark}>Comprehensive Trust Index</div>
              <div style={S.mosaicCardTextDark}>
                Transparent scoring built around completeness, integrity, and recency.
              </div>
            </div>
            <div style={S.mosaicLinkDark}>See CTI™</div>
          </a>
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
function HowItWorks({ S }) {
  return (
    <section style={S.sectionSurface}>
      <div style={S.wrap}>
        <div style={S.aboutGrid}>
          <div>
            <h2 style={S.h2}>How it works</h2>
            <p style={S.leadBody}>
              A simple process that helps businesses become visible, credible,
              and easier to evaluate through structured profiles, verification,
              and intelligence.
            </p>
          </div>

          <div style={S.trustIntroCard}>
            <div style={S.cardTag}>Process</div>
            <div style={S.cardTitle}>How the flow works</div>
            <ul style={S.bulletList}>
              <li>Create a structured company profile</li>
              <li>Complete verification and CTI™ scoring</li>
              <li>Explore signals, match, and act with context</li>
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
            <div style={S.ctaTitle}>Build trust. Unlock capital. Move faster.</div>
            <div style={S.ctaText}>Whether you’re investing or raising, Raymoch gives you verified context so decisions are clearer and diligence is faster.</div>
          </div>
          <div style={S.buttonGroup}>
            <a href="/explore" style={{ ...S.btnBase, ...S.btnGhostDark }}>Explore</a>
            <a href="/verification" style={{ ...S.btnBase, ...S.btnGhostDark }}>Get verified</a>
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

    btnPrimary: { background: c.oat, color: c.brandDeep, borderColor: c.oatDeep },
    btnGhostLight: { background: "transparent", color: c.surface, borderColor: "rgba(246,241,232,0.58)" },
    btnGhost: { background: c.oat, color: c.brandDeep, borderColor: c.oatDeep },
    btnGhostDark: { background: "transparent", color: c.surface, borderColor: "rgba(246,241,232,0.58)" },
    buttonGroup: { display: "flex", gap: layout.buttonGroupGap, flexWrap: "wrap" },

    h1: { margin: 0, fontFamily: type.family.heading, fontSize: type.heroTitle.size, lineHeight: type.heroTitle.line, fontWeight: type.heroTitle.weight, letterSpacing: type.heroTitle.spacing, color: c.white },
    h2: { margin: 0, fontFamily: type.family.heading, fontSize: type.sectionTitle.size, lineHeight: type.sectionTitle.line, fontWeight: type.sectionTitle.weight, color: c.text },
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

    hero: { position: "relative", overflow: "hidden", padding: `${layout.heroPadTop}px 0 ${layout.heroPadBottom}px`, background: brand.gradients.hero, isolation: "isolate" },
    heroGridFade: {
      position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
      backgroundImage: `
        repeating-linear-gradient(45deg, rgba(246,241,232,${hero.gridOpacity}) 0px, rgba(246,241,232,${hero.gridOpacity}) 1px, transparent 1px, transparent ${hero.gridSize}px),
        repeating-linear-gradient(-45deg, rgba(246,241,232,${hero.gridOpacity}) 0px, rgba(246,241,232,${hero.gridOpacity}) 1px, transparent 1px, transparent ${hero.gridSize}px)
      `,
      maskImage: "linear-gradient(90deg, transparent 0%, transparent 26%, rgba(0,0,0,0.10) 42%, rgba(0,0,0,0.62) 64%, rgba(0,0,0,1) 100%)",
      WebkitMaskImage: "linear-gradient(90deg, transparent 0%, transparent 26%, rgba(0,0,0,0.10) 42%, rgba(0,0,0,0.62) 64%, rgba(0,0,0,1) 100%)",
    },
    heroInner: { position: "relative", zIndex: 2, maxWidth: hero.maxTextWidth, textAlign: "left" },
    kicker: {
      display: "inline-flex", padding: "8px 12px", borderRadius: 999, background: "rgba(246,241,232,0.12)", border: "1px solid rgba(246,241,232,0.22)",
      color: "rgba(246,241,232,0.96)", fontSize: type.label.size, lineHeight: type.label.line, fontWeight: type.label.weight, letterSpacing: type.label.spacing,
      textTransform: "uppercase", marginBottom: hero.kickerMarginBottom,
    },
    sub: { maxWidth: hero.subMaxWidth, marginTop: hero.subMarginTop, color: "rgba(246,241,232,0.92)", fontSize: type.lead.size, lineHeight: type.lead.line, fontWeight: type.lead.weight },
    ctaRow: { display: "flex", gap: layout.buttonGroupGap, flexWrap: "wrap", marginTop: hero.ctaMarginTop },
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

    mosaicGrid: {
      display: "grid",
      gridTemplateColumns: mosaic.columns,
      gridTemplateRows: mosaic.rows,
      gap: mosaic.gap,
    },
    mosaicCard: {
      borderRadius: 22,
      textDecoration: "none",
      padding: 24,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      boxShadow: brand.shadows.lg,
      border: `1px solid ${c.borderSoft}`,
      minHeight: 0,
      overflow: "hidden",
    },
    mosaicHeroCard: {
      gridRow: "1 / span 2",
      background: `linear-gradient(145deg, rgba(61,38,25,1), rgba(91,56,37,0.96), rgba(168,112,50,0.88))`,
      color: c.white,
    },
    mosaicWarmCard: {
      background: `linear-gradient(135deg, rgba(248,239,223,1), rgba(242,225,198,1))`,
      color: c.text,
    },
    mosaicLightCard: {
      background: c.white,
      color: c.text,
    },
    mosaicClayCard: {
      background: `linear-gradient(135deg, rgba(168,112,50,1), rgba(198,137,86,1))`,
      color: c.white,
    },
    mosaicGoldCard: {
      background: `linear-gradient(135deg, rgba(235,191,96,1), rgba(242,225,198,1))`,
      color: c.text,
    },
    mosaicEyebrowLight: {
      fontSize: 12,
      fontWeight: 900,
      letterSpacing: 0.8,
      textTransform: "uppercase",
      color: "rgba(255,244,220,0.86)",
    },
    mosaicEyebrowDark: {
      fontSize: 12,
      fontWeight: 900,
      letterSpacing: 0.8,
      textTransform: "uppercase",
      color: "rgba(24,29,34,0.72)",
    },
    mosaicHeroTitle: {
      marginTop: 12,
      maxWidth: 520,
      fontSize: 38,
      lineHeight: 1.08,
      fontWeight: 900,
      fontFamily: type.family.heading,
      color: c.white,
    },
    mosaicHeroText: {
      marginTop: 14,
      maxWidth: 520,
      color: "rgba(246,241,232,0.92)",
      lineHeight: 1.8,
      fontSize: 17,
    },
    mosaicCardTitleLight: {
      marginTop: 10,
      fontSize: 26,
      lineHeight: 1.14,
      fontWeight: 900,
      color: c.white,
    },
    mosaicCardTextLight: {
      marginTop: 12,
      color: "rgba(246,241,232,0.92)",
      lineHeight: 1.75,
      fontSize: 15,
    },
    mosaicCardTitleDark: {
      marginTop: 10,
      fontSize: 24,
      lineHeight: 1.14,
      fontWeight: 900,
      color: c.text,
    },
    mosaicCardTextDark: {
      marginTop: 12,
      color: "rgba(24,29,34,0.78)",
      lineHeight: 1.75,
      fontSize: 15,
    },
    mosaicLinkLight: {
      marginTop: 18,
      fontWeight: 900,
      color: c.white,
    },
    mosaicLinkDark: {
      marginTop: 18,
      fontWeight: 900,
      color: c.brandDeep,
    },

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
