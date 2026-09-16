import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import ModalShell from "./ModalShell";
import MatchResultsModal from "./MatchResultsModal";
import PreviousSearchesModal from "./PreviousSearchesModal";

import {
  createMatchSearch,
  fetchMatchingOptions,
  fetchSavedSearch,
  rerunSavedSearch,
} from "./matchingApi";

import "./matchingModal.css";

/**
 * Investor preference and matching modal.
 *
 * Flow:
 *
 * 1. Load selectable options.
 * 2. Investor enters preferences.
 * 3. Continue sends the preferences to Laravel.
 * 4. Laravel saves the preference.
 * 5. Laravel executes the matching algorithm.
 * 6. Results are displayed in MatchResultsModal.
 * 7. Previous searches remain available.
 */
export default function MatchingModal({
  open = true,
  onClose = () => {},
}) {
  /*
   |--------------------------------------------------------------------------
   | Option-list state
   |--------------------------------------------------------------------------
   */
  const [loadingOptions, setLoadingOptions] =
    useState(false);

  const [fundingInstruments, setFundingInstruments] =
    useState([]);

  const [countries, setCountries] = useState([]);
  const [sectors, setSectors] = useState([]);

  const [optionsError, setOptionsError] =
    useState("");

  /*
   |--------------------------------------------------------------------------
   | Preference form state
   |--------------------------------------------------------------------------
   */
  const [ticketMin, setTicketMin] =
    useState(24000);

  const [ticketMax, setTicketMax] =
    useState(56000);

  const [currencyCode] = useState("USD");

  const [startFromMonth, setStartFromMonth] =
    useState(0);

  const [startToMonth, setStartToMonth] =
    useState(6);

  const [
    selectedFundingInstrumentIds,
    setSelectedFundingInstrumentIds,
  ] = useState([]);

  const [
    selectedSectorIds,
    setSelectedSectorIds,
  ] = useState([]);

  const [
    selectedCountryIds,
    setSelectedCountryIds,
  ] = useState([]);

  const [
    verifiedCompaniesOnly,
    setVerifiedCompaniesOnly,
  ] = useState(false);

  /*
   |--------------------------------------------------------------------------
   | Submission and error state
   |--------------------------------------------------------------------------
   */
  const [submitting, setSubmitting] =
    useState(false);

  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] =
    useState({});

  /*
   |--------------------------------------------------------------------------
   | Child-modal state
   |--------------------------------------------------------------------------
   */
  const [resultsOpen, setResultsOpen] =
    useState(false);

  const [historyOpen, setHistoryOpen] =
    useState(false);

  const [resultPayload, setResultPayload] =
    useState(null);

  const [refreshingResults, setRefreshingResults] =
    useState(false);

  /*
   * Used to select all funding instruments only during
   * the first successful option load.
   */
  const fundingDefaultsInitialized =
    useRef(false);

  /*
   |--------------------------------------------------------------------------
   | Load countries, sectors, and funding instruments
   |--------------------------------------------------------------------------
   */
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const controller = new AbortController();

    async function loadOptions() {
      setLoadingOptions(true);
      setOptionsError("");

      try {
        const data = await fetchMatchingOptions(
          controller.signal,
        );

        const loadedFundingInstruments =
          Array.isArray(data?.funding_instruments)
            ? data.funding_instruments
            : [];

        const loadedCountries = Array.isArray(
          data?.countries,
        )
          ? data.countries
          : [];

        const loadedSectors = Array.isArray(
          data?.sectors,
        )
          ? data.sectors
          : [];

        setFundingInstruments(
          loadedFundingInstruments,
        );

        setCountries(loadedCountries);
        setSectors(loadedSectors);

        /*
         * Initially enable every available funding
         * instrument, matching your original design.
         */
        if (
          !fundingDefaultsInitialized.current &&
          loadedFundingInstruments.length > 0
        ) {
          setSelectedFundingInstrumentIds(
            loadedFundingInstruments.map(
              (instrument) =>
                String(instrument.id),
            ),
          );

          fundingDefaultsInitialized.current = true;
        }
      } catch (error) {
        if (error?.name === "AbortError") {
          return;
        }

        setOptionsError(
          error?.message ??
            "The matching options could not be loaded.",
        );

        setFundingInstruments([]);
        setCountries([]);
        setSectors([]);
      } finally {
        if (!controller.signal.aborted) {
          setLoadingOptions(false);
        }
      }
    }

    loadOptions();

    return () => {
      controller.abort();
    };
  }, [open]);

  /*
   |--------------------------------------------------------------------------
   | Build the API payload
   |--------------------------------------------------------------------------
   */
  const requestPayload = useMemo(
    () => ({
      ticket_min: Number(ticketMin),
      ticket_max: Number(ticketMax),

      currency_code: currencyCode,

      start_from_month: Number(startFromMonth),
      start_to_month: Number(startToMonth),

      funding_instrument_ids:
        selectedFundingInstrumentIds,

      business_sector_ids: selectedSectorIds,
      country_ids: selectedCountryIds,

      verified_companies_only:
        verifiedCompaniesOnly,
    }),
    [
      ticketMin,
      ticketMax,
      currencyCode,
      startFromMonth,
      startToMonth,
      selectedFundingInstrumentIds,
      selectedSectorIds,
      selectedCountryIds,
      verifiedCompaniesOnly,
    ],
  );

  /*
   |--------------------------------------------------------------------------
   | Selection helpers
   |--------------------------------------------------------------------------
   */
  const toggleFundingInstrument = (
    instrumentId,
  ) => {
    const normalizedId = String(instrumentId);

    setSelectedFundingInstrumentIds(
      (currentIds) =>
        currentIds.includes(normalizedId)
          ? currentIds.filter(
              (id) => id !== normalizedId,
            )
          : [...currentIds, normalizedId],
    );
  };

  const handleMultiSelect = (event, setter) => {
    const selectedIds = Array.from(
      event.target.selectedOptions,
    ).map((option) => String(option.value));

    setter(selectedIds);
  };

  const clearSectors = () =>
    setSelectedSectorIds([]);

  const clearCountries = () =>
    setSelectedCountryIds([]);

  const getFieldError = (fieldName) => {
    const messages = fieldErrors?.[fieldName];

    return Array.isArray(messages)
      ? messages[0]
      : "";
  };

  /*
   |--------------------------------------------------------------------------
   | Client-side validation
   |--------------------------------------------------------------------------
   */
  const validateBeforeSubmit = () => {
    if (
      !Number.isFinite(Number(ticketMin)) ||
      Number(ticketMin) < 0
    ) {
      return "Enter a valid minimum ticket amount.";
    }

    if (
      !Number.isFinite(Number(ticketMax)) ||
      Number(ticketMax) < 0
    ) {
      return "Enter a valid maximum ticket amount.";
    }

    if (Number(ticketMin) > Number(ticketMax)) {
      return "The minimum ticket cannot exceed the maximum ticket.";
    }

    if (
      Number(startFromMonth) >
      Number(startToMonth)
    ) {
      return "The starting month cannot exceed the ending month.";
    }

    if (
      selectedFundingInstrumentIds.length === 0
    ) {
      return "Select at least one funding instrument.";
    }

    if (selectedSectorIds.length === 0) {
      return "Select at least one investment sector.";
    }

    if (selectedCountryIds.length === 0) {
      return "Select at least one investment country.";
    }

    return "";
  };

  /*
   |--------------------------------------------------------------------------
   | Continue: save preference and execute matching
   |--------------------------------------------------------------------------
   */
  const handleContinue = async () => {
    const validationMessage =
      validateBeforeSubmit();

    setFieldErrors({});

    if (validationMessage) {
      setFormError(validationMessage);
      return;
    }

    setSubmitting(true);
    setFormError("");

    try {
      /*
       * This POST request triggers:
       *
       * StoreInvestorPreferenceRequest
       *      ↓
       * InvestorMatchingController
       *      ↓
       * InvestorMatchingService
       *      ↓
       * Database and scoring algorithm
       */
      const response =  await createMatchSearch(requestPayload);

      setResultPayload(response);
      setResultsOpen(true);
    } catch (error) {
      setFormError(
        error?.message ??
          "The matching process could not be completed.",
      );

      setFieldErrors(error?.errors ?? {});
    } finally {
      setSubmitting(false);
    }
  };

  /*
   |--------------------------------------------------------------------------
   | Open a previously saved search
   |--------------------------------------------------------------------------
   */
  const handleOpenSavedSearch = async (
    preferenceId,
  ) => {
    const response =
      await fetchSavedSearch(preferenceId);

    setHistoryOpen(false);
    setResultPayload(response);
    setResultsOpen(true);
  };

  /*
   |--------------------------------------------------------------------------
   | Restore a previous preference into the main form
   |--------------------------------------------------------------------------
   */
  const applyPreferenceToForm = (
    preference,
  ) => {
    if (!preference) {
      return;
    }

    setTicketMin(
      Number(preference.ticket_min ?? 0),
    );

    setTicketMax(
      Number(preference.ticket_max ?? 0),
    );

    setStartFromMonth(
      Number(
        preference.start_from_month ?? 0,
      ),
    );

    setStartToMonth(
      Number(preference.start_to_month ?? 0),
    );

    setSelectedFundingInstrumentIds(
      Array.isArray(
        preference.funding_instrument_ids,
      )
        ? preference.funding_instrument_ids.map(
            String,
          )
        : [],
    );

    setSelectedSectorIds(
      Array.isArray(
        preference.business_sector_ids,
      )
        ? preference.business_sector_ids.map(
            String,
          )
        : [],
    );

    setSelectedCountryIds(
      Array.isArray(preference.country_ids)
        ? preference.country_ids.map(String)
        : [],
    );

    setVerifiedCompaniesOnly(
      Boolean(
        preference.verified_companies_only,
      ),
    );

    setHistoryOpen(false);
    setResultsOpen(false);
    setFormError("");
    setFieldErrors({});
  };

  /*
   |--------------------------------------------------------------------------
   | Rerun a saved search against current company data
   |--------------------------------------------------------------------------
   */
  const handleRefreshResults = async () => {
    const preferenceId =
      resultPayload?.meta?.preference?.id;

    if (!preferenceId) {
      return;
    }

    setRefreshingResults(true);

    try {
      const refreshedResponse =
        await rerunSavedSearch(preferenceId);

      setResultPayload(refreshedResponse);
    } catch (error) {
      setFormError(
        error?.message ??
          "The saved search could not be refreshed.",
      );
    } finally {
      setRefreshingResults(false);
    }
  };

  /*
   * Close the parent and all its child modals.
   */
  const handleCloseAll = () => {
    setResultsOpen(false);
    setHistoryOpen(false);
    onClose();
  };

  return (
    <>
      <style>{`
        /* Home-aligned Raymoch coffee theme. Matching behavior is unchanged. */
        .match-wrap {
          --match-espresso: #5b3825;
          --match-espresso-dark: #382116;
          --match-coffee: #8b6248;
          --match-taupe: #7a746d;
          --match-oat: #ded2c3;
          --match-ivory: #f7f2ea;
          --match-card: #fbf8f3;
          --match-gold: #b57b3f;
          --match-green: #2f6f4f;
          --match-danger: #a85846;
          color: var(--match-espresso-dark) !important;
          background:
            radial-gradient(circle at 94% 0, rgba(181,123,63,.10), transparent 25rem),
            linear-gradient(180deg,#fffdf9 0,var(--match-ivory) 22rem) !important;
          scrollbar-color: #a98b76 #eee5da;
        }
        .match-wrap :is(.match-card,.payload-details) {
          border-color: var(--match-oat) !important;
          background: rgba(251,248,243,.97) !important;
          color: var(--match-espresso-dark) !important;
          box-shadow: 0 10px 26px rgba(73,45,29,.08) !important;
        }
        .match-wrap :is(.label,.label.big,summary,strong) { color: var(--match-espresso-dark) !important; }
        .match-wrap :is(.help,.multi-select-help,.range-separator) { color: var(--match-taupe) !important; }
        .match-wrap :is(.input,.multi-select) {
          min-height: 43px !important;
          border: 1px solid #d5c6b7 !important;
          border-radius: 10px !important;
          background: #fffdf9 !important;
          color: var(--match-espresso-dark) !important;
          box-shadow: inset 0 1px 2px rgba(73,45,29,.035) !important;
        }
        .match-wrap .multi-select { min-height: 152px !important; }
        .match-wrap :is(.input,.multi-select):focus {
          border-color: var(--match-coffee) !important;
          outline: 3px solid rgba(139,98,72,.16) !important;
          box-shadow: none !important;
        }
        .match-wrap :is(.input,.multi-select)::placeholder { color: #9c9187 !important; }
        .match-wrap .pill {
          min-height: 40px !important;
          border-color: #d5c6b7 !important;
          border-radius: 999px !important;
          background: #fffdf9 !important;
          color: #684b35 !important;
          box-shadow: 0 3px 10px rgba(73,45,29,.05) !important;
        }
        .match-wrap .pill:hover { border-color: #a98265 !important; background: #f6eee5 !important; }
        .match-wrap .pill--selected {
          border-color: var(--match-espresso) !important;
          background: #eadbca !important;
          color: var(--match-espresso-dark) !important;
          box-shadow: 0 0 0 3px rgba(139,98,72,.11) !important;
        }
        .match-wrap :is(input[type=checkbox],input[type=radio]) { accent-color: var(--match-espresso) !important; }
        .match-wrap .verification-check {
          border-color: var(--match-oat) !important;
          border-radius: 11px !important;
          background: #f3eadf !important;
          color: var(--match-espresso-dark) !important;
        }
        .match-wrap .ms-clear {
          min-width: 38px !important;
          min-height: 38px !important;
          border-color: #cbb9a7 !important;
          border-radius: 9px !important;
          background: #f4ebe1 !important;
          color: var(--match-espresso) !important;
        }
        .match-wrap .ms-clear:hover:not(:disabled) { background: #eadbca !important; }
        .match-wrap .payload {
          border-color: var(--match-oat) !important;
          background: #eee5da !important;
          color: #513321 !important;
          scrollbar-color: #a98b76 #e3d6c8;
        }
        .match-wrap .match-alert--error,
        .match-wrap :is(.field-error,.help.error) {
          border-color: #dfb9ad !important;
          background: #f8ebe6 !important;
          color: var(--match-danger) !important;
        }
        .match-button {
          min-height: 43px !important;
          padding: 0 17px !important;
          border-radius: 10px !important;
          font-weight: 750 !important;
          transition: transform .18s ease,box-shadow .18s ease,background .18s ease !important;
        }
        .match-button--primary {
          border: 1px solid var(--match-espresso, #5b3825) !important;
          background: linear-gradient(135deg,var(--match-espresso, #5b3825),var(--match-espresso-dark, #382116)) !important;
          color: #fffaf3 !important;
          box-shadow: 0 7px 16px rgba(73,45,29,.17) !important;
        }
        .match-button--secondary,
        .match-button--history {
          border: 1px solid #cbb9a7 !important;
          background: #fffdf9 !important;
          color: #5b3825 !important;
          box-shadow: 0 4px 12px rgba(73,45,29,.07) !important;
        }
        .match-button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 10px 22px rgba(73,45,29,.20) !important;
        }
        :is(.match-button,.match-wrap button,.match-wrap input,.match-wrap select):focus-visible {
          outline: 3px solid rgba(181,123,63,.30) !important;
          outline-offset: 3px !important;
        }
        :is(.match-button,.match-wrap button):disabled { opacity: .56; box-shadow: none !important; }
        @media (prefers-reduced-motion: reduce) {
          .match-wrap *, .match-wrap *::before, .match-wrap *::after, .match-button {
            scroll-behavior:auto !important; animation-duration:.01ms !important; animation-iteration-count:1 !important;
          }
        }
      `}</style>
      <ModalShell
        open={open}
        title="Preferences & Matches"
        subtitle="Adjust your investment preferences. Public matching bands are shown without private numeric scores."
        onClose={handleCloseAll}
        closeOnEscape={
          !resultsOpen && !historyOpen
        }
        closeOnBackdrop={false}
        size="xl"
        level={0}
        footer={
          <>
            <div className="modal-footer-left">
              <button
                type="button"
                className="match-button match-button--secondary"
                onClick={handleCloseAll}
                disabled={submitting}
              >
                Back
              </button>

              <button
                type="button"
                className="match-button match-button--history"
                onClick={() =>
                  setHistoryOpen(true)
                }
                disabled={submitting}
              >
                Previous Searches
              </button>
            </div>

            <button
              type="button"
              className="match-button match-button--primary"
              onClick={handleContinue}
              disabled={
                submitting || loadingOptions
              }
            >
              {submitting
                ? "Finding Matches..."
                : "Continue"}
            </button>
          </>
        }
      >
        <div className="match-wrap">
          {formError ? (
            <div
              className="match-alert match-alert--error"
              role="alert"
            >
              {formError}
            </div>
          ) : null}

          <div className="match-card">
            <div className="form-row">
              <div className="form-field">
                <label
                  className="label"
                  htmlFor="ticket-min"
                >
                  Ticket — minimum
                </label>

                <input
                  id="ticket-min"
                  className={`input ${
                    getFieldError("ticket_min")
                      ? "input--error"
                      : ""
                  }`}
                  type="number"
                  value={ticketMin}
                  onChange={(event) =>
                    setTicketMin(
                      Number(
                        event.target.value,
                      ),
                    )
                  }
                  min={0}
                  step="0.01"
                />

                {getFieldError("ticket_min") ? (
                  <div className="field-error">
                    {getFieldError("ticket_min")}
                  </div>
                ) : null}
              </div>

              <div className="form-field">
                <label
                  className="label"
                  htmlFor="ticket-max"
                >
                  Ticket — maximum
                </label>

                <input
                  id="ticket-max"
                  className={`input ${
                    getFieldError("ticket_max")
                      ? "input--error"
                      : ""
                  }`}
                  type="number"
                  value={ticketMax}
                  onChange={(event) =>
                    setTicketMax(
                      Number(
                        event.target.value,
                      ),
                    )
                  }
                  min={0}
                  step="0.01"
                />

                {getFieldError("ticket_max") ? (
                  <div className="field-error">
                    {getFieldError("ticket_max")}
                  </div>
                ) : null}
              </div>

              <div className="form-field">
                <div className="label">
                  Start timing — months
                </div>

                <div className="inline-range">
                  <div>
                    <label
                      className="visually-hidden"
                      htmlFor="start-from-month"
                    >
                      Earliest starting month
                    </label>

                    <input
                      id="start-from-month"
                      className="input"
                      type="number"
                      value={startFromMonth}
                      onChange={(event) =>
                        setStartFromMonth(
                          Number(
                            event.target.value,
                          ),
                        )
                      }
                      min={0}
                      max={120}
                    />
                  </div>

                  <span className="range-separator">
                    to
                  </span>

                  <div>
                    <label
                      className="visually-hidden"
                      htmlFor="start-to-month"
                    >
                      Latest starting month
                    </label>

                    <input
                      id="start-to-month"
                      className="input"
                      type="number"
                      value={startToMonth}
                      onChange={(event) =>
                        setStartToMonth(
                          Number(
                            event.target.value,
                          ),
                        )
                      }
                      min={0}
                      max={120}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="step2-grid">
            <div className="match-card">
              <div className="label big">
                Funding instruments
              </div>

              <div className="pills">
                {fundingInstruments.map(
                  (instrument) => {
                    const instrumentId = String(
                      instrument.id,
                    );

                    const checked =
                      selectedFundingInstrumentIds.includes(
                        instrumentId,
                      );

                    return (
                      <label
                        className={`pill ${
                          checked
                            ? "pill--selected"
                            : ""
                        }`}
                        key={instrument.id}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            toggleFundingInstrument(
                              instrument.id,
                            )
                          }
                        />

                        <span>
                          {instrument.name}
                        </span>
                      </label>
                    );
                  },
                )}
              </div>

              {getFieldError(
                "funding_instrument_ids",
              ) ? (
                <div className="field-error">
                  {getFieldError(
                    "funding_instrument_ids",
                  )}
                </div>
              ) : null}

              <label className="verification-check">
                <input
                  type="checkbox"
                  checked={verifiedCompaniesOnly}
                  onChange={(event) =>
                    setVerifiedCompaniesOnly(
                      event.target.checked,
                    )
                  }
                />

                <span>
                  Show verified companies only
                </span>
              </label>

              {optionsError ? (
                <div className="help error">
                  {optionsError}
                </div>
              ) : (
                <div className="help">
                  {loadingOptions
                    ? "Loading funding instruments, countries, and sectors..."
                    : "Select one or more funding instruments."}
                </div>
              )}
            </div>

            <div className="match-card">
              <div className="ms2-col">
                <div className="form-field">
                  <div className="label">
                    Sectors — multi-select
                  </div>

                  <div className="ms-wrap">
                    <select
                      className="multi-select"
                      multiple
                      value={selectedSectorIds}
                      onChange={(event) =>
                        handleMultiSelect(
                          event,
                          setSelectedSectorIds,
                        )
                      }
                      disabled={loadingOptions}
                    >
                      {sectors.map((sector) => (
                        <option
                          key={sector.id}
                          value={String(
                            sector.id,
                          )}
                        >
                          {sector.name}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      className="ms-clear"
                      onClick={clearSectors}
                      title="Clear sectors"
                      aria-label="Clear selected sectors"
                      disabled={
                        selectedSectorIds.length ===
                        0
                      }
                    >
                      ×
                    </button>
                  </div>

                  {getFieldError(
                    "business_sector_ids",
                  ) ? (
                    <div className="field-error">
                      {getFieldError(
                        "business_sector_ids",
                      )}
                    </div>
                  ) : null}
                </div>

                <div className="form-field">
                  <div className="label">
                    Countries — multi-select
                  </div>

                  <div className="ms-wrap">
                    <select
                      className="multi-select"
                      multiple
                      value={selectedCountryIds}
                      onChange={(event) =>
                        handleMultiSelect(
                          event,
                          setSelectedCountryIds,
                        )
                      }
                      disabled={loadingOptions}
                    >
                      {countries.map((country) => (
                        <option
                          key={country.id}
                          value={String(
                            country.id,
                          )}
                        >
                          {country.name}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      className="ms-clear"
                      onClick={clearCountries}
                      title="Clear countries"
                      aria-label="Clear selected countries"
                      disabled={
                        selectedCountryIds.length ===
                        0
                      }
                    >
                      ×
                    </button>
                  </div>

                  {getFieldError("country_ids") ? (
                    <div className="field-error">
                      {getFieldError(
                        "country_ids",
                      )}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="multi-select-help">
                Hold Ctrl on Windows or Cmd on
                macOS to select multiple entries.
              </div>

              <details className="payload-details">
                <summary>
                  View request payload
                </summary>

                <pre className="payload">
                  {JSON.stringify(
                    requestPayload,
                    null,
                    2,
                  )}
                </pre>
              </details>
            </div>
          </div>
        </div>
      </ModalShell>

      <MatchResultsModal
        open={resultsOpen}
        resultPayload={resultPayload}
        refreshing={refreshingResults}
        onBack={() => setResultsOpen(false)}
        onClose={() => setResultsOpen(false)}
        onEditPreference={
          applyPreferenceToForm
        }
        onRefresh={handleRefreshResults}
      />

      <PreviousSearchesModal
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onOpenSearch={
          handleOpenSavedSearch
        }
        onUseAgain={
          applyPreferenceToForm
        }
      />
    </>
  );
}
