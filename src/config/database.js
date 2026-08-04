const { Pool } = require("pg");

const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

pool.on("error", (err) => {
    console.error("Unexpected PostgreSQL pool error", err);
});

async function connectDatabase() {
    const client = await pool.connect();

    console.log("✅ PostgreSQL Connected");

    client.release();
}

async function withTransaction(fn) {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");
        const result = await fn(client);
        await client.query("COMMIT");
        return result;
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
}

module.exports = {
    pool,
    connectDatabase,
    withTransaction,
};