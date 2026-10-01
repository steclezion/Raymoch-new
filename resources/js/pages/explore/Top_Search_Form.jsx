import React, { useEffect, useMemo, useRef, useState } from "react";
import Select, { components } from "react-select";
import useQueuedCompanySearch from "../../hooks/useQueuedCompanySearch";
import SearchSplashModal from "../../components/behaviours/SearchSplashModal";
import "../../styles/top-search-form.css";

function IconSearch(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="currentColor" strokeWidth="2" />
      <path d="M16.6 16.6 21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconGlobe(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" stroke="currentColor" strokeWidth="2" />
      <path d="M2 12h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 2c3 3 3 17 0 20M12 2c-3 3-3 17 0 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconBriefcase(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M9 7V6a3 3 0 0 1 6 0v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 8h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z" stroke="currentColor" strokeWidth="2" />
      <path d="M4 12h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SelectDropdownIndicator(props) {
  return (
    <components.DropdownIndicator {...props}>
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
        <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </components.DropdownIndicator>
  );
}

function SelectNoOptionsMessage(props) {
  return (
    <components.NoOptionsMessage {...props}>
      {props.selectProps.isLoading ? "Loading..." : "No matching result found"}
    </components.NoOptionsMessage>
  );
}

const selectSharedProps = {
  isSearchable: true,
  isClearable: true,
  menuPosition: "fixed",
  menuPortalTarget: typeof document !== "undefined" ? document.body : null,
  components: {
    DropdownIndicator: SelectDropdownIndicator,
    NoOptionsMessage: SelectNoOptionsMessage,
  },
};

function buildSelectStyles() {
  return {
    container: (base) => ({ ...base, width: "100%" }),
    control: (base, state) => ({
      ...base,
      minHeight: 50,
      height: 50,
      borderRadius: 999,
      borderColor: state.isFocused ? "#8f6847" : "#ded2c3",
      boxShadow: state.isFocused
        ? "0 0 0 4px rgba(143,104,71,.14)"
        : "0 2px 10px rgba(72,47,30,.05)",
      backgroundColor: state.isDisabled ? "#f4ece2" : "#fbf8f3",
      paddingLeft: 40,
      paddingRight: 8,
      cursor: state.isDisabled ? "not-allowed" : "pointer",
    }),
    valueContainer: (base) => ({ ...base, height: 50, padding: "0 8px 0 0" }),
    input: (base) => ({ ...base, margin: 0, padding: 0, color: "#1c1d1f", fontFamily: "inherit" }),
    indicatorSeparator: () => ({ display: "none" }),
    dropdownIndicator: (base) => ({ ...base, color: "#6b7280", padding: 8 }),
    clearIndicator: (base) => ({ ...base, color: "#94a3b8", padding: 8 }),
    placeholder: (base) => ({ ...base, color: "#9ca3af", fontSize: 15 }),
    singleValue: (base, state) => ({
      ...base,
      color: state.isDisabled ? "#94a3b8" : "#111827",
      fontSize: 15,
    }),
    menuPortal: (base) => ({ ...base, zIndex: 99999 }),
    menu: (base) => ({
      ...base,
      zIndex: 99999,
      borderRadius: 18,
      overflow: "hidden",
      border: "1px solid #ded2c3",
      boxShadow: "0 18px 40px rgba(72,47,30,.14)",
      backgroundColor: "#fbf8f3",
    }),
    menuList: (base) => ({ ...base, padding: 8, maxHeight: 240 }),
    option: (base, state) => ({
      ...base,
      borderRadius: 12,
      marginBottom: 4,
      padding: "11px 14px",
      fontSize: 14,
      cursor: "pointer",
      backgroundColor: state.isSelected ? "#eee1d3" : state.isFocused ? "#f4ece2" : "#fbf8f3",
      color: "#382116",
      fontWeight: state.isSelected ? 800 : 600,
      ":active": { backgroundColor: "#e5d4c2" },
    }),
  };
}

async function fetchJson(url) {
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      credentials: "same-origin",
    });

    if (!res.ok) return { ok: false, data: [] };
    return await res.json();
  } catch (error) {
    console.error("API error:", error);
    return { ok: false, data: [] };
  }
}

function getDataArray(res) {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.results)) return res.results;
  if (Array.isArray(res?.items)) return res.items;
  return [];
}

function isAll(value) {
  const v = String(value ?? "").trim().toLowerCase();
  return !v || v === "all" || v === "null" || v === "undefined";
}

function optionByValue(options, value) {
  if (isAll(value)) {
    return options.find((item) => item.value === "all") || { value: "all", label: "All" };
  }

  return (
    options.find((item) => String(item.value) === String(value)) || {
      value: String(value),
      label: String(value),
    }
  );
}

function normalizeVerification(value) {
  const v = String(value ?? "").trim().toLowerCase();
  return ["1", "true", "on", "yes", "verified"].includes(v);
}

function normalizeVerifiedLabel(value) {
  return normalizeVerification(value) ? "ON" : "OFF";
}

function normalizedResolvedItem(item, fallback = "All") {
  if (!item) return { id: "all", name: fallback };

  return {
    id: String(item.id ?? item.value ?? "all"),
    name: String(item.name ?? item.label ?? item.title ?? fallback),
  };
}

export default function TopSearchForm({
  q = "",
  setQ,
  sector,
  setSector,
  country,
  setCountry,
  verified = false,
  setVerified,
  localFilter = "",
  setLocalFilter,
  onClearFilters,
  setPage,

  region,
  setRegion,
  stateItem,
  setStateItem,
  city,
  setCity,
  industry,
  setIndustry,

  SelectedFiltersComponent,
}) {
  const queuedSearch = useQueuedCompanySearch();
  const liveResolveIdRef = useRef(0);

  const [internalQ, setInternalQ] = useState("");
  const [internalRegion, setInternalRegion] = useState("all");
  const [internalCountry, setInternalCountry] = useState("all");
  const [internalStateItem, setInternalStateItem] = useState("all");
  const [internalCity, setInternalCity] = useState("all");
  const [internalSector, setInternalSector] = useState("");
  const [internalIndustry, setInternalIndustry] = useState("all");
  const [internalVerified, setInternalVerified] = useState(false);
  const [internalLocalFilter, setInternalLocalFilter] = useState("");

  const safeQ = q ?? internalQ;
  const safeSetQ = typeof setQ === "function" ? setQ : setInternalQ;

  const safeRegion = region ?? internalRegion;
  const safeSetRegion = typeof setRegion === "function" ? setRegion : setInternalRegion;

  const safeCountry = country ?? internalCountry;
  const safeSetCountry = typeof setCountry === "function" ? setCountry : setInternalCountry;

  const safeStateItem = stateItem ?? internalStateItem;
  const safeSetStateItem = typeof setStateItem === "function" ? setStateItem : setInternalStateItem;

  const safeCity = city ?? internalCity;
  const safeSetCity = typeof setCity === "function" ? setCity : setInternalCity;

  const safeSector = sector ?? internalSector;
  const safeSetSector = typeof setSector === "function" ? setSector : setInternalSector;

  const safeIndustry = industry ?? internalIndustry;
  const safeSetIndustry = typeof setIndustry === "function" ? setIndustry : setInternalIndustry;

  const safeVerified = verified ?? internalVerified;
  const safeSetVerified = typeof setVerified === "function" ? setVerified : setInternalVerified;

  const safeLocalFilter = localFilter ?? internalLocalFilter;
  const safeSetLocalFilter =
    typeof setLocalFilter === "function" ? setLocalFilter : setInternalLocalFilter;

  const safeSetPage = typeof setPage === "function" ? setPage : () => {};

  const [regions, setRegions] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [industries, setIndustries] = useState([]);

  const [resolvedPrevious, setResolvedPrevious] = useState({
    keyword: "",
    region: { id: "all", name: "All" },
    country: { id: "all", name: "All" },
    state: { id: "all", name: "All" },
    city: { id: "all", name: "All" },
    sector: { id: "all", name: "All" },
    industry: { id: "all", name: "All" },
    verification: "OFF",
  });

  const [bootReady, setBootReady] = useState(false);
  const [searchValidationError, setSearchValidationError] = useState("");

  const [loading, setLoading] = useState({
    regions: false,
    countries: false,
    states: false,
    cities: false,
    sectors: false,
    industries: false,
    session: false,
    resolving: false,
  });

  const setLoadingKey = (key, value) => {
    setLoading((prev) => ({ ...prev, [key]: value }));
  };

const resolveLiveFilters = async (filters, requestId) => {
  setLoadingKey("resolving", true);

  const params = new URLSearchParams({
    keyword: filters.keyword || "",
    region: filters.region || "all",
    country: filters.country || "all",
    state: filters.state || "all",
    city: filters.city || "all",
    sector: filters.sector || "",
    industry: filters.industry || "all",
    verification: filters.verification || "OFF",
  });

  const resolveRes = await fetchJson(
    `/api/companies/resolve-search-filters?${params.toString()}`
  );
  if (requestId !== liveResolveIdRef.current) return;

  const data = resolveRes?.data || {};

  setResolvedPrevious({
    keyword: data.keyword ?? filters.keyword ?? "",
    region: normalizedResolvedItem(data.region, "All"),
    country: normalizedResolvedItem(data.country, "All"),
    state: normalizedResolvedItem(data.state, "All"),
    city: normalizedResolvedItem(data.city, "All"),
    sector: normalizedResolvedItem(data.sector, "All"),
    industry: normalizedResolvedItem(data.industry, "All"),
    verification: data.verification
      ? normalizeVerifiedLabel(data.verification)
      : normalizeVerifiedLabel(filters.verification),
  });

  setLoadingKey("resolving", false);
};
  

  const regionOptions = useMemo(() => {
    return [
      { value: "all", label: "All" },
      ...(regions ?? []).map((item) => ({
        value: String(item.id),
        label: item.name,
      })),
    ];
  }, [regions]);

  const countryOptions = useMemo(() => {
    return [
      { value: "all", label: "All" },
      ...(countries ?? []).map((item) => ({
        value: String(item.countries_all_id ?? item.id),
        label: item.country_name ?? item.name,
      })),
    ];
  }, [countries]);

  const stateOptions = useMemo(() => {
    return [
      { value: "all", label: "All" },
      ...(states ?? []).map((item) => ({
        value: String(item.id),
        label: item.name,
      })),
    ];
  }, [states]);

  const cityOptions = useMemo(() => {
    return [
      { value: "all", label: "All" },
      ...(cities ?? []).map((item) => ({
        value: String(item.id),
        label: item.name,
      })),
    ];
  }, [cities]);

  const sectorOptions = useMemo(() => {
    return (sectors ?? []).map((item) => ({
      value: String(item.id),
      label: item.title ?? item.name,
    }));
  }, [sectors]);

  const industryOptions = useMemo(() => {
    return [
      { value: "all", label: "All" },
      ...(industries ?? []).map((item) => ({
        value: String(item.id),
        label: item.name ?? item.title,
      })),
    ];
  }, [industries]);

  const selectedRegion = useMemo(
    () => optionByValue(regionOptions, safeRegion),
    [regionOptions, safeRegion]
  );

  const selectedCountry = useMemo(
    () => optionByValue(countryOptions, safeCountry),
    [countryOptions, safeCountry]
  );

  const selectedState = useMemo(
    () => optionByValue(stateOptions, safeStateItem),
    [stateOptions, safeStateItem]
  );

  const selectedCity = useMemo(
    () => optionByValue(cityOptions, safeCity),
    [cityOptions, safeCity]
  );

  const selectedSector = useMemo(() => {
    if (isAll(safeSector)) return null;
    return optionByValue(sectorOptions, safeSector);
  }, [sectorOptions, safeSector]);

  const selectedIndustry = useMemo(
    () => optionByValue(industryOptions, safeIndustry),
    [industryOptions, safeIndustry]
  );

  const resolvePreviousSearch = async (filters) => {
    setLoadingKey("resolving", true);

    const params = new URLSearchParams({
      keyword: filters.keyword || "",
      region: filters.region || "all",
      country: filters.country || "all",
      state: filters.state || "all",
      city: filters.city || "all",
      sector: filters.sector || "",
      industry: filters.industry || "all",
      verification: filters.verification || "OFF",
    });

    const resolveRes = await fetchJson(
      `/api/companies/resolve-search-filters?${params.toString()}`
    );

    const data = resolveRes?.data || {};

    setResolvedPrevious({
      keyword: data.keyword ?? filters.keyword ?? "",
      region: normalizedResolvedItem(data.region, "All"),
      country: normalizedResolvedItem(data.country, "All"),
      state: normalizedResolvedItem(data.state, "All"),
      city: normalizedResolvedItem(data.city, "All"),
      sector: normalizedResolvedItem(data.sector, "All"),
      industry: normalizedResolvedItem(data.industry, "All"),
      verification: data.verification
        ? normalizeVerifiedLabel(data.verification)
        : normalizeVerifiedLabel(filters.verification),
    });

    setLoadingKey("resolving", false);
  };

  useEffect(() => {
    const boot = async () => {
      setLoadingKey("session", true);
      setLoadingKey("regions", true);
      setLoadingKey("sectors", true);

      const [sessionRes, regionRes, sectorRes] = await Promise.all([
        fetchJson("/search-session/current"),
        fetchJson("/api/regions"),
        fetchJson("/api/sectors"),
      ]);

      const session = sessionRes?.data || {};

      const filters = {
        keyword: session.keyword || "",
        region: session.region || "all",
        country: session.country || "all",
        state: session.state || "all",
        city: session.city || "all",
        sector: session.sector || "",
        industry: session.industry || "all",
        verification: session.verification || "OFF",
      };

      safeSetQ(filters.keyword);
      safeSetRegion(filters.region);
      safeSetCountry(filters.country);
      safeSetStateItem(filters.state);
      safeSetCity(filters.city);
      safeSetSector(filters.sector);
      safeSetIndustry(filters.industry);
      safeSetVerified(normalizeVerification(filters.verification));

      setRegions(getDataArray(regionRes));
      setSectors(getDataArray(sectorRes));

      setLoadingKey("session", false);
      setLoadingKey("regions", false);
      setLoadingKey("sectors", false);

      await resolvePreviousSearch(filters);

      const countryUrl = isAll(filters.region)
        ? "/api/countries-africans"
        : `/api/countries-africans?region_id=${encodeURIComponent(filters.region)}`;

      const industryUrl = isAll(filters.sector)
        ? "/api/industries"
        : `/api/industries?sector_id=${encodeURIComponent(filters.sector)}`;

      setLoadingKey("countries", true);
      setLoadingKey("industries", true);

      const [countryRes, industryRes] = await Promise.all([
        fetchJson(countryUrl),
        fetchJson(industryUrl),
      ]);

      setCountries(getDataArray(countryRes));
      setIndustries(getDataArray(industryRes));

      setLoadingKey("countries", false);
      setLoadingKey("industries", false);

      if (!isAll(filters.country)) {
        setLoadingKey("states", true);
        const stateRes = await fetchJson(
          `/api/states-all?countries_all_id=${encodeURIComponent(filters.country)}`
        );
        setStates(getDataArray(stateRes));
        setLoadingKey("states", false);
      }

      if (!isAll(filters.state)) {
        setLoadingKey("cities", true);
        const cityRes = await fetchJson(
          `/api/cities-all?state_id=${encodeURIComponent(filters.state)}`
        );
        setCities(getDataArray(cityRes));
        setLoadingKey("cities", false);
      }

      setBootReady(true);
      safeSetPage(1);
    };

    boot();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!bootReady) return;

    const fetchCountries = async () => {
      safeSetCountry("all");
      safeSetStateItem("all");
      safeSetCity("all");
      setStates([]);
      setCities([]);

      setLoadingKey("countries", true);

      const url = isAll(safeRegion)
        ? "/api/countries-africans"
        : `/api/countries-africans?region_id=${encodeURIComponent(safeRegion)}`;

      const res = await fetchJson(url);
      setCountries(getDataArray(res));
      setLoadingKey("countries", false);
    };

    fetchCountries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeRegion]);

  useEffect(() => {
    if (!bootReady) return;

    const fetchStates = async () => {
      safeSetStateItem("all");
      safeSetCity("all");
      setStates([]);
      setCities([]);

      if (isAll(safeCountry)) return;

      setLoadingKey("states", true);

      const res = await fetchJson(
        `/api/states-all?countries_all_id=${encodeURIComponent(safeCountry)}`
      );

      setStates(getDataArray(res));
      setLoadingKey("states", false);
    };

    fetchStates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeCountry]);

  useEffect(() => {
    if (!bootReady) return;

    const fetchCities = async () => {
      safeSetCity("all");
      setCities([]);

      if (isAll(safeStateItem)) return;

      setLoadingKey("cities", true);

      const res = await fetchJson(
        `/api/cities-all?state_id=${encodeURIComponent(safeStateItem)}`
      );

      setCities(getDataArray(res));
      setLoadingKey("cities", false);
    };

    fetchCities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeStateItem]);

  useEffect(() => {
    if (!bootReady) return;

    const fetchIndustries = async () => {
      safeSetIndustry("all");

      setLoadingKey("industries", true);

      const url = isAll(safeSector)
        ? "/api/industries"
        : `/api/industries?sector_id=${encodeURIComponent(safeSector)}`;

      const res = await fetchJson(url);
      setIndustries(getDataArray(res));
      setLoadingKey("industries", false);
    };

    fetchIndustries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeSector]);


  useEffect(() => {
    if (!bootReady) return undefined;

    const requestId = ++liveResolveIdRef.current;
    const timeoutId = window.setTimeout(() => {
      resolveLiveFilters({
        keyword: safeQ || "",
        region: safeRegion || "all",
        country: safeCountry || "all",
        state: safeStateItem || "all",
        city: safeCity || "all",
        sector: safeSector || "",
        industry: safeIndustry || "all",
        verification: safeVerified ? "ON" : "OFF",
      }, requestId);
    }, 350);

    return () => window.clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    bootReady, safeQ, safeRegion, safeCountry, safeStateItem,
    safeCity, safeSector, safeIndustry, safeVerified,
  ]);

  const stateDisabled = isAll(safeCountry);
  const cityDisabled = isAll(safeStateItem);
  const industryDisabled = isAll(safeSector);
  const verifiedText = safeVerified ? "ON" : "OFF";

  const clearAll = () => {
    safeSetQ("");
    safeSetRegion("all");
    safeSetCountry("all");
    safeSetStateItem("all");
    safeSetCity("all");
    safeSetSector("");
    safeSetIndustry("all");
    safeSetVerified(false);
    safeSetLocalFilter("");

    setStates([]);
    setCities([]);

    setResolvedPrevious({
      keyword: "",
      region: { id: "all", name: "All" },
      country: { id: "all", name: "All" },
      state: { id: "all", name: "All" },
      city: { id: "all", name: "All" },
      sector: { id: "all", name: "All" },
      industry: { id: "all", name: "All" },
      verification: "OFF",
    });

    if (typeof onClearFilters === "function") onClearFilters();
    safeSetPage(1);
  };

  const submitSearch = async (e) => {
    e.preventDefault();
    setSearchValidationError("");

    // Complete all UI validation before opening the search splash.
    if (!isAll(safeStateItem) && isAll(safeCountry)) {
      setSearchValidationError("Select a country before selecting a state.");
      return;
    }

    if (!isAll(safeCity) && isAll(safeStateItem)) {
      setSearchValidationError("Select a state before selecting a city.");
      return;
    }

    if (!isAll(safeIndustry) && isAll(safeSector)) {
      setSearchValidationError("Select a sector before selecting an industry.");
      return;
    }

    const payload = {
      keyword: String(safeQ || "").trim(),
      region: safeRegion || "all",
      country: safeCountry || "all",
      state: safeStateItem || "all",
      city: safeCity || "all",
      sector: safeSector || "all",
      industry: safeIndustry || "all",
      verification: Boolean(safeVerified),
    };

    safeSetPage(1);
    await queuedSearch.start(payload);
  };

  return (
    <>

      <SearchSplashModal
        open={queuedSearch.open}
        token={queuedSearch.token}
        status={queuedSearch.status}
        error={queuedSearch.error}
        starting={queuedSearch.starting}
        onStop={queuedSearch.stop}
        onViewResults={queuedSearch.viewResults}
        onResume={queuedSearch.resume}
      />

      <div className="sf-panel-wrap">
        <form className="sf-card" onSubmit={submitSearch}>
          <div className="sf-topbar">
            <div>
              <div className="sf-title">SEARCH &amp; FILTERS</div>
              <div className="sf-sub">
                Selected values from Explore are filled automatically below.
              </div>
            </div>

            <div className={`sf-badge ${safeVerified ? "on" : "off"}`}>
              <span className="check">✓</span>
              Verified: {verifiedText}
            </div>
          </div>

          <div className="sf-body">
            <div className="sf-grid">
              <div>
                <label className="sf-label">
                  Keyword
                  <span className="sf-tooltip" title="You can leave Empty if you do not know the name of the company">
                    ⓘ
                  </span>
                </label>

                <div className="sf-field">
                  <IconSearch className="sf-icon" style={{ color: "#6f452e" }} />
                  <input
                    className="sf-input"
                    type="search"
                    placeholder="Search company name, keyword, city, industry..."
                    value={safeQ}
                    onChange={(e) => {
                      safeSetQ(e.target.value);
                      safeSetPage(1);
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="sf-label">Region</label>
                <div className="sf-field sf-select-wrap">
                  <IconGlobe className="sf-icon" style={{ color: "#6f452e" }} />
                  <Select
                    {...selectSharedProps}
                    value={selectedRegion}
                    onChange={(option) => {
                      safeSetRegion(option?.value ?? "all");
                      safeSetPage(1);
                    }}
                    options={regionOptions}
                    placeholder="Select region"
                    styles={buildSelectStyles()}
                    isLoading={loading.regions}
                  />
                </div>
              </div>

              <div>
                <label className="sf-label">Country</label>
                <div className="sf-field sf-select-wrap">
                  <IconGlobe className="sf-icon" style={{ color: "#6f452e" }} />
                  <Select
                    {...selectSharedProps}
                    value={selectedCountry}
                    onChange={(option) => {
                      safeSetCountry(option?.value ?? "all");
                      safeSetPage(1);
                    }}
                    options={countryOptions}
                    placeholder="Select country"
                    styles={buildSelectStyles()}
                    isLoading={loading.countries}
                  />
                </div>
              </div>

              <div>
                <label className="sf-label">State</label>
                <div className="sf-field sf-select-wrap">
                  <IconGlobe className="sf-icon" style={{ color: "#6f452e" }} />
                  <Select
                    {...selectSharedProps}
                    value={selectedState}
                    onChange={(option) => {
                      safeSetStateItem(option?.value ?? "all");
                      safeSetPage(1);
                    }}
                    options={stateOptions}
                    isDisabled={stateDisabled}
                    placeholder={stateDisabled ? "Select specific country first" : "Select state"}
                    styles={buildSelectStyles()}
                    isLoading={loading.states}
                  />
                </div>
              </div>

              <div>
                <label className="sf-label">City</label>
                <div className="sf-field sf-select-wrap">
                  <IconGlobe className="sf-icon" style={{ color: "#6f452e" }} />
                  <Select
                    {...selectSharedProps}
                    value={selectedCity}
                    onChange={(option) => {
                      safeSetCity(option?.value ?? "all");
                      safeSetPage(1);
                    }}
                    options={cityOptions}
                    isDisabled={cityDisabled}
                    placeholder={cityDisabled ? "Select state first" : "Select city"}
                    styles={buildSelectStyles()}
                    isLoading={loading.cities}
                  />
                </div>
              </div>

              <div>
                <label className="sf-label">Sector</label>
                <div className="sf-field sf-select-wrap">
                  <IconBriefcase className="sf-icon" style={{ color: "#6f452e" }} />
                  <Select
                    {...selectSharedProps}
                    value={selectedSector}
                    onChange={(option) => {
                      safeSetSector(option?.value ?? "");
                      safeSetPage(1);
                    }}
                    options={sectorOptions}
                    placeholder="Select sector"
                    styles={buildSelectStyles()}
                    isLoading={loading.sectors}
                  />
                </div>
              </div>

              <div>
                <label className="sf-label">Industry</label>
                <div className="sf-field sf-select-wrap">
                  <IconBriefcase className="sf-icon" style={{ color: "#6f452e" }} />
                  <Select
                    {...selectSharedProps}
                    value={selectedIndustry}
                    onChange={(option) => {
                      safeSetIndustry(option?.value ?? "all");
                      safeSetPage(1);
                    }}
                    options={industryOptions}
                    isDisabled={industryDisabled}
                    placeholder={industryDisabled ? "Select sector first" : "Select industry"}
                    styles={buildSelectStyles()}
                    isLoading={loading.industries}
                  />
                </div>
              </div>

              <div className="sf-verify" aria-label="Verified only">
                <label className="sf-switch" title="Verified only">
                  <input
                    type="checkbox"
                    checked={safeVerified}
                    onChange={(e) => {
                      safeSetVerified(e.target.checked);
                      safeSetPage(1);
                    }}
                  />
                  <span className="sf-slider" />
                </label>
                <div className="txt">Verified only</div>
              </div>
            </div>

            <div className="sf-divider" />

            <div className="sf-actions">
              <div className="sf-left-actions">
                <button type="button" className="sf-btn ghost" onClick={clearAll}>
                  Clear
                </button>

                <a className="sf-btn outline" href="/companies">
                  All Companies <span aria-hidden="true">↗</span>
                </a>
              </div>

              <button
                type="submit"
                className="sf-btn primary"
                disabled={queuedSearch.open}
              >
                {queuedSearch.open ? "Searching…" : "Search"}
              </button>
            </div>

            {searchValidationError ? (
              <p className="sf-search-error" role="alert">
                {searchValidationError}
              </p>
            ) : null}

            {SelectedFiltersComponent && (
              <SelectedFiltersComponent
                resolvedPrevious={resolvedPrevious}
                loadingSession={loading.session}
                loadingResolving={loading.resolving}
              />
            )}

            {!safeQ && (
              <div className="sf-local-filter">
                <label className="sf-label">Filter current results</label>
                <input
                  className="sf-input sf-local-input"
                  type="search"
                  placeholder="Filter current results by company name..."
                  value={safeLocalFilter}
                  onChange={(e) => safeSetLocalFilter(e.target.value)}
                />
                <div className="sf-helper">
                  This filter applies only to the currently loaded list without calling the server.
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </>
  );
}



