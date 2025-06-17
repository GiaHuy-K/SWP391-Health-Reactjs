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
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const profileResponse = await api.get("/user/profile/me");
        setUser(profileResponse.data);
        setIsAuthenticated(true);
      } catch (error) {
        console.warn("Không lấy được profile:", error);

        // Trường hợp Parent chưa liên kết học sinh
        if (error.response?.status === 403) {
          const savedRole = localStorage.getItem("userRole");
          const savedFullName = localStorage.getItem("userFullname");

          if (savedRole && savedFullName) {
            setUser({ role: savedRole, fullName: savedFullName });
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem("token");
            setIsAuthenticated(false);
          }
        } else {
          localStorage.removeItem("token");
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
        // vẫn lưu role và fullname nếu có
        localStorage.setItem("userRole", role);
        localStorage.setItem("userFullname", userData?.fullName || "Phụ huynh");
      }
    }

    console.log("Dữ liệu người dùng sau login:", profileData);
    setUser(profileData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userFullname");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
