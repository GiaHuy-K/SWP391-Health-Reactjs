import React, { createContext, useState, useContext, useEffect } from 'react';
import api from './axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Kiểm tra tính hợp lệ của token bằng cách gọi API
          const response = await api.get('/auth/verify-token');
          if (response.data) {
            // Nếu token hợp lệ, lấy thông tin profile đầy đủ của user
            const profileResponse = await api.get('/users/profile');
            setUser(profileResponse.data);
            setIsAuthenticated(true);
          } else {
            // Nếu token không hợp lệ, xóa nó và thông tin user
            localStorage.removeItem('token');
            localStorage.removeItem('user'); // Xóa thông tin user cũ nếu có
            setIsAuthenticated(false);
          }
        } catch (error) {
          // Nếu có lỗi, xóa token và thông tin user
          console.error('Error during token verification or profile fetch:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user'); // Xóa thông tin user cũ nếu có
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (userData) => {
    try {
      // Sau khi đăng nhập, lấy thông tin profile đầy đủ của user
      const profileResponse = await api.get('/users/profile');
      setUser(profileResponse.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error fetching user profile after login:', error);
      // Nếu không lấy được profile, vẫn set user data cơ bản từ login response (tùy chọn)
      setUser(userData); // Giữ lại dòng này nếu bạn muốn hiển thị dữ liệu cơ bản từ login
      setIsAuthenticated(true);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // Đảm bảo xóa thông tin user khi đăng xuất
  };

  if (isLoading) {
    return <div>Loading...</div>; // Hoặc một component loading khác
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 