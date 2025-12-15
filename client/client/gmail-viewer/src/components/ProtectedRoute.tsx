import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../session/store-data'; // Assuming useAuth provides user authentication status

const ProtectedRoute = () => {
    const { accessToken } = useAuth(); // Get accessToken from your authentication context

    if (!accessToken) {
        // If no accessToken is found, redirect to the login page
        return <Navigate to="/" replace />;
    }

    // If accessToken is found, render the child routes
    return <Outlet />;
};

export default ProtectedRoute;
