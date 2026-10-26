import React from "react";
import LegalInformationPage from "./LegalInformationPage.jsx";

const document = {
  key: "terms", title: "Raymoch Terms of Use", effective: "October 26, 2026", status: "Published terms",
  summary: "The principles and responsibilities that support fair, secure, and appropriate use of Raymoch’s website, accounts, and services.",
  sections: [
    { title: "Using Raymoch", paragraphs: ["By accessing or using Raymoch, you agree to these terms and any service-specific terms presented during use. If you do not agree, you must not use the affected service."] },
    { title: "Accounts and security", paragraphs: ["Users should provide accurate registration information, protect their credentials, maintain appropriate control over their accounts, and notify Raymoch promptly about suspected unauthorized access."] },
    { title: "Responsible use", paragraphs: ["Raymoch must not be used to misrepresent a person or business, submit unlawful or misleading material, interfere with platform security, scrape restricted information, distribute harmful code, or violate another party’s rights."] },
    { title: "Business information and verification", paragraphs: ["Businesses and authorized representatives remain responsible for the accuracy and authority of submitted information. Verification signals provide context about reviewed evidence; they are not guarantees of performance, legality, creditworthiness, or investment suitability."] },
    { title: "Intellectual property", paragraphs: ["Raymoch’s platform design, software, branding, and original materials remain protected by applicable rights. Users retain appropriate rights in content they submit while permitting the processing needed to provide requested services."] },
    { title: "Availability and changes", paragraphs: ["Services may evolve, experience interruption, or require maintenance. Raymoch may update these terms as products and requirements develop, and material updates should be communicated through an appropriate channel."] },
    { title: "Important decision responsibility", paragraphs: ["Raymoch provides information and decision-support tools. Users remain responsible for independent legal, financial, commercial, and investment review before acting on an opportunity."] },
  ],
};

export default function Terms() { return <LegalInformationPage document={document} />; }
