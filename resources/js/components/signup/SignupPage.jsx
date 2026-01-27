import React from "react";
import Header from "./Header.jsx";
import PlanCard from "./PlanCard.jsx";

export default function SignupPage({ routes }) {
  return (
    <>
      <style>{styles}</style>

      <Header routes={routes} />

      <section className="hero">
        <div className="hero-inner">
          <h1>Create Account</h1>
          <p>Choose your path...</p>
        </div>
      </section>

      <main>
        <div className="wrap">
          <section className="grid" aria-label="Account types">
            <PlanCard
              title="Individual Account"
              price="$0"
              per="mo"
              unitNote="per user"
              description="Browse and keep tabs on companies. Perfect for getting started."
              features={[
                "Follow up to 20 companies",
                "Personal watchlists",
                "Weekly sector updates",
                "Private notes",
              ]}
              ctaHref={routes.basicCreate}
            />

            <PlanCard
              title="Business Account"
              price="$69"
              per="mo"
              unitNote="per company"
              description="Create a verified profile, submit proofs, reach aligned capital."
              features={[
                "Company profile & verification",
                "Document proofs",
                "CTI upgrades",
                "Investor visibility",
                "Premium Matching",
                "Access To B2B Matching",
                "Premium Access to Grants",
                "Premium Access to Policy",
              ]}
              ctaHref={routes.businessCreate}
            />

            <PlanCard
              title="Investor Account"
              price="$79"
              per="mo"
              unitNote="per user"
              description="Access deal flow, CTI signals, and portfolio tools."
              features={[
                "Verified deal rooms",
                "CTI tiers & sector follow",
                "Portfolio tools",
                "Matching tools",
                "Market Insight",
              ]}
              ctaHref={routes.investorCreate}
            />
          </section>
        </div>
      </main>

<footer className="ft">
  <div>
    © {new Date().getFullYear()} { "Raymoch"}. All rights reserved.
  </div>
  <div>
    <a href={routes.privacy}>Privacy</a>
    <a href={routes.terms}>Terms</a>
    <a href={routes.cookies}>Cookies</a>
  </div>
</footer>

    </>
  );
}

const styles = `
:root{
  --brand-blue:#0328aeed; --brand-blue-700:#213bb1; --brand-blue-500:#041b64;
  --ink:#0f172a; --muted:#475569; --bg:#fafafa; --border:#e8e8ee; --card:#fff;
  --shadow:0 10px 30px rgba(10,42,107,.08); --footer-bg:#0b1020;
  --radius:24px; --cardH: clamp(540px, 75vh, 880px);
}

/* ===== Header fixes (scoped to your Header.jsx markup) ===== */
.header{
  height:80px;
  background:#fff;
  border-bottom:1px solid var(--border);
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:0 24px;
  position:relative;
  flex-shrink:0;
}
.brand{ display:flex; align-items:center; gap:10px; color:var(--brand-blue); text-decoration:none; }
.brand svg{ width:26px; height:26px; display:block; }
.brand span{ font-weight:900; font-size:1.3rem; letter-spacing:.2px; color:var(--brand-blue); }

*{box-sizing:border-box;margin:0;padding:0;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif}
body{min-height:100vh;display:flex;flex-direction:column;background:var(--bg);color:var(--ink)}

.hdr{height:80px;background:#fff;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;padding:0 24px;position:relative}
.brand{display:flex;align-items:center;gap:10px;color:var(--brand-blue);text-decoration:none}
.brand svg{width:26px;height:26px}
.brand span{font-weight:900;font-size:1.3rem;letter-spacing:.2px;color:var(--brand-blue)}

.iconbtn{background:transparent;border:0;cursor:pointer;padding:6px;border-radius:8px;display:flex;align-items:center;justify-content:center;position:relative}
.iconbtn:hover{background:#f2f4ff}

.menu{position:absolute;top:68px;right:24px;width:180px;background:#fff;border:1px solid var(--border);border-radius:12px;box-shadow:0 10px 30px rgba(10,42,107,.10);overflow:hidden;display:none;z-index:20}
.menu a{display:block;padding:12px 14px;text-decoration:none;color:#0f172a;font-weight:600}
.menu a:hover{background:#f6f8ff}
.menu hr{border:0;border-top:1px solid var(--border);margin:0}

.hero{color:#0f172a;background:linear-gradient(180deg,#ffffff 0%, #fbfcff 40%, #f7f7fb 100%);border-bottom:1px solid var(--border)}
.hero-inner{max-width:1080px;margin:0 auto;padding:42px 24px 36px}
.hero h1{font-size:2.3rem;font-weight:900}
.hero p{max-width:70ch;color:#64748b;margin-top:8px;line-height:1.55}

main{flex:1;display:block}
.wrap{width:100%;max-width:1320px;margin:0 auto;padding:24px}

/* ===== GRID ===== */
.grid{
  display:grid;
  gap:22px;
  grid-template-columns:repeat(3,minmax(0,1fr));
}

/* ✅ HARD LOCK: grid must never change color on hover/focus */
.grid,
.grid:hover,
.grid:focus,
.grid:focus-within,
.grid:active{
  background-color: transparent !important;
  color: inherit !important;
  transition: none !important;
}


@media (max-width:1180px){.grid{grid-template-columns:1fr 1fr}}
@media (max-width:780px){.grid{grid-template-columns:1fr}}

.card{
  height:var(--cardH);
  background:var(--card);
  border:1px solid var(--border);
  border-radius:var(--radius);
  box-shadow:var(--shadow);
  display:flex;flex-direction:column;overflow:hidden;
  transition:transform .1s ease, box-shadow .1s ease, border-color .1s ease;
}
.card:hover{transform:translateY(-2px);border-color:#d8defa;box-shadow:0 12px 40px rgba(10,42,107,.12)}

.card:hover{
  transform:none !important;
  border-color:var(--border) !important;
  box-shadow:var(--shadow) !important;
}
  
.card-body{padding:28px 26px 0 26px;display:flex;flex-direction:column;gap:14px}
.card h3{font-size:1.5rem;font-weight:900}
.price-row{display:flex;align-items:baseline;gap:8px}
.price-row strong{font-size:2rem}
.price-row span{opacity:.85}
.price-row em{font-style:normal;font-size:.9rem;opacity:.8}
.card p{color:var(--muted);line-height:1.55}
.features{margin-top:6px;display:grid;gap:10px}
.features li{list-style:none;display:flex;gap:10px;align-items:flex-start;color:#162033}
.features li:before{content:"✓";font-weight:900}
.spacer{margin-top:auto}

.planbar{
  margin-top:auto;padding:16px 18px;border-top:1px solid var(--border);
  background:linear-gradient(180deg,#ffffff 0%, #fbfbff 100%);
  display:flex;gap:10px;align-items:center;justify-content:flex-end;flex-wrap:wrap;
}
.planbar a{
  text-decoration:none;white-space:nowrap;font-weight:900;border-radius:12px;padding:12px 16px;
}
.primary{background:linear-gradient(135deg,var(--brand-blue-700),var(--brand-blue-500));color:#fff;border:none}
.primary:hover{filter:brightness(1.02)}

.ft{
  background:#0b1020;color:#cbd5e1;font-size:.9rem;padding:10px 24px;
  display:flex;justify-content:space-between;align-items:center;
  border-top:1px solid #1f2937;margin-top:24px
}
.ft a{color:#cbd5e1;margin-left:14px;text-decoration:none}
.ft a:hover{text-decoration:underline}




/* 🚫 BLOCK all hover/focus styling on the pricing area */
.wrap,
.wrap:hover,
.wrap:focus,
.wrap:focus-within,
.wrap:active {
  background: transparent !important;
}

.grid,
.grid:hover,
.grid:focus,
.grid:focus-within,
.grid:active {
  background: transparent !important;
}

/* 🚫 Prevent ANY parent hover from affecting cards */
.wrap:hover .card,
.grid:hover .card,
main:hover .card,
body:hover .card {
  background: var(--card) !important;
  color: var(--ink) !important;
  border-color: var(--border) !important;
  box-shadow: var(--shadow) !important;
  filter: none !important;
  backdrop-filter: none !important;
}

/* 🚫 Kill ALL hover transforms */
.card:hover,
.card:focus,
.card:active {
  transform: none !important;
  box-shadow: var(--shadow) !important;
  border-color: var(--border) !important;
}

/* ✅ HARD LOCK PlanCard text colors (fixes "transparent on hover") */
.card h3,
.card .card-body h3 {
  color: var(--ink) !important;
  -webkit-text-fill-color: var(--ink) !important;
  opacity: 1 !important;
}

.card p,
.card .card-body p {
  color: var(--muted) !important;
  -webkit-text-fill-color: var(--muted) !important;
  opacity: 1 !important;
}

.card .features,
.card .features li {
  color: #162033 !important;
  -webkit-text-fill-color: #162033 !important;
  opacity: 1 !important;
}

/* ✅ On hover/focus, keep text exactly the same */
.card:hover h3,
.card:hover p,
.card:hover .features,
.card:hover .features li,
.card:focus-within h3,
.card:focus-within p,
.card:focus-within .features,
.card:focus-within .features li {
  color: inherit !important;
  -webkit-text-fill-color: currentColor !important;
  opacity: 1 !important;
}

/* ✅ If the whole card is inside an <a>, prevent link hover from affecting children */
.card a,
.card a:hover,
.card a:focus,
.card a:active {
  color: inherit !important;
  -webkit-text-fill-color: currentColor !important;
  text-decoration: none !important;
}

/* ✅ Keep CTA button styling (don’t inherit) */
.planbar a.primary,
.planbar a.primary:hover,
.planbar a.primary:focus {
  color: #fff !important;
  -webkit-text-fill-color: #fff !important;
}

`;
