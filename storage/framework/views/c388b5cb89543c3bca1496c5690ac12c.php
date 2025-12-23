

<link href="<?php echo e(asset('css/style_entire.css')); ?>" rel="stylesheet" type="text/css" id="bootstrap">

  
  <script>
    window.RAYMOCH = {
      API_BASE: "<?php echo e(url('/api')); ?>",           // Laravel proxy
      COMPANIES_URL: "<?php echo e(url('/companies')); ?>" // Laravel companies page
    };
  </script>
 
 <script src="<?php echo e(asset('js/explore.js')); ?>"></script>
 
<!-- Bootstrap CSS for Section 4 African Slides -->
<?php $__env->startSection('title','Raymoch • Business Explorer'); ?>
<?php $__env->startSection('content'); ?>

    <!-- ===== PAGE CONTENT (Explore) ===== -->

   <main>
    <section class="container">
      <div class="explore-hero">
        <h1>Explore Businesses</h1>
        <p>This is the front door. Pick a sector or search; we’ll show the right companies.</p>
      </div>

      <!-- Search panel -->
      <form class="search-panel card" role="search" id="searchForm">
        <div class="tier tier-1">
          <div class="input-wrap">
            <span class="icon">🔎</span>
            <input id="f-search" class="input" name="q" type="search" placeholder="Search businesses…" autocomplete="off" />
            <button id="go-search" class="go-btn" type="submit" aria-label="Search">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 21l-4.2-4.2m1.2-4.8a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              <span>Search</span>
            </button>
            <button id="clear-search" class="clear-btn" aria-label="Clear search" type="button">✕</button>
          </div>
        </div>

        <div class="tier tier-2" style="margin-top:8px">
          <select id="f-country" class="select" aria-label="Country"></select>
          <select id="f-sector" class="select" aria-label="Sector"></select>
          <label class="switch" title="Show verified companies only">
            <input id="f-verified" type="checkbox"/><span>Verified only</span>
          </label>
          <button id="do-search" class="btn primary" type="submit">Search</button>
        </div>

        <div class="tier tier-3" style="margin-top:6px">
          <a class="btn" id="allCompaniesBtn" href="<?php echo e(url('/company')); ?>">All Companies</a>
        </div>
      </form>

      <!-- Sector tiles -->
      <div class="sector-grid" id="sector-grid"></div>
      <div id="sectorMessage" class="msg" role="status" aria-live="polite"></div>
    </section>
  </main>

  





























  <!-- ===== PAGE-SPECIFIC (Explore) ===== -->
  <style>
    .container{max-width:1180px;margin:0 auto;padding:24px 20px}
    .explore-hero{text-align:center;padding:30px 12px}
    .explore-hero h1{font-size:40px;line-height:1.06;font-weight:900;color:#0A2A6B;margin:0 0 6px}
    .explore-hero p{color:#667085;margin:0}

    .search-panel{margin:12px auto 18px;padding:14px;border-radius:20px;border:1px solid var(--border);background:#fff;box-shadow:var(--shadow)}
    .tier{display:grid;gap:10px;align-items:center}
    .tier-1{grid-template-columns:1fr}
    .tier-2{grid-template-columns:1fr 1fr auto auto}
    .tier-3{grid-template-columns:1fr;justify-items:center}

    .input-wrap{position:relative}
    .input-wrap .icon{position:absolute;left:12px;top:50%;transform:translateY(-50%);font-size:.95rem;pointer-events:none;color:#94a3b8}
    .input{
      width:100%;height:44px;
      padding:0 108px 0 36px;
      border:1px solid var(--border);border-radius:var(--pill);font-size:.98rem;outline:none;background:#fff
    }
    .input:focus{border-color:#97b3ff;outline:3px solid #e5edff}
    .clear-btn, .go-btn{
      position:absolute; top:50%; transform:translateY(-50%);
      height:34px; padding:0 10px; border-radius:999px; border:1px solid var(--border);
      background:#fff; cursor:pointer; font-size:.95rem; line-height:32px;
    }
    .go-btn{
      right:44px;
      border-color:var(--brand-blue); background:var(--brand-blue); color:#fff; font-weight:800;
      display:inline-flex; align-items:center; gap:6px; padding:0 12px;
    }
    .go-btn svg{width:16px;height:16px}
    .clear-btn{ right:8px; color:#9aa3b2; background:#f8fafc; }

    select.select{width:100%;height:44px;padding:0 14px;border:1px solid var(--border);border-radius:var(--pill);font-size:.98rem;outline:none;background:#fff}
    select.select:focus{border-color:#97b3ff;outline:3px solid #e5edff}
    .switch{display:flex;align-items:center;gap:8px;font-size:.96rem;color:#0f1222}
    .switch input{appearance:none;width:46px;height:26px;border-radius:var(--pill);background:#e5e7eb;position:relative;cursor:pointer;transition:background .2s}
    .switch input:checked{background:#0A2A6B}
    .switch input::after{content:'';position:absolute;top:3px;left:3px;width:20px;height:20px;background:#fff;border-radius:50%;transition:left .2s}
    .switch input:checked::after{left:23px}

    .sector-grid{
      display:grid;
      grid-template-columns:repeat(auto-fit,minmax(240px,1fr));
      gap:12px;padding:4px 2px;margin-bottom:10px
    }
    .sector-card{background:#fff;border:1px solid var(--border);border-radius:16px;box-shadow:var(--shadow);padding:14px;min-height:96px;transition:transform .16s ease,box-shadow .16s ease;cursor:pointer;text-align:left;display:block;width:100%}
    .sector-card:hover{transform:translateY(-2px);box-shadow:0 14px 34px rgba(10,42,107,.10)}
    .sector-card .icon{font-size:1.3rem;margin-bottom:.3rem;display:inline-block}
    .sector-card h3{font-size:.98rem;color:#0A2A6B;margin:0 0 .08rem}
    .sector-card p{font-size:.84rem;color:#6b7280;margin:0}
    .sector-card:focus{outline:3px solid #c7d2fe;outline-offset:3px}

    .msg{display:none;margin:8px 2px 0;padding:10px 12px;border-radius:12px;border:1px dashed #c7d2fe;background:#f8faff;color:#0a2a6b;font-weight:700}
    .msg.show{display:block}
  </style>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.app_raymoch_new', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH C:\Users\stecl\OneDrive\Documents\Raymoch\resources\views/pages/business.blade.php ENDPATH**/ ?>