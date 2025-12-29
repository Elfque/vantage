const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/middleware");

const {
  createResume,
  getAllResumes,
  getSingleResume,
} = require("../utils/resumes");

// In-memory storage for resumes (replace with database later)
// let resumes = [];
// let nextId = 1;

// GET all resumes
router.get("/", protect, getAllResumes);

// GET resume by ID
router.get("/:id", protect, getSingleResume);

// POST create new resume
router.post("/create", protect, createResume);

// PUT update resume
// router.put("/:id", (req, res) => {
//   const index = resumes.findIndex((r) => r.id === parseInt(req.params.id));
//   if (index === -1)
//     return res.status(404).json({ message: "Resume not found" });
//   resumes[index] = { ...resumes[index], ...req.body };
//   res.json(resumes[index]);
// });

// DELETE resume
// router.delete("/:id", (req, res) => {
//   const index = resumes.findIndex((r) => r.id === parseInt(req.params.id));
//   if (index === -1)
//     return res.status(404).json({ message: "Resume not found" });
//   resumes.splice(index, 1);
//   res.json({ message: "Resume deleted" });
// });

module.exports = router;
