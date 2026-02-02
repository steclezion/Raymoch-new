// resources/js/components/services/modals/PartnerProgramsModal.jsx
import React, { useState } from "react";
import "./partnerProgramsModal.css";

export default function PartnerProgramsModal() {
  const [route, setRoute] = useState("programs"); // programs | catalog | details | eligibility

  const onPick = () => setRoute("catalog");
  const onOpen = () => setRoute("details");
  const onElig = () => setRoute("eligibility");

  return (
    <div className="pp-wrap">
      <div className="pp-container">
        {/* STEP 1 */}
        {route === "programs" && (
          <section className="route active">
            <h3 className="pp-title">Choose a partner path</h3>

            <div className="filterbar" role="search">
              <input type="search" placeholder="Search by name, sponsor, sector" aria-label="Search programs" />
              <select aria-label="Program type">
                <option value="">Program type</option>
              </select>
              <select aria-label="Country">
                <option value="">Country</option>
              </select>
              <button className="reset" type="button" onClick={() => setRoute("catalog")}>
                Search
              </button>
            </div>

            <div className="grid">
              <article className="card col-4 click" role="button" tabIndex={0} onClick={onPick}>
                <h3>Accelerator Partner</h3>
                <p className="meta">Cohort pipelines • Verified profiles</p>
              </article>

              <article className="card col-4 click" role="button" tabIndex={0} onClick={onPick}>
                <h3>Syndicate Partner</h3>
                <p className="meta">Dealrooms • Referral tracking</p>
              </article>

              <article className="card col-4 click" role="button" tabIndex={0} onClick={onPick}>
                <h3>Ecosystem Partner</h3>
                <p className="meta">Directory sync • Member verification</p>
              </article>
            </div>
          </section>
        )}

        {/* STEP 2 */}
        {route === "catalog" && (
          <section className="route active">
            <div className="pp-top">
              <h3 className="pp-title">Programs</h3>
              <button className="btn secondary" type="button" onClick={() => setRoute("programs")}>
                ← Back
              </button>
            </div>

            <div className="filterbar" role="search">
              <input type="search" placeholder="Search by name, sponsor, sector" aria-label="Search catalog" />
              <select aria-label="Program type">
                <option value="">Program type</option>
              </select>
              <select aria-label="Country">
                <option value="">Country</option>
              </select>
              <button className="reset" type="button">
                Clear
              </button>
            </div>

            <div className="grid" aria-live="polite">
              <article className="card col-4 click" role="button" tabIndex={0} onClick={onOpen}>
                <h3>Sample Program</h3>
                <p className="meta">Sponsor • Country • Sector</p>
              </article>
            </div>
          </section>
        )}

        {/* STEP 3 */}
        {route === "details" && (
          <section className="route active">
            <div className="pp-top">
              <h3 className="pp-title">Program Information</h3>
              <div className="pp-actions">
                <button className="btn secondary" type="button" onClick={() => setRoute("catalog")}>
                  ← Back to list
                </button>
                <button className="btn" type="button" onClick={onElig}>
                  Check eligibility
                </button>
              </div>
            </div>

            <div className="card">
              <p className="meta">Program details will render here (connect to backend later).</p>
            </div>
          </section>
        )}

        {/* STEP 4 */}
        {route === "eligibility" && (
          <section className="route active">
            <div className="pp-top">
              <h3 className="pp-title">Eligibility</h3>
              <button className="btn secondary" type="button" onClick={() => setRoute("details")}>
                ← Back to program
              </button>
            </div>

            <form
              className="card"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Eligibility submitted (demo).");
              }}
            >
              <div className="grid">
                <div className="col-4" style={{ gridColumn: "span 6" }}>
                  <label>
                    Organization Name
                    <input name="org" type="text" required />
                  </label>

                  <label>
                    Contact Email
                    <input name="email" type="email" required />
                  </label>

                  <label>
                    Country (AU 55)
                    <select name="country" required>
                      <option value="">Select country</option>
                      <option>Ethiopia</option>
                      <option>Kenya</option>
                      <option>Nigeria</option>
                      <option>South Africa</option>
                    </select>
                  </label>
                </div>

                <div className="col-4" style={{ gridColumn: "span 6" }}>
                  <label className="ghost">Type specific field 1</label>
                  <label className="ghost">Type specific field 2</label>
                  <label className="ghost">Type specific field 3</label>
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <button className="btn primary" type="submit">
                  Submit Application
                </button>
              </div>
            </form>
          </section>
        )}
      </div>
    </div>
  );
}
