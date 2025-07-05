import React, { useState } from 'react';
import styles from './HomePage.module.css';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../../config/AuthContext';
import { isParentRole } from '../../config/AuthContext';

const HomePage = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setShowDropdown(false);
  };

  const handleDashboardClick = () => {
    // Điều hướng đến dashboard tương ứng với role
    switch (user?.role) {
      case "Quản trị viên Trường học":
        navigate('/dashboard');
        break;
      case "Quản lý Nhân sự/Nhân viên":
        navigate('/dashboardManager');
        break;
      case "Nhân viên Y tế":
        navigate('/dashboardNurse');
        break;
      default:
        // Parent không có dashboard riêng
        break;
    }
    setShowDropdown(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowDropdown(false);
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      // Điều hướng đến dashboard tương ứng với role
      switch (user?.role) {
        case "Quản trị viên Trường học":
          navigate('/dashboard/overview');
          break;
        case "Quản lý Nhân sự/Nhân viên":
          navigate('/dashboardManager/event-Manager');
          break;
        case "Nhân viên Y tế":
          navigate('/dashboardNurse/event-Nurse');
          break;
        default:
          // Parent không có dashboard riêng
          navigate('/profile');
          break;
      }
    } else {
      navigate('/login');
    }
  };
  const handleNotificationClick = () => {
    // Điều hướng đến trang thông báo 
    navigate('/notifications');
    setShowDropdown(false);
  };
  const handleLogoClick = () => {
    navigate('/');
  };

  // Kiểm tra xem user có phải là Parent không
  const isParent = isParentRole(user);
  
  // Debug log để kiểm tra role
  console.log("User role:", user?.role);
  console.log("LocalStorage userRole:", localStorage.getItem("userRole"));
  console.log("Is Parent:", isParent);

  return (
    <div className={styles.homepageContainer}>
      <div className={styles.layoutContainer}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.logoSection} onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
            <div className={styles.logoIcon}>
            <img
              src="/logo_medical_health_system.jpg"
              alt="SchoolMed Logo"
              style={{ width: 48, height: 48, objectFit: "contain" }}
            />
          </div>
              <h2 className={styles.logoText}>SchoolMed</h2>
            </div>
            <div className={styles.navSection}>
              <div className={styles.navLinks}>
                <a className={styles.navLink} href="#home">Trang chủ</a>
                <a className={styles.navLink} href="#features">Tính năng</a>
                <a className={styles.navLink} href="#contact">Liên hệ</a>
                <a className={styles.navLink} href="#about">Về chúng tôi</a>
                <a className={styles.navLink} href="#blog">Blog sức khỏe</a>
              </div>
              <div className={styles.authSection}>
                {!isAuthenticated ? (
                  <button className={styles.loginBtn} onClick={handleLogin}>
                    <span>Đăng nhập</span>
                  </button>
                ) : (
                  <div className={styles.profileSection}>
                    <FaUserCircle 
                      className={styles.profileIcon} 
                      onClick={() => setShowDropdown(!showDropdown)}
                    />
                    {showDropdown && (
                      <div className={styles.dropdownMenu}>
                        {isParent ? (
                          <>
                            <button onClick={handleProfileClick}>Hồ sơ</button>
                            <button onClick={handleNotificationClick}>Thông Báo</button>
                            <button onClick={handleLogout}>Đăng xuất</button>
                            
                          </>
                        ) : (
                          <>
                            <button onClick={handleDashboardClick}>Dashboard</button>
                            <button onClick={handleProfileClick}>Hồ sơ</button>
                            <button onClick={handleNotificationClick}>Thông Báo</button>
                            <button onClick={handleLogout}>Đăng xuất</button>
                          </>
                        )}
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
                    Chào mừng banh tới với SchoolMed!
                  </h1>
                  <h2 className={styles.heroSubtitle}>
                    Trang web quản lý sức khỏe trường học, giúp quản lý sức khỏe của học sinh và nhân viên trường học.
                  </h2>
                </div>
                <button className={styles.ctaButton} onClick={handleGetStarted}>
                  <span>Bắt đầu</span>
                </button>
              </div>
            </div>

            <h2 className={styles.sectionTitle} id="about">Về chúng tôi</h2>
            <p className={styles.sectionText}>
              Trường chúng tôi đặt ra mục tiêu cung cấp môi trường an toàn và một sức khỏe mạnh cho tất cả học sinh. Chúng tôi cung cấp một loạt dịch vụ và tài nguyên sức khỏe để hỗ trợ sức khỏe vật lý và tâm lý của học sinh. Đội ngũ chuyên gia sức khỏe có trách nhiệm đảm bảo rằng mọi học sinh đều có quyền truy cập vào sự chăm sóc mà họ cần để phát triển.
            </p>

            <h2 className={styles.sectionTitle} id="features">Tài liệu sức khỏe</h2>
            <p className={styles.sectionText}>
              Truy cập các tài liệu sức khỏe quan trọng và tài nguyên liên quan đến chính sách, quy trình và hướng dẫn sức khỏe trường học. Giữ thông tin về các cập nhật sức khỏe và khuyến nghị cho học sinh và nhân viên.
            </p>

            <div className={styles.documentsGrid}>
              <div className={styles.documentCard}>
                <div className={`${styles.documentImage} ${styles.healthGuidelines}`}></div>
                  <div className={styles.documentContent}>
                    <p className={styles.documentTitle}>Quy tắc sức khỏe trường học</p>
                  <p className={styles.documentDescription}>Quy tắc sức khỏe trường học.</p>
                </div>
              </div>
              <div className={styles.documentCard}>
                <div className={`${styles.documentImage} ${styles.emergencyProcedures}`}></div>
                <div className={styles.documentContent}>
                  <p className={styles.documentTitle}>Quy trình khẩn cấp</p>
                  <p className={styles.documentDescription}>Quy trình khẩn cấp.</p>
                </div>
              </div>
              <div className={styles.documentCard}>
                <div className={`${styles.documentImage} ${styles.studentForms}`}></div>
                <div className={styles.documentContent}>
                  <p className={styles.documentTitle}>Hồ sơ sức khỏe học sinh</p>
                  <p className={styles.documentDescription}>Hồ sơ sức khỏe học sinh.</p>
                </div>
              </div>
            </div>

            <h2 className={styles.sectionTitle} id="blog">Blog sức khỏe</h2>
            <p className={styles.sectionText}>
              Đọc blog của chúng tôi để cập nhật các bài viết mới nhất, mẹo và khuyến nghị về sức khỏe học sinh và sức khỏe tốt. Học từ các chuyên gia sức khỏe có kinh nghiệm và giữ thông tin về các chủ đề sức khỏe quan trọng.
            </p>

            <div className={styles.blogSection}>
              <div className={styles.blogCard}>
                <div className={styles.blogContent}>
                  <div className={styles.blogText}>
                    <p className={styles.blogTitle}>Tăng cường sức khỏe tâm lý trong trường học</p>
                    <p className={styles.blogDescription}>Chiến lược để hỗ trợ sức khỏe tâm lý của học sinh và tạo ra môi trường học tập tích cực.</p>
                  </div>
                  <button className={styles.readMoreBtn}>
                    <span>Đọc thêm</span>
                  </button>
                </div>
                <div className={`${styles.blogImage} ${styles.mentalHealth}`}></div>
              </div>

              <div className={styles.blogCard}>
                <div className={styles.blogContent}>
                  <div className={styles.blogText}>
                    <p className={styles.blogTitle}>Mẹo dinh dưỡng cho học sinh</p>
                    <p className={styles.blogDescription}>Thói quen ăn uống lành mạnh để tăng năng lượng và tập trung của học sinh.</p>
                  </div>
                  <button className={styles.readMoreBtn}>
                    <span>Đọc thêm</span>
                  </button>
                </div>
                <div className={`${styles.blogImage} ${styles.nutritionTips}`}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;