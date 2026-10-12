<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">
    <meta name="theme-color" content="#0b1425">
    @if (! empty($retryAfter))
        <meta http-equiv="refresh" content="{{ max(30, (int) $retryAfter) }}">
    @endif
    <title>Scheduled Maintenance | Raymoch</title>
    <style>
        :root { color-scheme: light; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        * { box-sizing: border-box; }
        html, body { min-height: 100%; }
        body {
            margin: 0; min-height: 100vh; min-height: 100dvh; display: grid; place-items: center;
            padding: 32px 20px; color: #172033;
            background: radial-gradient(circle at 15% 15%, rgba(82,185,141,.14), transparent 28rem), radial-gradient(circle at 85% 85%, rgba(52,120,229,.14), transparent 30rem), #f4f7fb;
        }
        .maintenance-card { width: min(100%, 680px); overflow: hidden; border: 1px solid #dce3ee; border-radius: 20px; background: rgba(255,255,255,.96); box-shadow: 0 24px 70px rgba(11,20,37,.14); }
        .accent { height: 5px; background: linear-gradient(90deg, #3478e5, #52b98d); }
        .content { padding: clamp(32px, 7vw, 58px); }
        .brand { display: inline-flex; align-items: center; gap: 11px; color: #0b1425; font-size: 1.15rem; font-weight: 800; letter-spacing: .01em; }
        .brand img { width: 38px; height: 38px; object-fit: contain; }
        .status { display: inline-flex; align-items: center; gap: 8px; margin-top: 36px; color: #2f6f4f; font-size: .75rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
        .status::before { content: ""; width: 9px; height: 9px; border-radius: 50%; background: #52b98d; box-shadow: 0 0 0 5px rgba(82,185,141,.14); }
        h1 { margin: 16px 0 14px; color: #0b1425; font-size: clamp(2rem, 6vw, 3.25rem); line-height: 1.08; letter-spacing: -.035em; }
        p { margin: 0; max-width: 55ch; color: #5e6b7d; font-size: 1.05rem; line-height: 1.75; }
        .note { margin-top: 30px; padding-top: 22px; border-top: 1px solid #e4e9f1; color: #7a8698; font-size: .86rem; line-height: 1.6; }
        @media (max-width: 520px) { body { padding: 18px; } .maintenance-card { border-radius: 14px; } .content { padding: 30px 24px 32px; } }
    </style>
</head>
<body>
    <main class="maintenance-card" aria-labelledby="maintenance-title">
        <div class="accent" aria-hidden="true"></div>
        <div class="content">
            <div class="brand">
                <img src="/images/logo_preview_exact.svg" alt="">
                <span>Raymoch</span>
            </div>
            <div class="status">Scheduled maintenance</div>
            <h1 id="maintenance-title">We’ll be back shortly.</h1>
            <p>We’re carrying out a brief update to improve your experience. The website will be available again in just a few minutes. Thank you for your patience.</p>
            <div class="note">This page will refresh automatically. No action is required.</div>
        </div>
    </main>
</body>
</html>
