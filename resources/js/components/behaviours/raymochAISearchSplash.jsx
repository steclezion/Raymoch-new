import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import "../../styles/raymoch-ai-search-splash.css";

const BRAND_ICON_URL = "/images/logo_preview_exact.svg";

export default function RaymochAISearchSplash({
  open,
  duration = 6000,
  onReady,
}) {
  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    const backgroundSurfaces = Array.from(document.body.children).filter(
      (element) => !element.hasAttribute("data-raymoch-search-splash"),
    );
    const previousState = backgroundSurfaces.map((element) => ({
      element,
      inert: element.inert,
      ariaHidden: element.getAttribute("aria-hidden"),
    }));

    document.body.style.overflow = "hidden";
    backgroundSurfaces.forEach((element) => {
      element.inert = true;
      element.setAttribute("aria-hidden", "true");
    });

    const timer = window.setTimeout(() => onReady?.(), duration);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
      previousState.forEach(({ element, inert, ariaHidden }) => {
        element.inert = inert;
        if (ariaHidden == null) element.removeAttribute("aria-hidden");
        else element.setAttribute("aria-hidden", ariaHidden);
      });
    };
  }, [duration, onReady, open]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="ray-ai-search-splash"
      data-raymoch-search-splash="true"
      role="status"
      aria-live="polite"
      aria-label="Raymoch is preparing your search"
    >
      <div className="ray-ai-search-splash__space" aria-hidden="true" />
      <div className="ray-ai-search-splash__focus">
        <img src={BRAND_ICON_URL} alt="Raymoch" />
        <span>Preparing your search</span>
      </div>
    </div>,
    document.body,
  );
}
