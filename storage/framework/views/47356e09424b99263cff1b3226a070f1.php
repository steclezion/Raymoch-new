

<link href="<?php echo e(asset('css/style_entire.css')); ?>" rel="stylesheet" type="text/css" id="bootstrap">

<?php echo app('Illuminate\Foundation\Vite')('resources/js/app.jsx'); ?>

<?php $__env->startSection('title','Raymoch • Request a Trial'); ?>
<?php $__env->startSection('content'); ?>
 <div class="hdr"><!--<div class="logo">Raymoch</div>--> </div>
  <main class="page-wrap">
    <section class="request-card" aria-label="Request status">
      <!-- Hero header pill -->
      <div class="pb-hero">
        <div>
          <h1 class="request-title">Request is in queue</h1>
          <div class="helper">Make better decisions faster</div>
        </div>
        <div class="helper" aria-hidden="true">Top Rated · Momentum Leader</div>
      </div>

      <!-- Success message (navy/indigo palette) -->
      <div class="success-banner" role="status" aria-live="polite">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="10" stroke="#3f47d6" stroke-width="2" fill="#e7e9ff"/>
          <path d="M8 12.5l2.5 2.5L16 9.5" stroke="#2830b5" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <div>
          <div style="font-weight:700; color:#17204a; margin-bottom:2px;">Your request is in queue</div>
          <div class="helper">Raymoch will respond within 24 hours.</div>
          <div class="helper">Raymoch will send a link to your email, see you soon!.</div>
        </div>
      </div>

      <!-- Optional action buttons -->
      <div class="actions">
        <a class="cta" href="/">
          <!-- Home icon -->
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 10.5l9-7 9 7V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5Z" stroke="rgba(255,255,255,.9)" stroke-width="1.6" fill="none"/>
          </svg>
          Back to home
        </a>
        <a class="cta ghost" href="mailto:support@raymoch.com">Contact support</a>
      </div>
    </section>
  </main>

  <style>
    :root{
      --bg: #f6f7fb;                   /* page background */
      --card-bg: #ffffff;              /* card */
      --hero-bg: #0f1a2d;              /* deep navy header */
      --ink: #0f172a;                  /* primary text */
      --muted: #6b7280;                /* helper text */
      --field-border: #e5e7eb;
      --shadow: 0 12px 40px rgba(9,12,38,.08);
      --radius-xl: 26px;

      /* primary indigo (CTA / highlights) */
      --primary-500: #3f47d6;
      --primary-600: #3541c7;
    }

    html,body{ height:100%; background:var(--bg); margin:0; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji"; color:var(--ink); }

    .page-wrap{
      min-height:100%;
      display:flex;
      align-items:center;
      justify-content:center;
      padding:24px;
    }

    .request-card{
      width: min(1120px, 94vw);
      background: var(--card-bg);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow);
      padding: 28px 28px 36px;
    }

    /* HERO pill */
    .pb-hero{
      background: var(--hero-bg);
      border-radius: 26px;
      padding: 28px 32px;
      color:#c0c8d8;
      display:flex;
      align-items:flex-start;
      justify-content:space-between;
      gap:5px;
      margin-bottom: 26px;
    }

    .request-title{
      color:#f2f6ff;
      font-size: clamp(28px, 4.2vw, 44px);
      line-height: 1.05;
      font-weight: 800;
      margin: 0 0 6px;
    }

    .helper{ color: var(--muted); font-size: 15px; }

    /* success ring */
    .success-banner{
      display:flex;
      gap:12px;
      align-items:flex-start;
      background:#f0f5ff;
      border:1px solid #d9e0ff;
      color:#1f2a66;
      border-radius:16px;
      padding:14px 16px;
      margin: 8px 0 18px;
    }
    .success-banner svg{ flex: 0 0 auto; }

    /* CTA row (optional) */
    .actions{
      display:flex;
      gap:12px;
      flex-wrap:wrap;
      margin-top:12px;
    }
    .cta{
      border:0;
      color:#fff;
      font-weight:700;
      letter-spacing:.2px;
      border-radius:999px;
      padding:14px 22px;
      cursor:pointer;
      background: linear-gradient(180deg, var(--primary-500), var(--primary-600));
      box-shadow: 0 10px 25px rgba(53,65,199,.25), inset 0 -2px 0 rgba(0,0,0,.08);
      transition: transform .08s ease, filter .15s ease;
      text-decoration:none;
      display:inline-flex;
      align-items:center;
      gap:8px;
    }
    .cta:hover{ filter:brightness(1.04); }
    .cta:active{ transform: translateY(1px); }

    .ghost{
      background:#ffffff;
      color:var(--primary-600);
      border:1px solid var(--field-border);
      box-shadow:none;
    }

    @media (max-width: 760px){
      .pb-hero{ padding:22px; }
      .request-card{ padding:22px; }
    }
  </style>

  <?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.app_raymoch_new', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH C:\Users\stecl\OneDrive\Documents\Raymoch\resources\views/pages/auth/trial-success.blade.php ENDPATH**/ ?>