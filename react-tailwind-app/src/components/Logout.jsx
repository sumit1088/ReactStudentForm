import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      sessionStorage.clear();
      navigate("/", { replace: true }); // Redirect to login
    } else {
      navigate(-1); // Go back to previous page
    }
  }, [navigate]);

  return null; // or show a spinner/loading if you want
};

export default Logout;
