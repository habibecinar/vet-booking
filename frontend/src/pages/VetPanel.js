import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './dashboard.css';

function VetPanel() {
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    completed: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/appointments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const data = response.data;
      setAppointments(data);
      
      // Calculate statistics
      setStats({
        total: data.length,
        pending: data.filter(a => a.status === 'pending').length,
        approved: data.filter(a => a.status === 'approved').length,
        completed: data.filter(a => a.status === 'completed').length
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `/api/appointments/${appointmentId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success(`Appointment ${newStatus} successfully`);
      fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error('Failed to update appointment status');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'badge bg-warning text-dark';
      case 'approved': return 'badge bg-success';
      case 'completed': return 'badge bg-info';
      case 'cancelled': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-content">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading veterinarian panel...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <h2 className="mb-4">Veterinarian Dashboard</h2>

        {/* Statistics Cards */}
        <div className="row mb-4">
          <div className="col-md-3 mb-3">
            <div className="card text-center p-3 border-primary">
              <h6 className="text-muted">Total Appointments</h6>
              <div className="display-4 text-primary">{stats.total}</div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card text-center p-3 border-warning">
              <h6 className="text-muted">Pending</h6>
              <div className="display-4 text-warning">{stats.pending}</div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card text-center p-3 border-success">
              <h6 className="text-muted">Approved</h6>
              <div className="display-4 text-success">{stats.approved}</div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card text-center p-3 border-info">
              <h6 className="text-muted">Completed</h6>
              <div className="display-4 text-info">{stats.completed}</div>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">My Appointments</h5>
          </div>
          <div className="card-body">
            {appointments.length === 0 ? (
              <div className="text-center py-4">
                <i className="bi bi-calendar-x" style={{ fontSize: '3rem', color: '#ccc' }}></i>
                <p className="text-muted mt-3">No appointments found</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Pet</th>
                      <th>Owner</th>
                      <th>Note</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appointment) => (
                      <tr key={appointment._id}>
                        <td>{new Date(appointment.date).toLocaleDateString()}</td>
                        <td>{appointment.time}</td>
                        <td>
                          {appointment.petId?.name || 'N/A'}
                          {appointment.petId?.species && (
                            <small className="text-muted d-block">
                              {appointment.petId.species}
                            </small>
                          )}
                        </td>
                        <td>
                          {appointment.ownerId?.name || 'N/A'}
                          {appointment.ownerId?.email && (
                            <small className="text-muted d-block">
                              {appointment.ownerId.email}
                            </small>
                          )}
                        </td>
                        <td>
                          <small>{appointment.note || '-'}</small>
                        </td>
                        <td>
                          <span className={getStatusBadgeClass(appointment.status)}>
                            {appointment.status}
                          </span>
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm" role="group">
                            {appointment.status === 'pending' && (
                              <>
                                <button
                                  className="btn btn-success"
                                  onClick={() => handleStatusUpdate(appointment._id, 'approved')}
                                  title="Approve"
                                >
                                  <i className="bi bi-check-circle"></i>
                                </button>
                                <button
                                  className="btn btn-danger"
                                  onClick={() => handleStatusUpdate(appointment._id, 'cancelled')}
                                  title="Cancel"
                                >
                                  <i className="bi bi-x-circle"></i>
                                </button>
                              </>
                            )}
                            {appointment.status === 'approved' && (
                              <button
                                className="btn btn-info"
                                onClick={() => handleStatusUpdate(appointment._id, 'completed')}
                                title="Complete"
                              >
                                <i className="bi bi-check-all"></i>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VetPanel;
