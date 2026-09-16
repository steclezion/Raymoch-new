// // resources/js/pages/companies/Companies.jsx
// import React, { useEffect, useMemo, useState } from "react";

// // Layout
// import Header from "../components/layout_master/Header.jsx";
// import Footer from "../components/layout_master/Footer.jsx";

// // MUI
// import { Box, Alert, Breadcrumbs, Link as MLink, Typography } from "@mui/material";

// // Local
// import "../styles/companies.css";
// import CompanyDetailDialog from "../components/companies/CompanyDetailDialog.jsx";
// import { API_BASE, fetchJSON } from "../utils/api.js";

// // import FilterPanel from "../pages/companies/Filter_panel.jsx"; // removed
// import TopSearchPanelCompanies from "../pages/companies/Top_search_panel_companies.jsx";
// import MainLoadPanel from "../pages/companies/Main_load_panel.jsx";

// function ascii(s) {
//   return (s || "")
//     .normalize("NFD")
//     .replace(/[\u0300-\u036f]/g, "")
//     .replace(/’/g, "'")
//     .trim();
// }

// function lowerAscii(s) {
//   return ascii(s).toLowerCase();
// }

// const COUNTRY_ALIASES = new Map([
//   ["côte d’ivoire", "Cote d'Ivoire"],
//   ["cote d’ivoire", "Cote d'Ivoire"],
//   ["côte d'ivoire", "Cote d'Ivoire"],
//   ["dr congo", "Democratic Republic of the Congo"],
//   ["drc", "Democratic Republic of the Congo"],
//   ["congo-kinshasa", "Democratic Republic of the Congo"],
//   ["democratic republic of congo", "Democratic Republic of the Congo"],
//   ["republic of congo", "Republic of the Congo"],
//   ["congo-brazzaville", "Republic of the Congo"],
//   ["são tome and príncipe", "Sao Tome and Principe"],
//   ["sao tome & principe", "Sao Tome and Principe"],
//   ["western sahara", "Sahrawi Arab Democratic Republic"],
//   ["eswatini (swaziland)", "Eswatini"],
// ]);

// function canonicalizeCountry(input) {
//   if (!input) return "";
//   const key = lowerAscii(input);
//   if (COUNTRY_ALIASES.has(key)) return COUNTRY_ALIASES.get(key);
//   return ascii(input);
// }

// function normalizeCompany(c) {
//   if (!c) return {};

//   const rawStatus = c.VerificationStatus ?? c.verification_status ?? "";
//   const statusStr = String(rawStatus).trim().toLowerCase();
//   const isVerified = /\bverified\b/.test(statusStr) || !!c.Verified;

//   return {
//     id: c.Id ?? c.id ?? c.ID ?? null,
//     name: c.CompanyName ?? c.company_name ?? "—",
//     sector: c.Sector ?? c.sector ?? "",
//     country: c.Country ?? c.country ?? "",
//     city: c.City ?? c.city ?? "",
//     stage: c.Stage ?? c.stage ?? "",
//     verified: isVerified,
//     verification_status: statusStr,
//     cti: {
//       tier: c.CTI_Tier ?? c.cti_tier ?? "",
//       score: c.CTI_Score ?? c.cti_score ?? "",
//     },
//     logo_url: c.logo_url ?? c.site_image_url ?? null,
//   };
// }

// function groupByCountry(items) {
//   const groups = new Map();

//   items.forEach((x) => {
//     const key = (x.country || "Unspecified country").trim() || "Unspecified country";
//     if (!groups.has(key)) groups.set(key, []);
//     groups.get(key).push(x);
//   });

//   const out = Array.from(groups.entries()).sort((a, b) =>
//     a[0].localeCompare(b[0])
//   );

//   out.forEach(([_, arr]) =>
//     arr.sort((u, v) => (u.name || "").localeCompare(v.name || ""))
//   );

//   return out;
// }

// function groupBySector(items) {
//   const groups = new Map();

//   items.forEach((x) => {
//     const key = (x.sector || "Unspecified sector").trim() || "Unspecified sector";
//     if (!groups.has(key)) groups.set(key, []);
//     groups.get(key).push(x);
//   });

//   const out = Array.from(groups.entries()).sort((a, b) =>
//     a[0].localeCompare(b[0])
//   );

//   out.forEach(([_, arr]) =>
//     arr.sort((u, v) => (u.name || "").localeCompare(v.name || ""))
//   );

//   return out;
// }

// function groupByCountryAndSector(items) {
//   const countryMap = new Map();

//   items.forEach((c) => {
//     const country = (c.country || "Unspecified country").trim() || "Unspecified country";
//     const sector = (c.sector || "Unspecified sector").trim() || "Unspecified sector";

//     if (!countryMap.has(country)) countryMap.set(country, new Map());

//     const sectorMap = countryMap.get(country);
//     if (!sectorMap.has(sector)) sectorMap.set(sector, []);
//     sectorMap.get(sector).push(c);
//   });

//   const countries = Array.from(countryMap.entries()).sort((a, b) =>
//     a[0].localeCompare(b[0])
//   );

//   return countries.map(([countryName, sectorMap]) => {
//     const sectors = Array.from(sectorMap.entries())
//       .sort((a, b) => a[0].localeCompare(b[0]))
//       .map(([sectorName, companies]) => ({
//         sector: sectorName,
//         companies: companies
//           .slice()
//           .sort((u, v) => (u.name || "").localeCompare(v.name || "")),
//       }));

//     return { country: countryName, sectors };
//   });
// }

// export default function Companies() {
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

//   const [q, setQ] = useState("");
//   const [sector, setSector] = useState("");
//   const [country, setCountry] = useState("");
//   const [verified, setVerified] = useState(false);
//   const [localFilter, setLocalFilter] = useState("");

//   const [companies, setCompanies] = useState([]);
//   const [sectorOptions, setSectorOptions] = useState([]);
//   const [countryOptions, setCountryOptions] = useState([]);

//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [total, setTotal] = useState(0);

//   const [loading, setLoading] = useState(true);
//   const [progress, setProgress] = useState(10);
//   const [error, setError] = useState("");
//   const [fromParam, setFromParam] = useState("");

//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [selectedCompany, setSelectedCompany] = useState(null);

//   useEffect(() => {
//     const qs = new URLSearchParams(window.location.search);

//     const qParam = (qs.get("q") || qs.get("search") || qs.get("keyword") || "").trim();
//     const sectorParam = (qs.get("sector") || "").trim();
//     const countryParam = canonicalizeCountry(qs.get("country") || "");
//     const pageParam = parseInt(qs.get("page") || "1", 10);
//     const verifiedParam = qs.get("verified") || qs.get("verification");
//     const from = (qs.get("from") || "").toLowerCase();

//     if (qParam) setQ(qParam);
//     if (sectorParam) setSector(sectorParam);
//     if (countryParam) setCountry(countryParam);
//     if (!Number.isNaN(pageParam) && pageParam > 0) setPage(pageParam);
//     if (verifiedParam === "1" || verifiedParam === "true" || verifiedParam === "ON") {
//       setVerified(true);
//     }

//     setFromParam(from);
//   }, []);

//   useEffect(() => {
//     let cancelled = false;

//     async function loadOptions() {
//       try {
//         const [sectorRes, countryRes] = await Promise.all([
//           fetchJSON(`${API_BASE}/business-sectors`).catch(() => null),
//           fetchJSON(`${API_BASE}/countries`).catch(() => null),
//         ]);

//         if (cancelled) return;

//         if (sectorRes && Array.isArray(sectorRes.data)) {
//           const list = sectorRes.data
//             .map((s) => s.title || s.sector_name || s.name)
//             .filter(Boolean)
//             .sort();

//           setSectorOptions(list);
//         }

//         if (countryRes && Array.isArray(countryRes.data)) {
//           const list = countryRes.data
//             .map((c) => c.country_name || c.name)
//             .filter(Boolean)
//             .sort();

//           setCountryOptions(list);
//         }
//       } catch (e) {
//         console.error("Filter options error", e);
//       }
//     }

//     loadOptions();

//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   useEffect(() => {
//     if (!loading) {
//       setProgress(100);
//       return;
//     }

//     setProgress(10);

//     const id = setInterval(() => {
//       setProgress((p) => (p < 90 ? p + 10 : p));
//     }, 200);

//     return () => clearInterval(id);
//   }, [loading]);

//   const isAllInputsEmpty = !q && !sector && !country && !verified && !localFilter.trim();
//   const hasAnyFilter = !!(q || sector || country || verified);

//   useEffect(() => {
//     let cancelled = false;

//     async function loadCompanies() {
//       try {
//         setLoading(true);
//         setError("");

//         const params = new URLSearchParams();
//         params.set("page", String(page));

//         if (q) params.set("q", q);
//         if (sector) params.set("sector", sector);
//         if (country) params.set("country", country);
//         if (verified) params.set("verified", "1");

//         const url = `${API_BASE}/companies?${params.toString()}`;
//         const js = await fetchJSON(url);

//         if (cancelled) return;

//         let payload = js.data;
//         let list = [];

//         if (payload && Array.isArray(payload.data)) {
//           list = payload.data;
//         } else if (Array.isArray(payload)) {
//           list = payload;
//           payload = { current_page: page, last_page: 1, total: payload.length };
//         } else if (Array.isArray(js)) {
//           list = js;
//           payload = { current_page: page, last_page: 1, total: js.length };
//         }

//         const normalized = list.map(normalizeCompany);

//         setCompanies(normalized);
//         setPage(payload.current_page || 1);
//         setTotalPages(payload.last_page || 1);
//         setTotal(payload.total || normalized.length || 0);

//         const qp = new URLSearchParams();

//         if (page > 1) qp.set("page", String(page));
//         if (q) qp.set("q", q);
//         if (sector) qp.set("sector", sector);
//         if (country) qp.set("country", country);
//         if (verified) qp.set("verified", "1");
//         if (fromParam) qp.set("from", fromParam);

//         const qs = qp.toString();
//         const newUrl = window.location.pathname + (qs ? `?${qs}` : "");

//         window.history.replaceState(null, "", newUrl);
//       } catch (e) {
//         if (cancelled) return;
//         console.error(e);
//         setError(`Failed to load companies: ${e.message}`);
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     }

//     loadCompanies();

//     return () => {
//       cancelled = true;
//     };
//   }, [page, q, sector, country, verified, fromParam]);

//   const visibleCompanies = useMemo(() => {
//     let list = companies;

//     if (verified) {
//       list = list.filter((c) => c.verified);
//     }

//     if (!q && localFilter.trim()) {
//       const term = localFilter.trim().toLowerCase();
//       list = list.filter((c) => (c.name || "").toLowerCase().includes(term));
//     }

//     return list;
//   }, [companies, verified, q, localFilter]);

//   const shouldGroupBySector = useMemo(
//     () => !q && !!country && !sector && !isAllInputsEmpty,
//     [q, country, sector, isAllInputsEmpty]
//   );

//   const flatGrouped = useMemo(
//     () =>
//       shouldGroupBySector
//         ? groupBySector(visibleCompanies)
//         : groupByCountry(visibleCompanies),
//     [visibleCompanies, shouldGroupBySector]
//   );

//   const nestedGrouped = useMemo(
//     () => (isAllInputsEmpty ? groupByCountryAndSector(visibleCompanies) : []),
//     [isAllInputsEmpty, visibleCompanies]
//   );

//   const hasResults = isAllInputsEmpty
//     ? nestedGrouped.length > 0
//     : flatGrouped.length > 0;

//   const pageNumbers = useMemo(() => {
//     const pages = [];
//     const max = 7;

//     if (totalPages <= max) {
//       for (let i = 1; i <= totalPages; i += 1) pages.push(i);
//     } else {
//       let start = Math.max(1, page - 2);
//       let end = Math.min(totalPages, page + 2);

//       if (start === 1) end = 5;
//       if (end === totalPages) start = totalPages - 4;

//       for (let i = start; i <= end; i += 1) pages.push(i);
//     }

//     return pages;
//   }, [page, totalPages]);

//   const goToPage = (n) => setPage(n);
//   const goPrev = () => page > 1 && setPage(page - 1);
//   const goNext = () => page < totalPages && setPage(page + 1);

//   const { backHref } = useMemo(() => {
//     function baseFor(from) {
//       switch (from) {
//         case "services":
//           return { href: "/services" };
//         case "insights":
//           return { href: "/insights" };
//         case "verification":
//           return { href: "/verification" };
//         case "matching":
//           return { href: "/matching" };
//         case "policy":
//           return { href: "/incentives" };
//         case "whitespace":
//           return { href: "/whitespace" };
//         case "explore":
//         default:
//           return { href: "/explore" };
//       }
//     }

//     const dest = baseFor(fromParam || "explore");
//     const p = new URLSearchParams();

//     if (q) p.set("q", q);
//     if (sector) p.set("sector", sector);
//     if (country) p.set("country", country);
//     if (verified) p.set("verified", "1");

//     const extra = p.toString();

//     return {
//       backHref: dest.href + (extra ? `?${extra}` : ""),
//     };
//   }, [fromParam, q, sector, country, verified]);

//   const onClearFilters = () => {
//     setQ("");
//     setSector("");
//     setCountry("");
//     setVerified(false);
//     setLocalFilter("");
//     setPage(1);
//   };

//   const openDetailDialog = (company) => {
//     setSelectedCompany(company);
//     setDialogOpen(true);
//   };

//   return (
//     <div className="page">
//       <Header routes={ROUTES} />

//       <Box className="container">
//         <Box sx={{ mb: 1 }}>
//           <Breadcrumbs aria-label="breadcrumb" separator="›">
//             <MLink color="inherit" underline="hover" href={ROUTES.home} sx={{ fontSize: 13 }}>
//               Home
//             </MLink>

//             <MLink color="inherit" underline="hover" href={backHref} sx={{ fontSize: 13 }}>
//               Explore businesses
//             </MLink>

//             <Typography color="text.primary" sx={{ fontSize: 13, fontWeight: 600 }}>
//               Companies
//             </Typography>
//           </Breadcrumbs>
//         </Box>

//         <header className="explore-hero">
//           <h1>Companies</h1>
//           <p>Filter and browse companies by country, sector, and verification.</p>
//         </header>

//         {error && (
//           <Box sx={{ my: 1 }}>
//             <Alert severity="error" variant="filled">
//               {error}
//             </Alert>
//           </Box>
//         )}

//         <TopSearchPanelCompanies
//           q={q}
//           setQ={setQ}
//           sector={sector}
//           setSector={setSector}
//           country={country}
//           setCountry={setCountry}
//           verified={verified}
//           setVerified={setVerified}
//           localFilter={localFilter}
//           setLocalFilter={setLocalFilter}
//           sectorOptions={sectorOptions}
//           countryOptions={countryOptions}
//           hasAnyFilter={hasAnyFilter}
//           onClearFilters={onClearFilters}
//           setPage={setPage}
//         />

//         <MainLoadPanel
//           loading={loading}
//           progress={progress}
//           hasResults={hasResults}
//           isAllInputsEmpty={isAllInputsEmpty}
//           nestedGrouped={nestedGrouped}
//           flatGrouped={flatGrouped}
//           shouldGroupBySector={shouldGroupBySector}
//           verified={verified}
//           openDetailDialog={openDetailDialog}
//           totalPages={totalPages}
//           page={page}
//           total={total}
//           pageNumbers={pageNumbers}
//           goToPage={goToPage}
//           goPrev={goPrev}
//           goNext={goNext}
//         />
//       </Box>

//       <CompanyDetailDialog
//         open={dialogOpen}
//         onClose={() => setDialogOpen(false)}
//         company={selectedCompany}
//       />

//       <Footer routes={ROUTES} />
//     </div>
//   );
// }

// resources/js/pages/companies/Companies.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  FileText,
  Globe2,
  Handshake,
  HelpCircle,
  Home,
  LayoutDashboard,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";

// MUI
import { Box, Alert, Breadcrumbs, Link as MLink, Typography } from "@mui/material";

// Local
import "../styles/companies.css";
import CompanyDetailDialog from "../components/companies/CompanyDetailDialog.jsx";
import { API_BASE, fetchJSON } from "../utils/api.js";

// import FilterPanel from "../pages/companies/Filter_panel.jsx"; // removed
import TopSearchPanelCompanies from "../pages/companies/Top_search_panel_companies.jsx";
import MainLoadPanel from "../pages/companies/Main_load_panel.jsx";

const NAV_ITEMS = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Businesses", icon: Building2, href: "/explore", active: true, badge: "46" },
  { label: "Matching", icon: Handshake, href: "/matching" },
  { label: "Investors", icon: Users, href: "/investors" },
  { label: "Verification", icon: ShieldCheck, href: "/verification" },
  { label: "Market Insights", icon: Globe2, href: "/insights" },
];

const RESEARCH_ITEMS = [
  { label: "Sector Reports", href: "/insights/sectors" },
  { label: "Regional Briefs", href: "/insights/regions" },
  { label: "Incentives", href: "/incentives" },
];

const dashboardCss = `
  :root {
    --dash-blue: #1f5fce;
    --dash-blue-dark: #123d8f;
    --dash-ink: #171b23;
    --dash-muted: #717784;
    --dash-line: #e3e7ed;
    --dash-bg: #f2f4f7;
    --dash-card: #fff;
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
  .dashboard-sidebar {
    position: fixed;
    inset: 0 auto 0 0;
    z-index: 40;
    width: 238px;
    display: flex;
    flex-direction: column;
    padding: 18px 14px 16px;
    overflow-y: auto;
    background: #fff;
    border-right: 1px solid var(--dash-line);
  }
  .sidebar-brand { display: flex; align-items: center; justify-content: space-between; padding: 0 8px 18px; }
  .brand-link { display: inline-flex; align-items: center; gap: 10px; color: #16356f; text-decoration: none; font-size: 1.15rem; }
  .brand-mark {
    display: grid;
    place-items: center;
    width: 29px;
    height: 29px;
    border-radius: 9px;
    background: linear-gradient(145deg, #3177ed, #174bac);
    box-shadow: 0 7px 16px rgba(31, 95, 206, .22);
    transform: rotate(-8deg);
  }
  .brand-mark span { width: 10px; height: 10px; border-radius: 3px 7px 3px 7px; background: #fff; }
  .side-nav { display: flex; flex-direction: column; gap: 3px; }
  .side-link {
    position: relative;
    width: 100%;
    min-height: 42px;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border: 0;
    border-radius: 9px;
    background: transparent;
    color: #434955;
    text-decoration: none;
    text-align: left;
    cursor: pointer;
    font-size: .9rem;
    font-weight: 650;
  }
  .side-link:hover { color: #194fae; background: #f4f6fa; }
  .side-link.active { color: var(--dash-blue); background: #edf3ff; }
  .side-link.active::before {
    content: "";
    position: absolute;
    left: -14px;
    width: 3px;
    height: 24px;
    border-radius: 0 4px 4px 0;
    background: var(--dash-blue);
  }
  .nav-badge { margin-left: auto; padding: 2px 7px; border-radius: 999px; color: #238560; background: #eaf7f1; font-size: .72rem; }
  .side-toggle svg:last-child { margin-left: auto; transition: transform .2s ease; }
  .side-toggle svg.rotated { transform: rotate(180deg); }
  .sub-nav { position: relative; display: grid; gap: 2px; margin: 1px 0 6px 20px; padding-left: 18px; }
  .sub-nav::before { content: ""; position: absolute; left: 2px; top: 0; bottom: 0; border-left: 1px solid #e1e5eb; }
  .sub-nav a { padding: 7px 4px; color: #69707b; text-decoration: none; font-size: .8rem; }
  .sub-nav a:hover { color: var(--dash-blue); }
  .sidebar-bottom { display: grid; gap: 3px; margin-top: auto; padding-top: 26px; }
  .upgrade-card {
    margin-top: 12px;
    padding: 16px;
    border-radius: 14px;
    color: #fff;
    background: radial-gradient(circle at 84% 14%, rgba(255,255,255,.18), transparent 30%), linear-gradient(145deg, #2c6ee2, #102d74);
    box-shadow: 0 14px 30px rgba(18, 61, 143, .2);
  }
  .upgrade-icon { display: grid; place-items: center; width: 31px; height: 31px; margin-bottom: 14px; border-radius: 9px; color: #1c58c4; background: #e9f1ff; }
  .upgrade-card strong { font-size: .88rem; }
  .upgrade-card p { margin: 6px 0 14px; color: #dbe7ff; font-size: .75rem; line-height: 1.45; }
  .upgrade-card a { display: block; padding: 8px; border-radius: 999px; color: #fff; background: #2670f0; text-align: center; text-decoration: none; font-size: .75rem; font-weight: 800; }
  .dashboard-main { min-height: 100vh; margin-left: 238px; padding: 24px 30px 34px; }
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
    background: #fff;
    color: #8a909b;
  }
  .topbar-search input { width: 100%; border: 0; outline: 0; background: transparent; color: var(--dash-ink); font-size: .82rem; }
  .topbar-button { min-height: 40px; display: inline-flex; align-items: center; justify-content: center; padding: 0 15px; border-radius: 10px; color: #fff; background: var(--dash-blue); text-decoration: none; font-size: .8rem; font-weight: 800; }
  .dashboard-hero {
    position: relative;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 24px;
    margin-bottom: 16px;
    padding: 28px 30px;
    overflow: hidden;
    border: 1px solid #1a55ba;
    border-radius: 18px;
    color: #fff;
    background: radial-gradient(circle at 86% 10%, rgba(85,164,255,.4), transparent 27%), linear-gradient(120deg, #0a2861, #174d9f 58%, #246bd5);
    box-shadow: 0 14px 34px rgba(15, 52, 119, .14);
  }
  .dashboard-hero::after { content: ""; position: absolute; right: -80px; bottom: -180px; width: 360px; height: 360px; border: 1px solid rgba(255,255,255,.14); border-radius: 50%; }
  .hero-copy { position: relative; z-index: 1; max-width: 720px; }
  .hero-kicker { display: inline-flex; align-items: center; gap: 7px; margin-bottom: 10px; color: #cde0ff; font-size: .74rem; font-weight: 850; letter-spacing: .08em; text-transform: uppercase; }
  .dashboard-hero h2 { margin: 0 0 9px; font-size: clamp(2rem, 4vw, 3.25rem); line-height: 1; letter-spacing: -.05em; }
  .dashboard-hero p { max-width: 660px; margin: 0; color: #d9e8ff; font-size: .94rem; line-height: 1.6; }
  .hero-count { position: relative; z-index: 1; min-width: 132px; padding: 13px 15px; border: 1px solid rgba(255,255,255,.2); border-radius: 13px; background: rgba(255,255,255,.1); backdrop-filter: blur(8px); }
  .hero-count strong, .hero-count span { display: block; }.hero-count strong { font-size: 1.7rem; }.hero-count span { margin-top: 2px; color: #d9e8ff; font-size: .7rem; }
  .dashboard-content { display: grid; gap: 16px; }
  .dashboard-panel { border: 1px solid var(--dash-line); border-radius: 17px; background: #fff; box-shadow: 0 2px 5px rgba(25,35,50,.025); }
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
    border: 1px solid #dce6f7;
    border-radius: 14px;
    background: linear-gradient(110deg, #f7faff 0%, #fff 64%);
  }
  .sector-status::before {
    content: "";
    position: absolute;
    inset: 0 auto 0 0;
    width: 4px;
    background: linear-gradient(180deg, #3478ea, #174ca8);
  }
  .sector-status-icon {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: 12px;
    color: #fff;
    background: linear-gradient(145deg, #3478ea, #174ca8);
    box-shadow: 0 8px 18px rgba(31, 95, 206, .2);
  }
  .sector-status-copy { min-width: 0; }
  .sector-status-eyebrow {
    display: block;
    margin-bottom: 3px;
    color: #6f7e95;
    font-size: .65rem;
    font-weight: 850;
    letter-spacing: .1em;
    text-transform: uppercase;
  }
  .sector-status h3 {
    margin: 0;
    color: #17213a;
    font-size: 1.05rem;
    letter-spacing: -.02em;
  }
  .sector-status p {
    margin: 4px 0 0;
    color: #707887;
    font-size: .78rem;
    line-height: 1.45;
  }
  .sector-status-badge {
    padding: 6px 10px;
    border: 1px solid #d9e5fb;
    border-radius: 999px;
    color: #245ab5;
    background: #edf4ff;
    font-size: .68rem;
    font-weight: 850;
    white-space: nowrap;
  }
  .mobile-menu-button, .sidebar-close, .sidebar-scrim { display: none; }
  .sr-only { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
  @media (max-width: 840px) {
    .dashboard-sidebar { transform: translateX(-105%); transition: transform .22s ease; box-shadow: 18px 0 50px rgba(20,30,45,.18); }
    .dashboard-sidebar.is-open { transform: translateX(0); }
    .sidebar-close { display: grid; place-items: center; border: 0; background: transparent; color: #59606b; cursor: pointer; }
    .sidebar-scrim { position: fixed; inset: 0; z-index: 30; display: block; border: 0; background: rgba(15,23,42,.36); }
    .mobile-menu-button { position: fixed; top: 16px; left: 16px; z-index: 25; display: grid; place-items: center; width: 40px; height: 40px; border: 1px solid var(--dash-line); border-radius: 10px; background: #fff; color: #1d4e9e; box-shadow: 0 5px 16px rgba(20,30,45,.08); cursor: pointer; }
    .dashboard-main { margin-left: 0; padding: 18px; }
    .dashboard-topbar { padding-left: 51px; }
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

function BrandMark() {
  return <span className="brand-mark" aria-hidden="true"><span /></span>;
}

function ascii(s) {
  return (s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/’/g, "'")
    .trim();
}

function lowerAscii(s) {
  return ascii(s).toLowerCase();
}

const COUNTRY_ALIASES = new Map([
  ["côte d’ivoire", "Cote d'Ivoire"],
  ["cote d’ivoire", "Cote d'Ivoire"],
  ["côte d'ivoire", "Cote d'Ivoire"],
  ["dr congo", "Democratic Republic of the Congo"],
  ["drc", "Democratic Republic of the Congo"],
  ["congo-kinshasa", "Democratic Republic of the Congo"],
  ["democratic republic of congo", "Democratic Republic of the Congo"],
  ["republic of congo", "Republic of the Congo"],
  ["congo-brazzaville", "Republic of the Congo"],
  ["são tome and príncipe", "Sao Tome and Principe"],
  ["sao tome & principe", "Sao Tome and Principe"],
  ["western sahara", "Sahrawi Arab Democratic Republic"],
  ["eswatini (swaziland)", "Eswatini"],
]);

function canonicalizeCountry(input) {
  if (!input) return "";
  const key = lowerAscii(input);
  if (COUNTRY_ALIASES.has(key)) return COUNTRY_ALIASES.get(key);
  return ascii(input);
}

function normalizeCompany(c) {
  if (!c) return {};

  const rawStatus = c.VerificationStatus ?? c.verification_status ?? "";
  const statusStr = String(rawStatus).trim().toLowerCase();
  const isVerified = /\bverified\b/.test(statusStr) || !!c.Verified;

  return {
    id: c.Id ?? c.id ?? c.ID ?? null,
    name: c.CompanyName ?? c.company_name ?? "—",
    sector: c.Sector ?? c.sector ?? "",
    country: c.Country ?? c.country ?? "",
    city: c.City ?? c.city ?? "",
    stage: c.Stage ?? c.stage ?? "",
    verified: isVerified,
    verification_status: statusStr,
    cti: {
      tier: c.CTI_Tier ?? c.cti_tier ?? "",
      score: c.CTI_Score ?? c.cti_score ?? "",
    },
    logo_url: c.logo_url ?? c.site_image_url ?? null,
  };
}

function groupByCountry(items) {
  const groups = new Map();

  items.forEach((x) => {
    const key = (x.country || "Unspecified country").trim() || "Unspecified country";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(x);
  });

  const out = Array.from(groups.entries()).sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  out.forEach(([_, arr]) =>
    arr.sort((u, v) => (u.name || "").localeCompare(v.name || ""))
  );

  return out;
}

function groupBySector(items) {
  const groups = new Map();

  items.forEach((x) => {
    const key = (x.sector || "Unspecified sector").trim() || "Unspecified sector";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(x);
  });

  const out = Array.from(groups.entries()).sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  out.forEach(([_, arr]) =>
    arr.sort((u, v) => (u.name || "").localeCompare(v.name || ""))
  );

  return out;
}

function groupByCountryAndSector(items) {
  const countryMap = new Map();

  items.forEach((c) => {
    const country = (c.country || "Unspecified country").trim() || "Unspecified country";
    const sector = (c.sector || "Unspecified sector").trim() || "Unspecified sector";

    if (!countryMap.has(country)) countryMap.set(country, new Map());

    const sectorMap = countryMap.get(country);
    if (!sectorMap.has(sector)) sectorMap.set(sector, []);
    sectorMap.get(sector).push(c);
  });

  const countries = Array.from(countryMap.entries()).sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  return countries.map(([countryName, sectorMap]) => {
    const sectors = Array.from(sectorMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([sectorName, companies]) => ({
        sector: sectorName,
        companies: companies
          .slice()
          .sort((u, v) => (u.name || "").localeCompare(v.name || "")),
      }));

    return { country: countryName, sectors };
  });
}

export default function Companies() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [researchOpen, setResearchOpen] = useState(true);
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

  const [q, setQ] = useState("");
  const [sector, setSector] = useState("");
  const [country, setCountry] = useState("");
  const [verified, setVerified] = useState(false);
  const [localFilter, setLocalFilter] = useState("");

  const [companies, setCompanies] = useState([]);
  const [sectorOptions, setSectorOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(10);
  const [error, setError] = useState("");
  const [fromParam, setFromParam] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    const qs = new URLSearchParams(window.location.search);

    const qParam = (qs.get("q") || qs.get("search") || qs.get("keyword") || "").trim();
    const sectorParam = (qs.get("sector") || "").trim();
    const countryParam = canonicalizeCountry(qs.get("country") || "");
    const pageParam = parseInt(qs.get("page") || "1", 10);
    const verifiedParam = qs.get("verified") || qs.get("verification");
    const from = (qs.get("from") || "").toLowerCase();

    if (qParam) setQ(qParam);
    if (sectorParam) setSector(sectorParam);
    if (countryParam) setCountry(countryParam);
    if (!Number.isNaN(pageParam) && pageParam > 0) setPage(pageParam);
    if (verifiedParam === "1" || verifiedParam === "true" || verifiedParam === "ON") {
      setVerified(true);
    }

    setFromParam(from);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadOptions() {
      try {
        const [sectorRes, countryRes] = await Promise.all([
          fetchJSON(`${API_BASE}/business-sectors`).catch(() => null),
          fetchJSON(`${API_BASE}/countries`).catch(() => null),
        ]);

        if (cancelled) return;

        if (sectorRes && Array.isArray(sectorRes.data)) {
          const list = sectorRes.data
            .map((s) => s.title || s.sector_name || s.name)
            .filter(Boolean)
            .sort();

          setSectorOptions(list);
        }

        if (countryRes && Array.isArray(countryRes.data)) {
          const list = countryRes.data
            .map((c) => c.country_name || c.name)
            .filter(Boolean)
            .sort();

          setCountryOptions(list);
        }
      } catch (e) {
        console.error("Filter options error", e);
      }
    }

    loadOptions();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!loading) {
      setProgress(100);
      return;
    }

    setProgress(10);

    const id = setInterval(() => {
      setProgress((p) => (p < 90 ? p + 10 : p));
    }, 200);

    return () => clearInterval(id);
  }, [loading]);

  const isAllInputsEmpty = !q && !sector && !country && !verified && !localFilter.trim();
  const hasAnyFilter = !!(q || sector || country || verified);

  useEffect(() => {
    let cancelled = false;

    async function loadCompanies() {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();
        params.set("page", String(page));

        if (q) params.set("q", q);
        if (sector) params.set("sector", sector);
        if (country) params.set("country", country);
        if (verified) params.set("verified", "1");

        const url = `${API_BASE}/companies?${params.toString()}`;
        const js = await fetchJSON(url);

        if (cancelled) return;

        let payload = js.data;
        let list = [];

        if (payload && Array.isArray(payload.data)) {
          list = payload.data;
        } else if (Array.isArray(payload)) {
          list = payload;
          payload = { current_page: page, last_page: 1, total: payload.length };
        } else if (Array.isArray(js)) {
          list = js;
          payload = { current_page: page, last_page: 1, total: js.length };
        }

        const normalized = list.map(normalizeCompany);

        setCompanies(normalized);
        setPage(payload.current_page || 1);
        setTotalPages(payload.last_page || 1);
        setTotal(payload.total || normalized.length || 0);

        const qp = new URLSearchParams();

        if (page > 1) qp.set("page", String(page));
        if (q) qp.set("q", q);
        if (sector) qp.set("sector", sector);
        if (country) qp.set("country", country);
        if (verified) qp.set("verified", "1");
        if (fromParam) qp.set("from", fromParam);

        const qs = qp.toString();
        const newUrl = window.location.pathname + (qs ? `?${qs}` : "");

        window.history.replaceState(null, "", newUrl);
      } catch (e) {
        if (cancelled) return;
        console.error(e);
        setError(`Failed to load companies: ${e.message}`);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadCompanies();

    return () => {
      cancelled = true;
    };
  }, [page, q, sector, country, verified, fromParam]);

  const visibleCompanies = useMemo(() => {
    let list = companies;

    if (verified) {
      list = list.filter((c) => c.verified);
    }

    if (!q && localFilter.trim()) {
      const term = localFilter.trim().toLowerCase();
      list = list.filter((c) => (c.name || "").toLowerCase().includes(term));
    }

    return list;
  }, [companies, verified, q, localFilter]);

  const shouldGroupBySector = useMemo(
    () => !q && !!country && !sector && !isAllInputsEmpty,
    [q, country, sector, isAllInputsEmpty]
  );

  const flatGrouped = useMemo(
    () =>
      shouldGroupBySector
        ? groupBySector(visibleCompanies)
        : groupByCountry(visibleCompanies),
    [visibleCompanies, shouldGroupBySector]
  );

  const nestedGrouped = useMemo(
    () => (isAllInputsEmpty ? groupByCountryAndSector(visibleCompanies) : []),
    [isAllInputsEmpty, visibleCompanies]
  );

  const hasResults = isAllInputsEmpty
    ? nestedGrouped.length > 0
    : flatGrouped.length > 0;

  const pageNumbers = useMemo(() => {
    const pages = [];
    const max = 7;

    if (totalPages <= max) {
      for (let i = 1; i <= totalPages; i += 1) pages.push(i);
    } else {
      let start = Math.max(1, page - 2);
      let end = Math.min(totalPages, page + 2);

      if (start === 1) end = 5;
      if (end === totalPages) start = totalPages - 4;

      for (let i = start; i <= end; i += 1) pages.push(i);
    }

    return pages;
  }, [page, totalPages]);

  const goToPage = (n) => setPage(n);
  const goPrev = () => page > 1 && setPage(page - 1);
  const goNext = () => page < totalPages && setPage(page + 1);

  const { backHref } = useMemo(() => {
    function baseFor(from) {
      switch (from) {
        case "services":
          return { href: "/services" };
        case "insights":
          return { href: "/insights" };
        case "verification":
          return { href: "/verification" };
        case "matching":
          return { href: "/matching" };
        case "policy":
          return { href: "/incentives" };
        case "whitespace":
          return { href: "/whitespace" };
        case "explore":
        default:
          return { href: "/explore" };
      }
    }

    const dest = baseFor(fromParam || "explore");
    const p = new URLSearchParams();

    if (q) p.set("q", q);
    if (sector) p.set("sector", sector);
    if (country) p.set("country", country);
    if (verified) p.set("verified", "1");

    const extra = p.toString();

    return {
      backHref: dest.href + (extra ? `?${extra}` : ""),
    };
  }, [fromParam, q, sector, country, verified]);

  const onClearFilters = () => {
    setQ("");
    setSector("");
    setCountry("");
    setVerified(false);
    setLocalFilter("");
    setPage(1);
  };

  const openDetailDialog = (company) => {
    setSelectedCompany(company);
    setDialogOpen(true);
  };

  const closeSidebar = () => setSidebarOpen(false);
  const resultLabel = loading
    ? "Loading companies"
    : `${total.toLocaleString()} ${total === 1 ? "company" : "companies"}`;

  return (
    <div className="dashboard-shell companies-dashboard">
      <style>{dashboardCss}</style>

      <button
        className="mobile-menu-button"
        type="button"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open navigation"
      >
        <Menu size={21} />
      </button>

      {sidebarOpen ? (
        <button
          className="sidebar-scrim"
          type="button"
          aria-label="Close navigation"
          onClick={closeSidebar}
        />
      ) : null}

      <aside className={`dashboard-sidebar ${sidebarOpen ? "is-open" : ""}`}>
        <div className="sidebar-brand">
          <a href="/" className="brand-link" aria-label="Raymoch home">
            <BrandMark />
            <strong>Raymoch</strong>
          </a>
          <button
            className="sidebar-close"
            type="button"
            onClick={closeSidebar}
            aria-label="Close navigation"
          >
            <X size={19} />
          </button>
        </div>

        <nav className="side-nav" aria-label="Main navigation">
          {NAV_ITEMS.map(({ label, icon: Icon, href, active, badge }) => (
            <a
              key={label}
              className={`side-link ${active ? "active" : ""}`}
              href={href}
              onClick={closeSidebar}
            >
              <Icon size={18} />
              <span>{label}</span>
              {badge ? <span className="nav-badge">{badge}</span> : null}
            </a>
          ))}

          <button
            className="side-link side-toggle"
            type="button"
            onClick={() => setResearchOpen((current) => !current)}
            aria-expanded={researchOpen}
          >
            <FileText size={18} />
            <span>Research</span>
            <ChevronDown className={researchOpen ? "rotated" : ""} size={16} />
          </button>

          {researchOpen ? (
            <div className="sub-nav">
              {RESEARCH_ITEMS.map((item) => (
                <a key={item.label} href={item.href} onClick={closeSidebar}>
                  {item.label}
                </a>
              ))}
            </div>
          ) : null}
        </nav>

        <div className="sidebar-bottom">
          <a className="side-link" href="/services">
            <BriefcaseBusiness size={18} />
            <span>Services</span>
          </a>
          <a className="side-link" href="/settings">
            <Settings size={18} />
            <span>Settings</span>
          </a>
          <a className="side-link" href="/support">
            <HelpCircle size={18} />
            <span>Help &amp; Support</span>
          </a>

          <div className="upgrade-card">
            <div className="upgrade-icon"><Sparkles size={18} /></div>
            <strong>Unlock premium insight</strong>
            <p>Access deeper market signals and unlimited company comparisons.</p>
            {/* <a href="/request-trial">Request a free trial</a> */}
          </div>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="dashboard-heading">
            <p>Verified company directory</p>
            <h1>Companies</h1>
          </div>

          <div className="topbar-actions">
            <form className="topbar-search" action="/companies" role="search">
              <Search size={17} aria-hidden="true" />
              <label className="sr-only" htmlFor="company-topbar-search">Search companies</label>
              <input
                id="company-topbar-search"
                name="q"
                type="search"
                defaultValue={q}
                placeholder="Search companies…"
              />
            </form>
            {/* <a className="topbar-button" href="/request-trial">Request trial</a> */}
          </div>
        </header>

        <section className="dashboard-hero" aria-labelledby="companies-title">
          <div className="hero-copy">
            <span className="hero-kicker"><ShieldCheck size={15} /> Trusted company intelligence</span>
            <h2 id="companies-title">Companies</h2>
            <p>
              Filter and browse African businesses by country, sector, and
              verification status, then open a complete company profile from one workspace.
            </p>
          </div>
          <div className="hero-count" aria-live="polite">
            <strong>{loading ? "—" : total.toLocaleString()}</strong>
            <span>{loading ? "loading directory" : "matching companies"}</span>
          </div>
        </section>

      <Box className="dashboard-content">
        <Box className="dashboard-panel breadcrumbs-panel">
          <Breadcrumbs aria-label="breadcrumb" separator="›">
            <MLink color="inherit" underline="hover" href={ROUTES.home} sx={{ fontSize: 13 }}>
              Home
            </MLink>

            <MLink color="inherit" underline="hover" href={backHref} sx={{ fontSize: 13 }}>
              Explore businesses
            </MLink>

            <Typography color="text.primary" sx={{ fontSize: 13, fontWeight: 600 }}>
              Companies
            </Typography>
          </Breadcrumbs>
        </Box>

        <section className="dashboard-panel directory-summary" aria-label="Directory status">
          <div>
            <span className="summary-label">Current view</span>
            <h2>{isAllInputsEmpty ? "All companies" : "Filtered companies"}</h2>
            <p>
              {isAllInputsEmpty
                ? "Showing companies across all countries and sectors."
                : "Showing companies that match your active filters."}
            </p>
          </div>
          <span className="result-count" role="status" aria-live="polite">{resultLabel}</span>
        </section>

        {error && (
          <Box sx={{ my: 1 }}>
            <Alert severity="error" variant="filled">
              {error}
            </Alert>
          </Box>
        )}

        <section className="dashboard-panel workspace-panel search-workspace" aria-labelledby="company-filters-title">
          <div className="panel-heading">
            <div>
              <span>Directory filters</span>
              <h2 id="company-filters-title">Refine your company search</h2>
            </div>
            <p>Use one or more filters to narrow the directory.</p>
          </div>

          <TopSearchPanelCompanies
          q={q}
          setQ={setQ}
          sector={sector}
          setSector={setSector}
          country={country}
          setCountry={setCountry}
          verified={verified}
          setVerified={setVerified}
          localFilter={localFilter}
          setLocalFilter={setLocalFilter}
          sectorOptions={sectorOptions}
          countryOptions={countryOptions}
          hasAnyFilter={hasAnyFilter}
          onClearFilters={onClearFilters}
          setPage={setPage}
          />
        </section>

        <section className="dashboard-panel workspace-panel results-workspace" aria-labelledby="company-results-title">
          <div className="panel-heading">
            <div>
              <span>Company directory</span>
              <h2 id="company-results-title">Browse profiles</h2>
            </div>
            <p>Open a company to review its complete profile.</p>
          </div>

          <MainLoadPanel
          loading={loading}
          progress={progress}
          hasResults={hasResults}
          isAllInputsEmpty={isAllInputsEmpty}
          nestedGrouped={nestedGrouped}
          flatGrouped={flatGrouped}
          shouldGroupBySector={shouldGroupBySector}
          verified={verified}
          openDetailDialog={openDetailDialog}
          totalPages={totalPages}
          page={page}
          total={total}
          pageNumbers={pageNumbers}
          goToPage={goToPage}
          goPrev={goPrev}
          goNext={goNext}
          />
        </section>
      </Box>
      </main>

      <CompanyDetailDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        company={selectedCompany}
      />

      <style>{`
        .companies-dashboard .dashboard-content { display: grid; gap: 16px; }
        .companies-dashboard .breadcrumbs-panel { padding: 8px 14px; }
        .companies-dashboard .directory-summary {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding: 18px 20px;
          border-left: 4px solid var(--dash-blue);
          background: linear-gradient(110deg, #f7faff 0%, #fff 66%);
        }
        .companies-dashboard .summary-label {
          display: block;
          margin-bottom: 4px;
          color: var(--dash-blue);
          font-size: .66rem;
          font-weight: 900;
          letter-spacing: .1em;
          text-transform: uppercase;
        }
        .companies-dashboard .directory-summary h2 { margin: 0; font-size: 1.08rem; }
        .companies-dashboard .directory-summary p { margin: 4px 0 0; color: var(--dash-muted); font-size: .78rem; }
        .companies-dashboard .result-count {
          display: inline-flex;
          align-items: center;
          min-height: 30px;
          padding: 5px 10px;
          border: 1px solid #d9e5fb;
          border-radius: 999px;
          color: #245ab5;
          background: #edf4ff;
          font-size: .72rem;
          font-weight: 850;
          white-space: nowrap;
        }
        .companies-dashboard .workspace-panel { padding: 18px; }
        .companies-dashboard .panel-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 14px;
        }
        .companies-dashboard .panel-heading span { display: block; margin-bottom: 5px; color: var(--dash-blue); font-size: .68rem; font-weight: 900; letter-spacing: .1em; text-transform: uppercase; }
        .companies-dashboard .panel-heading h2 { margin: 0; font-size: 1.12rem; letter-spacing: -.025em; }
        .companies-dashboard .panel-heading p { margin: 0; color: var(--dash-muted); font-size: .75rem; }
        .companies-dashboard .results-workspace > :last-child,
        .companies-dashboard .search-workspace > :last-child { max-width: 100%; }
        @media (max-width: 640px) {
          .companies-dashboard .directory-summary { align-items: flex-start; flex-direction: column; }
          .companies-dashboard .panel-heading { align-items: flex-start; flex-direction: column; }
        }
      `}</style>
    </div>
  );
}
