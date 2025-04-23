import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    // Check if token has expired
    if (decoded.exp * 1000 < Date.now()) {
      sessionStorage.clear();
      return <Navigate to="/login" replace />;
    }

    return children;
  } catch (err) {
    console.error("Token decoding error:", err);
    sessionStorage.clear();
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
