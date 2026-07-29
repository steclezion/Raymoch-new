import React, {
  useEffect,
  useState,
} from "react";

import ModalShell from "./ModalShell";

import {
  fetchSearchHistory,
} from "./matchingApi";

function formatMoney(value, currency = "USD") {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(Number(value ?? 0));
  } catch {
    return `${currency} ${Number(
      value ?? 0,
    ).toLocaleString("en-US")}`;
  }
}

function namesFrom(items) {
  return Array.isArray(items)
    ? items
        .map((item) => item?.name)
        .filter(Boolean)
        .join(", ")
    : "";
}

/**
 * Display all preference searches previously created
 * by the authenticated investor.
 */
export default function PreviousSearchesModal({
  open,
  onClose,
  onOpenSearch,
  onUseAgain,
}) {
  const [searches, setSearches] = useState([]);
  const [loading, setLoading] =
    useState(false);

  const [loadingSearchId, setLoadingSearchId] =
    useState(null);

  const [error, setError] = useState("");

  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const controller = new AbortController();

    loadPage(1, controller.signal);

    return () => {
      controller.abort();
    };
  }, [open]);

  const loadPage = async (
    page,
    signal = undefined,
  ) => {
    setLoading(true);
    setError("");

    try {
      const response =
        await fetchSearchHistory(
          page,
          signal,
        );

      setSearches(
        Array.isArray(response?.data)
          ? response.data
          : [],
      );

      setPagination({
        currentPage:
          response?.meta?.current_page ?? 1,

        lastPage:
          response?.meta?.last_page ?? 1,

        total: response?.meta?.total ?? 0,
      });
    } catch (requestError) {
      if (requestError?.name === "AbortError") {
        return;
      }

      setError(
        requestError?.message ??
          "Previous searches could not be loaded.",
      );
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  };

  const handleOpenSearch = async (
    preferenceId,
  ) => {
    setLoadingSearchId(preferenceId);
    setError("");

    try {
      await onOpenSearch?.(preferenceId);
    } catch (requestError) {
      setError(
        requestError?.message ??
          "The selected search could not be opened.",
      );
    } finally {
      setLoadingSearchId(null);
    }
  };

  return (
    <ModalShell
      open={open}
      title="Previous Searches"
      subtitle={`${pagination.total} saved ${
        pagination.total === 1
          ? "search"
          : "searches"
      }`}
      onClose={onClose}
      size="lg"
      level={1}
      lockBody={false}
      footer={
        <>
          <button
            type="button"
            className="match-button match-button--secondary"
            onClick={onClose}
          >
            Return
          </button>

          <div className="history-pagination">
            <button
              type="button"
              className="match-button match-button--secondary"
              disabled={
                loading ||
                pagination.currentPage <= 1
              }
              onClick={() =>
                loadPage(
                  pagination.currentPage - 1,
                )
              }
            >
              Previous
            </button>

            <span>
              Page {pagination.currentPage} of{" "}
              {pagination.lastPage}
            </span>

            <button
              type="button"
              className="match-button match-button--secondary"
              disabled={
                loading ||
                pagination.currentPage >=
                  pagination.lastPage
              }
              onClick={() =>
                loadPage(
                  pagination.currentPage + 1,
                )
              }
            >
              Next
            </button>
          </div>
        </>
      }
    >
      {error ? (
        <div className="match-alert match-alert--error">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="modal-loading">
          Loading previous searches...
        </div>
      ) : null}

      {!loading && searches.length === 0 ? (
        <div className="empty-results">
          <div className="empty-results-icon">
            ⌕
          </div>

          <h3>No previous searches</h3>

          <p>
            Searches will appear here after the
            investor clicks Continue.
          </p>
        </div>
      ) : null}

      {!loading && searches.length > 0 ? (
        <div className="history-list">
          {searches.map((search) => (
            <article
              className="history-card"
              key={search.id}
            >
              <div className="history-card-top">
                <div>
                  <h3>
                    {search.preference_name}
                  </h3>

                  <p>
                    {search.searched_at
                      ? new Date(
                          search.searched_at,
                        ).toLocaleString(
                          "en-US",
                        )
                      : ""}
                  </p>
                </div>

                <span className="history-match-count">
                  {search.match_count}{" "}
                  {search.match_count === 1
                    ? "match"
                    : "matches"}
                </span>
              </div>

              <div className="history-facts">
                <div>
                  <span>Ticket</span>

                  <strong>
                    {formatMoney(
                      search.ticket_min,
                      search.currency_code,
                    )}
                    {" – "}
                    {formatMoney(
                      search.ticket_max,
                      search.currency_code,
                    )}
                  </strong>
                </div>

                <div>
                  <span>Timing</span>

                  <strong>
                    {search.start_from_month} to{" "}
                    {search.start_to_month} months
                  </strong>
                </div>
              </div>

              <div className="history-selection">
                <p>
                  <strong>Funding:</strong>{" "}
                  {namesFrom(
                    search.funding_instruments,
                  ) || "None"}
                </p>

                <p>
                  <strong>Sectors:</strong>{" "}
                  {namesFrom(search.sectors) ||
                    "None"}
                </p>

                <p>
                  <strong>Countries:</strong>{" "}
                  {namesFrom(search.countries) ||
                    "None"}
                </p>
              </div>

              <div className="history-actions">
                <button
                  type="button"
                  className="match-button match-button--secondary"
                  onClick={() =>
                    onUseAgain?.(search)
                  }
                >
                  Use Again
                </button>

                <button
                  type="button"
                  className="match-button match-button--primary"
                  onClick={() =>
                    handleOpenSearch(search.id)
                  }
                  disabled={
                    loadingSearchId === search.id
                  }
                >
                  {loadingSearchId === search.id
                    ? "Opening..."
                    : "View Results"}
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </ModalShell>
  );
}