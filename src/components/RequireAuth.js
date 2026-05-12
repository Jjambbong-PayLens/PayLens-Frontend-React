import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getAccessToken } from '../utils/auth';

function RequireAuth() {
  const location = useLocation();
  const token = getAccessToken();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default RequireAuth;
