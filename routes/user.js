const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  deleteUser,
  getAllProspects,
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/auth");

// Routes
router.get("/getAllUsers", protect, authorize("admin"), getAllUsers);
router.delete("/delete/:id", protect, authorize("admin"), deleteUser);
router.get(
  "/getAllProspects",
  protect,
  authorize("user", "admin"),
  getAllProspects
);

module.exports = router;
