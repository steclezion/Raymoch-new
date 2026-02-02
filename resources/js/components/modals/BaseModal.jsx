// resources/js/components/services/modals/BaseModal.jsx
import React, { useEffect, useRef } from "react";
import "./baseModal.css";

export default function BaseModal({
  open,
  onClose,
  title,
  subtitle,
  children,
  hideFooter = false,
  footerRight = null,
}) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose?.();
        return;
      }

      // Focus trap
      if (e.key === "Tab" && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);

    // autofocus close button
    setTimeout(() => {
      const btn = modalRef.current?.querySelector("[data-autofocus='true']");
      btn?.focus?.();
    }, 0);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="rm-overlay"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="rm-modal" role="dialog" aria-modal="true" aria-labelledby="rmTitle" ref={modalRef}>
        <div className="rm-header">
          <div className="rm-title">
            <h3 id="rmTitle">{title || "Service"}</h3>
            {subtitle ? <div className="rm-sub">{subtitle}</div> : null}
          </div>

          <button type="button" className="rm-close" onClick={onClose} data-autofocus="true" aria-label="Close">
            ✕
          </button>
        </div>

        <div className="rm-body">{children}</div>

        {!hideFooter && (
          <div className="rm-footer">
            <button type="button" className="rm-btn" onClick={onClose}>
              Back
            </button>
            <div>{footerRight}</div>
          </div>
        )}
      </div>
    </div>
  );
}
