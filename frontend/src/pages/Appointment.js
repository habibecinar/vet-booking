import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
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
    // eslint-disable-next-line
  }, []);

  const fetchPets = async () => {
    try {
      const res = await axios.get('/api/pets');
      setPets(res.data);
    } catch (err) {
      console.error('Pet loading error:', err);
      setPets([]);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await axios.get('/api/appointments');
      setAppointments(res.data);
    } catch (err) {
      console.error('Appointment loading error:', err);
      setAppointments([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/appointments', { date, time, note, petId });
      setDate(''); 
      setTime(''); 
      setNote(''); 
      setPetId('');
      fetchAppointments();
      toast.success('📅 Appointment created successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create appointment');
    }
  };

  return (
    <div className="page">
      <h2>Book Appointment</h2>
      <form onSubmit={handleSubmit}>
        <label>Date:</label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} required />

        <label>Time:</label>
        <input type="time" value={time} onChange={e => setTime(e.target.value)} required />

        <label>Pet:</label>
        <select value={petId} onChange={e => setPetId(e.target.value)} required>
          <option value="">Select</option>
          {pets.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
        </select>

        <label>Note:</label>
        <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Notes about the appointment..." />

        <button type="submit">Create Appointment</button>
      </form>

      <h3>My Appointments</h3>
      <ul>
        {appointments.length === 0 ? (
          <li>No appointments yet</li>
        ) : (
          appointments.map(a => (
            <li key={a._id}>
              {new Date(a.date).toLocaleDateString()} - {a.time} → <b>{a.status}</b>
              {a.note && <p style={{fontSize: 12, color: '#666'}}>Note: {a.note}</p>}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default Appointments;
