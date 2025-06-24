import React, { useState } from 'react';
import styles from './HomePage.module.css';
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

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <div className={styles.homepageContainer}>
      <div className={styles.layoutContainer}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.logoSection} onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
              <div className={styles.logoIcon}>
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor"></path>
                </svg>
              </div>
              <h2 className={styles.logoText}>SchoolMed</h2>
            </div>
            <div className={styles.navSection}>
              <div className={styles.navLinks}>
                <a className={styles.navLink} href="#home">Home</a>
                <a className={styles.navLink} href="#features">Features</a>
                <a className={styles.navLink} href="#contact">Contact</a>
                <a className={styles.navLink} href="#about">About Us</a>
                <a className={styles.navLink} href="#blog">Blog</a>
              </div>
              <div className={styles.authSection}>
                {!isAuthenticated ? (
                  <button className={styles.loginBtn} onClick={handleLogin}>
                    <span>Login</span>
                  </button>
                ) : (
                  <div className={styles.profileSection}>
                    <FaUserCircle 
                      className={styles.profileIcon} 
                      onClick={() => setShowDropdown(!showDropdown)}
                    />
                    {showDropdown && (
                      <div className={styles.dropdownMenu}>
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

        <div className={styles.mainContent}>
          <div className={styles.contentContainer}>
            <div className={styles.heroSection} id="home">
              <div className={styles.heroContent}>
                <div className={styles.heroText}>
                  <h1 className={styles.heroTitle}>
                    Welcome to SchoolMed
                  </h1>
                  <h2 className={styles.heroSubtitle}>
                    Your comprehensive solution for managing school health records and promoting student well-being.
                  </h2>
                </div>
                <button className={styles.ctaButton} onClick={handleGetStarted}>
                  <span>Get Started</span>
                </button>
              </div>
            </div>

            <h2 className={styles.sectionTitle} id="about">About Our School</h2>
            <p className={styles.sectionText}>
              Our school is dedicated to providing a safe and healthy environment for all students. We offer a range of health services and resources to support their physical and
              mental well-being. Our team of experienced health professionals is committed to ensuring that every student has access to the care they need to thrive.
            </p>

            <h2 className={styles.sectionTitle} id="features">Health Documents</h2>
            <p className={styles.sectionText}>
              Access important health documents and resources related to school health policies, procedures, and guidelines. Stay informed about health updates and recommendations
              for students and staff.
            </p>

            <div className={styles.documentsGrid}>
              <div className={styles.documentCard}>
                <div className={`${styles.documentImage} ${styles.healthGuidelines}`}></div>
                <div className={styles.documentContent}>
                  <p className={styles.documentTitle}>Health Guidelines</p>
                  <p className={styles.documentDescription}>Comprehensive guidelines for maintaining a healthy school environment.</p>
                </div>
              </div>
              <div className={styles.documentCard}>
                <div className={`${styles.documentImage} ${styles.emergencyProcedures}`}></div>
                <div className={styles.documentContent}>
                  <p className={styles.documentTitle}>Emergency Procedures</p>
                  <p className={styles.documentDescription}>Step-by-step procedures for handling health emergencies.</p>
                </div>
              </div>
              <div className={styles.documentCard}>
                <div className={`${styles.documentImage} ${styles.studentForms}`}></div>
                <div className={styles.documentContent}>
                  <p className={styles.documentTitle}>Student Health Forms</p>
                  <p className={styles.documentDescription}>Essential forms for student health information and consent.</p>
                </div>
              </div>
            </div>

            <h2 className={styles.sectionTitle} id="blog">Health Blog</h2>
            <p className={styles.sectionText}>
              Read our blog for the latest articles, tips, and advice on student health and well-being. Learn from experienced health professionals and stay up-to-date on important
              health topics.
            </p>

            <div className={styles.blogSection}>
              <div className={styles.blogCard}>
                <div className={styles.blogContent}>
                  <div className={styles.blogText}>
                    <p className={styles.blogTitle}>Promoting Mental Health in Schools</p>
                    <p className={styles.blogDescription}>Strategies for supporting student mental health and creating a positive school climate.</p>
                  </div>
                  <button className={styles.readMoreBtn}>
                    <span>Read More</span>
                  </button>
                </div>
                <div className={`${styles.blogImage} ${styles.mentalHealth}`}></div>
              </div>

              <div className={styles.blogCard}>
                <div className={styles.blogContent}>
                  <div className={styles.blogText}>
                    <p className={styles.blogTitle}>Nutrition Tips for Students</p>
                    <p className={styles.blogDescription}>Healthy eating habits to boost student energy and focus.</p>
                  </div>
                  <button className={styles.readMoreBtn}>
                    <span>Read More</span>
                  </button>
                </div>
                <div className={`${styles.blogImage} ${styles.nutrition}`}></div>
              </div>

              <div className={styles.blogCard}>
                <div className={styles.blogContent}>
                  <div className={styles.blogText}>
                    <p className={styles.blogTitle}>Preventing Common Illnesses</p>
                    <p className={styles.blogDescription}>Tips for preventing the spread of common illnesses in schools.</p>
                  </div>
                  <button className={styles.readMoreBtn}>
                    <span>Read More</span>
                  </button>
                </div>
                <div className={`${styles.blogImage} ${styles.prevention}`}></div>
              </div>
            </div>
          </div>
        </div>

        <footer className={styles.footer}>
          <div className={styles.footerContainer}>
            <div className={styles.footerContent}>
              <div className={styles.footerLinks}>
                <a className={styles.footerLink} href="#">Privacy Policy</a>
                <a className={styles.footerLink} href="#">Terms of Service</a>
                <a className={styles.footerLink} href="#">Contact Us</a>
              </div>
              <p className={styles.footerCopyright}>@2024 SchoolMed. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;