import React, { useMemo, useState } from "react";
import Select, { components } from "react-select";
import { toast } from "sonner";
import SearchAnimatedModal from "./SearchAnimatedModal";

function IconSearch(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M16.6 16.6 21 21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconGlobe(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M2 12h20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 2c3 3 3 17 0 20M12 2c-3 3-3 17 0 20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconBriefcase(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M9 7V6a3 3 0 0 1 6 0v1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M4 8h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M4 12h16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SpinnerIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeOpacity="0.28"
        strokeWidth="3"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SelectDropdownIndicator(props) {
  return (
    <components.DropdownIndicator {...props}>
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
        <path
          d="m6 9 6 6 6-6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </components.DropdownIndicator>
  );
}

function SelectNoOptionsMessage(props) {
  return (
    <components.NoOptionsMessage {...props}>
      No matching result found
    </components.NoOptionsMessage>
  );
}

function buildSelectStyles(hasError = false) {
  return {
    container: (base) => ({
      ...base,
      width: "100%",
    }),
    control: (base, state) => ({
      ...base,
      minHeight: 50,
      height: 50,
      borderRadius: 999,
      borderColor: hasError
        ? "#ef4444"
        : state.isFocused
          ? "#9db7ff"
          : "#e5e7eb",
      boxShadow: hasError
        ? "0 0 0 4px rgba(239,68,68,.12)"
        : state.isFocused
          ? "0 0 0 4px rgba(59,130,246,.14)"
          : "0 2px 10px rgba(15,23,42,.04)",
      backgroundColor: state.isDisabled ? "#f8fafc" : "#fff",
      paddingLeft: 40,
      paddingRight: 8,
      cursor: state.isDisabled ? "not-allowed" : "pointer",
      transition: "all .18s ease",
      "&:hover": {
        borderColor: hasError ? "#ef4444" : "#d7dbe5",
      },
    }),
    valueContainer: (base) => ({
      ...base,
      height: 50,
      padding: "0 8px 0 0",
    }),
    input: (base) => ({
      ...base,
      margin: 0,
      padding: 0,
      color: "#111827",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: "#6b7280",
      padding: 8,
    }),
    clearIndicator: (base) => ({
      ...base,
      color: "#94a3b8",
      padding: 8,
    }),
    placeholder: (base) => ({
      ...base,
      color: "#9ca3af",
      fontSize: 15,
    }),
    singleValue: (base, state) => ({
      ...base,
      color: state.isDisabled ? "#94a3b8" : "#111827",
      fontSize: 15,
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 99999,
    }),
    menu: (base) => ({
      ...base,
      zIndex: 99999,
      borderRadius: 18,
      overflow: "hidden",
      border: "1px solid #e5e7eb",
      boxShadow: "0 18px 40px rgba(15,23,42,.14)",
    }),
    menuList: (base) => ({
      ...base,
      padding: 8,
      maxHeight: 240,
    }),
    option: (base, state) => ({
      ...base,
      borderRadius: 12,
      marginBottom: 4,
      padding: "11px 14px",
      fontSize: 14,
      cursor: "pointer",
      backgroundColor: state.isSelected
        ? "#dbeafe"
        : state.isFocused
          ? "#eff6ff"
          : "#fff",
      color: "#0f172a",
      fontWeight: state.isSelected ? 800 : 600,
      ":active": {
        backgroundColor: "#dbeafe",
      },
    }),
    noOptionsMessage: (base) => ({
      ...base,
      color: "#6b7280",
      fontSize: 13,
      fontWeight: 700,
    }),
  };
}

const selectSharedProps = {
  isSearchable: true,
  menuPosition: "fixed",
  menuPortalTarget: typeof document !== "undefined" ? document.body : null,
  components: {
    DropdownIndicator: SelectDropdownIndicator,
    NoOptionsMessage: SelectNoOptionsMessage,
  },
};

function getCsrfToken() {
  return (
    document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || ""
  );
}

export default function TopSearchPanel({
  q,
  setQ,
  region,
  setRegion,
  country,
  setCountry,
  stateItem,
  setStateItem,
  city,
  setCity,
  sector,
  setSector,
  industry,
  setIndustry,
  verified,
  setVerified,
  regions,
  countries,
  states,
  cities,
  sectors,
  industries,
  onCountryFirstSelection,
}) {
  const [fieldErrors, setFieldErrors] = useState({
    sector: false,
  });
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchToken, setSearchToken] = useState("");
  const [searchPayload, setSearchPayload] = useState(null);

  const clearValidation = () => {
    setFieldErrors({
      sector: false,
    });
  };

  const regionOptions = useMemo(() => {
    return [
      { value: "all", label: "All" },
      ...(regions ?? []).map((r) => ({
        value: String(r.id),
        label: r.name,
      })),
    ];
  }, [regions]);

  const countryOptions = useMemo(() => {
    return [
      { value: "all", label: "All" },
      ...(countries ?? []).map((c) => ({
        value: String(c.countries_all_id ?? c.id),
        label: c.country_name ?? c.name,
      })),
    ];
  }, [countries]);

  const stateOptions = useMemo(() => {
    if (!country || country === "all") return [];

    return [
      { value: "all", label: "All" },
      ...(states ?? []).map((s) => ({
        value: String(s.id),
        label: s.name,
      })),
    ];
  }, [states, country]);

  const cityOptions = useMemo(() => {
    if (!stateItem || stateItem === "all") return [];

    return [
      { value: "all", label: "All" },
      ...(cities ?? []).map((c) => ({
        value: String(c.id),
        label: c.name,
      })),
    ];
  }, [cities, stateItem]);

  const sectorOptions = useMemo(() => {
    return (sectors ?? []).map((s) => ({
      value: String(s.id),
      label: s.title ?? s.name,
    }));
  }, [sectors]);

  const industryOptions = useMemo(() => {
    return (industries ?? []).map((i) => ({
      value: String(i.id),
      label: i.name ?? i.title,
    }));
  }, [industries]);

  const selectedRegion = useMemo(
    () =>
      regionOptions.find((opt) => opt.value === String(region ?? "all")) ||
      regionOptions[0],
    [regionOptions, region]
  );

  const selectedCountry = useMemo(
    () =>
      countryOptions.find((opt) => opt.value === String(country ?? "all")) ||
      countryOptions[0],
    [countryOptions, country]
  );

  const selectedState = useMemo(() => {
    if (!stateItem) return null;
    return stateOptions.find((opt) => opt.value === String(stateItem)) || null;
  }, [stateOptions, stateItem]);

  const selectedCity = useMemo(() => {
    if (!city) return null;
    return cityOptions.find((opt) => opt.value === String(city)) || null;
  }, [cityOptions, city]);

  const selectedSector = useMemo(() => {
    return sectorOptions.find((opt) => opt.value === String(sector ?? "")) || null;
  }, [sectorOptions, sector]);

  const selectedIndustry = useMemo(() => {
    return industryOptions.find((opt) => opt.value === String(industry ?? "")) || null;
  }, [industryOptions, industry]);

  const countryDisabled = false;
  const stateDisabled = !country || country === "all" || isSearching;
  const cityDisabled = !stateItem || stateItem === "all" || isSearching;
  const industryDisabled = !sector || String(sector).trim() === "" || isSearching;

  const clearAll = () => {
    if (isSearching) return;

    setQ("");
    setRegion("all");
    setCountry("all");
    setStateItem("");
    setCity("");
    setSector("");
    setIndustry("");
    setVerified(false);
    setSearchPayload(null);
    setSearchToken("");
    clearValidation();
  };

  const handleRegionChange = (option) => {
    if (isSearching) return;

    const value = option?.value ?? "all";
    clearValidation();
    setRegion(value);

    if (value === "all") {
      setCountry("all");
      setStateItem("");
      setCity("");
    }
  };

  const handleCountryChange = async (option) => {
    if (isSearching) return;

    const value = option?.value ?? "all";
    clearValidation();
    setCountry(value);

    if (value === "all" || !value) {
      setStateItem("");
      setCity("");
      return;
    }

    if (typeof onCountryFirstSelection === "function") {
      await onCountryFirstSelection(value);
    }

    setStateItem("all");
    setCity("");
  };

  const handleStateChange = (option) => {
    if (isSearching) return;

    const value = option?.value ?? "";
    setStateItem(value);

    if (!value || value === "all") {
      setCity("");
      return;
    }

    setCity("all");
  };

  const handleCityChange = (option) => {
    if (isSearching) return;
    setCity(option?.value ?? "");
  };

  const handleSectorChange = (option) => {
    if (isSearching) return;

    clearValidation();
    setSector(option?.value ?? "");
    setIndustry("");
  };

  const validateBeforeSearch = () => {
    const normalizedSector =
      sector && String(sector).trim() !== "" ? String(sector).trim() : "";

    if (!normalizedSector) {
      setFieldErrors({ sector: true });
      toast.error("Sector should be selected.");
      return false;
    }

    setFieldErrors({ sector: false });
    return true;
  };

  const buildPayload = () => {
    return {
      keyword: String(q ?? "").trim(),
      region: region ?? "all",
      country: country ?? "all",
      state: stateItem ?? "all",
      city: city ?? "all",
      sector: sector ?? "",
      industry: industry ?? "",
      verification: Boolean(verified),
    };
  };

  const submitSearch = async (e) => {
    e.preventDefault();

    if (isSearching) return;
    if (!validateBeforeSearch()) return;

    const payload = buildPayload();

    try {
      setIsSearching(true);
      setSearchPayload(payload);

      const startRes = await fetch("/api/main-search-engine/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-CSRF-TOKEN": getCsrfToken(),
        },
        body: JSON.stringify(payload),
      });

      const startData = await startRes.json();

      if (!startRes.ok || !startData?.ok || !startData?.token) {
        throw new Error(startData?.message || "Unable to start search.");
      }

      const token = startData.token;

      setSearchToken(token);
      setShowSearchModal(true);

      fetch(`/api/main-search-engine/run/${token}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "X-CSRF-TOKEN": getCsrfToken(),
        },
      }).catch((err) => {
        console.error("Search execution failed:", err);
      });
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Search could not be started.");
      setIsSearching(false);
      setShowSearchModal(false);
      setSearchToken("");
    }
  };

  return (
    <>
      <style>{css}</style>

      <SearchAnimatedModal
        open={showSearchModal}
        token={searchToken}
        payload={searchPayload}
        onClose={() => {
          setShowSearchModal(false);
          setIsSearching(false);
          setSearchToken("");
        }}
        onComplete={() => {
          setIsSearching(false);
        }}
      />

      <div className="panel-wrap">
        <form className="sf-card" onSubmit={submitSearch}>
          <div className="sf-topbar">
            <div>
              <div className="sf-title">SEARCH &amp; FILTERS</div>
              <div className="sf-sub">
                Use filters below to open the company list with matching results.
              </div>
            </div>

            <div className={`sf-badge ${verified ? "on" : "off"}`}>
              <span className="check">✓</span>
              Verified: {verified ? "ON" : "OFF"}
            </div>
          </div>

          <div className="sf-body">
            <div className="sf-grid">
              <div>
                <label className="sf-label">
  Keyword
  <span
    className="sf-tooltip"
    title="You can leave Empty if you do not know the name of the company"
  >
    ⓘ
  </span>
</label>
                <div className="sf-field">
                  <IconSearch className="sf-icon" style={{ color: "#111827" }} />
                  <input
                    className="sf-input"
                    type="search"
                    placeholder="Search company name, keyword, city, industry..."
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    disabled={isSearching}
                  />
                </div>
              </div>

              <div>
                <label className="sf-label">Region</label>
                <div className="sf-field sf-select-wrap">
                  <IconGlobe className="sf-icon" style={{ color: "#111827" }} />
                  <Select
                    {...selectSharedProps}
                    value={selectedRegion}
                    onChange={handleRegionChange}
                    options={regionOptions}
                    placeholder="Select region"
                    styles={buildSelectStyles(false)}
                    isDisabled={isSearching}
                  />
                </div>
              </div>

              <div>
                <label className="sf-label">Country</label>
                <div className="sf-field sf-select-wrap">
                  <IconGlobe className="sf-icon" style={{ color: "#111827" }} />
                  <Select
                    {...selectSharedProps}
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    options={countryOptions}
                    isDisabled={countryDisabled || isSearching}
                    placeholder="Select country"
                    styles={buildSelectStyles(false)}
                  />
                </div>
              </div>

              <div>
                <label className="sf-label">State</label>
                <div className="sf-field sf-select-wrap">
                  <IconGlobe className="sf-icon" style={{ color: "#111827" }} />
                  <Select
                    {...selectSharedProps}
                    value={selectedState}
                    onChange={handleStateChange}
                    options={stateOptions}
                    isClearable
                    isDisabled={stateDisabled}
                    placeholder={
                      stateDisabled ? "Select specific country first" : "Select state"
                    }
                    styles={buildSelectStyles(false)}
                  />
                </div>
              </div>

              <div>
                <label className="sf-label">City</label>
                <div className="sf-field sf-select-wrap">
                  <IconGlobe className="sf-icon" style={{ color: "#111827" }} />
                  <Select
                    {...selectSharedProps}
                    value={selectedCity}
                    onChange={handleCityChange}
                    options={cityOptions}
                    isClearable
                    isDisabled={cityDisabled}
                    placeholder={cityDisabled ? "Select state first" : "Select city"}
                    styles={buildSelectStyles(false)}
                  />
                </div>
              </div>

              <div>
                <label className="sf-label">Sector</label>
                <div className="sf-field sf-select-wrap">
                  <IconBriefcase className="sf-icon" style={{ color: "#111827" }} />
                  <Select
                    {...selectSharedProps}
                    value={selectedSector}
                    onChange={handleSectorChange}
                    options={sectorOptions}
                    isClearable
                    placeholder="Select sector"
                    styles={buildSelectStyles(fieldErrors.sector)}
                    isDisabled={isSearching}
                  />
                </div>
                {fieldErrors.sector && (
                  <div className="sf-error-text">Sector should be selected.</div>
                )}
              </div>

              <div>
                <label className="sf-label">Industry</label>
                <div className="sf-field sf-select-wrap">
                  <IconBriefcase className="sf-icon" style={{ color: "#111827" }} />
                  <Select
                    {...selectSharedProps}
                    value={selectedIndustry}
                    onChange={(option) => setIndustry(option?.value ?? "")}
                    options={industryOptions}
                    isClearable
                    isDisabled={industryDisabled}
                    placeholder={
                      industryDisabled ? "Select sector first" : "Select industry"
                    }
                    styles={buildSelectStyles(false)}
                  />
                </div>
              </div>

              <div className="sf-verify" aria-label="Verified only">
                <label className="sf-switch" title="Verified only">
                  <input
                    type="checkbox"
                    checked={verified}
                    onChange={(e) => setVerified(e.target.checked)}
                    disabled={isSearching}
                  />
                  <span className="sf-slider" />
                </label>
                <div className="txt">Verified only</div>
              </div>
            </div>

            <div className="sf-divider" />

            <div className="sf-actions">
              <div className="sf-left-actions">
                <button
                  type="button"
                  className="sf-btn ghost"
                  onClick={clearAll}
                  disabled={isSearching}
                >
                  Clear
                </button>

                <a
                  className={`sf-btn outline ${isSearching ? "is-disabled-link" : ""}`}
                  href={isSearching ? undefined : "/companies"}
                  onClick={(e) => {
                    if (isSearching) e.preventDefault();
                  }}
                >
                  All Companies <span aria-hidden="true">↗</span>
                </a>
              </div>

              <button
                type="submit"
                className={`sf-btn primary ${isSearching ? "is-loading" : ""}`}
                disabled={isSearching}
              >
                {isSearching ? (
                  <>
                    <SpinnerIcon className="sf-btn-spinner" />
                    Searching...
                  </>
                ) : (
                  "Search"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

const css = `
.panel-wrap{
  width:100%;
  display:flex;
  justify-content:center;
}
.sf-card{
  width:100%;
  background:#fff;
  border:1px solid #e6e9f2;
  border-radius:26px;
  overflow:visible;
  box-shadow:0 10px 26px rgba(10,42,107,.10);
}
.sf-topbar{
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  gap:14px;
  padding:18px 22px;
  background:linear-gradient(135deg,#0A2A6B 0%,#1e3a8a 55%,#2d4fbf 100%);
  color:#fff;
  border-radius:26px 26px 0 0;
}
.sf-title{
  font-weight:900;
  letter-spacing:.3px;
  font-size:18px;
  line-height:1.15;
  text-transform:uppercase;
}
.sf-sub{
  margin-top:4px;
  color:rgba(255,255,255,.88);
  font-size:13px;
}
.sf-badge{
  display:inline-flex;
  align-items:center;
  gap:8px;
  padding:8px 12px;
  border-radius:999px;
  font-weight:800;
  font-size:13px;
  white-space:nowrap;
  background:rgba(255,255,255,.18);
  border:1px solid rgba(255,255,255,.25);
  box-shadow:inset 0 0 0 1px rgba(0,0,0,.05);
}
.sf-badge .check{
  width:18px;
  height:18px;
  display:inline-grid;
  place-items:center;
  border-radius:6px;
  background:rgba(255,255,255,.18);
  border:1px solid rgba(255,255,255,.25);
  font-size:12px;
}
.sf-badge.on{
  background:rgba(34,197,94,.18);
  border-color:rgba(34,197,94,.28);
}
.sf-badge.off{
  background:rgba(255,255,255,.18);
}
.sf-body{
  padding:18px 22px 16px;
  overflow:visible;
}
.sf-grid{
  display:grid;
  grid-template-columns:repeat(4,minmax(0,1fr));
  gap:18px;
  align-items:end;
  overflow:visible;
}
.sf-label{
  display:block;
  font-size:13px;
  color:#6b7280;
  margin:0 0 6px 14px;
}
.sf-field{
  position:relative;
  width:100%;
  overflow:visible;
}
.sf-select-wrap{
  z-index:5;
}
.sf-icon{
  position:absolute;
  left:16px;
  top:50%;
  transform:translateY(-50%);
  width:18px;
  height:18px;
  opacity:.70;
  z-index:3;
  pointer-events:none;
}
.sf-input{
  width:100%;
  height:50px;
  border-radius:999px;
  border:1px solid #e5e7eb;
  background:#fff;
  padding:0 44px 0 46px;
  font-size:15px;
  outline:none;
  box-shadow:0 2px 10px rgba(15,23,42,.04);
  transition:border-color .18s ease, box-shadow .18s ease, opacity .18s ease;
}
.sf-input::placeholder{
  color:#9ca3af;
}
.sf-input:focus{
  border-color:#9db7ff;
  box-shadow:0 0 0 4px rgba(59,130,246,.14);
}
.sf-input:disabled{
  opacity:.75;
  cursor:not-allowed;
  background:#f8fafc;
}
.sf-error-text{
  margin:6px 0 0 14px;
  color:#dc2626;
  font-size:12px;
  font-weight:700;
}
.sf-verify{
  display:flex;
  align-items:center;
  gap:12px;
  padding-bottom:8px;
  justify-content:flex-start;
}
.sf-verify .txt{
  font-weight:800;
  color:#0f172a;
  white-space:nowrap;
}
.sf-switch{
  position:relative;
  width:52px;
  height:28px;
  display:inline-block;
}
.sf-switch input{
  display:none;
}
.sf-slider{
  position:absolute;
  inset:0;
  background:#e5e7eb;
  border-radius:999px;
  transition:.18s ease;
  border:1px solid #e5e7eb;
}
.sf-slider::after{
  content:"";
  position:absolute;
  left:3px;
  top:3px;
  width:22px;
  height:22px;
  background:#fff;
  border-radius:50%;
  box-shadow:0 6px 14px rgba(0,0,0,.15);
  transition:.18s ease;
}
.sf-switch input:checked + .sf-slider{
  background:#3b82f6;
  border-color:#3b82f6;
}
.sf-switch input:checked + .sf-slider::after{
  transform:translateX(24px);
}
.sf-divider{
  height:1px;
  background:#eef2f7;
  margin:16px 0 14px;
}
.sf-actions{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:14px;
}
.sf-left-actions{
  display:flex;
  align-items:center;
  gap:12px;
  flex-wrap:wrap;
}
.sf-btn{
  height:46px;
  border-radius:999px;
  padding:0 18px;
  font-weight:900;
  cursor:pointer;
  border:1px solid transparent;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:10px;
  text-decoration:none;
  user-select:none;
  -webkit-tap-highlight-color:transparent;
  transition:opacity .18s ease, transform .18s ease, filter .18s ease;
}
.sf-btn.ghost{
  background:#fff;
  border-color:#d7e2f5;
  color:#2d4fbf;
}
.sf-btn.outline{
  background:#fff;
  border-color:#d7e2f5;
  color:#2d4fbf;
}
.sf-btn.primary{
  min-width:170px;
  background:linear-gradient(135deg,#3b82f6,#2d4fbf);
  border-color:transparent;
  color:#fff;
  box-shadow:0 10px 18px rgba(59,130,246,.25);
}
.sf-btn.primary:active{
  transform:translateY(1px);
}
.sf-btn:hover{
  filter:brightness(.98);
}
  .sf-tooltip {
  margin-left: 6px;
  font-size: 12px;
  cursor: help;
  color: #94a3b8;
}
.sf-btn:disabled{
  cursor:not-allowed;
  opacity:.9;
}
.sf-btn.is-loading{
  pointer-events:none;
}
.sf-btn-spinner{
  width:18px;
  height:18px;
  animation:sf-spin .8s linear infinite;
}
.is-disabled-link{
  pointer-events:none;
  opacity:.65;
}

@keyframes sf-spin{
  to{
    transform:rotate(360deg);
  }
}

@media (max-width:1200px){
  .sf-grid{
    grid-template-columns:repeat(3,minmax(0,1fr));
  }
}
@media (max-width:900px){
  .sf-grid{
    grid-template-columns:repeat(2,minmax(0,1fr));
  }
  .sf-actions{
    flex-direction:column;
    align-items:stretch;
  }
  .sf-btn.primary{
    width:100%;
  }
}
@media (max-width:560px){
  .sf-grid{
    grid-template-columns:1fr;
  }
  .sf-label{
    margin-left:8px;
  }
  .sf-body{
    padding:16px 14px 14px;
  }
  .sf-topbar{
    padding:16px 14px;
  }
}
`;