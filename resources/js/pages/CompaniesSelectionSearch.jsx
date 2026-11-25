import React, { useMemo, useState } from "react";
import { Badge, BadgeCheck, BarChart3, Bookmark, Building2, Check, CircleAlert, Clock, ExternalLink, Globe2, Layers3, Search, Shield, ShieldCheck, SlidersHorizontal, Sprout, Sun } from "lucide-react";
import HorizontalNavigation from "../components/HorizontalNavigation.jsx";
import CompanyDetailDialog from "../components/companies/CompanyDetailDialog.jsx";
import "../styles/companies-selection-search.css";
import "../styles/companies-selection-explorer.css";

const COLORS = ["#542311", "#713016", "#8f4219", "#ad5511", "#ca6a09", "#e18a11", "#f0a92d", "#ffc44b"];
const clean = (value, fallback = "") => String(value ?? "").trim() || fallback;
const companyId = (company) => company.co_main_ref_id ?? company.id ?? company.CompanyName;

function orbitPoint(radius, turn) {
  const angle = (turn - 0.25) * 2 * Math.PI;
  return [315 + radius * Math.cos(angle), 315 + radius * Math.sin(angle)].join(" ");
}

function orbitSlice(inner, outer, start, end) {
  const middle = (start + end) / 2;
  return [
    `M ${orbitPoint(outer, start)}`,
    `A ${outer} ${outer} 0 0 1 ${orbitPoint(outer, middle)}`,
    `A ${outer} ${outer} 0 0 1 ${orbitPoint(outer, end)}`,
    `L ${orbitPoint(inner, end)}`,
    `A ${inner} ${inner} 0 0 0 ${orbitPoint(inner, middle)}`,
    `A ${inner} ${inner} 0 0 0 ${orbitPoint(inner, start)} Z`,
  ].join(" ");
}

function OrbitSlice({ inner, outer, start, end, fill, label, onClick, onTooltip, ...props }) {
  return (
    <path
      d={orbitSlice(inner, outer, start, end)}
      fill={fill}
      role="button"
      tabIndex={0}
      aria-label={label}
      onClick={onClick}
      onMouseEnter={() => onTooltip(label)}
      onMouseLeave={() => onTooltip("")}
      onFocus={() => onTooltip(label)}
      onBlur={() => onTooltip("")}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
      {...props}
    />
  );
}

function distribute(items, getter, fallback) {
  const counts = new Map();
  items.forEach((item) => { const label = clean(getter(item), fallback); counts.set(label, (counts.get(label) || 0) + 1); });
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

function normalizeCompany(company) {
  if (!company) return null;
  return { ...company, id: companyId(company), name: clean(company.CompanyName || company.name, "Unnamed company"), sector: clean(company.sector_title || company.sector), industry: clean(company.industry_name || company.industry), region: clean(company.region_name || company.region), country: clean(company.country_name || company.country), state: clean(company.state_name || company.state), city: clean(company.city_name || company.city), stage: clean(company.Stage || company.stage), verified: /^verified$/i.test(clean(company.VerificationStatus || company.verification_status)), cti: { tier: clean(company.CTI_Tier || company.cti?.tier), score: company.CTI_Score || company.cti?.score }, logo_url: company.Logo || company.logo_url || null };
}

function CompanyMark({ company }) { return /energy|power|solar|renew/i.test(clean(company.industry_name || company.sector_title)) ? <Sun /> : <Building2 />; }

export default function CompaniesSelectionSearch({ bootData }) {
  const boot = bootData || window.COMPANY_SELECTION_SEARCH_BOOT || {};
  const sector = boot.sector || {};
  const sectors = boot.sectors || [];
  const companies = boot.companies || [];
  const sectorName = clean(sector.title, "Business Sector");
  const industries = useMemo(() => distribute(companies, (c) => c.industry_name, "Other"), [companies]);
  const tiers = useMemo(() => distribute(companies, (c) => c.CTI_Tier, "Not tiered"), [companies]);
  const stages = useMemo(() => distribute(companies, (c) => c.Stage, "Not specified"), [companies]);
  const [activeView, setActiveView] = useState("industry");
  const [query, setQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [tooltip, setTooltip] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(companies[0] || null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saved, setSaved] = useState(() => new Set());
  const countryCompanies = useMemo(() => {
    if (!selectedCountry) return companies;
    return companies.filter((company) => clean(company.country_name, "Unspecified country") === selectedCountry);
  }, [companies, selectedCountry]);
  const visibleCompanies = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return countryCompanies;
    return countryCompanies.filter((company) =>
      [company.CompanyName, company.industry_name, company.country_name]
        .some((value) => clean(value).toLowerCase().includes(term))
    );
  }, [countryCompanies, query]);
  const distribution = activeView === "tier" ? tiers : activeView === "stage" ? stages : industries;
  const distributionTitle = activeView === "tier" ? "Trust Tier Distribution" : activeView === "stage" ? "Stage Distribution" : "Industry Distribution";
  const maxDistribution = Math.max(1, ...distribution.map(([, count]) => count));
  const countryGroups = useMemo(() => {
    const groups = new Map();
    for (const company of companies) {
      const country = clean(company.country_name, "Unspecified country");
      if (!groups.has(country)) groups.set(country, []);
      groups.get(country).push(company);
    }
    return [...groups];
  }, [companies]);
  const distinctSectors = useMemo(() => {
    const unique = new Map();
    for (const item of [sector, ...sectors]) {
      const title = clean(item.title);
      if (item.id != null && title && !unique.has(title.toLowerCase())) {
        unique.set(title.toLowerCase(), item);
      }
    }
    return [...unique.values()];
  }, [sector, sectors]);
  const changeSector = (id) => {
    if (id && String(id) !== String(sector.id)) {
      window.location.assign(`/companies_selection?sector_id=${encodeURIComponent(id)}`);
    }
  };
  const openCompany = (company) => { setSelectedCompany(company); setDialogOpen(true); };
  const toggleSaved = (id) => setSaved((current) => { const next = new Set(current); next.has(id) ? next.delete(id) : next.add(id); return next; });
  const navigation = [{ id: "atlas", label: "Economic Atlas", icon: Globe2 }, { id: "industries", label: "Industries", icon: Layers3 }, { id: "companies", label: "Companies", icon: Building2 }, { id: "analysis", label: "Analysis", icon: BarChart3 }];

  return <div className="atlas-page">
    <HorizontalNavigation activePath="/explore" />
    <main className="atlas-shell">
      <header className="atlas-hero">
        <div className="atlas-heading"><span>Business Discovery</span><h1>Economic Atlas</h1></div>
        <p>Explore Africa’s businesses by sector, industry, and company.<br />Discover opportunities, assess trust, and make informed connections.</p>
        <div className="atlas-stats">
          <article><Building2 /><strong>{companies.length.toLocaleString()}</strong><span>Businesses</span></article><article><Layers3 /><strong>{industries.length}</strong><span>Industries</span></article><article><ShieldCheck /><strong>{tiers.length}</strong><span>Trust tiers</span></article><article><Layers3 /><strong>{stages.length}</strong><span>Stages</span></article>
        </div>
      </header>
      <section className="atlas-workspace">
        <aside className="atlas-rail">
          <details className="atlas-rail-sections" open>
            <summary className="atlas-sector">
              <span><Sprout aria-hidden="true" /></span>
              <div><small>Sector</small><strong>{sectorName}</strong></div>
            </summary>
          <nav aria-label="Business explorer sections">{navigation.map(({ id, label, icon: Icon }) => <button key={id} type="button" className={id === "atlas" ? "is-active" : ""} onClick={() => { if (id === "industries") setActiveView("industry"); if (id === "companies") document.querySelector(".atlas-companies")?.scrollIntoView({ behavior: "smooth", block: "center" }); if (id === "analysis") document.querySelector(".atlas-distribution")?.scrollIntoView({ behavior: "smooth", block: "center" }); }}><Icon /><span>{label}</span></button>)}</nav>
          </details>
        </aside>
        <section className="atlas-orbit" aria-label={`${sectorName} business map: sectors, countries, companies`}>
          <div className="atlas-ring-map">
            <svg viewBox="0 0 630 630" aria-label="Business rings">
              <circle cx="315" cy="315" r="309" fill="#f4e3c9" />
              {distinctSectors.map((item, index) => {
                const start = index / distinctSectors.length;
                const end = (index + 1) / distinctSectors.length;
                const active = String(item.id) === String(sector.id);
                return (
                  <g key={item.id}>
                    <OrbitSlice inner={88} outer={153} start={start} end={end}
                      fill={active ? "#ffc44b" : "#efd6ad"} label={item.title} aria-pressed={active}
                      onClick={() => changeSector(item.id)} onTooltip={setTooltip}
                    />
                    <text className="atlas-sector-ring-icon" aria-hidden="true"
                      transform={`translate(${orbitPoint(121, (start + end) / 2)})`}
                      fontSize={Math.min(26, 600 / distinctSectors.length)}
                      textAnchor="middle" dominantBaseline="central">
                      {clean(item.icon, "🏢")}
                    </text>
                  </g>
                );
              })}
              {countryGroups.flatMap(([country, businesses], index) =>
                businesses.map((company, companyIndex) => (
                  <OrbitSlice key={`${country}-${companyId(company)}-${companyIndex}`}
                    inner={225} outer={309}
                    start={(index + companyIndex / businesses.length) / countryGroups.length}
                    end={(index + (companyIndex + 1) / businesses.length) / countryGroups.length}
                    fill={["#352015", "#42271b", "#4d2e20", "#563728"][companyIndex % 4]}
                    label={clean(company.CompanyName, "Unnamed company")} onClick={() => openCompany(company)}
                    onTooltip={setTooltip}
                  />
                ))
              )}
              {countryGroups.map(([country, businesses], index) => (
                <OrbitSlice key={country} className="atlas-country-slice" inner={153} outer={225}
                  start={index / countryGroups.length} end={(index + 1) / countryGroups.length}
                  fill={COLORS[4 + index % 4]}
                  label={`${country} · ${businesses.length} ${businesses.length === 1 ? "company" : "companies"}`}
                  aria-pressed={selectedCountry === country}
                  onTooltip={setTooltip}
                  onClick={() => {
                    setSelectedCountry((current) => current === country ? "" : country);
                    setQuery("");
                  }}
                />
              ))}
            </svg>
            <div className="atlas-orbit-center" onMouseEnter={() => setTooltip(sectorName)} onMouseLeave={() => setTooltip("")}>
              <span className="atlas-center-icon" aria-hidden="true">{clean(sector.icon, "🏢")}</span>
              <strong>{sectorName}</strong>
            </div>
            {tooltip && (
              <div className="atlas-orbit-tooltip" role="tooltip">
                {tooltip}
              </div>
            )}
          </div>
        </section>
        <aside className="atlas-side">
          <div className="atlas-view-tabs" role="group" aria-label="Distribution view">{[{ id: "industry", label: "By Industry", icon: Globe2 }, { id: "tier", label: "By Tier", icon: ShieldCheck }, { id: "stage", label: "By Stage", icon: Layers3 }].map(({ id, label, icon: Icon }) => <button type="button" key={id} className={activeView === id ? "is-active" : ""} onClick={() => setActiveView(id)}><Icon />{label}</button>)}</div>
          <section className="atlas-distribution"><h2><BarChart3 />{distributionTitle}</h2><div>{distribution.slice(0, 6).map(([label, count], index) => <div className="atlas-bar" key={label}><span title={label}>{label}</span><b><i style={{ width: `${(count / maxDistribution) * 100}%`, opacity: 1 - index * .08 }} /></b><strong>{companies.length ? Math.round((count / companies.length) * 100) : 0}%</strong></div>)}</div></section>
          <section className="atlas-companies">
            <header><h2 aria-live="polite"><Building2 />{selectedCountry || "Companies"} <span>({countryCompanies.length})</span></h2><label><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search companies" placeholder="Search" /></label><SlidersHorizontal /></header>
            <div className="atlas-company-list" key={selectedCountry}>{visibleCompanies.map((company, index) => { const verified = /^verified$/i.test(clean(company.VerificationStatus)); const id = companyId(company); return <article key={`${id}-${index}`} className={selectedCompany && companyId(selectedCompany) === id ? "is-selected" : ""}><span className="atlas-company-mark"><CompanyMark company={company} /></span><button type="button" className="atlas-company-name" onClick={() => setSelectedCompany(company)}><strong>{clean(company.CompanyName, "Unnamed company")}</strong><small>{clean(company.industry_name || company.sector_title, sectorName)}</small></button><span className={verified ? "atlas-status is-verified" : "atlas-status"} title={verified ? "Verified" : "Verification in progress"}>{verified ? <BadgeCheck /> : <CircleAlert />}</span><button type="button" className="atlas-profile" onClick={() => openCompany(company)}>Visit Profile <ExternalLink /></button><button type="button" className={`atlas-save${saved.has(id) ? " is-saved" : ""}`} onClick={() => toggleSaved(id)} aria-label={saved.has(id) ? "Remove bookmark" : "Bookmark company"}><Bookmark /></button></article>; })}{!visibleCompanies.length && <p className="atlas-empty">No companies match your search.</p>}</div>
            <div className="atlas-tier-legend" role="group" aria-label="Trust tier legend">
              {["Platinum", "Gold", "Bronze", "Silver"].map((tier) => (
                <span key={tier}>
                  <i className={`atlas-tier-badge is-${tier.toLowerCase()}`} aria-hidden="true">
                    <Badge /><Check />
                  </i>
                  {tier}
                </span>
              ))}
              <span><Clock aria-hidden="true" />In progress</span>
              <span><Shield aria-hidden="true" />No tier yet</span>
            </div>
          </section>
        </aside>
      </section>
    </main>
    <CompanyDetailDialog open={dialogOpen} onClose={() => setDialogOpen(false)} company={normalizeCompany(selectedCompany)} />
  </div>;
}
