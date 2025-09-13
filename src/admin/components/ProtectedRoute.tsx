import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const checkAdminSession = () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const adminSession = localStorage.getItem('adminSession');

      if (!adminToken || !adminSession) return false;

      try {
        const session = JSON.parse(adminSession);
        if (!session.authenticated) return false;

        // Check if session is not older than 24 hours
        const sessionTime = new Date(session.timestamp);
        const now = new Date();
        const hoursDiff = (now.getTime() - sessionTime.getTime()) / (1000 * 60 * 60);

        if (hoursDiff > 24) {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminSession');
          return false;
        }

        return true;
      } catch {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminSession');
        return false;
      }

    } catch (error) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminSession');
      console.error('Error checking admin session:', (error as Error)?.message);
      return false;
    }
  };

  if (!checkAdminSession()) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;