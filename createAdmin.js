const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./model/User");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB ulandi"))
  .catch(err => console.error("❌ MongoDB xato:", err));

async function createAdmin() {
  const existingAdmin = await User.findOne({ role: "admin" });
  if (existingAdmin) {
    console.log("Admin allaqachon mavjud:", existingAdmin.phone);
    return process.exit();
  }

  const hashedPassword = await bcrypt.hash("1920", 10);
  const admin = new User({
    name: "Admin (Murodjon)",
    phone: "998995391920",
    password: hashedPassword,
    role: "admin"
  });

  await admin.save();
  console.log("✅ Admin yaratildi:", admin.phone);
  process.exit();
}

createAdmin();
