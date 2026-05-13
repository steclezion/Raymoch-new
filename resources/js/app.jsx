import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import { BrowserRouter } from "react-router-dom";
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
import Pricing from "./pages/Pricing.jsx";
import PriceHowToPay  from "./pages/Pricehowtopay.jsx";
import MembershipSuccess from "./pages/membership_success.jsx";
/* =========================================================
   Auth Context
========================================================= */
const AuthCtx = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider />");
  }
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

async function api(path, { method = "GET", body } = {}) {
  const headers = {
    Accept: "application/json",
  };

  if (method !== "GET") {
    headers["Content-Type"] = "application/json";
    headers["X-CSRF-TOKEN"] = getCsrf();
  }

  const res = await fetch(path, {
    method,
    headers,
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = await res.json().catch(() => ({}));
  return { res, json };
}

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [booted, setBooted] = useState(false);

  const IDLE_LIMIT_MS = 30 * 60 * 1000; // 30 minutes

  const idleTimerRef = useRef(null);
  const lastActivityRef = useRef(Date.now());
  const bcRef = useRef(null);

  const clearIdleTimer = () => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  };

  const refreshAuth = async () => {
    try {
      const { res, json } = await api("/auth/user");

      if (res.ok && json?.authenticated) {
        setIsAuthenticated(true);
        setAuthUser(json?.user || null);
      } else {
        setIsAuthenticated(false);
        setAuthUser(null);
      }
    } catch {
      setIsAuthenticated(false);
      setAuthUser(null);
    } finally {
      setBooted(true);
    }
  };

  const login = (user) => {
    setIsAuthenticated(true);
    setAuthUser(user || null);

    lastActivityRef.current = Date.now();

    try {
      localStorage.setItem(
        "raymoch:lastActivity",
        String(lastActivityRef.current)
      );
    } catch {}
  };

  const logout = async ({ silent = false, broadcast = true } = {}) => {
    clearIdleTimer();

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

    try {
      localStorage.removeItem("raymoch:lastActivity");
      localStorage.setItem("raymoch:logout", String(Date.now()));
    } catch {}

    if (broadcast && bcRef.current) {
      try {
        bcRef.current.postMessage({ type: "logout" });
      } catch {}
    }

    if (!silent) {
      window.location.href = "/";
    }
  };

  const armIdleTimer = () => {
    clearIdleTimer();

    if (!isAuthenticated) return;

    const now = Date.now();
    const elapsed = now - lastActivityRef.current;
    const remaining = IDLE_LIMIT_MS - elapsed;

    if (remaining <= 0) {
      logout();
      return;
    }

    idleTimerRef.current = setTimeout(() => {
      logout();
    }, remaining);
  };

  const recordActivity = () => {
    if (!isAuthenticated) return;

    lastActivityRef.current = Date.now();

    try {
      localStorage.setItem(
        "raymoch:lastActivity",
        String(lastActivityRef.current)
      );
    } catch {}

    if (bcRef.current) {
      try {
        bcRef.current.postMessage({
          type: "activity",
          at: lastActivityRef.current,
        });
      } catch {}
    }

    armIdleTimer();
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  useEffect(() => {
    try {
      const saved = Number(localStorage.getItem("raymoch:lastActivity") || 0);
      if (saved > 0) {
        lastActivityRef.current = saved;
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof BroadcastChannel !== "undefined") {
      bcRef.current = new BroadcastChannel("raymoch-auth");

      bcRef.current.onmessage = (event) => {
        const msg = event?.data;

        if (!msg?.type) return;

        if (msg.type === "activity" && msg.at) {
          lastActivityRef.current = msg.at;
          armIdleTimer();
        }

        if (msg.type === "logout") {
          clearIdleTimer();
          setIsAuthenticated(false);
          setAuthUser(null);
          window.location.href = "/";
        }
      };
    }

    return () => {
      try {
        bcRef.current?.close();
      } catch {}
    };
  }, [isAuthenticated]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "raymoch:lastActivity" && e.newValue) {
        const ts = Number(e.newValue);
        if (ts > 0) {
          lastActivityRef.current = ts;
          armIdleTimer();
        }
      }

      if (e.key === "raymoch:logout" && e.newValue) {
        clearIdleTimer();
        setIsAuthenticated(false);
        setAuthUser(null);
        window.location.href = "/";
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      clearIdleTimer();
      return;
    }

    const events = [
      "mousemove",
      "mousedown",
      "click",
      "scroll",
      "keydown",
      "touchstart",
    ];

    const handler = () => recordActivity();

    events.forEach((event) => {
      window.addEventListener(event, handler, { passive: true });
    });

    armIdleTimer();

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handler);
      });
      clearIdleTimer();
    };
  }, [isAuthenticated]);

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
   Shared App Wrapper
========================================================= */
function AppShell({ children }) {
  return (
    <AuthProvider>
      <>
        {children}
        <Toaster
          position="top-right"
          richColors
          closeButton
          duration={3500}
        />
      </>
    </AuthProvider>
  );
}

/* =========================================================
   Mount helpers
========================================================= */
function mount(id, element) {
  const el = document.getElementById(id);
  if (!el) return;

  createRoot(el).render(<AppShell>{element}</AppShell>);
}

/* =========================================================
   Your mounts
========================================================= */
mount("about-root", <About />);
mount(
  "SignupInvestorAccountRoot",
  <SignupInvestorAccount routes={window.ROUTES || window.APP?.routes || {}} />
);
mount("entire-root", <Entire />);
mount("ServicesRoot", <Services />);
mount("MarketInsightRoot", <Market_Insight />);

mount("explore-root",
<BrowserRouter>   <ExploreBusinesses /></BrowserRouter>

   
  );

mount("explore-companies", <Companies />);
mount(
  "signupBasicRoot",
  <SignupBasic routes={window.ROUTES || window.APP?.routes || {}} />
);
mount(
  "signupPremiumRoot",
  <SignupPremium routes={window.ROUTES || window.APP?.routes || {}} />
);
mount(
  "SignupBusinessAccountRoot",
  <SignupBusinessAccount routes={window.ROUTES || window.APP?.routes || {}} />
);
mount(
  "pricingBasic",
  <PricingBasic routes={window.ROUTES || window.APP?.routes || {}} />
);
mount(
  "signup-root",
  <SignupPage routes={window.ROUTES || window.APP?.routes || {}} />
);

mount(
  "pricing-root", <Pricing routes={window.ROUTES || window.APP?.routes || {}} />
);

mount(
  "price-how-to-pay-root", <PriceHowToPay  routes={window.ROUTES || window.APP?.routes || {}} />
);

mount(
  "membership-success-root", <MembershipSuccess  routes={window.ROUTES || window.APP?.routes || {}} />
);

/* =========================================================
   Login mount
========================================================= */
const loginMount =
  document.getElementById("doot") || document.getElementById("login-root");

if (loginMount) {
  createRoot(loginMount).render(
    <AppShell>
      <Login
        apiUrl="/login/json"
        csrfToken={getCsrf()}
        redirectTo="/dashboard"
      />
    </AppShell>
  );
}