import React from "react";
import ModalShell from "./ModalShell";

/**
 * Format an opportunity amount using its stored currency.
 */
function formatMoney(value, currency = "USD") {
  const numericValue = Number(value ?? 0);

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(numericValue);
  } catch {
    return `${currency} ${numericValue.toLocaleString(
      "en-US",
    )}`;
  }
}

/**
 * Render a list such as:
 *
 * Agriculture, Technology, Energy
 */
function joinNames(items) {
  if (!Array.isArray(items)) {
    return "";
  }

  return items
    .map((item) => item?.name)
    .filter(Boolean)
    .join(", ");
}

/**
 * Display the matching results returned by Laravel.
 *
 * The private_score value is never displayed or expected
 * in the API response.
 */
export default function MatchResultsModal({
  open,
  resultPayload,
  refreshing = false,
  onBack,
  onClose,
  onEditPreference,
  onRefresh,
}) {
  const matches = Array.isArray(
    resultPayload?.data,
  )
    ? resultPayload.data
    : [];

  const preference =
    resultPayload?.meta?.preference ?? null;

  const totalMatches =
    resultPayload?.meta?.total_matches ??
    matches.length;

  return (
    <ModalShell
      open={open}
      title="Matching Companies"
      subtitle={`${totalMatches} matching ${
        totalMatches === 1
          ? "opportunity"
          : "opportunities"
      } found.`}
      onClose={onClose}
      size="xl"
      level={1}
      lockBody={false}
      footer={
        <>
          <div className="modal-footer-left">
            <button
              type="button"
              className="match-button match-button--secondary"
              onClick={onBack}
            >
              Return to Preferences
            </button>

            {preference ? (
              <button
                type="button"
                className="match-button match-button--history"
                onClick={() =>
                  onEditPreference?.(
                    preference,
                  )
                }
              >
                Edit This Search
              </button>
            ) : null}
          </div>

          {preference?.id ? (
            <button
              type="button"
              className="match-button match-button--primary"
              onClick={onRefresh}
              disabled={refreshing}
            >
              {refreshing
                ? "Refreshing..."
                : "Refresh Results"}
            </button>
          ) : null}
        </>
      }
    >
      {resultPayload?.meta?.message ? (
        <div className="match-alert match-alert--success">
          {resultPayload.meta.message}
        </div>
      ) : null}

      {preference ? (
        <section className="result-preference-summary">
          <div>
            <span className="summary-label">
              Investment range
            </span>

            <strong>
              {formatMoney(
                preference.ticket_min,
                preference.currency_code,
              )}
              {" – "}
              {formatMoney(
                preference.ticket_max,
                preference.currency_code,
              )}
            </strong>
          </div>

          <div>
            <span className="summary-label">
              Starting window
            </span>

            <strong>
              {preference.start_from_month} to{" "}
              {preference.start_to_month} months
            </strong>
          </div>

          <div>
            <span className="summary-label">
              Search date
            </span>

            <strong>
              {preference.searched_at
                ? new Date(
                    preference.searched_at,
                  ).toLocaleString("en-US")
                : "Current search"}
            </strong>
          </div>
        </section>
      ) : null}

      {matches.length === 0 ? (
        <div className="empty-results">
          <div className="empty-results-icon">
            ⌕
          </div>

          <h3>No eligible companies found</h3>

          <p>
            Return to the preference form and
            increase the ticket range, select
            additional sectors, countries, or
            funding instruments.
          </p>
        </div>
      ) : (
        <div className="match-results-list">
          {matches.map((match) => {
            const company = match.company ?? {};
            const opportunity =
              match.opportunity ?? {};

            return (
              <article
                className="match-result-card"
                key={match.match_id}
              >
                <div className="match-result-top">
                  <div>
                    <div className="company-name-row">
                      <h3>
                        {company.name ??
                          "Unnamed company"}
                      </h3>

                      {company.is_verified ? (
                        <span className="verified-badge">
                          Verified
                        </span>
                      ) : null}
                    </div>

                    <p className="opportunity-title">
                      {opportunity.title ??
                        "Investment opportunity"}
                    </p>
                  </div>

                  <span
                    className={`match-band match-band--${String(
                      match.match_band ?? "",
                    )
                      .toLowerCase()
                      .replaceAll(" ", "-")}`}
                  >
                    {match.match_band}
                  </span>
                </div>

                <div className="opportunity-facts">
                  <div>
                    <span>Funding request</span>

                    <strong>
                      {formatMoney(
                        opportunity.amount_min,
                        opportunity.currency_code,
                      )}
                      {" – "}
                      {formatMoney(
                        opportunity.amount_max,
                        opportunity.currency_code,
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>Starting window</span>

                    <strong>
                      {
                        opportunity.start_from_month
                      }{" "}
                      to{" "}
                      {
                        opportunity.start_to_month
                      }{" "}
                      months
                    </strong>
                  </div>

                  {company.cti_tier ? (
                    <div>
                      <span>CTI tier</span>
                      <strong>
                        {company.cti_tier}
                      </strong>
                    </div>
                  ) : null}
                </div>

                {opportunity.description ? (
                  <p className="opportunity-description">
                    {opportunity.description}
                  </p>
                ) : null}

                <div className="result-tags">
                  {joinNames(
                    opportunity.funding_instruments,
                  ) ? (
                    <div>
                      <span className="tag-heading">
                        Funding
                      </span>

                      <span>
                        {joinNames(
                          opportunity.funding_instruments,
                        )}
                      </span>
                    </div>
                  ) : null}

                  {joinNames(
                    opportunity.sectors,
                  ) ? (
                    <div>
                      <span className="tag-heading">
                        Sectors
                      </span>

                      <span>
                        {joinNames(
                          opportunity.sectors,
                        )}
                      </span>
                    </div>
                  ) : null}

                  {joinNames(
                    opportunity.countries,
                  ) ? (
                    <div>
                      <span className="tag-heading">
                        Countries
                      </span>

                      <span>
                        {joinNames(
                          opportunity.countries,
                        )}
                      </span>
                    </div>
                  ) : null}
                </div>

                {Array.isArray(
                  match.match_reasons,
                ) &&
                match.match_reasons.length > 0 ? (
                  <div className="match-reasons">
                    <h4>Why this company matched</h4>

                    <ul>
                      {match.match_reasons.map(
                        (reason, index) => (
                          <li
                            key={`${match.match_id}-reason-${index}`}
                          >
                            {reason}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      )}
    </ModalShell>
  );
}