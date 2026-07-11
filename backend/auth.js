const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verifies the Bearer token and attaches the logged-in user to req.user
async function protect(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Please log in to continue" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select("-password");
    if (!user) return res.status(401).json({ error: "User no longer exists" });
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: "Session expired, please log in again" });
  }
}

// Use after protect: authorize("artisan", "admin")
function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "You don't have permission to do that" });
    }
    next();
  };
}

module.exports = { protect, authorize };
