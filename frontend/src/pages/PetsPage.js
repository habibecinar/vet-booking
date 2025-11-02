import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function PetsPage() {
  const [pets, setPets] = useState([]);
  const [form, setForm] = useState({ name: '', species: '', age: '', notes: '', photo: '' });
  const [role, setRole] = useState('owner');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Token'dan rolü ve userId'yi al
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setRole(decoded.role);
        // Owner ise kendi petlerini, vet ise randevu aldığı petleri çek
        if (decoded.role === 'owner') {
          axios.get(`/pets/owner/${decoded.userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
            .then(res => setPets(res.data))
            .catch(() => setError('Failed to fetch pets'));
        } else if (decoded.role === 'vet') {
          axios.get('/appointments', {
            headers: { Authorization: `Bearer ${token}` }
          })
            .then(res => {
              // Vet'in randevu aldığı petleri bul
              const myPets = res.data
                .filter(a => a.vetId._id === decoded.userId)
                .map(a => a.petId);
              setPets(myPets);
            })
            .catch(() => setError('Failed to fetch pets'));
        }
      }
    } catch {}
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddPet = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      const token = localStorage.getItem('token');
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const res = await axios.post('/pets', { ...form, ownerId: decoded.userId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Pet added!');
      setPets(prev => [...prev, res.data]);
      setForm({ name: '', species: '', age: '', notes: '', photo: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add pet');
    }
  };

  // Pet silme
  const handleDeletePet = async (petId) => {
    if (!window.confirm('Are you sure you want to delete this pet?')) return;
    setError(''); setSuccess('');
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/pets/${petId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Pet deleted!');
      setPets(prev => prev.filter(p => p._id !== petId));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete pet');
    }
  };

  // Pet düzenleme (modal veya inline form ile yapılabilir, burada örnek inline):
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', species: '', age: '', notes: '' });

  const startEdit = (pet) => {
    setEditId(pet._id);
    setEditForm({ name: pet.name, species: pet.species, age: pet.age, notes: pet.notes });
  };
  const handleEditChange = e => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  const handleEditPet = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`/pets/${editId}`, editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Pet updated!');
      setPets(prev => prev.map(p => p._id === editId ? res.data : p));
      setEditId(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update pet');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Pets</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      {role === 'owner' && (
        <form onSubmit={handleAddPet} style={{maxWidth:400, marginBottom:24}}>
          <input name="name" type="text" className="form-control mb-2" placeholder="Pet Name" value={form.name} onChange={handleChange} required />
          <input name="species" type="text" className="form-control mb-2" placeholder="Species (e.g. Dog, Cat)" value={form.species} onChange={handleChange} required />
          <input name="age" type="number" className="form-control mb-2" placeholder="Age" value={form.age} onChange={handleChange} required min="0" />
          <input name="notes" type="text" className="form-control mb-2" placeholder="Notes" value={form.notes} onChange={handleChange} />
          {/* Fotoğraf alanı eklenebilir */}
          <button className="btn btn-primary w-100" type="submit">Add Pet</button>
        </form>
      )}
      <div className="row mb-4">
        <div className="col-12 d-flex flex-wrap gap-2">
          <Link to="/appointments" className="btn btn-outline-secondary">My Appointments</Link>
          <Link to="/vets" className="btn btn-outline-secondary">Find a Vet</Link>
        </div>
      </div>
      <div className="row">
        {pets.map((pet, i) => (
          <div className="col-md-4 mb-4" key={pet._id || i}>
            <div className="card" style={{minHeight:260}}>
              <img src={pet.photo || '/images/default-pet.jpg'} alt={pet.name} className="card-img-top" style={{height:180, objectFit:'cover'}} />
              <div className="card-body">
                {role === 'owner' && editId === pet._id ? (
                  <form onSubmit={handleEditPet}>
                    <input name="name" className="form-control mb-1" value={editForm.name} onChange={handleEditChange} required />
                    <input name="species" className="form-control mb-1" value={editForm.species} onChange={handleEditChange} required />
                    <input name="age" type="number" className="form-control mb-1" value={editForm.age} onChange={handleEditChange} required min="0" />
                    <input name="notes" className="form-control mb-1" value={editForm.notes} onChange={handleEditChange} />
                    <button className="btn btn-success btn-sm me-2" type="submit">Save</button>
                    <button className="btn btn-secondary btn-sm" type="button" onClick={() => setEditId(null)}>Cancel</button>
                  </form>
                ) : (
                  <>
                    <h5 className="card-title">{pet.name}</h5>
                    <p className="card-text">{pet.species} - {pet.age} years</p>
                    {pet.notes && <p className="card-text"><small>{pet.notes}</small></p>}
                    {role === 'owner' && (
                      <>
                        <button className="btn btn-outline-primary btn-sm me-2" onClick={() => startEdit(pet)}>Edit</button>
                        <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeletePet(pet._id)}>Delete</button>
                      </>
                    )}
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

export default PetsPage;
