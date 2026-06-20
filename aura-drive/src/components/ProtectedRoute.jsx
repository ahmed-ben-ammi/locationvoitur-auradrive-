import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { isLoggedIn, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    } else if (requireAdmin && !isAdmin) {
      navigate('/');
    }
  }, [isLoggedIn, isAdmin, navigate]);

  if (!isLoggedIn) {
    return null;
  }

  if (requireAdmin && !isAdmin) {
    return null;
  }

  return children;
}
