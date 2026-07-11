const mongoose = require("mongoose");

const artisanSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    name: { type: String, required: true, trim: true },
    village: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    story: { type: String, required: true, trim: true },
    photoUrl: { type: String, default: "" },
    skill: { type: String, required: true, trim: true } // e.g. "Handloom weaving"
  },
  { timestamps: true }
);

module.exports = mongoose.model("Artisan", artisanSchema);
