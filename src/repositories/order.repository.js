const { pool } = require("../config/database");

async function createOrder({ userId, totalAmount, stripePaymentIntentId, status = "pending" }, client = pool) {

    const result = await client.query(
        `
        INSERT INTO orders (user_id, total_amount, stripe_payment_intent_id, status)
        VALUES ($1, $2, $3, $4)
        RETURNING id, user_id, status, total_amount, stripe_payment_intent_id, created_at, updated_at;
        `,
        [userId, totalAmount, stripePaymentIntentId, status]
    );

    return result.rows[0];
}

async function createOrderItems(orderId, items, client = pool) {

    const values = [];
    const placeholders = items.map((item, index) => {
        const base = index * 4;
        values.push(orderId, item.product_id, item.quantity, item.unit_price);
        return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4})`;
    }).join(", ");

    const result = await client.query(
        `
        INSERT INTO order_items (order_id, product_id, quantity, unit_price)
        VALUES ${placeholders}
        RETURNING id, order_id, product_id, quantity, unit_price;
        `,
        values
    );

    return result.rows;
}

async function getOrderItemsByOrderId(orderId, client = pool) {

    const result = await client.query(
        "SELECT product_id, quantity, unit_price FROM order_items WHERE order_id = $1;",
        [orderId]
    );

    return result.rows;
}

async function getOrderByPaymentIntentId(paymentIntentId, client = pool) {

    const result = await client.query(
        `
        SELECT id, user_id, status, total_amount, stripe_payment_intent_id, created_at, updated_at
        FROM orders
        WHERE stripe_payment_intent_id = $1;
        `,
        [paymentIntentId]
    );

    return result.rows[0];
}

async function getOrdersByUserId(userId) {

    const result = await pool.query(
        `
        SELECT
            o.id,
            o.status,
            o.total_amount,
            o.created_at,
            o.updated_at,
            COALESCE(
                json_agg(
                    json_build_object(
                        'product_id', oi.product_id,
                        'quantity', oi.quantity,
                        'unit_price', oi.unit_price
                    )
                ) FILTER (WHERE oi.id IS NOT NULL),
                '[]'
            ) AS items
        FROM orders o
        LEFT JOIN order_items oi ON oi.order_id = o.id
        WHERE o.user_id = $1
        GROUP BY o.id
        ORDER BY o.created_at DESC;
        `,
        [userId]
    );

    return result.rows;
}

async function getOrderById(orderId) {

    const result = await pool.query(
        `
        SELECT
            o.id,
            o.user_id,
            o.status,
            o.total_amount,
            o.created_at,
            o.updated_at,
            COALESCE(
                json_agg(
                    json_build_object(
                        'product_id', oi.product_id,
                        'quantity', oi.quantity,
                        'unit_price', oi.unit_price
                    )
                ) FILTER (WHERE oi.id IS NOT NULL),
                '[]'
            ) AS items
        FROM orders o
        LEFT JOIN order_items oi ON oi.order_id = o.id
        WHERE o.id = $1
        GROUP BY o.id;
        `,
        [orderId]
    );

    return result.rows[0];
}

async function updateOrderStatus(orderId, status, client = pool) {

    const result = await client.query(
        "UPDATE orders SET status = $2, updated_at = NOW() WHERE id = $1 RETURNING id, status;",
        [orderId, status]
    );

    return result.rows[0];
}

async function decrementProductStock(productId, quantity, client = pool) {

    await client.query(
        "UPDATE products SET stock_quantity = GREATEST(stock_quantity - $2, 0), updated_at = NOW() WHERE id = $1;",
        [productId, quantity]
    );

}

module.exports = {
    createOrder,
    createOrderItems,
    getOrderItemsByOrderId,
    getOrderByPaymentIntentId,
    getOrdersByUserId,
    getOrderById,
    updateOrderStatus,
    decrementProductStock
};
