import React from "react";
import { Link } from "react-router-dom";
import Hero from "../layouts/Hero"
import {
  FaRoad,
  FaLightbulb,
  FaTint,
  FaTrash,
  FaUsers,
  FaCheckCircle,
  FaClock,
  FaMapMarkerAlt,
  FaBolt,
  FaUser,
  FaUserShield,
  FaSignInAlt,
  FaLock,
} from "react-icons/fa";

const HomeSections = () => {
  return (
    <div className="bg-white text-gray-800">
      <Hero/>
      {/* Quick Services */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold mb-10">Quick Services</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                icon: <FaRoad />,
                title: "Road & Infrastructure",
                desc: "Report potholes, road damage, and infrastructure issues",
              },
              {
                icon: <FaLightbulb />,
                title: "Street Lighting",
                desc: "Report faulty street lights and lighting issues",
              },
              {
                icon: <FaTint />,
                title: "Water Supply",
                desc: "Report water leakage, supply issues, and quality concerns",
              },
              {
                icon: <FaTrash />,
                title: "Sanitation",
                desc: "Report garbage collection, drainage, and sanitation issues",
              },
            ].map((a, i) => (
              <div
                key={i}
                className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center hover:shadow-lg transition"
              >
                <div className="text-blue-600 text-4xl mb-4">{a.icon}</div>
                <h3 className="text-lg font-semibold">{a.title}</h3>
                <p className="text-gray-600 text-sm mt-2">{a.desc}</p>
                <Link
                  to="/complaint"
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition inline-block"
                >
                  Report Issue
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold mb-10">How It Works</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Register & Verify",
                desc: "Create your account with government-verified identification for secure access",
              },
              {
                step: "02",
                title: "Report Issue",
                desc: "Submit detailed information with photos and location tagging",
              },
              {
                step: "03",
                title: "Track Progress",
                desc: "Monitor real-time status updates and department actions",
              },
              {
                step: "04",
                title: "Get Resolved",
                desc: "Receive official confirmation when your issue is resolved",
              },
            ].map((s, i) => (
              <div
                key={i}
                className="bg-gray-50 border rounded-xl p-6 hover:shadow-md transition"
              >
                <div className="text-blue-600 text-2xl font-bold">{s.step}</div>
                <h3 className="text-lg font-semibold mt-2">{s.title}</h3>
                <p className="text-gray-600 text-sm mt-2">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold mb-10">Platform Performance</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                icon: <FaUsers />,
                number: "2.5M+",
                label: "Citizens Served",
              },
              {
                icon: <FaCheckCircle />,
                number: "98.2%",
                label: "Resolution Rate",
              },
              {
                icon: <FaClock />,
                number: "24h",
                label: "Average Response",
              },
              {
                icon: <FaMapMarkerAlt />,
                number: "500+",
                label: "Cities & Municipalities",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center hover:shadow-lg transition"
              >
                <div className="text-blue-600 text-4xl mb-3">{stat.icon}</div>
                <div className="text-2xl font-bold">{stat.number}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Government Departments */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold mb-10">
            Participating Departments
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                icon: <FaRoad />,
                title: "Public Works Department",
                desc: "Road infrastructure maintenance and development",
              },
              {
                icon: <FaBolt />,
                title: "Electricity Board",
                desc: "Street lighting and electrical infrastructure",
              },
              {
                icon: <FaTint />,
                title: "Water Authority",
                desc: "Water supply and distribution systems",
              },
              {
                icon: <FaTrash />,
                title: "Sanitation Department",
                desc: "Waste management and cleanliness",
              },
            ].map((dept, i) => (
              <div
                key={i}
                className="bg-white shadow-md rounded-xl p-6 flex flex-col items-center hover:shadow-lg transition"
              >
                <div className="text-blue-600 text-4xl mb-4">{dept.icon}</div>
                <h3 className="text-lg font-semibold">{dept.title}</h3>
                <p className="text-gray-600 text-sm mt-2">{dept.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Login Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold mb-4">
            Access Government Services
          </h2>
          <p className="text-gray-600 mb-10">
            Secure login portal for citizens and government officials
          </p>

          <div className="grid sm:grid-cols-2 gap-8">
            {/* Citizen Login */}
            <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition flex flex-col items-center">
              <div className="text-blue-600 text-4xl mb-3">
                <FaUser />
              </div>
              <h3 className="text-xl font-semibold mb-2">Citizen Login</h3>
              <p className="text-gray-600 text-sm mb-4">
                Access your citizen dashboard to report and track issues
              </p>
              <Link
                to="/login"
                className="bg-blue-600 text-white px-5 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
              >
                <FaSignInAlt />
                Citizen Login
              </Link>
            </div>

            {/* Official Login */}
            <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition flex flex-col items-center">
              <div className="text-blue-600 text-4xl mb-3">
                <FaUserShield />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Government Official
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Secure access for authorized government personnel
              </p>
              <Link
                to="/login"
                className="bg-blue-600 text-white px-5 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
              >
                <FaLock />
                Official Login
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeSections;
