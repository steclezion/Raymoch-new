import React from "react";

const GROUPS = [
  { title: "Company", links: [["About", "about", "/about"], ["Careers", "careers", "/careers"], ["Press", "press", "/press"], ["Contact", "contact", "/contact"]] },
  { title: "Product", links: [["Explore Businesses", "explore", "/explore"], ["Market Insights", "insights", "/insights"], ["Verification", "verification", "/verification"], ["Programs & Services", "services", "/services"]] },
  { title: "Resources", links: [["Blog", "blog", "/blog"], ["Help Center", "help", "/help"], ["Security", "security", "/security"], ["System Status", "status", "/status"]] },
];

export default function Footer({ routes = {} }) {
  const href = (name, fallback) => routes[name] || fallback;

  return (
    <footer className="site-footer" id="site-footer">
      <div className="site-footer__accent" aria-hidden="true" />
      <div className="site-footer__inner">
        <div className="site-footer__main">
          <section className="site-footer__brand" aria-label="About Raymoch">
            <a className="site-footer__brand-link" href="/" aria-label="Raymoch home">
              <span className="site-footer__logo" aria-hidden="true">
                <img src="/images/logo_preview_exact.svg" alt="" />
              </span>
              <span>Raymoch</span>
            </a>
            <p>
              Connecting investors and entrepreneurs through trusted data,
              verified opportunities, and actionable African market insights.
            </p>
            <div className="site-footer__trust">
              <span aria-hidden="true" /> Built for trusted growth
            </div>
          </section>

          <nav className="site-footer__navigation" aria-label="Footer navigation">
            {GROUPS.map((group) => (
              <div className="site-footer__group" key={group.title}>
                <h2>{group.title}</h2>
                <ul>
                  {group.links.map(([label, name, fallback]) => (
                    <li key={name}><a href={href(name, fallback)}>{label}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="site-footer__bottom">
          <p>© {new Date().getFullYear()} Raymoch. All rights reserved.</p>
          <nav aria-label="Legal">
            <a href={href("privacy", "/privacy")}>Privacy</a>
            <a href={href("terms", "/terms")}>Terms</a>
          </nav>
        </div>
      </div>

      <style>{`
        .site-footer, .site-footer * { box-sizing: border-box; }
        .site-footer {
          position: relative; width: 100%; overflow: hidden;
          color: #b8c4d6; background: #0b1425;
          border-top: 1px solid #1d2b42;
        }
        .site-footer__accent {
          position: absolute; inset: 0 0 auto; height: 2px;
          background: linear-gradient(90deg, transparent, #3478e5 24%, #52b98d 72%, transparent);
          opacity: .8;
        }
        .site-footer__inner {
          width: min(100%, 1280px); margin: 0 auto;
          padding: 44px clamp(20px, 4vw, 56px) 22px;
        }
        .site-footer__main {
          display: grid; grid-template-columns: minmax(250px, 1.25fr) minmax(480px, 2fr);
          gap: clamp(54px, 8vw, 112px); align-items: start;
        }
        .site-footer__brand { max-width: 390px; }
        .site-footer__brand-link {
          width: fit-content; display: inline-flex; align-items: center; gap: 11px;
          color: #fff; text-decoration: none; font-size: 1.2rem;
          font-weight: 800; letter-spacing: .01em;
        }
        .site-footer__logo {
          width: 36px; height: 36px; display: grid; place-items: center; overflow: hidden;
        }
        .site-footer__logo img { width: 100%; height: 100%; display: block; object-fit: contain; }
        .site-footer__brand p {
          margin: 16px 0 18px; color: #93a2b8; font-size: .86rem; line-height: 1.75;
        }
        .site-footer__trust {
          display: inline-flex; align-items: center; gap: 8px; color: #a9b8ca;
          font-size: .72rem; font-weight: 700; letter-spacing: .035em; text-transform: uppercase;
        }
        .site-footer__trust span {
          width: 7px; height: 7px; border-radius: 50%; background: #52b98d;
          box-shadow: 0 0 0 4px rgba(82,185,141,.12);
        }
        .site-footer__navigation {
          display: grid; grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: clamp(24px, 4vw, 58px);
        }
        .site-footer__group h2 {
          margin: 0 0 15px; color: #f5f7fb; font-size: .76rem;
          font-weight: 800; letter-spacing: .08em; text-transform: uppercase;
        }
        .site-footer__group ul { display: grid; gap: 10px; margin: 0; padding: 0; list-style: none; }
        .site-footer a { transition: color 150ms ease; }
        .site-footer__group a, .site-footer__bottom a {
          color: #9eacc0; text-decoration: none; font-size: .82rem;
        }
        .site-footer__group a:hover, .site-footer__group a:focus-visible,
        .site-footer__bottom a:hover, .site-footer__bottom a:focus-visible { color: #fff; }
        .site-footer a:focus-visible {
          outline: 2px solid #70a2ef; outline-offset: 4px; border-radius: 2px;
        }
        .site-footer__bottom {
          display: flex; align-items: center; justify-content: space-between; gap: 20px;
          margin-top: 38px; padding-top: 20px; border-top: 1px solid rgba(148,163,184,.16);
        }
        .site-footer__bottom p { margin: 0; color: #7f8da2; font-size: .75rem; }
        .site-footer__bottom nav { display: flex; gap: 22px; }
        @media (max-width: 840px) {
          .site-footer__inner { padding-top: 36px; }
          .site-footer__main { grid-template-columns: 1fr; gap: 34px; }
          .site-footer__brand { max-width: 520px; }
        }
        @media (max-width: 560px) {
          .site-footer__inner { padding: 32px 18px 20px; }
          .site-footer__navigation { grid-template-columns: repeat(2, minmax(0, 1fr)); row-gap: 28px; }
          .site-footer__group:last-child { grid-column: 1 / -1; }
          .site-footer__bottom { align-items: flex-start; flex-direction: column; margin-top: 30px; }
        }
        @media (max-width: 380px) {
          .site-footer__navigation { grid-template-columns: 1fr; }
          .site-footer__group:last-child { grid-column: auto; }
        }
        @media (prefers-reduced-motion: reduce) { .site-footer a { transition: none; } }
      `}</style>
    </footer>
  );
}
