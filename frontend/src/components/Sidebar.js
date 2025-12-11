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
            {user.role === 'owner' ? 'Kullanıcı' : user.role === 'vet' ? 'Veteriner' : 'Admin'}
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

      {/* Logout Butonu */}
      <div style={{ 
        position: 'absolute', 
        bottom: 20, 
        left: 20, 
        right: 20 
      }}>
        <button 
          onClick={handleLogout}
          className="menu-item"
          style={{ 
            width: '100%', 
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            padding: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.target.style.background = '#c82333'}
          onMouseOut={(e) => e.target.style.background = '#dc3545'}
        >
          <FaSignOutAlt style={{ marginRight: 8 }} /> Çıkış Yap
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
