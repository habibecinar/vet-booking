import React, { useState } from 'react';
import axios from 'axios';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'owner' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await axios.post('http://localhost:5001/auth/register', form);
      setSuccess('Registration successful!');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="home-auth-card" style={{margin:'40px auto', maxWidth:400}}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" type="text" className="form-control mb-2" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="email" type="email" className="form-control mb-2" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" className="form-control mb-2" placeholder="Password" value={form.password} onChange={handleChange} required />
        <button className="btn btn-outline-primary w-100" type="submit">Register</button>
        {error && <div className="alert alert-danger mt-2">{error}</div>}
        {success && <div className="alert alert-success mt-2">{success}</div>}
      </form>
    </div>
  );
}

export default Register;
