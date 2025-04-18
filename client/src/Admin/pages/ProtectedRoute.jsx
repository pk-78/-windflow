import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/userLogin" />;
  }

  if (role === "admin") {
    return <Navigate to="/adminHome" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
