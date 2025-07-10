import React from 'react';
import styles from './HomeFooter.module.css';

const HomeFooter = () => {
  return (
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
  );
};

export default HomeFooter; 