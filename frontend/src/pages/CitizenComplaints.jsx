import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaFilter,
  FaPlus,
  FaEye,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

export default function CitizenComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockComplaints = [
      {
        id: 1,
        title: "Pothole on Main Street",
        description: "Large pothole causing traffic issues and vehicle damage",
        status: "resolved",
        priority: "high",
        department: "PWD",
        date: "2024-01-15",
        location: "Main Street, Sector 5",
        trackingNumber: "CIV-2024-001",
        resolutionDate: "2024-01-18",
        resolutionNotes: "Pothole filled and road resurfaced",
      },
      {
        id: 2,
        title: "Broken Street Light",
        description: "Street light not working for past 3 days",
        status: "in-progress",
        priority: "medium",
        department: "Electricity Board",
        date: "2024-01-14",
        location: "Park Avenue, Sector 3",
        trackingNumber: "CIV-2024-002",
        assignedTo: "Electricity Department Team",
      },
      {
        id: 3,
        title: "Water Leakage",
        description: "Water pipe burst causing flooding in the area",
        status: "pending",
        priority: "high",
        department: "Water Authority",
        date: "2024-01-13",
        location: "Garden Road, Sector 7",
        trackingNumber: "CIV-2024-003",
      },
      {
        id: 4,
        title: "Garbage Collection Issue",
        description: "Garbage not being collected regularly",
        status: "resolved",
        priority: "medium",
        department: "Sanitation",
        date: "2024-01-12",
        location: "Residential Area, Sector 2",
        trackingNumber: "CIV-2024-004",
        resolutionDate: "2024-01-16",
        resolutionNotes:
          "Garbage collection schedule updated and regular collection resumed",
      },
    ];

    setComplaints(mockComplaints);
    setFilteredComplaints(mockComplaints);
  }, []);

  useEffect(() => {
    let filtered = complaints;

    if (searchTerm) {
      filtered = filtered.filter(
        (complaint) =>
          complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          complaint.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          complaint.trackingNumber
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          complaint.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (complaint) => complaint.status === statusFilter
      );
    }

    setFilteredComplaints(filtered);
  }, [complaints, searchTerm, statusFilter]);

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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
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

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Complaints
            </h1>
            <p className="text-gray-600">
              Track and manage your submitted complaints
            </p>
          </div>
          <Link
            to="/complaint"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <FaPlus className="mr-2" />
            Report New Issue
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search your complaints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>

          <button className="flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
            <FaFilter className="mr-2" />
            Apply Filters
          </button>
        </div>
      </div>

      {/* Complaints List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Your Complaints ({filteredComplaints.length})
          </h2>
        </div>
        <div className="p-6">
          {filteredComplaints.length > 0 ? (
            <div className="space-y-6">
              {filteredComplaints.map((complaint) => (
                <div
                  key={complaint.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {complaint.title}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${getStatusColor(
                            complaint.status
                          )}`}
                        >
                          <span className="mr-1">
                            {getStatusIcon(complaint.status)}
                          </span>
                          {complaint.status.replace("-", " ").toUpperCase()}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(
                            complaint.priority
                          )}`}
                        >
                          {complaint.priority.toUpperCase()}
                        </span>
                      </div>

                      <p className="text-gray-600 mb-4">
                        {complaint.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <FaMapMarkerAlt className="mr-2" />
                          <span>{complaint.location}</span>
                        </div>
                        <div className="flex items-center">
                          <FaCalendarAlt className="mr-2" />
                          <span>Submitted: {complaint.date}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium">
                            Department: {complaint.department}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium">
                            Tracking #: {complaint.trackingNumber}
                          </span>
                        </div>
                      </div>

                      {complaint.status === "in-progress" &&
                        complaint.assignedTo && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                            <p className="text-sm text-blue-800">
                              <strong>Assigned to:</strong>{" "}
                              {complaint.assignedTo}
                            </p>
                          </div>
                        )}

                      {complaint.status === "resolved" &&
                        complaint.resolutionDate && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <p className="text-sm text-green-800 mb-2">
                              <strong>Resolved on:</strong>{" "}
                              {complaint.resolutionDate}
                            </p>
                            {complaint.resolutionNotes && (
                              <p className="text-sm text-green-800">
                                <strong>Resolution Notes:</strong>{" "}
                                {complaint.resolutionNotes}
                              </p>
                            )}
                          </div>
                        )}
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      <button className="flex items-center px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <FaEye className="mr-2" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FaExclamationTriangle className="mx-auto h-16 w-16 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No complaints found
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "You haven't submitted any complaints yet."}
              </p>
              {!searchTerm && statusFilter === "all" && (
                <div className="mt-6">
                  <Link
                    to="/complaint"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
                  >
                    <FaPlus className="mr-2" />
                    Report Your First Issue
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
