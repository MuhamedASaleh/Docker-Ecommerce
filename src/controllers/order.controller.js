const orderService = require("../services/order.service");
const stripe = require("../config/stripe");

async function checkout(req, res, next) {

    try {

        const result = await orderService.checkout(req.user.sub);

        res.status(201).json({
            success: true,
            data: result.order,
            clientSecret: result.clientSecret
        });

    } catch (error) {

        next(error);

    }

}

async function handleStripeWebhook(req, res, next) {

    let event;

    try {

        event = stripe.webhooks.constructEvent(
            req.body,
            req.headers["stripe-signature"],
            process.env.STRIPE_WEBHOOK_SECRET
        );

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: `Webhook signature verification failed: ${error.message}`
        });

    }

    try {

        await orderService.handleStripeWebhookEvent(event);

        res.status(200).json({ received: true });

    } catch (error) {

        next(error);

    }

}

async function getMyOrders(req, res, next) {

    try {

        const orders = await orderService.getOrdersForUser(req.user.sub);

        res.status(200).json({
            success: true,
            data: orders
        });

    } catch (error) {

        next(error);

    }

}

async function getMyOrderById(req, res, next) {

    try {

        const order = await orderService.getOrderForUser(req.user.sub, req.params.id);

        res.status(200).json({
            success: true,
            data: order
        });

    } catch (error) {

        next(error);

    }

}

module.exports = {
    checkout,
    handleStripeWebhook,
    getMyOrders,
    getMyOrderById
};
