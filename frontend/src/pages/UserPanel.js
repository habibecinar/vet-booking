import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './UserPanel.css';

function UserPanel() {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    totalPets: 0,
    upcomingAppointments: 0,
    pendingAppointments: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login');
        navigate('/login');
        return;
      }

      const decoded = JSON.parse(atob(token.split('.')[1]));
      setUserName(decoded.name || 'User');
      
      console.log('User info:', { id: decoded.userId, role: decoded.role });

      // Fetch pets
      try {
        console.log('Fetching pets...');
        const petsRes = await axios.get('/api/pets');
        console.log('Pets loaded:', petsRes.data);
        setPets(petsRes.data.slice(0, 3)); // Last 3 pets
        
        // Calculate pets stats
        setStats(prev => ({
          ...prev,
          totalPets: petsRes.data.length
        }));
      } catch (petErr) {
        console.error('Pet loading error details:', {
          message: petErr.message,
          response: petErr.response?.data,
          status: petErr.response?.status,
          url: petErr.config?.url
        });
        
        const errorMessage = petErr.response?.data?.error || 
                           petErr.response?.data?.message || 
                           petErr.message || 
                           'Failed to load pets';
        setError(`Pet Error: ${errorMessage}`);
        toast.error(errorMessage);
      }

      // Fetch appointments
      try {
        console.log('Fetching appointments...');
        const apptRes = await axios.get('/api/appointments');
        console.log('Appointments loaded:', apptRes.data);
        const userAppointments = apptRes.data.slice(0, 3); // Last 3 appointments
        setAppointments(userAppointments);

        // Calculate appointment stats
        setStats(prev => ({
          ...prev,
          upcomingAppointments: apptRes.data.filter(a => 
            a.status === 'approved' && new Date(a.date) > new Date()
          ).length,
          pendingAppointments: apptRes.data.filter(a => a.status === 'pending').length
        }));
      } catch (apptErr) {
        console.error('Appointment loading error details:', {
          message: apptErr.message,
          response: apptErr.response?.data,
          status: apptErr.response?.status
        });
        
        const errorMessage = apptErr.response?.data?.error || 
                           apptErr.response?.data?.message || 
                           apptErr.message || 
                           'Failed to load appointments';
        toast.error(errorMessage);
      }

      setLoading(false);
    } catch (err) {
      console.error('Dashboard general error:', err);
      setError('Failed to load dashboard: ' + (err.message || 'Unknown error'));
      toast.error('Failed to load dashboard');
      setLoading(false);
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

  if (loading) {
    return (
      <div className="user-panel-loading">
        <div className="spinner"></div>
        <p>Loading...</p>
        {error && (
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <p style={{ color: '#e74c3c', marginBottom: '1rem' }}>{error}</p>
            <button 
              onClick={fetchDashboardData}
              style={{
                padding: '0.8rem 2rem',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="user-panel">
      {/* Header */}
      <div className="panel-header">
        <div className="header-content">
          <div className="welcome-section">
            <h1>Welcome, <span className="user-name">{userName}</span></h1>
            <p className="subtitle">Your pet health tracking dashboard</p>
          </div>
          <div className="quick-actions">
            <button 
              className="action-btn primary"
              onClick={() => navigate('/pets')}
            >
              <span className="btn-icon">🐾</span>
              Add Pet
            </button>
            <button 
              className="action-btn secondary"
              onClick={() => navigate('/appointment')}
            >
              <span className="btn-icon">📅</span>
              Book Appointment
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card purple">
          <div className="stat-icon">🐾</div>
          <div className="stat-content">
            <h3>{stats.totalPets}</h3>
            <p>Total Pets</p>
          </div>
        </div>
        <div className="stat-card blue">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>{stats.upcomingAppointments}</h3>
            <p>Upcoming</p>
          </div>
        </div>
        <div className="stat-card orange">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>{stats.pendingAppointments}</h3>
            <p>Pending</p>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="content-grid">
        {/* Pets Section */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>
              <span className="section-icon">🐾</span>
              My Pets
            </h2>
            <button 
              className="view-all-btn"
              onClick={() => navigate('/pets')}
            >
              View All →
            </button>
          </div>
          <div className="section-content">
            {pets.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🐕</div>
                <p>No pets yet</p>
                <button 
                  className="empty-action-btn"
                  onClick={() => navigate('/pets')}
                >
                  Add Your First Pet
                </button>
              </div>
            ) : (
              <div className="pets-list">
                {pets.map(pet => (
                  <div key={pet._id} className="pet-card">
                    <div className="pet-avatar">
                      {pet.species === 'Kedi' || pet.species === 'kedi' || pet.species === 'Cat' || pet.species === 'cat' ? '🐱' : 
                       pet.species === 'Köpek' || pet.species === 'köpek' || pet.species === 'Dog' || pet.species === 'dog' ? '🐶' : 
                       pet.species === 'Kuş' || pet.species === 'kuş' || pet.species === 'Bird' || pet.species === 'bird' ? '🐦' : '🐾'}
                    </div>
                    <div className="pet-info">
                      <h4>{pet.name}</h4>
                      <p className="pet-details">
                        <span className="detail-badge">{pet.species}</span>
                        <span className="detail-badge">{pet.age} years</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Appointments Section */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>
              <span className="section-icon">📅</span>
              Recent Appointments
            </h2>
            <button 
              className="view-all-btn"
              onClick={() => navigate('/appointments')}
            >
              View All →
            </button>
          </div>
          <div className="section-content">
            {appointments.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <p>No appointments yet</p>
                <button 
                  className="empty-action-btn"
                  onClick={() => navigate('/appointment')}
                >
                  Book Your First Appointment
                </button>
              </div>
            ) : (
              <div className="appointments-list">
                {appointments.map(appt => (
                  <div key={appt._id} className="appointment-card">
                    <div className="appt-header">
                      <div className="appt-pet">
                        <span className="appt-icon">🐾</span>
                        <strong>{appt.petId?.name || 'Pet'}</strong>
                      </div>
                      <span className={`status-badge ${getStatusColor(appt.status)}`}>
                        {getStatusText(appt.status)}
                      </span>
                    </div>
                    <div className="appt-details">
                      <div className="appt-detail-item">
                        <span className="detail-icon">👨‍⚕️</span>
                        <span>{appt.vetId?.name || 'Veterinarian'}</span>
                      </div>
                      <div className="appt-detail-item">
                        <span className="detail-icon">📅</span>
                        <span>{new Date(appt.date).toLocaleDateString('en-US')}</span>
                      </div>
                      {appt.notes && (
                        <div className="appt-notes">
                          <span className="detail-icon">📝</span>
                          <span>{appt.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserPanel;
