import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Appointment from './pages/Appointment';
import UserPanel from './pages/UserPanel';
import AdminPanel from './pages/AdminPanel';
import AppointmentsDashboard from './pages/AppointmentsDashboard';

function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand navbar-light bg-light px-3">
        <Link className="navbar-brand" to="/">Vet Booking</Link>
        <div className="navbar-nav">
        <Link className="nav-link" to="/login"></Link>
        <Link className="nav-link" to="/register"></Link>
        <Link className="nav-link" to="/appointment"></Link>
        <Link className="nav-link" to="/panel"></Link>
        <Link className="nav-link" to="/admin"></Link>
        <Link className="nav-link" to="/dashboard"></Link>
        </div>
      </nav>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/panel" element={<UserPanel />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/dashboard" element={<AppointmentsDashboard />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
