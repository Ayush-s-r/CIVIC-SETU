const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Full name is required"],
    trim: true,
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email"],
  },

  mobile: {
    type: String,
    required: [true, "Mobile number is required"],
  },

  address: {
    type: String,
    required: [true, "Address is required"],
  },

  category: {
    type: String,
    enum: ["road", "garbage", "streetlight"],
    required: true,
  },

  description: {
    type: String,
    required: [true, "Description is required"],
  },

  // 🔥 Optional ML result storage
  mlDetection: {
    type: Object,
  },

  // 🔥 Keep useful system fields
  status: {
    type: String,
    enum: ["pending", "in-progress", "resolved"],
    default: "pending",
  },

  trackingNumber: {
    type: String,
    unique: true,
  },

}, { timestamps: true });


// 🔥 Generate tracking number
complaintSchema.pre("save", function (next) {
  if (!this.trackingNumber) {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");

    this.trackingNumber = `CIV-${year}-${random}`;
  }
  next();
});

module.exports = mongoose.model("Complaint", complaintSchema);