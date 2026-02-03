import React, { useEffect, useMemo, useState } from "react";

// Layout
import Header from "../components/layout_master/Header.jsx";
import Footer from "../components/layout_master/Footer.jsx";

// Split components
import TopSearchPanel from "../pages/explore/Top_search_panel.jsx";
import MainPanel from "../pages/explore/Main_panel.jsx";

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

/* Page Shell */
.page{
  background:var(--bg);
  min-height:100vh;
  display:flex;
  flex-direction:column;
}

/* Container */
.container{
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 28px 22px;
}

@media (max-width: 768px){
  .container{
    max-width: 620px;
    padding: 20px 14px;
  }
}

@media (max-width: 480px){
  .container{
    max-width: 100%;
    padding: 16px 12px;
  }
}

/* HERO */
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
`;

export default function ExploreBusinesses() {
  /* ------------------------------------------------------------
    STATE
  ------------------------------------------------------------ */
  const [q, setQ] = useState("");
  const [countries, setCountries] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [country, setCountry] = useState("");
  const [sector, setSector] = useState("");
  const [verified, setVerified] = useState(false);

  // Grid filter (client-side)
  const [gridQuery, setGridQuery] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Loading
  const [loading, setLoading] = useState(true);

  /* ROUTES (for Header / Footer) */
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

  /* ------------------------------------------------------------
    FETCH COUNTRIES + SECTORS
  ------------------------------------------------------------ */
  useEffect(() => {
    (async () => {
      try {
        const [cRes, sRes] = await Promise.all([
          fetch("/api/countries").then((r) => r.json()).catch(() => ({ data: [] })),
          fetch("/api/business-sectors").then((r) => r.json()).catch(() => ({ data: [] })),
        ]);
        setCountries(cRes?.data ?? []);
        setSectors(sRes?.data ?? []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ------------------------------------------------------------
    TOP SEARCH (redirect to /companies)
  ------------------------------------------------------------ */
  const onSearch = (e) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (country) p.set("country", country);
    if (sector) p.set("sector", sector);
    if (verified) p.set("verified", "1");
    window.location.assign(`/companies?${p.toString()}`);
  };

  /* ------------------------------------------------------------
    RESET PAGE WHEN FILTER CHANGES
  ------------------------------------------------------------ */
  useEffect(() => {
    setPage(1);
  }, [gridQuery, sectors.length]);

  /* ------------------------------------------------------------
    RENDER
  ------------------------------------------------------------ */
  return (
    <div className="page">
      <style>{pageCss}</style>

      <Header routes={ROUTES} />

      <div className="container">
        {/* HERO */}
        <header className="explore-hero">
          <h1>Explore Businesses</h1>
          <p>This is the front door. Pick a sector or search; we’ll show the right companies.</p>
        </header>

        {/* ✅ TOP SEARCH PANEL */}
        <TopSearchPanel
          q={q}
          setQ={setQ}
          country={country}
          setCountry={setCountry}
          sector={sector}
          setSector={setSector}
          verified={verified}
          setVerified={setVerified}
          countries={countries}
          sectors={sectors}
          onSearch={onSearch}
        />

        {/* ✅ MAIN PANEL */}
        <MainPanel
          loading={loading}
          sectors={sectors}
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
