import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  // ✅ Load user from localStorage
  const loadUser = () => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  };

  useEffect(() => {
    loadUser();

    // listen for login/logout
    window.addEventListener("authChange", loadUser);

    return () => {
      window.removeEventListener("authChange", loadUser);
    };
  }, []);

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.dispatchEvent(new Event("authChange"));

    navigate("/");
  };

  return (
    <>
      {/* Top Strip */}
      <div className="bg-blue-900 text-gray-100 py-2 text-sm">
        <div className="max-w-7xl mx-auto px-4 flex justify-between">
          <span>Official Government Portal</span>
          <span>Secure & Verified</span>
        </div>
      </div>

      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between py-3">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <i className="fas fa-landmark text-blue-700 text-3xl"></i>
            <div>
              <h1 className="font-bold text-lg">CivicSetu</h1>
              <p className="text-xs text-gray-500">Government Portal</p>
            </div>
          </div>

          {/* Menu */}
          <ul
            className={`flex flex-col md:flex-row md:items-center absolute md:static bg-white left-0 w-full md:w-auto top-[70px] ${
              menuOpen
                ? "opacity-100 visible"
                : "opacity-0 invisible md:visible md:opacity-100"
            }`}
          >
            <li>
              <Link to="/" className="px-6 py-3 block">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="px-6 py-3 block">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="px-6 py-3 block">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/complaint" className="px-6 py-3 block">
                Report Issue
              </Link>
            </li>

            {/* ✅ AUTH UI */}
            <li className="px-6 py-3">
              {user ? (
                <div className="flex items-center gap-3">
                  {/* <span className="text-gray-700 text-sm">
                    👤 {user.name}
                  </span> */}

                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded"
                >
                  Login
                </Link>
              )}
            </li>
          </ul>

          {/* Hamburger */}
          <div
            className="md:hidden cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;