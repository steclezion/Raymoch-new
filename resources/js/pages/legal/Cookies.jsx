import React from "react";
import LegalInformationPage from "./LegalInformationPage.jsx";

const document = {
  key: "cookies", title: "Raymoch Cookie Information", effective: "Interim edition · 2026",
  summary: "A straightforward explanation of how cookies and similar browser technologies may support security, preferences, and service improvement.",
  sections: [
    { title: "What cookies are", paragraphs: ["Cookies are small data files stored by a browser. Similar technologies may use local storage or other identifiers to remember information and support website functions."] },
    { title: "Essential technologies", paragraphs: ["Some technologies are needed for core functions such as authentication, session security, fraud prevention, load balancing, and remembering privacy choices. Disabling them may prevent parts of Raymoch from working correctly."] },
    { title: "Preference technologies", paragraphs: ["Preference storage may remember selected settings, display choices, or other conveniences so users do not need to repeat them on each visit."] },
    { title: "Measurement and improvement", paragraphs: ["Where implemented and permitted, analytics may help Raymoch understand general usage, diagnose problems, and improve navigation. Final documentation will identify relevant providers and controls before optional measurement is relied upon."] },
    { title: "Managing your choices", paragraphs: ["Users can manage available choices through Raymoch’s cookie controls and browser settings. Browser-level blocking or deletion may remove saved preferences and require a new sign-in."] },
    { title: "Updates to this information", paragraphs: ["This page will be updated as Raymoch confirms the technologies used, their purposes, relevant providers, and retention periods."] },
  ],
};

export default function Cookies() { return <LegalInformationPage document={document} />; }
