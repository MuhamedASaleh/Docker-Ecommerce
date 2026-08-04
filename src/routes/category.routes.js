const express = require("express");

const router = express.Router();

const categoryController = require("../controllers/category.controller");
const { createCategoryValidation, updateCategoryValidation } = require("../validators/category.validator");
const validationMiddleware = require("../middlewares/validation.middleware");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");

router.get("/", categoryController.getAllCategories);

router.get("/:id", categoryController.getCategoryById);

router.post("/",
    authenticate,
    authorize("ADMIN"),
    createCategoryValidation,
    validationMiddleware,
    categoryController.createCategory);

router.put("/:id",
    authenticate,
    authorize("ADMIN"),
    updateCategoryValidation,
    validationMiddleware,
    categoryController.updateCategory);

router.delete("/:id",
    authenticate,
    authorize("ADMIN"),
    categoryController.deleteCategory);

module.exports = router;
