import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UserPanel() {
  const [pets, setPets] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    // Fetch user info from token
    const userId = JSON.parse(atob(token.split('.')[1])).userId;
    // Fetch pets
    axios.get(`http://localhost:5001/pets/owner/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setPets(res.data))
      .catch(() => setError('Failed to fetch pets'));
    // Fetch appointments
    axios.get('http://localhost:5001/appointments', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setAppointments(res.data.filter(a => a.petId.ownerId === userId)))
      .catch(() => setError('Failed to fetch appointments'));
  }, []);

  return (
    <div className="container mt-5">
      <h2>User Panel</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <h4>Your Pets</h4>
      <ul>
        {pets.map(pet => (
          <li key={pet._id}>{pet.name} ({pet.species}, {pet.age} years)</li>
        ))}
      </ul>
      <h4>Your Appointments</h4>
      <ul>
        {appointments.map(app => (
          <li key={app._id}>{app.date} {app.time} - Status: {app.status}</li>
        ))}
      </ul>
    </div>
  );
}

export default UserPanel;
