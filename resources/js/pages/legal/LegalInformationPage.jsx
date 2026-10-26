import React from "react";
import { ArrowRight, CalendarDays, CheckCircle2, FileText } from "lucide-react";
import AuthAwareNavigation from "../../components/AuthAwareNavigation.jsx";
import Footer from "../../components/layout_master/Footer.jsx";
import "../../styles/legal-information.css";

const DOCUMENTS = [
  ["Privacy", "/privacy", "privacy"],
  ["Terms", "/terms", "terms"],
  ["Cookies", "/cookies", "cookies"],
  ["Data protection", "/data-protection", "data-protection"],
  ["Accessibility", "/accessibility", "accessibility"],
];

export default function LegalInformationPage({ document }) {
  return (
    <>
      <AuthAwareNavigation activePath={`/${document.key}`} />
      <main className="legal-info">
        <section className="legal-info__hero">
          <div className="legal-info__shell">
            <nav className="legal-info__breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><span>Information centre</span></nav>
            <div className="legal-info__hero-grid">
              <div>
                <span className="legal-info__eyebrow">Raymoch information centre</span>
                <h1>{document.title}</h1>
                <p>{document.summary}</p>
              </div>
              <dl className="legal-info__meta">
                <div><dt><CalendarDays size={17} /> Effective period</dt><dd>{document.effective}</dd></div>
                <div><dt><FileText size={17} /> Document status</dt><dd>{document.status || "Published policy"}</dd></div>
              </dl>
            </div>
          </div>
        </section>

        <div className="legal-info__shell legal-info__layout">
          <aside className="legal-info__sidebar">
            <strong>Information centre</strong>
            <nav aria-label="Legal and accessibility information">
              {DOCUMENTS.map(([label, href, key]) => <a key={key} href={href} className={document.key === key ? "is-active" : ""} aria-current={document.key === key ? "page" : undefined}>{label}</a>)}
            </nav>
          </aside>

          <article className="legal-info__article">
            <div className="legal-info__notice"><CheckCircle2 size={21} aria-hidden="true" /><div><strong>Official Raymoch documentation</strong><p>This document describes Raymoch’s current policy and forms part of the company information available to customers, partners, and website visitors. Material changes will be published on this page with an updated effective date.</p></div></div>
            <nav className="legal-info__contents" aria-label="On this page"><strong>On this page</strong>{document.sections.map((section, index) => <a key={section.title} href={`#section-${index + 1}`}>{section.title}</a>)}</nav>
            {document.sections.map((section, index) => (
              <section id={`section-${index + 1}`} className="legal-info__section" key={section.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><h2>{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.items && <ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul>}</div>
              </section>
            ))}
            <aside className="legal-info__contact"><div><span className="legal-info__eyebrow">Questions or requests</span><h2>We’re here to help you understand this information.</h2><p>Contact Raymoch with the relevant topic and enough detail for the appropriate team to respond.</p></div><a href="/contact">Contact Raymoch <ArrowRight size={17} /></a></aside>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
