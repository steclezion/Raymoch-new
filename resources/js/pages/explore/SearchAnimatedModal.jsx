import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import SnakeSearchLoading from "./SnakeSearchLoading";

export default function SearchAnimatedModal({
  open = false,
  token = "",
  onComplete = () => {},
  onClose = () => {},
}) {
  return (
    <>
      <style>{styles}</style>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="rm-search-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <motion.div
              className="rm-search-modal-shell"
              initial={{ opacity: 0, scale: 0.985, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.985, y: 10 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              role="dialog"
              aria-modal="true"
              aria-label="Search progress dialog"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="rm-search-modal-close"
                onClick={onClose}
                aria-label="Close search dialog"
              >
                ×
              </button>

              <div className="rm-search-modal-scroll">
                <div className="rm-search-modal-body">
                  <SnakeSearchLoading
                    open={Boolean(open)}
                    token={token || ""}
                    onComplete={(data) => {
                      if (typeof onComplete === "function") {
                        onComplete(data);
                      }
                    }}
                  />
                </div>
              </div>

              
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

const styles = `
  .rm-search-modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: clamp(8px, 2vw, 18px);
    background: rgba(56, 33, 22, 0.24);
    backdrop-filter: blur(6px);
  }

  .rm-search-modal-shell {
    position: relative;
    width: min(1120px, 100%);
    height: min(760px, 100%);
    max-width: 96vw;
    max-height: 94vh;
    min-height: 0;
    border: 1px solid #ded2c3;
    border-radius: 18px;
    background: #fbf8f3;
    box-shadow:
      0 24px 64px rgba(72, 47, 30, 0.20),
      0 2px 10px rgba(72, 47, 30, 0.08);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .rm-search-modal-scroll {
    width: 100%;
    height: 100%;
    min-width: 0;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
  }

  .rm-search-modal-body {
    width: 100%;
    min-width: 0;
    min-height: 100%;
    display: flex;
    align-items: stretch;
    justify-content: stretch;
    background:
      radial-gradient(circle at top left, rgba(181,123,63,0.10), transparent 28%),
      radial-gradient(circle at bottom right, rgba(47,111,79,0.07), transparent 32%),
      #f7f2ea;
  }

  .rm-search-modal-close {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 20;
    width: 43px;
    height: 43px;
    border: 1px solid #ded2c3;
    border-radius: 10px;
    background: rgba(251,248,243,0.96);
    color: #5b3825;
    font-size: 22px;
    line-height: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 8px 22px rgba(72,47,30,0.10);
    transition: transform .18s ease, background .18s ease, border-color .18s ease, box-shadow .18s ease;
  }

  .rm-search-modal-close:hover {
    background: #f8efe5;
    border-color: #c5aa8d;
    box-shadow: 0 10px 26px rgba(72,47,30,0.15);
    transform: translateY(-1px);
  }

  .rm-search-modal-close:active {
    transform: translateY(0) scale(0.97);
  }

  .rm-search-modal-close:focus-visible {
    outline: 0;
    border-color: #8f6847;
    box-shadow: 0 0 0 3px rgba(143,104,71,.18);
  }

  .rm-search-modal-scroll::-webkit-scrollbar {
    width: 10px;
  }

  .rm-search-modal-scroll::-webkit-scrollbar-track {
    background: transparent;
  }

  .rm-search-modal-scroll::-webkit-scrollbar-thumb {
    background: rgba(143, 104, 71, 0.48);
    border-radius: 999px;
    border: 2px solid transparent;
    background-clip: padding-box;
  }

  .rm-search-modal-scroll::-webkit-scrollbar-thumb:hover {
    background: rgba(91, 56, 37, 0.68);
    border: 2px solid transparent;
    background-clip: padding-box;
  }

  @media (max-width: 1024px) {
    .rm-search-modal-shell {
      max-width: 97vw;
      max-height: 95vh;
      border-radius: 20px;
    }
  }

  @media (max-width: 768px) {
    .rm-search-modal-overlay {
      padding: 10px;
      align-items: stretch;
    }

    .rm-search-modal-shell {
      width: 100%;
      height: 100%;
      max-width: 100%;
      max-height: 100%;
      border-radius: 18px;
    }
  }

  @media (max-width: 480px) {
    .rm-search-modal-overlay {
      padding: 0;
    }

    .rm-search-modal-shell {
      border-radius: 0;
      width: 100vw;
      height: 100vh;
      max-width: 100vw;
      max-height: 100vh;
    }

    .rm-search-modal-close {
      top: 10px;
      right: 10px;
      width: 40px;
      height: 40px;
      font-size: 20px;
    }

    .rm-search-modal-scroll::-webkit-scrollbar {
      width: 7px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .rm-search-modal-close {
      transition: none;
    }
  }
`;
