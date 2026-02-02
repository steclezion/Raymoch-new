// resources/js/components/services/modals/VisibilityListingModal.jsx
import React, { useEffect, useMemo, useState } from "react";
import "./visibilityListingModal.css";

/**
 * Visibility & Listing Modal
 * - Professional "profile completeness" wizard
 * - Multi-step with stable layout (no jumping)
 * - Prepared to connect to backend later
 */
export default function VisibilityListingModal() {
  const steps = useMemo(
    () => [
      { id: 1, title: "Business Basics", desc: "Who you are and what you do." },
      { id: 2, title: "Location & Contacts", desc: "Where to find you." },
      { id: 3, title: "Documents & Proof", desc: "Upload and verify essentials." },
      { id: 4, title: "Publish Listing", desc: "Preview and go live." },
    ],
    []
  );

  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, type: "ok", msg: "" });

  // Stable form state (no step-jump)
  const [form, setForm] = useState({
    companyName: "",
    tagline: "",
    sector: "",
    stage: "",
    website: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    address: "",
    foundedYear: "",
    teamSize: "",
    description: "",
    // listing toggles
    publicProfile: true,
    showFinancials: false,
    allowInvestorContact: true,
  });

  const [uploads, setUploads] = useState({
    registration: null,
    taxId: null,
    pitchDeck: null,
    logo: null,
    gallery: [],
  });

  const [previewUrl, setPreviewUrl] = useState({
    logo: "",
  });

  const [errors, setErrors] = useState({});

  const showToast = (type, msg) => {
    setToast({ show: true, type, msg });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 2500);
  };

  // Create object URLs for previews
  useEffect(() => {
    if (uploads.logo) {
      const url = URL.createObjectURL(uploads.logo);
      setPreviewUrl((p) => ({ ...p, logo: url }));
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl((p) => ({ ...p, logo: "" }));
    }
  }, [uploads.logo]);

  const current = steps.find((s) => s.id === step);
  const pct = Math.round((step / steps.length) * 100);

  const setField = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  const validateStep = () => {
    const e = {};
    if (step === 1) {
      if (!form.companyName.trim()) e.companyName = "Company name is required";
      if (!form.sector.trim()) e.sector = "Sector is required";
      if (!form.description.trim() || form.description.trim().length < 30)
        e.description = "Please add at least 30 characters";
    }
    if (step === 2) {
      if (!form.country.trim()) e.country = "Country is required";
      if (!form.city.trim()) e.city = "City is required";
      if (!form.email.trim()) e.email = "Email is required";
    }
    if (step === 3) {
      // Docs are optional, but encourage at least one
      const hasAny =
        uploads.registration || uploads.taxId || uploads.pitchDeck || uploads.logo || (uploads.gallery?.length || 0) > 0;
      if (!hasAny) e.docs = "Upload at least one item (logo, deck, registration, etc.)";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validateStep()) {
      showToast("err", "Please fix the highlighted fields.");
      return;
    }
    setStep((s) => Math.min(s + 1, steps.length));
  };

  const back = () => setStep((s) => Math.max(s - 1, 1));

  // Fake save — replace with real API call later
  const saveDraft = async () => {
    if (!validateStep()) {
      showToast("err", "Please fix the highlighted fields.");
      return;
    }
    setSaving(true);
    try {
      // Example payload: use FormData later when you connect backend
      await new Promise((r) => setTimeout(r, 700));
      showToast("ok", "Draft saved.");
    } catch (e) {
      showToast("err", "Failed to save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const publish = async () => {
    // validate all steps quickly
    const allErrors = {};
    if (!form.companyName.trim()) allErrors.companyName = "Company name is required";
    if (!form.sector.trim()) allErrors.sector = "Sector is required";
    if (!form.description.trim() || form.description.trim().length < 30) allErrors.description = "Add more description";
    if (!form.country.trim()) allErrors.country = "Country is required";
    if (!form.city.trim()) allErrors.city = "City is required";
    if (!form.email.trim()) allErrors.email = "Email is required";

    setErrors(allErrors);
    if (Object.keys(allErrors).length) {
      showToast("err", "Please complete required fields before publishing.");
      return;
    }

    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 900));
      showToast("ok", "Listing published (demo).");
    } catch (e) {
      showToast("err", "Publish failed. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="vl-wrap">
      {/* Toast */}
      <div className={`vl-toast ${toast.show ? "show" : ""} ${toast.type}`}>
        <span className="dot" />
        <span>{toast.msg}</span>
      </div>

      {/* Header panel */}
      <section className="vl-hero">
        <div className="vl-heroTop">
          <div>
            <h3 className="vl-title">Visibility &amp; Listing</h3>
            <p className="vl-sub">
              Build your public profile for discovery, trust, and investor access.
            </p>
          </div>

          <div className="vl-badges">
            <span className="vl-badge">Public Profile</span>
            <span className="vl-badge soft">Draft Mode</span>
          </div>
        </div>

        <div className="vl-progress">
          <div className="vl-progressBar" aria-hidden="true">
            <span style={{ width: `${pct}%` }} />
          </div>
          <div className="vl-progressMeta">
            <span className="vl-stepLabel">
              Step {step} / {steps.length} — {current?.title}
            </span>
            <span className="vl-pct">{pct}%</span>
          </div>
        </div>

        <div className="vl-steps">
          {steps.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`vl-stepPill ${s.id === step ? "active" : ""} ${s.id < step ? "done" : ""}`}
              onClick={() => setStep(s.id)}
              aria-current={s.id === step ? "step" : undefined}
            >
              <span className="num">{s.id}</span>
              <span className="txt">{s.title}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Stable body grid */}
      <section className="vl-grid" aria-label="Listing form">
        {/* Main */}
        <article className="vl-card">
          <div className="vl-cardHead">
            <div>
              <h4 className="vl-h4">{current?.title}</h4>
              <p className="vl-desc">{current?.desc}</p>
            </div>
            <button
              type="button"
              className="vl-btn secondary"
              onClick={saveDraft}
              disabled={saving}
              title="Save your progress"
            >
              {saving ? "Saving..." : "Save Draft"}
            </button>
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <div className="vl-form">
              <div className="vl-row two">
                <Field
                  label="Company Name *"
                  value={form.companyName}
                  onChange={(v) => setField("companyName", v)}
                  error={errors.companyName}
                  placeholder="Raymoch Ltd."
                />
                <Field
                  label="Tagline"
                  value={form.tagline}
                  onChange={(v) => setField("tagline", v)}
                  placeholder="Redefining African Potential"
                />
              </div>

              <div className="vl-row two">
                <Field
                  label="Sector *"
                  value={form.sector}
                  onChange={(v) => setField("sector", v)}
                  error={errors.sector}
                  placeholder="FinTech, Logistics, AgriTech..."
                />
                <SelectField
                  label="Stage"
                  value={form.stage}
                  onChange={(v) => setField("stage", v)}
                  options={["Pre-seed", "Seed", "Series A", "Series B+", "Growth"]}
                  placeholder="Select..."
                />
              </div>

              <div className="vl-row two">
                <Field
                  label="Website"
                  value={form.website}
                  onChange={(v) => setField("website", v)}
                  placeholder="https://example.com"
                />
                <Field
                  label="Founded Year"
                  value={form.foundedYear}
                  onChange={(v) => setField("foundedYear", v)}
                  placeholder="2021"
                  type="number"
                />
              </div>

              <div className="vl-row two">
                <Field
                  label="Team Size"
                  value={form.teamSize}
                  onChange={(v) => setField("teamSize", v)}
                  placeholder="10"
                  type="number"
                />
                <div className="vl-blank" />
              </div>

              <TextareaField
                label="Description *"
                value={form.description}
                onChange={(v) => setField("description", v)}
                error={errors.description}
                placeholder="Describe your company, traction, market, and what you’re raising..."
                hint="Minimum 30 characters."
              />
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="vl-form">
              <div className="vl-row two">
                <Field
                  label="Country *"
                  value={form.country}
                  onChange={(v) => setField("country", v)}
                  error={errors.country}
                  placeholder="Ethiopia"
                />
                <Field
                  label="City *"
                  value={form.city}
                  onChange={(v) => setField("city", v)}
                  error={errors.city}
                  placeholder="Addis Ababa"
                />
              </div>

              <Field
                label="Address"
                value={form.address}
                onChange={(v) => setField("address", v)}
                placeholder="Street / area / district"
              />

              <div className="vl-row two">
                <Field
                  label="Contact Email *"
                  value={form.email}
                  onChange={(v) => setField("email", v)}
                  error={errors.email}
                  placeholder="contact@company.com"
                  type="email"
                />
                <Field
                  label="Phone"
                  value={form.phone}
                  onChange={(v) => setField("phone", v)}
                  placeholder="+251 9..."
                />
              </div>

              <div className="vl-toggles">
                <Toggle
                  label="Public Profile"
                  desc="Allow your listing to appear in search results."
                  checked={form.publicProfile}
                  onChange={(v) => setField("publicProfile", v)}
                />
                <Toggle
                  label="Allow Investor Contact"
                  desc="Let verified investors contact you via Raymoch."
                  checked={form.allowInvestorContact}
                  onChange={(v) => setField("allowInvestorContact", v)}
                />
                <Toggle
                  label="Show Financial Summary"
                  desc="Optional: show summarized financials to verified users."
                  checked={form.showFinancials}
                  onChange={(v) => setField("showFinancials", v)}
                />
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="vl-form">
              {errors.docs ? <div className="vl-errorBanner">{errors.docs}</div> : null}

              <div className="vl-uploads">
                <Upload
                  label="Logo"
                  accept=".png,.jpg,.jpeg,.webp"
                  file={uploads.logo}
                  onPick={(file) => setUploads((u) => ({ ...u, logo: file }))}
                  hint="Recommended: square 512×512"
                />

                <Upload
                  label="Pitch Deck"
                  accept=".pdf,.ppt,.pptx"
                  file={uploads.pitchDeck}
                  onPick={(file) => setUploads((u) => ({ ...u, pitchDeck: file }))}
                  hint="PDF preferred"
                />

                <Upload
                  label="Business Registration"
                  accept=".pdf,.jpg,.jpeg,.png"
                  file={uploads.registration}
                  onPick={(file) => setUploads((u) => ({ ...u, registration: file }))}
                  hint="License / certificate"
                />

                <Upload
                  label="Tax ID"
                  accept=".pdf,.jpg,.jpeg,.png"
                  file={uploads.taxId}
                  onPick={(file) => setUploads((u) => ({ ...u, taxId: file }))}
                  hint="TIN/VAT"
                />
              </div>

              <GalleryUpload
                files={uploads.gallery}
                onPick={(files) => setUploads((u) => ({ ...u, gallery: files }))}
              />

              <div className="vl-note">
                Uploading more documents increases trust and improves ranking in discovery.
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="vl-form">
              <div className="vl-preview">
                <div className="vl-previewCard">
                  <div className="vl-previewTop">
                    <div className="vl-logo">
                      {previewUrl.logo ? (
                        <img src={previewUrl.logo} alt="Company logo preview" />
                      ) : (
                        <div className="vl-logoFallback">LOGO</div>
                      )}
                    </div>

                    <div className="vl-previewMeta">
                      <div className="nm">{form.companyName || "Company Name"}</div>
                      <div className="tg">{form.tagline || "Tagline goes here"}</div>
                      <div className="mini">
                        <span>{form.country || "Country"}</span> • <span>{form.sector || "Sector"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="vl-previewBody">
                    <div className="vl-chipRow">
                      <span className="vl-chip">{form.publicProfile ? "Public" : "Private"}</span>
                      <span className="vl-chip soft">{form.stage || "Stage: —"}</span>
                      <span className="vl-chip soft">{form.teamSize ? `Team: ${form.teamSize}` : "Team: —"}</span>
                    </div>

                    <p className="vl-previewDesc">
                      {form.description || "Your company description will show here."}
                    </p>

                    <div className="vl-miniCols">
                      <div>
                        <div className="k">Website</div>
                        <div className="v">{form.website || "—"}</div>
                      </div>
                      <div>
                        <div className="k">Contact</div>
                        <div className="v">{form.email || "—"}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="vl-publishPanel">
                  <h4>Ready to publish?</h4>
                  <p className="muted">
                    Publishing makes your listing visible based on your privacy settings.
                  </p>

                  <div className="vl-stat">
                    <span>Completeness</span>
                    <b>{computeCompleteness(form, uploads)}%</b>
                  </div>

                  <button className="vl-btn primary" type="button" onClick={publish} disabled={saving}>
                    {saving ? "Publishing..." : "Publish Listing"}
                  </button>

                  <div className="vl-small">
                    Tip: Add documents for a better trust tier later.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer buttons (inside modal content) */}
          <div className="vl-actions">
            <button className="vl-btn" type="button" onClick={back} disabled={step === 1 || saving}>
              Back
            </button>

            <div className="vl-actionsRight">
              {step < steps.length ? (
                <button className="vl-btn primary" type="button" onClick={next} disabled={saving}>
                  Next
                </button>
              ) : (
                <button className="vl-btn primary" type="button" onClick={publish} disabled={saving}>
                  {saving ? "Publishing..." : "Publish"}
                </button>
              )}
            </div>
          </div>
        </article>

        {/* Side panel */}
        <aside className="vl-side">
          <div className="vl-sideCard">
            <h4>Why Listing Matters</h4>
            <ul>
              <li>Improves discovery in Raymoch search</li>
              <li>Builds trust through completeness</li>
              <li>Unlocks faster investor matching</li>
              <li>Enables partner program eligibility</li>
            </ul>
          </div>

          <div className="vl-sideCard">
            <h4>Checklist</h4>
            <ul className="check">
              <li className={form.companyName ? "ok" : ""}>Company Name</li>
              <li className={form.sector ? "ok" : ""}>Sector</li>
              <li className={form.description?.length >= 30 ? "ok" : ""}>Description (30+ chars)</li>
              <li className={form.country ? "ok" : ""}>Country</li>
              <li className={form.city ? "ok" : ""}>City</li>
              <li className={form.email ? "ok" : ""}>Email</li>
              <li className={uploads.logo ? "ok" : ""}>Logo</li>
              <li className={uploads.pitchDeck ? "ok" : ""}>Pitch Deck</li>
              <li className={uploads.registration ? "ok" : ""}>Registration</li>
            </ul>
          </div>

          <div className="vl-sideCard">
            <h4>Note</h4>
            <p className="muted">
              When you connect backend, submit with <code>FormData</code> to support files.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}

/* ======================== Small UI helpers ======================== */

function Field({ label, value, onChange, placeholder, type = "text", error }) {
  return (
    <label className={`vl-field ${error ? "hasError" : ""}`}>
      <span className="vl-lbl">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      {error ? <span className="vl-err">{error}</span> : null}
    </label>
  );
}

function TextareaField({ label, value, onChange, placeholder, error, hint }) {
  return (
    <label className={`vl-field ${error ? "hasError" : ""}`}>
      <span className="vl-lbl">{label}</span>
      <textarea value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} rows={5} />
      <div className="vl-hintRow">
        {error ? <span className="vl-err">{error}</span> : <span className="vl-hint">{hint}</span>}
      </div>
    </label>
  );
}

function SelectField({ label, value, onChange, options, placeholder }) {
  return (
    <label className="vl-field">
      <span className="vl-lbl">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{placeholder || "Select..."}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function Toggle({ label, desc, checked, onChange }) {
  return (
    <div className="vl-toggle">
      <div>
        <div className="vl-tTitle">{label}</div>
        <div className="vl-tDesc">{desc}</div>
      </div>
      <button type="button" className={`vl-switch ${checked ? "on" : ""}`} onClick={() => onChange(!checked)}>
        <span />
      </button>
    </div>
  );
}

function Upload({ label, accept, file, onPick, hint }) {
  return (
    <div className="vl-upCard">
      <div className="vl-upTop">
        <div>
          <div className="vl-upLbl">{label}</div>
          <div className="vl-upHint">{hint}</div>
        </div>

        <label className="vl-upBtn">
          <input
            type="file"
            accept={accept}
            onChange={(e) => {
              const f = e.target.files?.[0] || null;
              onPick(f);
              e.target.value = "";
            }}
          />
          Choose file
        </label>
      </div>

      <div className="vl-upMeta">
        {file ? (
          <>
            <span className="vl-fileName">{file.name}</span>
            <span className="vl-fileSize">{humanSize(file.size)}</span>
          </>
        ) : (
          <span className="vl-none">No file selected</span>
        )}
      </div>
    </div>
  );
}

function GalleryUpload({ files, onPick }) {
  return (
    <div className="vl-gallery">
      <div className="vl-galleryTop">
        <div>
          <div className="vl-upLbl">Gallery</div>
          <div className="vl-upHint">Upload up to 8 images (JPG/PNG/WEBP)</div>
        </div>

        <label className="vl-upBtn">
          <input
            type="file"
            accept=".png,.jpg,.jpeg,.webp"
            multiple
            onChange={(e) => {
              const arr = Array.from(e.target.files || []).slice(0, 8);
              onPick(arr);
              e.target.value = "";
            }}
          />
          Add images
        </label>
      </div>

      <div className="vl-galleryList">
        {(files || []).length ? (
          files.map((f, idx) => (
            <div key={idx} className="vl-gItem">
              <span className="nm">{f.name}</span>
              <span className="sz">{humanSize(f.size)}</span>
            </div>
          ))
        ) : (
          <div className="vl-none">No gallery images selected</div>
        )}
      </div>
    </div>
  );
}

/* ======================== helpers ======================== */

function humanSize(bytes) {
  const b = Number(bytes || 0);
  if (b < 1024) return `${b} B`;
  const kb = b / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}

function computeCompleteness(form, uploads) {
  // simple scoring: 10 items → 100%
  const checks = [
    !!form.companyName,
    !!form.sector,
    (form.description || "").length >= 30,
    !!form.country,
    !!form.city,
    !!form.email,
    !!form.website,
    !!form.phone,
    !!uploads.logo,
    !!uploads.pitchDeck || !!uploads.registration || !!uploads.taxId,
  ];
  const ok = checks.filter(Boolean).length;
  return Math.round((ok / checks.length) * 100);
}
