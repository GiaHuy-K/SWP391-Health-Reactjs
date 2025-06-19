import React, { useState, useEffect } from 'react';
import { useAuth } from '../../config/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../config/axios';
import './UserProfile.css';

const RELATIONSHIP_OPTIONS = [
  { value: 'FATHER', label: 'Bố' },
  { value: 'MOTHER', label: 'Mẹ' },
  { value: 'GUARDIAN', label: 'Người giám hộ' },
  { value: 'OTHER', label: 'Khác' },
];

const UserProfile = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [studentInfo, setStudentInfo] = useState(null);
  const [infoForm, setInfoForm] = useState({ fullName: '', email: '', phoneNumber: '' });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [linkForm, setLinkForm] = useState({
    invitationCode: '',
    relationshipType: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const res = await api.get('/user/profile/me');
      setUser(res.data);
      setInfoForm({
        fullName: res.data.fullName || '',
        email: res.data.email || '',
        phoneNumber: res.data.phoneNumber || ''
      });
      if (res.data.linkedToStudent) {
        const studentRes = await api.get('/parent/linked-student');
        setStudentInfo(studentRes.data);
      } else {
        setStudentInfo(null);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
        logout();
        navigate('/login');
      } else if (err.response?.status === 403) {
        // Không có quyền lấy profile, có thể là chưa liên kết học sinh
        setUser({}); // Để render form liên kết student
        setStudentInfo(null);
        toast.warn('Bạn cần liên kết học sinh để sử dụng các chức năng!');
      } else {
        toast.error('Không thể tải thông tin cá nhân');
        setUser({});
        setStudentInfo(null);
      }
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật thông tin cá nhân
  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setInfoForm(prev => ({ ...prev, [name]: value }));
  };
  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      //doi them API update thông tin cá nhân
      await api.put('/user/profile/update', infoForm);
      toast.success('Cập nhật thông tin thành công');
      fetchUserProfile();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cập nhật thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  // Đổi mật khẩu
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      toast.error('Mật khẩu mới không khớp');
      return;
    }
    setSubmitting(true);
    try {
      await api.put('/user/profile/change-password', passwordForm);
      toast.success('Đổi mật khẩu thành công');
      setPasswordForm({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
      setShowPasswordModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Đổi mật khẩu thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  // Liên kết học sinh
  const handleLinkChange = (e) => {
    const { name, value } = e.target;
    setLinkForm(prev => ({ ...prev, [name]: value }));
  };
  const handleLinkSubmit = async (e) => {
    e.preventDefault();
    if (!linkForm.invitationCode || !linkForm.relationshipType) {
      toast.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/parent/link-student', linkForm);
      toast.success('Liên kết học sinh thành công!');
      setLinkForm({ invitationCode: '', relationshipType: '' });
      fetchUserProfile();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Liên kết thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Đăng xuất thành công');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  if (loading || !user) {
    return <div className="profile-loading">Đang tải thông tin...</div>;
  }

  return (
    <div className="userprofile-root">
      <div className="userprofile-header">
        <h1>User Profile</h1>
        <div className="userprofile-header-actions">
          <button className="button button-home" onClick={handleGoHome}>Trang chủ</button>
          <button className="button button-logout" onClick={handleLogout}>Logout</button>
        </div>
      </div>
      <div className="userprofile-section">
        <h2>User Info</h2>
        <form onSubmit={handleInfoSubmit} autoComplete="off">
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="fullName" value={infoForm.fullName} onChange={handleInfoChange} placeholder="Enter full name" required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={infoForm.email} onChange={handleInfoChange} placeholder="Enter email" required />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="text" name="phoneNumber" value={infoForm.phoneNumber} onChange={handleInfoChange} placeholder="Enter phone number" required />
          </div>
          <div className="form-action-right" style={{gap: '12px'}}>
            <button type="button" className="button button-success" onClick={() => setShowPasswordModal(true)}>Change Password</button>
            <button type="submit" className="button button-success" disabled={submitting}>Update Info</button>
          </div>
        </form>
      </div>
      {/* Modal đổi mật khẩu */}
      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2>Change Password</h2>
            <form onSubmit={handlePasswordSubmit} autoComplete="off">
              <div className="form-group">
                <label>Current Password</label>
                <input type="password" name="oldPassword" value={passwordForm.oldPassword} onChange={handlePasswordChange} placeholder="Enter current password" required />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input type="password" name="newPassword" value={passwordForm.newPassword} onChange={handlePasswordChange} placeholder="Enter new password" required />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input type="password" name="confirmNewPassword" value={passwordForm.confirmNewPassword} onChange={handlePasswordChange} placeholder="Confirm new password" required />
              </div>
              <div className="modal-actions">
                <button type="submit" className="button button-success" disabled={submitting}>Update Password</button>
                <button type="button" className="button button-secondary" onClick={() => setShowPasswordModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {!user.linkedToStudent && (
        <div className="userprofile-section">
          <h2>Link to Student</h2>
          <form onSubmit={handleLinkSubmit} autoComplete="off">
            <div className="form-group">
              <label>Invitation Code</label>
              <input type="text" name="invitationCode" value={linkForm.invitationCode} onChange={handleLinkChange} placeholder="Enter invitation code" required />
            </div>
            <div className="form-group">
              <label>Relationship</label>
              <select name="relationshipType" value={linkForm.relationshipType} onChange={handleLinkChange} required>
                <option value="">Select relationship</option>
                {RELATIONSHIP_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="form-action-right">
              <button type="submit" className="button button-success" disabled={submitting}>Link to Student</button>
            </div>
          </form>
        </div>
      )}
      {user.linkedToStudent && studentInfo && (
        <div className="userprofile-section student-info-section">
          <h2>Linked Student</h2>
          <div className="student-info-list">
            <div><strong>Full Name:</strong> {studentInfo.fullName}</div>
            <div><strong>Student Code:</strong> {studentInfo.studentCode}</div>
            <div><strong>Class:</strong> {studentInfo.className}</div>
            <div><strong>Date of Birth:</strong> {studentInfo.dateOfBirth}</div>
            <div><strong>Gender:</strong> {studentInfo.gender}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile; 