import { Navigate, Outlet } from 'react-router-dom';
import {useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  requiredRole?: 'admin' | 'user'; // Nếu không có, cho phép mọi user đã login
}

export const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();;

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <span className="text-gray-500 dark:text-white text-lg animate-pulse">Đang tải...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/not-authorized" replace />;
  }

  return <Outlet />;
};
