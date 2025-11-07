import React from "react";

export default function Hero({ title, subtitle }) {
  return (
    <section className="hero">
      <div className="hero-inner">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </section>
  );
}
