import { useState, useEffect } from "react";
import { 
  FaExclamationTriangle, 
  FaCheckCircle, 
  FaClock, 
  FaUsers,
  FaBuilding,
  FaMapMarkerAlt
} from "react-icons/fa";
import { adminAPI } from "../api"; // ✅ FIXED IMPORT

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalComplaints: 0,
    resolvedComplaints: 0,
    pendingComplaints: 0,
    inProgressComplaints: 0,
    totalUsers: 0,
    departments: 0
  });

  const [recentComplaints, setRecentComplaints] = useState([]);
  const [departmentStats, setDepartmentStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const data = await adminAPI.getDashboard();

      setStats(data.stats || {});
      setRecentComplaints(data.recentComplaints || []);
      setDepartmentStats(data.departmentStats || []);

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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "text-red-600 bg-red-100";
      case "medium": return "text-yellow-600 bg-yellow-100";
      case "low": return "text-green-600 bg-green-100";
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

  // ✅ Loading State
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

  // ✅ Error State
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
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">
          Monitor and manage civic complaints
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        
        <StatCard icon={<FaExclamationTriangle />} title="Total" value={stats.totalComplaints} color="blue" />
        <StatCard icon={<FaCheckCircle />} title="Resolved" value={stats.resolvedComplaints} color="green" />
        <StatCard icon={<FaClock />} title="In Progress" value={stats.inProgressComplaints} color="yellow" />
        <StatCard icon={<FaExclamationTriangle />} title="Pending" value={stats.pendingComplaints} color="red" />
        <StatCard icon={<FaUsers />} title="Users" value={stats.totalUsers} color="purple" />
        <StatCard icon={<FaBuilding />} title="Departments" value={stats.departments} color="indigo" />

      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Recent Complaints */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Complaints</h2>

          <div className="space-y-4">
            {recentComplaints.map((c) => (
              <div key={c.id} className="border p-4 rounded-lg">
                <h3 className="font-medium">{c.title}</h3>
                <p className="text-sm text-gray-600">by {c.citizen}</p>

                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <FaMapMarkerAlt className="mr-1" />
                  {c.location}
                </div>

                <div className="text-sm text-gray-600">
                  {c.department} • {c.date}
                </div>

                <div className="flex justify-between mt-2">
                  <span className={`px-2 py-1 rounded ${getStatusColor(c.status)}`}>
                    {c.status}
                  </span>
                  <span className={`px-2 py-1 rounded ${getPriorityColor(c.priority)}`}>
                    {c.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department Stats */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Department Performance</h2>

          <div className="space-y-4">
            {departmentStats.map((dept, i) => (
              <div key={i} className="border p-4 rounded-lg">
                <div className="flex justify-between">
                  <h3>{dept.name}</h3>
                  <span>{dept.total} total</span>
                </div>

                <div className="grid grid-cols-3 text-center mt-2 text-sm">
                  <div>
                    <div className="text-green-600">{dept.resolved}</div>
                    Resolved
                  </div>
                  <div>
                    <div className="text-yellow-600">{dept.inProgress}</div>
                    In Progress
                  </div>
                  <div>
                    <div className="text-red-600">{dept.pending}</div>
                    Pending
                  </div>
                </div>

                <div className="mt-3">
                  <div className="w-full bg-gray-200 h-2 rounded">
                    <div
                      className="bg-green-600 h-2 rounded"
                      style={{
                        width: `${(dept.resolved / dept.total) * 100 || 0}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// 🔥 Reusable Stat Card Component
function StatCard({ icon, title, value, color }) {
  const colors = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    red: "bg-red-100 text-red-600",
    purple: "bg-purple-100 text-purple-600",
    indigo: "bg-indigo-100 text-indigo-600"
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