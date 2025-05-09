const mongoose = require("mongoose");

const ProspectSchema = new mongoose.Schema(
  {
    Sewadar_Name: {
      type: String,
    },
    Father_Husband_Name: {
      type: String,
    },
    Guardian_Relation: {
      type: String,
      enum: ["Father", "Husband"],
    },
    Gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    AGE: {
      type: Number,
    },
    AADHAAR: {
      type: String,
      unique: true,
    },
    Address: {
      type: String,
    },
    Phone_Number: {
      type: String,
      unique: true,
      required: true,
    },
    Badge: {
      type: String,
      unique: true,
      required: true,
    },
    Emergency_Contact: {
      type: String,
    },
    DOB: {
      type: Date,
    },
    DEPT_FINALISED_BY_CENTER: {
      type: String,
    },
    Marital_Status: {
      type: String,
      enum: ["Single", "Married", "Divorced", "Widowed"],
    },
    DOI: {
      type: Date,
    },
    Is_Initiated: {
      type: Boolean,
    },
    Badge_Status: {
      type: String,
      enum: ["Open", "Permanent", "Elderly"],
    },
    Photo: {
      type: String,
    },
    Blood_Group: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    Call_Result: {
      type: String,
    },
    Remarks: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Prospect", ProspectSchema);
