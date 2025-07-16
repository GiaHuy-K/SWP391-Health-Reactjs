import React, { useState, useEffect } from "react";
import { getStudent } from "../../services/api.student";
import {
  getStudentVaccinations,
  addStudentVaccination,
  updateStudentVaccination,
  deleteStudentVaccination,
  getVaccinationDetail,
  updateVaccinationStatus,
  getAllVaccinations,
  getPendingVaccinations,
  getVaccinationFileUrl,
} from "../../services/api.vaccine";
import { validateVaccinationDate, getStudentBirthDate } from "../../utils/dateValidation";
import {
  Table,
  Button,
  Pagination,
  message,
  Drawer,
  Input,
  Modal,
  Form,
  DatePicker,
  Upload,
  Space,
  Popconfirm,
  Tabs,
  Select,
  Card,
  Row,
  Col,
  Statistic,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  FilterOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useAuth } from "../../config/AuthContext";

const { TabPane } = Tabs;
const { Option } = Select;

const StudentVaccinationPage = () => {
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [vaccinations, setVaccinations] = useState([]);
  const [vaccLoading, setVaccLoading] = useState(false);
  const [vaccPagination, setVaccPagination] = useState({
    page: 0,
    size: 10,
    total: 0,
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [vaccineModalVisible, setVaccineModalVisible] = useState(false);
  const [vaccineModalMode, setVaccineModalMode] = useState("add"); // 'add' or 'edit'
  const [selectedVaccination, setSelectedVaccination] = useState(null);
  const [vaccineForm] = Form.useForm();
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [vaccinationDetail, setVaccinationDetail] = useState(null);
  const { user } = useAuth();
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [statusAction, setStatusAction] = useState(null); // 'APPROVE' | 'REJECTED'
  const [statusVaccination, setStatusVaccination] = useState(null);
  const [approverNotes, setApproverNotes] = useState("");

  // State cho chức năng xem tất cả tiêm chủng
  const [allVaccinations, setAllVaccinations] = useState([]);
  const [allVaccLoading, setAllVaccLoading] = useState(false);
  const [allVaccPagination, setAllVaccPagination] = useState({
    page: 0,
    size: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    studentId: "",
  });
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  // State cho chức năng pending vaccinations
  const [pendingVaccinations, setPendingVaccinations] = useState([]);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [pendingPagination, setPendingPagination] = useState({
    page: 0,
    size: 10,
    total: 0,
  });

  // State cho file access
  const [fileModalVisible, setFileModalVisible] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [fileLoading, setFileLoading] = useState(false);

  const studentColumns = [
    { title: "Mã HS", dataIndex: "id", key: "id" },
    { title: "Họ tên", dataIndex: "fullName", key: "fullName" },
    { title: "Lớp", dataIndex: "className", key: "className" },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Button onClick={() => handleShowVaccination(record)}>
          Xem tiêm chủng
        </Button>
      ),
    },
  ];

  useEffect(() => {
    const fetchStudents = async () => {
      setLoadingStudents(true);
      try {
        const res = await getStudent();
        setStudents(Array.isArray(res) ? res : (res?.content || []));
      } catch (err) {
        message.error("Không thể tải danh sách học sinh");
        setStudents([]);
      } finally {
        setLoadingStudents(false);
      }
    };
    fetchStudents();
  }, []);

  // Hàm fetch tất cả tiêm chủng
  const fetchAllVaccinations = async (page = 0, size = 10) => {
    setAllVaccLoading(true);
    try {
      const params = {
        page,
        size,
        sort: "vaccinationDate,DESC",
        ...filters,
      };
      
      // Loại bỏ các filter rỗng
      Object.keys(params).forEach(key => {
        if (params[key] === "" || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      const res = await getAllVaccinations(params);
      setAllVaccinations(res.content || []);
      setAllVaccPagination({
        page: res.number,
        size: res.size,
        total: res.totalElements,
      });
    } catch (err) {
      setAllVaccinations([]);
      setAllVaccPagination({ page: 0, size: 10, total: 0 });
    } finally {
      setAllVaccLoading(false);
    }
  };

  // Hàm fetch thống kê
  const fetchStats = async () => {
    try {
      const [allRes, pendingRes] = await Promise.all([
        getAllVaccinations({ size: 1000 }), // Lấy tất cả để đếm
        getPendingVaccinations({ size: 1000 }),
      ]);
      
      const allVaccs = allRes.content || [];
      const pendingVaccs = pendingRes.content || [];
      
      setStats({
        total: allVaccs.length,
        pending: allVaccs.filter(v => v.status === "PENDING" || v.status === "Chờ xử lý").length,
        approved: allVaccs.filter(v => v.status === "APPROVED" || v.status === "Chấp nhận").length,
        rejected: allVaccs.filter(v => v.status === "REJECTED" || v.status === "Từ chối").length,
      });
    } catch (err) {
      console.error("Không thể tải thống kê:", err);
    }
  };

  // Hàm xử lý thay đổi filter
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Hàm xử lý tìm kiếm
  const handleSearch = () => {
    fetchAllVaccinations(0, allVaccPagination.size);
  };

  // Hàm reset filter
  const handleResetFilters = () => {
    setFilters({
      search: "",
      status: "",
      studentId: "",
    });
    fetchAllVaccinations(0, allVaccPagination.size);
  };

  // Hàm xử lý phân trang cho tất cả tiêm chủng
  const handleAllVaccPageChange = (page, pageSize) => {
    fetchAllVaccinations(page - 1, pageSize);
  };

  // Load dữ liệu ban đầu
  useEffect(() => {
    fetchAllVaccinations();
    fetchStats();
  }, []);

  // Hàm fetch pending vaccinations
  const fetchPendingVaccinations = async (page = 0, size = 10) => {
    setPendingLoading(true);
    try {
      const params = {
        page,
        size,
        sort: "vaccinationDate,DESC",
      };
      
      const res = await getPendingVaccinations(params);
      setPendingVaccinations(res.content || []);
      setPendingPagination({
        page: res.number,
        size: res.size,
        total: res.totalElements,
      });
    } catch (err) {
      setPendingVaccinations([]);
      setPendingPagination({ page: 0, size: 10, total: 0 });
    } finally {
      setPendingLoading(false);
    }
  };

  // Hàm xử lý phân trang cho pending vaccinations
  const handlePendingPageChange = (page, pageSize) => {
    fetchPendingVaccinations(page - 1, pageSize);
  };

  // Hàm xử lý xem file bằng chứng
  const handleViewFile = async (vaccinationId) => {
    setFileLoading(true);
    try {
      const res = await getVaccinationFileUrl(vaccinationId);
      if (!res || !res.url) {
        message.error("Không có file bằng chứng cho bản ghi này");
        return;
      }
      setFileUrl(res.url);
      setFileModalVisible(true);
    } catch (err) {
      message.error("Không thể tải file bằng chứng");
    } finally {
      setFileLoading(false);
    }
  };

  // Hàm xử lý download file
  const handleDownloadFile = () => {
    if (fileUrl) {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = 'vaccination-proof.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

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
      const res = await getStudentVaccinations(studentId, {
        page,
        size,
        sort: "vaccinationDate,DESC",
      });
      setVaccinations(res.content || []);
      setVaccPagination({
        page: res.number,
        size: res.size,
        total: res.totalElements,
      });
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
    setVaccineModalMode("add");
    setSelectedVaccination(null);
    vaccineForm.resetFields();
    setVaccineModalVisible(true);
  };

  const handleEditVaccination = (vaccination) => {
    setVaccineModalMode("edit");
    setSelectedVaccination(vaccination);
    vaccineForm.setFieldsValue({
      vaccineName: vaccination.vaccineName,
      vaccinationDate: vaccination.vaccinationDate
        ? dayjs(vaccination.vaccinationDate)
        : null,
      provider: vaccination.provider,
      notes: vaccination.notes,
    });
    setVaccineModalVisible(true);
  };

  const handleViewVaccination = async (vaccination) => {
    try {
      const detail = await getVaccinationDetail(
        vaccination.studentVaccinationId
      );
      setVaccinationDetail(detail);
      setDetailModalVisible(true);
    } catch (err) {
      message.error("Không thể tải chi tiết thông tin tiêm chủng");
    }
  };

  const handleDeleteVaccination = async (vaccinationId) => {
    try {
      await deleteStudentVaccination(vaccinationId);
      message.success("Xóa thông tin tiêm chủng thành công");
      if (selectedStudent) {
        fetchVaccinations(
          selectedStudent.id,
          vaccPagination.page,
          vaccPagination.size
        );
      }
      // Refresh dữ liệu tất cả tiêm chủng
      fetchAllVaccinations(allVaccPagination.page, allVaccPagination.size);
      fetchStats();
    } catch (err) {
      message.error("Xóa thông tin tiêm chủng thất bại");
    }
  };

  const handleVaccineSubmit = async (values) => {
    try {
      // Validate vaccination date
      const selectedStudent = students.find(s => s.id === selectedStudent?.id);
      const studentBirthDate = getStudentBirthDate(selectedStudent);
      
      const vaccinationValidation = validateVaccinationDate(
        values.vaccinationDate.format("YYYY-MM-DD"), 
        studentBirthDate
      );
      if (!vaccinationValidation.isValid) {
        message.error(vaccinationValidation.error);
        return;
      }

      const formData = new FormData();
      formData.append("vaccineName", values.vaccineName);
      formData.append(
        "vaccinationDate",
        values.vaccinationDate.format("YYYY-MM-DD")
      );
      formData.append("provider", values.provider);
      if (values.notes) formData.append("notes", values.notes);

      // Lấy file đúng cách từ fileList của Ant Design Upload
      const fileObj =
        values.proofFile &&
        values.proofFile[0] &&
        values.proofFile[0].originFileObj;
      if (fileObj) {
        formData.append("proofFile", fileObj);
      } else {
        message.error("Vui lòng upload file bằng chứng tiêm chủng!");
        return;
      }

      if (vaccineModalMode === "add") {
        await addStudentVaccination(selectedStudent.id, formData);
        message.success("Thêm thông tin tiêm chủng thành công");
      } else {
        await updateStudentVaccination(
          selectedVaccination.studentVaccinationId,
          formData
        );
        message.success("Cập nhật thông tin tiêm chủng thành công");
      }
      setVaccineModalVisible(false);
      if (selectedStudent) {
        fetchVaccinations(
          selectedStudent.id,
          vaccPagination.page,
          vaccPagination.size
        );
      }
      // Refresh dữ liệu tất cả tiêm chủng
      fetchAllVaccinations(allVaccPagination.page, allVaccPagination.size);
      fetchStats();
    } catch (err) {
      message.error("Thao tác thất bại");
    }
  };

  // Lọc danh sách học sinh theo tên
  const filteredStudents = Array.isArray(students)
    ? students.filter((s) =>
        s.fullName.toLowerCase().includes(searchText.toLowerCase())
      )
    : [];

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
      await updateVaccinationStatus(
        statusVaccination.studentVaccinationId,
        statusAction,
        approverNotes
      );
      setStatusModalVisible(false);
      setStatusVaccination(null);
      setApproverNotes("");
      if (selectedStudent) {
        fetchVaccinations(
          selectedStudent.id,
          vaccPagination.page,
          vaccPagination.size
        );
      }
      // Refresh dữ liệu tất cả tiêm chủng
      fetchAllVaccinations(allVaccPagination.page, allVaccPagination.size);
      fetchStats();
      // Refresh pending vaccinations
      fetchPendingVaccinations(pendingPagination.page, pendingPagination.size);
    } catch (err) {
      console.log(err);
    }
  };

  // Đặt vaccColumns vào đây để sử dụng được các hàm handle
  const isAdminOrNurse =
    user?.role === "Quản trị viên Trường học" ||
    user?.role === "Quản lý Nhân sự/Nhân viên" ||
    user?.role === "Nhân viên Y tế";
  const isNurse = user?.role === "Nhân viên Y tế";
  // Trong các columns (vaccColumns, allVaccColumns, pendingVaccColumns), chỉ hiển thị nút Duyệt/Từ chối nếu isNurse === true
  const vaccColumns = [
    { title: "Tên vắc xin", dataIndex: "vaccineName", key: "vaccineName" },
    {
      title: "Ngày tiêm",
      dataIndex: "vaccinationDate",
      key: "vaccinationDate",
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY") : "-"),
    },
    { title: "Nơi tiêm", dataIndex: "provider", key: "provider" },
    { title: "Ghi chú", dataIndex: "notes", key: "notes" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusMap = {
          PENDING: { text: "Chờ xử lý", color: "#faad14" },
          APPROVED: { text: "Đã duyệt", color: "#52c41a" },
          REJECTED: { text: "Từ chối", color: "#ff4d4f" },
        };
        const statusInfo = statusMap[status] || { text: status, color: "#666" };
        return (
          <span style={{ color: statusInfo.color, fontWeight: "bold" }}>
            {statusInfo.text}
          </span>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
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
            onConfirm={() =>
              handleDeleteVaccination(record.studentVaccinationId)
            }
            okText="Có"
            cancelText="Không"
          >
            <Button type="link" danger icon={<DeleteOutlined />} size="small">
              Xóa
            </Button>
          </Popconfirm>
          {isNurse &&
            (record.status === "PENDING" || record.status === "Chờ xử lý") && (
              <>
                <Button
                  type="link"
                  style={{ color: "#52c41a", fontWeight: 600 }}
                  onClick={() => handleOpenStatusModal(record, "APPROVE")}
                >
                  Duyệt
                </Button>
                <Button
                  type="link"
                  style={{ color: "#ff4d4f", fontWeight: 600 }}
                  onClick={() => handleOpenStatusModal(record, "REJECTED")}
                >
                  Từ chối
                </Button>
              </>
            )}
        </Space>
      ),
    },
  ];

  // Columns cho bảng tất cả tiêm chủng
  const allVaccColumns = [
    { title: "Tên vắc xin", dataIndex: "vaccineName", key: "vaccineName" },
    { 
      title: "Học sinh", 
      dataIndex: "studentFullName", 
      key: "studentFullName",
      render: (name, record) => (
        <div>
          <div>{name}</div>
          <small style={{ color: '#666' }}>Mã: {record.studentId}</small>
        </div>
      )
    },
    { title: "Lớp", dataIndex: "studentClassName", key: "studentClassName" },
    {
      title: "Ngày tiêm",
      dataIndex: "vaccinationDate",
      key: "vaccinationDate",
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY") : "-"),
    },
    { title: "Nơi tiêm", dataIndex: "provider", key: "provider" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusMap = {
          PENDING: { text: "Chờ xử lý", color: "#faad14" },
          APPROVED: { text: "Đã duyệt", color: "#52c41a" },
          REJECTED: { text: "Từ chối", color: "#ff4d4f" },
        };
        const statusInfo = statusMap[status] || { text: status, color: "#666" };
        return (
          <span style={{ color: statusInfo.color, fontWeight: "bold" }}>
            {statusInfo.text}
          </span>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
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
            onClick={() => handleViewFile(record.studentVaccinationId)}
            size="small"
            loading={fileLoading}
          >
            File
          </Button>
          {isAdminOrNurse && (
            <>
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
                onConfirm={() =>
                  handleDeleteVaccination(record.studentVaccinationId)
                }
                okText="Có"
                cancelText="Không"
              >
                <Button type="link" danger icon={<DeleteOutlined />} size="small">
                  Xóa
                </Button>
              </Popconfirm>
              {(record.status === "PENDING" || record.status === "Chờ xử lý") && (
                <>
                  <Button
                    type="link"
                    style={{ color: "#52c41a", fontWeight: 600 }}
                    onClick={() => handleOpenStatusModal(record, "APPROVE")}
                  >
                    Duyệt
                  </Button>
                  <Button
                    type="link"
                    style={{ color: "#ff4d4f", fontWeight: 600 }}
                    onClick={() => handleOpenStatusModal(record, "REJECTED")}
                  >
                    Từ chối
                  </Button>
                </>
              )}
            </>
          )}
        </Space>
      ),
    },
  ];

  // Columns cho bảng pending vaccinations
  const pendingVaccColumns = [
    { title: "Tên vắc xin", dataIndex: "vaccineName", key: "vaccineName" },
    { 
      title: "Học sinh", 
      dataIndex: "studentFullName", 
      key: "studentFullName",
      render: (name, record) => (
        <div>
          <div>{name}</div>
          <small style={{ color: '#666' }}>Mã: {record.studentId}</small>
        </div>
      )
    },
    { title: "Lớp", dataIndex: "studentClassName", key: "studentClassName" },
    {
      title: "Ngày tiêm",
      dataIndex: "vaccinationDate",
      key: "vaccinationDate",
      render: (date) => (date ? dayjs(date).format("DD/MM/YYYY") : "-"),
    },
    { title: "Nơi tiêm", dataIndex: "provider", key: "provider" },
    { title: "Ghi chú", dataIndex: "notes", key: "notes" },
    {
      title: "Hành động",
      key: "action",
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
            onClick={() => handleViewFile(record.studentVaccinationId)}
            size="small"
            loading={fileLoading}
          >
            File
          </Button>
          {isAdminOrNurse && (
            <>
              <Button
                type="link"
                style={{ color: "#52c41a", fontWeight: 600 }}
                onClick={() => handleOpenStatusModal(record, "APPROVE")}
              >
                Duyệt
              </Button>
              <Button
                type="link"
                style={{ color: "#ff4d4f", fontWeight: 600 }}
                onClick={() => handleOpenStatusModal(record, "REJECTED")}
              >
                Từ chối
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Tabs defaultActiveKey="students" onChange={(key) => {
        if (key === "all") {
          fetchAllVaccinations();
          fetchStats();
        } else if (key === "pending") {
          fetchPendingVaccinations();
        }
      }}>
        <TabPane tab="Quản lý theo học sinh" key="students">
          <h2>Danh sách học sinh</h2>
          <div
            style={{
              marginBottom: 24,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <Input
              placeholder="Tìm kiếm tên học sinh"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
              allowClear
              style={{
                width: 320,
                borderRadius: 24,
                padding: "6px 16px",
                fontSize: 16,
              }}
            />
          </div>
          <Table
            columns={studentColumns.map((col) =>
              col.key === "action"
                ? {
                    ...col,
                    render: (_, record) => (
                      <Button onClick={() => handleShowVaccination(record)}>
                        Xem tiêm chủng
                      </Button>
                    ),
                  }
                : col
            )}
            dataSource={filteredStudents}
            rowKey={(r) => r.id}
            loading={loadingStudents}
            pagination={false}
            locale={{ emptyText: "Không có dữ liệu học sinh" }}
          />
        </TabPane>

        <TabPane tab="Tất cả tiêm chủng" key="all">
          <div style={{ marginBottom: 24 }}>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={6}>
                <Card>
                  <Statistic title="Tổng số" value={stats.total} />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic title="Chờ xử lý" value={stats.pending} valueStyle={{ color: '#faad14' }} />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic title="Đã duyệt" value={stats.approved} valueStyle={{ color: '#52c41a' }} />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic title="Từ chối" value={stats.rejected} valueStyle={{ color: '#ff4d4f' }} />
                </Card>
              </Col>
            </Row>

            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 12, 
              marginBottom: 16,
              flexWrap: "wrap"
            }}>
              <Input
                placeholder="Tìm kiếm theo tên vaccine, học sinh..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                style={{ width: 300 }}
                onPressEnter={handleSearch}
              />
              <Select
                placeholder="Trạng thái"
                value={filters.status}
                onChange={(value) => handleFilterChange("status", value)}
                style={{ width: 150 }}
                allowClear
              >
                <Option value="PENDING">Chờ xử lý</Option>
                <Option value="APPROVED">Đã duyệt</Option>
                <Option value="REJECTED">Từ chối</Option>
              </Select>
              <Select
                placeholder="Học sinh"
                value={filters.studentId}
                onChange={(value) => handleFilterChange("studentId", value)}
                style={{ width: 200 }}
                allowClear
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {Array.isArray(students) && students.map(student => (
                  <Option key={student.id} value={student.id}>
                    {student.fullName} - {student.id}
                  </Option>
                ))}
              </Select>
              <Button type="primary" onClick={handleSearch} icon={<SearchOutlined />}>
                Tìm kiếm
              </Button>
              <Button onClick={handleResetFilters} icon={<ReloadOutlined />}>
                Làm mới
              </Button>
            </div>
          </div>

          <Table
            columns={allVaccColumns}
            dataSource={allVaccinations}
            rowKey={(r) => r.studentVaccinationId || r.id}
            loading={allVaccLoading}
            pagination={false}
            locale={{ emptyText: "Không có dữ liệu tiêm chủng" }}
          />
          <Pagination
            style={{ marginTop: 16, textAlign: "right" }}
            current={allVaccPagination.page + 1}
            pageSize={allVaccPagination.size}
            total={allVaccPagination.total}
            onChange={handleAllVaccPageChange}
            showSizeChanger
            pageSizeOptions={["10", "20", "50", "100"]}
          />
        </TabPane>

        <TabPane tab={`Chờ xử lý (${stats.pending})`} key="pending">
          <div style={{ marginBottom: 24 }}>
            <h2>Danh sách tiêm chủng chờ xử lý</h2>
            <p style={{ color: '#666', marginBottom: 16 }}>
              Có {stats.pending} bản ghi tiêm chủng đang chờ xử lý
            </p>
          </div>

          <Table
            columns={pendingVaccColumns}
            dataSource={pendingVaccinations}
            rowKey={(r) => r.studentVaccinationId || r.id}
            loading={pendingLoading}
            pagination={false}
            locale={{ emptyText: "Không có bản ghi chờ xử lý" }}
          />
          <Pagination
            style={{ marginTop: 16, textAlign: "right" }}
            current={pendingPagination.page + 1}
            pageSize={pendingPagination.size}
            total={pendingPagination.total}
            onChange={handlePendingPageChange}
            showSizeChanger
            pageSizeOptions={["10", "20", "50", "100"]}
          />
        </TabPane>
      </Tabs>

      <Drawer
        title={`Thông tin tiêm chủng: ${selectedStudent?.fullName || ""}`}
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
          rowKey={(r) => r.studentVaccinationId || r.id}
          loading={vaccLoading}
          pagination={false}
          locale={{ emptyText: "Không có dữ liệu tiêm chủng" }}
        />
        <Pagination
          style={{ marginTop: 16, textAlign: "right" }}
          current={vaccPagination.page + 1}
          pageSize={vaccPagination.size}
          total={vaccPagination.total}
          onChange={handleVaccPageChange}
          showSizeChanger
          pageSizeOptions={["5", "10", "20", "50"]}
        />
      </Drawer>

      {/* Modal thêm/sửa vaccine */}
      <Modal
        title={
          vaccineModalMode === "add"
            ? "Thêm thông tin tiêm chủng"
            : "Sửa thông tin tiêm chủng"
        }
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
            rules={[{ required: true, message: "Vui lòng nhập tên vắc xin" }]}
          >
            <Input placeholder="Nhập tên vắc xin" />
          </Form.Item>

          <Form.Item
            name="vaccinationDate"
            label={
              <span>
                Ngày tiêm chủng
                {selectedStudent && (
                  <span style={{ fontSize: '12px', color: '#666', fontWeight: 'normal', marginLeft: '8px' }}>
                    (Học sinh sinh ngày: {dayjs(selectedStudent.dateOfBirth).format('DD/MM/YYYY')})
                  </span>
                )}
              </span>
            }
            rules={[
              { required: true, message: "Vui lòng chọn ngày tiêm chủng" },
            ]}
            extra={
              selectedStudent ? (
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  <span>📅 Có thể chọn từ ngày sinh ({dayjs(selectedStudent.dateOfBirth).format('DD/MM/YYYY')}) đến ngày hiện tại</span>
                </div>
              ) : (
                <div style={{ fontSize: '12px', color: '#ff4d4f', marginTop: '4px' }}>
                  ⚠️ Vui lòng chọn học sinh trước khi chọn ngày tiêm chủng
                </div>
              )
            }
          >
            <DatePicker
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
              placeholder={
                selectedStudent 
                  ? `Chọn ngày từ ${dayjs(selectedStudent.dateOfBirth).format('DD/MM/YYYY')} đến hôm nay`
                  : "Vui lòng chọn học sinh trước"
              }
              disabledDate={(current) => {
                if (!current || !selectedStudent) return true;
                const birthDate = dayjs(selectedStudent.dateOfBirth);
                const today = dayjs();
                return current.isBefore(birthDate, 'day') || current.isAfter(today, 'day');
              }}
              allowClear={false}
              showToday={true}
              inputReadOnly={false}
            />
          </Form.Item>

          <Form.Item
            name="provider"
            label="Nơi tiêm chủng"
            rules={[
              { required: true, message: "Vui lòng nhập nơi tiêm chủng" },
            ]}
          >
            <Input placeholder="Nhập nơi tiêm chủng" />
          </Form.Item>

          <Form.Item name="notes" label="Ghi chú">
            <Input.TextArea rows={3} placeholder="Nhập ghi chú (nếu có)" />
          </Form.Item>

          <Form.Item
            name="proofFile"
            label="File bằng chứng *"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
            rules={[
              {
                required: true,
                message: "Vui lòng upload file bằng chứng tiêm chủng!",
              },
            ]}
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

          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Space>
              <Button onClick={() => setVaccineModalVisible(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                {vaccineModalMode === "add" ? "Thêm" : "Cập nhật"}
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
          </Button>,
        ]}
        width={600}
      >
        {vaccinationDetail && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <strong>Tên vắc xin:</strong> {vaccinationDetail.vaccineName}
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>Ngày tiêm:</strong>{" "}
              {vaccinationDetail.vaccinationDate
                ? dayjs(vaccinationDetail.vaccinationDate).format("DD/MM/YYYY")
                : "-"}
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>Nơi tiêm:</strong> {vaccinationDetail.provider}
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>Ghi chú:</strong> {vaccinationDetail.notes || "-"}
            </div>
            <div style={{ marginBottom: 16 }}>
              <strong>Trạng thái:</strong> {vaccinationDetail.status}
            </div>
            {vaccinationDetail.approvedByUserFullName && (
              <div style={{ marginBottom: 16 }}>
                <strong>Người duyệt:</strong>{" "}
                {vaccinationDetail.approvedByUserFullName}
              </div>
            )}
            {vaccinationDetail.approvedAt && (
              <div style={{ marginBottom: 16 }}>
                <strong>Ngày duyệt:</strong>{" "}
                {dayjs(vaccinationDetail.approvedAt).format("DD/MM/YYYY HH:mm")}
              </div>
            )}
            {vaccinationDetail.approverNotes && (
              <div style={{ marginBottom: 16 }}>
                <strong>Ghi chú duyệt:</strong>{" "}
                {vaccinationDetail.approverNotes}
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Modal duyệt trạng thái */}
      <Modal
        title={
          statusAction === "APPROVE" ? "Duyệt tiêm chủng" : "Từ chối tiêm chủng"
        }
        open={statusModalVisible}
        onCancel={() => setStatusModalVisible(false)}
        onOk={handleStatusSubmit}
        okText={statusAction === "APPROVE" ? "Duyệt" : "Từ chối"}
        cancelText="Hủy"
      >
        <div style={{ marginBottom: 12 }}>
          <strong>Ghi chú cho người duyệt (tùy chọn):</strong>
          <Input.TextArea
            value={approverNotes}
            onChange={(e) => setApproverNotes(e.target.value)}
            rows={3}
            maxLength={500}
            placeholder="Nhập ghi chú xác minh hoặc lý do từ chối (nếu có)"
          />
        </div>
      </Modal>

      {/* Modal xem file bằng chứng */}
      <Modal
        title="File bằng chứng tiêm chủng"
        open={fileModalVisible}
        onCancel={() => setFileModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setFileModalVisible(false)}>
            Đóng
          </Button>,
          <Button 
            key="download" 
            type="primary" 
            onClick={handleDownloadFile}
            disabled={!fileUrl}
          >
            Tải xuống
          </Button>,
        ]}
        width={800}
      >
        {fileUrl ? (
          <div style={{ textAlign: 'center' }}>
            <iframe
              src={fileUrl}
              style={{ width: '100%', height: '500px', border: 'none' }}
              title="File bằng chứng"
            />
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            {fileLoading ? (
              <div>Đang tải file...</div>
            ) : (
              <div>Không thể hiển thị file</div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudentVaccinationPage;
