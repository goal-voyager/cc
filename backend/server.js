require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const artisanRoutes = require("./routes/artisans");
const productRoutes = require("./routes/products");
const adminRoutes = require("./routes/admin");

const app = express();

// Allow the frontend origin(s) listed in .env, or allow all if none set
const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(",").map((o) => o.trim())
  : true;
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.json({ message: "CraftConnect API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/artisans", artisanRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);

// Fallback for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`CraftConnect API running on port ${PORT}`));
