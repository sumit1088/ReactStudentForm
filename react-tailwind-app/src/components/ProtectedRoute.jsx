import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Note: Ensure you import jwtDecode correctly

const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem("access_token");

  console.log("Token in sessionStorage:", token);

  if (!token) {
    console.log("No token, redirecting to login...");
    return <Navigate to="/Login" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    // Check if the token has expired
    if (decoded.exp * 1000 < Date.now()) {
      console.log("Token expired, clearing session...");
      sessionStorage.clear();
      return <Navigate to="/Login" replace />;
    }

    console.log("Token valid, rendering protected route...");
    return children;
  } catch (err) {
    console.error("Token decoding error:", err);
    sessionStorage.clear();
    return <Navigate to="/Login" replace />;
  }
};

export default ProtectedRoute;
