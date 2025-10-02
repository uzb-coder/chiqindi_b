  const Order = require("../model/UsersOrder");

// 🟢 Buyurtma yaratish
exports.createOrder = async (req, res) => {
  try {
    const {
      city, street, house, block, entrance, floor, apartment,
      isPrivateHouse, date, time, bagsCount, promoCode, comment,
      latitude, longitude
    } = req.body;

    const pricePerBag = 10000; // har bir paket narxi
    const totalPrice = bagsCount * pricePerBag; // jami narx

    const newOrder = new Order({
      userId: req.user.id,
      city, street, house, block, entrance, floor, apartment,
      isPrivateHouse, date, time, bagsCount, promoCode, comment,
      price: totalPrice, // jami narx
      pricePerBag,      // bir paket narxi
      location: {
        type: "Point",
        coordinates: [longitude, latitude]
      }
    });

    await newOrder.save();

    res.status(201).json({ 
      message: "✅ Buyurtma yaratildi", 
      order: newOrder,
      pricePerBag,
      totalPrice
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🟢 Buyurtmalarni olish (foydalanuvchi uchun cheklangan, admin uchun hamma buyurtmalar)

exports.getMyOrders = async (req, res) => {
  try {
    let orders;

    if (req.user.role === "admin") {
      // Admin uchun: hamma buyurtmalarni olish
      orders = await Order.find();
    } else {
      // Oddiy foydalanuvchi uchun: faqat o‘z buyurtmalarini olish
      orders = await Order.find({ userId: req.user.id });
    }

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
