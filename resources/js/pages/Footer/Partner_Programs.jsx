import React from "react";
import { ArrowRight, ChevronDown, Handshake } from "lucide-react";
import AuthAwareNavigation from "../../components/AuthAwareNavigation.jsx";
import Footer from "../../components/layout_master/Footer.jsx";
import RaymochInformationSupporter from "../../components/RaymochInformationSupporter.jsx";
import "./Partner_Programs.css";

const PROGRAM_STAGES = [
  {
    number: "01",
    title: "Partnerships begin with shared purpose",
    summary: "Raymoch first establishes the customer need, intended outcome, and value each organization can contribute.",
    text: "We work with ecosystem organizations whose goals align with responsible business discovery, verification, investment readiness, market access, and inclusive growth. Early conversations define the customers to be served, the problem to be addressed, and the measurable outcome the partnership should create.",
  },
  {
    number: "02",
    title: "The program is designed around the customer journey",
    summary: "Responsibilities, services, and customer touchpoints are documented before delivery begins.",
    text: "Raymoch and its partners map how customers enter the program, what information they receive, which organization delivers each service, and where support or escalation is available. This structure reduces confusion and helps customers understand what to expect throughout their participation.",
  },
  {
    number: "03",
    title: "Eligibility and selection remain transparent",
    summary: "Customers receive clear criteria instead of unexplained or informal selection decisions.",
    text: "Where a program has eligibility requirements, Raymoch communicates the relevant geography, sector, business stage, documentation, timing, and capacity criteria. Selection may depend on the objectives and available places of a specific partner program, and participation does not guarantee funding, contracts, or commercial success.",
  },
  {
    number: "04",
    title: "Customer information is handled responsibly",
    summary: "Data sharing is limited to legitimate program purposes and appropriate permissions.",
    text: "Raymoch aims to explain what information is required, why it is needed, and which participating organization may use it. Access and sharing are limited according to the program design, applicable permissions, and relevant data-protection obligations. Customers should not have to guess how their information supports the service they receive.",
  },
  {
    number: "05",
    title: "Delivery is coordinated and accountable",
    summary: "Defined ownership and communication channels keep the partnership useful for customers.",
    text: "Partners agree on operational roles, service standards, timelines, and points of contact. Raymoch monitors the areas it is responsible for, communicates material changes, and provides pathways for questions or concerns. Each independent partner remains accountable for the services and commitments it delivers directly.",
  },
  {
    number: "06",
    title: "Outcomes inform continuous improvement",
    summary: "Evidence and customer feedback help refine future programs.",
    text: "Raymoch reviews participation, engagement, service quality, customer feedback, and agreed outcome measures with its partners. These insights help identify gaps, improve program design, and determine whether a partnership should be expanded, adjusted, or concluded responsibly.",
  },
];

export default function PartnerPrograms() {
  return (
    <>
      <AuthAwareNavigation activePath="/Partner_Programs" />

      <main className="partner-programs-page">
        <div className="partner-programs-page__wrap">
          <header className="partner-programs-page__intro">
            <div className="partner-programs-page__eyebrow">
              <Handshake size={19} aria-hidden="true" />
              Company · Partner programs
            </div>
            <h1>How Raymoch handles partner programs with customers.</h1>
            <p>
              Raymoch develops partner programs around clear customer outcomes,
              transparent participation, responsible information use, and shared
              accountability. Explore how a program moves from purpose to measurable improvement.
            </p>
          </header>

          <section className="partner-programs-page__stages" aria-label="Raymoch partner program principles">
            {PROGRAM_STAGES.map((stage, index) => (
              <details className="partner-programs-page__stage" key={stage.number} open={index === 0}>
                <summary>
                  <span className="partner-programs-page__number">{stage.number}</span>
                  <span className="partner-programs-page__summary">
                    <strong>{stage.title}</strong>
                    <small>{stage.summary}</small>
                  </span>
                  <span className="partner-programs-page__chevron" aria-hidden="true">
                    <ChevronDown size={21} />
                  </span>
                </summary>
                <div className="partner-programs-page__detail">
                  <p>{stage.text}</p>
                </div>
              </details>
            ))}
          </section>

          <aside className="partner-programs-page__action" aria-label="Partner with Raymoch">
            <div>
              <span>Build meaningful collaboration</span>
              <h2>Explore a partner program shaped around clear customer value.</h2>
            </div>
            <a href="/contact">Discuss a partnership <ArrowRight size={17} aria-hidden="true" /></a>
          </aside>
        </div>
      </main>

      <RaymochInformationSupporter />
      <Footer />
    </>
  );
}
