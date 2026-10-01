// resources/js/utils/api.js
// Centralized API and Google Maps helpers.

export const API_BASE = "/api";
export const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY;

export function getCsrfToken() {
  return (
    document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") ||
    ""
  );
}

export async function fetchJSON(url, options = {}) {
  const { headers: suppliedHeaders = {}, ...requestOptions } = options;
  const method = String(requestOptions.method || "GET").toUpperCase();
  const csrfToken = getCsrfToken();
  const needsCsrfToken = !["GET", "HEAD", "OPTIONS"].includes(method);

  const res = await fetch(url, {
    credentials: "same-origin",
    ...requestOptions,
    headers: {
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
      ...(needsCsrfToken && csrfToken ? { "X-CSRF-TOKEN": csrfToken } : {}),
      ...suppliedHeaders,
    },
  });

  const text = await res.text();

  if (!res.ok) {
    const snippet = text ? text.slice(0, 160) : "";
    throw new Error(`HTTP ${res.status}${snippet ? `: ${snippet}` : ""}`);
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("JSON parse error", url, error, text);
    throw new Error("Bad JSON from server");
  }
}

export function fetchSectors() {
  return fetchJSON(`${API_BASE}/business-sectors`);
}

export function fetchCountries() {
  return fetchJSON(`${API_BASE}/countries`);
}

export function fetchCompanies(filters = {}) {
  const params = new URLSearchParams();
  const cleanValue = (value) => {
    if (value === undefined || value === null) return "";
    const normalized = String(value).trim();
    return /^(all|any)$/i.test(normalized) ? "" : normalized;
  };
  const country = cleanValue(filters.country);
  const sector = cleanValue(filters.sector);
  const countryId = cleanValue(filters.countryId) || (/^\d+$/.test(country) ? country : "");
  const sectorId = cleanValue(filters.sectorId) || (/^\d+$/.test(sector) ? sector : "");
  const supportedFilters = {
    page: filters.page,
    per_page: filters.perPage,
    q: filters.q,
    region_id: filters.regionId,
    country_id: countryId,
    state_id: filters.stateId,
    city_id: filters.cityId,
    sector_id: sectorId,
    industry_id: filters.industryId,
    verification_status: filters.verificationStatus || (filters.verified ? "verified" : ""),
    country: /^\d+$/.test(country) ? "" : country,
    sector: /^\d+$/.test(sector) ? "" : sector,
  };

  Object.entries(supportedFilters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });

  const query = params.toString();
  return fetchJSON(`${API_BASE}/companies${query ? `?${query}` : ""}`);
}

let googleMapsLoadingPromise = null;

export function loadGoogleMapsScript() {
  if (window.google?.maps) return Promise.resolve();
  if (googleMapsLoadingPromise) return googleMapsLoadingPromise;

  if (!GOOGLE_MAPS_KEY) {
    return Promise.reject(new Error("Missing VITE_GOOGLE_MAPS_KEY in .env file"));
  }

  googleMapsLoadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
      GOOGLE_MAPS_KEY
    )}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Maps JavaScript API"));
    document.head.appendChild(script);
  });

  return googleMapsLoadingPromise;
}

export function getSessionId() {
  try {
    const key = "raymoch_company_detail_sid";
    let sid = window.localStorage.getItem(key);

    if (!sid) {
      sid = `${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;
      window.localStorage.setItem(key, sid);
    }

    return sid;
  } catch {
    return null;
  }
}
