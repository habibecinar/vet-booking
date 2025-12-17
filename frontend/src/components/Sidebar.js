import React from 'react';
import { FaHome, FaCalendarAlt, FaPaw, FaUserMd, FaSignOutAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../App.css';

function Sidebar({ active, role }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="logo">
        <span role="img" aria-label="paw">🐾</span>
        <div>
          <div style={{ fontWeight: 700 }}>Veterinary</div>
          <div style={{ fontSize: 13, color: '#888' }}>Appointment System</div>
        </div>
      </div>

      {/* User Info */}
      {user && (
        <div style={{ 
          padding: '16px 24px', 
          borderBottom: '1px solid #f0f0f0',
          background: '#fafbfc'
        }}>
          <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#222', marginBottom: '4px' }}>
            {user.name}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '8px' }}>
            {user.email}
          </div>
          <div style={{ 
            fontSize: '0.75rem', 
            color: '#fff', 
            background: 'linear-gradient(135deg, #2d6cdf 0%, #5fa8e6 100%)', 
            padding: '4px 10px', 
            borderRadius: 14, 
            display: 'inline-block',
            fontWeight: 500
          }}>
            {user.role === 'owner' ? 'Pet Owner' : user.role === 'vet' ? 'Veterinarian' : 'Admin'}
          </div>
        </div>
      )}

      <div className="menu">
        <Link 
          to="/dashboard" 
          className={`menu-item${active === 'dashboard' ? ' active' : ''}`}
        >
          <FaHome style={{ marginRight: 8 }} /> Dashboard
        </Link>

        {/* Randevular her rolde görünür */}
        <Link 
          to="/appointments" 
          className={`menu-item${active === 'appointments' ? ' active' : ''}`}
        >
          <FaCalendarAlt style={{ marginRight: 8 }} /> Appointments
        </Link>

        {/* Sadece owner görür */}
        {role === 'owner' && (
          <Link 
            to="/pets" 
            className={`menu-item${active === 'pets' ? ' active' : ''}`}
          >
            <FaPaw style={{ marginRight: 8 }} /> Pets
          </Link>
        )}

        {/* Sadece admin görür */}
        {role === 'admin' && (
          <Link 
            to="/vets" 
            className={`menu-item${active === 'vets' ? ' active' : ''}`}
          >
            <FaUserMd style={{ marginRight: 8 }} /> Vets
          </Link>
        )}
      </div>

      {/* Logout Button */}
      <div className="logout-wrapper">
        <button 
          onClick={handleLogout}
          className="logout-button"
        >
          <FaSignOutAlt style={{ marginRight: 8 }} /> Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
