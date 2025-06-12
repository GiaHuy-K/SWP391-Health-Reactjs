import React, { useState, useEffect } from 'react';
import { useAuth } from '../../config/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../config/axios';
import './UserProfile.css';

const UserProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    gender: '',
  });

  const [children, setChildren] = useState([]);
  const [isAddingChild, setIsAddingChild] = useState(false);
  const [newChild, setNewChild] = useState({
    name: '',
    dateOfBirth: '',
    gender: '',
    class: '',
    relationship: ''
  });

  const [medicalRecords, setMedicalRecords] = useState([]);
  const [isAddingRecord, setIsAddingRecord] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);
  const [newRecord, setNewRecord] = useState({
    date: '',
    diagnosis: '',
    symptoms: '',
    treatment: '',
    notes: '',
    doctor: '',
    hospital: ''
  });

  useEffect(() => {
    fetchUserProfile();
    fetchChildren();
  }, []);

  useEffect(() => {
    if (selectedChild) {
      fetchMedicalRecords(selectedChild.id);
    } else {
      setMedicalRecords([]);
    }
  }, [selectedChild]);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/users/profile');
      setFormData(response.data);
    } catch (error) {
      toast.error('Không thể tải thông tin người dùng');
      console.error('Error fetching user details:', error);
    }
  };

  const fetchChildren = async () => {
    try {
      const response = await api.get('/users/children');
      setChildren(response.data);
    } catch (error) {
      toast.error('Không thể tải thông tin con em');
      console.error('Error fetching children:', error);
    }
  };

  const fetchMedicalRecords = async (childId) => {
    try {
      const response = await api.get(`/users/children/${childId}/medical-records`);
      setMedicalRecords(response.data);
    } catch (error) {
      toast.error('Không thể tải thông tin bệnh án');
      console.error('Error fetching medical records:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleChildInputChange = (e) => {
    const { name, value } = e.target;
    setNewChild(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleRecordInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecord(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/users/profile', formData);
      toast.success('Cập nhật thông tin thành công');
      setIsEditing(false);
    } catch (error) {
      toast.error('Cập nhật thông tin thất bại');
      console.error('Error updating profile:', error);
    }
  };

  const handleAddChild = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/users/children', newChild);
      setChildren([...children, response.data]);
      setIsAddingChild(false);
      setNewChild({
        name: '',
        dateOfBirth: '',
        gender: '',
        class: '',
        relationship: ''
      });
      toast.success('Thêm con em thành công');
    } catch (error) {
      toast.error('Thêm con em thất bại');
      console.error('Error adding child:', error);
    }
  };

  const handleDeleteChild = async (childId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thông tin này?')) {
      try {
        await api.delete(`/users/children/${childId}`);
        setChildren(children.filter(child => child.id !== childId));
        if (selectedChild && selectedChild.id === childId) {
          setSelectedChild(null);
          setMedicalRecords([]);
        }
        toast.success('Xóa thông tin thành công');
      } catch (error) {
        toast.error('Xóa thông tin thất bại');
        console.error('Error deleting child:', error);
      }
    }
  };

  const handleAddRecord = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(`/users/children/${selectedChild.id}/medical-records`, newRecord);
      setMedicalRecords([...medicalRecords, response.data]);
      setIsAddingRecord(false);
      setNewRecord({
        date: '',
        diagnosis: '',
        symptoms: '',
        treatment: '',
        notes: '',
        doctor: '',
        hospital: ''
      });
      toast.success('Thêm bệnh án thành công');
    } catch (error) {
      toast.error('Thêm bệnh án thất bại');
      console.error('Error adding medical record:', error);
    }
  };

  const handleDeleteRecord = async (recordId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bệnh án này?')) {
      try {
        await api.delete(`/users/children/${selectedChild.id}/medical-records/${recordId}`);
        setMedicalRecords(medicalRecords.filter(record => record.id !== recordId));
        toast.success('Xóa bệnh án thành công');
      } catch (error) {
        toast.error('Xóa bệnh án thất bại');
        console.error('Error deleting medical record:', error);
      }
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

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Thông tin cá nhân</h1>
        <div className="profile-actions">
          <button className="button button-secondary" onClick={handleGoHome}>
            Trang chủ
          </button>
          {!isEditing ? (
            <button className="button button-primary" onClick={() => setIsEditing(true)}>
              Chỉnh sửa
            </button>
          ) : (
            <div className="edit-actions">
              <button className="button button-success" onClick={handleSubmit}>
                Lưu
              </button>
              <button className="button button-secondary" onClick={() => setIsEditing(false)}>
                Hủy
              </button>
            </div>
          )}
          <button className="button button-danger logout-button" onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
      </div>

      <div className="profile-tabs">
        <button 
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Thông tin cá nhân
        </button>
        <button 
          className={`tab-button ${activeTab === 'children' ? 'active' : ''}`}
          onClick={() => setActiveTab('children')}
        >
          Thông tin con em
        </button>
      </div>

      {activeTab === 'profile' && (
        <div className="profile-section">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Họ và tên</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label>Số điện thoại</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label>Địa chỉ</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label>Ngày sinh</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label>Giới tính</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                disabled={!isEditing}
              >
                <option value="">Chọn giới tính</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>

            {isEditing && (
              <button type="submit" className="button button-success update-button">
                Cập nhật thông tin
              </button>
            )}
          </form>
        </div>
      )}

      {activeTab === 'children' && (
        <div className="children-section">
          <div className="children-controls">
            <button
              className="button button-primary add-child-button"
              onClick={() => {
                setIsAddingChild(true);
                setSelectedChild(null);
              }}
            >
              + Thêm con em
            </button>
          </div>

          {isAddingChild ? (
            <div className="add-child-mode-container">
              <div className="add-child-form-wrapper">
                <h3>Thêm thông tin con em</h3>
                <form onSubmit={handleAddChild}>
                  <div className="form-group">
                    <label>Họ và tên</label>
                    <input
                      type="text"
                      name="name"
                      value={newChild.name}
                      onChange={handleChildInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Ngày sinh</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={newChild.dateOfBirth}
                      onChange={handleChildInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Giới tính</label>
                    <select
                      name="gender"
                      value={newChild.gender}
                      onChange={handleChildInputChange}
                      required
                    >
                      <option value="">Chọn giới tính</option>
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Lớp</label>
                    <input
                      type="text"
                      name="class"
                      value={newChild.class}
                      onChange={handleChildInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Mối quan hệ</label>
                    <select
                      name="relationship"
                      value={newChild.relationship}
                      onChange={handleChildInputChange}
                      required
                    >
                      <option value="">Chọn mối quan hệ</option>
                      <option value="son">Con trai</option>
                      <option value="daughter">Con gái</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="button button-success">Lưu</button>
                    <button
                      type="button"
                      className="button button-secondary"
                      onClick={() => setIsAddingChild(false)}
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              </div>
              {children.length === 0 && (
                <div className="add-child-message-hint">
                  <p>Chưa có thông tin con em nào. Vui lòng thêm mới.</p>
                </div>
              )}
            </div>
          ) : (
            <>
              {children.length === 0 ? (
                <p className="no-children-message">Chưa có thông tin con em nào. Vui lòng thêm mới.</p>
              ) : (
                <div className="children-and-records-container">
                  <div className="children-list">
                    {children.map((child) => (
                      <div
                        key={child.id}
                        className={`child-card ${selectedChild?.id === child.id ? 'selected' : ''}`}
                        onClick={() => setSelectedChild(child)}
                      >
                        <div className="child-card-header">
                          <h3>{child.name}</h3>
                          <button
                            className="delete-child-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteChild(child.id);
                            }}
                          >
                            Xóa
                          </button>
                        </div>
                        <div className="child-info-display">
                          <p><strong>Ngày sinh:</strong> {new Date(child.dateOfBirth).toLocaleDateString()}</p>
                          <p><strong>Giới tính:</strong> {
                            child.gender === 'male' ? 'Nam' :
                            child.gender === 'female' ? 'Nữ' : 'Khác'
                          }</p>
                          <p><strong>Lớp:</strong> {child.class}</p>
                          <p><strong>Mối quan hệ:</strong> {
                            child.relationship === 'son' ? 'Con trai' :
                            child.relationship === 'daughter' ? 'Con gái' : 'Khác'
                          }</p>
                        </div>
                      </div>
                    ))
                  }
                  </div>

                  {selectedChild && (
                    <div className="medical-records-section">
                      <div className="section-header">
                        <h2>Bệnh án của {selectedChild.name}</h2>
                        <button
                          className="button button-primary add-record-button"
                          onClick={() => setIsAddingRecord(true)}
                        >
                          + Thêm bệnh án mới
                        </button>
                      </div>

                      {isAddingRecord && (
                        <div className="add-record-form">
                          <h3>Thêm bệnh án mới</h3>
                          <form onSubmit={handleAddRecord}>
                            <div className="form-row">
                              <div className="form-group">
                                <label>Ngày khám</label>
                                <input
                                  type="date"
                                  name="date"
                                  value={newRecord.date}
                                  onChange={handleRecordInputChange}
                                  required
                                />
                              </div>
                              <div className="form-group">
                                <label>Bác sĩ khám</label>
                                <input
                                  type="text"
                                  name="doctor"
                                  value={newRecord.doctor}
                                  onChange={handleRecordInputChange}
                                  required
                                />
                              </div>
                            </div>

                            <div className="form-group">
                              <label>Bệnh viện/Phòng khám</label>
                              <input
                                type="text"
                                name="hospital"
                                value={newRecord.hospital}
                                onChange={handleRecordInputChange}
                                required
                              />
                            </div>

                            <div className="form-group">
                              <label>Chẩn đoán</label>
                              <input
                                type="text"
                                name="diagnosis"
                                value={newRecord.diagnosis}
                                onChange={handleRecordInputChange}
                                required
                              />
                            </div>

                            <div className="form-group">
                              <label>Triệu chứng</label>
                              <textarea
                                name="symptoms"
                                value={newRecord.symptoms}
                                onChange={handleRecordInputChange}
                                required
                                rows="3"
                              />
                            </div>

                            <div className="form-group">
                              <label>Điều trị</label>
                              <textarea
                                name="treatment"
                                value={newRecord.treatment}
                                onChange={handleRecordInputChange}
                                required
                                rows="3"
                              />
                            </div>

                            <div className="form-group">
                              <label>Ghi chú</label>
                              <textarea
                                name="notes"
                                value={newRecord.notes}
                                onChange={handleRecordInputChange}
                                rows="2"
                              />
                            </div>

                            <div className="form-actions">
                              <button type="submit" className="button button-success">Lưu</button>
                              <button
                                type="button"
                                className="button button-secondary"
                                onClick={() => setIsAddingRecord(false)}
                              >
                                Hủy
                              </button>
                            </div>
                          </form>
                        </div>
                      )}

                      <div className="medical-records-list">
                        {medicalRecords.length === 0 ? (
                          <p className="no-records-message">Chưa có bệnh án nào cho bé {selectedChild.name}.</p>
                        ) : (
                          medicalRecords.map((record) => (
                            <div key={record.id} className="medical-record-item">
                              <div className="record-header">
                                <div className="record-date">
                                  <strong>Ngày khám:</strong> {new Date(record.date).toLocaleDateString()}
                                </div>
                                <button
                                  className="delete-record-button"
                                  onClick={() => handleDeleteRecord(record.id)}
                                >
                                  Xóa
                                </button>
                              </div>
                              <div className="medical-record-view">
                                <p><strong>Bác sĩ:</strong> {record.doctor}</p>
                                <p><strong>Bệnh viện/Phòng khám:</strong> {record.hospital}</p>
                                <p><strong>Chẩn đoán:</strong> {record.diagnosis}</p>
                                <p><strong>Triệu chứng:</strong> {record.symptoms}</p>
                                <p><strong>Điều trị:</strong> {record.treatment}</p>
                                {record.notes && (
                                  <p><strong>Ghi chú:</strong> {record.notes}</p>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfile; 