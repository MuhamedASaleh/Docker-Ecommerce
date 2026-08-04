const { body } = require("express-validator");

const createProductValidation = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 3 })
        .withMessage("Name must be at least 3 characters"),

    body("description")
        .optional()
        .isString()
        .withMessage("Description must be a string"),

    body("price")
        .notEmpty()
        .withMessage("Price is required")
        .isFloat({ gt: 0 })
        .withMessage("Price must be greater than 0"),

    body("stock_quantity")
        .notEmpty()
        .withMessage("Stock quantity is required")
        .isInt({ min: 0 })
        .withMessage("Stock quantity cannot be negative"),

    body("image_url")
        .optional()
        .isString()
        .withMessage("Image URL must be a string"),

    body("category_id")
        .optional()
        .isUUID()
        .withMessage("Category ID must be a valid UUID")

];

const updateProductValidation = [

    body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Name cannot be empty")
        .isLength({ min: 3 })
        .withMessage("Name must be at least 3 characters"),

    body("description")
        .optional()
        .isString()
        .withMessage("Description must be a string"),

    body("price")
        .optional()
        .isFloat({ gt: 0 })
        .withMessage("Price must be greater than 0"),

    body("stock_quantity")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Stock quantity cannot be negative"),

    body("image_url")
        .optional()
        .isString()
        .withMessage("Image URL must be a string"),

    body("category_id")
        .optional()
        .isUUID()
        .withMessage("Category ID must be a valid UUID")

];

module.exports = {
    createProductValidation,
    updateProductValidation
};