const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");
const cartRepository = require("../repositories/cart.repository");
const productService = require("./product.service");

async function getCart(userId) {

    const rows = await cartRepository.getCartItems(userId);

    const items = rows.map((row) => ({
        product_id: row.product_id,
        name: row.name,
        price: Number(row.price),
        image_url: row.image_url,
        quantity: row.quantity,
        subtotal: Number(row.price) * row.quantity
    }));

    const total = items.reduce((sum, item) => sum + item.subtotal, 0);

    return { items, total };

}

async function addItem(userId, productId, quantity) {

    const product = await productService.getProductById(productId);

    const existing = await cartRepository.getCartItem(userId, productId);
    const desiredQuantity = (existing ? existing.quantity : 0) + quantity;

    if (desiredQuantity > product.stock_quantity) {
        throw new BadRequestError(`Only ${product.stock_quantity} unit(s) of "${product.name}" are available`);
    }

    return await cartRepository.upsertItem(userId, productId, quantity);

}

async function updateItemQuantity(userId, productId, quantity) {

    const product = await productService.getProductById(productId);

    if (quantity > product.stock_quantity) {
        throw new BadRequestError(`Only ${product.stock_quantity} unit(s) of "${product.name}" are available`);
    }

    const result = await cartRepository.setItemQuantity(userId, productId, quantity);

    if (result.rowCount === 0) {
        throw new NotFoundError("Item not found in cart");
    }

    return result.rows[0];

}

async function removeItem(userId, productId) {

    const result = await cartRepository.removeItem(userId, productId);

    if (result.rowCount === 0) {
        throw new NotFoundError("Item not found in cart");
    }

}

async function clearCart(userId) {

    await cartRepository.clearCart(userId);

}

module.exports = {
    getCart,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart
};
