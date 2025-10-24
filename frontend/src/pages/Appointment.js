import React, { useState } from 'react';
import axios from 'axios';

function Appointment() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [vetId, setVetId] = useState('');
  const [petId, setPetId] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5001/appointments', { date, time, vetId, petId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Appointment created successfully!');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create appointment');
    }
  };

  return (
    <div className="container mt-5" style={{maxWidth:400}}>
      <h2>Book Appointment</h2>
      <form onSubmit={handleSubmit}>
        <input type="date" className="form-control mb-2" value={date} onChange={e => setDate(e.target.value)} required />
        <input type="time" className="form-control mb-2" value={time} onChange={e => setTime(e.target.value)} required />
        <input type="text" className="form-control mb-2" placeholder="Veterinarian ID" value={vetId} onChange={e => setVetId(e.target.value)} required />
        <input type="text" className="form-control mb-2" placeholder="Pet ID" value={petId} onChange={e => setPetId(e.target.value)} required />
        <button className="btn btn-primary w-100" type="submit">Book</button>
        {error && <div className="alert alert-danger mt-2">{error}</div>}
        {success && <div className="alert alert-success mt-2">{success}</div>}
      </form>
    </div>
  );
}

export default Appointment;
