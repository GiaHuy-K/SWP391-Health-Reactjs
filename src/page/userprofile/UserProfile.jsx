import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../config/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../config/axios";
import styles from "./UserProfile.module.css";
import { isParentRole } from "../../config/AuthContext";
import { addStudentChronicDisease, getStudentChronicDiseases } from "../../services/api.chronic";
import { validateVaccinationDate, validateDiagnosisDate, getStudentBirthDate } from "../../utils/dateValidation";



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
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [showVaccineDetailModal, setShowVaccineDetailModal] = useState(false);
  const [selectedVaccines, setSelectedVaccines] = useState([]);
  const [selectedStudentName, setSelectedStudentName] = useState("");
  const [vaccineLoading, setVaccineLoading] = useState(false);
  const [showChronicModal, setShowChronicModal] = useState(false);
  const [chronicForm, setChronicForm] = useState({
    id: "",
    diseaseName: "",
    diagnosedDate: "",
    diagnosingDoctor: "",
    notes: "",
    attachmentFile: null,
  });
  const [chronicErrors, setChronicErrors] = useState({});
  const [chronicAdding, setChronicAdding] = useState(false);
  const chronicInputRef = useRef(null);
  const vaccineInputRef = useRef(null);

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
    if (studentInfo.length > 1 && !selectedStudentId) {
      toast.error("Vui lòng chọn học sinh cần khai báo");
      return;
    }

    // Validate vaccination date
    const studentIdToUse = selectedStudentId || (studentInfo[0] && studentInfo[0].id);
    const selectedStudent = studentInfo.find(s => String(s.id) === String(studentIdToUse));
    
    // Debug logging
    console.log('studentIdToUse:', studentIdToUse, typeof studentIdToUse);
    console.log('Selected student:', selectedStudent);
    console.log('Student dateOfBirth:', selectedStudent?.dateOfBirth);
    
    const studentBirthDate = getStudentBirthDate(selectedStudent);
    console.log('Parsed birth date:', studentBirthDate);
    
    if (!studentBirthDate) {
      toast.error("Học sinh chưa có thông tin ngày sinh. Vui lòng liên hệ admin để cập nhật thông tin học sinh.");
      return;
    }
    
    const vaccinationValidation = validateVaccinationDate(vaccineForm.vaccinationDate, studentBirthDate);
    if (!vaccinationValidation.isValid) {
      toast.error(vaccinationValidation.error);
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
      await api.post(`/students/${studentIdToUse}/vaccinations`, formData, {
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
      setSelectedStudentId("");
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

  const handleShowVaccineDetail = async (student) => {
    setShowVaccineDetailModal(true);
    setSelectedStudentName(student.fullName);
    setVaccineLoading(true);
    try {
      const res = await api.get(`/students/${student.id}/vaccinations`);
      setSelectedVaccines(res.data.content || []);
    } catch (err) {
      setSelectedVaccines([]);
      toast.error("Không thể tải danh sách vaccine");
    } finally {
      setVaccineLoading(false);
    }
  };

  const handleChronicChange = e => {
    const { name, value, files } = e.target;
    setChronicForm(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleChronicSubmit = async e => {
    e.preventDefault();
    const errors = {};
    if (!chronicForm.id) {
      errors.id = "Vui lòng chọn học sinh";
    }
    if (!chronicForm.diseaseName.trim()) {
      errors.diseaseName = "Tên bệnh mãn tính là bắt buộc";
    }
    
    // Validate diagnosis date
    if (chronicForm.diagnosedDate) {
      const selectedStudent = studentInfo.find(s => String(s.id) === String(chronicForm.id));
      
      // Debug logging
      console.log('chronicForm.id:', chronicForm.id, typeof chronicForm.id);
      console.log('Selected student for chronic:', selectedStudent);
      console.log('Student dateOfBirth for chronic:', selectedStudent?.dateOfBirth);
      
      const studentBirthDate = getStudentBirthDate(selectedStudent);
      console.log('Parsed birth date for chronic:', studentBirthDate);
      
      if (!studentBirthDate) {
        errors.diagnosedDate = "Học sinh chưa có thông tin ngày sinh. Vui lòng liên hệ admin để cập nhật thông tin học sinh.";
      } else {
        const diagnosisValidation = validateDiagnosisDate(chronicForm.diagnosedDate, studentBirthDate);
        if (!diagnosisValidation.isValid) {
          errors.diagnosedDate = diagnosisValidation.error;
        }
      }
    }
    
    if (chronicForm.attachmentFile) {
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
      if (!allowedTypes.includes(chronicForm.attachmentFile.type)) {
        errors.attachmentFile = "Chỉ chấp nhận file PDF, JPG, PNG";
      }
      if (chronicForm.attachmentFile.size > 5 * 1024 * 1024) {
        errors.attachmentFile = "Dung lượng file tối đa 5MB";
      }
    }
    setChronicErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setChronicAdding(true);
    try {
      const formData = new FormData();
      formData.append("diseaseName", chronicForm.diseaseName);
      if (chronicForm.diagnosedDate) {
        formData.append("diagnosedDate", chronicForm.diagnosedDate);
      }
      if (chronicForm.diagnosingDoctor) {
        formData.append("diagnosingDoctor", chronicForm.diagnosingDoctor);
      }
      if (chronicForm.notes) {
        formData.append("notes", chronicForm.notes);
      }
      if (chronicForm.attachmentFile) {
        formData.append("attachmentFile", chronicForm.attachmentFile);
      }
      
      await addStudentChronicDisease(chronicForm.id, formData);
      setShowChronicModal(false);
      setChronicForm({
        id: "",
        diseaseName: "",
        diagnosedDate: "",
        diagnosingDoctor: "",
        notes: "",
        attachmentFile: null,
      });
      setChronicErrors({});
    } catch (err) {
      toast.error(err.response?.data?.message || "Khai báo bệnh mãn tính thất bại");
    } finally {
      setChronicAdding(false);
    }
  };

  // Component hiển thị thông tin bệnh mãn tính của học sinh
  const ChronicDiseaseInfo = ({ studentId }) => {
    const [loading, setLoading] = useState(true);
    const [diseases, setDiseases] = useState([]);

    useEffect(() => {
      let mounted = true;
      const fetchData = async () => {
        setLoading(true);
        try {
          const res = await getStudentChronicDiseases(studentId);
          if (mounted) setDiseases(res?.content || []);
        } catch (err) {
          setDiseases([]);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
      return () => { mounted = false; };
    }, [studentId]);

    if (loading) return <div style={{ color: '#888', fontSize: 14 }}>Đang tải...</div>;
    if (!diseases || diseases.length === 0) return <div style={{ color: '#888', fontSize: 14 }}>Chưa khai báo bệnh mãn tính</div>;
    return (
      <ul style={{ paddingLeft: 18, margin: 0 }}>
        {diseases
          .filter(d => d.status === 'APPROVE' || d.status === 'Chấp nhận')
          .map((d, idx) => (
            <li key={d.id || idx} style={{ marginBottom: 8 }}>
              <div><b>Tên bệnh:</b> {d.diseaseName}</div>
              {d.diagnosedDate && <div><b>Ngày chẩn đoán:</b> {d.diagnosedDate}</div>}
              {d.diagnosingDoctor && <div><b>Bác sĩ:</b> {d.diagnosingDoctor}</div>}
              {d.notes && <div><b>Ghi chú:</b> {d.notes}</div>}
            </li>
          ))}
      </ul>
    );
  };

  if (loading || !user) {
    return <div className={styles.profileLoading}>Đang tải thông tin...</div>;
  }

  return (
    <div>
      <div className={styles.userprofileContainer}>
        <div className={styles.layoutContainer}>
          <header className={styles.header}>
            <div className={styles.headerContent}>
            <div className="flex items-center mr-10 cursor-pointer" onClick={handleLogoClick}>
              <div style={{ width: 48, height: 48 }}>
                <img
                  src="/logo_medical_health_system.jpg"
                  alt="SchoolMed Logo"
                  style={{ width: 48, height: 48, objectFit: "contain" }}
                />
              </div>
              <h2 className="ml-3 text-2xl font-['Pacifico'] text-primary">SchoolMed</h2>
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
                  {isParent && user.linkedToStudent && (
                    <a className={styles.navLink} href="#" onClick={() => setShowChronicModal(true)}>
                      Khai báo bệnh mãn tính
                    </a>
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

              {/* Chỉ hiển thị danh sách học sinh đã liên kết và nút Liên kết */}
              {user.linkedToStudent && Array.isArray(studentInfo) && studentInfo.length > 0 && (
                <div className={styles.studentSection}>
                  <h2 className={styles.sectionTitle}>Thông tin học sinh đã liên kết</h2>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
                    {studentInfo.map((student, idx) => (
                      <div
                        key={student.id}
                        style={{
                          minWidth: 280,
                          border: '1px solid #e0e0e0',
                          borderRadius: 12,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                          padding: 20,
                          marginBottom: 16,
                          background: '#fff',
                          flex: '1 1 320px',
                          maxWidth: 400,
                        }}
                      >
                        <div style={{ fontWeight: 600, marginBottom: 8 }}>
                          Học sinh {idx + 1}
                        </div>
                        <div className={styles.infoItem}>
                          <strong>Họ và tên:</strong> {student.fullName}
                        </div>
                        <div className={styles.infoItem}>
                          <strong>Mã học sinh:</strong> {student.id}
                        </div>
                        <div className={styles.infoItem}>
                          <strong>Lớp:</strong> {student.className}
                        </div>
                        <div className={styles.infoItem}>
                          <strong>Ngày sinh:</strong> {student.dateOfBirth || 'Chưa có thông tin'}
                        </div>
                        <div className={styles.infoItem}>
                          <strong>Giới tính:</strong> {student.gender}
                        </div>
                        <button
                          className={styles.submitBtn}
                          style={{ marginTop: 12 }}
                          onClick={() => handleShowVaccineDetail(student)}
                        >
                          Xem chi tiết tiêm chủng
                        </button>
                        {/* Thông tin bệnh mãn tính */}
                        <h3 style={{ margin: '18px 0 8px 0', color: '#1976d2', fontWeight: 700 }}>Thông tin bệnh mãn tính:</h3>
                        <ChronicDiseaseInfo studentId={student.id} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {isParent && (
                <div style={{ textAlign: 'center', marginTop: 24 }}>
                  <button
                    className={styles.submitBtn}
                    onClick={() => setShowLinkModal(true)}
                  >
                    Liên kết học sinh
                  </button>
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
                  onClick={() => {
                    setShowVaccineModal(false);
                    setSelectedStudentId("");
                  }}
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleVaccineSubmit} className={styles.modalForm}>
                {Array.isArray(studentInfo) && studentInfo.length > 1 && (
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Chọn học sinh</label>
                    <select
                      className={styles.formInput}
                      value={selectedStudentId}
                      onChange={e => setSelectedStudentId(e.target.value)}
                      required
                    >
                      <option value="">Chọn học sinh</option>
                      {studentInfo.map(student => (
                        <option key={student.id} value={student.id}>
                          {student.fullName} ({student.className})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
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
                  <label className={styles.formLabel}>
                    Ngày tiêm chủng
                    {selectedStudentId && (() => {
                      const selectedStudent = studentInfo.find(s => String(s.id) === String(selectedStudentId));
                      return selectedStudent ? (
                        <span style={{ fontSize: '12px', color: '#666', fontWeight: 'normal', marginLeft: '8px' }}>
                          (Học sinh sinh ngày: {selectedStudent.dateOfBirth || 'Chưa có thông tin'})
                        </span>
                      ) : null;
                    })()}
                  </label>
                  <input
                    className={styles.formInput}
                    type="date"
                    name="vaccinationDate"
                    value={vaccineForm.vaccinationDate}
                    onChange={handleVaccineChange}
                    min={selectedStudentId ? 
                      (studentInfo.find(s => String(s.id) === String(selectedStudentId))?.dateOfBirth || '') : 
                      (studentInfo[0]?.dateOfBirth || '')
                    }
                    max={new Date().toISOString().split('T')[0]}
                    required
                    placeholder="Chọn ngày tiêm chủng"
                  />
                  <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                    📅 Có thể chọn từ ngày sinh đến ngày hiện tại
                    {selectedStudentId && (() => {
                      const selectedStudent = studentInfo.find(s => String(s.id) === String(selectedStudentId));
                      return selectedStudent ? (
                        <span style={{ color: '#1890ff' }}>
                          (Từ {selectedStudent.dateOfBirth || 'Chưa có thông tin'} đến hôm nay)
                        </span>
                      ) : null;
                    })()}
                  </small>
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
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%', marginBottom: 16 }}>
                  <label style={{ marginBottom: 4, fontWeight: 500 }}>File bằng chứng</label>
                  <button
                    type="button"
                    style={{
                      background: "#1976d2",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      padding: "8px 16px",
                      fontWeight: 600,
                      cursor: "pointer",
                      marginBottom: 4
                    }}
                    onClick={() => vaccineInputRef.current?.click()}
                  >
                    Chọn file
                  </button>
                  <input
                    ref={vaccineInputRef}
                    type="file"
                    name="proofFile"
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                    style={{ display: "none" }}
                  />
                  <span style={{ fontSize: 13, marginBottom: 2 }}>
                    {vaccineForm.proofFile ? vaccineForm.proofFile.name : "Chưa chọn file"}
                  </span>
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
                    onClick={() => {
                      setShowVaccineModal(false);
                      setSelectedStudentId("");
                    }}
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal liên kết học sinh */}
        {isParent && showLinkModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <h2>Liên kết tài khoản học sinh bạn giám hộ</h2>
                <button 
                  className={styles.modalClose}
                  onClick={() => setShowLinkModal(false)}
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleLinkSubmit} className={styles.modalForm}>
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
                <div className={styles.modalActions}>
                  <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={submitting}
                  >
                    {submitting ? "Đang xử lý..." : "Liên kết"}
                  </button>
                  <button
                    type="button"
                    className={styles.cancelBtn}
                    onClick={() => setShowLinkModal(false)}
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showVaccineDetailModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent} style={{ maxWidth: 600 }}>
              <div className={styles.modalHeader}>
                <h2>Chi tiết tiêm chủng - {selectedStudentName}</h2>
                <button
                  className={styles.modalClose}
                  onClick={() => setShowVaccineDetailModal(false)}
                >
                  ×
                </button>
              </div>
              {vaccineLoading ? (
                <div>Đang tải dữ liệu...</div>
              ) : selectedVaccines.length === 0 ? (
                <div>Chưa có thông tin tiêm chủng.</div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12 }}>
                  <thead>
                    <tr>
                      <th style={{ borderBottom: '1px solid #eee', padding: 8 }}>Tên vaccine</th>
                      <th style={{ borderBottom: '1px solid #eee', padding: 8 }}>Ngày tiêm</th>
                      <th style={{ borderBottom: '1px solid #eee', padding: 8 }}>Nơi tiêm</th>
                      <th style={{ borderBottom: '1px solid #eee', padding: 8 }}>Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedVaccines.map((v, idx) => (
                      <tr key={idx}>
                        <td style={{ borderBottom: '1px solid #f5f5f5', padding: 8 }}>{v.vaccineName}</td>
                        <td style={{ borderBottom: '1px solid #f5f5f5', padding: 8 }}>{v.vaccinationDate}</td>
                        <td style={{ borderBottom: '1px solid #f5f5f5', padding: 8 }}>{v.provider}</td>
                        <td style={{ borderBottom: '1px solid #f5f5f5', padding: 8 }}>{v.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Modal khai báo bệnh mãn tính cho phụ huynh */}
        {isParent && showChronicModal && (
          <div style={{
            position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
            background: "rgba(0,0,0,0.25)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <div style={{
              background: "#fff", borderRadius: 12, padding: 24, minWidth: 350, boxShadow: "0 4px 24px rgba(0,0,0,0.12)"
            }}>
              <h3 style={{ marginBottom: 16 }}>Khai báo bệnh mãn tính cho học sinh</h3>
              <form onSubmit={handleChronicSubmit}>
                <div style={{ marginBottom: 12 }}>
                  <label><b>Chọn học sinh *</b></label>
                  <select
                    name="id"
                    value={chronicForm.id}
                    onChange={handleChronicChange}
                    style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
                    required
                  >
                    <option value="">Chọn học sinh</option>
                    {Array.isArray(studentInfo) && studentInfo.map(stu => (
                      <option key={stu.id} value={stu.id}>{stu.fullName} ({stu.className})</option>
                    ))}
                  </select>
                  {chronicErrors.id && <div style={{ color: "red", fontSize: 13 }}>{chronicErrors.id}</div>}
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label><b>Tên bệnh *</b></label>
                  <input
                    name="diseaseName"
                    value={chronicForm.diseaseName}
                    onChange={handleChronicChange}
                    style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
                    required
                  />
                  {chronicErrors.diseaseName && <div style={{ color: "red", fontSize: 13 }}>{chronicErrors.diseaseName}</div>}
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label>
                    Ngày chẩn đoán
                    {chronicForm.id && (() => {
                      const selectedStudent = studentInfo.find(s => String(s.id) === String(chronicForm.id));
                      return selectedStudent ? (
                        <span style={{ fontSize: '12px', color: '#666', fontWeight: 'normal', marginLeft: '8px' }}>
                          (Học sinh sinh ngày: {selectedStudent.dateOfBirth || 'Chưa có thông tin'})
                        </span>
                      ) : null;
                    })()}
                  </label>
                  <input
                    type="date"
                    name="diagnosedDate"
                    value={chronicForm.diagnosedDate}
                    onChange={handleChronicChange}
                    min={chronicForm.id ? 
                      (studentInfo.find(s => String(s.id) === String(chronicForm.id))?.dateOfBirth || '') : 
                      (studentInfo[0]?.dateOfBirth || '')
                    }
                    max={new Date().toISOString().split('T')[0]}
                    style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
                    placeholder="Chọn ngày chẩn đoán (không bắt buộc)"
                  />
                  <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '4px' }}>
                    📅 Có thể chọn từ ngày sinh đến ngày hiện tại
                    {chronicForm.id && (() => {
                      const selectedStudent = studentInfo.find(s => String(s.id) === String(chronicForm.id));
                      return selectedStudent ? (
                        <span style={{ color: '#1890ff' }}>
                          (Từ {selectedStudent.dateOfBirth || 'Chưa có thông tin'} đến hôm nay)
                        </span>
                      ) : null;
                    })()}
                  </small>
                  {chronicErrors.diagnosedDate && <div style={{ color: "red", fontSize: 13 }}>{chronicErrors.diagnosedDate}</div>}
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label>Bác sĩ chẩn đoán</label>
                  <input
                    name="diagnosingDoctor"
                    value={chronicForm.diagnosingDoctor}
                    onChange={handleChronicChange}
                    style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
                  />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label>Ghi chú</label>
                  <textarea
                    name="notes"
                    value={chronicForm.notes}
                    onChange={handleChronicChange}
                    style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
                    rows={2}
                  />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label>File đính kèm</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <input
                      ref={chronicInputRef}
                      type="file"
                      name="attachmentFile"
                      onChange={handleChronicChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                      style={{ display: "none" }}
                    />
                    <button
                      type="button"
                      style={{
                        background: "#1976d2",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        padding: "8px 16px",
                        fontWeight: 600,
                        cursor: "pointer"
                      }}
                      onClick={() => chronicInputRef.current?.click()}
                    >
                      Chọn file
                    </button>
                    <span style={{ fontSize: 13 }}>
                      {chronicForm.attachmentFile ? chronicForm.attachmentFile.name : "Chưa chọn file"}
                    </span>
                  </div>
                  {chronicErrors.attachmentFile && <div style={{ color: "red", fontSize: 13 }}>{chronicErrors.attachmentFile}</div>}
                </div>
                <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    onClick={() => { setShowChronicModal(false); setChronicErrors({}); }}
                    style={{
                      background: "#eee", color: "#333", border: "none", borderRadius: 6, padding: "8px 16px", marginRight: 8, cursor: "pointer"
                    }}
                  >Hủy</button>
                  <button
                    type="submit"
                    disabled={chronicAdding}
                    style={{
                      background: "#1976d2", color: "#fff", border: "none", borderRadius: 6, padding: "8px 16px", fontWeight: 600, cursor: "pointer"
                    }}
                  >{chronicAdding ? "Đang khai báo..." : "Khai báo"}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

// Footer giống HomePage
const Footer = () => (
  <footer className="bg-gray-900 text-white pt-16 pb-8">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <div>
          <a href="#" className="text-2xl font-['Pacifico'] text-white mb-6 inline-block">SchoolMed</a>
          <p className="text-gray-400 mb-6">
            Nền tảng quản lý sức khỏe học đường toàn diện, kết nối nhà trường, phụ huynh và y tế trong một hệ sinh thái số.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary transition">
              <i className="ri-facebook-fill ri-lg"></i>
            </a>
            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary transition">
              <i className="ri-linkedin-fill ri-lg"></i>
            </a>
            <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary transition">
              <i className="ri-youtube-fill ri-lg"></i>
            </a>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-6">Liên kết nhanh</h3>
          <ul className="space-y-3">
            <li><a href="#features" className="text-gray-400 hover:text-white transition">Tính năng</a></li>
            <li><a href="#about" className="text-gray-400 hover:text-white transition">Về chúng tôi</a></li>
            
            <li><a href="#contact" className="text-gray-400 hover:text-white transition">Liên hệ</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-6">Dịch vụ</h3>
          <ul className="space-y-3">
            <li><a href="#" className="text-gray-400 hover:text-white transition">Quản lý hồ sơ sức khỏe</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition">Khám sức khỏe định kỳ</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition">Tư vấn dinh dưỡng học đường</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition">Đào tạo y tế học đường</a></li>
            <li><a href="#" className="text-gray-400 hover:text-white transition">Tích hợp hệ thống</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-6">Liên hệ</h3>
          <ul className="space-y-4">
            <li className="flex items-start">
              <div className="w-5 h-5 flex items-center justify-center mr-3 mt-1">
                <i className="ri-map-pin-line text-gray-400"></i>
              </div>
              <span className="text-gray-400">7 Đ. D1, Long Thạnh Mỹ, Thủ Đức, Hồ Chí Minh, Việt Nam</span>
            </li>
            <li className="flex items-center">
              <div className="w-5 h-5 flex items-center justify-center mr-3">
                <i className="ri-mail-line text-gray-400"></i>
              </div>
              <a href="mailto:contact@schoolmed.vn" className="text-gray-400 hover:text-white transition">contact@schoolmed.vn</a>
            </li>
            <li className="flex items-center">
              <div className="w-5 h-5 flex items-center justify-center mr-3">
                <i className="ri-phone-line text-gray-400"></i>
              </div>
              <a href="tel:+842812345678" className="text-gray-400 hover:text-white transition">(+84) 28 1234 5678</a>
            </li>
          </ul>
        </div>
      </div>
      <hr className="border-gray-800 mb-8" />
      <div className="flex flex-col md:flex-row justify-between items-center">
        <p className="text-gray-500 mb-4 md:mb-0">© 2025 SchoolMed. Tất cả các quyền được bảo lưu.</p>
        <div className="flex space-x-6">
          <a href="#" className="text-gray-500 hover:text-white transition">Điều khoản sử dụng</a>
          <a href="#" className="text-gray-500 hover:text-white transition">Chính sách bảo mật</a>
          <a href="#" className="text-gray-500 hover:text-white transition">Cookies</a>
        </div>
      </div>
    </div>
  </footer>
);

export default UserProfile;
export { Footer };
