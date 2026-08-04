const productsService = require("../services/product.service");

async function getAllProducts(req, res, next) {

    try {

        const { search, category_id, minPrice, maxPrice, page, limit } = req.query;

        const { products, pagination } = await productsService.getAllProducts({
            search,
            category_id,
            minPrice: minPrice !== undefined ? Number(minPrice) : undefined,
            maxPrice: maxPrice !== undefined ? Number(maxPrice) : undefined,
            page,
            limit
        });

        res.status(200).json({
            success: true,
            data: products,
            pagination
        });

    } catch (error) {

        next(error);

    }

}
const getProductById = async (req, res, next) => {

    try {

        const product = await productsService.getProductById(req.params.id);

        res.status(200).json({
            success: true,
            data: product
        });

    } catch (error) {

        next(error);

    }

};
async function createProduct(req, res, next) {

    try {
   
        const product = await productsService.createProduct(req.body , req.file);

        res.status(201).json({
            success: true,
            data: product
        });

    } catch (error) {

        next(error);

    }

}

async function updateProduct(req, res, next) {

    try {

        const updatedProduct = await productsService.updateProduct(
            req.params.id,
            req.body,
            req.file
        );

        res.status(200).json({
            success: true,
            data: updatedProduct
        });

    } catch (error) {

        next(error);

    }

}             
async function deleteProduct(req, res, next) {
    try {
        await productsService.deleteProduct(req.params.id);

        res.status(204).send();

    } catch (error) {
        next(error);
    }
}


module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct

};