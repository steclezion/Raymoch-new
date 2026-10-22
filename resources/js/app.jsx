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
import { LoginActivityService } from "./services/LoginActivityService.js";
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

  const bcRef = useRef(null);
  const activityServiceRef = useRef(null);

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
  };

  const logout = async ({ silent = false, broadcast = true } = {}) => {
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

  useEffect(() => {
    refreshAuth();
  }, []);

  useEffect(() => {
    if (!booted || !isAuthenticated) {
      activityServiceRef.current?.stop();
      activityServiceRef.current = null;
      return undefined;
    }

    const activityService = new LoginActivityService({
      onAcknowledgement: (state) => {
        window.dispatchEvent(new CustomEvent("raymoch:login-activity", { detail: state }));
      },
      onExpired: () => {
        clearAuthUserCache();
        setIsAuthenticated(false);
        setAuthUser(null);
        window.location.replace("/");
      },
    });
    activityServiceRef.current = activityService;
    activityService.start();

    return () => {
      activityService.stop();
      if (activityServiceRef.current === activityService) activityServiceRef.current = null;
    };
  }, [booted, isAuthenticated]);

  useEffect(() => {
    if (typeof BroadcastChannel !== "undefined") {
      bcRef.current = new BroadcastChannel("raymoch-auth");

      bcRef.current.onmessage = (event) => {
        const msg = event?.data;

        if (!msg?.type) return;

        if (msg.type === "logout") {
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
  }, []);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "raymoch:logout" && e.newValue) {
        setIsAuthenticated(false);
        setAuthUser(null);
        window.location.href = "/";
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

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
mountPage("privacy-page-root", () => import("./pages/legal/Privacy.jsx"));
mountPage("terms-page-root", () => import("./pages/legal/Terms.jsx"));
mountPage("cookies-page-root", () => import("./pages/legal/Cookies.jsx"));
mountPage("data-protection-page-root", () => import("./pages/legal/DataProtection.jsx"));
mountPage("accessibility-page-root", () => import("./pages/legal/Accessibility.jsx"));
mountPage("authenticator-setup-root", () => import("./pages/AuthenticatorSetup.jsx"));
mountPage("password-recovery-root", () => import("./pages/PasswordRecovery.jsx"), {
  props: window.PASSWORD_RECOVERY_BOOT || {},
});
mountPage("settings-root", () => import("./pages/Settings.jsx"), {
  props: window.SETTINGS_BOOT || {},
});
mountPage("notifications-root", () => import("./pages/Notifications.jsx"), {
  props: window.NOTIFICATIONS_BOOT || {},
});
mountPage("explore-topic-root", () => import("./pages/ExploreTopic.jsx"), {
  props: { topicKey: window.EXPLORE_TOPIC },
});
mountPage("trial-request-root", () => import("./components/RequestTrial.jsx"), {
  props: {
    apiUrl: window.TRIAL_BOOT?.apiTrial || "/api/trial-requests",
    apiCheckUrl: window.TRIAL_BOOT?.apiCheck || "/api/trial-requests/check",
    csrfToken: window.TRIAL_BOOT?.csrf || getCsrf(),
  },
});
mountPage("trial-verify-root", () => import("./components/VerifyCode.jsx"), {
  props: {
    apiVerifyUrl: window.TRIAL_COUPON_BOOT?.verifyUrl || "/trial/verify-coupon",
    csrfToken: window.TRIAL_COUPON_BOOT?.csrf || getCsrf(),
    emailProp: window.TRIAL_COUPON_BOOT?.email || new URLSearchParams(window.location.search).get("email") || "",
  },
});
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
mountPage("insight-detail-root", () => import("./pages/InsightDetail.jsx"));
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
mountPage("for-investors-root", () => import("./pages/ForInvestors.jsx"));
mountPage("resource-page-root", () => import("./pages/resources/ResourcePage.jsx"), {
  props: { pageKey: window.RESOURCE_PAGE },
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
