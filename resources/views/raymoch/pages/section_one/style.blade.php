<link href="{{ asset('https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css') }}" rel="stylesheet">
<script src="{{ asset('https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js')}}"></script>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

  <style>
    :root{ --accent:#e11d48; --ink:#0f0f10; }
    body{ font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"; color:var(--ink); }
    .container-xxl{ max-width: 1200px; }
    /* Featured list */
    .featured-title{ font-weight:800; letter-spacing:.2px; }
    .featured-item{ padding:1rem 0; }
    .featured-item+ .featured-item{ border-top:1px solid #e9ecef; }
    .featured-meta{ font-size:.85rem; color:#6c757d; }
    .featured-link{ color:#111; text-decoration:none; font-weight:700; line-height:1.25; }
    .featured-link:hover{ text-decoration:underline; }

    /* Hero */
    .hero-tag{ font-size:.72rem; text-transform:uppercase; font-weight:900; letter-spacing:.08em; color:var(--accent); }
    .hero-kicker{ font-size:.8rem; color:#6c757d; margin-top:.25rem; }
    .hero-title{ font-weight:900; line-height:1.1; }
    .ratio-hero{ border-radius:1rem; overflow:hidden; }

    /* Right promo */
    .promo{ position:relative; overflow:hidden; border-radius:1rem; box-shadow:0 6px 24px rgba(0,0,0,.08); }
    .promo img{ width:100%; height:20rem; object-fit:cover; display:block; }
    .promo::after{ content:""; position:absolute; inset:0; background:linear-gradient(180deg, rgba(0,0,0,.35), rgba(0,0,0,.65)); }
    .promo-body{ position:absolute; inset:0; padding:1.25rem; display:flex; flex-direction:column; }
    .promo h3{ color:#fff; font-weight:800; }
    .promo p{ color:rgba(255,255,255,.9); max-width:26ch; }
    .promo-cta{ margin-top:auto; }
    .promo-cta .btn{ font-weight:700; border-radius:999px; }
    .promo-arrow{ position:absolute; left:.75rem; bottom:3.25rem; color:#fff; font-size:1.25rem; font-weight:800; z-index:2; }

    /* Utilities */
    .rounded-2xl{ border-radius:1rem; }

    :root { --accent:#e11d48; }
    .ticker-card{ border:1px solid #e9ecef; border-radius:1rem; }
    .status-dot{ width:.55rem; height:.55rem; border-radius:50%; display:inline-block; margin-right:.35rem; background:#22c55e; }
    .paused .status-dot{ background:#adb5bd; }

    /* viewport + motion */
    .ticker-viewport{ position:relative; overflow:hidden; height:46px; border-radius:.75rem; background:#fff; }
    .ticker-move{ display:flex; width:max-content; animation: ticker-scroll var(--ticker-speed, 35s) linear infinite; }
    .ticker-paused .ticker-move{ animation-play-state: paused; }
    .ticker-track{ display:flex; align-items:center; gap:.75rem; padding:0 .5rem; }

    /* clickable chips (anchors) */
    .ticker-item{
      display:inline-flex; align-items:center; gap:.5rem;
      white-space:nowrap; text-decoration:none; color:#111;
      border:1px solid #e9ecef; background:#f8f9fa; border-radius:999px;
      padding:.35rem .65rem; font-weight:600; font-size:.9rem; cursor:pointer;
      transition: box-shadow .2s, border-color .2s, background-color .2s;
    }
    .ticker-item:hover{ background:#fff; border-color:var(--accent); box-shadow:0 0 0 3px rgba(225,29,72,.12); }
    .ticker-item .num{
      display:inline-flex; align-items:center; justify-content:center;
      min-width:1.35rem; height:1.35rem; border-radius:999px;
      background:var(--accent); color:#fff; font-size:.75rem; font-weight:700;
    }

    @media (prefers-reduced-motion: reduce) { .ticker-move{ animation:none; } }
    @keyframes ticker-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }

    .btn-ghost{ background:#f1f3f5; border:1px solid #e9ecef; }
    .btn-ghost:hover{ background:#eceef1; }


    :root { --accent:#1506e8; }
    .ticker-card{ border:1px solid #e9ecef; border-radius:1rem; }
    .status-dot{ width:.55rem; height:.55rem; border-radius:50%; display:inline-block; margin-right:.35rem; background:#22c55e; }
    .paused .status-dot{ background:#adb5bd; }

    /* viewport + motion */
    .ticker-viewport{ position:relative; overflow:hidden; height:46px; border-radius:.75rem; background:#fffefe0c; }
    .ticker-move{ display:flex; width:max-content; animation: ticker-scroll var(--ticker-speed, 35s) linear infinite; }
    .ticker-paused .ticker-move{ animation-play-state: paused; }
    .ticker-track{ display:flex; align-items:center; gap:.75rem; padding:0 .5rem; }

    /* clickable chips (anchors) */
    .ticker-item{
      display:inline-flex; align-items:center; gap:.5rem;
      white-space:nowrap; text-decoration:none; color:#111;
      border:1px solid #e9ecef; background:#f8f9fa; border-radius:999px;
      padding:.35rem .65rem; font-weight:600; font-size:.9rem; cursor:pointer;
      transition: box-shadow .2s, border-color .2s, background-color .2s;
    }
    .ticker-item:hover{ background:#fff; border-color:var(--accent); box-shadow:0 0 0 3px rgba(225,29,72,.12); }
    .ticker-item .num{
      display:inline-flex; align-items:center; justify-content:center;
      min-width:1.35rem; height:1.35rem; border-radius:999px;
      background:var(--accent); color:#fff; font-size:.75rem; font-weight:700;
    }

    @media (prefers-reduced-motion: reduce) { .ticker-move{ animation:none; } }
    @keyframes ticker-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }

    .btn-ghost{ background:#f1f3f5; border:1px solid #e9ecef; }
    .btn-ghost:hover{ background:#eceef1; }
  </style>


















{{-- Middle Search Organizations Details Data Style sheet Data --}}

  {{-- <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">  This one creating a problem in the drop down menu of the header section if inserted the drop down is not coming so I omitted it --}}
  
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  
  
  <style>
      /* Make the image fully responsive */
      .carousel-inner img {
          width: 100%;
          height: 100%;
      }

      :root {
          --accent: #1506e8;
      }

      .ticker-card {
          border: 1px solid #e9ecef;
          border-radius: 1rem;
      }

      .status-dot {
          width: .55rem;
          height: .55rem;
          border-radius: 50%;
          display: inline-block;
          margin-right: .35rem;
          background: #22c55e;
      }

      .paused .status-dot {
          background: #adb5bd;
      }

      /* viewport + motion */
      .ticker-viewport {
          position: relative;
          overflow: hidden;
          height: 46px;
          border-radius: .75rem;
          background: #fffefe0c;
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

      /* clickable chips (anchors) */
      .ticker-item {
          display: inline-flex;
          align-items: center;
          gap: .5rem;
          white-space: nowrap;
          text-decoration: none;
          color: #111;
          border: 1px solid #e9ecef;
          background: #f8f9fa;
          border-radius: 999px;
          padding: .35rem .65rem;
          font-weight: 600;
          font-size: .9rem;
          cursor: pointer;
          transition: box-shadow .2s, border-color .2s, background-color .2s;
      }

      .ticker-item:hover {
          background: #fff;
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(225, 29, 72, .12);
      }

      .ticker-item .num {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 1.35rem;
          height: 1.35rem;
          border-radius: 999px;
          background: var(--accent);
          color: #fff;
          font-size: .75rem;
          font-weight: 700;
      }

      @media (prefers-reduced-motion: reduce) {
          .ticker-move {
              animation: none;
          }
      }

      @keyframes ticker-scroll {
          from {
              transform: translateX(0);
          }

          to {
              transform: translateX(-50%);
          }
      }

      .btn-ghost {
          background: #f1f3f5;
          border: 1px solid #e9ecef;
      }

      .btn-ghost:hover {
          background: #eceef1;
      }
  </style>