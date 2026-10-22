<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Raymoch account registration launches October 30, 2026.">
  <title>Raymoch • Signup Coming Soon</title>
  <link rel="icon" href="{{ asset('images/logo_preview_exact.svg') }}" type="image/svg+xml">
  <style>
    :root{color-scheme:light;--ink:#382116;--brown:#5b3825;--cream:#f7f2ea;--line:#ded2c3;--muted:#776c64}
    *{box-sizing:border-box}
    body{margin:0;min-height:100vh;color:var(--ink);font-family:Inter,"Segoe UI",Arial,sans-serif;background:radial-gradient(circle at 14% 8%,rgba(172,122,83,.2),transparent 28%),radial-gradient(circle at 88% 84%,rgba(91,56,37,.13),transparent 30%),linear-gradient(145deg,#fffdf8,#f5ede3 58%,#eadbca)}
    .page{position:relative;min-height:100vh;display:flex;flex-direction:column;overflow:hidden}
    .page::before{content:"";position:absolute;inset:0;background:url("{{ asset('images/abstract-polygonal-africa-map-with.jpg') }}") center/65% no-repeat;opacity:.045;pointer-events:none}
    header,footer{position:relative;z-index:1;display:flex;align-items:center;justify-content:space-between;gap:18px;padding:20px clamp(20px,5vw,72px)}
    .brand{display:inline-flex;align-items:center;gap:10px;color:var(--ink);font-size:1.18rem;font-weight:850;text-decoration:none}.brand img{width:40px;height:40px;object-fit:contain}
    .status{padding:8px 12px;border:1px solid rgba(91,56,37,.18);border-radius:999px;color:#6e5443;background:rgba(255,255,255,.6);font-size:.78rem;font-weight:750;backdrop-filter:blur(8px)}
    main{position:relative;z-index:1;flex:1;display:grid;place-items:center;padding:38px 18px 58px}
    .card{width:min(720px,100%);padding:clamp(34px,7vw,72px);text-align:center;border:1px solid rgba(91,56,37,.17);border-radius:30px;background:rgba(255,253,249,.9);box-shadow:0 28px 80px rgba(65,39,24,.14);backdrop-filter:blur(18px)}
    .icon{width:68px;height:68px;display:grid;place-items:center;margin:0 auto 25px;border-radius:21px;color:#fff;background:linear-gradient(145deg,#795039,#382116);box-shadow:0 14px 32px rgba(56,33,22,.22)}
    .eyebrow{margin:0 0 12px;color:#8b6046;font-size:.74rem;font-weight:850;letter-spacing:.18em;text-transform:uppercase}
    h1{margin:0;font-size:clamp(2.25rem,7vw,4.6rem);line-height:.98;letter-spacing:-.055em}
    .intro{max-width:550px;margin:22px auto 0;color:var(--muted);font-size:clamp(.98rem,2vw,1.08rem);line-height:1.7}
    .launch{display:inline-flex;align-items:center;gap:11px;margin:30px 0 0;padding:14px 19px;border:1px solid #d8c6b6;border-radius:14px;color:#523524;background:#f8f0e7;font-weight:800}.launch svg{color:#80573e}
    .actions{display:flex;justify-content:center;flex-wrap:wrap;gap:12px;margin-top:31px}.actions a{min-height:47px;display:inline-flex;align-items:center;justify-content:center;padding:0 21px;border-radius:12px;font-size:.9rem;font-weight:800;text-decoration:none}.primary{color:#fff;background:linear-gradient(135deg,#68442f,#382116);box-shadow:0 10px 24px rgba(56,33,22,.18)}.secondary{color:var(--brown);border:1px solid var(--line);background:#fff}.actions a:hover{transform:translateY(-1px)}
    footer{color:#7b716a;font-size:.8rem}footer nav{display:flex;gap:18px}footer a{color:inherit;text-decoration:none}footer a:hover{text-decoration:underline}
    @media(max-width:560px){header{padding-block:15px}.status{display:none}.card{border-radius:23px;padding:38px 22px}.launch{width:100%;justify-content:center}.actions{display:grid}.actions a{width:100%}footer{flex-direction:column;padding-block:22px}}
    @media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;transition:none!important}}
  </style>
</head>
<body>
  <div class="page">
    <header>
      <a class="brand" href="/" aria-label="Raymoch home"><img src="{{ asset('images/logo_preview_exact.svg') }}" alt=""><span>Raymoch</span></a>
      <span class="status">Registration opening soon</span>
    </header>
    <main>
      <section class="card" aria-labelledby="signup-coming-soon-title">
        <span class="icon" aria-hidden="true">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM19 8v6M22 11h-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
        <p class="eyebrow">Something new is coming</p>
        <h1 id="signup-coming-soon-title">Signup launches October 30</h1>
        <p class="intro">We’re putting the final touches on the Raymoch registration experience. Account creation will officially open on October 30, 2026.</p>
        <div class="launch">
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          Friday, October 30, 2026
        </div>
        <div class="actions"><a class="primary" href="/">Explore Raymoch</a><a class="secondary" href="/login">Already have an account? Sign in</a></div>
      </section>
    </main>
    <footer><span>© {{ date('Y') }} Raymoch</span><nav><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/contact">Contact</a></nav></footer>
  </div>
</body>
</html>
