// ~/Raymoch-Project/root/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const mysql = require("mysql2/promise");
//const PORT = process.argv[2] || 3000;


const app = express();
app.use(cors());
app.use(express.json());

// Paths
const ROOT = path.join(__dirname, "/");
const PUBLIC_DIR = path.join(ROOT, "public");
const DATA_DIR = path.join(ROOT, "Data");
const JSON_PATH = path.join(DATA_DIR, "companies.json");

// No-cache
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
  next();
});

// Serve statics (put explore2.html, companies.html, company.html in /public)
app.use(express.static(PUBLIC_DIR, { etag: false, lastModified: false, maxAge: 0 }));

// ✅ NEW: Serve /Data/*.json statically so the browser can fetch /Data/companies.json
app.use("/Data", express.static(DATA_DIR, { index: false, etag: false, lastModified: false, maxAge: 0 }));

// DB pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || "127.0.0.1",
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "raymoch",
  connectionLimit: 10,
  timezone: "Z",
});

// utils
const normInt = (v, d, min=1, max=1000) => {
  let n = parseInt(v,10); if (Number.isNaN(n)) n = d; return Math.min(Math.max(n,min),max);
};
const sectorKey = s => String(s||"").toLowerCase().replace(/\s*\/\s*/g,"-").replace(/\s+&\s+| & /g,"-").replace(/\s+/g,"");

// JSON fallback loader → outputs normalized objects
function loadJsonFallback(){
  if (!fs.existsSync(JSON_PATH)) return [];
  try{
    const raw = JSON.parse(fs.readFileSync(JSON_PATH,"utf8"));
    const arr = Array.isArray(raw) ? raw : raw.companies || [];
    return arr.map(x => ({
      id: x.CompanyID || x.id || x.companyId || x.CompanyName,
      name: x.CompanyName || x.name || "",
      sector: x.Sector || x.sector || "",
      country: x.Country || x.country || "",
      city: x.City || x.city || "",
      stage: x.Stage || x.stage || "",
      verified: (String(x.VerificationStatus||"").toLowerCase()==="verified") || x.Verified===1 || !!x.verified,
      cti_tier: x.CTI_Tier ?? null,
      cti_score: x.CTI_Score ?? null,
      summary: x.Description || x.summary || "",
      overview: x.Description || x.overview || "",
      employees: x.Employees ?? null,
      revenue_usd: x.AnnualRevenueUSD ?? null,
      total_funding_usd: x.TotalFundingUSD ?? null,
      website: x.Website || null,
      email: x.Email || null,
      phone: x.Phone || null,
      listing_bucket: x.ListingBucket || null,
      founded_year: x.FoundedYear ?? null,
      last_updated: x.LastUpdated || null,
      data_sources_count: x.DataSourcesCount ?? null,
    }));
  }catch{ return []; }
}

// Root → landing
app.get("/", (_req,res)=> res.sendFile(path.join(PUBLIC_DIR,"Entire.html")));

// LIST — must return {id,name,sector,country,city,stage,verified,cti{tier,score}? or Title-Case}
app.get("/companies", async (req,res)=>{
  const page = normInt(req.query.page, 1);
  const limit = normInt(req.query.limit, 20, 1, 100);
  const offset = (page-1)*limit;

  try{
    const [[{ total }]] = await pool.query("SELECT COUNT(*) AS total FROM companies");
    const [rows] = await pool.query(`
      SELECT
        id, name, sector, country, city, stage, verified,
        cti_tier, cti_score, summary
      FROM companies
      ORDER BY name ASC
      LIMIT ? OFFSET ?`, [limit, offset]);

    const data = rows.map(r => ({
      id: r.id,
      name: r.name,
      sector: r.sector,
      country: r.country,
      city: r.city,
      stage: r.stage,
      verified: !!r.verified,
      CTI_Tier: r.cti_tier, CTI_Score: r.cti_score,
      Summary: r.summary
    }));
    return res.json({ data, page, totalPages: Math.max(1, Math.ceil(total/limit)), total });
  }catch(e){
    const all = loadJsonFallback();
    if (all.length){
      const total = all.length;
      const slice = all.slice(offset, offset+limit);
      const data = slice.map(r => ({
        id: r.id, name: r.name, sector: r.sector, country: r.country, city: r.city, stage: r.stage,
        verified: !!r.verified, CTI_Tier: r.cti_tier, CTI_Score: r.cti_score, Summary: r.summary
      }));
      return res.json({ data, page, totalPages: Math.max(1, Math.ceil(total/limit)), total, source:"json" });
    }
    console.error(e); return res.status(500).json({ error:"Database unavailable and no JSON fallback." });
  }
});

// SEARCH — LIKE-based; no FULLTEXT required
app.get("/companies/search", async (req,res)=>{
  const q = (req.query.q||"").trim();
  const s = req.query.sector ? sectorKey(req.query.sector) : "";
  const ctry = (req.query.country||"").trim();
  const ver = ["1","true","on","yes"].includes(String(req.query.verified||"").toLowerCase());

  try{
    const where=[]; const params=[];
    if (q){ where.push("(name LIKE ? OR summary LIKE ? OR overview LIKE ?)"); params.push(`%${q}%`,`%${q}%`,`%${q}%`); }
    if (s){ where.push("LOWER(REPLACE(REPLACE(REPLACE(sector,' / ','-'),' & ','-'),' ','')) = ?"); params.push(s); }
    if (ctry){ where.push("country = ?"); params.push(ctry); }
    if (ver){ where.push("verified = 1"); }

    const [rows] = await pool.query(`
      SELECT id,name,sector,country,city,stage,verified,cti_tier,cti_score,summary
      FROM companies
      ${where.length?`WHERE ${where.join(" AND ")}`:""}
      ORDER BY name ASC LIMIT 500`, params);

    const data = rows.map(r=>({
      id:r.id, name:r.name, sector:r.sector, country:r.country, city:r.city, stage:r.stage,
      verified:!!r.verified, CTI_Tier:r.cti_tier, CTI_Score:r.cti_score, Summary:r.summary
    }));
    return res.json({ data, total: data.length });
  }catch(e){
    const all = loadJsonFallback().filter(x=>{
      const matchQ = !q || [x.name,x.summary,x.overview].some(v=>String(v||"").toLowerCase().includes(q.toLowerCase()));
      const matchS = !s || sectorKey(x.sector)===s;
      const matchC = !ctry || (x.country||"")===ctry;
      const matchV = !ver || !!x.verified;
      return matchQ && matchS && matchC && matchV;
    });
    const data = all.map(r=>({
      id:r.id, name:r.name, sector:r.sector, country:r.country, city:r.city, stage:r.stage,
      verified:!!r.verified, CTI_Tier:r.cti_tier, CTI_Score:r.cti_score, Summary:r.summary
    }));
    return res.json({ data, total: data.length, source:"json" });
  }
});

// DETAIL — return Title-Case for company.html (and camel as a bonus)
function mapDetailRow(row){
  const verified = row.verified ?? (String(row.verification_status||"").toLowerCase()==="verified");
  const obj = {
    // Title-Case keys (REQUIRED by company.html)
    CompanyID: row.id,
    CompanyName: row.name,
    Sector: row.sector,
    Country: row.country,
    City: row.city,
    Stage: row.stage,
    VerificationStatus: verified ? "Verified" : "Unverified",
    CTI_Tier: row.cti_tier ?? null,
    CTI_Score: row.cti_score ?? null,
    Employees: row.employees ?? null,
    AnnualRevenueUSD: row.revenue_usd ?? null,
    TotalFundingUSD: row.total_funding_usd ?? null,
    Description: row.overview || row.summary || "",
    ListingBucket: row.listing_bucket || null,
    Website: row.website || null,
    Email: row.email || null,
    Phone: row.phone || null,
    FoundedYear: row.founded_year ?? null,
    DataSourcesCount: row.data_sources_count ?? null,
    LastUpdated: row.last_updated || row.created_at || null,

    // camelCase extras (harmless)
    id: row.id, name: row.name, sector: row.sector, country: row.country, city: row.city, stage: row.stage,
    verified: !!verified,
    ctiTier: row.cti_tier ?? null, ctiScore: row.cti_score ?? null,
    revenueUSD: row.revenue_usd ?? null, totalFundingUSD: row.total_funding_usd ?? null,
    summary: row.summary || "", overview: row.overview || "",
  };
  return obj;
}

app.get("/companies/:id", async (req,res)=>{
  const id = req.params.id;
  try{
    const [rows] = await pool.query(`SELECT * FROM companies WHERE id = ? LIMIT 1`, [id]);
    if (!rows.length) return res.status(404).json({ error:"Not found" });
    return res.json(mapDetailRow(rows[0]));
  }catch(e){
    const all = loadJsonFallback();
    const hit = all.find(x => String(x.id)===String(id));
    if (hit) return res.json(mapDetailRow(hit));
    return res.status(404).json({ error:"Not found" });
  }
});

// Health
app.get("/health", (_req,res)=> res.json({ ok:true }));

// Boot
const PORT = process.env.PORT || 3001;
app.listen(PORT, ()=>{
  console.log(`✅ Static: ${PUBLIC_DIR}`);
  console.log(`✅ Data (fallback): ${JSON_PATH}`);
  console.log(`✅ Server: http://localhost:${PORT}/`);
  console.log("➡ Flow: /explore2.html → /companies.html → /company.html?id=RMC-…");
});
