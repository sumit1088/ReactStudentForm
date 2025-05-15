import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the login payload
    const payload = {
      email: form.username, // Assuming 'username' field will hold email
      password: form.password,
    };

    try {
      // Make API request to login (using the same URL as in the curl example)
      const response = await fetch("http://192.168.1.28:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      // Check if login was successful and we received an access token
      if (response.ok && data.access_token) {
        console.log("Login successful:", data);

        // Store the access token in sessionStorage
        sessionStorage.setItem('access_token', data.access_token);

        // Optionally store additional user info in sessionStorage
        // Assuming the server sends the user's email in the response (change as needed)
        sessionStorage.setItem("user", JSON.stringify({
          email: form.username,  // you can update this with actual user data if available
        }));

        console.log("Navigating to dashboard...");
        navigate("/dashboard");  // Make sure this is correct
      } else {
        alert(data.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred while logging in.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-900">Login</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Username (Email)</label>
          <input
            type="email"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-900 text-white py-2 rounded-md hover:bg-blue-800">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
