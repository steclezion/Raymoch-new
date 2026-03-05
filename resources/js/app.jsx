// resources/js/app.jsx
import React, { useEffect, useMemo, useState, createContext, useContext } from "react";
import { createRoot } from "react-dom/client";

import Login from "./components/Login.jsx";
import SignupPage from "./components/signup/SignupPage.jsx";
import PricingBasic from "./components/PricingBasic.jsx";
import SignupBasic from "./components/signup/SignupBasic.jsx";
import SignupPremium from "./components/signup/SignupPremium.jsx";
import SignupBusinessAccount from "./components/signup/SignupBusinessAccount.jsx";
import SignupInvestorAccount from "./components/signup/SignupInvestorAccount.jsx";
import ExploreBusinesses from "./pages/ExploreBusinesses.jsx";
import Companies from "./pages/Companies.jsx";
import Entire from "./pages/Entire.jsx";
import Services from "./pages/Services.jsx";
import Market_Insight from "./pages/Market_Insight.jsx";
import About from "./pages/About.jsx";

/* =========================================================
   Auth Context (session-based)
========================================================= */
const AuthCtx = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider />");
  return ctx;
}

function getCsrf() {
  return (
    window.APP?.csrf ??
    window.LOGIN_BOOT?.csrf ??
    document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") ??
    ""
  );
}

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [booted, setBooted] = useState(false);

  const refreshAuth = async () => {
    try {
      const res = await fetch("/auth/user", {
        method: "GET",
        headers: { Accept: "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      setIsAuthenticated(!!data.authenticated);
      setAuthUser(data.user || null);
    } catch {
      setIsAuthenticated(false);
      setAuthUser(null);
    } finally {
      setBooted(true);
    }
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  const login = (user) => {
    setIsAuthenticated(true);
    setAuthUser(user || null);
  };

  const logout = async () => {
    try {
      await fetch("/logout", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "X-CSRF-TOKEN": getCsrf(),
        },
        credentials: "include",
      });
    } catch {}
    setIsAuthenticated(false);
    setAuthUser(null);
    window.location.href = "/";
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      authUser,
      booted,
      refreshAuth,
      login,
      logout,
    }),
    [isAuthenticated, authUser, booted]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

/* =========================================================
   Mount helpers
========================================================= */
function mount(id, element) {
  const el = document.getElementById(id);
  if (!el) return;
  createRoot(el).render(<AuthProvider>{element}</AuthProvider>);
}

/* =========================================================
   Your mounts
========================================================= */
mount("about-root", <About />);

mount("SignupInvestorAccountRoot", <SignupInvestorAccount routes={window.ROUTES} />);

mount("entire-root", <Entire />);

mount("ServicesRoot", <Services />);

mount("MarketInsightRoot", <Market_Insight />);

mount("explore-root", <ExploreBusinesses />);

mount("explore-companies", <Companies />);

mount("signupBasicRoot", <SignupBasic routes={window.ROUTES} />);

mount("signupPremiumRoot", <SignupPremium routes={window.ROUTES} />);

mount("SignupBusinessAccountRoot", <SignupBusinessAccount routes={window.ROUTES} />);

mount("pricingBasic", <PricingBasic routes={window.ROUTES || {}} />);

mount("signup-root", <SignupPage routes={window.ROUTES || {}} />);

/**
 * Login mount (uses AuthProvider so header state can be refreshed)
 */
const loginMount = document.getElementById("doot");
if (loginMount) {
  const boot = window.LOGIN_BOOT || {};
  createRoot(loginMount).render(
    <AuthProvider>
      <Login
        apiUrl={boot.apiLogin || "/login/json"}
        csrfToken={boot.csrf || getCsrf()}
        redirectTo={boot.redirectTo || "/dashboard"}
      />
    </AuthProvider>
  );
}