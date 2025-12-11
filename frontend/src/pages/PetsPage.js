import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function PetsPage() {
  const [pets, setPets] = useState([]);
  const [form, setForm] = useState({ name: '', species: '', age: '' });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', species: '', age: '' });

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const res = await axios.get('/api/pets');
      setPets(res.data);
    } catch (err) {
      console.error('Pet loading error:', err.response || err);
      const errorMsg = err.response?.data?.error || err.message || 'Failed to load pets';
      toast.error(errorMsg);
    }
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddPet = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!form.name || !form.species || !form.age) {
      toast.warning('Please fill all fields');
      return;
    }
    
    if (form.age < 0 || form.age > 50) {
      toast.error('Age must be between 0-50');
      return;
    }
    
    try {
      const res = await axios.post('/api/pets', form);
      toast.success('🐾 Pet added successfully!');
      setPets(prev => [...prev, res.data]);
      setForm({ name: '', species: '', age: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add pet');
    }
  };

  const handleDeletePet = async (petId) => {
    if (!window.confirm('Are you sure you want to delete this pet?')) return;
    
    try {
      await axios.delete(`/api/pets/${petId}`);
      toast.success('Pet deleted successfully!');
      setPets(prev => prev.filter(p => p._id !== petId));
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete pet');
    }
  };

  const startEdit = (pet) => {
    setEditId(pet._id);
    setEditForm({ name: pet.name, species: pet.species, age: pet.age });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditForm({ name: '', species: '', age: '' });
  };

  const handleEditChange = e => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditPet = async (e) => {
    e.preventDefault();
    
    // Validation
    if (editForm.age < 0 || editForm.age > 50) {
      toast.error('Age must be between 0-50');
      return;
    }
    
    try {
      const res = await axios.put(`/api/pets/${editId}`, editForm);
      toast.success('Pet updated successfully!');
      setPets(prev => prev.map(p => p._id === editId ? res.data : p));
      setEditId(null);
      setEditForm({ name: '', species: '', age: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update pet');
    }
  };

  return (
    <div className="page" style={{ maxWidth: 1000, margin: '0 auto', padding: 20 }}>
      <h2>🐾 My Pets</h2>
      
      {/* Pet Add Form */}
      <div style={{ 
        background: '#f8f9fa', 
        padding: 20, 
        borderRadius: 8, 
        marginBottom: 30 
      }}>
        <h3>Add New Pet</h3>
        <form onSubmit={handleAddPet}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 15 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 5, fontWeight: 500 }}>Name:</label>
              <input 
                name="name" 
                type="text" 
                className="form-control" 
                placeholder="e.g., Fluffy" 
                value={form.name} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 5, fontWeight: 500 }}>Species:</label>
              <input 
                name="species" 
                type="text" 
                className="form-control" 
                placeholder="e.g., Cat, Dog" 
                value={form.species} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 5, fontWeight: 500 }}>Age:</label>
              <input 
                name="age" 
                type="number" 
                className="form-control" 
                placeholder="e.g., 3" 
                value={form.age} 
                onChange={handleChange} 
                min="0" 
                max="50" 
                required 
              />
            </div>
          </div>
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ marginTop: 15 }}
          >
            Add Pet
          </button>
        </form>
      </div>

      {/* Pet List */}
      <h3>Pet List ({pets.length})</h3>
      {pets.length === 0 ? (
        <p style={{ color: '#666', fontStyle: 'italic' }}>No pets added yet</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {pets.map(pet => (
            <div 
              key={pet._id} 
              style={{ 
                border: '1px solid #ddd', 
                borderRadius: 8, 
                padding: 15, 
                background: '#fff' 
              }}
            >
              {editId === pet._id ? (
                // Edit Mode
                <form onSubmit={handleEditPet}>
                  <input 
                    name="name" 
                    className="form-control mb-2" 
                    value={editForm.name} 
                    onChange={handleEditChange} 
                    required 
                  />
                  <input 
                    name="species" 
                    className="form-control mb-2" 
                    value={editForm.species} 
                    onChange={handleEditChange} 
                    required 
                  />
                  <input 
                    name="age" 
                    type="number" 
                    className="form-control mb-2" 
                    value={editForm.age} 
                    onChange={handleEditChange} 
                    min="0" 
                    max="50" 
                    required 
                  />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button type="submit" className="btn btn-success btn-sm" style={{ flex: 1 }}>
                      Save
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-secondary btn-sm" 
                      onClick={cancelEdit}
                      style={{ flex: 1 }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                // View Mode
                <>
                  <h4 style={{ margin: 0, marginBottom: 10 }}>🐾 {pet.name}</h4>
                  <p style={{ margin: 0, color: '#666' }}>
                    <strong>Species:</strong> {pet.species}
                  </p>
                  <p style={{ margin: 0, color: '#666', marginBottom: 15 }}>
                    <strong>Age:</strong> {pet.age}
                  </p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button 
                      className="btn btn-warning btn-sm" 
                      onClick={() => startEdit(pet)}
                      style={{ flex: 1 }}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-danger btn-sm" 
                      onClick={() => handleDeletePet(pet._id)}
                      style={{ flex: 1 }}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PetsPage;
