// resources/js/pages/Home.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Bell,
  Building2,
  Check,
  Compass,
  FileSearch,
  Globe2,
  Handshake,
  LineChart,
  MapPin,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";

import HorizontalNavigation from "../components/HorizontalNavigation.jsx";
import { ResponsiveController } from "../components/ResponsiveController.jsx";
import Footer from "../components/layout_master/Footer.jsx";

const homeJourneys = [
  { icon: Search, number: "01", title: "Discover credible businesses", copy: "Explore companies through structured profiles, sectors, locations, and the context behind each opportunity.", href: "/explore", action: "Explore businesses" },
  { icon: Handshake, number: "02", title: "Find a stronger match", copy: "Turn your priorities into a focused shortlist of businesses, partners, and opportunities worth a closer look.", href: "/matching", action: "Start matching" },
  { icon: ShieldCheck, number: "03", title: "Understand trust signals", copy: "Review company information and verification context before you commit time, capital, or a conversation.", href: "/verification", action: "View verification" },
];

const analysisFocusAreas = [
  ["Market landscape", "A grounded view of sectors, regions, and the forces shaping a market.", Globe2],
  ["Company review", "A focused assessment of a business, its profile, and available trust context.", Building2],
  ["Opportunity comparison", "A practical comparison of options against your priorities and constraints.", BarChart3],
];

export default function Home() {
  const [user, setUser] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch("/api/me", { credentials: "same-origin", headers: { Accept: "application/json", "X-Requested-With": "XMLHttpRequest" } })
      .then(async (response) => ({ response, data: response.status === 401 || response.status === 419 ? {} : await response.json().catch(() => ({})) }))
      .then(({ response, data }) => { if (alive) setUser(response.ok && data?.ok && data?.user ? data.user : null); })
      .catch(() => { if (alive) setUser(null); })
      .finally(() => { if (alive) setUserLoaded(true); });
    return () => { alive = false; };
  }, []);

  const displayName = useMemo(() => user?.display_name || user?.name || "there", [user]);

  function submitAnalysis(event) {
    event.preventDefault();
    if (event.currentTarget.reportValidity()) setSubmitted(true);
  }

  return (
    <ResponsiveController>
      <div className="home-shell">
        <HorizontalNavigation activePath="/home" />
        <main className="home-main">


          <section className="front-door" aria-labelledby="front-door-title">
            <div className="front-door__intro">
              <p className="home-kicker"><Sparkles size={14} /> African business intelligence, made human</p>
              <h1 id="front-door-title">{userLoaded && user ? `Welcome home, ${displayName}.` : "A clearer way into African opportunity."}</h1>
              <p className="front-door__lede">Find credible businesses, understand local market context, and make more confident decisions—all in one thoughtful place.</p>
              <div className="front-door__actions"><a className="home-button home-button--ink" href="/explore">Explore the market <ArrowRight size={17} /></a><a className="home-button home-button--paper" href="#analysis">Request an analysis</a></div>
              <div className="front-door__note"><ShieldCheck size={18} /><span><strong>Built for considered decisions.</strong> Structured information, trust context, and useful paths forward.</span></div>
            </div>
            <div className="front-door__canvas" aria-label="A view of the Raymoch intelligence journey">
              <div className="canvas-orbit canvas-orbit--one" /><div className="canvas-orbit canvas-orbit--two" />
              <div className="canvas-card canvas-card--primary"><span className="canvas-label">Your starting point</span><strong>Explore with context</strong><p>Move from a broad market question to a focused next step.</p><div className="canvas-path"><span><Compass size={16} /> Discover</span><i /><span><Target size={16} /> Focus</span><i /><span><LineChart size={16} /> Decide</span></div></div>
              <div className="canvas-card canvas-card--place"><MapPin size={17} /><span>Local context</span></div>
              <div className="canvas-card canvas-card--trust"><ShieldCheck size={17} /><span>Trust signals</span></div>
              <div className="canvas-stamp"><Globe2 size={25} /><strong>Africa</strong><small>54 markets. Many stories.</small></div>
            </div>
          </section>

          <section className="welcome-ribbon" aria-label="Raymoch overview"><p>Start with what matters to you.</p><span>Discover businesses</span><i /><span>Understand markets</span><i /><span>Compare opportunities</span><i /><span>Build trusted connections</span></section>

          <section className="journey-section" id="discover" aria-labelledby="journey-title">
            <div className="section-intro"><div><p className="home-kicker">A thoughtful first step</p><h2 id="journey-title">Where would you like to begin?</h2></div><p>Raymoch turns a complex landscape into a few useful routes. Choose the one that matches the decision in front of you.</p></div>
            <div className="journey-grid">{homeJourneys.map(({ icon: Icon, number, title, copy, href, action }) => <a className="journey-card" href={href} key={title}><div className="journey-card__top"><span><Icon size={21} /></span><small>{number}</small></div><h3>{title}</h3><p>{copy}</p><strong>{action} <ArrowRight size={16} /></strong></a>)}</div>
          </section>

          <section className="approach-section" id="approach" aria-labelledby="approach-title">
            <div className="approach-story"><p className="home-kicker">More signal. Less noise.</p><h2 id="approach-title">Business intelligence should feel clear, useful, and close to the market.</h2><p>Raymoch brings company discovery, contextual information, and structured trust signals into one experience. We help people ask better questions before they make important business and investment decisions.</p><a href="/how-raymoch-works">See how Raymoch works <ArrowRight size={16} /></a></div>
            <div className="approach-details"><article><span>Context</span><h3>See beyond a company name.</h3><p>Understand where a business operates, what it does, and why it may be relevant to your goals.</p></article><article><span>Confidence</span><h3>Know what deserves a closer look.</h3><p>Use structured information and verification context to guide—not replace—your own due diligence.</p></article><article><span>Connection</span><h3>Move from research to action.</h3><p>Shortlist possibilities, compare fit, and take the next step with a clearer understanding of the opportunity.</p></article></div>
          </section>

          <section className="analysis-section" id="analysis" aria-labelledby="analysis-title">
            <div className="analysis-copy"><p className="home-kicker"><FileSearch size={14} /> Analysis desk</p><h2 id="analysis-title">Tell us what you need to understand.</h2><p>Share the decision, market, or business question you are working through. Your brief helps shape a focused analysis request.</p><div className="focus-list">{analysisFocusAreas.map(([title, copy, Icon]) => <div key={title}><span><Icon size={18} /></span><p><strong>{title}</strong>{copy}</p></div>)}</div></div>
            <div className="analysis-form-card">
              {submitted ? <div className="form-success" role="status"><span><Check size={27} /></span><p className="home-kicker">Brief prepared</p><h3>Thank you. Your analysis request is ready for review.</h3><p>A Raymoch team member can follow up using the contact information you provided.</p><button type="button" onClick={() => setSubmitted(false)}>Prepare another request</button></div> :
                <form onSubmit={submitAnalysis}><div className="form-heading"><span>Analysis request</span><small>All fields marked * are required</small></div><div className="form-row"><label>Full name *<input name="name" type="text" autoComplete="name" required placeholder="Your name" /></label><label>Work email *<input name="email" type="email" autoComplete="email" required placeholder="you@company.com" /></label></div><div className="form-row"><label>Organization<input name="organization" type="text" autoComplete="organization" placeholder="Company or organization" /></label><label>Analysis type *<select name="analysisType" required defaultValue=""><option value="" disabled>Select a focus</option><option>Market landscape</option><option>Company review</option><option>Opportunity comparison</option><option>Other research question</option></select></label></div><label>Market or location<input name="market" type="text" placeholder="Country, region, city, or sector" /></label><label>What decision are you trying to make? *<textarea name="brief" rows="5" minLength="20" required placeholder="Describe the question, context, and the outcome that would be most useful to you." /></label><label className="form-consent"><input type="checkbox" required /><span>I agree that Raymoch may use these details to respond to this request. *</span></label><button className="form-submit" type="submit">Submit analysis brief <Send size={16} /></button><p className="form-footnote">Submitting this form does not create an investment recommendation or engagement.</p></form>}
            </div>
          </section>

          <section className="closing-note"><div><p className="home-kicker">Stay curious</p><h2>A continent of opportunity deserves more than a quick glance.</h2></div><a className="home-button home-button--cream" href="/explore">Begin exploring <ArrowRight size={17} /></a></section>
        </main>
        <Footer />
        <style>{`
          :root{color-scheme:light;--h-ink:#321c14;--h-coffee:#4a2a1d;--h-clay:#d39a2c;--h-paper:#fff8e7;--h-sage:#8a5b20;--h-gold:#f3c94f;--h-line:#e8c982;--h-muted:#73523d}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#fff5d6;color:var(--h-ink);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}button,input,select,textarea{font:inherit}.home-shell{min-height:100vh;background:radial-gradient(circle at 7% 2%,rgba(211,154,44,.18),transparent 24rem),#fff5d6}.home-main{width:min(1440px,100%);margin:auto;padding:0 34px 70px}.home-topbar{height:82px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:28px;border-bottom:1px solid rgba(74,42,29,.22)}.home-wordmark{display:inline-flex;align-items:center;gap:9px;width:max-content;color:var(--h-ink);text-decoration:none}.home-wordmark>span{display:grid;place-items:center;width:34px;height:34px;border-radius:50% 50% 45% 55%;color:#fff;background:var(--h-coffee);font-family:Georgia,serif;font-weight:700}.home-wordmark strong{font-family:Georgia,serif;font-size:1.18rem}.home-topbar nav{display:flex;gap:30px}.home-topbar nav a{color:#6d4b34;font-size:.77rem;font-weight:750;text-decoration:none}.home-account{display:flex;justify-content:flex-end;align-items:center;gap:8px}.home-icon-link{position:relative;display:grid;place-items:center;width:38px;height:38px;border:1px solid var(--h-line);border-radius:50%;color:var(--h-coffee);background:rgba(255,253,249,.7)}.home-alerts i{position:absolute;right:5px;top:4px;width:7px;height:7px;border:2px solid var(--h-paper);border-radius:50%;background:#d39a2c}.home-profile{display:flex;align-items:center;gap:8px;padding:4px 10px 4px 4px;border:1px solid var(--h-line);border-radius:999px;color:var(--h-ink);background:rgba(255,253,249,.7);text-decoration:none}.home-profile>span{display:grid;place-items:center;width:30px;height:30px;border-radius:50%;color:#fff;background:var(--h-coffee);font-weight:800}.home-profile small{max-width:100px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:750}.home-signin{padding:10px 15px;border-radius:999px;color:#fff;background:var(--h-coffee);font-size:.76rem;font-weight:800;text-decoration:none}
          .front-door{display:grid;grid-template-columns:minmax(0,1.03fr) minmax(470px,.97fr);gap:clamp(45px,7vw,110px);align-items:center;min-height:670px;padding:72px clamp(10px,4vw,60px)}.home-kicker{display:flex;align-items:center;gap:7px;margin:0 0 16px;color:var(--h-clay);font-size:.7rem;font-weight:900;letter-spacing:.12em;text-transform:uppercase}.front-door h1{margin:0;max-width:760px;font-family:Georgia,serif;font-size:clamp(3.5rem,6.2vw,6.9rem);font-weight:500;line-height:.91;letter-spacing:-.055em}.front-door__lede{max-width:670px;margin:25px 0 0;color:#6a4932;font-size:clamp(1.02rem,1.4vw,1.22rem);line-height:1.72}.front-door__actions{display:flex;flex-wrap:wrap;gap:11px;margin-top:30px}.home-button{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:48px;padding:0 19px;border:1px solid transparent;border-radius:999px;font-size:.79rem;font-weight:850;text-decoration:none}.home-button--ink{color:#fff;background:var(--h-ink)}.home-button--paper{border-color:var(--h-line);color:var(--h-coffee);background:rgba(255,253,249,.75)}.front-door__note{display:flex;gap:10px;max-width:570px;margin-top:35px;padding-top:22px;border-top:1px solid var(--h-line);color:#73523d;font-size:.77rem;line-height:1.55}.front-door__note svg{flex:0 0 auto;color:var(--h-sage)}.front-door__note strong{display:block;color:#4a2a1d}
          .front-door__canvas{position:relative;min-height:515px;overflow:hidden;border:1px solid #4a2a1d;border-radius:160px 160px 28px 28px;background:radial-gradient(circle at 35% 20%,rgba(243,201,79,.34),transparent 32%),linear-gradient(145deg,#75471f,#321c14 68%);box-shadow:0 35px 70px rgba(67,44,31,.2)}.front-door__canvas:after{content:"";position:absolute;inset:18px;border:1px solid rgba(255,255,255,.12);border-radius:145px 145px 18px 18px}.canvas-orbit{position:absolute;border:1px solid rgba(255,255,255,.13);border-radius:50%}.canvas-orbit--one{width:430px;height:430px;right:-80px;top:-80px}.canvas-orbit--two{width:280px;height:280px;left:-70px;bottom:-70px}.canvas-card{position:absolute;z-index:2;border:1px solid rgba(255,255,255,.2);color:#fff;background:rgba(255,255,255,.1);box-shadow:0 18px 35px rgba(25,14,10,.16);backdrop-filter:blur(12px)}.canvas-card--primary{left:9%;right:9%;top:25%;padding:30px;border-radius:20px}.canvas-label{color:#f3c94f;font-size:.65rem;font-weight:850;letter-spacing:.12em;text-transform:uppercase}.canvas-card--primary>strong{display:block;margin-top:8px;font-family:Georgia,serif;font-size:clamp(1.7rem,3vw,2.6rem);font-weight:500}.canvas-card--primary>p{max-width:400px;margin:11px 0 25px;color:#fff1bd;font-size:.82rem;line-height:1.6}.canvas-path{display:flex;align-items:center;gap:9px}.canvas-path span{display:flex;align-items:center;gap:5px;color:#fff8e7;font-size:.67rem;font-weight:750}.canvas-path i{flex:1;height:1px;background:rgba(255,255,255,.25)}.canvas-card--place,.canvas-card--trust{display:flex;align-items:center;gap:7px;padding:10px 13px;border-radius:999px;font-size:.68rem;font-weight:800}.canvas-card--place{left:8%;top:15%}.canvas-card--trust{right:7%;bottom:18%}.canvas-stamp{position:absolute;z-index:2;left:8%;bottom:8%;display:grid;grid-template-columns:auto 1fr;column-gap:8px;align-items:center;color:#fff4cc}.canvas-stamp svg{grid-row:1/3}.canvas-stamp strong{font-family:Georgia,serif;font-size:1.1rem}.canvas-stamp small{color:#efd58a;font-size:.62rem}
          .welcome-ribbon{display:flex;align-items:center;justify-content:center;gap:16px;padding:18px 25px;border-block:1px solid var(--h-line);color:#73523d;font-size:.72rem}.welcome-ribbon p{margin:0;color:var(--h-coffee);font-family:Georgia,serif;font-size:1rem;font-style:italic}.welcome-ribbon i{width:4px;height:4px;border-radius:50%;background:var(--h-gold)}.journey-section{padding:105px clamp(10px,4vw,60px);scroll-margin-top:30px}.section-intro{display:grid;grid-template-columns:1fr .7fr;gap:50px;align-items:end;margin-bottom:38px}.section-intro h2,.approach-story h2,.analysis-copy h2,.closing-note h2{margin:0;font-family:Georgia,serif;font-size:clamp(2.2rem,4.3vw,4.6rem);font-weight:500;line-height:1.02;letter-spacing:-.04em}.section-intro>p{max-width:520px;margin:0;color:#73523d;font-size:.92rem;line-height:1.75}.journey-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:17px}.journey-card{min-height:340px;display:flex;flex-direction:column;padding:27px;border:1px solid var(--h-line);border-radius:22px;color:var(--h-ink);background:rgba(255,253,249,.74);text-decoration:none;transition:transform .22s ease,box-shadow .22s ease}.journey-card:hover{transform:translateY(-5px);box-shadow:0 24px 45px rgba(75,51,37,.1)}.journey-card__top{display:flex;justify-content:space-between}.journey-card__top>span{display:grid;place-items:center;width:44px;height:44px;border-radius:14px;color:#fff;background:var(--h-coffee)}.journey-card:nth-child(2) .journey-card__top>span{background:var(--h-clay)}.journey-card:nth-child(3) .journey-card__top>span{background:var(--h-sage)}.journey-card__top small{color:#b47b24;font-family:Georgia,serif}.journey-card h3{max-width:280px;margin:52px 0 13px;font-family:Georgia,serif;font-size:1.58rem;font-weight:500}.journey-card p{margin:0;color:#73523d;font-size:.82rem;line-height:1.7}.journey-card>strong{display:flex;align-items:center;gap:8px;margin-top:auto;padding-top:24px;color:var(--h-coffee);font-size:.75rem}
          .approach-section{display:grid;grid-template-columns:1fr 1fr;gap:clamp(55px,9vw,130px);margin:0 clamp(10px,4vw,60px);padding:90px clamp(28px,6vw,85px);border-radius:30px;color:#fff8e7;background:linear-gradient(135deg,#27150f,#4a2a1d)}.approach-story>p:not(.home-kicker){max-width:610px;margin:24px 0;color:#f1d991;font-size:.92rem;line-height:1.78}.approach-story>a{display:inline-flex;align-items:center;gap:8px;color:#f3c94f;font-size:.77rem;font-weight:850;text-decoration:none}.approach-details{display:grid;border-top:1px solid rgba(255,255,255,.18)}.approach-details article{padding:25px 4px;border-bottom:1px solid rgba(255,255,255,.18)}.approach-details span{color:#f3c94f;font-size:.65rem;font-weight:850;letter-spacing:.1em;text-transform:uppercase}.approach-details h3{margin:7px 0;font-family:Georgia,serif;font-size:1.28rem;font-weight:500}.approach-details p{margin:0;color:#ead49a;font-size:.78rem;line-height:1.6}
          .analysis-section{display:grid;grid-template-columns:minmax(0,.82fr) minmax(520px,1.18fr);gap:clamp(55px,9vw,130px);align-items:start;padding:120px clamp(10px,4vw,60px);scroll-margin-top:20px}.analysis-copy{position:sticky;top:35px}.analysis-copy>p:not(.home-kicker){max-width:590px;margin:23px 0;color:#73523d;font-size:.92rem;line-height:1.75}.focus-list{display:grid;gap:16px;margin-top:34px}.focus-list>div{display:flex;gap:13px}.focus-list>div>span{flex:0 0 auto;display:grid;place-items:center;width:38px;height:38px;border:1px solid var(--h-line);border-radius:12px;color:var(--h-coffee);background:var(--h-paper)}.focus-list p{display:grid;gap:4px;margin:0;color:#73523d;font-size:.74rem;line-height:1.5}.focus-list strong{color:#4a2a1d;font-size:.82rem}.analysis-form-card{min-height:590px;padding:clamp(25px,4vw,48px);border:1px solid var(--h-line);border-radius:28px;background:var(--h-paper);box-shadow:0 25px 60px rgba(76,53,39,.11)}.analysis-form-card form{display:grid;gap:17px}.form-heading{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;padding-bottom:18px;border-bottom:1px solid #efd58a}.form-heading span{font-family:Georgia,serif;font-size:1.35rem}.form-heading small{color:#886438;font-size:.65rem}.form-row{display:grid;grid-template-columns:1fr 1fr;gap:14px}.analysis-form-card label{display:grid;gap:7px;color:#5f402c;font-size:.7rem;font-weight:800}.analysis-form-card :is(input,select,textarea){width:100%;border:1px solid #e8c982;border-radius:11px;outline:0;color:var(--h-ink);background:#fff4cc;padding:12px 13px;font-size:.78rem}.analysis-form-card :is(input,select,textarea):focus{border-color:var(--h-clay);box-shadow:0 0 0 3px rgba(211,154,44,.2)}.analysis-form-card textarea{resize:vertical;line-height:1.55}.form-consent{display:flex!important;align-items:flex-start;gap:9px!important;color:#73523d!important;font-weight:550!important}.form-consent input{width:16px;height:16px;margin:1px 0 0;accent-color:var(--h-coffee)}.form-submit{display:inline-flex;align-items:center;justify-content:center;gap:9px;min-height:47px;border:0;border-radius:12px;color:#fff;background:var(--h-coffee);font-size:.78rem;font-weight:850;cursor:pointer}.form-footnote{margin:-4px 0 0;color:#886438;font-size:.62rem;text-align:center}.form-success{min-height:500px;display:grid;place-items:center;align-content:center;text-align:center}.form-success>span{display:grid;place-items:center;width:66px;height:66px;margin-bottom:22px;border-radius:50%;color:#fff;background:var(--h-sage)}.form-success .home-kicker{margin-bottom:10px}.form-success h3{max-width:470px;margin:0;font-family:Georgia,serif;font-size:2.2rem;font-weight:500}.form-success>p:not(.home-kicker){max-width:440px;color:#73523d;line-height:1.65}.form-success button{margin-top:12px;padding:11px 16px;border:1px solid var(--h-line);border-radius:999px;color:var(--h-coffee);background:transparent;font-size:.73rem;font-weight:800;cursor:pointer}.closing-note{display:flex;align-items:flex-end;justify-content:space-between;gap:40px;margin:0 clamp(10px,4vw,60px);padding:60px clamp(28px,6vw,80px);border-radius:28px;background:#f3c94f}.closing-note h2{max-width:850px}.home-button--cream{flex:0 0 auto;color:#fff;background:var(--h-coffee)}
          @media(max-width:1050px){.home-topbar{grid-template-columns:1fr auto}.home-topbar nav{display:none}.front-door{grid-template-columns:1fr;min-height:0;padding-top:75px}.front-door__canvas{width:min(720px,100%);min-height:470px}.section-intro{grid-template-columns:1fr}.journey-grid{grid-template-columns:1fr 1fr}.journey-card:last-child{grid-column:1/-1}.approach-section{grid-template-columns:1fr}.analysis-section{grid-template-columns:1fr}.analysis-copy{position:static}.closing-note{align-items:flex-start;flex-direction:column}}@media(max-width:680px){.home-main{padding:0 14px 45px}.home-topbar{height:68px}.home-wordmark strong,.home-account .home-icon-link:first-child{display:none}.front-door{padding:52px 4px}.front-door h1{font-size:clamp(3rem,15vw,4.7rem)}.front-door__actions{display:grid}.front-door__actions .home-button{width:100%}.front-door__canvas{min-height:410px;border-radius:100px 100px 22px 22px}.canvas-card--primary{top:22%;padding:22px}.canvas-card--primary>strong{font-size:1.7rem}.canvas-path{display:grid}.canvas-path i{display:none}.welcome-ribbon{justify-content:flex-start;overflow-x:auto}.welcome-ribbon>*{flex:0 0 auto}.journey-section{padding:78px 4px}.journey-grid{grid-template-columns:1fr}.journey-card:last-child{grid-column:auto}.approach-section{margin-inline:0;padding:55px 25px;border-radius:22px}.analysis-section{padding:85px 4px}.form-row{grid-template-columns:1fr}.form-heading{align-items:flex-start;flex-direction:column;gap:4px}.analysis-form-card{padding:24px 18px;border-radius:20px}.closing-note{margin:0;padding:42px 24px}.closing-note .home-button{width:100%}}@media(prefers-reduced-motion:reduce){*,*::before,*::after{scroll-behavior:auto!important;transition:none!important}}
        `}</style>
      </div>
    </ResponsiveController>
  );
}
