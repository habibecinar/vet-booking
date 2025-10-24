import React from 'react';
import { FaHome, FaCalendarAlt, FaPaw, FaUserMd } from 'react-icons/fa';

function Sidebar({ active }) {
  return (
    <div className="sidebar">
      <div className="logo">
        <span role="img" aria-label="paw">🐾</span>
        <div>
          <div style={{fontWeight:700}}>Veterinary</div>
          <div style={{fontSize:13, color:'#888'}}>Appointment System</div>
        </div>
      </div>
      <div className="menu">
        <div className={`menu-item${active === 'dashboard' ? ' active' : ''}`}><FaHome style={{marginRight:8}} /> Dashboard</div>
        <div className={`menu-item${active === 'appointments' ? ' active' : ''}`}><FaCalendarAlt style={{marginRight:8}} /> Appointments</div>
        <div className={`menu-item${active === 'pets' ? ' active' : ''}`}><FaPaw style={{marginRight:8}} /> Pets</div>
        <div className={`menu-item${active === 'vets' ? ' active' : ''}`}><FaUserMd style={{marginRight:8}} /> Vets</div>
      </div>
    </div>
  );
}

export default Sidebar;
