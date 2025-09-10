import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("https://resume-maker-backend-9ygy.onrender.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("token", data.token);
      alert("Login Successful! Redirecting...");
      navigate("/dashboard");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="mt-6">
          <div>
            <label className="block text-gray-600">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              required
              className="w-full p-2 mt-2 border border-gray-300 rounded focus:ring focus:ring-blue-300"
            />
          </div>
          <div className="mt-4">
            <label className="block text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              onChange={handleChange}
              required
              className="w-full p-2 mt-2 border border-gray-300 rounded focus:ring focus:ring-blue-300"
            />
          </div>
          <button type="submit" className="w-full mt-6 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
