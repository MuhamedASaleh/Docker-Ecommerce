const crypto = require("crypto");
const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../config/s3");

const BUCKET = process.env.AWS_BUCKET_NAME;

function buildPublicUrl(key) {

    return `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

}

async function upload(file) {

    const extension = file.originalname
        ? file.originalname.slice(file.originalname.lastIndexOf("."))
        : "";

    const key = `products/${crypto.randomUUID()}${extension}`;

    await s3.send(
        new PutObjectCommand({
            Bucket: BUCKET,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype
        })
    );

    return {
        secure_url: buildPublicUrl(key),
        public_id: key
    };

}

async function destroy(publicId) {

    return s3.send(
        new DeleteObjectCommand({
            Bucket: BUCKET,
            Key: publicId
        })
    );

}

module.exports = {

    upload,
    destroy

};
