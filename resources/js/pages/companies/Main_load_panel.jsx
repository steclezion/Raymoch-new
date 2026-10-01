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

const GROUP_LABELS = {
  region: "Region",
  country: "Country",
  state: "State",
  city: "City",
  sector: "Sector",
};

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
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen(company);
        }
      }}
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
  groupedCompanies = [],
  groupBy = "country",
  setGroupBy,
  visibleCount = 0,
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
              No companies match the selected search parameters.
            </Typography>
          ) : (
            <>
              <div className="results-grouping-bar">
                <div className="results-count" role="status" aria-live="polite">
                  <strong>{visibleCount.toLocaleString()}</strong>
                  <span>{visibleCount === 1 ? "company" : "companies"}</span>
                  <span className="results-count-separator" aria-hidden="true">•</span>
                  <span>
                    {groupedCompanies.length.toLocaleString()} {groupedCompanies.length === 1 ? "group" : "groups"}
                  </span>
                </div>

                <label className="group-by-control" htmlFor="company-group-by">
                  <span>Group companies by</span>
                  <select
                    id="company-group-by"
                    value={groupBy}
                    onChange={(event) => setGroupBy(event.target.value)}
                  >
                    {Object.entries(GROUP_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </label>
              </div>

              {groupedCompanies.map((group) => (
                <section className="company-group" key={`${groupBy}-${group.label}`}>
                  <div className="group-heading-row">
                    <h2 className="country-heading">
                      <span>{GROUP_LABELS[groupBy]}:</span> {group.label}
                    </h2>
                    <span className="group-count">
                      {group.companies.length.toLocaleString()} {group.companies.length === 1 ? "company" : "companies"}
                    </span>
                  </div>

                  <div className="gridx">
                    {group.companies.map((company) => (
                      <Tooltip
                        key={company.id}
                        title={company.name}
                        arrow
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 200 }}
                      >
                        <Box>
                          <CompanyCard
                            company={company}
                            onOpen={openDetailDialog}
                            showVerifiedBadge={verified}
                          />
                        </Box>
                      </Tooltip>
                    ))}
                  </div>
                </section>
              ))}
            </>
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
                Page {page.toLocaleString()} of {totalPages.toLocaleString()} • {total.toLocaleString()} total companies
              </div>
            </Box>
          )}
        </>
      )}
    </>
  );
}


