import React from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Header from "../../components/layout_master/Header.jsx";
import Footer from "../../components/layout_master/Footer.jsx";
import "../../styles/footer-pages.css";

const PAGES = {
  "for-businesses": {
    group: "Product",
    title: "Raymoch for businesses",
    intro: "Build a clearer business presence, strengthen credibility, and become easier for customers, partners, programs, and investors to understand.",
    sections: [
      ["Increase visibility", "Present structured company information across the markets and sectors relevant to your business."],
      ["Build confidence", "Add verification context and supporting evidence to reduce uncertainty for potential partners."],
      ["Find opportunity", "Access discovery, matching, and market intelligence designed around business growth."],
    ],
  },
  "for-investors": {
    group: "Product",
    title: "Raymoch for investors",
    intro: "Discover relevant African businesses using structured preferences, clearer trust signals, and market context.",
    sections: [
      ["Focused discovery", "Filter businesses by geography, sector, stage, capability, and investment preferences."],
      ["Evidence-led review", "Use verification context and trust information to support early-stage assessment."],
      ["Explainable matching", "Understand why a company may fit your mandate while retaining control over every decision."],
    ],
  },
  "business-readiness-guides": {
    group: "Resources",
    title: "Business readiness guides",
    intro: "Practical guidance to help businesses present stronger information and prepare for customers, programs, partnerships, and capital conversations.",
    sections: [
      ["Profile readiness", "Prepare accurate ownership, operational, market, and contact information."],
      ["Evidence readiness", "Organize registration documents, certifications, traction records, and other supporting evidence."],
      ["Opportunity readiness", "Clarify what your business offers, what it needs, and what a strong partnership looks like."],
    ],
  },
  "verification-guide": {
    group: "Resources",
    title: "Verification guide",
    intro: "Understand what verification means on Raymoch, what information may be requested, and how reviewed evidence is represented.",
    sections: [
      ["Prepare", "Gather current company information and legible supporting documents before beginning."],
      ["Submit", "Provide the requested information through the appropriate verification workflow."],
      ["Review", "Raymoch evaluates the supplied information and communicates status, gaps, or next steps."],
    ],
  },
  "investor-resources": {
    group: "Resources",
    title: "Investor resources",
    intro: "Learn how to use company profiles, trust signals, matching results, and market context as inputs to your own investment process.",
    sections: [
      ["Reading profiles", "Interpret structured business information consistently across potential opportunities."],
      ["Using trust signals", "Understand verification status, evidence provenance, and information freshness."],
      ["Maintaining diligence", "Use Raymoch as a discovery and assessment aid while conducting independent legal, financial, and commercial review."],
    ],
  },
  faqs: {
    group: "Resources",
    title: "Frequently asked questions",
    intro: "Quick answers about Raymoch accounts, business information, verification, matching, pricing, and platform access.",
    sections: [
      ["Who can use Raymoch?", "Individuals, operating businesses, investors, and ecosystem partners can use account paths designed for their goals."],
      ["Does verification guarantee a business?", "No. Verification provides context about reviewed information and does not replace due diligence."],
      ["Can I start without a paid plan?", "Yes. Basic access supports initial exploration, while paid plans provide additional capabilities."],
    ],
  },
  "data-protection": {
    group: "Legal",
    title: "Data protection",
    intro: "Raymoch is committed to handling personal and business information responsibly and transparently.",
    sections: [
      ["Purpose limitation", "Information should be collected and used for clear, legitimate platform and service purposes."],
      ["Access and control", "Applicable users may request access, correction, or other available actions concerning their information."],
      ["Security", "Administrative and technical safeguards are used to reduce unauthorized access, loss, and misuse."],
    ],
  },
  accessibility: {
    group: "Legal",
    title: "Accessibility",
    intro: "We aim to make Raymoch understandable and usable across devices, input methods, and access needs.",
    sections: [
      ["Inclusive interaction", "Core experiences are designed to support keyboard navigation, readable focus states, and semantic structure."],
      ["Responsive access", "Layouts adapt across mobile, tablet, and desktop environments."],
      ["Feedback", "Users can contact Raymoch to report an accessibility barrier or request assistance."],
    ],
  },
};

export default function FooterPage({ pageKey = window.FOOTER_PAGE }) {
  const page = PAGES[pageKey] || PAGES.faqs;

  return (
    <>
      <Header />
      <main className="footer-page">
        <div className="footer-page__wrap">
          <nav className="footer-page__breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a><span>/</span><span>{page.group}</span>
          </nav>
          <header className="footer-page__header">
            <p>{page.group}</p>
            <h1>{page.title}</h1>
            <div>{page.intro}</div>
          </header>
          <section className="footer-page__sections" aria-label={`${page.title} information`}>
            {page.sections.map(([title, text], index) => (
              <article key={title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <CheckCircle2 size={21} aria-hidden="true" />
                <h2>{title}</h2>
                <p>{text}</p>
              </article>
            ))}
          </section>
          <aside className="footer-page__action">
            <div><small>Continue exploring</small><h2>Find the right Raymoch path for you.</h2></div>
            <a href="/pricing">View pricing <ArrowRight size={17} /></a>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
