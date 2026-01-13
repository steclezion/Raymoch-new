{{-- from Entire.html --}}
@extends('layouts.app_raymoch_new')
{{-- <link href="{{ asset('css/style_entire.css')  }}" rel="stylesheet" type="text/css" id="css_entire"> --}}
<link href="{{ asset('css/style_companies.css') }}" rel="stylesheet" type="text/css" id="css_companies">

@section('title', 'Raymoch • Visibility & Analytics & Reporting • Services')
@section('content')

<style>
  /* ===================== RAYMOCH TOKENS (consistent) ===================== */
  :root{
    --brand-blue:#0328aeed;
    --brand-blue-700:#213bb1;
    --brand-blue-500:#041b64;
    --accent-gold:#7a7797a8;

    --ink:#101114;
    --muted:#3c4b69;
    --bg:#fafafa;        /* page background (light) */
    --border:#e8e8ee;
    --card:#ffffff;

    --radius:14px; --pill:999px;
    --shadow:0 6px 22px rgba(10,42,107,.08);
    --maxw:1328px; --gutter:18px;

    --footer-bg:#0b1020; /* no-slip canvas */
  }

  *{box-sizing:border-box;margin:0;padding:0;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif}

  /* ========== Canvas + no-slip footer gradient ========== */
  html{ background:var(--footer-bg); height:100%; }
  body{
    color:var(--ink);
    line-height:1.5;
    min-height:100dvh;
    display:flex; flex-direction:column;
    overscroll-behavior-y:none;
    background:
      linear-gradient(to bottom,
        var(--bg) 0%,
        var(--bg) calc(100% - 240px),
        var(--footer-bg) calc(100% - 240px),
        var(--footer-bg) 100%);
  }
  /* iOS safe-area guard */
  body::after{
    content:""; position:fixed; inset:auto 0 0 0;
    height:env(safe-area-inset-bottom, 0);
    background:var(--footer-bg); pointer-events:none; z-index:1;
  }

  a{color:inherit;text-decoration:none}
  img{max-width:100%;display:block}
  .wrap{max-width:var(--maxw);margin:0 auto;padding:0 var(--gutter)}

  /* ===================== HEADER (canonical) ===================== */
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
    position:relative; background:#fff; border-radius:12px;
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
  .btn{height:40px;display:inline-flex;align-items:center;gap:8px;padding:0 16px;border-radius:var(--pill);font-weight:700;background:#fff;border:1px solid var(--border);cursor:pointer}
  .btn.primary{background:var(--brand-blue);color:#fff;border-color:var(--brand-blue)}

  .explore-toggle{
    appearance:none;border:0;background:transparent;cursor:pointer;
    display:flex;align-items:center;gap:8px;
    font-weight:800;color:var(--nav-link);padding:6px 8px;border-radius:8px;
    font-size:1.1rem;
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
  @media (max-width:560px){ .menu-grid{grid-template-columns:1fr} }
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

  /* ===================== PAGE: Company Profile ===================== */
  main{flex:1}
  main .container{max-width:1100px;margin:0 auto;padding:24px}
  .card{background:#fff;border:1px solid var(--border);border-radius:18px;box-shadow:var(--shadow);padding:18px}
  .muted{color:var(--muted)} .small{font-size:13px}
  .pill{border:1px solid var(--border);border-radius:999px;padding:4px 8px;background:#fff;font-size:12px}

  .head{display:flex;align-items:flex-start;gap:18px}
  .h1{font-size:30px;line-height:1.15;margin:0;font-weight:800}
  .title{display:flex;align-items:center;gap:10px}
  .dot{width:10px;height:10px;border-radius:50%}
  .ok{background:#16a34a} .warn{background:#f59e0b} .off{background:#9ca3af}
  .btns{margin-left:auto;display:flex;gap:10px;flex-wrap:wrap}
  .btn.sm{height:auto; padding:10px 14px; border-radius:12px}
  .btn.ghost{background:#fff;color:var(--brand-blue);border:1px solid var(--brand-blue)}
  .back{border:1px solid var(--border);background:#fff;color:#0f1222;border-radius:12px;padding:9px 12px;text-decoration:none;font-weight:700}

  .tabs.card{margin-top:12px;padding:0}
  .tabbar{display:flex;gap:28px;align-items:center;flex-wrap:wrap;padding:12px 16px}
  .tab{padding:12px 4px;border-bottom:2px solid transparent;color:var(--brand-blue);text-decoration:none;font-weight:600;position:relative}
  .tab.active::after{content:""; position:absolute; left:6px; right:6px; bottom:-1px; height:3px; background:var(--accent-gold); border-radius:2px}
  .section{display:none} .section.active{display:block}

  .gridProfile{display:grid;grid-template-columns:2fr 1fr;gap:16px;margin-top:16px}
  @media (max-width:980px){.gridProfile{grid-template-columns:1fr}}

  /* ===== Update/Claim panel ===== */
  .update-panel{display:none;margin-top:16px}
  .update-panel.active{display:block}
  .update-form{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  .update-form label{font-weight:700;font-size:14px;color:#24324a;display:block;margin-bottom:6px}
  .update-form input, .update-form textarea{
    width:100%;padding:12px;border:1px solid var(--border);border-radius:12px;background:#fff
  }
  .update-form textarea{min-height:110px;resize:vertical}
  .btn-row{display:flex;gap:10px;flex-wrap:wrap;margin-top:10px}
  .btn.primary.pill{border-radius:999px}

  /* ===================== FOOTER ===================== */
  footer{margin-top:auto;background:var(--footer-bg);color:#cbd5e1;}
  @media (max-width: 860px){
    footer .wrap > div[style*="grid-template-columns"]{
      display:grid;grid-template-columns:1fr;gap:16px !important;
    }
  }
</style>

<!-- ================= PAGE CONTENT ================= -->
<main>
  <div class="container">
    <div id="error" class="card" style="display:none;background:#fff3f3;border-color:#fca5a5;color:#7f1d1d">—</div>

    <!-- PROFILE -->
    <div class="card">
      <div class="head">
        <div style="min-width:0">
          <div class="title">
            <div id="verDot" class="dot off" title="Unverified"></div>
            <h1 class="h1" id="name">Loading…</h1>
          </div>
          <div class="muted small" id="subline">—</div>
          <div class="pills" id="pills"></div>
        </div>

        <div class="btns">
          <a id="backLink" class="back" href="companies-vl.html?from=visibility&verified=1"> Back to Listings</a>
          <a class="btn sm" id="btnVisit" target="_blank" rel="noopener">Visit site</a>
          <button class="btn sm ghost" id="btnShare" type="button">Share</button>
          <!-- Owner-gated action swaps below (Edit vs Request Update) -->
          <button class="btn sm" id="btnEdit"  type="button" style="display:none">Edit Listing</button>
          <button class="btn sm" id="btnUpdate" type="button" style="display:none">Request Update</button>
        </div>
      </div>
    </div>

    <div class="card tabs">
      <nav class="tabbar">
        <a href="#overview"   class="tab" id="tab-overview">Overview</a>
        <a href="#financials" class="tab" id="tab-financials">Financials</a>
        <a href="#documents"  class="tab" id="tab-documents">Documents</a>
        <a href="#contact"    class="tab" id="tab-contact">Contact</a>
      </nav>
    </div>

    <div class="gridProfile">
      <div class="card">
        <section id="overview" class="section active">
          <h3>Summary</h3>
          <p id="desc" class="muted">—</p>

          <h3 style="margin-top:16px">Snapshot</h3>
          <div class="kv" id="snapshot" style="display:grid;grid-template-columns:1fr 1fr;gap:8px 16px;margin-top:10px"></div>
        </section>

        <section id="financials" class="section">
          <h3>Financials (latest)</h3>
          <div class="kv" id="fin" style="display:grid;grid-template-columns:1fr 1fr;gap:8px 16px;margin-top:10px"></div>
        </section>

        <section id="documents" class="section">
          <h3>Documents</h3>
          <p class="muted small">No documents uploaded.</p>
        </section>
      </div>

      <div class="card">
        <h3>Trust & Verification</h3>
        <div class="pills" id="flags"></div>
        <div style="margin:10px 0;display:flex;gap:10px;align-items:center">
          <div class="pill" id="ctiTier">—</div>
          <div class="small" id="ctiScore">CTI: —</div>
        </div>

        <h3 id="contact" style="margin-top:18px">Contact</h3>
        <div class="kv" id="contactKv" style="display:grid;grid-template-columns:1fr 1fr;gap:8px 16px;margin-top:10px"></div>

        <div class="small muted" id="meta" style="margin-top:12px">Last updated — • Sources —</div>
      </div>
    </div>

    <!-- ===== Request Update / Claim Panel (gated for non-owners) ===== -->
    <div id="updatePanel" class="card update-panel" aria-labelledby="updateTitle" aria-hidden="true">
      <h3 id="updateTitle" style="margin:0 0 8px">Request an Update</h3>
      <p class="small muted">Use a work email for faster verification.</p>
      <form class="update-form" id="updateForm" novalidate>
        <div>
          <label for="uCompany">Company Name</label>
          <input id="uCompany" name="company" placeholder="e.g., BlueWave Solar" />
        </div>
        <div>
          <label for="uCountry">Country</label>
          <input id="uCountry" name="country" placeholder="e.g., Kenya" />
        </div>
        <div style="grid-column:1/-1">
          <label for="uEmail">Work Email</label>
          <input id="uEmail" name="email" type="email" placeholder="you@company.com" required />
        </div>
        <div style="grid-column:1/-1">
          <label for="uNotes">Notes for reviewer</label>
          <textarea id="uNotes" name="notes" placeholder="What should we correct or add?"></textarea>
        </div>
        <div class="btn-row" style="grid-column:1/-1">
          <button type="submit" class="btn primary pill">Submit</button>
          <button type="button" class="btn ghost pill" id="closeUpdate">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</main>









<script>
  window.RAYMOCH = {
    apiBase: "{{ url('/api') }}",
    routes: {
      // Default “Back to Listings”
      listings: "{{ route('companies.visibility', ['from'=>'visibility','verified'=>1]) }}",
      // Company profile (if you ever need to link back with a different id)
    //  profile:  "route('company.profile') ",
    },
    csrf: document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
  };
</script>




<script>
  // ===== Header: explore menu
  (() => {
    const btn = document.getElementById('exploreToggle');
    const menu = document.getElementById('t1Menu');
    if (!btn || !menu) return;
    const openMenu = (on) => { btn.setAttribute('aria-expanded', on ? 'true' : 'false'); menu.hidden = !on; };
    btn.addEventListener('click', (e) => { e.preventDefault(); openMenu(btn.getAttribute('aria-expanded') !== 'true'); });
    document.addEventListener('click', (e) => { if (!menu.hidden && !menu.contains(e.target) && !btn.contains(e.target)) openMenu(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') openMenu(false); });
  })();

  // ===== Utilities
  const API_BASE = "{{ url('/api') }}"; // Laravel API base
  const UPDATE_URL = "{{ route('api.company.update-request') }}";
  const qs = new URLSearchParams(location.search);
  const id = qs.get("id");

  const $ = (id)=>document.getElementById(id);
  const money = n => (n==null? "—" : "$"+Number(n).toLocaleString());
  const verDotClass = v => ({Verified:"ok", Pending:"warn", Unverified:"off"})[v] || "off";

  function linkify(url){
    if(!url) return null;
    try{ const u = new URL(url); return u.href; } catch { return url; }
  }

  function setActiveTab(){
    const h=(location.hash||"#overview").toLowerCase();
    document.querySelectorAll(".tab").forEach(a=>a.classList.remove("active"));
    document.querySelectorAll(".section").forEach(s=>s.classList.remove("active"));
    const t=document.querySelector(`.tab[href='${h}']`), s=document.querySelector(h);
    if(t)t.classList.add("active"); if(s)s.classList.add("active");
  }

  function setFlags(c){
    const out=[];
    if(c.DiasporaOwned) out.push(`<span class="pill">Diaspora-owned</span>`);
    if(c.WomenLed) out.push(`<span class="pill">Women-led</span>`);
    if(c.YouthLed) out.push(`<span class="pill">Youth-led</span>`);
    if(c.HasFinancials) out.push(`<span class="pill">Financials on file</span>`);
    $("flags").innerHTML = out.join("") || `<span class="small muted">No flags</span>`;
  }

  function setBackLink(){
    const back = $("backLink");
    const ret = qs.get("return");
    if (ret) {
      try { const url = new URL(ret, location.href); back.href = url.href; }
      catch {}
    } else {
      back.href = "{{ route('companies.vl') }}?from=visibility&verified=1";
    }
  }

  function ownerGating(){
    const isOwner = qs.get("owner")==="1";
    const btnEdit   = $("btnEdit");
    const btnUpdate = $("btnUpdate");
    if (isOwner) {
      btnEdit.style.display = "";
      btnUpdate.style.display = "none";
      btnEdit.onclick = () => { alert("Edit mode (owner stub). In production, open the edit dashboard."); };
    } else {
      btnEdit.style.display = "none";
      btnUpdate.style.display = "";
      btnUpdate.onclick = openUpdatePanel;
    }
  }

  function openUpdatePanel(e){
    e && e.preventDefault();
    const panel = $("updatePanel");
    panel.classList.add("active");
    panel.setAttribute("aria-hidden","false");
    const n = $("name").textContent.trim();
    if(n && n !== "Loading…") $("uCompany").value = n;
    $("uCountry").value = (window.__company && window.__company.Country) || "";
    panel.scrollIntoView({behavior:"smooth", block:"center"});
  }
  function closeUpdatePanel(){
    const panel = $("updatePanel");
    panel.classList.remove("active");
    panel.setAttribute("aria-hidden","true");
  }

  $("closeUpdate")?.addEventListener("click", closeUpdatePanel);

  // Submit update/claim to Laravel API
  $("updateForm")?.addEventListener("submit", async (e)=>{
    e.preventDefault();
    const payload = {
      company: $("uCompany").value, country: $("uCountry").value,
      email: $("uEmail").value, notes: $("uNotes").value, company_id: id
    };
    try{
      const r = await fetch(UPDATE_URL, {
        method: 'POST',
        headers: {'Content-Type':'application/json','Accept':'application/json'},
        body: JSON.stringify(payload),
        credentials: 'same-origin'
      });
      if(!r.ok) throw new Error('HTTP '+r.status);
      alert("Thanks! We’ve received your request.");
      closeUpdatePanel();
    }catch(err){
      alert("Failed to submit: "+err.message);
    }
  });

  async function loadProfile(){
    if (!id){
      const err = $("error"); err.style.display="block";
      err.textContent = "Missing ?id. Use {{ route('companies.vl') }} to pick a company.";
      return;
    }
    const r = await fetch(`${API_BASE}/companies/${encodeURIComponent(id)}`);
    if(!r.ok){ const err = $("error"); err.style.display="block"; err.textContent = "HTTP "+r.status; return; }
    const c = await r.json();
    window.__company = c;

    $("verDot").className = "dot " + verDotClass(c.VerificationStatus);
    $("name").textContent = c.CompanyName || "—";
    $("subline").textContent = `${c.Sector || "—"} • ${c.Country || "—"}`;
    $("pills").innerHTML = [c.City, c.Stage, c.ListingBucket].filter(Boolean).map(x=>`<span class="pill">${x}</span>`).join("");

    $("desc").textContent = c.Description || "—";
    $("snapshot").innerHTML = [
      ["Founded", c.FoundedYear],["Country", c.Country],["City", c.City],
      ["Stage", c.Stage],["Verification", c.VerificationStatus],["Employees", c.Employees]
    ].map(([k,v])=>`<div><b>${k}</b><span>${v??"—"}</span></div>`).join("");

    $("fin").innerHTML = [
      ["Annual Revenue", money(c.AnnualRevenueUSD)],
      ["Total Funding",  money(c.TotalFundingUSD)]
    ].map(([k,v])=>`<div><b>${k}</b><span>${v}</span></div>`).join("");

    $("ctiTier").textContent=c.CTI_Tier||"—";
    $("ctiTier").className="pill";
    $("ctiScore").textContent="CTI: "+(c.CTI_Score??"—");

    setFlags(c);

    const site = linkify(c.Website);
    const btnVisit = $("btnVisit");
    if (site){ btnVisit.href = site; btnVisit.textContent = "Visit site"; btnVisit.style.display="inline-flex"; }
    else { btnVisit.style.display="none"; }

    $("contactKv").innerHTML = [
      ["Website", site? `<a href="${site}" target="_blank" rel="noopener">${new URL(site).hostname}</a>`:"—"],
      ["Email", c.Email?`<a href="mailto:${c.Email}">${c.Email}</a>`:"—"],
      ["Phone", c.Phone||"—"]
    ].map(([k,v])=>`<div><b>${k}</b><span>${v}</span></div>`).join("");

    $("meta").textContent = `Last updated ${c.LastUpdated || "—"} • Sources ${c.DataSourcesCount ?? "—"}`;

    $("btnShare").onclick = async () => {
      const url = location.href;
      try{ await navigator.clipboard.writeText(url); alert("Link copied!"); }
      catch{ prompt("Copy this link:", url); }
    };

    setActiveTab();
    window.addEventListener("hashchange", setActiveTab);

    if (qs.get("action")==="update" && qs.get("owner")!=="1") openUpdatePanel();
  }

  setBackLink();
  ownerGating();

  (async function(){
    try{ await loadProfile(); }
    catch(e){
      const err = $("error");
      err.style.display="block"; err.textContent = "Failed to load. "+e.message+" (Is the API up?)";
      console.error(e);
    }
  })();
</script>

@endsection