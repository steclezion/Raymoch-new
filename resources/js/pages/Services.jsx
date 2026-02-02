// resources/js/components/services/Services.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import Header from "../components/layout_master/Header.jsx";
import Footer from "../components/layout_master/Footer.jsx";

import "../components/services/services.css";

import BaseModal from "../components/modals/BaseModal.jsx";
import MatchingModal from "../components/modals/MatchingModal.jsx";
import PartnerProgramsModal from "../components/modals/PartnerProgramsModal.jsx";
import VerificationModal from "../components/modals/VerificationModal.jsx";
import VisibilityListingModal from "../components/modals/VisibilityListingModal.jsx";

export default function Services() {
  /* ================= Header menu JS (your existing logic) ================= */
  useEffect(() => {
    const cleanup = (() => {
      const btn = document.getElementById("exploreToggle");
      const menu = document.getElementById("t1Menu");
      if (!btn || !menu) return null;

      const openMenu = (on) => {
        btn.setAttribute("aria-expanded", on ? "true" : "false");
        menu.hidden = !on;
      };

      const onBtnClick = (e) => {
        e.preventDefault();
        openMenu(btn.getAttribute("aria-expanded") !== "true");
      };

      const onDocClick = (e) => {
        if (!menu.hidden && !menu.contains(e.target) && !btn.contains(e.target)) openMenu(false);
      };

      const onKeyDown = (e) => {
        if (e.key === "Escape") openMenu(false);
      };

      btn.addEventListener("click", onBtnClick);
      document.addEventListener("click", onDocClick);
      document.addEventListener("keydown", onKeyDown);

      return () => {
        btn.removeEventListener("click", onBtnClick);
        document.removeEventListener("click", onDocClick);
        document.removeEventListener("keydown", onKeyDown);
      };
    })();

    (() => {
      const menu = document.getElementById("t1Menu");
      menu?.querySelectorAll("a.menu-item").forEach((a) => a.setAttribute("role", "menuitem"));
    })();

    return () => {
      if (typeof cleanup === "function") cleanup();
    };
  }, []);

  /* ================= Services list ================= */
  const services = useMemo(
    () => [
      { key: "matching", title: "Matching", subtitle: "Investor inputs → ranked SME matches." },
      { key: "partner-programs", title: "Partner Programs", subtitle: "Accelerators & syndicates, plugged in." },
      { key: "verification", title: "Verification", subtitle: "CTI checks: identity, ownership, basics." },
      { key: "visibility-listing", title: "Visibility & Listing", subtitle: "Get listed. Get discovered." },
    ],
    []
  );

  /* ================= Modal state ================= */
  const [open, setOpen] = useState(false);
  const [activeKey, setActiveKey] = useState(null);
  const lastFocusedRef = useRef(null);

  const openServiceModal = (key) => {
    lastFocusedRef.current = document.activeElement;
    setActiveKey(key);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setActiveKey(null);
    setTimeout(() => {
      const el = lastFocusedRef.current;
      if (el && typeof el.focus === "function") el.focus();
    }, 0);
  };

  const activeService = services.find((s) => s.key === activeKey);

  return (
    <>
      <Header />

      <section className="services-page-hero" aria-label="Raymoch Services">
        <div className="services-wrap">
          <h2>Services</h2>
          <p>Build trust. Get seen. Partner smart.</p>
        </div>
      </section>

      <main>
        <div className="services-container">
          <section className="svc-menu" aria-labelledby="svcMenuTitle">
            <h3 id="svcMenuTitle" className="svc-title">
              Choose a service
            </h3>

            <div className="svc-grid">
              <button type="button" className="svc-box svc-col-3" onClick={() => openServiceModal("matching")}>
                <h3>Matching</h3>
                <p>Investor inputs → ranked SME matches.</p>
              </button>

              <button type="button" className="svc-box svc-col-3" onClick={() => openServiceModal("partner-programs")}>
                <h3>Partner Programs</h3>
                <p>Accelerators &amp; syndicates, plugged in.</p>
              </button>

              <button type="button" className="svc-box svc-col-3" onClick={() => openServiceModal("verification")}>
                <h3>Verification</h3>
                <p>CTI checks: identity, ownership, basics.</p>
              </button>

              <button type="button" className="svc-box svc-col-3" onClick={() => openServiceModal("visibility-listing")}>
                <h3>Visibility &amp; Listing</h3>
                <p>Get listed. Get discovered.</p>
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* ===================== MODAL SHELL ===================== */}
      <BaseModal
        open={open}
        onClose={closeModal}
        title={
          activeKey === "matching" ? "Preferences & Matches" : activeService?.title || "Service"
        }
        subtitle={
          activeKey === "matching"
            ? "Adjust if needed. We show bands only — no private scores."
            : activeService?.subtitle || ""
        }
        hideFooter={activeKey === "partner-programs" || activeKey === "verification"}
        footerRight={
          activeKey === "matching" ? (
            <button
              type="button"
              className="rm-btn rm-btn-primary"
              onClick={() => {
                // MatchingModal exposes its state in console; you can also lift state up later if you want
                alert("Continue clicked. You can wire this to submit Matching preferences.");
              }}
            >
              Continue
            </button>
          ) : null
        }
      >
        {activeKey === "matching" && <MatchingModal />}
        {activeKey === "partner-programs" && <PartnerProgramsModal />}
        {activeKey === "verification" && <VerificationModal />}
     {activeKey === "visibility-listing" && <VisibilityListingModal />}
      </BaseModal>

      <Footer />
    </>
  );
}
