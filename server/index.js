const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const app = express();
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const getDatabaseConnection = require("./db/database");
const port = process.env.PORT || 4000;

const auth = require("./routes/auth");
const portfolio = require("./routes/portfolio");

app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());

const startServer = async () => {
  try {
    const db = await getDatabaseConnection();
    console.log("Database connection established");

    await db.exec(
      `CREATE TABLE IF NOT EXISTS users (id CHAR(36) PRIMARY KEY, email VARCHAR(255) UNIQUE NOT NULL, fullName VARCHAR(100) NOT NULL, tokenVersion INTEGER, password VARCHAR(255) NOT NULL, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP)
    `,
    );
    await db.exec(`
    CREATE TRIGGER IF NOT EXISTS update_users_timestamp 
    AFTER UPDATE ON users
    BEGIN
      UPDATE users SET updatedAt = CURRENT_TIMESTAMP WHERE id = OLD.id;
    END;
  `);

    await db.exec(`
    CREATE TABLE IF NOT EXISTS portfolios(
	id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    userId CHAR(36),
    fullName VARCHAR(100),
    title CHAR(50),
    email varchar(255),
    description TEXT,
    linkedlnUrl varchar(255),
    gitHubUrl varchar(255),
    colorTheme varchar(10),
    slug varchar(50) unique,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
	updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
)`);
    await db.exec(`
    CREATE TRIGGER IF NOT EXISTS update_portfolios_timestamp 
    AFTER UPDATE ON portfolios
    BEGIN
      UPDATE portfolios SET updatedAt = CURRENT_TIMESTAMP WHERE id = OLD.id;
    END;
  `);

    await db.exec(`
    CREATE TABLE IF NOT EXISTS projects(
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    portfolioId CHAR(36),
    title CHAR(50) NOT NULL,
    description TEXT NOT NULL,
    link TEXT,
    githubUrl TEXT,
    userId CHAR(36) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
	updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (portfolioId) REFERENCES portfolios(id) ON DELETE CASCADE
)`);

    await db.exec(`
    CREATE TRIGGER IF NOT EXISTS update_projects_timestamp 
    AFTER UPDATE ON projects
    BEGIN
      UPDATE projects SET updatedAt = CURRENT_TIMESTAMP WHERE id = OLD.id;
    END;
  `);

    await db.exec(`
    CREATE TABLE IF NOT EXISTS experiences(
	id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    portfolioId CHAR(36) NOT NULL,
    company CHAR(50) NOT NULL,
    role VARCHAR(100) NOT NULL,
    description TEXT,
    startDate DATE,
    endDate DATE,
    userId CHAR(36) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
	updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (portfolioId) REFERENCES portfolios(id) ON DELETE CASCADE
)`);

    await db.exec(`
    CREATE TRIGGER IF NOT EXISTS update_experiences_timestamp 
    AFTER UPDATE ON experiences
    BEGIN
      UPDATE experiences SET updatedAt = CURRENT_TIMESTAMP WHERE id = OLD.id;
    END;
  `);

    await db.exec(`
    CREATE TABLE IF NOT EXISTS skillCategory(
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    portfolioId CHAR(36) NOT NULL,
    skills TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    userId CHAR(36) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
	updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (portfolioId) REFERENCES portfolios(id) ON DELETE CASCADE
)`);

    await db.exec(`
    CREATE TRIGGER IF NOT EXISTS update_skillCategory_timestamp 
    AFTER UPDATE ON skillCategory
    BEGIN
      UPDATE skillCategory SET updatedAt = CURRENT_TIMESTAMP WHERE id = OLD.id;
    END;
  `);

    // Make DB available to other modules (optional but good practice)
    app.set("db", db);

    app.use("/api/resumes", require("./routes/resumes"));
    app.use("/api/auth", auth(db));
    app.use("/api/portfolio", portfolio(db));

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1); // Exit with failure code if DB connection fails
  }
};

startServer();

app.get("/", (req, res) => {
  res.send("Resume Builder Backend");
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Start server
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });
