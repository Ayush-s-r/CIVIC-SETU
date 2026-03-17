import { Link, useLocation } from "react-router-dom";
import { 
  FaHome, 
  FaTachometerAlt, 
  FaExclamationTriangle, 
  FaChartBar, 
  FaUsers, 
  FaCog,
  FaSignOutAlt,
  FaUser,
  FaFileAlt,
  FaMapMarkerAlt
} from "react-icons/fa";

export default function Sidebar() {
  const location = useLocation();
  
  const adminMenuItems = [
    { path: "/admin", icon: <FaTachometerAlt />, label: "Dashboard" },
    { path: "/admin/complaints", icon: <FaExclamationTriangle />, label: "Complaints" },
    { path: "/admin/analytics", icon: <FaChartBar />, label: "Analytics" },
    { path: "/admin/users", icon: <FaUsers />, label: "Users" },
    { path: "/admin/departments", icon: <FaCog />, label: "Departments" },
  ];

  const citizenMenuItems = [
    { path: "/citizen", icon: <FaTachometerAlt />, label: "Dashboard" },
    { path: "/citizen/complaints", icon: <FaFileAlt />, label: "My Complaints" },
    { path: "/citizen/report", icon: <FaExclamationTriangle />, label: "Report Issue" },
    { path: "/citizen/profile", icon: <FaUser />, label: "Profile" },
  ];

  // Determine if user is admin or citizen based on current path
  const isAdmin = location.pathname.startsWith('/admin');
  const menuItems = isAdmin ? adminMenuItems : citizenMenuItems;

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen">
      <div className="p-6">
        <h2 className="text-xl font-bold text-white">
          {isAdmin ? "Admin Panel" : "Citizen Portal"}
        </h2>
      </div>
      
      <nav className="mt-6">
        <ul className="space-y-2 px-3">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="absolute bottom-0 w-64 p-4 border-t border-gray-700">
        <Link
          to="/"
          className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
        >
          <FaSignOutAlt className="mr-3" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
