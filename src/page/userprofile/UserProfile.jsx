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
        // //console.log(raw);
        console.log(studentRes);
        // return content;
        console.log("studentRes", studentRes);
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
        // Không có quyền lấy profile, có thể là chưa liên kết học sinh
        setUser({}); // Để render form liên kết student
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

  // Đổi mật khẩu
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

  // Liên kết học sinh
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
    <div className="userprofile-root">
      <div className="userprofile-header">
        <h1>User Profile</h1>
        <div className="userprofile-header-actions">
          <button className="button button-home" onClick={handleGoHome}>
            Trang chủ
          </button>
          <button
            type="button"
            className="button-logout"
            onClick={handleLogout}
            title="Đăng xuất"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
      <div className="userprofile-section">
        <h2>User Profile</h2>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            value={user.fullName || ""}
            readOnly
            placeholder="Full Name"
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={user.email || ""}
            readOnly
            placeholder="Email"
          />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="text"
            value={user.phoneNumber || ""}
            readOnly
            placeholder="Phone Number"
          />
        </div>
        <button
          type="button"
          className="button button-success"
          style={{ marginTop: "12px" }}
          onClick={() => setShowPasswordModal(true)}
        >
          Change Password
        </button>
      </div>
      {/* Modal đổi mật khẩu */}
      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2>Change Password</h2>
            <form onSubmit={handlePasswordSubmit} autoComplete="off">
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  name="oldPassword"
                  value={passwordForm.oldPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                  required
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
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
                  className="button button-success"
                  disabled={submitting}
                >
                  Update Password
                </button>
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </button>
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
              <input
                type="text"
                name="invitationCode"
                value={linkForm.invitationCode}
                onChange={handleLinkChange}
                placeholder="Enter invitation code"
                required
              />
            </div>
            <div className="form-group">
              <label>Relationship</label>
              <select
                name="relationshipType"
                value={linkForm.relationshipType}
                onChange={handleLinkChange}
                required
              >
                <option value="">Select relationship</option>
                {RELATIONSHIP_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-action-right">
              <button
                type="submit"
                className="button button-success"
                disabled={submitting}
              >
                Link to Student
              </button>
            </div>
          </form>
        </div>
      )}
      {user.linkedToStudent && Array.isArray(studentInfo) && studentInfo.length > 0 && (
  <div className="userprofile-section student-info-section">
  
    <h2>Linked Student</h2>
    <div className="student-info-list">
      <div><strong>Full Name:</strong> {studentInfo[0].fullName}</div>
      <div><strong>Student Code:</strong> {studentInfo[0].studentCode}</div>
      <div><strong>Class:</strong> {studentInfo[0].className}</div>
      <div><strong>Date of Birth:</strong> {studentInfo[0].dateOfBirth}</div>
      <div><strong>Gender:</strong> {studentInfo[0].gender}</div>
    </div>
  </div>
)}
    </div>
  );
};

export default UserProfile;
