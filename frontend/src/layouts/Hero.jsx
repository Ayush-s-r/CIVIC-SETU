import React from "react";
import { FaShieldAlt, FaCheckCircle, FaClock, FaMapMarkerAlt, FaPlusCircle, FaSearch, FaLandmark, FaRoad, FaLightbulb } from "react-icons/fa";

const Hero = () => {
  return (
    <section className="w-full bg-gradient-to-b from-blue-50 to-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
        {/* Left Content */}
        <div className="space-y-6">
          {/* Badge */}
          <div className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full w-fit">
            <FaShieldAlt className="text-blue-600" />
            <span className="font-medium">Official Government Service</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            <span className="block text-blue-700">Digital Civic Issue</span>
            <span className="block">Resolution Platform</span>
          </h1>

          <p className="text-gray-600 text-lg leading-relaxed">
            A secure, transparent, and efficient platform for citizens to report civic issues and track their resolution in real-time.
          </p>

          {/* Features */}
          <div className="flex flex-wrap gap-4 text-gray-700">
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-green-500" />
              <span>100% Secure & Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <FaClock className="text-yellow-500" />
              <span>24–48 Hour Resolution</span>
            </div>
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-red-500" />
              <span>Pan-India Coverage</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 pt-4">
            <button
              id="reportNowBtn"
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              <FaPlusCircle />
              <a href="/complaint"> Report New Issue</a>
            </button>

            <button
              id="trackIssueBtn"
              className="flex items-center gap-2 border border-blue-600 text-blue-600 px-5 py-3 rounded-lg hover:bg-blue-50 transition"
            >
              <FaSearch />
              <span>Track Existing Issue</span>
            </button>
          </div>
        </div>

        {/* Right Visual */}
        <div className="relative flex flex-col items-center">
          {/* Government Seal */}
          <div className="relative bg-blue-600 text-white rounded-full w-40 h-40 flex flex-col items-center justify-center shadow-lg">
            <FaLandmark className="text-4xl mb-1" />
            <span className="text-sm">Government</span>
            <span className="text-sm font-semibold">Verified</span>
          </div>

          {/* Status Cards */}
          <div className="absolute -bottom-16 flex flex-col md:flex-row gap-6">
            <div className="bg-white shadow-md rounded-xl flex items-center gap-4 px-6 py-4 border">
              <div className="text-blue-600 text-3xl">
                <FaRoad />
              </div>
              <div>
                <div className="text-xl font-bold">12,458</div>
                <div className="text-sm text-gray-500">Road Issues Resolved</div>
              </div>
            </div>

            <div className="bg-white shadow-md rounded-xl flex items-center gap-4 px-6 py-4 border">
              <div className="text-yellow-500 text-3xl">
                <FaLightbulb />
              </div>
              <div>
                <div className="text-xl font-bold">8,742</div>
                <div className="text-sm text-gray-500">Street Lights Fixed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
