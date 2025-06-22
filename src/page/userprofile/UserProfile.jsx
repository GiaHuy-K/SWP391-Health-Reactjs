import React, { useState, useEffect } from "react";
import { useAuth } from "../../config/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../config/axios";
import styles from "./UserProfile.module.css";

const RELATIONSHIP_OPTIONS = [
  { value: "FATHER", label: "Bố" },
  { value: "MOTHER", label: "Mẹ" },
  { value: "GUARDIAN", label: "Người giám hộ" },
  { value: "GRANDFATHER", label: "Ông" },
  { value: "GRANDMOTHER", label: "Bà" },
  { value: "OTHER", label: "Khác" },
];

// Component nhỏ để hiển thị một mục thông tin
const InfoItem = ({ label, value }) => (
  <div className={styles.infoItem}>
    <label className={styles.formLabel}>{label}</label>
    <div className={styles.infoText}>{value}</div>
  </div>
);

const UserProfile = () => {
  const { logout, user: authUser } = useAuth();
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
      const userRole = authUser?.role;
      
      if (userRole === "Parent") {
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
      } else {
        try {
          const res = await api.get("/user/profile/me");
          setUser(res.data);
          setStudentInfo(null);
        } catch (err) {
          if (err.response?.status === 401) {
            toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
            logout();
            navigate("/login");
          } else {
            toast.error("Không thể tải thông tin cá nhân");
            setUser({});
          }
        }
      }
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
        logout();
        navigate("/login");
      } else if (err.response?.status === 403) {
        if (authUser?.role === "Parent") {
          setUser({});
          setStudentInfo(null);
          toast.warn("Bạn cần liên kết học sinh để sử dụng các chức năng!");
        } else {
          toast.error("Không thể tải thông tin cá nhân");
          setUser({});
        }
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
    const userRole = authUser?.role;
    if (userRole === "SchoolAdmin") {
      navigate("/dashboard");
    } else if (userRole === "StaffManager") {
      navigate("/dashboardManager");
    } else if (userRole === "MedicalStaff") {
      navigate("/dashboardNurse");
    } else {
      navigate("/");
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case "SchoolAdmin":
        return "Quản trị viên";
      case "Manager":
        return "Quản lý";
      case "Nurse":
        return "Y tá";
      case "Parent":
        return "Phụ huynh";
      default:
        return role;
    }
  };

  if (loading || !user) {
    return <div className={styles.profileLoading}>Đang tải thông tin...</div>;
  }

  const isParent = authUser?.role === "Parent";

  return (
    <div className={styles.userprofileContainer}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link to="/" className={styles.logoSection}>
            <div className={styles.logoIcon}>
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor"></path>
              </svg>
            </div>
            <h2 className={styles.logoText}>SchoolMed</h2>
          </Link>
          <div className={styles.navSection}>
            <div className={styles.navLinks}>
              {!isParent && (
                <a className={styles.navLink} onClick={handleGoHome}>Dashboard</a>
              )}
              <a className={styles.navLink} onClick={() => setShowPasswordModal(true)}>Đổi mật khẩu</a>
            </div>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </header>

      <main className={styles.mainContent}>
        <h1 className={styles.pageTitle}>Hồ sơ cá nhân</h1>

        {/* User Information Card */}
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Thông tin tài khoản</h2>
          <div className={styles.infoGrid}>
            <InfoItem label="Họ và tên" value={user.fullName || "Chưa cập nhật"} />
            <InfoItem label="Email" value={user.email || "Chưa cập nhật"} />
            <InfoItem label="Số điện thoại" value={user.phoneNumber || "Chưa cập nhật"} />
            <InfoItem label="Vai trò" value={getRoleDisplayName(user.role || authUser?.role) || ""} />
          </div>
        </div>

        {/* Link Student Form Card (for Parents only) */}
        {isParent && !user.linkedToStudent && (
          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Liên kết tài khoản với học sinh</h2>
            <form onSubmit={handleLinkSubmit}>
              <div className={styles.infoGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Mã mời</label>
                  <input
                    className={styles.formInput}
                    type="text"
                    name="invitationCode"
                    value={linkForm.invitationCode}
                    onChange={handleLinkChange}
                    placeholder="Nhập mã mời của học sinh"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Mối quan hệ</label>
                  <select
                    className={styles.formSelect}
                    name="relationshipType"
                    value={linkForm.relationshipType}
                    onChange={handleLinkChange}
                    required
                  >
                    <option value="">Chọn mối quan hệ</option>
                    {RELATIONSHIP_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={styles.formActions}>
                <button type="submit" className={styles.submitBtn} disabled={submitting}>
                  {submitting ? "Đang xử lý..." : "Liên kết ngay"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Linked Student Info Card (for Parents only) */}
        {isParent && user.linkedToStudent && Array.isArray(studentInfo) && studentInfo.length > 0 && (
          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Thông tin học sinh đã liên kết</h2>
            <div className={styles.studentInfo}>
               {studentInfo.map(student => (
                  <div key={student.studentId} className={styles.infoItem}>
                    <strong>Họ và tên:</strong> {student.fullName}<br/>
                    <strong>Mã học sinh:</strong> {student.studentCode}<br/>
                    <strong>Lớp:</strong> {student.className}<br/>
                    <strong>Ngày sinh:</strong> {student.dateOfBirth}<br/>
                    <strong>Giới tính:</strong> {student.gender}
                  </div>
                ))}
            </div>
          </div>
        )}
      </main>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Đổi mật khẩu</h2>
              <button className={styles.modalClose} onClick={() => setShowPasswordModal(false)}>×</button>
            </div>
            <form onSubmit={handlePasswordSubmit} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Mật khẩu hiện tại</label>
                <input
                  className={styles.formInput}
                  type="password"
                  name="oldPassword"
                  value={passwordForm.oldPassword}
                  onChange={handlePasswordChange}
                  placeholder="Nhập mật khẩu hiện tại"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Mật khẩu mới</label>
                <input
                  className={styles.formInput}
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Nhập mật khẩu mới"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Xác nhận mật khẩu mới</label>
                <input
                  className={styles.formInput}
                  type="password"
                  name="confirmNewPassword"
                  value={passwordForm.confirmNewPassword}
                  onChange={handlePasswordChange}
                  placeholder="Xác nhận lại mật khẩu mới"
                  required
                />
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowPasswordModal(false)}>
                  Hủy
                </button>
                <button type="submit" className={styles.submitBtn} disabled={submitting}>
                  {submitting ? "Đang cập nhật..." : "Cập nhật"}
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
