import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, RefreshCw } from "lucide-react";
import "../../styles/raymoch-ai-supported-search-screen.css";

const BRAND_ICON_URL = "/images/logo_preview_exact.svg";

const csrf = () =>
  document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") ?? "";

function names(items = []) {
  return items.map((item) => item?.name).filter(Boolean);
}

function resultCount(body) {
  const companies = body?.companies;
  return Number(
    companies?.total ??
      companies?.meta?.total ??
      companies?.data?.length ??
      body?.total ??
      body?.data?.length ??
      0,
  );
}

function SelectionValue({ value, facets = [], showNames = false, badgesOnly = false }) {
  return (
    <dd className={`ray-ai-supported-search__selection-value ${badgesOnly ? "is-badges-only" : ""}`}>
      {!badgesOnly && <span>{value}</span>}
      <span className="ray-ai-supported-search__badges" aria-live="polite">
        {facets.map((facet) => (
          <span className="ray-ai-supported-search__count-badge" key={`${facet.type}-${facet.name}`}>
            {showNames && <span>{facet.name}</span>}
            <strong>{facet.count == null ? "…" : Number(facet.count).toLocaleString()}</strong>
          </span>
        ))}
      </span>
    </dd>
  );
}

export default function RaymochAISupportedSearchScreen({
  open,
  payload,
  endpoint = "/api/business-search/companies",
  onComplete,
}) {
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState("idle");
  const [response, setResponse] = useState(null);
  const [counts, setCounts] = useState({ countries: [], states: [], cities: [], sectors: [] });
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const controllerRef = useRef(null);

  const selection = useMemo(
    () => ({
      region: payload?.all_regions ? "All regions" : payload?.region_name || "Not selected",
      country: payload?.country?.name || "All countries",
      states: payload?.all_regions
        ? "All states"
        : names(payload?.states).join(", ") || "All states",
      cities: payload?.all_regions
        ? "All cities"
        : names(payload?.cities).join(", ") || "All cities",
      sectors: names(payload?.sectors),
    }),
    [payload],
  );

  useEffect(() => {
    if (!open || !payload) return undefined;

    const previousOverflow = document.body.style.overflow;
    const previousPointerEvents = document.body.style.pointerEvents;
    const backgroundSurfaces = Array.from(document.body.children).filter(
      (element) => !element.hasAttribute("data-raymoch-search-screen"),
    );
    const previousSurfaceState = backgroundSurfaces.map((element) => ({
      element,
      inert: element.inert,
      ariaHidden: element.getAttribute("aria-hidden"),
    }));

    document.body.style.overflow = "hidden";
    document.body.style.pointerEvents = "none";
    backgroundSurfaces.forEach((element) => {
      element.inert = true;
      element.setAttribute("aria-hidden", "true");
    });

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.pointerEvents = previousPointerEvents;
      previousSurfaceState.forEach(({ element, inert, ariaHidden }) => {
        element.inert = inert;
        if (ariaHidden == null) element.removeAttribute("aria-hidden");
        else element.setAttribute("aria-hidden", ariaHidden);
      });
    };
  }, [open, payload]);

  useEffect(() => {
    if (!open || !payload) return undefined;

    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setStatus("loading");
    setResponse(null);
    setCounts({ countries: [], states: [], cities: [], sectors: [] });
    setProgress(0);
    setError("");

    const requestJson = async (url, options = {}) => {
      const request = await fetch(url, {
        credentials: "same-origin",
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
          ...(options.body ? { "Content-Type": "application/json" } : {}),
          ...(csrf() ? { "X-CSRF-TOKEN": csrf() } : {}),
        },
        ...options,
      });
      const body = await request.json().catch(() => ({}));
      if (!request.ok && request.status !== 202) {
        const validationError = Object.values(body?.errors ?? {}).flat().find(Boolean);
        throw new Error(validationError || body?.message || `Search failed (${request.status}).`);
      }
      return { body, httpStatus: request.status };
    };

    const wait = (milliseconds) => new Promise((resolve, reject) => {
      const timer = window.setTimeout(resolve, milliseconds);
      controller.signal.addEventListener("abort", () => {
        window.clearTimeout(timer);
        reject(new DOMException("Aborted", "AbortError"));
      }, { once: true });
    });

    const runQueuedSearch = async () => {
      const initial = await requestJson(endpoint, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setCounts(initial.body?.counts ?? { countries: [], states: [], cities: [], sectors: [] });

      if (!initial.body?.status_url) {
        setResponse(initial.body);
        setStatus("success");
        return;
      }

      while (!controller.signal.aborted) {
        await wait(1000);
        const current = await requestJson(initial.body.status_url);
        setCounts(current.body?.counts ?? { countries: [], states: [], cities: [], sectors: [] });
        setProgress(Number(current.body?.progress ?? 0));
        setResponse(current.body);

        if (current.body?.status === "completed") {
          setStatus("success");
          return;
        }
        if (current.body?.status === "cancelled") {
          throw new Error("The queued search was cancelled.");
        }
      }
    };

    runQueuedSearch().catch((reason) => {
        if (reason?.name === "AbortError") return;
        setError(reason?.message || "Raymoch could not complete the search.");
        setStatus("error");
      });

    return () => controller.abort();
  }, [attempt, endpoint, open, payload]);

  if (!open || !payload || typeof document === "undefined") return null;

  const count = resultCount(response);
  const loading = status === "loading" || status === "idle";

  return createPortal(
    <div
      className="ray-ai-supported-search"
      data-raymoch-search-screen="true"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ray-ai-supported-search-title"
      aria-busy={loading}
      onContextMenu={(event) => event.preventDefault()}
    >
      <div className="ray-ai-supported-search__wash" aria-hidden="true" />
      <main className="ray-ai-supported-search__content">
        <div className={`ray-ai-supported-search__mark ${loading ? "is-spinning" : ""}`}>
          <img src={BRAND_ICON_URL} alt="" />
        </div>

        <p className="ray-ai-supported-search__eyebrow">Raymoch AI supported search</p>
        <h1 id="ray-ai-supported-search-title">
          {loading ? "Your search is in progress…" : status === "success" ? "Search completed" : "Search interrupted"}
        </h1>
        <p className="ray-ai-supported-search__status" aria-live="polite">
          {loading
            ? `Raymoch workers are searching the business directory… ${progress}%`
            : status === "success"
              ? `${count.toLocaleString()} ${count === 1 ? "company" : "companies"} found.`
              : error}
        </p>

        <dl className="ray-ai-supported-search__selection">
          <div><dt>Region selected</dt><dd>{selection.region}</dd></div>
          <div><dt>Country selected</dt><SelectionValue value={selection.country} facets={counts.countries} /></div>
          <div><dt>State selected</dt><SelectionValue facets={counts.states} showNames badgesOnly /></div>
          <div><dt>City selected</dt><SelectionValue value={selection.cities} facets={counts.cities} showNames={counts.cities.length > 1} /></div>
          <div><dt>Sector selected</dt><SelectionValue facets={counts.sectors} showNames badgesOnly /></div>
        </dl>

        {status === "success" && (
          <button
            className="ray-ai-supported-search__action"
            type="button"
            onClick={() => onComplete?.({ request: payload, response, companies: response?.companies ?? null })}
          >
            <CheckCircle2 size={19} /> View {count.toLocaleString()} matching {count === 1 ? "company" : "companies"}
          </button>
        )}

        {status === "error" && (
          <button className="ray-ai-supported-search__action" type="button" onClick={() => setAttempt((value) => value + 1)}>
            <RefreshCw size={19} /> Try the search again
          </button>
        )}
      </main>
    </div>,
    document.body,
  );
}
