const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");
const { withTransaction } = require("../config/database");
const stripe = require("../config/stripe");
const orderRepository = require("../repositories/order.repository");
const cartRepository = require("../repositories/cart.repository");

async function checkout(userId) {

    const cartItems = await cartRepository.getCartItems(userId);

    if (cartItems.length === 0) {
        throw new BadRequestError("Cart is empty");
    }

    for (const item of cartItems) {

        if (!item.is_active) {
            throw new BadRequestError(`"${item.name}" is no longer available`);
        }

        if (item.quantity > item.stock_quantity) {
            throw new BadRequestError(`Only ${item.stock_quantity} unit(s) of "${item.name}" are available`);
        }

    }

    const totalAmount = cartItems.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0
    );

    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalAmount * 100),
        currency: "usd",
        metadata: { userId }
    });

    const order = await withTransaction(async (client) => {

        const createdOrder = await orderRepository.createOrder(
            {
                userId,
                totalAmount,
                stripePaymentIntentId: paymentIntent.id
            },
            client
        );

        const items = await orderRepository.createOrderItems(
            createdOrder.id,
            cartItems.map((item) => ({
                product_id: item.product_id,
                quantity: item.quantity,
                unit_price: item.price
            })),
            client
        );

        return { ...createdOrder, items };

    });

    return { order, clientSecret: paymentIntent.client_secret };

}

async function handlePaymentSucceeded(paymentIntentId) {

    await withTransaction(async (client) => {

        const order = await orderRepository.getOrderByPaymentIntentId(paymentIntentId, client);

        if (!order || order.status === "paid") {
            return;
        }

        await orderRepository.updateOrderStatus(order.id, "paid", client);

        const items = await orderRepository.getOrderItemsByOrderId(order.id, client);

        for (const item of items) {
            await orderRepository.decrementProductStock(item.product_id, item.quantity, client);
        }

        await cartRepository.clearCart(order.user_id, client);

    });

}

async function handlePaymentFailed(paymentIntentId) {

    const order = await orderRepository.getOrderByPaymentIntentId(paymentIntentId);

    if (!order) {
        return;
    }

    await orderRepository.updateOrderStatus(order.id, "payment_failed");

}

async function handleStripeWebhookEvent(event) {

    if (event.type === "payment_intent.succeeded") {
        await handlePaymentSucceeded(event.data.object.id);
    } else if (event.type === "payment_intent.payment_failed") {
        await handlePaymentFailed(event.data.object.id);
    }

}

async function getOrdersForUser(userId) {

    return await orderRepository.getOrdersByUserId(userId);

}

async function getOrderForUser(userId, orderId) {

    const order = await orderRepository.getOrderById(orderId);

    if (!order || order.user_id !== userId) {
        throw new NotFoundError("Order not found");
    }

    return order;

}

module.exports = {
    checkout,
    handleStripeWebhookEvent,
    getOrdersForUser,
    getOrderForUser
};
