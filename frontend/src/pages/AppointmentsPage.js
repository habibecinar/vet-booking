import React, { useEffect, useState } from 'react';
import axios from 'axios';


function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [role, setRole] = useState('owner');
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const decoded = JSON.parse(atob(token.split('.')[1]));
    setRole(decoded.role);
    setUserId(decoded.userId);

    axios.get('/api/appointments', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setAppointments(res.data))
      .catch(() => setError('Failed to fetch appointments'));
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    setError(''); setSuccess('');
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5001/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Appointment cancelled!');
      setAppointments(prev => prev.filter(a => a._id !== id));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to cancel appointment');
    }
  };

  const handleStatus = async (id, status) => {
    setError(''); setSuccess('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`http://localhost:5001/appointments/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Appointment updated!');
      setAppointments(prev => prev.map(a => a._id === id ? res.data : a));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update appointment');
    }
  };



  const statusColor = (status) => {
    if (status === 'pending') return 'warning';
    if (status === 'approved') return 'success';
    if (status === 'rejected') return 'danger';
    return 'secondary';
  };

  // Filtrelenmiş randevular
  const filtered = appointments.filter(a => {
    const matchesText =
      a.petId?.name?.toLowerCase().includes(filter.toLowerCase()) ||
      a.vetId?.name?.toLowerCase().includes(filter.toLowerCase()) ||
      a.status?.toLowerCase().includes(filter.toLowerCase());
    let matchesDate = true;
    if (dateFilter) {
      // a.date UTC ise, sadece yyyy-mm-dd kısmını karşılaştır
      const apptDate = new Date(a.date);
      const apptDateStr = apptDate.toISOString().slice(0, 10);
      matchesDate = apptDateStr === dateFilter;
    }
    return matchesText && matchesDate;
  });

  return (
    <div className="container mt-5">
      <h2>Appointments</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <div className="row mb-2">
        <div className="col-md-4 mb-2">
          <input
            type="date"
            className="form-control"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
            placeholder="Tarih seç"
          />
        </div>
        <div className="col-md-8">
          <input
            className="form-control"
            placeholder="Search by pet, vet or status"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>
      </div>
      <div className="row">
        {filtered.map(a => (
          <div className="col-md-6 mb-4" key={a._id}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">
                  {a.petId?.name} 
                  <span className={`badge bg-${statusColor(a.status)} ms-2`}>
                    {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                  </span>
                </h5>
                <p className="card-text">Vet: {a.vetId?.name}</p>
                <p className="card-text">Date: {new Date(a.date).toLocaleString()}</p>
                {a.notes && <p className="card-text">Notes: {a.notes}</p>}

                {role === 'owner' && a.status === 'pending' && (
                  <button className="btn btn-outline-danger btn-sm" onClick={() => handleCancel(a._id)}>
                    Cancel
                  </button>
                )}

                {role === 'vet' && a.status === 'pending' && (
                  <>
                    <button className="btn btn-success btn-sm me-2" onClick={() => handleStatus(a._id, 'approved')}>Approve</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleStatus(a._id, 'rejected')}>Reject</button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AppointmentsPage;
