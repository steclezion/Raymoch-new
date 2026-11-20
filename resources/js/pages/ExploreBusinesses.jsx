import React, { useEffect, useMemo, useState } from "react";

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

  const [region, setRegion] = useState([]);
  const [country, setCountry] = useState([]);
  const [stateItem, setStateItem] = useState([]);
  const [city, setCity] = useState([]);
  const [sector, setSector] = useState([]);
  const [industry, setIndustry] = useState([]);
  const [verified, setVerified] = useState(false);

  const [gridQuery, setGridQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [loading, setLoading] = useState(true);

  const selectedSectorObjects = useMemo(() => {
    const selectedIds = Array.isArray(sector) ? sector.map(String) : [];
    return sectors.filter((item) => selectedIds.includes(String(item.id)));
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
      if (region.length === 0) {
        const res = await fetchJson("/api/countries-africans");
        setCountries(res?.data ?? []);
        return;
      }

      const res = await fetchJson(
        `/api/countries-africans?region_ids=${encodeURIComponent(region.join(","))}`
      );
      setCountries(res?.data ?? []);
    };

    setCountry([]);
    setStateItem([]);
    setCity([]);
    setStates([]);
    setCities([]);

    fetchCountries();
  }, [region]);

  useEffect(() => {
    const fetchStates = async () => {
      if (country.length === 0) {
        setStates([]);
        return;
      }

      const res = await fetchJson(
        `/api/states-all?country_ids=${encodeURIComponent(country.join(","))}`
      );
      setStates(res?.data ?? []);
    };

    setStateItem([]);
    setCity([]);
    setCities([]);
    fetchStates();
  }, [country]);

  useEffect(() => {
    const fetchCities = async () => {
      if (stateItem.length === 0) {
        setCities([]);
        return;
      }

      const selectedStateIds = stateItem.includes("all")
        ? states.map((item) => String(item.id))
        : stateItem;

      if (selectedStateIds.length === 0) {
        setCities([]);
        return;
      }

      const res = await fetchJson(
        `/api/cities-all?state_ids=${encodeURIComponent(selectedStateIds.join(","))}`
      );
      setCities(res?.data ?? []);
    };

    setCity([]);
    fetchCities();
  }, [stateItem, states]);

  useEffect(() => {
    const fetchIndustries = async () => {
      const sectorIds = selectedSectorObjects.map((item) => item.id);
      if (sectorIds.length === 0) {
        const res = await fetchJson("/api/industries");
        setIndustries(res?.data ?? []);
        return;
      }

      const res = await fetchJson(
        `/api/industries?sector_ids=${encodeURIComponent(sectorIds.join(","))}`
      );
      setIndustries(res?.data ?? []);
    };

    setIndustry([]);
    fetchIndustries();
  }, [selectedSectorObjects]);

  useEffect(() => {
    setPage(1);
  }, [gridQuery, sector, industries.length, sectors.length]);

  const onSearch = (payload) => {
    const p = new URLSearchParams();

    if (payload?.q) p.set("q", payload.q);

    const idParameters = {
      sector_id: payload?.sector,
      region_id: payload?.region,
      country_id: payload?.country,
      state_id: payload?.stateItem,
      city_ids: Array.isArray(payload?.cities) ? payload.cities.join(",") : payload?.city,
      industry_id: payload?.industry,
    };

    Object.entries(idParameters).forEach(([name, value]) => {
      if (value !== undefined && value !== null && value !== "" && value !== "all") {
        p.set(name, String(value));
      }
    });

    if (payload?.verified) p.set("verification_status", "verified");

    window.location.assign(`/companies?${p.toString()}`);
  };

  return (
    <ResponsiveController>
      <div className="dashboard-shell precisely-dashboard">
        <HorizontalNavigation activePath="/explore" />

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="dashboard-heading">
            <h1>Businesses</h1>
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

          <section className="dashboard-panel workspace-panel search-workspace" aria-label="Business search filters">
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

            <MainPanel
              loading={loading}
              sectors={sectors}
              industries={industries}
              selectedSector={sector[0] ?? ""}
              selectedSectorObject={selectedSectorObjects[0] ?? null}
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

