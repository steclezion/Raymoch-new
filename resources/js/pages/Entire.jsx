// resources/js/components/Entire.jsx
import React, { useEffect, useState } from "react";

// Adjust these imports to your real paths
import Header from "../components/layout_master/Header.jsx";
import Footer from "../components/layout_master/Footer.jsx";
import AfricaInvestmentPanel from "../components/AfricaInvestmentPanel.jsx";
import { ResponsiveController } from "../components/ResponsiveController.jsx";

const Entire = () => {
  const [user, setUser] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);

  // keep old slider init working if it exists
  useEffect(() => {
    if (window.initAfricanSlider) window.initAfricanSlider();
  }, []);

  // ✅ Fetch logged-in user session data
  useEffect(() => {
    let alive = true;

    const loadMe = async () => {
      try {
        const res = await fetch("/api/me", {
          credentials: "same-origin",
          headers: {
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
        });

        // Not logged in (401) or session expired / CSRF mismatch (419)
        if (res.status === 401 || res.status === 419) {
          if (!alive) return;
          setUser(null);
          setUserLoaded(true);
          return;
        }

        const json = await res.json().catch(() => ({}));

        if (!alive) return;

        if (res.ok && json?.ok && json?.user) {
          setUser(json.user);
        } else {
          setUser(null);
        }
        setUserLoaded(true);
      } catch (e) {
        if (!alive) return;
        setUser(null);
        setUserLoaded(true);
      }
    };

    loadMe();

    return () => {
      alive = false;
    };
  }, []);

  const formatDate = (iso) => {
    if (!iso) return "";
    try {
      return new Date(iso).toLocaleDateString();
    } catch {
      return "";
    }
  };

  return (
    <>
      <ResponsiveController>
        {/* ✅ pass user into Header so you can show it there too */}
        <Header user={user} />

        {/* ✅ Show user info on first page if logged in */}
        {userLoaded && user && (
          <section className="authBar" aria-label="Logged in user info">
            <div className="authBarInner">
              <div className="authLeft">
                <div className="hello">
                  Welcome,{" "}
                  <strong>{user.display_name || user.name || "User"}</strong> 👋
                </div>
                <div className="meta">
                  <span className="pill">{user.type_of_account || "basic"}</span>
                  {user.email ? <span className="dim">{user.email}</span> : null}
                  {user.trial_ends_at ? (
                    <span className="dim">
                      Trial ends: <strong>{formatDate(user.trial_ends_at)}</strong>
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="authRight">
                <a className="authBtn" href="/dashboard">
                  Go to Dashboard
                </a>
              </div>
            </div>
          </section>
        )}

        <section className="hero" id="hero" aria-label="RAYMOCH: Redefining African Potential">
          <div className="hero-inner">
            <h1>Redefining African Potential</h1>
            <p>
              At Raymoch, we connect investors and entrepreneurs through trust,
              verified data, and actionable insights. Our mission is to unlock
              visibility and capital for businesses across Africa and beyond.
            </p>
          </div>
        </section>

        <main className="wrap">
          {/* ========== WHO WE ARE ========== */}
          <section className="about" id="about">
            <div className="grid">
              <div>
                <h2 style={{ marginBottom: "8px" }}>Who We Are</h2>
                <p className="lead">
                  We build trust rails so capital can move with context. Verified
                  company profiles, a Cultural Trust Index, and market intelligence
                  make it easier to discover credible African businesses and back them
                  with confidence.
                </p>
                <div className="about-stats">
                  <div className="stat">
                    <small>Companies Tracked</small>12,400+
                  </div>
                  <div className="stat">
                    <small>Active Sectors</small>24
                  </div>
                  <div className="stat">
                    <small>Countries Covered</small>55
                  </div>
                </div>
              </div>
              <div className="card">
                <h3 style={{ margin: "0 0 8px" }}>How trust is earned</h3>
                <ul>
                  <li>Multi-source verification (documents, references, public records)</li>
                  <li>CTI badges reflect completeness, integrity, and recency</li>
                  <li>Signals layer highlights policy changes and incentives</li>
                </ul>
              </div>
            </div>
          </section>

          {/* ========== WHAT WE DO ========== */}
          <section className="section" id="what-we-do">
            <h2>What We Do</h2>
            <div className="blocks">
              <a className="block blue" href="Matching.html">
                <h3>Trusted Matching</h3>
                <p>
                  Find and connect with businesses that align with your vision,
                  using our Cultural Trust Index and verified data.
                </p>
              </a>
              <a className="block gold" href="Market_Insight.html">
                <h3>Deep Insights</h3>
                <p>
                  Access market intelligence, sector reports, and regional briefs
                  that help you make informed investment decisions.
                </p>
              </a>
              <a className="block gray" href="partner-programs.html">
                <h3>Community &amp; Growth</h3>
                <p>
                  Partner programs and opportunities to expand networks and
                  accelerate growth.
                </p>
              </a>
            </div>
          </section>

          {/* ========== AFRICA INVESTMENT PANEL (React) ========== */}
          <AfricaInvestmentPanel apiEndpoint="/api/africa/companies" pollMs={6000} />

          {/* ========== QUOTE + BIO ========== */}
          <section className="quote-block">
            <div className="quote-inner">
              <div className="quote-text">“It always seems impossible until it’s done.”</div>
              <div className="quote-attr">— Nelson Mandela</div>
              <p className="quote-bio">
                Raymoch is building trusted digital rails for African entrepreneurship:
                verified company profiles, a Cultural Trust Index, and market intelligence,
                so capital can find credible opportunities faster.
              </p>
            </div>
          </section>
        </main>

        <Footer />
      </ResponsiveController>

      {/* ✅ Minimal CSS for the top logged-in bar */}
      <style>{`
        .authBar{
          background: #0b1020;
          color: #e5e7eb;
          border-bottom: 1px solid #1f2937;
        }
        .authBarInner{
          max-width: 1200px;
          margin: 0 auto;
          padding: 10px 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
        }
        .hello{ font-weight: 800; }
        .meta{
          display:flex;
          align-items:center;
          gap:10px;
          margin-top:4px;
          flex-wrap:wrap;
        }
        .pill{
          background: rgba(255,255,255,.12);
          border: 1px solid rgba(255,255,255,.18);
          padding: 3px 10px;
          border-radius: 999px;
          font-size: .85rem;
          font-weight: 800;
          text-transform: capitalize;
        }
        .dim{ opacity: .85; font-size: .92rem; }
        .authBtn{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          padding: 9px 12px;
          border-radius: 10px;
          background: #ffffff;
          color: #0b1020;
          text-decoration:none;
          font-weight: 900;
          border: 1px solid #e5e7eb;
          white-space: nowrap;
        }
        .authBtn:hover{ filter: brightness(.95); }
        @media (max-width: 720px){
          .authBarInner{ flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </>
  );
};

export default Entire;
