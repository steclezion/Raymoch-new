import React, { useMemo } from "react";

// Material UI
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";

const css = `
/* Heading */
.h3sub{
  font-weight:900;
  text-align:center;
  margin:10px 0 14px;
  color:#0f172a;
}

/* ✅ REQUIRED CLASSNAME */
.data-search-row{
  display:flex;
  justify-content:flex-end;
  margin: 6px 0 12px;
}

/* GRID */
.grid{
  display:grid;
  grid-template-columns:repeat(auto-fit, minmax(260px,1fr));
  gap:14px;
  margin-top:10px;
}

/* CARD base */
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

  /* Keep stable */
  transition: box-shadow .18s ease, border-color .18s ease;
}

/* Text */
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

/* Icon */
.card .icon{
  font-size:1.35rem;
  margin-bottom:.3rem;
  display:inline-block;

  /* tilt prep */
  transform-origin:center;
  transition: transform 0.28s cubic-bezier(.34,1.56,.64,1);
  will-change: transform;
}

/* -------------------------------------------------------
   ✅ HARD LOCK: HOVER NEVER CHANGES TO WHITE OR ANYTHING
   ------------------------------------------------------- */
.grid .card:hover,
.grid .card:focus,
.grid .card:active,
.grid .card:focus-within{
  background:#ffffff !important;           /* stays white */
  color:inherit !important;
  border-color:var(--border) !important;
  box-shadow:var(--shadow) !important;
  transform:none !important;
  filter:none !important;
  outline:none !important;
}

/* Also lock children colors */
.grid .card:hover h3,
.grid .card:hover p{
  color:inherit !important; /* keep original */
}

/* -------------------------------------------------------
   ✅ ICON TILT (ONLY ICON MOVES)
   ------------------------------------------------------- */
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
  margin-top:6px;
  text-align:center;
  font-size:.82rem;
  color:#6b7280;
}

@media (prefers-reduced-motion: reduce){
  .grid .card .icon{
    animation:none !important;
    transition:none !important;
  }
}
`;

export default function MainPanel({
  loading,
  sectors,
  gridQuery,
  setGridQuery,
  page,
  setPage,
  pageSize = 20,
}) {
  // Filter sectors client-side
  const filteredSectors = useMemo(() => {
    const term = gridQuery.trim().toLowerCase();
    if (!term) return sectors;
    return sectors.filter((s) =>
      (s.title ?? "").toLowerCase().includes(term) ||
      (s.description ?? "").toLowerCase().includes(term)
    );
  }, [gridQuery, sectors]);

  // Pagination
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
    <>
      <style>{css}</style>

      <div className="h3sub">All Companies</div>

      {/* ✅ REQUIRED className */}
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

      {loading ? (
        <div className="grid-loading">
          <CircularProgress />
        </div>
      ) : (
        <>
          <div className="grid">
            {pagedSectors.map((s) => (
              <Tooltip key={s.id} title={s.title} arrow placement="top">
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
              <div style={{ textAlign: "center", gridColumn: "1 / -1", padding: "30px 0" }}>
                No sectors match your filter.
              </div>
            )}
          </div>

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
                Showing {filteredSectors.length ? startIndex + 1 : 0}–{endIndex} of{" "}
                {filteredSectors.length} sectors
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
    </>
  );
}
