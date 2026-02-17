import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const RequireAuth = ({ children }) => {
	const { isAuthenticated, isInitializing } = useAuth();
	const location = useLocation();

	if (isInitializing) {
		return null;
	}

	if (!isAuthenticated) {
		return <Navigate to="/login" replace state={{ from: location }} />;
	}

	return children;
};

export default RequireAuth;
