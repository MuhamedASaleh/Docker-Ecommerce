const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth.controller");
const authenticate = require("../middlewares/authenticate");
const authRateLimit = require("../middlewares/authRateLimit.middleware");
const validationMiddleware = require("../middlewares/validation.middleware");
const { registerValidation, loginValidation } = require("../validators/auth.validator");

router.post(
    "/register",
    authRateLimit,
    registerValidation,
    validationMiddleware,
    authController.register
);
router.post(
    "/login",
    authRateLimit,
    loginValidation,
    validationMiddleware,
    authController.login
);
router.post(
    "/refresh",
    authController.refresh
);
router.post(
    "/logout",
    authenticate,
    authController.logout
);

module.exports = router;