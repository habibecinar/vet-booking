import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminPanel() {
  const [vets, setVets] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5001/vets')
      .then(res => setVets(res.data))
      .catch(() => setError('Failed to fetch vets'));
    axios.get('http://localhost:5001/appointments')
      .then(res => setAppointments(res.data))
      .catch(() => setError('Failed to fetch appointments'));
  }, []);

  const handleAddVet = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await axios.post('http://localhost:5001/vets', { name, email, password });
      setSuccess('Veterinarian added!');
      setName(''); setEmail(''); setPassword('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add vet');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Admin Panel</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <h4>Add Veterinarian</h4>
      <form onSubmit={handleAddVet} className="mb-4" style={{maxWidth:400}}>
        <input type="text" className="form-control mb-2" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
        <input type="email" className="form-control mb-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" className="form-control mb-2" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button className="btn btn-primary w-100" type="submit">Add Vet</button>
      </form>
      <h4>All Veterinarians</h4>
      <ul>
        {vets.map(vet => (
          <li key={vet._id}>{vet.name} ({vet.email})</li>
        ))}
      </ul>
      <h4>All Appointments</h4>
      <ul>
        {appointments.map(app => (
          <li key={app._id}>{app.date} {app.time} - Status: {app.status}</li>
        ))}
      </ul>
    </div>
  );
}

export default AdminPanel;
