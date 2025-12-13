import React, { useEffect, useState } from 'react';
// ... QuickAppointmentForm fonksiyonu sadece dosya başında tanımlı kalacak ...
import axios from 'axios';
import { Link } from 'react-router-dom';
import './dashboard.css';

function Dashboard() {
  const [role, setRole] = useState('');
  const [counts, setCounts] = useState({ pets: 0, appointments: 0, pending: 0, patients: 0 });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setRole(decoded.role);

      if (decoded.role === 'owner') {
        Promise.all([
          axios.get(`/pets/owner/${decoded.userId}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`/api/appointments`, { headers: { Authorization: `Bearer ${token}` } })
        ]).then(([petsRes, appRes]) => {
          setCounts({
            pets: petsRes.data.length,
            appointments: appRes.data.length,
            pending: appRes.data.filter(a => a.status === 'pending').length,
            patients: 0
          });
        });
      } else if (decoded.role === 'vet') {
        axios.get(`/api/appointments`, { headers: { Authorization: `Bearer ${token}` } })
          .then(res => {
            setCounts({
              pets: 0,
              appointments: res.data.length,
              pending: res.data.filter(a => a.status === 'pending').length,
              patients: [...new Set(res.data.map(a => a.petId?._id))].length
            });
          });
      }
    }
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <h2>{role === 'vet' ? 'Veterinarian Dashboard' : 'My Dashboard'}</h2>

        <div className="row mb-4">
          {role === 'owner' && (
            <>
              <div className="col-md-3 mb-3">
                <div className="card text-center p-3">
                  <h5>My Pets</h5>
                  <div className="display-6">{counts.pets}</div>
                  <Link to="/pets" className="btn btn-link">View</Link>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <div className="card text-center p-3">
                  <h5>Appointments</h5>
                  <div className="display-6">{counts.appointments}</div>
                  <Link to="/appointments" className="btn btn-link">View</Link>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <div className="card text-center p-3">
                  <h5>Pending</h5>
                  <div className="display-6">{counts.pending}</div>
                  <Link to="/appointments" className="btn btn-link">View</Link>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <div className="card text-center p-3">
                  <h5>Find a Vet</h5>
                  <div className="display-6"><i className="bi bi-search"></i></div>
                  <Link to="/vets" className="btn btn-link">Go</Link>
                </div>
              </div>
              <div className="col-12 mt-4">
                <div className="card p-4">
                  <h5>Quick Appointment Booking</h5>
                  <QuickAppointmentForm />
                </div>
              </div>
            </>
          )}

          {role === 'vet' && (
            <>
              <div className="col-md-3 mb-3">
                <div className="card text-center p-3">
                  <h5>Today's Appointments</h5>
                  <div className="display-6">{counts.appointments}</div>
                  <Link to="/appointments" className="btn btn-link">View</Link>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <div className="card text-center p-3">
                  <h5>Pending Approvals</h5>
                  <div className="display-6">{counts.pending}</div>
                  <Link to="/appointments" className="btn btn-link">View</Link>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <div className="card text-center p-3">
                  <h5>My Patients</h5>
                  <div className="display-6">{counts.patients}</div>
                  <Link to="/pets" className="btn btn-link">View</Link>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <div className="card text-center p-3">
                  <h5>Profile</h5>
                  <div className="display-6"><i className="bi bi-person"></i></div>
                  <Link to="/vets" className="btn btn-link">Edit</Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}




// Hızlı randevu formu bileşeni
function QuickAppointmentForm() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');
  const [pets, setPets] = useState([]);
  const [petId, setPetId] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const decoded = JSON.parse(atob(token.split('.')[1]));
    axios.get(`/pets/owner/${decoded.userId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setPets(res.data))
      .catch(() => setPets([]));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/appointments', { date, time, note, petId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Randevu oluşturuldu!');
      setDate(''); setTime(''); setNote(''); setPetId('');
    } catch (err) {
      setError('Randevu oluşturulamadı');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="row g-2 align-items-end">
      <div className="col-md-3">
        <label className="form-label">Tarih</label>
        <input type="date" className="form-control" value={date} onChange={e => setDate(e.target.value)} required />
      </div>
      <div className="col-md-2">
        <label className="form-label">Saat</label>
        <input type="time" className="form-control" value={time} onChange={e => setTime(e.target.value)} required />
      </div>
      <div className="col-md-3">
        <label className="form-label">Evcil Hayvan</label>
        <select className="form-select" value={petId} onChange={e => setPetId(e.target.value)} required>
          <option value="">Seçiniz</option>
          {pets.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
        </select>
      </div>
      <div className="col-md-3">
        <label className="form-label">Not</label>
        <input className="form-control" value={note} onChange={e => setNote(e.target.value)} />
      </div>
      <div className="col-md-1">
        <button className="btn btn-primary w-100" type="submit">Oluştur</button>
      </div>
      {success && <div className="col-12 text-success mt-2">{success}</div>}
      {error && <div className="col-12 text-danger mt-2">{error}</div>}
    </form>
  );
}

export default Dashboard;
