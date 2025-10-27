// public/js/explore.js

(() => {
    
    const API_BASE = (window.RAYMOCH && window.RAYMOCH.API_BASE) || "/api";
    const COMPANIES_URL = (window.RAYMOCH && window.RAYMOCH.COMPANIES_URL) || "/companies";

    

    const SECTORS = {
        agriculture: {
            title: "Agriculture",
            icon: "🌱",
            slug: "agriculture",
            desc: "Farming, processing, agri-tech.",
        },
        energyrenewables: {
            title: "Energy & Renewables",
            icon: "⚡",
            slug: "energyrenewables",
            desc: "Solar, wind, off-grid.",
        },
        constructionrealestate: {
            title: "Construction & Real Estate",
            icon: "🏗️",
            slug: "constructionrealestate",
            desc: "Commercial, housing, materials.",
        },
        manufacturing: {
            title: "Manufacturing",
            icon: "🏭",
            slug: "manufacturing",
            desc: "Production & industrial services.",
        },
        retailecommerce: {
            title: "Retail & Ecommerce",
            icon: "🛍️",
            slug: "retailecommerce",
            desc: "Consumer goods, distribution.",
        },
        logisticsmobility: {
            title: "Logistics & Mobility",
            icon: "🚚",
            slug: "logisticsmobility",
            desc: "Transport, supply chain.",
        },
        fintech: {
            title: "FinTech",
            icon: "💳",
            slug: "fintech",
            desc: "Payments, remittances, lending.",
        },
        ictsoftware: {
            title: "ICT / Software",
            icon: "💻",
            slug: "ictsoftware",
            desc: "Software, cloud, IT services.",
        },
        education: {
            title: "Education",
            icon: "🎓",
            slug: "education",
            desc: "Schools, ed-tech, training.",
        },
        healthcare: {
            title: "Healthcare",
            icon: "🏥",
            slug: "healthcare",
            desc: "Clinics, telemedicine, medtech.",
        },
        foodbeverage: {
            title: "Food & Beverage",
            icon: "🍲",
            slug: "foodbeverage",
            desc: "Food products, cafés, restaurants.",
        },
        tourismhospitality: {
            title: "Tourism & Hospitality",
            icon: "🏝️",
            slug: "tourismhospitality",
            desc: "Hotels, travel tech.",
        },
        mediacreative: {
            title: "Media & Creative",
            icon: "🎬",
            slug: "mediacreative",
            desc: "Studios, music, gaming.",
        },
        govnonprofit: {
            title: "Government / Nonprofit",
            icon: "🏛️",
            slug: "govnonprofit",
            desc: "Civic, NGOs, public services.",
        },
        other: {
            title: "Other",
            icon: "🧩",
            slug: "other",
            desc: "Unmapped or mixed.",
        },
    };
    const CANONICAL = Object.keys(SECTORS).map((k) => SECTORS[k].title);

    const ISO_COUNTRIES = [
        "Algeria",
        "Angola",
        "Benin",
        "Botswana",
        "Burkina Faso",
        "Burundi",
        "Cabo Verde",
        "Cameroon",
        "Central African Republic",
        "Chad",
        "Comoros",
        "Congo",
        "Côte d’Ivoire",
        "DR Congo",
        "Djibouti",
        "Egypt",
        "Equatorial Guinea",
        "Eritrea",
        "Eswatini",
        "Ethiopia",
        "Gabon",
        "Gambia",
        "Ghana",
        "Guinea",
        "Guinea-Bissau",
        "Kenya",
        "Lesotho",
        "Liberia",
        "Libya",
        "Madagascar",
        "Malawi",
        "Mali",
        "Mauritania",
        "Mauritius",
        "Morocco",
        "Mozambique",
        "Namibia",
        "Niger",
        "Nigeria",
        "Rwanda",
        "São Tomé and Príncipe",
        "Senegal",
        "Seychelles",
        "Sierra Leone",
        "Somalia",
        "South Africa",
        "South Sudan",
        "Sudan",
        "Tanzania",
        "Togo",
        "Tunisia",
        "Uganda",
        "Zambia",
        "Zimbabwe",
        "United States",
        "United Kingdom",
    ];

    const optionList = (arr, placeholder) =>
        `<option value="">${placeholder}</option>` +
        arr.map((v) => `<option value="${v}">${v}</option>`).join("");
    const normKey = (s) =>
        (s || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/&|\/|and/g, "and")
            .replace(/[^a-z0-9]+/g, "")
            .trim();

    function decorateSectorLabel(apiLabel) {
        const key = normKey(apiLabel);
        const hit = Object.values(SECTORS).find(
            (s) => normKey(s.title) === key
        );
        if (hit)
            return {
                title: hit.title,
                icon: hit.icon,
                desc: hit.desc,
                api: apiLabel,
            };
        return { title: apiLabel, icon: "🧩", desc: "Sector", api: apiLabel };
    }

    async function fetchAllSectorsFromAPI() {
        try {
            const res = await fetch(`${API_BASE}/companies?page=1&limit=5000`, {
                cache: "no-store",
            });
            const js = await res.json();
            const list = Array.isArray(js?.data)
                ? js.data
                : Array.isArray(js)
                ? js
                : [];
            const seen = new Set(),
                sectors = [];
            for (const row of list) {
                const s = (row?.sector ?? row?.Sector ?? "").toString().trim();
                if (s && !seen.has(s)) {
                    seen.add(s);
                    sectors.push(s);
                }
            }
            sectors.sort((a, b) => a.localeCompare(b));
            return sectors;
        } catch (err) {
            console.warn("[Explore] Sector fetch failed:", err);
            return [];
        }
    }

    function bestMatchFor(canonicalTitle, apiSectors) {
        const target = normKey(canonicalTitle);
        let hit = apiSectors.find((s) => normKey(s) === target);
        if (hit) return hit;
        hit = apiSectors.find((s) => {
            const k = normKey(s);
            return k.includes(target) || target.includes(k);
        });
        return hit || canonicalTitle;
    }

    function buildParams(extra = {}) {
        const q = (document.getElementById("f-search")?.value || "").trim();
        const c = document.getElementById("f-country")?.value || "";
        const s = document.getElementById("f-sector")?.value || "";
        const v = document.getElementById("f-verified")?.checked;
        const p = new URLSearchParams();
        if (q) {
            p.set("q", q);
            p.set("search", q);
        }
        if (c) p.set("country", c);
        if (s) p.set("sector", s);
        if (v) p.set("verified", "1");
        for (const [k, val] of Object.entries(extra)) {
            if (val !== undefined && val !== null && String(val).length)
                p.set(k, val);
        }
        return p.toString();
    }

    function wireSearch() {
        const qEl = document.getElementById("f-search");
        const clearBtn = document.getElementById("clear-search");
        const inlineBtn = document.getElementById("go-search");
        const doBtn = document.getElementById("do-search");
        const form = document.getElementById("searchForm");
        const allBtn = document.getElementById("allCompaniesBtn");

        const go = () => {
            const qs = buildParams();
            location.href = qs ? `${COMPANIES_URL}?${qs}` : `${COMPANIES_URL}`;
        };

        clearBtn?.addEventListener("click", () => {
            qEl.value = "";
            qEl.focus();
        });
        inlineBtn?.addEventListener("click", (e) => {
            e.preventDefault();
            go();
        });
        doBtn?.addEventListener("click", (e) => {
            e.preventDefault();
            go();
        });
        form?.addEventListener("submit", (e) => {
            e.preventDefault();
            go();
        });

        allBtn?.addEventListener("click", (e) => {
            const qs = buildParams();
            if (qs) {
                e.preventDefault();
                location.href = `${COMPANIES_URL}?${qs}`;
            }
        });
    }

    async function renderTiles() {
        const grid = document.getElementById("sector-grid");
        const msg = document.getElementById("sectorMessage");
        if (!grid) return;

        grid.style.display = "grid";
        grid.innerHTML = "";
        if (msg) {
            msg.classList.remove("show");
            msg.textContent = "";
        }

        const apiSectors = await fetchAllSectorsFromAPI();

        const frag = document.createDocumentFragment();
        const tiles = CANONICAL.map((canon) => {
            const matched = apiSectors.length
                ? bestMatchFor(canon, apiSectors)
                : canon;
            const info = decorateSectorLabel(matched);
            const a = document.createElement("a");
            a.className = "sector-card";
            a.href = `${COMPANIES_URL}?sector=${encodeURIComponent(
                matched
            )}&from=explore`;
            a.setAttribute("aria-label", `Open ${info.title} companies`);
            a.innerHTML = `<span class="icon">${info.icon}</span>
                     <h3>${info.title}</h3>
                     <p>${info.desc}</p>`;
            return a;
        });

        tiles.forEach((a) => frag.appendChild(a));
        grid.appendChild(frag);

        if (apiSectors.length) {
            const missing = CANONICAL.filter(
                (c) => !apiSectors.some((s) => normKey(s) === normKey(c))
            );
            if (missing.length) {
                console.info(
                    "[Explore] Sectors not present in API (tiles still shown):",
                    missing
                );
            }
        }
    }

    window.addEventListener("DOMContentLoaded", async () => {
        // populate selects
        const optionList = (arr, placeholder) =>
            `<option value="">${placeholder}</option>` +
            arr.map((v) => `<option value="${v}">${v}</option>`).join("");
        document.getElementById("f-country").innerHTML = optionList(
            ISO_COUNTRIES,
            "Country"
        );
        document.getElementById("f-sector").innerHTML = optionList(
            CANONICAL,
            "Sector"
        );

        wireSearch();
        await renderTiles();
    });
})();
