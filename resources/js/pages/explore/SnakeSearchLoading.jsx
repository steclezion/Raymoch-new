import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Globe2,
  Flag,
  Map,
  MapPin,
  Briefcase,
  Layers3,
  BadgeCheck,
  Loader2,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Eye,
  CreditCard,
  XCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SearchResultsChart from "./SearchResultsChart.jsx";

const STEP_META = {
  keyword: {
    title: "Keyword",
    icon: Search,
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80",
  },
  region: {
    title: "Region",
    icon: Globe2,
    image:
      "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1400&q=80",
  },
  country: {
    title: "Country",
    icon: Flag,
    image:
      "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1400&q=80",
  },
  state: {
    title: "State",
    icon: Map,
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
  },
  city: {
    title: "City",
    icon: MapPin,
    image:
      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1400&q=80",
  },
  sector: {
    title: "Sector",
    icon: Briefcase,
    image:
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1400&q=80",
  },
  industry: {
    title: "Industry",
    icon: Layers3,
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80",
  },
  verification: {
    title: "Verification",
    icon: BadgeCheck,
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80",
  },
};

const ORDER = [
  "keyword",
  "region",
  "country",
  "state",
  "city",
  "sector",
  "industry",
  "verification",
];

const EMPTY_STEP = (key) => ({
  key,
  label: key === "keyword" ? "(empty)" : "all",
  status: "idle",
  elapsed_ms: 0,
  found_count: 0,
  found_ids: [],
  grouped_results: [],
  started_at: null,
  finished_at: null,
});

function normalizeStepLabel(stepKey, rawLabel) {
  if (rawLabel === null || rawLabel === undefined || rawLabel === "") {
    return stepKey === "keyword" ? "(empty)" : "all";
  }

  if (typeof rawLabel === "boolean") {
    return rawLabel ? "ON" : "OFF";
  }

  return String(rawLabel).trim() || (stepKey === "keyword" ? "(empty)" : "all");
}

function formatStepTitle(step, meta) {
  const label = normalizeStepLabel(
    step.key,
    step.display_name ??
      step.selected_name ??
      step.label_name ??
      step.label
  );

  if (step.key === "keyword") {
    return "Keyword match found";
  }

  return `${meta.title}: ${label}`;
}

function getCsrfToken() {
  return document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");
}

/**
 * This function converts the completed search status into:
 *
 * /companies?sector=Accounting+%26+Audit&from=explore&search_token=...
 *
 * It only includes filters that have real values.
 * It ignores empty, all, unknown, null, and undefined values.
 */
async function buildCompaniesUrlFromSession(token) {
  try {
    const response = await fetch("/search-session/current", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "X-CSRF-TOKEN": getCsrfToken() || "",
      },
      credentials: "same-origin",
    });

    const json = await response.json();

    if (response.ok && json?.ok && json?.url) {
      const joiner = json.url.includes("?") ? "&" : "?";
      return token ? `${json.url}${joiner}search_token=${encodeURIComponent(token)}` : json.url;
    }
  } catch (error) {
    console.error("Unable to read search session:", error);
  }

  return token
    ? `/companies?from=explore&search_token=${encodeURIComponent(token)}`
    : "/companies?from=explore";
}

export default function SnakeSearchLoading({
  token,
  open = false,
  status: statusData = null,
  error = "",
  onResume,
  onViewResults,
  onPayToView,
}) {
  const [expandedSteps, setExpandedSteps] = useState({});
  const [subscriptionAccess, setSubscriptionAccess] = useState({
    loading: true,
    can_view: false,
    plan: null,
    status: null,
    message: "",
  });


  const progress = Number(statusData?.meta?.progress_percent ?? 0);
  const activeStepKey = Object.values(statusData?.steps || {}).find(
    (step) => step.status === "running"
  )?.key || "keyword";
  const successful = Boolean(statusData?.meta?.is_completed && !statusData?.meta?.has_error);

  const hasPremiumAccess = Boolean(subscriptionAccess.can_view);

  const ActionIcon = hasPremiumAccess ? Eye : CreditCard;

  const actionLabel = hasPremiumAccess
    ? "View Results"
    : "Pay To View Results";

  const stepRows = useMemo(() => {
    const rawSteps = statusData?.steps || {};

    return ORDER.map((key) => {
      const merged = {
        ...EMPTY_STEP(key),
        ...(rawSteps[key] || {}),
        key,
      };

      return {
        ...merged,
        label: normalizeStepLabel(key, merged.label),
        grouped_results: Array.isArray(merged.grouped_results)
          ? merged.grouped_results
          : [],
      };
    });
  }, [statusData]);

  const keywordStep =
    stepRows.find((item) => item.key === "keyword") || EMPTY_STEP("keyword");

  const keywordLabel = normalizeStepLabel("keyword", keywordStep.label);

  const activeCard = useMemo(() => {
    const currentStep =
      stepRows.find((item) => item.key === activeStepKey) ||
      stepRows[0] ||
      EMPTY_STEP("keyword");

    const meta = STEP_META[currentStep.key] || STEP_META.keyword;
    const label = normalizeStepLabel(
      currentStep.key,
      currentStep.display_name ??
        currentStep.selected_name ??
        currentStep.label_name ??
        currentStep.label
    );

    return {
      title:
        currentStep.key === "keyword"
          ? "Keyword match found"
          : `${meta.title}: ${label}`,
      image: meta.image,
    };
  }, [stepRows, activeStepKey]);

  useEffect(() => {
    if (!open) return;

    let mounted = true;

    const checkSubscriptionAccess = async () => {
      try {
        setSubscriptionAccess((prev) => ({
          ...prev,
          loading: true,
        }));

        const response = await fetch("/subscription/access", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "X-CSRF-TOKEN": getCsrfToken() || "",
          },
          credentials: "same-origin",
        });

        const json = await response.json();

        if (!mounted) return;

        if (response.ok && json?.ok) {
          setSubscriptionAccess({
            loading: false,
            can_view: Boolean(json.can_view),
            plan: json.plan || null,
            status: json.status || null,
            message: json.message || "",
          });
          return;
        }

        setSubscriptionAccess({
          loading: false,
          can_view: false,
          plan: null,
          status: null,
          message: "Unable to verify subscription.",
        });
      } catch (error) {
        console.error("Subscription access check failed:", error);

        if (mounted) {
          setSubscriptionAccess({
            loading: false,
            can_view: false,
            plan: null,
            status: null,
            message: "Unable to verify subscription.",
          });
        }
      }
    };

    checkSubscriptionAccess();

    return () => {
      mounted = false;
    };
  }, [open]);

  // The shared hook owns polling. This component renders that one status snapshot.
  const smoothProgress = Math.round(progress);

  const toggleStep = (key) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

const handleSummaryAction = async () => {
  if (subscriptionAccess.loading || !successful) return;

  if (hasPremiumAccess) {
    if (typeof onViewResults === "function") {
      onViewResults(statusData);
      return;
    }

    window.location.href = await buildCompaniesUrlFromSession(token);
    return;
  }

  if (typeof onPayToView === "function") {
    onPayToView(statusData);
    return;
  }

  window.location.href = "/pricing";
};

  return (
    <>
      <style>{styles}</style>

      <div className="rm-snake-root">
        <div className="rm-snake-stage">
        {error ? (
          <div role="alert" style={{ padding: 12, color: "#b42318", background: "#fff1f2" }}>
            {error} {onResume ? <button type="button" onClick={onResume}>Retry status</button> : null}
          </div>
        ) : null}
          <div className="rm-snake-topbar">
            <div className="rm-snake-topbar-left">
              <div className="rm-snake-kicker">
                <svg
                  className="rm-snake-kicker-logo"
                  width="22"
                  height="22"
                  viewBox="0 0 200 200"
                  aria-hidden="true"
                >
                  <image
                    href="/images/logo_preview_exact.svg"
                    x="0"
                    y="0"
                    width="200"
                    height="200"
                    preserveAspectRatio="xMidYMid meet"
                  />
                </svg>
                <span>RaySearch</span>
              </div>

              <div className="rm-snake-title">
                {statusData?.meta?.is_completed
                  ? (statusData.meta.has_error ? "Search finished with errors" : "Search Completed")
                  : statusData?.meta?.is_stopped ? "Search stopped" : "Search in progress"}
              </div>

              <div className="rm-snake-subtitle-row">
                <div className="rm-snake-subtitle-text">
                  Keyword match found
                  {keywordStep.label && keywordStep.label !== "(empty)" ? (
                    <>: <strong>{keywordLabel}</strong></>
                  ) : null}
                </div>

                <div className="rm-snake-subtitle-mini">
                  {statusData?.meta?.is_completed ? (
                    <CheckCircle2 size={14} className="rm-done-icon" />
                  ) : (
                    <Loader2 size={14} className="rm-spin" />
                  )}
                </div>
              </div>
            </div>

            <div className="rm-snake-running-pill">
              {successful ? (
                <>
                  <span className="rm-snake-done-dot" />
                  <span>Search complete</span>
                </>
              ) : (
                <>
                  <Loader2 size={15} className={
                    statusData?.meta?.is_stopped || statusData?.meta?.is_completed ? "" : "rm-spin"
                  } />
                  <span>{statusData?.meta?.is_stopped ? "Search stopped" :
                    statusData?.meta?.is_completed ? "Finished with errors" : "Search running"}</span>
                </>
              )}
            </div>
          </div>

          <div className="rm-snake-layout">
            <aside className="rm-snake-left">
              <div className="rm-snake-checks">
                {stepRows.map((step) => {
                  const meta = STEP_META[step.key] || STEP_META.keyword;
                  const Icon = meta.icon;
                  const isRunning = ["running", "retrying"].includes(step.status);
                  const isDone = ["done", "completed"].includes(step.status);
                  const isTerminal = ["done", "completed", "failed", "skipped", "cancelled"].includes(step.status);
                  const hasGroups = step.grouped_results.length > 0;
                  const isExpanded = !!expandedSteps[step.key];

                  return (
                    <div
                      key={step.key}
                      className={`rm-snake-check-item ${
                        step.status === "failed" ? "failed" :
                          isDone ? "done" : isRunning ? "running" : "idle"
                      }`}
                    >
                      <div className="rm-snake-check-main">
                        <span className="rm-snake-check-icon">
                          <Icon size={18} />
                        </span>

                        <div className="rm-snake-check-content">
                          <div className="rm-snake-check-title-row">
                            <span className="rm-snake-check-title">
                              {formatStepTitle(step, meta)}
                            </span>

                            <span className="rm-snake-check-state">
                              {isRunning ? (
                                <Loader2 size={14} className="rm-spin" />
                              ) : step.status === "failed" ? (
                                <XCircle size={16} color="#b42318" />
                              ) : isDone ? (
                                <CheckCircle2
                                  size={16}
                                  className="rm-done-icon"
                                />
                              ) : (
                                <span className="rm-snake-idle-dot" />
                              )}
                            </span>
                          </div>

                          <div className="rm-snake-check-meta">
                            <span>
                              Results:{" "}
                              <strong>{isDone ? Number(step.found_count || 0) : "—"}</strong>
                            </span>
                            <span>
                              Time:{" "}
                              <strong>{isTerminal ? `${Number(step.elapsed_ms || 0)} ms` : "—"}</strong>
                            </span>
                          </div>

                          <div className="rm-snake-check-meta">
                            <span>Status: <strong>{step.status}</strong></span>
                            {step.attempts ? <span>Attempt: {step.attempts}</span> : null}
                          </div>
                          {step.key === "keyword" && step.status === "skipped" ? (
                            <p>No keyword supplied; this filter was not applied.</p>
                          ) : null}
                          {step.error ? <p role="alert" style={{ color: "#b42318" }}>{step.error}</p> : null}

                          {hasGroups && (
                            <div className="rm-snake-groups-wrap">
                              <button
                                type="button"
                                className="rm-snake-toggle-btn"
                                onClick={() => toggleStep(step.key)}
                              >
                                {isExpanded ? (
                                  <ChevronDown size={15} />
                                ) : (
                                  <ChevronRight size={15} />
                                )}
                                <span>
                                  {step.grouped_results.length} grouped result
                                  {step.grouped_results.length > 1 ? "s" : ""}
                                </span>
                              </button>

                              <AnimatePresence initial={false}>
                                {isExpanded && (
                                  <motion.div
                                    className="rm-snake-groups-list"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{
                                      duration: 0.24,
                                      ease: "easeOut",
                                    }}
                                  >
                                    {step.grouped_results.map((item, idx) => (
                                      <div
                                        className="rm-snake-group-row"
                                        key={`${step.key}-${idx}`}
                                      >
                                        <span className="rm-snake-group-name">
                                          {item.name}
                                        </span>
                                        <span className="rm-snake-group-count">
                                          {Number(item.count || 0)}
                                        </span>
                                      </div>
                                    ))}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="rm-snake-progress-wrap">
                <motion.div
                  className="rm-snake-progress-ring"
                  animate={{
                    background: `conic-gradient(#67c4f2 ${
                      smoothProgress * 3.6
                    }deg, #dbeafe 0deg)`,
                  }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <div className="rm-snake-progress-hole">
                    <div className="rm-snake-progress-value">
                      {smoothProgress}%
                    </div>
                  </div>
                </motion.div>
              </div>
            </aside>

            <section className="rm-snake-main">
              <div className="rm-intelligence-shell">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activeCard.title}-${activeCard.image}`}
                    className="rm-intelligence-card"
                    initial={{ opacity: 0, scale: 0.985, filter: "blur(10px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 1.015, filter: "blur(8px)" }}
                    transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <motion.img
                      src={activeCard.image}
                      alt={activeCard.title}
                      className="rm-intelligence-image"
                      initial={{ scale: 1.02 }}
                      animate={{ scale: 1.09 }}
                      transition={{ duration: 12, ease: "linear" }}
                    />

                    <div className="rm-intelligence-vignette" />
                    <div className="rm-intelligence-grid" />
                    <div className="rm-intelligence-scan" />

                    <div className="rm-intelligence-corner top-left" />
                    <div className="rm-intelligence-corner top-right" />
                    <div className="rm-intelligence-corner bottom-left" />
                    <div className="rm-intelligence-corner bottom-right" />

                    <div className="rm-intelligence-topbar">
                      <div className="rm-intelligence-live">
                        <motion.span
                          className="rm-intelligence-live-dot"
                          animate={{ scale: [1, 1.45, 1], opacity: [1, 0.45, 1] }}
                          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <span>{successful ? "INTELLIGENCE READY" : "LIVE DISCOVERY"}</span>
                      </div>

                      <div className="rm-intelligence-step">
                        STEP {String(Math.max(1, ORDER.indexOf(activeStepKey) + 1)).padStart(2, "0")}
                        <span>/</span>
                        {String(ORDER.length).padStart(2, "0")}
                      </div>
                    </div>

                    <div className="rm-intelligence-center" aria-hidden="true">
                      <motion.div
                        className="rm-intelligence-orbit"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                      >
                        <span />
                        <span />
                        <span />
                      </motion.div>
                    </div>

                    <div className="rm-intelligence-content">
                      <div className="rm-intelligence-progress-value">
                        <motion.span
                          key={smoothProgress}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          {smoothProgress}
                        </motion.span>
                        <small>%</small>
                      </div>

                      <div className="rm-intelligence-copy">
                        <span className="rm-intelligence-eyebrow">Raymoch Advanced Search</span>
                        <motion.h2
                          initial={{ opacity: 0, y: 18 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.18, duration: 0.7 }}
                        >
                          {activeCard.title}
                        </motion.h2>
                        <p>Analyzing verified business intelligence across your selected market.</p>
                      </div>
                    </div>

                    <div className="rm-intelligence-progress">
                      <motion.div
                        className="rm-intelligence-progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${smoothProgress}%` }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      />
                      <motion.div
                        className="rm-intelligence-progress-glow"
                        animate={{ left: `${Math.max(0, smoothProgress - 2)}%` }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="rm-snake-summary-card">
                <div className="rm-snake-summary-top">
                  <div className="rm-snake-summary-title">
                    Live Search Monitor
                  </div>
                <SearchResultsChart token={token} statusData={statusData} />

                  <div
                    className={`rm-snake-summary-badge ${
                      statusData?.meta?.is_completed ? "done" : "running"
                    }`}
                  >
                    {statusData?.meta?.is_completed ? "Finished" : "Running"}
                  </div>
                </div>

                <div className="rm-snake-summary-grid">
                  {stepRows.map((step) => {
                    const meta = STEP_META[step.key] || STEP_META.keyword;

                    return (
                      <div className="rm-snake-summary-box" key={step.key}>
                        <div className="rm-snake-summary-box-title">
                          {meta.title}
                        </div>
                        <div className="rm-snake-summary-box-value">
                          {["done", "completed"].includes(step.status) ? Number(step.found_count || 0) : "—"}
                        </div>
                        <div className="rm-snake-summary-box-sub">
                          {step.status === "skipped" ? "Not applied" : step.status}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="rm-snake-action-wrap">
                  <button
                    type="button"
                    disabled={subscriptionAccess.loading || !successful}
                    className={`rm-snake-action-btn ${
                      hasPremiumAccess ? "view" : "pay"
                    } ${subscriptionAccess.loading ? "disabled" : ""}`}
                    onClick={handleSummaryAction}
                  >
                    {subscriptionAccess.loading ? (
                      <Loader2 size={17} className="rm-spin" />
                    ) : (
                      <ActionIcon size={17} />
                    )}

                    <span>
                      {subscriptionAccess.loading
                        ? "Checking plan..."
                        : actionLabel}
                    </span>
                  </button>

                  <div className="rm-snake-plan-note">
                    {subscriptionAccess.loading
                      ? "Checking your subscription access..."
                      : hasPremiumAccess
                        ? `Your ${subscriptionAccess.plan} plan is active. You can view the matched search results.`
                        : "Basic, inactive, or missing subscription requires payment before viewing results."}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

const styles = `
  * {
    box-sizing: border-box;
  }

  .rm-snake-root {
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
    display: flex;
    align-items: stretch;
    justify-content: stretch;
    padding: 20px;
  }

  .rm-snake-stage {
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
    background: #f8fafc;
    border: 1px solid #e5e7eb;
    border-radius: 24px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 12px 32px rgba(15, 23, 42, 0.06);
  }

  .rm-snake-topbar {
    min-height: 98px;
    padding: 16px 20px;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    background: rgba(255, 255, 255, 0.9);
    flex-wrap: wrap;
    flex: 0 0 auto;
  }

  .rm-snake-topbar-left {
    min-width: 0;
    flex: 1 1 520px;
  }

  .rm-snake-kicker {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    font-weight: 700;
    color: #64748b;
    letter-spacing: 0.04em;
    flex-wrap: wrap;
  }

  .rm-snake-kicker-logo {
    display: block;
    flex: 0 0 auto;
  }

  .rm-snake-title {
    font-size: 24px;
    line-height: 1.15;
    font-weight: 800;
    color: #0f172a;
    margin-top: 4px;
  }

  .rm-snake-subtitle-row {
    margin-top: 10px;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    max-width: 100%;
  }

  .rm-snake-subtitle-text {
    font-size: 14px;
    color: #334155;
    overflow-wrap: anywhere;
    word-break: break-word;
  }

  .rm-snake-subtitle-mini {
    width: 24px;
    height: 24px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
  }

  .rm-snake-running-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    border-radius: 999px;
    background: #ffffff;
    border: 1px solid #dbeafe;
    color: #2563eb;
    font-size: 14px;
    font-weight: 700;
    white-space: nowrap;
    box-shadow: 0 4px 16px rgba(37, 99, 235, 0.08);
    flex: 0 0 auto;
  }

  .rm-spin {
    animation: rmspin 1s linear infinite;
  }

  .rm-done-icon {
    color: #16a34a;
  }

  .rm-snake-done-dot {
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: #22c55e;
    display: inline-block;
    box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.12);
  }

  .rm-snake-idle-dot {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    background: #cbd5e1;
    display: inline-block;
  }

  @keyframes rmspin {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }

  .rm-snake-layout {
    flex: 1 1 auto;
    min-height: 0;
    display: grid;
    grid-template-columns: 380px minmax(0, 1fr);
    overflow: hidden;
  }

  .rm-snake-left {
    padding: 22px 18px 18px 20px;
    border-right: 1px solid #e5e7eb;
    display: flex;
    flex-direction: column;
    min-height: 0;
    min-width: 0;
    overflow: hidden;
  }

  .rm-snake-checks {
    display: grid;
    gap: 12px;
    overflow-y: auto;
    overflow-x: hidden;
    padding-right: 6px;
    min-height: 0;
    max-height: 100%;
  }

  .rm-snake-check-item {
    border: 1px solid #e2e8f0;
    background: #ffffff;
    border-radius: 16px;
    padding: 12px;
    transition:
      border-color 0.2s ease,
      background-color 0.2s ease,
      box-shadow 0.2s ease;
  }

  .rm-snake-check-item.running {
    border-color: #bfdbfe;
    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.08);
  }

  .rm-snake-check-item.done {
    border-color: #bbf7d0;
    background: #f0fdf4;
  }

  .rm-snake-check-item.failed {
    border-color: #e2a39e;
    background: #fff1f2;
  }

  .rm-snake-check-main {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    min-width: 0;
  }

  .rm-snake-check-icon {
    width: 22px;
    height: 22px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #2563eb;
    flex: 0 0 22px;
    margin-top: 2px;
  }

  .rm-snake-check-content {
    flex: 1;
    min-width: 0;
  }

  .rm-snake-check-title-row {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    justify-content: space-between;
    min-width: 0;
  }

  .rm-snake-check-title {
    font-size: 13px;
    font-weight: 700;
    color: #0f172a;
    line-height: 1.35;
    word-break: break-word;
    overflow-wrap: anywhere;
  }

  .rm-snake-check-state {
    flex: 0 0 auto;
    width: 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .rm-snake-check-meta {
    margin-top: 8px;
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
    font-size: 12px;
    color: #64748b;
  }

  .rm-snake-groups-wrap {
    margin-top: 10px;
  }

  .rm-snake-toggle-btn {
    width: 100%;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: 0;
    background: transparent;
    padding: 0;
    cursor: pointer;
    color: #2563eb;
    font-size: 12px;
    font-weight: 800;
    text-align: left;
  }

  .rm-snake-groups-list {
    overflow: hidden;
    margin-top: 8px;
    border-top: 1px dashed #dbeafe;
    padding-top: 8px;
  }

  .rm-snake-group-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 6px 0;
    font-size: 12px;
    color: #334155;
  }

  .rm-snake-group-name {
    overflow-wrap: anywhere;
    word-break: break-word;
  }

  .rm-snake-group-count {
    font-weight: 800;
    color: #0f172a;
    white-space: nowrap;
  }

  .rm-snake-progress-wrap {
    margin-top: auto;
    padding-top: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
  }

  .rm-snake-progress-ring {
    width: 160px;
    height: 160px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    will-change: background;
    flex: 0 0 auto;
  }

  .rm-snake-progress-hole {
    width: 128px;
    height: 128px;
    border-radius: 50%;
    background: #f8fafc;
    border: 1px solid #e5e7eb;
    display: grid;
    place-items: center;
  }

  .rm-snake-progress-value {
    font-size: 28px;
    font-weight: 800;
    color: #0f172a;
  }

  .rm-snake-main {
    min-width: 0;
    min-height: 0;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 18px;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .rm-snake-card-shell {
    width: 100%;
    max-width: 760px;
    height: clamp(280px, 42vh, 430px);
    min-height: 280px;
    max-height: 430px;
    margin: 0 auto;
    position: relative;
    flex: 0 0 auto;
    display: block;
    overflow: hidden;
  }

  .rm-snake-card {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border-radius: 24px;
    overflow: hidden;
    background: #dbeafe;
    box-shadow: 0 18px 34px rgba(15, 23, 42, 0.12);
    transform: none !important;
    scale: 1 !important;
    will-change: opacity;
  }

  .rm-snake-card-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transform: none !important;
    scale: 1 !important;
    max-width: 100%;
    max-height: 100%;
  }

  .rm-snake-card-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      rgba(2, 6, 23, 0.04) 0%,
      rgba(2, 6, 23, 0.42) 100%
    );
  }

  .rm-snake-card-meta {
    position: absolute;
    left: 18px;
    right: 18px;
    bottom: 18px;
    z-index: 1;
    color: white;
  }

  .rm-snake-card-percent {
    font-size: 24px;
    font-weight: 800;
    line-height: 1;
    margin-bottom: 8px;
  }

  .rm-snake-card-title {
    font-size: 18px;
    font-weight: 700;
    max-width: 100%;
    overflow-wrap: anywhere;
    word-break: break-word;
  }

  .rm-snake-summary-card {
    width: 100%;
    max-width: 760px;
    margin: 0 auto;
    border-radius: 24px;
    background: #fff;
    border: 1px solid #e2e8f0;
    box-shadow: 0 18px 34px rgba(15, 23, 42, 0.08);
    padding: 20px;
    flex: 0 0 auto;
  }

  .rm-snake-summary-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 18px;
    flex-wrap: wrap;
  }

  .rm-snake-summary-title {
    font-size: 20px;
    font-weight: 800;
    color: #0f172a;
  }

  .rm-snake-summary-badge {
    padding: 8px 12px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 800;
  }

  .rm-snake-summary-badge.running {
    background: #eff6ff;
    color: #2563eb;
  }

  .rm-snake-summary-badge.done {
    background: #f0fdf4;
    color: #15803d;
  }

  .rm-snake-summary-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
  }

  .rm-snake-summary-box {
    border: 1px solid #e2e8f0;
    border-radius: 18px;
    padding: 14px;
    background: #f8fafc;
    min-width: 0;
  }

  .rm-snake-summary-box-title {
    font-size: 12px;
    font-weight: 700;
    color: #64748b;
  }

  .rm-snake-summary-box-value {
    margin-top: 8px;
    font-size: 24px;
    font-weight: 900;
    color: #0f172a;
  }

  .rm-snake-summary-box-sub {
    margin-top: 6px;
    font-size: 12px;
    color: #64748b;
  }

  .rm-snake-action-wrap {
    margin-top: 18px;
    padding-top: 18px;
    border-top: 1px solid #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    flex-wrap: wrap;
  }

  .rm-snake-action-btn {
    border: 0;
    outline: none;
    cursor: pointer;
    min-height: 44px;
    padding: 11px 18px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 900;
    transition:
      transform 0.18s ease,
      box-shadow 0.18s ease,
      opacity 0.18s ease;
  }

  .rm-snake-action-btn:hover {
    transform: translateY(-1px);
  }

  .rm-snake-action-btn.disabled {
    cursor: not-allowed;
    opacity: 0.7;
    transform: none;
  }

  .rm-snake-action-btn.view {
    color: #ffffff;
    background: linear-gradient(135deg, #2563eb, #0ea5e9);
    box-shadow: 0 12px 24px rgba(37, 99, 235, 0.22);
  }

  .rm-snake-action-btn.pay {
    color: #ffffff;
    background: linear-gradient(135deg, #0f172a, #334155);
    box-shadow: 0 12px 24px rgba(15, 23, 42, 0.22);
  }

  .rm-snake-plan-note {
    flex: 1 1 260px;
    font-size: 12px;
    color: #64748b;
    line-height: 1.45;
  }

  .rm-intelligence-shell {
    position: relative;
    width: 100%;
    max-width: 900px;
    height: clamp(340px, 52vh, 520px);
    min-height: 340px;
    margin: 0 auto;
    padding: 1px;
    overflow: hidden;
    border-radius: 30px;
    background: linear-gradient(135deg, rgba(56,189,248,.9), rgba(37,99,235,.12) 32%, rgba(139,92,246,.45) 68%, rgba(34,211,238,.8));
    box-shadow: 0 30px 80px rgba(2,6,23,.24), 0 0 60px rgba(14,165,233,.08);
  }

  .rm-intelligence-card {
    position: relative;
    isolation: isolate;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 29px;
    background: #020617;
  }

  .rm-intelligence-image,
  .rm-intelligence-vignette,
  .rm-intelligence-grid,
  .rm-intelligence-scan {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .rm-intelligence-image { z-index: -4; object-fit: cover; will-change: transform; }
  .rm-intelligence-vignette {
    z-index: -3;
    background: radial-gradient(circle at 72% 38%, transparent 0%, rgba(2,6,23,.15) 35%, rgba(2,6,23,.78) 100%), linear-gradient(90deg, rgba(2,6,23,.88), rgba(2,6,23,.54) 48%, rgba(2,6,23,.14));
  }
  .rm-intelligence-grid {
    z-index: -2;
    opacity: .16;
    background-image: linear-gradient(rgba(125,211,252,.18) 1px, transparent 1px), linear-gradient(90deg, rgba(125,211,252,.18) 1px, transparent 1px);
    background-size: 42px 42px;
    mask-image: linear-gradient(to right, black, transparent 80%);
  }
  .rm-intelligence-scan {
    z-index: -1;
    top: -30%;
    height: 25%;
    pointer-events: none;
    background: linear-gradient(to bottom, transparent, rgba(56,189,248,.12), rgba(125,211,252,.28), transparent);
    animation: rm-intelligence-scan 5.5s ease-in-out infinite;
  }

  @keyframes rm-intelligence-scan {
    0% { top: -30%; opacity: 0; }
    15% { opacity: 1; }
    85% { opacity: .8; }
    100% { top: 110%; opacity: 0; }
  }

  .rm-intelligence-topbar {
    position: absolute;
    top: 24px;
    right: 24px;
    left: 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }
  .rm-intelligence-live,
  .rm-intelligence-step {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    padding: 9px 13px;
    border: 1px solid rgba(186,230,253,.24);
    border-radius: 999px;
    background: rgba(2,6,23,.48);
    backdrop-filter: blur(16px);
    color: #e0f2fe;
    font-size: 10px;
    font-weight: 900;
    letter-spacing: .12em;
  }
  .rm-intelligence-live-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #38bdf8;
    box-shadow: 0 0 0 4px rgba(56,189,248,.12), 0 0 16px rgba(56,189,248,.9);
  }
  .rm-intelligence-step span { color: rgba(224,242,254,.45); }

  .rm-intelligence-center {
    position: absolute;
    top: 50%;
    right: 12%;
    width: 170px;
    height: 170px;
    transform: translateY(-50%);
    opacity: .55;
  }
  .rm-intelligence-orbit {
    position: relative;
    width: 100%;
    height: 100%;
    border: 1px solid rgba(125,211,252,.42);
    border-radius: 50%;
    box-shadow: inset 0 0 32px rgba(14,165,233,.12), 0 0 32px rgba(14,165,233,.08);
  }
  .rm-intelligence-orbit::before,
  .rm-intelligence-orbit::after {
    position: absolute;
    content: "";
    border: 1px dashed rgba(125,211,252,.38);
    border-radius: 50%;
  }
  .rm-intelligence-orbit::before { inset: 20px; }
  .rm-intelligence-orbit::after { inset: 46px; }
  .rm-intelligence-orbit span {
    position: absolute;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #7dd3fc;
    box-shadow: 0 0 16px #38bdf8;
  }
  .rm-intelligence-orbit span:nth-child(1) { top: 7px; left: 50%; }
  .rm-intelligence-orbit span:nth-child(2) { right: 12px; bottom: 37px; }
  .rm-intelligence-orbit span:nth-child(3) { bottom: 24px; left: 18px; }

  .rm-intelligence-content {
    position: absolute;
    right: 34px;
    bottom: 38px;
    left: 34px;
    display: flex;
    align-items: flex-end;
    gap: 22px;
    color: white;
  }
  .rm-intelligence-progress-value {
    display: flex;
    align-items: flex-start;
    min-width: 94px;
    font-size: clamp(46px, 7vw, 78px);
    font-weight: 900;
    line-height: .8;
    letter-spacing: -.07em;
    text-shadow: 0 8px 30px rgba(2,6,23,.42);
  }
  .rm-intelligence-progress-value small { margin: 4px 0 0 4px; color: #7dd3fc; font-size: 17px; letter-spacing: 0; }
  .rm-intelligence-copy { max-width: 540px; padding-left: 22px; border-left: 1px solid rgba(186,230,253,.32); }
  .rm-intelligence-eyebrow { color: #7dd3fc; font-size: 10px; font-weight: 900; letter-spacing: .14em; text-transform: uppercase; }
  .rm-intelligence-copy h2 { margin: 7px 0 8px; color: white; font-size: clamp(22px, 3vw, 38px); line-height: 1.04; letter-spacing: -.035em; }
  .rm-intelligence-copy p { max-width: 490px; margin: 0; color: rgba(224,242,254,.78); font-size: 13px; line-height: 1.55; }

  .rm-intelligence-progress { position: absolute; right: 0; bottom: 0; left: 0; height: 4px; overflow: hidden; background: rgba(255,255,255,.12); }
  .rm-intelligence-progress-fill { height: 100%; background: linear-gradient(90deg, #2563eb, #38bdf8, #a5f3fc); box-shadow: 0 0 20px rgba(56,189,248,.9); }
  .rm-intelligence-progress-glow { position: absolute; top: -5px; width: 28px; height: 14px; border-radius: 50%; background: #e0f2fe; filter: blur(8px); }

  .rm-intelligence-corner { position: absolute; width: 25px; height: 25px; opacity: .72; pointer-events: none; }
  .rm-intelligence-corner.top-left { top: 17px; left: 17px; border-top: 2px solid #7dd3fc; border-left: 2px solid #7dd3fc; }
  .rm-intelligence-corner.top-right { top: 17px; right: 17px; border-top: 2px solid #7dd3fc; border-right: 2px solid #7dd3fc; }
  .rm-intelligence-corner.bottom-left { bottom: 17px; left: 17px; border-bottom: 2px solid #7dd3fc; border-left: 2px solid #7dd3fc; }
  .rm-intelligence-corner.bottom-right { right: 17px; bottom: 17px; border-right: 2px solid #7dd3fc; border-bottom: 2px solid #7dd3fc; }

  @media (max-width: 980px) {
    .rm-snake-layout {
      grid-template-columns: 1fr;
      overflow-y: auto;
    }

    .rm-snake-left {
      border-right: 0;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 20px;
      overflow: visible;
    }

    .rm-snake-checks {
      max-height: 360px;
    }

    .rm-snake-main {
      padding-top: 16px;
      overflow: visible;
    }

    .rm-snake-summary-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .rm-snake-card-shell {
      height: 260px;
      min-height: 260px;
      max-height: 260px;
    }
  }

  @media (max-width: 640px) {
    .rm-snake-root {
      padding: 10px;
    }

    .rm-snake-title {
      font-size: 20px;
    }

    .rm-snake-summary-grid {
      grid-template-columns: 1fr;
    }

    .rm-snake-card-shell {
      height: 210px;
      min-height: 210px;
      max-height: 210px;
    }

    .rm-snake-action-btn {
      width: 100%;
    }

    .rm-intelligence-shell { height: 360px; min-height: 360px; border-radius: 22px; }
    .rm-intelligence-card { border-radius: 21px; }
    .rm-intelligence-center { display: none; }
    .rm-intelligence-topbar { top: 18px; right: 18px; left: 18px; }
    .rm-intelligence-content { right: 22px; bottom: 30px; left: 22px; align-items: flex-start; flex-direction: column; gap: 16px; }
    .rm-intelligence-copy { padding: 0; border: 0; }
    .rm-intelligence-copy p { display: none; }
  }

  @media (prefers-reduced-motion: reduce) {
    .rm-intelligence-scan { display: none; }
    .rm-intelligence-image,
    .rm-intelligence-orbit { animation: none !important; transition: none !important; }
  }
`;