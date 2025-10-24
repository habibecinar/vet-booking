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
      setSuccess('Kayıt başarılı!');
    } catch (err) {
      setError(err.response?.data?.error || 'Kayıt başarısız');
    }
  };

  return (
    <div className="container mt-5" style={{maxWidth:400}}>
      <h2>Kayıt Ol</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" type="text" className="form-control mb-2" placeholder="İsim" value={form.name} onChange={handleChange} required />
        <input name="email" type="email" className="form-control mb-2" placeholder="E-posta" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" className="form-control mb-2" placeholder="Şifre" value={form.password} onChange={handleChange} required />
        <select name="role" className="form-control mb-2" value={form.role} onChange={handleChange}>
          <option value="owner">Hayvan Sahibi</option>
          <option value="vet">Veteriner</option>
        </select>
        <button className="btn btn-success w-100" type="submit">Kayıt Ol</button>
        {error && <div className="alert alert-danger mt-2">{error}</div>}
        {success && <div className="alert alert-success mt-2">{success}</div>}
      </form>
    </div>
  );
}

export default Register;
