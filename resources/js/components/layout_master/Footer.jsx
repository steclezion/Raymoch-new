// resources/js/components/layout_master/Footer.jsx
import React, { useMemo } from "react";

export default function Footer({ routes = {} }) {
  // Safe defaults so nothing crashes if a route is missing
  const R = useMemo(
    () => ({
      about: routes.about || "/about",
      careers: routes.careers || "/careers",
      press: routes.press || "/press",
      contact: routes.contact || "/contact",
      explore: routes.explore || "/explore",
      insights: routes.insights || "/insights",
      verification: routes.verification || "/verification",
      services: routes.services || "/services",
      blog: routes.blog || "/blog",
      help: routes.help || "/help",
      security: routes.security || "/security",
      status: routes.status || "/status",
      privacy: routes.privacy || "/privacy",
      terms: routes.terms || "/terms",
    }),
    [routes]
  );

  const year = new Date().getFullYear();

  return (
    <footer
      className="footer"
      id="site-footer"
      style={{ background: "#0b1020", color: "#cbd5e1" }}
    >
      <div
        className="wrap"
        style={{ maxWidth: 1328, margin: "0 auto", padding: "32px 18px" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 24,
            alignItems: "start",
          }}
        >
          <div>
            <div
              style={{
                color: "#fff",
                fontWeight: 800,
                fontSize: "1.25rem",
                marginBottom: 8,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <svg width="28" height="28" viewBox="0 0 200 200" aria-hidden="true">
                <polygon
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="10"
                  points="100,18 172,59 172,141 100,182 28,141 28,59"
                />
                <text
                  x="100"
                  y="118"
                  textAnchor="middle"
                  style={{ fill: "currentColor", font: "700 105px Georgia" }}
                >
                  R
                </text>
              </svg>
              Raymoch
            </div>
            <p
              style={{
                color: "#94a3b8",
                maxWidth: 320,
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Connecting investors and entrepreneurs through trust, verified data,
              and actionable insights.
            </p>
          </div>

          <div>
            <h5 style={{ margin: "0 0 10px", color: "#e5e7eb", fontSize: ".95rem" }}>
              Company
            </h5>
            <a href={R.about} style={linkStyle}>About</a>
            <a href={R.careers} style={linkStyle}>Careers</a>
            <a href={R.press} style={linkStyle}>Press</a>
            <a href={R.contact} style={linkStyle}>Contact</a>
          </div>

          <div>
            <h5 style={{ margin: "0 0 10px", color: "#e5e7eb", fontSize: ".95rem" }}>
              Product
            </h5>
            <a href={R.explore} style={linkStyle}>Explore Businesses</a>
            <a href={R.insights} style={linkStyle}>Market Insights</a>
            <a href={R.verification} style={linkStyle}>Verification</a>
            <a href={R.services} style={linkStyle}>Programs &amp; Services</a>
          </div>

          <div>
            <h5 style={{ margin: "0 0 10px", color: "#e5e7eb", fontSize: ".95rem" }}>
              Resources
            </h5>
            <a href={R.blog} style={linkStyle}>Blog</a>
            <a href={R.help} style={linkStyle}>Help Center</a>
            <a href={R.security} style={linkStyle}>Security</a>
            <a href={R.status} style={linkStyle}>Status</a>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid #1f2937",
            marginTop: 26,
            paddingTop: 14,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: ".9rem",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <div>© {year} Raymoch. All rights reserved.</div>
          <div>
            <a href={R.privacy} style={{ color: "#cbd5e1", marginLeft: 14 }}>
              Privacy
            </a>
            <a href={R.terms} style={{ color: "#cbd5e1", marginLeft: 14 }}>
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

const linkStyle = { display: "block", color: "#cbd5e1", margin: "6px 0" };
