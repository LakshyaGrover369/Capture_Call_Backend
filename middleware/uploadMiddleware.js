const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadPath = path.join(__dirname, "../prospectsPhotos");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../prospectsPhotos");
    // console.log("Uploading to:", uploadPath); // Debugging
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueFilename = `${Date.now()}${file.originalname}`;
    // console.log("Generated filename:", uniqueFilename); // Debugging
    cb(null, uniqueFilename);
  },
});

const fileFilter = (req, file, cb) => {
  // console.log("File MIME type:", file.mimetype); // Debugging
  // console.log("File extension:", path.extname(file.originalname).toLowerCase()); // Debugging

  const fileTypes = /jpeg|jpg|png/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
