// resources/js/components/Entire.jsx
import React, { useEffect } from "react";
// Adjust this import according to your actual file/location/exports:
import Header from "../components/layout_master/Header.jsx";
import Footer from "../components/layout_master/Footer.jsx";

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

        {/* ========== AFRICA INVESTMENT PANEL (live simulator) ========== */}
        {/* <section className="section" aria-label="Africa Investment Panel">``
          <div className="container-xxl my-4">
            <div className="tool-card shadow-sm p-3"> */}
              {/* Header: title + controls */}
              {/* <div className="d-flex flex-wrap align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-2">
                  <h5 className="m-0">Africa Investment Panel</h5>
                  <span className="badge text-bg-primary">Live</span>
                </div>
                <div className="d-flex align-items-center gap-2"> */}
                  {/* <button id="pauseBtn" className="btn btn-outline-secondary btn-sm">Pause</button> */}
                  {/* <label
                    htmlFor="speed"
                    className="small text-secondary m-0"
                  >
                    Speed
                  </label>
                  <input
                    id="speed"
                    type="range"
                    min="20"
                    max="80"
                    defaultValue="48"
                    step="2"
                    style={{ width: "140px" }}
                  />
                </div>
              </div> */}

              {/* Marquee / flags */}
              {/* <div
                id="ticker"
                className="ticker-viewport mt-3 p-2 bg-white"
              >
                <div id="track" className="ticker-track" />
              </div> */}

              {/* Stats */}
              {/* <div className="row g-3 mt-3">
                <div className="col-12 col-lg-5">
                  <div className="p-3 border rounded-3 h-100">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div id="countryBadge" className="country-pill">
                        <img id="countryFlag" src="" alt="" />
                        <span id="countryName">—</span>
                      </div>
                      <small
                        className="text-secondary"
                        id="lastUpdated"
                      >
                        Updated: —
                      </small>
                    </div>
                    <div className="row g-3">
                      <div className="col-6">
                        <div className="border rounded-3 p-3 h-100">
                          <div className="text-secondary small">
                            Private companies
                          </div>
                          <div
                            id="statCompanies"
                            className="h4 m-0 fw-bold"
                          >
                            —
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="border rounded-3 p-3 h-100">
                          <div className="text-secondary small">
                            Total CAPEX (USD)
                          </div>
                          <div
                            id="statCapex"
                            className="h4 m-0 fw-bold"
                          >
                            —
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="border rounded-3 p-3 h-100">
                          <div className="text-secondary small">
                            Projects
                          </div>
                          <div
                            id="statProjects"
                            className="h4 m-0 fw-bold"
                          >
                            —
                          </div>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="border rounded-3 p-3 h-100">
                          <div className="text-secondary small">
                            New vs. Expansion
                          </div>
                          <div className="fw-bold">
                            <span id="statNew">—</span> /{" "}
                            <span id="statExp">—</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <canvas
                        id="sectorChart"
                        height="160"
                      />
                    </div>
                  </div>
                </div>

                <div className="col-12 col-lg-7">
                  <div className="p-3 border rounded-3 h-100">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <h6 className="m-0">Private Investment Plans</h6>
                      <input
                        id="tableSearch"
                        className="form-control form-control-sm"
                        placeholder="Search company/sector…"
                        style={{ maxWidth: "220px" }}
                      />
                    </div>
                    <div
                      className="table-responsive"
                      style={{ maxHeight: "360px", overflow: "auto" }}
                    >
                      <table className="table table-sm align-middle">
                        <thead className="table-light">
                          <tr>
                            <th style={{ minWidth: "160px" }}>Company</th>
                            <th>Sector</th>
                            <th
                              className="text-end"
                              style={{ minWidth: "110px" }}
                            >
                              CAPEX (USD)
                            </th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody id="companyRows">
                          <tr>
                            <td
                              colSpan="4"
                              className="text-center py-4 text-secondary"
                            >
                              Select a country…
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div> */}

          {/* Inline styles (can be moved to a CSS file) */}
          {/* <style>{`
            :root{
              --accent:#1A73E8;
              --chip-bg:#f8f9fa;
              --ticker-speed: 48s;
            }
            .tool-card{ border:1px solid #e9ecef; border-radius:1rem; background:#fff; }
            .ticker-viewport{ position:relative; overflow:hidden; border-radius:.75rem; }
            .ticker-track{ display:flex; align-items:center; gap:.5rem; width:max-content;
                           animation: ticker var(--ticker-speed) linear infinite; }
            .ticker-paused .ticker-track{ animation-play-state: paused; }
            @keyframes ticker { from{ transform:translateX(0) } to{ transform:translateX(-50%) } }
            .flag-chip{
              display:inline-flex; align-items:center; gap:.5rem;
              padding:.35rem .6rem; border-radius:999px;
              background:var(--chip-bg); border:1px solid #e9ecef;
              font-weight:600; font-size:.92rem; white-space:nowrap;
              transition:box-shadow .2s, border-color .2s, background-color .2s, transform .08s;
              cursor:pointer; user-select:none;
            }
            .flag-chip img{ width:22px; height:16px; object-fit:cover; border-radius:2px; }
            .flag-chip:hover{ background:#fff; border-color:var(--accent);
              box-shadow:0 0 0 3px rgba(26,115,232,.15); }
            .flag-chip:active{ transform:translateY(1px); }
            .flag-chip.active{ background:#e7f0fe; border-color:var(--accent); }
            .country-pill{ display:inline-flex; align-items:center; gap:.5rem;
              border:1px solid #e9ecef; border-radius:999px; padding:.35rem .65rem; }
            .country-pill img{ width:18px; height:12px; border-radius:2px; }
            .table-sm td,.table-sm th{ padding:.4rem .5rem; }
            section, aside { min-width: 0; }
            .panel{
              border:2px groove #0e0d0d33;
              border-radius:10px;
              padding:clamp(10px, 1.6vw, 16px);
              background:#fff;
            }
            .hero-title{ font-size:clamp(1.4rem,1rem + 2.4vw,3rem); line-height:1.1; text-wrap:balance; }
            .ratio-hero img{ object-fit:cover; }
            .featured-title{ font-weight:800; letter-spacing:.2px; font-size:clamp(1rem,.6rem + 1.2vw,1.4rem); }
            .featured-item{ padding-block:clamp(10px,1.2vw,14px); }
            .featured-item + .featured-item{ border-top:1px solid #e9ecef; }
            .featured-meta{ font-size:clamp(.8rem,.6rem + .6vw,.95rem); color:#6c757d; }
            .featured-link{ font-size:clamp(.95rem,.8rem + .6vw,1.1rem); font-weight:700; color:#111; text-decoration:none; }
            .featured-link:hover{ text-decoration:underline; }
            .promo{ position:relative; overflow:hidden; border-radius:1rem; box-shadow:0 6px 24px rgba(0,0,0,.08); background:#000; }
            .promo img{ width:100%; height:20rem; object-fit:cover; display:block; opacity:.9; }
            .promo::after{ content:""; position:absolute; inset:0; background:linear-gradient(180deg, rgba(0,0,0,.25), rgba(0,0,0,.65)); }
            .promo-body{ position:absolute; inset:0; padding:1.25rem; display:flex; flex-direction:column; }
            .promo h3{ color:#fff; font-weight:800; }
            .promo p{ color:rgba(255,255,255,.9); max-width:28ch; }
            .promo-cta{ margin-top:auto; }
            .promo-arrow{ position:absolute; left:.75rem; bottom:3.25rem; color:#fff; font-size:1.25rem; font-weight:800; z-index:2; }
            .ticker-card{ border:1px solid #e9ecef; border-radius:1rem; }
            .ticker-viewport{ position:relative; overflow:hidden; height:46px; border-radius:.75rem; background:#fff; }
            .ticker-move{ display:flex; width:max-content; animation: ticker-scroll var(--ticker-speed, 35s) linear infinite; }
            .ticker-paused .ticker-move{ animation-play-state: paused; }
            .ticker-track{ display:flex; align-items:center; gap:.75rem; padding:0 .5rem; }
            @keyframes ticker-scroll { from { transform: translateX(0) } to { transform: translateX(-50%) } }
            .panel--scroll{
              max-height: 70vh;
              overflow: auto;
              -webkit-overflow-scrolling: touch;
              overscroll-behavior: contain;
            }
            .panel--sticky{
              position: sticky; top: 0; z-index: 1;
              background: #fff;
              padding-top: .25rem;
            }
            @media (max-width: 576px){ .panel--scroll{ max-height: 60vh; } }
            @media (min-width: 992px){ .panel--scroll{ max-height: 75vh; } }
          `}</style> */}
        {/* </section> */}



<section className="section" aria-label="Africa Investment Panel">
  <div className="container-xxl my-4">
    <div className="tool-card shadow-sm p-3">

      <h5 className="m-0">Africa Investment Panel (Coming Soon)</h5>
      <p className="text-secondary">
        An interactive simulator to explore private investment plans across Africa.
      </p>

      {/* --- Investing.com African Stock Quotes Widget (iframe) --- */}
      <div style={{ width: "100%", overflow: "hidden", marginTop: "12px" }}>
        <iframe
          src="https://www.investing.com/indices/south-africa-40?embed=1"
          width="100%"
          height="480"
          frameBorder="0"
          style={{ border: 0 }}
          allowTransparency="true"
        ></iframe>
      </div>

      {/* The embed script requirement */}
      <script
        type="text/javascript"
        src="https://www.widgets.investing.com/js/widgets/widget.js"
      ></script>

    </div>
  </div>
</section>


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
    </>
  );
};

export default Entire;
