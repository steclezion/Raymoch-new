


<link href="<?php echo e(asset('css/style_companies.css')); ?>" rel="stylesheet" type="text/css" id="css_companies">




<?php $__env->startSection('title', 'Raymoch • Connecting Africa'); ?>
<?php $__env->startSection('content'); ?>
  <!-- ================= JS ================= -->
  <script>
    /* Tier-1 Explore menu toggle */
    (() => {
      const btn = document.getElementById('exploreToggle');
      const menu = document.getElementById('t1Menu');
      if (!btn || !menu) return;
      const openMenu = (on) => { btn.setAttribute('aria-expanded', on ? 'true' : 'false'); menu.hidden = !on; };
      btn.addEventListener('click', (e) => { e.preventDefault(); openMenu(btn.getAttribute('aria-expanded') !== 'true'); });
      document.addEventListener('click', (e) => { if (!menu.hidden && !menu.contains(e.target) && !btn.contains(e.target)) openMenu(false); });
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape') openMenu(false); });
    })();

    /* A11y roles for menu items */
    (() => {
      const menu = document.getElementById('t1Menu');
      menu?.querySelectorAll('a.menu-item').forEach(a => a.setAttribute('role','menuitem'));
    })();
  </script>



  <!-- ===================== HERO ===================== -->
  <section class="hero" aria-label="Raymoch Services">
    <div class="wrap">
      <h2>Services</h2>
      <p>Build trust. Get seen. Partner smart.</p>
    </div>
  </section>

  <main>
    <div class="container">
      <!-- SERVICES MENU -->
      <section class="svc-menu" aria-labelledby="svcMenuTitle">
        <h3 id="svcMenuTitle" style="margin:0 0 8px;color:var(--brand-blue)">Choose a service</h3>

        <div class="svc-grid" id="svcGrid">
          <a class="svc-box svc-col-3" href="<?php echo e(route('matching')); ?>" id="boxMatching">
            <h3>Matching</h3>
            <p>Investor inputs → ranked SME matches.</p>
          </a>
          <a class="svc-box svc-col-3" href="<?php echo e(route('partner-programs')); ?>" id="boxPartners">
            <h3>Partner Programs</h3>
            <p>Accelerators & syndicates, plugged in.</p>
          </a>
          <a class="svc-box svc-col-3"  href="<?php echo e(route('verification')); ?>" id="boxVerify">
            <h3>Verification</h3>
            <p>CTI checks: identity, ownership, basics.</p>
          </a>
          <a class="svc-box svc-col-3"    href="<?php echo e(route('visibility-listing')); ?>" id="boxListing">
            <h3>Visibility & Listing</h3>
            <p>Get listed. Get discovered.</p>
          </a>
        </div>
      </section>
    </div>
  </main>

    <style>
    /* =========================================================
       RAYMOCH COLOR SYSTEM — MASTER TOKENS (GLOBAL DEFAULTS)
       (Copied from landing to guarantee consistency)
       ========================================================= */
    :root{
      --brand-blue:#0328aeed;
      --brand-blue-700:#213bb1;
      --brand-blue-500:#041b64;
      --accent-gold:#7a7797a8;

      --ink:#101114;
      --muted:#3c4b69;
      --bg:#fafafa;        /* light page background */
      --border:#e8e8ee;
      --card:#ffffff;

      --radius:14px; --pill:999px;
      --shadow:0 6px 22px rgba(10,42,107,.08);
      --maxw:1328px; --gutter:18px;

      --footer-bg:#0b1020; /* single source of truth */
    }

    *{box-sizing:border-box;margin:0;padding:0;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif}

    /* ========= Canvas + Overscroll fixes (no white under footer) ========= */
    html{
      background:var(--footer-bg);           /* canvas matches footer */
      height:100%;
    }
    body{
      color:var(--ink);
      line-height:1.5;
      min-height:100dvh;
      display:flex;
      flex-direction:column;
      overscroll-behavior-y:none;            /* stop bounce on modern engines */

      /* Light page → fades to footer color near the bottom.
         This masks iOS rubber-band past the end. */
      background:
        linear-gradient(to bottom,
          var(--bg) 0%,
          var(--bg) calc(100% - 240px),
          var(--footer-bg) calc(100% - 240px),
          var(--footer-bg) 100%);
    }
    /* iOS safe-area guard so the very bottom sliver stays dark too */
    body::after{
      content:"";
      position:fixed;
      inset:auto 0 0 0;
      height:env(safe-area-inset-bottom, 0);
      background:var(--footer-bg);
      pointer-events:none;
      z-index:1;
    }

    a{color:inherit;text-decoration:none}
    img{max-width:100%;display:block}
    .wrap{max-width:var(--maxw);margin:0 auto;padding:0 var(--gutter)}
    main{flex:1}

    /* ===================== HEADER (Tier1 + Tier2) ===================== */
    .header{
      --nav-brand: var(--brand-blue);
      --nav-link:  #0f172a;
      --nav-hover: #0a2a6b;
      --nav-bg:    #ffffff;
      --nav-fg:    var(--ink);
      background: var(--nav-bg); color: var(--nav-fg);
      position:sticky;top:0;z-index:1000;border-bottom:1px solid var(--border)
    }
    .row1{
      display:flex;justify-content:space-between;align-items:center;gap:16px;
      padding:12px 8px; margin:15px; box-shadow:0 1px 0 rgba(0,0,0,.05);
      position:relative;
      background:#fff; border-radius:12px;
    }
    .brandrow{display:flex;align-items:center;gap:22px}
    .brand{display:flex;align-items:center;gap:10px;color:var(--nav-brand)}
    .brand-word{font-weight:900;font-size:1.4rem;color:var(--nav-brand);letter-spacing:.2px}
    .dotgrid{width:18px;height:18px;display:inline-grid;grid-template-columns:repeat(2,1fr);gap:2px}
    .dotgrid i{width:5px;height:5px;border-radius:2px;background:#101114}
    .rightside{display:flex;align-items:center;gap:14px;margin-right:0}
    .search-box{min-width:140px;width:18vw;max-width:260px}
    .search-box input{width:100%;height:40px;padding:0 14px;border:1px solid var(--border);border-radius:var(--pill)}
    .search-box input:focus{border-color:var(--nav-brand);outline:2px solid #cfe0ff}
    .auth{display:flex;align-items:center;gap:10px}
    .btn{height:40px;display:inline-flex;align-items:center;gap:8px;padding:0 16px;border-radius:var(--pill);font-weight:700;background:#fff;border:1px solid var(--border)}
    .btn.primary{background:var(--nav-brand);color:#fff;border-color:var(--nav-brand)}

    .explore-toggle{
      appearance:none;border:0;background:transparent;cursor:pointer;
      display:flex;align-items:center;gap:8px;font-weight:800;color:var(--nav-link);padding:6px 8px;border-radius:8px;font-size:1.1rem;
    }
    .explore-toggle:hover,
    .explore-toggle[aria-expanded="true"]{ background:#eceff3;color:var(--nav-hover); }

    .menu-panel{
      position:absolute; top:calc(100% + 10px); left:15px; z-index:1100;
      width:min(760px, calc(100vw - 40px));
      background:#fff;border:1px solid var(--border);border-radius:14px;box-shadow:var(--shadow);
      padding:14px;
    }
    .menu-panel[hidden]{ display:none; }
    .menu-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
    .menu-head h4{margin:0;font-size:1rem}
    .menu-grid{display:grid;grid-template-columns:repeat(2,minmax(240px,1fr));gap:12px}
    .menu-item{display:block;padding:12px;border:1px solid var(--border);border-radius:12px;background:#fff;}
    .menu-item:hover{transform:translateY(-1px);box-shadow:0 8px 20px rgba(0,0,0,.06)}
    .menu-item h5{margin:0 0 6px;font-size:.98rem}
    .menu-item p{margin:0;color:var(--muted);font-size:.92rem}

    .row2{background:#f5f6f8;border-top:1px solid #eee;border-bottom:1px solid #e6e6e6;padding-left:15px}
    .row2 .wrap{max-width:none;padding:0}
    .row2 .links{display:flex;gap:18px;padding:8px 8px;margin:0;justify-content:flex-start;align-items:center}
    .row2 a{font-weight:600;font-size:.92rem;padding:4px 6px;border-radius:4px;color:var(--nav-link)}
    .row2 a:hover{background:#eceff3;color:var(--nav-hover)}
    @media (max-width:800px){ .search-box{width:34vw;max-width:300px} }
    @media (max-width:720px){ .row2{display:none} .search-box{min-width:0;width:46vw} }

    .header a:focus-visible, .header button:focus-visible, .btn:focus-visible {
      outline: 2px solid #cfe0ff; outline-offset: 2px;
    }

    /* ===================== HERO (services) ===================== */
    .hero{
      width:100%;
      margin:0;
      background:linear-gradient(135deg, var(--brand-blue-700), var(--brand-blue-500));
      color:#fff;
      padding:clamp(40px,4vw,80px) 0;
      text-align:left;
      border-bottom:1px solid var(--border);
    }
    .hero .wrap{display:flex;flex-direction:column;gap:10px}
    .hero h2{
      margin:0;font-weight:900;font-size:clamp(32px,5vw,52px);letter-spacing:.2px;
      background:linear-gradient(90deg,#fff,#e7efff);-webkit-background-clip:text;background-clip:text;color:transparent
    }
    .hero p{margin:6px 0 0;max-width:900px;font-size:clamp(16px,2vw,20px);color:#DDEBFF}

    /* ===================== SERVICES GRID ===================== */
    .container{max-width:1100px;margin:0 auto;padding:24px}
    .svc-menu{margin-top:clamp(28px,6vw,72px); margin-bottom:clamp(48px,10vw,128px)}
    .svc-grid{display:grid;grid-template-columns:repeat(12,1fr);gap:20px}
    .svc-col-3{grid-column:span 3}
    .svc-box{
      display:block;border:1px solid var(--border);border-radius:20px;background:var(--card);
      padding:28px 24px 24px;box-shadow:var(--shadow);text-decoration:none;color:inherit;
      transition:transform .12s ease, box-shadow .12s ease;min-height:190px
    }
    .svc-box:hover{transform:translateY(-2px);box-shadow:0 14px 36px rgba(6,60,168,.12)}
    .svc-box h3{margin:0 0 6px;font-size:18px}
    .svc-box p{margin:6px 0 0;color:#475569}
    @media (max-width: 900px){
      .svc-grid{grid-template-columns:1fr}
      .svc-col-3{grid-column:span 12}
    }

    /* ================= FOOTER pinned by flex; color matches canvas ================= */
    footer{margin-top:auto;background:var(--footer-bg);color:#cbd5e1;}
    @media (max-width: 860px){
      footer .wrap > div[style*="grid-template-columns"]{
        display:grid;grid-template-columns:1fr;gap:16px !important;
      }
    }
  </style>



<?php $__env->stopSection(); ?>



<?php echo $__env->make('layouts.app_raymoch_new', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH C:\Users\stecl\OneDrive\Documents\Raymoch\resources\views/pages/services.blade.php ENDPATH**/ ?>