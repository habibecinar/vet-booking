import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './AppointmentsPage.css';

function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [role, setRole] = useState('owner');
  const [filter, setFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login');
        return;
      }
      
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setRole(decoded.role);

      const res = await axios.get('/api/appointments');
      setAppointments(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load appointments:', err.response || err);
      const errorMsg = err.response?.data?.error || err.message || 'Failed to load appointments';
      toast.error(errorMsg);
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Appointment cancelled!');
      setAppointments(prev => prev.filter(a => a._id !== id));
    } catch (err) {
      console.error('Cancel error:', err);
      toast.error(err.response?.data?.error || 'Failed to cancel appointment');
    }
  };

  const handleStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`/api/appointments/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Appointment ${status === 'approved' ? 'approved' : 'rejected'}!`);
      setAppointments(prev => prev.map(a => a._id === id ? res.data : a));
    } catch (err) {
      console.error('Status update error:', err);
      toast.error(err.response?.data?.error || 'Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'danger';
      default: return 'secondary';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'approved': return 'Approved';
      case 'pending': return 'Pending';
      case 'rejected': return 'Rejected';
      default: return status;
    }
  };

  // Filtering
  const filtered = appointments.filter(a => {
    const matchesText =
      a.petId?.name?.toLowerCase().includes(filter.toLowerCase()) ||
      a.vetId?.name?.toLowerCase().includes(filter.toLowerCase());
    
    let matchesDate = true;
    if (dateFilter) {
      const apptDate = new Date(a.date).toISOString().slice(0, 10);
      matchesDate = apptDate === dateFilter;
    }

    let matchesStatus = true;
    if (statusFilter !== 'all') {
      matchesStatus = a.status === statusFilter;
    }

    return matchesText && matchesDate && matchesStatus;
  });

  if (loading) {
    return (
      <div className="appointments-loading">
        <div className="spinner"></div>
        <p>Loading appointments...</p>
      </div>
    );
  }

  return (
    <div className="appointments-page">
      {/* Header */}
      <div className="appointments-header">
        <div className="header-content">
          <div className="title-section">
            <h1>
              <span className="title-icon">📅</span>
              My Appointments
            </h1>
            <p className="subtitle">Manage all your appointments here</p>
          </div>
          <div className="stats-mini">
            <div className="mini-stat">
              <span className="mini-stat-value">{appointments.length}</span>
              <span className="mini-stat-label">Total</span>
            </div>
            <div className="mini-stat">
              <span className="mini-stat-value">
                {appointments.filter(a => a.status === 'pending').length}
              </span>
              <span className="mini-stat-label">Pending</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>🔍 Search</label>
          <input
            type="text"
            className="filter-input"
            placeholder="Pet or vet name..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label>📅 Date</label>
          <input
            type="date"
            className="filter-input"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label>🏷️ Status</label>
          <select 
            className="filter-input"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Appointments Grid */}
      <div className="appointments-grid">
        {filtered.length === 0 ? (
          <div className="no-appointments">
            <div className="no-appt-icon">📋</div>
            <h3>No Appointments Found</h3>
            <p>
              {appointments.length === 0 
                ? 'You don\'t have any appointments yet' 
                : 'No appointments match your filters'}
            </p>
          </div>
        ) : (
          filtered.map(appt => (
            <div key={appt._id} className="appointment-item">
              <div className="appt-item-header">
                <div className="appt-pet-info">
                  <div className="pet-avatar-small">
                    {appt.petId?.species === 'Kedi' || appt.petId?.species === 'kedi' || appt.petId?.species === 'Cat' || appt.petId?.species === 'cat' ? '🐱' : 
                     appt.petId?.species === 'Köpek' || appt.petId?.species === 'köpek' || appt.petId?.species === 'Dog' || appt.petId?.species === 'dog' ? '🐶' : '🐾'}
                  </div>
                  <div>
                    <h3>{appt.petId?.name || 'Pet'}</h3>
                    <p className="pet-species">{appt.petId?.species}</p>
                  </div>
                </div>
                <span className={`status-tag ${getStatusColor(appt.status)}`}>
                  {getStatusText(appt.status)}
                </span>
              </div>

              <div className="appt-item-body">
                <div className="appt-info-row">
                  <span className="info-icon">👨‍⚕️</span>
                  <div className="info-content">
                    <span className="info-label">Veterinarian</span>
                    <span className="info-value">{appt.vetId?.name || 'Not specified'}</span>
                  </div>
                </div>

                <div className="appt-info-row">
                  <span className="info-icon">📅</span>
                  <div className="info-content">
                    <span className="info-label">Date & Time</span>
                    <span className="info-value">
                      {new Date(appt.date).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                {appt.notes && (
                  <div className="appt-notes-box">
                    <span className="notes-icon">📝</span>
                    <p>{appt.notes}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="appt-item-footer">
                {role === 'owner' && appt.status === 'pending' && (
                  <button 
                    className="action-button cancel"
                    onClick={() => handleCancel(appt._id)}
                  >
                    Cancel
                  </button>
                )}
                {role === 'vet' && appt.status === 'pending' && (
                  <>
                    <button 
                      className="action-button approve"
                      onClick={() => handleStatus(appt._id, 'approved')}
                    >
                      ✓ Approve
                    </button>
                    <button 
                      className="action-button reject"
                      onClick={() => handleStatus(appt._id, 'rejected')}
                    >
                      ✗ Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AppointmentsPage;
