const { createClient } = require("redis");

const client = createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT)
    }
});

client.on("error", (err) => {
    console.error("Redis client error", err);
});

async function connectRedis() {
    await client.connect();

    console.log("✅ Redis Connected");
}

module.exports = {
    client,
    connectRedis
};