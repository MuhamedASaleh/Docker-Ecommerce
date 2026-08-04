const jwt = require("jsonwebtoken");

const ACCESS_EXPIRES = "15m";
const REFRESH_EXPIRES = "7d";

function generateAccessToken(user) {
    return jwt.sign(
        {
            sub: user.id,
            email: user.email,
            role: user.role
        },
        process.env.JWT_ACCESS_SECRET,
        {
            expiresIn: ACCESS_EXPIRES
        }
    );
}

function generateRefreshToken(user) {
    return jwt.sign(
        {
            sub: user.id
        },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: REFRESH_EXPIRES
        }
    );
}

function verifyAccessToken(token) {
    return jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET
    );
}
function verifyRefreshToken(token) {

    return jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET
    );

}
module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
};