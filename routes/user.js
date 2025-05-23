const express = require("express");
const router = express.Router();
const {
  getUserDashboardData,
  getAllUsers,
  deleteUser,
  getAllProspects,
  getNominalList,
  getNominalListByExcel,
  getProspect,
  EditProspect,
  getAllProspectsByExcel,
} = require("../controllers/userController");
const uploadPhotoMiddleware = require("../middleware/uploadPhotoMiddleware");
const { protect, authorize } = require("../middleware/auth");

// Routes
router.get(
  "/getUserDashboardData",
  protect,
  authorize("admin"),
  getUserDashboardData
);
router.get("/getAllUsers", protect, authorize("admin"), getAllUsers);
router.delete("/delete/:id", protect, authorize("admin"), deleteUser);
router.get(
  "/getAllProspects",
  protect,
  authorize("user", "admin"),
  getAllProspects
);
router.get(
  "/getNominalList",
  protect,
  authorize("user", "admin"),
  getNominalList
);
router.get(
  "/getNominalListByExcel",
  protect,
  authorize("user", "admin"),
  getNominalListByExcel
);

router.get(
  "/getProspect/:id",
  protect,
  authorize("user", "admin"),
  getProspect
);
router.post(
  "/EditProspect",
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
  EditProspect
);
router.get(
  "/getAllProspectsByExcel",
  protect,
  authorize("user", "admin"),
  getAllProspectsByExcel
);

module.exports = router;
