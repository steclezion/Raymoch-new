


<link href="<?php echo e(asset('css/style_companies.css')); ?>" rel="stylesheet" type="text/css" id="css_companies">

<?php $__env->startSection('title', 'Raymoch • Matching • Services'); ?>
<?php $__env->startSection('content'); ?>




  <main>
    <div class="container">
      <!-- HERO -->
      <section class="hero">
        <h2>Match With The Right African SMEs </h2>
        <p></p>
      </section>

      <!-- STEP: Search & Refine -->
      <section class="step" id="searchStep">
        <header>
          <h3>Search & Refine</h3>
          <span class="hint"><span class="count" id="matchCountTop" aria-live="polite">0</span> businesses match your current filters</span>
        </header>
        <div class="body">
          <div class="grid">
            <!-- Filters -->
            <div class="col-7 card">
              <h4 style="margin:0 0 10px">Filters</h4>
              <div class="row">
                <input id="q2" class="input" placeholder="Search by name, city, keyword…" aria-label="Keyword search" />
                <select id="country2" class="input" aria-label="Country"></select>
                <select id="sector2" class="input" aria-label="Sector">
                  <option value="">All sectors</option>
                  <option>Agriculture & Food</option><option>FinTech</option><option>Energy & Renewables</option>
                  <option>Manufacturing</option><option>Health</option><option>Education</option>
                  <option>Logistics</option><option>Retail</option><option>Tourism</option><option>Construction</option>
                </select>
              </div>
              <div class="row" style="margin-top:10px">
                <input id="min2" class="input" type="number" placeholder="Min ticket ($)" aria-label="Minimum ticket" />
                <input id="max2" class="input" type="number" placeholder="Max ticket ($)" aria-label="Maximum ticket" />
                <select id="cti" class="input" aria-label="CTI depth">
                  <option value="">Any CTI depth</option>
                  <option value="existence">Existence Only</option>
                  <option value="verified">Verified</option>
                  <option value="deep">Deep CTI</option>
                </select>
              </div>
              <div id="rangeWarn" class="hint" aria-live="polite"></div>
              <div class="row" style="margin-top:10px">
                <label class="pill"><input type="checkbox" value="equity" class="instr" /> Equity</label>
                <label class="pill"><input type="checkbox" value="revenue share" class="instr" /> Revenue share</label>
                <label class="pill"><input type="checkbox" value="debt" class="instr" /> Debt</label>
                <label class="pill"><input type="checkbox" value="grant" class="instr" /> Grant</label>
              </div>
              <div class="row" style="margin-top:12px">
                <button class="btn" id="doMatch">Match</button>
                <span class="hint">Preview updates live. Click a preview card to open the profile.</span>
              </div>
            </div>

            <!-- Preview -->
            <div class="col-5">
              <div class="card">
                <div class="row" style="justify-content:space-between;align-items:center">
                  <h4 style="margin:0">Preview</h4>
                  <div class="seg" role="tablist" aria-label="Preview mode">
                    <button class="active" id="segSuggested" role="tab" aria-selected="true" aria-controls="miniPreview">Suggested</button>
                    <button id="segLatest" role="tab" aria-selected="false" aria-controls="miniPreview">Latest</button>
                  </div>
                </div>
                <div id="miniPreview" style="margin-top:6px"></div>
                <div class="hint" style="margin-top:8px">You’ll see the full list on the next step.</div>
              </div>
            </div>
          </div>

          <div style="margin-top:16px" class="row">
            <button class="btn secondary" id="toMatches">Continue</button>
          </div>
        </div>
        <div class="actions">
          <span class="hint">Preview: <span class="count" id="matchCountBottom" aria-live="polite">0</span> potential matches.</span>
        </div>
      </section>

      <!-- STEP: Matches -->
      <section class="step hidden" id="matchStep">
        <header>
          <h3>Matched businesses</h3>
          <span class="hint" id="showingText" aria-live="polite">Showing 0 of 0</span>
        </header>
        <div class="body" id="results"></div>
        <div class="actions">
          <button class="btn secondary" id="backToSearch">Back</button>
          <span style="flex:1"></span>
          <button class="btn" id="continueCTA">Continue</button>
        </div>
      </section>

      <!-- STEP: Company Profile -->
      <section class="step hidden" id="profileStep">
        <header>
          <h3 id="profName">Company</h3>
          <span class="hint" id="profMeta"></span>
        </header>
        <div class="body" id="profBody"></div>
        <div class="actions">
          <button class="btn secondary" id="backFromProfile">Back</button>
          <span style="flex:1"></span>
          <button class="btn" id="contactCTA">Contact</button>
        </div>
      </section>

      <!-- FOOTER -->
      <footer>
        <div class="row">
          <div>© <span id="y"></span> Raymoch: Trust-driven matching for African & diaspora SMEs.</div>
          <nav>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </nav>
        </div>
      </footer>
    </div>
  </main>


    <script>
    // Helpers
    const $ = s => document.querySelector(s);
    const on = (sel, evt, fn) => { const el = (typeof sel==='string') ? $(sel) : sel; if(el) el.addEventListener(evt, fn); };
    document.getElementById('y').textContent = new Date().getFullYear();

    // ===== Full AU country list (55) =====
    const AU_COUNTRIES = [
      "Algeria","Angola","Benin","Botswana","Burkina Faso","Burundi","Cabo Verde","Cameroon",
      "Central African Republic","Chad","Comoros","Congo (Republic)","Congo (Democratic Republic)",
      "Côte d’Ivoire","Djibouti","Egypt","Equatorial Guinea","Eritrea","Eswatini","Ethiopia","Gabon",
      "Gambia","Ghana","Guinea","Guinea-Bissau","Kenya","Lesotho","Liberia","Libya","Madagascar",
      "Malawi","Mali","Mauritania","Mauritius","Morocco","Mozambique","Namibia","Niger","Nigeria",
      "Rwanda","Sahrawi Arab Democratic Republic","São Tomé and Príncipe","Senegal","Seychelles",
      "Sierra Leone","Somalia","South Africa","South Sudan","Sudan","Tanzania","Togo","Tunisia",
      "Uganda","Zambia","Zimbabwe"
    ];

    // Populate country dropdown
    (function populateCountries(){
      const sel = $('#country2'); if(!sel) return;
      sel.innerHTML = `<option value="">All countries (${AU_COUNTRIES.length})</option>` +
        AU_COUNTRIES.map(c => `<option>${c}</option>`).join('');
    })();

    // ------- Stub Data -------
    const DATA = [
      { name:"Shashamane Agro Co.", country:"Ethiopia", sector:"Agriculture & Food",
        min:15000, max:80000, accepts:["revenue share","equity"], cti:"verified",
        freshnessDays:21, fit:"Great fit", why:["ticket aligned","instrument match","timing ok","preferred sector","ready soon"],
        about:"Regional agro-processing firm focused on grain and oilseeds. Strong local supply relationships.",
        needs:"Working capital + small-scale equipment upgrades.", links:{site:"#", deck:"#"} },
      { name:"LipaLink", country:"Kenya", sector:"FinTech",
        min:25000, max:120000, accepts:["equity","debt"], cti:"existence",
        freshnessDays:14, fit:"Good fit", why:["ticket aligned","sector focus"],
        about:"Payments aggregator for SMEs bridging mobile money and bank rails.",
        needs:"Seed extension.", links:{site:"#", deck:"#"} },
      { name:"SunBloom Energy", country:"Rwanda", sector:"Energy & Renewables",
        min:50000, max:200000, accepts:["equity","revenue share"], cti:"deep",
        freshnessDays:3, fit:"Great fit", why:["timing ok","impact aligned","CTI depth"],
        about:"C&I solar EPC with recurring O&M contracts.",
        needs:"Project finance for 1.2MW pipeline.", links:{site:"#", deck:"#"} },
      { name:"Medura Clinics", country:"Ghana", sector:"Health",
        min:10000, max:60000, accepts:["revenue share"], cti:"verified",
        freshnessDays:33, fit:"Possible match", why:["early pipeline"],
        about:"Primary care clinics expanding to peri-urban areas.",
        needs:"Equipment leasing + short-term WC.", links:{site:"#", deck:"#"} }
    ];

    // ------- Utilities -------
    const moneyFmt = new Intl.NumberFormat(undefined,{style:'currency',currency:'USD',maximumFractionDigits:0});
    const money = n => moneyFmt.format(n);
    const debounce = (fn, ms=150) => { let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a), ms); }; };

    // ------- Filters / matching -------
    function getFilters(){
      const kw = ($('#q2')?.value || '').trim().toLowerCase();
      const country = $('#country2')?.value || '';
      const sector = $('#sector2')?.value || '';
      let min = parseInt($('#min2')?.value || '0',10);
      let max = parseInt($('#max2')?.value || '999999999',10);
      if (Number.isNaN(min)) min = 0;
      if (Number.isNaN(max)) max = 999999999;

      const warn = $('#rangeWarn');
      if (min > max){
        [min,max] = [max,min];
        if (warn) warn.textContent = 'Swapped ticket range to make sense.';
      } else if (warn) warn.textContent = '';

      const cti = $('#cti')?.value || '';
      const instr = [...document.querySelectorAll('.instr:checked')].map(x=>x.value);
      return {kw,country,sector,min,max,cti,instr};
    }

    function passes(d,f){
      if (f.kw){
        const hay = `${d.name} ${d.country} ${d.sector}`.toLowerCase();
        if (!hay.includes(f.kw)) return false;
      }
      if (f.country && d.country!==f.country) return false;
      if (f.sector && d.sector!==f.sector) return false;
      if (d.max < f.min) return false;
      if (d.min > f.max) return false;
      if (f.cti && d.cti!==f.cti) return false;
      if (f.instr.length && !f.instr.some(x=>d.accepts.includes(x))) return false;
      return true;
    }

    function currentMatches(){ const f=getFilters(); return DATA.filter(d=>passes(d,f)); }

    // ------- Preview mode toggle -------
    let previewMode = 'suggested';
    const updateSeg = () => {
      const sug = $('#segSuggested'), lat = $('#segLatest');
      const sugActive = previewMode==='suggested';
      if (sug){ sug.classList.toggle('active',sugActive); sug.setAttribute('aria-selected', String(sugActive)); }
      if (lat){ lat.classList.toggle('active',!sugActive); lat.setAttribute('aria-selected', String(!sugActive)); }
    };
    on('#segSuggested','click', ()=>{ previewMode='suggested'; updateSeg(); updateAll(); });
    on('#segLatest','click', ()=>{ previewMode='latest'; updateSeg(); updateAll(); });

    // ------- Update counts + mini preview -------
    function updateAll(){
      const list = currentMatches();
      $('#matchCountTop') && ($('#matchCountTop').textContent = list.length);
      $('#matchCountBottom') && ($('#matchCountBottom').textContent = list.length);

      const mini = $('#miniPreview'); if(!mini) return;
      mini.innerHTML = '';

      if(previewMode === 'latest'){
        const latest = [...DATA].sort((a,b)=> a.freshnessDays - b.freshnessDays).slice(0,3);
        latest.forEach(d => mini.appendChild(makeMiniCard(d, {showFit:false, showFresh:true})));
        return;
      }
      if(!list.length){
        mini.innerHTML = `<div class="hint">No matches yet. Try broadening filters.</div>`;
      }else{
        list.slice(0,3).forEach(d => mini.appendChild(makeMiniCard(d, {showFit:true, showFresh:false})));
      }
    }

    function activateOnKey(el, action){
      el.addEventListener('keydown', (e)=>{
        if (e.key==='Enter' || e.key===' '){ e.preventDefault(); action(); }
      });
    }

    function makeMiniCard(d, opts={showFit:true, showFresh:false}){
      const div = document.createElement('div');
      div.className = 'card mini';
      div.style.marginTop = '10px';
      div.setAttribute('role','button');
      div.tabIndex = 0;
      div.innerHTML = `
        <div class="biz-head">
          <div>
            <div class="biz-title">${d.name}</div>
            <div class="muted">${d.country} · ${d.sector}</div>
            <div style="margin-top:6px">
              <span class="badge">${d.cti==='existence'?'Existence Only':d.cti==='verified'?'Verified':'Deep CTI'}</span>
              ${opts.showFit ? `<span class="badge green">${d.fit}</span>` : ``}
              ${opts.showFresh ? `<span class="badge">Verified ${d.freshnessDays}d ago</span>` : ``}
            </div>
          </div>
          <div style="text-align:right;min-width:160px">
            <div class="muted">Ticket</div>
            <div style="font-weight:800">${money(d.min)} – ${money(d.max)}</div>
          </div>
        </div>`;
      const open = ()=> openProfile(d);
      div.addEventListener('click', open);
      activateOnKey(div, open);
      return div;
    }

    // ------- Full results -------
    function renderResults(){
      const list = currentMatches();
      const root = $('#results'); if(!root) return;
      root.innerHTML = '';
      if (!list.length){
        root.innerHTML = `<div class="card"><strong>No matches (yet).</strong><div class="hint">Broaden ticket band, remove a constraint, or switch CTI depth.</div></div>`;
      } else {
        list.forEach(d=>{
          const card = document.createElement('div');
          card.className = 'card';
          card.style.cursor = 'pointer';
          card.setAttribute('role','button');
          card.tabIndex = 0;
          const open = ()=> openProfile(d);
          card.addEventListener('click', open);
          activateOnKey(card, open);
          card.innerHTML = `
            <div class="biz-head">
              <div>
                <div class="biz-title">${d.name}</div>
                <div class="muted">${d.country} · ${d.sector}</div>
                <div style="margin-top:8px">
                  <span class="badge">${d.cti==='existence'?'Existence Only':d.cti==='verified'?'Verified':'Deep CTI'}</span>
                  <span class="badge">Verified ${d.freshnessDays}d ago</span>
                  <span class="badge green">${d.fit}</span>
                </div>
                <div class="why">Why: ${d.why.join(' · ')}</div>
              </div>
              <div style="text-align:right;min-width:220px">
                <div class="muted">Ticket band</div>
                <div style="font-weight:800">${money(d.min)} – ${money(d.max)}</div>
                <div class="muted" style="margin-top:8px">Accepts</div>
                <div>${d.accepts.join(', ')}</div>
              </div>
            </div>`;
          root.appendChild(card);
        });
      }
      $('#showingText') && ($('#showingText').textContent = `Showing ${list.length} of ${list.length}`);
    }

    // ------- Profile -------
    function openProfile(d){
      $('#profName') && ($('#profName').textContent = d.name);
      $('#profMeta') && ($('#profMeta').textContent = `${d.country} · ${d.sector} • ${d.cti==='existence'?'Existence Only':d.cti==='verified'?'Verified':'Deep CTI'}`);
      $('#profBody') && ($('#profBody').innerHTML = `
        <div class="grid">
          <div class="col-12 card">
            <div class="biz-head">
              <div>
                <div class="muted">Ticket band</div>
                <div style="font-weight:800">${money(d.min)} – ${money(d.max)}</div>
                <div class="muted" style="margin-top:8px">Accepts</div>
                <div>${d.accepts.join(', ')}</div>
              </div>
              <div style="text-align:right;min-width:220px">
                <div class="badge green">${d.fit}</div>
                <div class="badge">Verified ${d.freshnessDays}d ago</div>
              </div>
            </div>
          </div>
          <div class="col-12 card">
            <h4 style="margin:0 0 6px">About</h4>
            <p>${d.about}</p>
            <h4 style="margin:12px 0 6px">Current need</h4>
            <p>${d.needs}</p>
            <div style="margin-top:10px">
              <a class="badge" href="${d.links.site}">Website</a>
              <a class="badge" href="${d.links.deck}">Deck</a>
            </div>
          </div>
        </div>`);

      $('#searchStep')?.classList.add('hidden');
      $('#matchStep')?.classList.add('hidden');
      $('#profileStep')?.classList.remove('hidden');
      $('#profileStep')?.scrollIntoView({behavior:'smooth'});
    }

    // ------- Nav actions -------
    on('#navSearchBtn','click', ()=>{
      const q = $('#navSearch')?.value?.trim();
      if(q){ const t = $('#q2'); if(t){ t.value = q; updateAll(); } }
      $('#searchStep')?.scrollIntoView({behavior:'smooth', block:'start'});
    });
    on('#navSearch','keydown', (e)=>{
      if(e.key==='Enter'){ e.preventDefault(); $('#navSearchBtn')?.click(); }
    });
    on('#loginBtn','click', ()=> alert('Log in flow (stub)'));
    on('#signupBtn','click', ()=> alert('Sign up flow (stub)'));

    // ------- Step nav -------
    on('#toMatches','click', ()=>{ renderResults(); $('#searchStep')?.classList.add('hidden'); $('#matchStep')?.classList.remove('hidden'); $('#matchStep')?.scrollIntoView({behavior:'smooth'}); });
    on('#backToSearch','click', ()=>{ $('#matchStep')?.classList.add('hidden'); $('#searchStep')?.classList.remove('hidden'); $('#searchStep')?.scrollIntoView({behavior:'smooth'}); });
    on('#backFromProfile','click', ()=>{ $('#profileStep')?.classList.add('hidden'); $('#matchStep')?.classList.remove('hidden'); $('#matchStep')?.scrollIntoView({behavior:'smooth'}); });
    on('#continueCTA','click', ()=> alert('Next: view details / contact / save (stub)'));
    on('#doMatch','click', ()=>{ renderResults(); $('#searchStep')?.classList.add('hidden'); $('#matchStep')?.classList.remove('hidden'); $('#matchStep')?.scrollIntoView({behavior:'smooth'}); });

    // ------- Input listeners -------
    const debouncedUpdate = debounce(updateAll, 120);
    ['#q2','#country2','#sector2','#min2','#max2','#cti'].forEach(sel=>{ on(sel,'input', debouncedUpdate); on(sel,'change', debouncedUpdate); });
    document.querySelectorAll('.instr').forEach(cb=> on(cb,'change', debouncedUpdate));

    // Init
    document.addEventListener('DOMContentLoaded', ()=>{ updateAll(); });
  </script>


  <style>
    :root{
      --brand-blue:#0A2A6B; --brand-gold:#DAA520;
      --bg:#F7F7FB; --card:#FFFFFF; --ink:#0F1222; --muted:#6B7280; --border:#E8E8EE;
      --shadow:0 10px 30px rgba(6,60,168,.08);
      --radius:16px; --radius-pill:999px;
    }
    *{box-sizing:border-box}
    html,body{margin:0;padding:0;background:var(--bg);color:var(--ink);font:16px/1.5 system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial}
    a{color:var(--brand-blue);text-decoration:none}
    .container{max-width:1100px;margin:0 auto;padding:24px}

    /* NAV: full-width, sticky, white */
    .site-header{position:sticky; top:0; z-index:1000; width:100%; background:#fff; border-bottom:1px solid var(--border); box-shadow:0 2px 10px rgba(0,0,0,0.02)}
    .nav{display:flex;align-items:center;gap:16px;justify-content:space-between; padding:12px 16px}
    .brand{display:flex;gap:10px;align-items:center}
    .brand .dot{width:12px;height:12px;border-radius:50%;background:var(--brand-gold)}
    .brand h1{font-size:18px;margin:0;font-weight:700;color:var(--brand-blue)}
    .menu{display:flex;gap:18px;font-weight:600}
    .menu a{opacity:.9}
    .menu a:hover{opacity:1}
    .nav-actions{display:flex;gap:10px;align-items:center;flex-wrap:nowrap}
    .nav-search{border:1px solid var(--border);background:#d0d3d4;border-radius:12px;padding:10px 12px;font-size:14px;min-width:220px;flex:1}
    .btn{border:0;background:var(--brand-blue);color:#fff;border-radius:12px;padding:10px 14px;font-weight:700;cursor:pointer}
    .btn.secondary{background:#fff;color:var(--brand-blue);border:1px solid var(--brand-blue)}

    /* HERO: white card */
    .hero{background:#fff;color:var(--ink);border:1px solid var(--border);border-radius:var(--radius);padding:36px 32px;box-shadow:var(--shadow);margin-top:22px}
    .hero h2{font-size:32px;margin:0 0 10px;font-weight:800;letter-spacing:.2px;color:var(--brand-blue)}
    .hero p{opacity:.95;margin:0;max-width:720px}

    /* Forms / layout */
    .input, select{border:1px solid var(--border);background:#fff;border-radius:12px;padding:12px 14px;font-size:15px;min-width:180px}
    .row{display:flex;align-items:center;gap:12px;flex-wrap:wrap}

    /* Steps / cards */
    .step{margin-top:22px;background:var(--card);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);scroll-margin-top:80px}
    .step header{padding:16px 18px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
    .step header h3{margin:0;font-size:18px}
    .step .body{padding:18px}
    .actions{display:flex;justify-content:space-between;align-items:center;padding:16px 18px;border-top:1px solid var(--border)}
    .grid{display:grid;grid-template-columns:repeat(12,1fr);gap:14px}
    .col-7{grid-column:span 7}
    .col-5{grid-column:span 5}
    .col-12{grid-column:span 12}
    .card{border:1px solid var(--border);border-radius:20px;background:#fff;padding:16px 18px;box-shadow:var(--shadow)}
    .biz-head{display:flex;justify-content:space-between;gap:10px}
    .biz-title{font-weight:800}
    .muted{color:var(--muted)}
    .badge{display:inline-block;border-radius:10px;padding:4px 8px;background:#F2F4F8;border:1px solid #E2E6EE;font-size:12px;margin-right:6px}
    .badge.green{background:#E8F7EF;border-color:#D2F0DE;color:#1A7F45}
    .mini .biz-title{font-weight:700;font-size:15px}
    .mini.card{cursor:pointer}
    .why{color:#475569;font-size:14px;margin-top:8px}
    .hint{color:var(--muted);font-size:13px}
    .count{font-weight:700}
    .hidden{display:none}
    .pill{display:inline-flex;gap:8px;align-items:center;border-radius:var(--radius-pill);padding:6px 10px;border:1px solid var(--border);background:#fff;font-size:13px}

    /* Segmented control for Preview */
    .seg{display:inline-flex;border:1px solid var(--border);border-radius:12px;overflow:hidden}
    .seg button{background:#fff;border:0;padding:8px 12px;cursor:pointer;font-weight:700}
    .seg button.active{background:var(--brand-blue);color:#fff}

    /* Footer */
    footer{margin-top:28px;border-top:1px solid var(--border);padding:18px 0;color:var(--muted);font-size:14px}
    footer .row{justify-content:space-between}
    footer nav a{margin-right:14px}

    /* Screen-reader utility */
    .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}

    /* Mobile */
    @media (max-width: 900px){
      .grid{grid-template-columns:1fr}
      .col-7,.col-5{grid-column:span 12}
      .nav-actions{flex-wrap:wrap;gap:8px}
      .nav-search{min-width:0;flex:1}
    }

    /* Keyboard focus */
    button:focus,.mini.card:focus,.card[role="button"]:focus{
      outline:2px solid var(--brand-blue);outline-offset:2px
    }
  </style>




<?php $__env->stopSection(); ?>  


<?php echo $__env->make('layouts.app_raymoch_new', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH C:\Users\stecl\OneDrive\Documents\Raymoch\resources\views/pages/services/matching.blade.php ENDPATH**/ ?>