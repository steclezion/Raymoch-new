import React, { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArchiveRestore,
  BadgeCheck,
  Bug,
  Database,
  FileKey,
  Fingerprint,
  KeyRound,
  LifeBuoy,
  LockKeyhole,
  Network,
  ScanSearch,
  ServerCog,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import Header from "../components/layout_master/Header.jsx";
import Footer from "../components/layout_master/Footer.jsx";
import { ResponsiveController } from "../components/ResponsiveController.jsx";
import "../styles/security.css";

const SECURITY_DOMAINS = [
  {
    icon: LockKeyhole,
    title: "Encryption and key protection",
    summary: "Confidential information is protected while moving through the platform and while stored.",
    controls: [
      "TLS protects supported browser, application, and API traffic in transit.",
      "Managed encryption protects databases, object storage, backups, and other supported data stores at rest.",
      "Encryption keys and application secrets are kept outside source code and access is restricted and auditable.",
      "Key rotation, revocation, and emergency replacement procedures reduce long-lived credential exposure.",
    ],
  },
  {
    icon: Fingerprint,
    title: "Identity and access management",
    summary: "Access is granted by role, business need, and the principle of least privilege.",
    controls: [
      "Role-based access control separates customers, reviewers, administrators, and service identities.",
      "Multi-factor authentication is required for privileged operational access where the identity provider supports it.",
      "Strong session controls cover secure cookies, expiry, revocation, re-authentication, and suspicious activity handling.",
      "Joiner, mover, and leaver reviews remove unnecessary access as responsibilities change.",
    ],
  },
  {
    icon: Database,
    title: "Data confidentiality and lifecycle",
    summary: "Raymoch limits collection, use, retention, and disclosure to legitimate platform purposes.",
    controls: [
      "Data classification distinguishes public, internal, confidential, and highly restricted information.",
      "Collection is minimized to information needed for matching, verification, support, compliance, and platform operation.",
      "Tenant-aware authorization and record-level checks prevent one customer from accessing another customer's protected data.",
      "Retention and secure deletion workflows follow legal, contractual, fraud-prevention, and operational requirements.",
    ],
  },
  {
    icon: Network,
    title: "Infrastructure and network security",
    summary: "Layered boundaries reduce exposure and limit the effect of a compromised component.",
    controls: [
      "Network segmentation separates public services, application workloads, databases, and administration paths.",
      "Firewalls, restrictive security groups, and private service connectivity reduce unnecessary inbound access.",
      "Hardened configurations, patching, workload isolation, and vulnerability remediation protect production systems.",
      "DDoS protection, traffic filtering, and capacity controls support platform availability.",
    ],
  },
  {
    icon: ScanSearch,
    title: "Application and API security",
    summary: "Security is incorporated into design, development, review, testing, and release workflows.",
    controls: [
      "Server-side authorization is enforced for protected actions; the user interface is never treated as a security boundary.",
      "Input validation, output encoding, parameterized data access, CSRF defenses, and secure upload handling reduce common attacks.",
      "Rate limiting, request-size limits, origin controls, and abuse detection protect public and authenticated endpoints.",
      "Dependency scanning, code review, security testing, and controlled deployment gates support safer releases.",
    ],
  },
  {
    icon: Activity,
    title: "Logging, monitoring, and detection",
    summary: "Security-relevant activity is monitored so suspicious behavior can be investigated and contained.",
    controls: [
      "Authentication, authorization, administrative, data-change, and service health events are recorded where appropriate.",
      "Logs are access-controlled, time-aligned, protected from casual alteration, and retained according to policy.",
      "Alerting highlights repeated access failures, privilege changes, unusual requests, and operational anomalies.",
      "Sensitive values are excluded or redacted from application logs wherever feasible.",
    ],
  },
  {
    icon: ArchiveRestore,
    title: "Backup and resilience",
    summary: "Recovery controls protect against operational failure, corruption, and destructive events.",
    controls: [
      "Encrypted backups follow defined schedules and are separated from primary production data.",
      "Restore procedures are tested periodically rather than relying only on successful backup jobs.",
      "Recovery objectives, service dependencies, and escalation paths guide continuity planning.",
      "High-risk changes use review, rollback planning, and staged deployment practices.",
    ],
  },
  {
    icon: UserCheck,
    title: "People and supplier assurance",
    summary: "Human and third-party access is governed throughout the relationship lifecycle.",
    controls: [
      "Personnel with sensitive access receive security and confidentiality responsibilities appropriate to their roles.",
      "Privileged actions are limited, logged, and reviewed; shared administrative accounts are avoided.",
      "Suppliers are assessed according to the sensitivity of the data and services they handle.",
      "Contracts address confidentiality, security responsibilities, incident cooperation, and data return or deletion where required.",
    ],
  },
];

const DATA_FLOW = [
  { step: "01", title: "Collect", text: "Gather only information needed for a clearly stated platform or legal purpose." },
  { step: "02", title: "Classify", text: "Apply sensitivity, ownership, access, and retention requirements." },
  { step: "03", title: "Protect", text: "Use encryption, authorization, isolation, validation, and monitoring controls." },
  { step: "04", title: "Retain", text: "Keep records only for approved operational, contractual, or legal periods." },
  { step: "05", title: "Delete", text: "Remove or anonymize information through controlled disposal workflows." },
];

const INCIDENT_STAGES = [
  ["Prepare", "Maintain ownership, communication paths, playbooks, tools, and evidence-handling procedures."],
  ["Detect", "Triage alerts and reports to establish scope, severity, affected systems, and potential data impact."],
  ["Contain", "Revoke access, isolate affected services, preserve evidence, and prevent further exposure."],
  ["Recover", "Restore trusted services, validate integrity, increase monitoring, and communicate as required."],
  ["Improve", "Document lessons, correct root causes, and track preventive actions to completion."],
];

export default function Security() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    async function loadUser() {
      try {
        const response = await fetch("/api/me", {
          credentials: "same-origin",
          signal: controller.signal,
          headers: { Accept: "application/json", "X-Requested-With": "XMLHttpRequest" },
        });
        const payload = await response.json().catch(() => ({}));
        if (active) setUser(response.ok && payload?.ok ? payload.user ?? null : null);
      } catch (error) {
        if (active && error?.name !== "AbortError") setUser(null);
      }
    }

    loadUser();
    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  return (
    <ResponsiveController>
      <>
        <Header user={user} />

        <div className="security-page">
          <main>
          <section className="security-hero" aria-labelledby="security-title">
            <div className="security-wrap security-hero-grid">
              <div>
                <span className="security-kicker"><ShieldCheck size={16} /> Raymoch Security</span>
                <h1 id="security-title">Confidential data deserves deliberate protection.</h1>
                <p>
                  Raymoch handles identity, company, verification, financial, matching, and communication data.
                  Our security model combines technical, organizational, and operational safeguards across the data lifecycle.
                </p>
                <div className="security-actions">
                  <a className="security-button security-button-primary" href="#controls" data-tooltip="Review Raymoch's security control domains">
                    Explore controls
                  </a>
                  <a className="security-button security-button-secondary" href="#report" data-tooltip="Learn how to report a suspected security issue">
                    Report a concern
                  </a>
                </div>
              </div>

              <aside className="security-hero-card" aria-label="Security principles">
                <div><LockKeyhole size={19} /><span><strong>Confidential by design</strong>Limit access and disclosure.</span></div>
                <div><BadgeCheck size={19} /><span><strong>Verify every request</strong>Authorize on the server.</span></div>
                <div><Activity size={19} /><span><strong>Monitor continuously</strong>Detect and investigate anomalies.</span></div>
              </aside>
            </div>
          </section>

          <section className="security-summary" aria-label="Security foundation">
            <div className="security-wrap security-summary-grid">
              <article><FileKey size={22} /><strong>Data protection</strong><span>Encryption, classification, minimization, and controlled retention.</span></article>
              <article><KeyRound size={22} /><strong>Least privilege</strong><span>Role-based, reviewed, and revocable access.</span></article>
              <article><ServerCog size={22} /><strong>Secure operations</strong><span>Hardening, patching, monitoring, backup, and recovery.</span></article>
                         </div>
          </section>

          <section id="controls" className="security-section">
            <div className="security-wrap">
              <SectionHeading eyebrow="Defense in depth" title="Security control domains" text="No single control is sufficient. Raymoch layers preventive, detective, and recovery safeguards across people, process, applications, and infrastructure." />
              <div className="security-control-grid">
                {SECURITY_DOMAINS.map(({ icon: Icon, title, summary, controls }) => (
                  <article className="security-control-card" key={title}>
                    <span className="security-icon"><Icon size={21} /></span>
                    <h2>{title}</h2>
                    <p>{summary}</p>
                    <ul>{controls.map((control) => <li key={control}>{control}</li>)}</ul>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="security-section security-section-alt">
            <div className="security-wrap">
              <SectionHeading eyebrow="Information lifecycle" title="Protection follows the data" text="Safeguards begin before collection and continue through controlled deletion or anonymization." />
              <ol className="security-flow">
                {DATA_FLOW.map((item) => (
                  <li key={item.step}><span>{item.step}</span><strong>{item.title}</strong><p>{item.text}</p></li>
                ))}
              </ol>
            </div>
          </section>

          <section className="security-section">
            <div className="security-wrap security-split">
              <div>
                <SectionHeading eyebrow="Sensitive information" title="What receives heightened protection" text="Controls are selected according to sensitivity, purpose, access requirements, and potential customer impact." />
                <div className="security-data-list">
                  <span>Identity and account records</span><span>Company ownership and verification evidence</span>
                  <span>Financial and investment information</span><span>Matching preferences and private communications</span>
                  <span>Authentication and security telemetry</span><span>Support, compliance, and audit records</span>
                </div>
              </div>
              <aside className="security-assurance-card">
                <AlertTriangle size={24} />
                <h2>Responsible claims matter</h2>
                <p>Certifications and regulatory attestations should appear here only after formal completion and approval. Customer contracts, privacy notices, and data-processing terms remain the authoritative commitments.</p>
              </aside>
            </div>
          </section>

          <section className="security-section security-section-dark">
            <div className="security-wrap">
              <SectionHeading eyebrow="Incident readiness" title="From detection to improvement" text="A structured response reduces harm, supports accurate communication, and turns findings into stronger safeguards." light />
              <div className="security-incident-grid">
                {INCIDENT_STAGES.map(([title, text], index) => (
                  <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{text}</p></article>
                ))}
              </div>
            </div>
          </section>

          <section id="report" className="security-section">
            <div className="security-wrap security-report-card">
              <span className="security-report-icon"><Bug size={25} /></span>
              <div>
                <span className="security-eyebrow">Coordinated disclosure</span>
                <h2>Report a suspected vulnerability</h2>
                <p>Send a clear description, affected URL or feature, reproducible steps, and potential impact. Do not access other users' data, disrupt services, or publish sensitive details before Raymoch can investigate.</p>
              </div>
              <a className="security-button security-button-primary" href="/contact?topic=security" data-tooltip="Contact Raymoch about a suspected security issue">
                <LifeBuoy size={17} /> Contact security
              </a>
            </div>
          </section>

          <section className="security-note">
            <div className="security-wrap">
              <p><strong>Security is a shared responsibility.</strong> Customers should protect credentials, enable available authentication safeguards, assign access carefully, review account activity, and report suspected compromise promptly.</p>
              <p className="security-update">Security practices evolve with platform architecture, risk, law, and contractual requirements. Last reviewed: September 2026.</p>
            </div>
          </section>
          </main>
        </div>

        <Footer />
      </>
    </ResponsiveController>
  );
}

function SectionHeading({ eyebrow, title, text, light = false }) {
  return (
    <header className={`security-heading${light ? " security-heading-light" : ""}`}>
      <span className="security-eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      <p>{text}</p>
    </header>
  );
}
