import React from "react";
import SearchAnimatedModal from "../../pages/explore/SearchAnimatedModal";

// The Explore form uses the same modal and progress display as TopSearchPanel.
export default function SearchSplashModal({
  open,
  token,
  status,
  error,
  starting,
  onStop,
  onViewResults,
  onResume,
}) {
  return (
    <SearchAnimatedModal
      open={open}
      token={token}
      status={status}
      error={error}
      starting={starting}
      onClose={onStop}
      onViewResults={onViewResults}
      onResume={onResume}
    />
  );
}
