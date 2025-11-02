import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import UserPanel from './pages/UserPanel';
import AdminPanel from './pages/AdminPanel';
import AppointmentsDashboard from './pages/AppointmentsDashboard';
import PetsPage from './pages/PetsPage';
import VetsPage from './pages/VetsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import DashboardLayout from './layouts/DashboardLayout';
import Appointment from './pages/Appointment';
import AdminAppointments from './pages/AdminAppointments';

function App() {
  return (
    <Router>
      <Routes>
        {/* 🏠 Giriş ve kayıt gibi sayfalar */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />

        {/* 🧭 Sidebar’lı sayfalar */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<AppointmentsDashboard />} />
          <Route path="/pets" element={<PetsPage />} />
          <Route path="/vets" element={<VetsPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/admin/appointments" element={<AdminAppointments />} />
        </Route>

        {/* 🧩 Diğer özel paneller */}
        <Route path="/panel" element={<UserPanel />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
