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
    background: rgba(15, 23, 42, 0.18);
    backdrop-filter: blur(4px);
  }

  .rm-search-modal-shell {
    position: relative;
    width: min(1120px, 100%);
    height: min(760px, 100%);
    max-width: 96vw;
    max-height: 94vh;
    min-height: 0;
    border-radius: 24px;
    background: #ffffff;
    box-shadow:
      0 20px 60px rgba(15, 23, 42, 0.18),
      0 2px 10px rgba(15, 23, 42, 0.08);
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
      radial-gradient(circle at top left, rgba(59,130,246,0.06), transparent 28%),
      radial-gradient(circle at bottom right, rgba(14,165,233,0.06), transparent 32%),
      #f8fafc;
  }

  .rm-search-modal-close {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 20;
    width: 38px;
    height: 38px;
    border: 1px solid #e2e8f0;
    border-radius: 999px;
    background: rgba(255,255,255,0.94);
    color: #334155;
    font-size: 22px;
    line-height: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
    transition: transform .18s ease, background .18s ease, border-color .18s ease;
  }

  .rm-search-modal-close:hover {
    background: #ffffff;
    border-color: #cbd5e1;
  }

  .rm-search-modal-close:active {
    transform: scale(0.97);
  }

  .rm-search-modal-scroll::-webkit-scrollbar {
    width: 10px;
  }

  .rm-search-modal-scroll::-webkit-scrollbar-track {
    background: transparent;
  }

  .rm-search-modal-scroll::-webkit-scrollbar-thumb {
    background: rgba(148, 163, 184, 0.55);
    border-radius: 999px;
    border: 2px solid transparent;
    background-clip: padding-box;
  }

  .rm-search-modal-scroll::-webkit-scrollbar-thumb:hover {
    background: rgba(100, 116, 139, 0.75);
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
      width: 34px;
      height: 34px;
      font-size: 20px;
    }

    .rm-search-modal-scroll::-webkit-scrollbar {
      width: 7px;
    }
  }
`;