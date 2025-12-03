// resources/js/pages/Companies.jsx
// ------------------------------------------------------------------
// Raymoch "Companies" listing page:
//  - Filter/search + pagination
//  - Grouping: Country / Sector / Country→Sector nested
//  - Opens CompanyDetailDialog for rich view
// ------------------------------------------------------------------

import React, { useEffect, useMemo, useState } from "react";

// Layout
import Header from "../components/layout_master/Header.jsx";
import Footer from "../components/layout_master/Footer.jsx";

// MUI
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
} from "@mui/material";

// Local

import "../styles/companies.css";
import CompanyDetailDialog from "../components/companies/CompanyDetailDialog.jsx";
import { API_BASE, fetchJSON } from "../utils/api.js";
/* ----------------------------- HELPERS ----------------------------- */

// Simple ASCII normalizer
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

// Country aliases for better grouping
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

// Normalize company record to stable shape
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

// Grouping helpers
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
  out.forEach(([_, arr]) =>
    arr.sort((u, v) => (u.name || "").localeCompare(v.name || ""))
  );
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
  out.forEach(([_, arr]) =>
    arr.sort((u, v) => (u.name || "").localeCompare(v.name || ""))
  );
  return out;
}

/**
 * All inputs empty → Country → Sector → Companies[]
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

/* ---------------------------- UI COMPONENTS ---------------------------- */

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

/* ============================== MAIN PAGE ============================== */

export default function Companies() {
  /* --------------- ROUTES (can be centralized later if needed) --------------- */
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
      trial: "/trial",
      home: "/",
    }),
    []
  );

  /* ---------------------------- FILTER STATE ---------------------------- */

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

  /* ------------------------- DETAIL DIALOG STATE ------------------------- */

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  /* --------------------------- INIT FROM URL --------------------------- */

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

  /* ------------------------ LOAD FILTER OPTIONS ------------------------ */

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

  /* ------------------------- LOADING ANIMATION ------------------------- */

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

  /* ---------------------------- FLAGS / MODES ---------------------------- */

  const isAllInputsEmpty =
    !q && !sector && !country && !verified && !localFilter.trim();

  const hasAnyFilter = !!(q || sector || country || verified);

  /* --------------------------- MAIN LIST FETCH --------------------------- */

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

  /* -------------------------- DERIVED LISTS -------------------------- */

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

  /* ----------------------------- PAGINATION ----------------------------- */

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

  const goToPage = (n) => setPage(n);
  const goPrev = () => page > 1 && setPage(page - 1);
  const goNext = () => page < totalPages && setPage(page + 1);

  /* --------------------------- BREADCRUMB LINK --------------------------- */

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

  /* ------------------------------ HANDLERS ------------------------------ */

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

  /* ================================ UI ================================ */

  return (
    <div className="page">
      <Header routes={ROUTES} />

      <Box className="container">
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

        {/* Hero */}
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

        {/* ---------------------------- FILTER PANEL ---------------------------- */}
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
            {/* Server search */}
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

            {/* Sector */}
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

            {/* Country */}
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

            {/* Verified + Clear */}
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{
                width: "100%",
                justifyContent: { xs: "space-between", md: "flex-end" },
              }}
            >
              <Tooltip title="Show only companies with a verified profile." arrow>
                <FormControlLabel
                  sx={{
                    m: 0,
                    ".MuiFormControlLabel-label": { fontSize: 13 },
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

              <Tooltip title="Reset all filters and show default results." arrow>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={onClearFilters}
                >
                  Clear
                </Button>
              </Tooltip>
            </Stack>
          </Box>

          {/* Active filter chips */}
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
                  onClick={onClearFilters}
                  sx={{ ml: 0.5, textTransform: "none" }}
                >
                  Clear all
                </Button>
              </Stack>
            </Box>
          )}

          {/* Client-side filter (only when q empty) */}
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

        {/* ---------------------------- LOADING ---------------------------- */}
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

        {/* ----------------------------- GRID ----------------------------- */}
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

      {/* Detail Dialog is fully independent & reusable */}
      <CompanyDetailDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        company={selectedCompany}
      />

      <Footer routes={ROUTES} />
    </div>
  );
}
