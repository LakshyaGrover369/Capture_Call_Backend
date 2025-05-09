const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

const uploadDownloadExcelToCloudinary = (buffer, filename) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        public_id: `Excel_exports/${filename.replace(".xlsx", "")}`,
        folder: "Excel_exports",
        format: "xlsx", // ✅ Sets extension format explicitly
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

module.exports = { uploadDownloadExcelToCloudinary };
