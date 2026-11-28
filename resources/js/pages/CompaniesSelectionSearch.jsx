import React, { useId, useMemo, useState } from "react";
import { Badge, BadgeCheck, BarChart3, Bookmark, Building2, Check, CircleAlert, Clock, ExternalLink, Layers3, Search, Shield, ShieldCheck, SlidersHorizontal, Sprout, Sun } from "lucide-react";
import HorizontalNavigation from "../components/HorizontalNavigation.jsx";
import CompanyDetailDialog from "../components/companies/CompanyDetailDialog.jsx";
import "../styles/companies-selection-search.css";
import "../styles/companies-selection-explorer.css";

const COUNTRY_COLORS = ["var(--atlas-clay)", "var(--atlas-gold)", "#d5ae75", "#b8805c"];
const COMPANY_COLORS = ["var(--atlas-ink)", "#3d271d", "#523627", "#6f4935"];
const clean = (value, fallback = "") => String(value ?? "").trim() || fallback;
const companyId = (company) => company.id;
const COMPANY_FILTERS = [
  { field: "industry_name", label: "Industry", fallback: "Other" },
  { field: "CTI_Tier", label: "Trust tier", fallback: "Not tiered" },
  { field: "Stage", label: "Stage", fallback: "Not specified" },
];

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
  const showTooltip = (event) => {
    let [x, y] = orbitPoint((inner + outer) / 2, (start + end) / 2)
      .split(" ").map((coordinate) => Number(coordinate) / 6.3);

    if (event.type === "mouseenter") {
      const bounds = event.currentTarget.ownerSVGElement.getBoundingClientRect();
      x = (event.clientX - bounds.left) / bounds.width * 100;
      y = (event.clientY - bounds.top) / bounds.height * 100;
    }

    onTooltip({ label, x, y });
  };

  return (
    <path
      d={orbitSlice(inner, outer, start, end)}
      fill={fill}
      role="button"
      tabIndex={0}
      aria-label={label}
      data-orbit-caption={label}
      onClick={onClick}
      onMouseEnter={showTooltip}
      onMouseLeave={() => onTooltip(null)}
      onFocus={showTooltip}
      onBlur={() => onTooltip(null)}
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
  const tiers = useMemo(() => distribute(companies, (c) => c.CTI_Tier, "Not tiered"), [companies]);
  const stages = useMemo(() => distribute(companies, (c) => c.Stage, "Not specified"), [companies]);
  const [activeView, setActiveView] = useState("tier");
  const [query, setQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const filtersId = useId();
  const filterCount = Object.values(filters).filter(Boolean).length;
  const filterOptions = useMemo(() => COMPANY_FILTERS.map(({ field, fallback }) =>
    [...new Set(companies.map((company) => clean(company[field], fallback)))]
      .sort((a, b) => a.localeCompare(b))
  ), [companies]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [tooltip, setTooltip] = useState(null);
  const [inspectSlices, setInspectSlices] = useState(false);
  const showHoverTooltip = (caption) => {
    if (!inspectSlices) setTooltip(caption);
  };
  const inspectAtPointer = (event) => {
    const chart = event.currentTarget;
    const target = document.elementFromPoint(event.clientX, event.clientY)
      ?.closest("[data-orbit-caption]");
    if (!target || !chart.contains(target)) {
      setTooltip(null);
      return;
    }

    const bounds = chart.getBoundingClientRect();
    setTooltip({
      label: target.dataset.orbitCaption,
      action: target.dataset.orbitAction,
      value: target.dataset.orbitValue,
      x: (event.clientX - bounds.left) / bounds.width * 100,
      y: (event.clientY - bounds.top) / bounds.height * 100,
    });
  };
  const [selectedCompany, setSelectedCompany] = useState(companies[0] || null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saved, setSaved] = useState(() => new Set());
  const countryCompanies = useMemo(() => {
    if (!selectedCountry) return companies;
    return companies.filter((company) => clean(company.country_name, "Unspecified country") === selectedCountry);
  }, [companies, selectedCountry]);
  const visibleCompanies = useMemo(() => {
    const term = query.trim().toLowerCase();
    return countryCompanies.filter((company) => {
      const matchesSearch = !term || [company.CompanyName, company.industry_name, company.country_name]
        .some((value) => clean(value).toLowerCase().includes(term));
      return matchesSearch && COMPANY_FILTERS.every(({ field, fallback }) =>
        !filters[field] || clean(company[field], fallback) === filters[field]
      );
    });
  }, [countryCompanies, filters, query]);
  const distribution = activeView === "tier" ? tiers : stages;
  const distributionTitle = activeView === "tier" ? "Trust Tier Distribution" : "Stage Distribution";
  const maxDistribution = Math.max(1, ...distribution.map(([, count]) => count));
  const countryGroups = useMemo(() => {
    const groups = new Map();
    for (const company of companies) {
      const country = clean(company.country_name, "Unspecified country");
      if (!groups.has(country)) groups.set(country, []);
      groups.get(country).push(company);
    }
    let offset = 0;
    return [...groups].map(([country, businesses]) => {
      const group = { country, businesses, offset };
      offset += businesses.length;
      return group;
    });
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
  const selectCountry = (country) => {
    setSelectedCountry((current) => current === country ? "" : country);
    setQuery("");
  };
  const resetSectorView = () => {
    setSelectedCountry("");
    setInspectSlices(false);
    setTooltip(null);
  };
  const selectInspectedSlice = () => {
    if (!tooltip?.action) return;
    const { action, value } = tooltip;
    if (action === "reset") {
      resetSectorView();
      return;
    }
    setInspectSlices(false);
    setTooltip(null);

    if (action === "sector") changeSector(value);
    if (action === "country") selectCountry(value);
    if (action === "company") {
      const [countryIndex, companyIndex] = value.split(":").map(Number);
      const company = countryGroups[countryIndex]?.businesses[companyIndex];
      if (company) openCompany(company);
    }
  };
  const toggleSaved = (id) => setSaved((current) => { const next = new Set(current); next.has(id) ? next.delete(id) : next.add(id); return next; });

  return <div className="atlas-page">
    <HorizontalNavigation activePath="/explore" showBreadcrumbs={false} />
    <main className="atlas-shell">
      <header className="atlas-sector atlas-page-title">
        <span><Sprout aria-hidden="true" /></span>
        <div><small>Sector</small><h1>{sectorName}</h1></div>
      </header>
      <section className="atlas-workspace">
        <section className="atlas-orbit" aria-label={`${sectorName} business map: sectors, countries, companies`}>
          <button className="atlas-inspect-control" type="button" aria-pressed={inspectSlices}
            onClick={() => {
              setInspectSlices((current) => !current);
              setTooltip(null);
            }}>
            {inspectSlices ? "Done inspecting" : "Inspect slices"}
          </button>
          {inspectSlices && (
            <>
              <button className="atlas-inspect-control" type="button" disabled={!tooltip?.action}
                onClick={selectInspectedSlice}>
                Select slice
              </button>
              <p className="atlas-inspect-hint">Touch or drag to preview, then tap Select slice.</p>
            </>
          )}
          <div className={`atlas-ring-map${inspectSlices ? " is-inspecting" : ""}`}
            onPointerDown={(event) => {
              if (!inspectSlices || !event.isPrimary || event.button !== 0) return;
              event.currentTarget.setPointerCapture(event.pointerId);
              inspectAtPointer(event);
            }}
            onPointerMove={(event) => {
              if (inspectSlices && event.currentTarget.hasPointerCapture(event.pointerId)) {
                inspectAtPointer(event);
              }
            }}
            onPointerCancel={() => { if (inspectSlices) setTooltip(null); }}
            onClickCapture={(event) => {
              if (inspectSlices && event.detail > 0) event.stopPropagation();
            }}>
            <svg viewBox="0 0 630 630" aria-label="Business rings">
              <circle cx="315" cy="315" r="309" fill="var(--atlas-line)" />
              {distinctSectors.map((item, index) => {
                const start = index / distinctSectors.length;
                const end = (index + 1) / distinctSectors.length;
                const active = String(item.id) === String(sector.id);
                return (
                  <OrbitSlice key={item.id} className="atlas-sector-slice"
                    inner={88} outer={153} start={start} end={end}
                    fill={active ? "var(--atlas-gold)" : ["#eadfd3", "#dfc7a7"][index % 2]}
                    label={item.title} aria-pressed={active}
                    data-orbit-action="sector" data-orbit-value={item.id}
                    onClick={() => changeSector(item.id)} onTooltip={showHoverTooltip}
                  />
                );
              })}
              {countryGroups.flatMap(({ country, businesses, offset }, index) => {
                if (selectedCountry && country !== selectedCountry) return [];

                const ringOffset = selectedCountry ? 0 : offset;
                const ringCount = selectedCountry ? businesses.length : companies.length;
                return businesses.map((company, companyIndex) => (
                  <OrbitSlice key={`${country}-${companyId(company)}-${companyIndex}`}
                    inner={225} outer={309}
                    start={(ringOffset + companyIndex) / ringCount}
                    end={(ringOffset + companyIndex + 1) / ringCount}
                    fill={COMPANY_COLORS[companyIndex % COMPANY_COLORS.length]}
                    label={clean(company.CompanyName, "Unnamed company")} onClick={() => openCompany(company)}
                    data-orbit-action="company" data-orbit-value={`${index}:${companyIndex}`}
                    onTooltip={showHoverTooltip}
                  />
                ));
              })}
              {countryGroups.map(({ country, businesses, offset }, index) => (
                <OrbitSlice key={country} className="atlas-country-slice" inner={153} outer={225}
                  start={offset / companies.length} end={(offset + businesses.length) / companies.length}
                  fill={COUNTRY_COLORS[index % COUNTRY_COLORS.length]}
                  label={`${country} · ${businesses.length} ${businesses.length === 1 ? "company" : "companies"}`}
                  aria-pressed={selectedCountry === country}
                  data-orbit-action="country" data-orbit-value={country}
                  onTooltip={showHoverTooltip}
                  onClick={() => selectCountry(country)}
                />
              ))}
            </svg>
            <button type="button" className="atlas-orbit-center"
              aria-label={`Reset explorer for ${sectorName}`}
              data-orbit-action="reset" data-orbit-caption={`Reset ${sectorName} view`}
              onMouseEnter={() => showHoverTooltip({ label: `Reset ${sectorName} view`, x: 50, y: 36 })}
              onMouseLeave={() => showHoverTooltip(null)}
              onClick={resetSectorView}>
              <strong>{sectorName}</strong>
            </button>
            {tooltip && (
              <div className="atlas-orbit-tooltip" role="tooltip"
                style={{ left: `${tooltip.x}%`, top: `${tooltip.y}%`, "--tooltip-shift": `${-tooltip.x}%` }}>
                {tooltip.label}
              </div>
            )}
            {inspectSlices && tooltip && (
              <span className="atlas-inspect-pointer" aria-hidden="true"
                style={{ left: `${tooltip.x}%`, top: `${tooltip.y}%` }} />
            )}
          </div>
        </section>
        <aside className="atlas-side">
          <h2 className="atlas-analysis-title">Analysis</h2>
          <div className="atlas-view-tabs" role="group" aria-label="Distribution view">{[{ id: "tier", label: "By Tier", icon: ShieldCheck }, { id: "stage", label: "By Stage", icon: Layers3 }].map(({ id, label, icon: Icon }) => <button type="button" key={id} className={activeView === id ? "is-active" : ""} aria-pressed={activeView === id} onClick={() => setActiveView(id)}><Icon />{label}</button>)}</div>
          <section className="atlas-distribution"><h2><BarChart3 />{distributionTitle}</h2><div>{distribution.slice(0, 6).map(([label, count], index) => <div className="atlas-bar" key={label}><span title={label}>{label}</span><b><i style={{ width: `${(count / maxDistribution) * 100}%`, opacity: 1 - index * .08 }} /></b><strong>{companies.length ? Math.round((count / companies.length) * 100) : 0}%</strong></div>)}</div></section>
          <section className="atlas-companies">
            <header>
              <h2 aria-live="polite"><Building2 />{selectedCountry || "Companies"} <span>({visibleCompanies.length})</span></h2>
              <label><Search aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search companies" placeholder="Search" /></label>
              <button type="button" className="atlas-filter-toggle" aria-label={filterCount ? `Filters (${filterCount} active)` : "Filters"}
                aria-expanded={filtersOpen} aria-controls={filtersId} onClick={() => setFiltersOpen((open) => !open)}>
                <SlidersHorizontal aria-hidden="true" />
                {filterCount > 0 && <span aria-hidden="true">{filterCount}</span>}
              </button>
            </header>
            <div id={filtersId} className="atlas-company-filters" hidden={!filtersOpen}>
              {COMPANY_FILTERS.map(({ field, label }, index) => (
                <label key={field}>
                  {label}
                  <select value={filters[field] || ""} onChange={(event) => {
                    const { value } = event.target;
                    setFilters((current) => ({ ...current, [field]: value }));
                  }}>
                    <option value="">Any</option>
                    {filterOptions[index].map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </label>
              ))}
              <button type="button" onClick={() => setFilters({})} disabled={!filterCount}>Clear filters</button>
            </div>
            <div className="atlas-company-list" key={selectedCountry}>{visibleCompanies.map((company, index) => { const verified = /^verified$/i.test(clean(company.VerificationStatus)); const id = companyId(company); return <article key={`${id}-${index}`} className={selectedCompany && companyId(selectedCompany) === id ? "is-selected" : ""}><span className="atlas-company-mark"><CompanyMark company={company} /></span><button type="button" className="atlas-company-name" onClick={() => openCompany(company)}><strong>{clean(company.CompanyName, "Unnamed company")}</strong><small>{clean(company.industry_name || company.sector_title, sectorName)}</small></button><span className={verified ? "atlas-status is-verified" : "atlas-status"} title={verified ? "Verified" : "Verification in progress"}>{verified ? <BadgeCheck /> : <CircleAlert />}</span><button type="button" className="atlas-profile" onClick={() => openCompany(company)}>Visit Profile <ExternalLink /></button><button type="button" className={`atlas-save${saved.has(id) ? " is-saved" : ""}`} onClick={() => toggleSaved(id)} aria-label={saved.has(id) ? "Remove bookmark" : "Bookmark company"}><Bookmark /></button></article>; })}{!visibleCompanies.length && <p className="atlas-empty">No companies match your search.</p>}</div>
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
    {dialogOpen && selectedCompany && (
      <CompanyDetailDialog
        key={companyId(selectedCompany)}
        open
        onClose={() => setDialogOpen(false)}
        company={normalizeCompany(selectedCompany)}
      />
    )}
  </div>;
}
