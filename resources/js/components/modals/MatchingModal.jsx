// resources/js/components/services/modals/MatchingModal.jsx
import React, { useEffect, useState } from "react";
import "./matchingModal.css";

export default function MatchingModal() {
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [countries, setCountries] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [optionsError, setOptionsError] = useState("");

  const [ticketMin, setTicketMin] = useState(24000);
  const [ticketMax, setTicketMax] = useState(56000);
  const [startFromMonth, setStartFromMonth] = useState(0);
  const [startToMonth, setStartToMonth] = useState(6);

  const [funding, setFunding] = useState({
    equity: true,
    revenueShare: true,
    poFinance: true,
    debt: true,
  });

  const [selectedSectorIds, setSelectedSectorIds] = useState([]);
  const [selectedCountryIds, setSelectedCountryIds] = useState([]);

  const toggleFunding = (key) => setFunding((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleMultiSelect = (e, setter) => {
    const values = Array.from(e.target.selectedOptions).map((o) => Number(o.value));
    setter(values);
  };

  const clearSectors = () => setSelectedSectorIds([]);
  const clearCountries = () => setSelectedCountryIds([]);

  const fetchOptions = async () => {
    setLoadingOptions(true);
    setOptionsError("");
    try {
      const res = await fetch("/services/options", {
        headers: { Accept: "application/json" },
        credentials: "same-origin",
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Failed to load options (${res.status}). ${txt}`);
      }

      const data = await res.json();
      setCountries(Array.isArray(data?.countries) ? data.countries : []);
      setSectors(Array.isArray(data?.sectors) ? data.sectors : []);
    } catch (e) {
      setOptionsError(e?.message || "Failed to load options.");
      setCountries([]);
      setSectors([]);
    } finally {
      setLoadingOptions(false);
    }
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  return (
    <div className="match-wrap">
      <div className="match-card">
        <div className="form-row">
          <div>
            <div className="label">Ticket — min</div>
            <input className="input" type="number" value={ticketMin} onChange={(e) => setTicketMin(Number(e.target.value))} min={0} />
          </div>

          <div>
            <div className="label">Ticket — max</div>
            <input className="input" type="number" value={ticketMax} onChange={(e) => setTicketMax(Number(e.target.value))} min={0} />
          </div>

          <div>
            <div className="label">Start timing (months window)</div>
            <div className="inline-range">
              <input className="input" type="number" value={startFromMonth} onChange={(e) => setStartFromMonth(Number(e.target.value))} min={0} />
              <input className="input" type="number" value={startToMonth} onChange={(e) => setStartToMonth(Number(e.target.value))} min={0} />
            </div>
          </div>
        </div>
      </div>

      <div className="step2-grid">
        <div className="match-card">
          <div className="label big">Funding instruments</div>

          <div className="pills">
            <label className="pill">
              <input type="checkbox" checked={funding.equity} onChange={() => toggleFunding("equity")} />
              <span>Equity</span>
            </label>

            <label className="pill">
              <input type="checkbox" checked={funding.revenueShare} onChange={() => toggleFunding("revenueShare")} />
              <span>Revenue Share</span>
            </label>

            <label className="pill">
              <input type="checkbox" checked={funding.poFinance} onChange={() => toggleFunding("poFinance")} />
              <span>PO Finance</span>
            </label>

            <label className="pill">
              <input type="checkbox" checked={funding.debt} onChange={() => toggleFunding("debt")} />
              <span>Debt</span>
            </label>
          </div>

          {optionsError ? (
            <div className="help error">{optionsError}</div>
          ) : (
            <div className="help">
              {loadingOptions ? "Loading countries & sectors..." : "Tip: Hold Ctrl (Windows) / Cmd (Mac) to select multiple items."}
            </div>
          )}
        </div>

        <div className="match-card">
          <div className="ms2-col">
            <div>
              <div className="label">Sectors (multi-select)</div>
              <div className="ms-wrap">
                <select
                  className="multi-select"
                  multiple
                  value={selectedSectorIds.map(String)}
                  onChange={(e) => handleMultiSelect(e, setSelectedSectorIds)}
                  disabled={loadingOptions}
                >
                  {sectors.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>

                <button type="button" className="ms-clear" onClick={clearSectors} title="Clear" disabled={selectedSectorIds.length === 0}>
                  ×
                </button>
              </div>
            </div>

            <div>
              <div className="label">Countries (multi-select)</div>
              <div className="ms-wrap">
                <select
                  className="multi-select"
                  multiple
                  value={selectedCountryIds.map(String)}
                  onChange={(e) => handleMultiSelect(e, setSelectedCountryIds)}
                  disabled={loadingOptions}
                >
                  {countries.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <button type="button" className="ms-clear" onClick={clearCountries} title="Clear" disabled={selectedCountryIds.length === 0}>
                  ×
                </button>
              </div>
            </div>
          </div>

          {/* Debug payload (optional) */}
          <pre className="payload">
{JSON.stringify(
  { ticketMin, ticketMax, startFromMonth, startToMonth, funding, sectorIds: selectedSectorIds, countryIds: selectedCountryIds },
  null,
  2
)}
          </pre>
        </div>
      </div>
    </div>
  );
}
