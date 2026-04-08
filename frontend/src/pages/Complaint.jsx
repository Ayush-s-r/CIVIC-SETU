import React, { useState } from "react";
import { complaintsAPI } from "../api"; // ✅ use centralized API
import api from "../api/axios"; // ✅ for ML upload (FormData)

export default function Complaint() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    address: "",
    category: "",
    description: "",
  });

  const [mlResult, setMlResult] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ----------------------------
  // ✅ Submit Complaint (Axios)
  // ----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await complaintsAPI.create({
        ...form,
        mlDetection: mlResult,
      });

      alert("Complaint submitted successfully!");
      console.log(data);

      // Reset form
      setForm({
        fullName: "",
        email: "",
        mobile: "",
        address: "",
        category: "",
        description: "",
      });

      setMlResult(null);

    } catch (error) {
      console.error("Submission error:", error);
      alert(error.message || "Failed to submit complaint.");
    }
  };

  // ----------------------------
  // ✅ ML Detection (Axios)
  // ----------------------------
  const handleMLImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const data = await api.post("/detection/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("ML Result:", data);
      setMlResult(data);

    } catch (err) {
      console.error("ML API Error:", err);
      alert(err.message || "Road damage detection failed.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">File a Complaint</h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        
        <input type="text" name="fullName" placeholder="Full Name"
          value={form.fullName} onChange={handleChange}
          className="w-full p-2 border rounded" required />

        <input type="email" name="email" placeholder="Email"
          value={form.email} onChange={handleChange}
          className="w-full p-2 border rounded" required />

        <input type="tel" name="mobile" placeholder="Mobile"
          value={form.mobile} onChange={handleChange}
          className="w-full p-2 border rounded" required />

        <input type="text" name="address" placeholder="Address"
          value={form.address} onChange={handleChange}
          className="w-full p-2 border rounded" required />

        <select name="category" value={form.category}
          onChange={handleChange}
          className="w-full p-2 border rounded" required>
          <option value="">Select Category</option>
          <option value="road">Road Damage</option>
          <option value="garbage">Garbage</option>
          <option value="streetlight">Streetlight</option>
        </select>

        <textarea name="description" placeholder="Description"
          value={form.description} onChange={handleChange}
          className="w-full p-2 border rounded" rows="4" required />

        {/* Image Upload */}
        <input type="file" accept="image/*"
          onChange={handleMLImage}
          className="w-full p-2" />

        {/* ML Result */}
        {mlResult && (
          <div className="p-3 border rounded bg-gray-100">
            <h4 className="font-semibold">Detection Results</h4>

            <pre className="text-sm bg-white p-2 rounded border mt-2">
              {mlResult.detections?.map((d) => d.label).join(", ")}
            </pre>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Submit Complaint
        </button>

      </form>
    </div>
  );
}