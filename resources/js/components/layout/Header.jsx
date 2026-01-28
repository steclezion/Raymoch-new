// resources/js/components/layout_master/Header.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * Raymoch Responsive Header
 * - Desktop: logo + explore + search + CTA + auth + nav links
 * - Mobile: burger opens right-side drawer; backdrop closes; ESC closes
 * - No external libs required
 *
 * NOTE:
 * 1) Make sure your main layout has:
 *    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
 * 2) Keep global CSS from overflowing:
 *    html,body{overflow-x:hidden;max-width:100%}
 */
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const drawerRef = useRef(null);

  const navLinks = useMemo(
    () => [
      { label: "Businesses", href: "/businesses" },
      { label: "Services", href: "/services" },
      { label: "Research & Insights", href: "/research" },
      { label: "Who We Are", href: "/about" },
    ],
    []
  );

  const exploreLinks = useMemo(
    () => [
      { label: "Explore Companies", href: "/explore/companies" },
      { label: "Explore Sectors", href: "/explore/sectors" },
      { label: "Explore Regions", href: "/explore/regions" },
      { label: "Policy & Incentives", href: "/policy" },
    ],
    []
  );

  // Close drawer on >= lg (so it doesn't stay open after rotating / resizing)
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 992) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Close on ESC + focus drawer when opened
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      // focus first actionable element in drawer
      requestAnimationFrame(() => {
        const el = drawerRef.current?.querySelector("a,button,input,select,textarea,[tabindex]:not([tabindex='-1'])");
        el?.focus?.();
      });
    }
  }, [menuOpen]);

  const toggleMenu = () => setMenuOpen((v) => !v);

  return (
    <header className="rmh">
      {/* Inline CSS so you can paste-and-run; you may move it to your global CSS later */}
      <style>{css}</style>

      {/* Top row */}
      <div className="rmh__top">
        <div className="rmh__inner">
          {/* Brand */}
          <a className="rmh__brand" href="/" aria-label="Raymoch Home">
            <span className="rmh__logo" aria-hidden="true">
              R
            </span>
            <span className="rmh__name">Raymoch</span>
          </a>

          {/* Explore (desktop) */}
          <div className="rmh__explore">
            <button className="rmh__exploreBtn" type="button" aria-haspopup="menu">
              Explore <span className="rmh__caret" aria-hidden="true">▾</span>
            </button>

            <div className="rmh__exploreMenu" role="menu" aria-label="Explore">
              {exploreLinks.map((x) => (
                <a key={x.href} className="rmh__menuItem" role="menuitem" href={x.href}>
                  {x.label}
                </a>
              ))}
            </div>
          </div>

          {/* Search (desktop/tablet) */}
          <form className="rmh__search" action="/search" method="GET" role="search">
            <input
              className="rmh__searchInput"
              name="q"
              type="search"
              placeholder="Search companies, sectors, region"
              aria-label="Search companies, sectors, region"
              autoComplete="off"
            />
          </form>

          {/* Actions */}
          <div className="rmh__actions">
            <a className="rmh__btn rmh__btnGhost" href="/trial">
              Request a free trial
            </a>
            <a className="rmh__btn rmh__btnOutline" href="/login">
              Login
            </a>
            <a className="rmh__btn rmh__btnSolid" href="/signup">
              Sign up
            </a>

            {/* Burger (mobile) */}
            <button
              className="rmh__burger"
              type="button"
              onClick={toggleMenu}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen ? "true" : "false"}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop nav row */}
      <nav className="rmh__nav" aria-label="Primary">
        <div className="rmh__inner rmh__innerNav">
          {navLinks.map((l) => (
            <a key={l.href} className="rmh__navLink" href={l.href}>
              {l.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Mobile backdrop */}
      {menuOpen && <div className="rmh__backdrop" onClick={() => setMenuOpen(false)} aria-hidden="true" />}

      {/* Mobile drawer */}
      <aside
        className={`rmh__drawer ${menuOpen ? "isOpen" : ""}`}
        aria-label="Mobile menu"
        ref={drawerRef}
      >
        <div className="rmh__drawerTop">
          <a className="rmh__brand rmh__brandSm" href="/" aria-label="Raymoch Home">
            <span className="rmh__logo" aria-hidden="true">
              R
            </span>
            <span className="rmh__name">Raymoch</span>
          </a>
          <button className="rmh__drawerClose" onClick={() => setMenuOpen(false)} aria-label="Close menu" type="button">
            ✕
          </button>
        </div>

        <form className="rmh__search rmh__searchMobile" action="/search" method="GET" role="search">
          <input
            className="rmh__searchInput"
            name="q"
            type="search"
            placeholder="Search companies, sectors, region"
            aria-label="Search companies, sectors, region"
            autoComplete="off"
          />
        </form>

        <div className="rmh__sectionTitle">Explore</div>
        <div className="rmh__list">
          {exploreLinks.map((x) => (
            <a key={x.href} className="rmh__drawerLink" href={x.href} onClick={() => setMenuOpen(false)}>
              {x.label}
            </a>
          ))}
        </div>

        <div className="rmh__sectionTitle">Menu</div>
        <div className="rmh__list">
          {navLinks.map((l) => (
            <a key={l.href} className="rmh__drawerLink" href={l.href} onClick={() => setMenuOpen(false)}>
              {l.label}
            </a>
          ))}
        </div>

        <div className="rmh__drawerActions">
          <a className="rmh__btn rmh__btnGhost rmh__btnFull" href="/trial" onClick={() => setMenuOpen(false)}>
            Request a free trial
          </a>
          <div className="rmh__grid2">
            <a className="rmh__btn rmh__btnOutline rmh__btnFull" href="/login" onClick={() => setMenuOpen(false)}>
              Login
            </a>
            <a className="rmh__btn rmh__btnSolid rmh__btnFull" href="/signup" onClick={() => setMenuOpen(false)}>
              Sign up
            </a>
          </div>
        </div>
      </aside>
    </header>
  );
}

const css = `
/* =============================
   Raymoch Header (Responsive)
   ============================= */

:root{
  --rm-blue:#0328ae;
  --rm-ink:#101114;
  --rm-bg:#ffffff;
  --rm-muted:#6b7280;
  --rm-border:#e8e8ee;
  --rm-soft:#f6f7fb;
  --rm-shadow: 0 8px 24px rgba(16,17,20,.08);
}

/* Prevent mobile black side caused by horizontal overflow */
html, body { max-width:100%; overflow-x:hidden; background: var(--rm-bg); }

.rmh{
  position: sticky;
  top:0;
  z-index: 2000;
  background: var(--rm-bg);
  border-bottom: 1px solid var(--rm-border);
}

.rmh__top{
  background: var(--rm-bg);
}

.rmh__inner{
  max-width: 1200px;
  margin: 0 auto;
  padding: 10px 16px;
  display:flex;
  align-items:center;
  gap: 12px;
}

.rmh__innerNav{
  padding-top: 0;
  padding-bottom: 10px;
}

.rmh__brand{
  display:flex;
  align-items:center;
  gap: 10px;
  text-decoration:none;
  color: var(--rm-ink);
  font-weight: 800;
  white-space: nowrap;
}

.rmh__logo{
  width: 28px;
  height: 28px;
  border-radius: 10px;
  background: var(--rm-blue);
  color: #fff;
  display:grid;
  place-items:center;
  font-size: 14px;
  box-shadow: 0 6px 14px rgba(3,40,174,.18);
}

.rmh__name{
  font-size: 15px;
  letter-spacing: .2px;
}

.rmh__explore{
  position: relative;
}

.rmh__exploreBtn{
  border: 1px solid var(--rm-border);
  background: var(--rm-soft);
  color: var(--rm-ink);
  font-weight: 700;
  font-size: 13px;
  border-radius: 999px;
  padding: 8px 12px;
  cursor: pointer;
  display:flex;
  align-items:center;
  gap: 8px;
}

.rmh__caret{ font-size: 12px; opacity:.8; }

.rmh__exploreMenu{
  position:absolute;
  left:0;
  top: calc(100% + 8px);
  min-width: 220px;
  background: #fff;
  border: 1px solid var(--rm-border);
  border-radius: 14px;
  box-shadow: var(--rm-shadow);
  padding: 8px;
  display:none;
}

.rmh__explore:hover .rmh__exploreMenu,
.rmh__explore:focus-within .rmh__exploreMenu{
  display:block;
}

.rmh__menuItem{
  display:block;
  text-decoration:none;
  color: var(--rm-ink);
  font-weight: 650;
  font-size: 13px;
  padding: 10px 10px;
  border-radius: 10px;
}
.rmh__menuItem:hover{ background: var(--rm-soft); }

.rmh__search{
  flex: 1;
  min-width: 0;
  display:flex;
  justify-content:center;
}

.rmh__searchInput{
  width: 100%;
  max-width: 560px;
  border: 1px solid var(--rm-border);
  background: #fff;
  padding: 10px 12px;
  border-radius: 999px;
  outline: none;
  font-size: 13px;
}
.rmh__searchInput:focus{
  border-color: rgba(3,40,174,.35);
  box-shadow: 0 0 0 4px rgba(3,40,174,.10);
}

.rmh__actions{
  display:flex;
  align-items:center;
  gap: 10px;
}

.rmh__btn{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  padding: 8px 12px;
  border-radius: 999px;
  text-decoration:none;
  font-weight: 750;
  font-size: 13px;
  white-space: nowrap;
  border: 1px solid transparent;
}

.rmh__btnGhost{
  background: var(--rm-soft);
  color: var(--rm-ink);
  border-color: var(--rm-border);
}

.rmh__btnOutline{
  background: #fff;
  color: var(--rm-blue);
  border-color: rgba(3,40,174,.45);
}

.rmh__btnSolid{
  background: var(--rm-blue);
  color: #fff;
  border-color: var(--rm-blue);
}

.rmh__burger{
  display:none;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid var(--rm-border);
  background: #fff;
  padding: 8px;
  cursor: pointer;
}
.rmh__burger span{
  display:block;
  height: 2px;
  background: var(--rm-ink);
  margin: 5px 0;
  border-radius: 2px;
}

.rmh__nav{
  background: var(--rm-bg);
}

.rmh__navLink{
  text-decoration:none;
  color: var(--rm-ink);
  font-weight: 750;
  font-size: 14px;
  padding: 10px 10px;
  border-radius: 10px;
}
.rmh__navLink:hover{ background: var(--rm-soft); }

/* Mobile Drawer */
.rmh__backdrop{
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.35);
  z-index: 1999;
}

.rmh__drawer{
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: min(86vw, 360px);
  background: #fff;
  border-left: 1px solid var(--rm-border);
  box-shadow: var(--rm-shadow);
  transform: translateX(110%);
  transition: transform .18s ease;
  z-index: 2000;
  padding: 14px;
  display:flex;
  flex-direction: column;
  gap: 14px;
}

.rmh__drawer.isOpen{ transform: translateX(0); }

.rmh__drawerTop{
  display:flex;
  align-items:center;
  justify-content: space-between;
  gap: 10px;
}

.rmh__brandSm .rmh__name{ font-size: 14px; }

.rmh__drawerClose{
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid var(--rm-border);
  background: var(--rm-soft);
  cursor: pointer;
  font-size: 16px;
}

.rmh__searchMobile{
  justify-content: flex-start;
}
.rmh__searchMobile .rmh__searchInput{
  max-width: 100%;
}

.rmh__sectionTitle{
  font-size: 12px;
  font-weight: 900;
  letter-spacing: .12em;
  color: var(--rm-muted);
  text-transform: uppercase;
}

.rmh__list{
  display:flex;
  flex-direction: column;
  gap: 6px;
}

.rmh__drawerLink{
  text-decoration:none;
  color: var(--rm-ink);
  font-weight: 750;
  padding: 12px 10px;
  border-radius: 12px;
  border: 1px solid var(--rm-border);
  background: #fff;
}
.rmh__drawerLink:hover{ background: var(--rm-soft); }

.rmh__drawerActions{
  margin-top: auto;
  display:flex;
  flex-direction: column;
  gap: 10px;
}

.rmh__btnFull{ width: 100%; }

.rmh__grid2{
  display:grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

/* =============================
   Responsive behavior
   ============================= */
@media (max-width: 991.98px){
  .rmh__explore{ display:none; }
  .rmh__search{ display:none; }
  .rmh__btn{ display:none; }
  .rmh__burger{ display:inline-flex; flex-direction: column; justify-content:center; }
  .rmh__nav{ display:none; }
}

@media (max-width: 420px){
  .rmh__inner{ padding: 10px 12px; }
  .rmh__logo{ width:26px; height:26px; border-radius: 9px; }
}

/* If you had a global container using 100vw + padding, it can cause overflow.
   This header avoids that by using max-width + padding, not vw. */
`;
