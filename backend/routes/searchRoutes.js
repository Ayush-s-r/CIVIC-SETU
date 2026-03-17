const express = require("express");
const Complaint = require("../models/Complaint");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// @route   GET /api/search/complaints
// @desc    Search complaints with advanced filters
// @access  Private (Admin only)
router.get("/complaints", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const {
      query,
      status,
      priority,
      category,
      department,
      startDate,
      endDate,
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const filter = {};

    // Text search
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { trackingNumber: { $regex: query, $options: "i" } },
        { "citizen.name": { $regex: query, $options: "i" } },
        { "citizen.email": { $regex: query, $options: "i" } },
        { "location.address": { $regex: query, $options: "i" } },
      ];
    }

    // Status filter
    if (status) {
      filter.status = status;
    }

    // Priority filter
    if (priority) {
      filter.priority = priority;
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Department filter
    if (department) {
      filter.department = department;
    }

    // Date range filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    const sortObj = {};
    sortObj[sortBy] = sortOrder === "asc" ? 1 : -1;

    const complaints = await Complaint.find(filter)
      .populate("assignedTo", "name email")
      .sort(sortObj)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Complaint.countDocuments(filter);

    res.json({
      complaints,
      pagination: {
        totalRecords: total,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        recordsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("Error searching complaints:", error);
    res.status(500).json({ message: "Server error while searching" });
  }
});

// @route   GET /api/search/by-location
// @desc    Search complaints by location (with radius)
// @access  Private (Admin only)
router.get("/by-location", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { latitude, longitude, radius = 5 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        message: "Latitude and longitude are required",
      });
    }

    const complaints = await Complaint.find({
      "location.latitude": {
        $gte: parseFloat(latitude) - parseFloat(radius) / 111.32,
        $lte: parseFloat(latitude) + parseFloat(radius) / 111.32,
      },
      "location.longitude": {
        $gte: parseFloat(longitude) - parseFloat(radius) / (111.32 * Math.cos(parseFloat(latitude) * Math.PI / 180)),
        $lte: parseFloat(longitude) + parseFloat(radius) / (111.32 * Math.cos(parseFloat(latitude) * Math.PI / 180)),
      },
    }).populate("assignedTo", "name email");

    res.json({
      complaints,
      count: complaints.length,
    });
  } catch (error) {
    console.error("Error searching by location:", error);
    res.status(500).json({ message: "Server error while searching" });
  }
});

// @route   GET /api/search/by-tracking-number/:trackingNumber
// @desc    Get complaint by tracking number
// @access  Public
router.get("/by-tracking-number/:trackingNumber", async (req, res) => {
  try {
    const complaint = await Complaint.findOne({
      trackingNumber: req.params.trackingNumber,
    }).populate("assignedTo", "name email");

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json({ complaint });
  } catch (error) {
    console.error("Error fetching complaint:", error);
    res.status(500).json({ message: "Server error while fetching complaint" });
  }
});

module.exports = router;
