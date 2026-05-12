import React, { useEffect, useMemo, useRef, useState } from "react";
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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const label = normalizeStepLabel(step.key, step.label);

  if (step.key === "keyword") {
    return `Search in progress...(Exact or Similar): ${label}`;
  }

  return `${meta.title}: ${label}`;
}

function getCsrfToken() {
  return document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");
}

export default function SnakeSearchLoading({
  token,
  open = false,
  onComplete,
  onViewResults,
  onPayToView,
}) {
  const [statusData, setStatusData] = useState(null);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isPolling, setIsPolling] = useState(false);
  const [expandedSteps, setExpandedSteps] = useState({});
  const [subscriptionAccess, setSubscriptionAccess] = useState({
    loading: true,
    can_view: false,
    plan: null,
    status: null,
    message: "",
  });

  const completeCalledRef = useRef(false);

  const progress = Number(statusData?.meta?.progress_percent ?? 0);
  const activeStepKey = statusData?.meta?.active_step || "keyword";

  const hasPremiumAccess = Boolean(subscriptionAccess.can_view);
  const actionLabel = hasPremiumAccess ? "View" : "Pay to view";
  const ActionIcon = hasPremiumAccess ? Eye : CreditCard;

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
    const label = normalizeStepLabel(currentStep.key, currentStep.label);

    return {
      title:
        currentStep.key === "keyword"
          ? `Exact or Similar: ${label}`
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
        const response = await fetch("subscription/access", {
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

  useEffect(() => {
    if (!open || !token) return;

    let mounted = true;
    let pollTimer = null;

    completeCalledRef.current = false;

    const fetchStatus = async () => {
      try {
        if (!mounted) return;

        setIsPolling(true);

        const response = await fetch(`/api/main-search-engine/status/${token}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          credentials: "same-origin",
        });

        const json = await response.json();

        if (!mounted) return;

        if (response.ok && json?.ok && json?.data) {
          setStatusData(json.data);

          if (json.data?.meta?.is_completed) {
            clearInterval(pollTimer);

            if (!completeCalledRef.current && typeof onComplete === "function") {
              completeCalledRef.current = true;
              onComplete(json.data);
            }
          }
        }
      } catch (error) {
        console.error("Search status polling failed:", error);
      } finally {
        if (mounted) {
          setIsPolling(false);
        }
      }
    };

    fetchStatus();
    pollTimer = setInterval(fetchStatus, 700);

    return () => {
      mounted = false;
      clearInterval(pollTimer);
    };
  }, [open, token, onComplete]);

  useEffect(() => {
    let frameId;

    const animate = () => {
      setDisplayProgress((prev) => {
        const diff = progress - prev;

        if (Math.abs(diff) < 0.2) {
          return progress;
        }

        return prev + diff * 0.12;
      });

      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, [progress]);

  const smoothProgress = Math.round(displayProgress);

  const toggleStep = (key) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSummaryAction = () => {
    if (subscriptionAccess.loading) return;

    if (hasPremiumAccess) {
      if (typeof onViewResults === "function") {
        onViewResults(statusData);
        return;
      }

      window.location.href = "/search/results";
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
                {smoothProgress >= 100
                  ? "Search Completed"
                  : "Search in progress"}
              </div>

              <div className="rm-snake-subtitle-row">
                <div className="rm-snake-subtitle-text">
                  Search in progress...(Exact or Similar):{" "}
                  <strong>{keywordLabel}</strong>
                </div>

                <div className="rm-snake-subtitle-mini">
                  {smoothProgress >= 100 ? (
                    <CheckCircle2 size={14} className="rm-done-icon" />
                  ) : (
                    <Loader2 size={14} className="rm-spin" />
                  )}
                </div>
              </div>
            </div>

            <div className="rm-snake-running-pill">
              {smoothProgress >= 100 ? (
                <>
                  <span className="rm-snake-done-dot" />
                  <span>Search complete</span>
                </>
              ) : (
                <>
                  <Loader2 size={15} className="rm-spin" />
                  <span>{isPolling ? "Search running" : "Search running"}</span>
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
                  const isRunning = step.status === "running";
                  const isDone = step.status === "done";
                  const hasGroups = step.grouped_results.length > 0;
                  const isExpanded = !!expandedSteps[step.key];

                  return (
                    <div
                      key={step.key}
                      className={`rm-snake-check-item ${
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
                              <strong>{Number(step.found_count || 0)}</strong>
                            </span>
                            <span>
                              Time:{" "}
                              <strong>{Number(step.elapsed_ms || 0)} ms</strong>
                            </span>
                          </div>

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
              <div className="rm-snake-card-shell">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activeCard.title}-${activeCard.image}`}
                    className="rm-snake-card"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      opacity: { duration: 0.5, ease: "easeInOut" },
                    }}
                  >
                    <img
                      src={activeCard.image}
                      alt={activeCard.title}
                      className="rm-snake-card-image"
                    />

                    <div className="rm-snake-card-overlay" />

                    <div className="rm-snake-card-meta">
                      <div className="rm-snake-card-percent">
                        {smoothProgress}%
                      </div>
                      <div className="rm-snake-card-title">
                        {activeCard.title}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="rm-snake-summary-card">
                <div className="rm-snake-summary-top">
                  <div className="rm-snake-summary-title">
                    Live Search Monitor
                  </div>

                  <div
                    className={`rm-snake-summary-badge ${
                      smoothProgress >= 100 ? "done" : "running"
                    }`}
                  >
                    {smoothProgress >= 100 ? "Finished" : "Running"}
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
                          {Number(step.found_count || 0)}
                        </div>
                        <div className="rm-snake-summary-box-sub">
                          {step.status === "running"
                            ? "Searching..."
                            : step.status === "done"
                              ? "Completed"
                              : "Waiting"}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="rm-snake-action-wrap">
                  <button
                    type="button"
                    disabled={subscriptionAccess.loading}
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
  }
`;