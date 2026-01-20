import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import UserManagerPage from '../pages/UserManagerPage';
import NotFoundPage from '../pages/NotFoundPage';
import { Routes, Route } from 'react-router-dom';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin/users" element={<UserManagerPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
