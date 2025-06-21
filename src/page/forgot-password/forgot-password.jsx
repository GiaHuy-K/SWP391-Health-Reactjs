import React, { useState } from 'react';
import api from '../../config/axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import styles from './ForgotPassword.module.css';
const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post('auth/forgot-password', { email });
      toast.success('OTP đã được gửi về email của bạn!');
      navigate("/reset-password");
    } catch (error) {
      toast.error('Không thể gửi OTP. Vui lòng kiểm tra lại email!');
      console.error(error);
    }
  };

  return (
    <div className={styles.forgotWrapper}>
      <div className={styles.forgotContainer}>
        <h2 className={styles.forgotTitle}>🔐 Quên mật khẩu</h2>
        <form onSubmit={handleSubmit}>
          <label className={styles.forgotLabel}>Email</label>
          <input
            type="email"
            className={styles.forgotInput}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email đã đăng ký"
            required
          />
          <button type="submit" className={styles.forgotButton}>
            Gửi OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
