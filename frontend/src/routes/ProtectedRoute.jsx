import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, isInitializing, user } = useAuth();

  if (isInitializing) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return allowedRoles.includes(user?.role) 
    ? <Outlet /> 
    : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
