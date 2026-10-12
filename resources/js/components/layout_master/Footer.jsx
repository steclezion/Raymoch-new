import React from "react";
import { useAuth } from "../../app.jsx";

const GROUPS = [
  { title: "Company", links: [["About Raymoch", "about", "/about"], ["How Raymoch Works", "howRaymochWorks", "/how-raymoch-works"], ["Trust & Methodology", "trustMethodology", "/Trust_and_Methodology"], ["Partner Programs", "partnerPrograms", "/Partner_Programs"], ["Careers", "careers", "/Careers"], ["Contact", "contact", "/Contact"]] },
  { title: "Product", links: [["Business Discovery", "explore", "/explore"], ["Business Verification", "verification", "/verification"], ["Trusted Matching", "matching", "/matching"], ["Market Insights", "insights", "/insights"], ["For Businesses", "forBusinesses", "/for-businesses"], ["For Investors", "forInvestors", "/for-investors"], ["Pricing", "pricing", "/pricing"]] },
  { title: "Resources", links: [["Insights & Research", "insights", "/insights"], ["Business Readiness Guides", "businessReadiness", "/business-readiness-guides"], ["Verification Guide", "verificationGuide", "/verification-guide"], ["Investor Resources", "investorResources", "/investor-resources"], ["Help Centre", "help", "/help"], ["FAQs", "faqs", "/faqs"], ["Blog", "blog", "/blog"], ["System Status", "status", "/status"]] },
];

export default function Footer({ routes = {} }) {
  const { isAuthenticated } = useAuth();
  const href = (name, fallback) => routes[name] || fallback;
  const normalizePath = (path) => {
    const normalized = path.replace(/\/+$/, "") || "/";
    return normalized.toLowerCase();
  };
  const currentPath = typeof window !== "undefined"
    ? normalizePath(window.location.pathname)
    : "/";
  const isActive = (target) => {
    if (typeof window === "undefined" || !target) return false;

    try {
      const url = new URL(target, window.location.origin);
      return url.origin === window.location.origin && normalizePath(url.pathname) === currentPath;
    } catch {
      return false;
    }
  };
  const activeProps = (target) => isActive(target)
    ? { className: "is-active", "aria-current": "page" }
    : {};

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
                  {group.links.map(([label, name, fallback]) => {
                    const target = href(name, fallback);
                    return (
                      <li key={name}>
                        <a href={target} {...activeProps(target)}>{label}</a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {!isAuthenticated && (
          <nav className="site-footer__actions" aria-label="Account actions">
            <span>Ready to explore trusted business opportunity?</span>
            <div>
              <a href={href("login", "/login")} {...activeProps(href("login", "/login"))}>Log in</a>
              <a href={href("signup", "/signup")} {...activeProps(href("signup", "/signup"))}>Create an account</a>
              <a href={href("trial", "/request-trial")} {...activeProps(href("trial", "/request-trial"))}>Request a free trial</a>
            </div>
          </nav>
        )}

        <div className="site-footer__bottom">
          <p>© {new Date().getFullYear()} Raymoch. All rights reserved.</p>
          <nav aria-label="Legal">
            <a href={href("privacy", "/privacy")} {...activeProps(href("privacy", "/privacy"))}>Privacy</a>
            <a href={href("terms", "/terms")} {...activeProps(href("terms", "/terms"))}>Terms</a>
            <a href={href("cookies", "/cookies")} {...activeProps(href("cookies", "/cookies"))}>Cookies</a>
            <a href={href("dataProtection", "/data-protection")} {...activeProps(href("dataProtection", "/data-protection"))}>Data protection</a>
            <a href={href("accessibility", "/accessibility")} {...activeProps(href("accessibility", "/accessibility"))}>Accessibility</a>
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
        .site-footer__group a {
          display: inline-flex; align-items: center; min-height: 29px;
          margin-left: -9px; padding: 4px 9px; border-left: 2px solid transparent;
          transition: color 150ms ease, background-color 150ms ease, border-color 150ms ease;
        }
        .site-footer__group a.is-active {
          color: #fff; border-left-color: #d4a45e;
          background: rgba(255,255,255,.075); font-weight: 750;
        }
        .site-footer__group a:hover, .site-footer__group a:focus-visible,
        .site-footer__bottom a:hover, .site-footer__bottom a:focus-visible { color: #fff; }
        .site-footer a:focus-visible {
          outline: 2px solid #70a2ef; outline-offset: 4px; border-radius: 2px;
        }
        .site-footer__actions {
          display: flex; align-items: center; justify-content: space-between; gap: 24px;
          margin-top: 36px; padding: 18px 20px; border: 1px solid rgba(148,163,184,.18);
          background: rgba(255,255,255,.025);
        }
        .site-footer__actions > span { color: #d9e1ec; font-size: .82rem; font-weight: 700; }
        .site-footer__actions > div { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .site-footer__actions a {
          padding: 9px 12px; border: 1px solid #31425d; color: #d9e1ec;
          text-decoration: none; font-size: .76rem; font-weight: 800;
        }
        .site-footer__actions a:last-child { border-color: #52b98d; color: #fff; background: #315d48; }
        .site-footer__actions a.is-active {
          border-color: #d4a45e; color: #fff; box-shadow: inset 0 -2px 0 #d4a45e;
        }
        .site-footer__bottom {
          display: flex; align-items: center; justify-content: space-between; gap: 20px;
          margin-top: 38px; padding-top: 20px; border-top: 1px solid rgba(148,163,184,.16);
        }
        .site-footer__bottom p { margin: 0; color: #7f8da2; font-size: .75rem; }
        .site-footer__bottom nav { display: flex; gap: 22px; }
        .site-footer__bottom a.is-active { color: #fff; text-decoration: underline; text-decoration-color: #d4a45e; text-underline-offset: 5px; }
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
          .site-footer__actions { align-items: flex-start; flex-direction: column; }
          .site-footer__actions > div, .site-footer__actions a { width: 100%; }
          .site-footer__actions a { text-align: center; }
          .site-footer__bottom nav { flex-wrap: wrap; }
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
