const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  paymentType: { type: String, enum: ["cash", "card"], required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "paid"], default: "pending" },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  updatedAt: { type: Date, default: Date.now },
  note: String
});

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
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
    price: Number,
    pricePerBag: Number,
    comment: String,
    status: { type: String, enum: ["pending", "assigned", "completed"], default: "pending" },

    // 🔹 Oxirgi to‘lov
    payment: paymentSchema,

    // 🔹 Tarix (array bo‘lishi kerak)
    paymentHistory: { type: [paymentSchema], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);
