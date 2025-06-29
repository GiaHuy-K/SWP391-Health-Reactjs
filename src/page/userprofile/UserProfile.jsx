import React, { useState, useEffect } from "react";
import { useAuth } from "../../config/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../config/axios";
import styles from "./UserProfile.module.css";
import { isParentRole } from "../../config/AuthContext";



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
  const [vaccineForm, setVaccineForm] = useState({
    vaccineName: "",
    vaccinationDate: "",
    provider: "",
    notes: "",
    proofFile: null,
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showVaccineModal, setShowVaccineModal] = useState(false);

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
      await api.post("/parent/link-student", linkForm);
      toast.success("Liên kết học sinh thành công!");
      setLinkForm({ invitationCode: "", relationshipType: "" });
      fetchUserProfile();
    } catch (err) {
      toast.error(err.response?.data?.message || "Liên kết thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVaccineChange = (e) => {
    const { name, value } = e.target;
    setVaccineForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setVaccineForm((prev) => ({ ...prev, proofFile: file }));
  };

  const handleVaccineSubmit = async (e) => {
    e.preventDefault();
    if (!vaccineForm.vaccineName || !vaccineForm.vaccinationDate || !vaccineForm.provider || !vaccineForm.proofFile) {
      toast.error("Vui lòng nhập đầy đủ thông tin bắt buộc");
      return;
    }
    if (!studentInfo || studentInfo.length === 0) {
      toast.error("Không tìm thấy thông tin học sinh");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('vaccineName', vaccineForm.vaccineName);
      formData.append('vaccinationDate', vaccineForm.vaccinationDate);
      formData.append('provider', vaccineForm.provider);
      if (vaccineForm.notes) {
        formData.append('notes', vaccineForm.notes);
      }
      formData.append('proofFile', vaccineForm.proofFile);

      await api.post(`/students/${studentInfo[0].id}/vaccinations`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      toast.success("Khai báo thông tin vaccine thành công!");
      setVaccineForm({
        vaccineName: "",
        vaccinationDate: "",
        provider: "",
        notes: "",
        proofFile: null,
      });
      setShowVaccineModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Khai báo thông tin vaccine thất bại");
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

  const handleLogoClick = () => {
    navigate('/');
  };

  // Hàm điều hướng đến dashboard tương ứng với role
  const handleDashboardClick = () => {
    switch (user?.role) {
      case "Hệ thống":
      case "Quản trị viên Trường học":
        navigate('/dashboard/overview');
        break;
      case "Quản lý Nhân sự/Nhân viên":
        navigate('/dashboardManager/event-Manager');
        break;
      case "Nhân viên Y tế":
        navigate('/dashboardNurse/event-Nurse');
        break;
      default:
        // Parent không có dashboard riêng
        break;
    }
  };

  // Kiểm tra xem user có phải là Parent không
  const isParent = isParentRole(user);
  
  // Debug log để kiểm tra role
  console.log("User role:", user?.role);
  console.log("LocalStorage userRole:", localStorage.getItem("userRole"));
  console.log("Is Parent:", isParent);

  if (loading || !user) {
    return <div className={styles.profileLoading}>Đang tải thông tin...</div>;
  }

  return (
    <div className={styles.userprofileContainer}>
      <div className={styles.layoutContainer}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.logoSection} onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
              <div className={styles.logoIcon}>
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M39.475 21.6262C40.358 21.4363 40.6863 21.5589 40.7581 21.5934C40.7876 21.655 40.8547 21.857 40.8082 22.3336C40.7408 23.0255 40.4502 24.0046 39.8572 25.2301C38.6799 27.6631 36.5085 30.6631 33.5858 33.5858C30.6631 36.5085 27.6632 38.6799 25.2301 39.8572C24.0046 40.4502 23.0255 40.7407 22.3336 40.8082C21.8571 40.8547 21.6551 40.7875 21.5934 40.7581C21.5589 40.6863 21.4363 40.358 21.6262 39.475C21.8562 38.4054 22.4689 36.9657 23.5038 35.2817C24.7575 33.2417 26.5497 30.9744 28.7621 28.762C30.9744 26.5497 33.2417 24.7574 35.2817 23.5037C36.9657 22.4689 38.4054 21.8562 39.475 21.6262ZM4.41189 29.2403L18.7597 43.5881C19.8813 44.7097 21.4027 44.9179 22.7217 44.7893C24.0585 44.659 25.5148 44.1631 26.9723 43.4579C29.9052 42.0387 33.2618 39.5667 36.4142 36.4142C39.5667 33.2618 42.0387 29.9052 43.4579 26.9723C44.1631 25.5148 44.659 24.0585 44.7893 22.7217C44.9179 21.4027 44.7097 19.8813 43.5881 18.7597L29.2403 4.41187C27.8527 3.02428 25.8765 3.02573 24.2861 3.36776C22.6081 3.72863 20.7334 4.58419 18.8396 5.74801C16.4978 7.18716 13.9881 9.18353 11.5858 11.5858C9.18354 13.988 7.18717 16.4978 5.74802 18.8396C4.58421 20.7334 3.72865 22.6081 3.36778 24.2861C3.02574 25.8765 3.02429 27.8527 4.41189 29.2403Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
              <h2 className={styles.logoText}>SchoolMed</h2>
            </div>
            <div className={styles.navSection}>
              <div className={styles.navLinks}>
                <a className={styles.navLink} href="#" onClick={handleGoHome}>Homepage</a>
                {!isParent && (
                  <a className={styles.navLink} href="#" onClick={handleDashboardClick}>Dashboard</a>
                )}
                {isParent && user.linkedToStudent && (
                  <a className={styles.navLink} href="#" onClick={() => setShowVaccineModal(true)}>Vaccination Declaration</a>
                )}
                <a className={styles.navLink} href="#" onClick={() => setShowPasswordModal(true)}>Change Password</a>
              </div>
              <button className={styles.logoutBtn} onClick={handleLogout}>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>

        <div className={styles.mainContent}>
          <div className={styles.contentContainer}>
            <div className={styles.pageTitle}>
              <h1>User Profile</h1>
            </div>

            <div className={styles.formSection}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Full Name</label>
                <input
                  className={styles.formInput}
                  type="text"
                  value={user.fullName || ""}
                  readOnly
                  placeholder="Full Name"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Email</label>
                <input
                  className={styles.formInput}
                  type="email"
                  value={user.email || ""}
                  readOnly
                  placeholder="Email"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Phone Number</label>
                <input
                  className={styles.formInput}
                  type="text"
                  value={user.phoneNumber || ""}
                  readOnly
                  placeholder="Phone Number"
                />
              </div>
            </div>

            {/* Chỉ hiển thị form liên kết nếu là phụ huynh và chưa liên kết học sinh */}
            {isParent && !user.linkedToStudent && (
              <div className={styles.linkSection}>
                <h2 className={styles.sectionTitle}>Link User and Student Accounts</h2>
                <form onSubmit={handleLinkSubmit} className={styles.linkForm}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Invitation Code</label>
                    <input
                      className={styles.formInput}
                      type="text"
                      name="invitationCode"
                      value={linkForm.invitationCode}
                      onChange={handleLinkChange}
                      placeholder="Enter invitation code"
                      maxLength={20}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Relationship Type</label>
                    <select
                      className={styles.formInput}
                      name="relationshipType"
                      value={linkForm.relationshipType}
                      onChange={handleLinkChange}
                      required
                    >
                      <option value="">Select relationship type</option>
                      <option value="FATHER">Father</option>
                      <option value="MOTHER">Mother</option>
                      <option value="GUARDIAN">Guardian</option>
                      <option value="GRANDFATHER">Grandfather</option>
                      <option value="GRANDMOTHER">Grandmother</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>

                  <div className={styles.formActions}>
                    <button
                      type="submit"
                      className={styles.submitBtn}
                      disabled={submitting}
                    >
                      {submitting ? "Đang xử lý..." : "Link to Student"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {user.linkedToStudent && Array.isArray(studentInfo) && studentInfo.length > 0 && (
              <div className={styles.studentSection}>
                <h2 className={styles.sectionTitle}>Linked Student Information</h2>
                <div className={styles.studentInfo}>
                  <div className={styles.infoItem}>
                    <strong>Full Name:</strong> {studentInfo[0].fullName}
                  </div>
                  <div className={styles.infoItem}>
                    <strong>Student Code:</strong> {studentInfo[0].id}
                  </div>
                  <div className={styles.infoItem}>
                    <strong>Class:</strong> {studentInfo[0].className}
                  </div>
                  <div className={styles.infoItem}>
                    <strong>Date of Birth:</strong> {studentInfo[0].dateOfBirth}
                  </div>
                  <div className={styles.infoItem}>
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
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Change Password</h2>
              <button 
                className={styles.modalClose}
                onClick={() => setShowPasswordModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handlePasswordSubmit} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Current Password</label>
                <input
                  className={styles.formInput}
                  type="password"
                  name="oldPassword"
                  value={passwordForm.oldPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>New Password</label>
                <input
                  className={styles.formInput}
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Confirm New Password</label>
                <input
                  className={styles.formInput}
                  type="password"
                  name="confirmNewPassword"
                  value={passwordForm.confirmNewPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                  required
                />
              </div>
              <div className={styles.modalActions}>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={submitting}
                >
                  {submitting ? "Đang xử lý..." : "Update Password"}
                </button>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Vaccine Declaration Modal */}
      {showVaccineModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Khai báo thông tin vaccine</h2>
              <button 
                className={styles.modalClose}
                onClick={() => setShowVaccineModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleVaccineSubmit} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Tên vaccine *</label>
                <input
                  className={styles.formInput}
                  type="text"
                  name="vaccineName"
                  value={vaccineForm.vaccineName}
                  onChange={handleVaccineChange}
                  placeholder="Nhập tên vaccine"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Ngày tiêm chủng *</label>
                <input
                  className={styles.formInput}
                  type="date"
                  name="vaccinationDate"
                  value={vaccineForm.vaccinationDate}
                  onChange={handleVaccineChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Nơi tiêm chủng *</label>
                <input
                  className={styles.formInput}
                  type="text"
                  name="provider"
                  value={vaccineForm.provider}
                  onChange={handleVaccineChange}
                  placeholder="Nhập nơi tiêm chủng"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Ghi chú</label>
                <textarea
                  className={styles.formTextarea}
                  name="notes"
                  value={vaccineForm.notes}
                  onChange={handleVaccineChange}
                  placeholder="Nhập ghi chú (nếu có)"
                  rows="3"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>File bằng chứng *</label>
                <input
                  className={styles.formInput}
                  type="file"
                  name="proofFile"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  required
                />
                <small style={{ color: '#666', fontSize: '12px' }}>
                  Chấp nhận file: PDF, JPG, PNG
                </small>
              </div>
              <div className={styles.modalActions}>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={submitting}
                >
                  {submitting ? "Đang xử lý..." : "Khai báo"}
                </button>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setShowVaccineModal(false)}
                >
                  Hủy
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
