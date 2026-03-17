import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI, setAuthToken } from "../utils/api";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authAPI.login(formData.email, formData.password);
      
      // Store token and user data
      setAuthToken(response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Redirect based on user role
      if (response.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/citizen');
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex items-center justify-center h-[80vh] bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h3 className="text-2xl font-bold text-blue-700 mb-4 text-center">Login</h3>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full mb-3 px-3 py-2 border rounded"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full mb-3 px-3 py-2 border rounded"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Don't have an account? <Link to="/signup" className="text-blue-700">Sign up</Link>
        </p>
      </div>
    </section>
  );
}
