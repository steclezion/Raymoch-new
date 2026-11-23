import React, { useMemo, useRef, useState } from "react";
import Sunburst from "react-sunburst-chart";
import { BadgeCheck, BookOpen, Bookmark, BriefcaseBusiness, Building2, ChevronDown, CircleAlert, Coins, Cpu, ExternalLink, Factory, Globe2, GraduationCap, Hammer, HardHat, HeartPulse, Landmark, Layers3, Leaf, MapPin, Package, Plane, Search, ShieldCheck, ShoppingBag, Sprout, Store, Sun, Truck, Users, Wheat, Wifi, Zap } from "lucide-react";
import HorizontalNavigation from "../components/HorizontalNavigation.jsx";
import Footer from "../components/layout_master/Footer.jsx";
import CompanyDetailDialog from "../components/companies/CompanyDetailDialog.jsx";
import "../styles/companies-selection-search.css";
import "../styles/companies-selection-explorer.css";

const PALETTE = ["#9b4d0b", "#d77a16", "#efaa3b", "#6f8063", "#97a286", "#d7bd7b", "#b96431"];
const TRUST_TIERS = ["Gold", "Silver", "Bronze", "Platinum"];
const STAGES = [
  "Idea / Concept", "Pre-seed", "Seed", "Pre-revenue", "Early revenue", "Startup",
  "Scale-up", "Growth", "Expansion", "Established", "Mature",
  "Turnaround / Restructuring", "Pre-IPO", "Publicly listed", "Acquired", "Merged",
  "Subsidiary", "Dormant", "Nonprofit / Mission stage",
];
const VIEW_OPTIONS = [
  { id: "country", label: "By Country", Icon: Globe2 },
  { id: "trust", label: "By Trust Tier", Icon: ShieldCheck },
  { id: "stage", label: "By Stage", Icon: Layers3 },
  { id: "location", label: "By Location", Icon: MapPin },
];
const SECTOR_VISUALS = [
  { match: /agri|farm|food|primary/i, icons: [Sprout, Wheat, Leaf], image: "/images/background/9.webp" },
  { match: /manufactur|industrial|production/i, icons: [Factory, Hammer, Package], image: "/images/background/8.webp" },
  { match: /tech|digital|telecom|software/i, icons: [Cpu, Wifi, Zap], image: "/images/background/7.webp" },
  { match: /financ|bank|insurance|invest/i, icons: [Landmark, Coins, BriefcaseBusiness], image: "/images/background/6.webp" },
  { match: /health|medical|pharma/i, icons: [HeartPulse, ShieldCheck, BadgeCheck], image: "/images/background/5.webp" },
  { match: /education|training|research/i, icons: [GraduationCap, BookOpen, Landmark], image: "/images/background/4.webp" },
  { match: /transport|logistic|travel|aviation/i, icons: [Truck, Plane, Package], image: "/images/background/3.webp" },
  { match: /energy|power|utility|renewable/i, icons: [Zap, Sun, Factory], image: "/images/background/2.webp" },
  { match: /retail|commerce|consumer|trade/i, icons: [ShoppingBag, Store, Package], image: "/images/background/1.webp" },
  { match: /construct|real estate|infrastructure/i, icons: [HardHat, Building2, Hammer], image: "/images/background/12.webp" },
];
const DEFAULT_SECTOR_VISUAL = { icons: [BriefcaseBusiness, Building2, Globe2], image: "/images/background/10.webp" };
const clean = (value, fallback) => String(value || "").trim() || fallback;

function stableIndex(value, length) {
  const hash = [...String(value || "")].reduce((total, character) => ((total * 31) + character.charCodeAt(0)) >>> 0, 0);
  return length ? hash % length : 0;
}

function sectorVisual(sectorName) {
  return SECTOR_VISUALS.find(({ match }) => match.test(clean(sectorName, ""))) || DEFAULT_SECTOR_VISUAL;
}

function CompanySectorMark({ company }) {
  const visual = sectorVisual(company.sector_title);
  const Icon = visual.icons[stableIndex(company.co_main_ref_id || company.CompanyName, visual.icons.length)];
  return <Icon aria-hidden="true" />;
}

function ctiClass(tier) {
  return `is-${clean(tier, "unrated").toLowerCase().replace(/[^a-z]+/g, "-")}`;
}

function formatRevenue(company) {
  const revenue = company.AnnualRevenueUSD ?? company.annual_revenue ?? company.revenue;
  if (revenue === null || revenue === undefined || revenue === "") return "Not disclosed";
  const numeric = Number(revenue);
  return Number.isFinite(numeric) ? `$${numeric.toLocaleString()}` : String(revenue);
}

function normalizeDialogCompany(company) {
  if (!company) return null;
  const verificationStatus = clean(company.VerificationStatus, "").toLowerCase();
  return {
    ...company,
    id: company.co_main_ref_id ?? company.id ?? null,
    name: company.CompanyName ?? company.name ?? "Unnamed company",
    sector: company.sector_title ?? company.sector ?? "",
    sector_id: company.sector_id ?? null,
    industry: company.industry_name ?? company.industry ?? "",
    industry_id: company.industry_id ?? null,
    region: company.region_name ?? company.region ?? "",
    region_id: company.region_id ?? null,
    country: company.country_name ?? company.country ?? "",
    country_id: company.country_id ?? null,
    state: company.state_name ?? company.state ?? "",
    state_id: company.state_id ?? null,
    city: company.city_name ?? company.city ?? "",
    city_id: company.city_id ?? null,
    stage: company.Stage ?? company.stage ?? "",
    verified: /\bverified\b/.test(verificationStatus),
    verification_status: verificationStatus,
    cti: {
      tier: company.CTI_Tier ?? company.cti?.tier ?? "",
      score: company.CTI_Score ?? company.cti?.score ?? "",
    },
    logo_url: company.Logo ?? company.logo_url ?? null,
  };
}

function distribution(items, field, fallback) {
  const counts = new Map();
  items.forEach((item) => {
    const key = clean(item[field], fallback);
    counts.set(key, (counts.get(key) || 0) + 1);
  });
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

export default function CompaniesSelectionSearch({ bootData }) {
  const boot = bootData || window.COMPANY_SELECTION_SEARCH_BOOT || {};
  const sector = boot.sector || {};
  const sectors = boot.sectors || [];
  const companies = boot.companies || [];
  const countries = useMemo(() => distribution(companies, "country_name", "Unspecified country"), [companies]);
  const initialCountry = countries[0]?.[0] || "";
  const [selectedCountry, setSelectedCountry] = useState(initialCountry);
  const [selectedCompany, setSelectedCompany] = useState(() => companies.find((company) => clean(company.country_name, "Unspecified country") === initialCountry) || null);
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState("country");
  const [analysisCollapsed, setAnalysisCollapsed] = useState(false);
  const [stageCollapsed, setStageCollapsed] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const sunburstWrapRef = useRef(null);
  const hoveredSliceRef = useRef(null);
  const dialogCompany = useMemo(() => normalizeDialogCompany(selectedCompany), [selectedCompany]);

  const countryCompanies = useMemo(() => companies.filter((company) => clean(company.country_name, "Unspecified country") === selectedCountry), [companies, selectedCountry]);
  const visibleCompanies = useMemo(() => {
    const term = query.trim().toLowerCase();
    return !term ? countryCompanies : countryCompanies.filter((company) => clean(company.CompanyName, "").toLowerCase().includes(term));
  }, [countryCompanies, query]);
  const trust = useMemo(() => distribution(countryCompanies, "CTI_Tier", "Unrated"), [countryCompanies]);
  const stages = useMemo(() => {
    const counts = new Map(STAGES.map((stage) => [stage.toLowerCase(), 0]));
    countryCompanies.forEach((company) => {
      const stage = clean(company.Stage, "").toLowerCase();
      if (counts.has(stage)) counts.set(stage, counts.get(stage) + 1);
    });
    return STAGES.map((stage) => [stage, counts.get(stage.toLowerCase()) || 0]);
  }, [countryCompanies]);
  const maxStage = Math.max(1, ...stages.map(([, value]) => value));
  const sectorRingRadius = 82;
  const sectorRingCircumference = 2 * Math.PI * sectorRingRadius;
  const sectorSliceLength = sectorRingCircumference / Math.max(1, sectors.length);

  const chartData = useMemo(() => {
    const companyLeaf = (company, companyIndex) => {
      const base = {
        name: clean(company.CompanyName, "Unnamed company"),
        kind: "company",
        company,
        color: PALETTE[(companyIndex + 3) % PALETTE.length],
      };

      if (viewMode === "trust") {
        const tier = TRUST_TIERS.find((item) => item.toLowerCase() === clean(company.CTI_Tier, "").toLowerCase()) || "Unrated";
        return { ...base, children: [{ name: tier, kind: "trust", value: 1, color: PALETTE[(TRUST_TIERS.indexOf(tier) + 2) % PALETTE.length] }] };
      }
      if (viewMode === "stage") {
        const stage = STAGES.find((item) => item.toLowerCase() === clean(company.Stage, "").toLowerCase()) || clean(company.Stage, "Unspecified");
        return { ...base, children: [{ name: stage, kind: "stage", value: 1, color: PALETTE[(Math.max(0, STAGES.indexOf(stage)) + 1) % PALETTE.length] }] };
      }
      if (viewMode === "location") {
        const location = clean(company.city_name || company.state_name || company.country_name, "Location unavailable");
        return { ...base, children: [{ name: location, kind: "location", value: 1, color: PALETTE[(companyIndex + 5) % PALETTE.length] }] };
      }
      return { ...base, value: 1 };
    };

    const countryNodes = countries.map(([country, count], countryIndex) => ({
      name: country,
      kind: "country",
      count,
      color: PALETTE[(countryIndex + 1) % PALETTE.length],
      children: companies
        .filter((company) => clean(company.country_name, "Unspecified country") === country)
        .map(companyLeaf),
    }));

    return { name: clean(sector.title, "Selected sector"), kind: "root", children: countryNodes };
  }, [companies, countries, sector.title, viewMode]);

  const onSliceClick = (node) => {
    const item = node?.data || node;
    if (item?.kind === "country") {
      setSelectedCountry(item.name);
      setSelectedCompany(companies.find((company) => clean(company.country_name, "Unspecified country") === item.name) || null);
      setQuery("");
    }
    if (item?.kind === "company" && item.company) setSelectedCompany(item.company);
  };

  const clearHoveredSlice = () => {
    hoveredSliceRef.current?.classList.remove("is-hovered");
    hoveredSliceRef.current = null;
    sunburstWrapRef.current?.classList.remove("is-slice-hovered");
  };

  const onSliceHover = (node, event) => {
    clearHoveredSlice();
    if (!node) return;

    const slice = event?.target?.closest?.("path");
    if (!slice || !sunburstWrapRef.current?.contains(slice)) return;

    slice.classList.add("is-hovered");
    hoveredSliceRef.current = slice;
    sunburstWrapRef.current.classList.add("is-slice-hovered");
  };

  const tooltipDetails = (node) => {
    const item = node?.data || node || {};
    if (item.kind === "country") return `${item.count || 0} businesses in this country`;
    if (item.kind === "company") return `${clean(item.company?.country_name, "Country unavailable")} · ${clean(item.company?.Stage, "Stage unavailable")}`;
    if (item.kind === "trust") return "Trust tier";
    if (item.kind === "stage") return "Business stage";
    if (item.kind === "location") return "Business location";
    return "Selected sector";
  };

  return <div className="selection-search-page">
    <HorizontalNavigation
      activePath="/explore"
      breadcrumbs={[
        { label: "Home", href: "/home" },
        { label: "Sectors", href: "/explore" },
        { label: clean(sector.title, "Sector"), href: `/companies_selection?sector_id=${encodeURIComponent(sector.id || "")}` },
        { label: "Businesses" },
      ]}
    />
    <main className="selection-search-main">
      <header className="selection-hero">
        <div className="selection-title"><span><Sprout /></span><div><h1>{clean(sector.title, "Business Sector")}</h1><p>Explore businesses by country, trust tier, and stage.</p></div></div>
        <div className="selection-stats">
          <article><Building2/><strong>{companies.length.toLocaleString()}</strong><span>Businesses</span></article>
          <article><Globe2/><strong>{countries.length}</strong><span>Countries</span></article>
          <article><ShieldCheck/><strong>{trust.length}</strong><span>Trust tiers</span></article>
          <article><Layers3/><strong>{stages.length}</strong><span>Stages</span></article>
        </div>
      </header>

      <section className="selection-workspace">
        <div className="sunburst-card">
          <div className="sunburst-view-options" role="group" aria-label="Group chart by">
            {VIEW_OPTIONS.map(({ id, label, Icon }) => <button key={id} type="button" className={viewMode === id ? "is-active" : ""} aria-pressed={viewMode === id} onClick={() => setViewMode(id)}><Icon aria-hidden="true"/><span>{label}</span></button>)}
          </div>
          <div className={`sunburst-layout${analysisCollapsed ? " is-analysis-collapsed" : ""}`}>
            <div className="sunburst-wrap" ref={sunburstWrapRef} onMouseLeave={clearHoveredSlice}>
              <Sunburst data={chartData} width={470} height={470} size="value" color={(node) => node.data?.color || node.color || "#f5e7d3"} strokeColor="#fffaf2" centerRadius={0.42} radiusScaleExponent={1} showLabels label={(node) => node.data?.name || node.name} tooltipTitle={(node) => node.data?.name || node.name} tooltipContent={tooltipDetails} onHover={onSliceHover} onClick={onSliceClick} />
              <svg className="sector-ring" viewBox="0 0 470 470" aria-label="All sectors, evenly distributed">
                <g transform="translate(235 235) rotate(-90)">
                  {sectors.map((item, index) => {
                    const isSelected = String(item.id) === String(sector.id);
                    return <circle
                      key={item.id}
                      className={isSelected ? "is-selected" : ""}
                      r={sectorRingRadius}
                      cx="0"
                      cy="0"
                      fill="none"
                      stroke={PALETTE[index % PALETTE.length]}
                      strokeWidth="32"
                      strokeDasharray={`${Math.max(0, sectorSliceLength - 2)} ${sectorRingCircumference - sectorSliceLength + 2}`}
                      strokeDashoffset={-index * sectorSliceLength}
                      tabIndex="0"
                      role="button"
                      aria-label={`${item.title}${isSelected ? ", selected sector" : ""}`}
                      onClick={() => {
                        if (!isSelected) window.location.assign(`/companies_selection?sector_id=${encodeURIComponent(item.id)}`);
                      }}
                      onKeyDown={(event) => {
                        if (!isSelected && (event.key === "Enter" || event.key === " ")) {
                          event.preventDefault();
                          window.location.assign(`/companies_selection?sector_id=${encodeURIComponent(item.id)}`);
                        }
                      }}
                    ><title>{item.title}</title></circle>;
                  })}
                </g>
              </svg>
              <div className="sunburst-center"><Sprout/><strong>{clean(sector.title, "Sector")}</strong><span>{companies.length.toLocaleString()}</span></div>
            </div>
            <aside className={`country-analysis${analysisCollapsed ? " is-collapsed" : ""}`}>
              <div className="country-heading"><Globe2/><div><strong>{selectedCountry || "Select a country"}</strong><span>{countryCompanies.length.toLocaleString()} businesses · {companies.length ? ((countryCompanies.length / companies.length) * 100).toFixed(1) : 0}%</span></div><button type="button" className="analysis-toggle" onClick={() => setAnalysisCollapsed((collapsed) => !collapsed)} aria-expanded={!analysisCollapsed} aria-label={analysisCollapsed ? "Expand country information" : "Collapse country information"}><ChevronDown aria-hidden="true"/></button></div>
              {!analysisCollapsed ? <div className="country-analysis-content">
                <h3>Trust tier</h3>{trust.map(([label, count], index) => <div className="tier-row" key={label}><i style={{background:PALETTE[index % PALETTE.length]}}/><span>{label}</span><strong>{count}</strong></div>)}
                <section className="stage-distribution">
                  <button type="button" className="stage-toggle" onClick={() => setStageCollapsed((collapsed) => !collapsed)} aria-expanded={!stageCollapsed}><span>Stage distribution</span><ChevronDown aria-hidden="true"/></button>
                  {!stageCollapsed ? <div className="stage-distribution-rows">{stages.map(([label, count]) => <div className="stage-row" key={label}><span>{label}</span><b><i style={{width:`${(count/maxStage)*100}%`}}/></b><strong>{count}</strong></div>)}</div> : null}
                </section>
              </div> : null}
            </aside>
          </div>
        </div>

        <div className="business-browser">
          <div className="business-list-card">
            <div className="list-heading"><div><span>Businesses in</span><h2>{selectedCountry || "Select a country"}</h2></div><em>{countryCompanies.length} companies</em></div>
            <label className="company-search"><Search/><input value={query} onChange={(event)=>setQuery(event.target.value)} placeholder={`Search in ${selectedCountry || "country"}…`} /></label>
            <div className="selection-company-list">{visibleCompanies.map((company, index) => {
              const verified = /^verified$/i.test(clean(company.VerificationStatus, ""));
              const active = selectedCompany?.co_main_ref_id === company.co_main_ref_id;
              return <button type="button" className={`selection-company-card${active ? " is-active" : ""}`} onClick={() => setSelectedCompany(company)} key={`${company.co_main_ref_id || company.CompanyName}-${index}`}>
                <span className="company-mark"><CompanySectorMark company={company}/></span><span className="company-card-copy"><strong>{clean(company.CompanyName, "Unnamed company")}</strong><small>{clean(company.sector_title, sector.title)} <i>•</i> {clean(company.city_name || company.state_name, clean(company.country_name, "Location unavailable"))}</small><span className="company-card-pills"><b className="stage-pill">{clean(company.Stage, "Stage unavailable")}</b><b className={`cti-pill ${ctiClass(company.CTI_Tier)}`}>CTI: {clean(company.CTI_Tier, "Unrated")}</b></span></span>
                <span className="company-card-status" title={verified ? "Verified company" : "Save company"}>{verified ? <BadgeCheck/> : <Bookmark/>}</span>
              </button>;
            })}{!visibleCompanies.length && <p className="empty-companies">No matching companies in this country.</p>}</div>
          </div>

          <aside className="company-preview">
            {selectedCompany ? <>
              <div className="preview-banner"><img src={sectorVisual(selectedCompany.sector_title).image} alt=""/><span className={/^verified$/i.test(clean(selectedCompany.VerificationStatus, "")) ? "is-verified" : "is-unverified"}>{/^verified$/i.test(clean(selectedCompany.VerificationStatus, "")) ? <><BadgeCheck/> Verified profile</> : <><CircleAlert/> Unverified profile</>}</span></div>
              <h2>{clean(selectedCompany.CompanyName, "Unnamed company")}</h2>
              <p className="preview-sector">{clean(selectedCompany.sector_title, sector.title)}</p>
              <p className="preview-location"><MapPin/> {clean([selectedCompany.city_name || selectedCompany.state_name, selectedCompany.country_name].filter(Boolean).join(", "), "Location unavailable")}</p>
              <div className="preview-pills"><b className="stage-pill">{clean(selectedCompany.Stage, "Stage unavailable")}</b><b className={`cti-pill ${ctiClass(selectedCompany.CTI_Tier)}`}>CTI: {clean(selectedCompany.CTI_Tier, "Unrated")}</b></div>
              <p className="preview-description">{clean(selectedCompany.business_description || selectedCompany.Description || selectedCompany.products_or_services, "Open the full profile to review this company's complete information.")}</p>
              <dl><div><dt><Users/> Employees</dt><dd>{clean(selectedCompany.number_of_employees || selectedCompany.employee_count, "Not disclosed")}</dd></div><div><dt><Coins/> Revenue</dt><dd>{formatRevenue(selectedCompany)}</dd></div><div><dt><Globe2/> Markets</dt><dd>{clean(selectedCompany.market_scope || selectedCompany.country_name, "Not disclosed")}</dd></div></dl>
              <button className="full-profile-button" type="button" onClick={() => setDetailDialogOpen(true)}>View Full Profile <ExternalLink/></button>
            </> : <div className="preview-empty"><Building2/><p>Select a company to view its profile.</p></div>}
          </aside>
        </div>
      </section>
    </main>
    <Footer />
    <CompanyDetailDialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} company={dialogCompany} />
  </div>;
}
