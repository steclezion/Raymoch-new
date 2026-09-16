import React, { useEffect, useState } from "react";
import {
  BadgeCheck,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  ChevronDown,
  CircleDollarSign,
  FileSearch,
  Fingerprint,
  Globe2,
  Handshake,
  Network,
  Radar,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserRound,
  UsersRound,
  Zap,
} from "lucide-react";
import Header from "../components/layout_master/Header.jsx";
import Footer from "../components/layout_master/Footer.jsx";
import { ResponsiveController } from "../components/ResponsiveController.jsx";
import RaymochInformationSupporter from "../components/RaymochInformationSupporter.jsx";
import "../styles/Business.css";

const ACCOUNT_TIERS = [
  {
    id: "individual",
    number: "01",
    eyebrow: "For professionals and founders",
    title: "Individual Account",
    summary: "Build a trusted professional identity, discover credible opportunities, and participate in Africa's business ecosystem with greater confidence.",
    icon: UserRound,
    accent: "amber",
    benefits: [
      { icon: Fingerprint, title: "Trusted identity", text: "Create a structured profile that helps credible businesses, programs, and investors understand who you are." },
      { icon: Radar, title: "Personalized discovery", text: "Follow sectors, markets, businesses, and opportunities relevant to your professional interests." },
      { icon: Handshake, title: "Stronger connections", text: "Engage with verified organizations and reduce uncertainty before starting a conversation." },
      { icon: FileSearch, title: "Research access", text: "Use market signals, reports, and regional intelligence to make better-informed decisions." },
    ],
    features: ["Professional profile", "Saved businesses and insights", "Opportunity alerts", "Trusted ecosystem access"],
    outcome: "Turn your interests, experience, and network into a credible path toward collaboration.",
    action: "Create individual account",
    href: "/signup?account=individual",
  },
  {
    id: "business",
    number: "02",
    eyebrow: "For SMEs and growth companies",
    title: "Business Account",
    summary: "Transform operational evidence into visible trust so customers, partners, programs, and capital providers can evaluate your company clearly.",
    icon: Building2,
    accent: "teal",
    benefits: [
      { icon: BadgeCheck, title: "Verified visibility", text: "Present ownership, operations, traction, certifications, and evidence through a structured company profile." },
      { icon: Globe2, title: "Market discovery", text: "Become easier to find by sector, geography, growth stage, capability, and verified business signals." },
      { icon: UsersRound, title: "Partner readiness", text: "Share clearer information with buyers, accelerators, institutions, and ecosystem partners." },
      { icon: BarChart3, title: "Actionable intelligence", text: "Understand profile strength, market movement, and information gaps that may limit opportunity." },
    ],
    features: ["Company profile and verification", "CTI trust signals", "Programs and procurement discovery", "Business performance insights"],
    outcome: "Move from being under-seen to being understood, trusted, and ready for opportunity.",
    action: "Create business account",
    href: "/signup?account=business",
  },
  {
    id: "investment",
    number: "03",
    eyebrow: "For investors and capital partners",
    title: "Investment Account",
    summary: "Discover and assess relevant African businesses through structured preferences, verified evidence, market context, and explainable matching.",
    icon: TrendingUp,
    accent: "violet",
    benefits: [
      { icon: CircleDollarSign, title: "Qualified deal discovery", text: "Filter opportunities by ticket size, geography, sector, timing, stage, and funding instrument." },
      { icon: ShieldCheck, title: "Evidence-led review", text: "Use verification status, provenance, freshness, and trust signals to support initial assessment." },
      { icon: Network, title: "Explainable matching", text: "See why an opportunity fits your mandate without exposing private ranking logic or sensitive scores." },
      { icon: BriefcaseBusiness, title: "Portfolio intelligence", text: "Monitor signals, compare opportunities, and maintain a clearer record of saved searches and decisions." },
    ],
    features: ["Investment preference workspace", "Verified company discovery", "Saved searches and reruns", "Market and portfolio signals"],
    outcome: "Reduce discovery friction while keeping judgment, diligence, and investment decisions in your hands.",
    action: "Create investment account",
    href: "/signup?account=investment",
  },
];

export default function Business() {
  const [user, setUser] = useState(null);
  const [openTier, setOpenTier] = useState("individual");

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    async function loadUser() {
      try {
        const response = await fetch("/api/me", {
          credentials: "same-origin",
          signal: controller.signal,
          headers: { Accept: "application/json", "X-Requested-With": "XMLHttpRequest" },
        });
        const payload = await response.json().catch(() => ({}));
        if (active) setUser(response.ok && payload?.ok ? payload.user ?? null : null);
      } catch (error) {
        if (active && error?.name !== "AbortError") setUser(null);
      }
    }

    loadUser();
    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  return (
    <ResponsiveController>
      <>
      <Header user={user} />
      <RaymochInformationSupporter />

        <div className="ray-business">
          <main>
            <section className="ray-business__hero" aria-labelledby="business-title">
              <div className="ray-business__ambient" aria-label="Raymoch platform capabilities">
                <span className="ray-business__orbit ray-business__orbit--outer" aria-hidden="true" />
                <span className="ray-business__orbit ray-business__orbit--middle" aria-hidden="true" />
                <span className="ray-business__orbit ray-business__orbit--inner" aria-hidden="true" />
                <div className="ray-business__capability-orbit">
                  {[
                    ["CTI", ShieldCheck],
                    ["ATS", Fingerprint],
                    ["Verification", BadgeCheck],
                    ["Matching", Handshake],
                    ["Score system", BarChart3],
                    ["Trust system", Network],
                    ["Machine learning", Radar],
                  ].map(([label, CapabilityIcon], index) => (
                    <span
                      className="ray-business__capability-position"
                      style={{ "--capability-angle": `${index * (360 / 7)}deg` }}
                      key={label}
                    >
                      <button type="button" title={label} aria-label={label}>
                        <CapabilityIcon size={16} />
                        <strong>{label}</strong>
                      </button>
                    </span>
                  ))}
                </div>
                <span className="ray-business__sigil"><Sparkles size={32} /></span>
              </div>

              <div className="ray-business__wrap ray-business__hero-content">
                <span className="ray-business__kicker"><Zap size={15} /> One ecosystem · three paths</span>
                <h1 id="business-title">Choose the account that moves your ambition forward.</h1>
                <p>Raymoch gives individuals, operating businesses, and investors purpose-built tools while connecting all three through trusted information and market intelligence.</p>
                <a className="ray-business__hero-action" href="#account-paths" data-tooltip="Compare all Raymoch account paths">
                  Explore account paths <ChevronDown size={17} />
                </a>
              </div>
            </section>

            <section id="account-paths" className="ray-business__accounts" aria-labelledby="accounts-title">
              <div className="ray-business__wrap">
                <header className="ray-business__section-heading">
                  <span>Account architecture</span>
                  <h2 id="accounts-title">Three focused ways to use Raymoch</h2>
                  <p>Open a panel to see the benefits, included capabilities, and outcome designed for that account.</p>
                </header>

                <div className="ray-business__accordion">
                  {ACCOUNT_TIERS.map((tier) => (
                    <AccountTier
                      key={tier.id}
                      tier={tier}
                      open={openTier === tier.id}
                      onToggle={() => setOpenTier((current) => current === tier.id ? null : tier.id)}
                    />
                  ))}
                </div>
              </div>
            </section>

            <section className="ray-business__connection" aria-labelledby="connection-title">
              <div className="ray-business__wrap ray-business__connection-panel">
                <div className="ray-business__connection-mark" aria-hidden="true"><Network size={30} /></div>
                <div>
                  <span className="ray-business__kicker">Connected value</span>
                  <h2 id="connection-title">Different accounts. One trusted network.</h2>
                  <p>Individuals contribute expertise and relationships. Businesses contribute credible capability and opportunity. Investors contribute capital, guidance, and market access. Raymoch supplies the trust and intelligence layer that helps them meet.</p>
                </div>
                <a className="ray-business__connection-action" href="/about" data-tooltip="Learn how the Raymoch trust ecosystem works">How Raymoch works</a>
              </div>
            </section>
          </main>
        </div>

        <Footer />
      </>
    </ResponsiveController>
  );
}

function AccountTier({ tier, open, onToggle }) {
  const Icon = tier.icon;
  const panelId = `${tier.id}-account-panel`;

  return (
    <article className={`ray-business__tier ray-business__tier--${tier.accent}${open ? " is-open" : ""}`}>
      <button
        className="ray-business__tier-trigger"
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        data-tooltip={`${open ? "Close" : "Open"} ${tier.title} benefits`}
      >
        <span className="ray-business__tier-number">{tier.number}</span>
        <span className="ray-business__tier-icon"><Icon size={25} /></span>
        <span className="ray-business__tier-heading"><small>{tier.eyebrow}</small><strong>{tier.title}</strong><em>{tier.summary}</em></span>
        <span className="ray-business__tier-chevron"><ChevronDown size={22} /></span>
      </button>

      <div id={panelId} className="ray-business__tier-panel" hidden={!open}>
        <div className="ray-business__benefit-grid">
          {tier.benefits.map(({ icon: BenefitIcon, title, text }) => (
            <section className="ray-business__benefit" key={title}>
              <BenefitIcon size={20} />
              <h3>{title}</h3>
              <p>{text}</p>
            </section>
          ))}
        </div>

        <div className="ray-business__tier-footer">
          <div>
            <span className="ray-business__included-title">Core capabilities</span>
            <ul>{tier.features.map((feature) => <li key={feature}><BadgeCheck size={15} /> {feature}</li>)}</ul>
          </div>
          <aside><strong>Designed outcome</strong><p>{tier.outcome}</p></aside>
          <a className="ray-business__tier-action" href={tier.href} data-tooltip={tier.action}>{tier.action}</a>
        </div>
      </div>
    </article>
  );
}
