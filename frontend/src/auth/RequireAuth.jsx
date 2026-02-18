import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const RequireAuth = ({ children, redirectTo = "/login" }) => {
	const { isAuthenticated, isInitializing } = useAuth();
	const location = useLocation();

	if (isInitializing) {
		return null;
	}

	if (!isAuthenticated) {
		return <Navigate to={redirectTo} replace state={{ from: location }} />;
	}

	return children;
};

export default RequireAuth;
