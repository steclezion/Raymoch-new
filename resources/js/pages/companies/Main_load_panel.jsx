// resources/js/pages/companies/Main_load_panel.jsx
import React from "react";
import "../../styles/Main_load_panel.css";
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
    <div
      className={`rmx-card professional-card${
        company.verified ? " professional-card--verified" : ""
      }`}
      onClick={() => onOpen(company)}
      role="button"
      tabIndex={0}
    >
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

                    <div className="gridx">
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

                <div className="gridx">
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


