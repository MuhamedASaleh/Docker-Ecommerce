const { pool } = require("../config/database");

async function getAllProducts(filters = {}) {

    const {
        search,
        category_id,
        minPrice,
        maxPrice,
        page = 1,
        limit = 20
    } = filters;

    const conditions = ["p.is_active = TRUE"];
    const values = [];

    if (search) {
        values.push(`%${search}%`);
        conditions.push(`p.name ILIKE $${values.length}`);
    }

    if (category_id) {
        values.push(category_id);
        conditions.push(`p.category_id = $${values.length}`);
    }

    if (minPrice !== undefined) {
        values.push(minPrice);
        conditions.push(`p.price >= $${values.length}`);
    }

    if (maxPrice !== undefined) {
        values.push(maxPrice);
        conditions.push(`p.price <= $${values.length}`);
    }

    const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
    const safePage = Math.max(Number(page) || 1, 1);
    const offset = (safePage - 1) * safeLimit;

    values.push(safeLimit);
    const limitIndex = values.length;

    values.push(offset);
    const offsetIndex = values.length;

    const sql = `
        SELECT
            p.id,
            p.name,
            p.description,
            p.price,
            p.stock_quantity,
            p.image_url,
            p.image_public_id,
            p.category_id,
            c.name AS category_name,
            p.created_at,
            p.updated_at,
            COUNT(*) OVER() AS total_count
        FROM products p
        LEFT JOIN categories c ON c.id = p.category_id
        WHERE ${conditions.join(" AND ")}
        ORDER BY p.created_at DESC
        LIMIT $${limitIndex}
        OFFSET $${offsetIndex};
    `;

    const result = await pool.query(sql, values);

    const total = result.rows[0] ? Number(result.rows[0].total_count) : 0;
    const products = result.rows.map(({ total_count, ...product }) => product);

    return {
        products,
        pagination: {
            page: safePage,
            limit: safeLimit,
            total,
            totalPages: safeLimit > 0 ? Math.ceil(total / safeLimit) : 0
        }
    };
}

async function getProductById(id) {

    const result = await pool.query(
        `
        SELECT
            p.id,
            p.name,
            p.description,
            p.price,
            p.stock_quantity,
            p.image_url,
            p.image_public_id,
            p.category_id,
            c.name AS category_name,
            p.created_at,
            p.updated_at
        FROM products p
        LEFT JOIN categories c ON c.id = p.category_id
        WHERE p.id = $1 AND p.is_active = TRUE;
        `,
        [id]
    );

    return result.rows[0];
}

async function createProduct(product) {

    const {
        name,
        description,
        price,
        stock_quantity,
        image_url,
        image_public_id,
        category_id
    } = product;

    const result = await pool.query(
        `
        INSERT INTO products
        (
            name,
            description,
            price,
            stock_quantity,
            image_url,
            image_public_id,
            category_id
        )
        VALUES
        (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7
        )
        RETURNING
            id,
            name,
            description,
            price,
            stock_quantity,
            image_url,
            image_public_id,
            category_id,
            created_at;
        `,
        [
            name,
            description,
            price,
            stock_quantity,
            image_url,
            image_public_id,
            category_id
        ]
    );

    return result.rows[0];

}
const UPDATABLE_COLUMNS = [
    "name",
    "description",
    "price",
    "stock_quantity",
    "image_url",
    "image_public_id",
    "category_id"
];

async function updateProduct(id, productData) {

    const setClauses = [];
    const values = [];

    for (const column of UPDATABLE_COLUMNS) {
        if (productData[column] !== undefined) {
            values.push(productData[column]);
            setClauses.push(`${column} = $${values.length}`);
        }
    }

    setClauses.push("updated_at = NOW()");
    values.push(id);

    const sql = `
        UPDATE products
        SET
            ${setClauses.join(",\n            ")}
        WHERE id = $${values.length} AND is_active = TRUE
        RETURNING
            id,
            name,
            description,
            price,
            stock_quantity,
            image_url,
            image_public_id,
            category_id,
            created_at,
            updated_at;
    `;

    const result = await pool.query(sql, values);

    return result;
}

async function deleteProduct(id) {

    const sql = `
       UPDATE products
SET
    is_active = FALSE,
    updated_at = NOW()
WHERE id = $1
AND is_active = TRUE
RETURNING *;
    `;

    const result = await pool.query(sql, [id]);

    return result;
}

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
