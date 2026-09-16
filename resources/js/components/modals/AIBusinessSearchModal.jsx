import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  Mic,
  RefreshCw,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import NavigationTooltip from "../behaviours/NavigationTooltip.jsx";
import RaymochAISearchSplash from "../behaviours/raymochAISearchSplash.jsx";
import RaymochAISupportedSearchScreen from "../behaviours/RaymochAISupportedSearchScreen.jsx";
import "../../styles/ai-business-search-modal.css";
import "../../styles/ai-business-search-company-step.css";

const records = (body, key) => {
  const rows = Array.isArray(body) ? body : body?.data ?? body?.[key] ?? [];
  return (Array.isArray(rows) ? rows : [])
    .map((row) => ({
      id:
        row?.id ??
        row?.countries_all_id ??
        row?.states_all_id ??
        row?.cities_all_id ??
        row?.sector_id,
      name:
        row?.name ??
        row?.country_name ??
        row?.region_name ??
        row?.state_name ??
        row?.city_name ??
        row?.sector_name ??
        row?.title,
    }))
    .filter((row) => row.id != null && row.name);
};

const csrf = () => document.querySelector('meta[name="csrf-token"]')?.content ?? "";
const emptyPage = { current: 1, last: 1, total: 0 };

export default function AIBusinessSearchModal({
  open,
  onClose,
  onComplete,
  regionsEndpoint = "/api/business-search/get-regions",
  countriesEndpoint = "/api/business-search/get-countries",
  statesEndpoint = "/api/business-search/get-states",
  citiesEndpoint = "/api/business-search/get-cities",
  sectorsEndpoint = "/api/business-search/get-sectors",
  companiesEndpoint = "/api/business-search/companies",
}) {
  const inputRef = useRef(null);
  const thinkingTimer = useRef(null);
  const navigationHistoryRef = useRef([]);
  const [step, setStep] = useState("regions");
  const [regions, setRegions] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [citiesLoaded, setCitiesLoaded] = useState(false);
  const [sectors, setSectors] = useState([]);
  const [region, setRegion] = useState(null);
  const [country, setCountry] = useState(null);
  const [selectedStates, setSelectedStates] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [selectedAllStates, setSelectedAllStates] = useState(false);
  const [selectedAllRegions, setSelectedAllRegions] = useState(false);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [companySearchMode, setCompanySearchMode] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyKeyword, setCompanyKeyword] = useState("");
  const [searchSplashPayload, setSearchSplashPayload] = useState(null);
  const [supportedSearchPayload, setSupportedSearchPayload] = useState(null);
  const [page, setPage] = useState(emptyPage);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [listening, setListening] = useState(false);

  const headers = (json = false) => ({
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
    ...(json ? { "Content-Type": "application/json" } : {}),
    ...(csrf() ? { "X-CSRF-TOKEN": csrf() } : {}),
  });

  const rememberCurrentSession = () => {
    navigationHistoryRef.current = [
      ...navigationHistoryRef.current.slice(-19),
      {
        step,
        regions,
        countries,
        states,
        cities,
        citiesLoaded,
        sectors,
        region,
        country,
        selectedStates,
        selectedCities,
        selectedSectors,
        selectedAllStates,
        selectedAllRegions,
        selectedRegions,
        companySearchMode,
        companyName,
        companyKeyword,
        page,
        query,
      },
    ];
  };

  const restoreSession = (session) => {
    setStep(session.step);
    setRegions(session.regions);
    setCountries(session.countries);
    setStates(session.states);
    setCities(session.cities);
    setCitiesLoaded(session.citiesLoaded);
    setSectors(session.sectors);
    setRegion(session.region);
    setCountry(session.country);
    setSelectedStates(session.selectedStates);
    setSelectedCities(session.selectedCities);
    setSelectedSectors(session.selectedSectors);
    setSelectedAllStates(session.selectedAllStates);
    setSelectedAllRegions(session.selectedAllRegions);
    setSelectedRegions(session.selectedRegions);
    setCompanySearchMode(session.companySearchMode);
    setCompanyName(session.companyName);
    setCompanyKeyword(session.companyKeyword);
    setPage(session.page);
    setQuery(session.query);
    setError("");
    setLoading(false);
  };

  const selectionPayload = (stateSelection = selectedStates, citySelection = selectedCities) => ({
    region_id: selectedAllRegions ? null : region?.id ?? null,
    region_ids: selectedAllRegions
      ? selectedRegions.map(({ id }) => id)
      : region ? [region.id] : [],
    regions: selectedAllRegions
      ? selectedRegions.map(({ id, name }) => ({ id, name }))
      : region ? [{ id: region.id, name: region.name }] : [],
    all_regions: selectedAllRegions,
    country_id: country?.id ?? null,
    state_id: stateSelection[0]?.id ?? null,
    ...(citySelection.length ? { city_id: citySelection[0].id } : {}),
    region: region ? { id: region.id, name: region.name } : null,
    country: country ? { id: country.id, name: country.name } : null,
    states: stateSelection.map(({ id, name }) => ({ id, name })),
    state_ids: stateSelection.map(({ id }) => id),
    cities: citySelection.map(({ id, name }) => ({ id, name })),
    city_ids: citySelection.map(({ id }) => id),
  });

  useEffect(() => {
    if (!open) return undefined;
    const controller = new AbortController();
    clearTimeout(thinkingTimer.current);
    navigationHistoryRef.current = [];
    setStep("regions");
    setRegions([]); setCountries([]); setStates([]); setCities([]); setCitiesLoaded(false); setSectors([]);
    setRegion(null); setCountry(null); setSelectedStates([]); setSelectedCities([]); setSelectedSectors([]); setSelectedAllStates(false); setSelectedAllRegions(false); setSelectedRegions([]); setCompanySearchMode(""); setCompanyName(""); setCompanyKeyword(""); setSearchSplashPayload(null); setSupportedSearchPayload(null);
    setPage(emptyPage); setQuery(""); setError(""); setLoading(true);
    fetch(regionsEndpoint, {
      credentials: "same-origin",
      headers: headers(),
      signal: controller.signal,
    })
      .then(async (response) => {
        const body = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(body?.message || `Unable to load regions (${response.status}).`);
        return body;
      })
      .then((body) => setRegions(records(body, "regions")))
      .catch((reason) => reason?.name !== "AbortError" && setError(reason?.message || "Unable to load regions."))
      .finally(() => !controller.signal.aborted && setLoading(false));
    const focusTimer = setTimeout(() => inputRef.current?.focus(), 120);
    return () => { controller.abort(); clearTimeout(focusTimer); clearTimeout(thinkingTimer.current); };
  }, [open, regionsEndpoint, retry]);

  useEffect(() => {
    if (!open) return undefined;
    const close = (event) => event.key === "Escape" && onClose?.();
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open, onClose]);

  const post = async (url, payload) => {
    const response = await fetch(url, {
      method: "POST",
      credentials: "same-origin",
      headers: headers(true),
      body: JSON.stringify(payload),
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body?.message || `Request failed (${response.status}).`);
    return body;
  };

  const setPagination = (body, requestedPage = 1) => setPage({
    current: Number(body.current_page ?? body.meta?.current_page ?? requestedPage),
    last: Number(body.last_page ?? body.meta?.last_page ?? 1),
    total: Number(body.total ?? body.meta?.total ?? 0),
  });

  const selectAllRegions = async (checked) => {
    if (!checked) {
      setSelectedAllRegions(false);
      setSelectedRegions([]);
      return;
    }

    rememberCurrentSession();
    setSelectedAllRegions(true);
    setSelectedRegions(regions);
    setRegion(null);
    setCountry(null);
    setSelectedStates([]);
    setSelectedCities([]);
    setSelectedAllStates(false);
    setError("");
    setQuery("");
    setStep("thinking");

    const minimumThinkingTime = new Promise((resolve) => {
      thinkingTimer.current = setTimeout(resolve, 850);
    });

    try {
      const sectorsRequest = fetch(sectorsEndpoint, {
        credentials: "same-origin",
        headers: headers(),
      }).then(async (response) => {
        const body = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(body?.message || `Unable to load sectors (${response.status}).`);
        }
        return body;
      });

      const [body] = await Promise.all([sectorsRequest, minimumThinkingTime]);
      setSectors(records(body, "sectors"));
      setPage(emptyPage);
      setStep("sectors");
    } catch (reason) {
      clearTimeout(thinkingTimer.current);
      setSelectedAllRegions(false);
      setSelectedRegions([]);
      setError(reason?.message || "Unable to load sectors.");
      setStep("regions");
    }
  };

  const loadCountries = async (chosenRegion, requestedPage = 1) => {
    if (step !== "countries") rememberCurrentSession();
    setSelectedAllRegions(false);
    setSelectedRegions([chosenRegion]);
    setLoading(true); setError(""); setQuery(""); setCountry(null);
    try {
      const body = await post(countriesEndpoint, { region_id: chosenRegion.id, page: requestedPage });
      setCountries(records(body, "countries")); setPagination(body, requestedPage);
      setRegion(chosenRegion); setStep("countries");
    } catch (reason) { setError(reason?.message || "Unable to load countries."); }
    finally { setLoading(false); }
  };

  const loadStates = async (chosenCountry, requestedPage = 1) => {
    if (step !== "states") rememberCurrentSession();
    setLoading(true); setError(""); setQuery(""); setSelectedStates([]); setCities([]); setCitiesLoaded(false); setSelectedCities([]); setSelectedAllStates(false);
    try {
      const body = await post(statesEndpoint, { countries_id: chosenCountry.id, page: requestedPage });
      setStates(records(body, "states")); setPagination(body, requestedPage);
      setCountry(chosenCountry); setStep("states");
    } catch (reason) { setError(reason?.message || "Unable to load states."); }
    finally { setLoading(false); }
  };

  const selectState = async (chosenStates) => {
    rememberCurrentSession();
    setSelectedAllStates(false); setSelectedStates(chosenStates); setCities([]); setCitiesLoaded(false); setSelectedCities([]); setStep("thinking"); setError(""); setQuery("");
    const minimumThinkingTime = new Promise((resolve) => {
      thinkingTimer.current = setTimeout(resolve, 850);
    });
    try {
      const [citiesBody] = await Promise.all([
        post(citiesEndpoint, { state_id: chosenStates[0].id }),
        minimumThinkingTime,
      ]);
      setCities(records(citiesBody, "cities"));
      setCitiesLoaded(true);
      setPage(emptyPage);
      setStep("cityQuestion");
    } catch (reason) {
      clearTimeout(thinkingTimer.current);
      setError(reason?.message || "I could not load cities for that state. Please try again.");
      setStep("states");
    }
  };

  const selectAllStates = async (checked) => {
    if (!checked) { setSelectedStates([]); setSelectedAllStates(false); return; }

    rememberCurrentSession();
    setLoading(true); setError("");
    try {
      // State results are paginated, so collect every page before continuing.
      const allStates = new Map(states.map((item) => [item.id, item]));
      for (let requestedPage = 1; requestedPage <= page.last; requestedPage += 1) {
        if (requestedPage === page.current) continue;
        const body = await post(statesEndpoint, {
          countries_id: country.id,
          page: requestedPage,
        });
        records(body, "states").forEach((item) => allStates.set(item.id, item));
      }
      // “Select All states” proceeds directly to global sector options.
      setSelectedStates([...allStates.values()]);
      setSelectedAllStates(true);
      setStep("thinking");
      setQuery("");

      const minimumThinkingTime = new Promise((resolve) => {
        thinkingTimer.current = setTimeout(resolve, 1000);
      });
      const sectorsRequest = fetch(sectorsEndpoint, {
        credentials: "same-origin",
        headers: headers(),
      }).then(async (response) => {
        const body = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(body?.message || `Unable to load sectors (${response.status}).`);
        return body;
      });

      const [body] = await Promise.all([sectorsRequest, minimumThinkingTime]);
      setSectors(records(body, "sectors"));
      setPage(emptyPage);
      setStep("sectors");
    } catch (reason) {
      clearTimeout(thinkingTimer.current);
      setError(reason?.message || "Unable to load sectors.");
      setStep("states");
    } finally {
      setLoading(false);
    }
  };

  const loadCities = async () => {
    rememberCurrentSession();
    if (citiesLoaded) {
      setError(""); setQuery(""); setPage(emptyPage); setStep("cities");
      return;
    }
    setLoading(true); setError(""); setQuery("");
    try {
      const stateIds = selectedStates.map(({ id }) => id);
      const body = await post(citiesEndpoint, {
        ...(stateIds.length === 1 ? { state_id: stateIds[0] } : { state_ids: stateIds }),
      });
      setCities(records(body, "cities"));
      setCitiesLoaded(true);
      setPage(emptyPage);
      setStep("cities");
    } catch (reason) { setError(reason?.message || "Unable to load cities."); }
    finally { setLoading(false); }
  };

  const loadSectors = async () => {
    rememberCurrentSession();
    setLoading(true); setError(""); setQuery("");
    try {
      // Sector options are global and do not require any previous selection IDs.
      const response = await fetch(sectorsEndpoint, { credentials: "same-origin", headers: headers() });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body?.message || `Unable to load sectors (${response.status}).`);
      setSectors(records(body, "sectors")); setPage(emptyPage); setStep("sectors");
    } catch (reason) { setError(reason?.message || "Unable to load sectors."); }
    finally { setLoading(false); }
  };

  const toggleCity = (item) => setSelectedCities((current) =>
    current.some(({ id }) => id === item.id) ? current.filter(({ id }) => id !== item.id) : [...current, item]
  );
  const toggleSector = (item) => setSelectedSectors((current) =>
    current.some(({ id }) => id === item.id) ? current.filter(({ id }) => id !== item.id) : [...current, item]
  );

  const continueFromSectors = () => {
    if (!selectedSectors.length) return;
    rememberCurrentSession();
    setCompanySearchMode(""); setCompanyName(""); setCompanyKeyword(""); setError(""); setQuery("");
    setStep("companySearch");
  };

  const finish = async () => {
    const normalizedCompanyName = companyName.trim();
    const normalizedKeyword = companyKeyword.trim();
    if (!companySearchMode) return setError("Choose a company search option.");
    if (companySearchMode === "specific" && !normalizedCompanyName) return setError("Enter the company name you want to search for.");

    const payload = {
      ...selectionPayload(),
      region_name: selectedAllRegions ? "All regions" : region?.name ?? null,
      sectors: selectedSectors.map(({ id, name }) => ({ id, name })),
      sector_ids: selectedSectors.map(({ id }) => id),
      company_search: {
        mode: companySearchMode,
        list_all: companySearchMode === "all",
        company_name: companySearchMode === "specific" ? normalizedCompanyName : null,
        keyword: normalizedKeyword || null,
      },
      company_name: companySearchMode === "specific" ? normalizedCompanyName : null,
      company_keyword: normalizedKeyword || null,
    };

    // The current controller endpoint implements the list-all workflow.
    // Keep the specific-company payload available for its dedicated endpoint.
    if (companySearchMode !== "all") {
      onComplete?.({ request: payload, response: null, companies: null });
      return;
    }

    // First show the focused Raymoch-only splash. The API-backed search
    // screen is mounted only after the splash completes.
    setSearchSplashPayload(payload);
  };

  const isCountries = step === "countries";
  const isStates = step === "states";
  const isCities = step === "cities";
  const isSectors = step === "sectors";
  const listStep = ["regions", "countries", "states", "cities", "sectors"].includes(step);
  const items = isSectors ? sectors : isCities ? cities : isStates ? states : isCountries ? countries : regions;
  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return term ? items.filter((item) => item.name.toLowerCase().includes(term)) : items;
  }, [items, query]);

  const selectedIds = isCities
    ? new Set(selectedCities.map(({ id }) => id))
    : isSectors ? new Set(selectedSectors.map(({ id }) => id)) : new Set();

  const voice = () => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) return setError("Voice input is not supported by this browser.");
    const recognition = new Recognition();
    recognition.lang = "en-US"; recognition.interimResults = false;
    recognition.onstart = () => { setListening(true); setError(""); };
    recognition.onresult = (event) => setQuery(event.results?.[0]?.[0]?.transcript ?? "");
    recognition.onerror = () => setError("Voice input could not be captured.");
    recognition.onend = () => setListening(false);
    recognition.start();
  };

  const goBack = () => {
    const previousSession = navigationHistoryRef.current.pop();
    if (previousSession) restoreSession(previousSession);
  };

  const prompt = isSectors
    ? "Which business sectors should I include? You can choose more than one."
    : isCities ? "Choose one or more cities, then continue to sectors."
    : isStates ? `Choose a state in ${country?.name}.`
    : isCountries ? `Choose a country in ${region?.name}.`
    : "Choose an African region to begin your search.";

  const summarize = (items, allLabel) => {
    if (!items.length) return null;
    if (allLabel) return allLabel;
    if (items.length <= 2) return items.map(({ name }) => name).join(", ");
    return `${items[0].name}, ${items[1].name} +${items.length - 2}`;
  };

  const selectionTrail = [
    selectedAllRegions && { label: "Regions", value: "All regions" },
    !selectedAllRegions && region && { label: "Region", value: region.name },
    country && { label: "Country", value: country.name },
    selectedStates.length && {
      label: selectedStates.length > 1 ? "States" : "State",
      value: summarize(selectedStates, selectedAllStates ? "All states" : null),
    },
    selectedCities.length && {
      label: selectedCities.length > 1 ? "Cities" : "City",
      value: summarize(selectedCities),
    },
    selectedSectors.length && {
      label: selectedSectors.length > 1 ? "Sectors" : "Sector",
      value: summarize(selectedSectors),
    },
    companySearchMode && {
      label: "Company search",
      value: companySearchMode === "specific" ? companyName || "Specific company" : "All companies",
    },
  ].filter(Boolean);

  if (!open) return null;
  return (
    <div className={`ray-ai-search__backdrop ${searchSplashPayload || supportedSearchPayload ? "is-launching-supported-search" : ""}`} role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose?.()}>
      <section className="ray-ai-search" role="dialog" aria-modal="true" aria-labelledby="ai-business-search-title">
        <header>
          <div><span><Sparkles size={19} /></span><div><strong id="ai-business-search-title">AI Business Search</strong><small>Live Raymoch business discovery</small></div></div>
          <button type="button" className="ray-navigation-tooltip-host" onClick={onClose} aria-label="Close business search"><X size={19} /><NavigationTooltip>Close business search</NavigationTooltip></button>
        </header>

        <div className="ray-ai-search__body">
          {selectionTrail.length > 0 && (
            <nav className="ray-ai-search__trail" aria-label="Current business search selections">
              {selectionTrail.map((selection, index) => (
                <React.Fragment key={selection.label}>
                  {index > 0 && <ChevronRight className="ray-ai-search__trail-arrow" size={16} aria-hidden="true" />}
                  <div className="ray-ai-search__trail-item" title={`${selection.label}: ${selection.value}`}>
                    <span>{selection.label}</span>
                    <strong>{selection.value}</strong>
                  </div>
                </React.Fragment>
              ))}
            </nav>
          )}
          {step !== "regions" && step !== "thinking" && (
            <div className="ray-ai-search__navigation">
              <button type="button" className="ray-ai-search__back ray-navigation-tooltip-host" onClick={goBack}><ArrowLeft size={16} /> {isStates ? "Countries" : "Back"}<NavigationTooltip>{isStates ? "Return to countries" : "Return to the previous step"}</NavigationTooltip></button>
              {isStates && (
                <label className="ray-ai-search__select-all">
                  <input type="checkbox" checked={visible.length > 0 && visible.every(({ id }) => selectedStates.some((state) => state.id === id))} onChange={(event) => selectAllStates(event.target.checked)} />
                  <span>Select All states</span>
                </label>
              )}
            </div>
          )}

          {step === "thinking" ? (
            <div className="ray-ai-search__thinking" role="status" aria-live="polite">
              <span className="ray-ai-search__thinking-icon"><Sparkles size={22} /></span>
              <div><strong>Thinking…</strong><p>{selectedAllRegions ? "All regions are selected. I’m preparing the sectors for you to choose from." : selectedAllStates ? "All states are selected. I’m preparing the sectors for you to choose from." : "I’m reviewing your region, country, and state selection."}</p></div>
              <RefreshCw className="ray-ai-search__thinking-refresh" size={24} aria-hidden="true" />
            </div>
          ) : step === "cityQuestion" ? (
            <div className="ray-ai-search__conversation">
              <div className="ray-ai-search__message"><Sparkles size={18} /><p>You selected <strong>{selectedStates[0]?.name}</strong> in {country?.name}. Would you like me to fetch all cities under this state?</p></div>
              <div className="ray-ai-search__answer" role="group" aria-label={`Fetch all cities under ${selectedStates[0]?.name ?? "the selected state"}`}>
                <input value={`Fetch all cities under ${selectedStates[0]?.name ?? "this state"}?`} readOnly aria-label="AI question" />
                <button type="button" onClick={loadCities}>Yes, fetch cities</button>
                <button type="button" className="is-secondary" onClick={loadSectors}>No, select sectors</button>
              </div>
              {loading && <div className="ray-ai-search__status"><LoaderCircle className="ray-ai-search__spinner" size={20} /> Loading…</div>}
              {error && <div className="ray-ai-search__error" role="alert">{error}</div>}
            </div>
          ) : step === "companySearch" ? (
            <div className="ray-ai-search__company-step">
              <div className="ray-ai-search__message">
                <Sparkles size={18} />
                <p>I have <strong>{selectedAllRegions ? "all regions" : region?.name}</strong> and <strong>{selectedSectors.length} selected {selectedSectors.length === 1 ? "sector" : "sectors"}</strong>. Would you like a specific company or all companies operating in this region?</p>
              </div>
              <div className="ray-ai-search__company-options" role="radiogroup" aria-label="Company search type">
                <label className={companySearchMode === "specific" ? "is-selected" : ""}>
                  <input type="radio" name="company_search_mode" checked={companySearchMode === "specific"} onChange={() => { setCompanySearchMode("specific"); setError(""); }} />
                  <span><strong>Search for a specific company</strong><small>Enter a company name and optional information keyword.</small></span>
                </label>
                <label className={companySearchMode === "all" ? "is-selected" : ""}>
                  <input type="radio" name="company_search_mode" checked={companySearchMode === "all"} onChange={() => { setCompanySearchMode("all"); setCompanyName(""); setError(""); }} />
                  <span><strong>List all companies</strong><small>List companies in the selected region and sectors.</small></span>
                </label>
              </div>
              {companySearchMode && (
                <div className="ray-ai-search__company-fields">
                  {companySearchMode === "specific" && <label><span>Company name *</span><input type="text" value={companyName} onChange={(event) => { setCompanyName(event.target.value); setError(""); }} placeholder="Example: Acme Technologies" autoComplete="organization" /></label>}
                  <label><span>Company information keyword <small>(optional)</small></span><input type="search" value={companyKeyword} onChange={(event) => setCompanyKeyword(event.target.value)} placeholder="Example: funding, revenue, employees, products" /></label>
                </div>
              )}
              {error && <div className="ray-ai-search__error" role="alert">{error}</div>}
              <button type="button" className="ray-ai-search__continue" onClick={finish} disabled={loading || !companySearchMode || (companySearchMode === "specific" && !companyName.trim())}>{loading ? "Loading companies…" : companySearchMode === "all" ? "List matching companies" : "Search company"}</button>
            </div>
          ) : (
            <>
              <p className="ray-ai-search__prompt">{prompt}</p>
              {step === "regions" && !loading && !error && regions.length > 0 && (
                <label className="ray-ai-search__select-all ray-ai-search__select-all--regions">
                  <input
                    type="checkbox"
                    checked={selectedAllRegions}
                    onChange={(event) => selectAllRegions(event.target.checked)}
                  />
                  <span>Select all regions and continue to sectors</span>
                </label>
              )}
              {listStep && <div className="ray-ai-search__query"><Search size={18} /><input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Filter ${isSectors ? "sectors" : isCities ? "cities" : isStates ? "states" : isCountries ? "countries" : "regions"}…`} /><button type="button" className={`${listening ? "is-listening " : ""}ray-navigation-tooltip-host`} onClick={voice} aria-label={listening ? "Listening for voice search" : "Search by voice"}><Mic size={18} /><NavigationTooltip>{listening ? "Listening…" : "Search by voice"}</NavigationTooltip></button></div>}
              {loading && <div className="ray-ai-search__status" role="status"><LoaderCircle className="ray-ai-search__spinner" size={20} /> Loading…</div>}
              {!loading && error && <div className="ray-ai-search__error" role="alert"><span>{error}</span><button type="button" onClick={() => setRetry((value) => value + 1)}>Try again</button></div>}
              {!loading && !error && visible.length > 0 && (
                <div className="ray-ai-search__tiles">
                  {visible.map((item) => (
                    <button type="button" key={item.id} className={selectedIds.has(item.id) ? "is-selected" : ""} onClick={() => isSectors ? toggleSector(item) : isCities ? toggleCity(item) : isStates ? selectState([item]) : isCountries ? loadStates(item) : loadCountries(item)}>{item.name}</button>
                  ))}
                </div>
              )}
              {!loading && !error && !visible.length && <p className="ray-ai-search__empty">No matches for “{query}”.</p>}
              {(isCountries || isStates) && !loading && !error && page.last > 1 && (
                <nav className="ray-ai-search__pagination"><button type="button" className="ray-navigation-tooltip-host" disabled={page.current <= 1} onClick={() => isStates ? loadStates(country, page.current - 1) : loadCountries(region, page.current - 1)}><ChevronLeft size={17} /> Previous<NavigationTooltip>Previous page</NavigationTooltip></button><span>Page <strong>{page.current}</strong> of {page.last}</span><button type="button" className="ray-navigation-tooltip-host" disabled={page.current >= page.last} onClick={() => isStates ? loadStates(country, page.current + 1) : loadCountries(region, page.current + 1)}>Next <ChevronRight size={17} /><NavigationTooltip>Next page</NavigationTooltip></button></nav>
              )}
              {isCities && <button type="button" className="ray-ai-search__continue" onClick={loadSectors} disabled={!selectedCities.length}>Continue to sectors ({selectedCities.length})</button>}
              {isSectors && <button type="button" className="ray-ai-search__continue" onClick={continueFromSectors} disabled={!selectedSectors.length}>Continue with selected sectors ({selectedSectors.length})</button>}
            </>
          )}
        </div>
      </section>
      <RaymochAISearchSplash
        open={Boolean(searchSplashPayload)}
        onReady={() => {
          setSupportedSearchPayload(searchSplashPayload);
          setSearchSplashPayload(null);
        }}
      />
      <RaymochAISupportedSearchScreen
        open={Boolean(supportedSearchPayload)}
        payload={supportedSearchPayload}
        endpoint={companiesEndpoint}
        onComplete={(result) => {
          setSupportedSearchPayload(null);
          onComplete?.(result);
        }}
      />
    </div>
  );
}
