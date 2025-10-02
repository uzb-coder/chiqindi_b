const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ Oddiy foydalanuvchi ro‘yxatdan o‘tishi
exports.signup = async (req, res) => {
  try {
    const { name, phone, password } = req.body;

    const existingUser = await User.findOne({ phone });
    if (existingUser) return res.status(400).json({ message: "❌ Telefon raqam allaqachon mavjud" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, phone, password: hashedPassword, role: "user" });
    await user.save();

    res.status(201).json({
      message: "✅ Ro‘yxatdan o‘tish muvaffaqiyatli",
      user: { _id: user._id, name: user.name, phone: user.phone, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Admin orqali operator yaratish
// ✅ Admin operator yaratishi
exports.createOperator = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "❌ Faqat admin operator qo‘sha oladi" });
    }

    const { name, surname, phone, address, password, operatorPercent } = req.body;

    const existingUser = await User.findOne({ phone });
    if (existingUser) return res.status(400).json({ message: "❌ Telefon raqam allaqachon mavjud" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const operator = new User({
      name,
      surname,
      phone,
      address,
      password: hashedPassword,
      role: "operator",
      operatorPercent: operatorPercent || 0
    });

    await operator.save();
    res.status(201).json({ message: "✅ Operator yaratildi", operator });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Admin driver yaratishi
exports.createDriver = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "❌ Faqat admin driver qo‘sha oladi" });
    }

    const { name, surname, phone, address, password, perOrderPercent } = req.body;

    const existingUser = await User.findOne({ phone });
    if (existingUser) return res.status(400).json({ message: "❌ Telefon raqam allaqachon mavjud" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const driver = new User({
      name,
      surname,
      phone,
      address,
      password: hashedPassword,
      role: "driver",
      perOrderPercent: perOrderPercent || 0
    });

    await driver.save();
    res.status(201).json({ message: "✅ Driver yaratildi", driver });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Login (hamma uchun umumiy)
exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;
    const user = await User.findOne({ phone });
    if (!user) return res.status(400).json({ message: "❌ Foydalanuvchi topilmadi" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "❌ Parol noto‘g‘ri" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "secretkey", { expiresIn: "1d" });

    res.json({
      message: "✅ Login muvaffaqiyatli",
      token,
      user: { _id: user._id, name: user.name, phone: user.phone, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Hamma foydalanuvchilarni olish
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // parolni ko‘rsatmaymiz
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ Foydalanuvchini yangilash
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    // Agar role driver/operator bo‘lsa, baseSalary va perOrderBonus yangilanadi
    if (updates.role && ["operator", "driver"].includes(updates.role)) {
      updates.baseSalary = updates.baseSalary || 0;
      updates.perOrderBonus = updates.perOrderBonus || 0;
    }

    const user = await User.findByIdAndUpdate(id, updates, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "❌ Foydalanuvchi topilmadi" });

    res.json({ message: "✅ Foydalanuvchi yangilandi", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ Foydalanuvchini o‘chirish
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "❌ Foydalanuvchi topilmadi" });

    res.json({ message: "✅ Foydalanuvchi o‘chirildi" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
