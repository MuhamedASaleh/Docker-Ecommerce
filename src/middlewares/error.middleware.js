const multer = require("multer");
const AppError = require("../errors/AppError");

function errorMiddleware(err, req, res, next) {

    if (err instanceof multer.MulterError) {

        return res.status(400).json({

            success: false,

            message: err.message

        });

    }

    if (err instanceof AppError) {

        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        });

    }

    console.error(err);

    res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });

}

module.exports = errorMiddleware;
