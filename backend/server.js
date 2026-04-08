const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db.js");
const dotenv = require("dotenv");
const morgan = require("morgan");
// Import routes
const userRoutes = require("./routes/userRoutes.js");
const complaintRoutes = require("./routes/complaintRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");
const citizenRoutes = require("./routes/citizenRoutes.js");
// const analyticsRoutes = require("./routes/analyticsRoutes.js");
const searchRoutes = require("./routes/searchRoutes.js");
const reportRoutes = require("./routes/reportRoutes.js");
const detectionRoutes = require("./routes/detectionRoutes.js");

const app = express();
app.use(morgan('dev'))

// Middleware
app.use(express.json());
app.use(cors());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 8080;

// Connect to database
connectDB();

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Civic Setu API Server",
    version: "1.0.0",
    status: "running",
    endpoints: {
      users: "/api/users",
      complaints: "/api/complaints",
      admin: "/api/admin",
      citizen: "/api/citizen",
      analytics: "/api/analytics",
      search: "/api/search",
      reports: "/api/reports",
      detection: "/api/detection"
    }
  });
});

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/citizen", citizenRoutes);
// app.use("/api/analytics", analyticsRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/detection", detectionRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log("🚀 Server is listening on port:", PORT);
  console.log(`🌐 Server is running on http://localhost:${PORT}`);
  console.log("📚 API Documentation available at http://localhost:8080");
});