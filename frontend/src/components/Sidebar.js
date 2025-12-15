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

      {/* Kullanıcı Bilgisi */}
      {user && (
        <div style={{ 
          padding: '12px 20px', 
          borderBottom: '1px solid #e0e0e0',
          background: '#f8f9fa'
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>{user.name}</div>
          <div style={{ fontSize: 12, color: '#666' }}>{user.email}</div>
          <div style={{ 
            fontSize: 11, 
            color: '#fff', 
            background: '#007bff', 
            padding: '2px 8px', 
            borderRadius: 12, 
            display: 'inline-block',
            marginTop: 4
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
      <div style={{ 
        position: 'absolute', 
        bottom: 20, 
        left: 20, 
        right: 20 
      }}>
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
