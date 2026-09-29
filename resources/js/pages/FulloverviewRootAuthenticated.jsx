import { useEffect, useMemo, useState } from "react";
import HorizontalNavigation from "../components/HorizontalNavigation.jsx";
import Footer from "../components/layout_master/Footer.jsx";
import { ResponsiveController } from "../components/ResponsiveController.jsx";
import "../styles/headerFooter.css";

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
    success: "rgba(47, 111, 72, 1)",
    successSoft: "rgba(231, 242, 235, 1)",
    adDark: "rgba(34, 46, 39, 1)",
  },
  gradients: {
    warmWash: `linear-gradient(180deg, rgba(235,191,96,0.11), rgba(246,241,232,0.00))`,
    feature: `linear-gradient(135deg, rgba(255,250,240,1), rgba(246,241,232,1))`,
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
  sectionTitle: { size: 34, line: 1.15, weight: 800 },
  body: { size: 18, line: 1.8, weight: 400 },
  cardBody: { size: 16, line: 1.72, weight: 400 },
};

const LAYOUT = {
  wrapMax: 1440,
  wrapPadX: 28,
  sectionPadY: 56,
  gridGap: 32,
  gridGapTight: 20,
};

/*
  PAGE_SEQUENCE controls the vertical order of the Overview page.

  This is the main sequencing controller.
  To move a section, reorder the objects below.
  To temporarily hide a section, set enabled: false.

  This keeps the JSX inside <main> clean and prevents the page from becoming
  a long stack of manually moved sections.
*/
const PAGE_SEQUENCE = [
  {
    id: "editorialDesk",
    enabled: true,
    label: "Top intelligence desk",
    purpose:
      "Controls the top Overview experience: mosaic intro, briefs, lead story, trending rail, and newswire.",
  },
  {
    id: "investmentPanel",
    enabled: true,
    label: "Investment Panel",
    purpose:
      "Main analytical intelligence module. Shows sectors, countries, regions, CAPEX, movers, and donut intelligence.",
  },
  {
    id: "latestSignals",
    enabled: true,
    label: "Latest signals",
    purpose:
      "Fast-scan verified policy, capital, energy, and market movement cards.",
  },
  {
    id: "featuredIntelligence",
    enabled: true,
    label: "Featured intelligence",
    purpose:
      "Longer-form reports, featured story, and editorial intelligence rail.",
  },
  {
    id: "marketResearch",
    enabled: true,
    label: "Market and research intelligence",
    purpose:
      "Carousel for institutional sources and external research references.",
  },
  {
    id: "platformSampler",
    enabled: true,
    label: "Explore Raymoch surfaces",
    purpose:
      "Gateway cards into Businesses, Insights, Regional Briefs, and Matching. Kept lower so it does not interrupt the intelligence flow.",
  },
  {
    id: "membershipPromo",
    enabled: true,
    label: "Membership promo",
    purpose:
      "Conversion card for services or membership after the user has seen enough value.",
  },
  {
    id: "joinRaymoch",
    enabled: true,
    label: "Final join section",
    purpose:
      "Final subscription and premium report call-to-action.",
  },
];

/*
  SECTION_CONTROLLERS controls layout internals for each major module.

  Important:
  - This does NOT control the vertical page order.
  - PAGE_SEQUENCE controls page order.
  - SECTION_CONTROLLERS controls dimensions, grids, gaps, heights, and visual proportions.
*/
const SECTION_CONTROLLERS = {
  /*
    reports controls the Featured Intelligence / Special Reports block.

    columns:
      Controls the desktop grid ratio:
      left intro card / center featured story / right rail.

    introMinHeight:
      Controls the height of the left explanatory card.

    featuredMinHeight:
      Controls the height of the center featured report card.

    mediaHeight:
      Controls the height of the image/video placeholder inside the featured card.

    gridGap:
      Controls spacing between the report columns.
  */
  reports: {
    columns: "0.7fr 2fr 0.75fr",
    introMinHeight: 220,
    featuredMinHeight: 500,
    mediaHeight: 280,
    gridGap: 24,
  },

  /*
    carousel controls the Market & Research Intelligence carousel.

    visibleCount:
      Number of cards shown at once.

    viewportGap:
      Space around the carousel viewport.

    cardWidth:
      Intended width for each carousel card.

    cardMinHeight:
      Minimum height for carousel cards.

    imageHeight:
      Height of the source image/logo area.
  */
  carousel: {
    visibleCount: 3,
    viewportGap: 12,
    cardWidth: 300,
    cardMinHeight: 380,
    imageHeight: 100,
  },

  /*
    investmentPanel controls the Investment Panel.

    columns:
      Controls desktop split between the donut/chart side and the movers/table side.

    chartSize:
      Controls the donut chart size.

    controlBarGap:
      Controls spacing between View / Window selectors.
  */
  investmentPanel: {
    columns: "1fr 0.92fr",
    chartSize: 480,
    controlBarGap: 10,
  },
};

export default function FulloverviewRootAuthenticated() {
  const S = useMemo(
    () => makeStyles(BRAND, TYPE, LAYOUT, SECTION_CONTROLLERS),
    []
  );

  const [activeDesk, setActiveDesk] = useState("All");
  const [leadIndex, setLeadIndex] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1440
  );


  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    if (typeof window !== "undefined") {
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }
  }, []);

  const isTablet = viewportWidth < 1180;
  const isMobile = viewportWidth < 820;

  const deskTabs = useMemo(
    () => ["All", "Continental", "Regional", "Policy", "Markets", "Verified", "Reports"],
    []
  );

  const wireItems = useMemo(
    () => [
      { tag: "Policy", text: "Ghana adjusts export FX rules for selected sectors", href: "/signals/ghana-fx-repatriation" },
      { tag: "Energy", text: "Kenya extends targeted VAT relief on solar mini-grid components", href: "/signals/kenya-vat-solar" },
      { tag: "Capital", text: "AfDB expands climate-adaptive SME financing window", href: "/signals/afdb-sme-climate" },
      { tag: "Healthtech", text: "Egypt introduces faster sandbox path for device approvals", href: "/signals/egypt-healthtech-sandbox" },
      { tag: "Logistics", text: "Nigeria corridor upgrades reshape freight timing assumptions", href: "/signals/nigeria-logistics-corridor" },
      { tag: "Markets", text: "Morocco and Tunisia manufacturing indicators diverge on fresh inputs", href: "/signals/maghreb-manufacturing-watch" },
    ],
    []
  );

  const leadStories = useMemo(
    () => [
      {
        desk: "Policy",
        eyebrow: "Continental policy watch",
        title: "Verified visibility may shape African market discovery before capital even arrives",
        summary:
          "The overview surface should foreground regulatory motion, market shifts, and credible business discovery in one curated page so users get signal before noise.",
        image:
          "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1400&q=80",
        href: "/insights/featured",
      },
      {
        desk: "Markets",
        eyebrow: "Market structure",
        title: "Underexposed sectors across African markets deserve rotation, not permanent invisibility",
        summary:
          "A rotating sampling layer can reveal white space across regions and sectors while keeping trust, freshness, and evidence ahead of raw attention.",
        image:
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80",
        href: "/insights/market-white-space",
      },
      {
        desk: "Verified",
        eyebrow: "Trust infrastructure",
        title: "Trust works better when it is structured, explainable, and protected from performance theater",
        summary:
          "Verification, freshness, and evidence diversity should influence prominence before monetization or surface behavior distorts what the platform is truly surfacing.",
        image:
          "https://images.unsplash.com/photo-1551281044-8b0a1a4a6d3d?auto=format&fit=crop&w=1400&q=80",
        href: "/insights/trust-infrastructure",
      },
    ],
    []
  );

  const leftRailStories = useMemo(
    () => [
      {
        tag: "Regional",
        title: "West African agritech visibility is widening faster than financing access",
        href: "/insights/west-africa-agritech",
      },
      {
        tag: "Policy",
        title: "Energy licensing changes are becoming the real signal, not the press release around them",
        href: "/insights/energy-licensing-watch",
      },
      {
        tag: "Verified",
        title: "Freshness, not just documentation volume, should shape enterprise prominence",
        href: "/insights/freshness-and-trust",
      },
    ],
    []
  );

  const trendingItems = useMemo(
    () => [
      { tag: "Regional", title: "Nigeria, Kenya, and South Africa continue to dominate early enterprise discovery", href: "/insights/top-markets" },
      { tag: "Reports", title: "Regional briefs are drawing stronger attention than static country pages", href: "/insights/regional-briefs" },
      { tag: "Verified", title: "High-trust profiles with recent updates outperform stale premium visibility", href: "/insights/high-trust-profiles" },
      { tag: "Markets", title: "Climate, logistics, and fintech remain the strongest cross-page themes", href: "/insights/cross-page-themes" },
    ],
    []
  );

  const samplerCards = useMemo(
    () => [
      {
        label: "Businesses",
        title: "Verified entities and standout profiles",
        text: "A selective preview of businesses gaining visibility across sectors and countries.",
        href: "/businesses",
      },
      {
        label: "Insights",
        title: "Reports, briefs, and benchmark surfaces",
        text: "Structured research layers for users who need more than fast headlines.",
        href: "/insights",
      },
      {
        label: "Regional Briefs",
        title: "Snapshots by geography and macro signal",
        text: "Country and regional context without forcing users into long search paths.",
        href: "/insights/regional-briefs",
      },
      {
        label: "Matching",
        title: "Preview where trust meets routing",
        text: "A light signal of the future matching and allocation layer without overselling it.",
        href: "/services/matching",
      },
    ],
    []
  );

  const news = useMemo(
    () => [
      {
        tag: "Policy",
        title: "Ghana eases FX repatriation rules for exporters",
        meta: "West Africa · Policy shift",
        href: "/signals/ghana-fx-repatriation",
      },
      {
        tag: "Energy",
        title: "Kenya expands VAT relief on solar mini-grid components",
        meta: "East Africa · Incentive",
        href: "/signals/kenya-vat-solar",
      },
      {
        tag: "Capital",
        title: "AfDB expands climate-adaptive agritech SME window",
        meta: "Continental · Funding",
        href: "/signals/afdb-sme-climate",
      },
      {
        tag: "Healthtech",
        title: "Egypt launches a faster sandbox path for devices",
        meta: "North Africa · Regulatory",
        href: "/signals/egypt-healthtech-sandbox",
      },
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
      { image: "/img/intel/worldbank.jpg", source: "World Bank", title: "Africa economic updates", blurb: "Growth, inflation, and trade movements.", href: "https://www.worldbank.org" },
      { image: "/img/intel/imf.jpg", source: "IMF", title: "Regional outlook briefs", blurb: "Macro risks, fiscal pressure, capital flows.", href: "https://www.imf.org" },
      { image: "/img/intel/afdb.jpg", source: "AfDB", title: "African economic outlook", blurb: "Financing constraints and transformation priorities.", href: "https://www.afdb.org" },
      { image: "/img/intel/unctad.jpg", source: "UNCTAD", title: "Investment trends", blurb: "FDI shifts and global allocation patterns.", href: "https://unctad.org" },
      { image: "/img/intel/oecd.jpg", source: "OECD", title: "SME productivity signals", blurb: "Competitiveness and demand changes.", href: "https://www.oecd.org" },
      { image: "/img/intel/afdb2.jpg", source: "African Development Bank", title: "SME financing notes", blurb: "Gap sizing and access barriers.", href: "https://www.afdb.org" },
    ],
    []
  );

  const panelData = useMemo(
    () => [
      { country: "Algeria", flag: "🇩🇿", companies: 5, capex: "$240M", projects: 4, mix: "2 / 2" },
      { country: "Angola", flag: "🇦🇴", companies: 4, capex: "$210M", projects: 3, mix: "1 / 2" },
      { country: "Benin", flag: "🇧🇯", companies: 3, capex: "$80M", projects: 2, mix: "1 / 1" },
      { country: "Botswana", flag: "🇧🇼", companies: 3, capex: "$95M", projects: 2, mix: "1 / 1" },
      { country: "Burkina Faso", flag: "🇧🇫", companies: 2, capex: "$60M", projects: 2, mix: "1 / 1" },
      { country: "Burundi", flag: "🇧🇮", companies: 2, capex: "$42M", projects: 1, mix: "1 / 0" },
      { country: "Cabo Verde", flag: "🇨🇻", companies: 2, capex: "$38M", projects: 1, mix: "1 / 0" },
      { country: "Cameroon", flag: "🇨🇲", companies: 4, capex: "$130M", projects: 3, mix: "1 / 2" },
      { country: "Central African Republic", flag: "🇨🇫", companies: 1, capex: "$22M", projects: 1, mix: "1 / 0" },
      { country: "Chad", flag: "🇹🇩", companies: 2, capex: "$48M", projects: 1, mix: "0 / 1" },
      { country: "Comoros", flag: "🇰🇲", companies: 1, capex: "$18M", projects: 1, mix: "1 / 0" },
      { country: "DR Congo", flag: "🇨🇩", companies: 5, capex: "$190M", projects: 4, mix: "2 / 2" },
      { country: "Republic of the Congo", flag: "🇨🇬", companies: 3, capex: "$76M", projects: 2, mix: "1 / 1" },
      { country: "Côte d’Ivoire", flag: "🇨🇮", companies: 5, capex: "$175M", projects: 4, mix: "2 / 2" },
      { country: "Djibouti", flag: "🇩🇯", companies: 2, capex: "$40M", projects: 1, mix: "0 / 1" },
      { country: "Egypt", flag: "🇪🇬", companies: 8, capex: "$420M", projects: 7, mix: "3 / 4" },
      { country: "Equatorial Guinea", flag: "🇬🇶", companies: 2, capex: "$58M", projects: 2, mix: "1 / 1" },
      { country: "Eritrea", flag: "🇪🇷", companies: 1, capex: "$26M", projects: 1, mix: "1 / 0" },
      { country: "Eswatini", flag: "🇸🇿", companies: 2, capex: "$36M", projects: 1, mix: "0 / 1" },
      { country: "Ethiopia", flag: "🇪🇹", companies: 6, capex: "$230M", projects: 5, mix: "2 / 3" },
      { country: "Gabon", flag: "🇬🇦", companies: 3, capex: "$82M", projects: 2, mix: "1 / 1" },
      { country: "Gambia", flag: "🇬🇲", companies: 1, capex: "$21M", projects: 1, mix: "1 / 0" },
      { country: "Ghana", flag: "🇬🇭", companies: 6, capex: "$290M", projects: 6, mix: "3 / 3" },
      { country: "Guinea", flag: "🇬🇳", companies: 2, capex: "$52M", projects: 2, mix: "1 / 1" },
      { country: "Guinea-Bissau", flag: "🇬🇼", companies: 1, capex: "$20M", projects: 1, mix: "1 / 0" },
      { country: "Kenya", flag: "🇰🇪", companies: 7, capex: "$410M", projects: 8, mix: "4 / 4" },
      { country: "Lesotho", flag: "🇱🇸", companies: 1, capex: "$24M", projects: 1, mix: "1 / 0" },
      { country: "Liberia", flag: "🇱🇷", companies: 2, capex: "$41M", projects: 1, mix: "0 / 1" },
      { country: "Libya", flag: "🇱🇾", companies: 3, capex: "$88M", projects: 2, mix: "1 / 1" },
      { country: "Madagascar", flag: "🇲🇬", companies: 3, capex: "$72M", projects: 2, mix: "1 / 1" },
      { country: "Malawi", flag: "🇲🇼", companies: 2, capex: "$44M", projects: 2, mix: "1 / 1" },
      { country: "Mali", flag: "🇲🇱", companies: 2, capex: "$50M", projects: 2, mix: "1 / 1" },
      { country: "Mauritania", flag: "🇲🇷", companies: 2, capex: "$46M", projects: 1, mix: "0 / 1" },
      { country: "Mauritius", flag: "🇲🇺", companies: 3, capex: "$92M", projects: 2, mix: "1 / 1" },
      { country: "Morocco", flag: "🇲🇦", companies: 6, capex: "$260M", projects: 5, mix: "2 / 3" },
      { country: "Mozambique", flag: "🇲🇿", companies: 4, capex: "$122M", projects: 3, mix: "1 / 2" },
      { country: "Namibia", flag: "🇳🇦", companies: 3, capex: "$84M", projects: 2, mix: "1 / 1" },
      { country: "Niger", flag: "🇳🇪", companies: 2, capex: "$47M", projects: 1, mix: "0 / 1" },
      { country: "Nigeria", flag: "🇳🇬", companies: 9, capex: "$650M", projects: 9, mix: "5 / 4" },
      { country: "Rwanda", flag: "🇷🇼", companies: 4, capex: "$118M", projects: 3, mix: "2 / 1" },
      { country: "Sao Tome and Principe", flag: "🇸🇹", companies: 1, capex: "$16M", projects: 1, mix: "1 / 0" },
      { country: "Senegal", flag: "🇸🇳", companies: 5, capex: "$155M", projects: 4, mix: "2 / 2" },
      { country: "Seychelles", flag: "🇸🇨", companies: 1, capex: "$19M", projects: 1, mix: "1 / 0" },
      { country: "Sierra Leone", flag: "🇸🇱", companies: 2, capex: "$39M", projects: 1, mix: "0 / 1" },
      { country: "Somalia", flag: "🇸🇴", companies: 2, capex: "$37M", projects: 1, mix: "1 / 0" },
      { country: "South Africa", flag: "🇿🇦", companies: 8, capex: "$480M", projects: 7, mix: "3 / 4" },
      { country: "South Sudan", flag: "🇸🇸", companies: 1, capex: "$23M", projects: 1, mix: "1 / 0" },
      { country: "Sudan", flag: "🇸🇩", companies: 2, capex: "$49M", projects: 2, mix: "1 / 1" },
      { country: "Tanzania", flag: "🇹🇿", companies: 5, capex: "$168M", projects: 4, mix: "2 / 2" },
      { country: "Togo", flag: "🇹🇬", companies: 2, capex: "$43M", projects: 1, mix: "0 / 1" },
      { country: "Tunisia", flag: "🇹🇳", companies: 4, capex: "$136M", projects: 3, mix: "1 / 2" },
      { country: "Uganda", flag: "🇺🇬", companies: 4, capex: "$124M", projects: 3, mix: "1 / 2" },
      { country: "Zambia", flag: "🇿🇲", companies: 3, capex: "$91M", projects: 2, mix: "1 / 1" },
      { country: "Zimbabwe", flag: "🇿🇼", companies: 3, capex: "$86M", projects: 2, mix: "1 / 1" },
    ],
    []
  );

  const filteredLeadStories = useMemo(() => {
    if (activeDesk === "All" || activeDesk === "Continental") return leadStories;
    if (activeDesk === "Regional") {
      return leftRailStories.map((item, idx) => ({
        desk: "Regional",
        eyebrow: item.tag,
        title: item.title,
        summary: "A regional signal surfaced through the overview layer for rapid scanning and deeper follow-through.",
        image: leadStories[idx % leadStories.length].image,
        href: item.href,
      }));
    }
    if (activeDesk === "Reports") {
      return reports.map((r, idx) => ({
        desk: "Reports",
        eyebrow: "Featured report path",
        title: r.title,
        summary: "A curated route into deeper analysis, longer-form reports, and research-led platform intelligence.",
        image: leadStories[idx % leadStories.length].image,
        href: r.href,
      }));
    }
    return leadStories.filter((story) => story.desk === activeDesk);
  }, [activeDesk, leadStories, leftRailStories, reports]);

  useEffect(() => {
    setLeadIndex(0);
  }, [activeDesk]);

  const safeLeadStories = filteredLeadStories.length ? filteredLeadStories : leadStories;
  const activeLead = safeLeadStories[leadIndex % safeLeadStories.length] || leadStories[0];

  /*
    renderOverviewSection maps PAGE_SEQUENCE ids to actual page sections.

    This is the only place where section ids connect to JSX.
    To change the page order, do not move JSX inside <main>.
    Reorder PAGE_SEQUENCE above instead.
  */
  const renderOverviewSection = (section) => {
    switch (section.id) {
      case "editorialDesk":
        return (
          <section key={section.id} style={S.editorialShell}>
            <div style={S.wrap}>
              {/*
                SignalMosaicIntro controls the top Overview identity.
                It introduces Raymoch as structured Africa market intelligence.
                The mosaic is decorative, but it is important for brand depth and visual distinction.
              */}
              <SignalMosaicIntro S={S} isMobile={isMobile} />

              {/*
                heroSection controls the main editorial intelligence desk:
                left briefs rail, center lead story, and right trending rail.
                This stays near the top because it tells users what the Overview page does immediately.
              */}
              <section style={S.heroSection}>
                <div
                  style={{
                    ...S.heroGrid,
                    ...(isTablet ? S.heroGridTablet : null),
                    ...(isMobile ? S.heroGridMobile : null),
                  }}
                >
                  <div style={S.heroLeftCol}>
                    <div style={S.heroRailHead}>
                      <span style={S.heroRailTitle}>Briefs</span>

                      {/*
                        This select filters the lead story category.
                        It belongs with Briefs, not inside the mosaic.
                      */}
                      <select
                        value={activeDesk}
                        onChange={(e) => setActiveDesk(e.target.value)}
                        style={S.heroBriefSelect}
                        aria-label="Filter briefs by news category"
                      >
                        {deskTabs.map((tab) => (
                          <option key={tab} value={tab}>
                            {tab}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={S.heroSubStack}>
                      {leftRailStories.map((item) => (
                        <a key={item.title} href={item.href} style={S.heroSubLink}>
                          <div style={S.heroSubTag}>{item.tag}</div>
                          <div style={S.heroSubTitle}>{item.title}</div>
                        </a>
                      ))}
                    </div>
                  </div>

                  <div style={S.heroCenterCol}>
                    <div style={S.leadVisualCard}>
                      <a href={activeLead.href || "/insights"} style={S.leadVisualLink}>
                        <RaymochSignalVisual S={S} activeLead={activeLead} />
                      </a>

                      <div style={S.leadStoryTextBlock}>
                        <div style={S.heroLeadTag}>{activeLead.eyebrow || "Overview"}</div>
                        <h1 style={S.heroHeadline}>{activeLead.title}</h1>
                        {activeLead.summary ? <p style={S.heroSummary}>{activeLead.summary}</p> : null}
                      </div>

                      <div style={S.leadVisualMetaRow}>
                        <a href={activeLead.href || "/insights"} style={S.heroPrimaryLink}>
                          Open full brief
                        </a>

                        <div style={S.leadVisualControls}>
                          <button
                            type="button"
                            style={S.leadControlBtn}
                            onClick={() =>
                              setLeadIndex((i) =>
                                (i - 1 + safeLeadStories.length) % safeLeadStories.length
                              )
                            }
                            aria-label="Previous story"
                          >
                            ‹
                          </button>

                          <button
                            type="button"
                            style={S.leadControlBtn}
                            onClick={() =>
                              setLeadIndex((i) => (i + 1) % safeLeadStories.length)
                            }
                            aria-label="Next story"
                          >
                            ›
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={S.heroRightCol}>
                    <div style={S.trendingCard}>
                      <div style={S.trendingHead}>Trending now</div>

                      <div style={S.trendingList}>
                        {trendingItems.map((item) => (
                          <a key={item.title} href={item.href} style={S.trendingItem}>
                            <div style={S.trendingItemTag}>{item.tag}</div>
                            <div style={S.trendingItemTitle}>{item.title}</div>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/*
                Newswire controls the horizontal moving signal strip.
                It belongs directly under the intelligence desk because it reinforces live movement.
              */}
              <div style={S.wirePlacement}>
                <Newswire S={S} items={wireItems} />
              </div>
            </div>
          </section>
        );

      case "investmentPanel":
        return (
          <AfricaInvestmentPanel
            key={section.id}
            S={S}
            items={panelData}
            isTablet={isTablet}
            isMobile={isMobile}
          />
        );

      case "latestSignals":
        return (
          <section key={section.id} style={S.section}>
            <div style={S.wrap}>
              {/*
                Latest signals controls immediate market movement cards.
                This appears before heavier reports so users get quick signal first.
              */}
              <SectionHeader
                S={S}
                title="Latest signals"
                text="A shortlist of verified or high-value moving items worth seeing immediately."
                actionHref="/signals"
                actionLabel="View all signals"
              />

              <div
                style={{
                  ...S.newsGrid,
                  ...(isTablet ? S.newsGridTablet : null),
                  ...(isMobile ? S.newsGridMobile : null),
                }}
              >
                {news.map((item) => (
                  <a key={item.title} href={item.href} style={S.newsCard}>
                    <div style={S.tag}>{item.tag}</div>
                    <div style={S.cardTitle}>{item.title}</div>
                    <div style={S.cardMeta}>{item.meta}</div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        );

      case "featuredIntelligence":
        return (
          <SpecialReports
            key={section.id}
            S={S}
            reports={reports}
            isTablet={isTablet}
            isMobile={isMobile}
          />
        );

      case "marketResearch":
        return <MarketIntelCarousel key={section.id} S={S} intel={intel} />;

      case "platformSampler":
        return (
          <section key={section.id} style={S.section}>
            <div style={S.wrap}>
              {/*
                Platform sampler controls gateway cards into the rest of Raymoch.
                It is intentionally lower on the page so it supports the overview,
                instead of interrupting the main intelligence narrative.
              */}
              <SectionHeader
                S={S}
                title="Explore Raymoch surfaces"
                text="A curated path into the platform’s major surfaces without flattening them into one generic feed."
                actionHref="/overview"
                actionLabel="View full overview"
              />

              <div
                style={{
                  ...S.samplerGrid,
                  ...(isTablet ? S.samplerGridTablet : null),
                  ...(isMobile ? S.samplerGridMobile : null),
                }}
              >
                {samplerCards.map((card) => (
                  <a key={card.title} href={card.href} style={S.samplerCard}>
                    <div style={S.tag}>{card.label}</div>
                    <div style={S.samplerTitle}>{card.title}</div>
                    <div style={S.samplerText}>{card.text}</div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        );

      case "membershipPromo":
        return (
          <section key={section.id} style={S.sectionPromo}>
            <div style={S.wrap}>
              {/*
                WidePromoCard controls the membership/services conversion card.
                It is placed after value has been shown, not directly after the hero.
              */}
              <WidePromoCard S={S} isMobile={isMobile} />
            </div>
          </section>
        );

      case "joinRaymoch":
        return (
          <section key={section.id} style={S.sectionCtaFinal}>
            <div style={S.wrap}>
              {/*
                JoinRaymochSection controls the final conversion area:
                subscribe CTA plus premium report cards.
              */}
              <JoinRaymochSection S={S} isTablet={isTablet} isMobile={isMobile} />
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div style={S.page}>
      <HorizontalNavigation activePath="/overview" />

      <main>
        {PAGE_SEQUENCE.filter((section) => section.enabled).map(renderOverviewSection)}
      </main>

      <Footer />
    </div>
  );
}
function SignalMosaicIntro({ S, isMobile }) {
  const mosaicPieces = useMemo(() => Array.from({ length: isMobile ? 190 : 340 }), [isMobile]);

  return (
    <section style={{ ...S.signalIntro, ...(isMobile ? S.signalIntroMobile : null) }}>
      <div style={{ ...S.signalIntroBody, ...(isMobile ? S.signalIntroBodyMobile : null) }}>
        <div style={S.signalIntroText}>
          <div style={S.signalEyebrow}>
            <span style={S.signalDot} />
            Raymoch Overview
          </div>

          <h1 style={S.signalTitle}>Africa market intelligence, structured.</h1>

          <p style={S.signalText}>
            A platform snapshot for verified businesses, regional briefs, policy movement,
            capital signals, research intelligence, and trust-based discovery.
          </p>

          <div style={S.signalPillRow}>
            <span style={S.signalPill}>Verified profiles</span>
            <span style={S.signalPill}>Market signals</span>
            <span style={S.signalPill}>Reports</span>
          </div>
        </div>

        <div style={S.mosaicField} aria-hidden="true">
          {mosaicPieces.map((_, index) => (
            <span
              key={index}
              style={{
                ...S.mosaicDot,
                ...getMosaicDotStyle(index, isMobile),
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function RaymochSignalVisual({ S, activeLead }) {
  return (
    <div style={S.leadSignalVisual}>
      <div style={S.signalVisualTopRow}>
        <div>
          <div style={S.signalVisualKicker}>Raymoch intelligence desk</div>
          <div style={S.signalVisualTitle}>Market signal field</div>
        </div>
        <div style={S.signalVisualStatus}>Live</div>
      </div>

      <div style={S.signalVisualStage}>
        <div style={S.signalVisualMap} aria-hidden="true">
          {Array.from({ length: 84 }).map((_, index) => (
            <span
              key={index}
              style={{
                ...S.signalVisualPulse,
                ...getSignalVisualDotStyle(index),
              }}
            />
          ))}
        </div>

        <div style={S.signalVisualOverlayCard}>
          <div style={S.signalVisualOverlayLabel}>{activeLead.eyebrow || "Overview"}</div>
          <div style={S.signalVisualOverlayText}>Verified movement · policy shifts · sector momentum</div>
        </div>
      </div>

    </div>
  );
}

function WidePromoCard({ S, isMobile }) {
  return (
    <section style={{ ...S.widePromoCard, ...(isMobile ? S.widePromoCardMobile : null) }}>
      <div style={S.widePromoIcon}>
        <span style={S.widePromoArrow}>↗</span>
      </div>

      <div style={S.widePromoCopy}>
        <div style={S.widePromoTitle}>Sharper signals. Smarter decisions.</div>
        <div style={S.widePromoText}>
          Use Raymoch to monitor verified enterprise movement, policy changes,
          sector visibility, and market openings before they become obvious.
        </div>
      </div>

      <a href="/services" style={S.widePromoButton}>
        Explore Membership
        <span style={S.buttonArrow}>→</span>
      </a>
    </section>
  );
}

function JoinRaymochSection({ S, isTablet, isMobile }) {
  return (
    <section
      style={{
        ...S.joinSection,
        ...(isTablet ? S.joinSectionTablet : null),
        ...(isMobile ? S.joinSectionMobile : null),
      }}
    >
      <div style={S.joinCopyBlock}>
        <div style={S.joinEyebrow}>
          <span style={S.signalDot} />
          Join Raymoch
        </div>

        <h2 style={S.joinTitle}>Stay informed. Stay ahead.</h2>

        <p style={S.joinText}>
          Access daily intelligence, verified company discovery, premium reports,
          and structured market signals designed for builders, investors, and institutions.
        </p>

        <div style={S.joinButtonRow}>
          <a href="/signup" style={S.joinPrimaryButton}>
            Subscribe now
          </a>

          <a href="/services" style={S.joinSecondaryButton}>
            Explore services
          </a>
        </div>
      </div>

      <a href="/insights/africa-economic-outlook" style={S.joinFeatureCardGreen}>
        <div>
          <div style={S.joinCardLabel}>Premium report</div>
          <div style={S.joinCardTitle}>Africa Economic Outlook 2026</div>
          <div style={S.joinCardText}>
            Growth projections, sector outlooks, and policy shifts shaping the year ahead.
          </div>
        </div>
        <div>
          <div style={S.joinCardMeta}>May 2026 · 36 pages</div>
          <div style={S.joinCardArrow}>→</div>
        </div>
      </a>

      <a href="/insights/cross-border-capital-flows" style={S.joinFeatureCardRust}>
        <div>
          <div style={S.joinCardLabel}>Insight brief</div>
          <div style={S.joinCardTitle}>Cross-border capital flows</div>
          <div style={S.joinCardText}>
            Trends in investment mobility, funding patterns, and emerging corridors.
          </div>
        </div>
        <div>
          <div style={S.joinCardMeta}>May 2026 · 22 pages</div>
          <div style={S.joinCardArrow}>→</div>
        </div>
      </a>
    </section>
  );
}

function getMosaicDotStyle(index, isMobile = false) {
  const cols = isMobile ? 19 : 34;
  const rows = Math.ceil((isMobile ? 190 : 340) / cols);
  const row = Math.floor(index / cols);
  const col = index % cols;

  const x = col / Math.max(1, cols - 1);
  const y = row / Math.max(1, rows - 1);
  const seed = stableHash(`overview-mosaic-${index}-${row}-${col}`);
  const noise = (seed % 100) / 100;

  // Warm Raymoch palette: espresso, honey, bronze, oat, and restrained green.
  const palette = [
    "rgba(61,38,25,0.82)",
    "rgba(91,56,37,0.76)",
    "rgba(168,112,50,0.78)",
    "rgba(235,191,96,0.88)",
    "rgba(226,201,164,0.74)",
    "rgba(47,111,72,0.58)",
  ];

  const centerLine = 0.50 + Math.sin((x * Math.PI * 1.18) - 0.45) * 0.07;
  const halfBand = 0.20 + Math.sin(x * Math.PI) * 0.06 + x * 0.08;
  const distance = Math.abs(y - centerLine);
  const normalized = distance / Math.max(0.001, halfBand);

  // Light on the left, stronger and more structured on the right.
  const density = 0.30 + x * 0.48 + (1 - Math.min(1, normalized)) * 0.16;
  const edgeCut = normalized > 0.78 && noise < normalized * 0.24;

  if (normalized > 1.16 && noise > 0.06 + x * 0.12) return { display: "none" };
  if (noise > density || edgeCut) return { display: "none" };

  const sizeBase = isMobile ? 7 : 8.5;
  const size = sizeBase + (seed % 7) + x * (isMobile ? 5 : 9);
  const opacity = Math.max(
    0.28,
    Math.min(0.96, 0.38 + x * 0.32 + (1 - Math.min(1, normalized)) * 0.26)
  );

  const left = 4 + x * 94;
  const top = 14 + y * (isMobile ? 148 : 178) + Math.sin(index * 0.65) * 5;
  const scaleY = 0.82 + ((seed % 6) * 0.035);

  return {
    left: `${left}%`,
    top: `${top}px`,
    width: size,
    height: size,
    borderRadius: 2,
    background: palette[seed % palette.length],
    opacity,
    border: "1px solid rgba(255,255,255,0.18)",
    boxShadow: `0 6px 18px rgba(61,38,25,${0.045 + x * 0.055})`,
    transform: `translate(-50%, -50%) rotate(45deg) scaleY(${scaleY})`,
  };
}

function getSignalVisualDotStyle(index) {
  const cols = 14;
  const row = Math.floor(index / cols);
  const col = index % cols;
  const x = col / (cols - 1);
  const y = row / 5;
  const palette = [
    "rgba(235,191,96,0.82)",
    "rgba(168,112,50,0.72)",
    "rgba(47,111,72,0.64)",
    "rgba(226,201,164,0.82)",
    "rgba(255,255,255,0.72)",
  ];
  const size = [5, 7, 9, 12, 15][(index + col) % 5] * (0.72 + x * 0.45);

  return {
    left: `${8 + x * 84}%`,
    top: `${12 + y * 72 + Math.sin(index * 1.8) * 5}%`,
    width: size,
    height: size,
    background: palette[(row + col) % palette.length],
    opacity: 0.45 + x * 0.45,
  };
}

function Newswire({ S, items }) {
  return (
    <div style={S.wireOuter}>
      <div style={S.wireLabel}>Newswire</div>
      <div style={S.wireScroll}>
        {items.map((item) => (
          <a key={item.text} href={item.href} style={S.wireItem}>
            <span style={S.wireItemTag}>{item.tag}</span>
            <span>{item.text}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

function SectionHeader({ S, title, text, actionHref, actionLabel }) {
  return (
    <div style={S.sectionHeadRow}>
      <div>
        <h2 style={S.h2}>{title}</h2>
        <p style={S.p}>{text}</p>
      </div>
      <a href={actionHref} style={{ ...S.btnSmallBase, ...S.btnGhost }}>
        {actionLabel}
      </a>
    </div>
  );
}

function SpecialReports({ S, reports, isTablet, isMobile }) {
  return (
    <section style={S.sectionSurface}>
      <div style={S.wrap}>
        <div style={S.sectionHeadRow}>
          <div>
            <h2 style={S.h2}>Featured intelligence</h2>
            <p style={S.p}>Editorial depth, featured media, and a fast-scan topic rail.</p>
          </div>
          <a href="/insights" style={{ ...S.btnSmallBase, ...S.btnGhost }}>
            All reports
          </a>
        </div>

        <div
          style={{
            ...S.reportsGrid,
            ...(isTablet ? S.reportsGridTablet : null),
            ...(isMobile ? S.reportsGridMobile : null),
          }}
        >
          <div style={S.reportIntroCard}>
            <div style={S.reportIntroText}>
              A changing market requires analysis that connects capital, context,
              and growth across sectors and regions.
            </div>
          </div>

          <a href="/insights/featured" style={S.reportFeaturedCard}>
            <div style={S.reportMediaPlaceholder}>Featured image / video</div>
            <div style={S.reportCoverLabel}>Featured story</div>
            <div style={S.reportCoverTitle}>Where African growth meets credible capital</div>
            <div style={S.reportCoverText}>
              A showcase slot for the newest article, report, interview, or media-led
              story with stronger editorial presence.
            </div>
          </a>

          <div style={S.reportRail}>
            {reports.map((r, idx) => (
              <a
                key={r.title}
                href={r.href}
                style={{
                  ...S.reportRailItem,
                  borderBottom:
                    idx === reports.length - 1 ? "none" : S.reportRailItem.borderBottom,
                }}
              >
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

function MarketIntelCarousel({ S, intel }) {
  const visibleCount = SECTION_CONTROLLERS.carousel.visibleCount;
  const [index, setIndex] = useState(0);
  const visible = Array.from(
    { length: visibleCount },
    (_, i) => intel[(index + i) % intel.length]
  );

  return (
    <section style={S.sectionIntel}>
      <div style={S.wrapWideIntel}>
        <div style={S.sectionHeadRow}>
          <div>
            <h2 style={S.h2}>Market & research intelligence</h2>
            <p style={S.p}>Curated institutional research and directional signals.</p>
          </div>
          <div style={S.carouselBtnRow}>
            <button
              onClick={() => setIndex((i) => (i - 1 + intel.length) % intel.length)}
              style={S.carouselBtn}
              aria-label="Previous"
            >
              ‹
            </button>
            <button
              onClick={() => setIndex((i) => (i + 1) % intel.length)}
              style={S.carouselBtn}
              aria-label="Next"
            >
              ›
            </button>
          </div>
        </div>

        <div style={S.carouselGrid}>
          {visible.map((x, i) => {
            const isCenter = i === 1;
            return (
              <a
                key={`${x.source}-${x.title}`}
                href={x.href}
                target="_blank"
                rel="noreferrer"
                style={{ ...S.intelItemCard, ...(isCenter ? S.intelCenter : S.intelSide) }}
              >
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

function AfricaInvestmentPanel({ S, items, isTablet, isMobile }) {
  const [active, setActive] = useState(items[0]);
  const [mode, setMode] = useState("Sectors");
  const [cadence, setCadence] = useState("Today");
  const [selectedRegion, setSelectedRegion] = useState("East Africa");

  const africanCountries = items.map((item) => item.country);

  const regionOptions = [
    "East Africa",
    "West Africa",
    "North Africa",
    "Southern Africa",
    "Central Africa",
  ];

  const trackedSectorsCount = 24;

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
    activeCountry: active.country,
    selectedRegion,
    cadence,
    baseSectorLegend,
  });

  const selectedScopeLabel =
    mode === "Country" ? `${active.flag} ${active.country}` :
    mode === "Region" ? selectedRegion :
    "Africa";

  const chartTitle =
    mode === "Country"
      ? `${active.country} sector movement`
      : mode === "Region"
      ? `${selectedRegion} sector prevalence`
      : "Africa-wide sector movement";

  const chartSubtitle =
    mode === "Country"
      ? "Country mode keeps the donut sector-based and scopes the data to the selected country."
      : mode === "Region"
      ? "Region mode uses a regional intelligence pipeline to estimate which sectors are most prevalent over the selected window."
      : "Sectors mode aggregates movement across the continent and keeps every slice clickable.";

  const moversByMode = {
    Sectors: [
      { title: "Energy demand spike across East and West Africa", meta: "Sector move · Today" },
      { title: "Telecom procurement momentum accelerates continent-wide", meta: "Sector move · Weekly" },
      { title: "Finance platform expansion signals rise in major hubs", meta: "Capital move · Monthly" },
      { title: "Climate adaptation projects gain policy support", meta: "Policy move · Quarterly" },
    ],
    Country: [
      { title: `Energy buildout signals strengthening in ${active.country}`, meta: "Country scope · Today" },
      { title: `Logistics capacity rising in ${active.country}`, meta: "Country scope · Weekly" },
      { title: `Finance and payments activity broadening in ${active.country}`, meta: "Country scope · Monthly" },
      { title: `Manufacturing projects being tracked in ${active.country}`, meta: "Country scope · Quarterly" },
    ],
    Region: [
      { title: `${selectedRegion} policy signals cluster around infrastructure and energy`, meta: "Regional scope · Today" },
      { title: `${selectedRegion} logistics and trade visibility is increasing`, meta: "Regional scope · Weekly" },
      { title: `${selectedRegion} healthtech and finance mentions continue to rise`, meta: "Regional scope · Monthly" },
      { title: `${selectedRegion} sector prevalence recalculated from mixed-source intelligence`, meta: "Regional scope · Quarterly" },
    ],
  };

  const tableRows = chartLegend.slice(0, 3).map((sector, idx) => ({
    company:
      mode === "Country"
        ? `${active.country} ${sector.label} Group`
        : mode === "Region"
        ? `${selectedRegion} ${sector.label} Network`
        : `${sector.label} Continental Platform`,
    sector: sector.label,
    capex: ["$100M", "$72M", "$54M"][idx] || "$40M",
    status: idx === 1 ? "New" : "Expansion",
  }));

  return (
    <section style={S.sectionAlt}>
      <div style={S.wrap}>
        <div style={S.panel}>
          <div style={S.panelHead}>
            <div style={S.panelTitleWrap}>
              <strong style={S.panelTitle}>Investment Panel</strong>
              <span style={S.liveTag}>Live</span>
            </div>
            <div style={S.panelMeta}>Provided By Raymoch Intelligence.</div>
          </div>

          <div style={S.panelControlBar}>
            <div style={S.panelSelectGroup}>
              <label htmlFor="investment-mode-select" style={S.panelSelectLabel}>View</label>
              <select
                id="investment-mode-select"
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                style={S.panelSelect}
              >
                {["Sectors", "Country", "Region"].map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>

            <div style={S.panelSelectGroup}>
              <label htmlFor="investment-cadence-select" style={S.panelSelectLabel}>Window</label>
              <select
                id="investment-cadence-select"
                value={cadence}
                onChange={(e) => setCadence(e.target.value)}
                style={S.panelSelect}
              >
                {["Today", "Weekly", "Monthly", "Quarterly", "Yearly"].map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {mode === "Country" ? (
            <div style={S.countrySelectorRow}>
              <label htmlFor="africa-country-select" style={S.countrySelectLabel}>
                Choose country
              </label>
              <select
                id="africa-country-select"
                value={active.country}
                onChange={(e) => {
                  const next = items.find((item) => item.country === e.target.value);
                  if (next) setActive(next);
                }}
                style={S.countrySelect}
              >
                {africanCountries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          {mode === "Region" ? (
            <div style={S.countrySelectorRow}>
              <label htmlFor="africa-region-select" style={S.countrySelectLabel}>
                Choose region
              </label>
              <select
                id="africa-region-select"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                style={S.countrySelect}
              >
                {regionOptions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          <div
            style={{
              ...S.panelGrid,
              ...(isTablet ? S.panelGridTablet : null),
              ...(isMobile ? S.panelGridMobile : null),
            }}
          >
            <div style={S.panelCardLarge}>
              <div style={S.countryHead}>
                {mode} · {cadence} · {selectedScopeLabel}
              </div>

              <div style={S.panelSubMeta}>
                Tracking {trackedSectorsCount} sectors across Africa with country and regional scope controls.
              </div>

              <div style={S.largeChartShell}>
                <div style={S.largeChartTitle}>{chartTitle}</div>
                <div style={S.largeChartSubTitle}>{chartSubtitle}</div>

                <div style={S.donutWrap}>
                  <InteractiveDonutChart
                    S={S}
                    items={chartLegend}
                    centerValue={mode === "Sectors" ? null : selectedScopeLabel}
                    centerLabel={mode}
                  />
                </div>

                <div
                  style={{
                    ...S.legendGrid,
                    ...(isMobile ? S.legendGridMobile : null),
                  }}
                >
                  {chartLegend.map((item) => (
                    <a key={item.label} href={item.href} style={{ ...S.legendItem, ...S.legendButton }}>
                      <i style={{ ...S.legendSwatch, background: item.color }} />
                      {item.label} · {item.value}%
                    </a>
                  ))}
                </div>
              </div>

              <div
                style={{
                  ...S.kpiGrid,
                  ...(isTablet ? S.kpiGridTablet : null),
                  ...(isMobile ? S.kpiGridMobile : null),
                }}
              >
                <KPI S={S} label="Private companies" value={String(active.companies)} />
                <KPI S={S} label="Total CAPEX" value={active.capex} />
                <KPI S={S} label="Projects" value={String(active.projects)} />
                <KPI S={S} label="New vs. Expansion" value={active.mix} />
              </div>
            </div>

            <div style={S.panelCardSide}>
              <div style={S.tableHead}>
                <strong>Top movers</strong>
                <input placeholder="Search company / sector" style={S.tableSearch} />
              </div>

              <div style={S.feedList}>
                {moversByMode[mode].map((row) => (
                  <FeedRow key={row.title} S={S} title={row.title} meta={row.meta} />
                ))}
              </div>

              <div style={S.tableWrap}>
                <table style={S.table}>
                  <thead>
                    <tr>
                      <th style={S.th}>Company</th>
                      <th style={S.th}>Sector</th>
                      <th style={S.th}>CAPEX</th>
                      <th style={S.th}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableRows.map((row) => (
                      <tr key={`${row.company}-${row.sector}`}>
                        <td style={S.td}>{row.company}</td>
                        <td style={S.td}>{row.sector}</td>
                        <td style={S.td}>{row.capex}</td>
                        <td style={S.td}>
                          <span style={row.status === "New" ? S.statusPillSoft : S.statusPill}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InteractiveDonutChart({ S, items, centerValue, centerLabel }) {
  const size = 480;
  const strokeWidth = 108;
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const total = items.reduce((sum, item) => sum + item.value, 0);
  let running = -90;

  return (
    <div style={S.donutChartFrame}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        style={S.donutSvg}
        role="img"
        aria-label={`${centerLabel} distribution`}
      >
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={S.tokens.colors.surfaceAlt}
          strokeWidth={strokeWidth}
        />
        {items.map((item) => {
          const sweep = (item.value / total) * 360;
          const path = describeArc(cx, cy, radius, running, running + sweep);
          running += sweep;

          return (
            <a key={item.label} href={item.href} aria-label={`${item.label} ${item.value}%`}>
              <path
                d={path}
                fill="none"
                stroke={item.color}
                strokeWidth={strokeWidth}
                strokeLinecap="butt"
                style={S.donutSlice}
              >
                <title>{`${item.label} · ${item.value}%`}</title>
              </path>
            </a>
          );
        })}
      </svg>

      <div style={S.donutCenter}>
        {centerValue ? <div style={S.donutCenterValue}>{centerValue}</div> : null}
        <div style={S.donutCenterLabel}>{centerLabel}</div>
      </div>
    </div>
  );
}

function KPI({ S, label, value }) {
  return (
    <div style={S.kpi}>
      <div style={S.kpiLabel}>{label}</div>
      <div style={S.kpiValue}>{value}</div>
    </div>
  );
}

function FeedRow({ S, title, meta }) {
  return (
    <div style={S.feedRow}>
      <div style={S.feedTitle}>{title}</div>
      <div style={S.feedMeta}>{meta}</div>
    </div>
  );
}

function buildScopedSectorLegend({ mode, activeCountry, selectedRegion, cadence, baseSectorLegend }) {
  const scopeKey =
    mode === "Country" ? activeCountry :
    mode === "Region" ? selectedRegion :
    "Africa";

  const cadenceWeight =
    cadence === "Today" ? 1.06 :
    cadence === "Weekly" ? 1.03 :
    cadence === "Monthly" ? 1 :
    cadence === "Quarterly" ? 0.98 :
    0.96;

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
      href: buildSectorHref(mode, item.label, activeCountry, selectedRegion),
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

function buildSectorHref(mode, sectorLabel, activeCountry, selectedRegion) {
  const sectorSlug = slugify(sectorLabel);

  if (mode === "Country") return `/insights/countries/${slugify(activeCountry)}/sectors/${sectorSlug}`;
  if (mode === "Region") return `/insights/regions/${slugify(selectedRegion)}/sectors/${sectorSlug}`;
  return `/insights/sectors/${sectorSlug}`;
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

function makeStyles(brand, type, layout, sectionControllers) {
  const c = brand.colors;
  const reports = sectionControllers.reports;
  const carousel = sectionControllers.carousel;
  const investmentPanel = sectionControllers.investmentPanel;

  return {
    tokens: { colors: c, gradients: brand.gradients, shadows: brand.shadows, type, layout, sectionControllers },

    page: {
      background: c.surface,
      color: c.text,
      fontFamily: type.family.body,
      minHeight: "100vh",
    },

    wrap: {
      maxWidth: layout.wrapMax,
      margin: "0 auto",
      padding: `0 ${layout.wrapPadX}px`,
    },

    wrapWideIntel: {
      maxWidth: layout.wrapMax,
      margin: "0 auto",
      padding: `0 ${layout.wrapPadX}px`,
    },

    editorialShell: {
      padding: "18px 0 18px",
      background: c.surface,
      borderBottom: `1px solid ${c.border}`,
    },

    overviewDeskBar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 18,
      padding: "10px 12px",
      borderRadius: 16,
      background: "rgba(255,255,255,0.58)",
      border: `1px solid ${c.border}`,
      boxShadow: "none",
    },
    overviewDeskBarMobile: {
      flexDirection: "column",
      alignItems: "stretch",
    },
    overviewDeskLeft: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      flexWrap: "wrap",
      minWidth: 0,
    },
    overviewLiveBadge: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      height: 34,
      padding: "0 14px",
      borderRadius: 999,
      background: c.successSoft,
      color: c.success,
      fontWeight: 900,
      fontSize: 12,
      textTransform: "uppercase",
      letterSpacing: 0.7,
      border: `1px solid rgba(52,112,76,0.18)`,
    },
    overviewDeskMeta: {
      color: c.muted,
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: 0.15,
    },
    overviewDeskDot: {
      color: "rgba(99,107,114,0.45)",
      fontWeight: 800,
    },
    overviewDeskRight: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: 14,
      marginLeft: "auto",
      flexWrap: "wrap",
    },
    overviewDeskLabel: {
      color: c.brandDeep,
      fontSize: 12,
      fontWeight: 900,
      letterSpacing: 1,
      textTransform: "uppercase",
      whiteSpace: "nowrap",
    },
    overviewDeskSelect: {
      height: 38,
      minWidth: 150,
      padding: "0 38px 0 14px",
      borderRadius: 999,
      border: `1px solid ${c.borderSoft}`,
      background: c.surfaceSoft,
      color: c.brandDeep,
      fontSize: 13,
      fontWeight: 800,
      cursor: "pointer",
      outline: "none",
      boxShadow: "none",
    },

    signalIntro: {
      position: "relative",
      overflow: "hidden",
      marginTop: 22,
      borderRadius: 28,
      border: `1px solid ${c.border}`,
      background: `
        radial-gradient(circle at 84% 24%, rgba(235,191,96,0.26), transparent 24%),
        radial-gradient(circle at 70% 72%, rgba(47,111,72,0.10), transparent 26%),
        linear-gradient(135deg, rgba(255,252,246,1), rgba(246,241,232,0.98) 48%, rgba(239,229,211,0.92))
      `,
      boxShadow: "0 14px 34px rgba(31,41,51,0.07)",
    },
    signalIntroMobile: {
      borderRadius: 20,
      marginTop: 16,
    },
    signalIntroTopRow: {
      position: "absolute",
      top: 12,
      left: 24,
      right: 28,
      zIndex: 5,
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      gap: 16,
      padding: 0,
      borderBottom: "none",
      pointerEvents: "none",
    },
    signalIntroTopRowMobile: {
      position: "relative",
      top: "auto",
      left: "auto",
      right: "auto",
      flexDirection: "column",
      alignItems: "stretch",
      padding: "14px 18px 0",
      pointerEvents: "auto",
    },
    signalMetaRow: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      minWidth: 0,
      padding: "6px 0",
      pointerEvents: "auto",
    },
    signalMetaRowRight: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: 12,
      minWidth: 0,
      padding: "6px 10px 6px 13px",
      pointerEvents: "auto",
      borderRadius: 999,
      background: "rgba(255,255,255,0.58)",
      border: `1px solid rgba(110,98,88,0.14)`,
      boxShadow: "0 8px 18px rgba(31,41,51,0.035)",
      backdropFilter: "blur(8px)",
    },
    signalIntroBadge: {
      color: c.brandDeep,
      fontSize: 10,
      fontWeight: 950,
      letterSpacing: 1.6,
      textTransform: "uppercase",
      whiteSpace: "nowrap",
    },
    signalMetaText: {
      color: "rgba(71,81,89,0.78)",
      fontSize: 11.5,
      fontWeight: 800,
      letterSpacing: 0.15,
      whiteSpace: "nowrap",
    },
    signalIntroControl: {
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      pointerEvents: "auto",
    },
    signalIntroSelect: {
      height: 34,
      minWidth: 156,
      padding: "0 34px 0 12px",
      borderRadius: 10,
      border: `1px solid rgba(110,98,88,0.18)`,
      background: "rgba(255,255,255,0.74)",
      color: c.brandDeep,
      fontSize: 12.5,
      fontWeight: 800,
      cursor: "pointer",
      outline: "none",
      boxShadow: "0 4px 12px rgba(31,41,51,0.035)",
    },
    signalIntroBody: {
      position: "relative",
      minHeight: 230,
      padding: "38px 38px",
      display: "flex",
      alignItems: "center",
      isolation: "isolate",
    },
    signalIntroBodyMobile: {
      minHeight: 320,
      padding: "28px 22px 170px",
      alignItems: "flex-start",
    },
    signalIntroText: {
      position: "relative",
      zIndex: 4,
      width: "100%",
      maxWidth: 600,
      padding: "4px 0",
    },
    signalEyebrow: {
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      color: c.brand,
      fontSize: 10.5,
      fontWeight: 900,
      letterSpacing: 2.2,
      textTransform: "uppercase",
    },
    signalDot: {
      width: 7,
      height: 7,
      borderRadius: 999,
      background: c.gold,
      display: "inline-block",
      boxShadow: "0 0 0 5px rgba(235,191,96,0.12)",
      flex: "0 0 auto",
    },
    signalTitle: {
      margin: "12px 0 0",
      fontFamily: type.family.heading,
      fontSize: "clamp(34px, 3.2vw, 54px)",
      lineHeight: 1.05,
      fontWeight: 900,
      color: c.text,
      maxWidth: 660,
      letterSpacing: "-0.035em",
    },
    signalText: {
      margin: "12px 0 0",
      color: c.body,
      fontSize: 15,
      lineHeight: 1.65,
      maxWidth: 470,
    },
    mosaicField: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: "32%",
      zIndex: 1,
      overflow: "hidden",
      pointerEvents: "none",
      WebkitMaskImage: "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.28) 12%, rgba(0,0,0,0.96) 38%, rgba(0,0,0,1) 100%)",
      maskImage: "linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.28) 12%, rgba(0,0,0,0.96) 38%, rgba(0,0,0,1) 100%)",
    },
    mosaicDot: {
      position: "absolute",
      display: "block",
      transformOrigin: "center",
      transition: "transform 180ms ease, opacity 180ms ease",
    },
    widePromoCard: {
      marginTop: 18,
      minHeight: 146,
      borderRadius: 42,
      overflow: "hidden",
      border: `1px solid rgba(233,236,232,0.18)`,
      background: `
        radial-gradient(circle at 72% 28%, rgba(246, 214, 145, 0.18), transparent 24%),
        radial-gradient(circle at 92% 72%, rgba(238, 132, 10, 0.18), transparent 26%),
        linear-gradient(135deg, rgba(126, 86, 62, 0.98), rgba(91,56,37,0.94))
      `,
      color: c.white,
      display: "grid",
      gridTemplateColumns: "70px 1fr auto",
      alignItems: "center",
      gap: 18,
      padding: "38px 46px",
      boxShadow: brand.shadows.md,
    },
    widePromoCardMobile: {
      gridTemplateColumns: "1fr",
      alignItems: "start",
    },
    widePromoIcon: {
      width: 54,
      height: 54,
      borderRadius: 18,
      border: "1px solid rgba(255,255,255,0.42)",
      display: "grid",
      placeItems: "center",
      background: "rgba(255,255,255,0.08)",
    },
    widePromoArrow: {
      fontSize: 26,
      fontWeight: 900,
      lineHeight: 1,
    },
    widePromoCopy: {
      minWidth: 0,
    },
    widePromoTitle: {
      fontSize: "clamp(22px, 2vw, 30px)",
      lineHeight: 1.12,
      fontWeight: 900,
      letterSpacing: 0.1,
    },
    widePromoText: {
      marginTop: 6,
      maxWidth: 780,
      color: "rgba(255,255,255,0.84)",
      fontSize: 15,
      lineHeight: 1.55,
    },
    widePromoButton: {
      height: 46,
      padding: "0 18px",
      borderRadius: 10,
      background: c.white,
      color: c.brandDeep,
      textDecoration: "none",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      fontWeight: 900,
      whiteSpace: "nowrap",
    },
    buttonArrow: {
      fontSize: 18,
      lineHeight: 1,
    },
    joinSection: {
      marginTop: 20,
      display: "grid",
      gridTemplateColumns: "1.15fr 1fr 1fr",
      gap: 24,
      alignItems: "stretch",
      minHeight: 460,
      padding: "28px 0 6px",
    },
    joinSectionTablet: {
      gridTemplateColumns: "1fr",
    },
    joinSectionMobile: {
      gap: 16,
    },
    joinCopyBlock: {
        minHeight: 460,
        padding: "24px 18px 24px 0",
        borderRadius: 0,
        background: "transparent",
        border: "none",
        boxShadow: "none",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        },
    joinEyebrow: {
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      color: c.rust,
      fontSize: 11,
      fontWeight: 900,
      letterSpacing: 1.8,
      textTransform: "uppercase",
    },
    joinTitle: {
      margin: "12px 0 0",
      fontFamily: type.family.heading,
      color: c.text,
      fontSize: "clamp(28px, 2.6vw, 42px)",
      lineHeight: 1.12,
      fontWeight: 750,
    },
    joinText: {
      margin: "14px 0 0",
      color: c.body,
      fontSize: 16,
      lineHeight: 1.7,
    },
    joinButtonRow: {
      marginTop: 24,
      display: "flex",
      gap: 14,
      flexWrap: "wrap",
    },
    joinPrimaryButton: {
      height: 46,
      minWidth: 142,
      borderRadius: 8,
      background: c.brandDeep,
      color: c.white,
      textDecoration: "none",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 900,
      padding: "0 18px",
    },
    joinSecondaryButton: {
      height: 46,
      minWidth: 142,
      borderRadius: 8,
      background: c.white,
      color: c.brandDeep,
      textDecoration: "none",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 900,
      padding: "0 18px",
      border: `1px solid ${c.borderStrong}`,
    },
    joinFeatureCardGreen: {
      minHeight: 260,
      borderRadius: 22,
      overflow: "hidden",
      textDecoration: "none",
      color: c.white,
      padding: 28,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      boxShadow: brand.shadows.md,
      border: `1px solid rgba(255,255,255,0.12)`,
      background: `
        linear-gradient(135deg, rgba(87, 47, 4, 0.94), rgba(246, 143, 9, 0.76)),
        radial-gradient(circle at 85% 20%, rgba(235,191,96,0.28), transparent 38%)
      `,
    },
    joinFeatureCardRust: {
      minHeight: 260,
      borderRadius: 22,
      overflow: "hidden",
      textDecoration: "none",
      color: c.white,
      padding: 28,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      boxShadow: brand.shadows.md,
      border: `1px solid rgba(255,255,255,0.12)`,
      background: `
        linear-gradient(135deg, rgba(66, 26, 2, 0.83), rgba(168,112,50,0.74)),
        radial-gradient(circle at 88% 24%, rgba(241, 159, 71, 0.28), transparent 30%)
      `,
    },
    joinCardLabel: {
      color: "rgba(255,255,255,0.74)",
      fontSize: 11,
      fontWeight: 900,
      letterSpacing: 2,
      textTransform: "uppercase",
    },
    joinCardTitle: {
      marginTop: 16,
      fontFamily: type.family.heading,
      fontSize: "clamp(24px, 2vw, 34px)",
      lineHeight: 1.14,
      fontWeight: 750,
      maxWidth: 520,
    },
    joinCardText: {
      marginTop: 12,
      color: "rgba(255,255,255,0.82)",
      fontSize: 15,
      lineHeight: 1.65,
      maxWidth: 520,
    },
    joinCardMeta: {
      marginTop: 22,
      color: "rgba(255,255,255,0.72)",
      fontSize: 13,
      fontWeight: 800,
    },
    joinCardArrow: {
      marginTop: 18,
      fontSize: 30,
      fontWeight: 500,
      lineHeight: 1,
    },

    utilityBar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 14,
      flexWrap: "wrap",
      padding: "16px 18px",
      borderRadius: 18,
      background: c.surfaceSoft,
      border: `1px solid ${c.border}`,
      boxShadow: brand.shadows.sm,
    },
    utilityBarMobile: {
      alignItems: "flex-start",
      flexDirection: "column",
    },
    utilityLeft: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      flexWrap: "wrap",
    },
    utilityBadge: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "6px 12px",
      borderRadius: 999,
      background: c.successSoft,
      color: c.success,
      fontWeight: 900,
      fontSize: 12,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      border: `1px solid rgba(52,112,76,0.16)`,
    },
    utilityText: {
      color: c.body,
      fontSize: 14,
      fontWeight: 700,
    },
    utilityDot: {
      color: c.muted,
      fontWeight: 900,
    },
    utilityRight: {
      color: c.brandDeep,
      fontSize: 13,
      fontWeight: 900,
      letterSpacing: 0.5,
      textTransform: "uppercase",
    },

    deskTabsWrap: {
      marginTop: 16,
      display: "flex",
      gap: 10,
      flexWrap: "wrap",
      paddingBottom: 4,
    },
    deskTab: {
      height: 42,
      padding: "0 16px",
      borderRadius: 999,
      border: `1px solid ${c.border}`,
      background: c.white,
      color: c.brandDeep,
      fontWeight: 800,
      cursor: "pointer",
      boxShadow: brand.shadows.sm,
    },
    deskTabActive: {
      background: c.brandDeep,
      borderColor: c.brandDeep,
      color: c.white,
    },

    wireOuter: {
      marginTop: 0,
      display: "grid",
      gridTemplateColumns: "auto 1fr",
      gap: 14,
      alignItems: "center",
      borderTop: `1px solid ${c.border}`,
      borderBottom: `1px solid ${c.border}`,
      padding: "12px 0",
    },
    wireLabel: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: 96,
      height: 38,
      borderRadius: 12,
      background: c.brandDeep,
      color: c.white,
      fontSize: 13,
      fontWeight: 900,
      letterSpacing: 0.4,
      textTransform: "uppercase",
    },
    wireScroll: {
      display: "flex",
      gap: 14,
      overflowX: "auto",
      whiteSpace: "nowrap",
      paddingBottom: 2,
    },
    wireItem: {
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      textDecoration: "none",
      color: c.text,
      paddingRight: 14,
      borderRight: `1px solid ${c.border}`,
      fontWeight: 700,
    },
    wireItemTag: {
      color: c.success,
      fontSize: 12,
      fontWeight: 900,
      textTransform: "uppercase",
      letterSpacing: 0.4,
    },

    newsDeskControlBar: {
      marginTop: 18,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 18,
      padding: "14px 16px",
      borderRadius: 18,
      background: "rgba(255,255,255,0.56)",
      border: `1px solid ${c.border}`,
      boxShadow: "0 8px 20px rgba(31,41,51,0.045)",
    },
    newsDeskControlBarMobile: {
      flexDirection: "column",
      alignItems: "stretch",
      gap: 12,
    },
    newsDeskControlCopy: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      minWidth: 0,
      flexWrap: "wrap",
    },
    newsDeskControlKicker: {
      color: c.brand,
      fontSize: 11,
      fontWeight: 900,
      letterSpacing: 1.4,
      textTransform: "uppercase",
      whiteSpace: "nowrap",
    },
    newsDeskControlText: {
      color: c.muted,
      fontSize: 13,
      fontWeight: 700,
      lineHeight: 1.45,
    },
    newsDeskControlRight: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: 10,
      flex: "0 0 auto",
    },
    newsDeskControlLabel: {
      color: c.brandDeep,
      fontSize: 11,
      fontWeight: 900,
      letterSpacing: 1,
      textTransform: "uppercase",
      whiteSpace: "nowrap",
    },
    newsDeskControlSelect: {
      height: 38,
      minWidth: 170,
      padding: "0 38px 0 14px",
      borderRadius: 12,
      border: `1px solid ${c.borderSoft}`,
      background: c.white,
      color: c.brandDeep,
      fontSize: 13,
      fontWeight: 850,
      cursor: "pointer",
      outline: "none",
      boxShadow: "0 4px 12px rgba(31,41,51,0.035)",
    },

    heroSection: {
      padding: "22px 0 12px",
    },
    heroGrid: {
      display: "grid",
      gridTemplateColumns: "0.62fr 1.62fr 0.76fr",
      gap: 28,
      alignItems: "stretch",
    },
    heroGridTablet: {
      gridTemplateColumns: "1fr",
    },
    heroGridMobile: {
      gridTemplateColumns: "1fr",
      gap: 20,
    },

    heroLeftCol: {
      minWidth: 0,
      padding: "18px 18px 10px",
      borderRadius: 20,
      background: "rgba(255,255,255,0.52)",
      border: `1px solid ${c.border}`,
      boxShadow: brand.shadows.sm,
    },
    heroRailHead: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      paddingBottom: 12,
      borderBottom: `1px solid ${c.border}`,
    },
    heroRailTitle: {
      color: c.brand,
      fontSize: 12,
      fontWeight: 900,
      letterSpacing: 1.1,
      textTransform: "uppercase",
      whiteSpace: "nowrap",
    },
    heroBriefSelect: {
      height: 34,
      minWidth: 118,
      padding: "0 30px 0 11px",
      borderRadius: 10,
      border: `1px solid ${c.borderSoft}`,
      background: "rgba(255,255,255,0.78)",
      color: c.brandDeep,
      fontSize: 12.5,
      fontWeight: 850,
      outline: "none",
      cursor: "pointer",
    },
    heroLeadTag: {
      color: c.success,
      fontWeight: 900,
      fontSize: 13,
      letterSpacing: 0.5,
      textTransform: "uppercase",
    },

    heroHeadline: {
        margin: "12px 0 0",
        fontFamily: type.family.heading,
        fontSize: "clamp(30px, 2.7vw, 44px)",
        lineHeight: 1.14,
        fontWeight: 500,
        color: c.text,
        maxWidth: 820,
    },
    heroSummary: {
      marginTop: 12,
      fontSize: 16,
      lineHeight: 1.72,
      color: c.body,
      maxWidth: 820,
    },
    heroPrimaryLink: {
      display: "inline-flex",
      marginTop: 0,
      textDecoration: "none",
      color: c.brandDeep,
      fontWeight: 900,
      borderBottom: `2px solid ${c.oatDeep}`,
      paddingBottom: 4,
    },
    heroSubStack: {
      marginTop: 0,
      display: "grid",
      gap: 0,
    },
    heroSubLink: {
      display: "block",
      textDecoration: "none",
      color: c.text,
      padding: "16px 0",
      borderBottom: `1px solid ${c.border}`,
    },
    heroSubTag: {
      color: c.brand,
      fontSize: 12,
      fontWeight: 900,
      textTransform: "uppercase",
      letterSpacing: 0.4,
    },
    heroSubTitle: {
      marginTop: 8,
      fontFamily: type.family.heading,
      fontWeight: 800,
      lineHeight: 1.32,
      fontSize: "clamp(18px, 1.25vw, 24px)",
    },

    heroCenterCol: {
      minWidth: 0,
    },
    leadSignalVisual: {
      position: "relative",
      minHeight: 360,
      overflow: "hidden",
      background: `
        radial-gradient(circle at 72% 18%, rgba(235,191,96,0.30), transparent 24%),
        radial-gradient(circle at 22% 82%, rgba(47,111,72,0.20), transparent 28%),
        linear-gradient(135deg, rgba(61,38,25,0.98), rgba(91,56,37,0.94) 48%, rgba(168,112,50,0.88))
      `,
      color: c.white,
      padding: "24px 24px 22px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
    },
    signalVisualTopRow: {
      position: "relative",
      zIndex: 2,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: 18,
    },
    signalVisualKicker: {
      color: "rgba(255,255,255,0.70)",
      fontSize: 11,
      fontWeight: 900,
      letterSpacing: 1.5,
      textTransform: "uppercase",
    },
    signalVisualTitle: {
      marginTop: 8,
      fontFamily: type.family.heading,
      fontSize: "clamp(24px, 2vw, 34px)",
      lineHeight: 1.12,
      fontWeight: 800,
    },
    signalVisualStatus: {
      height: 34,
      padding: "0 14px",
      borderRadius: 999,
      background: "rgba(255,255,255,0.12)",
      border: "1px solid rgba(255,255,255,0.28)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      color: c.white,
      fontSize: 12,
      fontWeight: 900,
      textTransform: "uppercase",
      letterSpacing: 0.8,
    },
    signalVisualStage: {
      position: "relative",
      zIndex: 1,
      minHeight: 240,
      margin: "22px -4px 0",
    },
    signalVisualMap: {
      position: "absolute",
      inset: 0,
      borderRadius: 24,
      border: "1px solid rgba(255,255,255,0.14)",
      background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
      overflow: "hidden",
      WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 10%, black 92%, transparent 100%)",
      maskImage: "linear-gradient(90deg, transparent 0%, black 10%, black 92%, transparent 100%)",
    },
    signalVisualPulse: {
      position: "absolute",
      borderRadius: 2.5,
      display: "block",
      boxShadow: "0 0 22px rgba(235,191,96,0.20)",
    },
    signalVisualOverlayCard: {
      position: "absolute",
      left: 22,
      bottom: 20,
      zIndex: 2,
      maxWidth: 340,
      borderRadius: 18,
      padding: "16px 18px",
      background: "rgba(255,255,255,0.88)",
      color: c.text,
      border: "1px solid rgba(255,255,255,0.55)",
      boxShadow: "0 14px 34px rgba(31,41,51,0.18)",
      backdropFilter: "blur(10px)",
    },
    signalVisualOverlayLabel: {
      color: c.success,
      fontSize: 11,
      fontWeight: 900,
      letterSpacing: 0.8,
      textTransform: "uppercase",
    },
    signalVisualOverlayText: {
      marginTop: 8,
      color: c.text,
      fontSize: 15,
      fontWeight: 800,
      lineHeight: 1.42,
    },
    signalVisualChipRow: {
      position: "relative",
      zIndex: 2,
      display: "flex",
      gap: 10,
      flexWrap: "wrap",
    },
    signalVisualChip: {
      minHeight: 32,
      padding: "7px 11px",
      borderRadius: 999,
      background: "rgba(255,255,255,0.12)",
      border: "1px solid rgba(255,255,255,0.24)",
      color: "rgba(255,255,255,0.86)",
      fontSize: 12,
      fontWeight: 900,
      letterSpacing: 0.3,
    },

    leadVisualCard: {
      borderRadius: 24,
      border: `1px solid ${c.borderStrong}`,
      background: c.white,
      overflow: "hidden",
      boxShadow: brand.shadows.md,
    },
    leadVisualLink: {
      display: "block",
      textDecoration: "none",
    },
    leadVisualImage: {
      width: "100%",
      height: 430,
      objectFit: "cover",
      display: "block",
      background: c.surfaceAlt,
    },
    leadStoryTextBlock: {
      padding: "22px 24px 18px",
      background: c.white,
    },
    leadVisualMetaRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 14,
      padding: "14px 20px 18px",
      borderTop: `1px solid ${c.border}`,
      background: c.surfaceSoft,
    },
    leadVisualDesk: {
      color: c.brandDeep,
      fontWeight: 900,
      letterSpacing: 0.5,
      textTransform: "uppercase",
      fontSize: 12,
    },
    leadVisualControls: {
      display: "flex",
      gap: 10,
    },
    leadControlBtn: {
      width: 42,
      height: 42,
      borderRadius: 999,
      border: `1px solid ${c.border}`,
      background: c.white,
      color: c.text,
      fontSize: 22,
      fontWeight: 900,
      lineHeight: 1,
      cursor: "pointer",
      boxShadow: brand.shadows.sm,
    },

    centerAdCard: {
      marginTop: 16,
      borderRadius: 20,
      border: `1px solid ${c.borderSoft}`,
      background: `${brand.gradients.warmWash}, ${c.white}`,
      boxShadow: brand.shadows.md,
      padding: "20px 22px",
    },
    centerAdTopRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 14,
      flexWrap: "wrap",
      marginBottom: 12,
    },
    centerAdLabel: {
      color: c.brandDeep,
      fontSize: 12,
      fontWeight: 900,
      letterSpacing: 0.7,
      textTransform: "uppercase",
    },
    centerAdTag: {
      display: "inline-flex",
      alignItems: "center",
      height: 28,
      padding: "0 10px",
      borderRadius: 999,
      background: c.oat,
      color: c.brandDeep,
      fontSize: 11,
      fontWeight: 900,
      letterSpacing: 0.4,
      textTransform: "uppercase",
      border: `1px solid ${c.oatDeep}`,
    },
    centerAdTitle: {
      fontFamily: type.family.heading,
      color: c.text,
      fontSize: 24,
      fontWeight: 900,
      lineHeight: 1.25,
    },
    centerAdText: {
      marginTop: 8,
      color: c.body,
      fontSize: 15,
      lineHeight: 1.7,
      maxWidth: 760,
    },

    heroRightCol: {
      minWidth: 0,
      display: "grid",
      gap: 18,
    },
    trendingCard: {
      border: `1px solid ${c.border}`,
      borderRadius: 20,
      background: "rgba(255,255,255,0.66)",
      boxShadow: brand.shadows.sm,
      overflow: "hidden",
    },
    trendingHead: {
      background: "rgba(47,111,72,0.10)",
      color: c.success,
      padding: "16px 18px",
      fontWeight: 900,
      fontSize: 16,
      borderBottom: `1px solid rgba(47,111,72,0.16)`,
    },
    trendingList: {
      display: "grid",
    },
    trendingItem: {
      display: "block",
      textDecoration: "none",
      color: c.text,
      padding: "16px 18px",
      borderBottom: `1px solid ${c.border}`,
    },
    trendingItemTag: {
      color: c.success,
      fontSize: 12,
      fontWeight: 900,
      textTransform: "uppercase",
      letterSpacing: 0.4,
    },
    trendingItemTitle: {
      marginTop: 8,
      fontWeight: 800,
      lineHeight: 1.45,
      fontSize: 17,
    },
    adCard: {
      border: `1px solid ${c.border}`,
      borderRadius: 20,
      background: c.surfaceSoft,
      padding: 16,
      boxShadow: brand.shadows.sm,
    },
    adLabel: {
      color: c.muted,
      fontWeight: 900,
      fontSize: 12,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      marginBottom: 10,
      textAlign: "center",
    },
    adBox: {
      minHeight: 148,
      borderRadius: 16,
      background: `linear-gradient(135deg, ${c.adDark}, rgba(61,38,25,0.92))`,
      color: c.textOnDark,
      display: "grid",
      placeItems: "center",
      textAlign: "center",
      padding: 18,
      fontWeight: 800,
      lineHeight: 1.5,
    },

    section: { padding: `${layout.sectionPadY}px 0` },
    sectionSurface: { padding: `${layout.sectionPadY}px 0` },
    sectionPromo: {
      padding: "18px 0 56px",
      background: c.surface,
    },
    sectionAlt: {
      padding: `${layout.sectionPadY}px 0`,
      background: c.surfaceSoft,
      borderTop: `1px solid ${c.border}`,
      borderBottom: `1px solid ${c.border}`,
    },
    sectionIntel: {
      padding: `${layout.sectionPadY}px 0`,
      background: c.surface,
    },
    sectionCtaFinal: {
      padding: `18px 0 ${layout.sectionPadY}px`,
      background: c.surface,
    },
    wirePlacement: {
      marginTop: 8,
      opacity: 0.92,
    },

    sectionHeadRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "end",
      gap: 20,
      marginBottom: 26,
      flexWrap: "wrap",
    },

    h2: {
      margin: 0,
      fontFamily: type.family.heading,
      fontSize: type.sectionTitle.size,
      lineHeight: type.sectionTitle.line,
      fontWeight: type.sectionTitle.weight,
      color: c.text,
    },
    p: {
      marginTop: 10,
      color: c.body,
      fontSize: type.body.size,
      lineHeight: type.body.line,
      maxWidth: 760,
    },

    btnSmallBase: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: 152,
      height: 48,
      padding: "0 20px",
      borderRadius: 999,
      border: `1px solid ${c.oatDeep}`,
      textDecoration: "none",
      fontSize: 15,
      fontWeight: 800,
      whiteSpace: "nowrap",
    },
    btnGhost: {
      background: c.oat,
      color: c.brandDeep,
    },

    samplerGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
      gap: layout.gridGap,
    },
    samplerGridTablet: {
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    },
    samplerGridMobile: {
      gridTemplateColumns: "1fr",
    },
    samplerCard: {
      display: "block",
      textDecoration: "none",
      color: c.text,
      border: `1px solid ${c.border}`,
      background: c.white,
      borderRadius: 20,
      padding: 22,
      boxShadow: brand.shadows.sm,
      minHeight: 210,
    },
    samplerTitle: {
      marginTop: 14,
      fontFamily: type.family.heading,
      fontWeight: 800,
      fontSize: 24,
      lineHeight: 1.25,
    },
    samplerText: {
      marginTop: 12,
      color: c.body,
      fontSize: 16,
      lineHeight: 1.75,
    },

    newsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
      gap: layout.gridGap,
    },
    newsGridTablet: {
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    },
    newsGridMobile: {
      gridTemplateColumns: "1fr",
    },
    newsCard: {
      display: "block",
      textDecoration: "none",
      color: c.text,
      border: `1px solid ${c.border}`,
      background: c.white,
      borderRadius: 20,
      padding: 22,
      boxShadow: brand.shadows.sm,
    },
    tag: {
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
    cardTitle: {
      marginTop: 14,
      fontWeight: 900,
      lineHeight: 1.35,
      fontSize: 18,
    },
    cardMeta: {
      marginTop: 10,
      color: c.body,
      fontSize: 14,
    },

    reportsGrid: {
      display: "grid",
      gridTemplateColumns: reports.columns,
      gap: reports.gridGap,
      alignItems: "start",
    },
    reportsGridTablet: {
      gridTemplateColumns: "1fr",
    },
    reportsGridMobile: {
      gridTemplateColumns: "1fr",
    },
    reportIntroCard: {
      minHeight: reports.introMinHeight,
      borderRadius: 18,
      border: `1px solid ${c.borderSoft}`,
      background: c.surfaceSoft,
      padding: 24,
      boxShadow: brand.shadows.md,
      alignSelf: "start",
    },
    reportIntroText: {
      color: c.body,
      lineHeight: 1.9,
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
    },
    reportMediaPlaceholder: {
      height: reports.mediaHeight,
      borderRadius: 16,
      background: `linear-gradient(135deg, ${c.surfaceAlt}, ${c.oat})`,
      border: `1px solid ${c.border}`,
      display: "grid",
      placeItems: "center",
      color: c.brandDeep,
      fontWeight: 800,
      marginBottom: 18,
    },
    reportCoverLabel: {
      color: c.brand,
      fontSize: 12,
      fontWeight: 900,
      letterSpacing: 0.9,
      textTransform: "uppercase",
    },
    reportCoverTitle: {
      marginTop: 12,
      color: c.text,
      fontSize: 32,
      lineHeight: 1.16,
      fontWeight: 900,
      maxWidth: 580,
    },
    reportCoverText: {
      marginTop: 12,
      color: c.body,
      maxWidth: 580,
      lineHeight: 1.8,
    },
    reportRail: {
      border: `1px solid ${c.borderSoft}`,
      borderRadius: 18,
      background: c.white,
      overflow: "hidden",
      boxShadow: brand.shadows.md,
    },
    reportRailItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 12,
      padding: "18px 18px",
      textDecoration: "none",
      color: c.text,
      borderBottom: `1px solid ${c.border}`,
    },
    chev: {
      opacity: 0.55,
      fontSize: 24,
      lineHeight: 1,
    },

    carouselBtnRow: {
      display: "flex",
      gap: 10,
    },
    carouselBtn: {
      width: 46,
      height: 46,
      borderRadius: 999,
      border: `1px solid ${c.border}`,
      background: c.surface,
      color: c.text,
      fontSize: 22,
      fontWeight: 900,
      lineHeight: 1,
      padding: 0,
      appearance: "none",
      boxShadow: brand.shadows.md,
      cursor: "pointer",
      display: "grid",
      placeItems: "center",
    },
    carouselGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, minmax(0, auto))",
      justifyContent: "center",
      justifyItems: "stretch",
      gap: carousel.viewportGap,
      marginTop: 28,
      transition: "all 520ms cubic-bezier(.4,0,2,1)",
    },
    intelItemCard: {
      width: carousel.cardWidth,
      minHeight: carousel.cardMinHeight,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      rowGap: 14,
      padding: "22px 22px 24px",
      borderRadius: 24,
      border: `1px solid ${c.borderSoft}`,
      borderLeft: `2px solid ${c.brand}`,
      background: c.surfaceAlt,
      boxShadow: brand.shadows.lg,
      color: c.body,
      textDecoration: "none",
      transition: "all 520ms cubic-bezier(.4,0,2,1)",
    },
    intelImage: {
      width: "100%",
      height: carousel.imageHeight,
      objectFit: "cover",
      borderRadius: 14,
      marginBottom: 16,
    },
    intelSource: {
      display: "inline-flex",
      alignSelf: "flex-start",
      padding: "7px 10px",
      borderRadius: 999,
      background: "rgba(91,56,37,0.08)",
      border: "1px solid rgba(168,112,50,0.20)",
      color: c.brand,
      fontSize: 12,
      fontWeight: 900,
      letterSpacing: 0.5,
      textTransform: "uppercase",
    },
    intelItemTitle: {
      marginTop: 14,
      color: c.text,
      fontSize: 22,
      lineHeight: 1.25,
      fontWeight: 900,
    },
    intelItemText: {
      marginTop: 12,
      color: c.body,
      fontSize: type.cardBody.size,
      lineHeight: type.cardBody.line,
    },
    intelItemLink: {
      marginTop: 18,
      color: c.brand,
      fontSize: 14,
      fontWeight: 900,
    },
    intelCenter: {
      transform: "scaleY(1.08) scaleX(1.02)",
      zIndex: 3,
      boxShadow: brand.shadows.xl,
      background: `${brand.gradients.warmWash}, rgba(246,241,232,1)`,
    },
    intelSide: {
      opacity: 0.74,
      transform: "scale(0.94) translateY(8px)",
      zIndex: 1,
      boxShadow: brand.shadows.md,
    },

    panel: {
      borderRadius: 20,
      border: `1px solid ${c.borderSoft}`,
      background: c.white,
      boxShadow: brand.shadows.lg,
      padding: 20,
    },
    panelHead: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 16,
      flexWrap: "wrap",
      marginBottom: 14,
    },
    panelTitleWrap: {
      display: "flex",
      alignItems: "center",
      gap: 10,
    },
    panelTitle: {
      fontSize: 20,
      color: c.text,
    },
    panelMeta: {
      color: c.muted,
      fontSize: 13,
      fontWeight: 700,
    },
    liveTag: {
      display: "inline-block",
      background: c.brand,
      color: c.white,
      fontSize: 12,
      padding: "4px 8px",
      borderRadius: 8,
      fontWeight: 900,
    },
    panelControlBar: {
      display: "flex",
      justifyContent: "flex-end",
      gap: 12,
      flexWrap: "wrap",
      marginBottom: 16,
    },
    panelSelectGroup: {
      display: "flex",
      alignItems: "center",
      gap: 8,
    },
    panelSelectLabel: {
      color: c.muted,
      fontSize: 12,
      fontWeight: 900,
      letterSpacing: 0.7,
      textTransform: "uppercase",
    },
    panelSelect: {
      height: 40,
      minWidth: 142,
      padding: "0 36px 0 14px",
      borderRadius: 999,
      border: `1px solid ${c.borderSoft}`,
      background: c.surfaceSoft,
      color: c.brandDeep,
      fontSize: 13,
      fontWeight: 850,
      outline: "none",
      cursor: "pointer",
    },
    pillsRow: {
      display: "flex",
      gap: 10,
      flexWrap: "wrap",
    },
    countryPill: {
      padding: "9px 12px",
      borderRadius: 999,
      border: `1px solid ${c.border}`,
      background: c.surfaceSoft,
      cursor: "pointer",
      fontWeight: 800,
      color: c.brandDeep,
    },
    countryPillActive: {
      background: c.brandDeep,
      color: c.white,
      borderColor: c.brandDeep,
    },
    countrySelectorRow: {
      display: "flex",
      gap: 12,
      alignItems: "center",
      marginBottom: 16,
      flexWrap: "wrap",
    },
    countrySelectLabel: {
      color: c.body,
      fontWeight: 800,
    },
    countrySelect: {
      minWidth: 240,
      height: 44,
      borderRadius: 12,
      border: `1px solid ${c.border}`,
      background: c.white,
      padding: "0 14px",
      color: c.text,
    },

    panelGrid: {
      display: "grid",
      gridTemplateColumns: investmentPanel.columns,
      gap: layout.gridGap,
      alignItems: "start",
    },
    panelGridTablet: {
      gridTemplateColumns: "1fr",
    },
    panelGridMobile: {
      gridTemplateColumns: "1fr",
    },

    panelCardLarge: {
      border: `1px solid ${c.border}`,
      borderRadius: 20,
      padding: 20,
      background: c.surfaceSoft,
    },
    panelCardSide: {
      border: `1px solid ${c.border}`,
      borderRadius: 20,
      padding: 18,
      background: c.white,
    },
    countryHead: {
      color: c.brandDeep,
      fontWeight: 900,
      fontSize: 13,
      letterSpacing: 0.8,
      textTransform: "uppercase",
    },
    panelSubMeta: {
      marginTop: 8,
      color: c.body,
      fontSize: 14,
      lineHeight: 1.6,
    },
    largeChartShell: {
      marginTop: 18,
      border: `1px solid ${c.borderSoft}`,
      borderRadius: 18,
      background: c.white,
      padding: 20,
    },
    largeChartTitle: {
      color: c.text,
      fontSize: 28,
      lineHeight: 1.15,
      fontWeight: 900,
    },
    largeChartSubTitle: {
      marginTop: 10,
      color: c.body,
      lineHeight: 1.75,
      maxWidth: 760,
    },

    donutWrap: {
      marginTop: 24,
      display: "flex",
      justifyContent: "center",
    },
    donutChartFrame: {
      position: "relative",
      width: 420,
      height: 420,
      maxWidth: "100%",
    },
    donutSvg: {
      width: "100%",
      height: "100%",
      overflow: "visible",
    },
    donutSlice: {
      cursor: "pointer",
      transition: "opacity 160ms ease",
    },
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
    donutCenterValue: {
      fontSize: 30,
      fontWeight: 900,
      color: c.brandDeep,
      maxWidth: 170,
    },
    donutCenterLabel: {
      marginTop: 6,
      fontSize: 14,
      color: c.body,
      fontWeight: 700,
    },

    legendGrid: {
      marginTop: 22,
      display: "grid",
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      gap: 12,
    },
    legendGridMobile: {
      gridTemplateColumns: "1fr",
    },
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
    legendButton: {
      cursor: "pointer",
    },
    legendSwatch: {
      width: 12,
      height: 12,
      borderRadius: 999,
      flexShrink: 0,
    },

    kpiGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
      gap: 14,
      marginTop: 20,
    },
    kpiGridTablet: {
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    },
    kpiGridMobile: {
      gridTemplateColumns: "1fr",
    },
    kpi: {
      border: `1px solid ${c.border}`,
      borderRadius: 16,
      background: c.white,
      padding: 16,
    },
    kpiLabel: {
      color: c.muted,
      fontSize: 12,
      fontWeight: 900,
      letterSpacing: 0.7,
      textTransform: "uppercase",
    },
    kpiValue: {
      marginTop: 8,
      color: c.brandDeep,
      fontSize: 24,
      fontWeight: 900,
      lineHeight: 1.1,
    },

    tableHead: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 12,
      flexWrap: "wrap",
    },
    tableSearch: {
      height: 40,
      minWidth: 220,
      borderRadius: 12,
      border: `1px solid ${c.border}`,
      background: c.surfaceSoft,
      padding: "0 12px",
      color: c.text,
    },
    feedList: {
      marginTop: 16,
      display: "grid",
      gap: 12,
    },
    feedRow: {
      border: `1px solid ${c.border}`,
      borderRadius: 16,
      padding: 16,
      color: c.text,
      background: c.surfaceSoft,
    },
    feedTitle: {
      fontWeight: 800,
      lineHeight: 1.4,
    },
    feedMeta: {
      marginTop: 6,
      fontSize: 13,
      color: c.muted,
    },

    tableWrap: {
      marginTop: 18,
      overflowX: "auto",
      border: `1px solid ${c.borderSoft}`,
      borderRadius: 16,
      background: c.white,
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      minWidth: 520,
    },
    th: {
      textAlign: "left",
      padding: "14px 14px",
      fontSize: 12,
      letterSpacing: 0.7,
      textTransform: "uppercase",
      color: c.muted,
      borderBottom: `1px solid ${c.border}`,
      background: c.surfaceSoft,
    },
    td: {
      padding: "14px 14px",
      color: c.text,
      borderBottom: `1px solid ${c.border}`,
      fontSize: 14,
    },
    statusPill: {
      display: "inline-flex",
      padding: "6px 10px",
      borderRadius: 999,
      background: c.oat,
      color: c.brandDeep,
      fontWeight: 800,
      fontSize: 12,
    },
    statusPillSoft: {
      display: "inline-flex",
      padding: "6px 10px",
      borderRadius: 999,
      background: c.surfaceAlt,
      color: c.brand,
      fontWeight: 800,
      fontSize: 12,
    },
  };
}
