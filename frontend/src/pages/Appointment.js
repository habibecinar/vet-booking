import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './appointments.css';

function Appointments() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');
  const [pets, setPets] = useState([]);
  const [petId, setPetId] = useState('');
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchPets();
    fetchAppointments();
  }, []);

  const fetchPets = async () => {
    try {
      const token = localStorage.getItem('token');
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const res = await axios.get(`/pets/owner/${decoded.userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPets(res.data);
    } catch (err) {
      setPets([]);
    }
  };

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const res = await axios.get(`/api/appointments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(res.data);
    } catch (err) {
      setAppointments([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/appointments', { date, time, note, petId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDate(''); setTime(''); setNote(''); setPetId('');
      fetchAppointments();
    } catch (err) {
      alert('Failed to create appointment');
    }
  };

  return (
    <div className="page">
      <h2>Randevu Al</h2>
      <form onSubmit={handleSubmit}>
        <label>Tarih:</label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} required />

        <label>Saat:</label>
        <input type="time" value={time} onChange={e => setTime(e.target.value)} required />

        <label>Evcil Hayvan:</label>
        <select value={petId} onChange={e => setPetId(e.target.value)} required>
          <option value="">Seçiniz</option>
          {pets.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
        </select>

        <label>Not:</label>
        <textarea value={note} onChange={e => setNote(e.target.value)} />

        <button type="submit">Randevu Oluştur</button>
      </form>

      <h3>Randevularım</h3>
      <ul>
        {appointments.map(a => (
          <li key={a._id}>
            {new Date(a.date).toLocaleDateString()} - {a.time} → <b>{a.status}</b>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Appointments;
