const express = require("express");

const router = express.Router();

const cartController = require("../controllers/cart.controller");
const { addCartItemValidation, updateCartItemValidation } = require("../validators/cart.validator");
const validationMiddleware = require("../middlewares/validation.middleware");
const authenticate = require("../middlewares/authenticate");

router.use(authenticate);

router.get("/", cartController.getCart);

router.post("/items",
    addCartItemValidation,
    validationMiddleware,
    cartController.addItem);

router.put("/items/:productId",
    updateCartItemValidation,
    validationMiddleware,
    cartController.updateItemQuantity);

router.delete("/items/:productId", cartController.removeItem);

router.delete("/", cartController.clearCart);

module.exports = router;
