const express = require("express");
const router = express.Router();
const {
  createAdmin,
  getAllAdmins,
  deleteAdmin,
  addProspect,
  addProspectsByExcel,
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/auth");
const uploadPhotoMiddleware = require("../middleware/uploadPhotoMiddleware");
const { uploadExcel } = require("../middleware/uploadExcelMiddleware");

// Routes
router.post(
  "/create",
  protect,
  authorize("admin"),
  uploadPhotoMiddleware.none(),
  createAdmin
);
router.get("/getAllAdmins", protect, authorize("admin"), getAllAdmins);
router.delete("/delete/:id", protect, authorize("admin"), deleteAdmin);
router.post(
  "/addProspect",
  protect,
  authorize("admin"),
  (req, res, next) => {
    uploadPhotoMiddleware.single("Photo")(req, res, function (err) {
      if (err) {
        console.error("Multer error:", err.message);
        return res.status(400).json({ message: err.message });
      } else {
        console.log("Multer success:", req.file); // Log the file information
      }
      next();
    });
  },
  addProspect
);
router.post(
  "/addProspectByExcel",
  protect,
  authorize("admin"),
  uploadExcel.single("ProspectsExcelData"),
  addProspectsByExcel
);

module.exports = router;
