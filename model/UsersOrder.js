const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // 🆕 Driver biriktirish
  city: String,
  street: String,
  house: String,
  block: String,
  entrance: String,
  floor: String,
  apartment: String,
  isPrivateHouse: Boolean,
  date: String,
  time: String,
  bagsCount: Number,
  promoCode: String,
  comment: String,
  price: Number,
  pricePerBag: Number,
  location: {
    type: { type: String, default: "Point" },
    coordinates: [Number],
  },
  status: { type: String, enum: ["new", "assigned", "completed"], default: "new" } // 🆕 Zakaz holati
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
