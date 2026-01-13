// resources/js/components/layout/Header.jsx
import React, { useEffect, useRef, useState } from "react";

export default function Header({ routes: routesProp, homeHref }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const btnRef = useRef(null);

  // Prefer prop; else use window.ROUTES injected by Blade; else {}
  const routes =
    routesProp ||
    (typeof window !== "undefined" ? window.ROUTES : undefined) ||
    {};

  // Normalize hrefs with safe fallbacks so we never crash
  const hrefs = {
    home: homeHref ?? routes.home ?? "/",
    login: routes.login ?? "/login",
    signupIndex: routes.signup?.index ?? "/signup",
    requestShow: routes.request?.show ?? "/request-trial",
  };

  useEffect(() => {
    if (!routesProp && !(window && window.ROUTES)) {
      // helpful log if you forgot to inject or pass routes
      // (won’t break the UI)
      // eslint-disable-next-line no-console
      console.warn(
        "[Header] No routes provided. Using fallback paths. " +
        "Make sure Blade defines window.ROUTES before loading app.jsx, " +
        "or pass <Header routes={window.ROUTES} />."
      );
    }
  }, [routesProp]);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!menuRef.current || !btnRef.current) return;
      if (menuRef.current.contains(e.target) || btnRef.current.contains(e.target)) return;
      setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return ( 
    <header   className="header">
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
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="userMenu"
        aria-label="Account menu"
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        <svg width="58" height="58" viewBox="0 0 48 28" aria-hidden="true" focusable="false">
          <g transform="translate(0,2)" stroke="#0b3a2d" fill="none" strokeWidth="2">
            <circle cx="12" cy="8" r="5"></circle>
            <path d="M4 22c0-5 5-8 8-8s8 3 8 8" strokeLinecap="round"></path>
          </g>
          <g transform="translate(26,5)" stroke="#0b3a2d" strokeWidth="2" strokeLinecap="round">
            <line x1="0" y1="3" x2="18" y2="3"></line>
            <line x1="0" y1="9" x2="18" y2="9"></line>
            <line x1="0" y1="15" x2="18" y2="15"></line>
          </g>
        </svg>
      </button>

      <nav
        className="menu"
        id="userMenu"
        ref={menuRef}
        role="menu"
        aria-label="Account"
        style={{ display: open ? "block" : "none" }}
      >
        <a href={hrefs.login} role="menuitem">Log In</a><hr />
        <a href={hrefs.signupIndex} role="menuitem">Sign Up</a><hr />
        <a href={hrefs.requestShow} role="menuitem">Request Free Trial</a>
      </nav>
    </header>
  );
}
