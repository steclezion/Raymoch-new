import React, { useMemo, useState } from "react";
import { Badge, BadgeCheck, BarChart3, Bookmark, Building2, Check, CircleAlert, Clock, ExternalLink, Layers3, Search, Shield, ShieldCheck, SlidersHorizontal, Sprout, Sun } from "lucide-react";
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
  const industries = useMemo(() => distribute(companies, (c) => c.industry_name, "Other"), [companies]);
  const tiers = useMemo(() => distribute(companies, (c) => c.CTI_Tier, "Not tiered"), [companies]);
  const stages = useMemo(() => distribute(companies, (c) => c.Stage, "Not specified"), [companies]);
  const [activeView, setActiveView] = useState("industry");
  const [query, setQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
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
    if (selectedIndustry) {
      return countryCompanies.filter((company) => clean(company.industry_name, "Other") === selectedIndustry);
    }
    const term = query.trim().toLowerCase();
    if (!term) return countryCompanies;
    return countryCompanies.filter((company) =>
      [company.CompanyName, company.industry_name, company.country_name]
        .some((value) => clean(value).toLowerCase().includes(term))
    );
  }, [countryCompanies, query, selectedIndustry]);
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
  const selectCountry = (country) => {
    setSelectedCountry((current) => current === country ? "" : country);
    setQuery("");
    setSelectedIndustry("");
  };
  const selectInspectedSlice = () => {
    if (!tooltip?.action) return;
    const { action, value } = tooltip;
    setInspectSlices(false);
    setTooltip(null);

    if (action === "sector") changeSector(value);
    if (action === "country") selectCountry(value);
    if (action === "company") {
      const [countryIndex, companyIndex] = value.split(":").map(Number);
      const company = countryGroups[countryIndex]?.[1][companyIndex];
      if (company) openCompany(company);
    }
  };
  const toggleSaved = (id) => setSaved((current) => { const next = new Set(current); next.has(id) ? next.delete(id) : next.add(id); return next; });
  const scrollToPanel = (selector) => {
    document.querySelector(selector)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  return <div className="atlas-page">
    <HorizontalNavigation activePath="/explore" showBreadcrumbs={false} />
    <main className="atlas-shell">
      <header className="atlas-sector atlas-page-title">
        <span><Sprout aria-hidden="true" /></span>
        <div><small>Sector</small><h1>{sectorName}</h1></div>
      </header>
      <section className="atlas-workspace">
        <aside className="atlas-rail">
          <nav className="atlas-sidebar-menus" aria-label="Business explorer sections">
            <details>
              <summary><Layers3 aria-hidden="true" />Industries</summary>
              <ul>
                {industries.map(([industry]) => (
                  <li key={industry}>
                    <button type="button" onClick={() => {
                      setSelectedIndustry(industry);
                      setQuery(industry);
                      scrollToPanel(".atlas-companies");
                    }}>{industry}</button>
                  </li>
                ))}
              </ul>
            </details>
            <details>
              <summary><Building2 aria-hidden="true" />Companies</summary>
              <ul>
                {countryCompanies.map((company, index) => (
                  <li key={`${companyId(company)}-${index}`}>
                    <button type="button" onClick={() => openCompany(company)}>
                      {clean(company.CompanyName, "Unnamed company")}
                    </button>
                  </li>
                ))}
              </ul>
            </details>
            <details>
              <summary><BarChart3 aria-hidden="true" />Analysis</summary>
              <ul>
                {[["industry", "Industry distribution"], ["tier", "Trust tier distribution"], ["stage", "Stage distribution"]].map(([id, label]) => (
                  <li key={id}>
                    <button type="button" onClick={() => {
                      setActiveView(id);
                      scrollToPanel(".atlas-distribution");
                    }}>{label}</button>
                  </li>
                ))}
              </ul>
            </details>
          </nav>
        </aside>
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
              <circle cx="315" cy="315" r="309" fill="#f4e3c9" />
              {distinctSectors.map((item, index) => {
                const start = index / distinctSectors.length;
                const end = (index + 1) / distinctSectors.length;
                const active = String(item.id) === String(sector.id);
                return (
                  <OrbitSlice key={item.id} className="atlas-sector-slice"
                    inner={88} outer={153} start={start} end={end}
                    fill={active ? "#ffc44b" : ["#f6dfb2", "#c38a52"][index % 2]}
                    label={item.title} aria-pressed={active}
                    data-orbit-action="sector" data-orbit-value={item.id}
                    onClick={() => changeSector(item.id)} onTooltip={showHoverTooltip}
                  />
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
                    data-orbit-action="company" data-orbit-value={`${index}:${companyIndex}`}
                    onTooltip={showHoverTooltip}
                  />
                ))
              )}
              {countryGroups.map(([country, businesses], index) => (
                <OrbitSlice key={country} className="atlas-country-slice" inner={153} outer={225}
                  start={index / countryGroups.length} end={(index + 1) / countryGroups.length}
                  fill={COLORS[4 + index % 4]}
                  label={`${country} · ${businesses.length} ${businesses.length === 1 ? "company" : "companies"}`}
                  aria-pressed={selectedCountry === country}
                  data-orbit-action="country" data-orbit-value={country}
                  onTooltip={showHoverTooltip}
                  onClick={() => selectCountry(country)}
                />
              ))}
            </svg>
            <div className="atlas-orbit-center" data-orbit-caption={sectorName}
              onMouseEnter={() => showHoverTooltip({ label: sectorName, x: 50, y: 36 })}
              onMouseLeave={() => showHoverTooltip(null)}>
              <span className="atlas-center-icon" aria-hidden="true">{clean(sector.icon, "🏢")}</span>
              <strong>{sectorName}</strong>
            </div>
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
          <div className="atlas-view-tabs" role="group" aria-label="Distribution view">{[{ id: "industry", label: "Analysis", icon: BarChart3 }, { id: "tier", label: "By Tier", icon: ShieldCheck }, { id: "stage", label: "By Stage", icon: Layers3 }].map(({ id, label, icon: Icon }) => <button type="button" key={id} className={activeView === id ? "is-active" : ""} onClick={() => setActiveView(id)}><Icon />{label}</button>)}</div>
          <section className="atlas-distribution"><h2><BarChart3 />{distributionTitle}</h2><div>{distribution.slice(0, 6).map(([label, count], index) => <div className="atlas-bar" key={label}><span title={label}>{label}</span><b><i style={{ width: `${(count / maxDistribution) * 100}%`, opacity: 1 - index * .08 }} /></b><strong>{companies.length ? Math.round((count / companies.length) * 100) : 0}%</strong></div>)}</div></section>
          <section className="atlas-companies">
            <header><h2 aria-live="polite"><Building2 />{selectedCountry || "Companies"} <span>({countryCompanies.length})</span></h2><label><Search /><input value={query} onChange={(event) => { setSelectedIndustry(""); setQuery(event.target.value); }} aria-label="Search companies" placeholder="Search" /></label><SlidersHorizontal /></header>
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
