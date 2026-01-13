import React, { useState, useEffect } from "react";

export default function PlanCard({
  title,
  price,
  per,
  unitNote,
  description,
  features = [],
  ctaHref,
}) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (loading) {
      const timer = setInterval(() => {
        setProgress((prev) => {
          const next = prev + 4;
          if (next >= 100) {
            clearInterval(timer);
            // Simulate page load or redirect
            setTimeout(() => {
              window.location.href = ctaHref;
            }, 300);
          }
          return next;
        });
      }, 80);
      return () => clearInterval(timer);
    }
  }, [loading, ctaHref]);

  return (
    <article className="card" aria-labelledby={`h-${title}`}>
      <div className="card-body">
        <h3 id={`h-${title}`}>{title}</h3>

        <div className="price-row">
          <strong>{price}</strong>
          <span>/{per}</span>
          {unitNote ? <em> {unitNote}</em> : null}
        </div>

        <p>{description}</p>

        <ul className="features" aria-label="Benefits">
          {features.map((f, i) => (
            <li key={i}>{f}</li>
          ))}
        </ul>

        <div className="spacer">
          {loading && (
            <div
              style={{
                position: "relative",
                height: "8px",
                background: "rgba(0,0,0,0.05)",
                borderRadius: "4px",
                overflow: "hidden",
                marginTop: "12px",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  background:
                    "linear-gradient(90deg, #06080aff, #0b191dff, #171819ff)",
                  backgroundSize: "200% 100%",
                  borderRadius: "4px",
                  animation: "shine 1.2s linear infinite",
                  transition: "width 0.1s ease-in-out",
                }}
              ></div>
              <style>
                {`
                  @keyframes shine {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                  }
                `}
              </style>
            </div>
          )}
        </div>
      </div>

      <div className="planbar" aria-label="Choose a plan">
         
        <button
          className="primary"
          disabled={loading}
          onClick={(e) => {
            e.preventDefault();
            if (!loading) {
              setLoading(true);
              setProgress(0);
            }
          }}
          style={{
            opacity: loading ? 0.6 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          <a className="primary" href={ctaHref}>
          {loading ? "Loading..." : "Create"}</a>
        </button>
      </div>
    </article>
  );
}
