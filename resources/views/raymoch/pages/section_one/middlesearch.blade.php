 <aside class="col-12 col-md-3 col-xxl-8">
  {{-- <div class="container-xxl my-1 bg-light">
        <div id="orgTicker" class="ticker-card bg-white shadow-sm p-3">
        <div class="d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center gap-3">
        <span class="text-uppercase small fw-bold text-secondary">Organizations</span>
        <span id="tickerStatus" class="badge bg-success">
        <span class="status-dot"></span><span class="status-text">Running</span>
        </span>
        </div>

      <div class="d-flex align-items-center gap-2">
        <button id="pauseBtn" class="btn btn-ghost btn-sm" aria-pressed="false" aria-label="Pause">
          <span class="icon-pause">⏸</span><span class="icon-play d-none">▶</span>
        </button>
        <div class="d-none d-sm-flex align-items-center gap-2">
          <label for="speedRange" class="small text-secondary mb-0">Speed</label>
          <input id="speedRange" type="range" min="12" max="70" value="35" step="1" style="width:120px;">
        </div>
      </div>
    </div>

    <div id="tickerViewport" class="ticker-viewport mt-2 rounded"></div>
  </div>
</div> --}}

  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <style>
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
  </style>
</head>
<body class="bg-light">

<div class="container-xxl my-6">
  <div id="orgTicker" class="ticker-card bg-white shadow-sm p-3">

    <div class="d-flex align-items-center justify-content-between">
      <div class="d-flex align-items-center gap-3">
        <span class="text-uppercase small fw-bold text-secondary">Organizations</span>
        <span id="tickerStatus" class="badge bg-success">
          <span class="status-dot"></span><span class="status-text">Running</span>
        </span>
      </div>

      <div class="d-flex align-items-center gap-2">
        <button id="pauseBtn" class="btn btn-ghost btn-sm" aria-pressed="false" aria-label="Pause">
          {{-- <span class="icon-pause">⏸</span><span class="icon-play d-none">▶</span> --}}
        </button>
        <div class="d-none d-sm-flex align-items-center gap-2">
          <label for="speedRange" class="small text-secondary mb-0">Speed</label>
          <input id="speedRange" type="range" min="12" max="70" value="35" step="1" style="width:120px;">
        </div>
      </div>
    </div>

    <div id="tickerViewport" class="ticker-viewport mt-2 rounded"></div>
  </div>
</div>

<!-- MODAL: Organization details -->
<div class="modal fade" id="orgModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <div class="d-flex align-items-center gap-2">
          <div id="modalAvatar" class="rounded-circle d-inline-flex align-items-center justify-content-center"
               style="width:36px;height:36px;background:#f1f3f5;font-weight:800;"></div>
          <h5 class="modal-title" id="modalTitle">—</h5>
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <p id="modalDesc" class="mb-3 text-secondary">—</p>
        <div class="row g-3">
          <div class="col-6 col-md-3">
            <div class="small text-secondary">Sector</div>
            <div id="modalSector" class="fw-bold">—</div>
          </div>
          <div class="col-6 col-md-3">
            <div class="small text-secondary">Headquarters</div>
            <div id="modalHQ" class="fw-bold">—</div>
          </div>
          <div class="col-6 col-md-3">
            <div class="small text-secondary">CAPEX</div>
            <div id="modalCapex" class="fw-bold">—</div>
          </div>
          <div class="col-6 col-md-3">
            <div class="small text-secondary">Projects</div>
            <div id="modalProjects" class="fw-bold">—</div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <a id="modalLink" href="#" target="_blank" rel="noopener" class="btn btn-primary">Open page →</a>
      </div>
    </div>
  </div>
</div>

<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script>
  $(function () {
    // ==== DATA (add whatever fields you like; these are shown in the modal) ====
    const orgs = [
      { name:"Raymoch Group", url:"https://example.com/raymoch", sector:"Energy",      hq:"Asmara", capex:320_000_000, projects:7, desc:"Diversified energy projects across the Horn of Africa." },
      { name:"Adulis Logistics", url:"https://example.com/adulis", sector:"Logistics", hq:"Massawa", capex:85_000_000,  projects:4, desc:"Port & inland logistics services with regional coverage." },
      { name:"Aruco Manufacturing", url:"https://example.com/aruo", sector:"Manufacturing", hq:"Keren", capex:140_000_000, projects:6, desc:"Scaling light manufacturing and agro-processing." },
      { name:"Asmara Textiles", url:"https://example.com/asmara", sector:"Textiles",  hq:"Asmara", capex:60_000_000,   projects:3, desc:"Vertically integrated textile mill and apparel exports." },
      { name:"Dahlak Marine", url:"https://example.com/dahlak", sector:"Marine",      hq:"Massawa", capex:45_000_000,  projects:2, desc:"Offshore services and coastal fleet management." },
      { name:"Massawa Port Services", url:"https://example.com/mps", sector:"Ports",  hq:"Massawa", capex:210_000_000, projects:5, desc:"Private concessions improving port throughput." },
      { name:"Keren Foods", url:"https://example.com/keren", sector:"Food",           hq:"Keren",   capex:55_000_000,  projects:3, desc:"Food processing and cold-chain distribution." },
      { name:"Sawa Construction", url:"https://example.com/sawa", sector:"Construction", hq:"Asmara", capex:120_000_000, projects:5, desc:"Industrial parks and transport infrastructure builds." },
      { name:"Zula Energy", url:"https://example.com/zula", sector:"Energy",          hq:"Dekemhare", capex:95_000_000, projects:4, desc:"Distributed solar and mini-grid deployments." },
      { name:"Himbirti Tech", url:"https://example.com/himbirti", sector:"Technology", hq:"Asmara", capex:30_000_000,   projects:6, desc:"Cloud, data, and connectivity solutions." }
    ];

    // ==== Build ticker HTML: two tracks for seamless loop ====
    const $viewport = $('#tickerViewport');
    const $move = $('<div class="ticker-move"></div>');
    const $trackA = $('<div class="ticker-track"></div>');
    const $trackB = $('<div class="ticker-track" aria-hidden="true"></div>');

    function chip(org, i){
      const $a = $('<a class="ticker-item" role="button"></a>');
      // store index for lookup when clicked
      $a.attr('data-idx', i);
      $a.append(`<span class="num">${i+1}</span>`);
      $a.append(`<span class="label">${org.name}</span>`);
      return $a;
    }
    orgs.forEach((o, i) => $trackA.append(chip(o, i)));
    orgs.forEach((o, i) => $trackB.append(chip(o, i))); // duplicate set
    $move.append($trackA, $trackB);
    $viewport.append($move);

    // Hover pause
    $viewport.on('mouseenter', () => $('#orgTicker').addClass('ticker-paused'));
    $viewport.on('mouseleave', () => $('#orgTicker').removeClass('ticker-paused'));

    // Start/Pause toggle button
    const $ticker = $('#orgTicker');
    const $status = $('#tickerStatus');
    $('#pauseBtn').on('click', function(){
      $ticker.toggleClass('ticker-paused');
      const paused = $ticker.hasClass('ticker-paused');
      $(this).attr('aria-pressed', paused ? 'true' : 'false');
      $(this).find('.icon-pause').toggleClass('d-none', paused);
      $(this).find('.icon-play').toggleClass('d-none', !paused);
      $status.toggleClass('bg-success', !paused).toggleClass('bg-secondary', paused);
      $ticker.toggleClass('paused', paused);
      $status.find('.status-text').text(paused ? 'Paused' : 'Running');
    });

    // Speed control
    const $speed = $('#speedRange');
    function setSpeed(val){ document.getElementById('orgTicker').style.setProperty('--ticker-speed', `${val}s`); }
    setSpeed($speed.val());
    $speed.on('input change', function(){ setSpeed(this.value); });

    // ==== Modal helpers ====
    const orgModalEl = document.getElementById('orgModal');
    const orgModal = new bootstrap.Modal(orgModalEl, { backdrop:true });
    orgModalEl.addEventListener('show.bs.modal', () => $ticker.addClass('ticker-paused'));
    orgModalEl.addEventListener('hidden.bs.modal', () => $ticker.removeClass('ticker-paused'));

    function fmtMoney(n){ return '$ ' + n.toLocaleString(undefined, { maximumFractionDigits:0 }); }
    function avatarFor(name){
      const letter = (name||'?').trim().charAt(0).toUpperCase();
      return `<span>${letter}</span>`;
    }

    function openOrgModal(idx){
      const o = orgs[idx];
      if(!o) return;
      // fill modal
      $('#modalTitle').text(o.name);
      $('#modalAvatar').html(avatarFor(o.name));
      $('#modalDesc').text(o.desc || '—');
      $('#modalSector').text(o.sector || '—');
      $('#modalHQ').text(o.hq || '—');
      $('#modalCapex').text(fmtMoney(o.capex || 0));
      $('#modalProjects').text(o.projects ?? '—');
      $('#modalLink').attr('href', o.url || '#');

      orgModal.show();
    }

    // Click handler: open modal (centered)
    $viewport.on('click', '.ticker-item', function(e){
      e.preventDefault();
      const idx = Number($(this).data('idx'));
      openOrgModal(idx);
    });
  });
</script>
<br>
          <div class="ratio ratio-16x9 ratio-hero bg-light">
            <img src="{{ asset('storage/' . $HomePageActive->second_picture) }}" class="w-100 h-100" alt="Shipping containers" 
               style="object-fit:cover;"/>
               @php echo $HomePageActive->second_picture; @endphp
          </div>
          <div class="mt-4">
            <div class="hero-tag">Look Forward Report</div>
            <div class="hero-kicker">Global Realignment</div>
            <h1 class="display-5 hero-title mt-1">Eritrea Inc. heads to Global South in the age of tariffs</h1>
            <p class="text-secondary mb-0">Facing rising US tariffs, Chinese firms are pivoting to the Global South, 
                boosting trade and investment in the region. This shift signals a growing South–South trade dynamic 
                with China at its center.</p>
          </div>
          <hr class="my-4"/>
          <div class="small fw-bold text-uppercase accent">Look Forward Podcast</div>
          <div class="small text-secondary">Episode 5</div>
          <h3 class="h5 fw-bolder mt-1">Frontier Markets Uncovered</h3>

        </aside>
        