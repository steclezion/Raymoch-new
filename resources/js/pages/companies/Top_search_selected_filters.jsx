import React from "react";

export default function TopSearchSelectedFilters({
  resolvedPrevious,
  currentSelections,
  loadingSession = false,
  loadingResolving = false,
}) {
  return (
    <>
      <style>{selectedFiltersCss}</style>

      <div className="sf-active-wrap">
        <div className="sf-active-title">
          Previous Explore selections:
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

        <div className="sf-active-title sf-current-title">Current form selections:</div>
        <div className="sf-active-list">
          <span className="sf-chip">Keyword: {currentSelections?.keyword || "(empty)"}</span>
          <span className="sf-chip">Region: {currentSelections?.region || "All"}</span>
          <span className="sf-chip">Country: {currentSelections?.country || "All"}</span>
          <span className="sf-chip">State: {currentSelections?.state || "All"}</span>
          <span className="sf-chip">City: {currentSelections?.city || "All"}</span>
          <span className="sf-chip">Sector: {currentSelections?.sector || "All"}</span>
          <span className="sf-chip">Industry: {currentSelections?.industry || "All"}</span>
          <span className="sf-chip">Verified: {currentSelections?.verification || "OFF"}</span>
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
  background:#fbf8f3;
  border:1px solid #ded2c3;
}
.sf-active-title{
  font-size:13px;
  font-weight:900;
  color:#382116;
  margin-bottom:8px;
}
.sf-current-title{
  margin-top:14px;
  padding-top:12px;
  border-top:1px solid #ded2c3;
}
.sf-resolving{
  font-weight:800;
  color:#6f452e;
}
.sf-active-list{
  display:flex;
  align-items:center;
  gap:8px;
  flex-wrap:wrap;
}
.sf-chip{
  border:1px solid #cdbdac;
  background:#f3e7cf;
  color:#5b3825;
  font-weight:800;
  font-size:12px;
  border-radius:999px;
  padding:7px 10px;
}
`;
