import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import SnakeSearchLoading from "./SnakeSearchLoading";

export default function SearchAnimatedModal({
  open = false,
  token = "",
  status,
  error,
  starting,
  onClose,
  onViewResults,
  onResume,
}) {
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="rm-search-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.28 }}
          role="presentation"
        >
          <style>{styles}</style>
          <motion.section
            className="rm-search-modal-shell"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 12, scale: reduceMotion ? 1 : 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : 6, scale: reduceMotion ? 1 : 0.98 }}
            transition={{ duration: reduceMotion ? 0 : 0.36, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Company search progress"
          >
            <button
              type="button"
              className="rm-search-modal-close"
              onClick={onClose}
              aria-label={status?.meta?.is_completed ? "Close search dialog" : "Stop search"}
            >
              <X size={20} />
            </button>
            <div className="rm-search-modal-scroll">
              <SnakeSearchLoading
                open={open}
                token={token}
                status={status}
                error={error}
                starting={starting}
                onViewResults={onViewResults}
                onResume={onResume}
              />
            </div>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}

const styles = `
.rm-search-modal-overlay{position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(56,33,22,.34);backdrop-filter:blur(6px)}
.rm-search-modal-shell{position:relative;width:min(1120px,100%);height:min(820px,94dvh);max-height:94vh;display:flex;flex-direction:column;overflow:hidden;border:1px solid #ded2c3;border-radius:18px;background:#fbf8f3;box-shadow:0 24px 64px rgba(72,47,30,.20)}
.rm-search-modal-scroll{overflow:auto;min-height:0;flex:1;overscroll-behavior:contain;padding-top:38px}
.rm-search-modal-close{position:absolute;right:12px;top:12px;z-index:3;width:38px;height:38px;display:grid;place-items:center;border:1px solid #ded2c3;border-radius:10px;background:#fbf8f3;color:#5b3825;cursor:pointer}
.rm-search-modal-close:focus-visible{outline:3px solid #b57b3f}
@media(max-width:560px){.rm-search-modal-overlay{padding:0}.rm-search-modal-shell{width:100vw;height:100dvh;max-height:100dvh;border-radius:0}}
`;
