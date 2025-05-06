const User = require("../models/User");
const Prospect = require("../models/Prospect");
const fs = require("fs");

const REQUIRED_FIELDS = [
  "Sewadar_Name",
  "Father_Husband_Name",
  "Guardian_Relation",
  "Gender",
  "AGE",
  "AADHAAR",
  "Address",
  "Phone_Number",
  "Badge",
  "Emergency_Contact",
  "DOB",
  "DEPT_FINALISED_BY_CENTER",
  "Marital_Status",
  "DOI",
  "Is_Initiated",
  "Badge_Status",
  "Blood_Group",
  "Photo",
];

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
      Photo: req.file ? req.file.path : null, // Cloudinary URL
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

// const addProspectsByExcel = async (req, res) => {
//   try {
//     const filePath = req.file.path;
//     console.log("Uploaded file path:", filePath);

//     const workbook = XLSX.readFile(filePath);
//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];
//     const data = XLSX.utils.sheet_to_json(sheet);

//     const errors = [];
//     const createdProspects = [];

//     for (let i = 0; i < data.length; i++) {
//       const row = data[i];

//       // Check for missing fields
//       const missingFields = REQUIRED_FIELDS.filter((field) => !(field in row));
//       if (missingFields.length > 0) {
//         errors.push({
//           row: i + 2,
//           error: `Missing fields: ${missingFields.join(", ")}`,
//         });
//         continue;
//       }

//       // Check duplicates
//       const [aadhaarExists, badgeExists, phoneExists] = await Promise.all([
//         Prospect.findOne({ AADHAAR: row.AADHAAR }),
//         Prospect.findOne({ Badge: row.Badge }),
//         Prospect.findOne({ Phone_Number: row.Phone_Number }),
//       ]);

//       if (aadhaarExists || badgeExists || phoneExists) {
//         let duplicateFields = [];
//         if (aadhaarExists) duplicateFields.push("AADHAAR");
//         if (badgeExists) duplicateFields.push("Badge");
//         if (phoneExists) duplicateFields.push("Phone_Number");

//         errors.push({
//           row: i + 2,
//           error: `Duplicate in: ${duplicateFields.join(", ")}`,
//         });
//         continue;
//       }

//       // Create new prospect
//       const newProspect = new Prospect({
//         Sewadar_Name: row.Sewadar_Name,
//         Father_Husband_Name: row.Father_Husband_Name,
//         Guardian_Relation: row.Guardian_Relation,
//         Gender: row.Gender,
//         AGE: row.AGE,
//         AADHAAR: row.AADHAAR,
//         Address: row.Address,
//         Phone_Number: row.Phone_Number,
//         Badge: row.Badge,
//         Emergency_Contact: row.Emergency_Contact,
//         DOB: new Date(row.DOB),
//         DEPT_FINALISED_BY_CENTER: row.DEPT_FINALISED_BY_CENTER,
//         Marital_Status: row.Marital_Status,
//         DOI: new Date(row.DOI),
//         Is_Initiated: row.Is_Initiated === "true" || row.Is_Initiated === true,
//         Badge_Status: row.Badge_Status,
//         Blood_Group: row.Blood_Group,
//         Photo: row.Photo || null, // Now populated from Excel
//       });

//       await newProspect.save();
//       createdProspects.push(newProspect);
//     }

//     fs.unlinkSync(filePath); // Delete uploaded file

//     res.status(201).json({
//       success: true,
//       createdCount: createdProspects.length,
//       errors,
//     });
//   } catch (error) {
//     console.error("Error in addProspectsByExcel:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };
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
  addProspect,
  getAllUsers,
  deleteUser,
  getAllProspects,
};
