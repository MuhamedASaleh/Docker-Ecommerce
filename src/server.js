require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 3000;
const { connectDatabase, pool } = require("./config/database");

const { connectRedis, client: redisClient } = require("./config/redis");

let server;

function shutdown(signal) {
    console.log(`${signal} received, shutting down gracefully`);

    server.close(async () => {
        console.log("HTTP server closed");

        try {
            await pool.end();
            console.log("PostgreSQL pool closed");

            await redisClient.quit();
            console.log("Redis connection closed");

            process.exit(0);
        } catch (error) {
            console.error("Error during shutdown", error);
            process.exit(1);
        }
    });
}

async function startServer() {
    try {
        await connectDatabase();

        await connectRedis();
        server = app.listen(PORT, () => {
            console.log(`🚀 Server running on ${PORT}  `);
        });

        process.on("SIGTERM", () => shutdown("SIGTERM"));
        process.on("SIGINT", () => shutdown("SIGINT"));
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

startServer();
