// resources/js/pages/Home.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Building2,
  CircleDollarSign,
  Globe2,
  Handshake,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";

import EntireContent from "./EntireContent.jsx";
import HorizontalNavigation from "../components/HorizontalNavigation.jsx";
import { ResponsiveController } from "../components/ResponsiveController.jsx";
import Footer from "../components/layout_master/Footer.jsx";

export default function Home() {
  const [user, setUser] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);

  useEffect(() => {
    if (window.initAfricanSlider) window.initAfricanSlider();
  }, []);

  useEffect(() => {
    let alive = true;

    async function loadUser() {
      try {
        const response = await fetch("/api/me", {
          credentials: "same-origin",
          headers: {
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
        });

        if (response.status === 401 || response.status === 419) {
          if (alive) {
            setUser(null);
            setUserLoaded(true);
          }
          return;
        }

        const data = await response.json().catch(() => ({}));

        if (alive) {
          setUser(response.ok && data?.ok && data?.user ? data.user : null);
          setUserLoaded(true);
        }
      } catch {
        if (alive) {
          setUser(null);
          setUserLoaded(true);
        }
      }
    }

    loadUser();

    return () => {
      alive = false;
    };
  }, []);

  const displayName = useMemo(
    () => user?.display_name || user?.name || "Guest",
    [user],
  );

  const accountLabel = user?.type_of_account || "basic";

  return (
    <ResponsiveController>
      <div className="dashboard-shell">
        <HorizontalNavigation activePath="/home" />

        <main className="dashboard-main">
          <header className="dashboard-topbar">
            <div>
              <p className="eyebrow">
                {userLoaded && user ? `Welcome back, ${displayName}` : "African investment intelligence"}
              </p>
              <h1>Home</h1>
            </div>

            <div className="topbar-actions">
              {/* <form className="dashboard-search" action="/explore" role="search">
                <Search size={17} aria-hidden="true" />
                <label className="sr-only" htmlFor="dashboard-search-input">
                  Search companies, sectors, or regions
                </label>
                <input
                  id="dashboard-search-input"
                  name="q"
                  type="search"
                  placeholder="Search companies, sectorsss, regions…"
                />
              </form> */}

              <button className="notification-button" type="button" aria-label="Notifications" data-tooltip="Notifications">
                <Bell size={18} />
                <span />
              </button>

              {userLoaded && user ? (
                <a className="profile-chip" href="/dashboard" data-tooltip="Open your dashboard">
                  <span className="profile-avatar">{displayName.charAt(0).toUpperCase()}</span>
                  <span className="profile-copy">
                    <strong>{displayName}</strong>
                    <small>{accountLabel}</small>
                  </span>
                </a>
              )
                : (null)}
            </div>
          </header>

          <section
            className="hero dashboard-hero"
            id="hero"
            aria-labelledby="hero-title"
          >
            <div className="hero-copy">
              <span className="hero-kicker"><Sparkles size={15} /> Trusted African intelligence</span>
              <h2 id="hero-title">Redefining African Potential</h2>
              <p>
                Connect with credible businesses through verified data, cultural
                trust signals, and actionable market intelligence built for Africa.
              </p>
              <div className="hero-actions">
                <a className="hero-primary" href="/explore" data-tooltip="Explore verified businesses">Explore businesses</a>
                <a className="hero-secondary" href="/matching" data-tooltip="Find a trusted match">Find a match</a>
              </div>
            </div>

            <div className="hero-signals" aria-label="Platform trust overview">
              <div className="hero-signal signal-cts" aria-label="CTS verified trust signal">
                <div className="signal-track" aria-hidden="true">
                  <div className="signal-orbit signal-orbit-large" />
                  <div className="signal-orbit signal-orbit-small" />
                  <span className="signal-node signal-node-one"><Building2 size={15} /></span>
                  <span className="signal-node signal-node-two"><CircleDollarSign size={15} /></span>
                  <span className="signal-node signal-node-three"><TrendingUp size={15} /></span>
                </div>
                <div className="signal-core">
                  <ShieldCheck size={27} />
                  <strong>CTS</strong>
                  <span>Verified trust</span>
                </div>
              </div>

              <div className="hero-signal signal-ats" aria-label="ATS opportunity signal">
                <div className="signal-track" aria-hidden="true">
                  <div className="signal-orbit signal-orbit-large" />
                  <div className="signal-orbit signal-orbit-small" />
                  <span className="signal-node signal-node-one"><Target size={15} /></span>
                  <span className="signal-node signal-node-two"><Globe2 size={15} /></span>
                  <span className="signal-node signal-node-three"><Handshake size={15} /></span>
                </div>
                <div className="signal-core">
                  <Target size={27} />
                  <strong>ATS</strong>
                  <span>Opportunity fit</span>
                </div>
              </div>
            </div>
          </section>

          <EntireContent />

        </main>

        <Footer />

        <style>{`
          :root {
            color-scheme: light;
            --dash-blue: #5b3825;
            --dash-blue-dark: #382116;
            --dash-text: #1c1d1f;
            --dash-muted: #7a746d;
            --dash-line: #ded2c3;
            --dash-bg: #f7f2ea;
            --dash-card: #fbf8f3;
            --dash-green: #2f6f4f;
            --dash-gold: #b57b3f;
          }

          * { box-sizing: border-box; }
          html { scroll-behavior: smooth; }
          body {
            margin: 0;
            background: var(--dash-bg);
            color: var(--dash-text);
            font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          }
          button, input { font: inherit; }
          a, button { -webkit-tap-highlight-color: transparent; }

          [data-tooltip] { position: relative; }
          [data-tooltip]::before,
          [data-tooltip]::after {
            position: absolute;
            left: 50%;
            z-index: 120;
            pointer-events: none;
            opacity: 0;
            transform: translate(-50%, 5px);
            transition: opacity .18s ease, transform .18s ease;
          }
          [data-tooltip]::before {
            content: attr(data-tooltip);
            bottom: calc(100% + 9px);
            width: max-content;
            max-width: min(240px, 80vw);
            padding: 7px 10px;
            border: 1px solid rgba(255,255,255,.12);
            border-radius: 8px;
            color: #fff;
            background: rgba(24, 24, 26, .96);
            box-shadow: 0 8px 24px rgba(30,20,14,.2);
            font-size: .72rem;
            font-weight: 700;
            line-height: 1.25;
            letter-spacing: .01em;
            text-align: center;
            white-space: normal;
          }
          [data-tooltip]::after {
            content: "";
            bottom: calc(100% + 4px);
            width: 9px;
            height: 9px;
            border-right: 1px solid rgba(255,255,255,.12);
            border-bottom: 1px solid rgba(255,255,255,.12);
            background: rgba(24, 24, 26, .96);
            transform: translate(-50%, 1px) rotate(45deg);
          }
          [data-tooltip]:hover::before,
          [data-tooltip]:hover::after,
          [data-tooltip]:focus-visible::before,
          [data-tooltip]:focus-visible::after {
            opacity: 1;
          }
          [data-tooltip]:hover::before,
          [data-tooltip]:focus-visible::before {
            transform: translate(-50%, 0);
          }
          [data-tooltip]:hover::after,
          [data-tooltip]:focus-visible::after {
            transform: translate(-50%, -4px) rotate(45deg);
          }

          .dashboard-shell { min-height: 100vh; background: var(--dash-bg); }
          .dashboard-main { min-height: 100vh; margin-left: 0; padding: 24px 30px 32px; }
          .dashboard-topbar { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-bottom: 18px; }
          .eyebrow { margin: 0 0 3px; color: var(--dash-muted); font-size: .78rem; font-weight: 650; }
          .dashboard-topbar h1 { margin: 0; font-size: clamp(1.55rem, 2vw, 2rem); letter-spacing: -.04em; }
          .topbar-actions { display: flex; align-items: center; justify-content: flex-end; gap: 9px; }
          .dashboard-search { width: min(330px, 31vw); height: 40px; display: flex; align-items: center; gap: 8px; padding: 0 12px; border: 1px solid var(--dash-line); border-radius: 11px; background: #fbf8f3; color: #8b8178; }
          .dashboard-search input { width: 100%; border: 0; outline: 0; background: transparent; color: var(--dash-text); font-size: .82rem; }
          .notification-button { position: relative; display: grid; place-items: center; width: 40px; height: 40px; border: 1px solid var(--dash-line); border-radius: 11px; background: #fbf8f3; color: #5d5a57; cursor: pointer; }
          .notification-button span { position: absolute; top: 8px; right: 8px; width: 7px; height: 7px; border: 2px solid #fbf8f3; border-radius: 50%; background: #a85846; }
          .profile-chip { height: 42px; display: flex; align-items: center; gap: 9px; padding: 4px 10px 4px 5px; border: 1px solid var(--dash-line); border-radius: 12px; color: var(--dash-text); background: #fbf8f3; text-decoration: none; }
          .profile-avatar { display: grid; place-items: center; width: 31px; height: 31px; border-radius: 9px; color: #fbf8f3; background: linear-gradient(145deg, #8f6847, #5b3825); font-size: .78rem; font-weight: 850; }
          .profile-copy { display: grid; gap: 1px; }
          .profile-copy strong { max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: .75rem; }
          .profile-copy small { color: var(--dash-muted); font-size: .66rem; text-transform: capitalize; }
          .primary-button { display: inline-flex; align-items: center; justify-content: center; min-height: 40px; padding: 0 15px; border-radius: 10px; color: #fbf8f3; background: var(--dash-blue); text-decoration: none; font-size: .82rem; font-weight: 800; }

          .hero.dashboard-hero {
            position: relative;
            min-height: 310px;
            display: grid;
            grid-template-columns: minmax(0, 1.2fr) minmax(400px, .8fr);
            align-items: center;
            gap: 30px;
            padding: clamp(30px, 5vw, 58px);
            overflow: hidden;
            border: 1px solid #70492f;
            border-radius: 20px;
            color: #fbf8f3;
            background: radial-gradient(circle at 80% 15%, rgba(226,183,100,.18), transparent 28%), linear-gradient(120deg, #382116 0%, #5b3825 48%, #8f6847 100%);
            box-shadow: 0 18px 42px rgba(42,28,18,.12);
          }
          .hero.dashboard-hero::after { content: ""; position: absolute; inset: auto -80px -150px auto; width: 350px; height: 350px; border: 1px solid rgba(255,255,255,.12); border-radius: 50%; }
          .hero-copy { position: relative; z-index: 2; max-width: 680px; }
          .hero-kicker { display: inline-flex; align-items: center; gap: 7px; padding: 6px 10px; border: 1px solid rgba(255,255,255,.2); border-radius: 999px; color: #f3e7cf; background: rgba(255,255,255,.08); font-size: .76rem; font-weight: 800; letter-spacing: .02em; }
          .hero-copy h2 { max-width: 650px; margin: 18px 0 14px; font-size: clamp(2.35rem, 5vw, 4.75rem); line-height: .96; letter-spacing: -.055em; }
          .hero-copy p { max-width: 620px; margin: 0; color: #eee2d4; font-size: clamp(1rem, 1.4vw, 1.12rem); line-height: 1.65; }
          .hero-actions { display: flex; gap: 10px; margin-top: 25px; flex-wrap: wrap; }
          .hero-actions a { display: inline-flex; align-items: center; justify-content: center; min-height: 43px; padding: 0 17px; border-radius: 10px; text-decoration: none; font-size: .84rem; font-weight: 850; }
          .hero-primary { color: #382116; background: #fbf8f3; }
          .hero-secondary { border: 1px solid rgba(255,255,255,.3); color: #fbf8f3; background: rgba(255,255,255,.08); }
          .hero-signals { position: relative; z-index: 2; display: grid; grid-template-columns: repeat(2, 190px); justify-content: center; gap: 20px; }
          .hero-signal { position: relative; width: 190px; height: 190px; display: grid; place-items: center; isolation: isolate; }
          .signal-track { position: absolute; inset: 0; border-radius: 50%; transform-origin: center; }
          .signal-cts .signal-track { animation: signal-clockwise 18s linear infinite; }
          .signal-ats .signal-track { animation: signal-counterclockwise 18s linear infinite; }
          .signal-orbit { position: absolute; border: 1px solid rgba(255,255,255,.25); border-radius: 50%; }
          .signal-orbit-large { inset: 7px; }
          .signal-orbit-small { inset: 35px; border-style: dashed; }
          .signal-core { position: relative; z-index: 2; width: 92px; height: 92px; display: grid; place-items: center; align-content: center; gap: 1px; border: 1px solid rgba(255,255,255,.3); border-radius: 50%; background: rgba(255,255,255,.14); box-shadow: 0 16px 38px rgba(42,28,18,.16); backdrop-filter: blur(8px); }
          .signal-ats .signal-core { background: rgba(143,104,71,.22); }
          .signal-core strong { margin-top: 3px; font-size: 1rem; }.signal-core span { color: #f3e7cf; font-size: .58rem; }
          .signal-node { position: absolute; display: grid; place-items: center; width: 34px; height: 34px; border: 1px solid rgba(255,255,255,.35); border-radius: 50%; color: #5b3825; background: #fbf8f3; box-shadow: 0 8px 20px rgba(42,28,18,.14); }
          .signal-ats .signal-node { color: #6d513d; }
          .signal-node-one { top: 13px; left: 31px; }.signal-node-two { top: 77px; right: 0; }.signal-node-three { bottom: 10px; left: 51px; }
          .signal-node-one { animation: signal-node-pulse 1.8s ease-in-out infinite; }
          @keyframes signal-clockwise { to { transform: rotate(360deg); } }
          @keyframes signal-counterclockwise { to { transform: rotate(-360deg); } }
          @keyframes signal-node-pulse { 0%, 100% { transform: scale(1); box-shadow: 0 8px 20px rgba(42,28,18,.14), 0 0 0 0 rgba(255,255,255,.35); } 50% { transform: scale(1.13); box-shadow: 0 10px 24px rgba(42,28,18,.16), 0 0 0 8px rgba(255,255,255,0); } }

          .session-strip { display: flex; align-items: center; justify-content: space-between; gap: 15px; margin-top: 15px; padding: 11px 15px; border: 1px solid #ded2c3; border-radius: 12px; color: #6c655f; background: #fbf8f3; font-size: .78rem; }
          .session-strip > div { display: flex; align-items: center; gap: 9px; flex-wrap: wrap; }
          .session-dot { width: 8px; height: 8px; border-radius: 50%; background: #2fa477; box-shadow: 0 0 0 4px #e7f4ec; }
          .account-pill { padding: 3px 8px; border-radius: 999px; color: #5b3825; background: #f3e7cf; font-weight: 800; text-transform: capitalize; }
          .session-strip a { color: var(--dash-blue); text-decoration: none; font-weight: 800; white-space: nowrap; }

          .stats-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 15px; margin-top: 18px; }
          .metric-card { min-height: 128px; display: flex; align-items: flex-start; gap: 13px; padding: 17px; border: 1px solid var(--dash-line); border-radius: 16px; background: #fbf8f3; box-shadow: 0 2px 5px rgba(42,28,18,.035); }
          .metric-icon { flex: 0 0 auto; display: grid; place-items: center; width: 36px; height: 36px; border-radius: 10px; }
          .metric-icon.blue { color: #6f452e; background: #f2eadf; }.metric-icon.green { color: #2f6f4f; background: #e7f4ec; }.metric-icon.gold { color: #9a6233; background: #f3e7cf; }.metric-icon.violet { color: #76513b; background: #f0e6dc; }
          .metric-card > div:last-child { display: grid; gap: 4px; }
          .metric-card span { color: #5d5a57; font-size: .77rem; font-weight: 750; }
          .metric-card strong { font-size: 1.65rem; letter-spacing: -.045em; }
          .metric-card small { color: #7a746d; font-size: .69rem; line-height: 1.4; }

          .content-grid { display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(340px, .85fr); gap: 18px; margin-top: 18px; }
          .dashboard-panel { border: 1px solid var(--dash-line); border-radius: 17px; background: #fbf8f3; box-shadow: 0 2px 5px rgba(42,28,18,.035); }
          .about-panel, .trust-panel { padding: clamp(22px, 3.2vw, 35px); }
          .section-label { display: block; margin-bottom: 8px; color: var(--dash-blue); font-size: .7rem; font-weight: 900; letter-spacing: .11em; text-transform: uppercase; }
          .about-panel h2, .trust-panel h2, .section-heading h2 { margin: 0; font-size: clamp(1.3rem, 2.1vw, 1.85rem); letter-spacing: -.035em; }
          .about-panel p { max-width: 740px; margin: 14px 0 19px; color: #5d5a57; font-size: .95rem; line-height: 1.7; }
          .text-link { display: inline-flex; align-items: center; gap: 8px; color: var(--dash-blue); text-decoration: none; font-size: .79rem; font-weight: 850; }
          .text-link span { transition: transform .18s ease; }.text-link:hover span { transform: translateX(3px); }
          .panel-title-row { display: flex; justify-content: space-between; gap: 15px; }
          .trust-score { flex: 0 0 auto; display: grid; place-items: center; align-content: center; width: 70px; height: 70px; border: 6px solid #e7f4ec; border-top-color: var(--dash-green); border-radius: 50%; }
          .trust-score strong { font-size: 1.16rem; line-height: 1; }.trust-score span { margin-top: 3px; color: #7a746d; font-size: .56rem; }
          .trust-list { display: grid; gap: 13px; margin: 22px 0 0; padding: 0; list-style: none; }
          .trust-list li { display: flex; align-items: flex-start; gap: 10px; color: #6f6861; font-size: .76rem; line-height: 1.45; }
          .trust-list li > svg { flex: 0 0 auto; margin-top: 2px; color: var(--dash-green); }
          .trust-list li span { display: grid; gap: 2px; }.trust-list li strong { color: #382f2a; font-size: .81rem; }

          .services-section { margin-top: 25px; }
          .section-heading { display: flex; align-items: flex-end; justify-content: space-between; gap: 18px; margin-bottom: 14px; }
          .section-heading.compact { align-items: center; padding: 20px 21px 14px; margin: 0; border-bottom: 1px solid #e7ddd1; }
          .service-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 15px; }
          .service-card { position: relative; min-height: 232px; display: flex; flex-direction: column; padding: 21px; overflow: hidden; border: 1px solid var(--dash-line); border-radius: 17px; color: var(--dash-text); background: #fbf8f3; text-decoration: none; transition: transform .18s ease, box-shadow .18s ease; }
          .service-card::after { content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 4px; background: currentColor; }
          .service-card:hover { transform: translateY(-3px); box-shadow: 0 13px 28px rgba(42,28,18,.09); }
          .service-card.blue { color: #6f452e; }.service-card.gold { color: #a66f38; }.service-card.green { color: #3f7659; }
          .service-icon { display: grid; place-items: center; width: 40px; height: 40px; border-radius: 11px; background: currentColor; }
          .service-icon svg { color: #fbf8f3; }
          .service-card h3 { margin: 24px 0 8px; color: var(--dash-text); font-size: 1.03rem; }
          .service-card p { margin: 0; color: #6f7681; font-size: .82rem; line-height: 1.6; }
          .service-link { display: inline-flex; align-items: center; gap: 7px; margin-top: auto; padding-top: 17px; font-size: .76rem; font-weight: 850; }

          .investment-panel-shell { margin-top: 18px; overflow: hidden; }
          .live-status { display: inline-flex; align-items: center; gap: 7px; color: #26815f; font-size: .72rem; font-weight: 850; }
          .live-status span { width: 8px; height: 8px; border-radius: 50%; background: #3f7659; box-shadow: 0 0 0 4px #e7f4ec; }
          .investment-panel-content { padding: 5px 18px 18px; }
          .investment-panel-content > * { max-width: 100%; }

          .quote-panel { position: relative; margin-top: 18px; padding: 31px clamp(24px, 5vw, 60px); overflow: hidden; border-radius: 17px; color: #fbf8f3; background: linear-gradient(120deg, #382116, #5b3825); }
          .quote-panel::after { content: ""; position: absolute; right: -60px; top: -110px; width: 260px; height: 260px; border: 1px solid rgba(255,255,255,.13); border-radius: 50%; }
          .quote-mark { height: 35px; color: #e2b764; font-family: Georgia, serif; font-size: 4rem; line-height: 1; }
          .quote-panel blockquote { position: relative; z-index: 1; max-width: 750px; margin: 3px 0 7px; font-family: Georgia, serif; font-size: clamp(1.35rem, 2.5vw, 2rem); line-height: 1.25; }
          .quote-panel cite { color: #ead8c1; font-size: .78rem; font-style: normal; font-weight: 750; }
          .quote-panel p { position: relative; z-index: 1; max-width: 690px; margin: 18px 0 0; color: #eee2d4; font-size: .82rem; line-height: 1.6; }

          .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }

          @media (max-width: 1120px) {
            .stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            .content-grid { grid-template-columns: 1fr; }
            .service-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            .service-card:last-child { grid-column: 1 / -1; min-height: 205px; }
          }

          @media (max-width: 840px) {
            .dashboard-main { margin-left: 0; padding: 18px 18px 30px; }
            .hero.dashboard-hero { grid-template-columns: 1fr; }
            .hero-signals { display: none; }
          }

          @media (max-width: 650px) {
            .dashboard-topbar { align-items: flex-start; }
            .eyebrow { display: none; }
            .dashboard-search { display: none; }
            .profile-copy { display: none; }
            .profile-chip { padding-right: 5px; }
            .hero.dashboard-hero { min-height: 0; padding: 28px 22px; border-radius: 16px; }
            .hero-copy h2 { font-size: clamp(2.25rem, 13vw, 3.5rem); }
            .session-strip { align-items: flex-start; }
            .stats-grid, .service-grid { grid-template-columns: 1fr; }
            .service-card:last-child { grid-column: auto; }
            .metric-card { min-height: 111px; }
            .section-heading { align-items: flex-start; flex-direction: column; }
            .section-heading.compact { flex-direction: row; align-items: center; }
            .panel-title-row { align-items: flex-start; }
          }

          @media (max-width: 430px) {
            .dashboard-main { padding-inline: 12px; }
            .hero-actions { display: grid; }
            .hero-actions a { width: 100%; }
            .session-strip { display: grid; }
          }

          @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after { scroll-behavior: auto !important; transition: none !important; animation: none !important; }
          }
        `}</style>

      </div>
    </ResponsiveController>
  );
}
