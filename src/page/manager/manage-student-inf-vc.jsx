import React, { useState, useEffect } from 'react';
import { getStudent } from '../../services/api.student';
import { 
  getStudentVaccinations, 
  addStudentVaccination, 
  updateStudentVaccination, 
  deleteStudentVaccination,
  getVaccinationDetail,
  updateVaccinationStatus
} from '../../services/api.vaccine';
import { Table, Button, Pagination, message, Drawer, Input, Modal, Form, DatePicker, Upload, Space, Popconfirm } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useAuth } from '../../config/AuthContext';

const studentColumns = [
  { title: 'Mã HS', dataIndex: 'id', key: 'id' },
  { title: 'Họ tên', dataIndex: 'fullName', key: 'fullName' },
  { title: 'Lớp', dataIndex: 'className', key: 'className' },
  {
    title: 'Hành động',
    key: 'action',
    render: (_, record) => (
      <Button onClick={() => handleShowVaccination(record)}>Xem tiêm chủng</Button>
    ),
  },
];

const StudentVaccinationPage = () => {
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [vaccinations, setVaccinations] = useState([]);
  const [vaccLoading, setVaccLoading] = useState(false);
  const [vaccPagination, setVaccPagination] = useState({ page: 0, size: 10, total: 0 });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [vaccineModalVisible, setVaccineModalVisible] = useState(false);
  const [vaccineModalMode, setVaccineModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedVaccination, setSelectedVaccination] = useState(null);
  const [vaccineForm] = Form.useForm();
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [vaccinationDetail, setVaccinationDetail] = useState(null);
  const { user } = useAuth();
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [statusAction, setStatusAction] = useState(null); // 'APPROVE' | 'REJECTED'
  const [statusVaccination, setStatusVaccination] = useState(null);
  const [approverNotes, setApproverNotes] = useState("");



  useEffect(() => {
    const fetchStudents = async () => {
      setLoadingStudents(true);
      try {
        const res = await getStudent();
        setStudents(res || []);
      } catch (err) {
        message.error('Không thể tải danh sách học sinh');
      } finally {
        setLoadingStudents(false);
      }
    };
    fetchStudents();
  }, []);

  const handleShowVaccination = async (student) => {
    if (!student?.id) {
      message.error("Không tìm thấy ID học sinh!");
      return;
    }
    setSelectedStudent(student);
    setDrawerOpen(true);
    fetchVaccinations(student.id, 0, vaccPagination.size);
  };

  const fetchVaccinations = async (studentId, page = 0, size = 10) => {
    if (!studentId) return;
    setVaccLoading(true);
    try {
      const res = await getStudentVaccinations(studentId, { page, size, sort: 'vaccinationDate,DESC' });
      setVaccinations(res.content || []);
      setVaccPagination({ page: res.number, size: res.size, total: res.totalElements });
    } catch (err) {
      setVaccinations([]);
      setVaccPagination({ page: 0, size: 10, total: 0 });
    } finally {
      setVaccLoading(false);
    }
  };

  const handleVaccPageChange = (page, pageSize) => {
    if (selectedStudent) {
      fetchVaccinations(selectedStudent.id, page - 1, pageSize);
    }
  };

  const handleAddVaccination = () => {
    setVaccineModalMode('add');
    setSelectedVaccination(null);
    vaccineForm.resetFields();
    setVaccineModalVisible(true);
  };

  const handleEditVaccination = (vaccination) => {
    setVaccineModalMode('edit');
    setSelectedVaccination(vaccination);
    vaccineForm.setFieldsValue({
      vaccineName: vaccination.vaccineName,
      vaccinationDate: vaccination.vaccinationDate ? dayjs(vaccination.vaccinationDate) : null,
      provider: vaccination.provider,
      notes: vaccination.notes,
    });
    setVaccineModalVisible(true);
  };

  const handleViewVaccination = async (vaccination) => {
    try {
      const detail = await getVaccinationDetail(vaccination.studentVaccinationId);
      setVaccinationDetail(detail);
      setDetailModalVisible(true);
    } catch (err) {
      message.error('Không thể tải chi tiết thông tin tiêm chủng');
    }
  };

  const handleDeleteVaccination = async (vaccinationId) => {
    try {
      await deleteStudentVaccination(vaccinationId);
      message.success('Xóa thông tin tiêm chủng thành công');
      if (selectedStudent) {
        fetchVaccinations(selectedStudent.id, vaccPagination.page, vaccPagination.size);
      }
    } catch (err) {
      message.error('Xóa thông tin tiêm chủng thất bại');
    }
  };

  const handleVaccineSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append('vaccineName', values.vaccineName);
      formData.append('vaccinationDate', values.vaccinationDate.format('YYYY-MM-DD'));
      formData.append('provider', values.provider);
      if (values.notes) formData.append('notes', values.notes);

      // Lấy file đúng cách từ fileList của Ant Design Upload
      const fileObj = values.proofFile && values.proofFile[0] && values.proofFile[0].originFileObj;
      if (fileObj) {
        formData.append('proofFile', fileObj);
      } else {
        message.error('Vui lòng upload file bằng chứng tiêm chủng!');
        return;
      }

      if (vaccineModalMode === 'add') {
        await addStudentVaccination(selectedStudent.id, formData);
        message.success('Thêm thông tin tiêm chủng thành công');
      } else {
        await updateStudentVaccination(selectedVaccination.studentVaccinationId, formData);
        message.success('Cập nhật thông tin tiêm chủng thành công');
      }
      setVaccineModalVisible(false);
      if (selectedStudent) {
        fetchVaccinations(selectedStudent.id, vaccPagination.page, vaccPagination.size);
      }
    } catch (err) {
      message.error('Thao tác thất bại');
    }
  };

  // Lọc danh sách học sinh theo tên
  const filteredStudents = students.filter(s =>
    s.fullName.toLowerCase().includes(searchText.toLowerCase())
  );

  // Xử lý duyệt/trạng thái
  const handleOpenStatusModal = (vaccination, action) => {
    setStatusVaccination(vaccination);
    setStatusAction(action);
    setApproverNotes("");
    setStatusModalVisible(true);
  };

  const handleStatusSubmit = async () => {
    if (!statusVaccination) return;
    try {
      await updateVaccinationStatus(statusVaccination.studentVaccinationId, statusAction, approverNotes);
      setStatusModalVisible(false);
      setStatusVaccination(null);
      setApproverNotes("");
      if (selectedStudent) {
        fetchVaccinations(selectedStudent.id, vaccPagination.page, vaccPagination.size);
      }
    } catch (err) {}
  };

  // Đặt vaccColumns vào đây để sử dụng được các hàm handle
  const isAdminOrNurse =
    user?.role === 'Quản trị viên Trường học' ||
    user?.role === 'Quản lý Nhân sự/Nhân viên' ||
    user?.role === 'Nhân viên Y tế';
  const vaccColumns = [
    { title: 'Tên vắc xin', dataIndex: 'vaccineName', key: 'vaccineName' },
    { 
      title: 'Ngày tiêm', 
      dataIndex: 'vaccinationDate', 
      key: 'vaccinationDate',
      render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : '-'
    },
    { title: 'Mũi số', dataIndex: 'doseNumber', key: 'doseNumber' },
    { title: 'Nơi tiêm', dataIndex: 'provider', key: 'provider' },
    { title: 'Ghi chú', dataIndex: 'notes', key: 'notes' },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      key: 'status',
      render: (status) => {
        const statusMap = {
          'PENDING': { text: 'Chờ duyệt', color: '#faad14' },
          'APPROVED': { text: 'Đã duyệt', color: '#52c41a' },
          'REJECTED': { text: 'Từ chối', color: '#ff4d4f' }
        };
        const statusInfo = statusMap[status] || { text: status, color: '#666' };
        return <span style={{ color: statusInfo.color, fontWeight: 'bold' }}>{statusInfo.text}</span>;
      }
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button 
            type="link" 
            icon={<EyeOutlined />} 
            onClick={() => handleViewVaccination(record)}
            size="small"
          >
            Xem
          </Button>
          <Button 
            type="link" 
            icon={<EditOutlined />} 
            onClick={() => handleEditVaccination(record)}
            size="small"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa thông tin tiêm chủng này?"
            onConfirm={() => handleDeleteVaccination(record.studentVaccinationId)}
            okText="Có"
            cancelText="Không"
          >
            <Button 
              type="link" 
              danger 
              icon={<DeleteOutlined />} 
              size="small"
            >
              Xóa
            </Button>
          </Popconfirm>
          {isAdminOrNurse && (record.status === 'PENDING' || record.status === 'Chờ xử lý') && (
            <>
              <Button type="link" style={{ color: '#52c41a', fontWeight: 600 }} onClick={() => handleOpenStatusModal(record, 'APPROVE')}>Duyệt</Button>
              <Button type="link" style={{ color: '#ff4d4f', fontWeight: 600 }} onClick={() => handleOpenStatusModal(record, 'REJECTED')}>Từ chối</Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h2>Danh sách học sinh</h2>
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Input
          placeholder="Tìm kiếm tên học sinh"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
          allowClear
          style={{ width: 320, borderRadius: 24, padding: '6px 16px', fontSize: 16 }}
        />
      </div>
      <Table
        columns={studentColumns.map(col =>
          col.key === 'action'
            ? { ...col, render: (_, record) => <Button onClick={() => handleShowVaccination(record)}>Xem tiêm chủng</Button> }
            : col
        )}
        dataSource={filteredStudents}
        rowKey={r => r.id}
        loading={loadingStudents}
        pagination={false}
        locale={{ emptyText: 'Không có dữ liệu học sinh' }}
      />
      
      <Drawer
        title={`Thông tin tiêm chủng: ${selectedStudent?.fullName || ''}`}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        width={1000}
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleAddVaccination}
            disabled={!selectedStudent}
          >
            Thêm tiêm chủng
          </Button>
        }
      >
        <Table
          columns={vaccColumns}
          dataSource={vaccinations}
          rowKey={r => r.studentVaccinationId || r.id}
          loading={vaccLoading}
          pagination={false}
          locale={{ emptyText: 'Không có dữ liệu tiêm chủng' }}
        />
        <Pagination
          style={{ marginTop: 16, textAlign: 'right' }}
          current={vaccPagination.page + 1}
          pageSize={vaccPagination.size}
          total={vaccPagination.total}
          onChange={handleVaccPageChange}
          showSizeChanger
          pageSizeOptions={['5', '10', '20', '50']}
        />
      </Drawer>

      {/* Modal thêm/sửa vaccine */}
      <Modal
        title={vaccineModalMode === 'add' ? 'Thêm thông tin tiêm chủng' : 'Sửa thông tin tiêm chủng'}
        open={vaccineModalVisible}
        onCancel={() => setVaccineModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={vaccineForm}
          layout="vertical"
          onFinish={handleVaccineSubmit}
        >
          <Form.Item
            name="vaccineName"
            label="Tên vắc xin"
            rules={[{ required: true, message: 'Vui lòng nhập tên vắc xin' }]}
          >
            <Input placeholder="Nhập tên vắc xin" />
          </Form.Item>
          
          <Form.Item
            name="vaccinationDate"
            label="Ngày tiêm chủng"
            rules={[{ required: true, message: 'Vui lòng chọn ngày tiêm chủng' }]}
          >
            <DatePicker 
              style={{ width: '100%' }} 
              format="DD/MM/YYYY"
              placeholder="Chọn ngày tiêm chủng"
            />
          </Form.Item>
          
          <Form.Item
            name="provider"
            label="Nơi tiêm chủng"
            rules={[{ required: true, message: 'Vui lòng nhập nơi tiêm chủng' }]}
          >
            <Input placeholder="Nhập nơi tiêm chủng" />
          </Form.Item>
          
          <Form.Item
            name="notes"
            label="Ghi chú"
          >
            <Input.TextArea 
              rows={3} 
              placeholder="Nhập ghi chú (nếu có)"
            />
          </Form.Item>
          
          <Form.Item
            name="proofFile"
            label="File bằng chứng *"
            valuePropName="fileList"
            getValueFromEvent={e => (Array.isArray(e) ? e : e && e.fileList)}
            rules={[{ required: true, message: 'Vui lòng upload file bằng chứng tiêm chủng!' }]}
          >
            <Upload
              beforeUpload={() => false}
              maxCount={1}
              accept=".pdf,.jpg,.jpeg,.png"
              listType="text"
            >
              <Button>Chọn file</Button>
            </Upload>
          </Form.Item>
          
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setVaccineModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                {vaccineModalMode === 'add' ? 'Thêm' : 'Cập nhật'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal xem chi tiết vaccine */}
      <Modal
        title="Chi tiết thông tin tiêm chủng"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>
        ]}
        width={600}
      >
        {vaccinationDetail && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <strong>Tên vắc xin:</strong> {vaccinationDetail.vaccineName}
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>Ngày tiêm:</strong> {vaccinationDetail.vaccinationDate ? dayjs(vaccinationDetail.vaccinationDate).format('DD/MM/YYYY') : '-'}
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>Nơi tiêm:</strong> {vaccinationDetail.provider}
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>Ghi chú:</strong> {vaccinationDetail.notes || '-'}
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>Trạng thái:</strong> {vaccinationDetail.status}
            </div>
            {vaccinationDetail.approvedByUserFullName && (
              <div style={{ marginBottom: 16 }}>
                <strong>Người duyệt:</strong> {vaccinationDetail.approvedByUserFullName}
              </div>
            )}
            {vaccinationDetail.approvedAt && (
              <div style={{ marginBottom: 16 }}>
                <strong>Ngày duyệt:</strong> {dayjs(vaccinationDetail.approvedAt).format('DD/MM/YYYY HH:mm')}
              </div>
            )}
            {vaccinationDetail.approverNotes && (
              <div style={{ marginBottom: 16 }}>
                <strong>Ghi chú duyệt:</strong> {vaccinationDetail.approverNotes}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Modal duyệt trạng thái */}
      <Modal
        title={statusAction === 'APPROVE' ? 'Duyệt tiêm chủng' : 'Từ chối tiêm chủng'}
        open={statusModalVisible}
        onCancel={() => setStatusModalVisible(false)}
        onOk={handleStatusSubmit}
        okText={statusAction === 'APPROVE' ? 'Duyệt' : 'Từ chối'}
        cancelText="Hủy"
      >
        <div style={{ marginBottom: 12 }}>
          <strong>Ghi chú cho người duyệt (tùy chọn):</strong>
          <Input.TextArea
            value={approverNotes}
            onChange={e => setApproverNotes(e.target.value)}
            rows={3}
            maxLength={500}
            placeholder="Nhập ghi chú xác minh hoặc lý do từ chối (nếu có)"
          />
        </div>
      </Modal>
    </div>
  );
};

export default StudentVaccinationPage;
