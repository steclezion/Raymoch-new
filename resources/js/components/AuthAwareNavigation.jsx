import React from "react";
import { useAuth } from "../app.jsx";
import HorizontalNavigation from "./HorizontalNavigation.jsx";
import Header from "./layout_master/Header.jsx";

export default function AuthAwareNavigation({ routes = {}, activePath }) {
  const { isAuthenticated, authUser, booted } = useAuth();

  if (!booted) {
    return <div aria-hidden="true" style={{ minHeight: 84, background: "#fff" }} />;
  }

  if (isAuthenticated) {
    return (
      <HorizontalNavigation
        activePath={activePath}
        isAuthed
        authLoading={false}
        authUser={authUser}
        routes={routes}
      />
    );
  }

  return <Header routes={routes} />;
}
