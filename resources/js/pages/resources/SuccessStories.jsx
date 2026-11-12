import React from "react";
import { ArrowRight, BadgeCheck, Building2, Globe2, Handshake } from "lucide-react";
import AuthAwareNavigation from "../../components/AuthAwareNavigation.jsx";
import Footer from "../../components/layout_master/Footer.jsx";
import RaymochInformationSupporter from "../../components/RaymochInformationSupporter.jsx";
import "./ResourcesHub.css";

const STORIES = [
  { label: "Business visibility", title: "From a fragmented company story to a profile partners could understand", text: "A growing services company organized its capabilities, operating footprint, and supporting evidence into one consistent profile—making early partner conversations clearer and faster.", result: "A clearer path from introduction to evaluation", icon: Building2 },
  { label: "Market discovery", title: "Turning a broad expansion ambition into a focused market shortlist", text: "A business team used sector and regional context to compare demand signals, operating considerations, and information gaps before committing resources to expansion research.", result: "Three priority markets identified for deeper diligence", icon: Globe2 },
  { label: "Trusted matching", title: "Helping complementary goals find a more relevant starting point", text: "Structured preferences and business information helped two organizations recognize potential alignment before their first conversation, giving both sides a more productive agenda.", result: "A better-informed first conversation", icon: Handshake },
];

export default function SuccessStories() {
  return (
    <>
      <AuthAwareNavigation activePath="/success-stories" />
      <main className="resource-hub resource-hub--stories">
        <section className="resource-hub__hero">
          <div className="resource-hub__shell resource-hub__hero-grid">
            <div><span className="resource-hub__eyebrow">Resources · Customer outcomes</span><h1>Progress starts when useful information meets the right opportunity.</h1><p>Explore how businesses and ecosystem partners use Raymoch to improve visibility, frame better questions, and move from broad interest toward informed action.</p><div className="resource-hub__actions"><a className="resource-hub__button resource-hub__button--primary" href="#stories">Read the stories <ArrowRight size={17} /></a><a className="resource-hub__button" href="/contact?topic=share-story">Share your story</a></div></div>
            <aside className="resource-hub__hero-card resource-hub__quote"><BadgeCheck size={24} /><blockquote>“Clarity is an outcome in itself. It helps every participant understand what is known, what needs validation, and what should happen next.”</blockquote><span>Raymoch customer-success principle</span></aside>
          </div>
        </section>

        <section className="resource-hub__metrics"><div className="resource-hub__shell"><div><strong>Structured</strong><span>business information</span></div><div><strong>Contextual</strong><span>trust signals</span></div><div><strong>Relevant</strong><span>market discovery</span></div><div><strong>Informed</strong><span>next steps</span></div></div></section>

        <section className="resource-hub__section resource-hub__shell" id="stories">
          <div className="resource-hub__heading"><div><span className="resource-hub__eyebrow">Stories from the journey</span><h2>Better starting points create better outcomes.</h2></div><p>These stories illustrate practical uses of structured information and decision support. Results vary by organization and context.</p></div>
          <div className="resource-hub__story-list">
            {STORIES.map(({ label, title, text, result, icon: Icon }, index) => <article className="resource-hub__story" key={title}><div className="resource-hub__story-number">0{index + 1}</div><div><span className="resource-hub__tag"><Icon size={15} /> {label}</span><h3>{title}</h3><p>{text}</p><strong><BadgeCheck size={17} /> {result}</strong></div></article>)}
          </div>
        </section>

        <section className="resource-hub__cta resource-hub__shell"><div><span>Your progress can help someone else begin</span><h2>Have a Raymoch success story?</h2><p>Share the challenge, the approach, and what changed. We’ll contact you before publishing anything.</p></div><a href="/contact?topic=share-story">Tell us your story <ArrowRight size={17} /></a></section>
      </main>
      <RaymochInformationSupporter />
      <Footer />
    </>
  );
}
