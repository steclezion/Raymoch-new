import React, {
  useEffect,
  useId,
  useRef,
} from "react";
import { createPortal } from "react-dom";

/**
 * Reusable accessible modal wrapper.
 *
 * The main preference modal uses level 0.
 * The results and history modals use level 1 so that
 * they are displayed above the preference modal.
 */
export default function ModalShell({
  open,
  title,
  subtitle = "",
  onClose,
  children,
  footer = null,
  size = "xl",
  level = 0,
  closeOnBackdrop = false,
  closeOnEscape = true,
  lockBody = level === 0,
}) {
  const generatedId = useId();
  const dialogRef = useRef(null);

  const titleId = `modal-title-${generatedId.replace(
    /:/g,
    "",
  )}`;

  /*
   * Place keyboard focus inside the modal when it opens.
   * Return focus to the previous element when it closes.
   */
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previouslyFocusedElement =
      document.activeElement;

    const animationFrame = window.requestAnimationFrame(
      () => {
        const firstFocusableElement =
          dialogRef.current?.querySelector(
            [
              "button:not([disabled])",
              "input:not([disabled])",
              "select:not([disabled])",
              "textarea:not([disabled])",
              '[tabindex]:not([tabindex="-1"])',
            ].join(","),
          );

        if (firstFocusableElement) {
          firstFocusableElement.focus();
        } else {
          dialogRef.current?.focus();
        }
      },
    );

    return () => {
      window.cancelAnimationFrame(animationFrame);

      if (
        previouslyFocusedElement &&
        typeof previouslyFocusedElement.focus ===
          "function"
      ) {
        previouslyFocusedElement.focus();
      }
    };
  }, [open]);

  /*
   * Close the current top modal when Escape is pressed.
   */
  useEffect(() => {
    if (!open || !closeOnEscape) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [open, closeOnEscape, onClose]);

  /*
   * Prevent the page behind the main modal from scrolling.
   *
   * Child modals do not need another body lock because the
   * main preference modal already owns the lock.
   */
  useEffect(() => {
    if (!open || !lockBody) {
      return undefined;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [open, lockBody]);

  if (!open || typeof document === "undefined") {
    return null;
  }

  const handleBackdropMouseDown = (event) => {
    if (
      closeOnBackdrop &&
      event.target === event.currentTarget
    ) {
      onClose?.();
    }
  };

  return createPortal(
    <div
      className={`matching-modal-layer matching-modal-level-${level}`}
      style={{ zIndex: 1100 + level * 30 }}
      onMouseDown={handleBackdropMouseDown}
    >
      <section
        ref={dialogRef}
        className={`matching-modal-panel matching-modal-panel--${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <header className="matching-modal-header">
          <div>
            <h2
              id={titleId}
              className="matching-modal-title"
            >
              {title}
            </h2>

            {subtitle ? (
              <p className="matching-modal-subtitle">
                {subtitle}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            className="matching-modal-close"
            onClick={onClose}
            aria-label={`Close ${title}`}
          >
            ×
          </button>
        </header>

        <div className="matching-modal-body">
          {children}
        </div>

        {footer ? (
          <footer className="matching-modal-footer">
            {footer}
          </footer>
        ) : null}
      </section>
    </div>,
    document.body,
  );
}