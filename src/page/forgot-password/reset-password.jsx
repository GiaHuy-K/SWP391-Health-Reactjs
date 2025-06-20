import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../config/axios';
import { toast } from 'react-toastify';
import styles from './ResetPassword.module.css'; // ✅ import module đúng cách

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post('/auth/reset-password', {
        email,
        otp,
        newPassword
      });

      toast.success('Đặt lại mật khẩu thành công!');
      navigate('/login');
    } catch (error) {
      toast.error('Đặt lại mật khẩu thất bại. Vui lòng kiểm tra OTP và email!');
      console.error(error);
    }
  };

  return (
    <div className={styles.resetWrapper}>
      <div className={styles.resetContainer}>
        <h2 className={styles.resetTitle}>Đặt lại mật khẩu</h2>
        <form onSubmit={handleSubmit}>
          <label className={styles.resetLabel}>Email:</label>
          <input
            type="email"
            className={styles.resetInput}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className={styles.resetLabel}>OTP:</label>
          <input
            type="text"
            className={styles.resetInput}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          <label className={styles.resetLabel}>Mật khẩu mới:</label>
          <input
            type="password"
            className={styles.resetInput}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <button type="submit" className={styles.resetButton}>
            Đặt lại mật khẩu
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
