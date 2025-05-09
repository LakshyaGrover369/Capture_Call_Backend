const User = require("../models/User");
const Prospect = require("../models/Prospect");

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password");

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "user") {
      return res.status(400).json({ message: "User is not an user" });
    }

    res.status(200).json({
      success: true,
      message: "User removed successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all prospects with photo URLs
const getAllProspects = async (req, res) => {
  try {
    const prospects = await Prospect.find();

    if (prospects.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No prospects found" });
    }

    // For Cloudinary, the URL is already stored in Photo field
    // No need to construct URL if using Cloudinary
    res.status(200).json({
      success: true,
      data: prospects,
    });
  } catch (error) {
    console.error("Error fetching prospects:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  getAllProspects,
};
