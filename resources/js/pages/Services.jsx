// resources/js/components/Services.jsx
import React, { useEffect } from "react";
// Adjust this import according to your actual file/location/exports:
import Header from "../components/layout_master/Header.jsx";
import Footer from "../components/layout_master/Footer.jsx";
import AfricaInvestmentPanel from "../components/AfricaInvestmentPanel.jsx";

const Services = () => {
  /* ================= JS ================= */
  useEffect(() => {
    // Tier-1 Explore menu toggle
    (() => {
      const btn = document.getElementById("exploreToggle");
      const menu = document.getElementById("t1Menu");
      if (!btn || !menu) return;

      const openMenu = (on) => {
        btn.setAttribute("aria-expanded", on ? "true" : "false");
        menu.hidden = !on;
      };

      const onBtnClick = (e) => {
        e.preventDefault();
        openMenu(btn.getAttribute("aria-expanded") !== "true");
      };

      const onDocClick = (e) => {
        if (!menu.hidden && !menu.contains(e.target) && !btn.contains(e.target)) {
          openMenu(false);
        }
      };

      const onKeyDown = (e) => {
        if (e.key === "Escape") openMenu(false);
      };

      btn.addEventListener("click", onBtnClick);
      document.addEventListener("click", onDocClick);
      document.addEventListener("keydown", onKeyDown);

      return () => {
        btn.removeEventListener("click", onBtnClick);
        document.removeEventListener("click", onDocClick);
        document.removeEventListener("keydown", onKeyDown);
      };
    })();

    // A11y roles for menu items
    (() => {
      const menu = document.getElementById("t1Menu");
      menu?.querySelectorAll("a.menu-item").forEach((a) => a.setAttribute("role", "menuitem"));
    })();
  }, []);

  const css = `
/* =========================================================
   RAYMOCH COLOR SYSTEM — MASTER TOKENS (GLOBAL DEFAULTS)
   (Copied from landing to guarantee consistency)
   ========================================================= */
:root{
  --brand-blue:#0328aeed;
  --brand-blue-700:#213bb1;
  --brand-blue-500:#041b64;
  --accent-gold:#7a7797a8;

  --ink:#101114;
  --muted:#3c4b69;
  --bg:#fafafa;        /* light page background */
  --border:#e8e8ee;
  --card:#ffffff;

  --radius:14px; --pill:999px;
  --shadow:0 6px 22px rgba(10,42,107,.08);
  --maxw:1328px; --gutter:18px;

  --footer-bg:#0b1020; /* single source of truth */
}

*{box-sizing:border-box;margin:0;padding:0;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif}

/* ========= Canvas + Overscroll fixes (no white under footer) ========= */
html{
  background:var(--footer-bg);           /* canvas matches footer */
  height:100%;
}
body{
  color:var(--ink);
  line-height:1.5;
  min-height:100dvh;
  display:flex;
  flex-direction:column;
  overscroll-behavior-y:none;            /* stop bounce on modern engines */

  /* Light page → fades to footer color near the bottom.
     This masks iOS rubber-band past the end. */
  background:
    linear-gradient(to bottom,
      var(--bg) 0%,
      var(--bg) calc(100% - 240px),
      var(--footer-bg) calc(100% - 240px),
      var(--footer-bg) 100%);
}
/* iOS safe-area guard so the very bottom sliver stays dark too */
body::after{
  content:"";
  position:fixed;
  inset:auto 0 0 0;
  height:env(safe-area-inset-bottom, 0);
  background:var(--footer-bg);
  pointer-events:none;
  z-index:1;
}

a{color:inherit;text-decoration:none}
img{max-width:100%;display:block}
.wrap{max-width:var(--maxw);margin:0 auto;padding:0 var(--gutter)}
main{flex:1}

/* ===================== HERO (services) ===================== */
.hero{
  width:100%;
  margin:0;
  background:linear-gradient(135deg, var(--brand-blue-700), var(--brand-blue-500));
  color:#fff;
  padding:clamp(40px,4vw,80px) 0;
  text-align:left;
  border-bottom:1px solid var(--border);
}
.hero .wrap{display:flex;flex-direction:column;gap:10px}
.hero h2{
  margin:0;font-weight:900;font-size:clamp(32px,5vw,52px);letter-spacing:.2px;
  background:linear-gradient(90deg,#fff,#e7efff);
  -webkit-background-clip:text;
  background-clip:text;
  color:transparent
}
.hero p{margin:6px 0 0;max-width:900px;font-size:clamp(16px,2vw,20px);color:#DDEBFF}

/* ===================== SERVICES GRID ===================== */
.container{max-width:1100px;margin:0 auto;padding:24px}
.svc-menu{margin-top:clamp(28px,6vw,72px); margin-bottom:clamp(48px,10vw,128px)}
.svc-grid{display:grid;grid-template-columns:repeat(12,1fr);gap:20px}
.svc-col-3{grid-column:span 3}
.svc-box{
  display:block;border:1px solid var(--border);border-radius:20px;background:var(--card);
  padding:28px 24px 24px;box-shadow:var(--shadow);text-decoration:none;color:inherit;
  transition:transform .12s ease, box-shadow .12s ease;min-height:190px
}
.svc-box:hover{transform:translateY(-2px);box-shadow:0 14px 36px rgba(6,60,168,.12)}
.svc-box h3{margin:0 0 6px;font-size:18px}
.svc-box p{margin:6px 0 0;color:#475569}
@media (max-width: 900px){
  .svc-grid{grid-template-columns:1fr}
  .svc-col-3{grid-column:span 12}
}

/* ================= FOOTER pinned by flex; color matches canvas ================= */
footer{margin-top:auto;background:var(--footer-bg);color:#cbd5e1;}
@media (max-width: 860px){
  footer .wrap > div[style*="grid-template-columns"]{
    display:grid;grid-template-columns:1fr;gap:16px !important;
  }
}
`;

  return (
    <>
      <style>{css}</style>

      {/* Header & Footer same as your layout_master */}
      <Header />

      {/* ===================== HERO ===================== */}
      <section className="hero" aria-label="Raymoch Services">
        <div className="wrap">
          <h2>Services</h2>
          <p>Build trust. Get seen. Partner smart.</p>
        </div>
      </section>

      <main>
        <div className="container">
          {/* SERVICES MENU */}
          <section className="svc-menu" aria-labelledby="svcMenuTitle">
            <h3
              id="svcMenuTitle"
              style={{ margin: "0 0 8px", color: "var(--brand-blue)" }}
            >
              Choose a service
            </h3>

            <div className="svc-grid" id="svcGrid">
              {/* Blade route() -> use URLs (or use <Link> if react-router) */}
              <a className="svc-box svc-col-3" href="/matching" id="boxMatching">
                <h3>Matching</h3>
                <p>Investor inputs → ranked SME matches.</p>
              </a>

              <a className="svc-box svc-col-3" href="/partner-programs" id="boxPartners">
                <h3>Partner Programs</h3>
                <p>Accelerators &amp; syndicates, plugged in.</p>
              </a>

              <a className="svc-box svc-col-3" href="/verification" id="boxVerify">
                <h3>Verification</h3>
                <p>CTI checks: identity, ownership, basics.</p>
              </a>

              <a
                className="svc-box svc-col-3"
                href="/visibility-listing"
                id="boxListing"
              >
                <h3>Visibility &amp; Listing</h3>
                <p>Get listed. Get discovered.</p>
              </a>
            </div>
          </section>

          {/* Optional: if you want to show panel here too */}
          {/* <div style={{ marginTop: 26 }}>
            <AfricaInvestmentPanel />
          </div> */}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Services;
