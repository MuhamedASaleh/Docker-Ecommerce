const UnauthorizedError = require("../errors/UnauthorizedError");

function authorize(...allowedRoles) {

    return (req, res, next) => {

        if (!req.user) {
            return next(
                new UnauthorizedError("User not authenticated")
            );
        }

        if (!allowedRoles.includes(req.user.role)) {
            return next(
                new UnauthorizedError("Access denied")
            );
        }

        next();

    };

}

module.exports = authorize;