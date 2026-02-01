// resources/js/utils/api.js
// Centralized API + Maps helpers for re-use across pages/components.

export const API_BASE = "/api";
export const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY;

// ---------------------------------------------------------------------
// Shared JSON fetch helper
// ---------------------------------------------------------------------
export async function fetchJSON(url, options = {}) {
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const text = await res.text();

  if (!res.ok) {
    const snippet = text ? text.slice(0, 160) : "";
    throw new Error(`HTTP ${res.status}${snippet ? ": " + snippet : ""}`);
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("JSON parse error", url, e, text);
    throw new Error("Bad JSON from server");
  }
}

// ---------------------------------------------------------------------
// Session id to correlate logs / tab events
//   - Used by CompanyDetailDialog to pass ?session_id=... to Laravel
// ---------------------------------------------------------------------
export function getSessionId() {
  try {
    const key = "raymoch_company_detail_sid";
    let sid = window.localStorage.getItem(key);
    if (!sid) {
      sid =
        Math.random().toString(36).slice(2) +
        "-" +
        Date.now().toString(36);
      window.localStorage.setItem(key, sid);
    }
    return sid;
  } catch {
    // e.g. privacy mode / disabled localStorage
    return null;
  }
}


/**
 * GET /api/sectors
 * Expected: array (strings or {id,name}) depending on your backend
 */
export async function fetchSectors() {
  return fetchJSON(`${API_BASE}/sectors`);
}

/**
 * GET /api/companies?q=&country=&sector=
 * Expected: array/paginated companies
 */
export async function fetchCompanies(filters = {}) {
  const params = new URLSearchParams();

  if (filters.q) params.set("q", filters.q);
  if (filters.country) params.set("country", filters.country);
  if (filters.sector) params.set("sector", filters.sector);

  const qs = params.toString();f
  return fetchJSON(`${API_BASE}/companies${qs ? `?${qs}` : ""}`);
}


// ---------------------------------------------------------------------
// Google Maps classic loader (NO Advanced Markers, NO map_id)
//   - This is what removes your “Advanced Markers / Map ID” issues
// ---------------------------------------------------------------------
let googleMapsLoadingPromise = null;

export function loadGoogleMapsScript() {
  // Already loaded?
  if (window.google && window.google.maps) {
    return Promise.resolve();
  }

  // In-flight?
  if (googleMapsLoadingPromise) {
    return googleMapsLoadingPromise;
  }

  if (!GOOGLE_MAPS_KEY) {
    return Promise.reject(
      new Error("Missing VITE_GOOGLE_MAPS_KEY in .env file")
    );
  }

  googleMapsLoadingPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    // ✅ Classic JS API only – no extra libraries, no map_id
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Failed to load Google Maps JavaScript API"));
    document.head.appendChild(script);
  });

  return googleMapsLoadingPromise;
}


