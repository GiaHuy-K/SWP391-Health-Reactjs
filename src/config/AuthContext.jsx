import React, { createContext, useState, useContext, useEffect } from "react";
import api from "./axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // Kiểm tra tính hợp lệ của token bằng cách gọi API
          const response = await api.get("/auth/verify-token");
          if (response.data) {
            // Nếu token hợp lệ, lấy thông tin profile đầy đủ của user
            const profileResponse = await api.get("/user/profile/me");
            setUser(profileResponse.data);
            setIsAuthenticated(true);
          } else {
            // Nếu token không hợp lệ, xóa nó và thông tin user
            localStorage.removeItem("token");
            localStorage.removeItem("user"); // Xóa thông tin user cũ nếu có
            setIsAuthenticated(false);
          }
        } catch (error) {
          // Nếu có lỗi, xóa token và thông tin user
          console.error(
            "Error during token verification or profile fetch:",
            error
          );
          localStorage.removeItem("token");
          localStorage.removeItem("user"); // Xóa thông tin user cũ nếu có
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (userData) => {
    const role = userData?.role;
    let profileData = userData;

    if (role === "Parent") {
      try {
        const response = await api.get("/user/profile/me");
        profileData = response.data;
      } catch (error) {
        console.warn("Không thể lấy profile Parent:", error);
      }
    }

    // Admin hoặc role khác: dùng luôn userData trả về từ login
    setUser(profileData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // Đảm bảo xóa thông tin user khi đăng xuất
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
