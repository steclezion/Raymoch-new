import React from "react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  CreditCard,
  RefreshCw,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import AuthAwareNavigation from "../components/AuthAwareNavigation.jsx";
import Footer from "../components/layout_master/Footer.jsx";
import RaymochInformationSupporter from "../components/RaymochInformationSupporter.jsx";
import BreadcrumbsNav from "../components/common/BreadcrumbsNav.jsx";
import "../styles/pricing.css";

const PLANS = [
  {
    key: "basic",
    name: "Basic",
    eyebrow: "Start exploring",
    price: "$0",
    cadence: "Free",
    description:
      "A simple way to browse the platform and understand how Raymoch organizes business information.",
    icon: UserRound,
    features: [
      "Basic company search",
      "Limited company result visibility",
      "General business browsing",
      "No payment required",
    ],
    action: "Explore for free",
  },
  {
    key: "business",
    name: "Business",
    eyebrow: "For growing companies",
    price: "$19.99",
    cadence: "per month",
    description:
      "For companies that need greater visibility, trust information, and access to relevant opportunities.",
    icon: BriefcaseBusiness,
    features: [
      "Full company search access",
      "Complete result visibility",
      "Trust summaries and verification insights",
      "Investor matching access",
      "Business-focused platform tools",
    ],
    action: "Choose Business",
    recommended: true,
  },
  {
    key: "investor",
    name: "Investor",
    eyebrow: "For deal discovery",
    price: "$26.99",
    cadence: "per month",
    description:
      "For investors and partners evaluating businesses with deeper trust signals and priority matching.",
    icon: ShieldCheck,
    features: [
      "Full company search access",
      "Advanced trust summaries",
      "Advanced verification insights",
      "Priority investor matching",
      "Investor-focused discovery tools",
    ],
    action: "Choose Investor",
  },
];

const COMPARISON_ROWS = [
  ["Company search", "Basic", "Full", "Full"],
  ["Result visibility", "Limited", "Included", "Included"],
  ["Trust summaries", "—", "Included", "Advanced"],
  ["Verification insights", "—", "Included", "Advanced"],
  ["Investor matching", "—", "Included", "Priority"],
];

const STEPS = [
  {
    number: "01",
    icon: UserRound,
    title: "Choose your account type",
    text: "Select the plan that matches how you intend to use Raymoch: browsing, business growth, or investment discovery.",
  },
  {
    number: "02",
    icon: CreditCard,
    title: "Review and confirm",
    text: "Paid plans continue to a clear order review where you can confirm the selected plan before payment.",
  },
  {
    number: "03",
    icon: RefreshCw,
    title: "Access your plan",
    text: "Once confirmed, your account receives the access level and platform capabilities included with that plan.",
  },
];

export default function Pricing({ routes = {} }) {
  const paymentPath = routes.priceHowToPay || "/price-how-to-pay";
  const explorePath = routes.explore || "/explore";

  const planHref = (plan) =>
    plan.key === "basic"
      ? explorePath
      : `${paymentPath}?plan=${plan.key}`;

  return (
    <>
      <AuthAwareNavigation routes={routes} activePath="/pricing" />

      <main className="pricing-page">
        <div className="pricing-container">
          {/* <BreadcrumbsNav /> */}

          <section className="pricing-intro" aria-labelledby="pricing-title">
            <p className="pricing-kicker">Plans and pricing</p>
            <h1 id="pricing-title">Straightforward access for every stage</h1>
            <p className="pricing-intro-copy">
              Start with free discovery, then choose a plan based on the level
              of business intelligence, verification detail, and matching
              support you need.
            </p>
          </section>

          <section className="pricing-process" aria-labelledby="pricing-process-title">
            <div className="pricing-section-heading">
              <p className="pricing-section-label">How pricing works</p>
              <h2 id="pricing-process-title">Three clear steps</h2>
            </div>

            <div className="pricing-process-grid">
              {STEPS.map(({ number, icon: Icon, title, text }) => (
                <article className="pricing-step" key={number}>
                  <div className="pricing-step-topline">
                    <span className="pricing-step-icon" aria-hidden="true">
                      <Icon size={20} strokeWidth={1.8} />
                    </span>
                    <span className="pricing-step-number">{number}</span>
                  </div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="pricing-plans" aria-labelledby="pricing-plans-title">
            <div className="pricing-section-heading pricing-section-heading--centered">
              <p className="pricing-section-label">Choose a plan</p>
              <h2 id="pricing-plans-title">Select the access that fits your goals</h2>
              <p>Prices are shown in USD. Paid plans are billed monthly.</p>
            </div>

            <div className="pricing-plan-grid">
              {PLANS.map((plan) => {
                const Icon = plan.icon;

                return (
                  <article
                    className={`pricing-card${plan.recommended ? " pricing-card--recommended" : ""}`}
                    key={plan.key}
                  >
                    {plan.recommended && (
                      <span className="pricing-card-badge">Recommended</span>
                    )}

                    <div className="pricing-card-heading">
                      <span className="pricing-card-icon" aria-hidden="true">
                        <Icon size={22} strokeWidth={1.8} />
                      </span>
                      <div>
                        <p>{plan.eyebrow}</p>
                        <h3>{plan.name}</h3>
                      </div>
                    </div>

                    <div className="pricing-price">
                      <strong>{plan.price}</strong>
                      <span>{plan.cadence}</span>
                    </div>

                    <p className="pricing-card-description">{plan.description}</p>

                    <ul className="pricing-feature-list">
                      {plan.features.map((feature) => (
                        <li key={feature}>
                          <Check size={17} strokeWidth={2.4} aria-hidden="true" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <a
                      className={`pricing-card-action${plan.recommended ? " pricing-card-action--primary" : ""}`}
                      href={planHref(plan)}
                    >
                      {plan.action}
                      <ArrowRight size={17} aria-hidden="true" />
                    </a>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="pricing-comparison" aria-labelledby="pricing-comparison-title">
            <div className="pricing-section-heading">
              <p className="pricing-section-label">Compare access</p>
              <h2 id="pricing-comparison-title">What each plan includes</h2>
            </div>

            <div className="pricing-table-wrap">
              <table className="pricing-table">
                <thead>
                  <tr>
                    <th scope="col">Capability</th>
                    <th scope="col">Basic</th>
                    <th scope="col">Business</th>
                    <th scope="col">Investor</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_ROWS.map(([label, ...values]) => (
                    <tr key={label}>
                      <th scope="row">{label}</th>
                      {values.map((value, index) => (
                        <td key={`${label}-${index}`}>{value}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="pricing-notes" aria-labelledby="pricing-notes-title">
            <div>
              <p className="pricing-section-label">Before you continue</p>
              <h2 id="pricing-notes-title">Clear billing, no surprises</h2>
            </div>
            <ul>
              <li>Basic access does not require payment.</li>
              <li>Paid plan pricing is displayed in USD per month.</li>
              <li>You can review your selected plan before completing payment.</li>
              <li>Available features depend on the account plan selected.</li>
            </ul>
          </section>

          <section className="pricing-help" aria-labelledby="pricing-help-title">
            <div>
              <p className="pricing-section-label">Need guidance?</p>
              <h2 id="pricing-help-title">Choose based on what you need to accomplish</h2>
              <p>
                Business is designed for company growth and visibility.
                Investor is designed for deeper evaluation and deal discovery.
              </p>
            </div>
            <a href={routes.contact || "/Contact"}>
              Contact us
              <ArrowRight size={17} aria-hidden="true" />
            </a>
          </section>
        </div>
      </main>

      <RaymochInformationSupporter />
      <Footer routes={routes} />
    </>
  );
}
