const { client: redis } = require("../config/redis");
const REFRESH_TTL = 60 * 60 * 24 * 7;

async function saveRefreshToken(userId, token) {

    await redis.set(
        `refresh:${userId}`,
        token,
        {
            EX: REFRESH_TTL
        }
    );

}

async function getRefreshToken(userId) {

    return redis.get(
        `refresh:${userId}`
    );

}

async function deleteRefreshToken(userId) {

    await redis.del(
        `refresh:${userId}`
    );

}

module.exports = {
    saveRefreshToken,
    getRefreshToken,
    deleteRefreshToken
};