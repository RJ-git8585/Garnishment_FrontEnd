
/**
 * PublicRoute component to handle public routes in the application.
 * Redirects authenticated users to the dashboard and allows unauthenticated users
 * to access the public route (e.g., Login page).
 *
 * @param {Object} props - The props object.
 * @param {React.ReactNode} props.children - The child components to render if the user is not authenticated.
 * @returns {React.ReactNode} - A <Navigate> component redirecting to the dashboard if authenticated, 
 * or the children components if not authenticated.
 */
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const isAuthenticated = !!sessionStorage.getItem('token'); // Check if access token exists

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children; // Render the children (e.g., Login page) if not authenticated
};



export default PublicRoute;