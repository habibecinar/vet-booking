import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const res = await axios.get('/api/appointments');
    setAppointments(res.data);
  };

  const updateStatus = async (id, status) => {
    await axios.patch(`/api/appointments/${id}`, { status });
    fetchAppointments();
  };

  return (
    <div className="page">
      <h2>Randevu Yönetimi</h2>
      <table>
        <thead>
          <tr>
            <th>Hayvan</th>
            <th>Sahibi</th>
            <th>Tarih</th>
            <th>Saat</th>
            <th>Durum</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(a => (
            <tr key={a._id}>
              <td>{a.petId?.name}</td>
              <td>{a.ownerId?.name}</td>
              <td>{new Date(a.date).toLocaleDateString()}</td>
              <td>{a.time}</td>
              <td>{a.status}</td>
              <td>
                {a.status === 'pending' && (
                  <>
                    <button onClick={() => updateStatus(a._id, 'approved')}>Onayla</button>
                    <button onClick={() => updateStatus(a._id, 'cancelled')}>Reddet</button>
                  </>
                )}
                {a.status === 'approved' && (
                  <button onClick={() => updateStatus(a._id, 'completed')}>Tamamla</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


export default AdminAppointments;
