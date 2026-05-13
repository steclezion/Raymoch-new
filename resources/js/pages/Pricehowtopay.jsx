// resources/js/price_how_to_pay.jsx

import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ChevronRight,
  LockKeyhole,
  CheckCircle2,
  Loader2,
  X,
} from "lucide-react";

import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

import {
  PayPalScriptProvider,
  PayPalButtons,
} from "@paypal/react-paypal-js";

import Header from "../components/layout_master/Header.jsx";
import Footer from "../components/layout_master/Footer.jsx";
import BreadcrumbsNav from "../components/common/BreadcrumbsNav";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PLANS = {
  business: {
    name: "Business",
    quality: "Company Growth",
    price: "$19.99",
    amount: "19.99",
    features: [
      ["Search access", "Full"],
      ["Company result visibility", "Included"],
      ["Trust summary", "Included"],
      ["Investor matching", "Included"],
      ["Verification insights", "Included"],
      ["Best for", "SMEs and companies"],
    ],
  },
  investor: {
    name: "Investor",
    quality: "Deal Discovery",
    price: "$26.99",
    amount: "26.99",
    features: [
      ["Search access", "Full"],
      ["Company result visibility", "Included"],
      ["Trust summary", "Advanced"],
      ["Investor matching", "Priority"],
      ["Verification insights", "Advanced"],
      ["Best for", "Investors and partners"],
    ],
  },
};

function getCsrfToken() {
  return document
    .querySelector('meta[name="csrf-token"]')
    ?.getAttribute("content");
}

 function StripeMembershipForm({ planKey, selectedPlan }) {
  const stripe = useStripe();
  const elements = useElements();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || isSubmitting) return;

    setIsSubmitting(true);
    setMessage("");

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/membership-success?plan=${planKey}`,
      },
    });

    if (error) {
      setMessage(error.message || "Payment failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <form className="rm-stripe-form" onSubmit={handleSubmit}>
      <div className="rm-modal-step">Step 3 of 3</div>

      <h2>Set up your credit or debit card</h2>

      <div className="rm-card-brand-row">
        <span className="rm-card visa">VISA</span>
        <span className="rm-card mc">●●</span>
        <span className="rm-card amex">AMEX</span>
        <span className="rm-card discover">DISC</span>
      </div>

      <div className="rm-payment-element-wrap">
        <PaymentElement
          options={{
            layout: "tabs",
            wallets: {
              applePay: "never",
              googlePay: "never",
            },
            fields: {
              billingDetails: "auto",
            },
          }}
        />
      </div>

      <div className="rm-selected-payment-summary">
        <div>
          <strong>{selectedPlan.price} / month</strong>
          <span>{selectedPlan.name}</span>
        </div>

        <a href="/pricing">Change</a>
      </div>

      <p className="rm-membership-terms">
        By clicking the “Start Membership” button below, you agree to our Terms
        of Use and Privacy Statement. Your membership will continue until you
        cancel. You may cancel at any time.
      </p>

      {message && <div className="rm-stripe-error">{message}</div>}

      <button
        type="submit"
        className="rm-start-membership-btn"
        disabled={!stripe || !elements || isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 size={22} className="rm-spin" />
            Processing...
          </>
        ) : (
          "Start Membership"
        )}
      </button>
    </form>
  );
}

function StripeCardModal({ open, onClose, clientSecret, planKey, selectedPlan }) {
  const options = useMemo(
    () => ({
      clientSecret,
      wallets: {
        applePay: "never",
        googlePay: "never",
      },
      paymentMethodOrder: ["card"],
      business: {
        name: "Raymoch",
      },
      appearance: {
        theme: "stripe",
        variables: {
          colorPrimary: "#0A2A6B",
          colorText: "#020617",
          borderRadius: "8px",
          fontFamily:
            "Plus Jakarta Sans, Inter, SF Pro Display, Segoe UI, system-ui, sans-serif",
        },
      },
    }),
    [clientSecret]
  );

  if (!open || !clientSecret) return null;

  return (
    <div className="rm-modal-backdrop">
      <div className="rm-modal-panel">
        <button type="button" className="rm-modal-close" onClick={onClose}>
          <X size={22} />
        </button>

        <Elements stripe={stripePromise} options={options}>
          <StripeMembershipForm planKey={planKey} selectedPlan={selectedPlan} />
        </Elements>
      </div>
    </div>
  );
}

function PayPalMembershipModal({ open, onClose, planKey, selectedPlan }) {
  if (!open) return null;

  return (
    <div className="rm-modal-backdrop">
      <div className="rm-modal-panel rm-paypal-modal-panel">
        <button type="button" className="rm-modal-close" onClick={onClose}>
          <X size={22} />
        </button>

        <div className="rm-paypal-modal-content">
          <div className="rm-modal-step">Step 3 of 3</div>

          <h2>Pay with PayPal</h2>

          <p className="rm-paypal-subtitle">
            Complete your {selectedPlan.name} membership securely using PayPal.
          </p>

          <div className="rm-selected-payment-summary">
            <div>
              <strong>{selectedPlan.price} / month</strong>
              <span>{selectedPlan.name}</span>
            </div>

            <a href="/pricing">Change</a>
          </div>

          <PayPalScriptProvider
            options={{
              clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
              currency: "USD",
              intent: "capture",
            }}
          >
            <div className="rm-paypal-buttons-wrap">
              <PayPalButtons
                style={{
                  layout: "vertical",
                  color: "blue",
                  shape: "rect",
                  label: "paypal",
                  height: 48,
                }}
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [
                      {
                        description: `${selectedPlan.name} Membership`,
                        amount: {
                          currency_code: "USD",
                          value: selectedPlan.amount,
                        },
                      },
                    ],
                  });
                }}
                onApprove={async (data, actions) => {
                  const details = await actions.order.capture();

                  window.location.href =
                    `/membership-success-page?plan=${planKey}` +
                    `&method=paypal` +
                    `&paypal_order_id=${data.orderID}` +
                    `&payer=${details?.payer?.email_address || ""}`;
                }}
                onError={(error) => {
                  console.error("PayPal payment failed:", error);
                  alert("PayPal payment failed. Please try again.");
                }}
                onCancel={() => {
                  alert("PayPal payment was cancelled.");
                }}
              />
            </div>
          </PayPalScriptProvider>
        </div>
      </div>
    </div>
  );
}

export default function PriceHowToPay() {
  const params = new URLSearchParams(window.location.search);
  const planKey = params.get("plan") || "business";
  const selectedPlan = PLANS[planKey] || PLANS.business;

  const [cardLoading, setCardLoading] = useState(false);
  const [paypalLoading, setPaypalLoading] = useState(false);

  const [clientSecret, setClientSecret] = useState("");
  const [cardModalOpen, setCardModalOpen] = useState(false);
  const [paypalModalOpen, setPaypalModalOpen] = useState(false);

  const openCardModal = async () => {
    if (cardLoading) return;

    setCardLoading(true);

    try {
      const response = await fetch("/stripe/create-payment-intent", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": getCsrfToken() || "",
          "X-Requested-With": "XMLHttpRequest",
        },
        credentials: "same-origin",
        body: JSON.stringify({
          plan: planKey,
        }),
      });

      const json = await response.json();

      if (!response.ok || !json?.clientSecret) {
        throw new Error(json?.message || "Unable to start payment.");
      }

      setClientSecret(json.clientSecret);
      setCardModalOpen(true);
    } catch (error) {
      alert(error.message || "Unable to start payment.");
    } finally {
      setCardLoading(false);
    }
  };

  const openPayPalModal = () => {
    if (paypalLoading) return;

    setPaypalLoading(true);

    window.setTimeout(() => {
      setPaypalLoading(false);
      setPaypalModalOpen(true);
    }, 200);
  };

  const goToCheckout = (method) => {
    if (method === "card") {
      openCardModal();
      return;
    }

    if (method === "paypal") {
      openPayPalModal();
      return;
    }

    window.location.href = `/checkout?plan=${planKey}&method=${method}`;
  };

  return (
    <>
      <style>{styles}</style>

      <Header />

      <main className="rm-pay-page">
        <section className="rm-pay-layout">
          <aside className="rm-selected-plan">
            <div className="rm-selected-plan-top">
              <span>Selected Plan</span>
              <CheckCircle2 size={18} />
            </div>

            <div className="rm-selected-plan-banner">
              <h2>{selectedPlan.name}</h2>
              <p>{selectedPlan.quality}</p>
            </div>

            <div className="rm-selected-price">
              <span>Monthly price</span>
              <strong>{selectedPlan.price} / month</strong>
            </div>

            <div className="rm-selected-features">
              {selectedPlan.features.map(([label, value]) => (
                <div className="rm-selected-feature" key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </aside>

          <section className="rm-pay-shell">
            <BreadcrumbsNav />

            <h1>Choose how to pay</h1>

            <p className="rm-pay-subtitle">
              Your payment is encrypted and you can change how you pay anytime.
            </p>

            <div className="rm-pay-note">
              <strong>Secure for peace of mind.</strong>
              <strong>Cancel easily online.</strong>
            </div>

            <div className="rm-pay-secure">
              <span>End-to-end encrypted</span>
              <LockKeyhole size={15} />
            </div>

            <div className="rm-pay-options">
              <button
                type="button"
                className="rm-pay-option"
                onClick={() => goToCheckout("card")}
                disabled={cardLoading}
              >
                <span className="rm-pay-label">Credit or Debit Card</span>

                <span className="rm-card-icons">
                  <span className="rm-card visa">VISA</span>
                  <span className="rm-card mc">●●</span>
                  <span className="rm-card amex">AMEX</span>
                  <span className="rm-card discover">DISC</span>
                </span>

                {cardLoading ? (
                  <Loader2 size={22} className="rm-spin rm-card-loader" />
                ) : (
                  <ChevronRight size={22} />
                )}
              </button>

              <button
                type="button"
                className="rm-pay-option"
                onClick={() => goToCheckout("paypal")}
                disabled={paypalLoading}
              >
                <span className="rm-pay-label">PayPal</span>

                <span className="rm-paypal-logo">P</span>

                {paypalLoading ? (
                  <Loader2 size={22} className="rm-spin rm-card-loader" />
                ) : (
                  <ChevronRight size={22} />
                )}
              </button>

              <button
                type="button"
                className="rm-pay-option"
                onClick={() => goToCheckout("gift-code")}
              >
                <span className="rm-pay-label">Gift Code</span>

                <span className="rm-gift-logo">RAYMOCH</span>

                <ChevronRight size={22} />
              </button>
            </div>
          </section>
        </section>
      </main>

      <StripeCardModal
        open={cardModalOpen}
        onClose={() => setCardModalOpen(false)}
        clientSecret={clientSecret}
        planKey={planKey}
        selectedPlan={selectedPlan}
      />

      <PayPalMembershipModal
        open={paypalModalOpen}
        onClose={() => setPaypalModalOpen(false)}
        planKey={planKey}
        selectedPlan={selectedPlan}
      />

      <Footer />
    </>
  );
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    background: #ffffff;
    color: #020617;
    font-family:
      "Plus Jakarta Sans",
      "Inter",
      "SF Pro Display",
      "Segoe UI",
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  .breadcrumb {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    margin: 0 0 18px;
    padding: 12px 16px;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 14px;
    box-shadow: 0 4px 14px rgba(15,23,42,.06);
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: .6px;
  }

  .breadcrumb a {
    color: #2d4fbf;
    text-decoration: none;
    font-weight: 600;
    transition: color .18s ease;
  }

  .breadcrumb a:hover {
    color: #0A2A6B;
    text-decoration: underline;
  }

  .breadcrumb .sep {
    color: #94a3b8;
    font-weight: 700;
  }

  .breadcrumb .current {
    color: #0f172a;
    font-weight: 800;
  }

  .rm-pay-page {
    min-height: 72vh;
    padding: 54px 18px 86px;
    background:
      radial-gradient(circle at top right, rgba(45,79,191,0.10), transparent 28%),
      linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
    display: flex;
    justify-content: center;
  }

  .rm-pay-layout {
    width: 100%;
    max-width: 1180px;
    display: grid;
    grid-template-columns: 380px minmax(0, 620px);
    gap: 52px;
    align-items: start;
    justify-content: center;
  }

  .rm-selected-plan {
    border-radius: 24px;
    padding: 12px;
    background: #ffffff;
    border: 1px solid #dbeafe;
    box-shadow: 0 24px 50px rgba(10, 42, 107, 0.12);
  }

  .rm-selected-plan-top {
    height: 36px;
    margin: -12px -12px 12px;
    padding: 0 16px;
    border-radius: 24px 24px 0 0;
    background: #0A2A6B;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    font-weight: 900;
    letter-spacing: 0.03em;
    text-transform: uppercase;
  }

  .rm-selected-plan-banner {
    min-height: 100px;
    border-radius: 16px;
    padding: 22px 18px;
    background: linear-gradient(135deg,#0A2A6B 0%,#1e3a8a 55%,#2d4fbf 100%);
    color: #fff;
  }

  .rm-selected-plan-banner h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 900;
  }

  .rm-selected-plan-banner p {
    margin: 8px 0 0;
    color: rgba(255,255,255,0.86);
    font-weight: 800;
  }

  .rm-selected-price,
  .rm-selected-feature {
    padding: 16px 10px;
    border-bottom: 1px solid #dbe2ea;
  }

  .rm-selected-feature:last-child {
    border-bottom: 0;
  }

  .rm-selected-price span,
  .rm-selected-feature span {
    display: block;
    margin-bottom: 7px;
    font-size: 12px;
    color: #64748b;
    font-weight: 800;
    letter-spacing: 0.01em;
  }

  .rm-selected-price strong {
    font-size: 22px;
    color: #0A2A6B;
    font-weight: 900;
  }

  .rm-selected-feature strong {
    display: block;
    color: #0f172a;
    font-size: 15px;
    font-weight: 800;
    line-height: 1.45;
  }

  .rm-pay-shell {
    width: 100%;
    max-width: 620px;
  }

  .rm-pay-shell h1 {
    margin: 0;
    font-size: 38px;
    line-height: 1.1;
    font-weight: 900;
    color: #020617;
    letter-spacing: -0.03em;
  }

  .rm-pay-subtitle {
    margin: 22px 0 0;
    max-width: 480px;
    font-size: 18px;
    line-height: 1.35;
    color: #111827;
  }

  .rm-pay-note {
    margin-top: 22px;
    display: grid;
    gap: 2px;
    font-size: 17px;
    line-height: 1.22;
    color: #020617;
  }

  .rm-pay-secure {
    margin-top: 34px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 5px;
    color: #111827;
    font-size: 15px;
  }

  .rm-pay-options {
    margin-top: 8px;
    display: grid;
    gap: 12px;
  }

  .rm-pay-option {
    width: 100%;
    min-height: 68px;
    border: 1px solid #bdbdbd;
    border-radius: 6px;
    background: #ffffff;
    color: #020617;
    padding: 0 18px 0 24px;
    cursor: pointer;
    display: grid;
    grid-template-columns: 1fr auto auto;
    align-items: center;
    gap: 16px;
    text-align: left;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease,
      transform 0.2s ease;
  }

  .rm-pay-option:disabled {
    opacity: 0.8;
    cursor: wait;
  }

  .rm-pay-option:hover {
    border-color: #0A2A6B;
    box-shadow: 0 12px 26px rgba(10, 42, 107, 0.13);
    transform: translateY(-1px);
  }

  .rm-pay-label {
    font-size: 18px;
    font-weight: 600;
  }

  .rm-card-icons {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .rm-card {
    height: 24px;
    min-width: 38px;
    padding: 0 6px;
    border-radius: 3px;
    background: #f8fafc;
    border: 1px solid #e5e7eb;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 900;
  }

  .rm-card.visa {
    color: #1d4ed8;
  }

  .rm-card.mc {
    color: #dc2626;
  }

  .rm-card.amex {
    color: #2563eb;
  }

  .rm-card.discover {
    color: #c2410c;
  }

  .rm-card-loader {
    color: #0A2A6B;
  }

  .rm-paypal-logo {
    width: 38px;
    height: 26px;
    border: 1px solid #e5e7eb;
    border-radius: 3px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #0070ba;
    font-weight: 900;
    font-size: 20px;
    font-style: italic;
  }

  .rm-gift-logo {
    height: 26px;
    padding: 0 8px;
    border-radius: 3px;
    background: #eff6ff;
    color: #0A2A6B;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 0.02em;
  }

  .rm-spin {
    animation: rm-spin 0.75s linear infinite;
  }

  @keyframes rm-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .rm-modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 99999;
    background: rgba(15, 23, 42, 0.58);
    backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 18px;
  }

  .rm-modal-panel {
    position: relative;
    width: min(720px, 100%);
    max-height: 92vh;
    overflow-y: auto;
    background: #ffffff;
    border-radius: 18px;
    padding: 32px;
    box-shadow: 0 32px 80px rgba(15, 23, 42, 0.32);
  }

  .rm-paypal-modal-panel {
    max-width: 620px;
  }

  .rm-modal-close {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 38px;
    height: 38px;
    border: 0;
    border-radius: 999px;
    background: #f1f5f9;
    color: #0f172a;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .rm-stripe-form {
    width: 100%;
  }

  .rm-modal-step {
    font-size: 14px;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 8px;
  }

  .rm-stripe-form h2,
  .rm-paypal-modal-content h2 {
    margin: 0;
    font-size: 34px;
    line-height: 1.1;
    font-weight: 900;
    color: #020617;
    letter-spacing: -0.03em;
  }

  .rm-paypal-subtitle {
    margin: 14px 0 0;
    color: #475569;
    font-size: 15px;
    line-height: 1.55;
  }

  .rm-card-brand-row {
    display: flex;
    gap: 8px;
    margin: 26px 0 14px;
  }

  .rm-payment-element-wrap {
    border: 1px solid #dbe2ea;
    border-radius: 10px;
    padding: 14px;
    background: #ffffff;
  }

  .rm-selected-payment-summary {
    margin-top: 24px;
    padding: 18px;
    border-radius: 8px;
    background: #f1f5f9;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
  }

  .rm-selected-payment-summary strong {
    display: block;
    font-size: 17px;
    color: #020617;
  }

  .rm-selected-payment-summary span {
    display: block;
    margin-top: 4px;
    color: #475569;
    font-weight: 600;
  }

  .rm-selected-payment-summary a {
    color: #0A2A6B;
    font-weight: 800;
  }

  .rm-membership-terms {
    margin: 22px 0;
    color: #475569;
    font-size: 13px;
    line-height: 1.42;
  }

  .rm-stripe-error {
    margin-bottom: 14px;
    padding: 12px 14px;
    border-radius: 8px;
    background: #fef2f2;
    color: #b91c1c;
    font-size: 13px;
    font-weight: 700;
  }

  .rm-start-membership-btn {
    width: 100%;
    min-height: 58px;
    border: 0;
    border-radius: 8px;
    background:
      linear-gradient(
        135deg,
        #0A2A6B 0%,
        #1e3a8a 15%,
        #2d4fbf 35%
      );
    color: #ffffff;
    font-size: 24px;
    font-weight: 900;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    box-shadow: 0 18px 36px rgba(10, 42, 107, 0.22);
  }

  .rm-start-membership-btn:disabled {
    opacity: 0.72;
    cursor: wait;
  }

  .rm-paypal-buttons-wrap {
    margin-top: 24px;
    padding: 16px;
    border: 1px solid #dbe2ea;
    border-radius: 12px;
    background: #ffffff;
  }

  div[style*="position: fixed"][style*="bottom"] {
    display: none !important;
  }

  div[class*="StripeLink"],
  div[class*="LinkAuthentication"],
  div[class*="p-Link"],
  div[class*="Block"] {
    display: none !important;
  }

  @media (max-width: 980px) {
    .rm-pay-layout {
      grid-template-columns: 1fr;
      max-width: 620px;
      gap: 34px;
    }
  }

  @media (max-width: 640px) {
    .rm-pay-page {
      padding: 34px 14px 60px;
    }

    .rm-pay-shell h1 {
      font-size: 31px;
    }

    .rm-pay-subtitle {
      font-size: 16px;
    }

    .rm-pay-note {
      font-size: 15px;
    }

    .rm-pay-option {
      grid-template-columns: 1fr auto;
      min-height: 72px;
      padding: 14px;
      gap: 10px;
    }

    .rm-card-icons,
    .rm-paypal-logo,
    .rm-gift-logo {
      grid-column: 1 / -1;
    }

    .rm-modal-panel {
      padding: 24px 18px;
    }

    .rm-stripe-form h2,
    .rm-paypal-modal-content h2 {
      font-size: 27px;
    }

    .rm-start-membership-btn {
      font-size: 19px;
    }
  }
`;

