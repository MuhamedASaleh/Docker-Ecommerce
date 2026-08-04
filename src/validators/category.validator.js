const { body } = require("express-validator");

const createCategoryValidation = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 2 })
        .withMessage("Name must be at least 2 characters"),

    body("description")
        .optional()
        .isString()
        .withMessage("Description must be a string")

];

const updateCategoryValidation = [

    body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Name cannot be empty")
        .isLength({ min: 2 })
        .withMessage("Name must be at least 2 characters"),

    body("description")
        .optional()
        .isString()
        .withMessage("Description must be a string")

];

module.exports = {
    createCategoryValidation,
    updateCategoryValidation
};
