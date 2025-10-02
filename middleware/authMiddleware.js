const jwt = require("jsonwebtoken");

// 🔹 Auth middleware
module.exports = (req, res, next) => {
  // 1️⃣ Authorization header’dan token olish
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "Token topilmadi" });

  const token = authHeader.split(" ")[1]; // "Bearer TOKEN"
  if (!token) return res.status(401).json({ message: "Token topilmadi" });

  try {
    // 2️⃣ Tokenni tekshirish
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    req.user = decoded; 

    next(); 
  } catch (err) {
    console.error("JWT Error:", err.message); // xatolikni server logida ko‘rsatish
    res.status(403).json({ message: "Token noto‘g‘ri yoki muddati o‘tgan" });
  }
};
