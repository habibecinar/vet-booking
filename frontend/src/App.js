
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <nav className="navbar navbar-expand navbar-light bg-light px-3">
        <Link className="navbar-brand" to="/">Vet Booking</Link>
        <div className="navbar-nav">
          <Link className="nav-link" to="/login">Giriş</Link>
          <Link className="nav-link" to="/register">Kayıt</Link>
        </div>
      </nav>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
