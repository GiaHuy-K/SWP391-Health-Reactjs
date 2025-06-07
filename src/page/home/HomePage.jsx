import React, { useState } from 'react';
import './HomePage.css';
import { Navigate, useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle the form submission
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({
      name: '',
      email: '',
      message: ''
    });
  };
    const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };
  return (
    <div className="homepage">
      {/* Header Section */}
      <header className="header">
        <nav className="navbar">
          <div className="logo">
            <h1>SchoolMed</h1>
          </div>
          <ul className="nav-links">
            <li><a href="/">Trang chủ</a></li>
            <li><a href="#about">Giới thiệu</a></li>
            <li><a href="#features">Tính năng</a></li>
            <li><a href="#contact">Liên hệ</a></li>
          </ul>
        <button className="login-btn" onClick={handleLogin}>Đăng nhập</button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-content">
          <h1>Hệ thống Quản lý Y tế Học đường</h1>
          <p>Giải pháp toàn diện cho việc quản lý sức khỏe học sinh và chăm sóc y tế học đường</p>
          <button className="cta-button">Tìm hiểu thêm</button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <h2>Tính năng nổi bật</h2>
        <div className="features-grid">
          <div className="feature-card">
            <i className="fas fa-user-md"></i>
            <h3>Quản lý hồ sơ sức khỏe</h3>
            <p>Theo dõi và quản lý hồ sơ sức khỏe của học sinh một cách hiệu quả</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-calendar-check"></i>
            <h3>Lịch khám định kỳ</h3>
            <p>Tự động lên lịch và nhắc nhở các buổi khám sức khỏe định kỳ</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-chart-line"></i>
            <h3>Báo cáo thống kê</h3>
            <p>Phân tích và báo cáo chi tiết về tình hình sức khỏe học sinh</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about" id="about">
        <div className="about-content">
          <h2>Về chúng tôi</h2>
          <p>SchoolMed là hệ thống quản lý y tế học đường hiện đại, giúp các trường học quản lý hiệu quả công tác chăm sóc sức khỏe học sinh.</p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact" id="contact">
        <h2>Liên hệ</h2>
        <form className="contact-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Họ và tên"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="message"
            placeholder="Nội dung"
            value={formData.message}
            onChange={handleInputChange}
            required
          ></textarea>
          <button type="submit" className="submit-btn">Gửi tin nhắn</button>
        </form>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>SchoolMed</h3>
            <p>Hệ thống quản lý y tế học đường</p>
          </div>
          <div className="footer-section">
            <h3>Liên kết</h3>
            <ul>
              <li><a href="#home">Trang chủ</a></li>
              <li><a href="#about">Giới thiệu</a></li>
              <li><a href="#features">Tính năng</a></li>
              <li><a href="#contact">Liên hệ</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Liên hệ</h3>
            <p>Email: contact@schoolmed.vn</p>
            <p>Hotline: 1800-1234</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} SchoolMed. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;