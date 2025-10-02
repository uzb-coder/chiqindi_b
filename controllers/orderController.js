const Order = require("../model/Order");

exports.updatePayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentType, amount, status, note } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: "❌ Buyurtma ID berilmagan" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "❌ Buyurtma topilmadi" });
    }

    // Agar paymentHistory yo'q bo'lsa, bo'sh array qilamiz
    if (!Array.isArray(order.paymentHistory)) {
      order.paymentHistory = [];
    }

    // Payment yangilash
    order.payment = {
      paymentType,
      amount,
      status,
      note,
      updatedBy: req.user.id,
      updatedAt: new Date(),
    };

    // Payment tarixga yozish
    order.paymentHistory.push({
      paymentType,
      amount,
      status,
      note,
      updatedBy: req.user.id,
      updatedAt: new Date(),
    });

    // Zakazni yopish agar to'lov qilingan bo'lsa
    if (status === "paid") {
      order.status = "completed";
    }

    await order.save();

    res.json({
      message: "✅ To‘lov qabul qilindi va zakaz yopildi",
      order,
    });
  } catch (err) {
    res.status(500).json({ message: "❌ Server xatosi", error: err.message });
  }
};
