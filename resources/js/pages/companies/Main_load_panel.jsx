// resources/js/pages/companies/Main_load_panel.jsx
import React from "react";
import {
  Box,
  Button,
  CircularProgress,
  Fade,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

/* ---------------------------- UI COMPONENTS ---------------------------- */
function CompanyCard({ company, onOpen, showVerifiedBadge }) {
  const tier = company.cti?.tier || "";
  const tierLower = tier.toLowerCase();
  let tierClass = "";
  if (tierLower.includes("gold")) tierClass = "cti-gold";
  else if (tierLower.includes("silver")) tierClass = "cti-silver";
  else if (tierLower.includes("bronze")) tierClass = "cti-bronze";

  return (
    <div className="rmx-card" onClick={() => onOpen(company)} role="button" tabIndex={0}>
      {showVerifiedBadge && company.verified && (
        <Tooltip title="Verified company" arrow>
          <div className="rmx-verified-badge">V</div>
        </Tooltip>
      )}

      <div className="rmx-card-top">
        <h3 className="rmx-card-title">{company.name || "—"}</h3>
        <p className="rmx-card-sub">
          {company.sector || "—"} • {company.country || "—"}
        </p>
      </div>

      <div className="rmx-meta">
        {company.stage && <span className="rmx-pill">Stage: {company.stage}</span>}
        {company.city && <span className="rmx-pill">{company.city}</span>}
        {tier && (
          <span className={`rmx-pill rmx-cti ${tierClass}`}>
            CTI: {tier}
          </span>
        )}
      </div>
    </div>
  );
}

const css = `
/* =============================
   Loading (small + professional)
   ============================= */
.companies-loading{
  margin: 18px 0 10px;
  text-align:center;
}
.rmx-loading-wrap{
  display:inline-flex;
  align-items:center;
  gap:10px;
  padding:10px 14px;
  border-radius:999px;
  border:1px solid rgba(148,163,184,.45);
  background:
    linear-gradient(180deg, rgba(255,255,255,.92), rgba(248,250,252,.92));
  box-shadow: 0 10px 26px rgba(15, 23, 42, .08);
}
.rmx-loading-dot{
  width:9px;height:9px;border-radius:50%;
  background: linear-gradient(135deg,#2563eb,#60a5fa);
  box-shadow: 0 0 0 6px rgba(37,99,235,.12);
}
.rmx-loading-text{
  font-size:12.5px;
  font-weight:700;
  color:#0f172a;
}
.rmx-loading-sub{
  font-size:12px;
  color:#64748b;
  margin-top:6px;
}

/* =============================
   Grid (responsive + stable)
   - proportional cards
   - horizontal flow
   ============================= */
.grid{
  display:grid;
  gap:14px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  align-items:stretch;
}
@media (max-width: 1280px){
  .grid{ grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
@media (max-width: 900px){
  .grid{ grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 560px){
  .grid{ grid-template-columns: 1fr; }
}

/* Country headings keep good spacing on resize */
.country-heading{
  margin: 18px 0 10px;
  font-weight: 900;
  color:#0f172a;
  letter-spacing:.2px;
}
@media (max-width: 560px){
  .country-heading{ margin: 14px 0 8px; font-size: 1.05rem; }
}

/* =============================
   Cards (smaller, modern, gradient)
   ============================= */
.rmx-card{
  position:relative;
  height:100%;
  min-height:110px;
  padding:12px 12px 10px;
  border-radius:16px;
  cursor:pointer;
  user-select:none;
  border:1px solid rgba(226,232,240,.9);
  background:
    radial-gradient(900px 220px at 20% 0%,
      rgba(37,99,235,.10) 0%,
      rgba(37,99,235,0) 55%),
    linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
  box-shadow: 0 10px 26px rgba(2, 8, 23, .06);
  transition: transform .14s ease, box-shadow .14s ease, border-color .14s ease;
  outline:none;
}
.rmx-card:hover{
  transform: translateY(-2px);
  border-color: rgba(59,130,246,.55);
  box-shadow: 0 16px 34px rgba(2, 8, 23, .10);
}
.rmx-card:active{ transform: translateY(-1px); }

.rmx-card-top{ padding-right: 34px; }
.rmx-card-title{
  margin:0;
  font-size: .98rem;        /* smaller */
  line-height:1.15;
  font-weight:900;
  color:#0b1220;
  letter-spacing:.1px;
  display:-webkit-box;
  -webkit-line-clamp:2;
  -webkit-box-orient: vertical;
  overflow:hidden;
}
.rmx-card-sub{
  margin:6px 0 0;
  font-size:.82rem;         /* smaller */
  color:#64748b;
  display:-webkit-box;
  -webkit-line-clamp:1;
  -webkit-box-orient: vertical;
  overflow:hidden;
}

/* Verified badge */
.rmx-verified-badge{
  position:absolute;
  top:10px; right:10px;
  width:26px; height:26px;
  border-radius:999px;
  display:flex;
  align-items:center;
  justify-content:center;
  font-weight:900;
  font-size:12px;
  color:#fff;
  background: linear-gradient(135deg,#22c55e,#16a34a);
  box-shadow: 0 10px 18px rgba(22,163,74,.22);
}

/* Meta pills */
.rmx-meta{
  display:flex;
  flex-wrap:wrap;
  gap:6px;
  margin-top:10px;
}
.rmx-pill{
  font-size:.74rem;
  font-weight:800;
  color:#0f172a;
  border:1px solid rgba(226,232,240,.95);
  background: rgba(248,250,252,.9);
  border-radius:999px;
  padding:4px 8px;
}

/* CTI styling */
.rmx-cti{ border-color: rgba(226,232,240,.95); }
.cti-gold{
  background: linear-gradient(180deg, rgba(245,158,11,.16), rgba(245,158,11,.06));
  border-color: rgba(245,158,11,.35);
}
.cti-silver{
  background: linear-gradient(180deg, rgba(148,163,184,.18), rgba(148,163,184,.07));
  border-color: rgba(148,163,184,.40);
}
.cti-bronze{
  background: linear-gradient(180deg, rgba(234,88,12,.16), rgba(234,88,12,.06));
  border-color: rgba(234,88,12,.35);
}

/* =============================
   Pagination polish
   ============================= */
.pagination .MuiButton-root{
  border-radius: 12px;
  text-transform:none;
}
.page-info{
  margin-top:8px;
  font-size:12.5px;
  color:#64748b;
}

/* Responsive padding inside MUI Box container is handled by Companies.css
   But these keep the grid clean on small screens. */
@media (max-width: 560px){
  .rmx-card{ padding:12px; }
  .rmx-meta{ margin-top:8px; }
}
`;

export default function MainLoadPanel({
  loading,
  progress,
  hasResults,
  isAllInputsEmpty,
  nestedGrouped,
  flatGrouped,
  shouldGroupBySector,
  verified,
  openDetailDialog,
  totalPages,
  page,
  total,
  pageNumbers,
  goToPage,
  goPrev,
  goNext,
}) {
  return (
    <>
      <style>{css}</style>

      {/* ---------------------------- LOADING ---------------------------- */}
      {loading && (
        <Box className="companies-loading">
          <div className="rmx-loading-wrap" aria-live="polite">
            <span className="rmx-loading-dot" />
            <span className="rmx-loading-text">Loading companies</span>
            <span style={{ width: 10 }} />
            <CircularProgress size={18} />
            <Typography variant="caption" sx={{ fontWeight: 800, color: "#0f172a" }}>
              {`${Math.round(progress)}%`}
            </Typography>
          </div>
          <div className="rmx-loading-sub">Fetching and grouping results…</div>
        </Box>
      )}

      {/* ----------------------------- GRID ----------------------------- */}
      {!loading && (
        <>
          {!hasResults ? (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
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
                      sx={{ fontWeight: 900, mb: 0.75, color: "#475569" }}
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
                <Button size="small" onClick={() => goToPage(1)} disabled={page === 1}>
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

                <Button size="small" onClick={goNext} disabled={page === totalPages}>
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
    </>
  );
}
