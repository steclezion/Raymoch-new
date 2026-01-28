// resources/js/components/ResponsiveController.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * ResponsiveController
 * ---------------------------------------------------------
 * A small "JSX controller" that:
 * 1) Exposes a responsive state (breakpoints, width/height, orientation)
 * 2) Adds a safe CSS "vh" fix for mobile browsers (iOS/Android address bar)
 * 3) Adds a CSS class to <html> for each breakpoint (xs/sm/md/lg/xl)
 * 4) Optionally locks body scrolling when a menu/drawer is open
 * 5) Provides a simple Context + hook for any component to use
 *
 * Usage:
 *  - Wrap your page/app:
 *      <ResponsiveController>
 *         <Entire />
 *      </ResponsiveController>
 *
 *  - Inside components:
 *      const { bp, isMobile, width, height, reducedMotion } = useResponsive();
 */

const ResponsiveContext = React.createContext(null);

const BREAKPOINTS = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
};

function getBreakpoint(w) {
  if (w >= BREAKPOINTS.xl) return "xl";
  if (w >= BREAKPOINTS.lg) return "lg";
  if (w >= BREAKPOINTS.md) return "md";
  if (w >= BREAKPOINTS.sm) return "sm";
  return "xs";
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

/**
 * Optional: Provide a smooth "layout safety" function that can be used
 * to scroll to anchors without being hidden behind sticky headers.
 */
function safeScrollToId(id, offsetPx = 72) {
  const el = document.getElementById(id);
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const top = rect.top + window.scrollY - offsetPx;
  window.scrollTo({ top, behavior: "smooth" });
}

export function ResponsiveController({
  children,
  headerOffsetPx = 72, // sticky header height used for safe anchor scrolling
  lockScrollWhen = false, // set true to lock scroll (e.g., when mobile drawer open)
  exposeToWindow = true, // helpful for debugging
}) {
  const [state, setState] = useState(() => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1200;
    const h = typeof window !== "undefined" ? window.innerHeight : 800;
    const bp = getBreakpoint(w);
    return {
      width: w,
      height: h,
      bp,
      orientation: w >= h ? "landscape" : "portrait",
      isMobile: bp === "xs" || bp === "sm",
      reducedMotion: false,
      dpr: typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1,
      scrollbarWidth: 0,
    };
  });

  const rafRef = useRef(null);

  // Detect reduced motion
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const updateRM = () => {
      setState((s) => ({ ...s, reducedMotion: !!mq?.matches }));
    };
    updateRM();

    if (!mq?.addEventListener) {
      mq?.addListener?.(updateRM);
      return () => mq?.removeListener?.(updateRM);
    }
    mq.addEventListener("change", updateRM);
    return () => mq.removeEventListener("change", updateRM);
  }, []);

  // Compute scrollbar width (useful if you ever lock body scroll)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const sw = window.innerWidth - document.documentElement.clientWidth;
    setState((s) => ({ ...s, scrollbarWidth: clamp(sw, 0, 40) }));
  }, []);

  // Core: Resize listener (debounced with RAF)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const onResize = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const bp = getBreakpoint(w);

        setState((s) => ({
          ...s,
          width: w,
          height: h,
          bp,
          orientation: w >= h ? "landscape" : "portrait",
          isMobile: bp === "xs" || bp === "sm",
          dpr: window.devicePixelRatio || 1,
        }));

        // Mobile 100vh fix: set --vh to actual viewport height
        // Use CSS: height: calc(var(--vh, 1vh) * 100);
        const vh = h * 0.01;
        document.documentElement.style.setProperty("--vh", `${vh}px`);

        // Add breakpoint class to <html>
        const root = document.documentElement;
        root.classList.remove("bp-xs", "bp-sm", "bp-md", "bp-lg", "bp-xl");
        root.classList.add(`bp-${bp}`);
      });
    };

    onResize(); // initial
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("orientationchange", onResize, { passive: true });

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Optional: lock body scroll (for drawers/menus)
  useEffect(() => {
    if (typeof document === "undefined") return;

    if (!lockScrollWhen) {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      return;
    }

    // preserve layout when scrollbar disappears
    document.body.style.overflow = "hidden";
    const sw = state.scrollbarWidth || 0;
    if (sw > 0) document.body.style.paddingRight = `${sw}px`;

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [lockScrollWhen, state.scrollbarWidth]);

  // Expose helper to window (optional)
  useEffect(() => {
    if (!exposeToWindow || typeof window === "undefined") return;
    window.__RESPONSIVE__ = {
      ...state,
      safeScrollToId: (id) => safeScrollToId(id, headerOffsetPx),
    };
    return () => {
      // keep it clean
      try {
        delete window.__RESPONSIVE__;
      } catch {}
    };
  }, [exposeToWindow, state, headerOffsetPx]);

  const value = useMemo(() => {
    return {
      ...state,
      breakpoints: BREAKPOINTS,
      safeScrollToId: (id) => safeScrollToId(id, headerOffsetPx),
    };
  }, [state, headerOffsetPx]);

  return (
    <ResponsiveContext.Provider value={value}>
      {children}
    </ResponsiveContext.Provider>
  );
}

export function useResponsive() {
  const ctx = React.useContext(ResponsiveContext);
  if (!ctx) {
    // Fail-safe: return minimal values so components don't crash.
    return {
      width: typeof window !== "undefined" ? window.innerWidth : 1200,
      height: typeof window !== "undefined" ? window.innerHeight : 800,
      bp: typeof window !== "undefined" ? getBreakpoint(window.innerWidth) : "lg",
      orientation: "landscape",
      isMobile: false,
      reducedMotion: false,
      dpr: 1,
      breakpoints: BREAKPOINTS,
      safeScrollToId: () => {},
    };
  }
  return ctx;
}
