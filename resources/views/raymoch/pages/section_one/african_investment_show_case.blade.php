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
              <tbody id="companyRows"><tr><td colspan="4" class="text-center py-4 text-secondary">Select a country…</td></tr></tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

  </div>
</div>









<!-- Bootstrap -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"/>

  <style>
    :root{
      --accent:#1A73E8;              /* primary blue */
      --chip-bg:#f8f9fa;
      --ticker-speed: 48s;           /* marquee speed (lower = faster) */
    }

    /* Card shell */
    .tool-card{ border:1px solid #e9ecef; border-radius:1rem; background:#fff; }

    /* Ticker / marquee */
    .ticker-viewport{ position:relative; overflow:hidden; border-radius:.75rem; }
    .ticker-track{ display:flex; align-items:center; gap:.5rem; width:max-content;
                   animation: ticker var(--ticker-speed) linear infinite; }
    .ticker-paused .ticker-track{ animation-play-state: paused; }
    @keyframes ticker { from{ transform:translateX(0) } to{ transform:translateX(-50%) } }

    /* Flag chips */
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

    /* Stats header */
    .country-pill{ display:inline-flex; align-items:center; gap:.5rem;
      border:1px solid #e9ecef; border-radius:999px; padding:.35rem .65rem; }
    .country-pill img{ width:18px; height:12px; border-radius:2px; }

    /* Table */
    .table-sm td,.table-sm th{ padding:.4rem .5rem; }
  
  /* Let columns and text wrap properly inside flex/grid areas */
  section, aside { min-width: 0; }

  /* Panel shell (replaces inline styles) */
  .panel{
    border:2px groove #0e0d0d33;
    border-radius:10px;
    padding:clamp(10px, 1.6vw, 16px);
    background:#fff;
  }

  /* Fluid type + media */
  .hero-title{ font-size:clamp(1.4rem,1rem + 2.4vw,3rem); line-height:1.1; text-wrap:balance; }
  .ratio-hero img{ object-fit:cover; }
  .featured-title{ font-weight:800; letter-spacing:.2px; font-size:clamp(1rem,.6rem + 1.2vw,1.4rem); }
  .featured-item{ padding-block:clamp(10px,1.2vw,14px); }
  .featured-item + .featured-item{ border-top:1px solid #e9ecef; }
  .featured-meta{ font-size:clamp(.8rem,.6rem + .6vw,.95rem); color:#6c757d; }
  .featured-link{ font-size:clamp(.95rem,.8rem + .6vw,1.1rem); font-weight:700; color:#111; text-decoration:none; }
  .featured-link:hover{ text-decoration:underline; }

  /* Promo cards keep consistent height and readability */
  .promo{ position:relative; overflow:hidden; border-radius:1rem; box-shadow:0 6px 24px rgba(0,0,0,.08); background:#000; }
  .promo img{ width:100%; height:20rem; object-fit:cover; display:block; opacity:.9; }
  .promo::after{ content:""; position:absolute; inset:0; background:linear-gradient(180deg, rgba(0,0,0,.25), rgba(0,0,0,.65)); }
  .promo-body{ position:absolute; inset:0; padding:1.25rem; display:flex; flex-direction:column; }
  .promo h3{ color:#fff; font-weight:800; }
  .promo p{ color:rgba(255,255,255,.9); max-width:28ch; }
  .promo-cta{ margin-top:auto; }
  .promo-arrow{ position:absolute; left:.75rem; bottom:3.25rem; color:#fff; font-size:1.25rem; font-weight:800; z-index:2; }

  /* Ticker bits (you already have these; included for completeness) */
  .ticker-card{ border:1px solid #e9ecef; border-radius:1rem; }
  .ticker-viewport{ position:relative; overflow:hidden; height:46px; border-radius:.75rem; background:#fff; }
  .ticker-move{ display:flex; width:max-content; animation: ticker-scroll var(--ticker-speed, 35s) linear infinite; }
  .ticker-paused .ticker-move{ animation-play-state: paused; }
  .ticker-track{ display:flex; align-items:center; gap:.75rem; padding:0 .5rem; }
  @keyframes ticker-scroll { from { transform: translateX(0) } to { transform: translateX(-50%) } }


  .panel--scroll{
    max-height: 70vh;               /* cap to viewport */
    overflow: auto;                 /* show scrollbar only if needed */
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
  }
  /* make the heading stay visible while you scroll the list */
  .panel--sticky{
    position: sticky; top: 0; z-index: 1;
    background: #fff;               /* match panel bg so it doesn't look transparent */
    padding-top: .25rem;            /* optional: keep spacing */
  }

  /* (Optional) tweak the cap by breakpoint */
  @media (max-width: 576px){ .panel--scroll{ max-height: 60vh; } }
  @media (min-width: 992px){ .panel--scroll{ max-height: 75vh; } }
</style>


<!-- JS libs -->
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>



<script>
$(function(){
  // ======== Countries (AU members + Western Sahara) ========
  const AFRICA = [
    {n:'Algeria',c:'dz'},{n:'Angola',c:'ao'},{n:'Benin',c:'bj'},{n:'Botswana',c:'bw'},
    {n:'Burkina Faso',c:'bf'},{n:'Burundi',c:'bi'},{n:'Cabo Verde',c:'cv'},
    {n:'Cameroon',c:'cm'},{n:'Central African Rep.',c:'cf'},{n:'Chad',c:'td'},
    {n:'Comoros',c:'km'},{n:'Congo (Rep.)',c:'cg'},{n:'Congo (DRC)',c:'cd'},
    {n:"Côte d’Ivoire",c:'ci'},{n:'Djibouti',c:'dj'},{n:'Egypt',c:'eg'},
    {n:'Equatorial Guinea',c:'gq'},{n:'Eritrea',c:'er'},{n:'Eswatini',c:'sz'},
    {n:'Ethiopia',c:'et'},{n:'Gabon',c:'ga'},{n:'Gambia',c:'gm'},
    {n:'Ghana',c:'gh'},{n:'Guinea',c:'gn'},{n:'Guinea-Bissau',c:'gw'},
    {n:'Kenya',c:'ke'},{n:'Lesotho',c:'ls'},{n:'Liberia',c:'lr'},
    {n:'Libya',c:'ly'},{n:'Madagascar',c:'mg'},{n:'Malawi',c:'mw'},
    {n:'Mali',c:'ml'},{n:'Mauritania',c:'mr'},{n:'Mauritius',c:'mu'},
    {n:'Morocco',c:'ma'},{n:'Mozambique',c:'mz'},{n:'Namibia',c:'na'},
    {n:'Niger',c:'ne'},{n:'Nigeria',c:'ng'},{n:'Rwanda',c:'rw'},
    {n:'São Tomé & Príncipe',c:'st'},{n:'Senegal',c:'sn'},{n:'Seychelles',c:'sc'},
    {n:'Sierra Leone',c:'sl'},{n:'Somalia',c:'so'},{n:'South Africa',c:'za'},
    {n:'South Sudan',c:'ss'},{n:'Sudan',c:'sd'},{n:'Tanzania',c:'tz'},
    {n:'Togo',c:'tg'},{n:'Tunisia',c:'tn'},{n:'Uganda',c:'ug'},
    {n:'Zambia',c:'zm'},{n:'Zimbabwe',c:'zw'},{n:'Western Sahara',c:'eh'}
  ];

  // ======== Build marquee ========
  const $track = $('#track');
  function chip(country){
    const url = `https://flagcdn.com/w40/${country.c}.png`;
    return $(`
      <a class="flag-chip" data-code="${country.c}" data-name="${country.n}">
        <img src="${url}" alt="${country.n} flag" loading="lazy"/><span>${country.n}</span>
      </a>`);
  }
  const $setA = $('<div class="d-inline-flex align-items-center gap-2 pe-2"></div>');
  const $setB = $('<div class="d-inline-flex align-items-center gap-2 ps-2" aria-hidden="true"></div>');
  AFRICA.forEach(c=> $setA.append(chip(c)));
  AFRICA.forEach(c=> $setB.append(chip(c)));
  $track.append($setA,$setB);

  // Pause / speed
  const $ticker = $('#ticker');
  $('#pauseBtn').on('click', function(){
    $ticker.toggleClass('ticker-paused');
    $(this).text($ticker.hasClass('ticker-paused') ? 'Resume' : 'Pause');
  });
  $('#speed').on('input', function(){
    document.documentElement.style.setProperty('--ticker-speed', this.value + 's');
  });

  // Hover pause (optional)
  $ticker.on('mouseenter', ()=> $ticker.addClass('ticker-paused'));
  $ticker.on('mouseleave', ()=> $ticker.removeClass('ticker-paused'));

  // ======== Stats + chart ========
  const ctx = document.getElementById('sectorChart');
  let sectorChart = new Chart(ctx, {
    type:'doughnut',
    data:{ labels:['Energy','Telecom','Manufacturing','Finance','Logistics'],
      datasets:[{ data:[0,0,0,0,0] }]},
    options:{ plugins:{ legend:{ position:'bottom' }}, cutout:'60%' }
  });

  function fmtMoney(n){ return n.toLocaleString(undefined,{maximumFractionDigits:0}); }

  function updateUI(country, payload){
    // header
    $('#countryName').text(country.n);
    $('#countryFlag').attr('src', `https://flagcdn.com/w20/${country.c}.png`);
    $('#lastUpdated').text('Updated: '+ new Date().toLocaleString());

    // stats
    $('#statCompanies').text(fmtMoney(payload.totals.companies));
    $('#statCapex').text('$ '+ fmtMoney(payload.totals.capex));
    $('#statProjects').text(fmtMoney(payload.totals.projects));
    $('#statNew').text(payload.totals.new);
    $('#statExp').text(payload.totals.expansion);

    // chart
    sectorChart.data.datasets[0].data = payload.sectors.map(s=>s.value);
    sectorChart.data.labels = payload.sectors.map(s=>s.name);
    sectorChart.update();

    // table
    const $rows = $('#companyRows');
    $rows.empty();
    payload.companies.forEach(row=>{
      $rows.append(`<tr>
        <td>${row.name}</td>
        <td>${row.sector}</td>
        <td class="text-end">$ ${fmtMoney(row.capex)}</td>
        <td><span class="badge ${row.status==='New'?'text-bg-primary':'text-bg-secondary'}">${row.status}</span></td>
      </tr>`);
    });
  }

  // Demo data generator (replace with your API)
  function demoData(code){
    const sectors = ['Energy','Telecom','Manufacturing','Finance','Logistics'];
    const rnd = (min,max)=> Math.floor(Math.random()*(max-min+1))+min;
    const companies = [];
    const count = rnd(6,12);
    let capexTotal = 0, newCount = 0, expCount = 0;
    for(let i=0;i<count;i++){
      const sector = sectors[rnd(0,sectors.length-1)];
      const capex = rnd(2,120)*1_000_000; // $2M–$120M
      const status = Math.random()<.55 ? 'New' : 'Expansion';
      if(status==='New') newCount++; else expCount++;
      capexTotal += capex;
      companies.push({
        name:`${sector} Corp ${i+1}`,
        sector, capex, status
      });
    }
    // sector totals
    const agg = {};
    companies.forEach(c=> agg[c.sector]=(agg[c.sector]||0)+c.capex);
    const sectorArr = Object.entries(agg).map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value);

    return {
      totals:{ companies: count, capex: capexTotal, projects: count, new:newCount, expansion:expCount },
      sectors: sectorArr,
      companies
    };
  }

  // If you have a backend route, swap to this:
  // function fetchData(country){
  //   return $.getJSON(`/api/investments?country=${country.c}`); // -> {totals, sectors, companies}
  // }

  // Handle selection
  function selectCountry(code){
    // active style
    $('.flag-chip').removeClass('active');
    $(`.flag-chip[data-code="${code}"]`).addClass('active');

    const c = AFRICA.find(x=>x.c===code);
    // fetchData(c).then(payload => updateUI(c, payload));
    const payload = demoData(code);
    updateUI(c, payload);
  }

  // Click on any flag
  $(document).on('click','.flag-chip', function(){
    selectCountry($(this).data('code'));
  });

  // Search in table
  $('#tableSearch').on('input', function(){
    const q = this.value.toLowerCase();
    $('#companyRows tr').each(function(){
      const txt = $(this).text().toLowerCase();
      $(this).toggle(txt.includes(q));
    });
  });

  // Select a sensible default (e.g., Nigeria)
  selectCountry('ng');
});
</script>
