const express = require("express");
const router = express.Router();
const Artisan = require("../models/Artisan");
const { protect, authorize } = require("../middleware/auth");

// GET /api/artisans - public list
router.get("/", async (req, res) => {
  try {
    const artisans = await Artisan.find().sort({ createdAt: -1 });
    res.json(artisans);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch artisans" });
  }
});

// GET /api/artisans/me - the logged-in artisan's own profile (or null)
router.get("/me", protect, authorize("artisan"), async (req, res) => {
  const artisan = await Artisan.findOne({ user: req.user._id });
  res.json(artisan);
});

// GET /api/artisans/:id - public single profile
router.get("/:id", async (req, res) => {
  try {
    const artisan = await Artisan.findById(req.params.id);
    if (!artisan) return res.status(404).json({ error: "Artisan not found" });
    res.json(artisan);
  } catch (err) {
    res.status(400).json({ error: "Invalid artisan id" });
  }
});

// POST /api/artisans - artisan completes their profile (one per account)
router.post("/", protect, authorize("artisan"), async (req, res) => {
  try {
    const already = await Artisan.findOne({ user: req.user._id });
    if (already) return res.status(400).json({ error: "You already have an artisan profile" });

    const { village, state, story, photoUrl, skill } = req.body;
    if (!village || !state || !story || !skill) {
      return res.status(400).json({ error: "Please fill in all required fields" });
    }
    const artisan = await Artisan.create({
      user: req.user._id,
      name: req.user.name,
      village,
      state,
      story,
      photoUrl,
      skill
    });
    res.status(201).json(artisan);
  } catch (err) {
    res.status(400).json({ error: "Could not create artisan profile" });
  }
});

// DELETE /api/artisans/:id - admin only
router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const artisan = await Artisan.findByIdAndDelete(req.params.id);
    if (!artisan) return res.status(404).json({ error: "Artisan not found" });
    res.json({ message: "Artisan removed" });
  } catch (err) {
    res.status(400).json({ error: "Could not delete artisan" });
  }
});

module.exports = router;
