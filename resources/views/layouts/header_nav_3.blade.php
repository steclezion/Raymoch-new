<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Raymoch – Market Insight Mega Menu</title>
    <style>
        :root {
            --nav-bg: #0f2f5f;
            /* deep blue bar */
            --ink: #0d234b;
            /* heading ink */
            --muted: #e9edf3;
            --card: #ffffff;
            --ring: #d7dee8;
            --brand: #0f2f5f;
        }

        * {
            box-sizing: border-box
        }

        body {
            margin: 0;
            font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
            color: #172b4d;
            background: #fff
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 16px
        }

        /* ===== NAVBAR ===== */
        .nav {
            background: var(--nav-bg);
            color: #fff;
            position: sticky;
            top: 0;
            z-index: 40;
            border-bottom: 1px solid rgba(255, 255, 255, .06);
        }

        .nav-row {
            height: 64px;
            display: flex;
            align-items: center;
            gap: 20px;
        }

        .brand {
            display: flex;
            align-items: center;
            gap: 12px;
            color: #fff;
            text-decoration: none;
            font-weight: 800;
            font-size: 26px
        }

        .brand .mark {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: grid;
            place-items: center;
            border: 2px solid #5ea8ff;
            color: #cfe8ff;
            font-weight: 800
        }

        .menu {
            display: flex;
            align-items: center;
            gap: 28px;
            margin-left: 10px
        }

        .menu a {
            color: #cfe3ff;
            text-decoration: none;
            font-weight: 600
        }

        .menu a:hover {
            color: #fff
        }

        .right {
            margin-left: auto;
            display: flex;
            align-items: center;
            gap: 12px
        }

        /* Search */
        .search {
            display: flex;
            align-items: center;
            gap: 8px;
            background: rgba(255, 255, 255, .06);
            border: 1px solid rgba(255, 255, 255, .15);
            border-radius: 12px;
            padding: 8px 12px;
            color: #e8f1ff;
            min-width: 240px;
        }

        .search input {
            border: 0;
            background: transparent;
            color: #e8f1ff;
            width: 100%;
            outline: none;
        }

        .search svg {
            opacity: .8
        }

        /* Buttons */
        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            height: 40px;
            padding: 0 16px;
            border-radius: 999px;
            font-weight: 700;
            border: 1px solid #ffeaa8;
            color: #0c2d5c;
            background: #ffeaa8;
            text-decoration: none;
        }

        .btn:focus {
            outline: 2px solid #fff;
            outline-offset: 2px
        }

        .btn.ghost {
            background: transparent;
            color: #cfe3ff;
            border-color: #74b6ff
        }

        .btn.ghost:hover {
            background: rgba(255, 255, 255, .08)
        }

        /* ===== MEGA MENU ===== */
        .has-mega {
            position: relative
        }

        .mega {
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            top: 100%;
            margin-top: 18px;
            width: min(880px, 92vw);
            background: var(--card);
            color: #0b1f44;
            border: 1px solid var(--ring);
            border-radius: 14px;
            box-shadow: 0 24px 60px rgba(17, 31, 61, .18);
            padding: 18px 18px 14px;
            display: none;
        }

        .mega::before {
            /* notch */
            content: "";
            position: absolute;
            top: -8px;
            left: 50%;
            transform: translateX(-50%) rotate(45deg);
            width: 16px;
            height: 16px;
            background: var(--card);
            border-left: 1px solid var(--ring);
            border-top: 1px solid var(--ring);
        }

        .mega-head {
            font-size: 20px;
            font-weight: 800;
            margin: 6px 6px 12px
        }

        .mega-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(280px, 1fr));
            gap: 14px;
            padding: 6px;
        }

        .card {
            display: flex;
            gap: 14px;
            align-items: flex-start;
            background: #fff;
            border: 1px solid var(--muted);
            border-radius: 12px;
            padding: 16px;
            transition: box-shadow .15s ease, transform .06s ease, border-color .15s;
        }

        .card:hover {
            border-color: #cdd6e3;
            box-shadow: 0 6px 26px rgba(17, 31, 61, .10);
            transform: translateY(-1px)
        }

        .card h4 {
            margin: 0 0 6px;
            font-size: 18px;
            font-weight: 800;
            color: var(--ink)
        }

        .card p {
            margin: 0;
            color: #4b5876;
            font-size: 14px;
            line-height: 1.35
        }

        .ico {
            width: 36px;
            height: 36px;
            border-radius: 10px;
            display: grid;
            place-items: center;
            color: var(--brand);
            background: #eef3fb
        }

        /* show */
        .has-mega[aria-expanded="true"] .mega {
            display: block
        }

        /* small screens */
        @media (max-width:720px) {
            .menu {
                gap: 18px
            }

            .mega-grid {
                grid-template-columns: 1fr
            }

            .search {
                min-width: 160px
            }
        }
    </style>
</head>

<body>

    <header class="nav">
        <div class="container">
            <div class="nav-row">
                <a class="brand" href="#">
                    <span class="mark">R</span> Raymoch
                </a>

                <nav class="menu">
                    <a href="#">Businesses (Sectors)</a>

                    <!-- Market Insight (with mega) -->
                    <div class="has-mega" id="mi" aria-expanded="false">
                        <a href="#" id="mi-toggle">Market Insight</a>
                        <div class="mega" id="mi-panel" role="menu" aria-labelledby="mi-toggle">
                            <div class="mega-head">Market Insight</div>

                            <div class="mega-grid">
                                <!-- 1 -->
                                <a class="card" href="#">
                                    <span class="ico">
                                        <!-- chart trending up -->
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                                            stroke-linejoin="round">
                                            <path d="M3 3v18h18" />
                                            <path d="M7 15l4-4 3 3 6-6" />
                                        </svg>
                                    </span>
                                    <div>
                                        <h4>Sector Reports</h4>
                                        <p>Short briefs and charts by industry</p>
                                    </div>
                                </a>

                                <!-- 2 -->
                                <a class="card" href="#">
                                    <span class="ico">
                                        <!-- globe -->
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                                            stroke-linejoin="round">
                                            <circle cx="12" cy="12" r="9" />
                                            <path d="M3 12h18M12 3c2.5 2.7 2.5 14.3 0 18M5 7c3 .8 11 .8 14 0" />
                                        </svg>
                                    </span>
                                    <div>
                                        <h4>Regional Briefs</h4>
                                        <p>Country and region snapshots</p>
                                    </div>
                                </a>

                                <!-- 3 -->
                                <a class="card" href="#">
                                    <span class="ico">
                                        <!-- line + dots -->
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                                            stroke-linejoin="round">
                                            <path d="M3 20h18" />
                                            <circle cx="7" cy="12" r="2" />
                                            <circle cx="12" cy="8" r="2" />
                                            <circle cx="17" cy="14" r="2" />
                                            <path d="M7 12l5-4 5 6" />
                                        </svg>
                                    </span>
                                    <div>
                                        <h4>Benchmarks &amp; Indicators</h4>
                                        <p>Risk ratings, readiness, KPIs</p>
                                    </div>
                                </a>

                                <!-- 4 -->
                                <a class="card" href="#">
                                    <span class="ico">
                                        <!-- news/doc -->
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                                            stroke-linejoin="round">
                                            <rect x="4" y="3" width="14" height="18" rx="2" />
                                            <path d="M8 7h6M8 11h6M8 15h4" />
                                        </svg>
                                    </span>
                                    <div>
                                        <h4>Trends &amp; News</h4>
                                        <p>Emerging opportunities, regulatory changes</p>
                                    </div>
                                </a>

                                <!-- 5 -->
                                <a class="card" href="#">
                                    <span class="ico">
                                        <!-- download -->
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                                            stroke-linejoin="round">
                                            <path d="M12 3v10" />
                                            <path d="M8 10l4 4 4-4" />
                                            <path d="M4 17h16v4H4z" />
                                        </svg>
                                    </span>
                                    <div>
                                        <h4>Download Center</h4>
                                        <p>Reports, PDFs, data dashboards</p>
                                    </div>
                                </a>

                                <!-- 6 (optional fill to match 2×3 grid) -->
                                <a class="card" href="#">
                                    <span class="ico">
                                        <!-- database -->
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                                            stroke-linejoin="round">
                                            <ellipse cx="12" cy="5" rx="7" ry="3" />
                                            <path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5" />
                                            <path d="M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
                                        </svg>
                                    </span>
                                    <div>
                                        <h4>Data Portal</h4>
                                        <p>APIs &amp; bulk feeds</p>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>

                    <a href="#">Services</a>
                    <a href="#">About</a>
                </nav>

                <div class="right">
                    <label class="search" aria-label="Search">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2">
                            <circle cx="11" cy="11" r="7" />
                            <path d="M21 21l-4.3-4.3" />
                        </svg>
                        <input type="search" placeholder="Search" />
                    </label>
                    <a class="btn" href="#">Sign Up</a>
                </div>
            </div>
        </div>
    </header>

    <main class="container" style="padding:40px 16px 120px">
        <p style="color:#5b6b86">Hover or focus “Market Insight” to open the dropdown. Try Tab ↹ + Enter, or press Esc
            to close.</p>
    </main>

    <script>
        // Accessible open/close for the mega menu
        const mi = document.getElementById('mi');
        const toggle = document.getElementById('mi-toggle');
        const panel = document.getElementById('mi-panel');

        function openMega() {
            mi.setAttribute('aria-expanded', 'true');
        }

        function closeMega() {
            mi.setAttribute('aria-expanded', 'false');
        }

        function isOpen() {
            return mi.getAttribute('aria-expanded') === 'true';
        }

        // Hover intent
        mi.addEventListener('mouseenter', openMega);
        mi.addEventListener('mouseleave', closeMega);

        // Click / keyboard
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            isOpen() ? closeMega() : openMega();
        });
        toggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openMega();
            }
        });

        // Close on Escape / outside click
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMega();
        });
        document.addEventListener('click', (e) => {
            if (!panel.contains(e.target) && !toggle.contains(e.target)) closeMega();
        });
    </script>
</body>

</html>
