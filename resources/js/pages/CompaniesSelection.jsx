import React from "react";
import CompaniesSelectionSearch from "./CompaniesSelectionSearch.jsx";

/**
 * Dedicated destination for sector and industry cards from /explore.
 * It presents the selected sector as an interactive business explorer.
 */
export default function CompaniesSelection() {
  return (
    <CompaniesSelectionSearch bootData={window.COMPANY_SELECTION_BOOT || {}} />
  );
}
