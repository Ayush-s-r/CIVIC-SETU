const express = require("express");
const Complaint = require("../models/Complaint");
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// @route   POST /api/complaints
// @desc    Create a new complaint
// @access  Public (for now, can be changed to private)
router.post("/", async (req, res) => {
  try {
    const {
      fullName,
      email,
      mobile,
      address,
      category,
      description,
      mlDetection,
    } = req.body;

    if (!fullName || !email || !mobile || !address || !category || !description) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const complaint = new Complaint({
      fullName,
      email,
      mobile,
      address,
      category,
      description,
      mlDetection,
    });

    await complaint.save();

    res.status(201).json({
      message: "Complaint submitted successfully",
      complaint,
    });

  } catch (error) {
    console.error("Error creating complaint:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
});

// @route   GET /api/complaints
// @desc    Get all complaints (with filtering and pagination)
// @access  Private (Admin only)
router.get("/", protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Admin role required." });
    }

    const {
      page = 1,
      limit = 10,
      status,
      priority,
      department,
      search,
    } = req.query;

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (department) filter.department = department;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { "citizen.name": { $regex: search, $options: "i" } },
        { "location.address": { $regex: search, $options: "i" } },
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
      total,
    });
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ message: "Server error while fetching complaints" });
  }
});

// @route   GET /api/complaints/citizen/:userId
// @desc    Get complaints for a specific citizen
// @access  Private
router.get("/citizen/:userId", protect, async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, search } = req.query;

    // Check if user is accessing their own data or is admin
    if (req.user._id.toString() !== userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const filter = { "citizen.email": req.user.email };
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { trackingNumber: { $regex: search, $options: "i" } },
      ];
    }

    const complaints = await Complaint.find(filter)
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    res.json({ complaints });
  } catch (error) {
    console.error("Error fetching citizen complaints:", error);
    res.status(500).json({ message: "Server error while fetching complaints" });
  }
});

// @route   GET /api/complaints/:id
// @desc    Get a specific complaint by ID
// @access  Private
router.get("/:id", protect, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate(
      "assignedTo",
      "name email"
    );

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Check if user has access to this complaint
    const isOwner = complaint.citizen.email === req.user.email;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json({ complaint });
  } catch (error) {
    console.error("Error fetching complaint:", error);
    res.status(500).json({ message: "Server error while fetching complaint" });
  }
});

// @route   PUT /api/complaints/:id
// @desc    Update a complaint
// @access  Private (Admin only)
router.put("/:id", protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Admin role required." });
    }

    const { status, priority, assignedTo, resolutionNotes } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (assignedTo) updateData.assignedTo = assignedTo;
    if (resolutionNotes) updateData.resolutionNotes = resolutionNotes;

    // Set resolution date if status is resolved
    if (status === "resolved") {
      updateData.resolutionDate = new Date();
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate("assignedTo", "name email");

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json({
      message: "Complaint updated successfully",
      complaint,
    });
  } catch (error) {
    console.error("Error updating complaint:", error);
    res.status(500).json({ message: "Server error while updating complaint" });
  }
});

// @route   DELETE /api/complaints/:id
// @desc    Delete a complaint
// @access  Private (Admin only)
router.delete("/:id", protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Admin role required." });
    }

    const complaint = await Complaint.findByIdAndDelete(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json({ message: "Complaint deleted successfully" });
  } catch (error) {
    console.error("Error deleting complaint:", error);
    res.status(500).json({ message: "Server error while deleting complaint" });
  }
});

// @route   GET /api/complaints/stats/overview
// @desc    Get complaint statistics for dashboard
// @access  Private (Admin only)
router.get("/stats/overview", protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Admin role required." });
    }

    const totalComplaints = await Complaint.countDocuments();
    const resolvedComplaints = await Complaint.countDocuments({
      status: "resolved",
    });
    const pendingComplaints = await Complaint.countDocuments({
      status: "pending",
    });
    const inProgressComplaints = await Complaint.countDocuments({
      status: "in-progress",
    });

    // Department-wise statistics
    const departmentStats = await Complaint.aggregate([
      {
        $group: {
          _id: "$department",
          total: { $sum: 1 },
          resolved: {
            $sum: { $cond: [{ $eq: ["$status", "resolved"] }, 1, 0] },
          },
          pending: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ["$status", "in-progress"] }, 1, 0] },
          },
        },
      },
    ]);

    // Monthly trends (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyStats = await Complaint.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          total: { $sum: 1 },
          resolved: {
            $sum: { $cond: [{ $eq: ["$status", "resolved"] }, 1, 0] },
          },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    res.json({
      overview: {
        totalComplaints,
        resolvedComplaints,
        pendingComplaints,
        inProgressComplaints,
        resolutionRate:
          totalComplaints > 0
            ? Math.round((resolvedComplaints / totalComplaints) * 100)
            : 0,
      },
      departmentStats,
      monthlyStats,
    });
  } catch (error) {
    console.error("Error fetching complaint stats:", error);
    res.status(500).json({ message: "Server error while fetching statistics" });
  }
});

module.exports = router;
