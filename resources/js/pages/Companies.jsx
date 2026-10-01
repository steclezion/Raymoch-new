// resources/js/pages/companies/Companies.jsx
import React, { useEffect, useMemo, useState } from "react";
import { ShieldCheck } from "lucide-react";

// MUI
import { Box, Alert, Breadcrumbs, Link as MLink, Typography } from "@mui/material";

// Local
import "../styles/companies.css";
import "../styles/companies-dashboard.css";
import CompanyDetailDialog from "../components/companies/CompanyDetailDialog.jsx";
import HorizontalNavigation from "../components/HorizontalNavigation.jsx";
import { fetchCompanies, fetchCountries, fetchSectors } from "../utils/api.js";

// import FilterPanel from "../pages/companies/Filter_panel.jsx"; // removed
import TopSearchPanelCompanies from "../pages/companies/Top_search_panel_companies.jsx";
import MainLoadPanel from "../pages/companies/Main_load_panel.jsx";

function ascii(s) {
  return (s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/’/g, "'")
    .trim();
}

function lowerAscii(s) {
  return ascii(s).toLowerCase();
}

const COUNTRY_ALIASES = new Map([
  ["côte d’ivoire", "Cote d'Ivoire"],
  ["cote d’ivoire", "Cote d'Ivoire"],
  ["côte d'ivoire", "Cote d'Ivoire"],
  ["dr congo", "Democratic Republic of the Congo"],
  ["drc", "Democratic Republic of the Congo"],
  ["congo-kinshasa", "Democratic Republic of the Congo"],
  ["democratic republic of congo", "Democratic Republic of the Congo"],
  ["republic of congo", "Republic of the Congo"],
  ["congo-brazzaville", "Republic of the Congo"],
  ["são tome and príncipe", "Sao Tome and Principe"],
  ["sao tome & principe", "Sao Tome and Principe"],
  ["western sahara", "Sahrawi Arab Democratic Republic"],
  ["eswatini (swaziland)", "Eswatini"],
]);

function canonicalizeCountry(input) {
  if (!input) return "";
  const key = lowerAscii(input);
  if (COUNTRY_ALIASES.has(key)) return COUNTRY_ALIASES.get(key);
  return ascii(input);
}

function normalizeCompany(c) {
  if (!c) return {};

  const rawStatus = c.VerificationStatus ?? c.verification_status ?? "";
  const statusStr = String(rawStatus).trim().toLowerCase();
  const isVerified = /\bverified\b/.test(statusStr) || !!c.Verified;

  return {
    id: c.Id ?? c.id ?? c.ID ?? null,
    name: c.CompanyName ?? c.company_name ?? "—",
    sector: c.Sector ?? c.sector ?? "",
    industry: c.Industry ?? c.industry ?? c.industry_name ?? "",
    region: c.Region ?? c.region ?? c.region_name ?? "",
    country: c.Country ?? c.country ?? "",
    state: c.State ?? c.state ?? c.state_name ?? "",
    city: c.City ?? c.city ?? "",
    stage: c.Stage ?? c.stage ?? "",
    verified: isVerified,
    verification_status: statusStr,
    cti: {
      tier: c.CTI_Tier ?? c.cti_tier ?? "",
      score: c.CTI_Score ?? c.cti_score ?? "",
    },
    logo_url: c.logo_url ?? c.site_image_url ?? null,
  };
}

const GROUP_FIELDS = {
  region: { field: "region", fallback: "Unspecified region" },
  country: { field: "country", fallback: "Unspecified country" },
  state: { field: "state", fallback: "Unspecified state" },
  city: { field: "city", fallback: "Unspecified city" },
  sector: { field: "sector", fallback: "Unspecified sector" },
};

function groupCompanies(items, groupBy) {
  const config = GROUP_FIELDS[groupBy] || GROUP_FIELDS.country;
  const groups = new Map();

  items.forEach((company) => {
    const value = String(company[config.field] || "").trim() || config.fallback;
    if (!groups.has(value)) groups.set(value, []);
    groups.get(value).push(company);
  });

  return Array.from(groups.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([label, groupCompanies]) => ({
      label,
      companies: groupCompanies
        .slice()
        .sort((left, right) => (left.name || "").localeCompare(right.name || "")),
    }));
}

function groupByCountry(items) {
  const groups = new Map();

  items.forEach((x) => {
    const key = (x.country || "Unspecified country").trim() || "Unspecified country";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(x);
  });

  const out = Array.from(groups.entries()).sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  out.forEach(([_, arr]) =>
    arr.sort((u, v) => (u.name || "").localeCompare(v.name || ""))
  );

  return out;
}

function groupBySector(items) {
  const groups = new Map();

  items.forEach((x) => {
    const key = (x.sector || "Unspecified sector").trim() || "Unspecified sector";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(x);
  });

  const out = Array.from(groups.entries()).sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  out.forEach(([_, arr]) =>
    arr.sort((u, v) => (u.name || "").localeCompare(v.name || ""))
  );

  return out;
}

function groupByCountryAndSector(items) {
  const countryMap = new Map();

  items.forEach((c) => {
    const country = (c.country || "Unspecified country").trim() || "Unspecified country";
    const sector = (c.sector || "Unspecified sector").trim() || "Unspecified sector";

    if (!countryMap.has(country)) countryMap.set(country, new Map());

    const sectorMap = countryMap.get(country);
    if (!sectorMap.has(sector)) sectorMap.set(sector, []);
    sectorMap.get(sector).push(c);
  });

  const countries = Array.from(countryMap.entries()).sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  return countries.map(([countryName, sectorMap]) => {
    const sectors = Array.from(sectorMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([sectorName, companies]) => ({
        sector: sectorName,
        companies: companies
          .slice()
          .sort((u, v) => (u.name || "").localeCompare(v.name || "")),
      }));

    return { country: countryName, sectors };
  });
}

export default function Companies() {
  const ROUTES = useMemo(
    () => ({
      privacy: "/privacy",
      terms: "/terms",
      cookies: "/cookies",
      signup: "/signup",
      login: "/login",
      explore: "/explore",
      services: "/services",
      insights: "/insights",
      about: "/about",
      trial: "/request-trial",
      home: "/",
    }),
    []
  );

  const [q, setQ] = useState("");
  const [sector, setSector] = useState("");
  const [country, setCountry] = useState("");
  const [verified, setVerified] = useState(false);
  const [regionId, setRegionId] = useState("");
  const [countryId, setCountryId] = useState("");
  const [stateId, setStateId] = useState("");
  const [cityId, setCityId] = useState("");
  const [sectorId, setSectorId] = useState("");
  const [industryId, setIndustryId] = useState("");
  const [localFilter, setLocalFilter] = useState("");
  const [groupBy, setGroupBy] = useState("country");

  const [companies, setCompanies] = useState([]);
  const [sectorOptions, setSectorOptions] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(10);
  const [error, setError] = useState("");
  const [fromParam, setFromParam] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    const qs = new URLSearchParams(window.location.search);

    const qParam = (qs.get("q") || qs.get("search") || qs.get("keyword") || "").trim();
    const rawSectorParam = (qs.get("sector") || "").trim();
    const rawCountryParam = (qs.get("country") || "").trim();
    const sectorParam = /^(all|any)$/i.test(rawSectorParam) || /^\d+$/.test(rawSectorParam)
      ? ""
      : rawSectorParam;
    const countryParam = /^(all|any)$/i.test(rawCountryParam) || /^\d+$/.test(rawCountryParam)
      ? ""
      : canonicalizeCountry(rawCountryParam);
    const regionIdParam = (qs.get("region_id") || qs.get("regio_id") || "").trim();
    const countryIdParam = (qs.get("country_id") || (/^\d+$/.test(rawCountryParam) ? rawCountryParam : "")).trim();
    const stateIdParam = (qs.get("state_id") || "").trim();
    const cityIdParam = (qs.get("city_id") || "").trim();
    const sectorIdParam = (qs.get("sector_id") || (/^\d+$/.test(rawSectorParam) ? rawSectorParam : "")).trim();
    const industryIdParam = (qs.get("industry_id") || "").trim();
    const pageParam = parseInt(qs.get("page") || "1", 10);
    const verifiedParam =
      qs.get("verification_status") ||
      qs.get("verified") ||
      qs.get("verification");
    const from = (qs.get("from") || "").toLowerCase();

    if (qParam) setQ(qParam);
    if (sectorParam) setSector(sectorParam);
    if (countryParam) setCountry(countryParam);
    setRegionId(regionIdParam);
    setCountryId(countryIdParam);
    setStateId(stateIdParam);
    setCityId(cityIdParam);
    setSectorId(sectorIdParam);
    setIndustryId(industryIdParam);
    if (!Number.isNaN(pageParam) && pageParam > 0) setPage(pageParam);
    if (/^(1|true|on|verified)$/i.test(verifiedParam || "")) {
      setVerified(true);
    }

    setFromParam(from);

    // Keep only canonical search parameters in the browser URL.
    const cleanParams = new URLSearchParams();
    if (qParam) cleanParams.set("q", qParam);
    if (sectorIdParam) cleanParams.set("sector_id", sectorIdParam);
    if (regionIdParam) cleanParams.set("region_id", regionIdParam);
    if (countryIdParam) cleanParams.set("country_id", countryIdParam);
    if (stateIdParam) cleanParams.set("state_id", stateIdParam);
    if (cityIdParam) cleanParams.set("city_id", cityIdParam);
    if (industryIdParam) cleanParams.set("industry_id", industryIdParam);
    if (!Number.isNaN(pageParam) && pageParam > 1) cleanParams.set("page", String(pageParam));
    if (/^(1|true|on|verified)$/i.test(verifiedParam || "")) {
      cleanParams.set("verification_status", "verified");
    }

    const cleanQuery = cleanParams.toString();
    window.history.replaceState(
      null,
      "",
      window.location.pathname + (cleanQuery ? `?${cleanQuery}` : "")
    );

  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadOptions() {
      try {
        const [sectorRes, countryRes] = await Promise.all([
          fetchSectors().catch(() => null),
          fetchCountries().catch(() => null),
        ]);

        if (cancelled) return;

        if (sectorRes && Array.isArray(sectorRes.data)) {
          const list = sectorRes.data
            .map((s) => s.title || s.sector_name || s.name)
            .filter(Boolean)
            .sort();

          setSectorOptions(list);
        }

        if (countryRes && Array.isArray(countryRes.data)) {
          const list = countryRes.data
            .map((c) => c.country_name || c.name)
            .filter(Boolean)
            .sort();

          setCountryOptions(list);
        }
      } catch (e) {
        console.error("Filter options error", e);
      }
    }

    loadOptions();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!loading) {
      setProgress(100);
      return;
    }

    setProgress(10);

    const id = setInterval(() => {
      setProgress((p) => (p < 90 ? p + 10 : p));
    }, 200);

    return () => clearInterval(id);
  }, [loading]);

  const isAllInputsEmpty = !q && !sector && !country && !regionId && !countryId && !stateId && !cityId && !sectorId && !industryId && !verified && !localFilter.trim();
  const hasAnyFilter = !!(q || sector || country || regionId || countryId || stateId || cityId || sectorId || industryId || verified);

  useEffect(() => {
    let cancelled = false;

    async function loadCompanies() {
      try {
        setLoading(true);
        setError("");

        const js = await fetchCompanies({
          page,
          q,
          sector,
          country,
          regionId,
          countryId,
          stateId,
          cityId,
          sectorId,
          industryId,
          verified,
        });

        if (cancelled) return;

        let payload = js.data;
        let list = [];

        if (payload && Array.isArray(payload.data)) {
          list = payload.data;
        } else if (Array.isArray(payload)) {
          list = payload;
          payload = { current_page: page, last_page: 1, total: payload.length };
        } else if (Array.isArray(js)) {
          list = js;
          payload = { current_page: page, last_page: 1, total: js.length };
        }

        const normalized = list.map(normalizeCompany);

        setCompanies(normalized);
        setPage(payload.current_page || 1);
        setTotalPages(payload.last_page || 1);
        setTotal(payload.total || normalized.length || 0);

        // Write canonical search parameters only. Legacy `sector`, `country`,
        // and navigation-only `from` values are intentionally excluded.
        const qp = new URLSearchParams();
        const setOrDelete = (key, value) => {
          if (value !== undefined && value !== null && String(value) !== "") {
            qp.set(key, String(value));
          } else {
            qp.delete(key);
          }
        };

        setOrDelete("page", page > 1 ? page : "");
        setOrDelete("q", q);

        setOrDelete("sector_id", sectorId);
        setOrDelete("region_id", regionId);
        setOrDelete("country_id", countryId);
        setOrDelete("state_id", stateId);
        setOrDelete("city_id", cityId);
        setOrDelete("industry_id", industryId);
        setOrDelete("verification_status", verified ? "verified" : "");

        const qs = qp.toString();
        const newUrl = window.location.pathname + (qs ? `?${qs}` : "");

        window.history.replaceState(null, "", newUrl);
      } catch (e) {
        if (cancelled) return;
        console.error(e);
        setError(`Failed to load companies: ${e.message}`);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadCompanies();

    return () => {
      cancelled = true;
    };
  }, [page, q, sector, country, regionId, countryId, stateId, cityId, sectorId, industryId, verified, fromParam]);

  const visibleCompanies = useMemo(() => {
    let list = companies;

    if (verified) {
      list = list.filter((c) => c.verified);
    }

    if (!q && localFilter.trim()) {
      const term = localFilter.trim().toLowerCase();
      list = list.filter((c) => (c.name || "").toLowerCase().includes(term));
    }

    return list;
  }, [companies, verified, q, localFilter]);

  const shouldGroupBySector = useMemo(
    () => !q && !!(country || countryId) && !(sector || sectorId) && !isAllInputsEmpty,
    [q, country, countryId, sector, sectorId, isAllInputsEmpty]
  );

  const flatGrouped = useMemo(
    () =>
      shouldGroupBySector
        ? groupBySector(visibleCompanies)
        : groupByCountry(visibleCompanies),
    [visibleCompanies, shouldGroupBySector]
  );

  const nestedGrouped = useMemo(
    () => (isAllInputsEmpty ? groupByCountryAndSector(visibleCompanies) : []),
    [isAllInputsEmpty, visibleCompanies]
  );

  const groupedCompanies = useMemo(
    () => groupCompanies(visibleCompanies, groupBy),
    [visibleCompanies, groupBy]
  );

  const hasResults = isAllInputsEmpty
    ? nestedGrouped.length > 0
    : flatGrouped.length > 0;

  const pageNumbers = useMemo(() => {
    const pages = [];
    const max = 7;

    if (totalPages <= max) {
      for (let i = 1; i <= totalPages; i += 1) pages.push(i);
    } else {
      let start = Math.max(1, page - 2);
      let end = Math.min(totalPages, page + 2);

      if (start === 1) end = 5;
      if (end === totalPages) start = totalPages - 4;

      for (let i = start; i <= end; i += 1) pages.push(i);
    }

    return pages;
  }, [page, totalPages]);

  const goToPage = (n) => setPage(n);
  const goPrev = () => page > 1 && setPage(page - 1);
  const goNext = () => page < totalPages && setPage(page + 1);

  const { backHref } = useMemo(() => {
    function baseFor(from) {
      switch (from) {
        case "services":
          return { href: "/services" };
        case "insights":
          return { href: "/insights" };
        case "verification":
          return { href: "/verification" };
        case "matching":
          return { href: "/matching" };
        case "policy":
          return { href: "/incentives" };
        case "whitespace":
          return { href: "/whitespace" };
        case "explore":
        default:
          return { href: "/explore" };
      }
    }

    const dest = baseFor(fromParam || "explore");
    const p = new URLSearchParams();

    if (q) p.set("q", q);
    if (sector) p.set("sector", sector);
    if (country) p.set("country", country);
    if (regionId) p.set("region_id", regionId);
    if (countryId) p.set("country_id", countryId);
    if (stateId) p.set("state_id", stateId);
    if (cityId) p.set("city_id", cityId);
    if (sectorId) p.set("sector_id", sectorId);
    if (industryId) p.set("industry_id", industryId);
    if (verified) p.set("verification_status", "verified");

    const extra = p.toString();

    return {
      backHref: dest.href + (extra ? `?${extra}` : ""),
    };
  }, [fromParam, q, sector, country, regionId, countryId, stateId, cityId, sectorId, industryId, verified]);

  const onClearFilters = () => {
    setQ("");
    setSector("");
    setCountry("");
    setVerified(false);
    setRegionId("");
    setCountryId("");
    setStateId("");
    setCityId("");
    setSectorId("");
    setIndustryId("");
    setLocalFilter("");
    setPage(1);
  };

  const openDetailDialog = (company) => {
    setSelectedCompany(company);
    setDialogOpen(true);
  };

  const resultLabel = loading
    ? "Loading companies"
    : `${total.toLocaleString()} ${total === 1 ? "company" : "companies"}`;

  return (
    <div className="dashboard-shell companies-dashboard">
      <HorizontalNavigation activePath="/explore" />

      <main className="dashboard-main">
        {/* <section className="dashboard-hero" aria-labelledby="companies-title">
          <div className="hero-copy">
            <span className="hero-kicker"><ShieldCheck size={15} /> Trusted company intelligence</span>
            <h2 id="companies-title">Companies</h2>
            <p>
              Filter and browse African businesses by country, sector, and
              verification status, then open a complete company profile from one workspace.
            </p>
          </div>
          <div className="hero-count" aria-live="polite">
            <strong>{loading ? "—" : total.toLocaleString()}</strong>
            <span>{loading ? "loading directory" : "matching companies"}</span>
          </div>
        </section> */}

      <Box className="dashboard-content">
        {/* <Box className="dashboard-panel breadcrumbs-panel">
          <Breadcrumbs aria-label="breadcrumb" separator="›">
            <MLink color="inherit" underline="hover" href={ROUTES.home} sx={{ fontSize: 13 }}>
              Home
            </MLink>

            <MLink color="inherit" underline="hover" href={backHref} sx={{ fontSize: 13 }}>
              Explore businesses
            </MLink>

            <Typography color="text.primary" sx={{ fontSize: 13, fontWeight: 600 }}>
              Companies
            </Typography>
          </Breadcrumbs>
        </Box> */}

        {/* <section className="dashboard-panel directory-summary" aria-label="Directory status">
          <div>
            <span className="summary-label">Current view</span>
            <h2>{isAllInputsEmpty ? "All companies" : "Filtered companies"}</h2>
            <p>
              {isAllInputsEmpty
                ? "Showing companies across all countries and sectors."
                : "Showing companies that match your active filters."}
            </p>
          </div>
          <span className="result-count" role="status" aria-live="polite">{resultLabel}</span>
        </section> */}

        {error && (
          <Box sx={{ my: 1 }}>
            <Alert severity="error" variant="filled">
              {error}
            </Alert>
          </Box>
        )}

        <section className="dashboard-panel workspace-panel search-workspace" aria-labelledby="company-filters-title">
          <div className="panel-heading">
            <div>
              <span>Directory filters</span>
              <h2 id="company-filters-title">Refine your company search</h2>
            </div>
            <p>Use one or more filters to narrow the directory.</p>
          </div>

          <TopSearchPanelCompanies
          q={q}
          setQ={setQ}
          sector={sector}
          setSector={setSector}
          country={country}
          setCountry={setCountry}
          verified={verified}
          setVerified={setVerified}
          localFilter={localFilter}
          setLocalFilter={setLocalFilter}
          sectorOptions={sectorOptions}
          countryOptions={countryOptions}
          hasAnyFilter={hasAnyFilter}
          onClearFilters={onClearFilters}
          setPage={setPage}
          />
        </section>

        <section className="dashboard-panel workspace-panel results-workspace" aria-labelledby="company-results-title">
          <div className="panel-heading">
            <div>
              <span>Company directory</span>
              <h2 id="company-results-title">Browse profiles</h2>
            </div>
            <p>Open a company to review its complete profile.</p>
          </div>

          <MainLoadPanel
          loading={loading}
          progress={progress}
          hasResults={hasResults}
          isAllInputsEmpty={isAllInputsEmpty}
          nestedGrouped={nestedGrouped}
          flatGrouped={flatGrouped}
          groupedCompanies={groupedCompanies}
          groupBy={groupBy}
          setGroupBy={setGroupBy}
          visibleCount={visibleCompanies.length}
          shouldGroupBySector={shouldGroupBySector}
          verified={verified}
          openDetailDialog={openDetailDialog}
          totalPages={totalPages}
          page={page}
          total={total}
          pageNumbers={pageNumbers}
          goToPage={goToPage}
          goPrev={goPrev}
          goNext={goNext}
          />
        </section>
      </Box>
      </main>

      <CompanyDetailDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        company={selectedCompany}
      />
    </div>
  );
}

