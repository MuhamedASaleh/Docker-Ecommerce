const NotFoundError = require("../errors/NotFoundError");
const ConflictError = require("../errors/ConflictError");
const categoryRepository = require("../repositories/category.repository");

async function getAllCategories() {

    return await categoryRepository.getAllCategories();

}

async function getCategoryById(id) {

    const category = await categoryRepository.getCategoryById(id);

    if (!category) {
        throw new NotFoundError("Category not found");
    }

    return category;

}

async function createCategory(categoryData) {

    const existing = await categoryRepository.getCategoryByName(categoryData.name);

    if (existing) {
        throw new ConflictError("A category with this name already exists");
    }

    return await categoryRepository.createCategory(categoryData);

}

async function updateCategory(id, categoryData) {

    if (categoryData.name !== undefined) {
        const existing = await categoryRepository.getCategoryByName(categoryData.name);

        if (existing && existing.id !== id) {
            throw new ConflictError("A category with this name already exists");
        }
    }

    const result = await categoryRepository.updateCategory(id, categoryData);

    if (result.rowCount === 0) {
        throw new NotFoundError("Category not found");
    }

    return result.rows[0];

}

async function deleteCategory(id) {

    const result = await categoryRepository.deleteCategory(id);

    if (result.rowCount === 0) {
        throw new NotFoundError("Category not found");
    }

}

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};
