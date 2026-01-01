const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/middleware");

const {
  createResume,
  getAllResumes,
  getSingleResume,
  updateResume,
  deleteResume,
} = require("../utils/resumes");

// GET all resumes
router.get("/", protect, getAllResumes);

// GET resume by ID
router.get("/:id", protect, getSingleResume);

// POST create new resume
router.post("/create", protect, createResume);

// PUT update resume
router.put("/:id", protect, updateResume);

// DELETE resume
router.delete("/:id", protect, deleteResume);

module.exports = router;
