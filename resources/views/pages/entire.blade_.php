from Entire.html
@extends('layouts.appshellotest')
<script rel="stylesheet" src="{{ asset('js/script_entire.js') }}"></script>
<link href="{{ asset('css/style_entire.css')  }}" rel="stylesheet" type="text/css" id="bootstrap">
{{-- <link href="{{ asset('css/style_entire_2.css')  }}" rel="stylesheet" type="text/css" id="bootstrap"> --}}
<!-- JS libs -->
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
{{-- <script rel="stylesheet" src="{{ asset('js/script_african_slider.js') }}"></script> --}}


<!-- Bootstrap CSS for Section 4 African Slides -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />




@section('title','Raymoch • Connecting Africa')
@section('content')

<section class="hero" id="hero" aria-label="RAYMOCH: Redefining African Potential">
  <div class="hero-inner">
    <h1>Redefining African Potential</h1>
    <p>At Raymoch, we connect investors and entrepreneurs through trust, verified data, and actionable insights.
      Our mission is to unlock visibility and capital for businesses across Africa and beyond.</p>
  </div>
</section>


<main class="wrap">

  <!-- ========== WHO WE ARE ========== -->
  <section class="about" id="about">
    <div class="grid">
      <div>
        <h2 style="margin-bottom:8px">Who We Are</h2>
        <p class="lead">
          We build trust rails so capital can move with context. Verified company profiles, a Cultural Trust Index,
          and market intelligence make it easier to discover credible African businesses and back them with confidence.
        </p>
        <div class="about-stats">
          <div class="stat"><small>Companies Tracked</small>12,400+</div>
          <div class="stat"><small>Active Sectors</small>24</div>
          <div class="stat"><small>Countries Covered</small>55</div>
        </div>
      </div>
      <div class="card">
        <h3 style="margin:0 0 8px">How trust is earned</h3>
        <ul>
          <li>Multi-source verification (documents, references, public records)</li>
          <li>CTI badges reflect completeness, integrity, and recency</li>
          <li>Signals layer highlights policy changes and incentives</li>
        </ul>
      </div>
    </div>
  </section>

  <!-- ========== WHAT WE DO ========== -->
  <section class="section" id="what-we-do">
    <div class="mini-ctl" aria-label="What We Do color pickers" title="Tile colors: Blue, Gold, Gray (BG/FG)">
      <input type="color" data-var="--block-blue-bg" title="Blue tile background">
      <input type="color" data-var="--block-blue-fg" title="Blue tile text">
      <span class="sep" aria-hidden="true"></span>
      <input type="color" data-var="--block-gold-bg" title="Gold tile background">
      <input type="color" data-var="--block-gold-fg" title="Gold tile text">
      <span class="sep" aria-hidden="true"></span>
      <input type="color" data-var="--block-gray-bg" title="Gray tile background">
      <input type="color" data-var="--block-gray-fg" title="Gray tile text">
    </div>

    <h2>What We Do</h2>
    <div class="blocks">
      <a class="block blue" href="Matching.html">
        <h3>Trusted Matching</h3>
        <p>Find and connect with businesses that align with your vision, using our Cultural Trust Index and verified data.</p>
      </a>
      <a class="block gold" href="Market_Insight.html">
        <h3>Deep Insights</h3>
        <p>Access market intelligence, sector reports, and regional briefs that help you make informed investment decisions.</p>
      </a>
      <a class="block gray" href="partner-programs.html">
        <h3>Community &amp; Growth</h3>
        <p>Partner programs and opportunities to expand networks and accelerate growth.</p>
      </a>
    </div>
  </section>

  <!-- ================= SIGNALS ================= -->
  <section class="signals" id="signals" aria-label="Policy & Incentives">
    <div class="signals-inner">
      <div class="ticker" id="signalsTicker" aria-label="Live incentives & policy signals"></div>
      <h3 class="subhead">Policy &amp; Incentives</h3>
      <div class="signals-grid">
        <div class="card">
          <h4>Latest Incentives</h4>
          <p>Tax credits, grants, and concessional financing recently announced.</p>
          <a href="incentives.html">Open incentives</a>
        </div>
        <div class="card">
          <h4>Policy Changes</h4>
          <p>Regulatory updates that unlock or constrain sectors and regions.</p>
          <a href="policy.html">See policy tracker</a>
        </div>
        <div class="card">
          <h4>Market News</h4>
          <p>Signals from M&amp;A, funding rounds, and trade flows.</p>
          <a href="Market_Insight.html">Read insights</a>
        </div>
        <div class="card">
          <h4>Whitespace Map</h4>
          <p>Data-led view of unmet demand by sector &amp; country.</p>
          <a href="whitespace.html">View opportunities</a>
        </div>
      </div>
    </div>
  </section>

  <!-- ========== SPECIAL REPORTS ========== -->
  <section class="section reports-section" id="reports">
    <h2>Special Reports</h2>

    <div class="reports">
      <div class="blurb">
        <p>A changing world requires new analysis and practical insight. cross-sector themes that connect capital, context, and growth.</p>
        <p style="margin-top:10px"><a class="btn" href="Market_Insight.html">All reports</a></p>
      </div>

      <div class="story-card">
        <a class="story-cover" href="Market_Insight.html" aria-label="Read: Kenya Fintech Funding Surges"
          style="--img:url('frontend/a-2.png')"></a>
        <a class="story-title" href="Market_Insight.html">Kenya Fintech Funding Surges</a>
      </div>

      <ul class="rail" aria-label="Latest topics">
        <li><a href="Market_Insight.html#renewables">Africa’s energy transition calls for innovative financing</a><span class="chev">›</span></li>
        <li><a href="Market_Insight.html#genai">Generative AI and the workforce: redistribution over reduction</a><span class="chev">›</span></li>
        <li><a href="Market_Insight.html#climate">Shining new light on climate change and transition</a><span class="chev">›</span></li>
        <li><a href="Market_Insight.html#capital">Look Forward: Future of Capital Markets</a><span class="chev">›</span></li>
      </ul>
    </div>
  </section>

  <!-- ========== AFRICA INVESTMENT PANEL (live simulator) ========== -->
  <section class="section" aria-label="Africa Investment Panel">
    {{-- <div class="panel">
        <div class="panel-head">
          <div style="display:flex;align-items:center;gap:10px">
            <strong>Africa Investment Panel</strong>
            <span class="live" id="liveTag">Live</span>
          </div>
          <div class="speed">Speed <input id="speed" type="range" min="0.6" max="2.0" value="1.2" step="0.1" /></div>
        </div>

        <div class="pills" id="countryPills"></div>

        <div class="grid">
          <div class="cardx">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
              <div id="countryLabel">🇳🇬 Nigeria</div>
              <div id="updatedAt" style="color:#6b7280;font-size:13px"></div>
            </div>

            <div class="kpis">
              <div class="kpi"><div class="label">Private companies</div><div class="value" id="kpiCompanies">9</div></div>
              <div class="kpi"><div class="label">Total CAPEX (USD)</div><div class="value" id="kpiCapex">$ 650,000,000</div></div>
              <div class="kpi"><div class="label">Projects</div><div class="value" id="kpiProjects">9</div></div>
              <div class="kpi"><div class="label">New vs. Expansion</div><div class="value" id="kpiNE">5 / 4</div></div>
            </div>

            <div class="donut-wrap">
              <svg id="donut" width="320" height="220" viewBox="0 0 320 220" aria-label="Sector distribution donut"></svg>
            </div>
            <div class="legend" id="legend"></div>
          </div>

          <div class="cardx">
            <div class="table-head">
              <strong>Private Investment Plans</strong>
              <input class="search" id="tblSearch" placeholder="Search company/sector" />
            </div>
            <table class="table" id="planTable">
              <thead><tr><th>Company</th><th>Sector</th><th>CAPEX (USD)</th><th>Status</th></tr></thead>
              <tbody></tbody>
            </table>
          </div>
        </div>
      </div> --}}

    <div class="container-xxl my-4">
      <div class="tool-card shadow-sm p-3">
        <!-- Header: title + controls -->
        <div class="d-flex flex-wrap align-items-center justify-content-between">
          <div class="d-flex align-items-center gap-2">
            <h5 class="m-0">Africa Investment Panel</h5>
            <span class="badge text-bg-primary">Live</span>
          </div>
          <div class="d-flex align-items-center gap-2">
            {{-- <button id="pauseBtn" class="btn btn-outline-secondary btn-sm">Pause</button> --}}
            <label for="speed" class="small text-secondary m-0">Speed</label>
            <input id="speed" type="range" min="20" max="80" value="48" step="2" style="width:140px;">
          </div>
        </div>
        <!-- Marquee / flags -->
        <div id="ticker" class="ticker-viewport mt-3 p-2 bg-white">
          <div id="track" class="ticker-track"></div>
        </div>
        <!-- Stats -->
        <div class="row g-3 mt-3">
          <div class="col-12 col-lg-5">
            <div class="p-3 border rounded-3 h-100">
              <div class="d-flex align-items-center justify-content-between mb-3">
                <div id="countryBadge" class="country-pill">
                  <img id="countryFlag" src="" alt="">
                  <span id="countryName">—</span>
                </div>
                <small class="text-secondary" id="lastUpdated">Updated: —</small>
              </div>
              <div class="row g-3">
                <div class="col-6">
                  <div class="border rounded-3 p-3 h-100">
                    <div class="text-secondary small">Private companies</div>
                    <div id="statCompanies" class="h4 m-0 fw-bold">—</div>
                  </div>
                </div>
                <div class="col-6">
                  <div class="border rounded-3 p-3 h-100">
                    <div class="text-secondary small">Total CAPEX (USD)</div>
                    <div id="statCapex" class="h4 m-0 fw-bold">—</div>
                  </div>
                </div>
                <div class="col-6">
                  <div class="border rounded-3 p-3 h-100">
                    <div class="text-secondary small">Projects</div>
                    <div id="statProjects" class="h4 m-0 fw-bold">—</div>
                  </div>
                </div>
                <div class="col-6">
                  <div class="border rounded-3 p-3 h-100">
                    <div class="text-secondary small">New vs. Expansion</div>
                    <div class="fw-bold"><span id="statNew">—</span> / <span id="statExp">—</span></div>
                  </div>
                </div>
              </div>
              <div class="mt-3">
                <canvas id="sectorChart" height="160"></canvas>
              </div>
            </div>
          </div>

          <div class="col-12 col-lg-7">
            <div class="p-3 border rounded-3 h-100">
              <div class="d-flex align-items-center justify-content-between mb-2">
                <h6 class="m-0">Private Investment Plans</h6>
                <input id="tableSearch" class="form-control form-control-sm" placeholder="Search company/sector…" style="max-width:220px;">
              </div>
              <div class="table-responsive" style="max-height:360px; overflow:auto;">
                <table class="table table-sm align-middle">
                  <thead class="table-light">
                    <tr>
                      <th style="min-width:160px;">Company</th>
                      <th>Sector</th>
                      <th class="text-end" style="min-width:110px;">CAPEX (USD)</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody id="companyRows">
                    <tr>
                      <td colspan="4" class="text-center py-4 text-secondary">Select a country…</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>









    <!-- Bootstrap -->

    <style>
      :root {
        --accent: #1A73E8;
        /* primary blue */
        --chip-bg: #f8f9fa;
        --ticker-speed: 48s;
        /* marquee speed (lower = faster) */
      }

      /* Card shell */
      .tool-card {
        border: 1px solid #e9ecef;
        border-radius: 1rem;
        background: #fff;
      }

      /* Ticker / marquee */
      .ticker-viewport {
        position: relative;
        overflow: hidden;
        border-radius: .75rem;
      }

      .ticker-track {
        display: flex;
        align-items: center;
        gap: .5rem;
        width: max-content;
        animation: ticker var(--ticker-speed) linear infinite;
      }

      .ticker-paused .ticker-track {
        animation-play-state: paused;
      }

      @keyframes ticker {
        from {
          transform: translateX(0)
        }

        to {
          transform: translateX(-50%)
        }
      }

      /* Flag chips */
      .flag-chip {
        display: inline-flex;
        align-items: center;
        gap: .5rem;
        padding: .35rem .6rem;
        border-radius: 999px;
        background: var(--chip-bg);
        border: 1px solid #e9ecef;
        font-weight: 600;
        font-size: .92rem;
        white-space: nowrap;
        transition: box-shadow .2s, border-color .2s, background-color .2s, transform .08s;
        cursor: pointer;
        user-select: none;
      }

      .flag-chip img {
        width: 22px;
        height: 16px;
        object-fit: cover;
        border-radius: 2px;
      }

      .flag-chip:hover {
        background: #fff;
        border-color: var(--accent);
        box-shadow: 0 0 0 3px rgba(26, 115, 232, .15);
      }

      .flag-chip:active {
        transform: translateY(1px);
      }

      .flag-chip.active {
        background: #e7f0fe;
        border-color: var(--accent);
      }

      /* Stats header */
      .country-pill {
        display: inline-flex;
        align-items: center;
        gap: .5rem;
        border: 1px solid #e9ecef;
        border-radius: 999px;
        padding: .35rem .65rem;
      }

      .country-pill img {
        width: 18px;
        height: 12px;
        border-radius: 2px;
      }

      /* Table */
      .table-sm td,
      .table-sm th {
        padding: .4rem .5rem;
      }

      /* Let columns and text wrap properly inside flex/grid areas */
      section,
      aside {
        min-width: 0;
      }

      /* Panel shell (replaces inline styles) */
      .panel {
        border: 2px groove #0e0d0d33;
        border-radius: 10px;
        padding: clamp(10px, 1.6vw, 16px);
        background: #fff;
      }

      /* Fluid type + media */
      .hero-title {
        font-size: clamp(1.4rem, 1rem + 2.4vw, 3rem);
        line-height: 1.1;
        text-wrap: balance;
      }

      .ratio-hero img {
        object-fit: cover;
      }

      .featured-title {
        font-weight: 800;
        letter-spacing: .2px;
        font-size: clamp(1rem, .6rem + 1.2vw, 1.4rem);
      }

      .featured-item {
        padding-block: clamp(10px, 1.2vw, 14px);
      }

      .featured-item+.featured-item {
        border-top: 1px solid #e9ecef;
      }

      .featured-meta {
        font-size: clamp(.8rem, .6rem + .6vw, .95rem);
        color: #6c757d;
      }

      .featured-link {
        font-size: clamp(.95rem, .8rem + .6vw, 1.1rem);
        font-weight: 700;
        color: #111;
        text-decoration: none;
      }

      .featured-link:hover {
        text-decoration: underline;
      }

      /* Promo cards keep consistent height and readability */
      .promo {
        position: relative;
        overflow: hidden;
        border-radius: 1rem;
        box-shadow: 0 6px 24px rgba(0, 0, 0, .08);
        background: #000;
      }

      .promo img {
        width: 100%;
        height: 20rem;
        object-fit: cover;
        display: block;
        opacity: .9;
      }

      .promo::after {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg, rgba(0, 0, 0, .25), rgba(0, 0, 0, .65));
      }

      .promo-body {
        position: absolute;
        inset: 0;
        padding: 1.25rem;
        display: flex;
        flex-direction: column;
      }

      .promo h3 {
        color: #fff;
        font-weight: 800;
      }

      .promo p {
        color: rgba(255, 255, 255, .9);
        max-width: 28ch;
      }

      .promo-cta {
        margin-top: auto;
      }

      .promo-arrow {
        position: absolute;
        left: .75rem;
        bottom: 3.25rem;
        color: #fff;
        font-size: 1.25rem;
        font-weight: 800;
        z-index: 2;
      }

      /* Ticker bits (you already have these; included for completeness) */
      .ticker-card {
        border: 1px solid #e9ecef;
        border-radius: 1rem;
      }

      .ticker-viewport {
        position: relative;
        overflow: hidden;
        height: 46px;
        border-radius: .75rem;
        background: #fff;
      }

      .ticker-move {
        display: flex;
        width: max-content;
        animation: ticker-scroll var(--ticker-speed, 35s) linear infinite;
      }

      .ticker-paused .ticker-move {
        animation-play-state: paused;
      }

      .ticker-track {
        display: flex;
        align-items: center;
        gap: .75rem;
        padding: 0 .5rem;
      }

      @keyframes ticker-scroll {
        from {
          transform: translateX(0)
        }

        to {
          transform: translateX(-50%)
        }
      }


      .panel--scroll {
        max-height: 70vh;
        /* cap to viewport */
        overflow: auto;
        /* show scrollbar only if needed */
        -webkit-overflow-scrolling: touch;
        overscroll-behavior: contain;
      }

      /* make the heading stay visible while you scroll the list */
      .panel--sticky {
        position: sticky;
        top: 0;
        z-index: 1;
        background: #fff;
        /* match panel bg so it doesn't look transparent */
        padding-top: .25rem;
        /* optional: keep spacing */
      }

      /* (Optional) tweak the cap by breakpoint */
      @media (max-width: 576px) {
        .panel--scroll {
          max-height: 60vh;
        }
      }

      @media (min-width: 992px) {
        .panel--scroll {
          max-height: 75vh;
        }
      }
    </style>

    @include('layouts.script_african_slider')
  </section>

  <!-- ========== QUOTE + BIO ========== -->
  <section class="quote-block">
    <div class="quote-inner">
      <div class="quote-text">“It always seems impossible until it’s done.”</div>
      <div class="quote-attr">— Nelson Mandela</div>
      <p class="quote-bio">
        Raymoch is building trusted digital rails for African entrepreneurship: verified company profiles,
        a Cultural Trust Index, and market intelligence, so capital can find credible opportunities faster.
      </p>
    </div>
  </section>

</main>


<script src="{{asset('js/script_entire.js')}}"></script>


@endsection