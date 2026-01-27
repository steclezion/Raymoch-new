// PricingBasic.jsx
import React from "react";
import Header from "./layout/Header.jsx";
import Footer from "./layout/Footer.jsx";
import Hero from "./sections/Hero.jsx";
import PlanCard from "./pricing/PlanCard.jsx";

export default function PricingBasic({ routes = {} }) {
  // Safe fallbacks if routes are missing
  const basicCreate =
    routes?.signup?.basic?.create?.individual ||
    "/signup/basic/create/individual";

  const premiumCreate =
    routes?.signup?.premium?.create || "/signup/premium/create/individual";
    const signupIndex = routes?.signup?.index || "/signup";
    const brandName = routes?.brandName || "Raymoch";
    const privacyHref = routes?.privacy || "/privacy";
    const termsHref = routes?.terms || "/terms";
    const cookiesHref = routes?.cookies || "/cookies";

  return (
    <div className="page">
      <style>{styles}</style>

      <Header routes={routes} />

      <Hero title="Basic Plans" subtitle="Pick a plan and explore" />

      <main className="main">
        <div className="wrap">
          <section className="grid" aria-label="Choose your Basic plan">
            <PlanCard
              id="basic"
              title="Basic"
              badge="Most popular"
              price="$0"
              per="per user"
              desc="Browse and keep tabs on companies. Perfect for getting started."
              features={[
                "Follow up to 20 companies",
                "Personal watchlists",
                "Weekly sector updates",
                "Private notes",
              ]}
              primaryHref={`${basicCreate}?plan=basic`}
              primaryLabel="Continue with Basic"
              backHref={signupIndex}
            />

            <PlanCard
              id="premium"
              title="Premium"
              price="$9"
              per="per user"
              desc="Richer signals and more room to grow. Best for active users."
              features={[
                "Follow unlimited companies",
                "Priority sector alerts (daily)",
                "Advanced filters & saved searches",
                "Export lists to CSV",
              ]}
              primaryHref={`${premiumCreate}?plan=premium`}
              primaryLabel="Continue with Premium"
              backHref={signupIndex}
            />
          </section>
        </div>
      </main>

{/* 
      <footer className="ft">
        <div>© {new Date().getFullYear()} {brandName}. All rights reserved.</div>
        <div>
          <a href={privacyHref}>Privacy</a>
          <a href={termsHref}>Terms</a>
          <a href={cookiesHref}>Cookies</a>
        </div>
      </footer> */}

<Footer routes={routes} />
    </div>
  );
}

const styles = `
:root{
  --brand-blue:#0328aeed; --brand-blue-700:#213bb1; --brand-blue-500:#041b64;
  --ink:#0f172a; --muted:#475569; --bg:#fafafa; --border:#e8e8eee0; --card:#fff;
  --shadow:0 10px 30px rgba(10,42,107,.08);  --radius:16px;
}
*{box-sizing:border-box;margin:0;padding:0;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif}
html,body{height:100%}

/* ✅ Make footer always stay at bottom */
.page{
  min-height:100vh;
  display:flex;
  flex-direction:column;
  background:var(--bg);
  color:var(--ink);
}
.main{
  flex:1 0 auto;
  display:block;
}

.header{height:80px;background:#fff;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;padding:0 24px;position:relative}
.brand{display:flex;align-items:center;gap:10px;color:#0328aeed;text-decoration:none}
.brand svg{width:26px;height:26px}
.brand span{font-weight:900;font-size:1.3rem;letter-spacing:.2px;color:#0328aeed}
.iconbtn{background:transparent;border:0;cursor:pointer;padding:6px;border-radius:8px;display:flex;align-items:center;justify-content:center;position:relative}
.iconbtn:hover{background:#f2f4ff}
.menu{position:absolute;top:68px;right:24px;width:180px;background:#fff;border:1px solid var(--border);border-radius:12px;box-shadow:0 10px 30px rgba(10,42,107,.10);overflow:hidden;display:none;z-index:20}
.menu a{display:block;padding:12px 14px;text-decoration:none;color:#0f172a;font-weight:600}
.menu a:hover{background:#f6f8ff}
.menu hr{border:0;border-top:1px solid var(--border);margin:0}

.hero{color:#0f172a;background:linear-gradient(180deg,#ffffff 0%, #fbfcff 40%, #f7f7fb 100%);border-bottom:1px solid var(--border)}
.hero-inner{max-width:1080px;margin:0 auto;padding:42px 24px 36px}
.hero h1{font-size:2.2rem;font-weight:900}
.hero p{max-width:70ch;color:#64748b;margin-top:8px;line-height:1.55}

.wrap{width:100%;max-width:1080px;margin:0 auto;padding:24px}
.grid{display:grid;gap:18px;grid-template-columns:1fr 1fr}
@media (max-width:860px){.grid{grid-template-columns:1fr}}

.plan{
  background:var(--card);border:1px solid var(--border);border-radius:20px;box-shadow:var(--shadow);
  padding:22px;display:flex;flex-direction:column;min-height:420px;position:relative;overflow:hidden
}
.plan[data-selected="true"]{border-color:#c9d4ff;box-shadow:0 0 0 3px rgba(33,59,177,.15)}
.plan h2{font-size:1.35rem;font-weight:900;display:flex;align-items:center;gap:10px}
.price{display:flex;align-items:baseline;gap:8px;margin:10px 0 8px}
.price strong{font-size:1.9rem}
.price span{opacity:.85}
.price em{font-style:normal;font-size:.9rem;opacity:.8}
.desc{color:var(--muted);margin:6px 0 14px}
.badge{display:inline-block;background:#f5f8ff;border:1px solid #dbe4ff;color:#041b64;border-radius:999px;padding:6px 10px;font-weight:800;font-size:.85rem}
.features{margin-top:6px;display:grid;gap:10px}
.features li{list-style:none;display:flex;gap:10px;align-items:flex-start;color:#162033}
.features li:before{content:"✓";font-weight:900}
.actions{margin-top:auto;display:flex;gap:10px;flex-wrap:wrap}
a.primary{
  display:inline-block;text-decoration:none;
  background:linear-gradient(135deg,var(--brand-blue-700),var(--brand-blue-500)); color:#fff;
  padding:12px 16px;border-radius:12px;font-weight:900
}
a.primary:hover{filter:brightness(1.02)}
a.back{display:inline-block;text-decoration:none;border:1px solid #d9e1ff;background:#f5f8ff;color:#0a1f44;padding:12px 14px;border-radius:12px;font-weight:800}
a.back:hover{background:#eef3ff;border-color:#c9d4ff}

/* ✅ Footer pinned to bottom */
.ft{
  margin-top:auto;
  background:#0b1020;color:#cbd5e1;font-size:.9rem;padding:10px 24px;
  display:flex;justify-content:space-between;align-items:center;
  border-top:1px solid #1f2937;
}
.ft a{color:#cbd5e1;margin-left:14px;text-decoration:none}
.ft a:hover{text-decoration:underline}
`;
