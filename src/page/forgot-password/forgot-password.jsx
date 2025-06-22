import React, { useState } from 'react';
import api from '../../config/axios';
import { toast } from 'react-toastify';
import styles from './forgotPassword.module.css';
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
    <div className={styles['forgot-wrapper']}>
      <div className={styles['forgot-container']}>
        <h2 className={styles['forgot-title']}>🔐 Quên mật khẩu</h2>
        <form onSubmit={handleSubmit}>
          <label className={styles['forgot-label']}>Email</label>
          <input
            type="email"
            className={styles['forgot-input']}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email đã đăng ký"
            required
          />
          <button type="submit" className={styles['forgot-button']}>
            Gửi OTP
          </button>
        </form>
      </div>
    </div>
  );
  
};

export default ForgotPassword;
