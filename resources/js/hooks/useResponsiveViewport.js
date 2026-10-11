import { useEffect, useMemo, useRef, useState } from "react";

export const VIEWPORT_BREAKPOINTS = Object.freeze({
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
});

function breakpointFor(width) {
  if (width >= VIEWPORT_BREAKPOINTS.xl) return "xl";
  if (width >= VIEWPORT_BREAKPOINTS.lg) return "lg";
  if (width >= VIEWPORT_BREAKPOINTS.md) return "md";
  if (width >= VIEWPORT_BREAKPOINTS.sm) return "sm";
  return "xs";
}

function readViewport(mobileBreakpoint) {
  if (typeof window === "undefined") {
    return {
      width: VIEWPORT_BREAKPOINTS.lg,
      height: 800,
      breakpoint: "lg",
      orientation: "landscape",
      isMobile: false,
    };
  }

  const width = Math.round(window.visualViewport?.width || window.innerWidth);
  const height = Math.round(window.visualViewport?.height || window.innerHeight);

  return {
    width,
    height,
    breakpoint: breakpointFor(width),
    orientation: width >= height ? "landscape" : "portrait",
    isMobile: width < mobileBreakpoint,
  };
}

/**
 * Monitors live browser resizing for components that cannot rely on a parent
 * responsive context. Updates are limited to one per animation frame.
 */
export default function useResponsiveViewport({
  mobileBreakpoint = VIEWPORT_BREAKPOINTS.md,
} = {}) {
  const [viewport, setViewport] = useState(() => readViewport(mobileBreakpoint));
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const updateViewport = () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = window.requestAnimationFrame(() => {
        const nextViewport = readViewport(mobileBreakpoint);

        setViewport((current) => {
          if (
            current.width === nextViewport.width &&
            current.height === nextViewport.height &&
            current.breakpoint === nextViewport.breakpoint &&
            current.orientation === nextViewport.orientation &&
            current.isMobile === nextViewport.isMobile
          ) {
            return current;
          }

          return nextViewport;
        });

        const root = document.documentElement;
        root.dataset.headerViewport = nextViewport.breakpoint;
        root.style.setProperty("--header-viewport-width", `${nextViewport.width}px`);
        root.style.setProperty("--header-viewport-height", `${nextViewport.height}px`);
        animationFrameRef.current = null;
      });
    };

    updateViewport();
    window.addEventListener("resize", updateViewport, { passive: true });
    window.addEventListener("orientationchange", updateViewport, { passive: true });
    window.visualViewport?.addEventListener("resize", updateViewport, { passive: true });

    return () => {
      window.removeEventListener("resize", updateViewport);
      window.removeEventListener("orientationchange", updateViewport);
      window.visualViewport?.removeEventListener("resize", updateViewport);

      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }

      const root = document.documentElement;
      delete root.dataset.headerViewport;
      root.style.removeProperty("--header-viewport-width");
      root.style.removeProperty("--header-viewport-height");
    };
  }, [mobileBreakpoint]);

  return useMemo(
    () => ({ ...viewport, breakpoints: VIEWPORT_BREAKPOINTS }),
    [viewport],
  );
}
