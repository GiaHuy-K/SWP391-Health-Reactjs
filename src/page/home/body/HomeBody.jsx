import React from 'react';
import BlogList from '../../../components/blog/BlogList';
import styles from './HomeBody.module.css';

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

const HomeBody = () => {
  return (
    <>
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
                  className="bg-primary text-white px-8 py-4 rounded-button font-medium hover:bg-indigo-600 transition whitespace-nowrap group"
                  onClick={() => window.location.href = '/login'}
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
                    <span className="text-gray-700">Trường Mầm non Chu Văn An</span>
                  </div>
                  <div className="flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <i className="ri-building-4-line text-primary mr-2"></i>
                    <span className="text-gray-700">Trường Mầm non Nguyễn Du</span>
                  </div>
                  <div className="flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <i className="ri-building-4-line text-primary mr-2"></i>
                    <span className="text-gray-700">Trường Mầm non Lê Quý Đôn</span>
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
                  <span className="text-sm font-medium text-gray-600">Được các chuyên gia tin dùng</span>
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
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Lịch khám tiêm chủng định kì</h3>
              <p className="text-gray-600">
                Quản lý lịch tiêm chủng định kỳ, tiêm chủng và các hoạt động y tế học đường với hệ thống nhắc nhở tự động.
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
                SchoolMed được thành lập vào năm 2025 với sứ mệnh nâng cao chất lượng chăm sóc sức khỏe học đường tại Việt Nam thông qua công nghệ số.
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
              <button className="bg-white text-primary border border-primary px-6 py-3 rounded-button font-medium hover:bg-primary hover:text-white transition whitespace-nowrap"
                onClick={() => window.location.href = '/about'}
              >
                Tìm hiểu thêm về chúng tôi
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section Blog Công khai */}
      <section id="public-blogs" style={{ padding: '40px 0', background: '#f9f9f9' }}>
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6 text-primary">Bài viết nổi bật</h2>
          <BlogList mode="all" maxItems={6} showActions={false} showEmptyMessage={false} />
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
    </>
  );
};

export default HomeBody; 