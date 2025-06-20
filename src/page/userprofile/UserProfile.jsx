import React, { useState, useEffect } from "react";
import { useAuth } from "../../config/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../config/axios";
import "./UserProfile.css";

const RELATIONSHIP_OPTIONS = [
  { value: "FATHER", label: "Bố" },
  { value: "MOTHER", label: "Mẹ" },
  { value: "GUARDIAN", label: "Người giám hộ" },
  { value: "GRANDFATHER", label: "Ông" },
  { value: "GRANDMOTHER", label: "Bà" },
  { value: "OTHER", label: "Khác" },
];

const UserProfile = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [studentInfo, setStudentInfo] = useState(null);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [linkForm, setLinkForm] = useState({
    invitationCode: "",
    relationshipType: "",
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
      const res = await api.get("/user/profile/me");
      setUser(res.data);
      if (res.data.linkedToStudent) {
        const response = await api.get("/parent/my-students");
        const raw = response.data;
        const studentRes = Array.isArray(raw.content) ? raw.content : [];
        console.log(studentRes);
        setStudentInfo(studentRes);
      } else {
        setStudentInfo(null);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
        logout();
        navigate("/login");
      } else if (err.response?.status === 403) {
        setUser({});
        setStudentInfo(null);
        toast.warn("Bạn cần liên kết học sinh để sử dụng các chức năng!");
      } else {
        toast.error("Không thể tải thông tin cá nhân");
        setUser({});
        setStudentInfo(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      toast.error("Mật khẩu mới không khớp");
      return;
    }
    setSubmitting(true);
    try {
      await api.put("/user/profile/change-password", passwordForm);
      toast.success("Đổi mật khẩu thành công");
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      setShowPasswordModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Đổi mật khẩu thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLinkChange = (e) => {
    const { name, value } = e.target;
    setLinkForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLinkSubmit = async (e) => {
    e.preventDefault();
    if (!linkForm.invitationCode || !linkForm.relationshipType) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/parent/my-students", linkForm);
      toast.success("Liên kết học sinh thành công!");
      setLinkForm({ invitationCode: "", relationshipType: "" });
      fetchUserProfile();
    } catch (err) {
      toast.error(err.response?.data?.message || "Liên kết thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("Đăng xuất thành công");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  if (loading || !user) {
    return <div className="profile-loading">Đang tải thông tin...</div>;
  }

  return (
    <div className="userprofile-container">
      <div className="layout-container">
        <header className="header">
          <div className="header-content">
            <div className="logo-section">
              <div className="logo-icon">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
              <h2 className="logo-text">SchoolMed</h2>
            </div>
            <div className="nav-section">
              <div className="nav-links">
                <a className="nav-link" href="#" onClick={handleGoHome}>Homepage</a>
                <a className="nav-link" href="#" onClick={() => setShowPasswordModal(true)}>Change Password</a>
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>

        <div className="main-content">
          <div className="content-container">
            <div className="page-title">
              <h1>User Profile</h1>
            </div>

            <div className="form-section">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  className="form-input"
                  type="text"
                  value={user.fullName || ""}
                  readOnly
                  placeholder="Full Name"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  className="form-input"
                  type="email"
                  value={user.email || ""}
                  readOnly
                  placeholder="Email"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  className="form-input"
                  type="text"
                  value={user.phoneNumber || ""}
                  readOnly
                  placeholder="Phone Number"
                />
              </div>
            </div>

            {!user.linkedToStudent && (
              <div className="link-section">
                <h2 className="section-title">Link User and Student Accounts</h2>
                <form onSubmit={handleLinkSubmit} className="link-form">
                  <div className="form-group">
                    <label className="form-label">Invitation Code</label>
                    <input
                      className="form-input"
                      type="text"
                      name="invitationCode"
                      value={linkForm.invitationCode}
                      onChange={handleLinkChange}
                      placeholder="Enter invitation code"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Relationship Type</label>
                    <select
                      className="form-select"
                      name="relationshipType"
                      value={linkForm.relationshipType}
                      onChange={handleLinkChange}
                      required
                    >
                      <option value="">Select relationship type</option>
                      {RELATIONSHIP_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-actions">
                    <button
                      type="submit"
                      className="submit-btn"
                      disabled={submitting}
                    >
                      {submitting ? "Đang xử lý..." : "Link to Student"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {user.linkedToStudent && Array.isArray(studentInfo) && studentInfo.length > 0 && (
              <div className="student-section">
                <h2 className="section-title">Linked Student Information</h2>
                <div className="student-info">
                  <div className="info-item">
                    <strong>Full Name:</strong> {studentInfo[0].fullName}
                  </div>
                  <div className="info-item">
                    <strong>Student Code:</strong> {studentInfo[0].studentCode}
                  </div>
                  <div className="info-item">
                    <strong>Class:</strong> {studentInfo[0].className}
                  </div>
                  <div className="info-item">
                    <strong>Date of Birth:</strong> {studentInfo[0].dateOfBirth}
                  </div>
                  <div className="info-item">
                    <strong>Gender:</strong> {studentInfo[0].gender}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Change Password</h2>
              <button 
                className="modal-close"
                onClick={() => setShowPasswordModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handlePasswordSubmit} className="modal-form">
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input
                  className="form-input"
                  type="password"
                  name="oldPassword"
                  value={passwordForm.oldPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  className="form-input"
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  className="form-input"
                  type="password"
                  name="confirmNewPassword"
                  value={passwordForm.confirmNewPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                  required
                />
              </div>
              <div className="modal-actions">
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={submitting}
                >
                  {submitting ? "Đang xử lý..." : "Update Password"}
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
