import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import UserManagerPage from '../pages/UserManagerPage';
import ProtectedRoute from '../components/ProtectedRoute';
import { Routes, Route, Navigate } from 'react-router-dom';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/users" 
        element={
          <ProtectedRoute>
            <UserManagerPage />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
