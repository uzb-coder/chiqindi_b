const express = require("express");
const router = express.Router();
const { createOrder, getMyOrders, getAllOrders, deleteOrder } = require("../controllers/UserOrder");
const auth = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const assignDriverController = require("../controllers/assignDriver");
const orderController = require("../controllers/orderController");

// Faqat login qilgan user o‘z buyurtmasini yaratishi mumkin
router.post("/create", auth, authorize(["user", "admin"]), createOrder);

// Faqat login qilgan user o‘z buyurtmalarini ko‘radi
router.get("/my", auth, authorize(["user", "admin"]), getMyOrders);

// Driver biriktirish (faqat admin/operator)
router.post("/assign-driver", auth, assignDriverController.assignDriver);

router.put("/:orderId/payment", auth, orderController.updatePayment);


router.get("/", auth, getMyOrders); // hamma buyurtmalarni olish

module.exports = router;
