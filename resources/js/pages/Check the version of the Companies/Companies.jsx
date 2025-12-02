// resources/js/pages/Companies.jsx
import React, { useEffect, useMemo, useState } from "react";

// Layout
import Header from "../components/layout_master/Header.jsx";
import Footer from "../components/layout_master/Footer.jsx";

// Material UI
import {
  Box,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  CircularProgress,
  Tooltip,
  Fade,
  Typography,
  Stack,
  Autocomplete,
  Alert,
  Breadcrumbs,
  Link as MLink,
  Chip,
  Dialog,
  DialogContent,
  Tabs,
  Tab,
  Divider,
  Slide,
  IconButton,
} from "@mui/material";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

/* --------- SHARED CSS ---------- */
const css = `
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
  padding:22px 12px 16px;
}
.explore-hero h1{
  font-size:36px;
  font-weight:900;
  line-height:1.06;
  color:#0A2A6B;
  margin:0 0 4px;
}
.explore-hero p{
  color:#667085;
  margin:0;
}

/* FILTER PANEL */
.panel{
  background:#fff;
  border:1px solid var(--border);
  box-shadow:var(--shadow);
  border-radius:20px;
  padding:14px;
  margin:12px auto 18px;
}
.tier{
  display:flex;
  align-items:center;
  gap:10px;
}
.tier-1{
  display:flex;
  flex-direction:row;
  align-items:center;
  gap:10px;
  width:100%;
}
@media (max-width: 680px){
  .tier-1{
    flex-wrap:wrap;
  }
}

/* GRID */
.grid{
  display:grid;
  grid-template-columns:repeat(auto-fit, minmax(260px,1fr));
  gap:14px;
  margin-top:10px;
}

/* CARD */
.card{
  background:#ffffff;
  border:1px solid var(--border);
  border-radius:16px;
  box-shadow:var(--shadow);
  padding:14px;
  min-height:96px;
  cursor:pointer;
  text-align:left;
  display:block;
  position:relative;
  transition:
    transform .16s ease,
    background-color .16s ease,
    border-color .16s ease,
    box-shadow .16s ease,
    color .16s ease;
}
.card h3,.card p{
  color:#0A2A6B;
  transition: color .18s ease;
}
.card:hover{
  animation: card-bounce 0.25s ease-out 1;
  background:#1976d2;
  border-color:#1565c0;
  box-shadow:0 14px 34px rgba(21,101,192,.40);
}
.card:hover h3,.card:hover p{
  color:#ffffff !important;
}
@keyframes card-bounce {
  0%   { transform: translateY(0) scale(1); }
  30%  { transform: translateY(-3px) scale(1.02); }
  60%  { transform: translateY(1px) scale(1.01); }
  100% { transform: translateY(0) scale(1); }
}
.card h3{
  font-size:1rem;
  font-weight:700;
  margin:0 0 4px;
}
.card p{
  font-size:.88rem;
  color:#6b7280;
  margin:0;
}

/* meta chips inside card */
.meta{
  margin-top:8px;
  display:flex;
  flex-wrap:wrap;
  gap:6px;
}
.pill{
  font-size:.78rem;
  border-radius:999px;
  padding:3px 10px;
  border:1px solid var(--border);
  background:#f9fafb;
}
.card:hover .pill{
  border-color:rgba(255,255,255,.38);
  background:rgba(15,23,42,.18);
  color:#f9fafb;
}

/* CTI pill color variants */
.cti-pill{
  font-weight:600;
}
.cti-gold{
  background:#fef3c7;
  border-color:#facc15;
  color:#92400e;
}
.cti-silver{
  background:#e5e7eb;
  border-color:#9ca3af;
  color:#4b5563;
}
.cti-bronze{
  background:#fce7dd;
  border-color:#fb923c;
  color:#7c2d12;
}

/* Verified badge in card top-right (BLUE) */
.verified-badge{
  position:absolute;
  top:9px;
  right:9px;
  width:22px;
  height:22px;
  border-radius:999px;
  border:2px solid #1d4ed8;
  background:#eff6ff;
  color:#1d4ed8;
  font-size:12px;
  font-weight:800;
  display:flex;
  align-items:center;
  justify-content:center;
  box-shadow:0 0 0 1px rgba(37,99,235,0.16);
}
.card:hover .verified-badge{
  background:#dbeafe;
  border-color:#1d4ed8;
  color:#1e3a8a;
}

/* Country heading */
.country-heading{
  font-weight:800;
  color:#0f172a;
  margin:18px 0 8px;
}

/* Pagination */
.pagination{
  margin-top:18px;
  display:flex;
  justify-content:center;
  gap:6px;
  flex-wrap:wrap;
}
.page-info{
  margin-top:4px;
  text-align:center;
  font-size:.82rem;
  color:#6b7280;
}

footer{
  margin-top:auto;
}
`;

/* ------------------- HELPERS ------------------- */
const API_BASE = "/api";

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

/** Normalize Company record (matching companies table case) */
function normalizeCompany(c) {
  if (!c) return {};

  const rawStatus =
    c.VerificationStatus ??
    c.verification_status ??
    "";

  const statusStr = String(rawStatus).trim().toLowerCase();

  // Only treat it as verified if the word "verified" appears as a full word
  // (e.g., "verified", "fully verified") but NOT "pending verification"
  const isVerified =
    /\bverified\b/.test(statusStr) || !!c.Verified;

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
  };
}

async function fetchJSON(url) {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  const text = await res.text();
  if (!res.ok) {
    const snippet = text ? text.slice(0, 160) : "";
    throw new Error(`HTTP ${res.status}${snippet ? ": " + snippet : ""}`);
  }
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("JSON parse error", url, e, text);
    throw new Error("Bad JSON from server");
  }
}

function groupByCountry(items) {
  const groups = new Map();
  items.forEach((x) => {
    const key =
      (x.country || "Unspecified country").trim() || "Unspecified country";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(x);
  });
  const out = Array.from(groups.entries()).sort((a, b) =>
    a[0].localeCompare(b[0])
  );
  out.forEach(([country, arr]) => {
    arr.sort((u, v) => (u.name || "").localeCompare(v.name || ""));
  });
  return out;
}

/* Small local session ID used for logs */
function getSessionId() {
  try {
    const key = "raymoch_company_detail_sid";
    let sid = window.localStorage.getItem(key);
    if (!sid) {
      sid =
        Math.random().toString(36).slice(2) + "-" + Date.now().toString(36);
      window.localStorage.setItem(key, sid);
    }
    return sid;
  } catch {
    return null;
  }
}

/* ------------------- CARD COMPONENT ------------------- */
function CompanyCard({ company, onOpen, showVerifiedBadge }) {
  const tier = company.cti?.tier || "";
  const tierLower = tier.toLowerCase();
  let tierClass = "";
  if (tierLower.includes("gold")) tierClass = "cti-gold";
  else if (tierLower.includes("silver")) tierClass = "cti-silver";
  else if (tierLower.includes("bronze")) tierClass = "cti-bronze";

  return (
    <div className="card" onClick={() => onOpen(company)}>
      {showVerifiedBadge && company.verified && (
        <Tooltip title="Verified company" arrow>
          <div className="verified-badge">V</div>
        </Tooltip>
      )}

      <h3>{company.name || "—"}</h3>
      <p>
        {company.sector || "—"} • {company.country || "—"}
      </p>
      <div className="meta">
        {company.stage && <span className="pill">Stage: {company.stage}</span>}
        {company.city && <span className="pill">{company.city}</span>}
        {tier && (
          <span className={`pill cti-pill ${tierClass}`}>
            CTI: {tier}
          </span>
        )}
      </div>
    </div>
  );
}

/* Transition for Dialog (animated on open) */
const DialogTransition = React.forwardRef(function DialogTransition(
  props,
  ref
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/* ----------------------- MAIN PAGE ----------------------- */
export default function Companies() {
  const ROUTES = useMemo(
    () => ({
      privacy: "/privacy",
      terms: "/terms",
      cookies: "/cookies",
      signup: "/signup",
      login: "/login",
      explore: "/explore-businesses",
      services: "/services",
      insights: "/insights",
      about: "/about",
      trial: "/trial",
      home: "/",
    }),
    []
  );

  // Filters
  const [q, setQ] = useState("");
  const [sector, setSector] = useState("");
  const [country, setCountry] = useState("");
  const [verified, setVerified] = useState(false);

  // Data
  const [companies, setCompanies] = useState([]);
  const [sectorOptions, setSectorOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Loading / error
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(10);
  const [error, setError] = useState("");
  const [fromParam, setFromParam] = useState("");

  // Detail dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [tabLoading, setTabLoading] = useState({});
  const [tabProgress, setTabProgress] = useState({});

  const [overviewData, setOverviewData] = useState(null);
  const [financialData, setFinancialData] = useState([]);
  const [teamData, setTeamData] = useState([]);
  const [galleryData, setGalleryData] = useState([]);
  const [documentsData, setDocumentsData] = useState([]);
  const [contactData, setContactData] = useState([]);

  /* -------- parse initial query ---------- */
  useEffect(() => {
    const qs = new URLSearchParams(window.location.search);
    const qParam = (qs.get("q") || qs.get("search") || "").trim();
    const sectorParam = (qs.get("sector") || "").trim();
    const countryParam = canonicalizeCountry(qs.get("country") || "");
    const pageParam = parseInt(qs.get("page") || "1", 10);
    const verifiedParam = qs.get("verified");
    const from = (qs.get("from") || "").toLowerCase();

    if (qParam) setQ(qParam);
    if (sectorParam) setSector(sectorParam);
    if (countryParam) setCountry(countryParam);
    if (!Number.isNaN(pageParam) && pageParam > 0) setPage(pageParam);
    if (verifiedParam === "1" || verifiedParam === "true") setVerified(true);
    setFromParam(from);
  }, []);

  /* -------- filter options ---------- */
  useEffect(() => {
    let cancelled = false;
    (async () => {
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
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  /* -------- spinner for list ---------- */
  useEffect(() => {
    if (!loading) {
      setProgress(100);
      return;
    }
    setProgress(10);
    const id = setInterval(
      () => setProgress((p) => (p < 90 ? p + 10 : p)),
      200
    );
    return () => clearInterval(id);
  }, [loading]);

  /* -------- main list load ---------- */
  useEffect(() => {
    let cancelled = false;
    async function load() {
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
          payload = {
            current_page: page,
            last_page: 1,
            total: payload.length,
          };
        } else if (Array.isArray(js)) {
          list = js;
          payload = { current_page: page, last_page: 1, total: js.length };
        }

        const normalized = list.map(normalizeCompany);
        setCompanies(normalized);
        setPage(payload.current_page || 1);
        setTotalPages(payload.last_page || 1);
        setTotal(payload.total || normalized.length || 0);

        // push filters to URL
        const qp = new URLSearchParams();
        if (page > 1) qp.set("page", String(page));
        if (q) qp.set("q", q);
        if (sector) qp.set("sector", sector);
        if (country) qp.set("country", country);
        if (verified) qp.set("verified", "1");
        if (fromParam) qp.set("from", fromParam);
        const qs = qp.toString();
        const newUrl = window.location.pathname + (qs ? "?" + qs : "");
        window.history.replaceState(null, "", newUrl);
      } catch (e) {
        if (cancelled) return;
        console.error(e);
        setError(`Failed to load companies: ${e.message}`);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [page, q, sector, country, verified, fromParam]);

  // visible companies depending on toggle
  const visibleCompanies = useMemo(() => {
    if (verified) {
      // "Verified only" ON → show only verified companies
      return companies.filter((c) => c.verified);
    }
    // Default: show only pending/unverified
    return companies.filter((c) => !c.verified);
  }, [companies, verified]);

  const grouped = useMemo(
    () => groupByCountry(visibleCompanies),
    [visibleCompanies]
  );

  const pageNumbers = useMemo(() => {
    const pages = [];
    const max = 7;
    if (totalPages <= max) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, page - 2);
      let end = Math.min(totalPages, page + 2);
      if (start === 1) end = 5;
      if (end === totalPages) start = totalPages - 4;
      for (let i = start; i <= end; i++) pages.push(i);
    }
    return pages;
  }, [page, totalPages]);

  /* -------- back/breadcrumb ---------- */
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
          return { href: "/explore-businesses" };
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
      backHref: dest.href + (extra ? "?" + extra : ""),
    };
  }, [fromParam, q, sector, country, verified]);

  const hasAnyFilter = !!(q || sector || country || verified);

  /* -------- list handlers ---------- */
  const onClear = () => {
    setQ("");
    setSector("");
    setCountry("");
    setVerified(false);
    setPage(1);
  };
  const goToPage = (n) => setPage(n);
  const goPrev = () => page > 1 && setPage(page - 1);
  const goNext = () => page < totalPages && setPage(page + 1);

  /* -------- detail dialog load helpers ---------- */
  const startTabLoading = (tab) => {
    setTabLoading((prev) => ({ ...prev, [tab]: true }));
    setTabProgress((prev) => ({ ...prev, [tab]: 10 }));
    const id = window.setInterval(() => {
      setTabProgress((prev) => {
        const cur = prev[tab] ?? 10;
        return { ...prev, [tab]: cur < 90 ? cur + 10 : cur };
      });
    }, 130);
    return id;
  };

  const stopTabLoading = (tab, intervalId) => {
    window.clearInterval(intervalId);
    setTabProgress((prev) => ({ ...prev, [tab]: 100 }));
    setTabLoading((prev) => ({ ...prev, [tab]: false }));
  };

  const loadTabData = async (tab, company) => {
    if (!company) return;
    const sid = getSessionId();
    const base = `${API_BASE}/companies/${company.id}`;
    const qs = sid ? `?session_id=${encodeURIComponent(sid)}` : "";
    let url = "";
    let already;

    if (tab === "overview") {
      already = overviewData && overviewData.id === company.id;
      url = `${base}/overview${qs}`;
    } else if (tab === "financials") {
      already = financialData.length && selectedCompany?.id === company.id;
      url = `${base}/financials${qs}`;
    } else if (tab === "team") {
      already = teamData.length && selectedCompany?.id === company.id;
      url = `${base}/team${qs}`;
    } else if (tab === "gallery") {
      already = galleryData.length && selectedCompany?.id === company.id;
      url = `${base}/gallery${qs}`;
    } else if (tab === "documents") {
      already = documentsData.length && selectedCompany?.id === company.id;
      url = `${base}/documents${qs}`;
    } else if (tab === "contact") {
      already = contactData.length && selectedCompany?.id === company.id;
      url = `${base}/contact${qs}`;
    }

    if (already) return;

    const intervalId = startTabLoading(tab);
    try {
      const js = await fetchJSON(url);
      if (tab === "overview") setOverviewData(js.data || null);
      if (tab === "financials") setFinancialData(js.data || []);
      if (tab === "team") setTeamData(js.data || []);
      if (tab === "gallery") setGalleryData(js.data || []);
      if (tab === "documents") setDocumentsData(js.data || []);
      if (tab === "contact") setContactData(js.data || []);
    } catch (e) {
      console.error("Tab load error", tab, e);
    } finally {
      stopTabLoading(tab, intervalId);
    }
  };

  const openDetailDialog = (company) => {
    setSelectedCompany(company);
    setDialogOpen(true);
    setActiveTab("overview");
    setOverviewData(null);
    setFinancialData([]);
    setTeamData([]);
    setGalleryData([]);
    setDocumentsData([]);
    setContactData([]);
    loadTabData("overview", company);
  };

  const handleTabChange = (e, newValue) => {
    setActiveTab(newValue);
    if (selectedCompany) {
      loadTabData(newValue, selectedCompany);
    }
  };

  /* ---------------- RENDER ---------------- */
  return (
    <div className="page">
      <style>{css}</style>
      <Header routes={ROUTES} />

      <div className="container">
        <Box sx={{ mb: 1 }}>
          <Breadcrumbs aria-label="breadcrumb" separator="›">
            <MLink
              color="inherit"
              underline="hover"
              href={ROUTES.home}
              sx={{ fontSize: 13 }}
            >
              Home
            </MLink>
            <MLink
              color="inherit"
              underline="hover"
              href={backHref}
              sx={{ fontSize: 13 }}
            >
              Explore businesses
            </MLink>
            <Typography
              color="text.primary"
              sx={{ fontSize: 13, fontWeight: 600 }}
            >
              Companies
            </Typography>
          </Breadcrumbs>
        </Box>

        <header className="explore-hero">
          <h1>Companies</h1>
          <p>Filter and browse companies by country, sector, and verification.</p>
        </header>

        {error && (
          <Box sx={{ my: 1 }}>
            <Alert severity="error" variant="filled">
              {error}
            </Alert>
          </Box>
        )}

        {/* FILTER PANEL */}
        <div className="panel">
          <div className="tier tier-1">
            <TextField
              fullWidth
              size="medium"
              label="Search companies..."
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  setPage(1);
                }
              }}
            />

            <Autocomplete
              fullWidth
              size="medium"
              options={sectorOptions}
              value={sector || null}
              onChange={(_, v) => {
                setSector(v || "");
                setPage(1);
              }}
              renderInput={(params) => (
                <TextField {...params} label="All sectors" fullWidth />
              )}
              clearOnEscape
            />

            <Autocomplete
              fullWidth
              size="medium"
              options={countryOptions}
              value={country || null}
              onChange={(_, v) => {
                setCountry(v || "");
                setPage(1);
              }}
              renderInput={(params) => (
                <TextField {...params} label="All countries" fullWidth />
              )}
              clearOnEscape
            />

            <FormControlLabel
              control={
                <Switch
                  checked={verified}
                  onChange={(e) => {
                    setVerified(e.target.checked);
                    setPage(1);
                  }}
                />
              }
              label="Verified only"
            />

            <Button variant="outlined" size="small" onClick={onClear}>
              Clear
            </Button>
          </div>

          {hasAnyFilter && (
            <Box
              sx={{
                mt: 1.5,
                p: 1.2,
                borderRadius: 2,
                bgcolor: "#f9fafb",
                border: "1px dashed #d0d7e2",
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                flexWrap="wrap"
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: "text.secondary", mr: 0.5 }}
                >
                  Active filters:
                </Typography>
                {q && (
                  <Chip
                    size="small"
                    label={`Search: "${q}"`}
                    onDelete={() => {
                      setQ("");
                      setPage(1);
                    }}
                  />
                )}
                {sector && (
                  <Chip
                    size="small"
                    label={`Sector: ${sector}`}
                    onDelete={() => {
                      setSector("");
                      setPage(1);
                    }}
                  />
                )}
                {country && (
                  <Chip
                    size="small"
                    label={`Country: ${country}`}
                    onDelete={() => {
                      setCountry("");
                      setPage(1);
                    }}
                  />
                )}
                {verified && (
                  <Chip
                    size="small"
                    label="Verified only"
                    onDelete={() => {
                      setVerified(false);
                      setPage(1);
                    }}
                  />
                )}
                <Button
                  size="small"
                  variant="text"
                  onClick={onClear}
                  sx={{ ml: 0.5, textTransform: "none" }}
                >
                  Clear all
                </Button>
              </Stack>
            </Box>
          )}
        </div>

        {/* LOADING SPINNER */}
        {loading && (
          <Box sx={{ my: 3, textAlign: "center" }}>
            <Box sx={{ position: "relative", display: "inline-flex" }}>
              <CircularProgress variant="determinate" value={progress} />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: "absolute",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography variant="caption" component="div">
                  {`${Math.round(progress)}%`}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        {/* GRID */}
        {!loading && (
          <>
            {grouped.length === 0 ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1.5 }}
              >
                No results.
              </Typography>
            ) : (
              grouped.map(([countryName, arr]) => (
                <section key={countryName}>
                  <h2 className="country-heading">{countryName}</h2>
                  <div className="grid">
                    {arr.map((c) => (
                      <Tooltip
                        key={c.id}
                        title={c.name}
                        arrow
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 200 }}
                      >
                        <Box>
                          <CompanyCard
                            company={c}
                            onOpen={openDetailDialog}
                            showVerifiedBadge={verified}
                          />
                        </Box>
                      </Tooltip>
                    ))}
                  </div>
                </section>
              ))
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ mt: 3, textAlign: "center" }}>
                <Stack
                  direction="row"
                  spacing={1}
                  justifyContent="center"
                  flexWrap="wrap"
                  className="pagination"
                  sx={{ mb: 1 }}
                >
                  <Button
                    size="small"
                    onClick={() => goToPage(1)}
                    disabled={page === 1}
                  >
                    «
                  </Button>
                  <Button size="small" onClick={goPrev} disabled={page === 1}>
                    ‹
                  </Button>
                  {pageNumbers.map((n) => (
                    <Button
                      key={n}
                      size="small"
                      variant={n === page ? "contained" : "outlined"}
                      onClick={() => goToPage(n)}
                    >
                      {n}
                    </Button>
                  ))}
                  <Button
                    size="small"
                    onClick={goNext}
                    disabled={page === totalPages}
                  >
                    ›
                  </Button>
                  <Button
                    size="small"
                    onClick={() => goToPage(totalPages)}
                    disabled={page === totalPages}
                  >
                    »
                  </Button>
                </Stack>
                <div className="page-info">
                  Page {page} / {totalPages} • {total} total
                </div>
              </Box>
            )}
          </>
        )}
      </div>

      {/* DETAIL DIALOG */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="lg"
        TransitionComponent={DialogTransition}
        PaperProps={{
          sx: {
            borderRadius: 3,        // rounded edges
            overflow: "hidden",     // keeps header/content nicely clipped
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {/* Top header bar like screenshot */}
          <Box
            sx={{
              px: 3,
              py: 2,
              borderBottom: "1px solid #eef0f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              bgcolor: "#ffffff",
            }}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 900, display: "flex", alignItems: "center" }}
              >
                {overviewData?.CompanyName ||
                  selectedCompany?.name ||
                  "Loading..."}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {overviewData?.Sector || selectedCompany?.sector || "—"} •{" "}
                {overviewData?.Country || selectedCompany?.country || "—"}
              </Typography>
            </Box>

            <Stack direction="row" spacing={1} alignItems="center">
              <Button variant="outlined" size="small">
                All Companies
              </Button>
              <Button variant="contained" size="small">
                Request intro
              </Button>
              <Button variant="outlined" size="small">
                Save
              </Button>
              <Button variant="outlined" size="small">
                Share
              </Button>

              {/* Info icon at top-right with hover tooltip */}
              <Tooltip
                title="This panel shows detailed information about the selected company, including overview, financials, team, gallery, documents, and contact details."
                arrow
                placement="left"
              >
                <IconButton
                  size="small"
                  sx={{
                    ml: 0.5,
                    color: "text.secondary",
                    "&:hover": { color: "primary.main" },
                  }}
                >
                  <InfoOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              px: 3,
              borderBottom: "1px solid #eef0f6",
              bgcolor: "#f8f9ff",
            }}
          >
            <Tab label="Overview" value="overview" />
            <Tab label="Financials" value="financials" />
            <Tab label="Team" value="team" />
            <Tab label="Gallery" value="gallery" />
            <Tab label="Documents" value="documents" />
            <Tab label="Contact" value="contact" />
          </Tabs>

          {/* Tab content */}
          <Box sx={{ p: 3, bgcolor: "#f5f6fb" }}>
            {/* Common spinner for tab */}
            {tabLoading[activeTab] && (
              <Box sx={{ textAlign: "center", my: 2 }}>
                <Box sx={{ position: "relative", display: "inline-flex" }}>
                  <CircularProgress
                    variant="determinate"
                    value={tabProgress[activeTab] ?? 10}
                  />
                  <Box
                    sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: "absolute",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography variant="caption" component="div">
                      {`${Math.round(tabProgress[activeTab] ?? 10)}%`}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}

            {/* OVERVIEW */}
            <Fade
              in={!tabLoading["overview"] && activeTab === "overview"}
              timeout={200}
              unmountOnExit
            >
              <Box hidden={activeTab !== "overview"}>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={2}
                  alignItems="flex-start"
                >
                  {/* Left: Summary / Snapshot */}
                  <Box
                    sx={{
                      flex: 2,
                      bgcolor: "#ffffff",
                      borderRadius: 3,
                      p: 2.2,
                      boxShadow: "0 10px 30px rgba(17,24,39,.06)",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 700, mb: 1 }}
                    >
                      Summary
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {overviewData?.Summary || "—"}
                    </Typography>

                    <Divider sx={{ my: 1.5 }} />

                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 700, mb: 1 }}
                    >
                      Snapshot
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {overviewData?.Snapshot || "—"}
                    </Typography>
                  </Box>

                  {/* Right: Trust & Verification / Contact mini */}
                  <Box
                    sx={{
                      flex: 1.3,
                      bgcolor: "#ffffff",
                      borderRadius: 3,
                      p: 2.2,
                      boxShadow: "0 10px 30px rgba(17,24,39,.06)",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 700, mb: 1 }}
                    >
                      Trust &amp; Verification
                    </Typography>

                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1.2}
                      sx={{ mb: 2 }}
                    >
                      <Box
                        sx={{
                          width: 26,
                          height: 26,
                          borderRadius: "999px",
                          bgcolor: "#fff7e6",
                          border: "1px solid #fde68a",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 13,
                        }}
                      >
                        •
                      </Box>
                      <Typography variant="body2">
                        CTI:&nbsp;
                        {overviewData?.CTI_Tier ||
                          selectedCompany?.cti?.tier ||
                          "—"}
                      </Typography>
                    </Stack>

                    <Divider sx={{ my: 1.5 }} />

                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 700, mb: 1 }}
                    >
                      Contact
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Last updated — {overviewData?.LastUpdated || "—"} •
                      {" "}
                      Sources {overviewData?.SourcesCount ?? "—"}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Fade>

            {/* FINANCIALS */}
            <Fade
              in={!tabLoading["financials"] && activeTab === "financials"}
              timeout={200}
              unmountOnExit
            >
              <Box hidden={activeTab !== "financials"}>
                <Box
                  sx={{
                    bgcolor: "#ffffff",
                    borderRadius: 3,
                    p: 2.2,
                    boxShadow: "0 10px 30px rgba(17,24,39,.06)",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 700, mb: 1.5 }}
                  >
                    Financials
                  </Typography>
                  {financialData.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No financial data available.
                    </Typography>
                  ) : (
                    <Box component="table" sx={{ width: "100%", fontSize: 13 }}>
                      <thead>
                        <tr>
                          <th align="left">Year</th>
                          <th align="right">Revenue</th>
                          <th align="right">EBITDA</th>
                          <th align="right">Net income</th>
                          <th align="right">Valuation</th>
                        </tr>
                      </thead>
                      <tbody>
                        {financialData.map((row) => (
                          <tr key={row.id}>
                            <td>{row.fiscal_year}</td>
                            <td align="right">{row.revenue ?? "—"}</td>
                            <td align="right">{row.ebitda ?? "—"}</td>
                            <td align="right">{row.net_income ?? "—"}</td>
                            <td align="right">{row.valuation ?? "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Box>
                  )}
                </Box>
              </Box>
            </Fade>

            {/* TEAM */}
            <Fade
              in={!tabLoading["team"] && activeTab === "team"}
              timeout={200}
              unmountOnExit
            >
              <Box hidden={activeTab !== "team"}>
                <Box
                  sx={{
                    bgcolor: "#ffffff",
                    borderRadius: 3,
                    p: 2.2,
                    boxShadow: "0 10px 30px rgba(17,24,39,.06)",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 700, mb: 1.5 }}
                  >
                    Team
                  </Typography>
                  {teamData.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No team members found.
                    </Typography>
                  ) : (
                    <Stack spacing={1.5}>
                      {teamData.map((m) => (
                        <Box key={m.id}>
                          <Typography sx={{ fontWeight: 600 }}>
                            {m.full_name}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 0.5 }}
                          >
                            {m.title} {m.role_type ? `• ${m.role_type}` : ""}
                          </Typography>
                          {m.bio && (
                            <Typography variant="body2" color="text.secondary">
                              {m.bio}
                            </Typography>
                          )}
                        </Box>
                      ))}
                    </Stack>
                  )}
                </Box>
              </Box>
            </Fade>

            {/* GALLERY */}
            <Fade
              in={!tabLoading["gallery"] && activeTab === "gallery"}
              timeout={200}
              unmountOnExit
            >
              <Box hidden={activeTab !== "gallery"}>
                <Box
                  sx={{
                    bgcolor: "#ffffff",
                    borderRadius: 3,
                    p: 2.2,
                    boxShadow: "0 10px 30px rgba(17,24,39,.06)",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 700, mb: 1.5 }}
                  >
                    Gallery
                  </Typography>
                  {galleryData.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No gallery items.
                    </Typography>
                  ) : (
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(160px,1fr))",
                        gap: 1.5,
                      }}
                    >
                      {galleryData.map((g) => (
                        <Box
                          key={g.id}
                          sx={{
                            borderRadius: 2,
                            overflow: "hidden",
                            border: "1px solid #e5e7eb",
                            bgcolor: "#f9fafb",
                          }}
                        >
                          <img
                            src={g.image_url}
                            alt={g.caption || "Gallery image"}
                            style={{
                              display: "block",
                              width: "100%",
                              height: 130,
                              objectFit: "cover",
                            }}
                          />
                          {g.caption && (
                            <Box sx={{ p: 0.75 }}>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {g.caption}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              </Box>
            </Fade>

            {/* DOCUMENTS */}
            <Fade
              in={!tabLoading["documents"] && activeTab === "documents"}
              timeout={200}
              unmountOnExit
            >
              <Box hidden={activeTab !== "documents"}>
                <Box
                  sx={{
                    bgcolor: "#ffffff",
                    borderRadius: 3,
                    p: 2.2,
                    boxShadow: "0 10px 30px rgba(17,24,39,.06)",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 700, mb: 1.5 }}
                  >
                    Documents
                  </Typography>
                  {documentsData.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No documents uploaded.
                    </Typography>
                  ) : (
                    <Stack spacing={1.2}>
                      {documentsData.map((d) => (
                        <Box
                          key={d.id}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Box>
                            <Typography sx={{ fontWeight: 600 }}>
                              {d.title}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {d.document_type || "Document"} •{" "}
                              {d.as_of_date || "—"}
                            </Typography>
                          </Box>
                          <Button
                            size="small"
                            variant="outlined"
                            href={d.file_path}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Open
                          </Button>
                        </Box>
                      ))}
                    </Stack>
                  )}
                </Box>
              </Box>
            </Fade>

            {/* CONTACT */}
            <Fade
              in={!tabLoading["contact"] && activeTab === "contact"}
              timeout={200}
              unmountOnExit
            >
              <Box hidden={activeTab !== "contact"}>
                <Box
                  sx={{
                    bgcolor: "#ffffff",
                    borderRadius: 3,
                    p: 2.2,
                    boxShadow: "0 10px 30px rgba(17,24,39,.06)",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 700, mb: 1.5 }}
                  >
                    Contact
                  </Typography>
                  {contactData.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No contact information available.
                    </Typography>
                  ) : (
                    <Stack spacing={1.5}>
                      {contactData.map((c) => (
                        <Box key={c.id}>
                          <Typography sx={{ fontWeight: 600 }}>
                            {c.contact_name || "—"}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 0.5 }}
                          >
                            {c.role || "—"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {c.email || "—"} {c.phone ? `• ${c.phone}` : ""}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {[
                              c.address_line1,
                              c.address_line2,
                              c.city,
                              c.state,
                              c.postal_code,
                              c.country,
                            ]
                              .filter(Boolean)
                              .join(", ") || "—"}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  )}
                </Box>
              </Box>
            </Fade>
          </Box>
        </DialogContent>
      </Dialog>

      <Footer routes={ROUTES} />
    </div>
  );
}
