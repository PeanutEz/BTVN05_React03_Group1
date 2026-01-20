import { Navigate } from 'react-router-dom';
import type { User } from '../types/user.type';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const userStr = localStorage.getItem('user');
  
  if (!userStr) {
    return <Navigate to="/login" replace />;
  }
  
  try {
    const user: User = JSON.parse(userStr);
    if (!user || !user.id) {
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}
