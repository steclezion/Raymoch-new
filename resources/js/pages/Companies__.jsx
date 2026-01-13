// resources/js/pages/Companies.jsx
// ---------------------------------------------------------------------------
// "Companies" page for Raymoch:
//  - Fetches companies from Laravel API with server-side filters & pagination
//  - Groups companies by country/sector (special nested mode when filters empty)
//  - Detail dialog with tabs: Overview, Financials, Team, Gallery, Documents,
//    Contact, Location (Google Maps with CLASSIC markers)
//  - Uses Material UI + Recharts
// ---------------------------------------------------------------------------

import React, { useEffect, useMemo, useState, useRef } from "react";

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
  Grow,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import MapIcon from "@mui/icons-material/Map";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BusinessIcon from "@mui/icons-material/Business";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import MyLocationIcon from "@mui/icons-material/MyLocation";

// Recharts for overview pivot chart
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";

/* ------------------------------ GLOBAL CSS ------------------------------ */

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

/* Group heading (country or sector) */
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

/* Dialog arrow wedge */
.dialog-arrow{
  position:absolute;
  top:-14px;
  left:50%;
  transform:translateX(-50%) rotate(45deg);
  width:26px;
  height:26px;
  background:#ffffff;
  box-shadow:0 0 10px rgba(148,163,184,0.45);
}

/* Small underline links in the distance list */
.distance-link {
  cursor:pointer;
  text-decoration:underline;
  text-decoration-style:dotted;
}
.distance-link:hover {
  text-decoration-style:solid;
}

footer{
  margin-top:auto;
}
`;

/* ----------------------------- CONSTANTS ----------------------------- */

const API_BASE = "/api";
const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY;

// shared loader for Maps JS (CLASSIC API, no marker library)
let googleMapsLoadingPromise = null;

/**
 * Load classic Google Maps JS API (no Advanced Marker / no libraries=marker).
 */
function loadGoogleMapsScript() {
  // Already loaded?
  if (window.google && window.google.maps) {
    return Promise.resolve();
  }
  // In-flight?
  if (googleMapsLoadingPromise) {
    return googleMapsLoadingPromise;
  }
  // No key: fail fast
  if (!GOOGLE_MAPS_KEY) {
    return Promise.reject(
      new Error("Missing VITE_GOOGLE_MAPS_KEY in .env file")
    );
  }

  googleMapsLoadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Failed to load Google Maps JavaScript API"));
    document.head.appendChild(script);
  });

  return googleMapsLoadingPromise;
}

// Tab order used for mobile progress indicator
const TAB_KEYS = [
  "overview",
  "financials",
  "team",
  "gallery",
  "documents",
  "contact",
  "location",
];

/* ------------------- SMALL STRING / COUNTRY HELPERS ------------------- */

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

/**
 * Normalize a raw company record to a stable shape for the UI.
 */
function normalizeCompany(c) {
  if (!c) return {};
  const rawStatus =
    c.VerificationStatus ??
    c.verification_status ??
    "";
  const statusStr = String(rawStatus).trim().toLowerCase();
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
    logo_url: c.logo_url ?? c.site_image_url ?? null,
  };
}

/**
 * Small fetch wrapper.
 */
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

/* ----------------------------- GROUP HELPERS ----------------------------- */

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

  out.forEach(([_, arr]) => {
    arr.sort((u, v) => (u.name || "").localeCompare(v.name || ""));
  });

  return out;
}

function groupBySector(items) {
  const groups = new Map();

  items.forEach((x) => {
    const key =
      (x.sector || "Unspecified sector").trim() || "Unspecified sector";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(x);
  });

  const out = Array.from(groups.entries()).sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  out.forEach(([_, arr]) => {
    arr.sort((u, v) => (u.name || "").localeCompare(v.name || ""));
  });

  return out;
}

/**
 * Special nested grouping for "all inputs empty":
 *   Country -> Sector -> Companies[]
 */
function groupByCountryAndSector(items) {
  const countryMap = new Map();

  items.forEach((c) => {
    const country =
      (c.country || "Unspecified country").trim() || "Unspecified country";
    const sector =
      (c.sector || "Unspecified sector").trim() || "Unspecified sector";

    if (!countryMap.has(country)) {
      countryMap.set(country, new Map());
    }
    const sectorMap = countryMap.get(country);
    if (!sectorMap.has(sector)) {
      sectorMap.set(sector, []);
    }
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

/* --------------------------- SESSION ID HELPER --------------------------- */

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

/* --------------------------- CARD COMPONENT --------------------------- */

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

/* ------------------------ DIALOG TRANSITION ------------------------ */

const DialogTransition = React.forwardRef(function DialogTransition(
  props,
  ref
) {
  return <Grow ref={ref} {...props} />;
});

/* ------------------------- LOCATION / MAP TAB ------------------------- */
/**
 * LocationMap (now using **classic google.maps.Marker**, no AdvancedMarkerElement)
 */
function LocationMap({ data, company }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const centerRef = useRef(null);

  const [loadingMap, setLoadingMap] = useState(true);
  const [loadError, setLoadError] = useState("");

  const nearby = data?.nearby || [];

  if (!data || !data.location) {
    return (
      <Typography variant="body2" color="text.secondary">
        No location has been added for this company yet.
      </Typography>
    );
  }

  if (!GOOGLE_MAPS_KEY) {
    return (
      <Alert severity="warning" sx={{ mt: 1.5 }}>
        Google Maps API key is missing. Please set
        <code style={{ margin: "0 4px" }}>VITE_GOOGLE_MAPS_KEY</code> in your
        <strong>.env</strong> and restart Vite.
      </Alert>
    );
  }

  // Initialize / cleanup map
  useEffect(() => {
    let markers = [];
    let polylines = [];

    async function initMap() {
      try {
        setLoadingMap(true);
        setLoadError("");

        await loadGoogleMapsScript();

        const center = {
          lat: Number(data.location.latitude),
          lng: Number(data.location.longitude),
        };
        centerRef.current = center;

        if (!containerRef.current) {
          setLoadingMap(false);
          return;
        }

        const map = new window.google.maps.Map(containerRef.current, {
          center,
          zoom: 13,
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false,
        });
        mapRef.current = map;

        // MAIN COMPANY MARKER (classic marker)
        const mainTitle =
          company?.name ||
          company?.CompanyName ||
          "Company location";

        const mainMarker = new window.google.maps.Marker({
          map,
          position: center,
          title: mainTitle,
        });
        markers.push(mainMarker);

        // NEARBY COMPANIES: classic markers + polylines
        nearby.forEach((n) => {
          const pos = {
            lat: Number(n.latitude),
            lng: Number(n.longitude),
          };

          const nearbyMarker = new window.google.maps.Marker({
            map,
            position: pos,
            title: n.company_name,
          });
          markers.push(nearbyMarker);

          const polyline = new window.google.maps.Polyline({
            path: [center, pos],
            strokeColor: "#2563eb",
            strokeOpacity: 0.8,
            strokeWeight: 2,
          });
          polyline.setMap(map);
          polylines.push(polyline);
        });

        setLoadingMap(false);
      } catch (err) {
        console.error("Map load error", err);
        setLoadError(err.message || "Failed to load Google Maps.");
        setLoadingMap(false);
      }
    }

    initMap();

    return () => {
      markers.forEach((m) => {
        if (m.setMap) m.setMap(null);
        if (m.map) m.map = null;
      });
      polylines.forEach((p) => p.setMap && p.setMap(null));
    };
  }, [data, company?.id, nearby.length]);

  // Zoom / recenter handlers
  const handleZoomIn = () => {
    const map = mapRef.current;
    if (!map) return;
    const currentZoom = map.getZoom() || 13;
    map.setZoom(Math.min(currentZoom + 1, 18));
  };

  const handleZoomOut = () => {
    const map = mapRef.current;
    if (!map) return;
    const currentZoom = map.getZoom() || 13;
    map.setZoom(Math.max(currentZoom - 1, 3));
  };

  const handleRecenter = () => {
    const map = mapRef.current;
    const center = centerRef.current;
    if (!map || !center) return;
    map.panTo(center);
    map.setZoom(13);
  };

  return (
    <Box sx={{ position: "relative" }}>
      {/* Map container */}
      <Box
        ref={containerRef}
        sx={{
          width: "100%",
          height: 360,
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid #e5e7eb",
          bgcolor: "#f9fafb",
        }}
      />
      {loadingMap && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <Box
            sx={{
              px: 2,
              py: 1.5,
              bgcolor: "rgba(15,23,42,0.78)",
              color: "white",
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <CircularProgress size={18} sx={{ color: "white" }} />
            <Typography variant="caption">Loading map…</Typography>
          </Box>
        </Box>
      )}
      {loadError && (
        <Alert severity="error" sx={{ mt: 1.5 }}>
          {loadError}
        </Alert>
      )}

      {/* Floating controls */}
      <Box
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Tooltip title="Zoom in" arrow>
          <IconButton
            size={isMobile ? "small" : "medium"}
            sx={{ bgcolor: "white", boxShadow: 1 }}
            onClick={handleZoomIn}
          >
            <ZoomInIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Zoom out" arrow>
          <IconButton
            size={isMobile ? "small" : "medium"}
            sx={{ bgcolor: "white", boxShadow: 1 }}
            onClick={handleZoomOut}
          >
            <ZoomOutIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Recenter on company" arrow>
          <IconButton
            size={isMobile ? "small" : "medium"}
            sx={{ bgcolor: "white", boxShadow: 1 }}
            onClick={handleRecenter}
          >
            <MyLocationIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Legend */}
      <Box
        sx={{
          position: "absolute",
          bottom: 10,
          left: "50%",
          transform: "translateX(-50%)",
          bgcolor: "rgba(15,23,42,0.88)",
          color: "white",
          px: 2,
          py: 1,
          borderRadius: 999,
          display: "flex",
          alignItems: "center",
          gap: 2,
          fontSize: 12,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <LocationOnIcon sx={{ fontSize: 16, color: "#60a5fa" }} />
          <span>Main company</span>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <BusinessIcon sx={{ fontSize: 16, color: "#f97316" }} />
          <span>Nearby companies</span>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <MapIcon sx={{ fontSize: 16, color: "#22c55e" }} />
          <span>Lines show distance (miles)</span>
        </Stack>
      </Box>

      {/* Distances list */}
      <Box sx={{ mt: 2 }}>
        {nearby.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No nearby companies found around this location.
          </Typography>
        ) : (
          <Stack spacing={0.5}>
            {nearby.map((n) => (
              <Tooltip
                key={n.company_id}
                title={`${n.company_name} — ${n.distance_miles} miles`}
                arrow
              >
                <Typography
                  variant="body2"
                  color="primary"
                  className="distance-link"
                  onClick={() => {
                    if (!mapRef.current) return;
                    const pos = {
                      lat: Number(n.latitude),
                      lng: Number(n.longitude),
                    };
                    mapRef.current.panTo(pos);
                    mapRef.current.setZoom(14);
                  }}
                >
                  {n.company_name} — {n.distance_miles} miles away
                </Typography>
              </Tooltip>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
}

/* ============================= MAIN PAGE ============================= */

export default function Companies() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  /* ----------------------------- ROUTES ----------------------------- */

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

  /* ------------------------ FILTER / STATE ------------------------ */

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

  /* ---------------------- DETAIL DIALOG STATE ---------------------- */

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
  const [locationData, setLocationData] = useState(null);

  /* --------------------- INITIAL QUERY (URL) --------------------- */

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

  /* ---------------------- FILTER OPTIONS LOAD ---------------------- */

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

  /* ------------------- MAIN LOADING SPINNER PROGRESS ------------------- */

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

  /* ---------------------- INPUTS-EMPTY FLAG ---------------------- */

  const isAllInputsEmpty =
    !q && !sector && !country && !verified && !localFilter.trim();

  /* ------------------------ MAIN LIST FETCH ------------------------ */

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

        // Keep URL in sync
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

  /* ------------------------ VISIBLE COMPANIES ------------------------ */

  const visibleCompanies = useMemo(() => {
    let list = companies;

    if (verified) {
      list = list.filter((c) => c.verified);
    }

    if (!q && localFilter.trim()) {
      const term = localFilter.trim().toLowerCase();
      list = list.filter((c) =>
        (c.name || "").toLowerCase().includes(term)
      );
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
    () =>
      isAllInputsEmpty ? groupByCountryAndSector(visibleCompanies) : [],
    [isAllInputsEmpty, visibleCompanies]
  );

  const hasResults = isAllInputsEmpty
    ? nestedGrouped.length > 0
    : flatGrouped.length > 0;

  /* ------------------------ PAGINATION HELPERS ------------------------ */

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

  /* ------------------- OVERVIEW SUMMARY CHART DATA ------------------- */

  const summaryChartData = useMemo(
    () => [
      { name: "Financial years", value: financialData.length || 0 },
      { name: "Team members", value: teamData.length || 0 },
      { name: "Gallery images", value: galleryData.length || 0 },
      { name: "Documents", value: documentsData.length || 0 },
      { name: "Contacts", value: contactData.length || 0 },
      {
        name: "Nearby companies",
        value:
          locationData && Array.isArray(locationData?.nearby)
            ? locationData.nearby.length
            : 0,
      },
    ],
    [
      financialData,
      teamData,
      galleryData,
      documentsData,
      contactData,
      locationData,
    ]
  );

  /* ---------------------- BREADCRUMB / BACK LINK ---------------------- */

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
      backHref: dest.href + (extra ? "?" + extra : ""),
    };
  }, [fromParam, q, sector, country, verified]);

  const hasAnyFilter = !!(q || sector || country || verified);

  /* -------------------------- LIST HANDLERS -------------------------- */

  const onClear = () => {
    setQ("");
    setSector("");
    setCountry("");
    setVerified(false);
    setLocalFilter("");
    setPage(1);
  };
  const goToPage = (n) => setPage(n);
  const goPrev = () => page > 1 && setPage(page - 1);
  const goNext = () => page < totalPages && setPage(page + 1);

  /* ---------------------- DETAIL TAB LOAD HELPERS ---------------------- */

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
    } else if (tab === "location") {
      already = locationData && selectedCompany?.id === company.id;
      const baseLoc = `${API_BASE}/companies/${company.id}/location`;
      url = sid ? `${baseLoc}?session_id=${encodeURIComponent(sid)}` : baseLoc;
    }

    if (!url || already) return;

    const intervalId = startTabLoading(tab);
    try {
      const js = await fetchJSON(url);
      if (tab === "overview") setOverviewData(js.data || null);
      if (tab === "financials") setFinancialData(js.data || []);
      if (tab === "team") setTeamData(js.data || []);
      if (tab === "gallery") setGalleryData(js.data || []);
      if (tab === "documents") setDocumentsData(js.data || []);
      if (tab === "contact") setContactData(js.data || []);
      if (tab === "location") setLocationData(js.data || null);
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
    setLocationData(null);

    loadTabData("overview", company);
  };

  const handleTabChange = (e, newValue) => {
    setActiveTab(newValue);
    if (selectedCompany) {
      loadTabData(newValue, selectedCompany);
    }
  };

  const activeTabIndex = TAB_KEYS.indexOf(activeTab);
  const tabProgressRatio =
    activeTabIndex <= 0
      ? 0
      : activeTabIndex >= TAB_KEYS.length - 1
      ? 1
      : activeTabIndex / (TAB_KEYS.length - 1);

  /* ============================ RENDER ============================ */

  return (
    <div className="page">
      <style>{css}</style>

      <Header routes={ROUTES} />

      <Box
        className="container"
        sx={{
          width: "100%",
          maxWidth: "1400px",
          mx: "auto",
          px: { xs: 1.5, sm: 2.5, md: 3 },
          py: { xs: 2, sm: 3, md: 3.5 },
        }}
      >
        {/* Breadcrumb */}
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

        {/* Hero heading */}
        <header className="explore-hero">
          <h1>Companies</h1>
          <p>Filter and browse companies by country, sector, and verification.</p>
        </header>

        {/* Error */}
        {error && (
          <Box sx={{ my: 1 }}>
            <Alert severity="error" variant="filled">
              {error}
            </Alert>
          </Box>
        )}

        {/* ========================== FILTER PANEL ========================== */}
        <Box className="panel">
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "2fr 1.3fr 1.3fr auto",
              },
              columnGap: 1.5,
              rowGap: 1.25,
              alignItems: "center",
            }}
          >
            {/* Company name search (server-side) */}
            <Box sx={{ gridColumn: { xs: "1 / -1", sm: "1 / -1", md: "auto" } }}>
              <TextField
                fullWidth
                size="small"
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
            </Box>

            {/* Sector filter */}
            <Box>
              <Autocomplete
                fullWidth
                size="small"
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
            </Box>

            {/* Country filter */}
            <Box>
              <Autocomplete
                fullWidth
                size="small"
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
            </Box>

            {/* Verified toggle + Clear */}
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{
                width: "100%",
                justifyContent: { xs: "space-between", md: "flex-end" },
              }}
            >
              <Tooltip
                title="Show only companies with a verified profile."
                arrow
              >
                <FormControlLabel
                  sx={{
                    m: 0,
                    ".MuiFormControlLabel-label": {
                      fontSize: 13,
                    },
                  }}
                  control={
                    <Switch
                      size="small"
                      checked={verified}
                      onChange={(e) => {
                        setVerified(e.target.checked);
                        setPage(1);
                      }}
                    />
                  }
                  label="Verified only"
                />
              </Tooltip>

              <Tooltip
                title="Reset all filters and show default results."
                arrow
              >
                <Button
                  variant="outlined"
                  size="small"
                  onClick={onClear}
                >
                  Clear
                </Button>
              </Tooltip>
            </Stack>
          </Box>

          {/* Active filters chips */}
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

          {/* Client-side quick filter, only when q is empty */}
          {!q && (
            <Box sx={{ mt: 1.5 }}>
              <TextField
                fullWidth
                size="small"
                label="Filter current results by company name…"
                value={localFilter}
                onChange={(e) => setLocalFilter(e.target.value)}
                helperText="This filter applies on the currently loaded list without calling the server."
              />
            </Box>
          )}
        </Box>

        {/* ====================== MAIN LIST LOADING ====================== */}
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

        {/* ============================ GRID ============================ */}
        {!loading && (
          <>
            {!hasResults ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1.5 }}
              >
                No results.
              </Typography>
            ) : isAllInputsEmpty ? (
              nestedGrouped.map((countryGroup) => (
                <section key={countryGroup.country}>
                  <h2 className="country-heading">{countryGroup.country}</h2>
                  {countryGroup.sectors.map((sectorGroup) => (
                    <Box key={sectorGroup.sector} sx={{ mb: 1.5 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          mb: 0.5,
                          color: "#475569",
                        }}
                      >
                        Sector: {sectorGroup.sector}
                      </Typography>
                      <div className="grid">
                        {sectorGroup.companies.map((c) => (
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
                    </Box>
                  ))}
                </section>
              ))
            ) : (
              flatGrouped.map(([groupName, arr]) => (
                <section key={groupName}>
                  <h2 className="country-heading">
                    {shouldGroupBySector ? `Sector: ${groupName}` : groupName}
                  </h2>
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
      </Box>

      {/* ======================== DETAIL DIALOG ======================== */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="lg"
        fullScreen={isMobile}
        TransitionComponent={DialogTransition}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : 5, // rounded edge dialog
            overflow: "hidden",
            border: "1px solid rgba(148,163,184,0.55)",
            boxShadow: "0 18px 45px rgba(15,23,42,0.22)",
            backgroundColor: "#ffffff",
          },
        }}
      >
        <DialogContent sx={{ p: 0, position: "relative" }}>
          <Box className="dialog-arrow" />

          {/* Header bar */}
          <Box
            sx={{
              px: { xs: 2, sm: 3 },
              py: { xs: 1.5, sm: 2 },
              borderBottom: "1px solid #eef0f6",
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
              justifyContent: "space-between",
              rowGap: 1,
              background: "#ffffff",
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

            <Stack
              direction={{ xs: "row", sm: "row" }}
              spacing={1}
              alignItems="center"
              flexWrap="wrap"
              justifyContent={{ xs: "flex-start", sm: "flex-end" }}
              sx={{ mt: { xs: 1, sm: 0 } }}
            >
              <Tooltip title="Back to all companies list" arrow>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setDialogOpen(false)}
                >
                  All Companies
                </Button>
              </Tooltip>
              <Tooltip title="Request a warm introduction to this company" arrow>
                <Button variant="contained" size="small">
                  Request intro
                </Button>
              </Tooltip>
              <Tooltip title="Save this company to your watchlist" arrow>
                <Button variant="outlined" size="small">
                  Save
                </Button>
              </Tooltip>
              <Tooltip title="Share this company profile" arrow>
                <Button variant="outlined" size="small">
                  Share
                </Button>
              </Tooltip>
              <Tooltip
                title="This panel shows detailed information about the selected company, including overview, financials, team, gallery, documents, contacts and location."
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

          {/* Tabs header */}
          <Box sx={{ position: "relative" }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                px: { xs: 1.5, sm: 3 },
                borderBottom: "1px solid #eef0f6",
                bgcolor: "#f8f9ff",
              }}
              TabIndicatorProps={{
                sx: {
                  height: 3,
                  borderRadius: 999,
                  background:
                    "linear-gradient(90deg,#3b82f6,#22c55e,#f97316)",
                },
              }}
            >
              <Tab label="Overview" value="overview" />
              <Tab label="Financials" value="financials" />
              <Tab label="Team" value="team" />
              <Tab label="Gallery" value="gallery" />
              <Tab label="Documents" value="documents" />
              <Tab label="Contact" value="contact" />
              <Tab label="Location" value="location" />
            </Tabs>

            {isMobile && (
              <Box
                sx={{
                  px: { xs: 1.5, sm: 3 },
                  pb: 0.5,
                  pt: 0.5,
                  bgcolor: "#f8f9ff",
                }}
              >
                <Box
                  sx={{
                    height: 4,
                    borderRadius: 999,
                    bgcolor: "#e5e7eb",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      height: "100%",
                      width: `${(tabProgressRatio || 0) * 100}%`,
                      transition: "width 180ms ease-out",
                      background:
                        "linear-gradient(90deg,#3b82f6,#22c55e,#f97316)",
                    }}
                  />
                </Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 0.5, display: "block" }}
                >
                  Swipe / use arrows to move between Overview, Financials,
                  Team, Gallery, Documents, Contact, Location.
                </Typography>
              </Box>
            )}
          </Box>

          {/* Tab content */}
          <Box sx={{ p: { xs: 2, sm: 3 }, bgcolor: "#f5f6fb" }}>
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

            {/* OVERVIEW TAB */}
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
                  {/* Summary + chart */}
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
                      {overviewData?.Snapshot ||
                        "Snapshot visualizations will appear here in a future version."}
                    </Typography>

                    <Divider sx={{ my: 1.5 }} />

                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 700, mb: 1 }}
                    >
                      Key metrics overview
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mb: 1 }}
                    >
                      Live summary based on financials, team, gallery,
                      documents, contacts, and nearby companies.
                    </Typography>
                    <Box sx={{ width: "100%", height: 260 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={summaryChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis allowDecimals={false} />
                          <RechartsTooltip />
                          <Legend />
                          <Bar dataKey="value" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </Box>

                  {/* Trust & Verification */}
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
                      <Chip
                        label={
                          selectedCompany?.verified
                            ? "Verified profile"
                            : "Not yet verified"
                        }
                        color={selectedCompany?.verified ? "success" : "default"}
                        size="small"
                      />
                      {selectedCompany?.cti?.tier && (
                        <Chip
                          label={`CTI tier: ${selectedCompany.cti.tier}`}
                          size="small"
                        />
                      )}
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      This block can show verification dates, data sources,
                      and confidence scores driven from your Laravel backend.
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Fade>

            {/* FINANCIALS TAB */}
            <Fade
              in={!tabLoading["financials"] && activeTab === "financials"}
              timeout={200}
              unmountOnExit
            >
              <Box hidden={activeTab !== "financials"}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Financial information
                </Typography>
                {financialData.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No financial records available for this company yet.
                  </Typography>
                ) : (
                  <Stack spacing={1.5}>
                    {financialData.map((row, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          bgcolor: "#ffffff",
                          borderRadius: 2,
                          p: 1.5,
                          boxShadow: "0 4px 10px rgba(15,23,42,.04)",
                        }}
                      >
                        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                          {row.year || "Year"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Revenue: {row.revenue ?? "—"} | EBITDA:{" "}
                          {row.ebitda ?? "—"} | Margin:{" "}
                          {row.margin ?? "—"}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Box>
            </Fade>

            {/* TEAM TAB */}
            <Fade
              in={!tabLoading["team"] && activeTab === "team"}
              timeout={200}
              unmountOnExit
            >
              <Box hidden={activeTab !== "team"}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Leadership &amp; team
                </Typography>
                {teamData.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No team members have been added yet.
                  </Typography>
                ) : (
                  <Stack spacing={1.2}>
                    {teamData.map((member, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          bgcolor: "#ffffff",
                          borderRadius: 2,
                          p: 1.5,
                          boxShadow: "0 4px 10px rgba(15,23,42,.04)",
                        }}
                      >
                        <Typography variant="subtitle2">
                          {member.name || "Name"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {member.title || member.role || "Role"}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Box>
            </Fade>

            {/* GALLERY TAB */}
            <Fade
              in={!tabLoading["gallery"] && activeTab === "gallery"}
              timeout={200}
              unmountOnExit
            >
              <Box hidden={activeTab !== "gallery"}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Gallery
                </Typography>
                {galleryData.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No gallery items yet.
                  </Typography>
                ) : (
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "repeat(2,1fr)",
                        sm: "repeat(3,1fr)",
                        md: "repeat(4,1fr)",
                      },
                      gap: 1.5,
                    }}
                  >
                    {galleryData.map((g, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          borderRadius: 2,
                          overflow: "hidden",
                          bgcolor: "#ffffff",
                          boxShadow: "0 4px 10px rgba(15,23,42,.04)",
                        }}
                      >
                        {g.image_url ? (
                          <img
                            src={g.image_url}
                            alt={g.caption || "Gallery"}
                            style={{ width: "100%", display: "block" }}
                          />
                        ) : (
                          <Box sx={{ p: 1.5 }}>
                            <Typography variant="body2">
                              {g.caption || "Gallery image"}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </Fade>

            {/* DOCUMENTS TAB */}
            <Fade
              in={!tabLoading["documents"] && activeTab === "documents"}
              timeout={200}
              unmountOnExit
            >
              <Box hidden={activeTab !== "documents"}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Documents
                </Typography>
                {documentsData.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No documents attached yet.
                  </Typography>
                ) : (
                  <Stack spacing={1.2}>
                    {documentsData.map((d, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          bgcolor: "#ffffff",
                          borderRadius: 2,
                          p: 1.5,
                          boxShadow: "0 4px 10px rgba(15,23,42,.04)",
                        }}
                      >
                        <Typography variant="subtitle2">
                          {d.title || "Document"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {d.type || d.mime || ""}{" "}
                          {d.year ? `• ${d.year}` : ""}
                        </Typography>
                        {d.url && (
                          <Button
                            size="small"
                            sx={{ mt: 0.5 }}
                            href={d.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Open
                          </Button>
                        )}
                      </Box>
                    ))}
                  </Stack>
                )}
              </Box>
            </Fade>

            {/* CONTACT TAB */}
            <Fade
              in={!tabLoading["contact"] && activeTab === "contact"}
              timeout={200}
              unmountOnExit
            >
              <Box hidden={activeTab !== "contact"}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Contact information
                </Typography>
                {contactData.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No contact info available yet.
                  </Typography>
                ) : (
                  <Stack spacing={1.2}>
                    {contactData.map((c, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          bgcolor: "#ffffff",
                          borderRadius: 2,
                          p: 1.5,
                          boxShadow: "0 4px 10px rgba(15,23,42,.04)",
                        }}
                      >
                        <Typography variant="subtitle2">
                          {c.label || c.type || "Contact"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {c.value || c.detail || "—"}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Box>
            </Fade>

            {/* LOCATION TAB */}
            <Fade
              in={!tabLoading["location"] && activeTab === "location"}
              timeout={200}
              unmountOnExit
            >
              <Box hidden={activeTab !== "location"}>
                {locationData ? (
                  <LocationMap data={locationData} company={selectedCompany} />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No location data yet.
                  </Typography>
                )}
              </Box>
            </Fade>
          </Box>
        </DialogContent>
      </Dialog>

      <Footer routes={ROUTES} />
    </div>
  );
}
