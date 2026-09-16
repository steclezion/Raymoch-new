import React, { useMemo, useState } from "react";

// Material UI
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";

const css = `
.h3sub{
  font-weight:900;
  text-align:center;
  margin:10px 0 14px;
  color:#0f172a;
}

.subcopy{
  text-align:center;
  margin:-4px 0 14px;
  color:#64748b;
  font-size:.95rem;
}

.data-search-row{
  display:flex;
  justify-content:flex-end;
  margin: 6px 0 12px;
}

.grid{
  display:grid;
  grid-template-columns:repeat(auto-fit, minmax(260px,1fr));
  gap:14px;
  margin-top:10px;
}

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
  text-decoration:none;
  transition: box-shadow .18s ease, border-color .18s ease;
}

.card h3{
  font-size:1.15rem;
  font-weight:900;
  margin:0 0 6px;
  color:#0A2A6B;
}
.card p{
  font-size:.9rem;
  margin:0;
  color:#6b7280;
}

.card .icon{
  font-size:1.35rem;
  margin-bottom:.3rem;
  display:inline-block;
  transform-origin:center;
  transition: transform 0.28s cubic-bezier(.34,1.56,.64,1);
  will-change: transform;
}

.grid .card:hover,
.grid .card:focus,
.grid .card:active,
.grid .card:focus-within{
  background:#ffffff !important;
  color:inherit !important;
  border-color:var(--border) !important;
  box-shadow:var(--shadow) !important;
  transform:none !important;
  filter:none !important;
  outline:none !important;
}

.grid .card:hover h3,
.grid .card:hover p{
  color:inherit !important;
}

.grid .card:hover .icon,
.grid .card:focus .icon{
  animation: icon-tilt 0.45s ease-out 1;
}

@keyframes icon-tilt{
  0%   { transform: rotate(0deg) scale(1); }
  30%  { transform: rotate(-10deg) scale(1.08); }
  60%  { transform: rotate(8deg)  scale(1.05); }
  100% { transform: rotate(0deg)  scale(1); }
}

.grid-loading{
  margin-top:24px;
  display:flex;
  justify-content:center;
  min-height:120px;
}

.pagination{
  margin-top:18px;
  display:flex;
  justify-content:center;
  gap:6px;
  flex-wrap:wrap;
}
.page-info{
  margin-top:6px;
  text-align:center;
  font-size:.82rem;
  color:#6b7280;
}

.empty-state{
  text-align:center;
  grid-column:1 / -1;
  padding:30px 0;
  color:#6b7280;
}

.tooltip-card{
  min-width:280px;
  max-width:340px;
  padding:10px 10px 8px;
  border-radius:16px;
  background: linear-gradient(180deg, #e0f2fe 0%, #f0f9ff 55%, #ffffff 100%);
  border:1px solid rgba(125,211,252,.55);
  box-shadow:
    0 18px 38px rgba(14,116,144,.18),
    inset 0 1px 0 rgba(255,255,255,.85);
  color:#0f172a;
}

.tooltip-title{
  font-size:13px;
  font-weight:900;
  margin-bottom:10px;
  color:#075985;
  letter-spacing:.2px;
}

.tooltip-divider{
  height:1px;
  background: linear-gradient(90deg, rgba(125,211,252,.1), rgba(125,211,252,.8), rgba(125,211,252,.1));
  margin: 0 0 10px;
}

.tooltip-row{
  display:flex;
  justify-content:space-between;
  gap:16px;
  margin-bottom:8px;
  font-size:12px;
  align-items:flex-start;
}

.tooltip-label{
  color:#334155;
  font-weight:700;
}

.tooltip-value{
  color:#0c4a6e;
  font-weight:900;
  text-align:right;
}

.tooltip-loading-wrap{
  min-width:280px;
  max-width:340px;
  padding:18px 14px 16px;
  border-radius:16px;
  background: linear-gradient(180deg, #e0f2fe 0%, #f0f9ff 55%, #ffffff 100%);
  border:1px solid rgba(125,211,252,.55);
  box-shadow:
    0 18px 38px rgba(14,116,144,.18),
    inset 0 1px 0 rgba(255,255,255,.85);
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  gap:10px;
}

.tooltip-loading-text{
  font-size:12px;
  font-weight:800;
  color:#075985;
}

.tooltip-empty{
  min-width:280px;
  max-width:340px;
  padding:16px 14px;
  border-radius:16px;
  background: linear-gradient(180deg, #e0f2fe 0%, #f0f9ff 55%, #ffffff 100%);
  border:1px solid rgba(125,211,252,.55);
  box-shadow:
    0 18px 38px rgba(14,116,144,.18),
    inset 0 1px 0 rgba(255,255,255,.85);
  color:#075985;
  font-size:12px;
  font-weight:800;
}

/* Home.jsx visual system */
.h3sub{color:#382116}.subcopy,.page-info,.empty-state{color:#7a746d}
.grid-loading .MuiCircularProgress-root,.tooltip-loading-wrap .MuiCircularProgress-root{color:#5b3825}
.card{border-color:#ded2c3;background:#fbf8f3;box-shadow:0 8px 24px rgba(72,47,30,.07)}
.card h3{color:#5b3825}.card p{color:#7a746d}
.grid .card:hover,.grid .card:focus,.grid .card:active,.grid .card:focus-within{border-color:#cdb79f!important;background:#f8efe5!important;box-shadow:0 12px 28px rgba(72,47,30,.11)!important}
.data-search-row .MuiOutlinedInput-root{min-height:43px;border-radius:10px;background:#fbf8f3;color:#1c1d1f}
.data-search-row .MuiOutlinedInput-notchedOutline{border-color:#ded2c3}
.data-search-row .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline{border-color:#bfa286}
.data-search-row .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline{border-color:#8f6847;box-shadow:0 0 0 3px rgba(143,104,71,.14)}
.pagination .MuiButton-root{min-width:43px;height:43px;border-radius:10px;border-color:#d5c2ad;color:#5b3825;font-weight:800}
.pagination .MuiButton-outlined:hover,.pagination .MuiButton-text:hover{border-color:#bfa286;background:#f8efe5}
.pagination .MuiButton-contained{color:#fbf8f3;background:linear-gradient(135deg,#6f452e,#5b3825);box-shadow:0 6px 15px rgba(91,56,37,.18)}
.pagination .MuiButton-contained:hover{background:linear-gradient(135deg,#5b3825,#382116)}
.tooltip-card,.tooltip-loading-wrap,.tooltip-empty{border-color:#d8c3ad;color:#382116;background:linear-gradient(180deg,#f3e8dc,#f8efe5 55%,#fbf8f3);box-shadow:0 18px 38px rgba(72,47,30,.16),inset 0 1px 0 rgba(255,255,255,.85)}
.tooltip-title,.tooltip-loading-text,.tooltip-empty{color:#5b3825}.tooltip-label{color:#6d5d52}.tooltip-value{color:#382116}
.tooltip-divider{background:linear-gradient(90deg,rgba(181,123,63,.1),rgba(181,123,63,.7),rgba(181,123,63,.1))}

@media (prefers-reduced-motion: reduce){
  .grid .card .icon{
    animation:none !important;
    transition:none !important;
  }
}
`;

function StatTooltipContent({ title, stats, loading }) {
  if (loading) {
    return (
      <div className="tooltip-loading-wrap">
        <CircularProgress size={26} thickness={5} />
        <div className="tooltip-loading-text">Loading statistics...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="tooltip-empty">
        No statistics available.
      </div>
    );
  }

  return (
    <div className="tooltip-card">
      <div className="tooltip-title">{title}</div>
      <div className="tooltip-divider" />

      <div className="tooltip-row">
        <span className="tooltip-label">Companies attached</span>
        <span className="tooltip-value">{stats.total_companies ?? 0}</span>
      </div>

      <div className="tooltip-row">
        <span className="tooltip-label">Verified companies</span>
        <span className="tooltip-value">{stats.verified_companies ?? 0}</span>
      </div>

      <div className="tooltip-row">
        <span className="tooltip-label">Regions covered</span>
        <span className="tooltip-value">{stats.regions_count ?? 0}</span>
      </div>

      <div className="tooltip-row">
        <span className="tooltip-label">Top country</span>
        <span className="tooltip-value">
          {stats.top_country ?? "N/A"}
          {stats.top_country_companies
            ? ` (${stats.top_country_companies})companies`
            : ""}
        </span>
      </div>
    </div>
  );
}

export default function MainPanel({
  loading,
  sectors,
  industries,
  selectedSector,
  selectedSectorObject,
  gridQuery,
  setGridQuery,
  page,
  setPage,
  pageSize = 20,
}) {
  const [tooltipCache, setTooltipCache] = useState({});
  const [loadingTooltipKey, setLoadingTooltipKey] = useState("");

  const showingIndustries = Boolean(
    selectedSector && String(selectedSector).trim() !== ""
  );

  const panelTitle = showingIndustries
    ? "Industries Under Selected Sector"
    : "All Sectors";

  const panelSubtitle = showingIndustries
    ? `Showing industries grouped under ${
        selectedSectorObject?.title ?? selectedSectorObject?.name ?? "selected sector"
      }`
    : "Showing all sectors just like the initial phase.";

  const sourceItems = useMemo(() => {
    return showingIndustries ? industries ?? [] : sectors ?? [];
  }, [showingIndustries, industries, sectors]);

  const filteredItems = useMemo(() => {
    const term = gridQuery.trim().toLowerCase();
    if (!term) return sourceItems;

    return sourceItems.filter((item) =>
      String(item.title ?? item.name ?? "")
        .toLowerCase()
        .includes(term) ||
      String(item.description ?? "")
        .toLowerCase()
        .includes(term)
    );
  }, [gridQuery, sourceItems]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredItems.length);
  const pagedItems = filteredItems.slice(startIndex, endIndex);

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

  const fetchTooltipStats = async (item) => {
    const type = showingIndustries ? "industry" : "sector";
    const cacheKey = `${type}-${item.id}`;

    if (tooltipCache[cacheKey]) return;

    try {
      setLoadingTooltipKey(cacheKey);

      const res = await fetch(
        `/api/explore-card-stats?type=${encodeURIComponent(type)}&id=${encodeURIComponent(item.id)}`,
        {
          headers: { Accept: "application/json" },
          credentials: "same-origin",
        }
      );

      const json = await res.json();

      setTooltipCache((prev) => ({
        ...prev,
        [cacheKey]: json?.ok ? json.data : null,
      }));
    } catch {
      setTooltipCache((prev) => ({
        ...prev,
        [cacheKey]: null,
      }));
    } finally {
      setLoadingTooltipKey("");
    }
  };

  return (
    <>
      <style>{css}</style>

      <div className="h3sub">{panelTitle}</div>
      <div className="subcopy">{panelSubtitle}</div>

      <div className="data-search-row">
        <TextField
          size="small"
          variant="outlined"
          label={showingIndustries ? "Filter industries" : "Filter sectors"}
          placeholder={
            showingIndustries
              ? "Type to filter industries..."
              : "Type to filter by title or description…"
          }
          value={gridQuery}
          onChange={(e) => setGridQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="grid-loading">
          <CircularProgress />
        </div>
      ) : (
        <>
          <div className="grid">
            {pagedItems.map((item) => {
              const tooltipKey = `${showingIndustries ? "industry" : "sector"}-${item.id}`;
              const stats = tooltipCache[tooltipKey];
              const isTooltipLoading = loadingTooltipKey === tooltipKey;

              return (
                <Tooltip
                  key={item.id}
                  arrow
                  placement="top"
                  enterDelay={220}
                  leaveDelay={120}
                  title={
                    <StatTooltipContent
                      title={item.title ?? item.name}
                      stats={stats}
                      loading={isTooltipLoading}
                    />
                  }
                  slotProps={{
                    tooltip: {
                      sx: {
                        background: "transparent",
                        boxShadow: "none",
                        padding: 0,
                        maxWidth: 360,
                      },
                    },
                    arrow: {
                      sx: {
                        color: "#f3e8dc",
                      },
                    },
                  }}
                >
                  <a
                    className="card"
                    href={
                      showingIndustries
                        ? `/companies?sector_id=${encodeURIComponent(
                            selectedSector
                          )}&industry_id=${encodeURIComponent(item.id)}&from=explore`
                        : `/companies?sector_id=${encodeURIComponent(item.id)}&from=explore`
                    }
                    onMouseEnter={() => fetchTooltipStats(item)}
                    onFocus={() => fetchTooltipStats(item)}
                  >
                    <span className="icon">{item.icon ?? "🧩"}</span>
                    <h3>{item.title ?? item.name}</h3>
                    <p>{item.description ?? ""}</p>
                  </a>
                </Tooltip>
              );
            })}

            {pagedItems.length === 0 && (
              <div className="empty-state">
                {showingIndustries
                  ? "No industries found under this sector."
                  : "No sectors match your filter."}
              </div>
            )}
          </div>

          {filteredItems.length > pageSize && (
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
                Showing {filteredItems.length ? startIndex + 1 : 0}–{endIndex} of{" "}
                {filteredItems.length} {showingIndustries ? "industries" : "sectors"}
              </div>
            </>
          )}

          {filteredItems.length > 0 && filteredItems.length <= pageSize && (
            <div className="page-info">
              Showing {filteredItems.length} of {filteredItems.length}{" "}
              {showingIndustries ? "industries" : "sectors"}
            </div>
          )}
        </>
      )}
    </>
  );
}
