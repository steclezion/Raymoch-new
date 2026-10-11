import React from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import Header from "../../components/layout_master/Header.jsx";
import Footer from "../../components/layout_master/Footer.jsx";
import "./How_Raymoch_Works.css";

const EXPLANATIONS = [
  {
    number: "01",
    title: "Businesses create a structured presence",
    summary: "Raymoch begins by organizing the information that helps other people understand a business.",
    text: "A business can present its identity, ownership context, operating markets, capabilities, products, traction, certifications, and supporting information in a consistent format. This replaces fragmented introductions and disconnected documents with a clearer business profile that customers, partners, programs, and investors can review more efficiently.",
  },
  {
    number: "02",
    title: "Information receives trust context",
    summary: "Verification signals explain what information has been supplied, reviewed, and supported by evidence.",
    text: "Raymoch adds context around information provenance, verification status, document review, and freshness. These signals are intended to reduce uncertainty and help users identify areas that may require further investigation. They support informed evaluation, but they do not guarantee performance, endorse a company, or replace independent legal, financial, and commercial due diligence.",
  },
  {
    number: "03",
    title: "Discovery becomes more relevant",
    summary: "Structured information makes it easier to find businesses based on real needs and interests.",
    text: "Customers, investors, and ecosystem partners can explore companies using criteria such as geography, sector, capability, business stage, market focus, and opportunity type. Instead of relying only on broad directories or personal introductions, users can narrow discovery toward organizations that appear relevant to their objectives.",
  },
  {
    number: "04",
    title: "Matching connects compatible goals",
    summary: "Raymoch uses declared preferences and available business information to surface potential alignment.",
    text: "Businesses may be connected with investors, buyers, programs, service providers, or strategic partners whose stated interests correspond with their profile. Matching results are presented as decision support rather than automatic recommendations. Each participant remains responsible for reviewing the information, starting a conversation, and deciding whether an opportunity is appropriate.",
  },
  {
    number: "05",
    title: "Market intelligence supports better decisions",
    summary: "Business information becomes more useful when it is understood within a wider market context.",
    text: "Raymoch combines company-level information with sector, regional, and ecosystem insights to help users recognize patterns, information gaps, and emerging opportunities. Businesses can understand how to improve their visibility and readiness, while investors and partners can approach discovery with clearer context and a more consistent evaluation process.",
  },
];

export default function HowRaymochWorks() {
  return (
    <>
      <Header />

      <main className="how-raymoch">
        <div className="how-raymoch__wrap">
          {/* <nav className="how-raymoch__breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a><span>/</span><span>Company</span><span>/</span><span>How Raymoch Works</span>
          </nav> */}

          <header className="how-raymoch__intro">
            <p className="how-raymoch__eyebrow">Company · Platform overview</p>
            <h1>How Raymoch turns business information into trusted opportunity.</h1>
            <p>
              Raymoch provides a connected process for business visibility,
              verification, discovery, matching, and market intelligence.
              Explore each stage below to understand how the platform works.
            </p>
          </header>

          <section className="how-raymoch__disclosures" aria-label="How Raymoch works in five stages">
            {EXPLANATIONS.map((item, index) => (
              <details className="how-raymoch__disclosure" key={item.number} open={index === 0}>
                <summary>
                  <span className="how-raymoch__number">{item.number}</span>
                  <span className="how-raymoch__summary-copy">
                    <strong>{item.title}</strong>
                    <small>{item.summary}</small>
                  </span>
                  <span className="how-raymoch__chevron" aria-hidden="true"><ChevronDown size={21} /></span>
                </summary>
                <div className="how-raymoch__detail">
                  <p>{item.text}</p>
                </div>
              </details>
            ))}
          </section>

          <aside className="how-raymoch__next">
            <div>
              <span>Put the process into practice</span>
              <h2>Find the account path that matches your goals.</h2>
            </div>
            <a href="/pricing">Explore plans <ArrowRight size={17} /></a>
          </aside>
        </div>
      </main>

      <Footer />
    </>
  );
}
