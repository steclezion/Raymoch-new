// resources/js/pages/Matching.jsx

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  ArrowUpRight,
  BadgeCheck,
  Handshake,
  Search,
  Sparkles,
  Telescope,
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| Service page styling
|--------------------------------------------------------------------------
*/
import "../components/services/services.css";
import "../components/services/services-redesign.css";

/*
|--------------------------------------------------------------------------
| Modal components
|--------------------------------------------------------------------------
|
| MatchingModal is different from the other service modals.
|
| MatchingModal already contains:
| - ModalShell
| - Continue button
| - Results modal
| - Previous-searches modal
|
| Therefore, it must not be placed inside BaseModal.
|
*/

import BaseModal from "../components/modals/BaseModal.jsx";
import MatchingModal from "../components/modals/MatchingModal.jsx";
import PartnerProgramsModal from "../components/modals/PartnerProgramsModal.jsx";
import VerificationModal from "../components/modals/VerificationModal.jsx";
import VisibilityListingModal from "../components/modals/VisibilityListingModal.jsx";
import CompanyDetailsModal from "../components/modals/CompanyDetailsModal.jsx";
import HorizontalNavigation from "../components/HorizontalNavigation.jsx";
import Footer from "../components/layout_master/Footer.jsx";
import { ResponsiveController } from "../components/ResponsiveController.jsx";

/*
|--------------------------------------------------------------------------
| Service identifiers
|--------------------------------------------------------------------------
|
| Centralized keys help prevent spelling mistakes.
|
*/
const SERVICE_KEYS = Object.freeze({
  MATCHING: "matching",
  PARTNER_PROGRAMS: "partner-programs",
  VERIFICATION: "verification",
  VISIBILITY_LISTING: "visibility-listing",
});

const COMPANY_INFORMATION_ENDPOINT = "/api/company-information";

const dashboardCss = `
  :root {
    --dash-blue: #5b3825;
    --dash-blue-dark: #382116;
    --dash-ink: #1c1d1f;
    --dash-muted: #7a746d;
    --dash-line: #ded2c3;
    --dash-bg: #f7f2ea;
    --dash-card: #fbf8f3;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: var(--dash-bg);
    color: var(--dash-ink);
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }
  button, input, select { font: inherit; }
  .dashboard-shell { min-height: 100vh; background: var(--dash-bg); }
  .dashboard-main { min-height: 100vh; margin-left: 0; padding: 24px 30px 34px; }
  .dashboard-topbar { display: flex; align-items: center; justify-content: space-between; gap: 18px; margin-bottom: 18px; }
  .dashboard-heading p { margin: 0 0 3px; color: var(--dash-muted); font-size: .78rem; font-weight: 650; }
  .dashboard-heading h1 { margin: 0; font-size: clamp(1.55rem, 2vw, 2rem); letter-spacing: -.04em; }
  .topbar-actions { display: flex; align-items: center; gap: 9px; }
  .topbar-search {
    width: min(330px, 31vw);
    height: 40px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 12px;
    border: 1px solid var(--dash-line);
    border-radius: 11px;
    background: var(--dash-card);
    color: #8a909b;
  }
  .topbar-search input { width: 100%; border: 0; outline: 0; background: transparent; color: var(--dash-ink); font-size: .82rem; }
  .topbar-button { min-height: 43px; display: inline-flex; align-items: center; justify-content: center; padding: 0 17px; border-radius: 10px; color: #fbf8f3; background: linear-gradient(135deg,#6f452e,#5b3825); text-decoration: none; font-size: .84rem; font-weight: 800; box-shadow: 0 6px 15px rgba(91,56,37,.18); }
  .dashboard-hero {
    position: relative;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 24px;
    margin-bottom: 16px;
    padding: 28px 30px;
    overflow: hidden;
    border: 1px solid #6f452e;
    border-radius: 18px;
    color: #fff;
    background: radial-gradient(circle at 86% 10%, rgba(210,173,120,.3), transparent 27%), linear-gradient(120deg,#382116,#5b3825 58%,#8f6847);
    box-shadow: 0 14px 34px rgba(72,47,30,.16);
  }
  .dashboard-hero::after { content: ""; position: absolute; right: -80px; bottom: -180px; width: 360px; height: 360px; border: 1px solid rgba(255,255,255,.14); border-radius: 50%; }
  .hero-copy { position: relative; z-index: 1; max-width: 720px; }
  .hero-kicker { display: inline-flex; align-items: center; gap: 7px; margin-bottom: 10px; color: #f3e7cf; font-size: .74rem; font-weight: 850; letter-spacing: .08em; text-transform: uppercase; }
  .dashboard-hero h2 { margin: 0 0 9px; font-size: clamp(2rem, 4vw, 3.25rem); line-height: 1; letter-spacing: -.05em; }
  .dashboard-hero p { max-width: 660px; margin: 0; color: #eee2d4; font-size: .94rem; line-height: 1.6; }
  .hero-count { position: relative; z-index: 1; min-width: 132px; padding: 13px 15px; border: 1px solid rgba(255,255,255,.2); border-radius: 13px; background: rgba(255,255,255,.1); backdrop-filter: blur(8px); }
  .hero-count strong, .hero-count span { display: block; }.hero-count strong { font-size: 1.7rem; }.hero-count span { margin-top: 2px; color: #eee2d4; font-size: .7rem; }
  .dashboard-content { display: grid; gap: 16px; }
  .dashboard-panel { border: 1px solid var(--dash-line); border-radius: 17px; background: var(--dash-card); box-shadow: 0 8px 24px rgba(72,47,30,.06); }
  .breadcrumbs-panel { padding: 4px; }
  .breadcrumbs-panel .breadcrumb { margin: 0; border: 0; box-shadow: none; background: transparent; }
  .workspace-panel { padding: 18px; }
  .panel-heading { display: flex; align-items: flex-end; justify-content: space-between; gap: 15px; margin-bottom: 14px; }
  .panel-heading span { display: block; margin-bottom: 5px; color: var(--dash-blue); font-size: .68rem; font-weight: 900; letter-spacing: .1em; text-transform: uppercase; }
  .panel-heading h2 { margin: 0; font-size: 1.12rem; letter-spacing: -.025em; }
  .panel-heading p { margin: 0; color: var(--dash-muted); font-size: .75rem; }
  .search-workspace > :last-child, .results-workspace > :last-child { max-width: 100%; }
  .sector-status {
    position: relative;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 14px;
    margin-bottom: 18px;
    padding: 16px 18px;
    overflow: hidden;
    border: 1px solid #ded2c3;
    border-radius: 14px;
    background: linear-gradient(110deg,#f4ece2 0%,#fbf8f3 64%);
  }
  .sector-status::before {
    content: "";
    position: absolute;
    inset: 0 auto 0 0;
    width: 4px;
    background: linear-gradient(180deg,#8f6847,#5b3825);
  }
  .sector-status-icon {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: 12px;
    color: #fff;
    background: linear-gradient(145deg,#8f6847,#5b3825);
    box-shadow: 0 8px 18px rgba(91,56,37,.2);
  }
  .sector-status-copy { min-width: 0; }
  .sector-status-eyebrow {
    display: block;
    margin-bottom: 3px;
    color: #8b7769;
    font-size: .65rem;
    font-weight: 850;
    letter-spacing: .1em;
    text-transform: uppercase;
  }
  .sector-status h3 {
    margin: 0;
    color: #382116;
    font-size: 1.05rem;
    letter-spacing: -.02em;
  }
  .sector-status p {
    margin: 4px 0 0;
    color: #7a746d;
    font-size: .78rem;
    line-height: 1.45;
  }
  .sector-status-badge {
    padding: 6px 10px;
    border: 1px solid #d5c2ad;
    border-radius: 999px;
    color: #5b3825;
    background: #f3e8dc;
    font-size: .68rem;
    font-weight: 850;
    white-space: nowrap;
  }
  .sr-only { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
  @media (max-width: 840px) {
    .dashboard-main { margin-left: 0; padding: 18px; }
  }
  @media (max-width: 640px) {
    .dashboard-topbar { align-items: flex-start; }
    .dashboard-heading p, .topbar-search { display: none; }
    .dashboard-hero { align-items: flex-start; flex-direction: column; padding: 24px 21px; }
    .hero-count { min-width: 0; }
    .workspace-panel { padding: 13px; }
    .panel-heading { align-items: flex-start; flex-direction: column; }
    .sector-status { grid-template-columns: auto minmax(0, 1fr); padding: 14px; }
    .sector-status-badge { grid-column: 2; justify-self: start; }
  }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { scroll-behavior: auto !important; transition: none !important; }
  }
`;

/**
 * Configure the existing Explore header menu.
 *
 * This logic is separated from the Services component body so the
 * component remains easier to understand and maintain.
 */
function useExploreHeaderMenu() {
  useEffect(() => {
    const exploreButton =
      document.getElementById("exploreToggle");

    const exploreMenu =
      document.getElementById("t1Menu");

    /*
     * The header may not include these elements on every page.
     */
    if (!exploreButton || !exploreMenu) {
      return undefined;
    }

    /**
     * Open or close the Explore menu.
     */
    const setMenuOpen = (isOpen) => {
      exploreButton.setAttribute(
        "aria-expanded",
        isOpen ? "true" : "false",
      );

      exploreMenu.hidden = !isOpen;
    };

    /**
     * Toggle the menu when the Explore button is clicked.
     */
    const handleButtonClick = (event) => {
      event.preventDefault();

      const currentlyOpen =
        exploreButton.getAttribute(
          "aria-expanded",
        ) === "true";

      setMenuOpen(!currentlyOpen);
    };

    /**
     * Close the menu when the user clicks outside it.
     */
    const handleDocumentClick = (event) => {
      const clickedInsideMenu =
        exploreMenu.contains(event.target);

      const clickedButton =
        exploreButton.contains(event.target);

      if (
        !exploreMenu.hidden &&
        !clickedInsideMenu &&
        !clickedButton
      ) {
        setMenuOpen(false);
      }
    };

    /**
     * Close the menu when Escape is pressed.
     */
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    /*
     * Improve menu accessibility.
     */
    exploreMenu
      .querySelectorAll("a.menu-item")
      .forEach((menuItem) => {
        menuItem.setAttribute(
          "role",
          "menuitem",
        );
      });

    exploreButton.addEventListener(
      "click",
      handleButtonClick,
    );

    document.addEventListener(
      "click",
      handleDocumentClick,
    );

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    /*
     * Remove listeners when Services unmounts.
     */
    return () => {
      exploreButton.removeEventListener(
        "click",
        handleButtonClick,
      );

      document.removeEventListener(
        "click",
        handleDocumentClick,
      );

      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, []);
}

/**
 * Main Raymoch Services page.
 */
export default function Matching({ onSubmitCompany } = {}) {
  /*
  |--------------------------------------------------------------------------
  | Initialize header-menu behavior
  |--------------------------------------------------------------------------
  */
  useExploreHeaderMenu();

  /*
  |--------------------------------------------------------------------------
  | Service definitions
  |--------------------------------------------------------------------------
  |
  | The same array generates the service cards and provides modal titles.
  |
  */
  const services = useMemo(
    () => [
      {
        key: SERVICE_KEYS.MATCHING,
        title: "Matching",
        icon: Search,
        subtitle:
          "Investor inputs → ranked SME matches.",
      },
      {
        key: SERVICE_KEYS.PARTNER_PROGRAMS,
        title: "Partner Programs",
        icon: Handshake,
        subtitle:
          "Accelerators & syndicates, plugged in.",
      },
      {
        key: SERVICE_KEYS.VERIFICATION,
        title: "Verification",
        icon: BadgeCheck,
        subtitle:
          "CTI checks: identity, ownership, basics.",
      },
      {
        key: SERVICE_KEYS.VISIBILITY_LISTING,
        title: "Visibility & Listing",
        hidden: true,
        icon: Telescope,
        subtitle:
          "Get listed. Get discovered.",
      },
    ],
    [],
  );

  /*
  |--------------------------------------------------------------------------
  | Modal state
  |--------------------------------------------------------------------------
  |
  | activeServiceKey is the only state required.
  |
  | null:
  | No service modal is open.
  |
  | "matching":
  | MatchingModal is open.
  |
  | Any other service key:
  | BaseModal is open.
  |
  | This avoids inconsistent states such as:
  | open = false but activeKey = "matching".
  |
  */
  const [
    activeServiceKey,
    setActiveServiceKey,
  ] = useState(null);
  const [verificationView, setVerificationView] = useState("companies");
  const [initialCompanyId, setInitialCompanyId] = useState(null);
  const [hasRegisteredCompany, setHasRegisteredCompany] = useState(false);
  const [verificationLookupError, setVerificationLookupError] = useState("");
  const verificationLookupAbortRef = useRef(null);
  const onCompaniesLoaded = useCallback((companies) => setHasRegisteredCompany(companies.length > 0), []);
  const addCompany = useCallback(() => setVerificationView("add"), []);
  const viewCompany = useCallback((companyId = null) => {
    setInitialCompanyId(companyId);
    setVerificationView("companies");
  }, []);

  const checkAuthenticatedUserCompany = useCallback(async () => {
    verificationLookupAbortRef.current?.abort();
    const controller = new AbortController();
    verificationLookupAbortRef.current = controller;

    setVerificationLookupError("");
    setVerificationView("loading");

    try {
      const response = await fetch(COMPANY_INFORMATION_ENDPOINT, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        cache: "no-store",
        signal: controller.signal,
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          response.status === 401
            ? "Please sign in before opening company verification."
            : data.message || "Unable to check your submitted companies.",
        );
      }

      const companies = Array.isArray(data.companies) ? data.companies : [];
      if (controller.signal.aborted) return;

      const submittedCompany = companies.find(
        (company) => company && company.id != null,
      );
      const companyExists = Boolean(submittedCompany);

      setHasRegisteredCompany(companyExists);
      setInitialCompanyId(companyExists ? submittedCompany.id : null);
      setVerificationView(companyExists ? "companies" : "add");
    } catch (error) {
      if (error.name === "AbortError") return;
      setVerificationLookupError(
        error.message || "Unable to check your submitted companies.",
      );
      setVerificationView("error");
    }
  }, []);

  useEffect(
    () => () => verificationLookupAbortRef.current?.abort(),
    [],
  );

  /*
   * Store the element that opened the modal so focus can be restored.
   */
  const lastFocusedElementRef = useRef(null);

  /**
   * Open the selected service modal.
   */
  const openServiceModal = useCallback(
    (serviceKey) => {
      lastFocusedElementRef.current =
        document.activeElement;

      if (serviceKey === SERVICE_KEYS.VERIFICATION) {
        setInitialCompanyId(null);
        setActiveServiceKey(serviceKey);
        void checkAuthenticatedUserCompany();
        return;
      }

      setActiveServiceKey(serviceKey);
    },
    [checkAuthenticatedUserCompany],
  );

  /**
   * Close the current service modal.
   */
  const closeServiceModal = useCallback(() => {
    verificationLookupAbortRef.current?.abort();
    setActiveServiceKey(null);

    /*
     * Wait for the modal to unmount before restoring focus.
     */
    window.requestAnimationFrame(() => {
      const previousElement =
        lastFocusedElementRef.current;

      if (
        previousElement &&
        typeof previousElement.focus ===
          "function"
      ) {
        previousElement.focus();
      }
    });
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Derived modal state
  |--------------------------------------------------------------------------
  */
  const activeService = useMemo(
    () =>
      services.find(
        (service) =>
          service.key === activeServiceKey,
      ) ?? null,
    [services, activeServiceKey],
  );

  /*
   * MatchingModal owns its own modal shell.
   */
  const matchingModalOpen =
    activeServiceKey === SERVICE_KEYS.MATCHING;

  /*
   * BaseModal is used only for non-matching services.
   */
  const standardModalOpen =
    activeServiceKey !== null &&
    activeServiceKey !== SERVICE_KEYS.MATCHING;

  /**
   * Render the body of the standard BaseModal.
   *
   * MatchingModal is deliberately excluded.
   */
  const renderStandardModalContent = () => {
    switch (activeServiceKey) {
      case SERVICE_KEYS.PARTNER_PROGRAMS:
        return <PartnerProgramsModal />;

      case SERVICE_KEYS.VERIFICATION:
        if (verificationView === "loading") {
          return (
            <div role="status" aria-live="polite" style={{ padding: "32px", textAlign: "center" }}>
              Checking your submitted companies…
            </div>
          );
        }

        if (verificationView === "error") {
          return (
            <div role="alert" style={{ padding: "28px", textAlign: "center" }}>
              <p style={{ margin: "0 0 16px", color: "#a85846" }}>
                {verificationLookupError}
              </p>
              <button type="button" className="vr-btn" onClick={() => void checkAuthenticatedUserCompany()}>
                Try again
              </button>
            </div>
          );
        }

        return verificationView === "add" ? (

          <VerificationModal onViewCompany={viewCompany} hasRegisteredCompany={hasRegisteredCompany} onSubmitCompany={onSubmitCompany} />
        ) : (
          <CompanyDetailsModal
            onAddCompany={addCompany}
            onCompaniesLoaded={onCompaniesLoaded}

            initialCompanyId={initialCompanyId}
          />
        );

      case SERVICE_KEYS.VISIBILITY_LISTING:
        return <VisibilityListingModal />;

      default:
        return null;
    }
  };

  /*
   * Partner Programs and Verification currently control
   * their own actions and do not use the BaseModal footer.
   */
  const hideStandardModalFooter =
    activeServiceKey ===
      SERVICE_KEYS.PARTNER_PROGRAMS ||
    activeServiceKey ===
      SERVICE_KEYS.VERIFICATION;

  return (
    <ResponsiveController>
      <div className="dashboard-shell services-dashboard">
      <style>{dashboardCss}</style>

      <HorizontalNavigation activePath="/matching" />

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="dashboard-heading">
            <p>Tools for confident growth</p>
            <h1>Services</h1>
          </div>
          <div className="topbar-actions">
            <form className="topbar-search" action="/explore" role="search">
              <Search size={17} aria-hidden="true" />
              <label className="sr-only" htmlFor="services-search">Search businesses</label>
              <input id="services-search" name="q" type="search" placeholder="Search businesses…" />
            </form>
            {/* <a className="topbar-button" href="/request-trial">Request trial</a> */}
          </div>
        </header>

        <section className="dashboard-hero services-hero" aria-labelledby="services-hero-title">
          <div className="hero-copy">
            <span className="hero-kicker"><Sparkles size={15} /> Built for your next chapter</span>
            <h2 id="services-hero-title">Services that move you forward.</h2>
            <p>Build trust, find the right partners, and turn credible market intelligence into action.</p>
          </div>
          <div className="hero-count">
            <strong>{services.filter((service) => !service.hidden).length}</strong>
            <span>services available</span>
          </div>
        </section>

        <div className="services-container services-layout">
          <section
            className="svc-menu services-redesign"
            aria-labelledby="svcMenuTitle"
          >
            <h3
              id="svcMenuTitle"
              className="svc-title"
            >
              Choose a service
            </h3>

            <div className="svc-grid">
              {services.filter((service) => !service.hidden).map((service) => {
                const Icon = service.icon;
                return (
                <button
                  key={service.key}
                  type="button"
                  className="svc-box service-card"
                  onClick={() =>
                    openServiceModal(
                      service.key,
                    )
                  }
                  aria-haspopup="dialog"
                  aria-expanded={
                    activeServiceKey ===
                    service.key
                  }
                >
                  <span className="service-card-top">
                    <span className="service-icon"><Icon size={24} strokeWidth={1.75} aria-hidden="true" /></span>
                    <ArrowUpRight className="service-arrow" size={20} aria-hidden="true" />
                  </span>
                  <h3>{service.title}</h3>
                  <p>{service.subtitle}</p>
                  <span className="service-card-action">Explore service <ArrowUpRight size={16} aria-hidden="true" /></span>
                </button>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      <Footer />

      {/* =====================================================
          MATCHING MODAL

          Important:
          MatchingModal contains its own ModalShell.

          Do not wrap it with BaseModal.
      ====================================================== */}
      <MatchingModal
        open={matchingModalOpen}
        onClose={closeServiceModal}
      />

      {/* =====================================================
          STANDARD SERVICE MODAL

          This BaseModal is only for:
          - Partner Programs
          - Verification
          - Visibility & Listing
      ====================================================== */}
      <BaseModal
        open={standardModalOpen}
        onClose={closeServiceModal}
        title={activeServiceKey === SERVICE_KEYS.VERIFICATION && verificationView === "companies" ? "View Company" : activeService?.title ?? "Service"}
        subtitle={
          activeServiceKey === SERVICE_KEYS.VERIFICATION &&
          verificationView === "companies"
            ? "Company profiles and verification scores."
            : (activeService?.subtitle ?? "")
        }
        hideFooter={
          hideStandardModalFooter
        }
      >
        {renderStandardModalContent()}
      </BaseModal>

      <style>{`
        .services-dashboard .services-container {
          width: 100%;
          max-width: none;
          margin: 16px 0 0;
          padding: 0;
        }
        .services-dashboard .svc-menu {
          padding: 22px;
          border: 1px solid var(--dash-line);
          border-radius: 17px;
          background: #fbf8f3;
          box-shadow: 0 8px 24px rgba(72,47,30,.06);
        }
        .services-dashboard .svc-title {
          margin: 0 0 16px;
          color: var(--dash-ink);
          font-size: 1.12rem;
          letter-spacing: -.025em;
        }
        .services-dashboard .svc-title::before {
          content: "Available services";
          display: block;
          margin-bottom: 5px;
          color: var(--dash-blue);
          font-size: .68rem;
          font-weight: 900;
          letter-spacing: .1em;
          text-transform: uppercase;
        }
        .services-dashboard .svc-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 15px;
        }
        .services-dashboard .service-card {
          position: relative;
          min-height: 238px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 21px;
          overflow: hidden;
          border: 1px solid var(--dash-line);
          border-radius: 16px;
          color: var(--dash-ink);
          background: linear-gradient(145deg,#fbf8f3,#f4ece2);
          text-align: left;
          cursor: pointer;
          transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
        }
        .services-dashboard .service-card::after {
          content: "";
          position: absolute;
          inset: auto 0 0;
          height: 4px;
          background: linear-gradient(90deg,#5b3825,#b57b3f);
        }
        .services-dashboard .service-card:hover {
          transform: translateY(-3px);
          border-color: #cdb79f;
          box-shadow: 0 14px 30px rgba(72,47,30,.11);
        }
        .services-dashboard .service-card:focus-visible {
          outline: 3px solid rgba(143,104,71,.22);
          outline-offset: 2px;
        }
        .services-dashboard .service-card-top {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .services-dashboard .service-icon {
          display: grid;
          place-items: center;
          width: 43px;
          height: 43px;
          border-radius: 12px;
          color: #fff;
          background: linear-gradient(145deg,#8f6847,#5b3825);
          box-shadow: 0 8px 18px rgba(91,56,37,.2);
        }
        .services-dashboard .service-arrow { color: #9a8d82; transition: transform .18s ease, color .18s ease; }
        .services-dashboard .service-card:hover .service-arrow { color: var(--dash-blue); transform: translate(2px, -2px); }
        .services-dashboard .service-card h3 { margin: 25px 0 8px; font-size: 1.05rem; }
        .services-dashboard .service-card p { margin: 0; color: #7a746d; font-size: .82rem; line-height: 1.6; }
        .services-dashboard .service-card-action { display: inline-flex; align-items: center; gap: 7px; margin-top: auto; padding-top: 18px; color: var(--dash-blue); font-size: .76rem; font-weight: 850; }
        .services-dashboard .dashboard-main button:not(.service-card) {
          min-height: 43px;
          padding-inline: 17px;
          border-radius: 10px;
          font-size: .84rem;
        }
        .services-dashboard .dashboard-main input,
        .services-dashboard .dashboard-main select,
        .services-dashboard .dashboard-main textarea {
          border-color: var(--dash-line);
          color: var(--dash-ink);
          background: #fbf8f3;
        }
        .services-dashboard .dashboard-main button:focus-visible,
        .services-dashboard .dashboard-main input:focus-visible,
        .services-dashboard .dashboard-main select:focus-visible,
        .services-dashboard .dashboard-main textarea:focus-visible {
          outline: 0;
          border-color: #8f6847;
          box-shadow: 0 0 0 3px rgba(143,104,71,.15);
        }
        @media (max-width: 1080px) {
          .services-dashboard .svc-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 640px) {
          .services-dashboard .svc-menu { padding: 15px; }
          .services-dashboard .svc-grid { grid-template-columns: 1fr; }
          .services-dashboard .service-card { min-height: 210px; }
        }
      `}</style>
      </div>
    </ResponsiveController>
  );
}


