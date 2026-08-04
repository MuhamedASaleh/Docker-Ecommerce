const categoryService = require("../services/category.service");

async function getAllCategories(req, res, next) {

    try {

        const categories = await categoryService.getAllCategories();

        res.status(200).json({
            success: true,
            data: categories
        });

    } catch (error) {

        next(error);

    }

}

async function getCategoryById(req, res, next) {

    try {

        const category = await categoryService.getCategoryById(req.params.id);

        res.status(200).json({
            success: true,
            data: category
        });

    } catch (error) {

        next(error);

    }

}

async function createCategory(req, res, next) {

    try {

        const category = await categoryService.createCategory(req.body);

        res.status(201).json({
            success: true,
            data: category
        });

    } catch (error) {

        next(error);

    }

}

async function updateCategory(req, res, next) {

    try {

        const category = await categoryService.updateCategory(req.params.id, req.body);

        res.status(200).json({
            success: true,
            data: category
        });

    } catch (error) {

        next(error);

    }

}

async function deleteCategory(req, res, next) {

    try {

        await categoryService.deleteCategory(req.params.id);

        res.status(204).send();

    } catch (error) {

        next(error);

    }

}

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};
