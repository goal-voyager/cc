const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Artisan = require("../models/Artisan");
const { protect, authorize } = require("../middleware/auth");

// GET /api/products - public, optional filters: ?category=&artisan=&search=
router.get("/", async (req, res) => {
  try {
    const { category, artisan, search } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (artisan) filter.artisan = artisan;
    if (search) filter.title = { $regex: search, $options: "i" };

    const products = await Product.find(filter)
      .populate("artisan", "name village state skill")
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch products" });
  }
});

// GET /api/products/mine - the logged-in artisan's own products
router.get("/mine", protect, authorize("artisan"), async (req, res) => {
  const artisan = await Artisan.findOne({ user: req.user._id });
  if (!artisan) return res.json([]);
  const products = await Product.find({ artisan: artisan._id }).sort({ createdAt: -1 });
  res.json(products);
});

// GET /api/products/:id - public single product with artisan details
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("artisan");
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: "Invalid product id" });
  }
});

// POST /api/products - artisan lists a new product under their own profile
router.post("/", protect, authorize("artisan"), async (req, res) => {
  try {
    const artisan = await Artisan.findOne({ user: req.user._id });
    if (!artisan) {
      return res.status(400).json({ error: "Complete your artisan profile before listing products" });
    }
    const { title, description, price, category, imageUrl } = req.body;
    if (!title || !description || !price || !category) {
      return res.status(400).json({ error: "Please fill in all required fields" });
    }
    const product = await Product.create({
      title,
      description,
      price,
      category,
      imageUrl,
      artisan: artisan._id
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: "Could not list product" });
  }
});

// DELETE /api/products/:id - the owning artisan, or an admin
router.delete("/:id", protect, authorize("artisan", "admin"), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("artisan");
    if (!product) return res.status(404).json({ error: "Product not found" });

    const isOwner = req.user.role === "artisan" && String(product.artisan.user) === String(req.user._id);
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ error: "You can only delete your own products" });
    }
    await product.deleteOne();
    res.json({ message: "Product removed" });
  } catch (err) {
    res.status(400).json({ error: "Could not delete product" });
  }
});

module.exports = router;
