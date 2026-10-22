import React, { useState } from "react";
import { ArrowRight, CheckCircle2, ChevronDown, Mail, MessageSquareText, ShieldCheck } from "lucide-react";
import AuthAwareNavigation from "../../components/AuthAwareNavigation.jsx";
import Footer from "../../components/layout_master/Footer.jsx";
import RaymochInformationSupporter from "../../components/RaymochInformationSupporter.jsx";
import "./Contact.css";

const TOPICS = [
  ["", "Select a topic"],
  ["general", "General enquiry"],
  ["business-support", "Business support"],
  ["investor-support", "Investor support"],
  ["verification", "Verification"],
  ["partnerships", "Partnerships"],
  ["billing", "Billing and plans"],
  ["privacy", "Privacy and data"],
  ["careers", "Careers"],
];

const GUIDANCE = [
  {
    title: "How messages are routed",
    summary: "Your selected topic helps the message reach the appropriate Raymoch team.",
    text: "We use the contact topic and the information in your message to direct the enquiry. Including a clear subject, relevant account or company context, and the outcome you need helps us respond more effectively.",
  },
  {
    title: "What happens after submission",
    summary: "A successful submission provides a private reference you can retain.",
    text: "Your message is recorded securely for review. The responsible team can assess the request, coordinate internally where necessary, and respond using the email address you provide. Complex enquiries may require additional information before they can be resolved.",
  },
  {
    title: "How customer information is handled",
    summary: "Contact information is used to review, manage, and respond to your enquiry.",
    text: "Please provide only information relevant to your request and avoid including passwords, payment-card details, or highly sensitive documents. Contact records are handled according to applicable Raymoch privacy and security practices.",
  },
  {
    title: "Accessibility and urgent concerns",
    summary: "Tell us if you need an accessible communication arrangement or are reporting a security concern.",
    text: "You can describe an accessibility need in your message so the team can respond appropriately. For suspected account compromise, do not share credentials; explain the issue clearly and take immediate steps to secure the affected account.",
  },
];

const INITIAL_FORM = {
  name: "",
  email: "",
  organization: "",
  topic: "",
  subject: "",
  message: "",
  consent: false,
  website: "",
};

export default function Contact() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "idle", message: "", reference: "" });
  const endpoint = window.CONTACT_ENDPOINT || "/contact/messages";

  const updateField = ({ target }) => {
    const { name, type, checked, value } = target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const submit = async (event) => {
    event.preventDefault();
    if (status.type === "submitting") return;

    setErrors({});
    setStatus({ type: "submitting", message: "Sending your message…", reference: "" });

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        credentials: "same-origin",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.content || "",
        },
        body: JSON.stringify(form),
      });
      const payload = await response.json().catch(() => ({}));

      if (response.status === 422) {
        setErrors(payload.errors || {});
        setStatus({ type: "error", message: "Please review the highlighted fields and try again.", reference: "" });
        return;
      }
      if (!response.ok) throw new Error(payload.message || "Your message could not be sent.");

      setForm(INITIAL_FORM);
      setStatus({ type: "success", message: payload.message, reference: payload.reference });
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Your message could not be sent. Please try again.", reference: "" });
    }
  };

  const fieldError = (name) => errors[name]?.[0];

  return (
    <>
      <AuthAwareNavigation activePath="/contact" />
      <main className="contact-page">
        <div className="contact-page__wrap">
          <header className="contact-page__intro">
            <div className="contact-page__eyebrow"><MessageSquareText size={18} aria-hidden="true" /> Company · Contact</div>
            <h1>Start a clear conversation with Raymoch.</h1>
            <p>Tell us what you need and we will route your message to the appropriate team. The form is designed for business, investor, verification, partnership, billing, privacy, career, and general enquiries.</p>
          </header>

          <div className="contact-page__layout">
            <section className="contact-page__form-card" aria-labelledby="contact-form-title">
              <div className="contact-page__form-heading">
                <div><span>Send a message</span><h2 id="contact-form-title">How can we help?</h2></div>
                <Mail size={24} aria-hidden="true" />
              </div>

              {status.type !== "idle" && (
                <div className={`contact-page__status contact-page__status--${status.type}`} role={status.type === "error" ? "alert" : "status"} aria-live="polite">
                  {status.type === "success" && <CheckCircle2 size={20} aria-hidden="true" />}
                  <div><strong>{status.message}</strong>{status.reference && <small>Reference: {status.reference}</small>}</div>
                </div>
              )}

              <form onSubmit={submit} noValidate>
                <div className="contact-page__field-grid">
                  <label>Full name<span aria-hidden="true">*</span><input name="name" value={form.name} onChange={updateField} autoComplete="name" required aria-invalid={Boolean(fieldError("name"))} aria-describedby={fieldError("name") ? "contact-name-error" : undefined} />{fieldError("name") && <small id="contact-name-error">{fieldError("name")}</small>}</label>
                  <label>Email address<span aria-hidden="true">*</span><input type="email" name="email" value={form.email} onChange={updateField} autoComplete="email" required aria-invalid={Boolean(fieldError("email"))} aria-describedby={fieldError("email") ? "contact-email-error" : undefined} />{fieldError("email") && <small id="contact-email-error">{fieldError("email")}</small>}</label>
                </div>
                <div className="contact-page__field-grid">
                  <label>Organization <em>Optional</em><input name="organization" value={form.organization} onChange={updateField} autoComplete="organization" aria-invalid={Boolean(fieldError("organization"))} />{fieldError("organization") && <small>{fieldError("organization")}</small>}</label>
                  <label>Topic<span aria-hidden="true">*</span><select name="topic" value={form.topic} onChange={updateField} required aria-invalid={Boolean(fieldError("topic"))}>{TOPICS.map(([value, label]) => <option value={value} key={value || "empty"} disabled={!value}>{label}</option>)}</select>{fieldError("topic") && <small>{fieldError("topic")}</small>}</label>
                </div>
                <label>Subject<span aria-hidden="true">*</span><input name="subject" value={form.subject} onChange={updateField} required maxLength={180} aria-invalid={Boolean(fieldError("subject"))} />{fieldError("subject") && <small>{fieldError("subject")}</small>}</label>
                <label>Message<span aria-hidden="true">*</span><textarea name="message" value={form.message} onChange={updateField} required minLength={20} maxLength={5000} rows={7} aria-invalid={Boolean(fieldError("message"))} /><span className="contact-page__count">{form.message.length}/5000</span>{fieldError("message") && <small>{fieldError("message")}</small>}</label>
                <label className="contact-page__honeypot" aria-hidden="true">Website<input name="website" value={form.website} onChange={updateField} tabIndex={-1} autoComplete="off" /></label>
                <label className="contact-page__consent"><input type="checkbox" name="consent" checked={form.consent} onChange={updateField} required /><span>I agree that Raymoch may use this information to manage and respond to my enquiry.</span></label>
                {fieldError("consent") && <small className="contact-page__standalone-error">{fieldError("consent")}</small>}
                <button type="submit" disabled={status.type === "submitting"}>{status.type === "submitting" ? "Sending…" : "Send message"}<ArrowRight size={17} aria-hidden="true" /></button>
              </form>
            </section>

            <aside className="contact-page__aside">
              <div><ShieldCheck size={25} aria-hidden="true" /><h2>Clear, responsible support</h2><p>Your message is stored for review and routed by topic. Never send passwords, complete payment-card details, or unnecessary sensitive documents.</p></div>
              <dl><div><dt>General support</dt><dd>Questions about Raymoch and platform access</dd></div><div><dt>Business and investors</dt><dd>Profiles, discovery, matching, and market needs</dd></div><div><dt>Trust and privacy</dt><dd>Verification, information handling, and data requests</dd></div></dl>
            </aside>
          </div>

          <section className="contact-page__guidance" aria-label="Contact process information">
            <div className="contact-page__guidance-heading"><span>Before you send</span><h2>How Raymoch handles customer contact.</h2></div>
            {GUIDANCE.map((item, index) => (
              <details key={item.title} open={index === 0}>
                <summary><span>{String(index + 1).padStart(2, "0")}</span><span><strong>{item.title}</strong><small>{item.summary}</small></span><i aria-hidden="true"><ChevronDown size={20} /></i></summary>
                <p>{item.text}</p>
              </details>
            ))}
          </section>
        </div>
      </main>
      <RaymochInformationSupporter />
      <Footer />
    </>
  );
}
