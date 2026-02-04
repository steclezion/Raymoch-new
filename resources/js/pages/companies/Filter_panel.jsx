// resources/js/pages/companies/Filter_panel.jsx
import React, { useMemo } from "react";
import {
  Box,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Tooltip,
  Typography,
  Stack,
  Autocomplete,
  Chip,
  Divider,
} from "@mui/material";

// Icons (MUI)
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";
import BusinessCenterRoundedIcon from "@mui/icons-material/BusinessCenterRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import NorthEastRoundedIcon from "@mui/icons-material/NorthEastRounded";

const css = `
/* =========================
   Raymoch Filter Panel (match screenshot)
   ========================= */
.rmx-panel-wrap{
  width:100%;
  border-radius:26px;
  background:#fff;
  border:1px solid #e6e9f2;
  box-shadow:0 14px 40px rgba(10,42,107,.12);
  overflow:hidden;
}

/* Top blue header bar */
.rmx-panel-head{
  position:relative;
  padding:18px 18px;
  background: linear-gradient(90deg,#1a2f7b 0%, #243a94 45%, #2c46b0 100%);
  color:#fff;
}
.rmx-panel-head .title{
  font-weight:900;
  letter-spacing:.6px;
  font-size:16px;
  line-height:1.1;
}
.rmx-panel-head .sub{
  margin-top:6px;
  opacity:.9;
  font-size:13px;
}

/* Verified badge (top-right) */
.rmx-verified-pill{
  position:absolute;
  right:16px;
  top:16px;
  display:flex;
  align-items:center;
  gap:8px;
  padding:8px 12px;
  border-radius:999px;
  background:rgba(255,255,255,.16);
  border:1px solid rgba(255,255,255,.22);
  backdrop-filter: blur(6px);
  font-weight:800;
  font-size:13px;
}
.rmx-verified-pill .dot{
  width:26px;height:26px;
  border-radius:999px;
  background:rgba(255,255,255,.22);
  display:grid;place-items:center;
}
.rmx-verified-pill .txt{
  display:flex;
  align-items:center;
  gap:6px;
  white-space:nowrap;
}

/* Body area */
.rmx-panel-body{
  padding:18px;
  background:#fff;
}

/* Field label above inputs like screenshot */
.rmx-field-label{
  font-size:12.5px;
  font-weight:800;
  color:#667085;
  margin:0 0 6px 10px;
}

/* Input shells (rounded “pill” look) */
.rmx-pill{
  height:52px;
  border-radius:999px !important;
  background:#fff;
  border:1px solid #dfe3ea;
  box-shadow:0 2px 12px rgba(16,24,40,.06);
  overflow:hidden;
}
.rmx-pill .MuiInputBase-root{
  height:52px;
  border-radius:999px !important;
  padding-left:6px;
}
.rmx-pill .MuiOutlinedInput-notchedOutline{
  border:0 !important;
}
.rmx-pill .MuiInputBase-input{
  padding:0 !important;
  padding-left:4px !important;
  font-size:15px;
}
.rmx-pill .rmx-input-icon{
  width:44px;
  height:44px;
  border-radius:999px;
  display:grid;
  place-items:center;
  margin-left:6px;
  color:#667085;
  background:#f5f7fb;
}

/* Autocomplete (country/sector) */
.rmx-ac .MuiAutocomplete-inputRoot{
  padding-left:6px !important;
}
.rmx-ac .MuiAutocomplete-endAdornment{
  right:12px !important;
}

/* Verified switch area (right side) */
.rmx-verified-row{
  display:flex;
  align-items:center;
  justify-content:flex-end;
  gap:10px;
  white-space:nowrap;
}
.rmx-verified-label{
  font-weight:900;
  color:#101828;
}

/* Divider line like screenshot */
.rmx-divider{
  margin:14px 0 14px;
  border-color:#eef1f6 !important;
}

/* Bottom actions row */
.rmx-actions{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  flex-wrap:wrap;
}
.rmx-actions .left{
  display:flex;
  gap:12px;
  align-items:center;
  flex-wrap:wrap;
}
.rmx-btn-ghost{
  border-radius:999px !important;
  padding:10px 18px !important;
  font-weight:900 !important;
  text-transform:none !important;
}
.rmx-btn-primary{
  border-radius:999px !important;
  padding:12px 26px !important;
  font-weight:900 !important;
  text-transform:none !important;
  min-width:220px;
  box-shadow:0 12px 24px rgba(25,118,210,.25);
}
.rmx-btn-primary:hover{
  box-shadow:0 16px 28px rgba(25,118,210,.30);
}

/* Active chips section */
.rmx-chips{
  margin-top:14px;
  padding:12px;
  border-radius:16px;
  background:#f9fafb;
  border:1px dashed #d0d7e2;
}

/* Local filter */
.rmx-local{
  margin-top:14px;
}
.rmx-local .MuiInputBase-root{
  border-radius:14px !important;
}

/* Responsive layout */
.rmx-grid{
  display:grid;
  grid-template-columns: 1.6fr 1fr 1fr auto;
  gap:16px;
  align-items:end;
}

@media (max-width: 1000px){
  .rmx-grid{
    grid-template-columns: 1fr 1fr;
    align-items:end;
  }
  .rmx-verified-row{
    justify-content:flex-start;
  }
  .rmx-btn-primary{
    min-width:200px;
  }
}

@media (max-width: 560px){
  .rmx-panel-body{ padding:14px; }
  .rmx-grid{ grid-template-columns:1fr; }
  .rmx-actions{ flex-direction:column; align-items:stretch; }
  .rmx-actions .left{ width:100%; justify-content:space-between; }
  .rmx-btn-primary{ width:100%; min-width:unset; }
}
`;

export default function FilterPanel({
  q,
  setQ,
  sector,
  setSector,
  country,
  setCountry,
  verified,
  setVerified,
  localFilter,
  setLocalFilter,
  sectorOptions,
  countryOptions,
  hasAnyFilter,
  onClearFilters,
  setPage,
}) {
  const verifiedText = useMemo(() => (verified ? "ON" : "OFF"), [verified]);

  // The page already loads on change, but the screenshot has a Search button.
  // This makes "Search" feel real without changing your existing data flow.
  const onSearchClick = () => setPage(1);

  return (
    <>
      <style>{css}</style>

      <Box className="rmx-panel-wrap">
        {/* BLUE HEADER */}
        <Box className="rmx-panel-head">
          <div className="title">SEARCH &amp; FILTERS</div>
          <div className="sub">
            Use filters below to open the company list with matching results.
          </div>

          <div className="rmx-verified-pill" aria-label="Verified status">
            <span className="dot">
              <VerifiedRoundedIcon sx={{ fontSize: 18, color: "#fff" }} />
            </span>
            <span className="txt">
              Verified: <strong>{verifiedText}</strong>
            </span>
          </div>
        </Box>

        {/* BODY */}
        <Box className="rmx-panel-body">
          {/* FIELDS ROW */}
          <Box className="rmx-grid">
            {/* Keyword */}
            <Box>
              <div className="rmx-field-label">Keyword</div>
              <Box className="rmx-pill">
                <TextField
                  fullWidth
                  placeholder="Search businesses..."
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value);
                    setPage(1);
                  }}
                  InputProps={{
                    startAdornment: (
                      <span className="rmx-input-icon" aria-hidden="true">
                        <SearchRoundedIcon fontSize="small" />
                      </span>
                    ),
                  }}
                  variant="outlined"
                />
              </Box>
            </Box>

            {/* Country */}
            <Box>
              <div className="rmx-field-label">Country</div>
              <Box className="rmx-pill rmx-ac">
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
                    <TextField
                      {...params}
                      placeholder="Select country"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <span className="rmx-input-icon" aria-hidden="true">
                            <PublicRoundedIcon fontSize="small" />
                          </span>
                        ),
                      }}
                    />
                  )}
                  clearOnEscape
                />
              </Box>
            </Box>

            {/* Sector */}
            <Box>
              <div className="rmx-field-label">Sector</div>
              <Box className="rmx-pill rmx-ac">
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
                    <TextField
                      {...params}
                      placeholder="Select sector"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <span className="rmx-input-icon" aria-hidden="true">
                            <BusinessCenterRoundedIcon fontSize="small" />
                          </span>
                        ),
                      }}
                    />
                  )}
                  clearOnEscape
                />
              </Box>
            </Box>

            {/* Verified switch (right) */}
            <Box className="rmx-verified-row">
              <Switch
                checked={verified}
                onChange={(e) => {
                  setVerified(e.target.checked);
                  setPage(1);
                }}
              />
              <span className="rmx-verified-label">Verified only</span>
            </Box>
          </Box>

          {/* Divider line */}
          <Divider className="rmx-divider" />

          {/* ACTIONS ROW */}
          <Box className="rmx-actions">
            <Box className="left">
              <Button
                variant="outlined"
                className="rmx-btn-ghost"
                onClick={() => {
                  onClearFilters();
                  setPage(1);
                }}
              >
                Clear
              </Button>

              <Button
                variant="outlined"
                className="rmx-btn-ghost"
                href="/companies"
                endIcon={<NorthEastRoundedIcon />}
              >
                All Companies
              </Button>
            </Box>

            <Button
              variant="contained"
              className="rmx-btn-primary"
              onClick={onSearchClick}
            >
              Search
            </Button>
          </Box>

          {/* Active filter chips (kept, but styled) */}
          {hasAnyFilter && (
            <Box className="rmx-chips">
              <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 800, color: "text.secondary", mr: 0.5 }}
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
                  onClick={() => {
                    onClearFilters();
                    setPage(1);
                  }}
                  sx={{ ml: 0.5, textTransform: "none", fontWeight: 900 }}
                >
                  Clear all
                </Button>
              </Stack>
            </Box>
          )}

          {/* Client-side filter (only when q empty) */}
          {!q && (
            <Box className="rmx-local">
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
      </Box>
    </>
  );
}
