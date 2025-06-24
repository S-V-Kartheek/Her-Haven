import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth(); // Get the user from the AuthContext

  if (!user) {
    // If user is not authenticated, redirect to the sign-in page
    return <Navigate to="/signin" replace />;
  }

  // If user is authenticated, render the children (the protected route content)
  return children ? children : <Outlet />;
};

export default ProtectedRoute; 