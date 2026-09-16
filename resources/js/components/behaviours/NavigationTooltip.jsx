

import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "../../styles/navigation-tooltip.css";

const GAP = 9;

export default function NavigationTooltip({
  children,
  className = "",
  placement = "top",
}) {
  const markerRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ left: 0, top: 0, placement });

  const updatePosition = useCallback(() => {
    const host = markerRef.current?.parentElement;
    if (!host) return;

    const rect = host.getBoundingClientRect();
    const useBottom = placement === "bottom" || (placement === "top" && rect.top < 56);
    const center = rect.left + rect.width / 2;
    const horizontalInset = Math.min(132, Math.max(12, window.innerWidth / 2 - 12));

    setPosition({
      left: Math.min(
        Math.max(center, horizontalInset),
        window.innerWidth - horizontalInset,
      ),
      top: useBottom ? rect.bottom + GAP : rect.top - GAP,
      placement: useBottom ? "bottom" : "top",
    });
  }, [placement]);

  useEffect(() => {
    const host = markerRef.current?.parentElement;
    if (!host) return undefined;

    const show = () => {
      updatePosition();
      setVisible(true);
    };
    const hide = () => setVisible(false);

    host.addEventListener("mouseenter", show);
    host.addEventListener("mouseleave", hide);
    host.addEventListener("focusin", show);
    host.addEventListener("focusout", hide);

    return () => {
      host.removeEventListener("mouseenter", show);
      host.removeEventListener("mouseleave", hide);
      host.removeEventListener("focusin", show);
      host.removeEventListener("focusout", hide);
    };
  }, [updatePosition]);

  useEffect(() => {
    if (!visible) return undefined;

    const reposition = () => updatePosition();
    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);

    return () => {
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
    };
  }, [visible, updatePosition]);

  return (
    <>
      <span ref={markerRef} className="ray-navigation-tooltip-marker" aria-hidden="true" />
      {visible && typeof document !== "undefined"
        ? createPortal(
            <span
              className={`ray-navigation-tooltip is-${position.placement} ${className}`.trim()}
              style={{ left: position.left, top: position.top }}
              role="tooltip"
            >
              {children}
            </span>,
            document.body,
          )
        : null}
    </>
  );
}
