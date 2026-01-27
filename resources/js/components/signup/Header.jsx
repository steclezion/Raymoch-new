// resources/js/components/layout/Header.jsx
import React, { useEffect, useRef, useState } from "react";

export default function Header({ routes: routesProp, homeHref }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const btnRef = useRef(null);

  // Prefer prop; else use window.ROUTES injected by Blade; else {}
  const routes =
    routesProp || (typeof window !== "undefined" ? window.ROUTES : undefined) || {};

  // Normalize hrefs with safe fallbacks so we never crash
  const hrefs = {
    home: homeHref ?? routes.home ?? "/",
    login: routes.login ?? "/login",
    signupIndex: routes.signup?.index ?? "/signup",
    requestShow: routes.request?.show ?? "/request-trial",
  };

  useEffect(() => {
    const hasWindowRoutes = typeof window !== "undefined" && window.ROUTES;

    if (!routesProp && !hasWindowRoutes) {
      // eslint-disable-next-line no-console
      console.warn(
        "[Header] No routes provided. Using fallback paths. " +
          "Make sure Blade defines window.ROUTES before loading app.jsx, " +
          "or pass <Header routes={window.ROUTES} />."
      );
    }
  }, [routesProp]);

  useEffect(() => {
    const onDocPointerDown = (e) => {
      if (!menuRef.current || !btnRef.current) return;
      const target = e.target;
      if (menuRef.current.contains(target) || btnRef.current.contains(target)) return;
      setOpen(false);
    };

    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onDocPointerDown);
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("pointerdown", onDocPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <>
      <style>{header_csss}</style>

      <header className="header">
        <a className="brand" href={hrefs.home} aria-label="Raymoch home">
          <svg viewBox="0 0 200 200" aria-hidden="true">
            <polygon
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              points="100,18 172,59 172,141 100,182 28,141 28,59"
            />
            <text
              x="100"
              y="118"
              textAnchor="middle"
              style={{ fill: "currentColor", font: "700 105px Georgia" }}
            >
              R
            </text>
          </svg>
          <span>Raymoch</span>
        </a>

        <button
          className="iconbtn"
          ref={btnRef}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls="userMenu"
          aria-label="Account menu"
          onClick={() => setOpen((v) => !v)}
          type="button"
        >
          <svg width="58" height="58" viewBox="0 0 48 28" aria-hidden="true" focusable="false">
            <g transform="translate(0,2)" stroke="#0b3a2d" fill="none" strokeWidth="2">
              <circle cx="12" cy="8" r="5" />
              <path d="M4 22c0-5 5-8 8-8s8 3 8 8" strokeLinecap="round" />
            </g>
            <g transform="translate(26,5)" stroke="#0b3a2d" strokeWidth="2" strokeLinecap="round">
              <line x1="0" y1="3" x2="18" y2="3" />
              <line x1="0" y1="9" x2="18" y2="9" />
              <line x1="0" y1="15" x2="18" y2="15" />
            </g>
          </svg>
        </button>

        <nav
          className="menu"
          id="userMenu"
          ref={menuRef}
          aria-label="Account"
          style={{ display: open ? "block" : "none" }}
        >
          <a href={hrefs.login}>Log In</a>
          <hr />
          <a href={hrefs.signupIndex}>Sign Up</a>
          <hr />
          <a href={hrefs.requestShow}>Request Free Trial</a>
        </nav>
      </header>
    </>
  );
}

const header_csss = `
/* Header (scoped to Header.jsx markup) */
.header{
  height:80px;
  background:#fff;
  border-bottom:1px solid var(--border, #e8e8ee);
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:0 24px;
  position:relative;
  flex-shrink:0;
}

.brand{
  display:flex;
  align-items:center;
  gap:10px;
  color:var(--brand-blue, #0328aeed);
  text-decoration:none;
}
.brand svg{ width:26px; height:26px; display:block; }
.brand span{
  font-weight:900;
  font-size:1.3rem;
  letter-spacing:.2px;
  color:var(--brand-blue, #0328aeed);
}

.iconbtn{
  background:transparent;
  border:0;
  cursor:pointer;
  padding:6px;
  border-radius:8px;
  display:flex;
  align-items:center;
  justify-content:center;
  position:relative;
}
.iconbtn:hover{ background:#f2f4ff; }

/* Dropdown menu */
.menu{
  position:absolute;
  right:24px;
  top:76px;
  background:#fff;
  border:1px solid var(--border, #e8e8ee);
  border-radius:12px;
  box-shadow:0 14px 30px rgba(2,6,23,.12);
  min-width:210px;
  padding:10px;
  z-index:50;
}
.menu a{
  display:block;
  padding:10px 10px;
  border-radius:10px;
  color:#0f172a;
  text-decoration:none;
  font-weight:700;
}
.menu a:hover{ background:#f1f5ff; }
.menu hr{
  border:0;
  border-top:1px solid #eef2f7;
  margin:6px 0;
}
`;
