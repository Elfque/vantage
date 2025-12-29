const mysql = require("mysql2/promise");
require("dotenv").config();

const conection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
});

module.exports = conection;
