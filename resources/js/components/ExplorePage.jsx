import React, { useEffect, useState } from "react";
import { fetchCompanies, fetchSectors } from "../utils/api";

export default function ExplorePage() {
  const [sectors, setSectors] = useState([]);
  const [countries, setCountries] = useState([]);
  const [filters, setFilters] = useState({ q: "", country: "", sector: "" });

  // inside your component:
function Page({ routes }) {
  const R = {
    ...DEFAULT_ROUTES,
    ...(typeof window !== "undefined" ? window.ROUTES || {} : {}),
    ...(routes || {}),
  };
}
  console.log("Resolved routes:", R);

  useEffect(() => {
    fetchSectors().then(setSectors);
    setCountries([
      "Kenya", "Nigeria", "Ghana", "South Africa", "United States",
      "United Kingdom"
    ]);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCompanies(filters).then((data) => console.log("Search results:", data));
  };

  return (
    <section className="container">
      <div className="explore-hero">
        <h1>Explore Businesses</h1>
        <p>Pick a sector or search; we’ll show the right companies.</p>
      </div>
      <form onSubmit={handleSearch} className="search-panel">
        <input
          value={filters.q}
          onChange={(e) => setFilters({ ...filters, q: e.target.value })}
          placeholder="Search businesses…"
        />
        <select
          value={filters.country}
          onChange={(e) => setFilters({ ...filters, country: e.target.value })}
        >
          <option value="">Country</option>
          {countries.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select
          value={filters.sector}
          onChange={(e) => setFilters({ ...filters, sector: e.target.value })}
        >
          <option value="">Sector</option>
          {sectors.map((s) => <option key={s}>{s}</option>)}
        </select>
        <button className="btn primary">Search</button>
      </form>
    </section>
  );
}
