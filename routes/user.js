const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  deleteUser,
  addProspect,
  addProspectsByExcel,
  getAllProspects,
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/auth");
const uploadPhotoMiddleware = require("../middleware/uploadPhotoMiddleware");
const uploadExcelMiddleware = require("../middleware/uploadExcelMiddleware");

// Routes
router.get("/getAllUsers", protect, authorize("admin"), getAllUsers);
router.delete("/delete/:id", protect, authorize("admin"), deleteUser);
router.post(
  "/addProspect",
  protect,
  authorize("user", "admin"),
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
// router.post(
//   "/addProspectByExcel",
//   protect,
//   authorize("user", "admin"),
//   (req, res, next) => {
//     uploadExcelMiddleware.single("ProspectsExcelData")(
//       req,
//       res,
//       function (err) {
//         if (err) {
//           console.error("Multer error:", err.message);
//           return res.status(400).json({ message: err.message });
//         }
//         next();
//       }
//     );
//   },
//   addProspectsByExcel
// );
router.get(
  "/getAllProspects",
  protect,
  authorize("user", "admin"),
  getAllProspects
);

module.exports = router;
