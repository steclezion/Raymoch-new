import React from "react";
import LegalInformationPage from "./LegalInformationPage.jsx";

const document = {
  key: "privacy", title: "Raymoch Privacy Notice", effective: "2024–2026",
  summary: "How Raymoch approaches the collection, use, protection, and responsible handling of personal information across its website and services.",
  sections: [
    { title: "Scope of this notice", paragraphs: ["This interim notice describes Raymoch’s general privacy approach for visitors, account holders, business representatives, investors, applicants, and people who contact us between 2024 and 2026.", "A final notice may provide additional details for specific products, regions, or processing activities."] },
    { title: "Information we may collect", paragraphs: ["Depending on how you use Raymoch, information may include account and contact details, business profile information, submitted documents, service preferences, correspondence, transaction references, device information, and website activity."], items: ["Information you provide directly", "Information created through your use of the platform", "Appropriate information from authorized or public sources"] },
    { title: "How information may be used", paragraphs: ["Raymoch may use relevant information to provide and secure services, manage accounts, support business discovery and verification, respond to enquiries, improve platform performance, meet legal obligations, and prevent misuse.", "Use should remain connected to a clear and legitimate purpose, with additional permission obtained where required."] },
    { title: "Sharing and disclosure", paragraphs: ["Information may be shared with authorized service providers, professional advisers, program partners, or public authorities when necessary and appropriate. Raymoch does not intend to make confidential customer information public without a valid reason or authorization."] },
    { title: "Retention and security", paragraphs: ["Information should be retained only for as long as reasonably required for the relevant service, legal, security, or record-keeping purpose. Administrative and technical safeguards are used to reduce unauthorized access, alteration, loss, or misuse." ] },
    { title: "Your choices and requests", paragraphs: ["Subject to applicable law and verification of identity, individuals may ask about their information, request correction, raise an objection, request deletion where available, or withdraw certain permissions. Some records may need to be retained for legal, security, or contractual reasons."] },
  ],
};

export default function Privacy() { return <LegalInformationPage document={document} />; }
