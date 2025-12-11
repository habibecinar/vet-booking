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
      console.error('Pet yükleme hatası:', err);
      setPets([]);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await axios.get('/api/appointments');
      setAppointments(res.data);
    } catch (err) {
      console.error('Randevu yükleme hatası:', err);
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
      toast.success('📅 Randevu başarıyla oluşturuldu!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Randevu oluşturulamadı');
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
        <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Randevu ile ilgili notlar..." />

        <button type="submit">Randevu Oluştur</button>
      </form>

      <h3>Randevularım</h3>
      <ul>
        {appointments.length === 0 ? (
          <li>Henüz randevunuz yok</li>
        ) : (
          appointments.map(a => (
            <li key={a._id}>
              {new Date(a.date).toLocaleDateString()} - {a.time} → <b>{a.status}</b>
              {a.note && <p style={{fontSize: 12, color: '#666'}}>Not: {a.note}</p>}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default Appointments;
