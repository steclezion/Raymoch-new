import { useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Clock3,
  FileCheck2,
  FileText,
  Gauge,
  Headphones,
  HelpCircle,
  KeyRound,
  Landmark,
  LifeBuoy,
  LockKeyhole,
  Mail,
  MessageCircleQuestion,
  Search,
  ServerCog,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";
import AuthAwareNavigation from "../../components/AuthAwareNavigation.jsx";
import Footer from "../../components/layout_master/Footer.jsx";
import RaymochInformationSupporter from "../../components/RaymochInformationSupporter.jsx";
import "../../styles/resource-pages.css";

const PAGES = {
  "business-readiness": {
    path: "/business-readiness-guides", eyebrow: "Resources · Business readiness", Icon: BookOpenCheck,
    title: "Prepare stronger information before the opportunity arrives.",
    intro: "Use these practical guides to organize the identity, evidence, commercial story, and opportunity details that customers, programs, partners, and investors commonly review.",
    sections: [
      ["Business identity", "Make the operating entity easy to understand.", "Keep current registration details, trading names, ownership context, leadership contacts, locations, and authorized representatives together.", Building2],
      ["Commercial profile", "Explain what the business does and for whom.", "Describe products, capabilities, customer groups, routes to market, operating regions, differentiation, and the problem being solved.", SlidersHorizontal],
      ["Supporting evidence", "Connect important claims to appropriate records.", "Organize licenses, certifications, contracts, traction records, customer references, financial information, and other relevant evidence.", FileCheck2],
      ["Opportunity brief", "State the request clearly.", "Clarify the capital, customer, partnership, program, or service need; expected use; timing; constraints; and desired outcome.", Landmark],
    ],
    checklist: ["Registration and ownership details are current", "Leadership and contact details are accurate", "Products and capabilities are clearly described", "Operating markets and customer groups are identified", "Material claims have supporting evidence", "The opportunity need and intended use are specific"],
    action: ["Review your business presence", "Explore business discovery", "/explore"],
  },
  "verification-guide": {
    path: "/verification-guide", eyebrow: "Resources · Trust and verification", Icon: BadgeCheck,
    title: "Understand what verification shows—and what it does not.",
    intro: "Raymoch verification provides context about submitted information and reviewed evidence. It supports evaluation without guaranteeing performance or replacing independent due diligence.",
    sections: [
      ["Prepare", "Gather current, legible information.", "Confirm that names, dates, identifiers, contacts, and supporting records are consistent before submission.", FileText],
      ["Submit", "Use the relevant verification workflow.", "Provide only the information requested, through the approved channel, and confirm that you are authorized to share it.", ShieldCheck],
      ["Review", "Raymoch examines the supplied material.", "Review may consider completeness, consistency, provenance, legibility, relevance, and whether additional clarification is required.", Search],
      ["Outcome", "A status and next step are communicated.", "The result may indicate reviewed information, missing evidence, an issue requiring correction, or a need for further assessment.", CheckCircle2],
    ],
    questions: [
      ["Does verification mean Raymoch recommends a business?", "No. Verification adds context to reviewed information. It is not an endorsement, credit rating, investment recommendation, or guarantee."],
      ["What documents may be requested?", "Requirements depend on the service and jurisdiction, but may include registration, ownership, authorization, identity, license, certification, or operating evidence."],
      ["Can verification expire or change?", "Yes. Information can become outdated, a document may expire, or new evidence may affect the displayed context."],
      ["What if information cannot be verified?", "The user may be asked to correct a mismatch, provide clearer evidence, or complete another appropriate review step."],
    ],
    action: ["Need verification support?", "Open verification services", "/verification"],
  },
  "help-centre": {
    path: "/help", eyebrow: "Resources · Customer support", Icon: LifeBuoy,
    title: "Find the right answer and keep moving.",
    intro: "Browse help by topic, review common guidance, or contact Raymoch when an account or service issue requires personal support.",
    searchable: true,
    sections: [
      ["Account and sign-in", "Passwords, authenticator codes, access, and profile settings.", "Use account recovery for a forgotten password. Authenticator issues may require your current code or a supported recovery process.", KeyRound],
      ["Business profiles", "Company information, visibility, and profile updates.", "Keep business identity, capabilities, contact details, markets, and evidence current so other users receive accurate context.", Building2],
      ["Discovery and matching", "Search, preferences, saved activity, and potential matches.", "Refine criteria when results are broad and review the stated reasons for a match before deciding whether to proceed.", SlidersHorizontal],
      ["Verification", "Submissions, evidence, status, and review questions.", "Check requested requirements, document quality, information consistency, and any response asking for clarification.", BadgeCheck],
      ["Plans and billing", "Plan access, payments, invoices, and account changes.", "Review your current plan and billing details in the appropriate account area or contact support for an unresolved payment issue.", WalletCards],
      ["Privacy and security", "Information rights, suspicious activity, and security concerns.", "Change compromised credentials promptly and contact Raymoch if you believe information or account access has been misused.", LockKeyhole],
    ],
    questions: [
      ["I cannot sign in. What should I check first?", "Confirm the email address, password, authenticator time synchronization, and whether the browser is blocking required cookies. Then use password recovery if needed."],
      ["Why is information missing from a company profile?", "Some information may not have been supplied, may require permission, may be under review, or may not apply to that organization."],
      ["How do I report an urgent security concern?", "Use the contact page, select the privacy or security topic, and provide enough context for the concern to be assessed without including unnecessary sensitive data."],
    ],
    action: ["Still need help?", "Contact the support team", "/contact"],
  },
  faqs: {
    path: "/faqs", eyebrow: "Resources · Frequently asked questions", Icon: MessageCircleQuestion,
    title: "Clear answers about using Raymoch.",
    intro: "Find concise information about accounts, business discovery, verification, matching, privacy, subscriptions, and platform responsibilities.",
    searchable: true,
    sections: [
      ["Accounts", "Who can use Raymoch?", "Individuals, businesses, investors, and ecosystem partners can use account paths and services appropriate to their goals.", UserRound],
      ["Discovery", "What information can I find?", "Available information depends on the company, permissions, service, and review stage. Profiles may include identity, capability, market, trust, and opportunity context.", Search],
      ["Matching", "Does a match guarantee suitability?", "No. Matching highlights possible alignment using available information and preferences. Each participant must conduct its own review.", SlidersHorizontal],
      ["Verification", "Is a verified company risk-free?", "No. Verification provides context about reviewed information and cannot eliminate commercial, legal, financial, operational, or other risk.", BadgeCheck],
      ["Pricing", "Can I explore before choosing a plan?", "Available entry points may include public information or trial access. Plan features and eligibility are shown on the pricing page.", WalletCards],
      ["Privacy", "How is my information used?", "Raymoch aims to use information for stated platform and service purposes, subject to applicable permissions and privacy practices.", ShieldCheck],
    ],
    questions: [
      ["Can Raymoch make an investment decision for me?", "No. Raymoch provides information and decision-support tools. It does not make investment, legal, tax, or financial decisions for users."],
      ["Can business information change?", "Yes. Organizations, operations, documents, markets, and verification context can change. Always consider freshness and confirm material information."],
      ["How can I correct inaccurate information?", "Use the relevant profile update or contact channel, identify the information clearly, and provide appropriate supporting context."],
      ["Are all services available in every market?", "Not necessarily. Availability can depend on jurisdiction, product readiness, data access, partner coverage, and regulatory considerations."],
    ],
    action: ["Need more detail?", "Visit the Help Centre", "/help"],
  },
  "system-status": {
    path: "/status", eyebrow: "Resources · Service information", Icon: ServerCog,
    title: "Raymoch service status and availability guidance.",
    intro: "Review the platform areas covered by status communication and learn what to do when a service does not behave as expected.",
    status: true,
    sections: [
      ["Website and navigation", "Public pages and primary navigation", "Operational status should reflect whether visitors can reach public Raymoch information and move between core pages.", Gauge],
      ["Account access", "Login, MFA, recovery, and sessions", "Account status communication covers authentication, multifactor verification, password recovery, and session availability.", KeyRound],
      ["Discovery services", "Search, profiles, and business exploration", "This area covers core business discovery requests, company profile access, and related search workflows.", Search],
      ["Notifications and email", "In-app messages and email delivery", "Email delivery can be delayed by external providers. In-app status and email status should be considered separately.", Mail],
      ["Verification workflows", "Submission and review services", "This includes verification forms, evidence submission, status retrieval, and supported review interactions.", BadgeCheck],
      ["Billing services", "Payments and plan management", "This area covers payment initiation and subscription-related actions; some processing depends on external payment providers.", WalletCards],
    ],
    questions: [
      ["What should I do if a service fails?", "Refresh once, confirm your connection, save any entered information, and retry after a short interval. Contact support if the issue persists."],
      ["Is this page a live monitoring dashboard?", "Not yet. Until automated telemetry is connected, this page explains status scope and support steps without claiming real-time availability."],
      ["How are incidents communicated?", "Material incidents should include the affected service, user impact, investigation or mitigation state, and a resolution update when available."],
    ],
    action: ["Experiencing a problem?", "Report a service issue", "/contact"],
  },
};

function Checklist({ items }) {
  const [checked, setChecked] = useState([]);
  const percent = Math.round((checked.length / items.length) * 100);
  return <section className="resource-checklist"><header><div><p>Self-assessment</p><h2>Business readiness check</h2></div><span>{percent}% complete</span></header><div className="resource-checklist__bar"><i style={{ width: `${percent}%` }} /></div><div>{items.map((item, index) => <label key={item}><input type="checkbox" checked={checked.includes(index)} onChange={() => setChecked((current) => current.includes(index) ? current.filter((value) => value !== index) : [...current, index])} /><span><Check />{item}</span></label>)}</div><small>This checklist is a planning aid and does not determine eligibility or guarantee an outcome.</small></section>;
}

export default function ResourcePage({ pageKey = window.RESOURCE_PAGE }) {
  const page = PAGES[pageKey] || PAGES.faqs;
  const PageIcon = page.Icon;
  const [query, setQuery] = useState("");
  const filteredSections = useMemo(() => {
    const term = query.trim().toLowerCase();
    return !term ? page.sections : page.sections.filter((item) => item.slice(0, 3).join(" ").toLowerCase().includes(term));
  }, [page, query]);
  const filteredQuestions = useMemo(() => {
    const term = query.trim().toLowerCase();
    return !term ? (page.questions || []) : (page.questions || []).filter((item) => item.join(" ").toLowerCase().includes(term));
  }, [page, query]);

  return <div className="resource-page">
    <AuthAwareNavigation activePath={page.path} />
    <main>
      <header className="resource-intro resource-wrap"><p><PageIcon />{page.eyebrow}</p><h1>{page.title}</h1><span>{page.intro}</span>{page.searchable ? <label><Search /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search this resource" aria-label="Search this resource" />{query ? <button type="button" onClick={() => setQuery("")} aria-label="Clear search"><X /></button> : null}</label> : null}</header>

      {page.status ? <section className="resource-status-note resource-wrap"><span><Clock3 /></span><div><strong>Status information</strong><p>This page does not currently claim real-time telemetry. Live operational indicators can be connected here when a monitoring service is available.</p></div></section> : null}

      <section className="resource-sections resource-wrap" aria-label={`${pageKey} topics`}>{filteredSections.map(([label, title, text, Icon], index) => <article key={label}><header><span><Icon /></span><small>{String(index + 1).padStart(2, "0")} · {label}</small></header><h2>{title}</h2><p>{text}</p>{page.status ? <div className="resource-service-state"><i /><span>Service area documented</span></div> : null}</article>)}</section>
      {query && !filteredSections.length && !filteredQuestions.length ? <div className="resource-empty resource-wrap"><CircleHelp /><h2>No matching guidance</h2><p>Try a broader term or contact support for personal help.</p></div> : null}

      {page.checklist ? <div className="resource-wrap"><Checklist items={page.checklist} /></div> : null}

      {filteredQuestions.length ? <section className="resource-questions resource-wrap"><header><p><HelpCircle /> Helpful answers</p><h2>{pageKey === "faqs" ? "Frequently asked questions" : "What people often need to know"}</h2></header><div>{filteredQuestions.map(([question, answer], index) => <details key={question} open={index === 0 && !query}><summary><strong>{question}</strong><ChevronDown /></summary><p>{answer}</p></details>)}</div></section> : null}

      <aside className="resource-action resource-wrap"><div><small>{page.action[0]}</small><h2>{pageKey === "system-status" ? "Get help with an unresolved service issue." : "Continue with the right Raymoch service."}</h2></div><a href={page.action[2]}>{page.action[1]} <ArrowRight /></a></aside>
    </main>
    <RaymochInformationSupporter />
    <Footer />
  </div>;
}
