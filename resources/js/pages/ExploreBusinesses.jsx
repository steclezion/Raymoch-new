// resources/js/pages/ExploreBusiness.jsx
import React, { useEffect, useMemo, useState } from "react";

// Layout
import Header from "../components/layout_master/Header.jsx";
import Footer from "../components/layout_master/Footer.jsx";

// Material UI
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

// Icons
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import BusinessCenterRoundedIcon from "@mui/icons-material/BusinessCenterRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import ArrowOutwardRoundedIcon from "@mui/icons-material/ArrowOutwardRounded";

const css = `
:root{
  --brand:#0A2A6B;
  --brand-2:#213bb1;
  --accent:#f59e0b;
  --bg:#fafafa;
  --card:#ffffff;
  --border:#e8e8ee;
  --muted:#667085;
  --shadow:0 10px 28px rgba(10,42,107,.10);
  --shadow2:0 18px 50px rgba(10,42,107,.14);
  --pill:999px;
  --radius:18px;
  --maxw:1400px;
}

.page{
  background:var(--bg);
  min-height:100vh;
  display:flex;
  flex-direction:column;
}

.container{
  width:100%;
  max-width:var(--maxw);
  margin:0 auto;
  padding:28px 22px;
}

@media (max-width: 768px){
  .container{ max-width: 720px; padding:20px 14px; }
}
@media (max-width: 480px){
  .container{ max-width:100%; padding:16px 12px; }
}

/* HERO */
.explore-hero{
  text-align:center;
  padding:30px 12px 18px;
}
.explore-hero h1{
  font-size:clamp(28px, 4vw, 44px);
  font-weight:900;
  line-height:1.06;
  color:var(--brand);
  margin:0 0 6px;
}
.explore-hero p{
  color:var(--muted);
  margin:0;
  max-width: 980px;
  margin-inline:auto;
}

/* Search Panel Wrapper */
.panel-wrap{
  max-width: 1180px;
  margin: 14px auto 20px;
}
.panel{
  border:1px solid var(--border);
  border-radius: calc(var(--radius) + 6px);
  box-shadow: var(--shadow);
  overflow:hidden;
  background: var(--card);
}

/* Top gradient header strip */
.panel-head{
  background: linear-gradient(135deg, var(--brand), var(--brand-2));
  color:#fff;
  padding: 14px 16px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap: 12px;
}
.panel-head h3{
  margin:0;
  font-size: 14px;
  letter-spacing:.2px;
  font-weight: 900;
  text-transform: uppercase;
  opacity: .95;
}
.panel-head .hint{
  font-size: 12px;
  opacity: .92;
}

/* Body */
.panel-body{
  padding: 14px 14px 12px;
}
.panel-grid{
  display:grid;
  grid-template-columns: 1.6fr 1fr 1fr auto;
  gap: 12px;
  align-items:center;
}

@media (max-width: 1024px){
  .panel-grid{
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 620px){
  .panel-body{ padding: 12px; }
  .panel-grid{
    grid-template-columns: 1fr;
  }
}

/* Actions row */
.panel-actions{
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap: 12px;
  padding: 10px 14px 14px;
  background: linear-gradient(to bottom, rgba(10,42,107,.03), rgba(10,42,107,0));
  border-top: 1px solid rgba(232,232,238,.75);
}
@media (max-width: 720px){
  .panel-actions{
    flex-direction:column;
    align-items:stretch;
  }
  .panel-actions .left, .panel-actions .right{
    width:100%;
    display:flex;
    justify-content:space-between;
    gap:10px;
    flex-wrap:wrap;
  }
}

/* All Companies title */
.h3sub{
  font-weight:900;
  text-align:center;
  margin:14px 0 8px;
  color:#0f172a;
  letter-spacing:.2px;
}

/* DataTable search row */
.data-search-row{
  display:flex;
  justify-content:flex-end;
  margin: 6px 0 10px;
}
@media (max-width: 620px){
  .data-search-row{ justify-content:stretch; }
}

/* GRID */
.grid{
  display:grid;
  grid-template-columns:repeat(auto-fit, minmax(260px, 1fr));
  gap:14px;
  margin-top:10px;
}

/* CARD */
.card{
  background:#ffffff;
  border:1px solid var(--border);
  border-radius:16px;
  box-shadow: var(--shadow);
  padding:14px;
  min-height:104px;
  text-align:left;
  display:block;
  transition: transform .14s ease, box-shadow .14s ease, border-color .14s ease;
}
.card:hover{
  transform: translateY(-2px);
  box-shadow: var(--shadow2);
  border-color: rgba(33,59,177,.35);
}
.card .icon{
  font-size: 1.35rem;
  margin-bottom: .25rem;
  display:inline-block;
}
.card h3{
  margin:0 0 6px;
  color: var(--brand);
  font-size: 1.12rem;
  font-weight: 900;
}
.card p{
  margin:0;
  color:#6b7280;
  font-size: .9rem;
  line-height:1.45;
}

/* Loading */
.grid-loading{
  margin-top:24px;
  display:flex;
  justify-content:center;
  min-height:120px;
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

footer{ margin-top:auto; }

/* =========================
   HARD LOCK: NO HOVER COLOR CHANGES
   (Grid + Cards never change on hover)
   ========================= */

/* 1) Grid itself must never change */
.grid,
.grid:hover,
.grid:focus,
.grid:active,
.grid:focus-within{
  background: transparent !important;
  color: inherit !important;
  filter: none !important;
}

/* 2) If any global CSS is trying to repaint children on hover, kill it */
.grid *:hover{
  background: unset !important;
  color: inherit !important;
  filter: none !important;
}

/* 3) Cards: completely disable hover visuals */
.grid .card{
  background:#ffffff !important;
  border:1px solid var(--border) !important;
  box-shadow: var(--shadow) !important;
  transform:none !important;
  transition:none !important;
}

.grid .card:hover,
.grid .card:focus,
.grid .card:active,
.grid .card:focus-within{
  background:#ffffff !important;          /* never becomes white/blue/anything else */
  border:1px solid var(--border) !important;
  // box-shadow: var(--shadow) !important;
  // transform:none !important;
  // filter:none !important;
  // outline:none !important;
}

/* 4) Lock text colors too */
// .grid .card h3,
// .grid .card p,
.grid .card .icon{
  color: inherit !important;
}

/* optional: keep your brand colors always */
.grid .card h3{ color: var(--brand) !important; }
.grid .card p{  color: #6b7280 !important; }


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

  // Grid filter (client-side search under "All Companies")
  const [gridQuery, setGridQuery] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Loading spinner
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

  const sectorOptions = useMemo(() => sectors.map((s) => s.title), [sectors]);

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

  const clearTopFilters = () => {
    setQ("");
    setCountry("");
    setSector("");
    setVerified(false);
  };

  /* ------------------------------------------------------------
    GRID FILTERING (client-side)
  ------------------------------------------------------------ */
  const filteredSectors = useMemo(() => {
    const term = gridQuery.trim().toLowerCase();
    if (!term) return sectors;
    return sectors.filter(
      (s) =>
        (s.title ?? "").toLowerCase().includes(term) ||
        (s.description ?? "").toLowerCase().includes(term)
    );
  }, [gridQuery, sectors]);

  useEffect(() => {
    setPage(1);
  }, [gridQuery, sectors.length]);

  /* ------------------------------------------------------------
    PAGINATION
  ------------------------------------------------------------ */
  const totalPages = Math.max(1, Math.ceil(filteredSectors.length / pageSize));
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredSectors.length);
  const pagedSectors = filteredSectors.slice(startIndex, endIndex);

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

  return (
    <div className="page">
      <style>{css}</style>

      <Header routes={ROUTES} />

      <div className="container">
        {/* HERO */}
        <header className="explore-hero">
          <h1>Explore Businesses</h1>
          <p>
            Find companies by keyword, country, or sector — then jump into a filtered list instantly.
          </p>
        </header>

        {/* TOP SEARCH PANEL */}
        <div className="panel-wrap">
          <Paper className="panel" component="section" elevation={0}>
            <div className="panel-head">
              <div>
                <h3>Search & Filters</h3>
                <div className="hint">
                  Use filters below to open the company list with matching results.
                </div>
              </div>

              <Chip
                size="small"
                icon={<VerifiedRoundedIcon style={{ color: "#fff" }} />}
                label={verified ? "Verified: ON" : "Verified: OFF"}
                sx={{
                  color: "#fff",
                  bgcolor: verified ? "rgba(34,197,94,.22)" : "rgba(255,255,255,.18)",
                  border: "1px solid rgba(255,255,255,.24)",
                  fontWeight: 800,
                }}
              />
            </div>

            <form onSubmit={onSearch}>
              <div className="panel-body">
                <div className="panel-grid">
                  {/* Keyword */}
                  <TextField
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search businesses…"
                    label="Keyword"
                    size="small"
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchRoundedIcon />
                        </InputAdornment>
                      ),
                      endAdornment: q ? (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            aria-label="Clear keyword"
                            onClick={() => setQ("")}
                          >
                            <CloseRoundedIcon />
                          </IconButton>
                        </InputAdornment>
                      ) : null,
                      sx: { borderRadius: 999 },
                    }}
                  />

                  {/* Country */}
                  <FormControl fullWidth size="small">
                    <InputLabel>Country</InputLabel>
                    <Select
                      value={country}
                      label="Country"
                      onChange={(e) => setCountry(e.target.value)}
                      sx={{ borderRadius: 999 }}
                      startAdornment={
                        <InputAdornment position="start">
                          <PublicRoundedIcon />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="">
                        <em>Any country</em>
                      </MenuItem>
                      {countries.map((c) => (
                        <MenuItem key={c.id} value={c.country_name}>
                          {c.flag_icon ? `${c.flag_icon} ` : ""}
                          {c.country_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Sector */}
                  <FormControl fullWidth size="small">
                    <InputLabel>Sector</InputLabel>
                    <Select
                      value={sector}
                      label="Sector"
                      onChange={(e) => setSector(e.target.value)}
                      sx={{ borderRadius: 999 }}
                      startAdornment={
                        <InputAdornment position="start">
                          <BusinessCenterRoundedIcon />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="">
                        <em>Any sector</em>
                      </MenuItem>
                      {sectorOptions.map((t, i) => (
                        <MenuItem key={i} value={t}>
                          {t}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Verified */}
                  <Box sx={{ display: "flex", justifyContent: { xs: "flex-start", md: "flex-end" } }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={verified}
                          onChange={(e) => setVerified(e.target.checked)}
                          color="primary"
                        />
                      }
                      label="Verified only"
                      sx={{
                        ".MuiFormControlLabel-label": { fontWeight: 800, color: "#0f172a" },
                        ml: 0,
                      }}
                    />
                  </Box>
                </div>
              </div>

              <Divider />

              <div className="panel-actions">
                <div className="left" style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    type="button"
                    onClick={clearTopFilters}
                    sx={{ borderRadius: 999, fontWeight: 900, textTransform: "none" }}
                  >
                    Clear
                  </Button>

                  <Button
                    variant="outlined"
                    color="primary"
                    href="/companies"
                    endIcon={<ArrowOutwardRoundedIcon />}
                    sx={{ borderRadius: 999, fontWeight: 900, textTransform: "none" }}
                  >
                    All Companies
                  </Button>
                </div>

                <div className="right" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    sx={{ borderRadius: 999, fontWeight: 900, textTransform: "none", minWidth: 160 }}
                  >
                    Search
                  </Button>
                </div>
              </div>
            </form>
          </Paper>
        </div>

        {/* ALL COMPANIES SECTION */}
        <div className="h3sub">All Companies</div>

        {/* Client-side filter for grid */}
        <div className="data-search-row">
          <TextField
            size="small"
            variant="outlined"
            label="Filter sectors"
            placeholder="Type to filter by title or description…"
            value={gridQuery}
            onChange={(e) => setGridQuery(e.target.value)}
            sx={{
              width: { xs: "100%", sm: 420 },
              "& .MuiOutlinedInput-root": { borderRadius: 999 },
            }}
          />
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="grid-loading">
            <CircularProgress />
          </div>
        ) : (
          <>
            {/* GRID */}
            <div className="grid">
              {pagedSectors.map((s) => (
                <Tooltip
                  key={s.id}
                  title={s.title}
                  arrow
                  placement="top"
                >
                  <a
                    className="card"
                    href={`/companies?sector=${encodeURIComponent(s.title)}&from=explore`}
                  >
                    <span className="icon">{s.icon ?? "🧩"}</span>
                    <h3>{s.title}</h3>
                    <p>{s.description ?? ""}</p>
                  </a>
                </Tooltip>
              ))}

              {pagedSectors.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    gridColumn: "1 / -1",
                    padding: "30px 0",
                    color: "#6b7280",
                  }}
                >
                  No sectors match your filter.
                </div>
              )}
            </div>

            {/* PAGINATION */}
            {filteredSectors.length > pageSize && (
              <>
                <div className="pagination">
                  <Button size="small" onClick={() => setPage(1)} disabled={page === 1}>
                    «
                  </Button>
                  <Button
                    size="small"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    ‹
                  </Button>

                  {pageNumbers.map((n) => (
                    <Button
                      key={n}
                      size="small"
                      variant={n === page ? "contained" : "outlined"}
                      onClick={() => setPage(n)}
                      sx={{ borderRadius: 999, fontWeight: 900 }}
                    >
                      {n}
                    </Button>
                  ))}

                  <Button
                    size="small"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    ›
                  </Button>
                  <Button size="small" onClick={() => setPage(totalPages)} disabled={page === totalPages}>
                    »
                  </Button>
                </div>

                <div className="page-info">
                  Showing {startIndex + 1}–{endIndex} of {filteredSectors.length} sectors
                </div>
              </>
            )}

            {filteredSectors.length > 0 && filteredSectors.length <= pageSize && (
              <div className="page-info">
                Showing {filteredSectors.length} of {filteredSectors.length} sectors
              </div>
            )}
          </>
        )}
      </div>

      <Footer routes={ROUTES} />
    </div>
  );
}
