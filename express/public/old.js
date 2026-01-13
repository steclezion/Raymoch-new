// companies.js — JSON-first data layer (same folder as companies.json)

const path = require("path");
const fs = require("fs");

// JSON sits right next to this file: ./Data/companies.json
const DATA_PATH = path.join(__dirname, "companies.json");

// --- helpers ---
function asBool(v) {
  if (typeof v === "boolean") return v;
  if (v == null) return false;
  const s = String(v).trim().toLowerCase();
  return s === "true" || s === "1" || s === "yes";
}

// --- core loader ---
function loadAll() {
  const raw = fs.readFileSync(DATA_PATH, "utf8");
  const arr = JSON.parse(raw);

  const required = [
    "CompanyID","CompanyName","Sector","Country","City","FoundedYear","Stage",
    "VerificationStatus","CTI_Score","CTI_Tier","Employees","AnnualRevenueUSD",
    "TotalFundingUSD","Website","Email","Phone","Description","DataSourcesCount","LastUpdated",
    "ListingBucket","ProfileCompletenessPct","VerificationStep",
    "HasFinancials","DiasporaOwned","WomenLed","YouthLed"
  ];
  const bad = arr.find(r => required.some(k => !(k in r)));
  if (bad) throw new Error("companies.json missing required columns on at least one row.");

  // normalize booleans + trim strings to keep filters sane
  return arr.map(c => ({
    ...c,
    HasFinancials:  asBool(c.HasFinancials),
    DiasporaOwned:  asBool(c.DiasporaOwned),
    WomenLed:       asBool(c.WomenLed),
    YouthLed:       asBool(c.YouthLed),
    Sector:  String(c.Sector).trim(),
    Country: String(c.Country).trim(),
    City:    String(c.City).trim(),
    Stage:   String(c.Stage).trim(),
    VerificationStatus: String(c.VerificationStatus).trim(),
    CTI_Tier: String(c.CTI_Tier).trim(),
    ListingBucket: String(c.ListingBucket).trim()
  }));
}

// --- public getters ---
function getAllCompanies() {
  return loadAll();
}

function getCompanyById(id) {
  return loadAll().find(c => c.CompanyID === id);
}

function listSummaries() {
  return loadAll().map(c => ({
    id: c.CompanyID,
    name: c.CompanyName,
    sector: c.Sector,
    country: c.Country,
    city: c.City,
    stage: c.Stage,
    verified: c.VerificationStatus === "Verified",
    cti: { score: c.CTI_Score, tier: c.CTI_Tier },
    employees: c.Employees,
    revenueUSD: c.AnnualRevenueUSD,
    listing: c.ListingBucket,
    lastUpdated: c.LastUpdated
  }));
}

// --- placeholder for future DB import (not used now) ---
async function importToMySQL(/* connection */) {
  throw new Error("Not implemented in Part 1. Use JSON-first flow.");
}

// --- exports ---
module.exports = {
  loadAll,
  getAllCompanies,
  getCompanyById,
  listSummaries,
  importToMySQL
};
