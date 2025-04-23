import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    role: "User",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      id: 0,
      ...form,
      createddate: new Date().toISOString(), // format matches API
    };

    try {
      const res = await fetch("http://192.168.1.28:8075/api/UserDetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("User registered successfully!");
        navigate("/login");
      } else {
        const error = await res.text();
        console.error("Registration failed:", error);
        alert("Registration failed.");
      }
    } catch (err) {
      console.error("Error during registration:", err);
      alert("An error occurred.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-900">
          Create Account
        </h2>

        {[
          { name: "firstName", label: "First Name" },
          { name: "middleName", label: "Middle Name" },
          { name: "lastName", label: "Last Name" },
          { name: "email", label: "Email", type: "email" },
          { name: "username", label: "Username" },
          { name: "password", label: "Password", type: "password" },
        ].map(({ name, label, type = "text" }) => (
          <div className="mb-4" key={name}>
            <label className="block text-gray-700 mb-1">{label}</label>
            <input
              type={type}
              name={name}
              value={form[name]}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        ))}

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-900 text-white py-2 rounded-md hover:bg-blue-800"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
