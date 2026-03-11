import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../router/paths';

function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location.pathname }} replace />;
  }

  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return children;
}

export default ProtectedRoute;
