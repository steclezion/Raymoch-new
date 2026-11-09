// resources/js/components/layout/Header.jsx
import React, { useEffect, useRef, useState } from "react";
import "./css/signup-coherence.css";

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
          <img src="/images/raymoch_logo_deer.svg" alt="" aria-hidden="true" />
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
          <svg width="24" height="24" viewBox="0 0 48 28" aria-hidden="true" focusable="false">
            <g transform="translate(0,2)" stroke="currentColor" fill="none" strokeWidth="2">
              <circle cx="12" cy="8" r="5" />
              <path d="M4 22c0-5 5-8 8-8s8 3 8 8" strokeLinecap="round" />
            </g>
            <g transform="translate(26,5)" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
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
          <a className="menu__login" href={hrefs.login}>Log In</a>
          <hr />
          <a className="menu__signup" href={hrefs.signupIndex}>Sign Up</a>
          <hr />
          <a className="menu__trial" href={hrefs.requestShow}>Request Free Trial</a>
        </nav>
      </header>
    </>
  );
}

const header_csss = `
/* Header (scoped to Header.jsx markup) */
.header{
  height:58px;
  min-height:58px;
  background:#fff;
  border-bottom:1px solid #e5d9cc;
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:0 clamp(16px, 4vw, 48px);
  position:relative;
  flex-shrink:0;
}

.brand{
  display:flex;
  align-items:center;
  gap:10px;
  color:#4f3021;
  text-decoration:none;
}
.brand img{ width:34px; height:34px; display:block; object-fit:contain; }
.brand span{
  font-weight:900;
  font-size:1.3rem;
  letter-spacing:.2px;
  color:#4f3021;
}

.iconbtn{
  width:38px;
  height:38px;
  cursor:pointer;
  padding:6px;
  border-radius:8px;
  display:flex;
  align-items:center;
  justify-content:center;
  position:relative;
}
.iconbtn{ color:#4f3021; border:1px solid #ded2c3; background:#fbf8f3; }
.iconbtn:hover{ color:#382116; border-color:#c8aa8b; background:#f4eadf; }

/* Dropdown menu */
.menu{
  position:absolute;
  right:clamp(16px, 4vw, 48px);
  top:52px;
  background:#fbf8f3;
  border:1px solid #ded2c3;
  border-radius:12px;
  box-shadow:0 18px 46px rgba(42,28,18,.16);
  min-width:210px;
  padding:10px;
  z-index:50;
}
.menu a{
  display:block;
  padding:10px 10px;
  border-radius:10px;
  color:#4a3124;
  text-decoration:none;
  font-weight:700;
}
.menu a:hover{ color:#2f1d14; background:#f3e7cf; }
.menu .menu__login {
  border:1px solid #382116;
  color:#fffaf3;
  background:linear-gradient(135deg,#68442f 0%,#4c2e1f 54%,#2f1b12 100%);
  box-shadow:0 7px 17px rgba(56,33,22,.24);
}
.menu .menu__login:hover,
.menu .menu__login:focus-visible {
  color:#fffaf3;
  background:linear-gradient(135deg,#765039 0%,#573524 54%,#382116 100%);
  box-shadow:0 10px 22px rgba(56,33,22,.30);
}
.menu .menu__signup {
  border:1px solid #315d48;
  color:#f8fff9;
  background:linear-gradient(135deg,#477d62 0%,#2f6f4f 55%,#214c38 100%);
  box-shadow:0 7px 17px rgba(47,111,79,.22);
}
.menu .menu__signup:hover,
.menu .menu__signup:focus-visible {
  border-color:#315d48;
  color:#f8fff9;
  background:linear-gradient(135deg,#528a6d 0%,#38795a 55%,#285743 100%);
  box-shadow:0 10px 22px rgba(47,111,79,.28);
}
.menu .menu__trial {
  border:1px solid #b8833f;
  color:#fffdf8;
  background:linear-gradient(135deg,#d6a75c 0%,#b57b3f 55%,#8c572b 100%);
  box-shadow:0 7px 17px rgba(140,87,43,.22);
}
.menu .menu__trial:hover,
.menu .menu__trial:focus-visible {
  color:#fffdf8;
  background:linear-gradient(135deg,#dfb469 0%,#bf8646 55%,#945d2f 100%);
  box-shadow:0 10px 22px rgba(140,87,43,.28);
}
.menu a:focus-visible {
  outline:3px solid rgba(143,104,71,.22);
  outline-offset:2px;
}
.menu hr{
  border:0;
  border-top:1px solid #e5d9cc;
  margin:6px 0;
}
`;
