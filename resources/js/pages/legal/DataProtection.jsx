import React from "react";
import LegalInformationPage from "./LegalInformationPage.jsx";

const document = {
  key: "data-protection", title: "Raymoch Data Protection Policy", effective: "October 26, 2026", status: "Published policy",
  summary: "The operational principles Raymoch uses to guide responsible information handling, access, security, and customer rights.",
  sections: [
    { title: "Our protection principles", paragraphs: ["Raymoch aims to process personal information fairly, transparently, and for defined purposes. Collection should be proportionate, information should be kept appropriately accurate, and retention should not continue without a valid need." ] },
    { title: "Roles and accountability", paragraphs: ["Responsibility for information should be assigned within Raymoch and considered when services, partnerships, and internal processes are designed. Service providers should receive access only where needed and under appropriate safeguards."] },
    { title: "Access controls and security", paragraphs: ["Controls may include role-based access, authentication, encryption, monitoring, backups, secure development practices, and incident procedures. Safeguards are reviewed in proportion to the sensitivity and risk of the information involved."] },
    { title: "Individual rights", paragraphs: ["Where applicable, individuals may have rights to receive information, access or correct personal data, object to certain processing, request deletion or restriction, or raise a concern with an appropriate authority. Requests may require identity verification."] },
    { title: "International processing", paragraphs: ["Raymoch may support users and service providers in more than one country. When information is processed across borders, appropriate contractual, organizational, and technical measures should be considered alongside applicable requirements."] },
    { title: "Incidents and concerns", paragraphs: ["Suspected loss, unauthorized access, or misuse should be reported promptly. Raymoch will assess credible concerns, take proportionate containment and remediation steps, and make notifications when required."] },
  ],
};

export default function DataProtection() { return <LegalInformationPage document={document} />; }
