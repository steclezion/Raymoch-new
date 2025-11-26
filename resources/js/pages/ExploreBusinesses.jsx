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
import Fade from "@mui/material/Fade";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

/* FULL PAGE CSS INCLUDING BOUNCE, MUI HOVER COLORS, ETC. */
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

/* PANEL */
.panel{
  background:#fff;
  border:1px solid var(--border);
  box-shadow:var(--shadow);
  border-radius:20px;
  padding:14px;
  margin:12px auto 18px;
}

/* Search tier rows */
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

/* Mobile wraps selects and controls nicely */
@media (max-width: 680px){
  .tier-1{
    flex-wrap:wrap;
  }
}

/* Elastic Search Bar */
.input-wrap{
  position:relative;
  flex:0 1 240px;
  transition:flex-basis .25s ease;
  display:flex;
  align-items:center;
}

.input-wrap:focus-within{
  flex:1 1 100%;
}

.input{
  width:100%;
  height:44px;
  padding:0 108px 0 36px;
  border:1px solid var(--border);
  border-radius:var(--pill);
  font-size:.98rem;
  background:#fff;
  transition:.25s ease;
}

.input:focus{
  border-color:#97b3ff;
  outline:3px solid #e5edff;
}

.inline-btn{
  position:absolute;
  top:50%;
  right:44px;
  transform:translateY(-50%);
}

.clear-btn{
  position:absolute;
  top:50%;
  right:8px;
  transform:translateY(-50%);
}

/* Verified Label */
.switch-label{
  font-size:.96rem;
  color:#0f1222;
}

/* Heading */
.h3sub{
  font-weight:800;
  text-align:center;
  margin:10px 0;
  color:#0f172a;
}

/* DataTable search row */
.data-search-row{
  display:flex;
  justify-content:flex-end;
  margin: 4px 0 10px;
}

/* GRID */
.grid{
  display:grid;
  grid-template-columns:repeat(auto-fit, minmax(260px,1fr));
  gap:14px;
  margin-top:10px;
}

/* CARD (MUI hover + bounce + pointer) */
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
  transition:
    transform .16s ease,
    background-color .16s ease,
    border-color .16s ease,
    box-shadow .16s ease,
    color .16s ease;
}

/* Base text/icon colors + smooth transitions */
.card h3,
.card p,
.card .icon{
  color:#0A2A6B;
  transition: color .18s ease;
}

/* HOVER EFFECT (minimal bounce + MUI blue + light-on text/icons) */
.card:hover{
  animation: card-bounce 0.25s ease-out 1;
  background:#1976d2;          /* Material UI primary */
  border-color:#1565c0;
  box-shadow:0 14px 34px rgba(21,101,192,.40);
}

.card:hover h3,
.card:hover p,
.card:hover .icon{
  color:#ffffff !important;    /* light-on color */
}

/* Minimal bounce hover animation */
@keyframes card-bounce {
  0%   { transform: translateY(0) scale(1); }
  30%  { transform: translateY(-3px) scale(1.02); }
  60%  { transform: translateY(1px) scale(1.01); }
  100% { transform: translateY(0) scale(1); }
}

.card .icon{
  font-size:1.3rem;
  margin-bottom:.3rem;
  display:inline-block;
}

.card p{
  font-size:.88rem;
  color:#6b7280;
  margin:0;
}

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

footer{
  margin-top:auto;
}
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
      explore: "/explore-businesses",
      services: "/services",
      insights: "/insights",
      about: "/about",
      trial: "/trial",
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

  const sectorOptions = useMemo(
    () => sectors.map((s) => s.title),
    [sectors]
  );

  /* ------------------------------------------------------------
    GRID FILTERING (client-side)
  ------------------------------------------------------------ */
  const filteredSectors = useMemo(() => {
    const term = gridQuery.trim().toLowerCase();
    if (!term) return sectors;
    return sectors.filter((s) =>
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

  /* ------------------------------------------------------------
    RENDER
  ------------------------------------------------------------ */
  return (
    <div className="page">
      {/* Page-scoped CSS */}
      <style>{css}</style>

      {/* Shared Header */}
      <Header routes={ROUTES} />

      <div className="container">
        {/* HERO */}
        <header className="explore-hero">
          <h1>Explore Businesses</h1>
          <p>This is the front door. Pick a sector or search; we’ll show the right companies.</p>
        </header>

        {/* TOP SEARCH PANEL (server-side search) */}
        <form className="panel" onSubmit={onSearch}>
          <div className="tier tier-1">
            {/* Elastic search bar */}
            <div className="input-wrap">
              <input
                className="input"
                type="search"
                placeholder="Search businesses…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />

              <Button
                variant="contained"
                size="small"
                color="primary"
                type="submit"
                className="inline-btn"
              >
                Search
              </Button>

              <Button
                variant="outlined"
                size="small"
                className="clear-btn"
                type="button"
                onClick={() => setQ("")}
              >
                ✕
              </Button>
            </div>

            {/* Country - Material UI Select */}
            <FormControl fullWidth size="small">
              <InputLabel>Country</InputLabel>
              <Select
                value={country}
                label="Country"
                onChange={(e) => setCountry(e.target.value)}
              >
                <MenuItem value="">
                  <em>Country</em>
                </MenuItem>
                {countries.map((c) => (
                  <MenuItem key={c.id} value={c.country_name}>
                    {c.flag_icon ? `${c.flag_icon} ` : ""}
                    {c.country_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Sector - Material UI Select */}
            <FormControl fullWidth size="small">
              <InputLabel>Sector</InputLabel>
              <Select
                value={sector}
                label="Sector"
                onChange={(e) => setSector(e.target.value)}
              >
                <MenuItem value="">
                  <em>Sector</em>
                </MenuItem>
                {sectorOptions.map((t, i) => (
                  <MenuItem key={i} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Verified */}
            <FormControlLabel
              control={
                <Switch
                  checked={verified}
                  onChange={(e) => setVerified(e.target.checked)}
                  color="primary"
                />
              }
              label="Verified only"
              className="switch-label"
            />

            {/* Search button (end of row) */}
            <Button variant="contained" color="primary" type="submit">
              Search
            </Button>
          </div>

          {/* All Companies link */}
          <div
            className="tier"
            style={{ justifyContent: "center", marginTop: 6 }}
          >
            <Button variant="outlined" color="primary" href="/companies">
              All Companies
            </Button>
          </div>
        </form>

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
          />
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="grid-loading">
            <CircularProgress />
          </div>
        ) : (
          <>
            {/* GRID WITH TOOLTIP PER CARD */}
            <div className="grid">
              {pagedSectors.map((s) => (
                <Tooltip
                  key={s.id}
                  title={s.title}
                  arrow
                  placement="top"                >
                  <a
                    className="card"
                    href={`/companies?sector=${encodeURIComponent(
                      s.title
                    )}&from=explore`}
                  >
                    <span className="icon">{s.icon ?? "🧩"}</span>
                    <h3>{s.title}</h3>
                    <p>{s.description ?? ""}</p>
                  </a>
                </Tooltip>
              ))}

              {/* Empty state when filter yields nothing */}
              {pagedSectors.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    gridColumn: "1 / -1",
                    padding: "30px 0",
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
                  <Button
                    size="small"
                    onClick={() => setPage(1)}
                    disabled={page === 1}
                  >
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
                  <Button
                    size="small"
                    onClick={() => setPage(totalPages)}
                    disabled={page === totalPages}
                  >
                    »
                  </Button>
                </div>

                <div className="page-info">
                  Showing {startIndex + 1}–{endIndex} of {filteredSectors.length} sectors
                </div>
              </>
            )}

            {/* If total records ≤ pageSize, still show info line */}
            {filteredSectors.length > 0 && filteredSectors.length <= pageSize && (
              <div className="page-info">
                Showing {filteredSectors.length} of {filteredSectors.length} sectors
              </div>
            )}
          </>
        )}
      </div>

      {/* Shared Footer */}
      <Footer routes={ROUTES} />
    </div>
  );
}
