const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");
const productsRepository = require("../repositories/product.repository");
const { upload, destroy } = require("./storage.service");

async function getAllProducts(filters) {

    return await productsRepository.getAllProducts(filters);

}
const getProductById = async (id) => {

    const product = await productsRepository.getProductById(id);
    if (!product) {

        throw new NotFoundError("Product not found");

    }
    return product;

};
async function createProduct(productData, file) {

    if (!file) {
        throw new BadRequestError("Product image is required");
    }

    const image = await upload(file);

    return await productsRepository.createProduct({
        ...productData,
        image_url: image.secure_url,
        image_public_id: image.public_id
    });

}
async function updateProduct(id, productData, file) {

    const existingProduct = await productsRepository.getProductById(id);

    if (!existingProduct) {
        throw new NotFoundError("Product not found");
    }

    if (file) {
        const image = await upload(file);
        productData.image_url = image.secure_url;
        productData.image_public_id = image.public_id;
    }

    const result = await productsRepository.updateProduct(
        id,
        productData
    );

    if (result.rowCount === 0) {

        throw new NotFoundError("Product not found");

    }

    if (file && existingProduct.image_public_id) {
        await destroy(existingProduct.image_public_id);
    }

    return result.rows[0];

}
async function deleteProduct(id) {

    const result = await productsRepository.deleteProduct(id);

    if (result.rowCount === 0) {
        throw new NotFoundError("Product not found");
    }

    const deletedProduct = result.rows[0];

    if (deletedProduct.image_public_id) {
        await destroy(deletedProduct.image_public_id);
    }

    return;
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
