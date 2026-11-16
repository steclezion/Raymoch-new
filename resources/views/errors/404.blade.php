<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">
    <title>Page Not Available | Raymoch</title>
    <style>
        :root{color-scheme:light;--canvas:#fbf8f3;--tier:#f4e8d6;--ink:#221612;--brown:#5b3825;--brown-hover:#6f452e;--muted:#756a62;--line:#ded2c3;--gold:#c6a476}
        *{box-sizing:border-box}html,body{min-height:100%}
        body{margin:0;color:var(--ink);background:radial-gradient(circle at 85% 18%,rgba(198,164,118,.22),transparent 30%),var(--canvas);font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
        .error-nav{min-height:76px;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:8px clamp(22px,4vw,58px);border-bottom:1px solid var(--gold);background:var(--tier);box-shadow:0 5px 18px rgba(42,28,18,.11)}
        .error-brand{display:inline-flex;align-items:center;gap:10px;color:var(--brown);font-size:1.2rem;font-weight:760;letter-spacing:.01em;text-decoration:none}
        .error-brand img{width:58px;height:58px;display:block;object-fit:contain}
        .error-nav__label{color:#7a5036;font-size:.74rem;font-weight:760;letter-spacing:.08em;text-transform:uppercase}
        .error-main{width:min(1180px,calc(100% - 36px));min-height:calc(100vh - 77px);display:grid;grid-template-columns:minmax(0,.9fr) minmax(360px,1.1fr);align-items:center;gap:clamp(24px,5vw,72px);margin:0 auto;padding:clamp(38px,7vw,88px) 0}
        .error-copy{max-width:570px}.error-code{display:inline-flex;align-items:center;gap:9px;margin:0 0 18px;color:var(--brown-hover);font-size:.76rem;font-weight:820;letter-spacing:.12em;text-transform:uppercase}
        .error-code::before{width:9px;height:9px;border-radius:50%;background:#b57b3f;box-shadow:0 0 0 5px rgba(181,123,63,.13);content:""}
        h1{max-width:12ch;margin:0;color:#382116;font-size:clamp(2.45rem,5vw,5.1rem);line-height:.98;letter-spacing:-.055em}
        .error-copy>p{max-width:52ch;margin:24px 0 0;color:var(--muted);font-size:clamp(1rem,1.8vw,1.14rem);line-height:1.72}
        .error-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:30px}.error-action{min-height:46px;display:inline-flex;align-items:center;justify-content:center;padding:11px 18px;border:1px solid var(--brown);border-radius:9px;color:var(--canvas);background:var(--brown);font-size:.9rem;font-weight:760;text-decoration:none;transition:transform 160ms ease,background-color 160ms ease,box-shadow 160ms ease}
        .error-action:hover{background:var(--brown-hover);box-shadow:0 10px 24px rgba(91,56,37,.18);transform:translateY(-1px)}.error-action--secondary{color:var(--brown);background:transparent}.error-action--secondary:hover{color:var(--brown);background:#f3e7cf}
        .error-action:focus-visible,.error-brand:focus-visible{outline:3px solid rgba(143,104,71,.22);outline-offset:3px}
        .error-visual{position:relative;display:grid;place-items:center;min-width:0;margin:0}.error-visual::before{position:absolute;width:74%;aspect-ratio:1;border:1px solid rgba(198,164,118,.42);border-radius:50%;background:radial-gradient(circle,rgba(243,231,207,.8),rgba(243,231,207,0) 68%);content:""}
        .error-visual img{position:relative;z-index:1;width:min(100%,680px);height:auto;display:block;filter:drop-shadow(0 28px 34px rgba(72,47,30,.2))}.error-visual figcaption{position:relative;z-index:1;margin-top:-4px;color:#8b8178;font-size:.78rem;font-weight:650;text-align:center}
        @media(max-width:820px){.error-nav__label{display:none}.error-main{grid-template-columns:1fr;text-align:center}.error-copy{max-width:680px;margin:0 auto}h1,.error-copy>p{margin-right:auto;margin-left:auto}.error-actions{justify-content:center}.error-visual{grid-row:1}.error-visual img{width:min(88vw,520px)}}
        @media(max-width:520px){.error-main{width:min(100% - 28px,1180px);padding-top:28px}.error-nav{min-height:68px;padding:6px 16px}.error-brand img{width:50px;height:50px}.error-actions{flex-direction:column}.error-action{width:100%}}
        @media(prefers-reduced-motion:reduce){.error-action{transition:none}}
    </style>
</head>
<body>
    <header class="error-nav">
        <a class="error-brand" href="{{ url('/') }}" aria-label="Raymoch home">
            <img src="{{ asset('images/raymoch_logo_11_10-26.svg') }}" alt="">
            <span>Raymoch</span>
        </a>
        <span class="error-nav__label">Business intelligence platform</span>
    </header>
    <main class="error-main">
        <section class="error-copy" aria-labelledby="error-title">
            <p class="error-code">Error 404</p>
            <h1 id="error-title">This page has gone offline.</h1>
            <p>Raymoch could not locate the page you requested. The address may be incorrect, or the page may have been moved or retired.</p>
            <nav class="error-actions" aria-label="Page recovery options">
                <a class="error-action" href="{{ url('/home') }}">Return to Raymoch</a>
                <a class="error-action error-action--secondary" href="{{ url('/explore') }}">Explore businesses</a>
            </nav>
        </section>
        <figure class="error-visual">
            <img src="{{ asset('images/raymoch-offline-robot-cat.png') }}" alt="A friendly Raymoch robot cat resting while powered down" width="1536" height="1024">
            <figcaption>Our navigation assistant could not establish a route to this page.</figcaption>
        </figure>
    </main>
</body>
</html>
