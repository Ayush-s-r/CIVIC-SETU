import React, { useState } from "react";

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
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  // ----------------------------
  // Submit Complaint
  // ----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:8080/api/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          mlDetection: mlResult,
        }),
      });

      const data = await res.json();

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
      alert("Failed to submit complaint.");
    }
  };

  // ----------------------------
  // ML Detection
  // ----------------------------
  const handleMLImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("http://localhost:8080/api/detection/image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      console.log("ML Result:", data);

      setMlResult(data);
    } catch (err) {
      console.error("ML API Error:", err);
      alert("Road damage detection failed.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">File a Complaint</h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block font-medium">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Mobile</label>
          <input
            type="tel"
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Address</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Category</option>
            <option value="road">Road Damage</option>
            <option value="garbage">Garbage</option>
            <option value="streetlight">Streetlight</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="4"
            required
          ></textarea>
        </div>

        <div>
          <label className="block font-medium">Upload Evidence</label>

          <input
            type="file"
            accept="image/*"
            onChange={handleMLImage}
            className="w-full p-2"
          />
        </div>

        {mlResult && (
          <div className="p-3 border rounded bg-gray-100">
            <h4 className="font-semibold">Damage Detection Results</h4>

            {/* {mlResult.annotatedImage && (
              <img
                src={`http://localhost:8080${mlResult.annotatedImage.replace(/^.*\/uploads/, "/uploads")}`}
                alt="Predicted Damage"
                className="max-w-full border rounded mt-2"
              />
            )} */}

            {/* <pre className="text-sm bg-white p-2 rounded border mt-2">
              {JSON.stringify(mlResult.detections, null, 2)}
            </pre> */}
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
