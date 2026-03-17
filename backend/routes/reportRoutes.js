const express = require("express");
const Complaint = require("../models/Complaint");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// @route   GET /api/reports/summary
// @desc    Get summary report of all complaints
// @access  Private (Admin only)
router.get("/summary", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const total = await Complaint.countDocuments();
    const statusBreakdown = await Complaint.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          percentage: {
            $divide: [
              { $sum: 1 },
              {
                $cond: [{ $eq: [total, 0] }, 1, total],
              },
            ],
          },
        },
      },
    ]);

    const categoryBreakdown = await Complaint.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json({
      summary: {
        totalComplaints: total,
        statusBreakdown,
        categoryBreakdown,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error generating summary report:", error);
    res.status(500).json({ message: "Server error while generating report" });
  }
});

// @route   GET /api/reports/detailed
// @desc    Get detailed report with all complaint details
// @access  Private (Admin only)
router.get("/detailed", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { format = "json", startDate, endDate } = req.query;

    const filter = {};
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

    const complaints = await Complaint.find(filter)
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    const report = {
      reportType: "Detailed Complaints Report",
      generatedAt: new Date().toISOString(),
      totalRecords: complaints.length,
      dateRange: {
        start: startDate || "N/A",
        end: endDate || "N/A",
      },
      complaints: complaints.map((complaint) => ({
        trackingNumber: complaint.trackingNumber,
        title: complaint.title,
        description: complaint.description,
        category: complaint.category,
        department: complaint.department,
        status: complaint.status,
        priority: complaint.priority,
        location: complaint.location,
        citizen: complaint.citizen,
        assignedTo: complaint.assignedTo,
        createdAt: complaint.createdAt,
        resolutionDate: complaint.resolutionDate,
        resolutionNotes: complaint.resolutionNotes,
      })),
    };

    if (format === "csv") {
      // Convert to CSV format
      const headers = [
        "Tracking Number",
        "Title",
        "Category",
        "Department",
        "Status",
        "Priority",
        "Citizen Name",
        "Citizen Email",
        "Created Date",
        "Resolution Date",
      ];

      const rows = complaints.map((c) => [
        c.trackingNumber,
        c.title,
        c.category,
        c.department,
        c.status,
        c.priority,
        c.citizen.name,
        c.citizen.email,
        new Date(c.createdAt).toLocaleDateString(),
        c.resolutionDate
          ? new Date(c.resolutionDate).toLocaleDateString()
          : "N/A",
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map((row) =>
          row
            .map((cell) =>
              typeof cell === "string" && cell.includes(",")
                ? `"${cell}"`
                : cell
            )
            .join(",")
        ),
      ].join("\n");

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="complaints-report-${Date.now()}.csv"`
      );
      res.send(csvContent);
    } else {
      res.json(report);
    }
  } catch (error) {
    console.error("Error generating detailed report:", error);
    res.status(500).json({ message: "Server error while generating report" });
  }
});

// @route   GET /api/reports/citizen/:email
// @desc    Get report for a specific citizen
// @access  Private
router.get("/citizen/:email", protect, async (req, res) => {
  try {
    const { email } = req.params;

    // Check if user has permission
    if (req.user.role !== "admin" && req.user.email !== email) {
      return res.status(403).json({ message: "Access denied" });
    }

    const complaints = await Complaint.find({ "citizen.email": email }).sort({
      createdAt: -1,
    });

    const stats = {
      total: complaints.length,
      resolved: complaints.filter((c) => c.status === "resolved").length,
      pending: complaints.filter((c) => c.status === "pending").length,
      inProgress: complaints.filter((c) => c.status === "in-progress").length,
      rejected: complaints.filter((c) => c.status === "rejected").length,
    };

    res.json({
      email,
      stats,
      complaints,
    });
  } catch (error) {
    console.error("Error fetching citizen report:", error);
    res.status(500).json({ message: "Server error while generating report" });
  }
});

module.exports = router;
