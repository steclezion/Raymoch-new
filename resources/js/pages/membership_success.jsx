import React from "react";
import { createRoot } from "react-dom/client";
import { CheckCircle2 } from "lucide-react";

import Header from "../components/layout_master/Header.jsx";
import Footer from "../components/layout_master/Footer.jsx";

export default function MembershipSuccess() {
  const params = new URLSearchParams(window.location.search);
  const plan = params.get("plan") || "business";

  return (
    <>
      <style>{styles}</style>

      <Header />

      <main className="rm-success-page">
        <section className="rm-success-card">
          <CheckCircle2 size={64} className="rm-success-icon" />

          <h1>Membership Started</h1>

          <p>
            Your <strong>{plan}</strong> plan is now active. You can now view
            your matched search results.
          </p>

          <button
            type="button"
            onClick={() => {
              window.location.href = "/search/results";
            }}
          >
            View Results
          </button>
        </section>
      </main>

      <Footer />
    </>
  );
}

const styles = `
  body {
    margin: 0;
    font-family: "Plus Jakarta Sans", Inter, system-ui, sans-serif;
    background: #f8fbff;
  }

  .rm-success-page {
    min-height: 70vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 16px;
  }

  .rm-success-card {
    width: min(560px, 100%);
    background: #ffffff;
    border: 1px solid #dbeafe;
    border-radius: 24px;
    padding: 44px 32px;
    text-align: center;
    box-shadow: 0 24px 60px rgba(10, 42, 107, 0.14);
  }

  .rm-success-icon {
    color: #16a34a;
  }

  .rm-success-card h1 {
    margin: 18px 0 10px;
    font-size: 34px;
    font-weight: 900;
    color: #0A2A6B;
  }

  .rm-success-card p {
    color: #475569;
    font-size: 16px;
    line-height: 1.6;
  }

  .rm-success-card button {
    margin-top: 24px;
    width: 100%;
    height: 56px;
    border: 0;
    border-radius: 12px;
    background: linear-gradient(135deg,#0A2A6B 0%,#1e3a8a 15%,#2d4fbf 35%);
    color: #ffffff;
    font-size: 16px;
    font-weight: 900;
    cursor: pointer;
  }
`;

