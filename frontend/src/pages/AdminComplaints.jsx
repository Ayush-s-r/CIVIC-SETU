import { useState, useEffect } from "react";
import { 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaEdit, 
  FaCheck, 
  FaTimes,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUser
} from "react-icons/fa";

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  useEffect(() => {
    // Mock data - replace with actual API calls
    const mockComplaints = [
      {
        id: 1,
        title: "Pothole on Main Street",
        description: "Large pothole causing traffic issues and vehicle damage",
        status: "pending",
        priority: "high",
        department: "PWD",
        date: "2024-01-15",
        location: "Main Street, Sector 5",
        citizen: "John Doe",
        citizenEmail: "john@example.com",
        citizenPhone: "+91 98765 43210"
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
        citizen: "Jane Smith",
        citizenEmail: "jane@example.com",
        citizenPhone: "+91 98765 43211"
      },
      {
        id: 3,
        title: "Water Leakage",
        description: "Water pipe burst causing flooding in the area",
        status: "resolved",
        priority: "high",
        department: "Water Authority",
        date: "2024-01-13",
        location: "Garden Road, Sector 7",
        citizen: "Mike Johnson",
        citizenEmail: "mike@example.com",
        citizenPhone: "+91 98765 43212"
      },
      {
        id: 4,
        title: "Garbage Collection Issue",
        description: "Garbage not being collected regularly",
        status: "pending",
        priority: "medium",
        department: "Sanitation",
        date: "2024-01-12",
        location: "Residential Area, Sector 2",
        citizen: "Sarah Wilson",
        citizenEmail: "sarah@example.com",
        citizenPhone: "+91 98765 43213"
      }
    ];

    setComplaints(mockComplaints);
    setFilteredComplaints(mockComplaints);
  }, []);

  useEffect(() => {
    let filtered = complaints;

    if (searchTerm) {
      filtered = filtered.filter(complaint =>
        complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.citizen.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(complaint => complaint.status === statusFilter);
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter(complaint => complaint.priority === priorityFilter);
    }

    if (departmentFilter !== "all") {
      filtered = filtered.filter(complaint => complaint.department === departmentFilter);
    }

    setFilteredComplaints(filtered);
  }, [complaints, searchTerm, statusFilter, priorityFilter, departmentFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-yellow-600 bg-yellow-100';
      case 'pending': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const updateComplaintStatus = (id, newStatus) => {
    setComplaints(prev => 
      prev.map(complaint => 
        complaint.id === id ? { ...complaint, status: newStatus } : complaint
      )
    );
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Complaints Management</h1>
        <p className="text-gray-600">Manage and track all citizen complaints</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search complaints..."
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

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Departments</option>
            <option value="PWD">PWD</option>
            <option value="Electricity Board">Electricity Board</option>
            <option value="Water Authority">Water Authority</option>
            <option value="Sanitation">Sanitation</option>
          </select>

          <button className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <FaFilter className="mr-2" />
            Apply Filters
          </button>
        </div>
      </div>

      {/* Complaints List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Complaints ({filteredComplaints.length})
          </h2>
        </div>
        <div className="p-6">
          {filteredComplaints.length > 0 ? (
            <div className="space-y-4">
              {filteredComplaints.map((complaint) => (
                <div key={complaint.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{complaint.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(complaint.status)}`}>
                          {complaint.status.replace('-', ' ').toUpperCase()}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(complaint.priority)}`}>
                          {complaint.priority.toUpperCase()}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{complaint.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <FaUser className="mr-2" />
                          <span>{complaint.citizen} ({complaint.citizenEmail})</span>
                        </div>
                        <div className="flex items-center">
                          <FaMapMarkerAlt className="mr-2" />
                          <span>{complaint.location}</span>
                        </div>
                        <div className="flex items-center">
                          <FaCalendarAlt className="mr-2" />
                          <span>{complaint.date}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium">Department: {complaint.department}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-4">
                      <button className="flex items-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <FaEye className="mr-2" />
                        View Details
                      </button>
                      
                      {complaint.status === 'pending' && (
                        <button 
                          onClick={() => updateComplaintStatus(complaint.id, 'in-progress')}
                          className="flex items-center px-3 py-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                        >
                          <FaEdit className="mr-2" />
                          Start Work
                        </button>
                      )}
                      
                      {complaint.status === 'in-progress' && (
                        <button 
                          onClick={() => updateComplaintStatus(complaint.id, 'resolved')}
                          className="flex items-center px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <FaCheck className="mr-2" />
                          Mark Resolved
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FaSearch className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No complaints found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
