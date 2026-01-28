// resources/js/components/Entire.jsx
import React, { useEffect } from "react";
// Adjust this import according to your actual file/location/exports:
import Header from "../components/layout_master/Header.jsx";
import Footer from "../components/layout_master/Footer.jsx";
import AfricaInvestmentPanel from "../components/AfricaInvestmentPanel.jsx";
import { ResponsiveController } from "../components/ResponsiveController.jsx";
const Entire = () => {
  useEffect(() => {
    // If your old script_entire.js / script_african_slider exposes an init function,
    // call it here so the ticker/slider logic still works.
    if (window.initAfricanSlider) {
      window.initAfricanSlider();
    }
  }, []);

  return (
    
    <>
       <ResponsiveController>
        
      {/* Shared header from CompanyDetailDialog.jsx */}
      <Header />

      <section
        className="hero"
        id="hero"
        aria-label="RAYMOCH: Redefining African Potential"
      >
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
                company profiles, a Cultural Trust Index, and market
                intelligence make it easier to discover credible African
                businesses and back them with confidence.
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
                <li>
                  Multi-source verification (documents, references, public
                  records)
                </li>
                <li>
                  CTI badges reflect completeness, integrity, and recency
                </li>
                <li>Signals layer highlights policy changes and incentives</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ========== WHAT WE DO ========== */}
        <section className="section" id="what-we-do">
          <div
            className="mini-ctl"
            aria-label="What We Do color pickers"
            title="Tile colors: Blue, Gold, Gray (BG/FG)"
          >
            <input
              type="color"
              data-var="--block-blue-bg"
              title="Blue tile background"
            />
            <input
              type="color"
              data-var="--block-blue-fg"
              title="Blue tile text"
            />
            <span className="sep" aria-hidden="true" />
            <input
              type="color"
              data-var="--block-gold-bg"
              title="Gold tile background"
            />
            <input
              type="color"
              data-var="--block-gold-fg"
              title="Gold tile text"
            />
            <span className="sep" aria-hidden="true" />
            <input
              type="color"
              data-var="--block-gray-bg"
              title="Gray tile background"
            />
            <input
              type="color"
              data-var="--block-gray-fg"
              title="Gray tile text"
            />
          </div>

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

        {/* ================= SIGNALS ================= */}
        <section
          className="signals"
          id="signals"
          aria-label="Policy & Incentives"
        >
          <div className="signals-inner">
            <div
              className="ticker"
              id="signalsTicker"
              aria-label="Live incentives & policy signals"
            />
            <h3 className="subhead">Policy &amp; Incentives</h3>
            <div className="signals-grid">
              <div className="card">
                <h4>Latest Incentives</h4>
                <p>Tax credits, grants, and concessional financing recently announced.</p>
                <a href="incentives.html">Open incentives</a>
              </div>
              <div className="card">
                <h4>Policy Changes</h4>
                <p>
                  Regulatory updates that unlock or constrain sectors and
                  regions.
                </p>
                <a href="policy.html">See policy tracker</a>
              </div>
              <div className="card">
                <h4>Market News</h4>
                <p>Signals from M&amp;A, funding rounds, and trade flows.</p>
                <a href="Market_Insight.html">Read insights</a>
              </div>
              <div className="card">
                <h4>Whitespace Map</h4>
                <p>Data-led view of unmet demand by sector &amp; country.</p>
                <a href="whitespace.html">View opportunities</a>
              </div>
            </div>
          </div>
        </section>

        {/* ========== SPECIAL REPORTS ========== */}
        <section className="section reports-section" id="reports">
          <h2>Special Reports</h2>

          <div className="reports">
            <div className="blurb">
              <p>
                A changing world requires new analysis and practical insight.
                cross-sector themes that connect capital, context, and growth.
              </p>
              <p style={{ marginTop: "10px" }}>
                <a className="btn" href="Market_Insight.html">
                  All reports
                </a>
              </p>
            </div>

            <div className="story-card">
              <a
                className="story-cover"
                href="Market_Insight.html"
                aria-label="Read: Kenya Fintech Funding Surges"
                style={{ "--img": "url('frontend/a-2.png')" }}
              />
              <a className="story-title" href="Market_Insight.html">
                Kenya Fintech Funding Surges
              </a>
            </div>

            <ul className="rail" aria-label="Latest topics">
              <li>
                <a href="Market_Insight.html#renewables">
                  Africa’s energy transition calls for innovative financing
                </a>
                <span className="chev">›</span>
              </li>
              <li>
                <a href="Market_Insight.html#genai">
                  Generative AI and the workforce: redistribution over reduction
                </a>
                <span className="chev">›</span>
              </li>
              <li>
                <a href="Market_Insight.html#climate">
                  Shining new light on climate change and transition
                </a>
                <span className="chev">›</span>
              </li>
              <li>
                <a href="Market_Insight.html#capital">
                  Look Forward: Future of Capital Markets
                </a>
                <span className="chev">›</span>
              </li>
            </ul>
          </div>
        </section>

   
{/* ========== AFRICA INVESTMENT PANEL (React) ========== */}
<AfricaInvestmentPanel apiEndpoint="/api/africa/companies" pollMs={6000} />


{/* 
<section className="section" aria-label="Africa Investment Panel">
  <div className="container-xxl my-4">
    <div className="tool-card shadow-sm p-3">

      <h5 className="m-0">Africa Investment Panel (Coming Soon)</h5>
      <p className="text-secondary">
        An interactive simulator to explore private investment plans across Africa.
      </p> */}

      {/* --- Investing.com African Stock Quotes Widget (iframe) --- */}
      {/* <div style={{ width: "100%", overflow: "hidden", marginTop: "12px" }}>
        <iframe
          src="https://www.investing.com/indices/south-africa-40?embed=1"
          width="100%"
          height="480"
          frameBorder="0"
          style={{ border: 0 }}
          allowTransparency="true"
        ></iframe>
      </div> */}

      {/* The embed script requirement */}
      <script
        type="text/javascript"
        src="https://www.widgets.investing.com/js/widgets/widget.js"
      ></script>

    {/* </div>
  </div>
</section> */}


        {/* ========== QUOTE + BIO ========== */}
        <section className="quote-block">
          <div className="quote-inner">
            <div className="quote-text">
              “It always seems impossible until it’s done.”
            </div>
            <div className="quote-attr">— Nelson Mandela</div>
            <p className="quote-bio">
              Raymoch is building trusted digital rails for African
              entrepreneurship: verified company profiles, a Cultural Trust
              Index, and market intelligence, so capital can find credible
              opportunities faster.
            </p>
          </div>
        </section>
      </main>

      {/* Shared footer from CompanyDetailDialog.jsx */}
      <Footer />
         </ResponsiveController>
    </>
  );
};

export default Entire;
