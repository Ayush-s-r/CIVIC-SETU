const express = require("express");
const Complaint = require("../models/Complaint");
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Middleware to check admin role
const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin role required." });
  }
  next();
};

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private (Admin only)
router.get("/dashboard", protect, requireAdmin, async (req, res) => {
  try {
    // Get basic statistics
    const totalComplaints = await Complaint.countDocuments();
    const resolvedComplaints = await Complaint.countDocuments({ status: "resolved" });
    const pendingComplaints = await Complaint.countDocuments({ status: "pending" });
    const inProgressComplaints = await Complaint.countDocuments({ status: "in-progress" });
    const totalUsers = await User.countDocuments();
    const activeDepartments = 6; // Fixed number based on enum values

    // Department-wise statistics
    const departmentStats = await Complaint.aggregate([
      {
        $group: {
          _id: "$department",
          total: { $sum: 1 },
          resolved: {
            $sum: { $cond: [{ $eq: ["$status", "resolved"] }, 1, 0] }
          },
          pending: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] }
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ["$status", "in-progress"] }, 1, 0] }
          }
        }
      },
      {
        $addFields: {
          resolutionRate: {
            $multiply: [
              { $divide: ["$resolved", "$total"] },
              100
            ]
          }
        }
      }
    ]);

    // Recent complaints
    const recentComplaints = await Complaint.find()
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    // Priority distribution
    const priorityStats = await Complaint.aggregate([
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      stats: {
        totalComplaints,
        resolvedComplaints,
        pendingComplaints,
        inProgressComplaints,
        totalUsers,
        activeDepartments,
        resolutionRate: totalComplaints > 0 ? Math.round((resolvedComplaints / totalComplaints) * 100) : 0
      },
      departmentStats,
      recentComplaints,
      priorityStats
    });
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);
    res.status(500).json({ message: "Server error while fetching dashboard data" });
  }
});

// @route   GET /api/admin/analytics
// @desc    Get detailed analytics data
// @access  Private (Admin only)
router.get("/analytics", protect, requireAdmin, async (req, res) => {
  try {
    const { period = "6months" } = req.query;
    
    let startDate = new Date();
    switch (period) {
      case "1month":
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case "3months":
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case "6months":
        startDate.setMonth(startDate.getMonth() - 6);
        break;
      case "1year":
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(startDate.getMonth() - 6);
    }

    // Monthly trends
    const monthlyTrends = await Complaint.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
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
          },
          pending: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] }
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ["$status", "in-progress"] }, 1, 0] }
          }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);

    // Department performance
    const departmentPerformance = await Complaint.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: "$department",
          total: { $sum: 1 },
          resolved: {
            $sum: { $cond: [{ $eq: ["$status", "resolved"] }, 1, 0] }
          },
          avgResolutionTime: {
            $avg: {
              $cond: [
                { $eq: ["$status", "resolved"] },
                {
                  $divide: [
                    { $subtract: ["$resolutionDate", "$createdAt"] },
                    1000 * 60 * 60 * 24 // Convert to days
                  ]
                },
                null
              ]
            }
          }
        }
      },
      {
        $addFields: {
          resolutionRate: {
            $multiply: [
              { $divide: ["$resolved", "$total"] },
              100
            ]
          }
        }
      }
    ]);

    // Priority distribution
    const priorityDistribution = await Complaint.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 }
        }
      }
    ]);

    // Status distribution
    const statusDistribution = await Complaint.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      monthlyTrends,
      departmentPerformance,
      priorityDistribution,
      statusDistribution,
      period
    });
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    res.status(500).json({ message: "Server error while fetching analytics" });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users with pagination
// @access  Private (Admin only)
router.get("/users", protect, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;

    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(filter);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error while fetching users" });
  }
});

// @route   PUT /api/admin/users/:id
// @desc    Update user role or status
// @access  Private (Admin only)
router.put("/users/:id", protect, requireAdmin, async (req, res) => {
  try {
    const { role } = req.body;

    if (!role || !["citizen", "worker", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role provided" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User updated successfully",
      user
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error while updating user" });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user
// @access  Private (Admin only)
router.delete("/users/:id", protect, requireAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error while deleting user" });
  }
});

// @route   GET /api/admin/departments
// @desc    Get department statistics
// @access  Private (Admin only)
router.get("/departments", protect, requireAdmin, async (req, res) => {
  try {
    const departments = [
      { id: "pwd", name: "Public Works Department" },
      { id: "electricity", name: "Electricity Board" },
      { id: "water", name: "Water Authority" },
      { id: "sanitation", name: "Sanitation Department" },
      { id: "traffic", name: "Traffic Police" },
      { id: "parks", name: "Parks & Gardens" }
    ];

    const departmentStats = await Promise.all(
      departments.map(async (dept) => {
        const stats = await Complaint.aggregate([
          { $match: { department: dept.id } },
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 }
            }
          }
        ]);

        const total = stats.reduce((sum, stat) => sum + stat.count, 0);
        const resolved = stats.find(s => s._id === "resolved")?.count || 0;

        return {
          ...dept,
          total,
          resolved,
          pending: stats.find(s => s._id === "pending")?.count || 0,
          inProgress: stats.find(s => s._id === "in-progress")?.count || 0,
          resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0
        };
      })
    );

    res.json({ departments: departmentStats });
  } catch (error) {
    console.error("Error fetching department data:", error);
    res.status(500).json({ message: "Server error while fetching department data" });
  }
});

module.exports = router;
