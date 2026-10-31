import React, { useEffect, useId, useState } from "react";
import "../styles/cookie-preferences.css";

const STORAGE_PREFIX = "raymoch:cookie-consent:";
const CONSENT_VERSION = "1";
const ANONYMOUS_ID_KEY = `${STORAGE_PREFIX}anonymous-id`;
const DEFAULT_PREFERENCES = {
  functionality: false,
  measurement: false,
  marketing: false,
};

function readPreferences() {
  const savedVersion = localStorage.getItem(`${STORAGE_PREFIX}version`);
  const savedAt = localStorage.getItem(`${STORAGE_PREFIX}saved-at`);

  if (savedVersion !== CONSENT_VERSION || !savedAt) return null;

  return {
    functionality: localStorage.getItem(`${STORAGE_PREFIX}functionality`) === "true",
    measurement: localStorage.getItem(`${STORAGE_PREFIX}measurement`) === "true",
    marketing: localStorage.getItem(`${STORAGE_PREFIX}marketing`) === "true",
  };
}

function persistPreferences(preferences) {
  Object.entries(preferences).forEach(([name, enabled]) => {
    localStorage.setItem(`${STORAGE_PREFIX}${name}`, String(enabled));
  });
  localStorage.setItem(`${STORAGE_PREFIX}version`, CONSENT_VERSION);
  localStorage.setItem(`${STORAGE_PREFIX}saved-at`, new Date().toISOString());

  // A small first-party marker lets server-rendered pages know a choice exists.
  document.cookie = `raymoch_cookie_consent=${CONSENT_VERSION}; Max-Age=31536000; Path=/; SameSite=Lax${
    window.location.protocol === "https:" ? "; Secure" : ""
  }`;

  window.dispatchEvent(
    new CustomEvent("raymoch:cookie-preferences", { detail: { ...preferences } })
  );
}

function getAnonymousId() {
  let id = localStorage.getItem(ANONYMOUS_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(ANONYMOUS_ID_KEY, id);
  }
  return id;
}

async function syncPreferences(preferences) {
  const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "";
  const response = await fetch("/cookie-consents", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(csrf ? { "X-CSRF-TOKEN": csrf } : {}),
    },
    body: JSON.stringify({
      anonymous_id: getAnonymousId(),
      consent_version: CONSENT_VERSION,
      preferences,
    }),
  });
  if (!response.ok) throw new Error(`Cookie consent sync failed (${response.status}).`);
}

function PreferenceToggle({ id, label, description, checked, onChange }) {
  return (
    <div className="cookie-preference-row">
      <div>
        <label className="cookie-preference-label" htmlFor={id}>{label}</label>
        <p>{description}</p>
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={`${label} cookies`}
        className="cookie-toggle"
        onClick={() => onChange(!checked)}
      >
        <span />
      </button>
    </div>
  );
}

export default function CookiePreferences() {
  const titleId = useId();
  const descriptionId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);

  useEffect(() => {
    try {
      const saved = readPreferences();
      if (saved) setPreferences(saved);
      else setIsOpen(true);
    } catch {
      setIsOpen(true);
    }

    const openPanel = () => {
      try {
        setPreferences(readPreferences() || DEFAULT_PREFERENCES);
      } catch {
        setPreferences(DEFAULT_PREFERENCES);
      }
      setIsOpen(true);
    };

    const onCookieSettingsClick = (event) => {
      const link = event.target.closest("a, button");
      if (!link) return;
      const label = link.textContent?.trim().toLowerCase();
      if (label === "cookie settings" || link.matches("[data-cookie-settings]")) {
        event.preventDefault();
        openPanel();
      }
    };

    window.addEventListener("raymoch:open-cookie-preferences", openPanel);
    document.addEventListener("click", onCookieSettingsClick);
    window.RaymochCookiePreferences = { open: openPanel };

    return () => {
      window.removeEventListener("raymoch:open-cookie-preferences", openPanel);
      document.removeEventListener("click", onCookieSettingsClick);
      delete window.RaymochCookiePreferences;
    };
  }, []);

  const save = (nextPreferences) => {
    try {
      persistPreferences(nextPreferences);
    } finally {
      setPreferences(nextPreferences);
      setIsOpen(false);
    }
    syncPreferences(nextPreferences).catch((error) => {
      console.warn("Cookie preferences were saved in this browser but could not be synchronized.", error);
    });
  };

  if (!isOpen) return null;

  return (
    <section
      className="cookie-preferences"
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <button
        className="cookie-close"
        type="button"
        aria-label="Close and reject optional cookies"
        onClick={() => save(DEFAULT_PREFERENCES)}
      >
        ×
      </button>

      <div className="cookie-brand" aria-hidden="true">R</div>
      <p className="cookie-eyebrow">Your privacy, your choice</p>
      <h2 id={titleId}>Cookie preferences</h2>
      <div id={descriptionId} className="cookie-copy">
        <p>
          Raymoch uses cookies or similar technologies for technical purposes and,
          with your consent, for <strong>functionality, measurement, and marketing
          (personalized ads)</strong>, as described in our{" "}
          <a href="/cookies">cookie policy</a>.
        </p>
        <p>
          You can give, deny, or withdraw your consent at any time by reopening this
          preferences panel. Denying consent may make related features unavailable.
        </p>
      </div>

      <div className="cookie-preference-list" aria-label="Optional cookie categories">
        <PreferenceToggle
          id="cookie-functionality"
          label="Functionality"
          description="Remembers choices and enables enhanced site features."
          checked={preferences.functionality}
          onChange={(value) => setPreferences((current) => ({ ...current, functionality: value }))}
        />
        <PreferenceToggle
          id="cookie-measurement"
          label="Measurement"
          description="Helps us understand site usage and improve performance."
          checked={preferences.measurement}
          onChange={(value) => setPreferences((current) => ({ ...current, measurement: value }))}
        />
        <PreferenceToggle
          id="cookie-marketing"
          label="Marketing"
          description="Supports relevant communications and personalized ads."
          checked={preferences.marketing}
          onChange={(value) => setPreferences((current) => ({ ...current, marketing: value }))}
        />
      </div>

      <div className="cookie-actions cookie-actions-primary">
        <button type="button" className="cookie-button cookie-button-primary" onClick={() => save({ functionality: true, measurement: true, marketing: true })}>
          Accept all
        </button>
        <button type="button" className="cookie-button cookie-button-secondary" onClick={() => save(DEFAULT_PREFERENCES)}>
          Reject all
        </button>
      </div>
      <div className="cookie-actions cookie-actions-footer">
        <button type="button" className="cookie-save" onClick={() => save(preferences)}>
          Save and continue
        </button>
        <a href="/cookies" className="cookie-learn-more">Learn more</a>
      </div>
    </section>
  );
}
