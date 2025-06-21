import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../../config/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import styles from "./RegisterPage.module.css";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    terms: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
    if (name === "password") setPasswordStrength(validatePassword(value));
    validateField(name, newValue);
  };

  const validateField = (name, value) => {
    let newErrors = { ...errors };
    switch (name) {
      case "fullName":
        if (!value) newErrors.fullName = "Họ và tên là bắt buộc";
        else if (value.length < 2)
          newErrors.fullName = "Tên phải có ít nhất 2 ký tự";
        else if (!/^[\p{L}\s]+$/u.test(value))
          newErrors.fullName = "Chỉ cho phép chữ cái và khoảng trắng (có dấu)";
        else delete newErrors.fullName;
        break;
      case "email":
        if (!value) newErrors.email = "Email là bắt buộc";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          newErrors.email = "Định dạng email không hợp lệ";
        else delete newErrors.email;
        break;
      case "phoneNumber":
        if (!value) newErrors.phoneNumber = "Số điện thoại là bắt buộc";
        else if (!/^0(3|5|7|8|9)[0-9]{8}$/.test(value))
          newErrors.phoneNumber =
            "Số điện thoại không hợp lệ, phải bắt đầu bằng 0 và theo đầu số Việt Nam";
        else delete newErrors.phoneNumber;
        break;
      case "terms":
        if (!value) newErrors.terms = "Bạn phải chấp nhận các điều khoản và điều kiện";
        else delete newErrors.terms;
        break;
      case "password":
        if (!value) newErrors.password = "Mật khẩu là bắt buộc";
        else if (value.length < 8)
          newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
        else if (/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(value))
          newErrors.password = "Mật khẩu không được chứa dấu";
        else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])/.test(value))
          newErrors.password = "Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường và một số";
        else delete newErrors.password;
        break;
      case "confirmPassword":
        if (!value) newErrors.confirmPassword = "Xác nhận mật khẩu là bắt buộc";
        else if (value !== formData.password)
          newErrors.confirmPassword = "Mật khẩu không khớp";
        else delete newErrors.confirmPassword;
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post("auth/register/parent", formData);
      if (response.data?.token) localStorage.setItem("token", response.data.token);
      toast.success("Tạo tài khoản thành công!");
      setTimeout(() => navigate("/login"), 200);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Đăng ký thất bại";
      toast.error(errorMessage);
      setIsLoading(false);
    }
  };

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case 1: return "red";
      case 2: return "orange";
      case 3: return "yellowgreen";
      case 4: return "green";
      default: return "gray";
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerCard}>
        <form className={styles.registerForm} onSubmit={handleSubmit}>
          <h2>Tạo tài khoản của bạn</h2>
          {["fullName", "email", "phoneNumber", "password", "confirmPassword"].map((field) => (
            <div key={field} className={styles.formGroup}>
              <label htmlFor={field}>
                {{
                  fullName: "Họ và tên",
                  email: "Email",
                  phoneNumber: "Số điện thoại",
                  password: "Mật khẩu",
                  confirmPassword: "Xác nhận mật khẩu",
                }[field]}
              </label>
              <div className={styles.inputWrapper}>
                <input
                  type={
                    ["password", "confirmPassword"].includes(field)
                      ? showPassword ? "text" : "password"
                      : field === "email"
                      ? "email"
                      : "text"
                  }
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  autoComplete={field.includes("password") ? "new-password" : "off"}
                  placeholder=""
                  className={errors[field] ? styles.error : ""}
                />
                {["password", "confirmPassword"].includes(field) && (
                  <span
                    className={styles.eyeIcon}
                    onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                )}
              </div>
              {errors[field] && <p className={styles.errorText}>{errors[field]}</p>}
            </div>
          ))}

          <div className={styles.formGroup}>
            <label>Độ mạnh của mật khẩu:</label>
            <div className={styles.strengthBar}>
              <div
                className={styles.strengthFill}
                style={{
                  width: `${(passwordStrength / 4) * 100}%`,
                  backgroundColor: getStrengthColor(),
                }}
              ></div>
            </div>
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : "Đăng ký"}
          </button>

          <div className={styles.loginLink}>
            <span>Đã có tài khoản? </span>
            <button type="button" onClick={() => navigate("/login")}>
              Đăng nhập
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
