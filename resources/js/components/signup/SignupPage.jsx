// SignupPage.jsx
import React from "react";
import Header from "./Header.jsx";
import PlanCard from "./PlanCard.jsx";

export default function SignupPage({ routes = {} }) {
  // ✅ safe fallbacks (prevents undefined links)
  const r = {
    ...routes,
    basicCreate: routes?.basicCreate || "/signup/basic/create/individual",
    businessCreate: routes?.businessCreate || "/signup/business",
    investorCreate: routes?.investorCreate || "/signup/investor",
    privacy: routes?.privacy || "/privacy",
    terms: routes?.terms || "/terms",
    cookies: routes?.cookies || "/cookies",
    brandName: routes?.brandName || "Raymoch",
  };

  return (
    <>
      <style>{styles}</style>

      <div className="page">
        <Header routes={r} />

        <section className="hero">
          <div className="hero-inner">
            <h1>Create Account</h1>
            <p>Choose your path...</p>
          </div>
        </section>

        <main className="main">
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
                ctaHref={r.basicCreate}
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
                ctaHref={r.businessCreate}
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
                ctaHref={r.investorCreate}
              />
            </section>
          </div>
        </main>

        <footer className="ft">
          <div>
            © {new Date().getFullYear()} {r.brandName}. All rights reserved.
          </div>
          <div className="ftlinks">
            <a href={r.privacy}>Privacy</a>
            <a href={r.terms}>Terms</a>
            <a href={r.cookies}>Cookies</a>
          </div>
        </footer>
      </div>
    </>
  );
}

const styles = `
:root{
  --brand-blue:#0328aeed; --brand-blue-700:#213bb1; --brand-blue-500:#041b64;
  --ink:#0f172a; --muted:#475569; --bg:#fafafa; --border:#e8e8ee; --card:#fff;
  --shadow:0 10px 30px rgba(10,42,107,.08);
  --footer-bg:#0b1020;
  --radius:20px;

  /* ✅ Smaller cards on most screens */
  --cardH: clamp(460px, 62vh, 720px);
}

*{box-sizing:border-box;margin:0;padding:0;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif}
html,body{height:100%}
.page{min-height:100vh;display:flex;flex-direction:column;background:var(--bg);color:var(--ink)}
.main{flex:1 0 auto;display:block}

/* ✅ DO NOT redefine .header/.brand/.menu here (Header.jsx injects its own CSS).
   Redefining them caused layout conflicts + extra padding. */

/* Hero (reduced padding) */
.hero{
  color:#0f172a;
  background:linear-gradient(180deg,#ffffff 0%, #fbfcff 40%, #f7f7fb 100%);
  border-bottom:1px solid var(--border)
}
.hero-inner{max-width:1080px;margin:0 auto;padding:28px 16px 22px}
.hero h1{font-size:2rem;font-weight:900}
.hero p{max-width:70ch;color:#64748b;margin-top:6px;line-height:1.5}

/* Wrap (reduced padding) */
.wrap{width:100%;max-width:1240px;margin:0 auto;padding:16px}

/* Grid */
.grid{
  display:grid;
  gap:16px;
  grid-template-columns:repeat(3,minmax(0,1fr));
}
@media (max-width:1180px){.grid{grid-template-columns:1fr 1fr}}
@media (max-width:780px){.grid{grid-template-columns:1fr}}

/* ✅ HARD LOCK: prevent parents changing colors on hover */
.wrap,.wrap:hover,.wrap:focus,.wrap:focus-within,.wrap:active{background:transparent !important}
.grid,.grid:hover,.grid:focus,.grid:focus-within,.grid:active{background:transparent !important;color:inherit !important;transition:none !important}

/* Card defaults (reduced padding) */
.card{
  height:var(--cardH);
  background:var(--card);
  border:1px solid var(--border);
  border-radius:var(--radius);
  box-shadow:var(--shadow);
  display:flex;
  flex-direction:column;
  overflow:hidden;
}

/* 🚫 Kill ALL hover transforms/overlays (keeps text readable) */
.card:hover,.card:focus,.card:active,.card:focus-within{
  transform:none !important;
  background:var(--card) !important;
  color:inherit !important;
  border-color:var(--border) !important;
  box-shadow:var(--shadow) !important;
  filter:none !important;
  outline:none !important;
}

.card-body{
  padding:18px 18px 0 18px;
  display:flex;
  flex-direction:column;
  gap:10px
}
.card h3{font-size:1.3rem;font-weight:900}
.price-row{display:flex;align-items:baseline;gap:8px}
.price-row strong{font-size:1.8rem}
.price-row span{opacity:.85}
.price-row em{font-style:normal;font-size:.9rem;opacity:.8}
.card p{color:var(--muted);line-height:1.5}

.features{margin-top:4px;display:grid;gap:8px}
.features li{list-style:none;display:flex;gap:10px;align-items:flex-start;color:#162033}
.features li:before{content:"✓";font-weight:900}

.planbar{
  margin-top:auto;
  padding:12px 14px;
  border-top:1px solid var(--border);
  background:linear-gradient(180deg,#ffffff 0%, #fbfbff 100%);
  display:flex;
  gap:10px;
  align-items:center;
  justify-content:flex-end;
  flex-wrap:wrap;
}
.planbar a{
  text-decoration:none;
  white-space:nowrap;
  font-weight:900;
  border-radius:12px;
  padding:10px 14px;
}
.primary{
  background:linear-gradient(135deg,var(--brand-blue-700),var(--brand-blue-500));
  color:#fff;
  border:none
}
.primary:hover{filter:brightness(1.02)}

/* ✅ HARD LOCK PlanCard text colors */
.card h3,.card .card-body h3{
  color:var(--ink) !important;
  -webkit-text-fill-color:var(--ink) !important;
  opacity:1 !important;
}
.card p,.card .card-body p{
  color:var(--muted) !important;
  -webkit-text-fill-color:var(--muted) !important;
  opacity:1 !important;
}
.card .features,.card .features li{
  color:#162033 !important;
  -webkit-text-fill-color:#162033 !important;
  opacity:1 !important;
}

/* Footer (reduced padding) */
.ft{
  margin-top:18px;
  background:var(--footer-bg);
  color:#cbd5e1;
  font-size:.9rem;
  padding:10px 16px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  border-top:1px solid #1f2937;
}
.ft a{color:#cbd5e1;margin-left:12px;text-decoration:none}
.ft a:hover{text-decoration:underline}
@media (max-width:600px){
  .ft{flex-direction:column;gap:8px;text-align:center}
  .ftlinks{display:flex;gap:12px;flex-wrap:wrap;justify-content:center}
  .ft a{margin-left:0}
}
`;
