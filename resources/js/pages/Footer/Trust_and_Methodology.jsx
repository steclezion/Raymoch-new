import React from "react";
import { ArrowRight, ChevronDown, ShieldCheck } from "lucide-react";
import Header from "../../components/layout_master/Header.jsx";
import Footer from "../../components/layout_master/Footer.jsx";
import "./Trust_and_Methodology.css";

const PRINCIPLES = [
  {
    number: "01",
    title: "Information starts with clear provenance",
    summary: "Customers should be able to understand where business information came from.",
    text: "Raymoch organizes information supplied by businesses, authorized representatives, and appropriate supporting sources. Profiles distinguish submitted information from reviewed evidence so customers can understand its origin, context, and intended use before relying on it.",
  },
  {
    number: "02",
    title: "Evidence is reviewed consistently",
    summary: "A structured methodology helps comparable information receive comparable treatment.",
    text: "Where verification is offered, Raymoch evaluates relevant documentation and profile information against defined review criteria. The process may consider business identity, registration details, ownership context, operating information, certifications, and information freshness, depending on the service and evidence available.",
  },
  {
    number: "03",
    title: "Trust signals are explained, not implied",
    summary: "Statuses and indicators are presented with limits customers can understand.",
    text: "Trust indicators communicate what has been supplied or reviewed at a particular point in time. They are not guarantees of future performance, endorsements, credit ratings, or investment recommendations. Raymoch presents these signals as decision-support information and encourages customers to apply independent judgment.",
  },
  {
    number: "04",
    title: "Customers remain in control of decisions",
    summary: "Platform insights support due diligence rather than replacing it.",
    text: "Customers can use structured profiles, verification context, matching explanations, and market information to focus their evaluation. Before entering a commercial, partnership, or investment relationship, each customer remains responsible for the legal, financial, technical, and operational checks appropriate to their decision.",
  },
  {
    number: "05",
    title: "Information is maintained responsibly",
    summary: "Trust depends on security, correction pathways, and visible information freshness.",
    text: "Raymoch applies administrative and technical safeguards appropriate to the information it handles. Businesses may be asked to refresh important details, and customers can report information that appears inaccurate or outdated. Review dates and status changes help make the age and condition of information easier to assess.",
  },
  {
    number: "06",
    title: "The methodology improves over time",
    summary: "Customer feedback and changing market needs inform responsible refinement.",
    text: "Raymoch reviews its criteria, workflows, and customer guidance as regulations, evidence standards, and ecosystem needs evolve. Material changes are introduced carefully so that trust signals remain understandable, proportionate, and useful across different sectors and African markets.",
  },
];

export default function TrustAndMethodology() {
  return (
    <>
      <Header />

      <main className="trust-methodology">
        <div className="trust-methodology__wrap">
          <header className="trust-methodology__intro">
            <div className="trust-methodology__eyebrow">
              <ShieldCheck size={18} aria-hidden="true" />
              Company · Trust framework
            </div>
            <h1>How Raymoch handles trust and methodology with customers.</h1>
            <p>
              Our approach helps customers understand business information with
              greater clarity while preserving the need for independent judgment.
              The principles below explain how information is sourced, reviewed,
              communicated, maintained, and improved.
            </p>
          </header>

          <section className="trust-methodology__principles" aria-label="Raymoch trust and methodology principles">
            {PRINCIPLES.map((principle, index) => (
              <details className="trust-methodology__principle" key={principle.number} open={index === 0}>
                <summary>
                  <span className="trust-methodology__number">{principle.number}</span>
                  <span className="trust-methodology__summary">
                    <strong>{principle.title}</strong>
                    <small>{principle.summary}</small>
                  </span>
                  <span className="trust-methodology__chevron" aria-hidden="true">
                    <ChevronDown size={21} />
                  </span>
                </summary>
                <div className="trust-methodology__detail">
                  <p>{principle.text}</p>
                </div>
              </details>
            ))}
          </section>

          <aside className="trust-methodology__notice" aria-label="Important trust notice">
            <div>
              <span>Responsible decision-making</span>
              <h2>Trust signals provide context—not a substitute for due diligence.</h2>
            </div>
            <a href="/verification">Explore verification <ArrowRight size={17} aria-hidden="true" /></a>
          </aside>
        </div>
      </main>

      <Footer />
    </>
  );
}
