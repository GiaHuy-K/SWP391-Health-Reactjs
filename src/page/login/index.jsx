import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaLock, FaEnvelope } from "react-icons/fa";
import { useAuth } from "../../config/AuthContext";
import api from "../../config/axios";
import styles from "./LoginPage.module.css"; // chuyển sang module CSS

// form theo api post
const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (!formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc";
    } else if (formData.password.length < 8) {
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);

      try {
        const response = await api.post("auth/login", formData);
        console.log("Dữ liệu FE nhận từ BE:", response.data);

        if (response.data) {
          // lưu token
          const { accessToken, user } = response.data;

          //lưu role
          const role = user.role;

          // lưu full name
          const fullName = user.fullName;

          login(user);
          localStorage.setItem("token", accessToken);
          localStorage.setItem("userRole", role);
          localStorage.setItem("userFullname", fullName);

          // theo role để vào các trang khác nhau
          // role admin SchoolAdmin
          if (role === "SchoolAdmin") {
            toast.success(`Admin đăng nhập thành công`);
            navigate("/dashboard");
          }
          // role quản lý StaffManager
          if (role === "StaffManager") {
            toast.success(`Quản lý đăng nhập thành công!`);
            navigate("/dashboardManager");
          }
          // role y tá MedicalStaff
          if (role === "MedicalStaff") {
            toast.success(`Y tá đăng nhập thành công!`);
            navigate("/dashboardNurse");
          }
          // role parent qua thẳng homepage
          if (role === "Parent") {
            toast.success(`Đăng nhập thành công!`);
            navigate("/");
          }
        } else {
          toast.error("Định dạng phản hồi không hợp lệ");
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Đăng nhập thất bại");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h2 className={styles.loginTitle}>Đăng nhập vào tài khoản của bạn</h2>
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          {/* Email input */}
          <div className={styles.inputGroup}>
            <div className={styles.inputIcon}>
              <FaEnvelope />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Nhập email của bạn"
              value={formData.email}
              onChange={handleChange}
              className={`${styles.loginInput} ${errors.email ? styles.inputError : ""}`}
            />
            {errors.email && <p className={styles.errorText}>{errors.email}</p>}
          </div>

          {/* Password input */}
          <div className={styles.inputGroup}>
            <div className={styles.inputIcon}>
              <FaLock />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Nhập mật khẩu của bạn"
              value={formData.password}
              onChange={handleChange}
              className={`${styles.loginInput} ${errors.password ? styles.inputError : ""}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={styles.togglePassword}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.password && <p className={styles.errorText}>{errors.password}</p>}
          </div>

          {/* Remember me + forgot password */}
          <div className={styles.loginOptions}>
            <label>
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              Ghi nhớ tôi
            </label>
            <a href="/forgot-password" className={styles.forgotPassword}>
              Quên mật khẩu?
            </a>
          </div>

          {/* Submit button */}
          <button type="submit" className={styles.loginButton} disabled={isLoading}>
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>

          {/* Đăng ký & quay về trang chủ */}
          <p className={styles.registerText}>
            Chưa có tài khoản? <a href="/register">Đăng ký tại đây</a>
          </p>
          <p className={styles.backHomeText}>
            <a href="/">Quay về trang chủ</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
