import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../config/AuthContext';
import { isParentRole } from '../../config/AuthContext';
import { FaUserCircle } from 'react-icons/fa';

const HomePage = () => {
  const [showDropdown, setShowDropdown] = useState(false);
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

  const handleGetStarted = () => {
    if (isAuthenticated) {
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

  
  const handleContactSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const message = formData.get('message');

    
    if (!name || !email || !message) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    
    const formContainer = e.target.parentElement;
    formContainer.innerHTML = `
      <div class="text-center py-8">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <i class="ri-check-line ri-2x text-green-600"></i>
        </div>
        <h3 class="text-2xl font-semibold text-gray-900 mb-3">Cảm ơn bạn!</h3>
        <p class="text-gray-600 mb-6">Tin nhắn của bạn đã được gửi thành công. Chúng tôi sẽ liên hệ lại với bạn trong thời gian sớm nhất.</p>
        <button type="button" class="bg-primary text-white px-6 py-3 rounded-button font-medium hover:bg-indigo-600 transition whitespace-nowrap" onclick="window.location.reload()">Gửi tin nhắn khác</button>
      </div>
    `;
  };

  return (
    <div className="bg-white">
      
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
<<<<<<< HEAD
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
=======
            <h2 className="ml-3 text-2xl font-['Pacifico'] text-primary">SchoolMed</h2>
          </div>
          <nav className="hidden md:flex space-x-8 flex-1 justify-center">
            <a href="#features" className="text-gray-600 hover:text-primary transition">Tính năng</a>
            <a href="#contact" className="text-gray-600 hover:text-primary transition">Liên hệ</a>
            <a href="#about" className="text-gray-600 hover:text-primary transition">Về chúng tôi</a>
            <a href="#blog" className="text-gray-600 hover:text-primary transition">Blog sức khỏe</a>
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
              <div className="relative">
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
>>>>>>> a5ee8e4fb14ff3420a33f0fb7d5f79dd5879d6d1
                    )}
                  </div>
                )}
              </div>
            )}
            <button 
              className="md:hidden w-10 h-10 flex items-center justify-center text-gray-700"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <i className={`ri-${showMobileMenu ? 'close' : 'menu'}-line ri-lg`}></i>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-white via-indigo-50/40 to-primary/5">
        <div className="absolute inset-0 bg-[url('https://readdy.ai/api/search-image?query=Modern%20abstract%20medical%20background%20with%20geometric%20shapes%20and%20dots%2C%20soft%20gradient%20colors%20in%20light%20blue%20and%20white%2C%20minimalist%20design%20with%20subtle%20healthcare%20symbols%2C%20clean%20and%20professional%20medical%20technology%20concept&width=1920&height=1080&seq=hero-bg&orientation=landscape')] bg-cover bg-center opacity-40"></div>
        <div className="container relative mx-auto px-4 py-20 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-6">
                <i className="ri-shield-star-line mr-2"></i>
                Nền tảng quản lý sức khỏe #1 Việt Nam
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Quản lý sức khỏe học đường
                <span className="text-primary block mt-2">thông minh & hiệu quả</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl">
                SchoolMed kết nối nhà trường, phụ huynh và y tế học đường trong một nền tảng số toàn diện, giúp chăm sóc sức khỏe học sinh tốt hơn mỗi ngày.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-12">
                <button 
                  onClick={handleGetStarted}
                  className="bg-primary text-white px-8 py-4 rounded-button font-medium hover:bg-indigo-600 transition whitespace-nowrap group"
                >
                  Bắt đầu
                  <i className="ri-arrow-right-line ml-2 group-hover:translate-x-1 transition-transform"></i>
                </button>
              </div>
              <div className="space-y-4">
                <p className="text-sm font-medium text-gray-500">ĐƯỢC TIN DÙNG BỞI CÁC TRƯỜNG HÀNG ĐẦU</p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                  <div className="flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <i className="ri-building-4-line text-primary mr-2"></i>
                    <span className="text-gray-700">Trường THPT Chu Văn An</span>
                  </div>
                  <div className="flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <i className="ri-building-4-line text-primary mr-2"></i>
                    <span className="text-gray-700">Trường THCS Nguyễn Du</span>
                  </div>
                  <div className="flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <i className="ri-building-4-line text-primary mr-2"></i>
                    <span className="text-gray-700">Trường Tiểu học Lê Quý Đôn</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-8 -left-8 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-secondary/10 rounded-full blur-2xl"></div>
              <div className="relative bg-white p-4 rounded-2xl shadow-xl">
                <img 
                  src="https://readdy.ai/api/search-image?query=Modern%20healthcare%20dashboard%20interface%20showing%20student%20health%20analytics%20with%20clean%20UI%20design%2C%20medical%20data%20visualization%20with%20charts%20and%20statistics%2C%20bright%20professional%20medical%20software%20screen%20on%20laptop%20display%2C%20soft%20color%20scheme&width=800&height=600&seq=hero2&orientation=landscape" 
                  alt="SchoolMed Dashboard" 
                  className="rounded-lg shadow-lg w-full object-cover object-top"
                />
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white px-6 py-3 rounded-full shadow-lg">
                  <div className="flex -space-x-2">
                    <img src="https://readdy.ai/api/search-image?query=Professional%20female%20doctor%20portrait%2C%20asian%20medical%20professional%2C%20friendly%20smile%2C%20white%20coat%2C%20medical%20office%20background&width=100&height=100&seq=avatar1&orientation=squarish" alt="Doctor" className="w-8 h-8 rounded-full border-2 border-white" />
                    <img src="https://readdy.ai/api/search-image?query=Young%20male%20nurse%20portrait%2C%20asian%20medical%20staff%2C%20professional%20smile%2C%20medical%20uniform%2C%20hospital%20background&width=100&height=100&seq=avatar2&orientation=squarish" alt="Nurse" className="w-8 h-8 rounded-full border-2 border-white" />
                    <img src="https://readdy.ai/api/search-image?query=Middle%20aged%20female%20teacher%20portrait%2C%20asian%20education%20professional%2C%20warm%20smile%2C%20professional%20attire%2C%20school%20background&width=100&height=100&seq=avatar3&orientation=squarish" alt="Teacher" className="w-8 h-8 rounded-full border-2 border-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-600">1,200+ chuyên gia tin dùng</span>
                </div>
              </div>
              <div className="absolute top-4 -right-4 bg-white rounded-lg shadow-lg p-4 flex items-center gap-3 animate-bounce">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <i className="ri-heart-pulse-line text-green-600"></i>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Sức khỏe học sinh</div>
                  <div className="text-xs text-gray-500">Được bảo vệ 24/7</div>
                </div>
              </div>
              <div className="absolute bottom-20 -left-4 bg-white rounded-lg shadow-lg p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="ri-shield-check-line text-blue-600"></i>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">An toàn & Bảo mật</div>
                  <div className="text-xs text-gray-500">Tiêu chuẩn quốc tế</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Tính năng nổi bật</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              SchoolMed cung cấp đầy đủ các công cụ cần thiết để quản lý sức khỏe học sinh một cách toàn diện và hiệu quả.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mb-5">
                <i className="ri-health-book-line ri-xl text-primary"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Hồ sơ sức khỏe điện tử</h3>
              <p className="text-gray-600">
                Lưu trữ toàn bộ thông tin sức khỏe của học sinh bao gồm tiền sử bệnh, dị ứng, tiêm chủng và các chỉ số sức khỏe cơ bản.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mb-5">
                <i className="ri-notification-3-line ri-xl text-primary"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Thông báo khẩn cấp</h3>
              <p className="text-gray-600">
                Gửi thông báo tức thì đến phụ huynh trong trường hợp khẩn cấp như tai nạn, bệnh đột xuất hoặc dịch bệnh trong trường học.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mb-5">
                <i className="ri-calendar-check-line ri-xl text-primary"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Lịch khám sức khỏe</h3>
              <p className="text-gray-600">
                Quản lý lịch khám sức khỏe định kỳ, tiêm chủng và các hoạt động y tế học đường với hệ thống nhắc nhở tự động.
              </p>
            </div>
            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mb-5">
                <i className="ri-line-chart-line ri-xl text-primary"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Báo cáo và thống kê</h3>
              <p className="text-gray-600">
                Tạo báo cáo chi tiết về tình hình sức khỏe học sinh, phân tích xu hướng và đưa ra cảnh báo sớm về các vấn đề sức khỏe.
              </p>
            </div>
            {/* Feature 5 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mb-5">
                <i className="ri-message-2-line ri-xl text-primary"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Kết nối phụ huynh</h3>
              <p className="text-gray-600">
                Tạo kênh liên lạc trực tiếp giữa nhà trường và phụ huynh về các vấn đề sức khỏe của học sinh qua ứng dụng di động.
              </p>
            </div>
            {/* Feature 6 */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mb-5">
                <i className="ri-shield-check-line ri-xl text-primary"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Bảo mật dữ liệu</h3>
              <p className="text-gray-600">
                Đảm bảo an toàn thông tin cá nhân với hệ thống mã hóa tiên tiến, tuân thủ các quy định về bảo vệ dữ liệu y tế.
              </p>
            </div>
          </div>
          <div className="mt-16 text-center">
            <button 
              onClick={handleGetStarted}
              className="bg-primary text-white px-6 py-3 rounded-button font-medium hover:bg-indigo-600 transition whitespace-nowrap"
            >
              Khám phá tất cả tính năng
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <img 
                src="https://readdy.ai/api/search-image?query=A%20diverse%20team%20of%20healthcare%20professionals%20and%20education%20specialists%20working%20together%20in%20a%20modern%20office%20environment%2C%20discussing%20school%20health%20management%20system%20on%20large%20screens%2C%20collaborative%20atmosphere%2C%20professional%20medical%20and%20educational%20setting&width=600&height=400&seq=about1&orientation=landscape" 
                alt="Đội ngũ SchoolMed" 
                className="rounded-xl shadow-lg object-cover object-top"
              />
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Về chúng tôi</h2>
              <p className="text-lg text-gray-700 mb-6">
                SchoolMed được thành lập vào năm 2022 với sứ mệnh nâng cao chất lượng chăm sóc sức khỏe học đường tại Việt Nam thông qua công nghệ số.
              </p>
              <p className="text-lg text-gray-700 mb-8">
                Đội ngũ của chúng tôi bao gồm các chuyên gia y tế, giáo dục và công nghệ với hơn 15 năm kinh nghiệm, cùng chung tâm huyết xây dựng một hệ thống toàn diện giúp nhà trường quản lý sức khỏe học sinh hiệu quả.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">200+</div>
                  <p className="text-gray-600">Trường học sử dụng</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">150.000+</div>
                  <p className="text-gray-600">Học sinh được quản lý</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">98%</div>
                  <p className="text-gray-600">Đánh giá tích cực</p>
                </div>
              </div>
              <button className="bg-white text-primary border border-primary px-6 py-3 rounded-button font-medium hover:bg-primary hover:text-white transition whitespace-nowrap">
                Tìm hiểu thêm về chúng tôi
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Blog sức khỏe</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Cập nhật những kiến thức, tin tức mới nhất về sức khỏe học đường và cách chăm sóc sức khỏe cho học sinh.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Blog Post 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              <img 
                src="https://readdy.ai/api/search-image?query=School%20nurse%20checking%20temperature%20of%20elementary%20school%20student%20in%20bright%2C%20clean%20school%20infirmary%2C%20caring%20medical%20professional%2C%20child%20health%20checkup%20in%20educational%20setting&width=400&height=250&seq=blog1&orientation=landscape" 
                alt="Kiểm tra sức khỏe định kỳ" 
                className="w-full h-48 object-cover object-top"
              />
              <div className="p-6">
                <div className="text-sm text-gray-500 mb-2">30 Tháng 6, 2025</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  5 chỉ số sức khỏe quan trọng cần theo dõi ở trẻ em độ tuổi học đường
                </h3>
                <p className="text-gray-600 mb-4">
                  Tìm hiểu những chỉ số sức khỏe quan trọng cần được theo dõi định kỳ để đảm bảo sự phát triển toàn diện của trẻ em trong độ tuổi học đường.
                </p>
                <a href="#" className="text-primary font-medium hover:underline">Đọc tiếp →</a>
              </div>
            </div>
            {/* Blog Post 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              <img 
                src="https://readdy.ai/api/search-image?query=Healthy%20school%20lunch%20with%20fresh%20vegetables%2C%20fruits%2C%20and%20balanced%20nutrition%20on%20cafeteria%20tray%2C%20colorful%20nutritious%20meal%20for%20students%2C%20school%20food%20program&width=400&height=250&seq=blog2&orientation=landscape" 
                alt="Dinh dưỡng học đường" 
                className="w-full h-48 object-cover object-top"
              />
              <div className="p-6">
                <div className="text-sm text-gray-500 mb-2">25 Tháng 6, 2025</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Dinh dưỡng học đường: Xây dựng thực đơn cân bằng cho học sinh
                </h3>
                <p className="text-gray-600 mb-4">
                  Hướng dẫn chi tiết về cách xây dựng thực đơn cân bằng dinh dưỡng cho học sinh, giúp nâng cao sức khỏe và khả năng học tập.
                </p>
                <a href="#" className="text-primary font-medium hover:underline">Đọc tiếp →</a>
              </div>
            </div>
            {/* Blog Post 3 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              <img 
                src="https://readdy.ai/api/search-image?query=Teacher%20leading%20students%20in%20physical%20exercise%20in%20school%20gymnasium%2C%20children%20doing%20morning%20workout%20in%20bright%20school%20gym%2C%20active%20healthy%20lifestyle%20in%20education&width=400&height=250&seq=blog3&orientation=landscape" 
                alt="Hoạt động thể chất" 
                className="w-full h-48 object-cover object-top"
              />
              <div className="p-6">
                <div className="text-sm text-gray-500 mb-2">20 Tháng 6, 2025</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Tầm quan trọng của hoạt động thể chất đối với sự phát triển của học sinh
                </h3>
                <p className="text-gray-600 mb-4">
                  Nghiên cứu mới nhất về tác động của hoạt động thể chất đối với sự phát triển thể chất và tinh thần của học sinh các cấp.
                </p>
                <a href="#" className="text-primary font-medium hover:underline">Đọc tiếp →</a>
              </div>
            </div>
          </div>
          <div className="mt-12 text-center">
            <a href="#" className="bg-white text-primary border border-primary px-6 py-3 rounded-button font-medium hover:bg-primary hover:text-white transition inline-block whitespace-nowrap">
              Xem tất cả bài viết
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Liên hệ với chúng tôi</h2>
              <p className="text-lg text-gray-700 mb-8">
                Bạn có câu hỏi hoặc cần tư vấn về giải pháp quản lý sức khỏe học đường? Hãy liên hệ với chúng tôi ngay hôm nay.
              </p>
              <div className="space-y-6 mb-8">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                    <i className="ri-map-pin-line ri-lg text-primary"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Địa chỉ</h3>
                    <p className="text-gray-600">7 Đ. D1, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh, Việt Nam</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                    <i className="ri-mail-line ri-lg text-primary"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">contact@schoolmed.vn</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                    <i className="ri-phone-line ri-lg text-primary"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Điện thoại</h3>
                    <p className="text-gray-600">(+84) 28 1234 5678</p>
                  </div>
                </div>
              </div>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition">
                  <i className="ri-facebook-fill ri-lg"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition">
                  <i className="ri-linkedin-fill ri-lg"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition">
                  <i className="ri-youtube-fill ri-lg"></i>
                </a>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Gửi tin nhắn cho chúng tôi</h3>
                <form onSubmit={handleContactSubmit}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Họ và tên</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name"
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                      placeholder="Nhập họ và tên của bạn"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email"
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                      placeholder="Nhập địa chỉ email của bạn"
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Số điện thoại</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone"
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                      placeholder="Nhập số điện thoại của bạn"
                    />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Tin nhắn</label>
                    <textarea 
                      id="message" 
                      name="message"
                      rows="4" 
                      className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                      placeholder="Nhập nội dung tin nhắn của bạn"
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    className="w-full bg-primary text-white px-6 py-3 rounded-button font-medium hover:bg-indigo-600 transition whitespace-nowrap"
                  >
                    Gửi tin nhắn
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <a href="#" className="text-2xl font-['Pacifico'] text-white mb-6 inline-block">SchoolMed</a>
              <p className="text-gray-400 mb-6">
                Nền tảng quản lý sức khỏe học đường toàn diện, kết nối nhà trường, phụ huynh và y tế trong một hệ sinh thái số.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary transition">
                  <i className="ri-facebook-fill ri-lg"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary transition">
                  <i className="ri-linkedin-fill ri-lg"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary transition">
                  <i className="ri-youtube-fill ri-lg"></i>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6">Liên kết nhanh</h3>
              <ul className="space-y-3">
                <li><a href="#features" className="text-gray-400 hover:text-white transition">Tính năng</a></li>
                <li><a href="#about" className="text-gray-400 hover:text-white transition">Về chúng tôi</a></li>
                <li><a href="#blog" className="text-gray-400 hover:text-white transition">Blog sức khỏe</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white transition">Liên hệ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6">Dịch vụ</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Quản lý hồ sơ sức khỏe</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Khám sức khỏe định kỳ</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Tư vấn dinh dưỡng học đường</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Đào tạo y tế học đường</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Tích hợp hệ thống</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6">Liên hệ</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="w-5 h-5 flex items-center justify-center mr-3 mt-1">
                    <i className="ri-map-pin-line text-gray-400"></i>
                  </div>
                  <span className="text-gray-400">7 Đ. D1, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh, Việt Nam</span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 flex items-center justify-center mr-3">
                    <i className="ri-mail-line text-gray-400"></i>
                  </div>
                  <a href="mailto:contact@schoolmed.vn" className="text-gray-400 hover:text-white transition">contact@schoolmed.vn</a>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 flex items-center justify-center mr-3">
                    <i className="ri-phone-line text-gray-400"></i>
                  </div>
                  <a href="tel:+842812345678" className="text-gray-400 hover:text-white transition">(+84) 28 1234 5678</a>
                </li>
              </ul>
            </div>
          </div>
          <hr className="border-gray-800 mb-8" />
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 mb-4 md:mb-0">© 2025 SchoolMed. Tất cả các quyền được bảo lưu.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-white transition">Điều khoản sử dụng</a>
              <a href="#" className="text-gray-500 hover:text-white transition">Chính sách bảo mật</a>
              <a href="#" className="text-gray-500 hover:text-white transition">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;