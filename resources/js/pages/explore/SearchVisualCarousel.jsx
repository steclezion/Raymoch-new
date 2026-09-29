import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";

const TILE_COLUMNS = 6;
const TILE_ROWS = 4;
const TILES = Array.from({ length: TILE_COLUMNS * TILE_ROWS }, (_, index) => ({
  index,
  column: index % TILE_COLUMNS,
  row: Math.floor(index / TILE_COLUMNS),
}));

const FALLBACK_SLIDES = [
  {
    title: "Advanced Raymoch Search",
    subtitle: "Mapping business opportunities with intelligent precision.",
    image_url: "/images/advanced-raymoch-search-2k.webp",
  },
];

function csrfToken() {
  return document.querySelector('meta[name="csrf-token"]')?.content || "";
}

export default function SearchVisualCarousel({ completed, filters, searchToken }) {
  const [slides, setSlides] = useState(FALLBACK_SLIDES);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const sector = filters?.sector;

  useEffect(() => {
    if (!completed || !sector || String(sector).toLowerCase() === "all") return;

    const controller = new AbortController();
    setLoading(true);
    setMessage("");

    fetch("/api/search-visuals", {
      method: "POST",
      credentials: "same-origin",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": csrfToken(),
      },
      body: JSON.stringify({ ...filters, search_token: searchToken }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok || !data?.ok) throw new Error(data?.message || "Visual generation failed.");
        setSlides(data.slides);
        setActive(0);
      })
      .catch((error) => {
        if (error.name !== "AbortError") setMessage(error.message);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [completed, sector, searchToken, JSON.stringify(filters)]);

  useEffect(() => {
    if (slides.length < 2) return undefined;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % slides.length), 8000);
    return () => window.clearInterval(timer);
  }, [slides]);

  const slide = slides[active];

  return (
    <section className="rm-visual" aria-live="polite">
      <AnimatePresence mode="wait">
        <motion.article
          key={`${active}-${slide.image_url}`}
          className="rm-visual__slide"
          initial={{ opacity: 0, scale: 1.035, filter: "blur(8px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.985, filter: "blur(6px)" }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.img
            src={slide.image_url}
            alt=""
            className="rm-visual__image"
            initial={{ scale: 1.025, opacity: 0.3 }}
            animate={{ scale: 1.09, opacity: 1 }}
            transition={{ duration: 12, ease: "linear" }}
          />

          <div className="rm-visual__tiles" aria-hidden="true">
            {TILES.map(({ index, column, row }) => (
              <motion.span
                key={`${slide.image_url}-${index}`}
                className="rm-visual__tile"
                style={{
                  backgroundImage: `url(${slide.image_url})`,
                  backgroundSize: `${TILE_COLUMNS * 100}% ${TILE_ROWS * 100}%`,
                  backgroundPosition: `${column * (100 / (TILE_COLUMNS - 1))}% ${row * (100 / (TILE_ROWS - 1))}%`,
                }}
                initial={{ opacity: 0, rotateY: 88, scale: 0.88 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  rotateY: [88, 0, 0, 0],
                  scale: [0.88, 1, 1, 1.015],
                }}
                transition={{
                  duration: 3.8,
                  delay: (column + row) * 0.09,
                  times: [0, 0.35, 0.72, 1],
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            ))}
          </div>
          <div className="rm-visual__shade" />
          <div className="rm-visual__content">
            <motion.span
              className="rm-visual__eyebrow"
              animate={{ boxShadow: ["0 0 0 0 rgba(56,189,248,.35)", "0 0 0 12px rgba(56,189,248,0)"] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            >
              <Sparkles size={15} /> Intelligent discovery
            </motion.span>
            <h2>{slide.title}</h2>
            <p>{slide.subtitle}</p>
          </div>
        </motion.article>
      </AnimatePresence>

      <div className="rm-visual__status">
        {loading && <><Loader2 size={14} className="rm-spin" /> Personalizing the next 2K visual in the background…</>}
        {!loading && message && <span>{message}</span>}
        {!loading && !message && slides.map((_, index) => (
          <button key={index} type="button" aria-label={`Show visual ${index + 1}`} className={index === active ? "active" : ""} onClick={() => setActive(index)} />
        ))}
      </div>

      <style>{`
        .rm-visual{position:relative;width:100%;max-width:960px;margin:auto}.rm-visual__slide{position:relative;isolation:isolate;height:clamp(320px,52vw,540px);overflow:hidden;border:1px solid rgba(148,163,184,.22);border-radius:28px;background:#071426;box-shadow:0 30px 80px rgba(2,8,23,.24);perspective:1200px}.rm-visual__image,.rm-visual__shade,.rm-visual__tiles{position:absolute;inset:0;width:100%;height:100%}.rm-visual__image{z-index:-3;object-fit:cover}.rm-visual__tiles{z-index:-2;display:grid;grid-template-columns:repeat(6,1fr);grid-template-rows:repeat(4,1fr);pointer-events:none;transform-style:preserve-3d}.rm-visual__tile{display:block;background-repeat:no-repeat;backface-visibility:hidden;transform-origin:center;will-change:transform,opacity}.rm-visual__shade{z-index:-1;background:linear-gradient(90deg,rgba(2,6,23,.9) 0%,rgba(2,6,23,.56) 48%,rgba(2,6,23,.12) 100%),linear-gradient(0deg,rgba(2,6,23,.56),transparent 60%)}.rm-visual__content{position:absolute;left:clamp(24px,6vw,72px);bottom:clamp(28px,7vw,76px);max-width:620px;color:#fff}.rm-visual__eyebrow{display:inline-flex;align-items:center;gap:8px;padding:8px 12px;border:1px solid rgba(125,211,252,.36);border-radius:999px;background:rgba(8,47,73,.58);backdrop-filter:blur(12px);color:#bae6fd;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}.rm-visual h2{margin:18px 0 10px;font-size:clamp(30px,5vw,62px);line-height:1.02;letter-spacing:-.045em}.rm-visual p{margin:0;max-width:580px;color:#dbeafe;font-size:clamp(14px,2vw,19px);line-height:1.55}.rm-visual__status{min-height:36px;display:flex;align-items:center;justify-content:center;gap:8px;color:#64748b;font-size:12px}.rm-visual__status button{width:8px;height:8px;padding:0;border:0;border-radius:999px;background:#cbd5e1;cursor:pointer;transition:width .4s,background .4s}.rm-visual__status button.active{width:30px;background:#0ea5e9}@media(prefers-reduced-motion:reduce){.rm-visual *{animation:none!important;transition:none!important}.rm-visual__tiles{display:none}}
      `}</style>
    </section>
  );
}
