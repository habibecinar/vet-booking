import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './components/ProtectedRoute';
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
import AdminAppointments from './pages/AdminAppointments';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* 🏠 Giriş ve kayıt gibi sayfalar */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />

          {/* 🧭 Sidebar'lı sayfalar - Protected */}
          <Route element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route path="/dashboard" element={<AppointmentsDashboard />} />
            <Route path="/pets" element={<PetsPage />} />
            <Route path="/vets" element={<VetsPage />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/admin/appointments" element={
              <ProtectedRoute allowedRoles={['admin', 'vet']}>
                <AdminAppointments />
              </ProtectedRoute>
            } />
          </Route>

          {/* 🧩 Diğer özel paneller - Protected */}
          <Route path="/panel" element={
            <ProtectedRoute>
              <UserPanel />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPanel />
            </ProtectedRoute>
          } />
        </Routes>
        
        {/* Toast Notifications Container */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
