{{-- from Entire.html --}}
@extends('layouts.app_raymoch_new')
<script rel="stylesheet" src="{{ asset('js/script_entire.js') }}"></script>
<link href="{{ asset('css/style_entire.css')  }}" rel="stylesheet" type="text/css" id="bootstrap">
{{-- <link href="{{ asset('css/style_entire_2.css')  }}" rel="stylesheet" type="text/css" id="bootstrap"> --}}
<!-- JS libs -->
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
{{-- <script rel="stylesheet" src="{{ asset('js/script_african_slider.js') }}"></script> --}}


<!-- Bootstrap CSS for Section 4 African Slides -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />

@section('title','Raymoch • All Companies inside Africa')


@section('content')
@include('layouts.style_entire')



<main>
    <div class="container">
        <div id="error" class="card" style="display:none;background:#fff3f3;border-color:#fca5a5;color:#7f1d1d">—</div>

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
                    <a id="backLink" class="back" href="{{ url('/companies') }}">Back to Listings</a>
                    <a class="btn sm" id="btnVisit" target="_blank" rel="noopener">Visit site</a>
                    <button class="btn sm ghost" id="btnShare" type="button">Share</button>
                    <button class="btn sm" id="btnEdit" type="button" style="display:none">Edit Listing</button>
                    <button class="btn sm" id="btnUpdate" type="button" style="display:none">Request Update</button>
                </div>
            </div>
        </div>

        <div class="card tabs">
            <nav class="tabbar">
                <a href="#overview" class="tab" id="tab-overview">Overview</a>
                <a href="#financials" class="tab" id="tab-financials">Financials</a>
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
                    <div id="snapshot" class="kv" style="display:grid;grid-template-columns:1fr 1fr;gap:8px 16px;margin-top:10px"></div>
                </section>

                <section id="financials" class="section">
                    <h3>Financials (latest)</h3>
                    <div id="fin" class="kv" style="display:grid;grid-template-columns:1fr 1fr;gap:8px 16px;margin-top:10px"></div>
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
                <div class="kv" id="meta" style="display:grid;grid-template-columns:1fr;gap:8px 16px;margin-top:10px"></div>
            </div>
        </div>
    </div>
</main>

<script>
    const qs = new URLSearchParams(location.search);
    const id = qs.get('id');

    const $ = sel => document.querySelector(sel);
    const pills = $('#pills');
    const flags = $('#flags');

    function setDot(verified) {
        const dot = $('#verDot');
        dot.classList.remove('off', 'warn', 'ok');
        dot.classList.add(verified ? 'ok' : 'off');
        dot.title = verified ? 'Verified' : 'Unverified';
    }

    function kv(parent, label, value) {
        const d = document.createElement('div');
        d.innerHTML = `<b>${label}</b><span>${value ?? '—'}</span>`;
        parent.appendChild(d);
    }

    async function load() {
        if (!id) {
            $('#error').textContent = 'Missing ?id=';
            $('#error').style.display = 'block';
            return;
        }
        try {
            const r = await fetch(`/api/companies/${encodeURIComponent(id)}`, {
                cache: 'no-store'
            });
            if (!r.ok) throw new Error('HTTP ' + r.status);
            const x = await r.json();

            // Header
            $('#name').textContent = x.CompanyName || x.name || '—';
            $('#subline').textContent = [x.Sector, x.Country, x.City].filter(Boolean).join(' • ');
            setDot((x.VerificationStatus || '').toLowerCase() === 'verified');

            // Pills
            pills.innerHTML = '';
            if (x.VerificationStatus) {
                pills.insertAdjacentHTML('beforeend', `<span class="pill">${x.VerificationStatus}</span>`);
            }
            if (x.CTI_Tier) {
                pills.insertAdjacentHTML('beforeend', `<span class="pill tier ${x.CTI_Tier}">${x.CTI_Tier}</span>`);
            }
            if (x.CTI_Score != null) {
                pills.insertAdjacentHTML('beforeend', `<span class="pill">CTI: ${x.CTI_Score}</span>`);
            }

            // Overview
            $('#desc').textContent = x.Description || x.summary || '';

            const snap = $('#snapshot');
            snap.innerHTML = '';
            kv(snap, 'Stage', x.Stage);
            kv(snap, 'Employees', x.Employees);
            kv(snap, 'Founded', x.FoundedYear);
            kv(snap, 'Country', x.Country);
            kv(snap, 'City', x.City);

            // Financials
            const fin = $('#fin');
            fin.innerHTML = '';
            kv(fin, 'Annual Revenue (USD)', x.AnnualRevenueUSD);
            kv(fin, 'Total Funding (USD)', x.TotalFundingUSD);

            // Right rail
            $('#ctiTier').textContent = x.CTI_Tier ?? '—';
            $('#ctiScore').textContent = 'CTI: ' + (x.CTI_Score ?? '—');

            const meta = $('#meta');
            meta.innerHTML = '';
            kv(meta, 'Listing Bucket', x.ListingBucket);
            kv(meta, 'Website', x.Website ? `<a href="${x.Website}" target="_blank" rel="noopener">${x.Website}</a>` : '—');
            kv(meta, 'Email', x.Email ?? '—');
            kv(meta, 'Phone', x.Phone ?? '—');
            kv(meta, 'Last Updated', x.LastUpdated ?? '—');

            const visitBtn = document.getElementById('btnVisit');
            if (x.Website) {
                visitBtn.href = x.Website;
                visitBtn.style.display = 'inline-flex';
            } else {
                visitBtn.style.display = 'none';
            }
        } catch (e) {
            const el = document.getElementById('error');
            el.textContent = 'Failed to load company.';
            el.style.display = 'block';
        }
    }
    load();
</script>
</body>

</html>