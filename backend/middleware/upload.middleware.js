const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, callback) => {
    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
        return callback(
            new Error("Only JPG, PNG and WEBP images are allowed")
        );
    }

    callback(null, true);
};

const uploadProfileImage = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024,
    },
});

module.exports = {
    uploadProfileImage,
};