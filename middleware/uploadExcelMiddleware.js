// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// const uploadPath = path.join(__dirname, "../uploadedExcels");
// if (!fs.existsSync(uploadPath)) {
//   fs.mkdirSync(uploadPath, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadPath = path.join(__dirname, "../uploadedExcels");
//     console.log("Upload path:", uploadPath);
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     const uniqueFilename = `${Date.now()}-${file.originalname}`;
//     console.log("Unique filename:", uniqueFilename);
//     cb(null, uniqueFilename);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   console.log("File filter called:", file.originalname, file.mimetype);
//   const fileTypes =
//     /vnd.openxmlformats-officedocument.spreadsheetml.sheet|vnd.ms-excel/;
//   const extname = /\.(xls|xlsx)$/.test(
//     path.extname(file.originalname).toLowerCase()
//   );
//   const mimetype = fileTypes.test(file.mimetype);

//   if (extname && mimetype) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only Excel files are allowed"));
//   }
// };

// const upload = multer({ storage, fileFilter });

// module.exports = upload;
