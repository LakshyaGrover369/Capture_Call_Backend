const User = require("../models/User");
const Prospect = require("../models/Prospect");
const ExcelJS = require("exceljs");
const {
  uploadExcelToCloudinary,
} = require("../middleware/uploadExcelMiddleware");

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
// Validation functions
const isValidPhoneNumber = (phone) => /^\d{10}$/.test(phone);
const isValidAadhaar = (aadhaar) => /^\d{12}$/.test(aadhaar);
const isValidDate = (date) => !isNaN(Date.parse(date));

// Create admin
const createAdmin = async (req, res) => {
  try {
    const { name, email, phoneNumber, password, BatchNumber } = req.body;

    // Check if admin exists
    const adminExists = await User.findOne({ email });
    if (adminExists) {
      return res
        .status(400)
        .json({ message: "Admin already exists with this email" });
    }

    // Create admin user
    const admin = await User.create({
      name,
      email,
      phoneNumber,
      password,
      BatchNumber,
      role: "admin", // Set role as admin
    });

    res.status(201).json({
      success: true,
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phoneNumber: admin.phoneNumber,
        BatchNumber: admin.BatchNumber,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all admins
const getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: admins,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete admin
const deleteAdmin = async (req, res) => {
  try {
    const admin = await User.findByIdAndDelete(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (admin.role !== "admin") {
      return res.status(400).json({ message: "User is not an admin" });
    }

    res.status(200).json({
      success: true,
      message: "Admin removed successfully",
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

const addProspectsByExcel = async (req, res) => {
  try {
    const fileBuffer = req.file.buffer;
    const fileName = req.file.originalname;

    // Upload the Excel file to Cloudinary
    const uploadResult = await uploadExcelToCloudinary(fileBuffer, fileName);
    const cloudinaryLink = uploadResult.secure_url;

    // Parse the Excel file
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(fileBuffer);
    const worksheet = workbook.worksheets[0];

    const rows = [];
    const headerRow = worksheet.getRow(1);
    const headers = headerRow.values
      .slice(1)
      .map((header) => header.toString().trim());

    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header row
      const rowData = {};
      headers.forEach((header, index) => {
        rowData[header] = row.getCell(index + 1).text.trim();
      });
      rows.push({ rowNumber, data: rowData });
    });

    const errors = [];
    const createdProspects = [];
    const seen = new Set();

    for (const { rowNumber, data } of rows) {
      // Check for missing required fields
      const missingFields = REQUIRED_FIELDS.filter((field) => !data[field]);
      if (missingFields.length > 0) {
        errors.push({
          row: rowNumber,
          error: `Missing fields: ${missingFields.join(", ")}`,
        });
        continue;
      }

      // Validate field formats
      if (!isValidPhoneNumber(data["Phone_Number"])) {
        errors.push({
          row: rowNumber,
          error: "Invalid Phone Number format",
        });
        continue;
      }

      if (!isValidAadhaar(data["AADHAAR"])) {
        errors.push({
          row: rowNumber,
          error: "Invalid AADHAAR format",
        });
        continue;
      }

      if (!isValidDate(data["DOB"]) || !isValidDate(data["DOI"])) {
        errors.push({
          row: rowNumber,
          error: "Invalid date format in DOB or DOI",
        });
        continue;
      }

      // Check for duplicates in the current batch
      const uniqueKey = `${data["AADHAAR"]}-${data["Badge"]}-${data["Phone_Number"]}`;
      if (seen.has(uniqueKey)) {
        errors.push({
          row: rowNumber,
          error: "Duplicate entry in the uploaded file",
        });
        continue;
      }
      seen.add(uniqueKey);

      // Check for duplicates in the database
      const [aadhaarExists, badgeExists, phoneExists] = await Promise.all([
        Prospect.findOne({ AADHAAR: data["AADHAAR"] }),
        Prospect.findOne({ Badge: data["Badge"] }),
        Prospect.findOne({ Phone_Number: data["Phone_Number"] }),
      ]);

      if (aadhaarExists || badgeExists || phoneExists) {
        const duplicateFields = [];
        if (aadhaarExists) duplicateFields.push("AADHAAR");
        if (badgeExists) duplicateFields.push("Badge");
        if (phoneExists) duplicateFields.push("Phone_Number");

        errors.push({
          row: rowNumber,
          error: `Duplicate in database: ${duplicateFields.join(", ")}`,
        });
        continue;
      }

      // Create new prospect
      const newProspect = new Prospect({
        Sewadar_Name: data["Sewadar_Name"],
        Father_Husband_Name: data["Father_Husband_Name"],
        Guardian_Relation: data["Guardian_Relation"],
        Gender: data["Gender"],
        AGE: data["AGE"],
        AADHAAR: data["AADHAAR"],
        Address: data["Address"],
        Phone_Number: data["Phone_Number"],
        Badge: data["Badge"],
        Emergency_Contact: data["Emergency_Contact"],
        DOB: new Date(data["DOB"]),
        DEPT_FINALISED_BY_CENTER: data["DEPT_FINALISED_BY_CENTER"],
        Marital_Status: data["Marital_Status"],
        DOI: new Date(data["DOI"]),
        Is_Initiated:
          data["Is_Initiated"] === "true" || data["Is_Initiated"] === true,
        Badge_Status: data["Badge_Status"],
        Blood_Group: data["Blood_Group"],
        Photo: data["Photo"] || null,
      });

      await newProspect.save();
      createdProspects.push(newProspect);
    }

    if (createdProspects.length === 0 && errors.length > 0) {
      return res.status(200).json({
        message_id: "UPLOAD_FAILED",
        message: "No valid entries were found. Please review the errors.",
        cloudinaryLink,
        errors,
      });
    }

    res.status(201).json({
      message_id: "UPLOAD_SUCCESS",
      message: "Prospects uploaded successfully",
      createdCount: createdProspects.length,
      cloudinaryLink,
      errors,
    });
  } catch (error) {
    console.error("Error in addProspectsByExcel:", error);
    res.status(500).json({
      message_id: "SERVER_ERROR",
      message: "An error occurred while processing the file.",
    });
  }
};

module.exports = {
  createAdmin,
  getAllAdmins,
  deleteAdmin,
  addProspect,
  addProspectsByExcel,
};
