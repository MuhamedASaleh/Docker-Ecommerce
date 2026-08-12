const express = require("express");

const router = express.Router();

const productController = require("../controllers/product.controller");
const { createProductValidation, updateProductValidation } = require("../validators/products.validator");
const validationMiddleware = require("../middlewares/validation.middleware");
const authenticate = require("../middlewares/authenticate");
const authorize = require("../middlewares/authorize");
const upload = require("../middlewares/upload.middleware");

router.get("/", productController.getAllProducts);

router.get("/:id", productController.getProductById);

router.post("/",
    authenticate,
    // authorize("ADMIN"),
    upload.single("image"),
    createProductValidation,
    validationMiddleware,
    productController.createProduct);

router.put("/:id", authenticate, authorize("ADMIN"),
    upload.single("image"),
    updateProductValidation,
    validationMiddleware,
    productController.updateProduct);

router.delete("/:id", authenticate, authorize("ADMIN"),
    productController.deleteProduct);

module.exports = router;