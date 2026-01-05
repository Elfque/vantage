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

router.post("/create", protect, createPortfolio);
router.get("/", protect, getAllPortfolios);
router.get("/:id", protect, getSinglePortfolio);
router.get("/slug/:slug", getSinglePortfolioBySlug);
router.put("/:id", protect, updatePortfolio);
router.delete("/:id", protect, deletePortfolio);

module.exports = router;
