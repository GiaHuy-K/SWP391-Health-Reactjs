import React, { useState } from 'react';
import styles from './HomePage.module.css';
import { useNavigate, Link } from 'react-router-dom';
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
    <div className={styles['homepage-container']}>
      <div className={styles['layout-container']}>
        <header className={styles.header}>
          <div className={styles['header-content']}>
            <Link to="/" className={styles['logo-section']}>
              <div className={styles['logo-icon']}>
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor"></path>
                </svg>
              </div>
              <h2 className={styles['logo-text']}>SchoolMed</h2>
            </Link>
            <div className={styles['nav-section']}>
              <div className={styles['nav-links']}>
                <a className={styles['nav-link']} href="#home">Home</a>
                <a className={styles['nav-link']} href="#features">Features</a>
                <a className={styles['nav-link']} href="#contact">Contact</a>
                <a className={styles['nav-link']} href="#about">About Us</a>
                <a className={styles['nav-link']} href="#blog">Blog</a>
              </div>
              <div className={styles['auth-section']}>
                {!isAuthenticated ? (
                  <button className={styles['login-btn']} onClick={handleLogin}>
                    <span>Login</span>
                  </button>
                ) : (
                  <div className={styles['profile-section']}>
                    <FaUserCircle 
                      className={styles['profile-icon']} 
                      onClick={() => setShowDropdown(!showDropdown)}
                    />
                    {showDropdown && (
                      <div className={styles['dropdown-menu']}>
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

        <div className={styles['main-content']}>
          <div className={styles['content-container']}>
            <div className={styles['hero-section']} id="home">
              <div className={styles['hero-content']}>
                <div className={styles['hero-text']}>
                  <h1 className={styles['hero-title']}>
                    Welcome to SchoolMed
                  </h1>
                  <h2 className={styles['hero-subtitle']}>
                    Your comprehensive solution for managing school health records and promoting student well-being.
                  </h2>
                </div>
                <button className={styles['cta-button']} onClick={handleGetStarted}>
                  <span>Get Started</span>
                </button>
              </div>
            </div>

            <h2 className={styles['section-title']} id="about">About Our School</h2>
            <p className={styles['section-text']}>
              Our school is dedicated to providing a safe and healthy environment for all students. We offer a range of health services and resources to support their physical and
              mental well-being. Our team of experienced health professionals is committed to ensuring that every student has access to the care they need to thrive.
            </p>

            <h2 className={styles['section-title']} id="features">Health Documents</h2>
            <p className={styles['section-text']}>
              Access important health documents and resources related to school health policies, procedures, and guidelines. Stay informed about health updates and recommendations
              for students and staff.
            </p>

            <div className={styles['documents-grid']}>
              <div className={styles['document-card']}>
                <div className={`${styles['document-image']} ${styles['health-guidelines']}`}></div>
                <div className={styles['document-content']}>
                  <p className={styles['document-title']}>Health Guidelines</p>
                  <p className={styles['document-description']}>Comprehensive guidelines for maintaining a healthy school environment.</p>
                </div>
              </div>
              <div className={styles['document-card']}>
                <div className={`${styles['document-image']} ${styles['emergency-procedures']}`}></div>
                <div className={styles['document-content']}>
                  <p className={styles['document-title']}>Emergency Procedures</p>
                  <p className={styles['document-description']}>Step-by-step procedures for handling health emergencies.</p>
                </div>
              </div>
              <div className={styles['document-card']}>
                <div className={`${styles['document-image']} ${styles['student-forms']}`}></div>
                <div className={styles['document-content']}>
                  <p className={styles['document-title']}>Student Health Forms</p>
                  <p className={styles['document-description']}>Essential forms for student health information and consent.</p>
                </div>
              </div>
            </div>

            <h2 className={styles['section-title']} id="blog">Health Blog</h2>
            <p className={styles['section-text']}>
              Read our blog for the latest articles, tips, and advice on student health and well-being. Learn from experienced health professionals and stay up-to-date on important
              health topics.
            </p>

            <div className={styles['blog-section']}>
              <div className={styles['blog-card']}>
                <div className={styles['blog-content']}>
                  <div className={styles['blog-text']}>
                    <p className={styles['blog-title']}>Promoting Mental Health in Schools</p>
                    <p className={styles['blog-description']}>Strategies for supporting student mental health and creating a positive school climate.</p>
                  </div>
                  <button className={styles['read-more-btn']}>
                    <span>Read More</span>
                  </button>
                </div>
                <div className={`${styles['blog-image']} ${styles['mental-health']}`}></div>
              </div>

              <div className={styles['blog-card']}>
                <div className={styles['blog-content']}>
                  <div className={styles['blog-text']}>
                    <p className={styles['blog-title']}>Nutrition Tips for Students</p>
                    <p className={styles['blog-description']}>Healthy eating habits to boost student energy and focus.</p>
                  </div>
                  <button className={styles['read-more-btn']}>
                    <span>Read More</span>
                  </button>
                </div>
                <div className={`${styles['blog-image']} ${styles.nutrition}`}></div>
              </div>

              <div className={styles['blog-card']}>
                <div className={styles['blog-content']}>
                  <div className={styles['blog-text']}>
                    <p className={styles['blog-title']}>Preventing Common Illnesses</p>
                    <p className={styles['blog-description']}>Tips for preventing the spread of common illnesses in schools.</p>
                  </div>
                  <button className={styles['read-more-btn']}>
                    <span>Read More</span>
                  </button>
                </div>
                <div className={`${styles['blog-image']} ${styles.prevention}`}></div>
              </div>
            </div>
          </div>
        </div>

        <footer className={styles.footer}>
          <div className={styles['footer-container']}>
            <div className={styles['footer-content']}>
              <div className={styles['footer-links']}>
                <a className={styles['footer-link']} href="#">Privacy Policy</a>
                <a className={styles['footer-link']} href="#">Terms of Service</a>
                <a className={styles['footer-link']} href="#">Contact Us</a>
              </div>
              <p className={styles['footer-copyright']}>@2024 SchoolMed. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;