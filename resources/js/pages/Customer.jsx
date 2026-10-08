import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronRight,
  Database,
  FileCheck2,
  Fingerprint,
  Handshake,
  HeartHandshake,
  KeyRound,
  LockKeyhole,
  MessageCircleMore,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  UserRound,
  UsersRound,
  WalletCards,
} from "lucide-react";
import Header from "../components/layout_master/Header.jsx";
import Footer from "../components/layout_master/Footer.jsx";
import { ResponsiveController } from "../components/ResponsiveController.jsx";
import "../styles/customer.css";

const AUDIENCES = {
  individual: {
    label: "Individual group",
    shortLabel: "Individual",
    icon: UserRound,
    eyebrow: "Personal participation",
    intro:
      "Individuals use Raymoch to build a trusted profile, discover opportunities, communicate safely, and manage their preferences.",
    accent: "green",
    steps: [
      {
        icon: UserRound,
        title: "Create your account",
        text: "Provide essential contact information, accept the applicable terms, and create secure credentials.",
        detail: "Raymoch requests only the information needed to establish and protect your account.",
      },
      {
        icon: Fingerprint,
        title: "Confirm your identity",
        text: "Complete the verification checks required for the features and relationships you choose to access.",
        detail: "Verification evidence is restricted to authorized workflows and retained according to policy.",
      },
      {
        icon: SearchCheck,
        title: "Set your interests",
        text: "Tell Raymoch the sectors, locations, services, and opportunities that are relevant to you.",
        detail: "Preferences improve discovery without making private profile details publicly available by default.",
      },
      {
        icon: MessageCircleMore,
        title: "Connect with confidence",
        text: "Review suitable organizations, exchange messages, and decide when to share additional information.",
        detail: "You remain in control of relationship decisions and can update communication preferences.",
      },
    ],
    slides: [
      {
        title: "A profile designed around consent",
        text: "Account information, interests, and communication preferences are presented clearly so individuals can understand and manage their participation.",
        icon: BadgeCheck,
      },
      {
        title: "Relevant discovery, not indiscriminate exposure",
        text: "Raymoch uses selected preferences and permitted profile signals to improve recommendations while limiting unnecessary disclosure.",
        icon: Sparkles,
      },
      {
        title: "Control throughout the relationship",
        text: "Individuals can review profile details, adjust preferences, manage communications, and request support for account or privacy questions.",
        icon: KeyRound,
      },
    ],
    affinity: [
      ["You provide", "Identity details, interests, consent, and communication choices"],
      ["Raymoch provides", "Verification, relevant discovery, protected communication, and account controls"],
      ["Shared outcome", "Useful connections built with transparency and customer choice"],
    ],
  },
  business: {
    label: "Business group",
    shortLabel: "Business",
    icon: Building2,
    eyebrow: "Company participation",
    intro:
      "Businesses use Raymoch to establish a credible presence, represent their capabilities, discover demand, and build trusted commercial relationships.",
    accent: "gold",
    steps: [
      {
        icon: Building2,
        title: "Register the organization",
        text: "Create the business account and identify the people authorized to act for the organization.",
        detail: "Company and representative information is separated from public profile content where appropriate.",
      },
      {
        icon: FileCheck2,
        title: "Verify business evidence",
        text: "Submit relevant registration, ownership, operating, or capability evidence for review.",
        detail: "Checks are proportionate to the service, jurisdiction, and level of assurance required.",
      },
      {
        icon: BriefcaseBusiness,
        title: "Describe capabilities",
        text: "Present sectors, products, services, operating regions, certifications, and partnership goals.",
        detail: "Structured information helps Raymoch surface the business in relevant searches and matching workflows.",
      },
      {
        icon: Handshake,
        title: "Develop relationships",
        text: "Review potential customers, suppliers, partners, and investors before progressing a connection.",
        detail: "Raymoch supports discovery and communication; each business remains responsible for its decisions and agreements.",
      },
    ],
    slides: [
      {
        title: "One governed company identity",
        text: "Authorized representatives maintain company information through role-aware access instead of fragmented, uncontrolled profiles.",
        icon: ShieldCheck,
      },
      {
        title: "Evidence supports credibility",
        text: "Verification status and supporting records help eligible participants assess whether a business is ready for the intended interaction.",
        icon: FileCheck2,
      },
      {
        title: "Capabilities become discoverable",
        text: "Consistent sector, location, offering, and objective data improves search relevance and commercial matching.",
        icon: SearchCheck,
      },
    ],
    affinity: [
      ["Business provides", "Company evidence, capabilities, authorized users, and commercial objectives"],
      ["Raymoch provides", "Governed profiles, verification workflows, discovery, and relationship tools"],
      ["Shared outcome", "Credible commercial connections with clearer context and accountability"],
    ],
  },
  investor: {
    label: "Investor group",
    shortLabel: "Investor",
    icon: WalletCards,
    eyebrow: "Investment participation",
    intro:
      "Investors use Raymoch to define an investment mandate, review suitable businesses, assess available evidence, and begin structured conversations.",
    accent: "coffee",
    steps: [
      {
        icon: WalletCards,
        title: "Establish the investor profile",
        text: "Create an individual or organizational investor identity and identify authorized participants.",
        detail: "Raymoch separates authentication, private assessment data, and profile information according to purpose.",
      },
      {
        icon: BadgeCheck,
        title: "Complete eligibility checks",
        text: "Provide the verification and qualification information applicable to the selected activities.",
        detail: "Access to sensitive opportunities may depend on role, jurisdiction, consent, and verification status.",
      },
      {
        icon: Database,
        title: "Define the mandate",
        text: "Select sectors, geographies, stages, investment ranges, risk interests, and impact priorities.",
        detail: "Private mandate information is used to improve relevance and is not treated as public profile content.",
      },
      {
        icon: HeartHandshake,
        title: "Assess and engage",
        text: "Explore aligned businesses, review permitted evidence, and open a conversation when there is mutual interest.",
        detail: "Raymoch facilitates informed discovery but does not replace independent diligence or professional advice.",
      },
    ],
    slides: [
      {
        title: "Mandate-aware discovery",
        text: "Investor preferences help prioritize relevant opportunities without exposing confidential strategy to unrelated participants.",
        icon: Sparkles,
      },
      {
        title: "Permission-aware information",
        text: "Sensitive company and investor information is disclosed according to access, consent, verification, and relationship stage.",
        icon: LockKeyhole,
      },
      {
        title: "A clearer path to diligence",
        text: "Structured profiles and available evidence help investors identify questions and decide whether to proceed to deeper review.",
        icon: FileCheck2,
      },
    ],
    affinity: [
      ["Investor provides", "Identity, eligibility, mandate, preferences, and engagement choices"],
      ["Raymoch provides", "Relevant discovery, controlled information access, and communication workflows"],
      ["Shared outcome", "More focused introductions and better-informed investment conversations"],
    ],
  },
};

const INFORMATION_PRACTICES = [
  {
    icon: Database,
    title: "Purpose-led collection",
    text: "Raymoch collects customer information for defined account, verification, matching, support, security, and legal purposes.",
  },
  {
    icon: LockKeyhole,
    title: "Protected by design",
    text: "Access controls, encryption, monitoring, secure development, and operational safeguards protect information throughout its lifecycle.",
  },
  {
    icon: UsersRound,
    title: "Controlled interaction",
    text: "Visibility and sharing depend on the customer’s role, permissions, selections, verification status, and relationship context.",
  },
  {
    icon: KeyRound,
    title: "Customer control",
    text: "Customers can manage core profile data and preferences, and can contact Raymoch about access, correction, or account concerns.",
  },
];

export default function Customer() {
  const [user, setUser] = useState(null);
  const [audienceKey, setAudienceKey] = useState("individual");
  const [stepIndex, setStepIndex] = useState(0);
  const [slideIndex, setSlideIndex] = useState(0);

  const audience = AUDIENCES[audienceKey];

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    async function loadUser() {
      try {
        const response = await fetch("/api/me", {
          credentials: "same-origin",
          signal: controller.signal,
          headers: {
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
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

  const selectAudience = (key) => {
    setAudienceKey(key);
    setStepIndex(0);
    setSlideIndex(0);
  };

  const previousSlide = () => {
    setSlideIndex((current) =>
      current === 0 ? audience.slides.length - 1 : current - 1,
    );
  };

  const nextSlide = () => {
    setSlideIndex((current) => (current + 1) % audience.slides.length);
  };

  const ActiveIcon = audience.icon;
  const StepIcon = audience.steps[stepIndex].icon;
  const SlideIcon = audience.slides[slideIndex].icon;

  return (
    <ResponsiveController>
      <>
        <Header user={user} />

        <div className="customer-page">
          <main>
            <section className="customer-hero" aria-labelledby="customer-title">
              <div className="customer-wrap customer-hero-grid">
                <div>
                  <span className="customer-kicker">
                    <HeartHandshake size={16} /> Raymoch Customers
                  </span>
                  <h1 id="customer-title">Trusted interactions begin with respectful information handling.</h1>
                  <p>
                    Raymoch brings individuals, businesses, and investors into one governed network while keeping each group’s information, permissions, and goals distinct.
                  </p>
                  <div className="customer-actions">
                    <a className="customer-button customer-button-primary" href="#customer-groups">
                      Explore customer journeys
                    </a>
                    <a className="customer-button customer-button-secondary" href="/privacy">
                      Read our privacy approach
                    </a>
                  </div>
                </div>

                <aside className="customer-hero-card" aria-label="Customer commitments">
                  <div><ShieldCheck size={19} /><span><strong>Purpose and transparency</strong>Know why information is requested.</span></div>
                  <div><LockKeyhole size={19} /><span><strong>Appropriate protection</strong>Safeguards follow sensitivity and use.</span></div>
                  <div><Handshake size={19} /><span><strong>Meaningful control</strong>Choose how relationships progress.</span></div>
                </aside>
              </div>
            </section>

            <section className="customer-summary" aria-label="Information handling principles">
              <div className="customer-wrap customer-summary-grid">
                <article><Database size={22} /><strong>Collect deliberately</strong><span>Use information for clear platform and legal purposes.</span></article>
                <article><Fingerprint size={22} /><strong>Verify responsibly</strong><span>Apply checks appropriate to the requested interaction.</span></article>
                <article><KeyRound size={22} /><strong>Share with control</strong><span>Respect roles, permissions, consent, and relationship stage.</span></article>
              </div>
            </section>

            <section id="information" className="customer-section">
              <div className="customer-wrap">
                <SectionHeading
                  eyebrow="Customer information"
                  title="How Raymoch handles customer information"
                  text="Information is managed as a lifecycle: collected for a reason, protected according to risk, used within authorized workflows, retained only as required, and deleted or anonymized through controlled processes."
                />
                <div className="customer-practice-grid">
                  {INFORMATION_PRACTICES.map(({ icon: Icon, title, text }) => (
                    <article key={title}>
                      <span><Icon size={21} /></span>
                      <h2>{title}</h2>
                      <p>{text}</p>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            <section id="customer-groups" className="customer-section customer-section-alt">
              <div className="customer-wrap">
                <SectionHeading
                  eyebrow="Choose a perspective"
                  title="Three groups. Purpose-built interactions."
                  text="Select a customer group to explore its complete journey, experience highlights, and affinity with Raymoch."
                />

                <div className="customer-group-tabs" role="tablist" aria-label="Customer groups">
                  {Object.entries(AUDIENCES).map(([key, item]) => {
                    const Icon = item.icon;
                    const selected = key === audienceKey;
                    return (
                      <button
                        key={key}
                        id={`customer-tab-${key}`}
                        className={`customer-group-tab${selected ? " is-active" : ""}`}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        aria-controls="customer-group-panel"
                        onClick={() => selectAudience(key)}
                      >
                        <span><Icon size={22} /></span>
                        <strong>{item.label}</strong>
                        <small>{item.intro}</small>
                        <ChevronRight size={18} aria-hidden="true" />
                      </button>
                    );
                  })}
                </div>

                <div
                  id="customer-group-panel"
                  className={`customer-experience is-${audience.accent}`}
                  role="tabpanel"
                  aria-labelledby={`customer-tab-${audienceKey}`}
                >
                  <header className="customer-experience-header">
                    <span className="customer-experience-icon"><ActiveIcon size={25} /></span>
                    <div>
                      <span className="customer-eyebrow">{audience.eyebrow}</span>
                      <h2>{audience.label}</h2>
                      <p>{audience.intro}</p>
                    </div>
                  </header>

                  <div id="journey" className="customer-journey-layout">
                    <section className="customer-wizard" aria-labelledby="customer-wizard-title">
                      <div className="customer-feature-heading">
                        <span>Guided journey</span>
                        <h3 id="customer-wizard-title">How the {audience.shortLabel.toLowerCase()} experience works</h3>
                      </div>

                      <ol className="customer-stepper">
                        {audience.steps.map((step, index) => (
                          <li key={step.title} className={index === stepIndex ? "is-active" : index < stepIndex ? "is-complete" : ""}>
                            <button type="button" onClick={() => setStepIndex(index)} aria-current={index === stepIndex ? "step" : undefined}>
                              <span>{index < stepIndex ? <Check size={15} /> : index + 1}</span>
                              <strong>{step.title}</strong>
                            </button>
                          </li>
                        ))}
                      </ol>

                      <article className="customer-step-card" aria-live="polite">
                        <span className="customer-step-icon"><StepIcon size={25} /></span>
                        <div>
                          <span>Step {stepIndex + 1} of {audience.steps.length}</span>
                          <h4>{audience.steps[stepIndex].title}</h4>
                          <p>{audience.steps[stepIndex].text}</p>
                          <aside>{audience.steps[stepIndex].detail}</aside>
                        </div>
                      </article>

                      <div className="customer-wizard-actions">
                        <button type="button" onClick={() => setStepIndex((current) => Math.max(0, current - 1))} disabled={stepIndex === 0}>
                          <ArrowLeft size={17} /> Previous
                        </button>
                        <button type="button" onClick={() => setStepIndex((current) => Math.min(audience.steps.length - 1, current + 1))} disabled={stepIndex === audience.steps.length - 1}>
                          Next step <ArrowRight size={17} />
                        </button>
                      </div>
                    </section>

                    <section className="customer-carousel" aria-labelledby="customer-carousel-title">
                      <div className="customer-feature-heading">
                        <span>Experience carousel</span>
                        <h3 id="customer-carousel-title">What the relationship feels like</h3>
                      </div>

                      <article className="customer-slide" aria-live="polite">
                        <span className="customer-slide-icon"><SlideIcon size={27} /></span>
                        <span>{String(slideIndex + 1).padStart(2, "0")} / {String(audience.slides.length).padStart(2, "0")}</span>
                        <h4>{audience.slides[slideIndex].title}</h4>
                        <p>{audience.slides[slideIndex].text}</p>
                      </article>

                      <div className="customer-carousel-controls">
                        <button type="button" onClick={previousSlide} aria-label="Previous experience"><ArrowLeft size={18} /></button>
                        <div aria-label={`Slide ${slideIndex + 1} of ${audience.slides.length}`}>
                          {audience.slides.map((slide, index) => (
                            <button key={slide.title} type="button" className={index === slideIndex ? "is-active" : ""} onClick={() => setSlideIndex(index)} aria-label={`Show slide ${index + 1}`} aria-current={index === slideIndex ? "true" : undefined} />
                          ))}
                        </div>
                        <button type="button" onClick={nextSlide} aria-label="Next experience"><ArrowRight size={18} /></button>
                      </div>
                    </section>
                  </div>

                  <section className="customer-affinity" aria-labelledby="customer-affinity-title">
                    <div className="customer-feature-heading">
                      <span>Affinity</span>
                      <h3 id="customer-affinity-title">How {audience.shortLabel.toLowerCase()} customers and Raymoch create value together</h3>
                    </div>
                    <div className="customer-affinity-flow">
                      {audience.affinity.map(([title, text], index) => (
                        <React.Fragment key={title}>
                          <article>
                            <span>{index + 1}</span>
                            <strong>{title}</strong>
                            <p>{text}</p>
                          </article>
                          {index < audience.affinity.length - 1 ? <ChevronRight className="customer-affinity-arrow" size={22} aria-hidden="true" /> : null}
                        </React.Fragment>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </section>

            <section className="customer-section">
              <div className="customer-wrap customer-trust-card">
                <span><ShieldCheck size={27} /></span>
                <div>
                  <span className="customer-eyebrow">Shared responsibility</span>
                  <h2>Clear information supports better decisions.</h2>
                  <p>Customers should keep account details accurate, protect credentials, review information before sharing, and report suspicious activity. Raymoch provides the controls, safeguards, and support pathways that make responsible participation possible.</p>
                </div>
                <a className="customer-button customer-button-primary" href="/security">
                  Review security <ChevronRight size={17} />
                </a>
              </div>
            </section>
          </main>
        </div>

        <Footer />
      </>
    </ResponsiveController>
  );
}

function SectionHeading({ eyebrow, title, text }) {
  return (
    <header className="customer-heading">
      <span className="customer-eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      <p>{text}</p>
    </header>
  );
}
