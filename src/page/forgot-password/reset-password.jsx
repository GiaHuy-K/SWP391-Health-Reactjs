import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../config/axios';
import { toast } from 'react-toastify';
import styles from './ResetPassword.module.css';

const ResetPassword = () => {
  // State để lưu trữ thông tin người dùng nhập vào
  // Sử dụng useState để quản lý trạng thái email, OTP và mật khẩu mới
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const navigate = useNavigate();
  // Hàm xử lý khi người dùng gửi form
  // Hàm này sẽ được gọi khi người dùng nhấn nút "Đặt lại mật khẩu"
  // Nó sẽ gửi yêu cầu đến API để đặt lại mật khẩu mới  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      toast.warning('Mật khẩu xác nhận không khớp!');
      return;
    }

    try {
      await api.post('/auth/reset-password', {
        email,
        otp,
        newPassword,
        confirmNewPassword,
      });

      toast.success('Đặt lại mật khẩu thành công!');
      navigate('/login');
    } catch (error) {
      toast.error('Đặt lại mật khẩu thất bại. Vui lòng kiểm tra thông tin!');
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

          <label className={styles.resetLabel}>Xác nhận mật khẩu mới:</label>
          <input
            type="password"
            className={styles.resetInput}
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
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
