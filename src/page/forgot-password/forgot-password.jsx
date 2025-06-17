import React, { useState } from 'react';
import api from '../../config/axios';
import { toast } from 'react-toastify';
import './forgotPassword.css'; 
import { useNavigate } from 'react-router-dom';

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
    <div className="forgot-container">
      <h2 className="forgot-title">Quên mật khẩu</h2>
      <form onSubmit={handleSubmit}>
        <label className="forgot-label">Email:</label>
        <input
          type="email"
          className="forgot-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Nhập email đã đăng ký"
          required
        />
        <button type="submit" className="forgot-button">
          Gửi OTP
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
