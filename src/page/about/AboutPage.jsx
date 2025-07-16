import React from 'react';
import HomeHeader from '../home/header/HomeHeader';
import HomeFooter from '../home/footer/HomeFooter';
import styles from './AboutPage.module.css';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <HomeHeader />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-indigo-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Về SchoolMed</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Giải pháp toàn diện cho quản lý sức khỏe học đường tại Việt Nam
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Sứ mệnh & Tầm nhìn</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-primary mb-3">Sứ mệnh</h3>
                  <p className="text-gray-700 leading-relaxed">
                    SchoolMed được thành lập với sứ mệnh nâng cao chất lượng chăm sóc sức khỏe học đường 
                    tại Việt Nam thông qua công nghệ số. Chúng tôi cam kết cung cấp giải pháp toàn diện 
                    giúp nhà trường quản lý sức khỏe học sinh một cách hiệu quả và chuyên nghiệp.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-primary mb-3">Tầm nhìn</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Trở thành nền tảng quản lý sức khỏe học đường hàng đầu tại Việt Nam, 
                    góp phần xây dựng một thế hệ học sinh khỏe mạnh và phát triển toàn diện.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <img 
                src="https://cand.com.vn/Files/Image/thanhbinh/2019/09/30/a03014ab-c832-4cff-99ab-ecd54a40a54d.jpg"
                className="rounded-xl shadow-lg object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Giá trị cốt lõi</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Những nguyên tắc định hướng mọi hoạt động và quyết định của chúng tôi
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-heart-pulse-line ri-2xl text-white"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Sức khỏe là trên hết</h3>
              <p className="text-gray-600">
                Đặt sức khỏe và sự an toàn của học sinh lên hàng đầu trong mọi quyết định và hành động.
              </p>
            </div>
            <div className="text-center p-8 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-shield-check-line ri-2xl text-white"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Bảo mật & Tin cậy</h3>
              <p className="text-gray-600">
                Đảm bảo tính bảo mật tuyệt đối cho thông tin cá nhân và dữ liệu y tế của học sinh.
              </p>
            </div>
            <div className="text-center p-8 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-team-line ri-2xl text-white"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Hợp tác & Chia sẻ</h3>
              <p className="text-gray-600">
                Xây dựng mối quan hệ hợp tác chặt chẽ giữa nhà trường, gia đình và cộng đồng.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Đội ngũ của chúng tôi</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Đội ngũ chuyên gia giàu kinh nghiệm với hơn 15 năm trong lĩnh vực y tế, giáo dục và công nghệ
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-primary to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-user-3-line ri-4xl text-white"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Chuyên gia Y tế</h3>
              <p className="text-gray-600">Đội ngũ bác sĩ, y tá có chuyên môn cao về y tế học đường</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-primary to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-graduation-cap-line ri-4xl text-white"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Chuyên gia Giáo dục</h3>
              <p className="text-gray-600">Các nhà giáo dục có kinh nghiệm trong quản lý học đường</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-primary to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-code-s-slash-line ri-4xl text-white"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Kỹ sư Công nghệ</h3>
              <p className="text-gray-600">Đội ngũ phát triển phần mềm và bảo mật thông tin</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-primary to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-customer-service-2-line ri-4xl text-white"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Hỗ trợ Khách hàng</h3>
              <p className="text-gray-600">Đội ngũ hỗ trợ chuyên nghiệp, sẵn sàng hỗ trợ 24/7</p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Hành trình phát triển</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Những cột mốc quan trọng trong quá trình phát triển của SchoolMed
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              <div className="flex items-center">
                <div className="w-20 h-20 bg-primary rounded-full flex flex-col items-center justify-center text-white font-bold mr-8">
                  <span className="text-sm">Tháng 4</span>
                  <span className="text-lg">2025</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Thành lập SchoolMed</h3>
                  <p className="text-gray-600">
                    SchoolMed được thành lập với mục tiêu cách mạng hóa quản lý sức khỏe học đường tại Việt Nam.
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-20 h-20 bg-primary rounded-full flex flex-col items-center justify-center text-white font-bold mr-8">
                  <span className="text-sm">Tháng 5</span>
                  <span className="text-lg">2025</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Triển khai thí điểm</h3>
                  <p className="text-gray-600">
                    Thành công triển khai thí điểm tại 50 trường học với hơn 25.000 học sinh.
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-20 h-20 bg-primary rounded-full flex flex-col items-center justify-center text-white font-bold mr-8">
                  <span className="text-sm">Tháng 6</span>
                  <span className="text-lg">2025</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Mở rộng quy mô</h3>
                  <p className="text-gray-600">
                    Mở rộng dịch vụ đến 200+ trường học với hơn 150.000 học sinh trên toàn quốc.
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-20 h-20 bg-primary rounded-full flex flex-col items-center justify-center text-white font-bold mr-8">
                  <span className="text-sm">Tháng 7</span>
                  <span className="text-lg">2025</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Tầm nhìn tương lai</h3>
                  <p className="text-gray-600">
                    Mục tiêu phục vụ 500+ trường học và 500.000+ học sinh trên toàn Việt Nam.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary to-indigo-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Sẵn sàng bắt đầu?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Hãy liên hệ với chúng tôi để được tư vấn và hỗ trợ triển khai giải pháp quản lý sức khỏe học đường
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="bg-white text-primary px-8 py-3 rounded-button font-medium hover:bg-gray-100 transition"
              onClick={() => window.location.href = '/#contact'}
            >
              Liên hệ ngay
            </button>
            <button 
              className="border-2 border-white text-white px-8 py-3 rounded-button font-medium hover:bg-white hover:text-primary transition"
              onClick={() => window.location.href = '/#features'}
            >
              Tìm hiểu tính năng
            </button>
          </div>
        </div>
      </section>

      <HomeFooter />
    </div>
  );
};

export default AboutPage; 