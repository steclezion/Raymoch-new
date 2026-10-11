import React from "react";
import { ArrowRight, BriefcaseBusiness, ChevronDown } from "lucide-react";
import Header from "../../components/layout_master/Header.jsx";
import Footer from "../../components/layout_master/Footer.jsx";
import "./Careers.css";

const CAREER_STAGES = [
  {
    number: "01",
    title: "Careers begin with meaningful work",
    summary: "Every role should connect clearly to Raymoch’s customers, mission, and long-term direction.",
    text: "Raymoch builds products and services that help businesses, investors, and ecosystem partners understand opportunity with greater confidence. Career opportunities are shaped around real customer needs, clear responsibilities, and the measurable contribution a person can make to trusted growth across African markets.",
  },
  {
    number: "02",
    title: "Opportunities are communicated transparently",
    summary: "Candidates should understand the role, expectations, location, and selection process before applying.",
    text: "Our job descriptions aim to explain the purpose of the position, core responsibilities, relevant experience, working arrangements, and application requirements. Where a role has essential criteria, we distinguish them from capabilities that can be developed so candidates can make an informed decision about applying.",
  },
  {
    number: "03",
    title: "Selection focuses on capability and potential",
    summary: "A structured review process supports consistent and relevant hiring decisions.",
    text: "Applications are considered against the needs of the role rather than unrelated personal characteristics. Depending on the position, the process may include an introductory conversation, a practical exercise, and role-focused interviews. We value sound judgment, evidence of learning, collaborative behavior, and the ability to create responsible customer value.",
  },
  {
    number: "04",
    title: "Candidates receive respectful communication",
    summary: "Time, privacy, accessibility, and reasonable expectations matter throughout recruitment.",
    text: "Raymoch aims to provide clear next steps and appropriate updates as a hiring process develops. Candidate information is handled for legitimate recruitment purposes, and applicants may request reasonable adjustments to participate. We do not ask candidates to pay recruitment fees or purchase access to a Raymoch opportunity.",
  },
  {
    number: "05",
    title: "New colleagues are supported to succeed",
    summary: "A clear introduction to the team, product, customers, and standards creates a stronger start.",
    text: "Onboarding establishes priorities, ways of working, security and data responsibilities, and the context needed to make good decisions. Managers and colleagues help new team members build relationships, understand customer impact, and develop an achievable plan for their first stage of contribution.",
  },
  {
    number: "06",
    title: "Growth is treated as an ongoing practice",
    summary: "Feedback, learning, and increasing responsibility support sustainable careers.",
    text: "Raymoch encourages regular feedback, purposeful learning, and honest conversations about performance and development. As the organization evolves, we aim to create opportunities for people to deepen expertise, lead important work, and expand their impact while maintaining high standards of integrity and customer care.",
  },
];

export default function Careers() {
  return (
    <>
      <Header />

      <main className="careers-page">
        <div className="careers-page__wrap">
          <header className="careers-page__intro">
            <div className="careers-page__eyebrow">
              <BriefcaseBusiness size={18} aria-hidden="true" />
              Company · Careers
            </div>
            <h1>How Raymoch handles careers.</h1>
            <p>
              We approach careers as a transparent relationship between meaningful
              work, capable people, and responsible customer impact. Explore how
              Raymoch handles opportunities from role design through professional growth.
            </p>
          </header>

          <section className="careers-page__stages" aria-label="How careers work at Raymoch">
            {CAREER_STAGES.map((stage, index) => (
              <details className="careers-page__stage" key={stage.number} open={index === 0}>
                <summary>
                  <span className="careers-page__number">{stage.number}</span>
                  <span className="careers-page__summary">
                    <strong>{stage.title}</strong>
                    <small>{stage.summary}</small>
                  </span>
                  <span className="careers-page__chevron" aria-hidden="true">
                    <ChevronDown size={21} />
                  </span>
                </summary>
                <div className="careers-page__detail">
                  <p>{stage.text}</p>
                </div>
              </details>
            ))}
          </section>

          <aside className="careers-page__action" aria-label="Career opportunities">
            <div>
              <span>Work with purpose</span>
              <h2>Interested in helping build trusted business opportunity?</h2>
            </div>
            <a href="/contact">Contact our team <ArrowRight size={17} aria-hidden="true" /></a>
          </aside>
        </div>
      </main>

      <Footer />
    </>
  );
}
