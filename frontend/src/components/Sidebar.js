import React from 'react';
import { FaHome, FaCalendarAlt, FaPaw, FaUserMd } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../App.css';

function Sidebar({ active, role }) {
  return (
    <div className="sidebar">
      <div className="logo">
        <span role="img" aria-label="paw">🐾</span>
        <div>
          <div style={{ fontWeight: 700 }}>Veterinary</div>
          <div style={{ fontSize: 13, color: '#888' }}>Appointment System</div>
        </div>
      </div>

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
    </div>
  );
}

export default Sidebar;
