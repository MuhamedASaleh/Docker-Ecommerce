const cartService = require("../services/cart.service");

async function getCart(req, res, next) {

    try {

        const cart = await cartService.getCart(req.user.sub);

        res.status(200).json({
            success: true,
            data: cart
        });

    } catch (error) {

        next(error);

    }

}

async function addItem(req, res, next) {

    try {

        const { product_id, quantity } = req.body;

        const item = await cartService.addItem(req.user.sub, product_id, quantity);

        res.status(201).json({
            success: true,
            data: item
        });

    } catch (error) {

        next(error);

    }

}

async function updateItemQuantity(req, res, next) {

    try {

        const item = await cartService.updateItemQuantity(
            req.user.sub,
            req.params.productId,
            req.body.quantity
        );

        res.status(200).json({
            success: true,
            data: item
        });

    } catch (error) {

        next(error);

    }

}

async function removeItem(req, res, next) {

    try {

        await cartService.removeItem(req.user.sub, req.params.productId);

        res.status(204).send();

    } catch (error) {

        next(error);

    }

}

async function clearCart(req, res, next) {

    try {

        await cartService.clearCart(req.user.sub);

        res.status(204).send();

    } catch (error) {

        next(error);

    }

}

module.exports = {
    getCart,
    addItem,
    updateItemQuantity,
    removeItem,
    clearCart
};
