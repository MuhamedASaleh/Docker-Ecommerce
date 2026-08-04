const express = require("express");

const router = express.Router();

const orderController = require("../controllers/order.controller");
const authenticate = require("../middlewares/authenticate");

router.post("/checkout", authenticate, orderController.checkout);

router.get("/", authenticate, orderController.getMyOrders);

router.get("/:id", authenticate, orderController.getMyOrderById);

module.exports = router;
