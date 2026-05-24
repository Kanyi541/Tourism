import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-earth-900 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-africa-green border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Redirect non-admin users to a generic page (e.g., dashboard or home)
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
