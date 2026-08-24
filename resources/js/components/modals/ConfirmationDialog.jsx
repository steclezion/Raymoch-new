import React, { useEffect, useRef } from "react";
import { AlertTriangle, X } from "lucide-react";
import "./confirmationDialog.css";

export default function ConfirmationDialog({
  open,
  title = "Please confirm",
  message = "Are you sure you want to continue?",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "danger",
  onConfirm,
  onCancel,
}) {
  const cancelButtonRef = useRef(null);
  const previousActiveElementRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    previousActiveElementRef.current = document.activeElement;

    const focusTimer = window.setTimeout(() => {
      cancelButtonRef.current?.focus();
    }, 0);

    const handleKeyDown = (event) => {
      if (event.key !== "Escape") return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation?.();
      onCancel?.();
    };

    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown, true);
      previousActiveElementRef.current?.focus?.();
    };
  }, [open, onCancel]);

  if (!open) return null;

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onCancel?.();
    }
  };

  return (
    <div
      className="vr-confirmOverlay"
      role="presentation"
      onMouseDown={handleBackdropClick}
    >
      <section
        className={`vr-confirmDialog vr-confirmDialog--${tone}`}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="vr-confirm-title"
        aria-describedby="vr-confirm-message"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="vr-confirmClose"
          aria-label="Close confirmation"
          onClick={onCancel}
        >
          <X size={18} />
        </button>

        <div className="vr-confirmIcon" aria-hidden="true">
          <AlertTriangle size={26} />
        </div>

        <div className="vr-confirmContent">
          <h3 id="vr-confirm-title">{title}</h3>
          <p id="vr-confirm-message">{message}</p>
        </div>

        <div className="vr-confirmActions">
          <button
            ref={cancelButtonRef}
            type="button"
            className="vr-confirmButton vr-confirmButton--secondary"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            className={`vr-confirmButton vr-confirmButton--${tone}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}