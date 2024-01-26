const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the destination folder
    },
    filename: (req, file, cb) => {
        const filename = `${Date.now()}${path.extname(file.originalname)}`;
        cb(null, filename);
    },
});

const upload = multer({ storage });

exports.uploadMultimedia = async (file) => {
    // Perform any additional processing if needed
    return `/uploads/${file.filename}`  // Return the file path or URL
};