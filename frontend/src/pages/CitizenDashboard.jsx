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
import { citizenAPI } from "../utils/api";

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

      setStats(data.stats);
      setRecentComplaints(data.recentComplaints);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "resolved":
        return "text-green-600 bg-green-100";
      case "in-progress":
        return "text-yellow-600 bg-yellow-100";
      case "pending":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "resolved":
        return <FaCheckCircle />;
      case "in-progress":
        return <FaClock />;
      case "pending":
        return <FaExclamationTriangle />;
      default:
        return <FaClock />;
    }
  };

  const formatStatus = (status) =>
    status.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase());

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Citizen Dashboard
        </h1>
        <p className="text-gray-600">
          Track your complaints and report new issues
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FaExclamationTriangle className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Complaints</p>
              <p className="text-2xl font-semibold">
                {stats.totalComplaints}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FaCheckCircle className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Resolved</p>
              <p className="text-2xl font-semibold">
                {stats.resolvedComplaints}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <FaClock className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-semibold">
                {stats.inProgressComplaints}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <FaExclamationTriangle className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-semibold">
                {stats.pendingComplaints}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/complaint"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <FaPlus className="mr-2" />
            Report New Issue
          </Link>

          <Link
            to="/citizen/complaints"
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 flex items-center"
          >
            <FaExclamationTriangle className="mr-2" />
            View All Complaints
          </Link>
        </div>
      </div>

      {/* Recent Complaints */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Recent Complaints</h2>
        </div>

        <div className="p-6">
          {recentComplaints.length > 0 ? (
            <div className="space-y-4">
              {recentComplaints.map((complaint) => (
                <div
                  key={complaint._id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-medium">{complaint.title}</h3>

                    <div className="flex items-center mt-1 text-sm text-gray-600">
                      <FaMapMarkerAlt className="mr-1" />
                      {complaint.location?.address || "No location"}
                    </div>

                    <div className="flex items-center mt-1 text-sm text-gray-600">
                      <FaCalendarAlt className="mr-1" />
                      {new Date(
                        complaint.createdAt
                      ).toLocaleDateString()}
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-sm flex items-center ${getStatusColor(
                      complaint.status
                    )}`}
                  >
                    <span className="mr-1">
                      {getStatusIcon(complaint.status)}
                    </span>
                    {formatStatus(complaint.status)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FaExclamationTriangle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium">
                No complaints yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by reporting your first issue.
              </p>

              <div className="mt-6">
                <Link
                  to="/complaint"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Report Issue
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}