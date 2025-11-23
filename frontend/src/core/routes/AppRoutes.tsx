import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@components/layout/MainLayout';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@features/auth/pages/LoginPage';
import { RegisterPage } from '@features/auth/pages/RegisterPage';
import { ProjectsPage } from '@features/projects/pages/ProjectsPage';
import { ProjectDetailsPage } from '@features/projects/pages/ProjectDetailsPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { PortfolioPage } from '@features/investments/pages/PortfolioPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetailsPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
