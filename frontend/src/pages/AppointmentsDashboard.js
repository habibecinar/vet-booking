import React from 'react';
import Sidebar from '../components/Sidebar';

function AppointmentsDashboard() {
  return (
    <div className="dashboard">
      <Sidebar active="appointments" />
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h2>Appointments</h2>
          <div>
            <input type="text" placeholder="Search" style={{marginRight:12, padding:'8px 12px', borderRadius:8, border:'1px solid #e0e4ea'}} />
            <button className="btn">+ Book an Appointment</button>
            <span className="user-info" style={{marginLeft:24}}>
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="user" style={{width:32, borderRadius:'50%', marginRight:8}} />
              Jane Doe
            </span>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Pet</th>
              <th>Vet</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Oct 5, 2024</td>
              <td>10:00 AM</td>
              <td>Buddy</td>
              <td>Dr. Smith</td>
              <td></td>
            </tr>
            <tr>
              <td>Oct 10, 2024</td>
              <td>02:00 PM</td>
              <td>Milo</td>
              <td>Dr. Smith</td>
              <td><span className="status-badge">Pending</span></td>
            </tr>
            <tr>
              <td>Oct 12, 2024</td>
              <td>11:00 AM</td>
              <td>Max</td>
              <td>Dr. Jones</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AppointmentsDashboard;
