import React, { useMemo, useState } from "react";
import Sunburst from "react-sunburst-chart";
import { BadgeCheck, Building2, CircleAlert, ExternalLink, Globe2, Layers3, MapPin, Search, ShieldCheck, Sprout } from "lucide-react";
import HorizontalNavigation from "../components/HorizontalNavigation.jsx";
import Footer from "../components/layout_master/Footer.jsx";
import "../styles/companies-selection-search.css";

const PALETTE = ["#9b4d0b", "#d77a16", "#efaa3b", "#6f8063", "#97a286", "#d7bd7b", "#b96431"];
const clean = (value, fallback) => String(value || "").trim() || fallback;

function distribution(items, field, fallback) {
  const counts = new Map();
  items.forEach((item) => {
    const key = clean(item[field], fallback);
    counts.set(key, (counts.get(key) || 0) + 1);
  });
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

export default function CompaniesSelectionSearch() {
  const boot = window.COMPANY_SELECTION_SEARCH_BOOT || {};
  const sector = boot.sector || {};
  const sectors = boot.sectors || [];
  const companies = boot.companies || [];
  const countries = useMemo(() => distribution(companies, "country_name", "Unspecified country"), [companies]);
  const initialCountry = countries[0]?.[0] || "";
  const [selectedCountry, setSelectedCountry] = useState(initialCountry);
  const [selectedCompany, setSelectedCompany] = useState(() => companies.find((company) => clean(company.country_name, "Unspecified country") === initialCountry) || null);
  const [query, setQuery] = useState("");

  const countryCompanies = useMemo(() => companies.filter((company) => clean(company.country_name, "Unspecified country") === selectedCountry), [companies, selectedCountry]);
  const visibleCompanies = useMemo(() => {
    const term = query.trim().toLowerCase();
    return !term ? countryCompanies : countryCompanies.filter((company) => clean(company.CompanyName, "").toLowerCase().includes(term));
  }, [countryCompanies, query]);
  const trust = useMemo(() => distribution(countryCompanies, "CTI_Tier", "Unrated"), [countryCompanies]);
  const stages = useMemo(() => distribution(countryCompanies, "Stage", "Unspecified"), [countryCompanies]);
  const maxStage = Math.max(1, ...stages.map(([, value]) => value));

  const chartData = useMemo(() => ({
    name: clean(sector.title, "Selected sector"), kind: "root",
    children: countries.map(([country, count], countryIndex) => ({
      name: country, kind: "country", count, color: PALETTE[countryIndex % PALETTE.length],
      children: sectors.map((item, sectorIndex) => ({
        name: item.title, kind: "sector", sectorId: item.id, value: Math.max(1, count / Math.max(1, sectors.length)),
        color: PALETTE[(sectorIndex + countryIndex + 2) % PALETTE.length],
      })),
    })),
  }), [countries, sector.title, sectors]);

  const onSliceClick = (node) => {
    const item = node?.data || node;
    if (item?.kind === "country") {
      setSelectedCountry(item.name);
      setSelectedCompany(companies.find((company) => clean(company.country_name, "Unspecified country") === item.name) || null);
      setQuery("");
    }
    if (item?.kind === "sector" && String(item.sectorId) !== String(sector.id)) {
      window.location.assign(`/companies_selection_search?sector_id=${encodeURIComponent(item.sectorId)}`);
    }
  };

  return <div className="selection-search-page">
    <HorizontalNavigation activePath="/explore" />
    <main className="selection-search-main">
      <nav className="selection-breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span>›</span><a href="/explore">Sectors</a><span>›</span><strong>{clean(sector.title, "Sector")}</strong><span>›</span><span>Businesses</span></nav>

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
          <div className="sunburst-legend"><span>Inner: selected sector</span><span>Middle: countries</span><span>Outer: sectors</span></div>
          <div className="sunburst-layout">
            <div className="sunburst-wrap">
              <Sunburst data={chartData} width={560} height={560} size="value" color={(node) => node.data?.color || node.color || "#f5e7d3"} strokeColor="#fffaf2" centerRadius={0.27} radiusScaleExponent={1} showLabels label={(node) => node.data?.name || node.name} tooltipTitle={(node) => node.data?.name || node.name} tooltipContent={(node) => (node.data || node).kind === "country" ? `${(node.data || node).count} businesses` : "Click to select"} onClick={onSliceClick} />
              <div className="sunburst-center"><Sprout/><strong>{clean(sector.title, "Sector")}</strong><span>{companies.length.toLocaleString()}</span></div>
            </div>
            <aside className="country-analysis">
              <div className="country-heading"><Globe2/><div><strong>{selectedCountry || "Select a country"}</strong><span>{countryCompanies.length.toLocaleString()} businesses</span></div></div>
              <h3>Trust tier</h3>{trust.map(([label, count], index) => <div className="tier-row" key={label}><i style={{background:PALETTE[index % PALETTE.length]}}/><span>{label}</span><strong>{count}</strong></div>)}
              <h3>Stage distribution</h3>{stages.map(([label, count]) => <div className="stage-row" key={label}><span>{label}</span><b><i style={{width:`${(count/maxStage)*100}%`}}/></b><strong>{count}</strong></div>)}
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
                <span className="company-mark"><Sprout/></span><span className="company-card-copy"><strong>{clean(company.CompanyName, "Unnamed company")}</strong><small>{clean(company.sector_title, sector.title)}</small><span className="company-card-pills"><b>{clean(company.Stage, "Stage unavailable")}</b></span></span>
                <span className={`verification-icon ${verified ? "is-verified" : "is-unverified"}`} title={verified ? "Verified company" : "Unverified company"}>{verified ? <BadgeCheck/> : <CircleAlert/>}</span>
              </button>;
            })}{!visibleCompanies.length && <p className="empty-companies">No matching companies in this country.</p>}</div>
          </div>

          <aside className="company-preview">
            {selectedCompany ? <>
              <div className="preview-banner"><Sprout/><span className={/^verified$/i.test(clean(selectedCompany.VerificationStatus, "")) ? "is-verified" : "is-unverified"}>{/^verified$/i.test(clean(selectedCompany.VerificationStatus, "")) ? <><BadgeCheck/> Verified profile</> : <><CircleAlert/> Unverified profile</>}</span></div>
              <h2>{clean(selectedCompany.CompanyName, "Unnamed company")}</h2>
              <p className="preview-sector">{clean(selectedCompany.sector_title, sector.title)}</p>
              <p className="preview-location"><MapPin/> {clean(selectedCompany.country_name, "Country unavailable")}</p>
              <div className="preview-pills"><b>{clean(selectedCompany.Stage, "Stage unavailable")}</b><b>CTI: {clean(selectedCompany.CTI_Tier, "Unrated")}</b></div>
              <p className="preview-description">{clean(selectedCompany.business_description || selectedCompany.Description || selectedCompany.products_or_services, "Open the full profile to review this company's complete information.")}</p>
              <dl><div><dt>Country</dt><dd>{clean(selectedCompany.country_name, "—")}</dd></div><div><dt>Industry</dt><dd>{clean(selectedCompany.industry_name, "—")}</dd></div><div><dt>Trust tier</dt><dd>{clean(selectedCompany.CTI_Tier, "Unrated")}</dd></div></dl>
              <a className="full-profile-button" href={`/company?id=${encodeURIComponent(selectedCompany.co_main_ref_id)}`}>View Full Profile <ExternalLink/></a>
            </> : <div className="preview-empty"><Building2/><p>Select a company to view its profile.</p></div>}
          </aside>
        </div>
      </section>
    </main>
    <Footer />
  </div>;
}
