import React from "react";
import LegalInformationPage from "./LegalInformationPage.jsx";

const document = {
  key: "cookies", title: "Raymoch Cookie Notice", effective: "October 26, 2026", status: "Published notice",
  summary: "A straightforward explanation of how cookies and similar browser technologies may support security, preferences, and service improvement.",
  sections: [
    { title: "What cookies are", paragraphs: ["Cookies are small data files stored by a browser. Similar technologies may use local storage or other identifiers to remember information and support website functions."] },
    { title: "Essential technologies", paragraphs: ["Some technologies are needed for core functions such as authentication, session security, fraud prevention, load balancing, and remembering privacy choices. Disabling them may prevent parts of Raymoch from working correctly."] },
    { title: "Preference technologies", paragraphs: ["Preference storage may remember selected settings, display choices, or other conveniences so users do not need to repeat them on each visit."] },
    { title: "Measurement and improvement", paragraphs: ["Where implemented and permitted, analytics technologies help Raymoch understand general usage, diagnose problems, and improve navigation. Optional analytics are used only where an appropriate legal basis and user controls are available."] },
    { title: "Managing your choices", paragraphs: ["Users can manage available choices through Raymoch’s cookie controls and browser settings. Browser-level blocking or deletion may remove saved preferences and require a new sign-in."] },
    { title: "Updates to this notice", paragraphs: ["Raymoch reviews this notice when its use of cookies or similar technologies changes. Material changes, including changes to purposes, providers, or retention practices, will be reflected here with a revised effective date."] },
  ],
};

export default function Cookies() { return <LegalInformationPage document={document} />; }
