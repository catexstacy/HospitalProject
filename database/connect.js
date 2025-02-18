const { config } = require('dotenv');
const pg = require('pg');
config();

const pool = new pg.Pool({
  user: process.env.DATABSE_USER,
  host: process.env.DATABASE_HOST,
  database: 'Hospitaldb',
  password: '#73641935jL',
  port: 5432,
});

module.exports = pool;