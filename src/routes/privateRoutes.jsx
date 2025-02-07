import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children, type }) => {
  const adminToken = localStorage.getItem("adminToken");
  const userToken = localStorage.getItem("userToken");
  const location = useLocation();

  if (type === "admin" && adminToken) {
    return children; // Allow admins to access admin routes
  } else if (type === "user" && userToken) {
    return children; // Allow users to access user routes
  } else {
    // Redirect unauthorized access to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
};

export default PrivateRoute;
