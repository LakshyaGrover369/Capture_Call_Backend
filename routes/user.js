const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  deleteUser,
  addProspect,
  getAllProspects,
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/auth");
const upload = require("../middleware/uploadMiddleware");

// Routes
router.get("/getAllUsers", protect, authorize("admin"), getAllUsers);
router.delete("/delete/:id", protect, authorize("admin"), deleteUser);
router.post(
  "/addProspect",
  protect,
  authorize("user", "admin"),
  (req, res, next) => {
    upload.single("Photo")(req, res, function (err) {
      if (err) {
        console.error("Multer error:", err.message);
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  addProspect
);
router.get(
  "/getAllProspects",
  protect,
  authorize("user", "admin"),
  getAllProspects
);

module.exports = router;
