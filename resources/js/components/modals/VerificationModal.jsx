// resources/js/components/services/modals/VerificationModal.jsx
import React, { useState } from "react";
import "./verificationModal.css";

export default function VerificationModal() {
  const [step, setStep] = useState(1);

  const stepMeta = {
    1: { title: "Verification", desc: "Ensuring trust through diligently verifying documents.", sub: "Step 1 of 3: Overview and how it works", pct: 33 },
    2: { title: "Request Verification", desc: "Provide business details and upload documents for review.", sub: "Step 2 of 3: Submit details and documents", pct: 66 },
    3: { title: "Verification Submitted", desc: "We are reviewing your request and will email updates.", sub: "Step 3 of 3: Confirmation", pct: 100 },
  };

  const m = stepMeta[step];

  return (
    <main className="vr-container">
      {/* HERO */}
      <section className="vr-hero vr-gradient">
        <h2>{m.title}</h2>
        <p>{m.desc}</p>

        <div className="vr-crumbs">
          <span className="vr-step">{m.sub}</span>
        </div>

        <div className="vr-progress" aria-hidden="true">
          <span style={{ width: `${m.pct}%` }} />
        </div>

        {step === 2 && (
          <div style={{ marginTop: 6 }}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setStep(1);
              }}
            >
              Back
            </a>
          </div>
        )}
      </section>

      {/* STEP 1 */}
      {step === 1 && (
        <section className="vr-stepwrap">
          <section className="vr-grid">
            <div>
              <article className="vr-card">
                <h3>What is it?</h3>
                <p className="muted">
                  A process that verifies a business’s credibility and opens options for future investment and partner programs.
                </p>
              </article>

              <article className="vr-card" style={{ marginTop: 25 }}>
                <h3>How it works</h3>

                <div className="vr-flow">
                  <div>
                    <div className="vr-icon" />
                    <p className="muted" style={{ marginTop: 6 }}>
                      Submission
                    </p>
                  </div>
                  <span className="vr-arrow">→</span>
                  <div>
                    <div className="vr-icon" />
                    <p className="muted" style={{ marginTop: 6 }}>
                      Human Review
                    </p>
                  </div>
                  <span className="vr-arrow">→</span>
                  <div>
                    <div className="vr-icon" />
                    <p className="muted" style={{ marginTop: 6 }}>
                      Verified
                    </p>
                  </div>
                </div>

                <div className="vr-btnrow" style={{ marginTop: 30 }}>
                  <button className="vr-btn" type="button" onClick={() => setStep(2)}>
                    Request Verification
                  </button>
                </div>
              </article>

              <article className="vr-card" style={{ marginTop: 16 }}>
                <h3>Why Raymoch?</h3>
                <ul className="muted" style={{ margin: "6px 0 0 18px", lineHeight: 1.6 }}>
                  <li>Fostering a trusted network</li>
                  <li>Alternative verified option</li>
                  <li>Human and digital verification</li>
                  <li>Added transparency and visibility</li>
                </ul>
              </article>
            </div>

            <aside className="vr-card">
              <h3>Key Highlights</h3>
              <p className="muted">Average Time: 3 to 5 days</p>
              <p className="muted">Scope: Africa-wide</p>
              <p className="muted">Status: Available</p>
              <hr className="vr-hr" />
              <h3>What we check</h3>
              <p className="small">Registration, identity and authority, sanctions and AML.</p>
              <h3 style={{ marginTop: 12 }}>CTI vs ATS</h3>
              <ul className="small" style={{ margin: "8px 0 0 18px", lineHeight: 1.6 }}>
                <li>
                  <strong>CTI:</strong> formal documents (registration and tax). Outcome: public Tier after human review.
                </li>
                <li>
                  <strong>ATS:</strong> early or informal activity proofs. Outcome: eligibility and private signals; upgrade later.
                </li>
              </ul>
            </aside>
          </section>
        </section>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <section className="vr-stepwrap">
          <section className="vr-formGrid">
            <article className="vr-card">
              <h3>Business Details</h3>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setStep(3);
                }}
                noValidate
              >
                <div className="row">
                  <div>
                    <label>Business name *</label>
                    <input required placeholder="Leah Holdings Ltd." />
                  </div>
                  <div>
                    <label>Registration or License # *</label>
                    <input required placeholder="1234567867" />
                  </div>
                </div>

                <div className="row">
                  <div>
                    <label>Country *</label>
                    <select required>
                      <option value="">Select country…</option>
                      <option>Ethiopia</option>
                      <option>Kenya</option>
                      <option>Nigeria</option>
                      <option>South Africa</option>
                    </select>
                  </div>
                  <div>
                    <label>Sector</label>
                    <select>
                      <option value="">Select sector…</option>
                      <option>FinTech</option>
                      <option>Health</option>
                      <option>Logistics</option>
                      <option>Manufacturing</option>
                    </select>
                  </div>
                </div>

                <div className="row">
                  <div>
                    <label>Can you provide Registration or License?</label>
                    <select>
                      <option value="">Select…</option>
                      <option value="yes">Yes, I have it</option>
                      <option value="no">No, not yet</option>
                    </select>
                    <div className="small">Trade License, etc.</div>
                  </div>
                  <div>
                    <label>Can you provide a Tax ID?</label>
                    <select>
                      <option value="">Select…</option>
                      <option value="yes">Yes, I have it</option>
                      <option value="no">No, not yet</option>
                    </select>
                    <div className="small">TIN or VAT or equivalent.</div>
                  </div>
                </div>

                <div className="vr-card" style={{ marginTop: 14 }}>
                  <h3>Documents</h3>
                  <p className="small">Upload PDF/JPG/PNG files.</p>
                  <label className="upload">
                    <span>Upload documents</span>
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" multiple />
                  </label>
                </div>

                <div className="vr-card" style={{ marginTop: 14 }}>
                  <h3>Contact</h3>

                  <div className="row">
                    <div>
                      <label>Your full name *</label>
                      <input required placeholder="Jane Doe" />
                    </div>
                    <div>
                      <label>Work email *</label>
                      <input required type="email" placeholder="jane@company.com" />
                    </div>
                  </div>

                  <div className="row">
                    <div>
                      <label>Phone</label>
                      <input placeholder="+251 9 1234 5678" />
                    </div>
                    <div>
                      <label>Role or Title</label>
                      <input placeholder="Manager, Representative" />
                    </div>
                  </div>

                  <div style={{ margin: "8px 0" }}>
                    <input id="consent" type="checkbox" required />
                    <label htmlFor="consent" style={{ display: "inline", marginLeft: 8 }}>
                      I confirm these documents are accurate and authorize Raymoch checks.
                    </label>
                  </div>

                  <div className="vr-btnrow" style={{ marginTop: 10 }}>
                    <button className="vr-btn" type="submit">
                      Submit for Verification
                    </button>
                    <button className="vr-btn ghost" type="button" onClick={() => setStep(1)}>
                      Back
                    </button>
                  </div>

                  <p className="small">Average review time: 3 to 5 business days. You will receive status updates by email.</p>
                </div>
              </form>
            </article>

            <aside className="vr-card vr-sticky">
              <h3>Tips for a fast review</h3>
              <ul className="infoList">
                <li>Make sure names match across docs.</li>
                <li>If numbers differ by country format, note it in “Notes”.</li>
                <li>Scan or export PDFs clearly; avoid photos with glare.</li>
              </ul>
              <hr className="vr-hr" />
              <h3>What counts as evidence?</h3>
              <p className="small">CTI relies on formal docs. ATS accepts practical proofs; you can upgrade later.</p>
              <hr className="vr-hr" />
              <h3>Status after submit</h3>
              <p className="small">We send a token reference; human reviewers validate and compute CTI Tier for the CTI path.</p>
            </aside>
          </section>
        </section>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <section className="vr-stepwrap">
          <article className="vr-centerCard">
            <div className="vr-checkwrap" aria-hidden="true">
              ✓
            </div>
            <h2 style={{ margin: "0 0 6px", color: "#0A2A6B" }}>Submitted</h2>
            <p style={{ margin: "0 0 14px", color: "#475569" }}>
              Your request is under review. Expect an email update within 3 to 5 business days.
            </p>

            <div className="vr-btnrow" style={{ justifyContent: "center" }}>
              <button className="vr-btn" type="button" onClick={() => setStep(1)}>
                Done
              </button>
            </div>

            <p style={{ marginTop: 10, color: "#6b7280", fontSize: 12 }}>Ref: pending</p>
          </article>
        </section>
      )}
    </main>
  );
}
