import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [role, setRole] = useState('owner');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5001/auth/login', { email, password, role });
      localStorage.setItem('token', res.data.token);
      alert('Giriş başarılı!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Giriş başarısız');
    }
  };

  return (
    <div className="home-auth-card" style={{margin:'40px auto', maxWidth:400}}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label style={{fontWeight:500, marginRight:8}}>Giriş Tipi:</label>
          <select className="form-control" value={role} onChange={e => setRole(e.target.value)} style={{marginBottom:8}}>
            <option value="owner">Kullanıcı</option>
            <option value="vet">Veteriner Hekim</option>
          </select>
        </div>
        <input type="email" className="form-control mb-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" className="form-control mb-2" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button className="btn btn-primary w-100" type="submit">Login</button>
        {error && <div className="alert alert-danger mt-2">{error}</div>}
      </form>
    </div>
  );
}

export default Login;
