import React from "react";

export default function PlanCard({
  id,
  title,
  badge,
  price,
  per,
  desc,
  features = [],
  primaryHref,
  primaryLabel = "Continue",
  backHref,
  backLabel = "Back",
  selected = false,
}) {
  return (
    <article className="plan" id ={id} data-plan={id} data-selected={String(selected)} aria-labelledby={`h-${id}`}>
      <h2 id={`h-${id}`}>
        {title} {badge ? <span className="badge">{badge}</span> : null}
      </h2>

      <div className="price">
        <strong>{price}</strong>
        <span>/mo</span>
        <em> {per}</em>
      </div>

      <p className="desc">{desc}</p>

      <ul className="features" aria-label="Included">
        {features.map((f, i) => <li key={i}>{f}</li>)}
      </ul>

      <div className="actions">
        <a className="primary" href={primaryHref}>{primaryLabel}</a>
        <a className="back" href={backHref}>{backLabel}</a>
      </div>
    </article>
  );
}
