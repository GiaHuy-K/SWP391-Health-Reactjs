import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../config/AuthContext';
import { isParentRole } from '../../../config/AuthContext';
import { FaUserCircle } from 'react-icons/fa';
import NotificationDropdown from '../../../components/notification/NotificationDropdown';
import NotificationIcon from '../../../components/notification/NotificationIcon';
import styles from './HomeHeader.module.css';

const HomeHeader = ({ hideNavLinks = false }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
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
        break;
    }
    setShowDropdown(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowDropdown(false);
  };

  const handleNotificationClick = () => {
    navigate('/notifications');
    setShowDropdown(false);
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const isParent = isParentRole(user);

  useEffect(() => {
    const handleSmoothScroll = (e) => {
      if (e.target.hash) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        if (targetId === '#') return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
          });
          setShowMobileMenu(false);
        }
      }
    };
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', handleSmoothScroll);
    });
    return () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', handleSmoothScroll);
      });
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.user-dropdown')) {
        setShowDropdown(false);
      }
      if (showNotificationDropdown && !event.target.closest('.notification-dropdown')) {
        setShowNotificationDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown, showNotificationDropdown]);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center mr-10 cursor-pointer" onClick={handleLogoClick}>
          <div style={{ width: 48, height: 48 }}>
            <img
              src="/logo_medical_health_system.jpg"
              alt="SchoolMed Logo"
              style={{ width: 48, height: 48, objectFit: "contain" }}
            />
          </div>
          <h2 className="ml-3 text-2xl font-['Pacifico'] text-primary">SchoolMed</h2>
        </div>
        <nav className="hidden md:flex space-x-8 flex-1 justify-center">
          {!hideNavLinks && (
            <>
              <a href="#features" className="text-gray-600 hover:text-primary transition">Tính năng</a>
              <a href="#contact" className="text-gray-600 hover:text-primary transition">Liên hệ</a>
              <a href="#about" className="text-gray-600 hover:text-primary transition">Về chúng tôi</a>
              <a href="/blogs" className="text-gray-600 hover:text-primary transition">Blog</a>
            </>
          )}
        </nav>
        <div className="flex items-center space-x-4">
          {!isAuthenticated ? (
            <button 
              onClick={handleLogin}
              className="hidden md:block bg-white text-primary border border-primary px-5 py-2 rounded-button font-medium hover:bg-primary hover:text-white transition whitespace-nowrap"
            >
              Đăng nhập
            </button>
          ) : (
            <>
              {/* Notification Icon */}
              <div className="relative notification-dropdown">
                <NotificationIcon 
                  onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
                />
                <NotificationDropdown 
                  isVisible={showNotificationDropdown}
                  onClose={() => setShowNotificationDropdown(false)}
                />
              </div>
              {/* User Profile */}
              <div className="relative user-dropdown">
                <FaUserCircle 
                  className="w-8 h-8 text-primary cursor-pointer" 
                  onClick={() => setShowDropdown(!showDropdown)}
                />
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    {isParent ? (
                      <>
                        <button 
                          onClick={handleProfileClick}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Hồ sơ
                        </button>
                        <button 
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Đăng xuất
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={handleDashboardClick}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Dashboard
                        </button>
                        <button 
                          onClick={handleProfileClick}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Hồ sơ
                        </button>
                        <button 
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Đăng xuất
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
          <button 
            className="md:hidden w-10 h-10 flex items-center justify-center text-gray-700"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <i className={`ri-${showMobileMenu ? 'close' : 'menu'}-line ri-lg`}></i>
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden bg-white border-t border-gray-200 py-4">
          <div className="container mx-auto px-4">
            <nav className="space-y-4">
              {!hideNavLinks && (
                <>
                  <a href="#features" className="block text-gray-600 hover:text-primary transition py-2">Tính năng</a>
                  <a href="#contact" className="block text-gray-600 hover:text-primary transition py-2">Liên hệ</a>
                  <a href="#about" className="block text-gray-600 hover:text-primary transition py-2">Về chúng tôi</a>
                </>
              )}
              {isAuthenticated && (
                <>
                  <hr className="border-gray-200" />
                  <div className="flex items-center space-x-3 py-2">
                    <NotificationIcon 
                      onClick={() => {
                        setShowNotificationDropdown(!showNotificationDropdown);
                        setShowMobileMenu(false);
                      }}
                    />
                    <span className="text-gray-600">Thông báo</span>
                  </div>
                  {isParent ? (
                    <>
                      <button 
                        onClick={() => {
                          handleProfileClick();
                          setShowMobileMenu(false);
                        }}
                        className="block w-full text-left text-gray-600 hover:text-primary transition py-2"
                      >
                        Hồ sơ
                      </button>
                      <button 
                        onClick={() => {
                          handleLogout();
                          setShowMobileMenu(false);
                        }}
                        className="block w-full text-left text-gray-600 hover:text-primary transition py-2"
                      >
                        Đăng xuất
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => {
                          handleDashboardClick();
                          setShowMobileMenu(false);
                        }}
                        className="block w-full text-left text-gray-600 hover:text-primary transition py-2"
                      >
                        Dashboard
                      </button>
                      <button 
                        onClick={() => {
                          handleProfileClick();
                          setShowMobileMenu(false);
                        }}
                        className="block w-full text-left text-gray-600 hover:text-primary transition py-2"
                      >
                        Hồ sơ
                      </button>
                      <button 
                        onClick={() => {
                          handleLogout();
                          setShowMobileMenu(false);
                        }}
                        className="block w-full text-left text-gray-600 hover:text-primary transition py-2"
                      >
                        Đăng xuất
                      </button>
                    </>
                  )}
                </>
              )}
              {!isAuthenticated && (
                <button 
                  onClick={() => {
                    handleLogin();
                    setShowMobileMenu(false);
                  }}
                  className="w-full bg-primary text-white px-5 py-2 rounded-button font-medium hover:bg-indigo-600 transition"
                >
                  Đăng nhập
                </button>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default HomeHeader; 