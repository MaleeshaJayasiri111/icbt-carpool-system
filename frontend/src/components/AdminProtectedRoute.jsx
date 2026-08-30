import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminProtectedRoute = () => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token || !storedUser) {
        return <Navigate to="/login" replace />;
    }

    try {
        const user = JSON.parse(storedUser);
        if (user.role !== 'admin') {
            // Redirect non-admins to their proper dashboard
            if (user.role === 'driver') {
                return <Navigate to="/driver/dashboard" replace />;
            } else if (user.role === 'passenger') {
                return <Navigate to="/passenger/dashboard" replace />;
            }
            return <Navigate to="/login" replace />;
        }
    } catch (e) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default AdminProtectedRoute;
