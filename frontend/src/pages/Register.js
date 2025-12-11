import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Auth.css';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'owner' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Password validation
    if (form.password.length < 6) {
      toast.warning('⚠️ Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    try {
      await axios.post('http://localhost:5001/auth/register', form);
      toast.success('🎉 Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role) => {
    return role === 'owner' ? '👤' : '👨‍⚕️';
  };

  const getRoleText = (role) => {
    return role === 'owner' ? 'Pet Owner' : 'Veterinarian';
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-card-header">
          <div className="icon">🐾</div>
          <h2>Create Account</h2>
          <p>Join our veterinary appointment system</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              <span className="icon">🎭</span>
              Account Type
            </label>
            <select 
              className="form-select" 
              name="role" 
              value={form.role} 
              onChange={handleChange}
            >
              <option value="owner">👤 Pet Owner</option>
              <option value="vet">👨‍⚕️ Veterinarian</option>
            </select>
            <div className="role-badge">
              {getRoleIcon(form.role)} Registering as {getRoleText(form.role)}
            </div>
          </div>

          <div className="form-group">
            <label>
              <span className="icon">👤</span>
              Full Name
            </label>
            <input 
              name="name" 
              type="text" 
              className="form-input"
              placeholder="Your full name" 
              value={form.name} 
              onChange={handleChange} 
              required 
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label>
              <span className="icon">📧</span>
              Email
            </label>
            <input 
              name="email" 
              type="email" 
              className="form-input"
              placeholder="example@email.com" 
              value={form.email} 
              onChange={handleChange} 
              required 
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label>
              <span className="icon">🔒</span>
              Password
            </label>
            <input 
              name="password" 
              type="password" 
              className="form-input"
              placeholder="At least 6 characters" 
              value={form.password} 
              onChange={handleChange} 
              required 
              autoComplete="new-password"
              minLength="6"
            />
          </div>

          <button 
            className="auth-button" 
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <div className="auth-button-loading">
                <div className="spinner"></div>
                <span>Registering...</span>
              </div>
            ) : (
              'Register'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
