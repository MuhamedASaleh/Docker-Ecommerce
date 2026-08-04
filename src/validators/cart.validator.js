const { body } = require("express-validator");

const addCartItemValidation = [

    body("product_id")
        .notEmpty()
        .withMessage("Product ID is required")
        .isUUID()
        .withMessage("Product ID must be a valid UUID"),

    body("quantity")
        .notEmpty()
        .withMessage("Quantity is required")
        .isInt({ min: 1 })
        .withMessage("Quantity must be at least 1")

];

const updateCartItemValidation = [

    body("quantity")
        .notEmpty()
        .withMessage("Quantity is required")
        .isInt({ min: 1 })
        .withMessage("Quantity must be at least 1")

];

module.exports = {
    addCartItemValidation,
    updateCartItemValidation
};
