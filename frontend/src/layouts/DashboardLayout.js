import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';

function DashboardLayout() {
  const { user } = useAuth();
  const location = useLocation();

  // Get active page from URL
  const getActivePage = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'dashboard';
    if (path === '/pets') return 'pets';
    if (path === '/vets') return 'vets';
    if (path === '/appointments' || path === '/admin/appointments') return 'appointments';
    return 'dashboard';
  };

  return (
    <div className="dashboard">
      <Sidebar active={getActivePage()} role={user?.role} />
      <div className="dashboard-content">
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;
