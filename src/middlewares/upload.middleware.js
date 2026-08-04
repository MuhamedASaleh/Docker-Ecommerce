const BadRequestError = require("../errors/BadRequestError");

const fileFilter = (req, file, cb) => {
    
    const allowedTypes = [
        
        "image/jpeg",
        
        "image/png",
        
        "image/webp"
        
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
        
        cb(null, true);

    } else {
        
        cb(
            new BadRequestError("Only JPEG, PNG and WEBP images are allowed"),
            false
        );

    }

};


const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    fileFilter,
    limits: {

        fileSize: 2 * 1024 * 1024

    }
});

module.exports = upload;    