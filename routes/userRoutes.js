const express = require("express");
const router = express.Router();
const userController = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");

// Admin orqali operator/driver yaratish
router.post("/create-operator", auth, userController.createOperator);
router.post("/create-driver", auth, userController.createDriver);

// Hamma foydalanuvchilar (faqat admin)
router.get("/", auth, userController.getAllUsers);

// Foydalanuvchini yangilash va o‘chirish
router.put("/:id", auth, userController.updateUser);
router.delete("/:id", auth, userController.deleteUser);

module.exports = router;
