import "../css/app.css";
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
import { clearAuthUserCache, getAuthUser } from "./lib/auth.js";
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
      const { authenticated, user } = await getAuthUser();

      if (authenticated) {
        setIsAuthenticated(true);
        setAuthUser(user || null);
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
    clearAuthUserCache();

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
   Lazy mount helper

   The importer is only called when its matching Blade mount exists. This
   keeps unrelated page code out of the initial download.
========================================================= */
async function mountPage(id, importer, { props = {}, wrap } = {}) {
  const el = document.getElementById(id);
  if (!el) return false;

  try {
    const module = await importer();
    const Component = module.default;
    const page = <Component {...props} />;
    const content = wrap ? wrap(page) : page;

    createRoot(el).render(<AppShell>{content}</AppShell>);
    return true;
  } catch (error) {
    console.error(`Unable to load the page mounted at #${id}.`, error);
    return false;
  }
}

const routeProps = { routes: window.ROUTES || window.APP?.routes || {} };

/* =========================================================
   Page mounts
========================================================= */
mountPage("about-root", () => import("./pages/About.jsx"));
mountPage("blog-root", () => import("./pages/blog.jsx"));
mountPage(
  "SignupInvestorAccountRoot",
  () => import("./components/signup/SignupInvestorAccount.jsx"),
  { props: routeProps }
);
mountPage("entire-root", () => import("./pages/Entire.jsx"));
mountPage("home-root", () => import("./pages/Home.jsx"));
mountPage("dashboard-root", () => import("./pages/Dashboard.jsx"));
mountPage("ServicesRoot", () => import("./pages/Services.jsx"));
mountPage("MarketInsightRoot", () => import("./pages/Market_Insight.jsx"));
mountPage("OverviewRoot", () => import("./pages/Overview.jsx"));
mountPage("FulloverviewRootAuthenticated",() => import("./pages/FulloverviewRootAuthenticated.jsx"));
mountPage("FulloverviewRoot", () => import("./pages/Fulloverview.jsx"));
mountPage("SecurityRoot", () => import("./pages/Security.jsx"));
mountPage("business-landing-root", () => import("./pages/Business_landing.jsx"));
mountPage("customer-root", () => import("./pages/Customer.jsx"));
mountPage("verification-root", () => import("./pages/Verification.jsx"));
mountPage("explore-root", () => import("./pages/ExploreBusinesses.jsx"), {wrap: (page) => <BrowserRouter>{page}</BrowserRouter>});
mountPage("explore-companies", () => import("./pages/Companies.jsx"));
mountPage("matching-root", () => import("./pages/Matching.jsx"));

mountPage(
  "signupBasicRoot",
  () => import("./components/signup/SignupBasic.jsx"),
  { props: routeProps }
);
mountPage(
  "signupPremiumRoot",
  () => import("./components/signup/SignupPremium.jsx"),
  { props: routeProps }
);
mountPage(
  "SignupBusinessAccountRoot",
  () => import("./components/signup/SignupBusinessAccount.jsx"),
  { props: routeProps }
);
mountPage(
  "pricingBasic",
  () => import("./components/PricingBasic.jsx"),
  { props: routeProps }
);
mountPage(
  "signup-root",
  () => import("./components/signup/SignupPage.jsx"),
  { props: routeProps }
);
mountPage("pricing-root", () => import("./pages/Pricing.jsx"), {
  props: routeProps,
});
mountPage("footer-information-root", () => import("./pages/Footer/FooterPage.jsx"), {
  props: { pageKey: window.FOOTER_PAGE },
});
mountPage("how-raymoch-works-root", () => import("./pages/Footer/How_Raymoch_Works.jsx"));
mountPage("trust-and-methodology-root", () => import("./pages/Footer/Trust_and_Methodology.jsx"));
mountPage("partner-programs-root", () => import("./pages/Footer/Partner_Programs.jsx"));
mountPage("careers-page-root", () => import("./pages/Footer/Careers.jsx"));
mountPage("contact-page-root", () => import("./pages/Footer/Contact.jsx"));
mountPage("price-how-to-pay-root", () => import("./pages/Pricehowtopay.jsx"), {
  props: routeProps,
});
mountPage(
  "membership-success-root",
  () => import("./pages/membership_success.jsx"),
  { props: routeProps }
);

/* =========================================================
   Login mount
========================================================= */
const loginMount =
  document.getElementById("doot") || document.getElementById("login-root");

if (loginMount) {
  import("./components/Login.jsx")
    .then(({ default: Login }) => {
      createRoot(loginMount).render(
        <AppShell>
          <Login
            apiUrl="/login/json"
            csrfToken={getCsrf()}
            redirectTo="/dashboard"
          />
        </AppShell>
      );
    })
    .catch((error) => {
      console.error("Unable to load the login page.", error);
    });
}
