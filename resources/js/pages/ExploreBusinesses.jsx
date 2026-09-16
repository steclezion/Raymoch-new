// import React, { useEffect, useMemo, useState } from "react";

// // Layout
// import Header from "../components/layout_master/Header.jsx";
// import Footer from "../components/layout_master/Footer.jsx";

// // Split components
// import TopSearchPanel from "../pages/explore/Top_search_panel.jsx";
// import MainPanel from "../pages/explore/Main_panel.jsx";
// import BreadcrumbsNav from "../components/common/BreadcrumbsNav";

// const pageCss = `
// :root{
//   --brand-blue:#0328aeed;
//   --brand-blue-700:#213bb1;
//   --brand-blue-500:#041b64;
//   --ink:#101114;
//   --muted:#3c4b69;
//   --bg:#fafafa;
//   --border:#e8e8ee;
//   --card:#fff;
//   --radius:14px;
//   --pill:999px;
//   --shadow:0 6px 22px rgba(10,42,107,.08);
//   --maxw: 1400px;
// }

// .page{
//   background:var(--bg);
//   min-height:100vh;
//   display:flex;
//   flex-direction:column;
// }
// .container{
//   width:100%;
//   max-width:1400px;
//   margin:0 auto;
//   padding:28px 22px;
// }
// @media (max-width: 768px){
//   .container{
//     max-width:620px;
//     padding:20px 14px;
//   }
// }
// @media (max-width: 480px){
//   .container{
//     max-width:100%;
//     padding:16px 12px;
//   }
// }
// .explore-hero{
//   text-align:center;
//   padding:30px 12px;
// }
// .explore-hero h1{
//   font-size:40px;
//   font-weight:900;
//   line-height:1.06;
//   color:#0A2A6B;
//   margin:0 0 6px;
// }
// .explore-hero p{
//   color:#667085;
//   margin:0;
// }
// footer{ margin-top:auto; }
// .breadcrumb{
//   display:flex;
//   align-items:center;
//   flex-wrap:wrap;
//   gap:8px;
//   margin:0 0 18px;
//   padding:12px 16px;
//   background:#fff;
//   border:1px solid #e5e7eb;
//   border-radius:14px;
//   box-shadow:0 4px 14px rgba(15,23,42,.06);
//   font-size:13px;
//   text-transform: uppercase;
//   letter-spacing: .6px;
// }
// .breadcrumb a{
//   color:#2d4fbf;
//   text-decoration:none;
//   font-weight:600;
//   transition:color .18s ease;
// }
// .breadcrumb a:hover{
//   color:#0A2A6B;
//   text-decoration:underline;
// }
// .breadcrumb .sep{
//   color:#94a3b8;
//   font-weight:700;
// }
// .breadcrumb .current{
//   color:#0f172a;
//   font-weight:800;
// }
// `;

// async function fetchJson(url) {
//   try {
//     const res = await fetch(url, {
//       headers: { Accept: "application/json" },
//       credentials: "same-origin",
//     });

//     if (!res.ok) {
//       return { data: [] };
//     }

//     return await res.json();
//   } catch {
//     return { data: [] };
//   }
// }

// export default function ExploreBusinesses() {
//   const [q, setQ] = useState("");

//   const [regions, setRegions] = useState([]);
//   const [countries, setCountries] = useState([]);
//   const [states, setStates] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [sectors, setSectors] = useState([]);
//   const [industries, setIndustries] = useState([]);

//   const [region, setRegion] = useState("all");
//   const [country, setCountry] = useState("all");
//   const [stateItem, setStateItem] = useState("");
//   const [city, setCity] = useState("");
//   const [sector, setSector] = useState("");
//   const [industry, setIndustry] = useState("");
//   const [verified, setVerified] = useState(false);

//   const [gridQuery, setGridQuery] = useState("");
//   const [page, setPage] = useState(1);
//   const pageSize = 20;
//   const [loading, setLoading] = useState(true);

//   const ROUTES = useMemo(
//     () => ({
//       privacy: "/privacy",
//       terms: "/terms",
//       cookies: "/cookies",
//       signup: "/signup",
//       login: "/login",
//       explore: "/explore",
//       services: "/services",
//       insights: "/insights",
//       about: "/about",
//       trial: "/request-trial",
//       home: "/",
//     }),
//     []
//   );

//   const selectedSectorObject = useMemo(() => {
//     if (!sector) return null;

//     return sectors.find(
//       (s) =>
//         String(s.id) === String(sector) ||
//         String(s.code) === String(sector) ||
//         String(s.title) === String(sector) ||
//         String(s.name) === String(sector)
//     );
//   }, [sector, sectors]);

//   useEffect(() => {
//     (async () => {
//       try {
//         const [regionRes, countryRes, sectorRes, industryRes] = await Promise.all([
//           fetchJson("/api/regions"),
//           fetchJson("/api/countries-africans"),
//           fetchJson("/api/sectors"),
//           fetchJson("/api/industries"),
//         ]);

//         setRegions(regionRes?.data ?? []);
//         setCountries(countryRes?.data ?? []);
//         setSectors(sectorRes?.data ?? []);
//         setIndustries(industryRes?.data ?? []);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   useEffect(() => {
//     const fetchCountries = async () => {
//       if (!region || region === "all") {
//         const res = await fetchJson("/api/countries-africans");
//         setCountries(res?.data ?? []);
//         return;
//       }

//       const res = await fetchJson(
//         `/api/countries-africans?region_id=${encodeURIComponent(region)}`
//       );
//       setCountries(res?.data ?? []);
//     };

//     setStateItem("");
//     setCity("");
//     setStates([]);
//     setCities([]);

//     fetchCountries();
//   }, [region]);

//   useEffect(() => {
//     const fetchStates = async () => {
//       if (!country || country === "all") {
//         setStates([]);
//         return;
//       }

//       const res = await fetchJson(
//         `/api/states-all?countries_all_id=${encodeURIComponent(country)}`
//       );
//       setStates(res?.data ?? []);
//     };

//     setStateItem("");
//     setCity("");
//     setCities([]);
//     fetchStates();
//   }, [country]);

//   useEffect(() => {
//     const fetchCities = async () => {
//       if (!stateItem || stateItem === "all") {
//         setCities([]);
//         return;
//       }

//       const res = await fetchJson(
//         `/api/cities-all?state_id=${encodeURIComponent(stateItem)}`
//       );
//       setCities(res?.data ?? []);
//     };

//     setCity("");
//     fetchCities();
//   }, [stateItem]);

//   useEffect(() => {
//     const fetchIndustries = async () => {
//       if (!selectedSectorObject?.id) {
//         const res = await fetchJson("/api/industries");
//         setIndustries(res?.data ?? []);
//         return;
//       }

//       const res = await fetchJson(
//         `/api/industries?sector_id=${encodeURIComponent(selectedSectorObject.id)}`
//       );
//       setIndustries(res?.data ?? []);
//     };

//     setIndustry("");
//     fetchIndustries();
//   }, [selectedSectorObject]);

//   const handleCountryFirstSelection = async (countryId) => {
//     if (!countryId || countryId === "all") {
//       return;
//     }

//     const res = await fetchJson(
//       `/api/country-region?country_id=${encodeURIComponent(countryId)}`
//     );

//     if (res?.ok && res?.data?.region_id) {
//       setRegion(String(res.data.region_id));
//     }
//   };

//   useEffect(() => {
//     setPage(1);
//   }, [gridQuery, sector, industries.length, sectors.length]);

//   const onSearch = (payload) => {
//     const p = new URLSearchParams();

//     if (payload?.q) p.set("q", payload.q);
//     if (payload?.region && payload.region !== "all") {
//       p.set("region_id", payload.region);
//     }
//     if (payload?.country && payload.country !== "all") {
//       p.set("country_id", payload.country);
//     }
//     if (payload?.stateItem && payload.stateItem !== "all") {
//       p.set("state_id", payload.stateItem);
//     }
//     if (payload?.city && payload.city !== "all") {
//       p.set("city_id", payload.city);
//     }
//     if (payload?.sector) p.set("sector_id", payload.sector);
//     if (payload?.industry) p.set("industry_id", payload.industry);
//     if (payload?.verified) p.set("verified", "1");

//     window.location.assign(`/companies?${p.toString()}`);
//   };

//   return (
//     <div className="page">
//       <style>{pageCss}</style>

//       <Header routes={ROUTES} />

//       <div className="container">
//         <BreadcrumbsNav />

//         <header className="explore-hero">
//           <h1>Explore Businesses</h1>
//           <p>This is the front door. Pick filters and we’ll show the right companies.</p>
//         </header>

//         <TopSearchPanel
//           q={q}
//           setQ={setQ}
//           region={region}
//           setRegion={setRegion}
//           country={country}
//           setCountry={setCountry}
//           stateItem={stateItem}
//           setStateItem={setStateItem}
//           city={city}
//           setCity={setCity}
//           sector={sector}
//           setSector={setSector}
//           industry={industry}
//           setIndustry={setIndustry}
//           verified={verified}
//           setVerified={setVerified}
//           regions={regions}
//           countries={countries}
//           states={states}
//           cities={cities}
//           sectors={sectors}
//           industries={industries}
//           onSearch={onSearch}
//           onCountryFirstSelection={handleCountryFirstSelection}
//         />

//         <MainPanel
//           loading={loading}
//           sectors={sectors}
//           industries={industries}
//           selectedSector={sector}
//           selectedSectorObject={selectedSectorObject}
//           gridQuery={gridQuery}
//           setGridQuery={setGridQuery}
//           page={page}
//           setPage={setPage}
//           pageSize={pageSize}
//         />
//       </div>

//       <Footer routes={ROUTES} />
//     </div>
//   );
// }






import React, { useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  Globe2,
  Search,
} from "lucide-react";

// Split components
import TopSearchPanel from "../pages/explore/Top_search_panel.jsx";
import MainPanel from "../pages/explore/Main_panel.jsx";
import BreadcrumbsNav from "../components/common/BreadcrumbsNav";
import HorizontalNavigation from "../components/HorizontalNavigation.jsx";
import Footer from "../components/layout_master/Footer.jsx";
import { ResponsiveController } from "../components/ResponsiveController.jsx";

const pageCss = `
:root{
  --brand-blue:#5b3825;
  --brand-blue-700:#6f452e;
  --brand-blue-500:#382116;
  --ink:#1c1d1f;
  --muted:#7a746d;
  --bg:#f7f2ea;
  --border:#ded2c3;
  --card:#fbf8f3;
  --radius:14px;
  --pill:999px;
  --shadow:0 10px 28px rgba(72,47,30,.08);
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
  color:#382116;
  margin:0 0 6px;
}
.explore-hero p{
  color:#7a746d;
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
  background:#fbf8f3;
  border:1px solid #ded2c3;
  border-radius:14px;
  box-shadow:0 4px 14px rgba(72,47,30,.06);
  font-size:13px;
  text-transform: uppercase;
  letter-spacing: .6px;
}
.breadcrumb a{
  color:#6f452e;
  text-decoration:none;
  font-weight:600;
  transition:color .18s ease;
}
.breadcrumb a:hover{
  color:#382116;
  text-decoration:underline;
}
.breadcrumb .sep{
  color:#9a8d82;
  font-weight:700;
}
.breadcrumb .current{
  color:#382116;
  font-weight:800;
}
`;

const dashboardCss = `
  :root {
    --dash-blue: #5b3825;
    --dash-blue-dark: #382116;
    --dash-ink: #1c1d1f;
    --dash-muted: #7a746d;
    --dash-line: #ded2c3;
    --dash-bg: #f7f2ea;
    --dash-card: #fbf8f3;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: var(--dash-bg);
    color: var(--dash-ink);
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }
  button, input, select { font: inherit; }
  .dashboard-shell { min-height: 100vh; background: var(--dash-bg); }
  .dashboard-main { min-height: 100vh; margin-left: 0; padding: 24px 30px 34px; }
  .dashboard-topbar { display: flex; align-items: center; justify-content: space-between; gap: 18px; margin-bottom: 18px; }
  .dashboard-heading p { margin: 0 0 3px; color: var(--dash-muted); font-size: .78rem; font-weight: 650; }
  .dashboard-heading h1 { margin: 0; font-size: clamp(1.55rem, 2vw, 2rem); letter-spacing: -.04em; }
  .topbar-actions { display: flex; align-items: center; gap: 9px; }
  .topbar-search {
    width: min(330px, 31vw);
    height: 40px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 12px;
    border: 1px solid var(--dash-line);
    border-radius: 11px;
    background: var(--dash-card);
    color: #8a909b;
  }
  .topbar-search input { width: 100%; border: 0; outline: 0; background: transparent; color: var(--dash-ink); font-size: .82rem; }
  .topbar-button { min-height: 43px; display: inline-flex; align-items: center; justify-content: center; padding: 0 17px; border-radius: 10px; color: #fbf8f3; background: linear-gradient(135deg, #6f452e, #5b3825); text-decoration: none; font-size: .84rem; font-weight: 800; box-shadow: 0 6px 15px rgba(91,56,37,.18); }
  .dashboard-hero {
    position: relative;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 24px;
    margin-bottom: 16px;
    padding: 28px 30px;
    overflow: hidden;
    border: 1px solid #6f452e;
    border-radius: 18px;
    color: #fff;
    background: radial-gradient(circle at 86% 10%, rgba(210,173,120,.3), transparent 27%), linear-gradient(120deg, #382116, #5b3825 58%, #8f6847);
    box-shadow: 0 14px 34px rgba(72,47,30,.16);
  }
  .dashboard-hero::after { content: ""; position: absolute; right: -80px; bottom: -180px; width: 360px; height: 360px; border: 1px solid rgba(255,255,255,.14); border-radius: 50%; }
  .hero-copy { position: relative; z-index: 1; max-width: 720px; }
  .hero-kicker { display: inline-flex; align-items: center; gap: 7px; margin-bottom: 10px; color: #f3e7cf; font-size: .74rem; font-weight: 850; letter-spacing: .08em; text-transform: uppercase; }
  .dashboard-hero h2 { margin: 0 0 9px; font-size: clamp(2rem, 4vw, 3.25rem); line-height: 1; letter-spacing: -.05em; }
  .dashboard-hero p { max-width: 660px; margin: 0; color: #eee2d4; font-size: .94rem; line-height: 1.6; }
  .hero-count { position: relative; z-index: 1; min-width: 132px; padding: 13px 15px; border: 1px solid rgba(255,255,255,.2); border-radius: 13px; background: rgba(255,255,255,.1); backdrop-filter: blur(8px); }
  .hero-count strong, .hero-count span { display: block; }.hero-count strong { font-size: 1.7rem; }.hero-count span { margin-top: 2px; color: #eee2d4; font-size: .7rem; }
  .dashboard-content { display: grid; gap: 16px; }
  .dashboard-panel { border: 1px solid var(--dash-line); border-radius: 17px; background: var(--dash-card); box-shadow: 0 8px 24px rgba(72,47,30,.06); }
  .breadcrumbs-panel { padding: 4px; }
  .breadcrumbs-panel .breadcrumb { margin: 0; border: 0; box-shadow: none; background: transparent; }
  .workspace-panel { padding: 18px; }
  .panel-heading { display: flex; align-items: flex-end; justify-content: space-between; gap: 15px; margin-bottom: 14px; }
  .panel-heading span { display: block; margin-bottom: 5px; color: var(--dash-blue); font-size: .68rem; font-weight: 900; letter-spacing: .1em; text-transform: uppercase; }
  .panel-heading h2 { margin: 0; font-size: 1.12rem; letter-spacing: -.025em; }
  .panel-heading p { margin: 0; color: var(--dash-muted); font-size: .75rem; }
  .search-workspace > :last-child, .results-workspace > :last-child { max-width: 100%; }
  .sector-status {
    position: relative;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 14px;
    margin-bottom: 18px;
    padding: 16px 18px;
    overflow: hidden;
    border: 1px solid #ded2c3;
    border-radius: 14px;
    background: linear-gradient(110deg, #f4ece2 0%, #fbf8f3 64%);
  }
  .sector-status::before {
    content: "";
    position: absolute;
    inset: 0 auto 0 0;
    width: 4px;
    background: linear-gradient(180deg, #8f6847, #5b3825);
  }
  .sector-status-icon {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: 12px;
    color: #fff;
    background: linear-gradient(145deg, #8f6847, #5b3825);
    box-shadow: 0 8px 18px rgba(91, 56, 37, .2);
  }
  .sector-status-copy { min-width: 0; }
  .sector-status-eyebrow {
    display: block;
    margin-bottom: 3px;
    color: #8b7769;
    font-size: .65rem;
    font-weight: 850;
    letter-spacing: .1em;
    text-transform: uppercase;
  }
  .sector-status h3 {
    margin: 0;
    color: #382116;
    font-size: 1.05rem;
    letter-spacing: -.02em;
  }
  .sector-status p {
    margin: 4px 0 0;
    color: #7a746d;
    font-size: .78rem;
    line-height: 1.45;
  }
  .sector-status-badge {
    padding: 6px 10px;
    border: 1px solid #d5c2ad;
    border-radius: 999px;
    color: #5b3825;
    background: #f3e8dc;
    font-size: .68rem;
    font-weight: 850;
    white-space: nowrap;
  }
  .workspace-panel button,
  .workspace-panel input[type="submit"],
  .workspace-panel a[role="button"] {
    min-height: 43px;
    padding: 0 17px;
    border-radius: 10px;
    font-size: .84rem;
  }
  .workspace-panel button[type="submit"],
  .workspace-panel input[type="submit"] {
    border: 1px solid #5b3825;
    color: #fbf8f3;
    background: linear-gradient(135deg, #6f452e, #5b3825);
    box-shadow: 0 6px 15px rgba(91,56,37,.18);
  }
  .workspace-panel button:hover,
  .workspace-panel a[role="button"]:hover {
    border-color: #8f6847;
  }
  .workspace-panel button:focus-visible,
  .workspace-panel input:focus-visible,
  .workspace-panel select:focus-visible,
  .topbar-search:focus-within {
    outline: 0;
    border-color: #8f6847;
    box-shadow: 0 0 0 3px rgba(143,104,71,.15);
  }
  .sr-only { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
  @media (max-width: 840px) {
    .dashboard-main { margin-left: 0; padding: 18px; }
  }
  @media (max-width: 640px) {
    .dashboard-topbar { align-items: flex-start; }
    .dashboard-heading p, .topbar-search { display: none; }
    .dashboard-hero { align-items: flex-start; flex-direction: column; padding: 24px 21px; }
    .hero-count { min-width: 0; }
    .workspace-panel { padding: 13px; }
    .panel-heading { align-items: flex-start; flex-direction: column; }
    .sector-status { grid-template-columns: auto minmax(0, 1fr); padding: 14px; }
    .sector-status-badge { grid-column: 2; justify-self: start; }
  }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { scroll-behavior: auto !important; transition: none !important; }
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
        <style>{pageCss}</style>
        <style>{dashboardCss}</style>

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
