{{-- resources/views/partials/header.blade.php --}}
{{-- Sourced from your header.html --}}
  <!-- ================= HEADER (Tier1 + Tier2) ================= -->
  <header class="header" id="nav" data-version="HeaderFooter_v1.0">
    <div class="row1">
      <div class="brandrow">
        <a class="brand" href="{{ route('entire') }}" aria-label="Raymoch home">
          <svg width="28" height="28" viewBox="0 0 200 200" aria-hidden="true">
            <polygon fill="none" stroke="currentColor" stroke-width="10" points="100,18 172,59 172,141 100,182 28,141 28,59"/>
            <text x="100" y="118" text-anchor="middle" style="fill:currentColor;font:700 105px Georgia">R</text>
          </svg>
          <span class="brand-word">Raymoch</span>
        </a>

        <button class="explore-toggle" id="exploreToggle" aria-haspopup="true" aria-expanded="false" aria-controls="t1Menu">
          <span class="dotgrid" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
          Explore
        </button>

        <div class="menu-panel" id="t1Menu" role="menu" aria-labelledby="exploreToggle" hidden>
          <div class="menu-head"><h4>Explore services</h4></div>
          <div class="menu-grid">
            <a class="menu-item" role="menuitem"   href="{{ route('Matching') }}"><h5>Trusted Matching</h5><p>Get paired with credible businesses using CTI & verification.</p></a>
            <a class="menu-item" role="menuitem"  href="{{ route('verification') }}"><h5>Verification</h5><p>CTI badges, document checks, and data provenance.</p></a>
            <a class="menu-item" role="menuitem"  href="{{ route('Market_Insight') }}"><h5>Research & Insights</h5><p>Sector reports, trends, and regional briefs.</p></a>
            <a class="menu-item" role="menuitem"  href="{{ route('services') }}"><h5>Programs & Services</h5><p>Advisory, partner programs, and support options.</p></a>
            <a class="menu-item" role="menuitem"  href="{{ route('incentives') }}"><h5>Policy & Incentives</h5><p>Tax credits, grants, and regulatory signals.</p></a>
            <a class="menu-item" role="menuitem"  href="{{ route('whitespace') }}"><h5>Whitespace Map</h5><p>Where demand outpaces supply across sectors.</p></a>
          </div>
        </div>
      </div>

    <div class="rightside">
      <form class="search-box" action="{{ route('explore2') }}">
        <input type="search" name="q" placeholder="Search companies, sectors, regions…"/>
      </form>
      <div class="auth">
        <a class="btn orange" target="_blank" href="{{ route('trial.page') }}">Request a free trial</a>
        <a class="btn primary" target="_blank"  href="{{ route('login') }}">Login</a>
        <a class="btn success"  target="_blank" href="{{ route('signup.index') }}">Sign up</a>
      </div>

      
    </div>
  </div>

  <div class="row2">
    <div class="wrap">
      <nav class="links" aria-label="Secondary">
        <a href="{{ route('explore2') }}">Businesses</a>
        <a href="{{ route('services') }}">Services</a>
        <a href="{{ route('insights') }}">Research &amp; Insights</a>
        <a href="{{ route('about') }}">Who We Are</a>
      </nav>
    </div>
  </div>

  </header>



  <!-- Hamburger Icon -->
  <div class="hamburger" id="hamburger">
    <span></span>
    <span></span>
    <span></span>
  </div>

  <!-- Popup -->
  <div class="popup-overlay" id="popup">
    <div class="popup-content">
      <button class="close-btn" id="closePopup">&times;</button>
      <h2>Welcome to Raymoch</h2>
      <div class="popup-buttons">
         {{-- <a class="btn orange" href="{{ route('trial.page') }}">Request a free trial</a> --}}
        <a class="btn primary" target="_blank" href="{{ route('login') }}">Login</a>
        <a class="btn success" target="_blank" href="{{ route('signup.index') }}">Sign up</a>
      </div>
      <div class="popup-links">
        <a href="{{ route('explore2') }}">Businesses</a>
        <a href="{{ route('services') }}">Services</a>
        <a href="{{ route('insights') }}">Research &amp; Insights</a>
        <a href="{{ route('about') }}">Who We Are</a>
           <a class="btn orange" href="{{ route('trial.page') }}">Request a free trial</a>
      </div>
    </div>
  </div>



    <script>
    const hamburger = document.getElementById('hamburger');
    const popup = document.getElementById('popup');
    const closePopup = document.getElementById('closePopup');

    hamburger.addEventListener('click', () => popup.style.display = 'flex');
    closePopup.addEventListener('click', () => popup.style.display = 'none');
    popup.addEventListener('click', e => { if (e.target === popup) popup.style.display = 'none'; });
  </script>




<style>
 /* ======= HAMBURGER ======= */
    .hamburger {
      display: none;
      flex-direction: column;
      gap: 5px;
      cursor: pointer;
      position: fixed;
      top: 18px;
      right: 22px;
      z-index: 1200;
    }
    .hamburger span {
      width: 26px;
      height: 3px;
      background: var(--brand-blue);
      border-radius: 2px;
    }

    /* ======= POPUP ======= */
    .popup-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.55);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 1300;
    }
    .popup-content {
      background: #fff;
      border-radius: 16px;
      padding: 28px 24px 36px;
      width: 90%;
      max-width: 360px;
      box-shadow: var(--shadow);
      text-align: center;
      position: relative;
      animation: fadeIn 0.25s ease-in;
    }
    .close-btn {
      position: absolute;
      top: 10px;
      right: 14px;
      background: none;
      border: none;
      font-size: 26px;
      color: var(--muted);
      cursor: pointer;
    }
    .popup-buttons {
      margin-top: 18px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      align-items: center;
    }
    .popup-links {
      border-top: 1px solid #e5e7eb;
      margin-top: 20px;
      padding-top: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      font-weight: 600;
    }
    .popup-links a {
      color: var(--brand-blue);
      text-decoration: none;
    }

    @keyframes fadeIn {
      from { transform: scale(0.96); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }

    /* RESPONSIVE */
    @media (max-width: 720px) {
      .auth, .row2 { display: none; }
      .hamburger { display: flex; }
    }
</style>



<script>
(function(){
  const btn = document.getElementById('exploreToggle');
  const menu = document.getElementById('t1Menu');
  if(btn && menu){
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      menu.hidden = open;
    });
    document.addEventListener('click', (e) => {
      if(!menu.contains(e.target) && !btn.contains(e.target)){
        btn.setAttribute('aria-expanded','false'); menu.hidden = true;
      }
    });
  }
})();
</script>
