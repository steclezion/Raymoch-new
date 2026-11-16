import React, { useEffect, useId } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";

const BRAND_ICON_URL = "/images/raymoch_logo_11_10-26.svg";

export default function HorizontalModalNavigation({
  open = false,
  title,
  eyebrow = "Raymoch",
  description,
  closeLabel = "Close dialog",
  onClose,
  children,
}) {
  const reduceMotion = useReducedMotion();
  const generatedTitleId = useId();
  const titleId = `ray-horizontal-modal-${generatedTitleId.replace(/:/g, "")}`;

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="ray-horizontal-modal__backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.22 }}
          role="presentation"
        >
          <style>{styles}</style>
          <motion.section
            className="ray-horizontal-modal"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 14, scale: reduceMotion ? 1 : 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : 8, scale: reduceMotion ? 1 : 0.99 }}
            transition={{ duration: reduceMotion ? 0 : 0.34, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
          >
            <header className="ray-horizontal-modal__navigation">
              <div className="ray-horizontal-modal__brand">
                <span className="ray-horizontal-modal__mark" aria-hidden="true">
                  <img src={BRAND_ICON_URL} alt="" />
                </span>
                <div className="ray-horizontal-modal__heading">
                  <span>{eyebrow}</span>
                  <h2 id={titleId}>{title}</h2>
                  {description ? <p>{description}</p> : null}
                </div>
              </div>

              <button
                type="button"
                className="ray-horizontal-modal__close"
                onClick={onClose}
                aria-label={closeLabel}
                autoFocus
              >
                <X size={19} aria-hidden="true" />
              </button>
            </header>

            <div className="ray-horizontal-modal__content">{children}</div>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}

const styles = `
.ray-horizontal-modal__backdrop{--ray-ink:#382116;--ray-muted:#7a746d;--ray-accent:#6f452e;--ray-accent-strong:#5b3825;--ray-line:#ded2c3;--ray-canvas:#fbf8f3;position:fixed;inset:0;z-index:10000;display:grid;place-items:center;padding:18px;background:rgba(42,28,18,.5);backdrop-filter:blur(6px);box-sizing:border-box}
.ray-horizontal-modal,.ray-horizontal-modal *{box-sizing:border-box}
.ray-horizontal-modal{width:min(1180px,100%);height:min(840px,calc(100dvh - 36px));display:grid;grid-template-rows:auto minmax(0,1fr);overflow:hidden;border:1px solid var(--ray-line);border-radius:18px;color:var(--ray-ink);background:var(--ray-canvas);box-shadow:0 28px 80px rgba(42,28,18,.3)}
.ray-horizontal-modal__navigation{min-height:76px;display:flex;align-items:center;justify-content:space-between;gap:18px;padding:10px clamp(18px,3vw,34px);border-bottom:1px solid #c6a476;background:linear-gradient(135deg,#f4e8d6 0%,#f0e6dc 100%)}
.ray-horizontal-modal__brand{min-width:0;display:flex;align-items:center;gap:12px}
.ray-horizontal-modal__mark{width:52px;height:52px;display:grid;place-items:center;flex:0 0 52px;overflow:hidden}
.ray-horizontal-modal__mark img{width:100%;height:100%;display:block;object-fit:contain}
.ray-horizontal-modal__heading{min-width:0}
.ray-horizontal-modal__heading>span{display:block;color:#7a5036;font-size:.68rem;font-weight:800;letter-spacing:.1em;text-transform:uppercase}
.ray-horizontal-modal__heading h2{margin:2px 0 0;color:var(--ray-ink);font-size:clamp(1rem,2vw,1.22rem);line-height:1.2}
.ray-horizontal-modal__heading p{margin:3px 0 0;color:var(--ray-muted);font-size:.76rem;line-height:1.35}
.ray-horizontal-modal__close{width:38px;height:38px;display:grid;place-items:center;flex:0 0 38px;padding:0;border:1px solid #d6c4b1;border-radius:9px;color:#655b53;background:rgba(255,255,255,.82);cursor:pointer;transition:color 160ms ease,background-color 160ms ease,border-color 160ms ease}
.ray-horizontal-modal__close:hover{border-color:#b99877;color:var(--ray-accent);background:var(--ray-canvas)}
.ray-horizontal-modal__close:focus-visible{outline:3px solid rgba(143,104,71,.2);outline-offset:2px}
.ray-horizontal-modal__content{min-width:0;min-height:0;overflow-x:hidden;overflow-y:scroll;overscroll-behavior:contain;scrollbar-gutter:stable;scrollbar-width:thin;scrollbar-color:#b99877 #f3e7cf;background:var(--ray-canvas)}
.ray-horizontal-modal__content::-webkit-scrollbar{width:10px}
.ray-horizontal-modal__content::-webkit-scrollbar-track{background:#f3e7cf}
.ray-horizontal-modal__content::-webkit-scrollbar-thumb{border:2px solid #f3e7cf;border-radius:999px;background:#b99877}
.ray-horizontal-modal__content::-webkit-scrollbar-thumb:hover{background:#8f6847}
.ray-horizontal-modal__content .rm-snake-root{height:auto;min-height:100%;align-items:flex-start;padding:18px;background:var(--ray-canvas)}
.ray-horizontal-modal__content .rm-snake-stage{height:auto;min-height:100%;overflow:visible;border-color:var(--ray-line);border-radius:14px;background:var(--ray-canvas);box-shadow:0 10px 28px rgba(72,47,30,.08)}
.ray-horizontal-modal__content .rm-snake-layout{overflow:visible;min-height:auto}
.ray-horizontal-modal__content .rm-snake-topbar{border-color:#e7ddd1;background:#fffaf3}
.ray-horizontal-modal__content .rm-snake-title,.ray-horizontal-modal__content .rm-snake-check-title{color:var(--ray-ink)}
.ray-horizontal-modal__content .rm-snake-kicker,.ray-horizontal-modal__content .rm-snake-subtitle-text,.ray-horizontal-modal__content .rm-snake-check-meta{color:var(--ray-muted)}
.ray-horizontal-modal__content .rm-snake-running-pill{border-color:#dbc3a8;color:var(--ray-accent);background:#f3e7cf;box-shadow:none}
.ray-horizontal-modal__content .rm-snake-left{border-color:#e7ddd1}
.ray-horizontal-modal__content .rm-snake-check-item{border-color:#e3d8ca;background:#fffdf9;border-radius:12px}
.ray-horizontal-modal__content .rm-snake-check-item.running{border-color:#c6a476;box-shadow:0 8px 20px rgba(111,69,46,.08)}
.ray-horizontal-modal__content .rm-snake-check-icon,.ray-horizontal-modal__content .rm-snake-toggle-btn{color:var(--ray-accent)}
.ray-horizontal-modal__content .rm-snake-main{background:#f7f2ea}
.ray-horizontal-modal__content .rm-snake-summary-card{border-color:var(--ray-line);background:#fffdf9;box-shadow:0 12px 28px rgba(72,47,30,.08)}
.ray-horizontal-modal__content .rm-snake-action-btn.view{background:linear-gradient(135deg,var(--ray-accent),var(--ray-accent-strong));box-shadow:0 12px 24px rgba(91,56,37,.22)}
.ray-horizontal-modal__content .rm-snake-progress-ring{background:#eadfce}
@media(max-width:720px){.ray-horizontal-modal__backdrop{padding:0}.ray-horizontal-modal{width:100vw;height:100dvh;border:0;border-radius:0}.ray-horizontal-modal__navigation{min-height:68px;padding:8px 14px}.ray-horizontal-modal__mark{width:44px;height:44px;flex-basis:44px}.ray-horizontal-modal__heading p{display:none}.ray-horizontal-modal__content .rm-snake-root{padding:10px}}
@media(prefers-reduced-motion:reduce){.ray-horizontal-modal__close{transition:none}}
`;
