import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useRepairNotifications } from './hooks/useRepairNotifications';
import Dashboard from './pages/Dashboard';
import RepairList from './pages/RepairList';
import RepairForm from './pages/RepairForm';
import RepairDetails from './pages/RepairDetails';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import { UserManagement } from './pages/UserManagement';

const AppRoutes: React.FC = () => {
  useRepairNotifications();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="repairs" element={<RepairList />} />
          <Route path="repairs/new" element={<RepairForm />} />
          <Route path="repairs/:id" element={<RepairDetails />} />
          <Route path="repairs/:id/edit" element={<RepairForm />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes; 