import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function RequireRole({ children, roles = [], redirectTo = "/login" }) {
  const location = useLocation();
  const { isAuthenticated, isInitializing, user } = useAuth();

  if (isInitializing) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const userRole = String(user?.role || "").toUpperCase();
  const allowed = roles.map((r) => String(r).toUpperCase());
  if (!allowed.includes(userRole)) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}
