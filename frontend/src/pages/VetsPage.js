import React, { useEffect, useState } from 'react';
import axios from 'axios';

function VetsPage() {
  const [vets, setVets] = useState([]);
  const [role, setRole] = useState('owner');
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filter, setFilter] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '', specialty: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setRole(decoded.role);
      setUserId(decoded.userId);
    }
    axios.get('http://localhost:5001/vets', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setVets(res.data))
      .catch(() => setError('Failed to fetch vets'));
  }, []);

  // Filtreleme
  const filteredVets = vets.filter(vet =>
    vet.name.toLowerCase().includes(filter.toLowerCase()) ||
    vet.specialty?.toLowerCase().includes(filter.toLowerCase())
  );

  // Profil düzenleme (sadece kendi profili için)
  const startEdit = (vet) => {
    setEditForm({ name: vet.name, email: vet.email, phone: vet.phone, specialty: vet.specialty });
    setEditMode(true);
  };
  const handleEditChange = e => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  const handleEditProfile = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`http://localhost:5001/vets/${userId}`, editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Profile updated!');
      setVets(prev => prev.map(v => v._id === userId ? res.data : v));
      setEditMode(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Vets</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <input className="form-control mb-3" placeholder="Search by name or specialty" value={filter} onChange={e => setFilter(e.target.value)} />
      <div className="row">
        {filteredVets.map(vet => (
          <div className="col-md-4 mb-4" key={vet._id}>
            <div className="card">
              <img src={vet.photo || '/images/default-vet.jpg'} alt={vet.name} className="card-img-top" style={{height:180, objectFit:'cover'}} />
              <div className="card-body">
                <h5 className="card-title">{vet.name}</h5>
                <p className="card-text">{vet.specialty}</p>
                <p className="card-text"><small>{vet.email} | {vet.phone}</small></p>
                {role === 'vet' && vet._id === userId && !editMode && (
                  <button className="btn btn-outline-primary btn-sm" onClick={() => startEdit(vet)}>Edit Profile</button>
                )}
                {role === 'vet' && vet._id === userId && editMode && (
                  <form onSubmit={handleEditProfile}>
                    <input name="name" className="form-control mb-1" value={editForm.name} onChange={handleEditChange} required />
                    <input name="email" className="form-control mb-1" value={editForm.email} onChange={handleEditChange} required />
                    <input name="phone" className="form-control mb-1" value={editForm.phone} onChange={handleEditChange} required />
                    <input name="specialty" className="form-control mb-1" value={editForm.specialty} onChange={handleEditChange} />
                    <button className="btn btn-success btn-sm me-2" type="submit">Save</button>
                    <button className="btn btn-secondary btn-sm" type="button" onClick={() => setEditMode(false)}>Cancel</button>
                  </form>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VetsPage;
