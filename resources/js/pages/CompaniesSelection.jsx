import React from "react";
import Companies from "./Companies.jsx";

/**
 * Dedicated destination for sector and industry cards from /explore.
 * It reuses the complete Companies directory while isolating the card task
 * from searches previously submitted to /companies.
 */
export default function CompaniesSelection() {
  return (
    <Companies
      launchInvoker="main-panel"
      selectionCompanies={window.COMPANY_SELECTION_BOOT?.companies || []}
    />
  );
}
