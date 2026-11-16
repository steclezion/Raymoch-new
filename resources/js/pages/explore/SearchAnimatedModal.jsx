import React from "react";
import HorizontalModalNavigation from "../../components/modals/HorizontalModalNavigation";
import SnakeSearchLoading from "./SnakeSearchLoading";

export default function SearchAnimatedModal({
  open = false,
  token = "",
  status,
  error,
  starting,
  onClose,
  onViewResults,
  onResume,
}) {
  return (
    <HorizontalModalNavigation
      open={open}
      eyebrow="Raymoch Business Intelligence"
      title="Company Discovery"
      description="Search progress and matched business intelligence"
      closeLabel={status?.meta?.is_completed ? "Close search dialog" : "Stop search"}
      onClose={onClose}
    >
      <SnakeSearchLoading
        open={open}
        token={token}
        status={status}
        error={error}
        starting={starting}
        onViewResults={onViewResults}
        onResume={onResume}
      />
    </HorizontalModalNavigation>
  );
}
