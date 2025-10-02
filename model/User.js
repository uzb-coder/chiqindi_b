// model/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },       // Ism
  surname: { type: String },                    // Familiya
  phone: { type: String, required: true, unique: true },
  address: { type: String },                    // Manzil (qayerdan)
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "operator", "driver", "admin"], default: "user" },

  // Faqat operator uchun
  operatorPercent: { type: Number, default: 0 },

  // Faqat driver uchun
  perOrderPercent: { type: Number, default: 0 },

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
