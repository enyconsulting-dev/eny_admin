import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '@/store';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, expiry } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || Date.now() > expiry) {
      navigate('/');
    }
  }, [isAuthenticated, expiry, navigate]);

  if (!isAuthenticated || Date.now() > expiry) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;