const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: [
        "Textiles",
        "Pottery",
        "Jewellery",
        "Bamboo & Cane",
        "Food & Spices",
        "Home Decor",
        "Other"
      ]
    },
    imageUrl: { type: String, default: "" },
    artisan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artisan",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
