// resources/js/components/services/Services.jsx

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/*
|--------------------------------------------------------------------------
| Layout components
|--------------------------------------------------------------------------
|
| Services.jsx is already inside:
| resources/js/components/services
|
| Therefore, use ../layout_master rather than
| ../components/layout_master.
|
*/
import Header from "../components/layout_master/Header.jsx";
import Footer from "../components/layout_master/Footer.jsx";



/*
|--------------------------------------------------------------------------
| Service page styling
|--------------------------------------------------------------------------
*/
import "../components/services/services.css";

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
export default function Services() {
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
        subtitle:
          "Investor inputs → ranked SME matches.",
      },
      {
        key: SERVICE_KEYS.PARTNER_PROGRAMS,
        title: "Partner Programs",
        subtitle:
          "Accelerators & syndicates, plugged in.",
      },
      {
        key: SERVICE_KEYS.VERIFICATION,
        title: "Verification",
        subtitle:
          "CTI checks: identity, ownership, basics.",
      },
      {
        key: SERVICE_KEYS.VISIBILITY_LISTING,
        title: "Visibility & Listing",
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

      setActiveServiceKey(serviceKey);
    },
    [],
  );

  /**
   * Close the current service modal.
   */
  const closeServiceModal = useCallback(() => {
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
        return <VerificationModal />;

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
    <>
      <Header />

      {/* =====================================================
          SERVICES HERO
      ====================================================== */}
      <section
        className="services-page-hero"
        aria-label="Raymoch Services"
      >
        <div className="services-wrap">
          <h2>Services</h2>

          <p>
            Build trust. Get seen. Partner smart.
          </p>
        </div>
      </section>

      {/* =====================================================
          SERVICES LIST
      ====================================================== */}
      <main>
        <div className="services-container">
          <section
            className="svc-menu"
            aria-labelledby="svcMenuTitle"
          >
            <h3
              id="svcMenuTitle"
              className="svc-title"
            >
              Choose a service
            </h3>

            <div className="svc-grid">
              {services.map((service) => (
                <button
                  key={service.key}
                  type="button"
                  className="svc-box svc-col-3"
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
                  <h3>{service.title}</h3>

                  <p>{service.subtitle}</p>
                </button>
              ))}
            </div>
          </section>
        </div>
      </main>

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
        title={activeService?.title ?? "Service"}
        subtitle={
          activeService?.subtitle ?? ""
        }
        hideFooter={
          hideStandardModalFooter
        }
      >
        {renderStandardModalContent()}
      </BaseModal>

      <Footer />
    </>
  );
}