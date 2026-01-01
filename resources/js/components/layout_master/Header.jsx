// resources/js/components/layout_master/Header.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link, useInRouterContext } from "react-router-dom";
import Swal from "sweetalert2";

// ---- Small, component-local CSS so this file is self-contained ----
const HEADER_CSS = `
.header { --border:#e8e8ee; --brand:#0328aeed; --ink:#101114; background:#fff; color:var(--ink); position:sticky; top:0; z-index:1000; border-bottom:1px solid var(--border); }
.header .row1 { display:flex; justify-content:space-between; align-items:center; gap:16px; padding:12px 16px; }
.brandrow { display:flex; align-items:center; gap:18px; position:relative; }
.brand { display:flex; align-items:center; gap:10px; color:var(--brand); text-decoration:none; }
.brand-word { font-weight:900; font-size:1.25rem; color:var(--brand); letter-spacing:.2px; }
.dotgrid{width:18px;height:18px;display:inline-grid;grid-template-columns:repeat(2,1fr);gap:2px}
.dotgrid i{width:5px;height:5px;border-radius:2px;background:#101114}
.explore-toggle { appearance:none; border:0; background:transparent; cursor:pointer; display:flex; align-items:center; gap:8px; font-weight:800; color:#0f172a; padding:6px 8px; border-radius:8px; font-size:1.05rem; }
.explore-toggle:hover, .explore-toggle[aria-expanded="true"]{ background:#eceff3; color:#0a2a6b; }
.menu-panel { position:absolute; top:calc(100% + 10px); left:0; width:min(760px, 92vw); background:#fff; border:1px solid var(--border); border-radius:14px; box-shadow:0 12px 30px rgba(10,42,107,.10); padding:14px; }
.menu-head { display:flex; align-items:center; justify-content:space-between; gap:8px; margin-bottom:6px; cursor:pointer; user-select:none; padding:2px 4px; border-radius:8px; }
.menu-head:hover { background:#f5f6f8; }
.menu-head h4 { margin:0; font-size:1rem; color:#0a2a6b; }
.menu-grid { display:grid; grid-template-columns:repeat(2, minmax(220px, 1fr)); gap:12px; margin-top:10px; }
.menu-item { display:block; padding:12px; border:1px solid var(--border); border-radius:12px; background:#fff; text-decoration:none; color:#0f172a; }
.menu-item:hover { transform:translateY(-1px); box-shadow:0 8px 20px rgba(0,0,0,.06); }
.menu-item h5 { margin:0 0 6px; font-size:.98rem; }
.menu-item p { margin:0; color:#3c4b69; font-size:.92rem; }

.rightside { display:flex; align-items:center; gap:14px; }
.search-box { min-width:160px; width:22vw; max-width:280px; }
.search-box input { width:100%; height:40px; padding:0 14px; border:1px solid var(--border); border-radius:999px; }
.search-box input:focus { border-color:var(--brand); outline:2px solid #cfe0ff; }
.btn { height:40px; display:inline-flex; align-items:center; gap:8px; padding:0 16px; border-radius:999px; font-weight:700; background:#fff; border:1px solid var(--border); cursor:pointer; text-decoration:none; }
.btn.primary { background:var(--brand); color:#fff; border-color:var(--brand); }
.btn.orange { background:#f59e0b; color:#fff; border-color:#f59e0b; }
.btn.success { background:#16a34a; color:#fff; border-color:#16a34a; }

.row2 { background:#f5f6f8; border-top:1px solid #eee; border-bottom:1px solid #e6e6e6; }
.row2 .wrap { max-width:1328px; margin:0 auto; padding:0 16px; }
.row2 .links { display:flex; gap:18px; padding:8px 8px; margin:0; align-items:center; flex-wrap:wrap; }
.row2 a { font-weight:600; font-size:.92rem; padding:4px 6px; border-radius:4px; color:#0f172a; text-decoration:none; }
.row2 a:hover { background:#eceff3; color:#0a2a6b; }

.hamburger { display:none; flex-direction:column; gap:4px; background:none; border:none; padding:8px; border-radius:8px; }
.hamburger span { width:24px; height:3px; background:#0f172a; border-radius:3px; }

.desktop-only { display:flex; }
.mobile-only { display:none; }

@media (max-width: 768px){
  .desktop-only { display:none !important; }
  .mobile-only { display:flex !important; }
  .search-box { display:none; }
}
`;

// Safe link: use <Link> when router is available, else fallback <a>
function SafeLink({ to, children, ...rest }) {
  const hasRouter = useInRouterContext?.() ?? false;
  if (hasRouter) return <Link to={to} {...rest}>{children}</Link>;
  return <a href={typeof to === "string" ? to : "/"} {...rest}>{children}</a>;
}

export default function Header({ routes = {} }) {
  const [open, setOpen] = useState(false);          // shows/hides the dropdown panel
  const [showGrid, setShowGrid] = useState(false);  // toggles ONLY the inner grid
  const btnRef = useRef(null);
  const menuRef = useRef(null);

  // Close on outside click / ESC
  useEffect(() => {
    const onDocClick = (e) => {
      if (!open) return;
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        btnRef.current &&
        !btnRef.current.contains(e.target)
      ) {
        setOpen(false);
        setShowGrid(false);
      }
    };
    const onEsc = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        setShowGrid(false);
      }
    };
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  // SweetAlert2 mobile menu
  const openMobileMenu = () => {
    Swal.fire({
      title: "Welcome to Raymoch",
      html: `
        <div style="display:flex;flex-direction:column;gap:14px;align-items:flex-start">
          <a href="${routes.explore ?? "/explore"}" style="color:#1d4ed8;font-weight:700">Businesses</a>
          <a href="${routes.services ?? "/services"}" style="color:#1d4ed8;font-weight:700">Services</a>
          <a href="${routes.insights ?? "/insights"}" style="color:#1d4ed8;font-weight:700">Research &amp; Insights</a>
          <a href="${routes.about ?? "/about"}" style="color:#1d4ed8;font-weight:700">Who We Are</a>
          <hr style="width:100%;border:none;border-top:1px solid #e5e7eb;margin:6px 0 0" />
          <div style="display:flex;flex-direction:column;gap:10px;width:100%">
            <a href="${routes.login ?? "/login"}" class="swal2-styled" style="display:inline-block;background:#2563eb">Login</a>
            <a href="${routes.signup ?? "/signup"}" class="swal2-styled" style="display:inline-block;background:#16a34a">Sign up</a>
            <a href="${routes.trial.page ?? "/request-trial"}" class="swal2-styled" style="display:inline-block;background:#f59e0b">Request a free trial</a>
          </div>
        </div>
      `,
      showConfirmButton: false,
      showCloseButton: true,
      width: 360,
      didOpen: () => {
        // Make left-aligned content on tiny screens
        const box = document.querySelector(".swal2-html-container");
        if (box) box.style.textAlign = "left";
      }
    });
  };

  return (
    <header className="header" id="nav" data-version="HeaderFooter_v1.0">
      <style>{HEADER_CSS}</style>

      <div className="row1">
        <div className="brandrow">
          {/* Brand */}
          <SafeLink className="brand" to={routes.home ?? "/"}>
            <svg width="28" height="28" viewBox="0 0 200 200" aria-hidden="true">
              <polygon fill="none" stroke="currentColor" strokeWidth="10" points="100,18 172,59 172,141 100,182 28,141 28,59" />
              <text x="100" y="118" textAnchor="middle" style={{ fill: "currentColor", font: "700 105px Georgia" }}>R</text>
            </svg>
            <span className="brand-word">Raymoch</span>
          </SafeLink>

          {/* Explore (desktop) */}
          <button
            ref={btnRef}
            className="explore-toggle desktop-only"
            aria-expanded={open}
            aria-controls="t1Menu"
            onClick={() => {
              setOpen(v => !v);
              // When opening the dropdown, start with grid hidden
              setShowGrid(false);
            }}
          >
            <span className="dotgrid" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
            Explore
          </button>

          {/* Explore dropdown panel */}
          {open && (
            <div ref={menuRef} className="menu-panel desktop-only" id="t1Menu" role="menu">
              {/* Clickable title: toggles inner grid */}
              <div className="menu-head" onClick={() => setShowGrid(v => !v)}>
                <h4>Explore services</h4>
                <span aria-hidden="true">{showGrid ? "▲" : "▼"}</span>
              </div>

              {/* Grid appears ONLY when title is clicked */}
              {showGrid && (
                <div className="menu-grid">
                  <SafeLink className="menu-item" role="menuitem" to={routes.matching ?? "/matching"}>
                    <h5>Trusted Matching</h5>
                    <p>Get paired with credible businesses using CTI &amp; verification.</p>
                  </SafeLink>
                  <SafeLink className="menu-item" role="menuitem" to={routes.verification ?? "/verification"}>
                    <h5>Verification</h5>
                    <p>CTI badges, document checks, and data provenance.</p>
                  </SafeLink>
                  <SafeLink className="menu-item" role="menuitem" to={routes.insights ?? "/insights"}>
                    <h5>Research &amp; Insights</h5>
                    <p>Sector reports, trends, and regional briefs.</p>
                  </SafeLink>
                  <SafeLink className="menu-item" role="menuitem" to={routes.services ?? "/services"}>
                    <h5>Programs &amp; Services</h5>
                    <p>Advisory, partner programs, and support options.</p>
                  </SafeLink>
                  <SafeLink className="menu-item" role="menuitem" to={routes.incentives ?? "/incentives"}>
                    <h5>Policy &amp; Incentives</h5>
                    <p>Tax credits, grants, and regulatory signals.</p>
                  </SafeLink>
                  <SafeLink className="menu-item" role="menuitem" to={routes.whitespace ?? "/whitespace"}>
                    <h5>Whitespace Map</h5>
                    <p>Where demand outpaces supply across sectors.</p>
                  </SafeLink>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right side actions (hidden on mobile) */}
        <div className="rightside desktop-only">
          <form className="search-box" action={routes.explore ?? "/explore"}>
            <input type="search" name="q" placeholder="Search companies, sectors, regions…" />
          </form>
          <div className="auth">
            <a className="btn orange" target="_blank" href={routes.trial ?? "/request-trial"}>Request a free trial</a>
            <a className="btn primary" target="_blank" href={routes.login ?? "/login"}>Login</a>
            <a className="btn success" target="_blank" href={routes.signup ?? "/signup"}>Sign up</a>
          </div>
        </div>

        {/* Hamburger (mobile) */}
        <button className="hamburger mobile-only" aria-label="Open menu" onClick={openMobileMenu}>
          <span></span><span></span><span></span>
        </button>
      </div>

      {/* Secondary nav (hidden on mobile) */}
      <div className="row2 desktop-only">
        <div className="wrap">
          <nav className="links" aria-label="Secondary">
            <SafeLink to={routes.explore ?? "/explore"}>Businesses</SafeLink>
            <SafeLink to={routes.services ?? "/services"}>Services</SafeLink>
            <SafeLink to={routes.insights ?? "/insights"}>Research &amp; Insights</SafeLink>
            <SafeLink to={routes.about ?? "/about"}>Who We Are</SafeLink>
          </nav>
        </div>
      </div>
    </header>
  );
}
