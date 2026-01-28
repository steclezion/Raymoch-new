// resources/js/pages/About.jsx
import React, { useEffect } from "react";
import Header from "../components/layout_master/Header.jsx";
import Footer from "../components/layout_master/Footer.jsx";
import { ResponsiveController } from "../components/ResponsiveController.jsx";

const About = () => {
  useEffect(() => {
    if (window.initAfricanSlider) window.initAfricanSlider();
  }, []);

  return (
    <ResponsiveController>
      <Header />

      <div className="rm-about">
        <style>{css}</style>

        {/* HERO */}
        <section className="hero">
          <div className="wrap hero-grid">
            <div className="hero-left">
              <h1>We build trust so capital can flow.</h1>
              <p>
                Raymoch is a visibility + trust platform for African and
                diaspora-linked SMEs. We verify businesses, surface credible
                data, and make it easier for customers, partners, and investors
                to act with confidence.
              </p>

              <div className="chip-row">
                <a className="chip" href="#story">
                  📜 Our story
                </a>
                <a className="chip" href="#roadmap">
                  🧭 Roadmap
                </a>
                <a className="chip" href="#principles">
                  🧩 Principles
                </a>
                <a className="chip" href="#team">
                  👥 Team
                </a>
                <a className="chip" href="#contact">
                  ✉️ Contact
                </a>
              </div>
            </div>

            <aside className="hero-aside">
              <div className="kv-mini">
                <span className="k">Focus</span>
                <span className="v">Trust &amp; Visibility</span>
              </div>
              <div className="kv-mini">
                <span className="k">Coverage</span>
                <span className="v">50+ Countries</span>
              </div>
              <div className="kv-mini">
                <span className="k">Method</span>
                <span className="v">CTI Verification</span>
              </div>
            </aside>
          </div>
        </section>

        {/* BODY */}
        <main className="container">
          {/* STORY */}
          <section id="story" className="block grid-2">
            <div className="card">
              <h2 className="h2">The short version</h2>
              <p className="muted">
                Africa’s SMEs are real, resilient, and under-seen. Diaspora
                capital is massive—but allergic to foggy signals. Raymoch clears
                the fog with verified profiles, a Cultural Trust Index (CTI),
                and clean routes from discovery to action.
              </p>

              <div className="timeline">
                <div className="t-item">
                  <h4>Ground truth first</h4>
                  <p className="muted">
                    We start with facts you can check—ownership, operations,
                    certifications, traction.
                  </p>
                </div>
                <div className="t-item">
                  <h4>Trust becomes visible</h4>
                  <p className="muted">
                    Signals roll up into CTI tiers (Basic → Verified → Showcase)
                    so non-experts can read credibility at a glance.
                  </p>
                </div>
                <div className="t-item">
                  <h4>Action gets simple</h4>
                  <p className="muted">
                    Once trust is legible, matching, partnerships, and financing
                    stop being a scavenger hunt.
                  </p>
                </div>
              </div>
            </div>

            <aside className="card">
              <h3 className="h3">Name &amp; meaning</h3>
              <p className="muted">
                “Raymoch” hints at a beam through noise—clarity, signal,
                direction. It’s our job to make trustworthy businesses easy to
                find and easy to back.
              </p>

              <h3 className="h3" style={{ marginTop: 12 }}>
                What we ship
              </h3>
              <ul className="list">
                <li>Public listings with verified signals (CTI)</li>
                <li>Matching workflows for partners/investors</li>
                <li>Update/claim pipelines for businesses</li>
                <li>Insight layers for sectors and countries</li>
              </ul>
            </aside>
          </section>

          {/* ROADMAP */}
          <section id="roadmap" className="block card">
            <h2 className="h2">Roadmap: from trust to rails</h2>

            <div className="roadmap">
              <div className="step">
                <div className="stepTitle">1) Trust Layer</div>
                <div className="muted">
                  Verified profiles, CTI scoring, transparent snapshots.
                </div>
              </div>

              <div className="arrow" aria-hidden="true">
                →
              </div>

              <div className="step">
                <div className="stepTitle">2) Capital Layer</div>
                <div className="muted">
                  Matching + diligence surfaces; partner &amp; program flows.
                </div>
              </div>

              <div className="arrow" aria-hidden="true">
                →
              </div>

              <div className="step">
                <div className="stepTitle">3) Financial Rails</div>
                <div className="muted">
                  Standardized docs, payment/onboarding bridges.
                </div>
              </div>

              <div className="arrow" aria-hidden="true">
                →
              </div>

              <div className="step">
                <div className="stepTitle">4) Ecosystem Hub</div>
                <div className="muted">
                  Data network effects: insights → discovery → growth.
                </div>
              </div>
            </div>
          </section>

          {/* PRINCIPLES */}
          <section id="principles" className="block card">
            <h2 className="h2">Principles (how we work)</h2>

            <div className="pillRow">
              <span className="pill">Clarity over theater</span>
              <span className="pill">Evidence beats vibes</span>
              <span className="pill">Security by default</span>
              <span className="pill">Local first, global ready</span>
              <span className="pill">Minimal friction</span>
              <span className="pill">Respect time &amp; attention</span>
            </div>

            <ul className="bullets">
              <li>
                <strong>CTI is explainable.</strong> If a score moves, there’s a
                reason a human can read.
              </li>
              <li>
                <strong>Updates are fast.</strong> “Request an update” isn’t a
                form graveyard; it’s a workflow.
              </li>
              <li>
                <strong>Interoperable by design.</strong> Your data should
                travel well—APIs later, clean structure now.
              </li>
            </ul>
          </section>

          {/* TEAM */}
          <section id="team" className="block card">
            <h2 className="h2">Team</h2>

            <div className="teamGrid">
              <div className="member">
                <div className="avatar">PR</div>
                <div className="memberText">
                  <h5>Peach Russom</h5>
                  <div className="role">Founder • Systems + Economics</div>
                  <p className="muted">
                    Engineer-economist building the trust layer for SMEs.
                    Obsessed with clean signals and practical rails.
                  </p>
                </div>
              </div>

              <div className="member">
                <div className="avatar">DS</div>
                <div className="memberText">
                  <h5>Data Science (Advisory)</h5>
                  <div className="role">Modeling • CTI design</div>
                  <p className="muted">
                    Bayesian priors meet messy reality: we make credibility
                    legible without hiding the uncertainty.
                  </p>
                </div>
              </div>

              <div className="member">
                <div className="avatar">PX</div>
                <div className="memberText">
                  <h5>Product &amp; UX</h5>
                  <div className="role">Flows • Accessibility</div>
                  <p className="muted">
                    Simple pages that earn trust. Fewer clicks, clearer
                    decisions.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* PRESS / METRICS */}
          <section className="block grid-3">
            <div className="card">
              <h3 className="h3">Traction</h3>
              <p className="muted">
                Listings growing monthly; early partners in fintech, agrifood,
                logistics.
              </p>
            </div>

            <div className="card">
              <h3 className="h3">Research Backbone</h3>
              <p className="muted">
                We publish methods openly: CTI criteria, sampling, and
                verification playbooks.
              </p>
            </div>

            <div className="card">
              <h3 className="h3">Ecosystem</h3>
              <p className="muted">
                Working with diaspora networks and operators to reduce diligence
                time.
              </p>
            </div>
          </section>

          {/* CTA */}
          <section id="contact" className="block card cta-banner">
            <h3>Want to list, partner, or explore programs?</h3>
            <div className="ctaBtns">
              <a className="cta" href="verification.html">
                Request Verification
              </a>
              <a className="ghost" href="Services.html">
                Explore Services
              </a>
            </div>
          </section>
        </main>
      </div>

      {/* ✅ Footer OUTSIDE rm-about so it sticks to bottom properly */}
      <Footer />
    </ResponsiveController>
  );
};

export default About;

const css = `
/* ===== Footer always at bottom ===== */
html, body { height: 100%; }

/* Page wrapper fills screen and pushes footer down */
.rm-about{
  --brand-blue:#0328aeed;
  --brand-blue-700:#213bb1;
  --brand-blue-500:#041b64;

  --ink:#101114;
  --muted:#3c4b69;
  --bg:#fafafa;
  --border:#e8e8ee;
  --card:#ffffff;

  --radius:14px;
  --pill:999px;
  --shadow:0 10px 26px rgba(10,42,107,.08);

  color: var(--ink);
  background: var(--bg);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

.rm-about main{ flex: 1 0 auto; }

/* ===== Base ===== */
.rm-about *{ box-sizing:border-box; }
.rm-about a{ color: inherit; text-decoration:none; }

.rm-about .wrap{
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 14px;
}
.rm-about .container{
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 14px 14px; /* smaller bottom padding => less gap before footer */
}

.rm-about .block{ margin: 12px 0; } /* tighter blocks */
.rm-about .card{
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: var(--shadow);
  padding: 14px; /* smaller card padding */
}

/* ===== HERO ===== */
.rm-about .hero{
  background: linear-gradient(180deg, #ffffff 0%, #fafafe 100%);
  padding: clamp(22px, 5vw, 48px) 0; /* smaller hero padding */
}
.rm-about .hero-grid{
  display:grid;
  grid-template-columns: 1.35fr 1fr;
  gap: 16px; /* tighter */
  align-items: start;
}
.rm-about .hero-left h1{
  margin: 0 0 8px;
  font-weight: 900;
  letter-spacing: .2px;
  color: var(--brand-blue-700);
  font-size: clamp(26px, 6.2vw, 44px);
  line-height: 1.12;
}
.rm-about .hero-left p{
  margin: 0;
  max-width: 780px;
  font-size: 13px;
  color: #374151;
  line-height: 1.55;
}
.rm-about .chip-row{
  display:flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 10px; /* smaller */
}
.rm-about .chip{
  display:inline-flex;
  align-items:center;
  gap: 8px;
  border: 1px solid var(--border);
  background: #fff;
  border-radius: var(--pill);
  padding: 7px 10px;
  color: #0f172a;
  font-weight: 700;
  font-size: 12px;
}
.rm-about .hero-aside{
  background:#fff;
  border:1px solid var(--border);
  border-radius: 12px;
  box-shadow: var(--shadow);
  padding: 12px;
  display:flex;
  flex-direction: column;
  gap: 10px;
}
.rm-about .kv-mini{
  display:flex;
  justify-content: space-between;
  align-items:center;
  gap: 12px;
  border: 1px solid #eceff6;
  border-radius: 10px;
  padding: 10px 12px;
  background: #fbfbfe;
}
.rm-about .kv-mini .k{ color:#6b7280; font-size: 12px; }
.rm-about .kv-mini .v{ font-weight: 800; color: #0a2a6b; font-size: 12px; }

/* ===== Headings ===== */
.rm-about .h2{
  margin: 0 0 10px;
  color: var(--brand-blue-700);
  font-size: 16px;
  font-weight: 900;
}
.rm-about .h3{
  margin: 0 0 8px;
  color: var(--brand-blue-700);
  font-size: 14px;
  font-weight: 900;
}
.rm-about .muted{ color: var(--muted); font-size: 12px; }

/* ===== Grids ===== */
.rm-about .grid-2{ display:grid; grid-template-columns: 1.55fr 1fr; gap: 12px; }
.rm-about .grid-3{ display:grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }

/* ===== Timeline ===== */
.rm-about .timeline{
  position: relative;
  padding-left: 20px;
  margin-top: 10px;
}
.rm-about .timeline::before{
  content:"";
  position:absolute;
  left: 8px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #e6e7ef;
  border-radius: 2px;
}
.rm-about .t-item{ position: relative; margin: 0 0 12px; }
.rm-about .t-item::before{
  content:"";
  position:absolute;
  left: -2px;
  top: .35em;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #c7c3d6;
  box-shadow: 0 0 0 3px #fff;
}
.rm-about .t-item h4{
  margin: 0 0 4px;
  color: var(--brand-blue-700);
  font-size: 12px;
  font-weight: 900;
}
.rm-about .t-item p{ margin: 0; }
.rm-about .list{
  margin: 8px 0 0;
  padding-left: 18px;
  line-height: 1.6;
  font-size: 12px;
}

/* ===== Roadmap ===== */
.rm-about .roadmap{
  margin-top: 10px;
  display:grid;
  grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr;
  gap: 10px;
  align-items: center;
}
.rm-about .step{
  border: 1px dashed #e6e7ef;
  border-radius: 12px;
  padding: 10px;
  min-height: 64px;
}
.rm-about .stepTitle{
  margin: 0 0 6px;
  color: var(--brand-blue-700);
  font-weight: 900;
  font-size: 12px;
}
.rm-about .arrow{
  color: #9aa1b2;
  font-size: 18px;
  font-weight: 900;
  text-align:center;
}

/* ===== Principles ===== */
.rm-about .pillRow{ margin-top: 6px; display:flex; flex-wrap:wrap; gap: 8px; }
.rm-about .pill{
  display:inline-block;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid #e6e7ef;
  background: #fff;
  font-weight: 700;
  font-size: 11px;
  color: #0f172a;
}
.rm-about .bullets{
  margin: 10px 0 0;
  padding-left: 18px;
  line-height: 1.6;
  font-size: 12px;
}
.rm-about .bullets li{ margin: 4px 0; }

/* ===== TEAM (compact) ===== */
.rm-about .teamGrid{
  display:grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px; /* smaller */
}
.rm-about .member{
  display:flex;
  gap: 8px;              /* smaller */
  align-items:flex-start;
  padding: 8px 10px;     /* compact card */
  border: 1px solid rgba(230,231,239,.8);
  border-radius: 12px;
  background: #fff;
}
.rm-about .avatar{
  width: 38px;
  height: 38px;
  border-radius: 10px;
  border: 1px solid #e6e7ef;
  background: #f7f7fb;
  display:grid;
  place-items:center;
  font-weight: 900;
  color: var(--brand-blue-700);
  font-size: 11px;
  flex: 0 0 auto;
}
.rm-about .memberText h5{
  margin: 0;
  color: var(--brand-blue-700);
  font-weight: 900;
  font-size: 12px;
  line-height: 1.15;
}
.rm-about .role{
  font-size: 11px;
  color: var(--muted);
  margin: 2px 0 4px;
  line-height: 1.2;
}
.rm-about .memberText p{
  margin: 0;
  font-size: 12px;
  line-height: 1.35;
}

/* ===== CTA ===== */
.rm-about .cta-banner{
  display:flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items:center;
  justify-content: space-between;
  padding: 12px; /* smaller */
}
.rm-about .cta-banner h3{
  margin: 0;
  color: var(--brand-blue-700);
  font-weight: 900;
  font-size: 13px;
}
.rm-about .ctaBtns{ display:flex; gap: 10px; flex-wrap: wrap; }
.rm-about .cta{
  display:inline-block;
  border-radius: 12px;
  background: var(--brand-blue-700);
  color: #fff;
  padding: 10px 14px;
  font-weight: 900;
  font-size: 12px;
}
.rm-about .ghost{
  background:#fff;
  border:1px solid #e6e7ef;
  border-radius: 12px;
  padding: 10px 14px;
  font-weight: 800;
  color:#0f172a;
  font-size: 12px;
}

/* ===== Responsive ===== */
@media (max-width: 980px){
  .rm-about .hero-grid{ grid-template-columns: 1fr; }
  .rm-about .grid-2{ grid-template-columns: 1fr; }
  .rm-about .roadmap{ grid-template-columns: 1fr; gap: 10px; }
  .rm-about .arrow{ display:none; }
  .rm-about .teamGrid{ grid-template-columns: 1fr; }
  .rm-about .grid-3{ grid-template-columns: 1fr; }
}
`;
