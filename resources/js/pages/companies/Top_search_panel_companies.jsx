import React from "react";
import TopSearchForm from "./Top_search_form";
import TopSearchSelectedFilters from "./Top_search_selected_filters";

export default function TopSearchPanelCompanies(props) {
  return (
    <TopSearchForm
      {...props}
      SelectedFiltersComponent={TopSearchSelectedFilters}
    />
  );
}