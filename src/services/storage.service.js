const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

async function upload(file) {

    return new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(

            {

                folder: "products"

            },

            (error, result) => {

                if (error) {

                    return reject(error);

                }

                resolve(result);

            }

        );

        streamifier
            .createReadStream(file.buffer)
            .pipe(stream);

    });

}
async function destroy(publicId) {

    return cloudinary.uploader.destroy(publicId);

}
module.exports = {

    upload,
    destroy

};