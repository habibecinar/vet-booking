import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-main">
      {/* Animated Background Wave */}
      <svg className="home-wave" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path 
          fill="#667eea" 
          fillOpacity="0.3"
          d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </svg>

      <svg className="home-wave home-wave-2" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path 
          fill="#764ba2" 
          fillOpacity="0.2"
          d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,213.3C672,224,768,224,864,208C960,192,1056,160,1152,154.7C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </svg>

      {/* Hero Section */}
      <div className="home-container">
        <div className="home-hero">
          <div className="home-hero-content">
            <div className="home-logo">
              <span className="logo-icon">🐾</span>
              <span className="logo-text">VetBooking</span>
            </div>
            <h1 className="home-title">
              Best Care for
              <br />
              <span className="gradient-text">Your Pet</span>
            </h1>
            <p className="home-description">
              Manage your pet's health easily with our modern and secure veterinary appointment system
            </p>

            {/* Feature Pills */}
            <div className="feature-pills">
              <div className="pill">
                <span className="pill-icon">⚡</span>
                <span>Quick Booking</span>
              </div>
              <div className="pill">
                <span className="pill-icon">🔒</span>
                <span>Secure</span>
              </div>
              <div className="pill">
                <span className="pill-icon">📱</span>
                <span>Mobile Friendly</span>
              </div>
            </div>

            {/* Auth Buttons */}
            <div className="home-auth-buttons">
              <button 
                className="auth-btn primary" 
                onClick={() => navigate('/login')}
              >
                <span className="btn-icon">🔐</span>
                Login
              </button>
              <button 
                className="auth-btn secondary" 
                onClick={() => navigate('/register')}
              >
                <span className="btn-icon">✨</span>
                Register
              </button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="home-hero-image">
            <div className="image-wrapper">
              <div className="image-glow"></div>
              <img
                src="/images/womanwithdog.png"
                alt="Pet Care"
                className="hero-img"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<div class="placeholder-image"><span class="placeholder-icon">🐕</span><p>Veterinary & Pet Care</p></div>';
                }}
              />
            </div>

            {/* Floating Cards */}
            <div className="floating-card card-1">
              <div className="card-icon">📅</div>
              <div className="card-content">
                <h4>Easy Booking</h4>
                <p>Fast and practical</p>
              </div>
            </div>

            <div className="floating-card card-2">
              <div className="card-icon">👨‍⚕️</div>
              <div className="card-content">
                <h4>Expert Vets</h4>
                <p>Professional service</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="features-section">
          <div className="feature-card">
            <div className="feature-icon">🐾</div>
            <h3>Pet Management</h3>
            <p>Keep all your pet information in one place</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3>Appointment Tracking</h3>
            <p>Easily create and track your appointments</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💊</div>
            <h3>Health History</h3>
            <p>Safely store veterinary records</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
