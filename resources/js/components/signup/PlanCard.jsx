import React from "react";

export default function PlanCard({
  title,
  price,
  per,
  unitNote,
  description,
  features = [],
  ctaHref,
}) {
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
          {features.map((f, i) => <li key={i}>{f}</li>)}
        </ul>
        <div className="spacer" />
      </div>
      <div className="planbar" aria-label="Choose a plan">
        <a className="primary" href={ctaHref}>Create</a>
      </div>
    </article>
  );
}
