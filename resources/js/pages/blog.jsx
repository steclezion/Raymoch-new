import React, { useMemo, useState } from "react";
import AuthAwareNavigation from "../components/AuthAwareNavigation.jsx";
import Footer from "../components/layout_master/Footer.jsx";
import RaymochInformationSupporter from "../components/RaymochInformationSupporter.jsx";
import { ResponsiveController } from "../components/ResponsiveController.jsx";
import "../styles/blog.css";

const ARTICLES = [
  {
    id: "trust-signals",
    category: "Trust & Verification",
    title: "Trust signals that make an African business easier to back",
    excerpt: "A practical look at the evidence investors notice first—and how businesses can present it with clarity.",
    image: "/images/abstract-polygonal-africa-map-with.jpg",
    readTime: "6 min read",
    featured: true,
    body: [
      "Strong opportunities can be overlooked when essential business information is fragmented. A useful trust profile brings identity, operating history, leadership, and commercial evidence into one coherent view.",
      "For businesses, the goal is not to publish more information. It is to make the right evidence easy to understand, current, and simple to verify. For investors, that structure creates a faster path from discovery to a productive first conversation.",
    ],
  },
  {
    id: "energy-opportunity",
    category: "Sector Briefs",
    title: "Where distributed energy creates room for enterprise",
    excerpt: "How reliable power can unlock new operating models across manufacturing, logistics, and services.",
    image: "/images/companies/ezra-4.jpg",
    readTime: "5 min read",
    body: [
      "Energy access is more than an infrastructure story. It shapes operating hours, production reliability, cold-chain capability, and the cost of serving customers.",
      "The most useful opportunity lens connects power availability with specific business demand. That makes it easier to identify where energy investment can support durable local enterprise.",
    ],
  },
  {
    id: "diligence-questions",
    category: "Investor Guides",
    title: "Seven better questions for an early diligence conversation",
    excerpt: "Move beyond the pitch deck with questions that reveal operating discipline, resilience, and readiness.",
    image: "/images/1-edited-ai.jpg",
    readTime: "7 min read",
    body: [
      "Early diligence should help both sides learn, not force a business to perform certainty it does not have. Questions about customers, cash cycles, dependencies, and recent decisions often reveal more than broad market claims.",
      "A structured conversation also gives founders a fair opportunity to explain local context—the practical realities that can disappear inside a conventional pitch deck.",
    ],
  },
  {
    id: "infrastructure-growth",
    category: "Market Perspectives",
    title: "Reading infrastructure as a business growth signal",
    excerpt: "Roads, logistics, and connectivity can tell a deeper story about where demand may become commercially reachable.",
    image: "/images/companies/ezra-7.jpg",
    readTime: "4 min read",
    body: [
      "Infrastructure changes the radius within which a business can operate efficiently. It can widen access to suppliers, shorten delivery times, and make previously distant customers commercially reachable.",
      "The important question is not simply where infrastructure exists, but which business constraints it removes and what new activity can follow.",
    ],
  },
  {
    id: "business-readiness",
    category: "Business Guides",
    title: "A practical readiness checklist before seeking capital",
    excerpt: "The documents, decisions, and operating details that help a serious opportunity stand out.",
    image: "/images/companies/ezra-12.jpg",
    readTime: "8 min read",
    body: [
      "Capital readiness starts before fundraising. Clear ownership records, reliable financial information, documented customer activity, and a specific use of funds help an investor understand what already works.",
      "Readiness does not mean perfection. It means knowing what evidence is available, where gaps remain, and how new capital would change the operating picture.",
    ],
  },
  {
    id: "signal-noise",
    category: "Raymoch Notes",
    title: "From market noise to decision-ready intelligence",
    excerpt: "Why context, verification, and comparability matter when opportunity data travels across borders.",
    image: "/images/reports/featured-report.jpg",
    readTime: "5 min read",
    body: [
      "More data does not automatically create better decisions. Decision-ready intelligence connects evidence to context and makes uncertainty visible instead of hiding it.",
      "Raymoch’s editorial approach focuses on signals readers can use: what changed, why it matters, what should be verified, and which next question is worth asking.",
    ],
  },
];

const CATEGORIES = ["All", ...new Set(ARTICLES.map((article) => article.category))];

export default function Blog() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState(null);

  const visibleArticles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return ARTICLES.filter((article) => {
      const matchesCategory = category === "All" || article.category === category;
      const matchesQuery = !normalizedQuery || `${article.title} ${article.excerpt} ${article.category}`.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  const featured = ARTICLES.find((article) => article.featured);

  const openArticle = (article) => {
    setSelectedArticle(article);
    window.requestAnimationFrame(() => document.getElementById("reading-room")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  return (
    <ResponsiveController>
      <AuthAwareNavigation activePath="/blog" />
      <main className="ray-blog">
        <section className="ray-blog__hero" aria-labelledby="blog-title">
          <div className="ray-blog__shell ray-blog__hero-grid">
            <div className="ray-blog__hero-copy">
              <span className="ray-blog__eyebrow">The Raymoch Journal</span>
              <h1 id="blog-title">Clear thinking for Africa’s next business chapter.</h1>
              <p>Practical intelligence for founders, investors, and partners navigating trusted growth across African markets.</p>
              <a className="ray-blog__primary-link" href="#latest">Explore the latest <span aria-hidden="true">→</span></a>
            </div>
            <button className="ray-blog__feature" type="button" onClick={() => openArticle(featured)}>
              <img src={featured.image} alt="Connected points forming the map of Africa" />
              <span className="ray-blog__feature-overlay">
                <span className="ray-blog__tag">Featured · {featured.category}</span>
                <strong>{featured.title}</strong>
                <span>{featured.readTime} <b aria-hidden="true">↗</b></span>
              </span>
            </button>
          </div>
        </section>

        <section className="ray-blog__ticker" aria-label="Journal focus areas">
          <div className="ray-blog__shell">
            <span>Evidence-led</span><i aria-hidden="true" /><span>Market-aware</span><i aria-hidden="true" /><span>Built for action</span>
          </div>
        </section>

        <section className="ray-blog__library ray-blog__shell" id="latest" aria-labelledby="latest-title">
          <div className="ray-blog__section-heading">
            <div><span className="ray-blog__eyebrow">Ideas worth acting on</span><h2 id="latest-title">Latest perspectives</h2></div>
            <label className="ray-blog__search">
              <span className="sr-only">Search articles</span>
              <span aria-hidden="true">⌕</span>
              <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the journal" />
            </label>
          </div>

          <div className="ray-blog__filters" aria-label="Filter articles by topic">
            {CATEGORIES.map((item) => (
              <button key={item} type="button" className={category === item ? "is-active" : ""} onClick={() => setCategory(item)} aria-pressed={category === item}>{item}</button>
            ))}
          </div>

          {visibleArticles.length ? (
            <div className="ray-blog__grid">
              {visibleArticles.map((article, index) => (
                <article className={`ray-blog__card ${index === 0 ? "ray-blog__card--wide" : ""}`} key={article.id}>
                  <button type="button" onClick={() => openArticle(article)} aria-label={`Read ${article.title}`}>
                    <span className="ray-blog__image-wrap"><img src={article.image} alt="" loading="lazy" /></span>
                    <span className="ray-blog__card-content">
                      <span className="ray-blog__meta"><span>{article.category}</span><span>{article.readTime}</span></span>
                      <strong>{article.title}</strong>
                      <span className="ray-blog__excerpt">{article.excerpt}</span>
                      <span className="ray-blog__read">Read perspective <b aria-hidden="true">→</b></span>
                    </span>
                  </button>
                </article>
              ))}
            </div>
          ) : <p className="ray-blog__empty">No perspectives match that search. Try another topic or phrase.</p>}
        </section>

        {selectedArticle && (
          <section className="ray-blog__reading" id="reading-room" aria-labelledby="reading-title">
            <div className="ray-blog__reading-inner">
              <button className="ray-blog__close" type="button" onClick={() => setSelectedArticle(null)} aria-label="Close article">×</button>
              <span className="ray-blog__eyebrow">{selectedArticle.category} · {selectedArticle.readTime}</span>
              <h2 id="reading-title">{selectedArticle.title}</h2>
              <p className="ray-blog__reading-lead">{selectedArticle.excerpt}</p>
              {selectedArticle.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <a href="/insights">Continue with market insights <span aria-hidden="true">→</span></a>
            </div>
          </section>
        )}

        <section className="ray-blog__newsletter">
          <div className="ray-blog__shell ray-blog__newsletter-inner">
            <div><span className="ray-blog__eyebrow">The signal, not the noise</span><h2>Useful perspective, delivered thoughtfully.</h2><p>Occasional notes on trustworthy businesses, markets, and investment readiness.</p></div>
            <div className="ray-blog__next-actions">
              <a href="/insights">Explore market insights <span aria-hidden="true">→</span></a>
              <a href="/explore">Discover businesses</a>
            </div>
          </div>
        </section>
      </main>
      <RaymochInformationSupporter />
      <Footer />
    </ResponsiveController>
  );
}
