const UnauthorizedError = require("../errors/UnauthorizedError");
const { verifyAccessToken } = require("../utils/jwt");

function authenticate(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return next(
            new UnauthorizedError("Authentication required")
        );
    }

    if (!authHeader.startsWith("Bearer ")) {
        return next(
            new UnauthorizedError("Invalid authorization header")
        );
    }

    const token = authHeader.split(" ")[1];

    try {

        const payload =
            verifyAccessToken(token);

        req.user = payload;

        next();

    } catch (error) {

        next(
            new UnauthorizedError("Invalid or expired token")
        );

    }

}

module.exports = authenticate;