const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/middleware");
const {
  createPortfolio,
  getAllPortfolios,
  getSinglePortfolio,
  getSinglePortfolioBySlug,
  updatePortfolio,
  deletePortfolio,
} = require("../utils/portfolio");

const portfolioRoutes = (db) => {
  router.post("/create", protect, (req, res) => createPortfolio(req, res, db));
  router.get("/", protect, (req, res) => getAllPortfolios(req, res, db));
  router.get("/:id", protect, (req, res) => getSinglePortfolio(req, res, db));
  router.get("/slug/:slug", (req, res) =>
    getSinglePortfolioBySlug(req, res, db),
  );
  router.put("/:id", protect, (req, res) => updatePortfolio(req, res, db));
  router.delete("/:id", protect, (req, res) => deletePortfolio(req, res, db));
  return router;
};

module.exports = portfolioRoutes;
