const Order = require("../model/UsersOrder");
const User = require("../model/User");

exports.assignDriver = async (req, res) => {
  try {
    const { orderId, driverId } = req.body;

    // 🔐 Operator yoki admin tekshirish
    if (!req.user || (req.user.role !== "operator" && req.user.role !== "admin")) {
      return res.status(403).json({ message: "❌ Faqat operator yoki admin driver biriktira oladi" });
    }

    // 🔎 Orderni topamiz
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "❌ Order topilmadi" });
    }

    // 🔎 Driver tekshirish
    const driver = await User.findById(driverId);
    if (!driver || driver.role !== "driver") {
      return res.status(400).json({ message: "❌ Driver topilmadi yoki rol noto‘g‘ri" });
    }

    // 🚗 Driver biriktirish
    order.driverId = driverId;
    order.status = "assigned";
    await order.save();

    res.json({
      message: "✅ Order driverga biriktirildi",
      order
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
