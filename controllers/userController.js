const User = require("../models/User");
const Prospect = require("../models/Prospect");
const multer = require("multer");
const path = require("path");

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

const addProspect = async (req, res) => {
  try {
    const {
      Sewadar_Name,
      Father_Husband_Name,
      Gender,
      AGE,
      AADHAAR,
      Address,
      Phone_Number,
      Badge,
      Emergency_Contact,
      DOB,
      DEPT_FINALISED_BY_CENTER,
      Marital_Status,
      DOI,
      Is_Initiated,
      Badge_Status,
    } = req.body;

    // Check if Aadhaar, Badge or Phone already exists
    const aadhaarExists = await Prospect.findOne({ AADHAAR });
    if (aadhaarExists) {
      return res.status(400).json({
        message: "Prospect already exists with this Aadhaar number",
      });
    }

    const badgeExists = await Prospect.findOne({ Badge });
    if (badgeExists) {
      return res.status(400).json({
        message: "Prospect already exists with this Badge number",
      });
    }

    const Phone_NumberExists = await Prospect.findOne({ Phone_Number });
    if (Phone_NumberExists) {
      return res.status(400).json({
        message: "Prospect already exists with this Phone number",
      });
    }

    // Create prospect
    const prospect = await Prospect.create({
      Sewadar_Name,
      Father_Husband_Name,
      Gender,
      AGE,
      AADHAAR,
      Address,
      Phone_Number,
      Badge,
      Emergency_Contact,
      DOB,
      DEPT_FINALISED_BY_CENTER,
      Marital_Status,
      DOI,
      Is_Initiated,
      Badge_Status,
      Photo: req.file ? `prospectsPhotos/${req.file.filename}` : null,
    });
    res.status(201).json({
      success: true,
      data: {
        id: prospect._id,
        Sewadar_Name: prospect.Sewadar_Name,
        Father_Husband_Name: prospect.Father_Husband_Name,
        Gender: prospect.Gender,
        AGE: prospect.AGE,
        AADHAAR: prospect.AADHAAR,
        Address: prospect.Address,
        Phone_Number: prospect.Phone_Number,
        Badge: prospect.Badge,
        Emergency_Contact: prospect.Emergency_Contact,
        DOB: prospect.DOB,
        DEPT_FINALISED_BY_CENTER: prospect.DEPT_FINALISED_BY_CENTER,
        Marital_Status: prospect.Marital_Status,
        DOI: prospect.DOI,
        Is_Initiated: prospect.Is_Initiated,
        Badge_Status: prospect.Badge_Status,
        Photo: prospect.Photo,
      },
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

    const prospectsWithPhotoUrls = prospects.map((prospect) => ({
      ...prospect._doc,
      Photo: prospect.Photo
        ? `${req.protocol}://${req.get("host")}/${prospect.Photo}` // Convert relative path to full URL
        : null,
    }));

    res.status(200).json({
      success: true,
      data: prospectsWithPhotoUrls,
    });
  } catch (error) {
    console.error("Error fetching prospects:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  addProspect,
  getAllUsers,
  deleteUser,
  getAllProspects,
};
