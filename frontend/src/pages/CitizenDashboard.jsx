import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaPlus,
  FaMapMarkerAlt,
  FaCalendarAlt
} from "react-icons/fa";
import { citizenAPI } from "../api"; // ✅ FIXED IMPORT

export default function CitizenDashboard() {
  const [stats, setStats] = useState({
    totalComplaints: 0,
    resolvedComplaints: 0,
    pendingComplaints: 0,
    inProgressComplaints: 0
  });

  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const data = await citizenAPI.getDashboard();

      setStats(data.stats || {});
      setRecentComplaints(data.recentComplaints || []);

    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "resolved": return "text-green-600 bg-green-100";
      case "in-progress": return "text-yellow-600 bg-yellow-100";
      case "pending": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "resolved": return <FaCheckCircle />;
      case "in-progress": return <FaClock />;
      case "pending": return <FaExclamationTriangle />;
      default: return <FaClock />;
    }
  };

  const formatStatus = (status) =>
    status.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase());

  // ✅ Loading
  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // ✅ Error
  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Citizen Dashboard
        </h1>
        <p className="text-gray-600">
          Track your complaints and report new issues
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={<FaExclamationTriangle />} title="Total" value={stats.totalComplaints} color="blue" />
        <StatCard icon={<FaCheckCircle />} title="Resolved" value={stats.resolvedComplaints} color="green" />
        <StatCard icon={<FaClock />} title="In Progress" value={stats.inProgressComplaints} color="yellow" />
        <StatCard icon={<FaExclamationTriangle />} title="Pending" value={stats.pendingComplaints} color="red" />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>

        <div className="flex flex-wrap gap-4">
          <Link to="/complaint" className="btn-primary flex items-center">
            <FaPlus className="mr-2" />
            Report Issue
          </Link>

          <Link to="/citizen/complaints" className="btn-secondary flex items-center">
            <FaExclamationTriangle className="mr-2" />
            View Complaints
          </Link>
        </div>
      </div>

      {/* Recent Complaints */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Complaints</h2>

        {recentComplaints.length > 0 ? (
          <div className="space-y-4">
            {recentComplaints.map((c) => (
              <div key={c._id} className="border p-4 rounded-lg flex justify-between">
                
                <div>
                  <h3 className="font-medium">{c.title}</h3>

                  <div className="text-sm text-gray-600 flex items-center mt-1">
                    <FaMapMarkerAlt className="mr-1" />
                    {c.location?.address || "No location"}
                  </div>

                  <div className="text-sm text-gray-600 flex items-center mt-1">
                    <FaCalendarAlt className="mr-1" />
                    {new Date(c.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <span className={`px-3 py-1 rounded-full flex items-center text-sm ${getStatusColor(c.status)}`}>
                  <span className="mr-1">{getStatusIcon(c.status)}</span>
                  {formatStatus(c.status)}
                </span>

              </div>
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>

    </div>
  );
}

// 🔥 Reusable Components

function StatCard({ icon, title, value, color }) {
  const colors = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    red: "bg-red-100 text-red-600"
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
      <div className={`p-3 rounded-full ${colors[color]}`}>
        {icon}
      </div>
      <div className="ml-4">
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-xl font-semibold">{value}</p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-8">
      <FaExclamationTriangle className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium">No complaints yet</h3>
      <p className="mt-1 text-sm text-gray-500">
        Start by reporting your first issue.
      </p>

      <Link
        to="/complaint"
        className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Report Issue
      </Link>
    </div>
  );
}