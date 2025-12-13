import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './dashboard.css';

function AdminPanel() {
  const [vets, setVets] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('vets');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [vetsRes, appointmentsRes] = await Promise.all([
        axios.get('/api/vets', config),
        axios.get('/api/appointments', config)
      ]);
      
      setVets(vetsRes.data);
      setAppointments(appointmentsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load admin data');
      setLoading(false);
    }
  };

  const handleAddVet = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/auth/register',
        { name, email, password, role: 'vet' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success('Veterinarian added successfully!');
      setName('');
      setEmail('');
      setPassword('');
      fetchData();
    } catch (error) {
      console.error('Error adding vet:', error);
      toast.error(error.response?.data?.error || 'Failed to add veterinarian');
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
      fetchData();
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error('Failed to update appointment');
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
            <p className="mt-3">Loading admin panel...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <h2 className="mb-4">Admin Panel</h2>

        {/* Statistics Cards */}
        <div className="row mb-4">
          <div className="col-md-3 mb-3">
            <div className="card text-center p-3 border-primary">
              <h6 className="text-muted">Total Veterinarians</h6>
              <div className="display-4 text-primary">{vets.length}</div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card text-center p-3 border-info">
              <h6 className="text-muted">Total Appointments</h6>
              <div className="display-4 text-info">{appointments.length}</div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card text-center p-3 border-warning">
              <h6 className="text-muted">Pending Approvals</h6>
              <div className="display-4 text-warning">
                {appointments.filter(a => a.status === 'pending').length}
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card text-center p-3 border-success">
              <h6 className="text-muted">Completed</h6>
              <div className="display-4 text-success">
                {appointments.filter(a => a.status === 'completed').length}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'vets' ? 'active' : ''}`}
              onClick={() => setActiveTab('vets')}
            >
              Veterinarians
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'appointments' ? 'active' : ''}`}
              onClick={() => setActiveTab('appointments')}
            >
              Appointments
            </button>
          </li>
        </ul>

        {/* Vets Tab */}
        {activeTab === 'vets' && (
          <div className="row">
            <div className="col-md-5 mb-4">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Add New Veterinarian</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleAddVet}>
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                      <i className="bi bi-plus-circle me-2"></i>
                      Add Veterinarian
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className="col-md-7">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">All Veterinarians</h5>
                </div>
                <div className="card-body">
                  {vets.length === 0 ? (
                    <div className="text-center py-4">
                      <i className="bi bi-people" style={{ fontSize: '3rem', color: '#ccc' }}></i>
                      <p className="text-muted mt-3">No veterinarians found</p>
                    </div>
                  ) : (
                    <div className="list-group">
                      {vets.map((vet) => (
                        <div key={vet._id} className="list-group-item">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h6 className="mb-1">{vet.name}</h6>
                              <small className="text-muted">{vet.email}</small>
                            </div>
                            <span className="badge bg-primary">Veterinarian</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">All Appointments</h5>
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
                        <th>Vet</th>
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
                          <td>{appointment.ownerId?.name || 'N/A'}</td>
                          <td>{appointment.vetId?.name || 'N/A'}</td>
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
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
