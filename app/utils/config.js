const dotenv = require("dotenv").config();
const config = {
  PG_USER: process.env.PG_USER,
  PG_PASS: process.env.PG_PASS,
  PG_PORT: process.env.PG_PORT || 5432,
  PG_HOST: process.env.PG_HOST,
  PG_DB: process.env.PG_DB,
  PORT: process.env.PORT || 3000,
};

module.exports = config;
