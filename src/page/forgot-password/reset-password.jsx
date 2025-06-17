import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../config/axios';
import { toast } from 'react-toastify';
import './resetPassword.css';

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
      navigate('/login'); // chuyển sang trang đăng nhập sau khi reset xong
    } catch (error) {
      toast.error('Đặt lại mật khẩu thất bại. Vui lòng kiểm tra OTP và email!');
      console.error(error);
    }
  };

  return (
    <div className="reset-wrapper">
      <div className="reset-container">
        <h2 className="reset-title">Đặt lại mật khẩu</h2>
        <form onSubmit={handleSubmit}>
          <label className="reset-label">Email:</label>
          <input
            type="email"
            className="reset-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="reset-label">OTP:</label>
          <input
            type="text"
            className="reset-input"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          <label className="reset-label">Mật khẩu mới:</label>
          <input
            type="password"
            className="reset-input"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <button type="submit" className="reset-button">
            Đặt lại mật khẩu
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
