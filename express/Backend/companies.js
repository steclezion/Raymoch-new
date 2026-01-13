// companies.js
// Unified data access for Raymoch Companies (JSON or MySQL)
// Mode is selected by ENV: DATA_MODE = 'json' | 'mysql'

require('dotenv').config();
const fs = require('fs');
const path = require('path');

const DATA_MODE = (process.env.DATA_MODE || 'json').toLowerCase();
const JSON_PATH = process.env.JSON_PATH || path.join(__dirname, 'data', 'companies.json');

let mysqlPool = null;
if (DATA_MODE === 'mysql') {
  const mysql = require('mysql2/promise');
  mysqlPool = mysql.createPool({
    host: process.env.MYSQL_HOST || '127.0.0.1',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DB || 'raymoch',
    port: Number(process.env.MYSQL_PORT || 3306),
    waitForConnections: true,
    connectionLimit: 10,
    multipleStatements: false,
  });
}

// ---------- Utilities ----------
const slugify = (s) =>
  (s || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 64);

const toNumber = (v) => (v === null || v === undefined || v === '' ? null : Number(v));
const toBool = (v) => Boolean(v);

// normalize one record to the shared contract the UI expects
function normalizeRow(r) {
  // r may come from JSON (camelCase) or MySQL (snake_case)
  const from = (keySnake, keyCamel) => r[keyCamel] ?? r[keySnake];

  const name = from('company_name', 'CompanyName');
  const city = from('city', 'City');

  const obj = {
    id: from('company_id', 'CompanyID'),
    slug: from('slug', 'slug') || slugify(`${name}-${city}`),
    name,
    sector: from('sector', 'Sector'),
    country: from('country', 'Country'),
    city,
    foundedYear: toNumber(from('founded_year', 'FoundedYear')),
    stage: from('stage', 'Stage'),
    verification: {
      status: from('verification_status', 'VerificationStatus'),
      step: toNumber(from('verification_step', 'VerificationStep')),
    },
    cti: {
      score: toNumber(from('cti_score', 'CTI_Score')),
      tier: from('cti_tier', 'CTI_Tier'),
    },
    profileCompletenessPct: toNumber(from('profile_completeness_pct', 'ProfileCompletenessPct')),
    employees: toNumber(from('employees', 'Employees')),
    annualRevenueUSD: toNumber(from('annual_revenue_usd', 'AnnualRevenueUSD')),
    totalFundingUSD: toNumber(from('total_funding_usd', 'TotalFundingUSD')),
    flags: {
      hasFinancials: toBool(from('has_financials', 'HasFinancials')),
      diasporaOwned: toBool(from('diaspora_owned', 'DiasporaOwned')),
      womenLed: toBool(from('women_led', 'WomenLed')),
      youthLed: toBool(from('youth_led', 'YouthLed')),
    },
    listing: from('listing_bucket', 'ListingBucket'),
    website: from('website', 'Website'),
    email: from('email', 'Email'),
    phone: from('phone', 'Phone'),
    description: from('description', 'Description'),
    data: {
      sourcesCount: toNumber(from('data_sources_count', 'DataSourcesCount')),
      lastUpdated: from('last_updated', 'LastUpdated'),
    },
  };
  return obj;
}

// ---------- JSON Adapter ----------
let JSON_CACHE = null;

async function loadJson() {
  if (!JSON_CACHE) {
    const raw = fs.readFileSync(JSON_PATH, 'utf8');
    const arr = JSON.parse(raw);
    // ensure slug uniqueness
    const used = new Map();
    JSON_CACHE = arr.map((r) => {
      const norm = normalizeRow(r);
      let s = norm.slug;
      let k = s;
      let i = 2;
      while (used.has(k)) {
        k = `${s}-${i++}`;
      }
      norm.slug = k;
      used.set(k, true);
      return norm;
    });
  }
  return JSON_CACHE;
}

// ---------- MySQL Adapter ----------
async function queryMySQL(sql, params = []) {
  const [rows] = await mysqlPool.query(sql, params);
  return rows;
}

function buildWhereAndParams(filters = {}) {
  const where = [];
  const params = [];
  if (filters.sector) { where.push('sector = ?'); params.push(filters.sector); }
  if (filters.country) { where.push('country = ?'); params.push(filters.country); }
  if (filters.stage) { where.push('stage = ?'); params.push(filters.stage); }
  if (filters.verificationStatus) { where.push('verification_status = ?'); params.push(filters.verificationStatus); }
  if (filters.ctiMin != null) { where.push('cti_score >= ?'); params.push(Number(filters.ctiMin)); }
  if (filters.ctiMax != null) { where.push('cti_score <= ?'); params.push(Number(filters.ctiMax)); }
  if (filters.hasFinancials != null) { where.push('has_financials = ?'); params.push(filters.hasFinancials ? 1 : 0); }
  if (filters.q) { where.push('(company_name LIKE ? OR description LIKE ?)'); params.push(`%${filters.q}%`, `%${filters.q}%`); }
  return { where: where.length ? 'WHERE ' + where.join(' AND ') : '', params };
}

// ---------- Public API (both backends) ----------
async function listCompanies({ page = 1, pageSize = 20, filters = {}, sort = 'name_asc' } = {}) {
  page = Math.max(1, page);
  pageSize = Math.min(100, Math.max(1, pageSize));
  const offset = (page - 1) * pageSize;

  const sortMap = {
    name_asc: 'company_name ASC',
    name_desc: 'company_name DESC',
    cti_desc: 'cti_score DESC',
    updated_desc: 'last_updated DESC',
    revenue_desc: 'annual_revenue_usd DESC',
  };

  if (DATA_MODE === 'json') {
    const data = await loadJson();
    let filtered = data.slice();

    if (filters.sector) filtered = filtered.filter(x => x.sector === filters.sector);
    if (filters.country) filtered = filtered.filter(x => x.country === filters.country);
    if (filters.stage) filtered = filtered.filter(x => x.stage === filters.stage);
    if (filters.verificationStatus) filtered = filtered.filter(x => x.verification.status === filters.verificationStatus);
    if (filters.ctiMin != null) filtered = filtered.filter(x => (x.cti.score ?? 0) >= Number(filters.ctiMin));
    if (filters.ctiMax != null) filtered = filtered.filter(x => (x.cti.score ?? 0) <= Number(filters.ctiMax));
    if (filters.hasFinancials != null) filtered = filtered.filter(x => !!x.flags.hasFinancials === !!filters.hasFinancials);
    if (filters.q) {
      const q = filters.q.toLowerCase();
      filtered = filtered.filter(x =>
        (x.name || '').toLowerCase().includes(q) ||
        (x.description || '').toLowerCase().includes(q)
      );
    }

    const sortKey = sort || 'name_asc';
    filtered.sort((a, b) => {
      switch (sortKey) {
        case 'name_desc': return b.name.localeCompare(a.name);
        case 'cti_desc': return (b.cti.score || 0) - (a.cti.score || 0);
        case 'updated_desc': return new Date(b.data.lastUpdated) - new Date(a.data.lastUpdated);
        case 'revenue_desc': return (b.annualRevenueUSD || 0) - (a.annualRevenueUSD || 0);
        default: return a.name.localeCompare(b.name);
      }
    });

    const total = filtered.length;
    const items = filtered.slice(offset, offset + pageSize);
    return { items, page, pageSize, total, pages: Math.ceil(total / pageSize) };
  }

  // MySQL
  const orderBy = sortMap[sort] || sortMap.name_asc;
  const { where, params } = buildWhereAndParams(filters);
  const rows = await queryMySQL(
    `SELECT * FROM companies ${where} ORDER BY ${orderBy} LIMIT ? OFFSET ?`,
    [...params, pageSize, offset]
  );
  const countRows = await queryMySQL(`SELECT COUNT(*) as c FROM companies ${where}`, params);
  return {
    items: rows.map(normalizeRow),
    page,
    pageSize,
    total: countRows[0].c,
    pages: Math.ceil(countRows[0].c / pageSize),
  };
}

async function getCompanyById(id) {
  if (DATA_MODE === 'json') {
    const data = await loadJson();
    return data.find(x => x.id === id) || null;
  }
  const rows = await queryMySQL('SELECT * FROM companies WHERE company_id = ? LIMIT 1', [id]);
  return rows[0] ? normalizeRow(rows[0]) : null;
}

async function getCompanyBySlug(slug) {
  if (DATA_MODE === 'json') {
    const data = await loadJson();
    return data.find(x => x.slug === slug) || null;
  }
  const rows = await queryMySQL('SELECT * FROM companies WHERE slug = ? LIMIT 1', [slug]);
  return rows[0] ? normalizeRow(rows[0]) : null;
}

async function searchCompanies(q, limit = 10) {
  const filters = { q };
  if (DATA_MODE === 'json') {
    const res = await listCompanies({ page: 1, pageSize: limit, filters });
    return res.items;
  }
  const { where, params } = buildWhereAndParams(filters);
  const rows = await queryMySQL(`SELECT * FROM companies ${where} ORDER BY company_name ASC LIMIT ?`, [...params, limit]);
  return rows.map(normalizeRow);
}

module.exports = {
  mode: DATA_MODE,
  listCompanies,
  getCompanyById,
  getCompanyBySlug,
  searchCompanies,
};
