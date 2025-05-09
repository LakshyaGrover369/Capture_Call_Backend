const User = require("../models/User");
const Prospect = require("../models/Prospect");
const {
  uploadExcelToCloudinary,
} = require("../middleware/uploadExcelMiddleware");
const ExcelJS = require("exceljs");
const {
  uploadDownloadExcelToCloudinary,
} = require("../middleware/downloadExcelMiddleware");
// const streamifier = require("streamifier");

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

// Get all prospects By Excel
const getAllProspectsByExcel = async (req, res) => {
  try {
    const prospects = await Prospect.find();

    if (prospects.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No prospects found" });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Prospects");

    worksheet.columns = [
      { header: "Sewadar Name", key: "Sewadar_Name", width: 25 },
      { header: "Father/Husband Name", key: "Father_Husband_Name", width: 25 },
      { header: "Guardian Relation", key: "Guardian_Relation", width: 15 },
      { header: "Gender", key: "Gender", width: 10 },
      { header: "Age", key: "AGE", width: 10 },
      { header: "AADHAAR", key: "AADHAAR", width: 20 },
      { header: "Address", key: "Address", width: 30 },
      { header: "Phone Number", key: "Phone_Number", width: 20 },
      { header: "Badge", key: "Badge", width: 15 },
      { header: "Emergency Contact", key: "Emergency_Contact", width: 20 },
      { header: "DOB", key: "DOB", width: 15 },
      { header: "Dept Finalised", key: "DEPT_FINALISED_BY_CENTER", width: 25 },
      { header: "Marital Status", key: "Marital_Status", width: 15 },
      { header: "DOI", key: "DOI", width: 15 },
      { header: "Is Initiated", key: "Is_Initiated", width: 15 },
      { header: "Badge Status", key: "Badge_Status", width: 15 },
      { header: "Photo", key: "Photo", width: 40 },
      { header: "Blood Group", key: "Blood_Group", width: 10 },
      { header: "Call Result", key: "Call_Result", width: 20 },
      { header: "Remarks", key: "Remarks", width: 30 },
    ];

    prospects.forEach((prospect) => {
      worksheet.addRow({
        ...prospect.toObject(),
        DOB: prospect.DOB ? new Date(prospect.DOB).toLocaleDateString() : "",
        DOI: prospect.DOI ? new Date(prospect.DOI).toLocaleDateString() : "",
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    try {
      const readWorkbook = new ExcelJS.Workbook();
      await readWorkbook.xlsx.load(buffer);
      console.log(readWorkbook.worksheets);
    } catch (error) {
      console.error("Error reading buffer:", error);
    }

    const cloudinaryUpload = await uploadDownloadExcelToCloudinary(
      buffer,
      "prospects.xlsx"
    );

    res.status(200).json({
      success: true,
      data: prospects,
      ExcelLink: cloudinaryUpload.secure_url,
    });
  } catch (error) {
    console.error("Error exporting prospects:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getAllUsers,
  deleteUser,
  getAllProspects,
  getAllProspectsByExcel,
};
