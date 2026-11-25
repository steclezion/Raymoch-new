import React, { useMemo, useState } from "react";
import Sunburst from "react-sunburst-chart";
import { Badge, BadgeCheck, BarChart3, Bookmark, Building2, Check, CircleAlert, Clock, ExternalLink, Globe2, Layers3, Search, Shield, ShieldCheck, SlidersHorizontal, Sprout, Sun, Zap } from "lucide-react";
import HorizontalNavigation from "../components/HorizontalNavigation.jsx";
import CompanyDetailDialog from "../components/companies/CompanyDetailDialog.jsx";
import "../styles/companies-selection-search.css";
import "../styles/companies-selection-explorer.css";

const COLORS = ["#542311", "#713016", "#8f4219", "#ad5511", "#ca6a09", "#e18a11", "#f0a92d", "#ffc44b"];
const clean = (value, fallback = "") => String(value ?? "").trim() || fallback;
const companyId = (company) => company.co_main_ref_id ?? company.id ?? company.CompanyName;

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
  const chartData = useMemo(() => {
    const countries = new Map();
    for (const company of companies) {
      const country = clean(company.country_name, "Unspecified country");
      if (!countries.has(country)) countries.set(country, []);
      countries.get(country).push(company);
    }

    return {
      name: sectorName,
      children: [...countries].map(([country, businesses], countryIndex) => ({
        name: country,
        color: COLORS[4 + countryIndex % 4],
        count: businesses.length,
        children: businesses.map((company, index) => ({
          name: clean(company.CompanyName, "Unnamed company"),
          value: 1,
          company,
          color: COLORS[(countryIndex + index) % 4],
        })),
      })),
    };
  }, [companies, sectorName]);
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
          <div className="atlas-sector"><span><Sprout /></span><div><small>Sector</small><strong>{sectorName}</strong></div></div>
          <nav aria-label="Business explorer sections">{navigation.map(({ id, label, icon: Icon }) => <button key={id} type="button" className={id === "atlas" ? "is-active" : ""} onClick={() => { if (id === "industries") setActiveView("industry"); if (id === "companies") document.querySelector(".atlas-companies")?.scrollIntoView({ behavior: "smooth", block: "center" }); if (id === "analysis") document.querySelector(".atlas-distribution")?.scrollIntoView({ behavior: "smooth", block: "center" }); }}><Icon /><span>{label}</span></button>)}</nav>
          {sectors.length > 1 && <label className="atlas-sector-picker"><span>Change sector</span><select value={sector.id || ""} onChange={(event) => window.location.assign(`/companies_selection?sector_id=${encodeURIComponent(event.target.value)}`)}>{sectors.map((item) => <option value={item.id} key={item.id}>{item.title}</option>)}</select></label>}
        </aside>
        <section className="atlas-orbit" aria-label={`${sectorName} business map: sector, countries, companies`}>
          <Sunburst
            data={chartData}
            width={630}
            height={630}
            size="value"
            excludeRoot
            centerRadius={0.28}
            radiusScaleExponent={1}
            strokeColor="#ffd98b"
            color={(node) => node.data?.color || node.color || "#d77812"}
            showLabels
            label={(node) => node.name}
            tooltipTitle={(node) => node.data?.name || node.name}
            tooltipContent={(node) => {
              const entry = node.data || node;
              return entry.company
                ? clean(entry.company.country_name, "Unspecified country")
                : `${entry.count ?? 0} businesses`;
            }}
            onClick={(node) => {
              const entry = node?.data || node;
              if (entry?.company) openCompany(entry.company);
              if (entry?.count) {
                setSelectedCountry((current) => current === entry.name ? "" : entry.name);
                setQuery("");
              }
            }}
          />
          <div className="atlas-orbit-center"><Zap /><strong>{sectorName}</strong><span>{companies.length.toLocaleString()} businesses</span></div>
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
