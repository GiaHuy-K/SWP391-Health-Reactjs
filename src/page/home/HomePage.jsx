import React, { useState } from 'react';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../../config/AuthContext';

const HomePage = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setShowDropdown(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowDropdown(false);
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="homepage-container">
      <div className="layout-container">
        <header className="header">
          <div className="header-content">
            <div className="logo-section">
              <div className="logo-icon">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor"></path>
                </svg>
              </div>
              <h2 className="logo-text">SchoolMed</h2>
            </div>
            <div className="nav-section">
              <div className="nav-links">
                <a className="nav-link" href="#home">Home</a>
                <a className="nav-link" href="#features">Features</a>
                <a className="nav-link" href="#contact">Contact</a>
                <a className="nav-link" href="#about">About Us</a>
                <a className="nav-link" href="#blog">Blog</a>
              </div>
              <div className="auth-section">
                {!isAuthenticated ? (
                  <button className="login-btn" onClick={handleLogin}>
                    <span>Login</span>
                  </button>
                ) : (
                  <div className="profile-section">
                    <FaUserCircle 
                      className="profile-icon" 
                      onClick={() => setShowDropdown(!showDropdown)}
                    />
                    {showDropdown && (
                      <div className="dropdown-menu">
                        <button onClick={handleProfileClick}>Hồ sơ</button>
                        <button onClick={handleLogout}>Đăng xuất</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="main-content">
          <div className="content-container">
            <div className="hero-section" id="home">
              <div className="hero-content">
                <div className="hero-text">
                  <h1 className="hero-title">
                    Welcome to SchoolMed
                  </h1>
                  <h2 className="hero-subtitle">
                    Your comprehensive solution for managing school health records and promoting student well-being.
                  </h2>
                </div>
                <button className="cta-button" onClick={handleGetStarted}>
                  <span>Get Started</span>
                </button>
              </div>
            </div>

            <h2 className="section-title" id="about">About Our School</h2>
            <p className="section-text">
              Our school is dedicated to providing a safe and healthy environment for all students. We offer a range of health services and resources to support their physical and
              mental well-being. Our team of experienced health professionals is committed to ensuring that every student has access to the care they need to thrive.
            </p>

            <h2 className="section-title" id="features">Health Documents</h2>
            <p className="section-text">
              Access important health documents and resources related to school health policies, procedures, and guidelines. Stay informed about health updates and recommendations
              for students and staff.
            </p>

            <div className="documents-grid">
              <div className="document-card">
                <div className="document-image health-guidelines"></div>
                <div className="document-content">
                  <p className="document-title">Health Guidelines</p>
                  <p className="document-description">Comprehensive guidelines for maintaining a healthy school environment.</p>
                </div>
              </div>
              <div className="document-card">
                <div className="document-image emergency-procedures"></div>
                <div className="document-content">
                  <p className="document-title">Emergency Procedures</p>
                  <p className="document-description">Step-by-step procedures for handling health emergencies.</p>
                </div>
              </div>
              <div className="document-card">
                <div className="document-image student-forms"></div>
                <div className="document-content">
                  <p className="document-title">Student Health Forms</p>
                  <p className="document-description">Essential forms for student health information and consent.</p>
                </div>
              </div>
            </div>

            <h2 className="section-title" id="blog">Health Blog</h2>
            <p className="section-text">
              Read our blog for the latest articles, tips, and advice on student health and well-being. Learn from experienced health professionals and stay up-to-date on important
              health topics.
            </p>

            <div className="blog-section">
              <div className="blog-card">
                <div className="blog-content">
                  <div className="blog-text">
                    <p className="blog-title">Promoting Mental Health in Schools</p>
                    <p className="blog-description">Strategies for supporting student mental health and creating a positive school climate.</p>
                  </div>
                  <button className="read-more-btn">
                    <span>Read More</span>
                  </button>
                </div>
                <div className="blog-image mental-health"></div>
              </div>

              <div className="blog-card">
                <div className="blog-content">
                  <div className="blog-text">
                    <p className="blog-title">Nutrition Tips for Students</p>
                    <p className="blog-description">Healthy eating habits to boost student energy and focus.</p>
                  </div>
                  <button className="read-more-btn">
                    <span>Read More</span>
                  </button>
                </div>
                <div className="blog-image nutrition"></div>
              </div>

              <div className="blog-card">
                <div className="blog-content">
                  <div className="blog-text">
                    <p className="blog-title">Preventing Common Illnesses</p>
                    <p className="blog-description">Tips for preventing the spread of common illnesses in schools.</p>
                  </div>
                  <button className="read-more-btn">
                    <span>Read More</span>
                  </button>
                </div>
                <div className="blog-image prevention"></div>
              </div>
            </div>
          </div>
        </div>

        <footer className="footer">
          <div className="footer-container">
            <div className="footer-content">
              <div className="footer-links">
                <a className="footer-link" href="#">Privacy Policy</a>
                <a className="footer-link" href="#">Terms of Service</a>
                <a className="footer-link" href="#">Contact Us</a>
              </div>
              <p className="footer-copyright">@2024 SchoolMed. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;