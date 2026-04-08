import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Common/Sidebar";
import { removeAuthToken } from "../utils/token"; // ✅ use your token utils

export default function AdminLayout({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // ✅ Clear auth data
    removeAuthToken();
    localStorage.removeItem("user");

    // ✅ Redirect to login
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-grow">

        {/* Top Navbar */}
        <div className="flex justify-end items-center bg-white px-6 py-4 shadow">
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        {/* Page Content */}
        <main className="p-6 flex-grow">
          {children}
        </main>

      </div>
    </div>
  );
}