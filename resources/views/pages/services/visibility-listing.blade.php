{{-- from Entire.html --}}
@extends('layouts.app_raymoch_new')
{{-- <link href="{{ asset('css/style_entire.css')  }}" rel="stylesheet" type="text/css" id="css_entire"> --}}
<link href="{{ asset('css/style_companies.css') }}" rel="stylesheet" type="text/css" id="css_companies">

@section('title', 'Raymoch • Verification • Services')
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


  <main class="container">
    <div class="grid">
      <div>
        <h2>What this does</h2>
        <ul class="bullets">
          <li>Create a public business profile that’s easy to discover</li>
          <li>Show sector, country, and trust signals (CTI)</li>
          <li>Fix mistakes fast via a simple “Request an Update”</li>
        </ul>
        <div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap">
           <a class="cta" href="{{ route('companies.vl') }}?from=visibility">Find My Listing</a>
           
        
    </div>
      </div>
      <aside>
        <div class="actions"><h3 style="margin:5px 5px 15px">Quick links</h3><div class="stack">
            {{-- <a class="ghost" href="{{ url('/companies/visibility?from=visibility&verified=1') }}">Browse all listings</a>
            <a class="ghost" href="companies-vl.html?from=visibility&action=update">Request an update</a></div></div> --}}

            <a class="ghost" href="{{ route('companies.vl') }}?from=visibility&verified=1">Browse all listings</a>
            <a class="ghost" href="{{ route('companies.vl') }}?from=visibility&action=update">Request an update</a>


      </aside>
    </div>
    <p class="hint">Tip: Use the quick links — the dedicated listings pages handle search, filters, and updates.</p>
  </main>



    <style>
    :root{
      --brand-blue:#0328aeed;
      --brand-blue-700:#213bb1;
      --brand-blue-500:#041b64;
      --accent-gold:#7a7797a8;
      --ink:#101114;
      --muted:#3c4b69;
      --bg:#fafafa;
      --border:#e8e8ee;
      --card:#ffffff;
      --radius:14px; --pill:999px;
      --shadow:0 6px 22px rgba(10,42,107,.08);
      --maxw:1328px; --gutter:18px;
      --footer-bg:#0b1020;
    }

    *{box-sizing:border-box;margin:0;padding:0;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif}
    html{background:var(--footer-bg);height:100%;}
    body{color:var(--ink);line-height:1.5;min-height:100dvh;display:flex;flex-direction:column;overscroll-behavior-y:none;background:linear-gradient(to bottom,var(--bg) 0%,var(--bg) calc(100% - 240px),var(--footer-bg) calc(100% - 240px),var(--footer-bg) 100%);} 
    body::after{content:"";position:fixed;inset:auto 0 0 0;height:env(safe-area-inset-bottom, 0);background:var(--footer-bg);pointer-events:none;z-index:1;}
    a{color:inherit;text-decoration:none}img{max-width:100%;display:block}
    .wrap{max-width:var(--maxw);margin:0 auto;padding:0 var(--gutter)}

    .header{--nav-brand: var(--brand-blue);--nav-link:#0f172a;--nav-hover:#0a2a6b;--nav-bg:#ffffff;--nav-fg:var(--ink);background:var(--nav-bg);color:var(--nav-fg);position:sticky;top:0;z-index:1000;border-bottom:1px solid var(--border)}
    .row1{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:12px 8px;margin:15px;box-shadow:0 1px 0 rgba(0,0,0,.05);position:relative;background:#fff;border-radius:12px;}
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
    .explore-toggle{appearance:none;border:0;background:transparent;cursor:pointer;display:flex;align-items:center;gap:8px;font-weight:800;color:var(--nav-link);padding:6px 8px;border-radius:8px;font-size:1.1rem;}
    .explore-toggle:hover,.explore-toggle[aria-expanded="true"]{background:#eceff3;color:var(--nav-hover);}
    .menu-panel{position:absolute;top:calc(100% + 10px);left:15px;z-index:1100;width:min(760px,calc(100vw - 40px));background:#fff;border:1px solid var(--border);border-radius:14px;box-shadow:var(--shadow);padding:14px;}
    .menu-panel[hidden]{display:none;}
    .menu-grid{display:grid;grid-template-columns:repeat(2,minmax(240px,1fr));gap:12px}
    .menu-item{display:block;padding:12px;border:1px solid var(--border);border-radius:12px;background:#fff;}
    .menu-item:hover{transform:translateY(-1px);box-shadow:0 8px 20px rgba(0,0,0,.06)}
    .row2{background:#f5f6f8;border-top:1px solid #eee;border-bottom:1px solid #e6e6e6;padding-left:15px}
    .row2 .wrap{max-width:none;padding:0}
    .row2 .links{display:flex;gap:18px;padding:8px 8px;margin:0;justify-content:flex-start;align-items:center}
    .row2 a{font-weight:600;font-size:.92rem;padding:4px 6px;border-radius:4px;color:var(--nav-link)}
    .row2 a:hover{background:#eceff3;color:var(--nav-hover)}

    .hero{--hero-a:var(--brand-blue-700);--hero-b:var(--brand-blue-500);--hero-fg:#ffffff;--hero-sub:#DDEBFF;color:var(--hero-fg);position:relative;overflow:hidden;background:linear-gradient(135deg,var(--hero-a),var(--hero-b));border-bottom:1px solid var(--border)}
    .hero-inner{position:relative;display:block;padding:64px 8px;max-width:var(--maxw);margin:0 auto}
    .hero h1{font-size:clamp(28px,5.6vw,48px);line-height:1.1;margin-bottom:8px;font-weight:800;background:linear-gradient(90deg,#fff,#e7efff);-webkit-background-clip:text;background-clip:text;color:transparent}
    .hero p{font-size:clamp(15px,2.2vw,19px);color:var(--hero-sub);max-width:62ch}

    main.wrap{padding-bottom:24px;}
    .container{max-width:1140px;margin:0 auto;padding:0 var(--gutter) clamp(72px,10vw,160px);}    
    .grid{display:grid;grid-template-columns:7fr 5fr;gap:370px;margin-top:clamp(28px,5vw,94px);} /* increased gap */
    .bullets{margin:8px 0 0;padding-left:18px}
    .bullets li{margin:6px 0}
    .actions{background:var(--card);border:1px solid var(--border);border-radius:22px;box-shadow:var(--shadow);padding:22px}
    .stack{display:flex;flex-direction:column;gap:12px;margin-top:8px}
    .cta{display:inline-block;border-radius:12px;background:var(--brand-blue);color:#fff;text-decoration:none;padding:12px 16px;font-weight:700}
    .ghost{background:#fff;border:1px solid #e6e7ef;border-radius:12px;padding:12px 14px;font-weight:700;text-align:center;color:#0f172a;text-decoration:none}
    .hint{font-size:12px;color:var(--muted);margin-top:6px}

    footer{margin-top:auto;background:var(--footer-bg);color:#cbd5e1;}
    @media (max-width:760px){.grid{grid-template-columns:1fr}}
    @media (max-width:860px){footer .wrap>div[style*="grid-template-columns"]{display:grid;grid-template-columns:1fr;gap:16px!important;}}
  </style>



@endsection  {{-- Paste rest of {{-- from Visibility-Listing.html --}}