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
    const errors = {};

    if (!passwordForm.oldPassword.trim()) {
      errors.oldPassword = "Mật khẩu hiện tại là bắt buộc";
    } else if (passwordForm.oldPassword.length < 8) {
      errors.oldPassword = "Mật khẩu hiện tại phải có ít nhất 8 ký tự";
    }

    if (!passwordForm.newPassword.trim()) {
      errors.newPassword = "Mật khẩu mới là bắt buộc";
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = "Mật khẩu mới phải có ít nhất 8 ký tự";
    }

    if (!passwordForm.confirmNewPassword.trim()) {
      errors.confirmNewPassword = "Xác nhận mật khẩu mới là bắt buộc";
    } else if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      errors.confirmNewPassword = "Mật khẩu mới không khớp";
    }

    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((error) => toast.error(error));
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
            <img
              src="/logo_medical_health_system.jpg"
              alt="SchoolMed Logo"
              style={{ width: 48, height: 48, objectFit: "contain" }}
            />
          </div>
              <h2 className={styles.logoText}>SchoolMed</h2>
            </div>
            <div className={styles.navSection}>
              <div className={styles.navLinks}>
                <a className={styles.navLink} href="#" onClick={handleGoHome}>Trang chủ</a>
                {!isParent && (
                  <a className={styles.navLink} href="#" onClick={handleDashboardClick}>Bảng số liệu</a>
                )}
                {isParent && user.linkedToStudent && (
                  <a className={styles.navLink} href="#" onClick={() => setShowVaccineModal(true)}>Khai báo vaccine đã tiêm</a>
                )}
                <a className={styles.navLink} href="#" onClick={() => setShowPasswordModal(true)}>Đổi mật khẩu</a>
              </div>
              <button className={styles.logoutBtn} onClick={handleLogout}>
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        </header>

        <div className={styles.mainContent}>
          <div className={styles.contentContainer}>
            <div className={styles.pageTitle}>
              <h1>Hồ sơ cá nhân</h1>
            </div>

            <div className={styles.formSection}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Họ và tên</label>
                <input
                  className={styles.formInput}
                  type="text"
                  value={user.fullName || ""}
                  readOnly
                  placeholder="Họ và tên"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Email *</label>
                <input
                  className={styles.formInput}
                  type="email"
                  value={user.email || ""}
                  readOnly
                  placeholder="Email *"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Số điện thoại</label>
                <input
                  className={styles.formInput}
                  type="text"
                  value={user.phoneNumber || ""}
                  readOnly
                  placeholder="Số điện thoại"
                />
              </div>
            </div>

            {/* Chỉ hiển thị form liên kết nếu là phụ huynh và chưa liên kết học sinh */}
            {isParent && !user.linkedToStudent && (
              <div className={styles.linkSection}>
                <h2 className={styles.sectionTitle}>Liên kết tài khoản học sinh bạn giám hộ</h2>
                <form onSubmit={handleLinkSubmit} className={styles.linkForm}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Mã liên kết</label>
                    <input
                      className={styles.formInput}
                      type="text"
                      name="invitationCode"
                      value={linkForm.invitationCode}
                      onChange={handleLinkChange}
                      placeholder="Nhập mã liên kết"
                      maxLength={20}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Quan hệ với học sinh</label>
                    <select
                      className={styles.formInput}
                      name="relationshipType"
                      value={linkForm.relationshipType}
                      onChange={handleLinkChange}
                      required
                    >
                      <option value="">Chọn quan hệ</option>
                      <option value="FATHER">Cha</option>
                      <option value="MOTHER">Mẹ</option>
                      <option value="GUARDIAN">Người giám hộ</option>
                      <option value="GRANDFATHER">Ông nội</option>
                      <option value="GRANDMOTHER">Bà nội</option>
                      <option value="OTHER">Khác</option>
                    </select>
                  </div>

                  <div className={styles.formActions}>
                    <button
                      type="submit"
                      className={styles.submitBtn}
                      disabled={submitting}
                    >
                      {submitting ? "Đang xử lý..." : "Liên kết"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {user.linkedToStudent && Array.isArray(studentInfo) && studentInfo.length > 0 && (
              <div className={styles.studentSection}>
                <h2 className={styles.sectionTitle}>Thông tin học sinh đã liên kết</h2>
                <div className={styles.studentInfo}>
                  <div className={styles.infoItem}>
                    <strong>Họ và tên:</strong> {studentInfo[0].fullName}
                  </div>
                  <div className={styles.infoItem}>
                    <strong>Mã học sinh:</strong> {studentInfo[0].id}
                  </div>
                  <div className={styles.infoItem}>
                    <strong>Lớp:</strong> {studentInfo[0].className}
                  </div>
                  <div className={styles.infoItem}>
                    <strong>Ngày sinh:</strong> {studentInfo[0].dateOfBirth}
                  </div>
                  <div className={styles.infoItem}>
                    <strong>Giới tính:</strong> {studentInfo[0].gender}
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
                  placeholder="Xác nhận mật khẩu mới"
                  required
                />
              </div>
              <div className={styles.modalActions}>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={submitting}
                >
                  {submitting ? "Đang xử lý..." : "Cập nhật"}
                </button>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setShowPasswordModal(false)}
                >
                  Hủy
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
                <label className={styles.formLabel}>Tên vaccine</label>
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
                <label className={styles.formLabel}>Ngày tiêm chủng</label>
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
                <label className={styles.formLabel}>Nơi tiêm chủng</label>
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
                <label className={styles.formLabel}>File bằng chứng</label>
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
                  {submitting ? "Đang xử lý..." : "Xác nhận thông tin"}
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
