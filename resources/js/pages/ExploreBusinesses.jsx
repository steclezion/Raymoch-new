import React, { useEffect, useMemo, useState } from "react";

// Layout
import Header from "../components/layout_master/Header.jsx";
import Footer from "../components/layout_master/Footer.jsx";

// Split components
import TopSearchPanel from "../pages/explore/Top_search_panel.jsx";
import MainPanel from "../pages/explore/Main_panel.jsx";
import BreadcrumbsNav from "../components/common/BreadcrumbsNav";

const pageCss = `
:root{
  --brand-blue:#0328aeed;
  --brand-blue-700:#213bb1;
  --brand-blue-500:#041b64;
  --ink:#101114;
  --muted:#3c4b69;
  --bg:#fafafa;
  --border:#e8e8ee;
  --card:#fff;
  --radius:14px;
  --pill:999px;
  --shadow:0 6px 22px rgba(10,42,107,.08);
  --maxw: 1400px;
}

.page{
  background:var(--bg);
  min-height:100vh;
  display:flex;
  flex-direction:column;
}
.container{
  width:100%;
  max-width:1400px;
  margin:0 auto;
  padding:28px 22px;
}
@media (max-width: 768px){
  .container{
    max-width:620px;
    padding:20px 14px;
  }
}
@media (max-width: 480px){
  .container{
    max-width:100%;
    padding:16px 12px;
  }
}
.explore-hero{
  text-align:center;
  padding:30px 12px;
}
.explore-hero h1{
  font-size:40px;
  font-weight:900;
  line-height:1.06;
  color:#0A2A6B;
  margin:0 0 6px;
}
.explore-hero p{
  color:#667085;
  margin:0;
}
footer{ margin-top:auto; }
.breadcrumb{
  display:flex;
  align-items:center;
  flex-wrap:wrap;
  gap:8px;
  margin:0 0 18px;
  padding:12px 16px;
  background:#fff;
  border:1px solid #e5e7eb;
  border-radius:14px;
  box-shadow:0 4px 14px rgba(15,23,42,.06);
  font-size:13px;
  text-transform: uppercase;
  letter-spacing: .6px;
}
.breadcrumb a{
  color:#2d4fbf;
  text-decoration:none;
  font-weight:600;
  transition:color .18s ease;
}
.breadcrumb a:hover{
  color:#0A2A6B;
  text-decoration:underline;
}
.breadcrumb .sep{
  color:#94a3b8;
  font-weight:700;
}
.breadcrumb .current{
  color:#0f172a;
  font-weight:800;
}
`;

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

  const ROUTES = useMemo(
    () => ({
      privacy: "/privacy",
      terms: "/terms",
      cookies: "/cookies",
      signup: "/signup",
      login: "/login",
      explore: "/explore",
      services: "/services",
      insights: "/insights",
      about: "/about",
      trial: "/request-trial",
      home: "/",
    }),
    []
  );

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

  return (
    <div className="page">
      <style>{pageCss}</style>

      <Header routes={ROUTES} />

      <div className="container">
        <BreadcrumbsNav />

        <header className="explore-hero">
          <h1>Explore Businesses</h1>
          <p>This is the front door. Pick filters and we’ll show the right companies.</p>
        </header>

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
      </div>

      <Footer routes={ROUTES} />
    </div>
  );
}