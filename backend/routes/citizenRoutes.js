const express = require("express");
const Complaint = require("../models/Complaint");
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// @route   GET /api/citizen/dashboard
// @desc    Get citizen dashboard statistics
// @access  Private
router.get("/dashboard", protect, async (req, res) => {
  try {
    const userEmail = req.user.email;

    // Get citizen's complaint statistics
    const totalComplaints = await Complaint.countDocuments({ "citizen.email": userEmail });
    const resolvedComplaints = await Complaint.countDocuments({ 
      "citizen.email": userEmail, 
      status: "resolved" 
    });
    const pendingComplaints = await Complaint.countDocuments({ 
      "citizen.email": userEmail, 
      status: "pending" 
    });
    const inProgressComplaints = await Complaint.countDocuments({ 
      "citizen.email": userEmail, 
      status: "in-progress" 
    });

    // Recent complaints
    const recentComplaints = await Complaint.find({ "citizen.email": userEmail })
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalComplaints,
        resolvedComplaints,
        pendingComplaints,
        inProgressComplaints
      },
      recentComplaints
    });
  } catch (error) {
    console.error("Error fetching citizen dashboard data:", error);
    res.status(500).json({ message: "Server error while fetching dashboard data" });
  }
});

// @route   GET /api/citizen/complaints
// @desc    Get citizen's complaints with filtering
// @access  Private
router.get("/complaints", protect, async (req, res) => {
  try {
    const userEmail = req.user.email;
    const { status, search, page = 1, limit = 10 } = req.query;

    // Build filter object
    const filter = { "citizen.email": userEmail };
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { trackingNumber: { $regex: search, $options: "i" } },
        { "location.address": { $regex: search, $options: "i" } }
      ];
    }

    const complaints = await Complaint.find(filter)
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Complaint.countDocuments(filter);

    res.json({
      complaints,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error("Error fetching citizen complaints:", error);
    res.status(500).json({ message: "Server error while fetching complaints" });
  }
});

// @route   GET /api/citizen/complaints/:id
// @desc    Get a specific complaint by ID (citizen's own complaint)
// @access  Private
router.get("/complaints/:id", protect, async (req, res) => {
  try {
    const complaint = await Complaint.findOne({
      _id: req.params.id,
      "citizen.email": req.user.email
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

// @route   POST /api/citizen/complaints
// @desc    Create a new complaint (citizen)
// @access  Private
router.post("/complaints", protect, async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      department,
      location
    } = req.body;

    // Validate required fields
    if (!title || !description || !category || !department || !location) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const complaint = new Complaint({
      title,
      description,
      category,
      department,
      location,
      citizen: {
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone || "Not provided"
      }
    });

    await complaint.save();

    res.status(201).json({
      message: "Complaint submitted successfully",
      complaint: {
        id: complaint._id,
        trackingNumber: complaint.trackingNumber,
        title: complaint.title,
        status: complaint.status,
        createdAt: complaint.createdAt
      }
    });
  } catch (error) {
    console.error("Error creating complaint:", error);
    res.status(500).json({ message: "Server error while creating complaint" });
  }
});

// @route   PUT /api/citizen/profile
// @desc    Update citizen profile
// @access  Private
router.put("/profile", protect, async (req, res) => {
  try {
    const { name, phone } = req.body;
    const updateData = {};
    
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    res.json({
      message: "Profile updated successfully",
      user
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error while updating profile" });
  }
});

// @route   GET /api/citizen/profile
// @desc    Get citizen profile
// @access  Private
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json({ user });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error while fetching profile" });
  }
});

// @route   GET /api/citizen/stats
// @desc    Get citizen's complaint statistics
// @access  Private
router.get("/stats", protect, async (req, res) => {
  try {
    const userEmail = req.user.email;

    // Get statistics for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyStats = await Complaint.aggregate([
      {
        $match: {
          "citizen.email": userEmail,
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          total: { $sum: 1 },
          resolved: {
            $sum: { $cond: [{ $eq: ["$status", "resolved"] }, 1, 0] }
          }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);

    // Category-wise statistics
    const categoryStats = await Complaint.aggregate([
      {
        $match: {
          "citizen.email": userEmail,
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          resolved: {
            $sum: { $cond: [{ $eq: ["$status", "resolved"] }, 1, 0] }
          }
        }
      }
    ]);

    res.json({
      monthlyStats,
      categoryStats
    });
  } catch (error) {
    console.error("Error fetching citizen stats:", error);
    res.status(500).json({ message: "Server error while fetching statistics" });
  }
});

module.exports = router;
