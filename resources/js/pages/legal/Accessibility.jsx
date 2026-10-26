import React from "react";
import LegalInformationPage from "./LegalInformationPage.jsx";

const document = {
  key: "accessibility", title: "Raymoch Accessibility Statement", effective: "October 26, 2026", status: "Published statement",
  summary: "Our approach to making Raymoch understandable, navigable, and usable across devices, input methods, and access needs.",
  sections: [
    { title: "Our commitment", paragraphs: ["Raymoch aims to provide an inclusive experience for customers, partners, and visitors. Accessibility is considered as the platform and its content evolve, rather than treated as a one-time activity."] },
    { title: "Design and navigation", paragraphs: ["Our approach includes semantic page structure, descriptive labels, visible keyboard focus, readable contrast, responsive layouts, and controls that do not rely on pointer input alone."] },
    { title: "Content and media", paragraphs: ["Raymoch aims to use clear language, meaningful headings, useful link text, and text alternatives for informative images. Decorative visuals should not create a barrier to understanding essential information."] },
    { title: "Compatibility", paragraphs: ["The website is designed for current mainstream browsers and a range of screen sizes. Experiences may vary with older browsers, assistive technologies, device settings, or third-party content outside Raymoch’s direct control."] },
    { title: "Known limitations", paragraphs: ["Some complex visualizations, legacy pages, uploaded documents, or third-party components may not yet provide an equivalent experience in every context. Raymoch intends to identify and prioritize barriers as they are reported or discovered."] },
    { title: "Feedback and assistance", paragraphs: ["If you encounter a barrier, contact Raymoch with the page address, the task you were trying to complete, your browser or assistive technology where comfortable, and the format or support that would help. Accessibility feedback should receive respectful review and practical follow-up."] },
  ],
};

export default function Accessibility() { return <LegalInformationPage document={document} />; }
