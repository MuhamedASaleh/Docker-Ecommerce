const { pool } = require("../config/database");

async function getCartItems(userId) {

    const result = await pool.query(
        `
        SELECT
            ci.product_id,
            ci.quantity,
            p.name,
            p.price,
            p.image_url,
            p.stock_quantity,
            p.is_active
        FROM cart_items ci
        JOIN products p ON p.id = ci.product_id
        WHERE ci.user_id = $1
        ORDER BY ci.created_at ASC;
        `,
        [userId]
    );

    return result.rows;
}

async function getCartItem(userId, productId) {

    const result = await pool.query(
        `
        SELECT product_id, quantity
        FROM cart_items
        WHERE user_id = $1 AND product_id = $2;
        `,
        [userId, productId]
    );

    return result.rows[0];
}

async function upsertItem(userId, productId, quantity) {

    const result = await pool.query(
        `
        INSERT INTO cart_items (user_id, product_id, quantity)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, product_id)
        DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity, updated_at = NOW()
        RETURNING product_id, quantity;
        `,
        [userId, productId, quantity]
    );

    return result.rows[0];
}

async function setItemQuantity(userId, productId, quantity) {

    const result = await pool.query(
        `
        UPDATE cart_items
        SET quantity = $3, updated_at = NOW()
        WHERE user_id = $1 AND product_id = $2
        RETURNING product_id, quantity;
        `,
        [userId, productId, quantity]
    );

    return result;
}

async function removeItem(userId, productId) {

    const result = await pool.query(
        "DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2 RETURNING product_id;",
        [userId, productId]
    );

    return result;
}

async function clearCart(userId, client = pool) {

    await client.query(
        "DELETE FROM cart_items WHERE user_id = $1;",
        [userId]
    );

}

module.exports = {
    getCartItems,
    getCartItem,
    upsertItem,
    setItemQuantity,
    removeItem,
    clearCart
};
