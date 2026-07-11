// Populates the database with demo accounts, artisan profiles and products.
// Run with: npm run seed   (after setting MONGO_URI and JWT_SECRET in .env)
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/User");
const Artisan = require("./models/Artisan");
const Product = require("./models/Product");

const DEMO_PASSWORD = "password123";

async function seed() {
  await connectDB();

  await Product.deleteMany({});
  await Artisan.deleteMany({});
  await User.deleteMany({});
  console.log("Cleared old data");

  // --- Users ---
  const admin = await User.create({
    name: "Admin",
    email: "admin@craftconnect.test",
    password: DEMO_PASSWORD,
    role: "admin"
  });

  const buyer = await User.create({
    name: "Test Buyer",
    email: "buyer@craftconnect.test",
    password: DEMO_PASSWORD,
    role: "user"
  });

  const artisanUsers = await User.insertMany([
    { name: "Lakshmi Devi", email: "lakshmi@craftconnect.test", password: DEMO_PASSWORD, role: "artisan" },
    { name: "Ramesh Kumar", email: "ramesh@craftconnect.test", password: DEMO_PASSWORD, role: "artisan" },
    { name: "Fatima Bee", email: "fatima@craftconnect.test", password: DEMO_PASSWORD, role: "artisan" }
  ]);
  // insertMany skips the pre-save hash hook, so hash manually one by one instead:
  for (const u of artisanUsers) {
    u.password = DEMO_PASSWORD;
    await u.save();
  }

  const [lakshmiUser, rameshUser, fatimaUser] = artisanUsers;

  // --- Artisan profiles ---
  const artisans = await Artisan.insertMany([
    {
      user: lakshmiUser._id,
      name: lakshmiUser.name,
      skill: "Handloom weaving",
      village: "Chettinad",
      state: "Tamil Nadu",
      story:
        "Lakshmi has been weaving cotton sarees for over 20 years as part of her village Self-Help Group, using motifs passed down from her mother.",
      photoUrl: "https://placehold.co/300x300/eaf2fd/1f6fd6?text=Lakshmi"
    },
    {
      user: rameshUser._id,
      name: rameshUser.name,
      skill: "Terracotta pottery",
      village: "Pilkhuwa",
      state: "Uttar Pradesh",
      story:
        "Ramesh runs a small family pottery workshop, shaping terracotta pots and lamps on a foot-powered wheel, a craft passed down three generations.",
      photoUrl: "https://placehold.co/300x300/eaf2fd/1f6fd6?text=Ramesh"
    },
    {
      user: fatimaUser._id,
      name: fatimaUser.name,
      skill: "Bamboo & cane craft",
      village: "Barpeta",
      state: "Assam",
      story:
        "Fatima leads a women's SHG that turns local bamboo into baskets, trays, and home decor, giving ten women a steady independent income.",
      photoUrl: "https://placehold.co/300x300/eaf2fd/1f6fd6?text=Fatima"
    }
  ]);

  const [lakshmi, ramesh, fatima] = artisans;

  await Product.insertMany([
    {
      title: "Handwoven Cotton Saree - Chettinad Check",
      description: "Pure cotton saree woven on a traditional pit loom, featuring classic checks in indigo and white.",
      price: 1450,
      category: "Textiles",
      imageUrl: "https://placehold.co/400x300/eaf2fd/1f6fd6?text=Saree",
      artisan: lakshmi._id
    },
    {
      title: "Cotton Dupatta - Temple Border",
      description: "Lightweight handloom cotton dupatta with a woven temple border, dyed with natural indigo.",
      price: 550,
      category: "Textiles",
      imageUrl: "https://placehold.co/400x300/eaf2fd/1f6fd6?text=Dupatta",
      artisan: lakshmi._id
    },
    {
      title: "Terracotta Diya Set (6 pieces)",
      description: "Hand-shaped terracotta oil lamps, sun-dried and kiln-fired, perfect for festivals.",
      price: 220,
      category: "Pottery",
      imageUrl: "https://placehold.co/400x300/eaf2fd/1f6fd6?text=Diyas",
      artisan: ramesh._id
    },
    {
      title: "Terracotta Water Pot",
      description: "Traditional clay matka that keeps water naturally cool, hand-thrown and unglazed.",
      price: 380,
      category: "Pottery",
      imageUrl: "https://placehold.co/400x300/eaf2fd/1f6fd6?text=Matka",
      artisan: ramesh._id
    },
    {
      title: "Bamboo Storage Basket",
      description: "Sturdy hand-woven bamboo basket, ideal for storing fruits, laundry, or craft supplies.",
      price: 480,
      category: "Bamboo & Cane",
      imageUrl: "https://placehold.co/400x300/eaf2fd/1f6fd6?text=Basket",
      artisan: fatima._id
    },
    {
      title: "Bamboo Table Lamp",
      description: "Handcrafted bamboo lamp shade that casts warm, dappled light - a modern piece for a rustic home.",
      price: 890,
      category: "Home Decor",
      imageUrl: "https://placehold.co/400x300/eaf2fd/1f6fd6?text=Lamp",
      artisan: fatima._id
    }
  ]);

  console.log("\nSeeded successfully. Demo logins (all use password: " + DEMO_PASSWORD + "):");
  console.log("  Admin  ->", admin.email);
  console.log("  Buyer  ->", buyer.email);
  console.log("  Artisan->", lakshmiUser.email, "/", rameshUser.email, "/", fatimaUser.email);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
