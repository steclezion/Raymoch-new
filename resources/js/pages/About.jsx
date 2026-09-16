// resources/js/pages/About.jsx
import React, { useEffect } from "react";
import Header from "../components/layout_master/Header.jsx";
import Footer from "../components/layout_master/Footer.jsx";
import { ResponsiveController } from "../components/ResponsiveController.jsx";
import "../styles/about.css";

const About = () => {
  useEffect(() => {
    if (window.initAfricanSlider) window.initAfricanSlider();
  }, []);

  return (
    <ResponsiveController>
      <Header />

      <div className="ray-about">
        {/* HERO */}
        <section className="ray-about__hero">
          <div className="ray-about__wrap ray-about__hero-grid">
            <div className="ray-about__hero-left">
              <h1>We build trust so capital can flow.</h1>
              <p>
                Raymoch is a visibility + trust platform for African and
                diaspora-linked SMEs. We verify businesses, surface credible
                data, and make it easier for customers, partners, and investors
                to act with confidence.
              </p>

              <div className="ray-about__chip-row">
                <a className="ray-about__chip" href="#story" data-tooltip="Read Raymoch's story and trust-building approach">
                  📜 Our story
                </a>
                <a className="ray-about__chip" href="#roadmap" data-tooltip="View Raymoch's product and ecosystem roadmap">
                  🧭 Roadmap
                </a>
                <a className="ray-about__chip" href="#principles" data-tooltip="Review the principles guiding how Raymoch works">
                  🧩 Principles
                </a>
                <a className="ray-about__chip" href="#team" data-tooltip="Meet the team building Raymoch">
                  👥 Team
                </a>
                <a className="ray-about__chip" href="#contact" data-tooltip="Open the contact and next-steps section">
                  ✉️ Contact
                </a>
              </div>
            </div>

            <aside className="ray-about__hero-aside">
              <div className="ray-about__kv-mini">
                <span className="ray-about__key">Focus</span>
                <span className="ray-about__value">Trust &amp; Visibility</span>
              </div>
              <div className="ray-about__kv-mini">
                <span className="ray-about__key">Coverage</span>
                <span className="ray-about__value">50+ Countries</span>
              </div>
              <div className="ray-about__kv-mini">
                <span className="ray-about__key">Method</span>
                <span className="ray-about__value">CTI Verification</span>
              </div>
            </aside>
          </div>
        </section>

        {/* BODY */}
        <main className="ray-about__container">
          {/* STORY */}
          <section id="story" className="ray-about__block ray-about__grid-2">
            <div className="ray-about__card">
              <h2 className="ray-about__h2">The short version</h2>
              <p className="ray-about__muted">
                Africa’s SMEs are real, resilient, and under-seen. Diaspora
                capital is massive—but allergic to foggy signals. Raymoch clears
                the fog with verified profiles, a Cultural Trust Index (CTI),
                and clean routes from discovery to action.
              </p>

              <div className="ray-about__timeline">
                <div className="ray-about__timeline-item">
                  <h4>Ground truth first</h4>
                  <p className="ray-about__muted">
                    We start with facts you can check—ownership, operations,
                    certifications, traction.
                  </p>
                </div>
                <div className="ray-about__timeline-item">
                  <h4>Trust becomes visible</h4>
                  <p className="ray-about__muted">
                    Signals roll up into CTI tiers (Basic → Verified → Showcase)
                    so non-experts can read credibility at a glance.
                  </p>
                </div>
                <div className="ray-about__timeline-item">
                  <h4>Action gets simple</h4>
                  <p className="ray-about__muted">
                    Once trust is legible, matching, partnerships, and financing
                    stop being a scavenger hunt.
                  </p>
                </div>
              </div>
            </div>

            <aside className="ray-about__card">
              <h3 className="ray-about__h3">Name &amp; meaning</h3>
              <p className="ray-about__muted">
                “Raymoch” hints at a beam through noise—clarity, signal,
                direction. It’s our job to make trustworthy businesses easy to
                find and easy to back.
              </p>

              <h3 className="ray-about__h3" style={{ marginTop: 12 }}>
                What we ship
              </h3>
              <ul className="ray-about__list">
                <li>Public listings with verified signals (CTI)</li>
                <li>Matching workflows for partners/investors</li>
                <li>Update/claim pipelines for businesses</li>
                <li>Insight layers for sectors and countries</li>
              </ul>
            </aside>
          </section>

          {/* ROADMAP */}
          <section id="roadmap" className="ray-about__block ray-about__card">
            <h2 className="ray-about__h2">Roadmap: from trust to rails</h2>

            <div className="ray-about__roadmap">
              <div className="ray-about__step">
                <div className="ray-about__step-title">1) Trust Layer</div>
                <div className="ray-about__muted">
                  Verified profiles, CTI scoring, transparent snapshots.
                </div>
              </div>

              <div className="ray-about__arrow" aria-hidden="true">
                →
              </div>

              <div className="ray-about__step">
                <div className="ray-about__step-title">2) Capital Layer</div>
                <div className="ray-about__muted">
                  Matching + diligence surfaces; partner &amp; program flows.
                </div>
              </div>

              <div className="ray-about__arrow" aria-hidden="true">
                →
              </div>

              <div className="ray-about__step">
                <div className="ray-about__step-title">3) Financial Rails</div>
                <div className="ray-about__muted">
                  Standardized docs, payment/onboarding bridges.
                </div>
              </div>

              <div className="ray-about__arrow" aria-hidden="true">
                →
              </div>

              <div className="ray-about__step">
                <div className="ray-about__step-title">4) Ecosystem Hub</div>
                <div className="ray-about__muted">
                  Data network effects: insights → discovery → growth.
                </div>
              </div>
            </div>
          </section>

          {/* PRINCIPLES */}
          <section id="principles" className="ray-about__block ray-about__card">
            <h2 className="ray-about__h2">Principles (how we work)</h2>

            <div className="ray-about__pill-row">
              <span className="ray-about__pill">Clarity over theater</span>
              <span className="ray-about__pill">Evidence beats vibes</span>
              <span className="ray-about__pill">Security by default</span>
              <span className="ray-about__pill">Local first, global ready</span>
              <span className="ray-about__pill">Minimal friction</span>
              <span className="ray-about__pill">Respect time &amp; attention</span>
            </div>

            <ul className="ray-about__bullets">
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
          <section id="team" className="ray-about__block ray-about__card">
            <h2 className="ray-about__h2">Team</h2>

            <div className="ray-about__team-grid">
              <div className="ray-about__member">
                <div className="ray-about__avatar">PR</div>
                <div className="ray-about__member-text">
                  <h5>Peach Russom</h5>
                  <div className="ray-about__role">Founder • Systems + Economics</div>
                  <p className="ray-about__muted">
                    Engineer-economist building the trust layer for SMEs.
                    Obsessed with clean signals and practical rails.
                  </p>
                </div>
              </div>

              <div className="ray-about__member">
                <div className="ray-about__avatar">DS</div>
                <div className="ray-about__member-text">
                  <h5>Data Science (Advisory)</h5>
                  <div className="ray-about__role">Modeling • CTI design</div>
                  <p className="ray-about__muted">
                    Bayesian priors meet messy reality: we make credibility
                    legible without hiding the uncertainty.
                  </p>
                </div>
              </div>

              <div className="ray-about__member">
                <div className="ray-about__avatar">PX</div>
                <div className="ray-about__member-text">
                  <h5>Product &amp; UX</h5>
                  <div className="ray-about__role">Flows • Accessibility</div>
                  <p className="ray-about__muted">
                    Simple pages that earn trust. Fewer clicks, clearer
                    decisions.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* PRESS / METRICS */}
          <section className="ray-about__block ray-about__grid-3">
            <div className="ray-about__card">
              <h3 className="ray-about__h3">Traction</h3>
              <p className="ray-about__muted">
                Listings growing monthly; early partners in fintech, agrifood,
                logistics.
              </p>
            </div>

            <div className="ray-about__card">
              <h3 className="ray-about__h3">Research Backbone</h3>
              <p className="ray-about__muted">
                We publish methods openly: CTI criteria, sampling, and
                verification playbooks.
              </p>
            </div>

            <div className="ray-about__card">
              <h3 className="ray-about__h3">Ecosystem</h3>
              <p className="ray-about__muted">
                Working with diaspora networks and operators to reduce diligence
                time.
              </p>
            </div>
          </section>

          {/* CTA */}
          <section id="contact" className="ray-about__block ray-about__card ray-about__cta-banner">
            <h3>Want to list, partner, or explore programs?</h3>
            <div className="ray-about__cta-buttons">
              <a className="ray-about__cta" href="verification.html" data-tooltip="Start the Raymoch business verification process">
                Request Verification
              </a>
              <a className="ray-about__ghost" href="Services.html" data-tooltip="Explore Raymoch programs and professional services">
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
