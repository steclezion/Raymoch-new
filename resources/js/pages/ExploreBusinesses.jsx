import React, { useEffect, useMemo, useState } from "react";
import { BriefcaseBusiness, Search } from "lucide-react";

// Split components
import TopSearchPanel from "../pages/explore/TopSearchPanel.jsx";
import MainPanel from "../pages/explore/Main_panel.jsx";
import HorizontalNavigation from "../components/HorizontalNavigation.jsx";
import Footer from "../components/layout_master/Footer.jsx";
import { ResponsiveController } from "../components/ResponsiveController.jsx";
import "../styles/ExploreBusinesses.css";



async function fetchJson(url) {
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      credentials: "same-origin",
    });

    if (!res.ok) {
      return { data: [] };
    }

    return await res.json();
  } catch {
    return { data: [] };
  }
}

export default function ExploreBusinesses() {
  const [q, setQ] = useState("");
  const [regions, setRegions] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [industries, setIndustries] = useState([]);

  const [region, setRegion] = useState("all");
  const [country, setCountry] = useState("all");
  const [stateItem, setStateItem] = useState("");
  const [city, setCity] = useState("");
  const [sector, setSector] = useState("");
  const [industry, setIndustry] = useState("");
  const [verified, setVerified] = useState(false);

  const [gridQuery, setGridQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [loading, setLoading] = useState(true);

  const selectedSectorObject = useMemo(() => {
    if (!sector) return null;

    return sectors.find(
      (s) =>
        String(s.id) === String(sector) ||
        String(s.code) === String(sector) ||
        String(s.title) === String(sector) ||
        String(s.name) === String(sector)
    );
  }, [sector, sectors]);

  useEffect(() => {
    (async () => {
      try {
        const [regionRes, countryRes, sectorRes, industryRes] = await Promise.all([
          fetchJson("/api/regions"),
          fetchJson("/api/countries-africans"),
          fetchJson("/api/sectors"),
          fetchJson("/api/industries"),
        ]);

        setRegions(regionRes?.data ?? []);
        setCountries(countryRes?.data ?? []);
        setSectors(sectorRes?.data ?? []);
        setIndustries(industryRes?.data ?? []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const fetchCountries = async () => {
      if (!region || region === "all") {
        const res = await fetchJson("/api/countries-africans");
        setCountries(res?.data ?? []);
        return;
      }

      const res = await fetchJson(
        `/api/countries-africans?region_id=${encodeURIComponent(region)}`
      );
      setCountries(res?.data ?? []);
    };

    setStateItem("");
    setCity("");
    setStates([]);
    setCities([]);

    fetchCountries();
  }, [region]);

  useEffect(() => {
    const fetchStates = async () => {
      if (!country || country === "all") {
        setStates([]);
        return;
      }

      const res = await fetchJson(
        `/api/states-all?countries_all_id=${encodeURIComponent(country)}`
      );
      setStates(res?.data ?? []);
    };

    setStateItem("");
    setCity("");
    setCities([]);
    fetchStates();
  }, [country]);

  useEffect(() => {
    const fetchCities = async () => {
      if (!stateItem || stateItem === "all") {
        setCities([]);
        return;
      }

      const res = await fetchJson(
        `/api/cities-all?state_id=${encodeURIComponent(stateItem)}`
      );
      setCities(res?.data ?? []);
    };

    setCity("");
    fetchCities();
  }, [stateItem]);

  useEffect(() => {
    const fetchIndustries = async () => {
      if (!selectedSectorObject?.id) {
        const res = await fetchJson("/api/industries");
        setIndustries(res?.data ?? []);
        return;
      }

      const res = await fetchJson(
        `/api/industries?sector_id=${encodeURIComponent(selectedSectorObject.id)}`
      );
      setIndustries(res?.data ?? []);
    };

    setIndustry("");
    fetchIndustries();
  }, [selectedSectorObject]);

  const handleCountryFirstSelection = async (countryId) => {
    if (!countryId || countryId === "all") {
      return;
    }

    const res = await fetchJson(
      `/api/country-region?country_id=${encodeURIComponent(countryId)}`
    );

    if (res?.ok && res?.data?.region_id) {
      setRegion(String(res.data.region_id));
    }
  };

  useEffect(() => {
    setPage(1);
  }, [gridQuery, sector, industries.length, sectors.length]);

  const onSearch = (payload) => {
    const p = new URLSearchParams();

    if (payload?.q) p.set("q", payload.q);
    if (payload?.region && payload.region !== "all") {
      p.set("region_id", payload.region);
    }
    if (payload?.country && payload.country !== "all") {
      p.set("country_id", payload.country);
    }
    if (payload?.stateItem && payload.stateItem !== "all") {
      p.set("state_id", payload.stateItem);
    }
    if (payload?.city && payload.city !== "all") {
      p.set("city_id", payload.city);
    }
    if (payload?.sector) p.set("sector_id", payload.sector);
    if (payload?.industry) p.set("industry_id", payload.industry);
    if (payload?.verified) p.set("verified", "1");

    window.location.assign(`/companies?${p.toString()}`);
  };

  const activeSectorName =
    selectedSectorObject?.title ||
    selectedSectorObject?.name ||
    selectedSectorObject?.label ||
    "";

  return (
    <ResponsiveController>
      <div className="dashboard-shell precisely-dashboard">
        <HorizontalNavigation activePath="/explore" />

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="dashboard-heading">
            <p>Company discovery workspace</p>
            <h1>Businesses</h1>
          </div>

          <div className="topbar-actions">
            <form className="topbar-search" action="/companies" role="search">
              <Search size={17} aria-hidden="true" />
              <label className="sr-only" htmlFor="topbar-company-search">
                Search companies
              </label>
              <input
                id="topbar-company-search"
                name="q"
                type="search"
                placeholder="Search companies…"
              />
            </form>
{null}
          </div>
        </header>
{/* 
        <section className="dashboard-hero" aria-labelledby="explore-title">
          <div className="hero-copy">
            <span className="hero-kicker"><Globe2 size={15} /> African business intelligence</span>
            <h2 id="explore-title">Explore Businesses</h2>
            <p>
              Search verified companies by geography, sector, industry, and trust
              status. Refine the market and move directly to the right opportunities.
            </p>
          </div>
          <div className="hero-count">
            <strong>12,400+</strong>
            <span>companies tracked</span>
          </div>
        </section> */}

        <div className="dashboard-content">
          {/* <section className="dashboard-panel breadcrumbs-panel" aria-label="Breadcrumb">
            <BreadcrumbsNav />
          </section> */}

          <section className="dashboard-panel workspace-panel search-workspace" aria-labelledby="filter-title">
            <div className="panel-heading">
              <div>
                <span>Discovery filters</span>
                <h2 id="filter-title">Find the right businesses</h2>
              </div>
              <p>Combine filters to narrow your results.</p>
            </div>

            <TopSearchPanel
              q={q}
              setQ={setQ}
              region={region}
              setRegion={setRegion}
              country={country}
              setCountry={setCountry}
              stateItem={stateItem}
              setStateItem={setStateItem}
              city={city}
              setCity={setCity}
              sector={sector}
              setSector={setSector}
              industry={industry}
              setIndustry={setIndustry}
              verified={verified}
              setVerified={setVerified}
              regions={regions}
              countries={countries}
              states={states}
              cities={cities}
              sectors={sectors}
              industries={industries}
              onSearch={onSearch}
              onCountryFirstSelection={handleCountryFirstSelection}
            />
          </section>

          <section className="dashboard-panel workspace-panel results-workspace" aria-labelledby="results-title">
            <div className="panel-heading">
              <div>
                <span>Company directory</span>
                <h2 id="results-title">Explore results</h2>
              </div>
              <p>Browse sectors and available company profiles.</p>
            </div>

            <div className="sector-status" role="status" aria-live="polite">
              <div className="sector-status-icon" aria-hidden="true">
                <BriefcaseBusiness size={21} />
              </div>
              <div className="sector-status-copy">
                <span className="sector-status-eyebrow">Current view</span>
                <h3>{activeSectorName || "All Sectors"}</h3>
                <p>
                  {activeSectorName
                    ? `Showing companies in ${activeSectorName}.`
                    : "Showing all sectors just like the initial phase."}
                </p>
              </div>
              <span className="sector-status-badge">
                {activeSectorName ? "Filtered" : "All available"}
              </span>
            </div>

            <MainPanel
              loading={loading}
              sectors={sectors}
              industries={industries}
              selectedSector={sector}
              selectedSectorObject={selectedSectorObject}
              gridQuery={gridQuery}
              setGridQuery={setGridQuery}
              page={page}
              setPage={setPage}
              pageSize={pageSize}
            />
          </section>
        </div>
      </main>

        <Footer />
      </div>
    </ResponsiveController>
  );
}

