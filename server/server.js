const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const app = express();
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const port = process.env.PORT || 4000;

app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/resumes", require("./routes/resumes"));
app.use("/api/auth", require("./routes/auth"));

app.get("/", (req, res) => {
  res.send("Resume Builder Backend");
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
