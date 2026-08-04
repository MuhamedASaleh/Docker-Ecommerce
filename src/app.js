const express = require("express");
const helmet = require("helmet");
const app = express();
const productRoutes = require("./routes/product.routes");
const authRoutes = require("./routes/auth.routes");
const categoryRoutes = require("./routes/category.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");
const orderController = require("./controllers/order.controller");
const errorMiddleware = require("./middlewares/error.middleware");
const { pool } = require("./config/database");
const { client: redisClient } = require("./config/redis");

// Middleware
app.use(helmet());

// Liveness: is the process up and able to respond at all.
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

// Readiness: can the app actually serve traffic (dependencies reachable).
app.get("/ready", async (req, res) => {
    try {
        await pool.query("SELECT 1");
        await redisClient.ping();
        res.status(200).json({ status: "ready" });
    } catch (err) {
        res.status(503).json({ status: "not ready", error: err.message });
    }
});

// Stripe webhook needs the raw body for signature verification, so it must
// be mounted before the global express.json() parser touches this path.
app.post("/api/orders/webhook", express.raw({ type: "application/json" }), orderController.handleStripeWebhook);

app.use(express.json());

// Routes
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.use(errorMiddleware);

module.exports = app;
