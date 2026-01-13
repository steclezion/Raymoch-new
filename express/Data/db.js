const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '.env.local') });

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  socketPath: process.env.DB_SOCKET,         // use local socket
  host: process.env.DB_HOST || '127.0.0.1',  // fallback if no socket
  port: +(process.env.DB_PORT || 3308),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  namedPlaceholders: true
});

module.exports = pool;
