
import { Navigate, useLocation } from 'react-router-dom';
import { userService } from '../../api/services/userService';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
    const location = useLocation();
    const authed = userService.isAuthenticated();

    return authed
        ? children
        : <Navigate to="/login" state={{ from: location }} replace />;
}
