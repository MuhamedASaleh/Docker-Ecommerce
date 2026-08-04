const { pool } = require("../config/database");

async function createUser(user) {

    const sql = `
        INSERT INTO users
        (
            full_name,
            email,
            password_hash
        )
        VALUES
        (
            $1,
            $2,
            $3
        )
        RETURNING
            id,
            full_name,
            email,
            role,
            created_at;
    `;

    const values = [
        user.full_name,
        user.email,
        user.password_hash
    ];

    const result = await pool.query(sql, values);

    return result.rows[0];

}
async function findUserByEmail(email) {

    const sql = `
        SELECT
            id,
            full_name,
            email,
            password_hash,
            role,
            is_active
        FROM users
        WHERE email = $1;
    `;

    const result = await pool.query(sql, [email]);

    return result.rows[0];

}
async function findUserById(id) {

    const sql = `
        SELECT
            id,
            full_name,
            email,
            role,
            is_active
        FROM users
        WHERE id=$1
    `;

    const result =
        await pool.query(sql, [id]);

    return result.rows[0];

}
module.exports = {
    createUser,
    findUserByEmail,
    findUserById
};