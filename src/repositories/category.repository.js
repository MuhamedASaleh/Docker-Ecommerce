const { pool } = require("../config/database");

async function getAllCategories() {

    const result = await pool.query(`
        SELECT id, name, description, created_at, updated_at
        FROM categories
        ORDER BY name ASC;
    `);

    return result.rows;
}

async function getCategoryById(id) {

    const result = await pool.query(
        `
        SELECT id, name, description, created_at, updated_at
        FROM categories
        WHERE id = $1;
        `,
        [id]
    );

    return result.rows[0];
}

async function getCategoryByName(name) {

    const result = await pool.query(
        `
        SELECT id, name, description, created_at, updated_at
        FROM categories
        WHERE name = $1;
        `,
        [name]
    );

    return result.rows[0];
}

async function createCategory({ name, description }) {

    const result = await pool.query(
        `
        INSERT INTO categories (name, description)
        VALUES ($1, $2)
        RETURNING id, name, description, created_at, updated_at;
        `,
        [name, description]
    );

    return result.rows[0];
}

const UPDATABLE_COLUMNS = ["name", "description"];

async function updateCategory(id, categoryData) {

    const setClauses = [];
    const values = [];

    for (const column of UPDATABLE_COLUMNS) {
        if (categoryData[column] !== undefined) {
            values.push(categoryData[column]);
            setClauses.push(`${column} = $${values.length}`);
        }
    }


    setClauses.push("updated_at = NOW()");
    values.push(id);

    const sql = `
        UPDATE categories
        SET
            ${setClauses.join(",\n            ")}
        WHERE id = $${values.length}
        RETURNING id, name, description, created_at, updated_at;
    `;

    const result = await pool.query(sql, values);

    return result;
}

async function deleteCategory(id) {

    const result = await pool.query(
        "DELETE FROM categories WHERE id = $1 RETURNING id;",
        [id]
    );

    return result;
}

module.exports = {
    getAllCategories,
    getCategoryById,
    getCategoryByName,
    createCategory,
    updateCategory,
    deleteCategory
};
