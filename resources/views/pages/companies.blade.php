{{-- from Entire.html --}}
@extends('layouts.app_raymoch_new')
{{-- <link href="{{ asset('css/style_entire.css')  }}" rel="stylesheet" type="text/css" id="css_entire"> --}}
<link href="{{ asset('css/style_companies.css') }}" rel="stylesheet" type="text/css" id="css_companies">




@section('title', 'Raymoch • Connecting Africa')
@section('content')




    <!-- ================= PAGE CONTENT ================= -->
    <main class="wrap companies">
        <div id="error" class="err"></div>

        <!-- LIST VIEW -->
        <div id="listView" style="display:none">
            <h1>Companies</h1>
            <div class="card" style="padding:0; border:none; box-shadow:none; background:transparent">
                <div class="bar">
                    <input id="q" placeholder="Search name/description…" />
                    <select id="sector">
                        <option value="">All sectors</option>
                    </select>

                    <select id="country">
                        <option value="">All countries</option>
                        <!-- keep your country list unchanged -->
                        <option>Algeria</option>
                        <option>Angola</option>
                        <option>Benin</option>
                        <option>Botswana</option>
                        <option>Burkina Faso</option>
                        <option>Burundi</option>
                        <option>Cabo Verde</option>
                        <option>Cameroon</option>
                        <option>Central African Republic</option>
                        <option>Chad</option>
                        <option>Comoros</option>
                        <option>Democratic Republic of the Congo</option>
                        <option>Republic of the Congo</option>
                        <option>Cote d'Ivoire</option>
                        <option>Djibouti</option>
                        <option>Egypt</option>
                        <option>Equatorial Guinea</option>
                        <option>Eritrea</option>
                        <option>Eswatini</option>
                        <option>Ethiopia</option>
                        <option>Gabon</option>
                        <option>Gambia</option>
                        <option>Ghana</option>
                        <option>Guinea</option>
                        <option>Guinea-Bissau</option>
                        <option>Kenya</option>
                        <option>Lesotho</option>
                        <option>Liberia</option>
                        <option>Libya</option>
                        <option>Madagascar</option>
                        <option>Malawi</option>
                        <option>Mali</option>
                        <option>Mauritania</option>
                        <option>Mauritius</option>
                        <option>Morocco</option>
                        <option>Mozambique</option>
                        <option>Namibia</option>
                        <option>Niger</option>
                        <option>Nigeria</option>
                        <option>Rwanda</option>
                        <option>Sahrawi Arab Democratic Republic</option>
                        <option>Sao Tome and Principe</option>
                        <option>Senegal</option>
                        <option>Seychelles</option>
                        <option>Sierra Leone</option>
                        <option>Somalia</option>
                        <option>South Africa</option>
                        <option>South Sudan</option>
                        <option>Sudan</option>
                        <option>Tanzania</option>
                        <option>Togo</option>
                        <option>Tunisia</option>
                        <option>Uganda</option>
                        <option>Zambia</option>
                        <option>Zimbabwe</option>
                    </select>

                    <div style="text-align:right">
                        <button id="clear">Clear</button>
                        <button id="go" class="primary">Search</button>
                    </div>
                </div>
            </div>

            <div id="grid" class="grid">Loading…</div>
            <div class="rowfoot">
                <button id="prev">Prev</button>
                <div id="pageInfo" class="muted"></div>
                <button id="next">Next</button>
            </div>
        </div>

        <!-- PROFILE VIEW -->
        <div id="profileView" style="display:none">
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
                        <a class="back" href="{{ url('/companies') }}"> All Companies</a>
                        <button class="btn" id="btnIntro">Request intro</button>
                        <button class="btn ghost" id="btnSave">Save</button>
                        <button class="btn ghost" id="btnShare">Share</button>
                    </div>
                </div>
            </div>

            <div class="card tabs">
                <nav class="tabbar">
                    <a href="#overview" class="tab" id="tab-overview">Overview</a>
                    <a href="#financials" class="tab" id="tab-financials">Financials</a>
                    <a href="#team" class="tab" id="tab-team">Team</a>
                    <a href="#gallery" class="tab" id="tab-gallery">Gallery</a>
                    <a href="#documents" class="tab" id="tab-documents">Documents</a>
                    <a href="#contact" class="tab" id="tab-contact">Contact</a>
                </nav>
            </div>

            <div class="gridProfile">
                <div class="card">
                    <section id="overview" class="section active">
                        <h3>Summary</h3>
                        <p id="desc" class="muted">—</p>
                        <h3 style="margin-top:16px">Snapshot</h3>
                        <div class="kv" id="snapshot"></div>
                    </section>
                    <section id="financials" class="section">
                        <h3>Financials (latest)</h3>
                        <div class="kv" id="fin"></div>
                    </section>
                    <section id="team" class="section">
                        <h3>Team</h3>
                        <p class="muted small">Claim this profile to add team members.</p>
                    </section>
                    <section id="gallery" class="section">
                        <h3>Gallery</h3>
                        <p class="muted small">No media yet.</p>
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
                        <div class="tier" id="ctiTier">—</div>
                        <div class="small" id="ctiScore">CTI: —</div>
                    </div>

                    <h3 id="contact" style="margin-top:18px">Contact</h3>
                    <div class="kv" id="contactKv"></div>

                    <div class="footer-note" id="meta">Last updated — • Sources —</div>
                </div>
            </div>
        </div>
    </main>



    <!-- ================= JS ================= -->
    <script>
        // ===== Frozen header menu wiring (unchanged) =====


        // ===== Laravel-aware config =====
        //   const API_BASE = "{{ url('/api') }}"; // Laravel proxy to 
        const API_BASE = "/api"; // not http://localhost:3001
        // examples:
        // fetch(`${API_BASE}/companies?page=1&limit=20`);
        // fetch(`${API_BASE}/companies/search?sector=${encodeURIComponent('Agriculture')}`);

        const qs = new URLSearchParams(location.search);
        const id = qs.get("id"); // if present → profile; else → list

        const $ = (id) => document.getElementById(id);
        const money = n => (n == null ? "—" : "$" + Number(n).toLocaleString());
        const verDotClass = v => ({
            Verified: "ok",
            Pending: "warn",
            Unverified: "off"
        })[v] || "off";

        // ---------- helpers ----------
        async function j(url) {
            const r = await fetch(url, {
                cache: 'no-store'
            });
            if (!r.ok) throw new Error(`HTTP ${r.status}`);
            return r.json();
        }


        // read URL param with trimming
function getQS(name){ return (new URLSearchParams(location.search).get(name) || "").trim(); }

// ensure <select> has a given value
function ensureOption(selectEl, value){
  if (!selectEl || !value) return;
  const exists = Array.from(selectEl.options).some(o => o.value === value);
  if (!exists) {
    const opt = document.createElement('option');
    opt.value = value; opt.textContent = value;
    selectEl.appendChild(opt);
  }
}

function normalizeSummary(row){
  if (!row) return {
    id:'', name:'', sector:'', country:'', city:'', stage:'',
    verified:false, cti:null, employees:null, revenueUSD:null, founded:null
  };

  // support both Title-Case and snake/camel
  const id           = row.id ?? row.CompanyID ?? row.companyId ?? '';
  const name         = row.name ?? row.CompanyName ?? row.companyName ?? '';
  const sector       = row.sector ?? row.Sector ?? '';
  const country      = row.country ?? row.Country ?? '';
  const city         = row.city ?? row.City ?? '';
  const stage        = row.stage ?? row.Stage ?? '';
  const verifiedRaw  = row.verified ?? row.Verified ?? row.verification_status ?? row.VerificationStatus;
  const verified     = (verifiedRaw === true) || (String(verifiedRaw).toLowerCase() === 'verified');

  const cti_tier     = row.cti_tier ?? row.CTI_Tier ?? row.ctiTier ?? (row.cti && row.cti.tier);
  const cti_score    = row.cti_score ?? row.CTI_Score ?? row.ctiScore ?? (row.cti && row.cti.score);
  const cti          = (cti_tier || cti_score) ? { tier: cti_tier || '', score: cti_score ?? null } : null;

  const employees    = row.employees ?? row.Employees ?? null;
  const revenueUSD   = row.revenue_usd ?? row.AnnualRevenueUSD ?? row.revenueUSD ?? null;
  const founded      = row.founded_year ?? row.FoundedYear ?? row.founded ?? null;

  return { id, name, sector, country, city, stage, verified, cti, employees, revenueUSD, founded };
}




        // ---------- LIST MODE ----------
        let page = Number(qs.get('page') || 1),
            limit = 20;

        function cardFromSummary(c) {
            return `
    <div class="card">
      <div class="row">
        <div class="left">
          <a class="name" href="{{ url('/companies') }}?id=${encodeURIComponent(c.id)}">${c.name}</a>
          <div class="sub">${c.sector||"—"} • ${c.country||"—"}</div>
          <div class="pills">
            ${c.city? `<span class="pill">${c.city}</span>`:""}
            ${c.stage? `<span class="pill">Stage: ${c.stage}</span>`:""}
          </div>
          <div class="kv">
            <div><b>Founded</b><span>${c.founded??"—"}</span></div>
            <div><b>Employees</b><span>${c.employees??"—"}</span></div>
            <div><b>Revenue</b><span>${c.revenueUSD!=null? money(c.revenueUSD):"—"}</span></div>
            <div><b>CTI</b><span>${c.cti?.score ?? "—"}</span></div>
          </div>
        </div>
        <div class="right">
          <div class="dot ${c.verified?'ok':'off'}" title="${c.verified?'Verified':'Unverified'}"></div>
          <div class="tier ${c.cti?.tier||''}">${c.cti?.tier||'—'}</div>
        </div>
      </div>
    </div>`;
        }




async function populateFilters() {
  const js = await j(`${API_BASE}/companies?page=1&limit=5000`);
  const raw = js.data || js || [];
  const data = (Array.isArray(raw) ? raw : []).map(normalizeSummary);

  const sectors   = [...new Set(data.map(x => x.sector).filter(Boolean))].sort();
  const countries = [...new Set(data.map(x => x.country).filter(Boolean))].sort();

  $("sector").insertAdjacentHTML("beforeend", sectors.map(s => `<option>${s}</option>`).join(""));
  $("country").insertAdjacentHTML("beforeend", countries.map(s => `<option>${s}</option>`).join(""));

  // keep URL-selected values
  const urlSector  = getQS('sector');  if (urlSector){ ensureOption($("sector"), urlSector); $("sector").value = urlSector; }
  const urlCountry = getQS('country'); if (urlCountry){ ensureOption($("country"), urlCountry); $("country").value = urlCountry; }
  const urlQ = getQS('q') || getQS('search'); if (urlQ){ $("q").value = urlQ; }
}



function syncQS(updates = {}) {
  const p = new URLSearchParams(location.search);
  // apply updates; remove keys explicitly set to undefined or ''
  Object.entries(updates).forEach(([k,v]) => {
    if (v === undefined || v === '') p.delete(k);
    else p.set(k, v);
  });
  // also persist the current control values if present
  if ($("q") && $("q").value) p.set('q', $("q").value.trim()); else p.delete('q');
  if ($("sector") && $("sector").value) p.set('sector', $("sector").value); else if (!getQS('sector')) p.delete('sector');
  if ($("country") && $("country").value) p.set('country', $("country").value); else if (!getQS('country')) p.delete('country');

  const qs = p.toString();
  const newUrl = `${location.pathname}${qs ? `?${qs}` : ''}${location.hash}`;
  history.replaceState(null, "", newUrl);
}




        /* Load list with current filters */
async function loadList() {
  const q       = ($("q").value || "").trim() || getQS('q') || getQS('search');
  const sector  = $("sector").value || getQS('sector');
  const country = $("country").value || getQS('country');
  const hasFilters = !!(q || sector || country);

  if (hasFilters) {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (sector) sp.set("sector", sector);
    if (country) sp.set("country", country);

    const js   = await j(`${API_BASE}/companies/search?${sp.toString()}`);
    const list = (js.data || js || []).map(normalizeSummary);

    $("grid").innerHTML = list.length
      ? list.map(cardFromSummary).join("")
      : `<div class="muted">No results.</div>`;

    $("pageInfo").textContent = `Results: ${js.total ?? list.length}`;
    $("prev").disabled = true; $("next").disabled = true;
    syncQS({ q, sector, country, page: undefined });
    return;
  }

  // no filters -> paginated
  const js   = await j(`${API_BASE}/companies?page=${page}&limit=${limit}`);
  const list = (js.data || js || []).map(normalizeSummary);

  $("grid").innerHTML = list.length
    ? list.map(cardFromSummary).join("")
    : `<div class="muted">No results.</div>`;

  $("pageInfo").textContent = `Page ${js.page ?? page} / ${js.totalPages ?? 1} • ${js.total ?? list.length} total`;
  $("prev").disabled = page <= 1;
  $("next").disabled = page >= (js.totalPages || 1);
  syncQS({ page });
}



        // ---------- PROFILE MODE ----------
        function setActiveTab() {
            const h = (location.hash || "#overview").toLowerCase();
            document.querySelectorAll(".tab").forEach(a => a.classList.remove("active"));
            document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
            const t = document.querySelector(`.tab[href='${h}']`),
                s = document.querySelector(h);
            if (t) t.classList.add('active');
            if (s) s.classList.add('active');
        }

        function setFlags(c) {
            const out = [];
            if (c.DiasporaOwned) out.push(`<span class="pill">Diaspora-owned</span>`);
            if (c.WomenLed) out.push(`<span class="pill">Women-led</span>`);
            if (c.YouthLed) out.push(`<span class="pill">Youth-led</span>`);
            if (c.HasFinancials) out.push(`<span class="pill">Financials on file</span>`);
            $("flags").innerHTML = out.join("") || `<span class="muted small">No flags</span>`;
        }

        function linkify(url) {
            if (!url) return "—";
            try {
                const u = new URL(url);
                return `<a href="${u.href}" target="_blank" rel="noopener">${u.hostname}</a>`;
            } catch {
                return `<a href="${url}" target="_blank" rel="noopener">${url}</a>`;
            }
        }

        function setupActions(c) {
            $("btnIntro").disabled = !c.Email;
            $("btnIntro").title = c.Email ? `Email: ${c.Email}` : "No intro channel";
            $("btnSave").onclick = () => {
                const s = JSON.parse(localStorage.getItem("raymoch_saved") || "[]");
                if (!s.includes(c.CompanyID)) s.push(c.CompanyID);
                localStorage.setItem("raymoch_saved", JSON.stringify(s));
                alert("Saved.");
            };
            $("btnShare").onclick = async () => {
                const url = location.href;
                try {
                    await navigator.clipboard.writeText(url);
                    alert("Link copied!");
                } catch {
                    prompt("Copy this link:", url);
                }
            };
        }




        async function loadProfile() {
            const r = await fetch(`${API_BASE}/companies/${encodeURIComponent(id)}`, {
                cache: 'no-store'
            });
            
            if (!r.ok) throw new Error(`HTTP ${r.status}`);
            const c = await r.json();
            $("verDot").className = "dot " + verDotClass(c.VerificationStatus);
            $("name").textContent = c.CompanyName || "—";
            $("subline").textContent = `${c.Sector || "—"} • ${c.Country || "—"}`;
            $("pills").innerHTML = [c.City, c.Stage, c.ListingBucket].filter(Boolean).map(x =>
                `<span class="pill">${x}</span>`).join("");
            $("desc").textContent = c.Description || "—";
            $("snapshot").innerHTML = [
                ["Founded", c.FoundedYear],
                ["Country", c.Country],
                ["City", c.City],
                ["Stage", c.Stage],
                ["Verification", c.VerificationStatus],
                ["Employees", c.Employees]
            ].map(([k, v]) => `<div><b>${k}</b><span>${v??"—"}</span></div>`).join("");
            $("fin").innerHTML = [
                ["Annual Revenue", money(c.AnnualRevenueUSD)],
                ["Total Funding", money(c.TotalFundingUSD)]
            ].map(([k, v]) => `<div><b>${k}</b><span>${v}</span></div>`).join("");
            $("ctiTier").textContent = c.CTI_Tier || "—";
            $("ctiTier").className = "tier " + (c.CTI_Tier || "");
            $("ctiScore").textContent = "CTI: " + (c.CTI_Score ?? "—");
            setFlags(c);
            $("contactKv").innerHTML = [
                ["Website", linkify(c.Website)],
                ["Email", c.Email ? `<a href="mailto:${c.Email}">${c.Email}</a>` : "—"],
                ["Phone", c.Phone || "—"]
            ].map(([k, v]) => `<div><b>${k}</b><span>${v}</span></div>`).join("");
            $("meta").textContent = `Last updated ${c.LastUpdated || "—"} • Sources ${c.DataSourcesCount ?? "—"}`;
            setupActions(c);
            setActiveTab();
            window.addEventListener("hashchange", setActiveTab);
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }

        // ---------- BOOT ----------
        (async function() {
            try {
                if (id) { // PROFILE
                    document.getElementById("profileView").style.display = "block";
                    await loadProfile();
                } else { // LIST
                    document.getElementById("listView").style.display = "block";
                    await populateFilters();
                    await loadList();
                    $("prev").onclick = () => {
                        page = Math.max(1, page - 1);
                        loadList();
                    };
                    $("next").onclick = () => {
                        page = page + 1;
                        loadList();
                    };
                    $("go").onclick = () => {
                        page = 1;
                        loadList();
                    };
                    $("clear").onclick = () => {
                        $("q").value = "";
                        $("sector").value = "";
                        $("country").value = "";
                        page = 1;
                        loadList();
                    };
                    $("q").addEventListener("keydown", e => {
                        if (e.key === "Enter") {
                            page = 1;
                            loadList();
                        }
                    });
                }
            } catch (e) {
                const err = document.getElementById("error");
                err.style.display = "block";
                err.textContent = "Failed to load. " + e.message + " (Is Laravel /api proxy up?)";
                console.error(e);
            }
        })();
    </script>



@endsection
