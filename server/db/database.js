const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

async function getDatabaseConnection() {
  return open({
    filename: "./database.db",
    driver: sqlite3.Database,
  });
}

module.exports = getDatabaseConnection;
