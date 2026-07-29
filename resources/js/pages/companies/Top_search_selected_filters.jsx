import React from "react";

export default function TopSearchSelectedFilters({
  resolvedPrevious,
  loadingSession = false,
  loadingResolving = false,
}) {
  return (
    <>
      <style>{selectedFiltersCss}</style>

      <div className="sf-active-wrap">
        <div className="sf-active-title">
          Selected filters from previous search:
          {(loadingSession || loadingResolving) && (
            <span className="sf-resolving"> Resolving names...</span>
          )}
        </div>

        <div className="sf-active-list">
          <span className="sf-chip">
            Keyword: {resolvedPrevious?.keyword || "(empty)"}
          </span>
          <span className="sf-chip">
            Region: {resolvedPrevious?.region?.name || "All"}
          </span>
          <span className="sf-chip">
            Country: {resolvedPrevious?.country?.name || "All"}
          </span>
          <span className="sf-chip">
            State: {resolvedPrevious?.state?.name || "All"}
          </span>
          <span className="sf-chip">
            City: {resolvedPrevious?.city?.name || "All"}
          </span>
          <span className="sf-chip">
            Sector: {resolvedPrevious?.sector?.name || "All"}
          </span>
          <span className="sf-chip">
            Industry: {resolvedPrevious?.industry?.name || "All"}
          </span>
          <span className="sf-chip">
            Verified: {resolvedPrevious?.verification || "OFF"}
          </span>
        </div>
      </div>
    </>
  );
}

const selectedFiltersCss = `
.sf-active-wrap{
  margin-top:16px;
  padding:12px;
  border-radius:18px;
  background:#f8fafc;
  border:1px dashed #cbd5e1;
}
.sf-active-title{
  font-size:13px;
  font-weight:900;
  color:#64748b;
  margin-bottom:8px;
}
.sf-resolving{
  font-weight:800;
  color:#2563eb;
}
.sf-active-list{
  display:flex;
  align-items:center;
  gap:8px;
  flex-wrap:wrap;
}
.sf-chip{
  border:1px solid #dbeafe;
  background:#eff6ff;
  color:#1e40af;
  font-weight:800;
  font-size:12px;
  border-radius:999px;
  padding:7px 10px;
}
`;