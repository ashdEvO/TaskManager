import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
// For UI testing, always allow access
const PrivateRoute = ({ allowedRoles }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  const isAllowed = allowedRoles ? allowedRoles.includes(userRole) : true;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAllowed) return <Navigate to="/login" replace />;
  return <Outlet />;
}
export default PrivateRoute