import React from "react";
import { ArrowRight, BookOpen, CalendarDays, Clock3, PlayCircle, Users } from "lucide-react";
import AuthAwareNavigation from "../../components/AuthAwareNavigation.jsx";
import Footer from "../../components/layout_master/Footer.jsx";
import RaymochInformationSupporter from "../../components/RaymochInformationSupporter.jsx";
import "./ResourcesHub.css";

const SESSIONS = [
  { date: "18 Nov", type: "Live webinar", title: "Building a business profile that earns attention", detail: "Turn operating evidence, capabilities, and market context into a profile that is easier to evaluate.", time: "11:00 AM WAT · 50 min" },
  { date: "26 Nov", type: "Training clinic", title: "Verification readiness: documents, signals, and next steps", detail: "A practical walkthrough of the information commonly needed during a structured verification review.", time: "2:00 PM WAT · 75 min" },
  { date: "04 Dec", type: "Expert session", title: "Using market intelligence to sharpen expansion decisions", detail: "Learn how to combine company-level information with sector and regional signals before entering a market.", time: "12:00 PM WAT · 60 min" },
];

const PATHS = [
  { icon: BookOpen, title: "Business readiness", text: "Prepare your company information, evidence, and story for customers, programs, partners, and investors.", meta: "4 lessons · Beginner" },
  { icon: Users, title: "Trusted matching", text: "Understand how preferences and structured profiles can support more relevant introductions.", meta: "3 lessons · Intermediate" },
  { icon: PlayCircle, title: "Market intelligence", text: "Use research signals to frame better questions and make more informed commercial decisions.", meta: "5 lessons · Intermediate" },
];

export default function WebinarTrainingHub() {
  return (
    <>
      <AuthAwareNavigation activePath="/webinar-training-hub" />
      <main className="resource-hub">
        <section className="resource-hub__hero">
          <div className="resource-hub__shell resource-hub__hero-grid">
            <div>
              <span className="resource-hub__eyebrow">Resources · Learn with Raymoch</span>
              <h1>Webinars and training built for better business decisions.</h1>
              <p>Join practical sessions on verification, business readiness, trusted matching, and African market intelligence—then continue learning at your own pace.</p>
              <div className="resource-hub__actions">
                <a className="resource-hub__button resource-hub__button--primary" href="#upcoming">View upcoming sessions <ArrowRight size={17} /></a>
                <a className="resource-hub__button" href="#learning-paths">Explore learning paths</a>
              </div>
            </div>
            <aside className="resource-hub__hero-card" aria-label="Training hub summary">
              <span><CalendarDays size={19} /> Next live session</span>
              <strong>Building a business profile that earns attention</strong>
              <p>18 November · 11:00 AM WAT</p>
              <a href="#upcoming">See session details <ArrowRight size={15} /></a>
            </aside>
          </div>
        </section>

        <section className="resource-hub__section resource-hub__shell" id="upcoming">
          <div className="resource-hub__heading"><div><span className="resource-hub__eyebrow">Live learning</span><h2>Upcoming sessions</h2></div><p>Focused conversations with clear takeaways, useful examples, and time for questions.</p></div>
          <div className="resource-hub__session-list">
            {SESSIONS.map((session) => (
              <article className="resource-hub__session" key={session.title}>
                <div className="resource-hub__date"><strong>{session.date.split(" ")[0]}</strong><span>{session.date.split(" ")[1]}</span></div>
                <div><span className="resource-hub__tag">{session.type}</span><h3>{session.title}</h3><p>{session.detail}</p><small><Clock3 size={14} /> {session.time}</small></div>
                <a href="/contact?topic=training">Register interest <ArrowRight size={16} /></a>
              </article>
            ))}
          </div>
        </section>

        <section className="resource-hub__section resource-hub__section--tint" id="learning-paths">
          <div className="resource-hub__shell">
            <div className="resource-hub__heading"><div><span className="resource-hub__eyebrow">Learn at your pace</span><h2>Training paths</h2></div><p>Short, structured learning designed to help you apply Raymoch tools and trust principles.</p></div>
            <div className="resource-hub__card-grid">
              {PATHS.map(({ icon: Icon, title, text, meta }) => <article className="resource-hub__card" key={title}><span className="resource-hub__icon"><Icon size={22} /></span><small>{meta}</small><h3>{title}</h3><p>{text}</p><a href="/contact?topic=training">Request access <ArrowRight size={15} /></a></article>)}
            </div>
          </div>
        </section>

        <section className="resource-hub__cta resource-hub__shell"><div><span>Bring Raymoch learning to your team</span><h2>Need a focused workshop for your organization?</h2><p>Tell us your audience, market, and learning goals. We’ll help shape a useful session.</p></div><a href="/contact?topic=team-training">Discuss team training <ArrowRight size={17} /></a></section>
      </main>
      <RaymochInformationSupporter />
      <Footer />
    </>
  );
}
