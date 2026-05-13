// resources/js/pages/Pricing.jsx

import React, { useMemo, useState, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";

import Header from "../components/layout_master/Header.jsx";
import Footer from "../components/layout_master/Footer.jsx";
import BreadcrumbsNav from "../components/common/BreadcrumbsNav";

const PLANS = [
  {
    key: "basic",
    label: "Current Plan",
    name: "Basic",
    quality: "Limited Access",
    price: "$0.00",
    tag: "Free",
    isCurrent: true,
    features: [
      ["Search access", "Basic"],
      ["Company result visibility", "Limited"],
      ["Trust summary", "Locked"],
      ["Investor matching", "Not included"],
      ["Verification insights", "Not included"],
      ["Best for", "General browsing"],
    ],
  },
  {
    key: "business",
    name: "Business",
    quality: "Company Growth",
    price: "$19.99",
    tag: "Recommended",
    features: [
      ["Search access", "Full"],
      ["Company result visibility", "Included"],
      ["Trust summary", "Included"],
      ["Investor matching", "Included"],
      ["Verification insights", "Included"],
      ["Best for", "SMEs and companies"],
    ],
  },
  {
    key: "investor",
    name: "Investor",
    quality: "Deal Discovery",
    price: "$26.99",
    tag: "Premium",
    features: [
      ["Search access", "Full"],
      ["Company result visibility", "Included"],
      ["Trust summary", "Advanced"],
      ["Investor matching", "Priority"],
      ["Verification insights", "Advanced"],
      ["Best for", "Investors and partners"],
    ],
  },
];

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState("business");

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const selected = useMemo(
    () => PLANS.find((plan) => plan.key === selectedPlan),
    [selectedPlan]
  );

  const handleContinue = () => {
    if (!selected) return;

    if (selected.key === "basic") {
      window.location.href = "/explore";
      return;
    }

 window.location.href = `/price-how-to-pay?plan=${selected.key}`;
  };

  return (
    <>
      <style>{styles}</style>

      <Header />

      <main className="rm-pricing-page">
      
        <section className="rm-pricing-shell">
              <BreadcrumbsNav />
          <div className="rm-pricing-header">
            <h1>Change Plan</h1>

            <p>
              Try out a new plan. You can always switch back if you do not love
              it.
            </p>
          </div>

          <div className="rm-plan-grid">
            {PLANS.map((plan) => {
              const isSelected = selectedPlan === plan.key;

              return (
                <button
                  key={plan.key}
                  type="button"
                  className={`rm-plan-card ${isSelected ? "selected" : ""}`}
                  onClick={() => setSelectedPlan(plan.key)}
                >
                  {plan.isCurrent && (
                    <div className="rm-current-ribbon">
                      Current Plan
                    </div>
                  )}

                  <div className="rm-plan-banner">
                    <div>
                      <h2>{plan.name}</h2>
                      <span>{plan.quality}</span>
                    </div>

                    {isSelected && (
                      <CheckCircle2
                        size={20}
                        className="rm-plan-check"
                      />
                    )}
                  </div>

                  <div className="rm-plan-body">
                    <div className="rm-feature-row price">
                      <span>Monthly price</span>
                      <strong>{plan.price} / month</strong>
                    </div>

                    {plan.features.map(([label, value]) => (
                      <div
                        className="rm-feature-row"
                        key={label}
                      >
                        <span>{label}</span>
                        <strong>{value}</strong>
                      </div>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="rm-pricing-action">
            <button
              type="button"
              onClick={handleContinue}
            >
              Continue
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

const styles = `
  * {
    box-sizing: border-box;
  }

 .breadcrumb{
  display:flex;
  align-items:center;
  flex-wrap:wrap;
  gap:8px;
  margin:0 0 18px;
  padding:12px 16px;
  background:#fff;
  border:1px solid #e5e7eb;
  border-radius:14px;
  box-shadow:0 4px 14px rgba(15,23,42,.06);
  font-size:13px;
  text-transform: uppercase;
  letter-spacing: .6px;
}
.breadcrumb a{
  color:#2d4fbf;
  text-decoration:none;
  font-weight:600;
  transition:color .18s ease;
}
.breadcrumb a:hover{
  color:#0A2A6B;
  text-decoration:underline;
}
.breadcrumb .sep{
  color:#94a3b8;
  font-weight:700;
}
.breadcrumb .current{
  color:#0f172a;
  font-weight:800;
}

  .rm-pricing-page {
    min-height: 100vh;
    background: #f8fafc;
    padding: 48px 18px 80px;
  }

  .rm-pricing-shell {
    width: 100%;
    max-width: 1180px;
    margin: 0 auto;
  }

  .rm-pricing-header {
    text-align: center;
    margin-bottom: 38px;
  }

  .rm-pricing-header h1 {
    margin: 0;
    font-size: 42px;
    font-weight: 900;
    color: #020617;
    line-height: 1.1;
  }

  .rm-pricing-header p {
    margin: 12px 0 0;
    color: #475569;
    font-size: 15px;
    line-height: 1.6;
  }

  .rm-plan-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 22px;
    align-items: stretch;
  }

  .rm-plan-card {
    position: relative;
    border: 1px solid #d1d5db;
    border-radius: 22px;
    background: #ffffff;
    padding: 10px;
    text-align: left;
    cursor: pointer;
    min-height: 680px;
    box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
    transition:
      transform 0.22s ease,
      box-shadow 0.22s ease,
      border-color 0.22s ease;
  }

  .rm-plan-card:hover {
    transform: translateY(-4px);
  }

  .rm-plan-card.selected {
    border-color: #64748b;
    box-shadow: 0 24px 44px rgba(15, 23, 42, 0.16);
  }

  .rm-current-ribbon {
    height: 30px;
    margin: -10px -10px 10px;
    border-radius: 20px 20px 0 0;
    background: #222222;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 900;
    letter-spacing: 0.02em;
  }

.rm-plan-banner {
  min-height: 100px;
  border-radius: 16px;
  padding: 22px 18px;

  background:
    linear-gradient(
      135deg,
      #0A2A6B 0%,
      #1e3a8a 15%,
      #2d4fbf 35%
    );

  color: #ffffff;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

  .rm-plan-banner h2 {
    margin: 0;
    font-size: 22px;
    font-weight: 900;
    line-height: 1.1;
  }

  .rm-plan-banner span {
    display: block;
    margin-top: 7px;
    font-size: 14px;
    font-weight: 800;
    opacity: 0.96;
  }

  .rm-plan-check {
    flex: 0 0 auto;
  }

  .rm-plan-body {
    padding: 18px 14px 8px;
  }

  .rm-feature-row {
    padding: 18px 0;
    border-bottom: 1px solid #dbe2ea;
  }

  .rm-feature-row:last-child {
    border-bottom: 0;
  }

  .rm-feature-row span {
    display: block;
    margin-bottom: 7px;
    font-size: 12px;
    color: #64748b;
    font-weight: 800;
    letter-spacing: 0.01em;
  }

  .rm-feature-row strong {
    display: block;
    color: #0f172a;
    font-size: 15px;
    font-weight: 800;
    line-height: 1.45;
  }

  .rm-feature-row.price strong {
    font-size: 21px;
  }

  .rm-pricing-action {
    margin-top: 56px;
    display: flex;
    justify-content: center;
  }

  .rm-pricing-action button {
    width: min(620px, 100%);
    height: 58px;
    border: 0;
    border-radius: 8px;
    background: #000000;
    color: #ffffff;
    font-size: 16px;
    font-weight: 900;
    cursor: pointer;
    transition:
      opacity 0.2s ease,
      transform 0.2s ease;
  }

  .rm-pricing-action button:hover {
    opacity: 0.92;
    transform: translateY(-1px);
  }

  @media (max-width: 1080px) {
    .rm-plan-grid {
      grid-template-columns: 1fr;
    }

    .rm-plan-card {
      min-height: auto;
    }
  }

  @media (max-width: 768px) {
    .rm-pricing-page {
      padding: 38px 14px 60px;
    }

    .rm-pricing-header h1 {
      font-size: 34px;
    }

    .rm-plan-banner h2 {
      font-size: 20px;
    }
  }

  @media (max-width: 520px) {
    .rm-pricing-page {
      padding: 28px 10px 50px;
    }

    .rm-pricing-header h1 {
      font-size: 28px;
    }

    .rm-pricing-header p {
      font-size: 14px;
    }

    .rm-plan-banner {
      min-height: 92px;
      padding: 18px 16px;
    }

    .rm-plan-banner h2 {
      font-size: 18px;
    }

    .rm-feature-row.price strong {
      font-size: 19px;
    }

    .rm-pricing-action {
      margin-top: 40px;
    }

    .rm-pricing-action button {
      height: 54px;
      font-size: 15px;
    }
  }
`;