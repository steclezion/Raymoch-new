import { useCallback, useEffect, useRef, useState } from "react";

const SESSION_KEY = "raymoch.search.active";
const TERMINAL_STEP_STATUSES = new Set([
  "completed",
  "done",
  "failed",
  "skipped",
  "cancelled",
]);

function normalizeSearchStatus(rawStatus) {
  if (!rawStatus || typeof rawStatus !== "object") {
    throw new Error("The search status response is invalid.");
  }

  const steps = Object.values(rawStatus.steps || {});
  const expected = Number(rawStatus.meta?.total_steps || 0);
  const allStepsTerminal =
    expected > 0 &&
    steps.length >= expected &&
    steps.every((step) => TERMINAL_STEP_STATUSES.has(step?.status));

  if (!allStepsTerminal || rawStatus.meta?.is_completed) return rawStatus;

  const hasFailedStep = steps.some((step) => step?.status === "failed");

  return {
    ...rawStatus,
    meta: {
      ...rawStatus.meta,
      is_running: false,
      is_completed: true,
      has_error: Boolean(rawStatus.meta?.has_error || hasFailedStep),
      progress_percent: 100,
    },
  };
}

function readSession() {
  try { return JSON.parse(window.sessionStorage.getItem(SESSION_KEY) || "null"); }
  catch { return null; }
}

function saveSession(value) {
  try {
    if (value) window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(value));
    else window.sessionStorage.removeItem(SESSION_KEY);
  } catch { /* Storage may be unavailable; the current search still works. */ }
}

async function api(url, options = {}) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(url, {
      credentials: "same-origin",
      cache: "no-store",
      ...options,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.content || "",
        ...(options.headers || {}),
      },
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok || body.ok !== true) {
      const error = new Error(
        body.errors ? Object.values(body.errors).flat().join(" ") :
          body.message || "Search request failed (" + response.status + ")."
      );
      error.status = response.status;
      throw error;
    }
    return body;
  } finally {
    window.clearTimeout(timeout);
  }
}

export default function useQueuedCompanySearch() {
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState("");
  const [status, setStatus] = useState(null);
  const [error, setError] = useState("");
  const [starting, setStarting] = useState(false);
  const timerRef = useRef(null);
  const activeRef = useRef(false);
  const generationRef = useRef(0);
  const sessionRef = useRef(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  const poll = useCallback(async (searchToken, generation) => {
    if (generation !== generationRef.current) return;
    try {
      const response = await api("/api/main-search-engine/status/" + encodeURIComponent(searchToken));
      if (generation !== generationRef.current) return;
      const next = normalizeSearchStatus(response.data);
      setStatus(next);
      setStarting(false);

      if (next.meta.is_stopped || next.meta.is_completed) {
        clearTimer();
        activeRef.current = false;
        if (next.meta.has_error) setError("Some search jobs failed. Review each tile below.");
        return;
      }

      // Recover the same token if the page closed between start and run.
      if (!next.meta.started_at) {
        await api("/api/main-search-engine/run/" + encodeURIComponent(searchToken), { method: "POST" });
      }
      if (generation !== generationRef.current) return;
      clearTimer();
      timerRef.current = window.setTimeout(() => poll(searchToken, generation), 1000);
    } catch (cause) {
      if (generation !== generationRef.current) return;
      activeRef.current = false;
      setStarting(false);
      if (cause.status === 404) {
        saveSession(null);
        sessionRef.current = null;
      }
      setError(cause.name === "AbortError"
        ? "The request timed out. Retry status to continue this search."
        : cause.message);
    }
  }, [clearTimer]);

  const start = useCallback(async (payload, previousRequestId) => {
    if (activeRef.current) return;
    const generation = ++generationRef.current;
    activeRef.current = true;
    clearTimer();
    setOpen(true);
    setStarting(true);
    setStatus(null);
    setToken("");
    setError("");

    const requestId = previousRequestId || window.crypto.randomUUID();
    const session = { requestId, payload, token: null };
    sessionRef.current = session;
    saveSession(session);

    try {
     // console.log( payload);zvxcc
      await api("/search-session/store", { method: "POST", body: JSON.stringify(payload) });
      if (generation !== generationRef.current) return;
      const started = await api("/api/main-search-engine/start", {
        method: "POST",
        body: JSON.stringify({ ...payload, request_id: requestId }),
      });

     // console.log("Search started with token: " + started.token);
     
      if (generation !== generationRef.current) {
        // The user closed the modal while start was in flight.
        await api("/api/main-search-engine/stop/" + encodeURIComponent(started.token), { method: "POST" });
        return;
      }

      session.token = started.token;
      saveSession(session);
      setToken(started.token);
      // poll starts queued jobs if needed and keeps exactly one polling chain.
      await poll(started.token, generation);
    } catch (cause) {
      if (generation !== generationRef.current) return;
      activeRef.current = false;
      setStarting(false);
      setError(cause.name === "AbortError"
        ? "The start request timed out. Retry status to recover the same search."
        : cause.message);
    }
  }, [clearTimer, poll]);

  const resume = useCallback(async () => {
    clearTimer();
    const session = sessionRef.current || readSession();
    if (!session) {
      setError("This search has expired. Close the modal and start a new search.");
      return;
    }
    sessionRef.current = session;
    setError("");
    setOpen(true);
    if (!session.token) {
      activeRef.current = false;
      await start(session.payload, session.requestId);
      return;
    }
    const generation = ++generationRef.current;
    activeRef.current = true;
    setToken(session.token);
    await poll(session.token, generation);
  }, [clearTimer, poll, start]);

  const stop = useCallback(async () => {
    clearTimer();
    ++generationRef.current;
    activeRef.current = false;
    const session = sessionRef.current;
    try {
      if (session?.token && !status?.meta?.is_completed && !status?.meta?.is_stopped) {
        await api("/api/main-search-engine/stop/" + encodeURIComponent(session.token), { method: "POST" });
      }
      saveSession(null);
      sessionRef.current = null;
      setStarting(false);
      setOpen(false);
    } catch (cause) {
      setError("Stop was not confirmed: " + cause.message);
    }
  }, [clearTimer, status]);

  const viewResults = useCallback(() => {
    if (!token || !status?.meta?.is_completed || status.meta.has_error) return;
    const filters = status.payload || sessionRef.current?.payload || {};
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value === null || value === "" || value === "all" || value === false) continue;
      params.set(key, value === true ? "1" : String(value));
    }
    params.set("from", "explore");
    params.set("search_token", token);
    saveSession(null);
    window.location.assign("/companies?" + params.toString());
  }, [status, token]);

  useEffect(() => {
    // Deferred so React Strict Mode cleanup cannot leave a duplicate poller.
    const pending = window.setTimeout(() => {
      const saved = readSession();
      if (saved) {
        sessionRef.current = saved;
        resume();
      }
    }, 0);
    return () => {
      window.clearTimeout(pending);
      ++generationRef.current;
      activeRef.current = false;
      clearTimer();
    };
  }, [clearTimer, resume]);

  return { open, token, status, error, starting, start, stop, resume, close: stop, viewResults };
}
